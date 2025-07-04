import { RollType, AOVCheck, CardType } from "../apps/checks.mjs";
import { isCtrlKey } from "../apps/helper.mjs";  

export class AOVRollType {
  
  //Determine Roll Type
  static async _onDetermineCheck (event, detail,actor) {
    let ctrlKey = isCtrlKey(event ?? false);
    let cardType = CardType.UNOPPOSED;
    let rollType = RollType.CHARACTERISTIC
    let characteristic = false
    let skillId = false
    if (detail.property === 'ability') {
      characteristic = detail.characteristic
      if (ctrlKey) {
        cardType = CardType.FIXED
      } else if (event.altKey) {
        cardType = CardType.RESISTANCE
      }
    } else if (detail.property === 'skill') {
      rollType = RollType.SKILL
      skillId = detail.skillId
      if (ctrlKey) {
        cardType = CardType.AUGMENT        
      } else if (event.altKey) {
        cardType = CardType.OPPOSED
      }
    } else if (detail.property === 'passion') {
      rollType = RollType.PASSION
      skillId = detail.skillId
      if (ctrlKey) {
        cardType = CardType.AUGMENT        
      } else if(event.altKey) {
        cardType = CardType.OPPOSED
      }
    } else if (detail.property === 'damage') {
      rollType = RollType.DAMAGE
      skillId = detail.skillId    
    } else {
      return
    }

    AOVCheck._trigger({
      rollType,
      cardType,
      shiftKey: event.shiftKey,
      actor,
      token: actor.token,
      characteristic,
      skillId,
    })
  } 
}