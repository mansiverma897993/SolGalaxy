# SolGalaxy Frontend Architecture

## Project Structure

```
app/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.tsx     # Navigation bar
│   │   ├── Footer.tsx     # Footer
│   │   ├── NFTCard.tsx    # NFT card display
│   │   ├── NFTDetail.tsx  # NFT detail view
│   │   ├── FilterPanel.tsx # NFT filtering
│   │   ├── SortBar.tsx    # NFT sorting
│   │   ├── WalletInfo.tsx # Wallet information
│   │   ├── Loading.tsx    # Loading spinner
│   │   ├── Alert.tsx      # Alert notifications
│   │   ├── Button.tsx     # Button component
│   │   ├── Input.tsx      # Input field
│   │   └── Textarea.tsx   # Textarea field
│   │
│   ├── pages/            # Page components
│   │   ├── Home.tsx      # Landing page
│   │   ├── Browse.tsx    # NFT marketplace
│   │   ├── Collections.tsx # Collections gallery
│   │   ├── Profile.tsx   # User profile
│   │   └── ListNFT.tsx   # Create & list NFTs
│   │
│   ├── services/         # API and Solana services
│   │   ├── api.ts        # REST API client
│   │   └── solana.ts     # Solana blockchain helper
│   │
│   ├── hooks/            # Custom React hooks
│   │   └── useSolana.ts  # Solana-related hooks
│   │
│   ├── utils/            # Utility functions
│   │   └── format.ts     # Formatting utilities
│   │
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   ├── index.css         # Global styles
│   └── App.css           # App-specific styles
│
├── index.html            # HTML template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
├── tailwind.config.js    # Tailwind config
├── postcss.config.js     # PostCSS config
└── README.md             # Documentation
```

## Data Flow

```
┌─────────────────┐
│   User Input    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  React Components       │
│  - Handle State         │
│  - Manage UI Logic      │
└────────┬────────────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
    ┌──────────┐        ┌──────────────┐
    │   API    │        │   Solana     │
    │ Services │        │  Connection  │
    └────┬─────┘        └───────┬──────┘
         │                      │
         └──────────┬───────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │   Backend Server     │
        │   & Blockchain       │
        └──────────────────────┘
```

## Component Hierarchy

```
App
├── Navbar
│   ├── Navigation Links
│   └── WalletMultiButton
├── Routes
│   ├── Home Page
│   │   ├── Hero Section
│   │   ├── Features Grid
│   │   └── Stats Cards
│   │
│   ├── Browse Page
│   │   ├── FilterPanel
│   │   ├── SortBar
│   │   └── NFTCard Grid
│   │
│   ├── Collections Page
│   │   ├── Collection Cards
│   │   └── Collection Detail
│   │
│   ├── Profile Page
│   │   ├── Profile Header
│   │   ├── Stats Grid
│   │   └── NFT Gallery
│   │
│   └── ListNFT Page
│       ├── Form Section
│       └── Preview Section
│
└── Footer
    ├── Links
    └── Social Icons
```

## State Management Flow

```
┌─────────────────────────────────────┐
│   Solana Wallet Adapter (Global)    │
│   - Connected status                │
│   - Public key                      │
│   - Wallet instance                 │
└──────────────────┬──────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌─────────┐         ┌────────────┐
   │ Browse  │         │  Profile   │
   │ Page    │         │   Page     │
   │ State   │         │   State    │
   └────┬────┘         └─────┬──────┘
        │                    │
        ├────────┬───────────┤
        │        │           │
        ▼        ▼           ▼
     NFTs   Balance   Transactions
```

## Authentication Flow

```
1. User Clicks "Connect Wallet"
   │
   ▼
2. WalletMultiButton Opens Selection
   │
   ▼
3. User Selects Wallet (Phantom/Solflare/Torus)
   │
   ▼
4. Wallet Approval Needed
   │
   ▼
5. Connection Established
   - publicKey stored in Wallet context
   - connected flag set to true
   │
   ▼
6. User Can Now:
   - View profile
   - Buy NFTs
   - List NFTs
   - Manage collections
```

## API Call Flow

```
Component (e.g., Browse.tsx)
   │
   ├─ useState: filteredNfts
   │
   ├─ useEffect or onClick
   │
   └─▶ API Service (api.ts)
      │
      ├─ axios instance
      │
      ├─ HTTP Request
      │
      └─▶ Backend Server
         │
         ├─ Database Query
         │
         ├─ Processing
         │
         └─▶ JSON Response
            │
            └─▶ Update Component State
               │
               └─▶ Re-render UI
```

## Wallet Connection & Solana Integration

