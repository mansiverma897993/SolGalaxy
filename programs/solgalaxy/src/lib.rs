use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, Mint};
use std::mem::size_of;

declare_id!("DxrR6os9PJUbAHWufA4CLbTRUi6E8fUVpTCDXbHMdMH3");

pub const SOLGALAXY_SEED: &[u8] = b"solgalaxy";
pub const NFT_SEED: &[u8] = b"nft";
pub const LISTING_SEED: &[u8] = b"listing";
pub const COLLECTION_SEED: &[u8] = b"collection";
pub const USER_SEED: &[u8] = b"user";

#[program]
pub mod solgalaxy {
    use super::*;

    // Initialize the program state
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let program_state = &mut ctx.accounts.program_state;
        program_state.admin = ctx.accounts.admin.key();
        program_state.treasury = ctx.accounts.treasury.key();
        program_state.fee_percentage = 250; // 2.5% in basis points
        program_state.total_collections = 0;
        program_state.total_nfts = 0;
        program_state.total_listings = 0;
        program_state.total_sales = 0;
        
        msg!("SolGalaxy NFT Marketplace initialized");
        Ok(())
    }

    // Create a new collection
    pub fn create_collection(
        ctx: Context<CreateCollection>,
        name: String,
        symbol: String,
        description: String,
        royalty_percentage: u16,
    ) -> Result<()> {
        require!(name.len() > 0 && name.len() <= 50, ErrorCode::InvalidInput);
        require!(symbol.len() > 0 && symbol.len() <= 10, ErrorCode::InvalidInput);
        require!(royalty_percentage <= 5000, ErrorCode::InvalidInput); // Max 50% royalty

        let collection = &mut ctx.accounts.collection;
        collection.creator = ctx.accounts.creator.key();
        collection.name = name;
        collection.symbol = symbol;
        collection.description = description;
        collection.royalty_percentage = royalty_percentage;
        collection.total_items = 0;
        collection.created_at = Clock::get()?.unix_timestamp;
        collection.verified = false;

        let program_state = &mut ctx.accounts.program_state;
        program_state.total_collections += 1;

        msg!("Collection created: {}", collection.name);
        Ok(())
    }

    // Mint an NFT (simplified without actual minting)
    pub fn mint_nft(
        ctx: Context<MintNFT>,
        uri: String,
        name: String,
        rarity: String,
    ) -> Result<()> {
        require!(uri.len() > 0 && uri.len() <= 200, ErrorCode::InvalidInput);
        require!(name.len() > 0 && name.len() <= 100, ErrorCode::InvalidInput);

        let nft_metadata = &mut ctx.accounts.nft_metadata;
        nft_metadata.collection = ctx.accounts.collection.key();
        nft_metadata.creator = ctx.accounts.creator.key();
        nft_metadata.mint = ctx.accounts.mint.key();
        nft_metadata.uri = uri;
        nft_metadata.name = name;
        nft_metadata.rarity = rarity;
        nft_metadata.created_at = Clock::get()?.unix_timestamp;
        nft_metadata.is_listed = false;
        nft_metadata.owner = ctx.accounts.owner.key();

        // Update collection
        let collection = &mut ctx.accounts.collection;
        collection.total_items += 1;

        let program_state = &mut ctx.accounts.program_state;
        program_state.total_nfts += 1;

        msg!("NFT minted: {} in collection: {}", nft_metadata.name, collection.name);
        Ok(())
    }

    // List NFT for sale
    pub fn list_nft(
        ctx: Context<ListNFT>,
        price: u64,
    ) -> Result<()> {
        require!(price > 0, ErrorCode::InvalidInput);

        let nft_metadata = &ctx.accounts.nft_metadata;
        require!(!nft_metadata.is_listed, ErrorCode::AlreadyListed);
        require!(nft_metadata.owner == ctx.accounts.seller.key(), ErrorCode::Unauthorized);

        let listing = &mut ctx.accounts.listing;
        listing.nft = ctx.accounts.nft_metadata.key();
        listing.seller = ctx.accounts.seller.key();
        listing.price = price;
        listing.created_at = Clock::get()?.unix_timestamp;
        listing.active = true;

        let nft_metadata_mut = &mut ctx.accounts.nft_metadata;
        nft_metadata_mut.is_listed = true;

        let program_state = &mut ctx.accounts.program_state;
        program_state.total_listings += 1;

        msg!("NFT listed for sale at {} lamports", price);
        Ok(())
    }

    // Buy NFT
    pub fn buy_nft(
        ctx: Context<BuyNFT>,
    ) -> Result<()> {
        let listing = &ctx.accounts.listing;
        require!(listing.active, ErrorCode::ListingNotActive);

        let nft_metadata = &ctx.accounts.nft_metadata;
        require!(nft_metadata.is_listed, ErrorCode::NotListed);

        let buyer_lamports = ctx.accounts.buyer.lamports();
        require!(buyer_lamports >= listing.price, ErrorCode::InsufficientFunds);

        // Calculate fees and royalties
        let price = listing.price;
        let collection = &ctx.accounts.collection;
        let royalty_amount = (price as u128 * collection.royalty_percentage as u128 / 10000) as u64;
        let program_fee = (price as u128 * ctx.accounts.program_state.fee_percentage as u128 / 10000) as u64;
        let seller_amount = price.saturating_sub(royalty_amount).saturating_sub(program_fee);

        // Transfer SOL to seller
        ctx.accounts.seller.add_lamports(seller_amount);
        ctx.accounts.buyer.subtract_lamports(seller_amount);

        // Transfer royalties to creator
        let creator = &ctx.accounts.collection_creator;
        creator.add_lamports(royalty_amount);
        ctx.accounts.buyer.subtract_lamports(royalty_amount);

        // Transfer program fee to treasury
        let treasury = &ctx.accounts.treasury;
        treasury.add_lamports(program_fee);
        ctx.accounts.buyer.subtract_lamports(program_fee);

        // Update listing and NFT metadata
        let listing_mut = &mut ctx.accounts.listing;
        listing_mut.active = false;
        listing_mut.buyer = Some(ctx.accounts.buyer.key());
        listing_mut.sold_at = Some(Clock::get()?.unix_timestamp);

        let nft_metadata_mut = &mut ctx.accounts.nft_metadata;
        nft_metadata_mut.is_listed = false;
        nft_metadata_mut.owner = ctx.accounts.buyer.key();

        let program_state = &mut ctx.accounts.program_state;
        program_state.total_sales += 1;

        msg!("NFT sold for {} lamports", price);
        Ok(())
    }

    // Cancel listing
    pub fn cancel_listing(
        ctx: Context<CancelListing>,
    ) -> Result<()> {
        let listing = &ctx.accounts.listing;
        require!(listing.active, ErrorCode::ListingNotActive);
        require!(listing.seller == ctx.accounts.seller.key(), ErrorCode::Unauthorized);

        let listing_mut = &mut ctx.accounts.listing;
        listing_mut.active = false;

        let nft_metadata_mut = &mut ctx.accounts.nft_metadata;
        nft_metadata_mut.is_listed = false;

        msg!("Listing cancelled");
        Ok(())
    }

    // Update listing price
    pub fn update_listing_price(
        ctx: Context<UpdateListingPrice>,
        new_price: u64,
    ) -> Result<()> {
        require!(new_price > 0, ErrorCode::InvalidInput);

        let listing = &ctx.accounts.listing;
        require!(listing.active, ErrorCode::ListingNotActive);
        require!(listing.seller == ctx.accounts.seller.key(), ErrorCode::Unauthorized);

        let listing_mut = &mut ctx.accounts.listing;
        listing_mut.price = new_price;

        msg!("Listing price updated to {} lamports", new_price);
        Ok(())
    }

    // Create user profile
    pub fn create_user_profile(
        ctx: Context<CreateUserProfile>,
        username: String,
        bio: String,
    ) -> Result<()> {
        require!(username.len() > 0 && username.len() <= 50, ErrorCode::InvalidInput);
        require!(bio.len() <= 500, ErrorCode::InvalidInput);

        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.wallet = ctx.accounts.user.key();
        user_profile.username = username;
        user_profile.bio = bio;
        user_profile.created_at = Clock::get()?.unix_timestamp;
        user_profile.nfts_owned = 0;
        user_profile.nfts_created = 0;

        msg!("User profile created");
        Ok(())
    }

    // Update program fee (admin only)
    pub fn update_fee(
        ctx: Context<UpdateFee>,
        new_fee_percentage: u16,
    ) -> Result<()> {
        require!(ctx.accounts.admin.key() == ctx.accounts.program_state.admin, ErrorCode::Unauthorized);
        require!(new_fee_percentage <= 500, ErrorCode::InvalidInput); // Max 5% fee

        let program_state = &mut ctx.accounts.program_state;
        program_state.fee_percentage = new_fee_percentage;

        msg!("Fee updated to {} basis points", new_fee_percentage);
        Ok(())
    }

    // Withdraw treasury funds (admin only)
    pub fn withdraw_treasury(
        ctx: Context<WithdrawTreasury>,
        amount: u64,
    ) -> Result<()> {
        require!(ctx.accounts.admin.key() == ctx.accounts.program_state.admin, ErrorCode::Unauthorized);

        let treasury_lamports = ctx.accounts.treasury.lamports();
        require!(treasury_lamports >= amount, ErrorCode::InsufficientFunds);

        ctx.accounts.treasury.subtract_lamports(amount);
        ctx.accounts.admin.add_lamports(amount);

        msg!("Withdrew {} lamports from treasury", amount);
        Ok(())
    }
}

