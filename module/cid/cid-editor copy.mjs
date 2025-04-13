//CHAOSIUM ID EDITOR
import { AOV } from '../setup/config.mjs'
import { AOVUtilities } from '../apps/utilities.mjs'

export class CIDEditor extends FormApplication {
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['aov', 'dialog', 'cid-editor'],
      template: 'systems/aov/templates/cid/cid-editor.hbs',
      width: 900,
      height: 'auto',
      title: 'AOV.CIDFlag.title',
      closeOnSubmit: false,
      submitOnClose: true,
      submitOnChange: true
    })
  }

  async getData () {
    const sheetData = super.getData()

    sheetData.supportedLanguages = CONFIG.supportedLanguages

    this.options.editable = this.object.sheet.isEditable

    sheetData.guessCode = game.system.api.cid.guessId(this.object)
    sheetData.idPrefix = game.system.api.cid.getPrefix(this.object)

    sheetData.cidFlag = this.object.flags?.aov?.cidFlag

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
          link: await TextEditor.enrichHTML(d.link, { async: true }),
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
          link: await TextEditor.enrichHTML(d.link, { async: true }),
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

  activateListeners (html) {
    super.activateListeners(html)

    html.find('a.copy-to-clipboard').click(function (e) {
      AOVUtilities.copyToClipboard($(this).siblings('input').val())
    })

    if (!this.object.sheet.isEditable) return

    html.find('input[name=_existing').change(function (e) {
      const obj = $(this)
      const prefix = obj.data('prefix')
      let value = obj.val()
      if (value !== '') {
        value = prefix + AOVUtilities.toKebabCase(value)
      }
      html.find('input[name=id]').val(value).trigger('change')
    })

    html.find('select[name=known]').change(function (e) {
      const obj = $(this)
      html.find('input[name=id]').val(obj.val())
    })

    html.find('a[data-guess]').click(async function (e) {
      e.preventDefault()
      const obj = $(this)
      const guess = obj.data('guess')
      html.find('input[name=id]').val(guess).trigger('change')
    })
  }

  async _updateObject (event, formData) {
    const id = formData.id || ''
    await this.object.update({
      'flags.aov.cidFlag.id': id,
      'flags.aov.cidFlag.lang': formData.lang || game.i18n.lang,
      'flags.aov.cidFlag.priority': formData.priority || 0
    })
    const html = $(this.object.sheet.element).find('header.window-header .edit-cid-warning,header.window-header .edit-cid-exisiting')
    if (html.length) {
      html.css({
        color: (id ? 'var(--color-text-light-highlight)' : 'red')
      })
    }
    this.render()
  }

}  