# SolGalaxy Frontend-Backend Integration Guide

This document provides comprehensive integration instructions for connecting the React frontend with the Solana smart contract backend.

## 📋 Overview

The SolGalaxy marketplace consists of:
- **Backend**: Anchor-based Solana smart contract (`programs/solgalaxy/`)
- **Frontend**: React + TypeScript application (`app/src/`)
- **Tests**: TypeScript test suite (`tests/`)

## 🔗 Architecture Diagram

```
┌─────────────────────────────┐
│   React Frontend (Next.js)  │
│   - Browse NFTs             │
│   - List NFTs               │
│   - Buy/Sell                │
│   - User Profiles           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Anchor/Web3.js Client      │
│  - Program connection       │
│  - Transaction building     │
│  - Account fetching         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Solana Blockchain (RPC)    │
│  - Program ID: [deployed]   │
│  - Devnet/Mainnet           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Smart Contract             │
│  - Collections              │
│  - Minting                  │
│  - Listings                 │
│  - Trading                  │
└─────────────────────────────┘
```

## 🚀 Setup Instructions

### 1. Deploy Smart Contract

```bash
# Build the program
cd /home/mansi_verma/solgalaxy
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Get your Program ID from the output
# Update it in Anchor.toml and your frontend
```

### 2. Generate Frontend Types

```bash
# Generate TypeScript types from IDL
anchor build --idl

# Update frontend services with new types:
# cp target/idl/solgalaxy.json app/src/idl/
```

### 3. Update Frontend Configuration

Create or update `app/src/config/index.ts`:

```typescript
export const PROGRAM_ID = new PublicKey("YOUR_DEPLOYED_PROGRAM_ID");
export const NETWORK = "devnet"; // or "mainnet"
export const RPC_ENDPOINT = "https://api.devnet.solana.com";

export const COLLECTION_SEED = "collection";
export const NFT_SEED = "nft";
export const LISTING_SEED = "listing";
export const USER_SEED = "user";
```

## 📚 Frontend Service Integration

### `services/solana.ts` - Main Integration Service

This service handles all blockchain interactions:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Connection } from "@solana/web3.js";

export class SolanaService {
  private program: anchor.Program;
  private connection: Connection;

  constructor(rpcEndpoint: string, programId: PublicKey, idl: any) {
    this.connection = new Connection(rpcEndpoint);
    const provider = new anchor.AnchorProvider(
      this.connection,
      // Wallet will be set from React context
      {} as any,
      { commitment: "processed" }
    );
    this.program = new anchor.Program(idl, programId, provider);
  }

