# SolGalaxy Smart Contract - Rust Backend

A complete Solana-based NFT marketplace smart contract built with Anchor framework.

## 📋 Overview

The SolGalaxy smart contract provides a decentralized NFT marketplace with the following features:

- **Collection Management**: Create and manage NFT collections with customizable royalties
- **NFT Minting**: Mint NFTs within collections with metadata (URI, name, rarity)
- **Marketplace Listing**: List NFTs for sale with dynamic pricing
- **Trading**: Secure buy/sell transactions with automated fee and royalty distribution
- **User Profiles**: Create user profiles with bio and stats
- **Admin Controls**: Treasury management and fee configuration

## 🏗️ Architecture

### Core Data Structures

#### ProgramState
Stores global program configuration:
- `admin`: Admin wallet address
- `treasury`: Treasury wallet for collecting fees
- `fee_percentage`: Marketplace fee in basis points (100 = 1%)
- `total_collections`: Total collections created
- `total_nfts`: Total NFTs minted
- `total_listings`: Total active/completed listings
- `total_sales`: Total successful transactions

#### Collection
Represents an NFT collection:
- `creator`: Collection creator's wallet
- `name`: Collection name (max 50 chars)
- `symbol`: Collection symbol (max 10 chars)
- `description`: Collection description
- `royalty_percentage`: Creator royalty in basis points (100 = 1%)
- `total_items`: Number of NFTs in collection
- `created_at`: Creation timestamp
- `verified`: Verification status

#### NFTMetadata
Stores NFT information:
- `collection`: Parent collection address
- `creator`: NFT creator's wallet
- `owner`: Current NFT owner
- `mint`: Token mint address
- `uri`: IPFS/metadata URI
- `name`: NFT name
- `rarity`: Rarity classification
- `created_at`: Minting timestamp
- `is_listed`: Current listing status

#### Listing
Represents an active NFT sale:
- `nft`: NFT being sold
- `seller`: Seller's wallet
- `buyer`: Buyer's wallet (None if unsold)
- `price`: Price in lamports
- `created_at`: Listing creation timestamp
- `sold_at`: Sale completion timestamp
- `active`: Listing status

#### UserProfile
User account information:
- `wallet`: User's wallet address
- `username`: Display name (max 50 chars)
- `bio`: User bio (max 500 chars)
- `created_at`: Profile creation timestamp
- `nfts_owned`: Count of owned NFTs
- `nfts_created`: Count of created NFTs

## 🔧 Core Instructions

### 1. Initialize Program
```rust
initialize(ctx: Context<Initialize>) -> Result<()>
```
Sets up the program state with admin and treasury accounts.

**Required Accounts:**
- `program_state`: PDA for global state
- `admin`: Transaction signer (admin)
- `treasury`: Treasury wallet for fees
- `system_program`: For account creation

### 2. Create Collection
```rust
create_collection(
    ctx: Context<CreateCollection>,
    name: String,
    symbol: String,
    description: String,
    royalty_percentage: u16
) -> Result<()>
```
Creates a new NFT collection with configurable royalties (max 50%).

**Validation:**
- Name: 1-50 characters
- Symbol: 1-10 characters
- Royalty: 0-5000 basis points

### 3. Mint NFT
```rust
mint_nft(
    ctx: Context<MintNFT>,
    uri: String,
    name: String,
    rarity: String
) -> Result<()>
```
Mints a new NFT within a collection.

**Parameters:**
- `uri`: Metadata URI (1-200 chars) - typically IPFS hash
- `name`: NFT name (1-100 chars)
- `rarity`: Rarity tier (common/uncommon/rare/legendary)

### 4. List NFT
```rust
list_nft(ctx: Context<ListNFT>, price: u64) -> Result<()>
```
Lists an NFT for sale at specified price in lamports.

**Validation:**
- Price must be > 0
- NFT must not already be listed
- Caller must be NFT owner

### 5. Buy NFT
```rust
buy_nft(ctx: Context<BuyNFT>) -> Result<()>
```
Purchases a listed NFT with automatic fund distribution:
- Seller receives: `price - royalties - fee`
- Creator receives: royalty amount
- Treasury receives: platform fee

**Fund Distribution Example:**
```
Price: 10 SOL
Royalty: 5% → 0.5 SOL to creator
Fee: 2.5% → 0.25 SOL to treasury
Seller gets: 9.25 SOL
```

### 6. Cancel Listing
```rust
cancel_listing(ctx: Context<CancelListing>) -> Result<()>
```
Removes an active listing. Only the seller can cancel.

### 7. Update Listing Price
```rust
update_listing_price(ctx: Context<UpdateListingPrice>, new_price: u64) -> Result<()>
```
Updates price of an active listing. Only the seller can update.

