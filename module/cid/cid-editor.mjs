//CHAOSIUM ID EDITOR
import { AOV } from '../setup/config.mjs'
import { AOVUtilities } from '../apps/utilities.mjs'
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api 

export class CIDEditor extends HandlebarsApplicationMixin(ApplicationV2) {

  static DEFAULT_OPTIONS = {
    tag: 'form',
    name: "cidEditor",
    classes: ['aov', 'dialog', 'cid-editor'],
    form: {
      handler: CIDEditor._updateObject,
      closeOnSubmit: false,
      submitOnClose: true,
      submitOnChange: true,
    } ,
    position: {
      width: 900,
      height: "auto",
    },
    actions: {
      copyToClip: CIDEditor.copyToClip,
      guess: CIDEditor.guessID,
    },



    window: {
      title: 'AOV.CIDFlag.title',
      contentClasses: ["standard-form"],  
    }
  }  

  get title() {
    return `${game.i18n.localize(this.options.window.title)}`;
  }

  static PARTS = {
    form: {template: 'systems/aov/templates/cid/cid-editor.hbs'},
  }



  async _prepareContext (options) {


    this.document = this.options.document

    const sheetData = await super._prepareContext()
  
    sheetData.objtype = this.document.type
    sheetData.objid = this.document.id
    sheetData.objuuid = this.document.uuid
    sheetData.supportedLanguages = CONFIG.supportedLanguages
    sheetData.isEditable = this.document.sheet.isEditable
    sheetData.guessCode = game.system.api.cid.guessId(this.document)
    sheetData.idPrefix = game.system.api.cid.getPrefix(this.document)
    sheetData.cidFlag = this.document.flags?.aov?.cidFlag
    sheetData.id = sheetData.cidFlag?.id || ''
    sheetData.lang = sheetData.cidFlag?.lang || game.i18n.lang
    sheetData.priority = sheetData.pidFlag?.priority || 0

    const CIDKeys = foundry.utils.flattenObject(game.i18n.translations.AOV.CIDFlag.keys ?? {})
    const prefix = new RegExp('^' + AOVUtilities.quoteRegExp(sheetData.idPrefix))
    sheetData.existingKeys = Object.keys(CIDKeys).reduce((obj, k) => {
      if (k.match(prefix)) {
        obj.push({ k, name: CIDKeys[k] })
      }
      return obj
    }, []).sort(AOVUtilities.sortByNameKey)
    sheetData.isSystemID = (typeof CIDKeys[sheetData.id] !== 'undefined')
    const match = sheetData.id.match(/^([^\\.]+)\.([^\\.]*)\.(.+)/)
    sheetData._existing = (match && typeof match[3] !== 'undefined' ? match[3] : '')

    if (sheetData.id && sheetData.lang) {
      // Find out if there exists a duplicate CID
      const worldDocuments = await game.system.api.cid.fromCIDAll({
        cid: sheetData.id,
        lang: sheetData.lang,
        scope: 'world'
      })
      const uniqueWorldPriority = {}
      sheetData.worldDocumentInfo = await Promise.all(worldDocuments.map(async (d) => {
        return {
          priority: d.flags.aov.cidFlag.priority,
          lang: d.flags.aov.cidFlag.lang ?? 'en',
          link: await foundry.applications.ux.TextEditor.implementation.enrichHTML(d.link, { async: true }),
          folder: d?.folder?.name
        }
      }))
      const uniqueWorldPriorityCount = new Set(worldDocuments.map((d) => d.flags.aov.cidFlag.priority)).size;
      if (uniqueWorldPriorityCount !== worldDocuments.length) {
        sheetData.warnDuplicateWorldPriority = true;
      }
      sheetData.worldDuplicates = worldDocuments.length ?? 0

      const compendiumDocuments = await game.system.api.cid.fromCIDAll({
        cid: sheetData.id,
        lang: sheetData.lang,
        scope: 'compendiums'
      })
      const uniqueCompendiumPriority = {}
      sheetData.compendiumDocumentInfo = await Promise.all(compendiumDocuments.map(async (d) => {
        return {
          priority: d.flags.aov.cidFlag.priority,
          lang: d.flags.aov.cidFlag.lang ?? 'en',
          link: await foundry.applications.ux.TextEditor.implementation.enrichHTML(d.link, { async: true }),
          folder: d?.folder?.name ?? ''
        }
      }))

      const uniqueCompendiumPriorityCount = new Set(compendiumDocuments.map((d) => d.flags.aov.cidFlag.priority)).size;
      if (uniqueCompendiumPriorityCount !== compendiumDocuments.length) {
        sheetData.warnDuplicateCompendiumPriority = true;
      }
      sheetData.compendiumDuplicates = compendiumDocuments.length ?? 0
    } else {
      sheetData.compendiumDocumentInfo = []
      sheetData.worldDocumentInfo = []
      sheetData.worldDuplicates = 0
      sheetData.compendiumDuplicates = 0
      sheetData.warnDuplicateWorldPriority = false
      sheetData.warnDuplicateCompendiumPriority = false
    }
    return sheetData
  }

_onRender (context, options) {
  if (this.element.querySelector('input[name=_existing')) {
    this.element.querySelector('input[name=_existing').addEventListener("change", function (e) {
      const obj = $(this)
      const prefix = obj.data('prefix')
      let value = obj.val()
      if (value !== '') {
        value = prefix + AOVUtilities.toKebabCase(value)
      }
      let target = document.querySelector('input[name=id]');
      target.value = value
    })
}


  if (this.element.querySelector('select[name=known]')) {
    this.element.querySelector('select[name=known]').addEventListener("change", function (e) {
      const obj = $(this)
      let value = obj.val()
      let target = document.querySelector('input[name=id]');
      target.value = value
    })
  }

}

  static async copyToClip(event, target) {
    await AOVUtilities.copyToClipboard($(target).siblings('input').val())
  }

  static async guessID(event, target) {
    const guess = target.dataset.guess
    await this.document.update({
      'flags.aov.cidFlag.id': guess
    })
    const html = $(this.document.sheet.element).find('header.window-header .edit-cid-warning,header.window-header .edit-cid-exisiting')
    if (html.length) {
      html.css({
        color: (guess ? 'var(--color-text-light-highlight)' : 'red')
      })
    }
    this.render()
  }

  static async _updateObject (event, form, formData) {
    const usage = foundry.utils.expandObject(formData.object)
    const id = usage.id || ''
    await this.document.update({
      'flags.aov.cidFlag.id': id,
      'flags.aov.cidFlag.lang': formData.lang || game.i18n.lang,
      'flags.aov.cidFlag.priority': formData.priority || 0
    })
    const html = $(this.document.sheet.element).find('header.window-header .edit-cid-warning,header.window-header .edit-cid-exisiting')
    if (html.length) {
      html.css({
        color: (id ? 'var(--color-text-light-highlight)' : 'red')
      })
    }
    this.render()
  }

}  