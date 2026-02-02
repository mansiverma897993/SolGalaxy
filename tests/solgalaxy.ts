import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solgalaxy } from "../target/types/solgalaxy";
import * as assert from "assert";

describe("solgalaxy", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Solgalaxy as Program<Solgalaxy>;
  const provider = anchor.getProvider();

  let programState: anchor.web3.PublicKey;
  let collection: anchor.web3.PublicKey;
  let nftMetadata: anchor.web3.PublicKey;
  let listing: anchor.web3.PublicKey;
  let userProfile: anchor.web3.PublicKey;

  // Test keypairs
  const adminKeypair = anchor.web3.Keypair.generate();
  const creatorKeypair = anchor.web3.Keypair.generate();
  const sellerKeypair = anchor.web3.Keypair.generate();
  const buyerKeypair = anchor.web3.Keypair.generate();
  const treasuryKeypair = anchor.web3.Keypair.generate();

  before(async () => {
    // Airdrop SOL to all keypairs for testing
    const airdropAmount = 10 * anchor.web3.LAMPORTS_PER_SOL;

    await provider.connection.requestAirdrop(adminKeypair.publicKey, airdropAmount);
    await provider.connection.requestAirdrop(creatorKeypair.publicKey, airdropAmount);
    await provider.connection.requestAirdrop(sellerKeypair.publicKey, airdropAmount);
    await provider.connection.requestAirdrop(buyerKeypair.publicKey, airdropAmount);

    // Wait for airdrop confirmation
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  it("Initialize program", async () => {
    const [programStatePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("solgalaxy")],
      program.programId
    );
    programState = programStatePda;

    await program.methods
      .initialize()
      .accounts({
        programState: programState,
        admin: adminKeypair.publicKey,
        treasury: treasuryKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([adminKeypair])
      .rpc();

    // Verify state
    const state = await program.account.programState.fetch(programState);
    assert.strictEqual(state.admin.toString(), adminKeypair.publicKey.toString());
    assert.strictEqual(state.treasury.toString(), treasuryKeypair.publicKey.toString());
    assert.strictEqual(state.feePercentage, 250); // 2.5%
    assert.strictEqual(state.totalCollections, 0);
  });

  it("Create collection", async () => {
    const collectionKeypair = anchor.web3.Keypair.generate();
    collection = collectionKeypair.publicKey;

    await program.methods
      .createCollection("Cosmic Series", "COSMIC", "A collection of cosmic-themed NFTs", 500)
      .accounts({
        programState: programState,
        collection: collection,
        creator: creatorKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([creatorKeypair, collectionKeypair])
      .rpc();

    // Verify collection
    const col = await program.account.collection.fetch(collection);
    assert.strictEqual(col.name, "Cosmic Series");
    assert.strictEqual(col.symbol, "COSMIC");
    assert.strictEqual(col.royaltyPercentage, 500); // 5%
    assert.strictEqual(col.totalItems, 0);
  });

  it("Mint NFT", async () => {
    const nftKeypair = anchor.web3.Keypair.generate();
    nftMetadata = nftKeypair.publicKey;

    const mintKeypair = anchor.web3.Keypair.generate();

    await program.methods
      .mintNft(
        "https://ipfs.io/ipfs/QmXxxx", // Mock IPFS URI
        "Cosmic Voyager #001",
        "legendary"
      )
      .accounts({
        programState: programState,
        collection: collection,
        nftMetadata: nftMetadata,
        mint: mintKeypair.publicKey,
        owner: sellerKeypair.publicKey,
        creator: creatorKeypair.publicKey,
        tokenProgram: anchor.web3.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([sellerKeypair, creatorKeypair, nftKeypair, mintKeypair])
      .rpc();

    // Verify NFT
    const nft = await program.account.nftMetadata.fetch(nftMetadata);
    assert.strictEqual(nft.name, "Cosmic Voyager #001");
    assert.strictEqual(nft.rarity, "legendary");
    assert.strictEqual(nft.isListed, false);
  });

  it("List NFT for sale", async () => {
    const listingKeypair = anchor.web3.Keypair.generate();
    listing = listingKeypair.publicKey;

    const price = new anchor.BN(2.5 * anchor.web3.LAMPORTS_PER_SOL); // 2.5 SOL

    await program.methods
      .listNft(price)
      .accounts({
        programState: programState,
        nftMetadata: nftMetadata,
        listing: listing,
        seller: sellerKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([sellerKeypair, listingKeypair])
      .rpc();

    // Verify listing
    const list = await program.account.listing.fetch(listing);
    assert.strictEqual(list.nft.toString(), nftMetadata.toString());
    assert.strictEqual(list.seller.toString(), sellerKeypair.publicKey.toString());
    assert.ok(list.price.eq(price));
    assert.strictEqual(list.active, true);

    // Verify NFT is marked as listed
    const nft = await program.account.nftMetadata.fetch(nftMetadata);
    assert.strictEqual(nft.isListed, true);
  });

  it("Update listing price", async () => {
    const newPrice = new anchor.BN(3 * anchor.web3.LAMPORTS_PER_SOL); // 3 SOL

    await program.methods
      .updateListingPrice(newPrice)
      .accounts({
        nftMetadata: nftMetadata,
        listing: listing,
        seller: sellerKeypair.publicKey,
      })
      .signers([sellerKeypair])
      .rpc();

    // Verify price update
    const list = await program.account.listing.fetch(listing);
    assert.ok(list.price.eq(newPrice));
  });

  it("Create user profile", async () => {
    const profileKeypair = anchor.web3.Keypair.generate();
    userProfile = profileKeypair.publicKey;

    await program.methods
      .createUserProfile("ArtCollector", "I love digital art and NFTs!")
      .accounts({
        userProfile: userProfile,
        user: buyerKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([buyerKeypair, profileKeypair])
      .rpc();

    // Verify profile
    const profile = await program.account.userProfile.fetch(userProfile);
    assert.strictEqual(profile.username, "ArtCollector");
    assert.strictEqual(profile.wallet.toString(), buyerKeypair.publicKey.toString());
  });

  it("Cancel listing", async () => {
    // Create a new listing to cancel
    const cancelListingKeypair = anchor.web3.Keypair.generate();
    const cancelListing = cancelListingKeypair.publicKey;

    // First, create and list another NFT
    const nft2Keypair = anchor.web3.Keypair.generate();
    const nft2Metadata = nft2Keypair.publicKey;

    const mint2Keypair = anchor.web3.Keypair.generate();

    await program.methods
      .mintNft(
        "https://ipfs.io/ipfs/QmYyyy",
        "Cosmic Voyager #002",
        "rare"
      )
      .accounts({
        programState: programState,
        collection: collection,
        nftMetadata: nft2Metadata,
        mint: mint2Keypair.publicKey,
        owner: sellerKeypair.publicKey,
        creator: creatorKeypair.publicKey,
        tokenProgram: anchor.web3.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([sellerKeypair, creatorKeypair, nft2Keypair, mint2Keypair])
      .rpc();

    // List it
    const listPrice = new anchor.BN(1.5 * anchor.web3.LAMPORTS_PER_SOL);

    await program.methods
      .listNft(listPrice)
      .accounts({
        programState: programState,
        nftMetadata: nft2Metadata,
        listing: cancelListing,
        seller: sellerKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([sellerKeypair, cancelListingKeypair])
      .rpc();

    // Now cancel it
    await program.methods
      .cancelListing()
      .accounts({
        nftMetadata: nft2Metadata,
        listing: cancelListing,
        seller: sellerKeypair.publicKey,
      })
      .signers([sellerKeypair])
      .rpc();

    // Verify cancellation
    const list = await program.account.listing.fetch(cancelListing);
    assert.strictEqual(list.active, false);

    const nft = await program.account.nftMetadata.fetch(nft2Metadata);
    assert.strictEqual(nft.isListed, false);
  });

  it("Update fee (admin only)", async () => {
    const newFee = 200; // 2%

    await program.methods
      .updateFee(newFee)
      .accounts({
        programState: programState,
        admin: adminKeypair.publicKey,
      })
      .signers([adminKeypair])
      .rpc();

    // Verify fee update
    const state = await program.account.programState.fetch(programState);
    assert.strictEqual(state.feePercentage, newFee);
  });

  it("Should fail: unauthorized fee update", async () => {
    const unauthorizedKeypair = anchor.web3.Keypair.generate();
    await provider.connection.requestAirdrop(
      unauthorizedKeypair.publicKey,
      5 * anchor.web3.LAMPORTS_PER_SOL
    );

    try {
      await program.methods
        .updateFee(300)
        .accounts({
          programState: programState,
          admin: unauthorizedKeypair.publicKey,
        })
        .signers([unauthorizedKeypair])
        .rpc();

      assert.fail("Should have failed with unauthorized error");
    } catch (error) {
      assert.ok(error.message.includes("Unauthorized"));
    }
  });

  it("Should fail: invalid collection name", async () => {
    const invalidCollectionKeypair = anchor.web3.Keypair.generate();

    try {
      await program.methods
        .createCollection("", "SYM", "Invalid name", 500)
        .accounts({
          programState: programState,
          collection: invalidCollectionKeypair.publicKey,
          creator: creatorKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([creatorKeypair, invalidCollectionKeypair])
        .rpc();

      assert.fail("Should have failed with invalid input error");
    } catch (error) {
      assert.ok(error.message.includes("InvalidInput"));
    }
  });

  it("Should fail: royalty exceeds max", async () => {
    const invalidRoyaltyKeypair = anchor.web3.Keypair.generate();

    try {
      await program.methods
        .createCollection("Test", "TEST", "Test collection", 6000) // 60% > 50% max
        .accounts({
          programState: programState,
          collection: invalidRoyaltyKeypair.publicKey,
          creator: creatorKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([creatorKeypair, invalidRoyaltyKeypair])
        .rpc();

      assert.fail("Should have failed with invalid input error");
    } catch (error) {
      assert.ok(error.message.includes("InvalidInput"));
    }
  });

  it("Should fail: list unowned NFT", async () => {
    const nftKeypair = anchor.web3.Keypair.generate();
    const nft3Metadata = nftKeypair.publicKey;

    // Someone else's NFT
    const mint3Keypair = anchor.web3.Keypair.generate();

    await program.methods
      .mintNft(
        "https://ipfs.io/ipfs/QmZzzz",
        "Cosmic Voyager #003",
        "uncommon"
      )
      .accounts({
        programState: programState,
        collection: collection,
        nftMetadata: nft3Metadata,
        mint: mint3Keypair.publicKey,
        owner: sellerKeypair.publicKey, // Owner is seller
        creator: creatorKeypair.publicKey,
        tokenProgram: anchor.web3.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([sellerKeypair, creatorKeypair, nftKeypair, mint3Keypair])
      .rpc();

    // Try to list as buyer (not owner)
    const listingKeypair = anchor.web3.Keypair.generate();

    try {
      await program.methods
        .listNft(new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL))
        .accounts({
          programState: programState,
          nftMetadata: nft3Metadata,
          listing: listingKeypair.publicKey,
          seller: buyerKeypair.publicKey, // Wrong seller
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([buyerKeypair, listingKeypair])
        .rpc();

      assert.fail("Should have failed with unauthorized error");
    } catch (error) {
      assert.ok(error.message.includes("Unauthorized"));
    }
  });
});
