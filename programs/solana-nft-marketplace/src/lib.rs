pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
pub mod mint;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;
pub use mint::*;

declare_id!("EbMSjqEwMb164yU4zn9QCK3SCb7xGFcR5cCUnACuXM9V");

#[program]
pub mod solana_nft_marketplace {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }
}
