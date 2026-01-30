import { Link } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Zap, ShoppingBag, TrendingUp, Users } from 'lucide-react'

export default function Home() {
  const { connected } = useWallet()

  const stats = [
    { label: 'Total NFTs', value: '5,234', icon: ShoppingBag },
    { label: 'Creators', value: '1,200+', icon: Users },
    { label: 'Floor Price', value: '0.5 SOL', icon: TrendingUp },
    { label: 'Total Volume', value: '12,500 SOL', icon: Zap },
  ]

  const features = [
    {
      title: 'Browse & Discover',
      description: 'Explore thousands of unique NFTs from various collections',
      icon: ShoppingBag,
    },
    {
      title: 'Instant Trading',
      description: 'Buy and sell NFTs instantly on the fastest blockchain',
      icon: TrendingUp,
    },
    {
      title: 'Secure Transactions',
      description: 'All transactions secured by Solana smart contracts',
      icon: Zap,
    },
    {
      title: 'Community Driven',
      description: 'Join thousands of collectors in our vibrant community',
      icon: Users,
    },
  ]

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Explore the Galaxy
            </span>
            <br />
            <span className="text-white">of Solana NFTs</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Discover, trade, and collect unique digital assets on the world's
            fastest and most reliable blockchain.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link
              to="/browse"
              className="btn-primary text-lg py-4 px-8 inline-block"
            >
              Start Exploring
            </Link>
            {!connected && (
              <WalletMultiButton style={{
                backgroundColor: 'transparent',
                borderRadius: '8px',
                height: '56px',
                padding: '0 32px',
                fontSize: '18px',
                border: '2px solid #14F195',
                color: '#14F195',
              }} />
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="card group hover:shadow-lg hover:shadow-primary/50 transition-all"
                >
                  <Icon size={32} className="text-secondary mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <p className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why Choose <span className="text-secondary">SolGalaxy</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card group">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg group-hover:scale-110 transition-transform">
                      <Icon size={28} className="text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center py-16 bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-secondary/50">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Connect your wallet and begin exploring thousands of unique NFTs
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {!connected ? (
                <WalletMultiButton style={{
                  backgroundColor: '#9945FF',
                  borderRadius: '8px',
                  height: '56px',
                  padding: '0 32px',
                  fontSize: '18px',
                }} />
              ) : (
                <Link
                  to="/browse"
                  className="btn-primary text-lg py-4 px-8"
                >
                  Browse NFTs
                </Link>
              )}
              <Link
                to="/collections"
                className="btn-secondary text-lg py-4 px-8"
              >
                View Collections
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
