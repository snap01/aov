//CHAOSIUM ID (CID)

/* global Actor, Card, CONFIG, foundry, game, Item, JournalEntry, Macro, Playlist, RollTable, Scene, SceneNavigation, ui */
//import { AOV } from '../setup/config.mjs'
import { AOVUtilities } from '../apps/utilities.mjs'

export class CID {
  static init () {
    CONFIG.Actor.compendiumIndexFields.push('flags.aov.cidFlag')
    CONFIG.Item.compendiumIndexFields.push('flags.aov.cidFlag')
    CONFIG.JournalEntry.compendiumIndexFields.push('flags.aov.cidFlag')
    // CONFIG.Macro.compendiumIndexFields.push('flags.aov.cidFlag')
    CONFIG.RollTable.compendiumIndexFields.push('flags.aov.cidFlag')
    game.system.api = {
      cid: CID
    }
  }


  /**
   * Returns RegExp for valid type and format
   * @returns RegExp
   */
  static regExKey () {
    return new RegExp('^(' + Object.keys(CID.gamePropertyLookup).join('|') + ')\\.(.*?)\\.(.+)$')
  }

  /**
   * Get CID type.subtype. based on document
   * @param document
   * @returns string
   */
  static getPrefix (document) {
    for (const type in CID.documentNameLookup) {
      if (document instanceof CID.documentNameLookup[type]) {
        return type + '.' + (document.type ?? '') + '.'
      }
    }
    return ''
  }

  /**
   * Get CID type.subtype.name based on document
   * @param document
   * @returns string
   */
  static guessId (document) {
    return CID.getPrefix(document) + AOVUtilities.toKebabCase(document.name)
  }

  /**
   * Get CID type.subtype.partial-name(-removed)
   * @param key
   * @returns string
   */
  static guessGroupFromKey (id) {
    if (id) {
      const key = id.replace(/([^\\.-]+)$/, '')
      if (key.substr(-1) === '-') {
        return key
      }
    }
    return ''
  }

  /**
   * Get CID type.subtype.partial-name(-removed)
   * @param document
   * @returns string
   */
  static guessGroupFromDocument (document) {
    return CID.guessGroupFromKey(document.flags?.aov?.cidFlag?.id)
  }

  /**
   * Returns all items with matching CIDs, and language
   * ui.notifications.warn for missing keys
   * @param itemList array of CIDs
   * @param lang the language to match against ('en', 'es', ...)
   * @param langFallback should the system fall back to en incase there is no translation
   * @param showLoading Show loading bar
   * @returns array
   */
  static async expandItemArray ({ itemList, lang = game.i18n.lang, langFallback = true, showLoading = false } = {}) {
    let items = []
    const cids = itemList.filter(it => typeof it === 'string')
    items = itemList.filter(it => typeof it !== 'string')

    if (cids.length) {
      const found = await CID.fromCIDRegexBest({ cidRegExp: CID.makeGroupRegEx(cids), type: 'i', lang, langFallback, showLoading })
      const all = []
      for (const cid of cids) {
        const item = found.find(i => i.flags.aov.cidFlag.id === cid)
        if (item) {
          all.push(item)
        }
      }
      if (all.length < cids.length) {
        const notmissing = []
        for (const doc of all) {
          notmissing.push(doc.flags.aov.cidFlag.id)
        }
        ui.notifications.warn(game.i18n.format('AOV.CIDFlag.error.documents-not-found', { cids: cids.filter(x => !notmissing.includes(x)).join(', '), lang}))
      }
      items = items.concat(all)
    }
    return items
  }

  /**
   * Returns item with matching CIDs from list
   * Empty array return for missing keys
   * @param cid a single cid
   * @param list array of items
   * @returns array
   */
  static findCIdInList (cid, list) {
    let itemName = ''
    const CIDKeys = foundry.utils.flattenObject(game.i18n.translations.AOV.CIDFlag.keys)
    if (typeof CIDKeys[cid] !== 'undefined') {
      itemName = CIDKeys[cid]
    }
    return (typeof list.filter === 'undefined' ? Object.values(list) : list).filter(i => i.flags?.aov?.cidFlag?.id === cid || (itemName !== '' && itemName === i.name))
  }

