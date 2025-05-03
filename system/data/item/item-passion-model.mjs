import AOVItemBaseModel from "./base-item-model.mjs";

export default class AOVPassionModel extends AOVItemBaseModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.base = new fields.NumberField({ ...requiredInteger, initial: 0 });  //Base score of passion%
    schema.family = new fields.NumberField({ ...requiredInteger, initial: 0 });  //Family score of passion%
    schema.xp = new fields.NumberField({ ...requiredInteger, initial: 0 });  //Acquired XP for passion%
    schema.noXP = new fields.BooleanField({ initial: false }); //Can passion get XP check
    schema.xpCheck = new fields.BooleanField({ initial: false }); //Has passion got an XP check
    schema.common = new fields.BooleanField({ initial: true }); //Is this a common passion
    return schema
  }

}
