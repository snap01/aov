import { AoVActorSheet } from "./system/actor/sheets/base-actor-sheet.mjs";
import { AoVItemSheet } from "./system/item/sheets/base-item-sheet.mjs";
import { AOVMenu } from "./system/setup/menu.mjs";
import renderSceneControls from "./system/hooks/render-scene-controls.mjs";
import RenderJournalEntrySheet from './system/hooks/render-journal-entry-sheet.mjs'
import RenderRollTableSheet from './system/hooks/render-roll-table-sheet.mjs'
import CreateToken from './system/hooks/create-token.mjs'

import Init from './system/hooks/init.mjs';
import Ready from './system/hooks/ready.mjs';

Hooks.once('init', Init);
Hooks.once('ready', Ready);
Hooks.on('renderActorSheetV2', AoVActorSheet.renderSheet);
Hooks.on('renderItemSheetV2', AoVItemSheet.renderSheet);
Hooks.on('getSceneControlButtons', AOVMenu.getButtons)
Hooks.on('renderSceneControls', renderSceneControls);
Hooks.on('renderJournalEntrySheet', RenderJournalEntrySheet);
Hooks.on('renderRollTableSheet', RenderRollTableSheet);
Hooks.on('createToken', CreateToken);

