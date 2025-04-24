import AOVItemBaseModel from "./base-item-model.mjs";

export default class AOVSkillModel extends AOVItemBaseModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.base = new fields.NumberField({ ...requiredInteger, initial: 0 }); 
    schema.xp = new fields.NumberField({ ...requiredInteger, initial: 0 }); 
    schema.noXP = new fields.BooleanField({ initial: false}); 
    schema.xpCheck = new fields.BooleanField({ initial: false}); 
    schema.specSkill = new fields.BooleanField({ initial: false}); 
    schema.category = new fields.StringField({ required: true, blank: true, initial: "agi" });
    schema.specialisation = new fields.StringField({ required: true, blank: true, initial: "" }); 
    return schema
  }

}