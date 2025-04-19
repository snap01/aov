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
Hooks.on('renderApplicationV2', (application, html) => {
  if (typeof application.options.actions !== 'undefined') {
    application.options.actions.clickCount = (event) => {
      event.stopPropagation()
      if (event.detail === 1) {
        console.log('First time in a while')
      } else if (event.detail === 2) {
        ui.notifications.info('You have double clicked')
      } else{
        console.log('You have clicked ' + event.detail + ' since counting started')
      }
    }
  }
  const header = html.querySelector('header.window-header button[data-action="close"]')
  if (header) {
    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.classList.add('header-control', 'icon', 'fa-solid', 'fa-computer-mouse')
    button.dataset.action = 'clickCount'
    header.before(button)
  }
})