  /**
   * Returns RegExp matching all strings in array
   * @param cids an array of CID strings
   * @param list array of items
   * @returns RegExp
   */
  static makeGroupRegEx (cids) {
    if (typeof cids === 'string') {
      cids = [cids]
    } else if (typeof cids === 'undefined' || typeof cids.filter !== 'function') {
      return undefined
    }
    const splits = {}
    const rgx = CID.regExKey()
    for (const i of cids) {
      const key = i.match(rgx)
      if (key) {
        if (typeof splits[key[1]] === 'undefined') {
          splits[key[1]] = {}
        }
        if (typeof splits[key[1]][key[2]] === 'undefined') {
          splits[key[1]][key[2]] = []
        }
        splits[key[1]][key[2]].push(key[3])
      } else {
        // Sliently error
      }
    }
    const regExParts = []
    for (const t in splits) {
      const row = []
      for (const s in splits[t]) {
        if (splits[t][s].length > 1) {
          row.push(s + '\\.' + '(' + splits[t][s].join('|') + ')')
        } else {
          row.push(s + '\\.' + splits[t][s].join(''))
        }
      }
      if (row.length > 1) {
        regExParts.push(t + '\\.' + '(' + row.join('|') + ')')
      } else {
        regExParts.push(t + '\\.' + row.join(''))
      }
    }
    if (regExParts.length > 1) {
      return new RegExp('^(' + regExParts.join('|') + ')$')
    }
    return new RegExp('^' + regExParts.join('') + '$')
  }

  /**
   * Returns all documents with an CID matching the regex and matching the document type
   * and language, from the specified scope.
   * Empty array return for no matches
   * @param cidRegExp regex used on the CID
   * @param type the first part of the wanted CID, for example 'i', 'a', 'je'
   * @param lang the language to match against ('en', 'es', ...)
   * @param scope defines where it will look:
   * **match** same logic as fromCID function,
   * **all**: find in both world & compendia,
   * **world**: only search in world,
   * **compendiums**: only search in compendiums
   * @param langFallback should the system fall back to en incase there is no translation
   * @param showLoading Show loading bar
   * @returns array
   */
  static async fromCIDRegexAll ({ cidRegExp, type, lang = game.i18n.lang, scope = 'match', langFallback = true, showLoading = false } = {}) {
    if (!cidRegExp) {
      return []
    }
    const result = []

    let count = 0
    if (showLoading) {
      if (['match', 'all', 'world'].includes(scope)) {
        count++
      }
      if (['match', 'all', 'compendiums'].includes(scope)) {
        count = count + game.packs.size
      }
    }

    if (['match', 'all', 'world'].includes(scope)) {
      const worldDocuments = await CID.documentsFromWorld({ cidRegExp, type, lang, langFallback, progressBar: count })
      if (scope === 'match' && worldDocuments.length) {
        if (showLoading) {
          SceneNavigation.displayProgressBar({ label: game.i18n.localize('SETUP.PackagesLoading'), pct: 100 })
        }
        return this.filterAllCID(worldDocuments, langFallback && lang !== 'en')
      }
      result.splice(0, 0, ...worldDocuments)
    }

    if (['match', 'all', 'compendiums'].includes(scope)) {
      const compendiaDocuments = await CID.documentsFromCompendia({ cidRegExp, type, lang, langFallback, progressBar: count })
      result.splice(result.length, 0, ...compendiaDocuments)
    }

    if (showLoading) {
      SceneNavigation.displayProgressBar({ label: game.i18n.localize('SETUP.PackagesLoading'), pct: 100 })
    }

    return this.filterAllCID(result, langFallback && lang !== 'en')
  }

  /**
   * Returns all documents with a CID, and language.
   * Empty array return for no matches
   * @param cid a single cid
   * @param lang the language to match against ('en', 'es', ...)
   * @param scope defines where it will look:
   * **match** same logic as fromCID function,
   * **all**: find in both world & compendia,
   * **world**: only search in world,
   * **compendiums**: only search in compendiums
   * @param langFallback should the system fall back to en incase there is no translation
   * @param showLoading Show loading bar
   * @returns array
   */
  static async fromCIDAll ({ cid, lang = game.i18n.lang, scope = 'match', langFallback = true, showLoading = false } = {}) {
    if (!cid || typeof cid !== 'string') {
      return []
    }
    const parts = cid.match(CID.regExKey())
    if (!parts) {
      return []
    }
    if (lang === '') {
      lang = game.i18n.lang
    }
    return CID.fromCIDRegexAll({ cidRegExp: new RegExp('^' + AOVUtilities.quoteRegExp(cid) + '$'), type: parts[1], lang, scope, langFallback, showLoading })
  }

  /**
   * Gets only the highest priority documents for each CID that matches the RegExp and
   * language, with the highest priority documents in the World taking precedence over
   * any documents in compendium packs.
   * Empty array return for no matches
   * @param cidRegExp regex used on the CID
   * @param type the first part of the wanted CID, for example 'i', 'a', 'je'
   * @param lang the language to match against ("en", "es", ...)
   * @param langFallback should the system fall back to en incase there is no translation
   * @param showLoading Show loading bar
   */
  static async fromCIDRegexBest ({ cidRegExp, type, lang = game.i18n.lang, langFallback = true, showLoading = false } = {}) {

    const allDocuments = await this.fromCIDRegexAll({ cidRegExp, type, lang, scope: 'all', langFallback, showLoading })
    const bestDocuments = this.filterBestCID(allDocuments)
    return bestDocuments
  }

