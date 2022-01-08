import {MonsterProgram} from "../monster/monsterProgram";


const main = async () => {
    const args = process.argv.slice(2)
    const monster = args[0]
    const enemies = args[1]
    let client = new MonsterProgram()
    await client.askMonsterAttack(monster, enemies)
}


main().then(() => console.log("Done"))
