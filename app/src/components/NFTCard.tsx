interface NFT {
  id: string
  name: string
  image: string
  price: number
  creator: string
  collection: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
}

interface NFTCardProps {
  nft: NFT
  onBuy?: (nft: NFT) => void
}

export default function NFTCard({ nft, onBuy }: NFTCardProps) {
  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    uncommon: 'from-green-400 to-green-500',
    rare: 'from-blue-400 to-blue-500',
    legendary: 'from-yellow-400 to-orange-500',
  }

  return (
    <div className="card group relative overflow-hidden h-full hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 animate-fade-in">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg overflow-hidden mb-4">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Rarity Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${
            rarityColors[nft.rarity]
          } capitalize`}
        >
          {nft.rarity}
        </div>
      </div>

      {/* NFT Details */}
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-400">{nft.collection}</p>
          <h3 className="text-lg font-bold text-white group-hover:text-secondary transition-colors">
            {nft.name}
          </h3>
        </div>

        {/* Creator */}
        <div className="text-sm">
          <p className="text-gray-400">Created by</p>
          <p className="text-secondary font-semibold truncate">{nft.creator}</p>
        </div>

        {/* Price and Buy */}
        <div className="pt-4 border-t border-primary/20 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-xl font-bold text-secondary">{nft.price} SOL</p>
          </div>
          <button
            onClick={() => onBuy?.(nft)}
            className="btn-primary text-sm py-2 px-4"
          >
            Buy
          </button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
    </div>
  )
}
