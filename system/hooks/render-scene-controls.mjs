import { AOVMenu } from '../setup/menu.mjs'

export default function (app, html, data) {
  if (typeof html.querySelector === 'function') {
    html.querySelector('button[data-tool="aovdummy"]')?.closest('li').remove()
  }
  AOVMenu.renderControls(app, html, data)
}
