# SolGalaxy Quick Build & Deploy Guide

## 📦 Prerequisites

Ensure you have the following installed:

```bash
# Check versions
rustc --version          # Should be 1.79.0+
cargo --version         # Should be 1.79.0+
solana --version        # Should be 1.18+
anchor --version        # Should be 0.31.1
node --version          # Should be 18+
yarn --version          # Should be 3.x+
```

### Installation (if needed)

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor --tag v0.31.1 anchor-cli

# Install Node.js (via nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

## 🏗️ Project Structure

```
solgalaxy/
├── Anchor.toml                 # Anchor configuration
├── Cargo.toml                  # Workspace Cargo config
├── package.json               # Yarn workspace config
│
├── programs/
│   └── solgalaxy/
│       ├── Cargo.toml         # Smart contract dependencies
│       └── src/
│           └── lib.rs         # Smart contract source (480+ lines)
│
├── app/                        # React frontend
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.ts        # Vite build configuration
│   ├── tailwind.config.js    # Tailwind CSS config
│   ├── index.html            # HTML entry point
│   └── src/
│       ├── main.tsx          # React entry point
│       ├── App.tsx           # Main app component
│       ├── components/       # React components
│       ├── pages/            # Page components
│       ├── services/         # Blockchain services
│       ├── hooks/            # Custom React hooks
│       └── utils/            # Utility functions
│
├── tests/
│   └── solgalaxy.ts          # Smart contract tests
│
└── Documentation/
    ├── SMART_CONTRACT_README.md    # Backend documentation
    ├── INTEGRATION_GUIDE.md        # Frontend-backend integration
    └── QUICK_BUILD_GUIDE.md        # This file
```

## 🔧 Smart Contract Development

### 1. Build the Smart Contract

```bash
cd /home/mansi_verma/solgalaxy

# Clean build
rm -rf target/

# Build program
anchor build

# Output will show:
# Program ID: DxrR6os9PJUbAHWufA4CLbTRUi6E8fUVpTCDXbHMdMH3
# Build output: target/deploy/solgalaxy.so
```

### 2. Generate Types for Frontend

```bash
# Generate IDL (Interface Definition Language)
anchor build --idl

# Copy to frontend
mkdir -p app/src/idl
cp target/idl/solgalaxy.json app/src/idl/

# Generate TypeScript types (optional, for better IDE support)
# npm install -g @coral-xyz/anchor-cli
# anchor idl fetch YOUR_PROGRAM_ID --outfile app/src/idl/solgalaxy.json
```

### 3. Run Local Tests

```bash
# Start Solana local validator (in another terminal)
solana-test-validator

# In main terminal, run tests
anchor test

# Expected output:
# ✓ Initialize program
# ✓ Create collection
# ✓ Mint NFT
# ✓ List NFT for sale
# ✓ Update listing price
# ✓ Create user profile
# ✓ Cancel listing
# ✓ Update fee (admin only)
# ✓ Should fail: unauthorized fee update
# ✓ Should fail: invalid collection name
# ... (more tests)
```

### 4. Deploy to Devnet

```bash
# Configure Solana CLI for devnet
solana config set --url devnet

# Get devnet SOL for fees (request from faucet)
solana airdrop 2 --url devnet

# Deploy
anchor deploy --provider.cluster devnet

# Output shows new Program ID:
# Program ID: <YOUR_NEW_PROGRAM_ID>

# Update Anchor.toml with new Program ID
```

### 5. Deploy to Mainnet (Production)

```bash
# ⚠️ WARNING: This costs real SOL

# Ensure you have mainnet wallet with SOL
solana config set --url mainnet-beta

# Check balance
solana balance

# Deploy (this is irreversible!)
anchor deploy --provider.cluster mainnet

# Program ID: <MAINNET_PROGRAM_ID>
```

## 💻 Frontend Development

### 1. Install Dependencies

```bash
cd app

# Install with yarn (recommended)
yarn install

# Or with npm
npm install
```

### 2. Configure Environment

Create `app/.env.local`:

```env
# Smart contract configuration
REACT_APP_PROGRAM_ID=DxrR6os9PJUbAHWufA4CLbTRUi6E8fUVpTCDXbHMdMH3
REACT_APP_NETWORK=devnet
REACT_APP_RPC_ENDPOINT=https://api.devnet.solana.com
REACT_APP_WS_ENDPOINT=wss://api.devnet.solana.com

# Optional: For production
# REACT_APP_NETWORK=mainnet
# REACT_APP_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
```

### 3. Start Development Server

```bash
cd app

# Development with hot reload
yarn dev

# Output:
# ➜ Local:   http://localhost:5173/
# ➜ Press 'o' to open browser
```

### 4. Build for Production

```bash
# Build optimized bundle
yarn build

# Output location: app/dist/

# Preview production build locally
yarn preview

# Deploy to hosting:
# - Vercel: Connect repo, no extra config needed
# - Netlify: Connect repo or use: netlify deploy --prod --dir=dist
# - AWS S3: aws s3 sync dist/ s3://your-bucket-name
```

## 🧪 Testing Workflow

### Run All Tests

```bash
# From project root
anchor test

# Tests cover:
# - Program initialization
# - Collection creation
# - NFT minting
# - Listing management
# - Buying/selling
# - User profiles
# - Admin functions
# - Error scenarios
```

