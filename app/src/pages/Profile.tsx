import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import WalletInfo from '../components/WalletInfo'
import { Copy, LogOut } from 'lucide-react'
import { useState } from 'react'

interface ProfileNFT {
  id: string
  name: string
  image: string
  price: number
  collection: string
}

const mockProfileNFTs: ProfileNFT[] = [
  {
    id: '1',
    name: 'Cosmic Voyager #001',
    image: '/assets/nft-1.svg',
    price: 2.5,
    collection: 'Cosmic Series',
  },
  {
    id: '2',
    name: 'Digital Dream #042',
    image: '/assets/nft-2.svg',
    price: 1.2,
    collection: 'Genesis Collection',
  },
  {
    id: '3',
    name: 'Neon Genesis #007',
    image: '/assets/nft-3.svg',
    price: 0.8,
    collection: 'Rare Gems',
  },
]

export default function Profile() {
  const { connected, publicKey, disconnect } = useWallet()
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!connected || !publicKey) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-white mb-6">Profile</h1>
          <p className="text-gray-400 text-lg mb-8">
            Connect your wallet to view your profile and NFTs
          </p>
          <WalletMultiButton
            style={{
              backgroundColor: '#9945FF',
              borderRadius: '8px',
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              margin: '0 auto',
            }}
          />
        </div>
      </div>
    )
  }

  const profileStats = [
    { label: 'NFTs Owned', value: mockProfileNFTs.length.toString() },
    { label: 'Total Value', value: (mockProfileNFTs.reduce((sum, nft) => sum + nft.price, 0)).toFixed(2) + ' SOL' },
    { label: 'Collections', value: '3' },
    { label: 'Offers Received', value: '2' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">My Profile</h1>
        <p className="text-gray-400 text-lg">Manage your NFTs and account</p>
      </div>

      {/* Wallet Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1">
          <WalletInfo />
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            {profileStats.map((stat, index) => (
              <div key={index} className="card">
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-secondary">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="card mb-12">
        <h3 className="text-lg font-bold text-white mb-4">Wallet Address</h3>
        <div className="flex items-center gap-3 bg-black/30 p-4 rounded-lg">
          <p className="text-gray-300 font-mono break-all">{publicKey.toString()}</p>
          <button
            onClick={copyAddress}
            className="ml-auto p-2 hover:bg-primary/20 rounded-lg transition-colors flex-shrink-0"
            title="Copy address"
          >
            <Copy size={20} className={copied ? 'text-green-400' : 'text-secondary'} />
          </button>
        </div>
        {copied && (
          <p className="text-green-400 text-sm mt-2">✓ Address copied to clipboard</p>
        )}
      </div>

      {/* NFTs Section */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">My NFTs ({mockProfileNFTs.length})</h3>

        {mockProfileNFTs.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 mb-4">You don't own any NFTs yet</p>
            <a
              href="/browse"
              className="btn-primary inline-block py-2 px-6"
            >
              Browse NFTs
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProfileNFTs.map((nft) => (
              <div key={nft.id} className="card group hover:shadow-2xl hover:shadow-primary/50 transition-all">
                <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg overflow-hidden mb-4">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      target.onerror = null
                      target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g3" x1="0" x2="1"><stop offset="0" stop-color="%239945FF"/><stop offset="1" stop-color="%2314F195"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g3)" rx="12" ry="12"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial,Helvetica,sans-serif" font-size="18">No Image</text></svg>'
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-400">{nft.collection}</p>
                  <h4 className="text-lg font-bold text-white">{nft.name}</h4>
                  <div className="pt-3 border-t border-primary/20">
                    <p className="text-gray-400 text-sm mb-3">Current Value</p>
                    <button className="w-full btn-primary text-sm py-2">
                      Sell for {nft.price} SOL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disconnect Button */}
      <div className="mt-12 text-center">
        <button
          onClick={() => disconnect()}
          className="btn-secondary py-3 px-8 inline-flex items-center gap-2"
        >
          <LogOut size={20} />
          Disconnect Wallet
        </button>
      </div>
    </div>
  )
}
