import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import NFTCard from '../components/NFTCard'
import FilterPanel from '../components/FilterPanel'
import SortBar from '../components/SortBar'
import { AlertCircle, Loader } from 'lucide-react'

interface NFT {
  id: string
  name: string
  image: string
  price: number
  creator: string
  collection: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
}

// Mock NFT data
const mockNFTs: NFT[] = [
  {
    id: '1',
    name: 'Cosmic Voyager #001',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8e7e942f?w=400&h=400&fit=crop',
    price: 2.5,
    creator: 'SolArtist',
    collection: 'Cosmic Series',
    rarity: 'legendary',
  },
  {
    id: '2',
    name: 'Digital Dream #042',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=400&fit=crop',
    price: 1.2,
    creator: 'PixelMaster',
    collection: 'Genesis Collection',
    rarity: 'rare',
  },
  {
    id: '3',
    name: 'Neon Genesis #007',
    image: 'https://images.unsplash.com/photo-1611339555312-e607c25352ca?w=400&h=400&fit=crop',
    price: 0.8,
    creator: 'NeonWizard',
    collection: 'Rare Gems',
    rarity: 'uncommon',
  },
  {
    id: '4',
    name: 'Aurora Glow #156',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=400&fit=crop',
    price: 3.5,
    creator: 'LightBringer',
    collection: 'Cosmic Series',
    rarity: 'legendary',
  },
  {
    id: '5',
    name: 'Quantum Leap #089',
    image: 'https://images.unsplash.com/photo-1633878669159-289d91451872?w=400&h=400&fit=crop',
    price: 0.5,
    creator: 'QuantumDev',
    collection: 'Limited Edition',
    rarity: 'common',
  },
  {
    id: '6',
    name: 'Stellar Crown #023',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8e7e942f?w=400&h=400&fit=crop',
    price: 4.2,
    creator: 'CosmicKing',
    collection: 'Rare Gems',
    rarity: 'legendary',
  },
  {
    id: '7',
    name: 'Mystic Void #112',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=400&fit=crop',
    price: 1.8,
    creator: 'VoidWalker',
    collection: 'Genesis Collection',
    rarity: 'rare',
  },
  {
    id: '8',
    name: 'Infinity Loop #301',
    image: 'https://images.unsplash.com/photo-1611339555312-e607c25352ca?w=400&h=400&fit=crop',
    price: 0.9,
    creator: 'InfinityBound',
    collection: 'Limited Edition',
    rarity: 'uncommon',
  },
]

export default function Browse() {
  const { connected } = useWallet()
  const [nfts, setNfts] = useState<NFT[]>(mockNFTs)
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>(mockNFTs)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('recent')

  const handleFilterChange = (filters: any) => {
    let filtered = [...nfts]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter((nft) =>
        nft.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        nft.creator.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Collection filter
    if (filters.collection) {
      filtered = filtered.filter((nft) => nft.collection === filters.collection)
    }

    // Rarity filter
    if (filters.rarity) {
      filtered = filtered.filter((nft) => nft.rarity === filters.rarity)
    }

    // Price filter
    filtered = filtered.filter(
      (nft) => nft.price >= filters.priceMin && nft.price <= filters.priceMax
    )

    // Apply sorting
    applySort(filtered, sortBy)
    setFilteredNfts(filtered)
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    applySort(filteredNfts, newSortBy)
  }

  const applySort = (nftsToSort: NFT[], sortType: string) => {
    const sorted = [...nftsToSort]

    switch (sortType) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        sorted.reverse()
        break
      case 'newest':
        sorted.reverse()
        break
      case 'recent':
      default:
        break
    }

    setFilteredNfts(sorted)
  }

  const handleBuyNFT = (nft: NFT) => {
    if (!connected) {
      alert('Please connect your wallet first')
      return
    }
    alert(`Buy ${nft.name} for ${nft.price} SOL - Integration with smart contract required`)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader size={48} className="text-secondary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading NFTs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Browse NFTs</h1>
        <p className="text-gray-400 text-lg">
          Explore our collection of unique Solana NFTs
        </p>
      </div>

      {/* Connection Warning */}
      {!connected && (
        <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/50 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} className="text-orange-400" />
          <p className="text-orange-300">Connect your wallet to purchase NFTs</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>

        {/* NFTs Grid */}
        <div className="lg:col-span-3">
          <SortBar onSortChange={handleSortChange} itemCount={filteredNfts.length} />

          {filteredNfts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">No NFTs found matching your filters</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary py-2 px-6"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNfts.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  onBuy={handleBuyNFT}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
