import AOVActorBaseModel from "./base-actor-model.mjs";

export default class AOVShipModel extends AOVActorBaseModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.shipType = new fields.StringField({ required: true, blank: true, initial: "" }); //Ship Type
    schema.hull = new fields.SchemaField({
      type: new fields.StringField({ required: true, blank: true, initial: "merchant" }),//Hull Type
      formula: new fields.StringField({ required: true, blank: true, initial: "" }),//Hull Quality Formula
      value: new fields.NumberField({ ...requiredInteger, initial: 0 }), //Value of Hull Quality
    });
    schema.seaworthy = new fields.SchemaField({
      max: new fields.NumberField({ ...requiredInteger, initial: 0 }), //Maximum Seaworthiness
      value: new fields.NumberField({ ...requiredInteger, initial: 0 }), //Current Seaworthiness
    });
    schema.sp = new fields.SchemaField({
      max: new fields.NumberField({ ...requiredInteger, initial: 0 }), //Maximum Structural Points
      value: new fields.NumberField({ ...requiredInteger, initial: 0 }), //Current Structural Points
    });
    schema.length = new fields.NumberField({ required: true, blank: true, initial: 0 }); //Length
    schema.beam = new fields.NumberField({ required: true, nullable: false, initial: 0 }); //Beam
    schema.size = new fields.NumberField({ required: true, nullable: false, initial: 0 }); //SIZ
    schema.cargo = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Cargo (tons)
    schema.nation = new fields.StringField({ required: true, blank: true, initial: "" }); //Nation
    schema.captain = new fields.StringField({ required: true, blank: true, initial: "" }); //Captain
    schema.boat = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Boat Skill%
    schema.helmsman = new fields.StringField({ required: true, blank: true, initial: "" }); //Helmsman
    schema.navigate = new fields.NumberField({ ...requiredInteger, initial: 0 }); //navigate Skill%
    schema.rowers = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Rowers
    schema.sailors = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Sailors
    schema.warriors = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Warriors
    schema.passengers = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Passengers
    schema.additional = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Additional Crew
    schema.rowersMin = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Rowers Min
    schema.sailorsMin = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Sailors Min
    schema.warriorsMin = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Warriors Min
    schema.passengersMin = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Passengers Min
    schema.additionalMin = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Additional Crew Min
    schema.cost = new fields.NumberField({ ...requiredInteger, initial: 0 }); //Value
    schema.sail = new fields.SchemaField({
      before: new fields.NumberField({ ...requiredInteger, initial: 0 }), //Sailing - before wind
      quarter: new fields.NumberField({ ...requiredInteger, initial: 0 }), //Sailing - quarter wind
      half: new fields.NumberField({ ...requiredInteger, initial: 0 }), //Sailing - halfbefore wind
      head: new fields.NumberField({ ...requiredInteger, initial: 0 }), //Sailing - head wind
    });
    schema.row = new fields.SchemaField({
      back: new fields.NumberField({ ...requiredInteger, initial: 0 }), //Rowing - back oars
      cruise: new fields.NumberField({ ...requiredInteger, initial: 0 }), //Rowing - cruise
      race: new fields.NumberField({ ...requiredInteger, initial: 0 }), //Rowing - race
      crew: new fields.NumberField({ ...requiredInteger, initial: 0 }), //Rowing - crew modifier
    });
    schema.engine1 = new fields.StringField({ required: true, blank: true, initial: "" }); //Siege Engine 1
    schema.engine2 = new fields.StringField({ required: true, blank: true, initial: "" }); //Siege Engine 1
    schema.engine3 = new fields.StringField({ required: true, blank: true, initial: "" }); //Siege Engine 1
    schema.engine4 = new fields.StringField({ required: true, blank: true, initial: "" }); //Siege Engine 1

    schema.skill = new fields.StringField({ required: true, blank: true, initial: "i.skill.shiphandling" }); //Skill


    return schema
  }

  prepareDerivedData() {
  }

  getRollData() {
    const data = {};
    return data
  }

}
