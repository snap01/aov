import AOVItemBaseModel from "./base-item-model.mjs";

export default class AOVFarmModel extends AOVItemBaseModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.size = new fields.NumberField({ ...requiredInteger, initial: 20 });  //Size of farm in hectares
    schema.farmType = new fields.StringField({ required: true, blank: true, initial: "" }); //Farm Type
    schema.value = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Farm Value
    schema.animals = new fields.StringField({ required: true, blank: true, initial: "" }); //Animals
    schema.location = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Grid location of the farm
    schema.status = new fields.StringField({ required: true, blank: true, initial: "" }); //Farm status
    schema.thralls = new fields.ArrayField(new fields.StringField());
    return schema
  }

}
