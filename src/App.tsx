import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'
import AdminPage from './pages/AdminPage'
import SiteHeader from './components/SiteHeader'
import { siteConfig } from './config/site'
import { usePortfolio } from './context/PortfolioContext'

export default function App() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const { projects } = usePortfolio()

  useEffect(() => {
    const project = location.pathname.startsWith('/work/')
      ? projects.find((item) => item.slug === location.pathname.split('/').at(-1))
      : undefined
    const title = project
      ? `${project.title} — ${project.brand}${project.isDemo === false ? '' : ' Demo'} | ${siteConfig.agencyName}`
      : `${siteConfig.agencyName} — Campaign Archive`
    const description = project
      ? `${project.description}${project.isDemo === false ? '' : ` Fictional demo campaign for ${project.brand}.`}`
      : `${siteConfig.tagline}. A cinematic campaign archive by ${siteConfig.agencyName}. Explore fictional demo work across film, brand, and platform.`
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description)
    document.querySelector('link[rel="canonical"]')?.setAttribute(
      'href',
      `${siteConfig.canonicalUrl}${location.pathname}`,
    )
    if (location.hash) {
      requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({
        behavior: reduceMotion ? 'instant' : 'smooth',
      }))
    }
  }, [location.hash, location.pathname, projects, reduceMotion])

  return (
    <div className="app-shell">
      {location.pathname !== '/admin' && <SiteHeader />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: .2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/work/:slug" element={<ProjectPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<ProjectPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