  // Initialize program state
  async initialize(admin: PublicKey, treasury: PublicKey) {
    const [programState] = PublicKey.findProgramAddressSync(
      [Buffer.from("solgalaxy")],
      this.program.programId
    );

    const tx = await this.program.methods
      .initialize()
      .accounts({
        programState,
        admin,
        treasury,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  // Create collection
  async createCollection(
    creator: PublicKey,
    name: string,
    symbol: string,
    description: string,
    royaltyPercentage: number
  ) {
    const collectionKeypair = anchor.web3.Keypair.generate();

    const [programState] = PublicKey.findProgramAddressSync(
      [Buffer.from("solgalaxy")],
      this.program.programId
    );

    const tx = await this.program.methods
      .createCollection(name, symbol, description, royaltyPercentage)
      .accounts({
        programState,
        collection: collectionKeypair.publicKey,
        creator,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([collectionKeypair])
      .rpc();

    return { tx, collectionAddress: collectionKeypair.publicKey };
  }

  // Mint NFT
  async mintNFT(
    creator: PublicKey,
    collection: PublicKey,
    uri: string,
    name: string,
    rarity: string
  ) {
    const nftKeypair = anchor.web3.Keypair.generate();
    const mintKeypair = anchor.web3.Keypair.generate();

    const [programState] = PublicKey.findProgramAddressSync(
      [Buffer.from("solgalaxy")],
      this.program.programId
    );

    const tx = await this.program.methods
      .mintNft(uri, name, rarity)
      .accounts({
        programState,
        collection,
        nftMetadata: nftKeypair.publicKey,
        mint: mintKeypair.publicKey,
        owner: creator,
        creator,
        tokenProgram: anchor.web3.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([nftKeypair, mintKeypair])
      .rpc();

    return { tx, nftAddress: nftKeypair.publicKey };
  }

  // List NFT
  async listNFT(
    seller: PublicKey,
    nftMetadata: PublicKey,
    price: anchor.BN
  ) {
    const listingKeypair = anchor.web3.Keypair.generate();

    const [programState] = PublicKey.findProgramAddressSync(
      [Buffer.from("solgalaxy")],
      this.program.programId
    );

    const tx = await this.program.methods
      .listNft(price)
      .accounts({
        programState,
        nftMetadata,
        listing: listingKeypair.publicKey,
        seller,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([listingKeypair])
      .rpc();

    return { tx, listingAddress: listingKeypair.publicKey };
  }

  // Fetch listings
  async getListings(collection?: PublicKey) {
    const listings = await this.program.account.listing.all();

    if (collection) {
      return listings.filter(
        (l) => l.account.nft.toString() === collection.toString()
      );
    }

    return listings;
  }

  // Fetch NFTs
  async getNFTs(collection?: PublicKey) {
    const nfts = await this.program.account.nftMetadata.all();

    if (collection) {
      return nfts.filter(
        (n) => n.account.collection.toString() === collection.toString()
      );
    }

    return nfts;
  }

  // Fetch collections
  async getCollections() {
    return await this.program.account.collection.all();
  }

  // Fetch user profile
  async getUserProfile(user: PublicKey) {
    const [profilePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user.toBuffer()],
      this.program.programId
    );

    return await this.program.account.userProfile.fetch(profilePda);
  }
}
```

### `pages/Browse.tsx` - Display NFTs

```typescript
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SolanaService } from "../services/solana";
import NFTCard from "../components/NFTCard";

export default function Browse() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNFTs = async () => {
      if (!publicKey) return;

      try {
        const solanaService = new SolanaService(
          connection.rpcEndpoint,
          new PublicKey(process.env.REACT_APP_PROGRAM_ID!),
          require("../idl/solgalaxy.json")
        );

        // Fetch all listings
        const allListings = await solanaService.getListings();
        const activeListings = allListings.filter((l) => l.account.active);

        // Fetch NFT metadata for each listing
        const nftDetailsPromises = activeListings.map((listing) =>
          solanaService.program.account.nftMetadata.fetch(
            listing.account.nft
          )
        );

        const nftDetails = await Promise.all(nftDetailsPromises);

        const nftWithPrices = nftDetails.map((nft, idx) => ({
          ...nft,
          price: activeListings[idx].account.price.toNumber() / LAMPORTS_PER_SOL,
          listingAddress: activeListings[idx].publicKey,
        }));

        setNfts(nftWithPrices);
      } catch (error) {
        console.error("Error loading NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [publicKey, connection]);

  if (loading) return <div>Loading NFTs...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {nfts.map((nft) => (
        <NFTCard
          key={nft.mint}
          name={nft.name}
          image={nft.uri}
          price={nft.price}
          rarity={nft.rarity}
        />
      ))}
    </div>
  );
}
```

### `pages/ListNFT.tsx` - Create Listings

```typescript
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { SolanaService } from "../services/solana";

export default function ListNFT() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [collection, setCollection] = useState<PublicKey | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    uri: "",
    rarity: "common",
    price: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleMintAndList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !collection) return;

    setLoading(true);

    try {
      const solanaService = new SolanaService(
        connection.rpcEndpoint,
        new PublicKey(process.env.REACT_APP_PROGRAM_ID!),
        require("../idl/solgalaxy.json")
      );

      // Step 1: Mint NFT
      const { nftAddress } = await solanaService.mintNFT(
        publicKey,
        collection,
        formData.uri,
        formData.name,
        formData.rarity
      );

      // Step 2: List NFT
      const price = new anchor.BN(formData.price * anchor.web3.LAMPORTS_PER_SOL);
      await solanaService.listNFT(publicKey, nftAddress, price);

      alert("NFT minted and listed successfully!");

      // Reset form
      setFormData({
        name: "",
        description: "",
        uri: "",
        rarity: "common",
        price: 0,
      });
    } catch (error) {
      console.error("Error minting and listing:", error);
      alert("Error creating listing. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleMintAndList} className="max-w-2xl mx-auto">
      <div className="mb-4">
        <label className="block text-white mb-2">NFT Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-white mb-2">IPFS URI</label>
        <input
          type="text"
          value={formData.uri}
          onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
          placeholder="https://ipfs.io/ipfs/QmXxxx"
          className="w-full px-4 py-2 bg-gray-800 text-white rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-white mb-2">Rarity</label>
        <select
          value={formData.rarity}
          onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded"
        >
          <option>common</option>
          <option>uncommon</option>
          <option>rare</option>
          <option>legendary</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-white mb-2">Price (SOL)</label>
        <input
          type="number"
          step="0.1"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) })
          }
          className="w-full px-4 py-2 bg-gray-800 text-white rounded"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Mint & List NFT"}
      </button>
    </form>
  );
}
```

## 🔄 Key Integration Points

### 1. Wallet Connection
```typescript
import { WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

<ConnectionProvider endpoint={RPC_ENDPOINT}>
  <WalletProvider wallets={[new PhantomWalletAdapter()]} autoConnect>
    <App />
  </WalletProvider>
</ConnectionProvider>
```

### 2. Account Initialization
```typescript
// PDAs must be initialized before use
const [programState] = PublicKey.findProgramAddressSync(
  [Buffer.from("solgalaxy")],
  programId
);
```

### 3. Transaction Building
```typescript
const tx = await program.methods
  .instruction(params)
  .accounts(accountsObj)
  .signers([keypairs])
  .rpc();
```

### 4. State Queries
```typescript
// Fetch all of an account type
const all = await program.account.collection.all();

// Fetch specific account
const item = await program.account.collection.fetch(publicKey);
```

## 🧪 Testing Integration

Run the comprehensive test suite:

```bash
# Run all tests
anchor test

# Run with output
anchor test -- --verbose

# Run specific test
anchor test -- --grep "Create collection"
```

## 🔐 Security Considerations

1. **Wallet Safety**
   - Always use official wallet adapters
   - Never expose private keys
   - Validate wallet connections

2. **Transaction Validation**
   - Check transaction signatures
   - Verify account states before and after
   - Handle network timeouts gracefully

3. **Input Validation**
   - Sanitize user inputs on frontend
   - Smart contract validates again
   - Use reasonable limits for strings

4. **Error Handling**
   - Catch network errors
   - Handle insufficient balance scenarios
   - Display user-friendly error messages

## 📊 Common Workflows

### Workflow 1: Mint & List an NFT

```
1. User connects wallet
2. User selects collection
3. User fills in NFT details (name, description, price)
4. Frontend calls mintNFT() → Smart contract creates NFTMetadata account
5. Frontend calls listNFT() → Smart contract creates Listing account
6. NFT now appears in marketplace
```

### Workflow 2: Buy an NFT

```
1. User finds NFT in Browse page
2. User clicks "Buy" button
3. Frontend calls buyNFT() with Listing account
4. Smart contract:
   - Transfers SOL to seller (minus fees/royalties)
   - Transfers SOL to creator (royalties)
   - Transfers SOL to treasury (fees)
   - Updates NFT ownership
   - Closes Listing account
5. Buyer now owns NFT
```

### Workflow 3: Manage Listing

```
1. User navigates to Profile
2. User sees their active listings
3. User can:
   - Update price (updateListingPrice)
   - Cancel listing (cancelListing)
   - View sale history
```

## 🐛 Troubleshooting

### "Program not found"
- Ensure Program ID matches deployed contract
- Check correct RPC endpoint
- Verify network (devnet vs mainnet)

### "Account doesn't exist"
- Initialize accounts first
- Check account addresses are correct
- Verify account wasn't closed

### "Insufficient funds"
- Check buyer has enough SOL
- Account rent is deducted automatically
- Price includes network fees

### "Unauthorized"
- Verify caller is correct signer
- Check collection creator matches
- Ensure NFT owner matches seller

## 📝 Environment Variables

Create `.env.local` in the `app` directory:

```env
REACT_APP_PROGRAM_ID=YOUR_DEPLOYED_PROGRAM_ID
REACT_APP_NETWORK=devnet
REACT_APP_RPC_ENDPOINT=https://api.devnet.solana.com
REACT_APP_WS_ENDPOINT=wss://api.devnet.solana.com
```

## 🚀 Deployment Checklist

- [ ] Smart contract deployed and verified
- [ ] Program ID updated in frontend config
- [ ] IDL generated and updated
- [ ] Environment variables configured
- [ ] Tests passing
- [ ] Wallet adapters configured
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] User feedback messages shown
- [ ] Security audit completed

## 📞 Support & Resources

- [Anchor Documentation](https://docs.rs/anchor-lang/)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
- [Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Solana Discord](https://discord.gg/solana)

---

**Last Updated**: February 2, 2026
**Status**: Production Ready
