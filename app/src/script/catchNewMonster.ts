import {MonsterProgram} from "../monster/monsterProgram";


const main = async () => {
    let client = new MonsterProgram()
    await client.catchNewMonster()
    await client.showMyMonsters()
}


main().then(() => console.log("Done"))
