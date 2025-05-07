export class AOVActorItemDrop {

  // Change default on Drop Item Create routine for requirements (single items and folder drop)-----------------------------------------------------------------
  static async _AOVonDropItemCreate(itemData, actor) {
    const newItemData = [];
    itemData = itemData instanceof Array ? itemData : [itemData];
    for (let thisItem of itemData) {
      let nItm = thisItem.toObject()
      let nItmCidFlag = nItm.flags.aov?.cidFlag?.id

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

      //Check for duplicate skills, passions and devotions
      if (['skill','passion','devotion'].includes(nItm.type)){
        let currentList = await actor.items.filter(i=>i.flags.aov?.cidFlag?.id === nItmCidFlag)
        if (currentList.length > 0) {
          ui.notifications.warn(game.i18n.format('AOV.ErrorMsg.dupItem', { itemName: (nItm.name +"(" + nItmCidFlag +")") }));
          continue;
        }
      }

      if (actor.type === 'character' && nItm.type === 'skill') {
        nItm.system.base = await this._AOVcalcBase(nItm, actor);
      }

      if (nItm.type === 'weapon') {
        //Set weapon current HP to Max
        nItm.system.currHP = nItm.system.maxHP
        //Check if actor has the relevant skill and if not then add it
        let currentList = await actor.items.filter(i=>i.flags.aov?.cidFlag?.id === nItmCidFlag)
        if (currentList.length < 1) {
          let extraSkill = await game.aov.cid.fromCID(nItm.system.skillCID)
          console.log(nItm.system.skillCID,extraSkill)
          if (extraSkill.length>0) {
            let xItm = extraSkill[0].toObject()
            xItm.system.base = await this._AOVcalcBase(xItm, actor);
            newItemData.push(xItm)
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
