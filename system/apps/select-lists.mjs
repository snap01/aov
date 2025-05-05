export class AOVSelectLists {


  //Equipped List
  static async equippedOptions(type) {
    let options = {
      1: game.i18n.localize("AOV.carried"),
      2: game.i18n.localize("AOV.packed"),
      3: game.i18n.localize("AOV.stored"),
    };
    return options;
  }

  //Skill Categories
  static async skillCat() {
    let options = {
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
    let options = {
      "fixed": game.i18n.localize("AOV.fixed"),
      "dex2": game.i18n.localize("AOV.Ability.dex") + "*2",
      "dex3": game.i18n.localize("AOV.Ability.dex") + "*3",
    };
    return options;
  }

  //Personality Types
  static async persType() {
    let options = {
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
    let options = {
      "melee": game.i18n.localize("AOV.melee"),
      "missile": game.i18n.localize("AOV.missile"),
      "naturalWpn": game.i18n.localize("AOV.naturalWpn"),
    };
    return options;
  }

  //Hit Loc Types
  static async hitLocType() {
    let options = {
      "limb": game.i18n.localize("AOV.HitLoc.limb"),
      "abdomen": game.i18n.localize("AOV.HitLoc.abdomen"),
      "chest": game.i18n.localize("AOV.HitLoc.chest"),
      "head": game.i18n.localize("AOV.HitLoc.head"),
      "general": game.i18n.localize("AOV.HitLoc.general"),
    };
    return options;
  }

  //Hit Loc Options for the Actor
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

  static async preLoadCategoriesCategories() {
    return new Promise(async (resolve, reject) => {
      resolve(await game.aov.cid.fromCIDRegexBest({ cidRegExp: new RegExp('^i\.(weaponcat|passion|skill)\.'), type: 'i', showLoading: true }))
    })
  }

  //Weapon Skills List
  static async getWeaponSkills() {
    const weaponSkillsList = (await game.aov.categories).filter(d => d.type === 'skill').filter(e => e.system.category === 'cbt')
    weaponSkillsList.sort(function (a, b) {
      return a.name.localeCompare(b.name)
    });
    let options = weaponSkillsList.reduce((c, i) => {
      c[i.flags.aov.cidFlag.id] = i.name
      return c
    }, {})
    return options
  }

  //Weapon Category List
  static async getWeaponCategories() {
    const weaponCatList = (await game.aov.categories).filter(d => d.type === 'weaponcat')
    weaponCatList.sort(function (a, b) {
      return a.name.localeCompare(b.name)
    });
    let options = weaponCatList.reduce((c, i) => {
      c[i.flags.aov.cidFlag.id] = i.name
      return c
    }, {})
    return options
  }

  //Devotion Points
  static async dpOptions() {
    let options = {
      0: "0",
      1: "1",
      2: "2",
      3: "3",
    };
    return options;
  }

  //Farm Type Options
  static async farmTypeOptions() {
    let options = {
      "dairy": game.i18n.localize("AOV.Farm.dairy"),
      "sheep": game.i18n.localize("AOV.Farm.sheep"),
      "fishing": game.i18n.localize("AOV.Farm.fishing"),
      "driftwood": game.i18n.localize("AOV.Farm.driftwood"),
    };
    return options;
  }

  //Damage Type Options
  static async dmgTypeOptions() {
    let options = {
      "c": game.i18n.localize("AOV.DamType.c"),
      "ct": game.i18n.localize("AOV.DamType.ct"),
      "h": game.i18n.localize("AOV.DamType.h"),
      "i": game.i18n.localize("AOV.DamType.i"),
      "s": game.i18n.localize("AOV.DamType.s"),
    };
    return options;
  }
}
