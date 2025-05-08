export class AOVActiveEffect extends ActiveEffect {
  get active() {
    if (typeof this.origin === 'string') {
      let item
      if (this.parent.isToken && !this.parent.token.actorLink) {
        const match = this.origin.match(/\.([^\.]+)$/)
        if (match) {
          item = this.parent.items.get(match[1])
        }
      } else {
        item = fromUuidSync(this.origin)
      }
      if (item instanceof Item) {
        //If item type isn't carried then effect is not active
        if (item.system.equipStatus !== 1) {
          return false;
        }
      }
    }
    return super.active;
  }
}
