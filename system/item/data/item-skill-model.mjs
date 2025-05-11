import AOVItemBaseModel from "./base-item-model.mjs";

export default class AOVSkillModel extends AOVItemBaseModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.base = new fields.NumberField({ ...requiredInteger, initial: 0 });  //Base score of skill%
    schema.home = new fields.NumberField({ ...requiredInteger, initial: 0 });  //Homeland bonus for skill%
    schema.pers = new fields.NumberField({ ...requiredInteger, initial: 0 });  //Personal bonus for skill%
    schema.xp = new fields.NumberField({ ...requiredInteger, initial: 0 });  //Acquired XP for skill%
    schema.effects = new fields.NumberField({ ...requiredInteger, initial: 0 });  //Effects for skill%
    schema.noXP = new fields.BooleanField({ initial: false });   //Can skill get XP checks
    schema.baseVal = new fields.StringField({ required: true, blank: true, initial: "fixed" });  //Base score options
    schema.xpCheck = new fields.BooleanField({ initial: false }); //Has skill got an XP check
    schema.specSkill = new fields.BooleanField({ initial: false }); //Can this skill have a specialisation
    schema.category = new fields.StringField({ required: true, blank: true, initial: "agi" }); //Skill Category of this skill
    schema.specialisation = new fields.StringField({ required: true, blank: true, initial: "" }); //Name of skill specialisation
    schema.weaponType = new fields.StringField({ required: true, blank: true, initial: "" }); //Weapon Type
    schema.weaponCat = new fields.StringField({ required: true, blank: true, initial: "" }); //Weapon Category
    schema.common = new fields.BooleanField({ initial: true }); //Is this a common skill
    return schema
  }

}
