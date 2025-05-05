import { AOVSelectLists } from '../apps/select-lists.mjs'


export default function Ready() {
  console.log("///////////////////////////////////")
  console.log("//  Age of Vikings System Ready  //")
  console.log("///////////////////////////////////")

  game.aov.categories = AOVSelectLists.preLoadCategoriesCategories()
  game.aov.weaponCategories = AOVSelectLists.getWeaponCategories
  game.aov.weaponSkillsList = AOVSelectLists.getWeaponSkills
}
