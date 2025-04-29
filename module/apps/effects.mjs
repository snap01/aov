export function prepareActiveEffectCategories(effects) {
  // Define effect header categories
  const categories = {
    temporary: {
      type: 'temporary',
      label: game.i18n.localize('AOV.Effect.temporary'),
      effects: [],
    },
    passive: {
      type: 'passive',
      label: game.i18n.localize('AOV.Effect.passive'),
      effects: [],
    },
    inactive: {
      type: 'inactive',
      label: game.i18n.localize('AOV.Effect.inactive'),
      effects: [],
    },
  };

  // Iterate over active effects, classifying them into categories
  for (const e of effects) {
    if (e.disabled) categories.inactive.effects.push(e);
    else if (e.isTemporary) categories.temporary.effects.push(e);
    else categories.passive.effects.push(e);
  }

  // Sort each category
  for (const c of Object.values(categories)) {
    c.effects.sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }
  return categories;
}