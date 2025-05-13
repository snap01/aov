
import { AOVUtilities } from "../apps/utilities.mjs"
import { AOVCIDActorUpdateItems } from "../cid/cid-actor-update-items.mjs"


class AOVMenuLayer extends (foundry.canvas?.layers?.PlaceablesLayer ?? PlaceablesLayer) {
  constructor () {
    super()
    this.objects = {}
  }

  static get layerOptions () {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: 'aovmenu',
      zIndex: 60
    })
  }

  static get documentName () {
    return 'Token'
  }

  get placeables () {
    return []
  }
}

export class AOVMenu {
  static getButtons (controls) {
    canvas.aovgmtools = new AOVMenuLayer()
    const isGM = game.user.isGM
    const menu = {
      name: 'aovmenu',
      title: 'AOV.gmTools',
      layer: 'aovgmtools',
      icon: 'fas fa-hammer',
      activeTool: 'aovdummy',
      visible: isGM,
      onChange: (event, active) => {
      },
      onToolChange: (event, tool) => {
      },
      tools: {
        aovdummy: {
          icon: '',
          name: 'aovdummy',
          active: false,
          title: '',
          onChange: () => {
          }
        },
        devphase: {
          toggle: true,
          icon: 'fas fa-angle-double-up',
          name: 'devphase',
          active: game.settings.get('aov', 'developmentEnabled'),
          title: 'AOV.devPhase',
          onChange: async toggle => await AOVUtilities.toggleDevPhase(toggle)
        },
         'actor-aov-id-best': {
          button: true,
          icon: 'fas fa-fingerprint',
          name: 'actor-aov-id-best',
          title: 'AOV.ActorCID.ItemsBest',
          onChange: async () => await AOVCIDActorUpdateItems.create()
        },
        xptoggle: {
          toggle: true,
          icon: 'fas fa-certificate',
          class: 'xp_toggle',
          name: 'xptoggle',
          active: game.settings.get('aov', 'xpEnabled'),
          title: 'AOV.toggleXP',
          onChange: async toggle => await AOVUtilities.toggleXPGain(toggle)
        },
      }
    }
    if (Array.isArray(controls)) {
      /* // FoundryVTT v12 */
      menu.tools = Object.keys(menu.tools).reduce((c, i) => {
        if (i === 'aovdummy') {
          return c
        }
        c.push(menu.tools[i])
        return c
      }, [])
      controls.push(menu)
    } else {
      controls.aovmenu = menu
    }
  }

  static renderControls (app, html, data) {
    const isGM = game.user.isGM
    //if (foundry.utils.isNewerVersion(game.version, '13')) {
      const gmMenu = html.querySelector('.fa-solid fa-hammer')?.parentNode
      if (gmMenu && !gmMenu.classList.contains('aovmenu')) {
        gmMenu.classList.add('aovmenu')
        if (isGM) {
          const menuLi = document.createElement('li')
          const menuButton = document.createElement('button')
          menuButton.classList.add('control', 'ui-control', 'tool', 'icon', 'aovmenu')
          menuButton.type = 'button'
        }
      }
    //} else {
    //  const gmMenu = html.find('.fa-solid fa-hammer').parent()
    //  gmMenu.addClass('aovmenu')
    //}
  }
}
