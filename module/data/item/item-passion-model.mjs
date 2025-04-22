import AOVItemBaseModel from "./base-item-model.mjs";

export default class AOVPassionModel extends AOVItemBaseModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.base = new fields.NumberField({ ...requiredInteger, initial: 0 }); 
    schema.family = new fields.NumberField({ ...requiredInteger, initial: 0 }); 
    schema.noXP = new fields.BooleanField({ initial: false}); 
    schema.xpCheck = new fields.BooleanField({ initial: false}); 
    return schema
  }

}