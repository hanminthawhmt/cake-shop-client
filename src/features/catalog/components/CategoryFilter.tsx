import React from 'react'
import type { Category } from '../../../types/cake'
import { Utensils } from 'lucide-react'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategoryId: number | null
  onSelectCategory: (id: number | null) => void
  isLoading?: boolean
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  isLoading = false,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
        {/* All Cakes Pill */}
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            selectedCategoryId === null
              ? 'bg-[#4A2E2B] text-white shadow-md shadow-[#4A2E2B]/15'
              : 'bg-white text-[#6E4E46] border border-[#EFE2E0] hover:bg-[#FDF6F7] hover:border-[#F3D1D5]'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>All Cakes</span>
        </button>

        {/* Loading Skeletons for Categories */}
        {isLoading && (
          <>
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="shrink-0 h-8 w-24 bg-gray-200/70 animate-pulse rounded-full"
              />
            ))}
          </>
        )}

        {/* Dynamic Category Pills */}
        {!isLoading &&
          categories.map((category) => {
            const isSelected = selectedCategoryId === category.id
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#D86A78] text-white shadow-md shadow-[#D86A78]/20'
                    : 'bg-white text-[#6E4E46] border border-[#EFE2E0] hover:bg-[#FDF6F7] hover:border-[#F3D1D5]'
                }`}
              >
                {category.name}
              </button>
            )
          })}
      </div>
    </div>
  )
}
