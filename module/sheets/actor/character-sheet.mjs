import { AoVActorSheet} from "./actor-sheet.mjs"

export class AoVCharacterSheet extends AoVActorSheet {
  constructor (options = {}) {
    super(options)
  }
  
  static DEFAULT_OPTIONS = {
    classes: ['aov', 'sheet', 'actor'],
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
      editCid: this._onEditCid
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

  async _prepareContext (options) {
    // if we had a base class, do this then mergeObject
    // let context = await super._prepareContext(options);
    let context = await super._prepareContext(options)

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
      case 'attributes':
        context.tab = context.tabs[partId];
        break;
      case 'description':
        context.tab = context.tabs[partId];
        context.enrichedDescription = await TextEditor.enrichHTML(
          this.actor.system.description,
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

  /**
   * Activate event listeners using the prepared sheet HTML
   */
  _onRender (context, _options) {
    // Everything below here is only needed if the sheet is editable
    if (!context.editable) return;

    // pure Javascript, no jQuery
    this.element.querySelectorAll('.actor-toggle').forEach(n => n.addEventListener("dblclick", this.#onActorToggle.bind(this)));
  }


  //Handle Actor Toggles
  async #onActorToggle (event){
  }


  //Handle Actor's Items
  _prepareItems(context) {
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
}    