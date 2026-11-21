import { useState } from 'react'
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { filterFields, getOptions } from '../data/projects'
import type { DemoProject } from '../data/projects'

type Props = {
  filters: Record<string, string>
  search: string
  activeCount: number
  onFilterChange: (key: string, value: string) => void
  onSearchChange: (value: string) => void
  onClear: () => void
  projects: DemoProject[]
}

export default function FilterPanel({
  filters,
  search,
  activeCount,
  onFilterChange,
  onSearchChange,
  onClear,
  projects,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeFilters = Object.entries(filters).filter(([, value]) => Boolean(value))

  return (
    <div className="archive-tools" aria-label="Project search and filters">
      <div className="search-field">
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          aria-label="Search projects"
          placeholder="Search projects, platforms, formats"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {search && <button type="button" aria-label="Clear search" onClick={() => onSearchChange('')}><X size={15} /></button>}
      </div>
      <button
        className="mobile-filter-toggle"
        type="button"
        aria-expanded={mobileOpen}
        aria-controls="filter-options"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <SlidersHorizontal size={16} /> Filters
        {activeCount > 0 && <span className="filter-count">{activeCount}</span>}
        <ChevronDown className={mobileOpen ? 'chevron-open' : ''} size={15} />
      </button>
      <div id="filter-options" className={`filter-row${mobileOpen ? ' filter-row-open' : ''}`}>
        {filterFields.map(({ key, label }) => (
          <label className="filter-select" key={key}>
            <span className="sr-only">{label} filter</span>
            <select value={filters[key] ?? ''} onChange={(event) => onFilterChange(key, event.target.value)}>
              <option value="">All {label.toLowerCase()}</option>
              {getOptions(key, projects).map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </label>
        ))}
      </div>
      {activeFilters.length > 0 && (
        <div className="active-chips" aria-label="Active filters">
          {activeFilters.map(([key, value]) => {
            const label = filterFields.find((field) => field.key === key)?.label ?? key
            return (
              <button type="button" className="filter-chip" key={key} onClick={() => onFilterChange(key, '')}>
                {label}: {value}<X size={13} aria-hidden="true" />
              </button>
            )
          })}
          <button type="button" className="clear-filters" onClick={onClear}>Clear all <X size={13} /></button>
        </div>
      )}
    </div>
  )
}
