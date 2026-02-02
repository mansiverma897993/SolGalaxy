# Frontend Setup & Installation Guide

## Quick Start

### 1. Install Dependencies

```bash
cd app
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the `app` directory:

```env
VITE_APP_RPC_URL=https://api.devnet.solana.com
VITE_APP_API_URL=http://localhost:8080/api
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
npm run preview
```

## Features Implemented

### ✅ Wallet Integration
- Connect wallet using Solana Wallet Adapter
- Support for Phantom, Solflare, and Torus wallets
- Wallet info display and balance tracking
- Disconnect functionality

### ✅ Browse NFTs
- View all available NFTs with real-time data
- Advanced filtering by collection, rarity, and price
- Sorting options (price, popularity, newest)
- Search functionality
- NFT card display with details

### ✅ Collections
- Browse curated NFT collections
- Collection statistics (floor price, volume, owners, items)
- Detailed collection view
- Collection management

### ✅ List NFTs
- Create and list new NFTs
- Upload NFT images
- Set price and royalties
- Configure collection
- Form validation

### ✅ User Profiles
- View creator profiles
- Profile statistics and activity
- Owned NFTs display
- Favorite NFTs management
- Transaction history

### ✅ UI/UX Features
- Modern responsive design
- Smooth animations and transitions
- Glass-morphism effects
- Dark theme with gradient backgrounds
- Mobile-friendly navigation
- Loading states and error handling

## Component Architecture

### Layout Components
- `Navbar`: Navigation with wallet connection
- `Footer`: Footer with links and social
- `Loading`: Loading spinner
- `Alert`: Alert notifications

### Form Components
- `Input`: Styled input field
- `Textarea`: Styled textarea
- `Button`: Reusable button component

### NFT Components
- `NFTCard`: NFT display card
- `NFTDetail`: Detailed NFT view
- `FilterPanel`: Advanced filtering
- `SortBar`: Sorting options
- `WalletInfo`: Wallet information

### Page Components
- `Home`: Landing page
- `Browse`: NFT marketplace
- `Collections`: Collections gallery
- `Profile`: User profile
- `ListNFT`: Create & list NFTs

## Service Layer

### API Service (`services/api.ts`)
- RESTful API client with axios
- NFT CRUD operations
- Collection management
- Transaction handling
- User profile management

### Solana Service (`services/solana.ts`)
- Solana connection management
- Balance fetching
- Token account queries
- Transaction history

## Custom Hooks

### `useSolanaBalance()`
Fetch wallet SOL balance

```typescript
const { balance, loading, error, fetchBalance } = useSolanaBalance()
```

### `useSolanaWalletInfo()`
Get detailed wallet information

```typescript
const { walletInfo, loading, error, fetchWalletInfo } = useSolanaWalletInfo()
```

### `useSolanaTransactionHistory()`
Fetch transaction history

```typescript
const { transactions, loading, error, fetchTransactionHistory } = useSolanaTransactionHistory()
```

## Utility Functions

### Format Utilities
- `formatSOL()`: Format SOL amounts
- `formatAddress()`: Shorten wallet addresses
- `formatNumber()`: Format large numbers
- `formatDate()`: Format dates
- `formatDateTime()`: Format date and time

### Solana Utilities
- `isValidSolanaAddress()`: Validate Solana address
- `getRarityColor()`: Get rarity color class
- `getRarityBg()`: Get rarity background class

## Styling System

### Colors
- **Primary**: `#9945FF` (Purple)
- **Secondary**: `#14F195` (Green)
- **Dark**: `#0A0A0A`
- **Card**: `#1A1A1A`

### Custom Classes
- `.btn-primary`: Primary button style
- `.btn-secondary`: Secondary button style
- `.card`: Card component style
- `.glass`: Glass-morphism effect

### Animations
- `fade-in`: Fade in effect
- `slide-in`: Slide in from top
- `pulse-glow`: Pulsing glow effect

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_RPC_URL` | Solana RPC endpoint | Devnet |
| `VITE_APP_API_URL` | Backend API URL | localhost |

## Integration with Backend

The frontend expects a backend API at the configured `VITE_APP_API_URL` with these endpoints:

### NFTs
- `GET /api/nfts` - List NFTs
- `GET /api/nfts/:id` - Get NFT details
- `POST /api/nfts` - Create NFT
- `PUT /api/nfts/:id` - Update NFT
- `DELETE /api/nfts/:id` - Delete NFT

### Collections
- `GET /api/collections` - List collections
- `GET /api/collections/:id` - Get collection details
- `POST /api/collections` - Create collection

### Transactions
- `POST /api/transactions/buy` - Buy NFT
- `POST /api/transactions/list` - List NFT
- `GET /api/transactions/user/:wallet` - User transactions

### Users
- `GET /api/users/:wallet` - Get profile
- `PUT /api/users/:wallet` - Update profile
- `GET /api/users/:wallet/nfts` - Get user NFTs

## Troubleshooting

### Wallet Connection Issues
- Ensure you have a Solana wallet extension installed
- Check that you're on the Devnet network
- Clear browser cache and reload

### API Connection Issues
- Verify backend is running at configured URL
- Check CORS settings on backend
- Ensure API endpoints match expected structure

### Build Issues
- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Next Steps

1. **Connect Backend**: Integrate with your Solana program
2. **Add Authentication**: Implement user authentication
3. **Smart Contract Integration**: Connect to Anchor program
4. **Real Data**: Replace mock data with API calls
5. **Deployment**: Deploy to production
6. **Analytics**: Add usage tracking
7. **Testing**: Implement unit and E2E tests

## Support

For issues or questions:
1. Check the README.md in the app directory
2. Review the component documentation
3. Check API service implementation
4. Verify environment variables

## Additional Resources

- [Solana Documentation](https://docs.solana.com)
- [Wallet Adapter Docs](https://github.com/solana-labs/wallet-adapter)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Tailwind CSS](https://tailwindcss.com)
- [React Documentation](https://react.dev)
