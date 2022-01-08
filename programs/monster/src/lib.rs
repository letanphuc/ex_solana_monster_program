use anchor_lang::prelude::*;
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

mod resource;

declare_id!("CS6D873spGxAgZPWokgsi5CmvTt4wsqtyhaFyMxmRe2j");

const RELEASE_PUBKEY: [u8; 32] = [0 as u8; 32];

fn random_u16(seed: u8) -> u16 {
    match Clock::get() {
        Ok(clock) => {
            let mut hasher = DefaultHasher::new();
            (clock.unix_timestamp + seed as i64).hash(&mut hasher);
            let ret = hasher.finish();
            return ret as u16;
        }
        Err(e) => {
            msg!("e = {}", e);
            0
        }
    }
}

fn random_monster_type() -> usize {
    let mut r = random_u16(100) % (100 * 100);
    msg!("Randome monster type is: {}", r);
    for i in 0..resource::MONSTER_TYPES.len() {
        if r < resource::MONSTER_TYPES[i].range {
            return i;
        }
        else {
            r -= resource::MONSTER_TYPES[i].range
        }
    }

    // By default
    return 0;
}

pub fn dam_compute(attacker: &mut Account<Monster>, defencer: &mut Account<Monster>) {
    if attacker.state == (MonsterState::READY as u8) {
        // calculate damage
        if attacker.att > defencer.def {
            let dam = attacker.att - defencer.def;
            if defencer.current_hp > dam {
                defencer.current_hp -= dam
            }
            else {
                defencer.current_hp = 0
            }
        }
        
        // attacker takes little dam
        attacker.current_hp -= 1;

        // change states of monsters
        attacker.state = MonsterState::RECOVER as u8;
        defencer.state = MonsterState::READY as u8;

        msg!("Got here: hp = {}, {}", attacker.current_hp, defencer.current_hp);
    }
    else {
        msg!("Monster state {} cannot do attack!", attacker.state);
    }
    
}


#[program]
mod basic_1 {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        authority: Pubkey,
    ) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;

        // owner
        my_account.authority = authority;

        // random stat
        my_account.att = random_u16(1);
        my_account.satt = random_u16(2);
        my_account.def = random_u16(3);
        my_account.sdef = random_u16(4);
        my_account.hp = random_u16(5);

        // init attribute
        let monster = random_monster_type();
        my_account.image_hash = resource::MONSTER_TYPES[monster].hash;
        my_account.name = resource::MONSTER_TYPES[monster].name;

        // init state
        my_account.current_hp = my_account.hp;
        my_account.state = MonsterState::READY as u8;

        my_account.borrow_count = 0;
        my_account.borrower = Pubkey::new(&RELEASE_PUBKEY);

        // Done
        msg!("new: got here, data = {:?}", my_account);

        Ok(())
    }

    pub fn set_name(ctx: Context<OwnerContext>, name: [u8; 32]) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        my_account.name = name;
        msg!("set_name: got here, data = {:?}", my_account);
        Ok(())
    }

    pub fn release(ctx: Context<OwnerContext>) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        my_account.authority = Pubkey::new(&RELEASE_PUBKEY);
        msg!("release: got here, data = {:?}", my_account);
        Ok(())
    }

    pub fn transfer(ctx: Context<OwnerContext>, new_owner: Pubkey) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        my_account.authority = new_owner;
        msg!("transfer: got here, data = {:?}", my_account);
        Ok(())
    }

    pub fn rent(ctx: Context<OwnerContext>, borrower: Pubkey) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        my_account.borrower = borrower;
        my_account.borrow_count = 1;
        msg!("rent: got here, data = {:?}", my_account);
        Ok(())
    }

    pub fn borrow_to_attack(ctx: Context<BorrowContext>) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        let enemies = &mut ctx.accounts.enemies;
        
        dam_compute(my_account, enemies);

        my_account.borrow_count -= 1;
        if my_account.borrow_count == 0 {
            // end renting, dummy borrower
            my_account.borrower = Pubkey::new(&RELEASE_PUBKEY);
        }

        Ok(())
    }

    pub fn attack(ctx: Context<AttackContext>) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        let enemies = &mut ctx.accounts.enemies;
        
        dam_compute(my_account, enemies);

        Ok(())
    }

    
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 512)]
    pub my_account: Account<'info, Monster>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct OwnerContext<'info> {
    #[account(mut, has_one = authority)]
    pub my_account: Account<'info, Monster>,
    pub authority: Signer<'info>,
}


#[derive(Accounts)]
pub struct AttackContext<'info> {
    #[account(mut, has_one = authority)]
    pub my_account: Account<'info, Monster>,
    pub authority: Signer<'info>,
    #[account(mut)]
    pub enemies: Account<'info, Monster>,
}

#[derive(Accounts)]
pub struct BorrowContext<'info> {
    #[account(mut, has_one = borrower)]
    pub my_account: Account<'info, Monster>,
    pub borrower: Signer<'info>,
    #[account(mut)]
    pub enemies: Account<'info, Monster>,
}




#[derive(Copy, Clone, Debug)]
pub enum MonsterState {
    READY = 0,
    RECOVER = 1,
}

#[account]
#[derive(Debug)]
pub struct Monster {
    pub authority: Pubkey,

    // for mosnter data
    pub att: u16,
    pub satt: u16,
    pub def: u16,
    pub sdef: u16,
    pub hp: u16,

    // for display
    pub image_hash: [u8; 32],
    pub name: [u8; 32],

    // current status
    pub current_hp: u16,
    pub state: u8,

    // for rent
    pub borrower: Pubkey,
    pub borrow_count: u16
}
