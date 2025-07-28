import { FixedXPDialog } from "./fixed-xp-selector.mjs";
import { AOVCharCreate } from "./charCreate.mjs";

export class  AOVCharDevelop {

  static async expRolls(actor) {
    let improvements = [];
    let updateItems =[];
    let checks = await actor.items.filter(itm=>['skill','passion'].includes(itm.type)).filter(impItm=>impItm.system.xpCheck)
    if (checks.length<1) {return}
    //Select which skills and passions to give a fixed +3% increase to
    let improvChoices = (await FixedXPDialog.create(checks)).map(itm => { return (itm.id) })

    //Loop through each XP Check
    for (let check of checks) {
      let inc = 0
      let success = false
      let roll = new Roll('1D100');
      await roll.evaluate();
      let rollResult =roll.total;
      //If Roll 100 or exceed the skill score then improve
      if (rollResult === 100 || rollResult + (check.system.catBonus ?? 0) > check.system.total) {
        //If in the Fixed improv list increase by 3
        if(improvChoices.includes(check.id)) {
          inc = 3
        } else {
          //If not Fixed then roll 1D6
          let incRoll = new Roll('1D6');
          await incRoll.evaluate();
          inc = incRoll.total
        }
        success = true
      }
      updateItems.push ({ _id: check._id, 'system.xp': check.system.xp + inc, 'system.xpCheck': false })
      improvements.push({ label: check.name, success: success, incVal: inc, rollResult: rollResult + (check.system.catBonus ?? 0), target: check.system.total})
    }
    //Create Chat Message
    let msgData = {
      particName: actor.name,
      particImg: actor.img,
      results: improvements
    }
    let rolls = {}
    let html = await foundry.applications.handlebars.renderTemplate("systems/aov/templates/chat/character-xpCheck.hbs", msgData);
    let msg = await AOVCharCreate.showStats(html, rolls, game.i18n.localize('AOV.xpCheck'), actor._id)
    //Update skills and passions
    await Item.updateDocuments(updateItems, { parent: actor })
  }

}

