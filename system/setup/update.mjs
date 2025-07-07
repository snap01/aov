/**
 * Perform a system migration for the entire World, applying migrations for Actors, Items, and Compendium packs.
 * @param {object} [options={}]
 * @param {boolean} [options.bypassVersionCheck=false]  Bypass certain migration restrictions gated behind system
 *                                                      version stored in item stats.
 * @returns {Promise}      A Promise which resolves once the migration is completed
 */
export async function updateWorld({ bypassVersionCheck=false }={}) {
    const currentVersion = game.settings.get("aov", "systemVersion");
    const targetVersion = game.system.version;

    //Message if current system is less that Version 13.1
    if (foundry.utils.isNewerVersion('13.1', currentVersion ?? '0')) {
      await updateDialog ('systems/aov/templates/updates/update13.1.hbs')  
    }

    //Message if current system is less that Version 13.4
    if (foundry.utils.isNewerVersion('13.4', currentVersion ?? '0')) {
      await updateDialog ('systems/aov/templates/updates/update13.4.hbs')  
    } 
    
    //Message if current system is less that Version 13.5
    if (foundry.utils.isNewerVersion('13.5', currentVersion ?? '0')) {
      await updateDialog ('systems/aov/templates/updates/update13.5.hbs')  
    } 

    //Message if current system is less that Version 13.6
    if (foundry.utils.isNewerVersion('13.6', currentVersion ?? '0')) {
      let response = await updateDialog ('systems/aov/templates/updates/update13.6.hbs')  
      if (!response) {
        ui.notifications.warn("Item Migration to Version 13.6 cancelled");
        return}
      await damTypeUpdate()
    } 

    //Message if current system is less that Version 13.7
    if (foundry.utils.isNewerVersion('13.7', currentVersion ?? '0')) {
      await updateDialog ('systems/aov/templates/updates/update13.7.hbs')  
    }     

   await game.settings.set("aov", "systemVersion", targetVersion);
}

export async function updateDialog(msg) {
  const content = await foundry.applications.handlebars.renderTemplate(msg)
  const response = await foundry.applications.api.DialogV2.prompt({
    position: {
      width:500,
      height: 450,
    },
    classes:['aov', 'item'],
    window: {
      title: "Update",
    },
    content,
    modal: true
  })
  return response
}

export async function damTypeUpdate() {
  //Update World Items
  for (let item of game.items) {
    if (item.type != 'weapon') {continue}
    if (item.system.weaponType === 'missile') {
      await item.update({'system.damMod': "n"})
    } else if (item.system.weaponType === 'thrown') {
      await item.update({'system.damMod': "h"})
    }
  }

  //Update Items in World Actors
  for (let actor of game.actors) {
    for (let item of actor.items) {
      if (item.type != 'weapon') {continue}
      if (item.system.weaponType === 'missile') {
        await item.update({'system.damMod': "n"})
      } else if (item.system.weaponType === 'thrown') {
        await item.update({'system.damMod': "h"})
      }
    }
  }  


  // Update Items in  Scenes [Token] Actors
  for (const scene of game.scenes) {
    for (const token of scene.tokens) {
      if (token.actorLink) {continue}
      for (let item of token.delta.items) {
        if (item.type != 'weapon') {continue}
        if (item.system.weaponType === 'missile') {
         await item.update({'system.damMod': "n"})
        } else if (item.system.weaponType === 'thrown') {
          await item.update({'system.damMod': "h"})
        }
      }
    }  
  }

  return  

}
