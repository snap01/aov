import AOVItemBaseModel from "./base-item-model.mjs";

export default class AOVSkillModel extends AOVItemBaseModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.base = new fields.NumberField({ initial: 0, integer: true }); 
    schema.noXP = new fields.BooleanField({ initial: false}); 
    schema.xpCheck = new fields.BooleanField({ initial: false}); 
    return schema
  }

}