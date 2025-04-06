import { AOVDisplaySettings } from "./settings-displayOptions.mjs";

export async function registerSettings () {

  //Display Settings Button
  game.settings.registerMenu('aov', 'displayOptions', {
    name: 'AOV.Settings.displayOptionsHint',
    label: 'AOV.Settings.displayOptions',
    icon: 'fas fa-palette',
    type: AOVDisplaySettings,
    restricted: true
  })
  AOVDisplaySettings.registerSettings()   

}    