import {Base64} from "../common/base64";
import {MonsterProgram} from "../monster/monsterProgram";


const main = async () => {
    const args = process.argv.slice(2)
    const monster = args[0]
    let client = new MonsterProgram()

    console.log(`Release monster ${monster}`)
    await client.release(monster)
    await client.showMyMonsters()
}


main().then(() => console.log("Done"))
