import ChaosiumCanvasInterface from "./chaosium-canvas-interface.mjs";

export default class ChaosiumCanvasInterfaceMapPinToggle extends ChaosiumCanvasInterface {
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
    return 'fa-solid fa-map-pin'
  }

  static defineSchema () {
    const fields = foundry.data.fields
    return {
      toggle: new fields.BooleanField({
        initial: false,
        label: 'AOV.ChaosiumCanvasInterface.MapPinToggle.Toggle.Title',
        hint: 'AOV.ChaosiumCanvasInterface.MapPinToggle.Toggle.Hint'
      }),
      documentUuids: new fields.SetField(
        new fields.DocumentUUIDField({
          initial: undefined
        }),
        {
          label: 'AOV.ChaosiumCanvasInterface.MapPinToggle.Document.Title',
          hint: 'AOV.ChaosiumCanvasInterface.MapPinToggle.Document.Hint'
        }
      ),
      noteUuids: new fields.SetField(
        new fields.DocumentUUIDField({
          initial: undefined,
          type: 'Note'
        }),
        {
          label: 'AOV.ChaosiumCanvasInterface.MapPinToggle.Note.Title',
          hint: 'AOV.ChaosiumCanvasInterface.MapPinToggle.Note.Hint'
        }
      ),
      permissionShow: new fields.NumberField({
        choices: Object.keys(ChaosiumCanvasInterfaceMapPinToggle.PERMISSIONS).reduce((c, k) => { c[k] = game.i18n.localize(ChaosiumCanvasInterfaceMapPinToggle.PERMISSIONS[k]); return c }, {}),
        initial: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
        label: 'AOV.ChaosiumCanvasInterface.MapPinToggle.PermissionShow.Title',
        hint: 'AOV.ChaosiumCanvasInterface.MapPinToggle.PermissionShow.Hint',
        required: true
      }),
      permissionHide: new fields.NumberField({
        choices: Object.keys(ChaosiumCanvasInterfaceMapPinToggle.PERMISSIONS).reduce((c, k) => { c[k] = game.i18n.localize(ChaosiumCanvasInterfaceMapPinToggle.PERMISSIONS[k]); return c }, {}),
        initial: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
        label: 'AOV.ChaosiumCanvasInterface.MapPinToggle.PermissionHide.Title',
        hint: 'AOV.ChaosiumCanvasInterface.MapPinToggle.PermissionHide.Hint',
        required: true
      })
    }
  }

  async _handleMouseOverEvent () {
    return game.user.isGM
  }

  async _handleLeftClickEvent () {
    game.socket.emit('system.aov', { type: 'toggleMapNotes', toggle: true })
    game.settings.set('core', foundry.canvas.layers.NotesLayer.TOGGLE_SETTING, true)
    for (const uuid of this.documentUuids) {
      const doc = await fromUuid(uuid)
      if (doc) {
        const permission = (this.toggle ? this.permissionShow : this.permissionHide)
        await doc.update({ 'ownership.default': permission })
      } else {
        console.error('Document ' + uuid + ' not loaded')
      }
    }
    for (const uuid of this.noteUuids) {
      const doc = await fromUuid(uuid)
      console.log('B', uuid, doc)
      if (doc) {
        const texture = (this.toggle ? 'systems/aov/art-assets/map-pin.svg' : 'systems/aov/art-assets/map-pin-dark.svg')
        await doc.update({ 'texture.src': texture })
      } else {
        console.error('Note ' + uuid + ' not loaded')
      }
    }
  }
}
