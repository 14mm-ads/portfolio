import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'
import BrandMark from './BrandMark'

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-top">
        <div>
          <p className="eyebrow">HAVE A STORY WORTH SCREENING?</p>
          <a className="footer-headline" href={`mailto:${siteConfig.contact.email}`}>
            Let’s talk <span>frames.</span><ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div className="footer-actions" aria-label="Contact options">
          <a href={`mailto:${siteConfig.contact.email}`}>Email the studio <ArrowUpRight size={16} /></a>
          <a href={`tel:${siteConfig.contact.phoneLink}`}>Call {siteConfig.contact.phone} <ArrowUpRight size={16} /></a>
          <a href={siteConfig.contact.whatsappLink} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={16} /></a>
          <a href={siteConfig.contact.instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={16} /></a>
          <a href={siteConfig.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={16} /></a>
          <a href={siteConfig.contact.website} target="_blank" rel="noreferrer">Main website <ArrowUpRight size={16} /></a>
        </div>
      </div>
      <div className="footer-bottom">
        <BrandMark />
        <span>{siteConfig.location}</span>
        <span>© {new Date().getFullYear()} {siteConfig.agencyName}</span>
        <Link to="/admin">Studio portal</Link>
      </div>
    </footer>
  )
}
