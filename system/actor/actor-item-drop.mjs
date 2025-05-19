export class AOVActorItemDrop {

  // Change default on Drop Item Create routine for requirements (single items and folder drop)-----------------------------------------------------------------
  static async _AOVonDropItemCreate(itemData, actor) {
    const newItemData = [];
    itemData = itemData instanceof Array ? itemData : [itemData];
    for (let thisItem of itemData) {
      let nItm = thisItem.toObject()
      let nItmCidFlag = nItm.flags.aov?.cidFlag?.id

      //Can't drop certain types of items of any actors
      if (['wound','runescript',"seidur","thrall", "family","weaponcat"].includes(nItm.type)) {
        ui.notifications.warn(game.i18n.format('AOV.ErrorMsg.cantTransfer', { itemType: game.i18n.localize('TYPES.Item.'+ nItm.type)}));
        continue;
      }

      //Check Dropped item has a Chaosium ID, if not then don't add it
      if (!nItmCidFlag) {
        ui.notifications.warn(game.i18n.format('AOV.ErrorMsg.noCIDFlag', { itemName: nItm.name}));
        continue;
      }

      //Only let thralls be dropped on farms
      if (actor.type === 'farm' && !['thrall'].includes(nItm.type)) {
        ui.notifications.warn(game.i18n.format('AOV.ErrorMsg.cantDropItem', { itemType: game.i18n.localize('TYPES.Item.'+ nItm.type), actorType: game.i18n.localize('TYPES.Actor.'+ actor.type)}));
        continue;
      }

      //Can't drop any items on a ship or farm
      if (actor.type === 'ship') {
        ui.notifications.warn(game.i18n.format('AOV.ErrorMsg.cantDropItem', { itemType: game.i18n.localize('TYPES.Item.'+ nItm.type), actorType: game.i18n.localize('TYPES.Actor.'+ actor.type)}));
        continue;
      }

      //Check for duplicate passions, hit-locations and devotions
      if (['passion','devotion','hitloc'].includes(nItm.type)){
        let currentList = await actor.items.filter(i=>i.flags.aov?.cidFlag?.id === nItmCidFlag)
        if (currentList.length > 0) {
          ui.notifications.warn(game.i18n.format('AOV.ErrorMsg.dupItem', { itemName: (nItm.name +"(" + nItmCidFlag +")") }));
          continue;
        }
      }

      //Check for duplicate skills, but not specialised skills
      if (['skill'].includes(nItm.type)){
        if (!nItm.system.specSkill) {
          let currentList = await actor.items.filter(i=>i.flags.aov?.cidFlag?.id === nItmCidFlag)
          if (currentList.length > 0) {
            ui.notifications.warn(game.i18n.format('AOV.ErrorMsg.dupItem', { itemName: (nItm.name +"(" + nItmCidFlag +")") }));
            continue;
          }
        }
      }

      //If adding a skill and it's a character then calculate the base score
      if (actor.type === 'character' && nItm.type === 'skill') {
        nItm.system.base = await this._AOVcalcBase(nItm, actor);
      }

      //If it's a weapon
      if (nItm.type === 'weapon') {
        //Set weapon current HP to Max
        nItm.system.currHP = nItm.system.maxHP
        //Check if Character has the relevant skill and if not then add it
        if (actor.type ==='character') {
          let currentList = await actor.items.filter(i=>i.flags.aov?.cidFlag?.id === nItmCidFlag)
          if (currentList.length < 1) {
            let extraSkill = await game.aov.cid.fromCID(nItm.system.skillCID)
            if (extraSkill.length>0) {
              let xItm = extraSkill[0].toObject()
              xItm.system.base = await this._AOVcalcBase(xItm, actor);
              newItemData.push(xItm)
            }
          }
        }
      }


      //If we've got this far then the item can be added
      newItemData.push(nItm);
    }
    return (newItemData);
  }

  //Set base percentage of skill
  static async _AOVcalcBase(item,actor) {
    let base = 0
    switch (item.system.baseVal) {
      case "dex2":
        return actor.system.abilities.dex.total*2
      case "dex3":
        return actor.system.abilities.dex.total*3
    }
    return item.system.base
  }






}
