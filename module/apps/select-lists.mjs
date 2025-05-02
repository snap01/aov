export class AOVSelectLists {


  //Equipped List
  static async equippedOptions(type) {
    let options = {};
    options = {
      1: game.i18n.localize("AOV.carried"),
      2: game.i18n.localize("AOV.packed"),
      3: game.i18n.localize("AOV.stored"),
    };
    return options;
  }

  //Skill Categories
  static async skillCat() {
    let options = {};
    options = {
      "agi": game.i18n.localize("AOV.skillCat.agi"),
      "cbt": game.i18n.localize("AOV.skillCat.cbt"),
      "com": game.i18n.localize("AOV.skillCat.com"),
      "knw": game.i18n.localize("AOV.skillCat.knw"),
      "man": game.i18n.localize("AOV.skillCat.man"),
      "myt": game.i18n.localize("AOV.skillCat.myt"),
      "per": game.i18n.localize("AOV.skillCat.per"),
      "spi": game.i18n.localize("AOV.skillCat.spi"),
      "ste": game.i18n.localize("AOV.skillCat.ste"),
    };
    return options;
  }

  //Skill Base Value Options
  static async baseSkill() {
    let options = {};
    options = {
      "fixed": game.i18n.localize("AOV.fixed"),
      "dex2": game.i18n.localize("AOV.Ability.dex") + "*2",
      "dex3": game.i18n.localize("AOV.Ability.dex") + "*3",
    };
    return options;
  }

  //Personality Types
  static async persType() {
    let options = {};
    options = {
      "mighty": game.i18n.localize("AOV.Personality.mighty"),
      "steadfast": game.i18n.localize("AOV.Personality.steadfast"),
      "spiritual": game.i18n.localize("AOV.Personality.spiritual"),
      "wanderer": game.i18n.localize("AOV.Personality.wanderer"),
      "cunning": game.i18n.localize("AOV.Personality.cunning"),
      "manipulative": game.i18n.localize("AOV.Personality.manipulative"),

    };
    return options;
  }

  //Weapon Types
  static async weaponType() {
    let options = {};
    options = {
      "melee": game.i18n.localize("AOV.melee"),
      "missile": game.i18n.localize("AOV.missile"),
      "naturalWpn": game.i18n.localize("AOV.naturalWpn"),
    };
    return options;
  }

  //Hit Loc Types
  static async hitLocType() {
    let options = {};
    options = {
      "limb": game.i18n.localize("AOV.HitLoc.limb"),
      "abdomen": game.i18n.localize("AOV.HitLoc.abdomen"),
      "chest": game.i18n.localize("AOV.HitLoc.chest"),
      "head": game.i18n.localize("AOV.HitLoc.head"),
      "general": game.i18n.localize("AOV.HitLoc.general"),
    };
    return options;
  }

  //Hit Loc Options
  static getHitLocOptions(actor) {
    let options = {}
    let newOption = {}
    for (let itm of actor.items) {
      if (itm.type === 'hitloc') {
          newOption = { [itm.id]: itm.name, };
          options = Object.assign(options, newOption)
      }
    }
    return options
  }

  //Weapon Category List
  static async getWeaponCategories() {
    let weaponCatList = await game.system.api.cid.fromCIDRegexBest({ cidRegExp: new RegExp('^i.weaponcat'), type: 'i' })
    weaponCatList.sort(function (a, b) {
      let x = a.name;
      let y = b.name;
      if (x < y) { return -1 };
      if (x > y) { return 1 };
      return 0;
    });
    let options = {}
    for (let itm of weaponCatList) {
      if (itm.flags.aov.cidFlag.id) {
        options = Object.assign(options, { [itm.flags.aov.cidFlag.id]: itm.name })
      }
    }
    return options
  }

  //Hit Loc Types
  static async dpOptions() {
    let options = {};
    options = {
      0: "0",
      1: "1",
      2: "2",
      3: "3",
    };
    return options;
  }

}
