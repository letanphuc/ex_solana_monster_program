import {Program, Provider, setProvider, web3} from "@project-serum/anchor";
import {Monster} from "./monster";

const idl = require('../program.json')

export class MonsterProgram {
    private readonly provider: any = Provider.local()
    private readonly program: any = null

    constructor() {
        const programID = new web3.PublicKey(idl.metadata.address)
        this.program = new Program(idl, programID)
        setProvider(this.provider)
    }

    async catchNewMonster() {
        const account: any = web3.Keypair.generate()

        console.log('new monster = ' + account.publicKey)
        await this.program.rpc.initialize(this.provider.wallet.publicKey, {
            accounts: {
                myAccount: account.publicKey,
                user: this.provider.wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            },
            signers: [account],
        })
        await this.showMonster(account.publicKey)
    }

    async setMonsterName(publicKey: string, name: string) {
        name = name + ' '.repeat(32 - name.length)
        const buff = Buffer.from(name, 'utf8');
        const arr = Uint8Array.from(buff)
        await this.program.rpc.setName(arr, {
            accounts: {
                myAccount: new web3.PublicKey(publicKey),
                authority: this.provider.wallet.publicKey
            },
        })
        await this.showMonster(new web3.PublicKey(publicKey))
    }

    async transfer(publicKey: string, newOwner: string) {
        const owner = new web3.PublicKey(newOwner)
        await this.program.rpc.transfer(owner, {
            accounts: {
                myAccount: new web3.PublicKey(publicKey),
                authority: this.provider.wallet.publicKey
            },
        })
        await this.showMonster(new web3.PublicKey(publicKey))
    }

    async giveRent(publicKey: string, borrowerPubKey: string) {
        const borrower = new web3.PublicKey(borrowerPubKey)
        await this.program.rpc.rent(borrower, {
            accounts: {
                myAccount: new web3.PublicKey(publicKey),
                authority: this.provider.wallet.publicKey
            },
        })
        await this.showMonster(new web3.PublicKey(publicKey))
    }

    async askMonsterAttack(monster: string, enemies: string) {
        await this.program.rpc.attack({
            accounts: {
                myAccount: new web3.PublicKey(monster),
                authority: this.provider.wallet.publicKey,
                enemies: new web3.PublicKey(enemies)
            },
        })
        console.log("After attacking:")
        await this.showMonster(new web3.PublicKey(monster))
        await this.showMonster(new web3.PublicKey(enemies))
    }

    async borrowMonsterAttack(monster: string, enemies: string) {
        await this.program.rpc.borrowToAttack({
            accounts: {
                myAccount: new web3.PublicKey(monster),
                borrower: this.provider.wallet.publicKey,
                enemies: new web3.PublicKey(enemies)
            },
        })
        console.log("After attacking:")
        await this.showMonster(new web3.PublicKey(monster))
        await this.showMonster(new web3.PublicKey(enemies))
    }

    async release(publicKey: string) {
        await this.program.rpc.release({
            accounts: {
                myAccount: new web3.PublicKey(publicKey),
                authority: this.provider.wallet.publicKey
            },
        })
        console.log("After releasing:")
        await this.showMonster(new web3.PublicKey(publicKey))
    }

    async showMonster(monsterPubKey: web3.PublicKey) {
        const account = await this.program.account.monster.fetch(monsterPubKey)
        const monster = new Monster(monsterPubKey, account)
        console.table([monster])
    }

    async showMyMonsters() {
        const accounts = await this.program.account.monster.all()
        const ownerPubKey = '' + this.provider.wallet.publicKey
        let monsters = accounts.map((x: any) => new Monster(x.publicKey, x.account))
        monsters = monsters.filter((m: Monster) => m.authority == ownerPubKey)

        console.log("All of my monsters:")
        console.table(monsters)
    }

    async showAllMonsters() {
        const accounts = await this.program.account.monster.all()
        let monsters = accounts.map((x: any) => new Monster(x.publicKey, x.account))

        console.log("All monsters over the world:")
        console.table(monsters)
    }
}
