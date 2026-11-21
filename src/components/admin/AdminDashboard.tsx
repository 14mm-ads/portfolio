import { useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { ArrowLeft, LogOut, Plus, Search, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'
import { assetUrl } from '../../lib/assetUrl'
import { usePortfolio } from '../../context/PortfolioContext'
import type { BrandDetails } from '../../data/portfolioRepository'
import { deleteBrand, deleteProject, removeMedia, saveBrand, saveProject, seedDemoContent } from '../../data/portfolioRepository'
import type { DemoProject } from '../../data/projects'
import BrandEditor from './BrandEditor'
import ProjectEditor from './ProjectEditor'

type Props = { user: User; onSignOut: () => void }
type Tab = 'projects' | 'brands'

function newProject(brands: BrandDetails[]): DemoProject {
  return {
    id: crypto.randomUUID(),
    slug: `new-project-${Date.now()}`,
    title: 'New project',
    brand: brands[0]?.name ?? '',
    associatedBrands: [],
    brandLogo: '',
    sector: '',
    businessCategory: '',
    language: 'English',
    year: new Date().getFullYear(),
    campaignType: '',
    adFormat: '',
    platform: [],
    orientation: 'Landscape',
    duration: '',
    videoSrc: null,
    posterSrc: '',
    captionSrc: null,
    featured: false,
    isDemo: false,
    description: '',
    credits: [],
    tags: [],
    accentColor: '#8ab3aa',
  }
}

function newBrand(): BrandDetails {
  return { name: '', logo_url: null, tagline: '', description: '', sector: '', website_url: '', accent_color: '#8ab3aa' }
}

export default function AdminDashboard({ user, onSignOut }: Props) {
  const { projects, brands, loading, error, refresh } = usePortfolio()
  const [tab, setTab] = useState<Tab>('projects')
  const [project, setProject] = useState<DemoProject | null>(null)
  const [brand, setBrand] = useState<BrandDetails | null>(null)
  const [originalBrandName, setOriginalBrandName] = useState<string | undefined>()
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const [failure, setFailure] = useState('')
  const [busy, setBusy] = useState(false)

  const filteredProjects = useMemo(() => projects.filter((item) =>
    `${item.title} ${item.brand} ${item.sector}`.toLowerCase().includes(query.toLowerCase())), [projects, query])
  const filteredBrands = useMemo(() => brands.filter((item) =>
    `${item.name} ${item.sector}`.toLowerCase().includes(query.toLowerCase())), [brands, query])

  function announce(message: string, isError = false) {
    setNotice(isError ? '' : message)
    setFailure(isError ? message : '')
  }

  async function saveCurrentProject(value: DemoProject) {
    const previous = projects.find((item) => item.id === value.id)
    setBusy(true)
    announce('')
    try {
      await saveProject(value)
      await refresh()
      setProject(null)
      if (previous) {
        try {
          const oldMedia = [previous.videoSrc, previous.posterSrc, previous.captionSrc]
          const newMedia = [value.videoSrc, value.posterSrc, value.captionSrc]
          for (let index = 0; index < oldMedia.length; index += 1) {
            if (oldMedia[index] !== newMedia[index]) await removeMedia(oldMedia[index])
          }
        } catch (cause) {
          announce(`Project saved, but previous media cleanup failed: ${cause instanceof Error ? cause.message : 'unknown storage error'}`, true)
          return
        }
      }
      announce('Project saved.')
    } catch (cause) {
      announce(cause instanceof Error ? cause.message : 'Could not save the project.', true)
    } finally {
      setBusy(false)
    }
  }

  async function removeProject(value: DemoProject) {
    if (!window.confirm(`Delete “${value.title}” from the archive?`)) return
    setBusy(true)
    try {
      await deleteProject(value.id)
      await refresh()
      setProject(null)
      try {
        for (const url of [value.videoSrc, value.posterSrc, value.captionSrc]) await removeMedia(url)
      } catch (cause) {
        announce(`Project deleted, but media cleanup failed: ${cause instanceof Error ? cause.message : 'unknown storage error'}`, true)
        return
      }
      announce('Project deleted.')
    } catch (cause) {
      announce(cause instanceof Error ? cause.message : 'Could not delete the project.', true)
    } finally {
      setBusy(false)
    }
  }

  async function saveCurrentBrand(value: BrandDetails) {
    const previous = brands.find((item) => item.name === originalBrandName)
    setBusy(true)
    announce('')
    try {
      await saveBrand(value, originalBrandName)
      await refresh()
      setBrand(null)
      setOriginalBrandName(undefined)
      if (previous?.logo_url && previous.logo_url !== value.logo_url) {
        try {
          await removeMedia(previous.logo_url)
        } catch (cause) {
          announce(`Brand saved, but the previous logo could not be removed: ${cause instanceof Error ? cause.message : 'unknown storage error'}`, true)
          return
        }
      }
      announce('Brand details saved.')
    } catch (cause) {
      announce(cause instanceof Error ? cause.message : 'Could not save brand details.', true)
    } finally {
      setBusy(false)
    }
  }

  async function removeCurrentBrand(value: BrandDetails) {
    const linked = projects.some((item) => item.brand === value.name || item.associatedBrands.includes(value.name))
    if (linked) {
      announce('This brand is assigned to a project. Update those project records before deleting it.', true)
      return
    }
    if (!window.confirm(`Delete brand “${value.name}”?`)) return
    setBusy(true)
    try {
      await deleteBrand(value.name)
      await refresh()
      setBrand(null)
      try {
        await removeMedia(value.logo_url)
      } catch (cause) {
        announce(`Brand deleted, but its logo could not be removed: ${cause instanceof Error ? cause.message : 'unknown storage error'}`, true)
        return
      }
      announce('Brand deleted.')
    } catch (cause) {
      announce(cause instanceof Error ? cause.message : 'Could not delete the brand.', true)
    } finally {
      setBusy(false)
    }
  }

  async function loadDemoContent() {
    if (!window.confirm('Add the fictional demo projects and brands to this Supabase archive?')) return
    setBusy(true)
    try {
      await seedDemoContent()
      await refresh()
      announce('Demo projects and brands imported.')
    } catch (cause) {
      announce(cause instanceof Error ? cause.message : 'Could not import demo content.', true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="admin-dashboard" id="main-content">
      <header className="admin-topbar">
        <Link className="admin-wordmark" to="/" aria-label="Back to 14mm portfolio"><span>14</span>MM <i>STUDIO</i></Link>
        <div className="admin-user"><span>{user.email}</span><button type="button" onClick={onSignOut}><LogOut size={15} /> Sign out</button></div>
      </header>

      <div className="admin-content">
        <div className="admin-heading-row">
          <div><p className="eyebrow">PRIVATE CONTENT PORTAL</p><h1>Shape the <em>archive.</em></h1></div>
          <Link className="admin-back-link" to="/"><ArrowLeft size={15} /> View portfolio</Link>
        </div>
        <div className="admin-stats" aria-label="Archive totals">
          <div><strong>{projects.length}</strong><span>PROJECTS</span></div>
          <div><strong>{brands.length}</strong><span>BRANDS</span></div>
          <div><strong>PRIVATE</strong><span>ADMIN SESSION</span></div>
        </div>
        {error && <p className="admin-error" role="alert">{error}</p>}
        {notice && <p className="admin-success" role="status">{notice}</p>}
        {failure && <p className="admin-error" role="alert">{failure}</p>}

        <div className="admin-toolbar">
          <div className="admin-tabs" role="tablist" aria-label="Content type">
            <button role="tab" aria-selected={tab === 'projects'} className={tab === 'projects' ? 'is-active' : ''} onClick={() => { setTab('projects'); setProject(null); setBrand(null); setQuery('') }}>Projects</button>
            <button role="tab" aria-selected={tab === 'brands'} className={tab === 'brands' ? 'is-active' : ''} onClick={() => { setTab('brands'); setProject(null); setBrand(null); setQuery('') }}>Brands</button>
          </div>
          {!project && !brand && (
            <div className="admin-toolbar-actions">
              <label className="admin-search"><Search size={15} /><span className="sr-only">Search {tab}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${tab}`} /></label>
              <button className="admin-primary-button" type="button" onClick={() => tab === 'projects' ? setProject(newProject(brands)) : (setOriginalBrandName(undefined), setBrand(newBrand()))}><Plus size={15} /> Add {tab === 'projects' ? 'project' : 'brand'}</button>
            </div>
          )}
        </div>

        {loading && <p className="admin-loading">Refreshing archive…</p>}

        {project && (
          <ProjectEditor
            project={project}
            brands={brands}
            busy={busy}
            onCancel={() => setProject(null)}
            onSave={(value) => void saveCurrentProject(value)}
            onDelete={projects.some((item) => item.id === project.id) ? () => void removeProject(project) : undefined}
          />
        )}

        {brand && (
          <BrandEditor
            brand={brand}
            busy={busy}
            onCancel={() => { setBrand(null); setOriginalBrandName(undefined) }}
            onSave={(value) => void saveCurrentBrand(value)}
            onDelete={originalBrandName ? () => void removeCurrentBrand(brand) : undefined}
          />
        )}

        {!project && !brand && tab === 'projects' && (
          projects.length === 0
            ? <div className="admin-empty"><UploadCloud size={24} /><h2>Your archive is ready.</h2><p>Add a project, or import the 30 fictional demo projects and 50 sample brands.</p><button className="admin-secondary-button" disabled={busy} onClick={() => void loadDemoContent()}>Import demo archive</button></div>
            : <div className="admin-table">
              {filteredProjects.map((item) => (
                <button className="admin-project-row" key={item.id} onClick={() => setProject(item)}>
                  <img src={assetUrl(item.posterSrc)} alt="" loading="lazy" />
                  <span className="admin-row-title"><strong>{item.title}</strong><small>{item.brand} · {item.sector}</small></span>
                  <span className="admin-row-detail">{item.orientation} · {item.year}</span>
                  <span className={`admin-pill${item.videoSrc ? ' has-media' : ''}`}>{item.videoSrc ? 'VIDEO LINKED' : 'NO VIDEO'}</span>
                </button>
              ))}
              {filteredProjects.length === 0 && <p className="admin-empty-note">No projects match this search.</p>}
            </div>
        )}

        {!project && !brand && tab === 'brands' && (
          <div className="admin-brand-grid">
            {filteredBrands.map((item) => {
              const linkedCount = projects.filter((entry) => entry.brand === item.name || entry.associatedBrands.includes(item.name)).length
              return (
                <button className="admin-brand-card" key={item.name} onClick={() => { setOriginalBrandName(item.name); setBrand(item) }}>
                  <span className="admin-brand-logo" style={{ '--brand-accent': item.accent_color } as React.CSSProperties}>
                    {item.logo_url ? <img src={item.logo_url} alt="" /> : item.name.slice(0, 2).toUpperCase()}
                  </span>
                  <strong>{item.name}</strong>
                  <small>{linkedCount} linked projects</small>
                </button>
              )
            })}
            {filteredBrands.length === 0 && <p className="admin-empty-note">No brands match this search.</p>}
          </div>
        )}
      </div>
    </main>
  )
}
