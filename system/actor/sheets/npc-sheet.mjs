import { AOVSelectLists } from '../../apps/select-lists.mjs';
import { AoVActorSheet } from "./base-actor-sheet.mjs"
import { AOVActiveEffect } from '../../apps/active-effects.mjs';
import { AOVActiveEffectSheet } from '../../sheets/aov-active-effect-sheet.mjs'
import { AOVActor } from '../actor.mjs';

export class AoVNPCSheet extends AoVActorSheet {
  constructor(options = {}) {
    super(options)
  }

  static DEFAULT_OPTIONS = {
    classes: ['npc'],
    position: {
      width: 500,
      height: 840
    },
  }

  static PARTS = {
    header: {
      template: 'systems/aov/templates/actor/npc.header.hbs',
      scrollable: ['']
     }
  }

  _configureRenderOptions(options) {
    super._configureRenderOptions(options);
    //Common parts to the character - this is the order they are show on the sheet
    options.parts = ['header'];
  }

  _getTabs(parts) {
  }

  async _prepareContext(options) {
    let context = await super._prepareContext(options)
    //context.tabs = this._getTabs(options.parts);
    context.persTypeOptions = await AOVSelectLists.persType();
    context.persName = game.i18n.localize('AOV.Personality.' + this.actor.system.persType)
    context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      this.actor.system.description,
      {
        async: true,
        secrets: this.document.isOwner,
        rollData: this.actor.getRollData(),
        relativeTo: this.actor,
      }
    );
    context.enrichedGMNotes = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      this.actor.system.gmNotes,
      {
        async: true,
        secrets: this.document.isOwner,
        rollData: this.actor.getRollData(),
        relativeTo: this.actor,
      }
    );
    await this._prepareItems(context);
    return context
  }

  /** @override */
  async _preparePartContext(partId, context) {
    switch (partId) {
    }
    return context;
  }

  //Handle Actor's Items
  async _prepareItems(context) {
    const gears = [];
    const skills = [];
    const hitLocs = [];
    const weapons = [];
    const powers = [];


    for (let itm of this.document.items) {
      if (itm.type === 'gear') {
        gears.push(itm);
      } else if (itm.type === 'skill') {
          skills.push(itm)
      } else if (itm.type === 'hitloc') {
        if (itm.system.lowRoll === itm.system.highRoll) {
          itm.system.label = itm.system.lowRoll
        } else {
          itm.system.label = itm.system.lowRoll + "-" + itm.system.highRoll
        }
        itm.system.order = itm.system.lowRoll
        if (itm.system.order === 0) {itm.system.order = 999}
        hitLocs.push(itm)
      } else if (itm.type === 'weapon') {
        itm.system.damTypeLabel = game.i18n.localize('AOV.DamType.'+ itm.system.damType)
        itm.system.dbLabel = game.i18n.localize('AOV.DamMod.'+itm.system.damMod)
        weapons.push(itm)
      } else if (itm.type === 'npcpower') {
          powers.push(itm)
      }

    }

    //Sort Hit Locs by D20
    hitLocs.sort(function (a, b) {
      let x = a.system.order;
      let y = b.system.order;
      if (x < y) { return -1 };
      if (x > y) { return 1 };
      return 0;
    })

    //Sort Power by Priority Order then alphabetically
    powers.sort(function (a, b) {
      let r = a.name;
      let s = b.name;
      let x = a.system.priority;
      let y = b.system.priority;
      if (x < y) { return 1 };
      if (x > y) { return -1 };
      if (r < s) { return -1 };
      if (s > r) { return 1 };
      return 0;
    })


    context.gears = gears.sort(function (a, b) {return a.name.localeCompare(b.name)});
    context.skills = skills.sort(function (a, b) {return a.name.localeCompare(b.name)});
    context.hitLocs = hitLocs;
    context.weapons = weapons.sort(function (a, b) {return a.name.localeCompare(b.name)});
    context.powers = powers;
  }



  //Activate event listeners using the prepared sheet HTML
  _onRender(context, _options) {
    this._dragDrop.forEach((d) => d.bind(this.element));
    this.element.querySelectorAll('.skill-inline').forEach(n => n.addEventListener("change", this.#skillInline.bind(this)))
    this.element.querySelectorAll('.tab-toggle').forEach(n => n.addEventListener("click", this.#tabView.bind(this)))
  }



  //--------------ACTIONS-------------------



  //--------------LISTENERS------------------

  //Edit Skills Inline
  async #skillInline(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    let newVal = event.target.value
    let field = ""
    if (event.target.dataset.field === 'itemName') {
      field = 'name'
    } else if (event.target.dataset.field === 'powerDescription') {
      field = 'system.description'
    } else {
      field = "system." + event.target.dataset.field
    }
    const item = this.actor.items.get(itemId);
    await item.update({ [field]: newVal });
  }

  //Change Tab View for NPC
  async #tabView(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    let tabval = event.currentTarget.dataset.tabval
    await this.actor.update({'system.tabView' : tabval})
  }
}
