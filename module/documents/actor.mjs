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
    this._prepStats(actorData)
    this._prepDerivedStats(actorData)

    for (let itm of actorData.items) {
      if (itm.type === 'skill') {
        itm.system.total = itm.system.base
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
      actorData.system.hp.max = AOVActor._calcMaxHP(actorData)
      actorData.system.healRate = AOVActor._calcHealRate(actorData)
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
  static _calcMaxHP(actorData) {
    let maxHP = actorData.system.abilities.con.total;
    let sizBonus = Math.floor((actorData.system.abilities.siz.total-1)/4)-2;
    let powBonus = Math.floor((actorData.system.abilities.pow.total-1)/4)-2;
    if (powBonus<0) {
      powBonus++;
    } else if (powBonus>0) {
      powBonus--;
    }
    maxHP = maxHP + sizBonus + powBonus + actorData.system.hp.bonus;
    return maxHP;
  }

  //Calculate Heal Rate
  static _calcHealRate(actorData) {
    let hr = Math.floor((actorData.system.abilities.con.total-1)/6)+1 + actorData.system.hrBonus;
    return hr
  }

}    