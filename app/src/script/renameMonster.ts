import {MonsterProgram} from "../monster/monsterProgram";


const main = async () => {
    const args = process.argv.slice(2)
    const monster = args[0]
    const newName = args[1]
    let client = new MonsterProgram()
    console.log(`Rename monster ${monster} to ${newName}`)
    await client.setMonsterName(monster, newName)
    await client.showMyMonsters()
}


main().then(() => console.log("Done"))