// Accounts Structures

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = admin, space = 8 + size_of::<ProgramState>(), seeds = [SOLGALAXY_SEED], bump)]
    pub program_state: Account<'info, ProgramState>,
    #[account(mut)]
    pub admin: Signer<'info>,
    /// CHECK: Treasury account to receive fees
    #[account(mut)]
    pub treasury: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateCollection<'info> {
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    #[account(init, payer = creator, space = 8 + size_of::<Collection>() + 200)]
    pub collection: Account<'info, Collection>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    #[account(mut)]
    pub collection: Account<'info, Collection>,
    #[account(init, payer = owner, space = 8 + size_of::<NFTMetadata>() + 300)]
    pub nft_metadata: Account<'info, NFTMetadata>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub creator: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListNFT<'info> {
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    #[account(mut)]
    pub nft_metadata: Account<'info, NFTMetadata>,
    #[account(init, payer = seller, space = 8 + size_of::<Listing>())]
    pub listing: Account<'info, Listing>,
    #[account(mut)]
    pub seller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyNFT<'info> {
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    pub collection: Account<'info, Collection>,
    #[account(mut)]
    pub nft_metadata: Account<'info, NFTMetadata>,
    #[account(mut)]
    pub listing: Account<'info, Listing>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: Seller account
    #[account(mut)]
    pub seller: AccountInfo<'info>,
    /// CHECK: Treasury account
    #[account(mut)]
    pub treasury: AccountInfo<'info>,
    /// CHECK: Collection creator for royalties
    #[account(mut)]
    pub collection_creator: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CancelListing<'info> {
    #[account(mut)]
    pub nft_metadata: Account<'info, NFTMetadata>,
    #[account(mut)]
    pub listing: Account<'info, Listing>,
    #[account(mut)]
    pub seller: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateListingPrice<'info> {
    pub nft_metadata: Account<'info, NFTMetadata>,
    #[account(mut)]
    pub listing: Account<'info, Listing>,
    #[account(mut)]
    pub seller: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreateUserProfile<'info> {
    #[account(init, payer = user, space = 8 + size_of::<UserProfile>() + 550)]
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateFee<'info> {
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawTreasury<'info> {
    pub program_state: Account<'info, ProgramState>,
    #[account(mut)]
    pub treasury: AccountInfo<'info>,
    #[account(mut)]
    pub admin: Signer<'info>,
}

