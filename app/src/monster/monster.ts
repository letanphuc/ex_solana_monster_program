import {Base64} from "../common/base64";

export class Monster {
    att: number = 0
    satt: number = 0
    def: number = 0
    sdef: number = 0
    hp: number = 0
    imageHash: string = ""
    authority: string = ""
    pubKey: string = ""
    name: string = ""
    currentHP: number = 0
    state: number = 0
    borrower: string = ""
    borrowerCount: number = 0

    constructor(pubKey: any, account: any) {
        this.pubKey = '' + pubKey

        this.att = account.att
        this.satt = account.satt
        this.def = account.def
        this.sdef = account.sdef
        this.hp = account.hp

        this.imageHash = Base64.encode(account.imageHash)
        this.authority = '' + account.authority
        this.name = String.fromCharCode.apply(String, account.name).trim()

        this.currentHP = account.currentHp
        this.state = account.state

        this.borrower = '' + account.borrower
        this.borrowerCount = account.borrowCount
    }
}
