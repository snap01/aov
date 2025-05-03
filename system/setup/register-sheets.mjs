import { AoVCharacterSheet } from '../sheets/actor/character-sheet.mjs';
import { AoVGearSheet } from '../sheets/item/gear-sheet.mjs';
import { AoVSkillSheet } from '../sheets/item/skill-sheet.mjs';
import { AoVPassionSheet } from '../sheets/item/passion-sheet.mjs';
import { AoVHitLocSheet} from '../sheets/item/hitloc-sheet.mjs';
import { AoVWoundSheet } from '../sheets/item/wound-sheet.mjs';
import { AoVWeaponCatSheet } from '../sheets/item/weaponCat-sheet.mjs';
import { AoVDevotionSheet } from '../sheets/item/devotion-sheet.mjs';

export function registerSheets() {


  const { sheets } = foundry.applications;
  let { collections } = foundry.documents;

  /* // FoundryVTT V12 */
  if (typeof collections === 'undefined') {
    collections = {
      Actors: Actors,
      Items: Items,
    }
  }

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
  collections.Items.registerSheet('aov', AoVSkillSheet, {
    types: ['skill'],
    makeDefault: true
  });
  collections.Items.registerSheet('aov', AoVPassionSheet, {
    types: ['passion'],
    makeDefault: true
  });
  collections.Items.registerSheet('aov', AoVHitLocSheet, {
    types: ['hitloc'],
    makeDefault: true
  });
  collections.Items.registerSheet('aov', AoVWoundSheet, {
    types: ['wound'],
    makeDefault: true
  });
  collections.Items.registerSheet('aov', AoVWeaponCatSheet, {
    types: ['weaponcat'],
    makeDefault: true
  });
  collections.Items.registerSheet('aov', AoVDevotionSheet, {
    types: ['devotion'],
    makeDefault: true
  });
}
