const { api, sheets } = foundry.applications;
import { CIDEditor } from "../../cid/cid-editor.mjs";

export class AoVActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
  constructor(options = {}) {
    super(options);
  }

  async _renderFrame(options) {
    const frame = await super._renderFrame(options);
    //define button
    const sheetCID = this.actor.flags?.aov?.cidFlag;
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
      actor: this.actor,
      flags: this.actor.flags,
      isGM: game.user.isGM,
      fields: this.document.schema.fields,
      config: CONFIG.AOV,
      system: this.actor.system,
    };
  }

  /**
   * Handle changing a Document's image.
   *
   * @this AoVActorSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @returns {Promise}
   * @protected
   */
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


    //new CIDEditor({uuidArray: this.actor.uuid}, {}).render(true, { focus: true })
    

    new CIDEditor({document: this.document}, {}).render(true, { focus: true })
  }

  //Implement Game Settings for Colours
  static renderSheet (sheet,html) {
    if (game.settings.get('aov', 'primaryFontColour')) {
      document.body.style.setProperty('--primary-font-colour', game.settings.get('aov', 'primaryFontColour'));
    }

    if (game.settings.get('aov', 'secondaryFontColour')) {
      document.body.style.setProperty('--secondary-font-colour', game.settings.get('aov', 'secondaryFontColour'));
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