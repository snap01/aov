export class AOVSelectLists {

  //Equipped List
  static async equippedOptions (type) {    
    let options = {};
    options = {  
      1: game.i18n.localize("AOV.carried"),
      2: game.i18n.localize("AOV.packed"),
      3: game.i18n.localize("AOV.stored"),
    };   
    return options;
  }

  //Skill Categories
  static async skillCat () {    
    let options = {};
    options = {  
      "agi": game.i18n.localize("AOV.skillCat.agi"),
      "com": game.i18n.localize("AOV.skillCat.com"),
      "knw": game.i18n.localize("AOV.skillCat.knw"),
      "man": game.i18n.localize("AOV.skillCat.man"),
      "myt": game.i18n.localize("AOV.skillCat.myt"),
      "per": game.i18n.localize("AOV.skillCat.per"),
      "ste": game.i18n.localize("AOV.skillCat.ste"),
    };   
    return options;
  }

}