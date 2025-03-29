//CHAOSIUM ID EDITOR


import { AOV } from '../setup/config.mjs'
import { AOVUtilities } from '../apps/utilities.mjs'
const { api, sheets } = foundry.applications;
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class CIDEditor extends api.HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    classes: ['aov', 'dialog','cid-editor'],
    position: {
    width: 900,
    height: 'auto'
    },
    tag: "form",
  // automatically updates the item
  form: {
    handler: CIDEditor.updateMyCID,
    submitOnChange: true,
    closeOnSubmit: false
  },
  actions: {
    copyToClip: CIDEditor.myCopyToClipboard
  }
}

static PARTS = {
  header: {
    template: "systems/aov/templates/cid/cid-editor.hbs"
  }
}  

  async _prepareContext (options) {
    //const context = super._prepareContext(options)

    let tempObj = await fromUuid(this.options.system.parent.uuid)
    let context = {
      supportedLanguages: CONFIG.supportedLanguages,
      guessCode: game.system.api.cid.guessId(tempObj),
      idPrefix: game.system.api.cid.getPrefix(tempObj),
      cidFlag: tempObj.flags?.Aov?.cidFlag,
      options: {
        editable: tempObj.isOwner
      }  
    }      

    context.id = context.cidFlag?.id || ''
    context.lang = context.cidFlag?.lang || game.i18n.lang
    context.priority = context.cidFlag?.priority || 0
    const CIDKeys = foundry.utils.flattenObject(game.i18n.translations.AOV.CIDFlag.keys ?? {})
    const prefix = new RegExp('^' + AOVUtilities.quoteRegExp(context.idPrefix))
    context.existingKeys = Object.keys(CIDKeys).reduce((obj, k) => {
      if (k.match(prefix)) {
        obj.push({ k, name: CIDKeys[k] })
      }
      return obj
    }, []).sort(AOVUtilities.sortByNameKey)

    context.isSystemID = (typeof CIDKeys[context.id] !== 'undefined')
    const match = context.id.match(/^([^\\.]+)\.([^\\.]*)\.(.+)/)
    context._existing = (match && typeof match[3] !== 'undefined' ? match[3] : '')

    if (context.id && context.lang) {
      // Find out if there exists a duplicate CID
      const worldDocuments = await game.system.api.cid.fromCIDAll({
        cid: context.id,
        lang: context.lang,
        scope: 'world'
      })
      const uniqueWorldPriority = {}
      context.worldDocumentInfo = await Promise.all(worldDocuments.map(async (d) => {
        return {
          priority: d.flags.Aov.cidFlag.priority,
          lang: d.flags.Aov.cidFlag.lang ?? 'en',
          link: await TextEditor.enrichHTML(d.link, { async: true }),
          folder: d?.folder?.name
        }
      }))
      const uniqueWorldPriorityCount = new Set(worldDocuments.map((d) => d.flags.Aov.cidFlag.priority)).size;
      if (uniqueWorldPriorityCount !== worldDocuments.length) {
        context.warnDuplicateWorldPriority = true;
      }
      context.worldDuplicates = worldDocuments.length ?? 0

      const compendiumDocuments = await game.system.api.cid.fromCIDAll({
        cid: context.id,
        lang: context.lang,
        scope: 'compendiums'
      })
      const uniqueCompendiumPriority = {}
      context.compendiumDocumentInfo = await Promise.all(compendiumDocuments.map(async (d) => {
        return {
          priority: d.flags.Aov.cidFlag.priority,
          lang: d.flags.Aov.cidFlag.lang ?? 'en',
          link: await TextEditor.enrichHTML(d.link, { async: true }),
          folder: d?.folder?.name ?? ''
        }
      }))

      const uniqueCompendiumPriorityCount = new Set(compendiumDocuments.map((d) => d.flags.Aov.cidFlag.priority)).size;
      if (uniqueCompendiumPriorityCount !== compendiumDocuments.length) {
        context.warnDuplicateCompendiumPriority = true;
      }
      context.compendiumDuplicates = compendiumDocuments.length ?? 0
    } else {
      context.compendiumDocumentInfo = []
      context.worldDocumentInfo = []
      context.worldDuplicates = 0
      context.compendiumDuplicates = 0
      context.warnDuplicateWorldPriority = false
      context.warnDuplicateCompendiumPriority = false
    }
    console.log(context)
    return context
  }


  _onRender(context,options) {
    this.element.querySelector('input[name=_existing').addEventListener("change", (e) => {
        const obj = $(this.element)
        const prefix = obj.data('prefix')
        let value = obj.val()
        console.log(prefix,value)
        if (value !== '') {
          value = prefix + AOVUtilities.toKebabCase(value)
        }
        })
      
    
  }




  activateListeners (html) {
    super.activateListeners(html)

    if (!this.options.editable) return

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

  static async updateMyCID (event, form, formData)  {
    const id = formData.id || ''
    let tempObj = await fromUuid(this.options.system.parent.uuid)
    await tempObj.update({
      'flags.Aov.cidFlag.id': id,
      'flags.Aov.cidFlag.lang': formData.lang || game.i18n.lang,
      'flags.Aov.cidFlag.priority': formData.priority || 0
    })
    const html = $(tempObj.sheet.element).find('header.window-header .edit-cid-warning,header.window-header .edit-cid-exisiting')
    if (html.length) {
      html.css({
        color: (id ? 'var(--color-text-light-highlight)' : 'red')
      })
    }
    this.render()
  }


  static myCopyToClipboard (event, target) {
    AOVUtilities.copyToClipboard($(this).siblings('input').val())
  }

}  