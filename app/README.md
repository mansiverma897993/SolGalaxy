# SolGalaxy Frontend

A modern React.js frontend for the Solana NFT marketplace platform. Built with TypeScript, Tailwind CSS, and Solana Wallet Adapter.

## Features

- 🎨 **Browse NFTs**: Explore thousands of unique Solana NFTs with advanced filtering and sorting
- 💳 **Wallet Integration**: Seamless Solana wallet connection with multiple wallet support
- 🛒 **Buy NFTs**: Purchase NFTs directly from the marketplace
- 📝 **List NFTs**: Create and list your own NFTs for sale
- 🗂️ **Collections**: Discover and explore curated NFT collections
- 👤 **User Profiles**: View creator profiles and collection statistics
- ✨ **Animations**: Smooth CSS animations and glass-morphism effects
- 📱 **Responsive**: Fully responsive design for all devices

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Web3**: Solana Web3.js & Wallet Adapter
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Icons**: Lucide React

## Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- A Solana wallet (Phantom, Solflare, or Torus recommended)

### Setup

```bash
# Navigate to app directory
cd app

# Install dependencies
npm install

# Create .env.local file
echo "REACT_APP_RPC_URL=https://api.devnet.solana.com" > .env.local
echo "REACT_APP_API_URL=http://localhost:8080/api" >> .env.local

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## Project Structure

```
app/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   ├── services/       # API and Solana services
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Components

### Pages
- **Home**: Landing page with features and statistics
- **Browse**: NFT marketplace with filtering and sorting
- **Collections**: NFT collection showcase
- **Profile**: User profile and NFT management
- **ListNFT**: Create and list new NFTs

### Components
- **Navbar**: Navigation and wallet connection
- **Footer**: Footer with links
- **NFTCard**: NFT card display component
- **FilterPanel**: Advanced NFT filtering
- **SortBar**: NFT sorting options
- **NFTDetail**: Detailed NFT view
- **WalletInfo**: Wallet information display

## Hooks

- `useSolanaBalance()`: Get wallet SOL balance
- `useSolanaWalletInfo()`: Get detailed wallet information
- `useSolanaTransactionHistory()`: Fetch transaction history

## API Services

### nftAPI
- `getNFTs()`: Fetch all NFTs
- `getNFT(id)`: Get NFT details
- `createNFT(data)`: Create new NFT
- `updateNFT(id, data)`: Update NFT
- `deleteNFT(id)`: Delete NFT

### collectionAPI
- `getCollections()`: Fetch all collections
- `getCollection(id)`: Get collection details
- `createCollection(data)`: Create new collection

### transactionAPI
- `buyNFT(nftId, wallet)`: Purchase NFT
- `listNFT(nftId, price, wallet)`: List NFT for sale
- `getUserTransactions(wallet)`: Get user transactions

### userAPI
- `getProfile(wallet)`: Get user profile
- `updateProfile(wallet, data)`: Update profile
- `getUserNFTs(wallet)`: Get user's NFTs

## Environment Variables

Create a `.env.local` file in the app directory:

```env
REACT_APP_RPC_URL=https://api.devnet.solana.com
REACT_APP_API_URL=http://localhost:8080/api
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Styling

The app uses Tailwind CSS with custom theme variables:

- **Primary Color**: `#9945FF` (Purple)
- **Secondary Color**: `#14F195` (Green)
- **Dark Background**: `#0A0A0A`
- **Card Background**: `#1A1A1A`

Custom animations:
- `fade-in`: Fade in animation
- `slide-in`: Slide in animation
- `pulse-glow`: Pulsing glow effect

## Solana Network

Currently configured for **Devnet**. To switch networks, update the `network` variable in `src/main.tsx`:

```typescript
const network = WalletAdapterNetwork.Mainnet  // For mainnet
```

## Wallet Support

Supported wallets through Solana Wallet Adapter:
- Phantom
- Solflare
- Torus

## Future Features

- [ ] Real-time price updates
- [ ] Advanced search and discovery
- [ ] User comments and reviews
- [ ] Offer system
- [ ] Auction functionality
- [ ] Staking rewards
- [ ] Community governance

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues and questions, please open an issue in the repository.
