const SETTINGS = {

  primaryFontColour: {
    name: "AOV.Settings.primaryFontColour",
    hint: "AOV.Settings.primaryFontColourHint",
    scope: "world",
    config: false,
    type: String,
    default: ""
  },

  secondaryFontColour: {
    name: "AOV.Settings.secondaryFontColour",
    hint: "AOV.Settings.secondaryFontColourHint",
    scope: "world",
    config: false,
    type: String,
    default: ""
  },

  primaryBackColour: {
    name: "AOV.Settings.primaryBackColour",
    hint: "AOV.Settings.primaryBackColourHint",
    scope: "world",
    config: false,
    type: String,
    default: ""
  },

  secondaryBackColour: {
    name: "AOV.Settings.secondaryBackColour",
    hint: "AOV.Settings.secondaryBackColourHint",
    scope: "world",
    config: false,
    type: String,
    default: ""
  },

  primaryFont: {
    name: "AOV.Settings.primaryFont",
    hint: "AOV.Settings.primaryFontHint",
    scope: "world",
    config: false,
    type: String,
    filePicker: 'Other',
    default: "",
  },

  singleColourBar: {
    name: "AOV.Settings.singleColourBar",
    hint: "AOV.Settings.singleColourBarHint",
    scope: "client",
    config: false,
    type: Boolean,
    default: false
  },

}

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api
export class AOVDisplaySettings extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    classes: ['aov', 'sheet', 'settings'],
    id: 'display-settings',
    actions: {
      reset: AOVDisplaySettings.onResetDefaults,
    },
    form: {
      handler: AOVDisplaySettings.formHandler,
      closeOnSubmit: true,
      submitOnChange: false
    },
    position: {
      width: 550,
      height: 'auto',
    },
    tag: 'form',
    window: {
      title: 'AOV.Settings.displayOptions',
      contentClasses: ["standard-form"]
    }
  }

  get title() {
    return `${game.i18n.localize(this.options.window.title)}`;
  }

  static PARTS = {
    form: { template: 'systems/aov/templates/settings/display-settings.hbs' },
    footer: { template: 'templates/generic/form-footer.hbs' }
  }


  async _prepareContext(options) {
    const isGM = game.user.isGM;
    const optSet = {}
    for (const [k, v] of Object.entries(SETTINGS)) {
      optSet[k] = {
        value: game.settings.get('aov', k),
        setting: v
      }
    }
    return {
      isGM,
      optSet,
      buttons: [
        { type: "submit", icon: "fa-solid fa-save", label: "SETTINGS.Save" },
        { type: "reset", action: "reset", icon: "fa-solid fa-undo", label: "SETTINGS.Reset" },
      ]
    }
  }

  static registerSettings() {
    for (const [k, v] of Object.entries(SETTINGS)) {
      game.settings.register('aov', k, v)
    }
  }

  static async onResetDefaults(event) {
    event.preventDefault()
    for await (const [k, v] of Object.entries(SETTINGS)) {
      await game.settings.set('aov', k, v?.default)
    }
    return this.render()
  }

  static async formHandler(event, form, formData) {
    const settings = foundry.utils.expandObject(formData.object)
    await Promise.all(
      Object.entries(settings)
        .map(([key, value]) => game.settings.set("aov", key, value))
    )
  }

}
