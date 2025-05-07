import AOVItemBaseModel from "./base-item-model.mjs";

export default class AOVWeaponModel extends AOVItemBaseModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.weaponType = new fields.StringField({ required: true, blank: true, initial: "" }); //Weapon Type
    schema.weaponCat = new fields.StringField({ required: true, blank: true, initial: "" }); //Weapon Category
    schema.skillCID =  new fields.StringField({ required: true, blank: true, initial: "" }); //CID of appropriate skill
    schema.minStr = new fields.NumberField({ ...requiredInteger, initial: 0 });  //Minimum STR
    schema.minDex = new fields.NumberField({ ...requiredInteger, initial: 0 });  //Minimum DEX
    schema.damage =  new fields.StringField({ required: true, blank: true, initial: "" }); //Damage formula
    schema.damType =  new fields.StringField({ required: true, blank: true, initial: "" }); //Damage type
    schema.maxHP = new fields.NumberField({ ...requiredInteger, initial: 0 });  //Max HP of weapon
    schema.currHP = new fields.NumberField({ ...requiredInteger, initial: 0 });   //Current HP of weapon
    schema.length = new fields.StringField({ required: true, blank: true, initial: "" });  //Length of weapon or Range
    schema.cost = new fields.NumberField({ ...requiredInteger, initial: 0 });     //Cost of weapon
    schema.equipStatus = new fields.NumberField({ ...requiredInteger, initial: 1 });   //Equipped status
    schema.enc = new fields.NumberField({ required: true, nullable: false, initial: 0 });   //Encumberance
    schema.range = new fields.NumberField({ ...requiredInteger, initial: 0 });   //Range
    return schema
  }

}
