import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

interface SortOption {
  id: string
  label: string
  value: string
}

const sortOptions: SortOption[] = [
  { id: '1', label: 'Recently Listed', value: 'recent' },
  { id: '2', label: 'Price: Low to High', value: 'price-asc' },
  { id: '3', label: 'Price: High to Low', value: 'price-desc' },
  { id: '4', label: 'Most Popular', value: 'popular' },
  { id: '5', label: 'Newest', value: 'newest' },
]

interface SortBarProps {
  onSortChange: (sortBy: string) => void
  itemCount?: number
}

export default function SortBar({ onSortChange, itemCount = 0 }: SortBarProps) {
  const [sortBy, setSortBy] = useState('recent')
  const { connected } = useWallet()

  const handleSortChange = (value: string) => {
    setSortBy(value)
    onSortChange(value)
  }

  return (
    <div className="flex justify-between items-center mb-8 p-4 bg-card border border-primary/20 rounded-lg">
      <div className="text-gray-400">
        {itemCount > 0 && <span>{itemCount} items found</span>}
        {!connected && <span className="text-orange-400">Connect wallet to buy NFTs</span>}
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-white">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-4 py-2 bg-black/30 border border-primary/30 rounded-lg text-white focus:outline-none focus:border-secondary cursor-pointer transition-colors"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
