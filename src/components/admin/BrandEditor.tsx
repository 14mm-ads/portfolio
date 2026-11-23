import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, Save, Trash2, UploadCloud } from 'lucide-react'
import type { BrandDetails } from '../../data/portfolioRepository'
import { removeMedia, uploadMedia } from '../../data/portfolioRepository'

type Props = {
  brand: BrandDetails
  sectorOptions: string[]
  busy: boolean
  onCancel: () => void
  onSave: (brand: BrandDetails) => void
  onDelete?: () => void
}

export default function BrandEditor({ brand: initialBrand, sectorOptions, busy, onCancel, onSave, onDelete }: Props) {
  const [brand, setBrand] = useState(initialBrand)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')

  async function cancel() {
    if (brand.logo_url !== initialBrand.logo_url) {
      try {
        await removeMedia(brand.logo_url)
      } catch (cause) {
        setError(`Could not clean up the unsaved logo: ${cause instanceof Error ? cause.message : 'unknown storage error'}`)
        return
      }
    }
    onCancel()
  }

  function update<K extends keyof BrandDetails>(key: K, value: BrandDetails[K]) {
    setBrand((current) => ({ ...current, [key]: value }))
  }

  async function uploadLogo(file: File | undefined) {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a JPEG, PNG, or WebP logo image.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Brand logos must be 20 MB or smaller.')
      return
    }
    setError('')
    setUploading(true)
    setUploadProgress(0)
    try {
      update('logo_url', await uploadMedia(file, 'posters', setUploadProgress))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not upload the brand logo.')
    } finally {
      setUploading(false)
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({ ...brand, name: brand.name.trim() })
  }

  return (
    <form className="admin-editor" onSubmit={(event) => void submit(event)}>
      <div className="admin-editor-heading"><div><p className="eyebrow">{onDelete ? 'EDIT BRAND' : 'NEW BRAND'}</p><h2>{brand.name || 'New brand'}</h2></div><button className="admin-text-button" type="button" onClick={() => void cancel()}><ArrowLeft size={14} /> Back to list</button></div>
      <fieldset className="admin-fieldset" disabled={busy || uploading}>
      <div className="admin-fields-grid">
        <label className="admin-field"><span>Brand name</span><input required maxLength={100} value={brand.name} onChange={(event) => update('name', event.target.value)} /></label>
        <label className="admin-field"><span>Sector</span>
          <select required value={brand.sector} onChange={(event) => update('sector', event.target.value)}>
            {!brand.sector && <option value="">Select sector</option>}
            {brand.sector && !sectorOptions.includes(brand.sector) && <option value={brand.sector}>{brand.sector} (existing)</option>}
            {sectorOptions.map((sector) => <option value={sector} key={sector}>{sector}</option>)}
          </select>
        </label>
        <label className="admin-field field-wide"><span>Tagline</span><input value={brand.tagline} onChange={(event) => update('tagline', event.target.value)} /></label>
        <label className="admin-field field-wide"><span>Brand description</span><textarea rows={4} value={brand.description} onChange={(event) => update('description', event.target.value)} /></label>
        <label className="admin-field field-wide"><span>Website URL</span><input type="url" value={brand.website_url} onChange={(event) => update('website_url', event.target.value)} placeholder="https://" /></label>
        <label className="admin-field"><span>Brand accent color</span><input type="color" value={brand.accent_color || '#8ab3aa'} onChange={(event) => update('accent_color', event.target.value)} /></label>
        <label className="admin-field field-wide"><span>Logo URL</span><input type="url" value={brand.logo_url ?? ''} onChange={(event) => update('logo_url', event.target.value || null)} placeholder="Upload below or paste a public image URL" /></label>
        <label className="admin-field field-wide"><span>Upload brand logo (JPEG / PNG / WebP)</span>
          <span className="admin-upload-control"><input accept="image/jpeg,image/png,image/webp" type="file" onChange={(event) => void uploadLogo(event.target.files?.[0])} /><span><UploadCloud size={15} /> {uploading ? `Uploading logo… ${uploadProgress}%` : 'Choose logo image'}</span></span>
        </label>
      </div>
      </fieldset>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <div className="admin-editor-actions">
        {onDelete && <button className="admin-danger-button" type="button" disabled={busy || uploading} onClick={onDelete}><Trash2 size={15} /> Delete brand</button>}
        <button className="admin-secondary-button" type="button" disabled={busy || uploading} onClick={() => void cancel()}>Cancel</button>
        <button className="admin-primary-button" type="submit" disabled={busy || uploading}><Save size={15} /> {busy ? 'Saving…' : 'Save brand'}</button>
      </div>
    </form>
  )
}
