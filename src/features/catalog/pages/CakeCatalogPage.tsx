import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCakes } from '../../../api/cakes'
import { fetchCategories } from '../../../api/categories'
import { CatalogHero } from '../components/CatalogHero'
import { SearchBar } from '../components/SearchBar'
import { CategoryFilter } from '../components/CategoryFilter'
import { CakeGrid } from '../components/CakeGrid'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'

export const CakeCatalogPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  // Fetch categories
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  })

  // Fetch cakes with query parameters for re-querying backend
  const {
    data: cakes = [],
    isLoading: isCakesLoading,
    isError: isCakesError,
    isFetching: isCakesFetching,
    refetch: refetchCakes,
  } = useQuery({
    queryKey: ['cakes', { search, categoryId: selectedCategoryId }],
    queryFn: () =>
      fetchCakes({
        search,
        categoryId: selectedCategoryId,
      }),
  })

  // Category ID to Name mapping for fast lookups
  const categoryMap = useMemo(() => {
    const map: Record<number, string> = {}
    categories.forEach((cat) => {
      map[cat.id] = cat.name
    })
    return map
  }, [categories])

  // Filtered cakes
  const filteredCakes = useMemo(() => {
    return cakes.filter((cake) => {
      if (selectedCategoryId !== null && cake.categoryId !== selectedCategoryId) {
        return false
      }
      if (search.trim() !== '') {
        const query = search.toLowerCase().trim()
        const nameMatch = cake.name.toLowerCase().includes(query)
        const descMatch = cake.description?.toLowerCase().includes(query)
        if (!nameMatch && !descMatch) {
          return false
        }
      }
      return true
    })
  }, [cakes, selectedCategoryId, search])

  const handleResetFilters = () => {
    setSearch('')
    setSelectedCategoryId(null)
  }

  const handleRetry = () => {
    refetchCakes()
    refetchCategories()
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Bakery Storefront Hero Banner */}
        <CatalogHero />

        {/* Search & Category Filter Section */}
        <section className="space-y-4 mb-8 bg-white/60 backdrop-blur-xs p-4 sm:p-6 rounded-2xl border border-[#F3E5E3] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 max-w-lg">
              <SearchBar value={search} onChange={setSearch} />
            </div>

            {/* Results count indicator */}
            <div className="text-xs font-semibold text-[#8C6057]">
              Showing <span className="text-[#D86A78] font-bold">{filteredCakes.length}</span> cakes
            </div>
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            isLoading={isCategoriesLoading}
          />
        </section>

        {/* Cake Cards Grid */}
        <section className="mb-12">
          <CakeGrid
            cakes={filteredCakes}
            isLoading={isCakesLoading}
            isError={isCakesError}
            isFetching={isCakesFetching}
            categoryMap={categoryMap}
            onResetFilters={handleResetFilters}
            onRetry={handleRetry}
          />
        </section>
      </main>

      <Footer />
    </div>
  )
}
