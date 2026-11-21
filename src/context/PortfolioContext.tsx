import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { projects as demoProjects } from '../data/projects'
import { brands as demoBrands } from '../data/brands'
import { fetchPortfolio } from '../data/portfolioRepository'
import type { BrandDetails } from '../data/portfolioRepository'
import type { DemoProject } from '../data/projects'
import { supabaseConfigured } from '../lib/supabase'

type PortfolioState = {
  projects: DemoProject[]
  brands: BrandDetails[]
  loading: boolean
  error: string
  refresh: () => Promise<void>
}

const PortfolioContext = createContext<PortfolioState | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState(demoProjects)
  const [brands, setBrands] = useState<BrandDetails[]>(demoBrands.map((name, index) => ({
    name, logo_url: null, tagline: '', description: '', sector: '',
    website_url: '', accent_color: ['#8ab3aa', '#d19a74', '#ab9cc7', '#b2a66c'][index % 4],
  })))
  const [loading, setLoading] = useState(supabaseConfigured)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!supabaseConfigured) return
    setLoading(true)
    setError('')
    try {
      const portfolio = await fetchPortfolio()
      setProjects(portfolio.projects)
      setBrands(portfolio.brands)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load portfolio content from Supabase.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const value = useMemo(() => ({ projects, brands, loading, error, refresh }), [projects, brands, loading, error, refresh])
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const value = useContext(PortfolioContext)
  if (!value) throw new Error('usePortfolio must be used inside PortfolioProvider.')
  return value
}