// State Structures

#[account]
pub struct ProgramState {
    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub fee_percentage: u16, // in basis points (100 = 1%)
    pub total_collections: u64,
    pub total_nfts: u64,
    pub total_listings: u64,
    pub total_sales: u64,
}

#[account]
pub struct Collection {
    pub creator: Pubkey,
    pub name: String,
    pub symbol: String,
    pub description: String,
    pub royalty_percentage: u16, // in basis points (100 = 1%)
    pub total_items: u64,
    pub created_at: i64,
    pub verified: bool,
}

#[account]
pub struct NFTMetadata {
    pub collection: Pubkey,
    pub creator: Pubkey,
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub uri: String,
    pub name: String,
    pub rarity: String,
    pub created_at: i64,
    pub is_listed: bool,
}

#[account]
pub struct Listing {
    pub nft: Pubkey,
    pub seller: Pubkey,
    pub buyer: Option<Pubkey>,
    pub price: u64,
    pub created_at: i64,
    pub sold_at: Option<i64>,
    pub active: bool,
}

#[account]
pub struct UserProfile {
    pub wallet: Pubkey,
    pub username: String,
    pub bio: String,
    pub created_at: i64,
    pub nfts_owned: u64,
    pub nfts_created: u64,
}

// Error codes

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid input")]
    InvalidInput,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("NFT is already listed")]
    AlreadyListed,
    #[msg("NFT is not listed")]
    NotListed,
    #[msg("Listing is not active")]
    ListingNotActive,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Arithmetic overflow")]
    Overflow,
}
