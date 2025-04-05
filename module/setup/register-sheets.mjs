import { AoVCharacterSheet } from '../sheets/actor/character-sheet.mjs';
import { AoVGearSheet } from '../sheets/item//gear-sheet.mjs';

export function registerSheets () {


  const { sheets } = foundry.applications;
  const { collections } = foundry.documents; 

  collections.Actors.unregisterSheet("core", sheets.ActorSheetV2);
  collections.Actors.registerSheet('aov', AoVCharacterSheet, {
    types: ['character'],
    makeDefault: true
  });

  collections.Items.unregisterSheet("core", sheets.ItemSheetV2);
  collections.Items.registerSheet('aov', AoVGearSheet, {
    types: ['gear'],
    makeDefault: true
  });      
        
}      