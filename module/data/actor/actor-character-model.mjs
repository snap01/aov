import AOVActorBaseModel from "./base-actor-model.mjs";

export default class AOVCharacterModel extends AOVActorBaseModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.reputation = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.hrBonus = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.move = new fields.NumberField({ ...requiredInteger, initial: 10 }); 
    schema.birthYear = new fields.NumberField({ ...requiredInteger, initial: 955 }); 
    schema.nickname = new fields.StringField({ required: true, blank: true });
    schema.gender = new fields.StringField({ required: true, blank: true });

    return schema
  }

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.abilities) {
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.AOV.abilities[key]) ?? key;
    }
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use them
    if (this.abilities) {
      for (let [k,v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
    return data
  }

}