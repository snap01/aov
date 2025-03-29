//CHAOSIUM ID BUTTON

/* global game */
import { CIDEditor } from './cid-editor.mjs'

export function addCIDSheetHeaderButton (headerButtons, sheet) {
    console.log(sheet)
    const sheetCID = sheet.object.flags?.Aov?.cidFlag
    const noId = (typeof sheetCID === 'undefined' || typeof sheetCID.id === 'undefined' || sheetCID.id === '')
    const CIDEditorButton = {
      class: (noId ? 'edit-cid-warning' : 'edit-cid-exisiting'),
      label: 'AOV.CIDFlag.id',
      icon: 'fas fa-fingerprint',
      onclick: () => { if(game.user.isGM) {
        new CIDEditor(sheet.object, {}).render(true, { focus: true })
      }
    }}
    const numberOfButtons = headerButtons.length
    headerButtons.splice(0, 0, CIDEditorButton)
}