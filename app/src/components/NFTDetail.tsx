import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Zap, ShoppingBag, Heart, Share2 } from 'lucide-react'

interface NFT {
  id: string
  name: string
  image: string
  price: number
  creator: string
  collection: string
  description: string
  rarity: string
  floorPrice: number
}

interface NFTDetailProps {
  nft: NFT
  onBuy?: () => void
}

export default function NFTDetail({ nft, onBuy }: NFTDetailProps) {
  const { connected } = useWallet()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image Section */}
      <div className="animate-fade-in">
        <div className="card p-0 overflow-hidden">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-6 flex gap-4">
          <button className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2">
            <Heart size={20} />
            Favorite
          </button>
          <button className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2">
            <Share2 size={20} />
            Share
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="animate-slide-in">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full mb-4">
            <span className="text-secondary text-xs font-semibold">
              {nft.collection}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{nft.name}</h1>
          <p className="text-gray-400">Created by {nft.creator}</p>
        </div>

        {/* Rarity Badge */}
        <div className="mb-8 card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-semibold">Rarity</span>
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-orange-400 text-sm font-bold capitalize">
              {nft.rarity}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-3">Description</h3>
          <p className="text-gray-400 leading-relaxed">{nft.description}</p>
        </div>

        {/* Price Info */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card">
            <p className="text-gray-400 text-sm mb-2">Current Price</p>
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-secondary" />
              <span className="text-2xl font-bold text-secondary">{nft.price}</span>
            </div>
            <p className="text-gray-500 text-xs mt-2">SOL</p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm mb-2">Floor Price</p>
            <p className="text-2xl font-bold text-white">{nft.floorPrice} SOL</p>
            <p className="text-green-400 text-xs mt-2">
              {((nft.price - nft.floorPrice) / nft.floorPrice * 100).toFixed(1)}% above floor
            </p>
          </div>
        </div>

        {/* Buy Section */}
        <div className="card mb-8">
          {!connected ? (
            <div className="text-center">
              <p className="text-gray-400 mb-4">Connect your wallet to purchase this NFT</p>
              <WalletMultiButton style={{
                width: '100%',
                backgroundColor: '#9945FF',
                borderRadius: '8px',
                height: '48px',
                fontSize: '16px',
              }} />
            </div>
          ) : (
            <button
              onClick={onBuy}
              className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2"
            >
              <ShoppingBag size={24} />
              Buy Now
            </button>
          )}
        </div>

        {/* Properties */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Properties</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="card text-center">
              <p className="text-gray-400 text-sm">Type</p>
              <p className="text-white font-semibold mt-1">Digital Art</p>
            </div>
            <div className="card text-center">
              <p className="text-gray-400 text-sm">Standard</p>
              <p className="text-white font-semibold mt-1">NFT</p>
            </div>
            <div className="card text-center">
              <p className="text-gray-400 text-sm">Chain</p>
              <p className="text-secondary font-semibold mt-1">Solana</p>
            </div>
            <div className="card text-center">
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-green-400 font-semibold mt-1">For Sale</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
