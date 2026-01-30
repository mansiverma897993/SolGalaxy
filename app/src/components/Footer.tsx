export default function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-black/50 backdrop-blur-md mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-secondary mb-4">SolGalaxy</h3>
            <p className="text-gray-400 text-sm">
              Your premier destination for Solana NFTs. Discover, trade, and
              collect on the fastest blockchain.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Browse NFTs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Collections
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  List NFT
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 SolGalaxy. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-secondary transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 19c11 0 17-9 17-16.6a12.3 12.3 0 0 0-1.7-.5A8.5 8.5 0 0 0 22.5 4c-.6.3-1.3.5-2 .6A3.5 3.5 0 0 0 24 3c-.7.4-1.5.7-2.3.8A3.5 3.5 0 0 0 16.6 6c0 .3 0 .6 0 1A10 10 0 0 1 2.5 4a3.5 3.5 0 0 0 1 4.7A3.5 3.5 0 0 1 2 8.5v.1c0 1.7 1.2 3.1 2.9 3.4-.3 0-.7 0-1 0-.3 0-.5 0-.8 0 .3.9 1 1.6 2 1.8A7 7 0 0 1 2 13.5a10 10 0 0 0 5.5 1.5" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-secondary transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 4.3 2.7 8 6.5 9.3.5 0 .7-.3.7-.6v-2.2c-2.5.5-3-1.2-3-1.2-.4-1.1-1-1.4-1-1.4-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.4 2.2 1 2.8.8 0-.5.3-1 .7-1.3-2.5-.3-5-1.2-5-5.4 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.3.1-2.7 0 0 1-.3 3 1 1-.3 2-.4 3-.4s2 .1 3 .4c2-1.3 3-1 3-1 .7 1.4.2 2.4.1 2.7.7.8 1.2 1.8 1.2 3 0 4.3-2.5 5.1-5 5.4.4.3.7.9.7 1.8v2.7c0 .3.2.7.7.6C19.3 20 22 16.3 22 12c0-5.5-4.5-10-10-10z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
