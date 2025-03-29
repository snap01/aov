import { AovCharacterSheet } from '../actor/sheets/character.mjs';



export function registerSheets () {


  const { sheets } = foundry.applications;
  const { collections } = foundry.documents; 

  collections.Actors.unregisterSheet("core", sheets.ActorSheetV2);
  collections.Actors.registerSheet('aov', AovCharacterSheet, {
        types: ['character'],
        makeDefault: true
      })
        
}      