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

}