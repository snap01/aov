export class AOVItem extends Item {

  prepareData() {
    super.prepareData();
  }

  getRollData() {
    const rollData = { ...this.system };
    if (!this.actor) return rollData;
    rollData.actor = this.actor.getRollData();
    return rollData;
  }

  async roll(event) {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? '',
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.formula, rollData);
      // If you need to store the value first, uncomment the next line.
      // const result = await roll.evaluate();
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }

  static async createDialog(data={}, createOptions={}, { types, ...options }={}) {
    //Enter the document types you want to remove from the side bar create option - 'base' is removed in the super
    const invalid = ["wound", "family"];
    if (!types) types = this.TYPES.filter(type => !invalid.includes(type));
    else types = types.filter(type => !invalid.includes(type));
    return super.createDialog(data, createOptions, { types, ...options });
  }

}
