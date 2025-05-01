import { registerSheets } from '../setup/register-sheets.mjs'
import { CID } from '../cid/cid.mjs'
import { AOVSelectLists } from '../apps/select-lists.mjs'

export function listen() {
  Hooks.once('init', async () => {
    CID.init()
    registerSheets()
  })
}
