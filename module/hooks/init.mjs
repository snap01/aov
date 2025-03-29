import { registerSheets } from '../setup/register-sheets.mjs'
import { CID } from '../cid/cid.mjs'

export function listen () {
    Hooks.once('init', async () => {
      CID.init()
      registerSheets()
    })
  }