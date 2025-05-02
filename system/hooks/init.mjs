import { AOV } from "../setup/config.mjs";
import { AOVActor } from "../documents/actor.mjs";
import { AOVItem } from "../documents/item.mjs";
import { CID } from '../cid/cid.mjs'
import { handlebarsHelper } from '../setup/handlebar-helpers.mjs';
import { registerSettings } from '../settings/register-settings.mjs'
import { registerSheets } from '../setup/register-sheets.mjs'
import * as models from '../data/_module.mjs';

export default function Init() {
  //Add classes to global game object
  game.aov = {
    AOVActor,
    AOVItem
  }
  //Add Custom Configuration
  CONFIG.AOV = AOV;

  //Register Settings and Handlebar Helpers
  registerSettings();
  handlebarsHelper();

  // Define custom Document classes
  CONFIG.Item.documentClass = AOVItem;
  CONFIG.Actor.documentClass = AOVActor;

  //Declare Data Models
  CONFIG.Actor.dataModels.character = models.AOVCharacterModel
  CONFIG.Item.dataModels.gear = models.AOVGearModel

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  CID.init()
  registerSheets()
}
