import { ArrowUpRight } from 'lucide-react'
import type { BrandDetails } from '../data/portfolioRepository'

type Props = {
  selectedBrand: string
  onSelect: (brand: string) => void
  brands: BrandDetails[]
  projectCount: number
  demoProjectCount: number
}

export default function BrandIndex({ selectedBrand, onSelect, brands, projectCount, demoProjectCount }: Props) {
  return (
    <section className="brand-index" id="brands" aria-labelledby="brand-heading">
      <div className="brand-index-heading">
        <div>
          <p className="eyebrow">THE BRAND INDEX</p>
          <h2 id="brand-heading">Names in the <em>frame.</em></h2>
        </div>
        <p>{projectCount} films · {brands.length} brands<br />{demoProjectCount ? `${demoProjectCount} fictional demo projects` : 'in this portfolio archive.'}</p>
      </div>
      <div className="brand-rail">
        <button className={`brand-tile${selectedBrand === '' ? ' brand-active' : ''}`} type="button" onClick={() => onSelect('')}>
          <span className="brand-placeholder all-brands">ALL</span><span>All projects</span>
        </button>
        {brands.map((brand, index) => (
          <button
            className={`brand-tile${selectedBrand === brand.name ? ' brand-active' : ''}`}
            type="button"
            key={brand.name}
            onClick={() => onSelect(brand.name)}
            aria-pressed={selectedBrand === brand.name}
          >
            <span className="brand-placeholder" style={{ '--brand-accent': ['#8ab3aa', '#d19a74', '#ab9cc7', '#b2a66c'][index % 4] } as React.CSSProperties}>
              {brand.logo_url
                ? <img src={brand.logo_url} alt="" loading="lazy" />
                : String(index + 1).padStart(2, '0')}
            </span>
            <span className="brand-tile-copy">
              <span>{brand.name}</span>
              {(brand.tagline || brand.sector) && <small>{brand.tagline || brand.sector}</small>}
            </span>
            <ArrowUpRight className="brand-tile-arrow" size={13} />
          </button>
        ))}
      </div>
    </section>
  )
}
