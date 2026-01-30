import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

interface FilterOptions {
  collection: string
  priceMin: number
  priceMax: number
  rarity: string
  search: string
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    collection: '',
    priceMin: 0,
    priceMax: 1000,
    rarity: '',
    search: '',
  })

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange(updated)
  }

  return (
    <div className="card h-fit">
      <div className="flex items-center gap-2 mb-6">
        <Filter size={20} className="text-secondary" />
        <h3 className="text-lg font-bold text-white">Filters</h3>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Search
          </label>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search NFTs..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-secondary"
            />
          </div>
        </div>

        {/* Collection Filter */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Collection
          </label>
          <select
            value={filters.collection}
            onChange={(e) => handleFilterChange({ collection: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white focus:outline-none focus:border-secondary"
          >
            <option value="">All Collections</option>
            <option value="genesis">Genesis Collection</option>
            <option value="rare-gems">Rare Gems</option>
            <option value="cosmic">Cosmic Series</option>
            <option value="limited">Limited Edition</option>
          </select>
        </div>

        {/* Rarity Filter */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Rarity
          </label>
          <select
            value={filters.rarity}
            onChange={(e) => handleFilterChange({ rarity: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white focus:outline-none focus:border-secondary"
          >
            <option value="">All Rarities</option>
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Price Range (SOL)
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceMax}
              onChange={(e) =>
                handleFilterChange({ priceMax: Number(e.target.value) })
              }
              className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-secondary"
            />
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{filters.priceMin} SOL</span>
              <span className="text-secondary font-semibold">
                Max: {filters.priceMax} SOL
              </span>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            const resetFilters = {
              collection: '',
              priceMin: 0,
              priceMax: 1000,
              rarity: '',
              search: '',
            }
            setFilters(resetFilters)
            onFilterChange(resetFilters)
          }}
          className="w-full btn-secondary text-sm py-2"
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}