```
Solana Connection (main.tsx)
   │
   ├─ ConnectionProvider
   │  └─ Endpoint: RPC URL
   │
   ├─ WalletProvider
   │  ├─ Phantom Adapter
   │  ├─ Solflare Adapter
   │  └─ Torus Adapter
   │
   └─ WalletModalProvider
      │
      └─ useWallet() Hook Available
         │
         ├─ publicKey
         ├─ connected
         ├─ wallet
         ├─ connect()
         └─ disconnect()
```

## Feature Workflows

### 1. Browse NFTs Workflow
```
Browse Page Load
   │
   ├─ Fetch mock NFT data
   │
   ├─ Display NFT Grid
   │
   ├─ Apply Filters
   │  ├─ Collection filter
   │  ├─ Rarity filter
   │  ├─ Price range
   │  └─ Search text
   │
   ├─ Apply Sorting
   │  ├─ Price (low to high)
   │  ├─ Price (high to low)
   │  └─ Most popular
   │
   └─ Update Grid Display
```

### 2. Buy NFT Workflow
```
User Clicks "Buy NFT"
   │
   ├─ Check Wallet Connection
   │  └─ If not connected: Show error
   │
   ├─ Create Transaction
   │  ├─ NFT ID
   │  ├─ Price
   │  └─ Buyer wallet
   │
   ├─ Send to Smart Contract
   │  ├─ Solana Web3.js
   │  └─ Wallet signs transaction
   │
   ├─ Wait for Confirmation
   │
   └─ Update UI & Profile
```

### 3. List NFT Workflow
```
User Submits List Form
   │
   ├─ Validate Form Data
   │  ├─ Name & description
   │  ├─ Price
   │  └─ Image
   │
   ├─ Upload Image (if needed)
   │
   ├─ Create NFT via API
   │  ├─ Send form data
   │  └─ Store on blockchain
   │
   ├─ Confirm Success
   │
   └─ Redirect to Browse
```

## Technology Stack Visualization

```
┌──────────────────────────────────────────┐
│        Frontend (React + TypeScript)     │
├──────────────────────────────────────────┤
│ UI Layer                                 │
│ ├─ Tailwind CSS (Styling)               │
│ ├─ Lucide React (Icons)                 │
│ └─ React Router (Routing)               │
├──────────────────────────────────────────┤
│ State Management                         │
│ ├─ Solana Wallet Adapter                │
│ └─ React Hooks (useState, useEffect)    │
├──────────────────────────────────────────┤
│ API & Blockchain Layer                   │
│ ├─ Axios (HTTP Client)                  │
│ ├─ Solana Web3.js (Blockchain)          │
│ └─ Wallet Adapter (Web3 Auth)           │
├──────────────────────────────────────────┤
│ Development Tools                        │
│ ├─ Vite (Build tool)                    │
│ ├─ TypeScript (Type safety)             │
│ └─ ESLint (Code quality)                │
└──────────────────────────────────────────┘
         │
         └─▶ Solana Devnet/Mainnet
         └─▶ Backend API Server
```

## Performance Optimization

```
Frontend Optimizations
├─ Code Splitting
│  └─ Route-based code splitting with React.lazy
│
├─ Image Optimization
│  └─ Responsive images
│
├─ Caching
│  ├─ API response caching
│  └─ Browser caching
│
├─ Lazy Loading
│  └─ Infinite scroll / pagination
│
└─ Bundle Optimization
   ├─ Tree shaking
   └─ Minification
```

## Error Handling Strategy

```
API Errors
   │
   ├─ Network Error
   │  └─ Show connection error alert
   │
   ├─ 4xx Error (Client)
   │  └─ Show validation error
   │
   ├─ 5xx Error (Server)
   │  └─ Show server error alert
   │
   └─ Timeout
      └─ Show timeout alert

Blockchain Errors
   │
   ├─ Transaction Rejected
   │  └─ Show rejection message
   │
   ├─ Insufficient Balance
   │  └─ Show insufficient funds alert
   │
   └─ Gas Error
      └─ Show gas estimation error
```

## Security Considerations

```
1. Wallet Security
   - Never store private keys
   - Use wallet adapter for signing
   - Validate signatures

2. API Security
   - HTTPS only
   - CORS configuration
   - Request validation
   - Rate limiting

3. Frontend Security
   - XSS protection (React escaping)
   - CSRF tokens
   - Input sanitization
   - Content Security Policy

4. Blockchain Security
   - Verify contract addresses
   - Check transaction signatures
   - Validate ownership
   - Audit smart contracts
```

## Deployment Architecture

```
Development
└─ npm run dev
   └─ localhost:3000

Production Build
└─ npm run build
   └─ dist/ folder
      ├─ index.html
      ├─ assets/
      │  ├─ main-xxxxx.js
      │  ├─ main-xxxxx.css
      │  └─ vendor-xxxxx.js
      └─ Optimized output

Deployment Targets
├─ Vercel
├─ Netlify
├─ GitHub Pages
├─ AWS S3 + CloudFront
├─ Docker container
└─ Own VPS
```
