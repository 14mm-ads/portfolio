import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { siteConfig } from '../config/site'
import BrandMark from './BrandMark'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandMark />
        <span className="archive-label">A CREATIVE SCREENING ROOM <i /></span>
        <nav className={menuOpen ? 'primary-nav nav-open' : 'primary-nav'} aria-label="Main navigation">
          <Link to="/#archive">The archive</Link>
          <Link to="/#brands">Brand index</Link>
          <a className="nav-contact" href={`mailto:${siteConfig.contact.email}`}>
            Start a conversation <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}