  /**
   * Gets only the highest priority document for CID that matches the language,
   * with the highest priority documents in the World taking precedence over
   * any documents
   * in compendium packs.
   * @param cid string CID
   * @param lang the language to match against ("en", "es", ...)
   * @param langFallback should the system fall back to en incase there is no translation
   */
  static fromCID (cid, lang = game.i18n.lang, langFallback = true) {
    return CID.fromCIDBest({ cid, lang, langFallback })
  }

  /**
   * Gets only the highest priority document for CID that matches the language,
   * with the highest priority documents in the World taking precedence over
   * any documents
   * in compendium packs.
   * @param cid string CID
   * @param lang the language to match against ("en", "es", ...)
   * @param langFallback should the system fall back to en incase there is no translation
   * @param showLoading Show loading bar
   */
  static fromCIDBest ({ cid, lang = game.i18n.lang, langFallback = true, showLoading = false } = {}) {
    if (!cid || typeof cid !== 'string') {
      return []
    }
    const type = cid.split('.')[0]
    const cidRegExp = new RegExp('^' + AOVUtilities.quoteRegExp(cid) + '$')
    return CID.fromCIDRegexBest({ cidRegExp, type, lang, langFallback, showLoading })
  }

  /**
   * For an array of documents already processed by filterAllCID, returns only those that are the "best" version of their CID
   * @param documents
   * @returns
   */
  static filterBestCID (documents) {
    const bestMatchDocuments = new Map()
    for (const doc of documents) {
      const docCID = doc.getFlag('aov', 'cidFlag')?.id
      if (docCID) {
        const currentDoc = bestMatchDocuments.get(docCID)
        if (typeof currentDoc === 'undefined') {
          bestMatchDocuments.set(docCID, doc)
          continue
        }

        // Prefer pack === '' if possible
        const docPack = (doc.pack ?? '')
        const existingPack = (currentDoc?.pack ?? '')
        const preferWorld = docPack === '' || existingPack !== ''
        if (!preferWorld) {
          continue
        }

        // Prefer highest priority
        let docPriority = parseInt(doc.getFlag('aov', 'cidFlag')?.priority ?? Number.MIN_SAFE_INTEGER, 10)
        docPriority = isNaN(docPriority) ? Number.MIN_SAFE_INTEGER : docPriority
        let existingPriority = parseInt(currentDoc.getFlag('aov', 'cidFlag')?.priority ?? Number.MIN_SAFE_INTEGER, 10)
        existingPriority = isNaN(existingPriority) ? Number.MIN_SAFE_INTEGER : existingPriority
        const preferPriority = docPriority >= existingPriority
        if (!preferPriority) {
          continue
        }

        bestMatchDocuments.set(docCID, doc)
      }
    }
    return [...bestMatchDocuments.values()]
  }

  /**
   * For an array of documents, returns filter out en documents if a translated one exists
   * @param documents
   * @param langFallback should the system fall back to en in case there is no translation
   * @returns
   */
  static filterAllCID (documents, langFallback) {
    if (!langFallback) {
      return documents
    }
    const bestMatchDocuments = new Map()
    for (const doc of documents) {
      const docCID = doc.getFlag('aov', 'cidFlag')?.id
      if (docCID) {
        let docPriority = parseInt(doc.getFlag('aov', 'cidFlag')?.priority ?? Number.MIN_SAFE_INTEGER, 10)
        docPriority = isNaN(docPriority) ? Number.MIN_SAFE_INTEGER : docPriority
        const key = docCID + '/' + (isNaN(docPriority) ? Number.MIN_SAFE_INTEGER : docPriority)

        const currentDoc = bestMatchDocuments.get(key)
        if (typeof currentDoc === 'undefined') {
          bestMatchDocuments.set(key, doc)
          continue
        }

        const docLang = doc.getFlag('aov', 'cidFlag')?.lang ?? 'en'
        const existingLang = currentDoc?.getFlag('aov', 'cidFlag')?.lang ?? 'en'
        if (existingLang === 'en' && existingLang !== docLang) {
          bestMatchDocuments.set(key, doc)
        }
      }
    }
    return [...bestMatchDocuments.values()]
  }

