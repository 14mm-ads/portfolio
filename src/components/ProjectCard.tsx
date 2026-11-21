import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DemoProject } from '../data/projects'
import { assetUrl } from '../lib/assetUrl'

type Props = {
  project: DemoProject
  index: number
  onBrandClick: (brand: string) => void
}

export default function ProjectCard({ project, index, onBrandClick }: Props) {
  const reduceMotion = useReducedMotion()
  const isVertical = project.orientation === 'Vertical'
  const isDemo = project.isDemo !== false

  return (
    <motion.article
      className={`project-card${project.featured ? ' project-featured' : ''}${isVertical ? ' is-vertical' : ''}`}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.4, delay: Math.min(index % 3, 2) * 0.055 }}
    >
      <Link className="project-image-link" to={`/work/${project.slug}`} aria-label={`Open ${isDemo ? 'demo ' : ''}project ${project.title} by ${project.brand}`}>
        <div className="project-image" style={{ '--project-accent': project.accentColor } as React.CSSProperties}>
          <img src={assetUrl(project.posterSrc)} alt={`${project.brand}, ${isDemo ? 'demo ' : ''}campaign poster: ${project.title}`} loading="lazy" />
          {isDemo && <span className="demo-label">DEMO PROJECT</span>}
          <span className="image-index">{String(index + 1).padStart(2, '0')}</span>
          <span className="image-play" aria-hidden="true"><Play size={15} fill="currentColor" /></span>
          <span className="image-cta">EXPLORE PROJECT <ArrowUpRight size={14} /></span>
        </div>
      </Link>
      <div className="project-caption">
        <div className="project-caption-main">
          <button className="project-brand" type="button" onClick={() => onBrandClick(project.brand)}>
            {project.brand} <span>·</span> {project.sector}
          </button>
          <Link to={`/work/${project.slug}`} className="project-title">{project.title}</Link>
          <div className="project-subline">
            <span>{project.language}</span><i /> <span>{project.year}</span><i /> <span>{project.campaignType}</span>
          </div>
        </div>
        <span className="project-arrow" aria-hidden="true"><ArrowUpRight size={19} /></span>
      </div>
    </motion.article>
  )
}
