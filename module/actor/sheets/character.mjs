import { CIDEditor } from "../../cid/cid-editor.mjs";
const { api, sheets } = foundry.applications;

export class AovCharacterSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
  constructor (options = {}) {
    super(options)
  }
  
  static DEFAULT_OPTIONS = {
    classes: ['aov', 'actor'],
    position: {
      width: 600,
      height: 520
    },
    tag: "form",
    // automatically updates the item
    form: {
      submitOnChange: true,
    },
    actions: {
      onEditImage: this._onEditImage,
      editCid: AovCharacterSheet.#onEditCid
    }
  }

  static PARTS = {
    header: {
      template: "systems/aov/templates/actor/character.header.hbs"
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs',
    },
    // each tab gets its own template
    attributes: {
      template: 'systems/aov/templates/actor/character.attributes.hbs'
    },
    description: {
      template: 'systems/aov/templates/actor/character.description.hbs'
    },
    gmTab: {
      template: 'systems/aov/templates/actor/character.gmtab.hbs'
    }
  }  

  async _renderFrame(options) {
    const frame = await super._renderFrame(options);
    //define button
    const sheetCID = this.actor.flags?.Aov?.cidFlag;
    const noId = (typeof sheetCID === 'undefined' || typeof sheetCID.id === 'undefined' || sheetCID.id === '')
    //add button
    const label = game.i18n.localize("AOV.CIDFlag.id");
    const cidEditor = `<button type="button" class="header-control icon fa-solid fa-fingerprint ${noId ? 'edit-cid-warning' : 'edit-cid-exisiting'}"
        data-action="editCid" data-tooltip="${label}" aria-label="${label}"></button>`;
    let el = this.window.close;
    while(el.previousElementSibling.localName === 'button') {
      el = el.previousElementSibling;
    }
    el.insertAdjacentHTML("beforebegin", cidEditor);
    return frame;
  }

  async _prepareContext (options) {
    // if we had a base class, do this then mergeObject
    // let context = await super._prepareContext(options);
    let context = {
      editable: this.isEditable,
      owner: this.document.isOwner,
      limited: this.document.limited,
      actor: this.actor,
      system: this.actor.system,
      flag: this.actor.flags,
      isGM: game.user.isGM,
      fields: this.document.schema.fields,
      config: CONFIG.AOV,
      tabs: this._getTabs(options.parts),
    }

    // this could be moved to a helper, review boilerplate code
    context.tabs = {
      attributes: {
        cssClass:  this.tabGroups['primary'] === 'attributes' ? 'active' : '',
        group: 'primary',
        id: 'attributes',
        label: 'AOV.attributes'
      },
      description: {
        cssClass:  this.tabGroups['primary'] === 'description' ? 'active' : '',
        group: 'primary',
        id: 'description',
        label: 'AOV.description'
      },
      gmTab: {
        cssClass:  this.tabGroups['primary'] === 'gmTab' ? 'active' : '',
        group: 'primary',
        id: 'gmTab',
        label: 'AOV.gmTab'
      }
    }
    this._prepareItems(context);    
    return context
  }  

 /** @override */
 async _preparePartContext(partId, context) {
    switch (partId) {
      case 'features':
      case 'spells':
      case 'gear':
        context.tab = context.tabs[partId];
        break;
      case 'biography':
        context.tab = context.tabs[partId];
        // Enrich biography info for display
        // Enrichment turns text like `[[/r 1d20]]` into buttons
        context.enrichedNotes = await TextEditor.enrichHTML(
          this.actor.system.notes,
          {
            // Whether to show secret blocks in the finished html
            secrets: this.document.isOwner,
            // Data to fill in for inline rolls
            rollData: this.actor.getRollData(),
            // Relative UUID resolution
            relativeTo: this.actor,
          }
        );
        break;
    }
    return context;
  }

  _getTabs(parts) {
    // If you have sub-tabs this is necessary to change
    const tabGroup = 'primary';
    // Default tab for first time it's rendered this session
    if (!this.tabGroups[tabGroup]) this.tabGroups[tabGroup] = 'attributes';
    return parts.reduce((tabs, partId) => {
      const tab = {
        cssClass: '',
        group: tabGroup,
        // Matches tab property to
        id: '',
        // FontAwesome Icon, if you so choose
        icon: '',
        // Run through localization
        label: 'AOV.Actor.Tabs.',
      };
      switch (partId) {
        case 'header':
        case 'tabs':
          return tabs;
        case 'attributes':
          tab.id = 'attributes';
          tab.label += 'Attributes';
          break;
        case 'description':
          tab.id = 'description';
          tab.label += 'Description';
          break;
        case 'gmTab':
          tab.id = 'gmTab';
          tab.label += 'GmTab';
          break;
      }
      if (this.tabGroups[tabGroup] === tab.id) tab.cssClass = 'active';
      tabs[partId] = tab;
      return tabs;
    }, {});
  }

  _prepareItems(context) {

  }  

  //Edit Image
  static async _onEditImage(event, target) {
    const attr = target.dataset.edit;
    const current = foundry.utils.getProperty(this.document, attr);
    const { img } =
      this.document.constructor.getDefaultArtwork?.(this.document.toObject()) ??
      {};
    const fp = new foundry.applications.apps.FilePicker({
      current,
      type: 'image',
      redirectToRoot: img ? [img] : [],
      callback: (path) => {
        this.document.update({ [attr]: path });
      },
      top: this.position.top + 40,
      left: this.position.left + 10,
    });
    return fp.browse();
  }

    // handle editCid action
    static #onEditCid(event) {
        event.stopPropagation(); // Don't trigger other events
        if ( event.detail > 1 ) return; // Ignore repeated clicks
        new CIDEditor(this.actor, {}).render(true, { focus: true })
      }
}    