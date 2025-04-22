import AOVItemBaseModel from "./base-item-model.mjs";

export default class AOVGearModel extends AOVItemBaseModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.quantity = new fields.NumberField({ ...requiredInteger, initial: 1 }); 
    schema.equipStatus = new fields.NumberField({ ...requiredInteger, initial: 1 }); 
    return schema
  }

}