  /**
   * Get a list of all documents matching the CID regex, and language.
   * The document list is sorted with the highest priority first.
   * @param cidRegExp regex used on the CID
   * @param type the first part of the wanted CID, for example 'i', 'a', 'je'
   * @param lang the language to match against ('en', 'es', ...)
   * @param langFallback should the system fall back to en incase there is no translation
   * @param progressBar If greater than zero show percentage
   * @returns array
   */
  static async documentsFromWorld ({ cidRegExp, type, lang = game.i18n.lang, langFallback = true, progressBar = 0 } = {}) {
    if (!cidRegExp) {
      return []
    }
    if (lang === '') {
      lang = game.i18n.lang
    }

    if (progressBar > 0) {
      SceneNavigation.displayProgressBar({ label: game.i18n.localize('SETUP.PackagesLoading'), pct: Math.floor(100 / progressBar) })
    }

    const gameProperty = CID.getGameProperty(`${type}..`)

    const candidateDocuments = game[gameProperty]?.filter((d) => {
      const cidFlag = d.getFlag('aov', 'cidFlag')
      if (typeof cidFlag === 'undefined') {
        return false
      }
      return cidRegExp.test(cidFlag.id) && [lang, (langFallback ? 'en' : '-')].includes(cidFlag.lang)
    })

    if (candidateDocuments === undefined) {
      return []
    }

    return candidateDocuments.sort(CID.compareCIDPrio)
  }
  
  /**
   * Get a list of all documents matching the CID regex, and language from the compendiums.
   * The document list is sorted with the highest priority first.
   * @param cidRegExp regex used on the CID
   * @param type the first part of the wanted CID, for example 'i', 'a', 'je'
   * @param lang the language to match against ('en', 'es', ...)
   * @param langFallback should the system fall back to en incase there is no translation
   * @param progressBar If greater than zero show percentage
   * @returns array
   */
  static async documentsFromCompendia ({ cidRegExp, type, lang = game.i18n.lang, langFallback = true, progressBar = 0 }) {
    if (!cidRegExp) {
      return []
    }
    if (lang === '') {
      lang = game.i18n.lang
    }

    const documentType = CID.getDocumentType(type).name
    const candidateDocuments = []

    let count = 1
    for (const pack of game.packs) {
      if (progressBar > 0) {
        SceneNavigation.displayProgressBar({ label: game.i18n.localize('SETUP.PackagesLoading'), pct: Math.floor(count * 100 / progressBar) })
        count++
      }
      if (pack.documentName === documentType) {
        if (!pack.indexed) {
          await pack.getIndex()
        }
        const indexInstances = pack.index.filter((i) => {
          const cidFlag = i.flags?.aov?.cidFlag
          if (typeof cidFlag === 'undefined') {
            return false
          }
          return cidRegExp.test(cidFlag.id) && [lang, (langFallback ? 'en' : '-')].includes(cidFlag.lang)
        })
        for (const index of indexInstances) {
          const document = await pack.getDocument(index._id)
          if (!document) {
            const msg = game.i18n.format('AOV.CIDFlag.error.document-not-found', {
              cid: cidRegExp,
              lang,
            })
            ui.notifications.error(msg)
            console.log('aov |', msg, index)
            throw new Error()
          } else {
            candidateDocuments.push(document)
          }
        }
      }
    }
    return candidateDocuments.sort(CID.compareCIDPrio)
  }  

  /**
   * Sort a list of document on CID priority - the highest first.
   * @example
   * aListOfDocuments.sort(CID.compareCIDPrio)
   */
  static compareCIDPrio (a, b) {
    return (
      b.getFlag('aov', 'cidFlag')?.priority -
      a.getFlag('aov', 'cidFlag')?.priority
    )
  }

  /**
   * Translates the first part of a CID to what those documents are called in the `game` object.
   * @param cid a single cid
   */
  static getGameProperty (cid) {
    const type = cid.split('.')[0]
    const gameProperty = CID.gamePropertyLookup[type]
    if (!gameProperty) {
      ui.notifications.warn(game.i18n.format('AOV.CIDFlag.error.incorrect.type'))
      console.log('aov | ', cid)
      throw new Error()
    }
    return gameProperty
  }

  static get gamePropertyLookup () {
    return {
      a: 'actors',
      c: 'cards',
      i: 'items',
      je: 'journal',
      m: 'macros',
      p: 'playlists',
      rt: 'tables',
      s: 'scenes'
    }
  }

  /**
   * Translates the first part of a CID to what those documents are called in the `game` object.
   * @param cid a single cid
   */
  static getDocumentType (cid) {
    const type = cid.split('.')[0]
    const documentType = CID.documentNameLookup[type]
    if (!documentType) {
      ui.notifications.warn(game.i18n.format('AOV.CIDFlag.error.incorrect.type'))
      console.log('aov | ', cid)
      throw new Error()
    }
    return documentType
  }

  static get documentNameLookup () {
    return {
      a: Actor,
      c: Card,
      i: Item,
      je: JournalEntry,
      m: Macro,
      p: Playlist,
      rt: RollTable,
      s: Scene
    }
  }
}  