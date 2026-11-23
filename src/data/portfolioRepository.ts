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

export const PORTFOLIO_OPTION_FIELDS = {
  sector: 'Sector',
  businessCategory: 'Business category',
  campaignType: 'Campaign type',
  adFormat: 'Ad format',
  language: 'Language',
  platform: 'Platform',
  orientation: 'Orientation',
  tags: 'Tags',
} as const

export type PortfolioOptionField = keyof typeof PORTFOLIO_OPTION_FIELDS
export type PortfolioOption = {
  id: string
  field: PortfolioOptionField
  value: string
  created_at: string
}
export type ChangeLogEntry = {
  id: number
  created_at: string
  actor_user_id: string | null
  actor_name: string | null
  actor_email: string | null
  entity_type: string
  entity_key: string
  entity_label: string
  action: string
  before_record: Json | null
  after_record: Json | null
}

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured. Add the required VITE_SUPABASE values and restart the site.')
  return supabase
}

export async function fetchPortfolioOptions() {
  const { data, error } = await requireSupabase()
    .from('portfolio_options')
    .select('*')
    .order('field')
    .order('value')
  if (error) throw error
  return data as PortfolioOption[]
}

export async function addPortfolioOption(field: PortfolioOptionField, value: string) {
  const { error } = await requireSupabase().from('portfolio_options').insert({ field, value: value.trim() })
  if (error) throw error
}

export async function renamePortfolioOption(id: string, value: string) {
  const { error } = await requireSupabase().from('portfolio_options').update({ value: value.trim() }).eq('id', id)
  if (error) throw error
}

export async function deletePortfolioOption(id: string) {
  const { error } = await requireSupabase().from('portfolio_options').delete().eq('id', id)
  if (error) throw error
}

export async function fetchChangeLog() {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const client = requireSupabase()
  const entries: ChangeLogEntry[] = []
  const pageSize = 1000
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await client
      .from('change_log')
      .select('*')
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)
    if (error) throw error
    entries.push(...data)
    if (data.length < pageSize) return entries
  }
}

export function createFirstFramePoster(videoFile: File) {
  const source = URL.createObjectURL(videoFile)
  const video = document.createElement('video')
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'

  return new Promise<File>((resolve, reject) => {
    let timeout = 0
    let finished = false
    const finish = (error?: Error, poster?: File) => {
      if (finished) return
      finished = true
      window.clearTimeout(timeout)
      video.removeAttribute('src')
      video.load()
      URL.revokeObjectURL(source)
      if (error) reject(error)
      else if (poster) resolve(poster)
      else reject(new Error('Could not create a poster from the first video frame.'))
    }

    timeout = window.setTimeout(() => finish(new Error('Could not decode the first video frame in time.')), 20000)
    video.addEventListener('error', () => finish(new Error('Could not read the uploaded video to create its poster.')), { once: true })
    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      if (!canvas.width || !canvas.height) {
        finish(new Error('The uploaded video has no readable first frame.'))
        return
      }
      const context = canvas.getContext('2d')
      if (!context) {
        finish(new Error('This browser cannot create a poster image from the video.'))
        return
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        if (!blob) {
          finish(new Error('Could not encode the video poster image.'))
          return
        }
        finish(undefined, new File([blob], `${videoFile.name.replace(/\.[^.]+$/, '')}-poster.jpg`, { type: 'image/jpeg' }))
      }, 'image/jpeg', 0.9)
    }, { once: true })
    video.src = source
    video.load()
  })
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
