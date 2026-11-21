import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, Save, Trash2, UploadCloud } from 'lucide-react'
import type { BrandDetails } from '../../data/portfolioRepository'
import type { DemoProject } from '../../data/projects'
import { removeMedia, uploadMedia } from '../../data/portfolioRepository'

type Props = {
  project: DemoProject
  brands: BrandDetails[]
  busy: boolean
  onCancel: () => void
  onSave: (project: DemoProject) => void
  onDelete?: () => void
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={`admin-field${wide ? ' field-wide' : ''}`}><span>{label}</span>{children}</label>
}

export default function ProjectEditor({ project: initialProject, brands, busy, onCancel, onSave, onDelete }: Props) {
  const [project, setProject] = useState(initialProject)
  const [uploading, setUploading] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  async function cancel() {
    const previous = [initialProject.videoSrc, initialProject.posterSrc, initialProject.captionSrc]
    const current = [project.videoSrc, project.posterSrc, project.captionSrc]
    try {
      for (let index = 0; index < current.length; index += 1) {
        if (current[index] !== previous[index]) await removeMedia(current[index])
      }
      onCancel()
    } catch (cause) {
      setError(`Could not clean up the unsaved upload: ${cause instanceof Error ? cause.message : 'unknown storage error'}`)
    }
  }

  function update<K extends keyof DemoProject>(key: K, value: DemoProject[K]) {
    setProject((current) => ({ ...current, [key]: value }))
  }

  async function upload(file: File | undefined, folder: 'videos' | 'posters' | 'captions', field: 'videoSrc' | 'posterSrc' | 'captionSrc') {
    if (!file) return
    const validType = folder === 'videos' ? ['video/mp4', 'video/webm'].includes(file.type)
      : folder === 'captions' ? file.type === 'text/vtt' || file.name.endsWith('.vtt')
        : ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    if (!validType) {
      setError(folder === 'videos' ? 'Choose an MP4 or WebM video.' : folder === 'captions' ? 'Choose a WebVTT (.vtt) caption file.' : 'Choose a JPEG, PNG, or WebP poster image.')
      return
    }
    if (file.size > 500 * 1024 * 1024) {
      setError('Files must be 500 MB or smaller.')
      return
    }
    setError('')
    setStatus('')
    setUploading(field)
    setUploadProgress(0)
    try {
      const url = await uploadMedia(file, folder, setUploadProgress)
      update(field, url as DemoProject[typeof field])
      setStatus(`${file.name} uploaded. Save the project to publish the change.`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : `Could not upload ${file.name}.`)
    } finally {
      setUploading('')
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({
      ...project,
      slug: project.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, ''),
    })
  }

  return (
    <form className="admin-editor" onSubmit={(event) => void submit(event)}>
      <div className="admin-editor-heading"><div><p className="eyebrow">{onDelete ? 'EDIT PROJECT' : 'NEW PROJECT'}</p><h2>{project.title || 'New project'}</h2></div><button className="admin-text-button" type="button" onClick={() => void cancel()}><ArrowLeft size={14} /> Back to list</button></div>
      <fieldset className="admin-fieldset" disabled={busy || Boolean(uploading)}>
      <div className="admin-fields-grid">
        <Field label="Project title"><input required value={project.title} onChange={(event) => update('title', event.target.value)} /></Field>
        <Field label="URL slug"><input required pattern="[a-z0-9-]+" value={project.slug} onChange={(event) => update('slug', event.target.value)} /></Field>
        <Field label="Primary brand">
          <select required value={project.brand} onChange={(event) => update('brand', event.target.value)}>
            {project.brand && !brands.some((brand) => brand.name === project.brand) && <option value={project.brand}>{project.brand} (unlisted)</option>}
            {brands.map((brand) => <option value={brand.name} key={brand.name}>{brand.name}</option>)}
          </select>
        </Field>
        <Field label="Associated brands"><input value={project.associatedBrands.join(', ')} onChange={(event) => update('associatedBrands', event.target.value.split(',').map((name) => name.trim()).filter(Boolean))} placeholder="Separate names with commas" /></Field>
        <Field label="Sector"><input required value={project.sector} onChange={(event) => update('sector', event.target.value)} /></Field>
        <Field label="Business category"><input value={project.businessCategory} onChange={(event) => update('businessCategory', event.target.value)} /></Field>
        <Field label="Language"><input required value={project.language} onChange={(event) => update('language', event.target.value)} /></Field>
        <Field label="Year"><input required type="number" min="1900" max="2200" value={project.year} onChange={(event) => update('year', Number(event.target.value))} /></Field>
        <Field label="Campaign type"><input required value={project.campaignType} onChange={(event) => update('campaignType', event.target.value)} /></Field>
        <Field label="Ad format"><input required value={project.adFormat} onChange={(event) => update('adFormat', event.target.value)} /></Field>
        <Field label="Platforms"><input value={project.platform.join(', ')} onChange={(event) => update('platform', event.target.value.split(',').map((name) => name.trim()).filter(Boolean))} placeholder="YouTube, Instagram…" /></Field>
        <Field label="Orientation"><select value={project.orientation} onChange={(event) => update('orientation', event.target.value as DemoProject['orientation'])}><option>Landscape</option><option>Vertical</option></select></Field>
        <Field label="Duration"><input value={project.duration} onChange={(event) => update('duration', event.target.value)} placeholder="00:30" /></Field>
        <Field label="Accent color"><input type="color" value={project.accentColor} onChange={(event) => update('accentColor', event.target.value)} /></Field>
        <Field label="Video URL" wide><input type="url" value={project.videoSrc ?? ''} onChange={(event) => update('videoSrc', event.target.value || null)} placeholder="Upload below or paste a public video URL" /></Field>
        <Field label="Upload video (MP4 / WebM)" wide>
          <span className="admin-upload-control"><input accept="video/mp4,video/webm" type="file" onChange={(event) => void upload(event.target.files?.[0], 'videos', 'videoSrc')} /><span><UploadCloud size={15} /> {uploading === 'videoSrc' ? `Uploading video… ${uploadProgress}%` : 'Choose video (up to 500 MB)'}</span></span>
          {project.videoSrc && <small className="admin-source-url">{project.videoSrc}</small>}
        </Field>
        <Field label="Poster URL" wide><input required value={project.posterSrc} onChange={(event) => update('posterSrc', event.target.value)} placeholder="/images/posters/your-poster.webp" /></Field>
        <Field label="Upload poster (JPEG / PNG / WebP)" wide>
          <span className="admin-upload-control"><input accept="image/jpeg,image/png,image/webp" type="file" onChange={(event) => void upload(event.target.files?.[0], 'posters', 'posterSrc')} /><span><UploadCloud size={15} /> {uploading === 'posterSrc' ? `Uploading image… ${uploadProgress}%` : 'Choose poster'}</span></span>
        </Field>
        <Field label="Captions URL (.vtt)" wide><input value={project.captionSrc ?? ''} onChange={(event) => update('captionSrc', event.target.value || null)} placeholder="Optional WebVTT captions URL" /></Field>
        <Field label="Upload captions (.vtt)" wide>
          <span className="admin-upload-control"><input accept=".vtt,text/vtt" type="file" onChange={(event) => void upload(event.target.files?.[0], 'captions', 'captionSrc')} /><span><UploadCloud size={15} /> {uploading === 'captionSrc' ? `Uploading captions… ${uploadProgress}%` : 'Choose caption file'}</span></span>
        </Field>
        <Field label="Creative summary" wide><textarea required rows={4} value={project.description} onChange={(event) => update('description', event.target.value)} /></Field>
        <Field label="Credits"><input value={project.credits.join(', ')} onChange={(event) => update('credits', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></Field>
        <Field label="Tags"><input value={project.tags.join(', ')} onChange={(event) => update('tags', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></Field>
        <label className="admin-checkbox field-wide"><input type="checkbox" checked={project.featured} onChange={(event) => update('featured', event.target.checked)} /><span>Show in featured work</span></label>
      </div>
      </fieldset>
      <label className="admin-checkbox admin-demo-toggle"><input type="checkbox" checked={project.isDemo ?? true} disabled={busy || Boolean(uploading)} onChange={(event) => update('isDemo', event.target.checked)} /><span>Label this as fictional demo work</span></label>
      {status && <p className="admin-success" role="status">{status}</p>}
      {error && <p className="admin-error" role="alert">{error}</p>}
      <div className="admin-editor-actions">
        {onDelete && <button className="admin-danger-button" type="button" disabled={busy || Boolean(uploading)} onClick={onDelete}><Trash2 size={15} /> Delete project</button>}
        <button className="admin-secondary-button" type="button" disabled={busy || Boolean(uploading)} onClick={() => void cancel()}>Cancel</button>
        <button className="admin-primary-button" type="submit" disabled={busy || Boolean(uploading)}><Save size={15} /> {busy ? 'Saving…' : 'Save project'}</button>
      </div>
    </form>
  )
}
