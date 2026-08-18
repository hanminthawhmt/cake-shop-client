import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search cakes by name or description...',
}) => {
  const [searchTerm, setSearchTerm] = useState(value)

  useEffect(() => {
    setSearchTerm(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchTerm(val)
    onChange(val)
  }

  const handleClear = () => {
    setSearchTerm('')
    onChange('')
  }

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E7A70]">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-white border border-[#EFE2E0] rounded-2xl text-sm text-[#3B2219] placeholder-[#A88C85] focus:outline-hidden focus:ring-2 focus:ring-[#E87A84]/40 focus:border-[#E87A84] transition-all shadow-xs"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#A88C85] hover:text-[#4A2E2B] transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
