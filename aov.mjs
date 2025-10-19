import { AOVMenu } from "./system/setup/menu.mjs";
import drawNote from "./system/hooks/draw-note.mjs";
import renderSceneControls from "./system/hooks/render-scene-controls.mjs";
import RenderJournalEntrySheet from './system/hooks/render-journal-entry-sheet.mjs'
import RenderNoteConfig from './system/hooks/render-note-config.js'
import RenderRollTableSheet from './system/hooks/render-roll-table-sheet.mjs'
import CreateToken from './system/hooks/create-token.mjs'
import RenderChatMessageHTML from './system/hooks/render-chat-message.mjs'
import RenderRegionConfig from './system/hooks/render-region-config.mjs'

import Init from './system/hooks/init.mjs';
import Ready from './system/hooks/ready.mjs';

Hooks.once('init', Init);
Hooks.once('ready', Ready);
Hooks.on('drawNote', drawNote)
Hooks.on('getSceneControlButtons', AOVMenu.getButtons)
Hooks.on('renderSceneControls', renderSceneControls);
Hooks.on('renderJournalEntrySheet', RenderJournalEntrySheet);
Hooks.on('renderNoteConfig', RenderNoteConfig)
Hooks.on('renderRollTableSheet', RenderRollTableSheet);
Hooks.on('renderChatMessageHTML', RenderChatMessageHTML);
Hooks.on('createToken', CreateToken);
Hooks.on('renderRegionConfig', RenderRegionConfig);