### 8. Create User Profile
```rust
create_user_profile(
    ctx: Context<CreateUserProfile>,
    username: String,
    bio: String
) -> Result<()>
```
Creates a user profile for marketplace participation.

### 9. Update Fee (Admin Only)
```rust
update_fee(ctx: Context<UpdateFee>, new_fee_percentage: u16) -> Result<()>
```
Updates platform fee percentage (max 5% = 500 basis points).

### 10. Withdraw Treasury (Admin Only)
```rust
withdraw_treasury(ctx: Context<WithdrawTreasury>, amount: u64) -> Result<()>
```
Withdraws accumulated fees from treasury.

## 📊 Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 1000 | InvalidInput | Input validation failed |
| 1001 | Unauthorized | Caller not authorized for action |
| 1002 | AlreadyListed | NFT already listed for sale |
| 1003 | NotListed | NFT is not currently listed |
| 1004 | ListingNotActive | Listing has been cancelled or sold |
| 1005 | InsufficientFunds | Buyer lacks sufficient lamports |
| 1006 | Overflow | Arithmetic overflow detected |

## 🔐 Security Features

1. **Authorization Checks**: All sensitive operations verify caller identity
2. **Fund Protection**: SOL transfers use checked arithmetic to prevent overflows
3. **Input Validation**: String lengths and numerical ranges validated
4. **PDA Seeds**: Accounts use deterministic PDAs for predictable address generation
5. **State Integrity**: Proper state transitions (listed → unlisted, active → inactive)

## 📦 Deployment

### Prerequisites
```bash
- Rust 1.79+
- Solana CLI 1.18+
- Anchor CLI 0.31.1
- Node.js 18+
- Yarn or npm
```

### Build Instructions

```bash
# Navigate to project directory
cd solgalaxy

# Build the program
anchor build

# Generate IDL for frontend
anchor build --idl

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet
anchor deploy --provider.cluster mainnet
```

### Configuration

Update `Anchor.toml`:
```toml
[programs.localnet]
solgalaxy = "YOUR_PROGRAM_ID"

[provider]
cluster = "localnet"  # or devnet/mainnet
wallet = "~/.config/solana/id.json"
```

## 🧪 Testing

```bash
# Run all tests
anchor test

# Run specific test file
anchor test tests/solgalaxy.ts

# Run with verbose output
anchor test -- --verbose
```

## 💰 Economics

### Fee Structure
- **Platform Fee**: 2.5% (configurable, max 5%)
- **Creator Royalty**: Configurable per collection (max 50%)

### Example Transaction
```
NFT Listed at: 10 SOL

Fees (2.5%): 0.25 SOL → Treasury
Royalties (5%): 0.5 SOL → Creator
Seller Amount: 9.25 SOL
```

## 🔗 Integration with Frontend

The React frontend (`app/src/`) connects via:

1. **Wallet Connection**: @solana/wallet-adapter-react
2. **Program Interaction**: @coral-xyz/anchor
3. **RPC Calls**: Solana web3.js

### Frontend Services
- `services/solana.ts`: Program initialization and interactions
- `services/api.ts`: External API calls
- `pages/Browse.tsx`: NFT browsing
- `pages/ListNFT.tsx`: NFT creation
- `pages/Collections.tsx`: Collection management

## 📝 Constants

```rust
// Seeds for PDA derivation
SOLGALAXY_SEED: b"solgalaxy"
NFT_SEED: b"nft"
LISTING_SEED: b"listing"
COLLECTION_SEED: b"collection"
USER_SEED: b"user"

// Limits
MAX_NAME_LENGTH: 50-100 chars
MAX_DESCRIPTION: 200-500 chars
MAX_ROYALTY: 5000 basis points (50%)
MAX_FEE: 500 basis points (5%)
```

## 🚀 Future Enhancements

- [ ] Auction system with bid tracking
- [ ] Batch operations for multiple NFTs
- [ ] Collection verification system
- [ ] Offer/counter-offer mechanism
- [ ] Escrow for conditional transfers
- [ ] Multi-signature support
- [ ] Rent exemption strategies
- [ ] Collection statistics tracking

## 📚 Resources

- [Anchor Documentation](https://docs.rs/anchor-lang/)
- [Solana Developer Docs](https://docs.solana.com/)
- [SPL Token Program](https://spl.solana.com/token)
- [Program Derived Addresses](https://docs.solana.com/developing/programming-model/calling-between-programs#program-derived-addresses)

## 📄 License

This project is part of the SolGalaxy marketplace and follows the same license terms.

## 🤝 Support

For issues or questions:
1. Check the error codes section above
2. Review the source code comments
3. Consult Solana documentation
4. Open an issue on the repository

---

**Last Updated**: February 2, 2026
**Version**: 1.0.0
**Status**: Production Ready
