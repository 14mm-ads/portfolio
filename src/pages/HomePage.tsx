import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { matchesFilter } from '../data/projects'
import { siteConfig } from '../config/site'
import { usePortfolio } from '../context/PortfolioContext'
import BrandIndex from '../components/BrandIndex'
import FeaturedWork from '../components/FeaturedWork'
import FilterPanel from '../components/FilterPanel'
import ProjectCard from '../components/ProjectCard'
import ShowreelDialog from '../components/ShowreelDialog'
import SiteFooter from '../components/SiteFooter'

export default function HomePage() {
  const { projects, brands, loading, error } = usePortfolio()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [showreelOpen, setShowreelOpen] = useState(false)
  const [motionPaused, setMotionPaused] = useState(false)
  const reduceMotion = useReducedMotion()
  const filters = Object.fromEntries(searchParams.entries())
  const activeCount = Object.values(filters).filter(Boolean).length

  const visibleProjects = useMemo(() => projects.filter((project) => {
    const matches = Object.entries(filters).every(([key, value]) => !value || matchesFilter(project, key, value))
    const haystack = [
      project.title,
      project.brand,
      project.sector,
      project.businessCategory,
      project.language,
      project.campaignType,
      project.adFormat,
      project.associatedBrands.join(' '),
      project.platform.join(' '),
      project.orientation,
      project.year,
      ...project.tags,
    ].join(' ').toLowerCase()
    return matches && haystack.includes(search.trim().toLowerCase())
  }), [filters, search])

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  function clearFilters() {
    setSearch('')
    setSearchParams({}, { replace: true })
  }

  function selectBrand(brand: string) {
    setFilter('brand', brand)
    document.querySelector('#archive')?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' })
  }

  return (
    <>
      <main id="main-content">
        <section className={`hero${motionPaused || reduceMotion ? ' motion-paused' : ''}`} aria-labelledby="hero-title">
          <div className="hero-backdrop" aria-hidden="true">
            <div className="hero-orb hero-orb-one" />
            <div className="hero-orb hero-orb-two" />
            <div className="hero-grain" />
          </div>
          <div className="hero-content">
            <motion.p
              className="eyebrow hero-eyebrow"
              initial={reduceMotion || motionPaused ? false : { opacity: 0, y: 10 }}
              animate={motionPaused ? false : { opacity: 1, y: 0 }}
              transition={{ duration: .55 }}
            >
              <span className="eyebrow-dot" /> A CREATIVE SCREENING ROOM
            </motion.p>
            <motion.h1
              id="hero-title"
              initial={reduceMotion || motionPaused ? false : { opacity: 0, y: 22 }}
              animate={motionPaused ? false : { opacity: 1, y: 0 }}
              transition={{ duration: .7, delay: .08 }}
            >
              Made to <em>move.</em>
            </motion.h1>
            <motion.p
              className="hero-copy"
              initial={reduceMotion || motionPaused ? false : { opacity: 0, y: 12 }}
              animate={motionPaused ? false : { opacity: 1, y: 0 }}
              transition={{ duration: .6, delay: .18 }}
            >
              {siteConfig.tagline}
            </motion.p>
            <div className="hero-actions">
              <a className="hero-primary" href="#archive">Explore the work <ArrowDown size={16} /></a>
              <button className="hero-secondary" type="button" onClick={() => setShowreelOpen(true)}>
                <Play size={14} fill="currentColor" /> View showreel
              </button>
              <button
                className="motion-toggle"
                type="button"
                aria-pressed={motionPaused || Boolean(reduceMotion)}
                onClick={() => setMotionPaused((paused) => !paused)}
                title={motionPaused || reduceMotion ? 'Resume motion' : 'Pause motion'}
              >
                {motionPaused || reduceMotion ? <Play size={14} /> : <Pause size={14} />}
                <span>{motionPaused || reduceMotion ? 'Motion paused' : 'Pause motion'}</span>
              </button>
            </div>
          </div>
          <span className="hero-aside">14MM / CAMPAIGN ARCHIVE</span>
          <div className="hero-bottomline">
            <span>FILM · CAMPAIGN · CULTURE</span>
            <span>KOCHI · INDIA · EVERYWHERE</span>
            <a href="#archive" aria-label="Scroll to selected work"><ArrowDown size={17} /></a>
          </div>
        </section>

        <FeaturedWork projects={projects} onBrandClick={selectBrand} />

        <section className="archive-section" id="archive" aria-labelledby="archive-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-dot" />THE SCREENING ROOM</p>
              <h2 id="archive-heading">Selected <em>work.</em></h2>
            </div>
            <p className="section-intro">A growing collection of ideas made tangible.<br />Find your next favourite.</p>
          </div>

          <FilterPanel
            filters={filters}
            search={search}
            activeCount={activeCount}
            onFilterChange={setFilter}
            onSearchChange={setSearch}
            onClear={clearFilters}
            projects={projects}
          />

          <div className="archive-meta" aria-live="polite">
            <span>{String(visibleProjects.length).padStart(2, '0')} PROJECTS IN VIEW</span>
            {projects.some((project) => project.isDemo !== false) && <span className="demo-notice">FICTIONAL DEMO WORK</span>}
            {loading && <span>SYNCING ARCHIVE</span>}
            <span className="archive-meta-right">SELECT A PROJECT TO EXPLORE <ArrowDown size={13} /></span>
          </div>
          {error && <p className="archive-sync-error" role="status">Showing the demo archive because live content could not be loaded: {error}</p>}

          {visibleProjects.length > 0 ? (
            <div className="project-grid">
              {visibleProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} onBrandClick={selectBrand} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-mark" aria-hidden="true">?</span>
              <h3>Nothing in this frame.</h3>
              <p>Try another search or loosen the filters to find a match.</p>
              <button className="text-link" type="button" onClick={clearFilters}>Clear the archive <ArrowRight size={15} /></button>
            </div>
          )}
        </section>

        <BrandIndex
          selectedBrand={filters.brand ?? ''}
          onSelect={selectBrand}
          brands={brands}
          projectCount={projects.length}
          demoProjectCount={projects.filter((project) => project.isDemo !== false).length}
        />

        <section className="manifesto" id="about">
          <span className="manifesto-mark" aria-hidden="true">14</span>
          <div className="manifesto-copy">
            <p className="eyebrow">BEHIND EVERY FRAME</p>
            <h2>Good work doesn’t<br />sit <em>still.</em></h2>
          </div>
          <div className="manifesto-note">
            <p>From the first thought to the final frame, we make campaign work with care, character and a reason to exist.</p>
            <a className="text-link" href="#contact">Make something with us <ArrowUpRight size={16} /></a>
          </div>
          <span className="manifesto-index">14MM<br />CAMPAIGN ARCHIVE</span>
        </section>
      </main>
      <SiteFooter />
      <ShowreelDialog open={showreelOpen} onClose={() => setShowreelOpen(false)} />
    </>
  )
}
