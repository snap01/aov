import { CIDEditor } from "/systems/aov/module/cid/cid-editor.mjs";

const { api, sheets } = foundry.applications;

export class AoVItemSheet extends api.HandlebarsApplicationMixin(sheets.ItemSheetV2) {
  constructor(options = {}) {
    super(options);
  }

  static DEFAULT_OPTIONS = {
    classes: ['aov', 'sheet', 'item'],
    position: {
      width: 600,
      height: 520
    },
    tag: "form",
    form: {
      submitOnChange: true,
    },
    actions: {
      onEditImage: this._onEditImage,
      editCid: this._onEditCid,
      itemToggle: this._onItemToggle,
    }
  }

  async _renderFrame(options) {
    const frame = await super._renderFrame(options);
    //define button
    const sheetCID = this.item.flags?.aov?.cidFlag;
    const noId = (typeof sheetCID === 'undefined' || typeof sheetCID.id === 'undefined' || sheetCID.id === '');
    //add button
    const label = game.i18n.localize("AOV.CIDFlag.id");
    const cidEditor = `<button type="button" class="header-control icon fa-solid fa-fingerprint ${noId ? 'edit-cid-warning' : 'edit-cid-exisiting'}"
        data-action="editCid" data-tooltip="${label}" aria-label="${label}"></button>`;
    let el = this.window.close;
    while (el.previousElementSibling.localName === 'button') {
      el = el.previousElementSibling;
    }
    el.insertAdjacentHTML("beforebegin", cidEditor);
    return frame;
  }

  async _prepareContext(options) {
    return {
      editable: this.isEditable,
      owner: this.document.isOwner,
      limited: this.document.limited,
      item: this.item,
      flags: this.item.flags,
      system: this.item.system,
      hasOwner: this.item.isEmbedded === true,
      isGM: game.user.isGM,
      fields: this.document.schema.fields,
      config: CONFIG.AOV,
    };
  }

  // Handle changing a Document's image.
  static async _onEditImage(event, target) {
    const attr = target.dataset.edit;
    const current = foundry.utils.getProperty(this.document, attr);
    const { img } = this.document.constructor.getDefaultArtwork?.(this.document.toObject()) ??
      {};
    const fp = new foundry.applications.apps.FilePicker({
      current,
      type: 'image',
      redirectToRoot: img ? [img] : [],
      callback: (path) => {
        this.document.update({ [attr]: path });
      },
      top: this.position.top + 39,
      left: this.position.left + 9,
    });
    return fp.browse();
  }

  // handle editCid action
  static _onEditCid(event) {
    event.stopPropagation(); // Don't trigger other events
    if ( event.detail > 1 ) return; // Ignore repeated clicks
    new CIDEditor(this.item, {}).render(true, { focus: true })
  }




  //Add CID Editor Button as seperate icon on the Window header
  async _renderFrame(options) {
    const frame = await super._renderFrame(options);
    //define button
    const sheetCID = this.item.flags?.aov?.cidFlag;
    const noId = (typeof sheetCID === 'undefined' || typeof sheetCID.id === 'undefined' || sheetCID.id === '');
    //add button
    const label = game.i18n.localize("AOV.CIDFlag.id");
    const cidEditor = `<button type="button" class="header-control icon fa-solid fa-fingerprint ${noId ? 'edit-cid-warning' : 'edit-cid-exisiting'}"
        data-action="editCid" data-tooltip="${label}" aria-label="${label}"></button>`;
    let el = this.window.close;
    while (el.previousElementSibling.localName === 'button') {
      el = el.previousElementSibling;
    }
    el.insertAdjacentHTML("beforebegin", cidEditor);
    return frame;
  }

  //------------ACTIONS-------------------

  // Change Image
  static async _onEditImage(event, target) {
    const attr = target.dataset.edit;
    const current = foundry.utils.getProperty(this.document, attr);
    const { img } = this.document.constructor.getDefaultArtwork?.(this.document.toObject()) ??
      {};
    const fp = new foundry.applications.apps.FilePicker({
      current,
      type: 'image',
      redirectToRoot: img ? [img] : [],
      callback: (path) => {
        this.document.update({ [attr]: path });
      },
      top: this.position.top + 39,
      left: this.position.left + 9,
    });
    return fp.browse();
  }

  // Handle editCid action
  static _onEditCid(event) {
    event.stopPropagation(); // Don't trigger other events
    if ( event.detail > 1 ) return; // Ignore repeated clicks
    new CIDEditor({document: this.document}, {}).render(true, { focus: true })
  }

  // Toggle something on the item
  static _onItemToggle(event,target) {
    event.preventDefault();
    let checkProp={};
    const prop = target.dataset.property
    if (['noXP','xpCheck',"specSkill"].includes(prop)) {
      checkProp = {[`system.${prop}`] : !this.item.system[prop]}
    } else {return}
    
    this.item.update(checkProp)
  }



 //Implement Game Settings for Colours etc
 static renderSheet (sheet,html) {
  if (game.settings.get('aov', 'primaryFontColour')) {
    document.body.style.setProperty('--primary-font-colour', game.settings.get('aov', 'primaryFontColour'));
  }

  if (game.settings.get('aov', 'secondaryFontColour')) {
    document.body.style.setProperty('--aov-secondary-font-colour', game.settings.get('aov', 'secondaryFontColour'));
  }

  if (game.settings.get('aov', 'primaryBackColour')) {
    document.body.style.setProperty('--primary-back-colour', game.settings.get('aov', 'primaryBackColour'));
  }
      
  if (game.settings.get('aov', 'secondaryBackColour')) {
    document.body.style.setProperty('--secondary-back-colour', game.settings.get('aov', 'secondaryBackColour'));
  }        

  if (game.settings.get('aov', 'primaryFont')) {
    let fontSource="url(/"+game.settings.get('aov', 'primaryFont')+")"
    const primaryFont = new FontFace(
      'primaryFont',
      fontSource
    )
    primaryFont
      .load()
      .then(function (loadedFace) {document.fonts.add(loadedFace)})
      .catch(function (error) {
        ui.notifications.error(error)
      })
      document.body.style.setProperty('--primary-font', 'primaryFont');
    }
}

}