### Test with Verbose Output

```bash
# Show detailed output
anchor test -- --verbose

# Only run specific test
anchor test -- --grep "Create collection"
```

### Debug Failed Tests

```bash
# Get stack traces
anchor test -- --verbose 2>&1 | tail -50

# Check smart contract state
solana program show -um DxrR6os9PJUbAHWufA4CLbTRUi6E8fUVpTCDXbHMdMH3

# View transaction details
solana transaction <SIGNATURE>
```

## 🚀 Full Deployment Workflow

### Local Development

```bash
# Terminal 1: Start validator
solana-test-validator

# Terminal 2: Build and test
cd solgalaxy
anchor build
anchor test

# Terminal 3: Start frontend
cd app
yarn dev

# Open http://localhost:5173
```

### Devnet Deployment

```bash
# 1. Deploy smart contract
anchor deploy --provider.cluster devnet

# 2. Update frontend with new Program ID
# Edit app/.env.local

# 3. Rebuild frontend
cd app
yarn build

# 4. Deploy frontend
# Using Vercel (recommended):
vercel deploy --prod
```

### Mainnet Production

```bash
# 1. Final testing on devnet (see above)

# 2. Deploy to mainnet
anchor deploy --provider.cluster mainnet

# 3. Update frontend with mainnet Program ID
# Edit app/.env.local with mainnet values

# 4. Deploy frontend to production
cd app
yarn build
vercel deploy --prod
```

## 📝 Common Commands

```bash
# Build
anchor build

# Test
anchor test

# Deploy
anchor deploy --provider.cluster devnet

# Generate types
anchor build --idl

# Start validator
solana-test-validator

# Check balance
solana balance

# Get airdrop
solana airdrop 2 --url devnet

# View account
solana account <PUBKEY>

# View program
solana program show <PROGRAM_ID>

# View transaction
solana transaction <SIGNATURE>
```

## 🔍 Verification Commands

```bash
# Check compiled program size
ls -lh target/deploy/solgalaxy.so

# Verify deployment
solana program show DxrR6os9PJUbAHWufA4CLbTRUi6E8fUVpTCDXbHMdMH3 --url devnet

# Get program data account
solana program show -um DxrR6os9PJUbAHWufA4CLbTRUi6E8fUVpTCDXbHMdMH3

# View IDL (if deployed)
anchor idl fetch DxrR6os9PJUbAHWufA4CLbTRUi6E8fUVpTCDXbHMdMH3
```

## 🐛 Troubleshooting

### Build Errors

```bash
# Error: Failed to install anchor 0.29.0
# Solution: Use 0.31.1 (installed CLI version)
# Edit: programs/solgalaxy/Cargo.toml and Anchor.toml

# Error: cargo_build_sbf not found
# Solution: Install Solana build tools
cargo install cargo-build-sbf

# Error: `constant_time_eq` feature requires edition2024
# Solution: Use compatible dependency versions
# Clear cache: rm -rf ~/.cargo/registry/cache/*
```

### Test Failures

```bash
# Error: Account doesn't exist
# Solution: Initialize program state first

# Error: Insufficient funds
# Solution: Request more devnet SOL
solana airdrop 10 --url devnet

# Error: Transaction signature not found
# Solution: Increase commitment level or wait longer
```

### Deployment Issues

```bash
# Can't deploy (no balance)
solana airdrop 5 --url devnet

# Program ID already in use
# Generate new keypair:
solana-keygen new -o new_keypair.json

# Update Anchor.toml [programs.localnet] section
```

## 📊 File Sizes

After build, check optimizations:

```bash
ls -lh target/deploy/
# solgalaxy.so should be < 100KB (compact)

# Reduce size if needed:
# - Remove debug info (release build)
# - Remove unused imports
# - Optimize with LTO (Link Time Optimization)
```

## 🔐 Security Checklist

Before mainnet deployment:

- [ ] Code audit completed
- [ ] All tests passing
- [ ] No debug prints in production
- [ ] Error handling for edge cases
- [ ] Input validation for all params
- [ ] Overflow protection for calculations
- [ ] Signer checks on sensitive operations
- [ ] No hardcoded addresses
- [ ] Program tested on devnet thoroughly
- [ ] Admin keys secured

## 📚 Useful Links

- [Anchor Book](https://book.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Solana Docs](https://docs.solana.com/)
- [Solana GitHub](https://github.com/solana-labs)
- [Metaplex Documentation](https://developers.metaplex.com/)

## 🎯 Next Steps

1. **Test Locally**
   ```bash
   solana-test-validator &
   anchor test
   ```

2. **Deploy to Devnet**
   ```bash
   anchor deploy --provider.cluster devnet
   ```

3. **Test Frontend**
   ```bash
   cd app && yarn dev
   ```

4. **Verify Everything Works**
   - Create collection
   - Mint NFT
   - List NFT
   - Browse marketplace

5. **Deploy to Production**
   ```bash
   # After testing on devnet
   anchor deploy --provider.cluster mainnet
   vercel deploy --prod
   ```

---

**Last Updated**: February 2, 2026
**Version**: 1.0.0
**Status**: Ready for Deployment
