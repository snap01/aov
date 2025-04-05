import { AoVItemSheet} from "./item-sheet.mjs"

export class AoVGearSheet extends AoVItemSheet {
  constructor (options = {}) {
    super(options)
  }
  
  static DEFAULT_OPTIONS = {
    classes: ['aov', 'sheet', 'item'],
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
      template: "systems/aov/templates/item/item.header.hbs"
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs',
    },
    // each tab gets its own template
    attributes: {
      template: 'systems/aov/templates/item/gear.detail.hbs'
    },
    description: {
      template: 'systems/aov/templates/item/item.description.hbs'
    },
    gmTab: {
      template: 'systems/aov/templates/item/item.gmtab.hbs'
    }
  }  

  async _prepareContext (options) {
    let context = await super._prepareContext(options)
    // this could be moved to a helper, review boilerplate code
    context.tabs = {
      attributes: {
        cssClass:  this.tabGroups['primary'] === 'details' ? 'active' : '',
        group: 'primary',
        id: 'details',
        label: 'AOV.details'
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
      case 'details':
        context.tab = context.tabs[partId];
        break;
      case 'description':
        context.tab = context.tabs[partId];
        context.enrichedDescription = await TextEditor.enrichHTML(
          this.item.system.description,
          {
            async: true,
            secrets: this.document.isOwner,
            rollData: this.document.getRollData(),
            relativeTo: this.document,
          }
        );
        break;
      case 'gmTab':
        context.tab = context.tabs[partId];
        context.enrichedGMNotes = await TextEditor.enrichHTML(
          this.item.system.gmNotes,
          {
            async: true,
            secrets: this.document.isOwner,
            rollData: this.document.getRollData(),
            relativeTo: this.document,
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
    if (!this.tabGroups[tabGroup]) this.tabGroups[tabGroup] = 'details';
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
        case 'details':
          tab.id = 'details';
          tab.label += 'Details';
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