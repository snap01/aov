import { AOVActor } from "./module/documents/actor.mjs";
import { AOVItem } from "./module/documents/item.mjs";
import { AOV } from "./module/setup/config.mjs";
import { registerSettings } from './module/settings/register-settings.mjs'
import { handlebarsHelper } from './module/setup/handlebar-helpers.mjs';
import { AOVHooks } from './module/hooks/index.mjs'
import * as models from './module/data/_module.mjs';
import { AoVCharacterSheet } from "./module/sheets/actor/character-sheet.mjs";



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

Hooks.on('renderActorSheetV2', AoVCharacterSheet.renderSheet)