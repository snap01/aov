import { AOVDisplaySettings } from "./settings-displayOptions.mjs";
import { AOVCIDSettings } from "./settings-cidOptions.mjs";

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

  //Chaosium ID Settings Button
  game.settings.registerMenu('aov', 'cidOptions', {
    name: 'AOV.Settings.cidOptionsHint',
    label: 'AOV.Settings.cidOptions',
    icon: 'fas fa-fingerprint',
    type: AOVCIDSettings,
    restricted: true
  })
  AOVCIDSettings.registerSettings()   

  //Game Year
  game.settings.register('aov', "gameYear", {
    name: "AOV.Settings.gameYear",
    hint: "AOV.Settings.gameyearHint",
    scope: "client",
    config: true,
    type: Number,
    default: 977
  });
}    