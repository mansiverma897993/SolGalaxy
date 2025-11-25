use anchor_lang::prelude::*;
use mpl_core::{
    ID as MPL_CORE_ID,
    accounts::BaseCollectionV1
};

use crate::{Seat};

#[derive(Accounts)]
pub struct MintSeat<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        space= 8 + Seat::INIT_SPACE,
        payer= signer,
        seeds = [b"seat".as_ref(), payer.key().as_ref()],
        bump,
    )]
    pub seat: Account<'info, Seat>,

    #[account(mut)]
    pub update_authority: Signer<'info>,

    #[account(mut, constraint=collection.update_authority==signer.key())]
    pub collection: Option<Account<info, BaseCollection>>,


    pub asset: Signer<'info>,

    #[account(address=MPL_CORE_ID)]
//check: checked in mpl-core
    pub mpl_core_program: uncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

// pub fn process_mint_seat(ctx: Context<MintSeat>, seat_number: u8, reserved_time: i64, departure_time: i64, arrival_time: i64) -> Result<()> {
//     let seat = &mut ctx.accounts.seat;
//     seat.bump = *ctx.bumps.get("seat").unwrap();
//     seat.owner = ctx.accounts.payer.key();
//     seat.seat_number = seat_number;
//     seat.is_occupied = false;
//     seat.reserved_time = reserved_time;
//     seat.departure_time = departure_time;
//     seat.arrival_time = arrival_time;
//     seat.is_used = false;
//     seat.checked_in = false;
//     seat.checked_in_time = None;

//     Ok(())
32 minutes 
}