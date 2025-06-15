import AOVDataModel from "../../data/base-model.mjs";

export default class AOVActorBaseModel extends AOVDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};


    schema.hp = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 10 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 10 }),
      bonus: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      effects: new fields.NumberField({ ...requiredInteger, initial: 0 })
    });
    schema.mp = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 5 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 5 }),
      bonus: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      effects: new fields.NumberField({ ...requiredInteger, initial: 0 }),
    });
    schema.description = new fields.StringField({ required: true, blank: true });
    schema.gmNotes = new fields.StringField({ required: true, blank: true });
    schema.locked = new fields.BooleanField({ initial: false });  //Flag to lock the actor sheet
    schema.uncommon = new fields.BooleanField({ initial: false });  //Flag to show uncommon skills or not
    schema.alphaSkills = new fields.BooleanField({ initial: false });  //Flag to list the skills in alphabetical order
    schema.showRunes = new fields.BooleanField({ initial: true });  //Flag to show the runes
    schema.parryBonus = new fields.NumberField({ ...requiredInteger, initial: 0  });  //Parry Bonus


    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(Object.keys(CONFIG.AOV.abilities).reduce((obj, ability) => {
      obj[ability] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
        age: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        xp: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        effects: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        formula:new fields.StringField({ required: true, blank: true }),
        average: new fields.StringField({ required: true, blank: true }),
      });
      return obj;
    }, {}));


    return schema;
  }

}
