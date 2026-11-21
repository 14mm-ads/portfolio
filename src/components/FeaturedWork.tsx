import { ArrowUpRight } from 'lucide-react'
import type { DemoProject } from '../data/projects'
import ProjectCard from './ProjectCard'

type Props = { onBrandClick: (brand: string) => void; projects: DemoProject[] }

export default function FeaturedWork({ onBrandClick, projects }: Props) {
  const featuredProjects = projects.filter((project) => project.featured)

  return (
    <section className="featured-section" aria-labelledby="featured-heading">
      <div className="featured-heading">
        <div>
          <p className="eyebrow">A FEW FIRST FRAMES</p>
          <h2 id="featured-heading">In the <em>spotlight.</em></h2>
        </div>
        <a href="#archive">Explore all work <ArrowUpRight size={15} /></a>
      </div>
      <div className="featured-grid">
        {featuredProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onBrandClick={onBrandClick}
          />
        ))}
      </div>
    </section>
  )
}
