import {MonsterProgram} from "../monster/monsterProgram";


const main = async () => {
    const args = process.argv.slice(2)
    const monster = args[0]
    const newOwner = args[1]
    let client = new MonsterProgram()
    await client.giveRent(monster, newOwner)
    await client.showMyMonsters()
}


main().then(() => console.log("Done"))
