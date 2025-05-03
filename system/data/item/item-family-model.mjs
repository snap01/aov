import AOVItemBaseModel from "./base-item-model.mjs";

export default class AOVFamilyModel extends AOVItemBaseModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.born = new fields.NumberField({ ...requiredInteger, initial: 990 });
    schema.died = new fields.NumberField({ required: true, nullable: true, integer: true, initial: 1 });
    return schema
  }

}
