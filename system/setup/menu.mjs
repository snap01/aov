
import { AOVUtilities } from "../apps/utilities.mjs"
import { AOVCIDActorUpdateItems } from "../cid/cid-actor-update-items.mjs"
import { AOVDamage } from "../apps/damage.mjs"


class AOVMenuLayer extends (foundry.canvas?.layers?.InteractionLayer ?? InteractionLayer) {
  constructor() {
    super()
  }

  static get layerOptions() {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: 'aovmenu'
    })
  }
}

export class AOVMenu {
  static getButtons(controls) {
    canvas.aovgmtools = new AOVMenuLayer()
    //TO DO - remove when module ready
    const hasModule = game.modules.get('aov-core-rulebook')?.active
    //TODO
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
          order: 1,
          name: 'aovdummy',
          active: false,
          title: '',
          onChange: () => {
          }
        },
        devphase: {
          toggle: true,
          icon: 'fas fa-angle-double-up',
          order: 3,
          name: 'devphase',
          active: game.settings.get('aov', 'developmentEnabled'),
          title: 'AOV.devPhase',
          onChange: async toggle => await AOVUtilities.toggleDevPhase(toggle)
        },
        'actor-aov-id-best': {
          button: true,
          icon: 'fas fa-fingerprint',
          order: 5,
          name: 'actor-aov-id-best',
          title: 'AOV.ActorCID.ItemsBest',
          onChange: async () => await AOVCIDActorUpdateItems.create()
        },
        createphase: {
          toggle: true,
          //TO DO - remove when module ready
          visible: hasModule,
          //TODO
          icon: 'fas fa-user',
          order: 4,
          name: 'createphase',
          active: game.settings.get('aov', 'createEnabled'),
          title: 'AOV.createPhase',
          onChange: async toggle => await AOVUtilities.toggleCreate(toggle)
        },
        healing: {
          button: true,
          icon: 'fas fa-droplet',
          order: 2,
          name: 'healing',
          title: 'AOV.healingPhase',
          onChange: async toggle => await AOVDamage.healingPhase(toggle)
        },
      }
    }
    if (Array.isArray(controls)) {
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

  static renderControls(app, html, data) {
    const isGM = game.user.isGM
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
  }
}
