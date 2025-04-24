import { prepareActiveEffectCategories } from '../../apps/effects.mjs';

import { AoVActorSheet} from "./actor-sheet.mjs"

export class AoVCharacterSheet extends AoVActorSheet {
  constructor (options = {}) {
    super(options)
    //this.#dragDrop = this.#createDragDropHandlers();
  }
  
  static DEFAULT_OPTIONS = {
    classes: ['character'],
    position: {
      width: 700,
      height: 950
    },
  }

  static PARTS = {
    header: {template: 'systems/aov/templates/actor/character.header.hbs'},
    tabs: {template: 'systems/aov/templates/actor/character-tab.hbs'},
    skills: {template: 'systems/aov/templates/actor/character.skills.hbs',
             scrollable:[''],},
    passions: {template: 'systems/aov/templates/actor/character.passions.hbs',
               scrollable:[''],},             
    gear: {template: 'systems/aov/templates/actor/character.gear.hbs'},
    notes: {template: 'systems/aov/templates/actor/character.notes.hbs'},
    effects: {template: 'systems/aov/templates/actor/character.effects.hbs',
              scrollable:[''],},
    stats: {template: 'systems/aov/templates/actor/character.stats.hbs'},              
    gmTab: {template: 'systems/aov/templates/actor/character.gmtab.hbs'},
  }  

  _configureRenderOptions(options) {
    super._configureRenderOptions(options);
    //Common parts to the character
    options.parts = ['header', 'tabs', 'skills','passions','gear','notes','effects','stats'];
    //GM only tabs
    if (game.user.isGM) {
      options.parts.push('gmTab');
    }
  }  

  _getTabs(parts) {
    // If you have sub-tabs this is necessary to change
    const tabGroup = 'primary';
    // Default tab for first time it's rendered this session
    if (!this.tabGroups[tabGroup]) this.tabGroups[tabGroup] = 'skills';
    return parts.reduce((tabs, partId) => {
      const tab = {
        cssClass: '',
        group: tabGroup,
        id: '',
        icon: '',
        label: 'AOV.Tabs.',
      };
      switch (partId) {
        case 'header':
        case 'tabs':
          return tabs;
        case 'skills':
          tab.id = 'skills';

          tab.label += 'skills';
          tab.colour = 'tab-red';
          break;
        case 'passions':
            tab.id = 'passions';
            tab.label += 'passions';
            tab.colour = 'tab-blue';
            break;          
        case 'gear':
          tab.id = 'gear';
          tab.label += 'gear';
          tab.colour='tab-green';
          break;
        case 'notes':
          tab.id = 'notes';
          tab.label += 'notes';
          tab.colour = 'tab-red';
          break;
        case 'effects':
          tab.id = 'effects';
          tab.label += 'effects';
          tab.colour = 'tab-blue';
          break;
        case 'stats': {
          tab.id = 'stats';
          tab.label += 'stats';
          tab.colour = 'tab-green';
          break;
        }  

        case 'gmTab':
          tab.id = 'gmTab';
          tab.label += 'gmTab';
          tab.colour = 'tab-yellow';
          break;
      }
      if (this.tabGroups[tabGroup] === tab.id) tab.cssClass = 'active';
      tabs[partId] = tab;
      return tabs;
    }, {});
  }

  async _prepareContext (options) {
    let context = await super._prepareContext(options)
    context.tabs = this._getTabs(options.parts);
    
    await this._prepareItems(context);    
    return context
  }  

 /** @override */
 async _preparePartContext(partId, context) {
    switch (partId) {
      case 'skills':
      case 'passions':
      case 'gear' :  
      case 'stats' : 
        context.tab = context.tabs[partId];
        break;
      case 'notes':
        context.tab = context.tabs[partId];
        context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
          this.actor.system.description,
          {
            async: true,
            secrets: this.document.isOwner,
            rollData: this.actor.getRollData(),
            relativeTo: this.actor,
          }
        );
        break;
        case 'effects':
          context.tab = context.tabs[partId];
          context.effects = prepareActiveEffectCategories(this.actor.allApplicableEffects());
          break;        
        case 'gmTab':
          context.tab = context.tabs[partId];
          context.enrichedGMNotes = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
            this.actor.system.gmNotes,
            {
              async: true,
              secrets: this.document.isOwner,
              rollData: this.actor.getRollData(),
              relativeTo: this.actor,
            }
          );
          break;  
    }
    return context;
  }

  //Handle Actor's Items
  _prepareItems(context) {
    const gear = [];
    const skills = [];
    const passions = [];

  for (let itm of this.document.items) {
    if (itm.type === 'gear') {
      gear.push(itm);
    } else if (itm.type === 'skill') {
      itm.isType = false;
      skills.push(itm)
    } else if (itm.type === 'passion') {
      passions.push(itm)
    }  
  }

  //Add Skill Categories
  skills.push(
    {name: game.i18n.localize('AOV.skillCat.agi'), isType: true, system: {label:game.i18n.localize('AOV.skillCat.agi'),total: this.actor.system.agi, category:'agi'}},
    {name: game.i18n.localize('AOV.skillCat.com'), isType: true, system: {label:game.i18n.localize('AOV.skillCat.com'),total: this.actor.system.com, category:'com'}},
    {name: game.i18n.localize('AOV.skillCat.knw'), isType: true, system: {label:game.i18n.localize('AOV.skillCat.knw'),total: this.actor.system.knw, category:'knw'}},
    {name: game.i18n.localize('AOV.skillCat.man'), isType: true, system: {label:game.i18n.localize('AOV.skillCat.man'),total: this.actor.system.man, category:'man'}},
    {name: game.i18n.localize('AOV.skillCat.myt'), isType: true, system: {label:game.i18n.localize('AOV.skillCat.myt'),total: this.actor.system.myt, category:'myt'}},
    {name: game.i18n.localize('AOV.skillCat.per'), isType: true, system: {label:game.i18n.localize('AOV.skillCat.per'),total: this.actor.system.per, category:'per'}},
    {name: game.i18n.localize('AOV.skillCat.ste'), isType: true, system: {label:game.i18n.localize('AOV.skillCat.ste'),total: this.actor.system.ste, category:'ste'}},
    
  );

  skills.sort(function(a, b){
    let x = a.name.toLowerCase();
    let y = b.name.toLowerCase();
    let r = a.system.category;
    let s = b.system.category;
    let p = a.isType;
    let q = b.isType;
    if (r < s) {return -1};
    if (r > s) {return 1};
    if (p < q) {return 1};
    if (p > q) {return -1};
    if (x < y) {return -1};
    if (x > y) {return 1};
    return 0;
  });
  
  passions.sort(function(a, b){
    let x = a.name.toLowerCase();
    let y = b.name.toLowerCase();
    if (x < y) {return -1};
    if (x > y) {return 1};
    return 0;
  });


    context.gear = gear.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    context.skills = skills
    context.passions = passions.sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }  



  //Activate event listeners using the prepared sheet HTML
  _onRender (context, _options) {
    this._dragDrop.forEach((d) => d.bind(this.element));
    this.element.querySelectorAll('.item-quantity').forEach(n => n.addEventListener("change", this.#editQty.bind(this)))
  }



  //--------------ACTIONS-------------------



  //--------------LISTENERS------------------
  //Handle Actor Toggles
  async #editQty (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const newQuantity = event.currentTarget.value;
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    item.update({ 'system.quantity': newQuantity });
  }

  


  
}    