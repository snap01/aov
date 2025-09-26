import ChaosiumCanvasInterface from "./chaosium-canvas-interface.mjs";

export default class ChaosiumCanvasInterfaceTileToggle extends ChaosiumCanvasInterface {
  static get PERMISSIONS () {
    return {
      [CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT]: 'OWNERSHIP.INHERIT',
      [CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE]: 'OWNERSHIP.NONE',
      [CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED]: 'OWNERSHIP.LIMITED',
      [CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER]: 'OWNERSHIP.OBSERVER',
      [CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER]: 'OWNERSHIP.OWNER'
    }
  }

  static get icon () {
    return 'fa-solid fa-cubes'
  }

  static defineSchema () {
    const fields = foundry.data.fields
    return {
      toggle: new fields.BooleanField({
        initial: false,
        label: 'AOV.ChaosiumCanvasInterface.TileToggle.Toggle.Title',
        hint: 'AOV.ChaosiumCanvasInterface.TileToggle.Toggle.Hint'
      }),
      tileUuids: new fields.SetField(
        new fields.DocumentUUIDField({
          initial: undefined,
          type: 'Tile'
        }),
        {
          label: 'AOV.ChaosiumCanvasInterface.TileToggle.Tile.Title',
          hint: 'AOV.ChaosiumCanvasInterface.TileToggle.Tile.Hint'
        }
      ),
      journalEntryUuids: new fields.SetField(
        new fields.DocumentUUIDField({
          initial: undefined,
          type: 'JournalEntry'
        }),
        {
          label: 'AOV.ChaosiumCanvasInterface.TileToggle.JournalEntry.Title',
          hint: 'AOV.ChaosiumCanvasInterface.TileToggle.JournalEntry.Hint'
        }
      ),
      journalEntryPageUuids: new fields.SetField(
        new fields.DocumentUUIDField({
          initial: undefined,
          type: 'JournalEntryPage'
        }),
        {
          label: 'AOV.ChaosiumCanvasInterface.TileToggle.JournalEntryPage.Title',
          hint: 'AOV.ChaosiumCanvasInterface.TileToggle.JournalEntryPage.Hint'
        }
      ),
      regionBehaviorUuids: new fields.SetField(
        new fields.DocumentUUIDField({
          initial: undefined,
          type: 'RegionBehavior'
        }),
        {
          label: 'AOV.ChaosiumCanvasInterface.TileToggle.RegionBehavior.Title',
          hint: 'AOV.ChaosiumCanvasInterface.TileToggle.RegionBehavior.Hint'
        }
      ),
      permissionDocument: new fields.NumberField({
        choices: Object.keys(ChaosiumCanvasInterfaceTileToggle.PERMISSIONS).reduce((c, k) => { c[k] = game.i18n.localize(ChaosiumCanvasInterfaceTileToggle.PERMISSIONS[k]); return c }, {}),
        initial: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
        label: 'AOV.ChaosiumCanvasInterface.TileToggle.PermissionDocument.Title',
        hint: 'AOV.ChaosiumCanvasInterface.TileToggle.PermissionDocument.Hint',
        required: true
      }),
      permissionPage: new fields.NumberField({
        choices: Object.keys(ChaosiumCanvasInterfaceTileToggle.PERMISSIONS).reduce((c, k) => { c[k] = game.i18n.localize(ChaosiumCanvasInterfaceTileToggle.PERMISSIONS[k]); return c }, {}),
        initial: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
        label: 'AOV.ChaosiumCanvasInterface.TileToggle.PermissionPage.Title',
        hint: 'AOV.ChaosiumCanvasInterface.TileToggle.PermissionPage.Hint',
        required: true
      }),
      regionUuids: new fields.SetField(
        new fields.DocumentUUIDField({
          initial: undefined,
          type: 'Region'
        }),
        {
          label: 'AOV.ChaosiumCanvasInterface.TileToggle.RegionUuids.Title',
          hint: 'AOV.ChaosiumCanvasInterface.TileToggle.RegionUuids.Hint'
        }
      ),
    }
  }

  async _handleMouseOverEvent () {
    return game.user.isGM
  }

  async _handleLeftClickEvent () {
    for (const uuid of this.tileUuids) {
      const doc = await fromUuid(uuid)
      if (doc) {
        await doc.update({ hidden: !this.toggle })
      } else {
        console.error('Tile ' + uuid + ' not loaded')
      }
    }
    const permissionDocument = (!this.toggle ? CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE : this.permissionDocument)
    const permissionPage = (!this.toggle ? CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE : this.permissionPage)
    for (const uuid of this.journalEntryUuids) {
      const doc = await fromUuid(uuid)
      if (doc) {
        await doc.update({ 'ownership.default': permissionDocument })
      } else {
        console.error('Journal Entry ' + uuid + ' not loaded')
      }
    }
    for (const uuid of this.journalEntryPageUuids) {
      const doc = await fromUuid(uuid)
      if (doc) {
        await doc.update({ 'ownership.default': permissionPage })
      } else {
        console.error('Journal Entry Page ' + uuid + ' not loaded')
      }
    }
    for (const uuid of this.regionBehaviorUuids) {
      const doc = await fromUuid(uuid)
      if (doc) {
        await doc.update({ disabled: !this.toggle })
      } else {
        console.error('Region Behavior ' + uuid + ' not loaded')
      }
    }
  }

  async _handleRightClickEvent () {
    await this._handleLeftClickEvent()
    for (const uuid of this.regionUuids) {
      game.aov.ClickRegionLeftUuid(uuid)
    }
  }
}
