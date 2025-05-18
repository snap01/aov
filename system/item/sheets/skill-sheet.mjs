import { AoVItemSheet } from "./base-item-sheet.mjs"
import { AOVSelectLists } from "../../apps/select-lists.mjs"

export class AoVSkillSheet extends AoVItemSheet {
  constructor(options = {}) {
    super(options)
  }

  static DEFAULT_OPTIONS = {
    classes: ['skill'],
    position: {
      width: 600,
      height: 570
    },
  }

  static PARTS = {
    header: { template: 'systems/aov/templates/item/item.header.hbs' },
    tabs: { template: 'systems/aov/templates/generic/tab-navigation.hbs' },
    details: { template: 'systems/aov/templates/item/skill.detail.hbs' },
    description: { template: 'systems/aov/templates/item/item.description.hbs' },
    gmTab: { template: 'systems/aov/templates/item/item.gmtab.hbs' }
  }

  async _prepareContext(options) {
    let context = await super._prepareContext(options)
    context.tabs = this._getTabs(options.parts);
    context.skillCatOptions = await AOVSelectLists.skillCat()
    context.skillCatName = game.i18n.localize("AOV.skillCat." + context.system.category);
    context.baseSkillOptions = await AOVSelectLists.baseSkill()
    context.baseSkillName = game.i18n.localize("AOV." + context.system.baseVal);
    context.weaponTypeOptions = await AOVSelectLists.weaponType()
    context.weaponTypeName = game.i18n.localize("AOV." + context.system.weaponType);
    if (context.system.category === 'cbt') {
      context.weaponCatOptions = await AOVSelectLists.getWeaponCategories();
      let weaponCat = await game.aov.cid.fromCID(context.system.weaponCat);
      context.weaponCatName = weaponCat[0].name ?? ""
    } else {
      context.weaponCatName = ""
    }
    context.system.total = (context.system.base ?? 0) + (context.system.xp ?? 0) + (context.system.home ?? 0) + (context.system.pers ?? 0) + (context.system.effects ?? 0)
    context.system.catBonus = 0
    if (context.hasOwner && context.system.total > 0) {
      context.system.catBonus = this.item.parent.system[this.item.system.category] ?? 0
    }
    context.system.total += context.system.catBonus


    return context
  }

  /** @override */
  async _preparePartContext(partId, context) {
    switch (partId) {
      case 'details':
        context.tab = context.tabs[partId];
        break;
      case 'description':
        context.tab = context.tabs[partId];
        context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
          this.item.system.description,
          {
            secrets: this.document.isOwner,
            rollData: this.document.getRollData(),
            relativeTo: this.document,
          }
        );
        break;
      case 'gmTab':
        context.tab = context.tabs[partId];
        context.enrichedGMNotes = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
          this.item.system.gmNotes,
          {
            secrets: this.document.isOwner,
            rollData: this.document.getRollData(),
            relativeTo: this.document,
          }
        );
        break;
    }
    return context;
  }

  _configureRenderOptions(options) {
    super._configureRenderOptions(options);
    //Only show GM tab if you are GM
    options.parts = ['header', 'tabs', 'details','description'];
    if (game.user.isGM) {
        options.parts.push('gmTab');
    }
  }

  _getTabs(parts) {
    const tabGroup = 'primary';
    //Default tab
    if (!this.tabGroups[tabGroup]) this.tabGroups[tabGroup] = 'details';
    return parts.reduce((tabs, partId) => {
      const tab = {
        cssClass: '',
        group: tabGroup,
        id: '',
        icon: '',
        label: 'AOV.',
      };
      switch (partId) {
        case 'header':
        case 'tabs':
          return tabs;
        case 'details':
          tab.id = 'details';
          tab.label += 'details';
          break;
        case 'description':
          tab.id = 'description';
          tab.label += 'description';
          break;
        case 'gmTab':
          tab.id = 'gmTab';
          tab.label += 'gmTab';
          break;
      }
      if (this.tabGroups[tabGroup] === tab.id) tab.cssClass = 'active';
      tabs[partId] = tab;
      return tabs;
    }, {});
  }


  //Activate event listeners using the prepared sheet HTML
  _onRender(context, _options) {
  }


  //-----------------------ACTIONS-----------------------------------

}
