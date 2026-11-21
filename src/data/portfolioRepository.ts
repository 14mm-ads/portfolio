import type { DemoProject } from './projects'
import { projects as demoProjects } from './projects'
import type { Json } from '../lib/database.types'
import { Upload } from 'tus-js-client'
import { supabase, supabaseAnonKey, supabaseUrl } from '../lib/supabase'

export type BrandDetails = {
  name: string
  logo_url: string | null
  tagline: string
  description: string
  sector: string
  website_url: string
  accent_color: string
}

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured. Add the required VITE_SUPABASE values and restart the site.')
  return supabase
}

export function initialBrandDetails(): BrandDetails[] {
  const names = new Set(demoProjects.flatMap(({ brand, associatedBrands }) => [brand, ...associatedBrands]))
  return [...names].sort((a, b) => a.localeCompare(b)).map((name, index) => ({
    name,
    logo_url: null,
    tagline: '',
    description: '',
    sector: demoProjects.find((project) => project.brand === name)?.sector ?? '',
    website_url: '',
    accent_color: ['#8ab3aa', '#d19a74', '#ab9cc7', '#b2a66c'][index % 4],
  }))
}

export async function fetchPortfolio() {
  const client = requireSupabase()
  const [projectResult, brandResult] = await Promise.all([
    client.from('projects').select('data').order('created_at'),
    client.from('brands').select('name,logo_url,tagline,description,sector,website_url,accent_color').order('name'),
  ])
  if (projectResult.error) throw projectResult.error
  if (brandResult.error) throw brandResult.error
  return {
    projects: projectResult.data.map((row) => row.data as unknown as DemoProject),
    brands: brandResult.data,
  }
}

export async function saveProject(project: DemoProject) {
  const { error } = await requireSupabase().from('projects').upsert({
    id: project.id,
    slug: project.slug,
    data: project as unknown as Json,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}

export async function deleteProject(id: string) {
  const { error } = await requireSupabase().from('projects').delete().eq('id', id)
  if (error) throw error
}

export async function saveBrand(brand: BrandDetails, previousName?: string) {
  const client = requireSupabase()
  const { error: saveError } = await client.from('brands').upsert({
    ...brand,
    updated_at: new Date().toISOString(),
  })
  if (saveError) throw saveError

  if (previousName && previousName !== brand.name) {
    const { data, error: readError } = await client.from('projects').select('data')
    if (readError) throw readError
    const changed = data.flatMap(({ data: raw }) => {
      const project = raw as unknown as DemoProject
      const updated: DemoProject = {
        ...project,
        brand: project.brand === previousName ? brand.name : project.brand,
        associatedBrands: project.associatedBrands.map((name) => name === previousName ? brand.name : name),
      }
      return JSON.stringify(project) === JSON.stringify(updated) ? [] : [updated]
    })
    for (const project of changed) await saveProject(project)
    const { error: deleteError } = await client.from('brands').delete().eq('name', previousName)
    if (deleteError) throw deleteError
  }
}

export async function deleteBrand(name: string) {
  const { error } = await requireSupabase().from('brands').delete().eq('name', name)
  if (error) throw error
}

export async function seedDemoContent() {
  const client = requireSupabase()
  const { error: brandError } = await client.from('brands').upsert(initialBrandDetails())
  if (brandError) throw brandError
  const { error: projectError } = await client.from('projects').upsert(demoProjects.map((project) => ({
    id: project.id,
    slug: project.slug,
    data: project as unknown as Json,
  })))
  if (projectError) throw projectError
}

export async function uploadMedia(
  file: File,
  folder: 'videos' | 'posters' | 'captions',
  onProgress?: (percent: number) => void,
) {
  const client = requireSupabase()
  const anonKey = supabaseAnonKey
  const projectUrl = supabaseUrl
  if (!anonKey || !projectUrl) throw new Error('Supabase upload configuration is incomplete.')
  const { data: { session }, error: sessionError } = await client.auth.getSession()
  if (sessionError) throw sessionError
  if (!session) throw new Error('Sign in to the admin portal before uploading media.')
  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
  const contentType = file.type || (folder === 'captions' ? 'text/vtt'
    : folder === 'videos' ? (extension === 'webm' ? 'video/webm' : 'video/mp4')
      : extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg')
  const safeName = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '').slice(0, 48)
  const path = `${folder}/${crypto.randomUUID()}-${safeName || 'asset'}.${extension}`
  const publicUrl = client.storage.from('campaign-media').getPublicUrl(path).data.publicUrl

  await new Promise<void>((resolve, reject) => {
    const upload = new Upload(file, {
      endpoint: `${projectUrl.replace(/\/$/, '')}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${session.access_token}`,
        apikey: anonKey,
        'x-upsert': 'false',
      },
      metadata: {
        bucketName: 'campaign-media',
        objectName: path,
        contentType,
        cacheControl: '31536000',
      },
      chunkSize: 6 * 1024 * 1024,
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      onProgress: (sent, total) => onProgress?.(Math.floor((sent / total) * 100)),
      onError: reject,
      onSuccess: () => resolve(),
    })
    upload.start()
  })
  return publicUrl
}

export async function removeMedia(publicUrl: string | null | undefined) {
  if (!publicUrl || !supabase) return
  const marker = '/storage/v1/object/public/campaign-media/'
  const index = publicUrl.indexOf(marker)
  if (index < 0) return
  const path = decodeURIComponent(publicUrl.slice(index + marker.length))
  const { error } = await supabase.storage.from('campaign-media').remove([path])
  if (error) throw error
}
