import {Base64} from "../common/base64";
import {MonsterProgram} from "../monster/monsterProgram";


const main = async () => {
    let client = new MonsterProgram()
    await client.showAllMonsters()
}


main().then(() => console.log("Done"))
