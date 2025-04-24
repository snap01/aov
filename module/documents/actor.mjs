import { CID } from '../cid/cid.mjs'; 

export class AOVActor extends Actor {

  prepareData() {
    super.prepareData();
  }
  
  prepareBaseData() {
  }
  
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.aov || {};
  
    //Prepare data for different actor types
    this._prepareCharacterData(actorData);
  }

  //Prepare Character specific data 
  async _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;
    const systemData = actorData.system;
    await this._prepStats(actorData)
    await this._prepDerivedStats(actorData)

    for (let itm of actorData.items) {
      if (itm.type === 'skill') {
        itm.system.total = (itm.system.base ||0) + (itm.system.xp ||0)
        if (itm.system.total > 0) {
          itm.system.total += (actorData.system[itm.system.category] || 0)
        }
        itm.system.label = itm.name
        if (itm.system.specSkill) {
          if (itm.system.specialisation === "") {
            itm.system.label = itm.system.label + " (" +game.i18n.localize('AOV.specify') +")"
          } else {
            itm.system.label = itm.system.label + " ("+ itm.system.specialisation+ ")"
          }
        }  


      } else if (itm.type === 'passion') {
        itm.system.total = Number(itm.system.base || 0) + Number(itm.system.family|| 0);
      }

    }  
  }    

  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);

    return data;
  }

  // Prepare character roll data.
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the ability scores to the top level
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
  }

  //Prepare Stats
  _prepStats(actorData) {
    for (let [key, ability] of Object.entries(actorData.system.abilities)) {
      ability.total = ability.value + ability.xp 
      ability.deriv = ability.total*5
    }    
  }    

  // Calculate derived scores
  _prepDerivedStats(actorData) {
    if (this.type === 'character') {
      const systemData = actorData.system;
      systemData.hp.max = AOVActor._calcMaxHP(systemData);
      systemData.mp.max = AOVActor._calcMaxMP(systemData);
      systemData.healRate = AOVActor._calcHealRate(systemData);
      systemData.reputation.total = (systemData.reputation.base || 0) + (systemData.reputation.xp || 0);
      systemData.status.total = (systemData.status.base || 0) + (systemData.status.xp || 0);
      systemData.moveRate = (systemData.move.base || 0) + (systemData.move.bonus || 0);
      systemData.dmgBonus = AOVActor._damMod(systemData);
      systemData.maxEnc = AOVActor._maxEnc(systemData);
      systemData.age = game.settings.get('aov','gameYear') - systemData.birthYear;
      systemData.agi = AOVActor._skillCatAgi(systemData);
      systemData.com = AOVActor._skillCatCom(systemData);
      systemData.knw = AOVActor._skillCatKnw(systemData);
      systemData.man = AOVActor._skillCatMan(systemData);
      systemData.myt = AOVActor._skillCatMyt(systemData);
      systemData.per = AOVActor._skillCatPer(systemData);
      systemData.ste = AOVActor._skillCatSte(systemData);
    }
  }  

  
  
  //Create a new actor - When creating an actor set basics including tokenlink, bars, displays sight
  static async create (data, options = {}) {
    //If dropping from compendium check to see if the actor already exists in game.actors and if it does then get the game.actors details rather than create a copy 
    if (options.fromCompendium) {
      let tempActor = await (game.actors.filter(actr=>actr.flags?.aov?.cidFlag?.id === data.flags?.aov?.cidFlag?.id && actr.flags?.aov?.cidFlag?.priority === data.flags?.aov?.cidFlag?.priority))[0]
      if (tempActor) {return tempActor}
    }


    if (data.type === 'character') {
      data.prototypeToken = foundry.utils.mergeObject({
        actorLink: true,
        disposition: 1,
        displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        displayBars: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        sight: {
          enabled: true
        },
        detectionModes: [{
          id: 'basicSight',
          range: 30,
          enabled: true
        }]
      },data.prototypeToken || {})
    }
    let actor = await super.create(data, options)

    //Add CID based on actor name if the game setting is flagged.
    if(game.settings.get('aov', "actorCID")) {
      let tempID = await CID.guessId(actor)
      if (tempID) {
        await actor.update({'flags.aov.cidFlag.id': tempID,
                            'flags.aov.cidFlag.lang': game.i18n.lang,
                            'flags.aov.cidFlag.priority': 0
        })
        const html = $(actor.sheet.element).find('header.window-header .edit-cid-warning,header.window-header .edit-cid-exisiting')
        if (html.length) {
          html.css({
            color: (tempID ? 'orange' : 'red')
          })
        }
        actor.render()
      }
    }
    
    return actor
  }

  //Calculate Max Hit Points
  static _calcMaxHP(systemData) {
    let maxHP = systemData.abilities.con.total;
    let sizBonus = Math.floor((systemData.abilities.siz.total-1)/4)-2;
    let powBonus = Math.floor((systemData.abilities.pow.total-1)/4)-2;
    if (powBonus<0) {
      powBonus++;
    } else if (powBonus>0) {
      powBonus--;
    }
    maxHP = maxHP + sizBonus + powBonus + systemData.hp.bonus;
    return maxHP;
  }

  //Calculate Max Magic Points
  static _calcMaxMP(systemData) {
    let maxMP = systemData.abilities.pow.total;
    maxMP = maxMP + systemData.mp.bonus;
    return maxMP;
  }

  //Calculate Heal Rate
  static _calcHealRate(systemData) {
    let hr = Math.floor((systemData.abilities.con.total-1)/6)+1 + systemData.hrBonus;
    return hr
  }

  //Calculate Damage Modifier
  static _damMod(systemData) {
    let statTot= systemData.abilities.str.total + systemData.abilities.siz.total;
    let dmgBonus = "0";
    if (statTot < 13) {
      dmgBonus="-1D4";
    } else if (statTot > 40) {
      statTot = Math.ceil((statTot-40)/16)+1;
      dmgBonus= "+" + statTot + "D6";
    } else if (statTot > 32) {
      dmgBonus="+1D6"
    } else if (statTot > 24) {
      dmgBonus="+1D4";
    } 
    return dmgBonus
  }

  //Calculate Max Enc
  static _maxEnc(systemData) {
    let maxEnc = Math.ceil((systemData.abilities.str.total + systemData.abilities.con.total)/2);
    return maxEnc
  }

  //Primary Skill Cat
  static _skillCatPri(score) {
    let bonus = (Math.ceil(score/4)-3)*5
    return bonus
  }

  //Secondary Skill Cat
  static _skillCatSec(score) {
    let bonus = (Math.ceil(score/4)-3)*5
    if (bonus<0) {
      bonus += 5
    } else if (bonus>0) {
      bonus -= 5
    }
    return bonus
  }

  //Negative Skill Cat
  static _skillCatNeg(score) {
    let bonus = (Math.ceil(score/4)-3)*5
    if (bonus<0) {
      bonus += 5
    } else if (bonus>0) {
      bonus -= 5
    }
    return -bonus
  }

  //Agility Skill Cat
  static _skillCatAgi(systemData) {
    let bonus = 0
    bonus += AOVActor._skillCatSec(systemData.abilities.str.total)
    bonus += AOVActor._skillCatNeg(systemData.abilities.siz.total)
    bonus += AOVActor._skillCatPri(systemData.abilities.dex.total)
    bonus += AOVActor._skillCatSec(systemData.abilities.pow.total)
    return bonus
  }

  //Communication Skill Cat
  static _skillCatCom(systemData) {
    let bonus = 0
    bonus += AOVActor._skillCatSec(systemData.abilities.int.total)
    bonus += AOVActor._skillCatSec(systemData.abilities.pow.total)
    bonus += AOVActor._skillCatPri(systemData.abilities.cha.total)
    return bonus
  }

  //Knowledge Skill Cat
  static _skillCatKnw(systemData) {
    let bonus = 0
    bonus += AOVActor._skillCatPri(systemData.abilities.int.total)
    bonus += AOVActor._skillCatSec(systemData.abilities.pow.total)
    return bonus
  }  

  //Manipulation Skill Cat
  static _skillCatMan(systemData) {
    let bonus = 0
    bonus += AOVActor._skillCatSec(systemData.abilities.str.total)
    bonus += AOVActor._skillCatPri(systemData.abilities.dex.total)
    bonus += AOVActor._skillCatPri(systemData.abilities.int.total)
    bonus += AOVActor._skillCatSec(systemData.abilities.pow.total)
    return bonus
  }  

  //Mythic Skill Cat
  static _skillCatMyt(systemData) {
    let bonus = 0
    bonus += AOVActor._skillCatPri(systemData.abilities.pow.total)
    bonus += AOVActor._skillCatSec(systemData.abilities.cha.total)
    return bonus
  }    

  //Perception Skill Cat
  static _skillCatPer(systemData) {
    let bonus = 0
    bonus += AOVActor._skillCatPri(systemData.abilities.int.total)
    bonus += AOVActor._skillCatSec(systemData.abilities.pow.total)
    return bonus
  }  

  //Stealth Skill Cat
  static _skillCatSte(systemData) {
    let bonus = 0
    bonus += AOVActor._skillCatSec(systemData.abilities.str.total)
    bonus += AOVActor._skillCatPri(systemData.abilities.dex.total)
    bonus += AOVActor._skillCatNeg(systemData.abilities.siz.total)
    bonus += AOVActor._skillCatNeg(systemData.abilities.pow.total)
    return bonus
  }  

}    