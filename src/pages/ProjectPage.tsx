import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Link2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { usePortfolio } from '../context/PortfolioContext'
import { siteConfig } from '../config/site'
import ProjectCard from '../components/ProjectCard'
import VideoPlayer from '../components/VideoPlayer'
import SiteFooter from '../components/SiteFooter'

export default function ProjectPage() {
  const { projects } = usePortfolio()
  const { slug } = useParams()
  const navigate = useNavigate()
  const [linkCopied, setLinkCopied] = useState(false)
  const projectIndex = projects.findIndex((item) => item.slug === slug)
  const project = projects[projectIndex]
  const previous = projects[(projectIndex - 1 + projects.length) % projects.length]
  const next = projects[(projectIndex + 1) % projects.length]
  const related = project
    ? projects.filter((item) => item.id !== project.id && (item.sector === project.sector || item.businessCategory === project.businessCategory)).slice(0, 2)
    : []
  const isDemo = project?.isDemo !== false

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setLinkCopied(false)
  }, [slug])

  if (!project) {
    return (
      <>
        <main className="not-found" id="main-content">
          <p className="eyebrow">OUT OF FRAME</p>
          <h1>This project isn’t in the archive.</h1>
          <Link className="button-link" to="/"><ArrowLeft size={16} /> Back to the archive</Link>
        </main>
        <SiteFooter />
      </>
    )
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setLinkCopied(true)
      window.setTimeout(() => setLinkCopied(false), 2200)
    } catch {
      window.prompt('Copy this project link:', window.location.href)
    }
  }

  return (
    <>
      <main className="case-study" id="main-content">
        <div className="case-topline">
          <button className="back-link" type="button" onClick={() => navigate('/#archive')}><ArrowLeft size={15} /> BACK</button>
          <span>14MM / {isDemo ? 'DEMO ' : ''}CASE FILE</span>
          <button className="share-link" type="button" onClick={() => void copyLink()} aria-live="polite">
            {linkCopied ? <Check size={14} /> : <Link2 size={14} />}{linkCopied ? 'COPIED' : 'COPY LINK'}
          </button>
        </div>
        <div className="case-title-block">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" />{project.brand.toUpperCase()} <span className="case-divider">/</span> {project.adFormat.toUpperCase()}</p>
            <h1>{project.title}<span>.</span></h1>
            <p className="case-descriptor">{project.sector} <i /> {project.language} <i /> {project.year}</p>
          </div>
          <span className="case-number">{String(projectIndex + 1).padStart(2, '0')} <i>/</i> {String(projects.length).padStart(2, '0')}</span>
        </div>

        <VideoPlayer project={project} />
        <div className="case-details">
          <section className="case-about">
            <p className="eyebrow">THE PROJECT {isDemo && <span className="demo-notice">DEMO</span>}</p>
            <p>{project.description}</p>
            <div className="tag-list">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
          </section>
          <dl className="case-facts">
            <div><dt>Brand</dt><dd>{project.brand}</dd></div>
            <div><dt>Sector</dt><dd>{project.sector}</dd></div>
            <div><dt>Business category</dt><dd>{project.businessCategory}</dd></div>
            <div><dt>Language</dt><dd>{project.language}</dd></div>
            <div><dt>Campaign type</dt><dd>{project.campaignType}</dd></div>
            <div><dt>Ad format</dt><dd>{project.adFormat}</dd></div>
            <div><dt>Platforms</dt><dd>{project.platform.join(' · ')}</dd></div>
            <div><dt>Orientation / Duration</dt><dd>{project.orientation} · {project.duration}</dd></div>
            <div><dt>Year</dt><dd>{project.year}</dd></div>
            <div><dt>Credits</dt><dd>{project.credits.join(' · ')}</dd></div>
          </dl>
        </div>

        {related.length > 0 && (
          <section className="related-projects" aria-labelledby="related-heading">
            <div className="related-heading">
              <div><p className="eyebrow">KEEP EXPLORING</p><h2 id="related-heading">Related <em>work.</em></h2></div>
              <Link className="text-link" to="/#archive">All projects <ArrowUpRight size={15} /></Link>
            </div>
            <div className="project-grid">
              {related.map((item, index) => (
                <ProjectCard
                  key={item.id}
                  project={item}
                  index={index}
                  onBrandClick={(brand) => navigate(`/?brand=${encodeURIComponent(brand)}#archive`)}
                />
              ))}
            </div>
          </section>
        )}
        <nav className="project-navigation" aria-label="Project navigation">
          <Link to={`/work/${previous.slug}`} className="project-nav-link">
            <span><ArrowLeft size={14} /> PREVIOUS PROJECT</span><strong>{previous.title}</strong>
          </Link>
          <Link to={`/work/${next.slug}`} className="project-nav-link project-nav-next">
            <span>NEXT PROJECT <ArrowRight size={14} /></span><strong>{next.title}</strong>
          </Link>
        </nav>
        <a className="case-contact" href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(`Project enquiry inspired by ${project.title}`)}`}>
          Have a story worth screening? <span>Let’s talk <ArrowUpRight size={16} /></span>
        </a>
      </main>
      <SiteFooter />
    </>
  )
}
