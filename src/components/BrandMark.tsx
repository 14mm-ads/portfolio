import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'

export default function BrandMark() {
  return (
    <Link className="brand" to="/" aria-label={`${siteConfig.agencyName} home`}>
      {siteConfig.logoPath ? (
        <img className="brand-logo" src={siteConfig.logoPath} alt="" />
      ) : (
        <span className="brand-icon" aria-hidden="true">14</span>
      )}
      <span className="brand-name">
        {siteConfig.agencyName}<span>CAMPAIGN ARCHIVE</span>
      </span>
    </Link>
  )
}
