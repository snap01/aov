import { AoVActorSheet } from "./system/actor/sheets/actor-sheet.mjs";
import { AoVItemSheet } from "./system/item/sheets/item-sheet.mjs";
import { AOVMenu } from "./system/setup/menu.mjs";


import Init from './system/hooks/init.mjs';
import Ready from './system/hooks/ready.mjs';

Hooks.once('init', Init);
Hooks.once('ready', Ready);
Hooks.on('renderActorSheetV2', AoVActorSheet.renderSheet);
Hooks.on('renderItemSheetV2', AoVItemSheet.renderSheet);
Hooks.on('getSceneControlButtons', AOVMenu.getButtons)
Hooks.on('renderSceneControls', AOVMenu.renderControls)

