export class AOVUtilities {

  static toKebabCase(s) {
    if (!s) {
      return ''
    }
    const match = s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    if (!match) {
      return ''
    }
    return match.join('-').toLowerCase()
  }

  static async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999px'
        textArea.style.top = '-999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        return new Promise((resolve, reject) => {
          document.execCommand('copy')
            ? resolve()
            : reject(
              new Error(game.i18n.localize('AOV.UnableToCopyToClipboard'))
            )
          textArea.remove()
        }).catch(err => ui.notifications.error(err))
      }
    } catch (err) {
      ui.notifications.error(game.i18n.localize('AOV.UnableToCopyToClipboard'))
    }
  }


  static quoteRegExp(string) {
    // https://bitbucket.org/cggaertner/js-hacks/raw/master/quote.js
    const len = string.length
    let qString = ''

    for (let current, i = 0; i < len; ++i) {
      current = string.charAt(i)

      if (current >= ' ' && current <= '~') {
        if (current === '\\' || current === "'") {
          qString += '\\'
        }

        qString += current.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
      } else {
        switch (current) {
          case '\b':
            qString += '\\b'
            break

          case '\f':
            qString += '\\f'
            break

          case '\n':
            qString += '\\n'
            break

          case '\r':
            qString += '\\r'
            break

          case '\t':
            qString += '\\t'
            break

          case '\v':
            qString += '\\v'
            break

          default:
            qString += '\\u'
            current = current.charCodeAt(0).toString(16)
            for (let j = 4; --j >= current.length; qString += '0');
            qString += current
        }
      }
    }
    return qString
  }


  static sortByNameKey(a, b) {
    return a.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .localeCompare(
        b.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLocaleLowerCase()
      )
  }

  static async toggleDevPhase (toggle) {
    let state = await game.settings.get('aov', 'developmentEnabled')
    await game.settings.set('aov', 'developmentEnabled', !state)
    ui.notifications.info(
      state
        ? game.i18n.localize('AOV.devPhaseDisabled')
        : game.i18n.localize('AOV.devPhaseEnabled')
    )
 //TODO: Enable socket
 //   game.socket.emit('system.CoC7', {
 //     type: 'updateChar'
 //   })
 //   CoC7Utilities.updateCharSheets()
  }

  static async toggleXPGain (toggle) {
    let state = await game.settings.get('aov', 'xpEnabled')
    await game.settings.set('aov', 'xpEnabled', !state)
    ui.notifications.info(
      state
        ? game.i18n.localize('AOV.xpGainDisabled')
        : game.i18n.localize('AOV.xpGainEnabled')
    )
  }
}
