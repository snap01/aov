import { AOVActor } from "./module/documents/actor.mjs";
import { AOVItem } from "./module/documents/item.mjs";
import { AOV } from "./module/setup/config.mjs";
import { registerSettings } from './module/settings/register-settings.mjs'
import { handlebarsHelper } from './module/setup/handlebar-helpers.mjs';
import { AOVHooks } from './module/hooks/index.mjs'
import * as models from './module/data/_module.mjs';
import { AoVActorSheet } from "./module/sheets/actor/actor-sheet.mjs";
import { AoVItemSheet } from "./module/sheets/item/item-sheet.mjs";



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
  CONFIG.Actor.documentClass = AOVActor;
  CONFIG.Item.documentClass = AOVItem;


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

//Remove certain Items types from the list of options to create under the items menu
Hooks.on("renderDialog", (dialog, html) => {
  let deprecatedTypes = ["wound"]; // 
  Array.from(html.find("#document-create option")).forEach(i => {
      if (deprecatedTypes.includes(i.value))
      {
          i.remove()
      }
  })
});


AOVHooks.listen()

Hooks.on('renderActorSheetV2', AoVActorSheet.renderSheet)
Hooks.on('renderItemSheetV2', AoVItemSheet.renderSheet)
