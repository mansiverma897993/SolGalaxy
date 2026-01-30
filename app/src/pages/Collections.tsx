import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Users, Zap } from 'lucide-react'

interface Collection {
  id: string
  name: string
  image: string
  creator: string
  floorPrice: number
  volume: number
  owners: number
  items: number
  description: string
}

const mockCollections: Collection[] = [
  {
    id: '1',
    name: 'Cosmic Series',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8e7e942f?w=400&h=400&fit=crop',
    creator: 'SolArtist',
    floorPrice: 2.5,
    volume: 12500,
    owners: 340,
    items: 500,
    description: 'A collection of beautiful cosmic-themed digital art pieces.',
  },
  {
    id: '2',
    name: 'Genesis Collection',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=400&fit=crop',
    creator: 'PixelMaster',
    floorPrice: 0.8,
    volume: 8420,
    owners: 240,
    items: 300,
    description: 'The original collection that started it all.',
  },
  {
    id: '3',
    name: 'Rare Gems',
    image: 'https://images.unsplash.com/photo-1611339555312-e607c25352ca?w=400&h=400&fit=crop',
    creator: 'NeonWizard',
    floorPrice: 3.2,
    volume: 15200,
    owners: 450,
    items: 750,
    description: 'Hand-picked rare and exclusive digital gems.',
  },
  {
    id: '4',
    name: 'Limited Edition',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=400&fit=crop',
    creator: 'LightBringer',
    floorPrice: 1.5,
    volume: 5600,
    owners: 180,
    items: 200,
    description: 'Extremely limited edition pieces with unique properties.',
  },
  {
    id: '5',
    name: 'Digital Dreams',
    image: 'https://images.unsplash.com/photo-1633878669159-289d91451872?w=400&h=400&fit=crop',
    creator: 'DreamWeaver',
    floorPrice: 0.5,
    volume: 3200,
    owners: 120,
    items: 150,
    description: 'Surreal and imaginative digital art collection.',
  },
  {
    id: '6',
    name: 'Quantum Realm',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8e7e942f?w=400&h=400&fit=crop',
    creator: 'QuantumDev',
    floorPrice: 4.1,
    volume: 18900,
    owners: 520,
    items: 1000,
    description: 'A groundbreaking collection exploring quantum computing themes.',
  },
]

export default function Collections() {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">NFT Collections</h1>
        <p className="text-gray-400 text-lg">
          Discover curated collections from top creators
        </p>
      </div>

      {selectedCollection ? (
        // Collection Detail View
        <div className="animate-fade-in">
          <button
            onClick={() => setSelectedCollection(null)}
            className="mb-8 text-secondary hover:text-primary transition-colors"
          >
            ← Back to Collections
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="card p-0 overflow-hidden h-96">
              <img
                src={selectedCollection.image}
                alt={selectedCollection.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <p className="text-secondary text-sm font-semibold mb-2">
                  Created by {selectedCollection.creator}
                </p>
                <h2 className="text-4xl font-bold text-white mb-3">
                  {selectedCollection.name}
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {selectedCollection.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card">
                  <p className="text-gray-400 text-sm mb-2">Floor Price</p>
                  <div className="flex items-center gap-2">
                    <Zap size={20} className="text-secondary" />
                    <span className="text-2xl font-bold text-white">
                      {selectedCollection.floorPrice}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">SOL</p>
                </div>

                <div className="card">
                  <p className="text-gray-400 text-sm mb-2">Volume</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={20} className="text-green-400" />
                    <span className="text-2xl font-bold text-white">
                      {(selectedCollection.volume / 1000).toFixed(1)}K
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">SOL</p>
                </div>

                <div className="card">
                  <p className="text-gray-400 text-sm mb-2">Owners</p>
                  <div className="flex items-center gap-2">
                    <Users size={20} className="text-blue-400" />
                    <span className="text-2xl font-bold text-white">
                      {selectedCollection.owners}
                    </span>
                  </div>
                </div>

                <div className="card">
                  <p className="text-gray-400 text-sm mb-2">Items</p>
                  <p className="text-2xl font-bold text-white">
                    {selectedCollection.items}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Link
                  to="/browse"
                  className="btn-primary py-4 px-6 flex-1 text-center font-bold"
                >
                  Browse Collection
                </Link>
                <button className="btn-secondary py-4 px-6 flex-1 font-bold">
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Collections Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCollections.map((collection) => (
            <div
              key={collection.id}
              className="card group overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:shadow-primary/50 animate-fade-in"
              onClick={() => setSelectedCollection(collection)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">{collection.creator}</p>
                  <h3 className="text-lg font-bold text-white group-hover:text-secondary transition-colors">
                    {collection.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2">
                  {collection.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-primary/20">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Floor</p>
                    <p className="font-bold text-secondary">
                      {collection.floorPrice} SOL
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Items</p>
                    <p className="font-bold text-white">{collection.items}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Owners</p>
                    <p className="font-bold text-white">{collection.owners}</p>
                  </div>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 rounded-lg pointer-events-none">
                <p className="text-secondary font-semibold">View Collection →</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
