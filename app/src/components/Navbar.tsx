import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { connected } = useWallet()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/browse', label: 'Browse' },
    { path: '/collections', label: 'Collections' },
    { path: '/profile', label: 'Profile' },
    { path: '/list-nft', label: 'List NFT' },
  ]

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Zap className="w-8 h-8 text-secondary group-hover:text-primary transition-colors" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SolGalaxy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-secondary'
                    : 'text-gray-300 hover:text-white'
                } after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-secondary after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="hidden md:block">
            <WalletMultiButton style={{
              backgroundColor: '#9945FF',
              borderRadius: '8px',
              height: '44px',
              padding: '0 20px',
            }} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-slide-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary/20 text-secondary'
                      : 'text-gray-300 hover:bg-primary/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 px-4">
                <WalletMultiButton style={{
                  width: '100%',
                  backgroundColor: '#9945FF',
                  borderRadius: '8px',
                  height: '44px',
                }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
