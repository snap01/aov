import { AOVSelectLists } from '../../apps/select-lists.mjs';
import { AoVActorSheet } from "./base-actor-sheet.mjs"

export class AoVShipSheet extends AoVActorSheet {
  constructor(options = {}) {
    super(options)
  }

  static DEFAULT_OPTIONS = {
    classes: ['ship'],
    position: {
      width: 700,
      height: 950
    },
  }

  static PARTS = {
    header: { template: 'systems/aov/templates/actor/ship.header.hbs' },
  }

  _configureRenderOptions(options) {
    super._configureRenderOptions(options);
    //Common parts to the character - this is the order they are show on the sheet
    options.parts = ['header'];
  }

  async _prepareContext(options) {
    let context = await super._prepareContext(options)
    context.hullTypes = await AOVSelectLists.hullTypes();
    context.hullName = game.i18n.localize('AOV.ship.' + context.system.hull.type)
    context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      this.actor.system.description,
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
    }



  //Activate event listeners using the prepared sheet HTML
  _onRender(context, _options) {
    this._dragDrop.forEach((d) => d.bind(this.element));
  }



  //--------------ACTIONS-------------------



  //--------------LISTENERS------------------
  //Handle Actor Toggles
}
