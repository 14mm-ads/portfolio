import { projects } from './projects'

export const brands = [...new Set(projects.flatMap(({ brand, associatedBrands }) => [brand, ...associatedBrands]))]
  .sort((a, b) => a.localeCompare(b))
