import { AOVSelectLists } from '../apps/select-lists.mjs'
import { AOVSystemSocket } from '../apps/socket.mjs'


export default function Ready() {
  game.socket.on('system.aov', async data => {
    AOVSystemSocket.callSocket(data)
  });


  console.log("///////////////////////////////////")
  console.log("//  Age of Vikings System Ready  //")
  console.log("///////////////////////////////////")

  game.aov.categories = AOVSelectLists.preLoadCategoriesCategories()
  game.aov.weaponCategories = AOVSelectLists.getWeaponCategories
  game.aov.weaponSkillsList = AOVSelectLists.getWeaponSkills
}
