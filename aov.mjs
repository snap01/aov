import { AOVActor } from "./module/documents/actor.mjs";
import { AOVItem } from "./module/documents/item.mjs";
import { AOV } from "./module/setup/config.mjs";
import { registerSettings } from './module/settings/register-settings.mjs'
import { handlebarsHelper } from './module/setup/handlebar-helpers.mjs';
import { AOVHooks } from './module/hooks/index.mjs'
import * as models from './module/data/_module.mjs';
import { AoVActorSheet } from "./module/sheets/actor/actor-sheet.mjs";
import { AoVItemSheet } from "./module/sheets/item/item-sheet.mjs";
import { AOVSelectLists } from "./module/apps/select-lists.mjs";
import { CID } from "./module/cid/cid.mjs"



//  Init Hook
Hooks.once('init', async function() {
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
  CONFIG.Actor.dataModels = {
    character: models.AOVCharacterModel,
  }
  CONFIG.Item.dataModels = {
    gear: models.AOVGearModel,
  }

 // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;
});

// Ready Hook
Hooks.once("ready", async function () {
  console.log("///////////////////////////////////")
  console.log("//  Age of Vikings System Ready  //")
  console.log("///////////////////////////////////")

})

AOVHooks.listen()

Hooks.on('renderActorSheetV2', AoVActorSheet.renderSheet)
Hooks.on('renderItemSheetV2', AoVItemSheet.renderSheet)
