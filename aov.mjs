import { AoVActorSheet } from "./system/sheets/actor/actor-sheet.mjs";
import { AoVItemSheet } from "./system/sheets/item/item-sheet.mjs";
import Init from './system/hooks/init.mjs';
import Ready from './system/hooks/ready.mjs';

Hooks.once('init', Init);
Hooks.once('ready', Ready);

Hooks.on('renderActorSheetV2', AoVActorSheet.renderSheet);
Hooks.on('renderItemSheetV2', AoVItemSheet.renderSheet);
