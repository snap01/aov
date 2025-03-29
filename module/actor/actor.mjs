export class AOVActor extends Actor {

  prepareData() {
    super.prepareData();
  }
  
  prepareBaseData() {
  }
  
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.Aov || {};
  
    //Prepare data for different actor types
    this._prepareCharacterData(actorData);
  }

  //Prepare Character specific data 
  async _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;
    const systemData = actorData.system;
    this._prepStats(actorData)
    this._prepDerivedStats(actorData)
  }    

  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);

    return data;
  }

  // Prepare character roll data.
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the ability scores to the top level
    if (data.stats) {
      for (let [k, v] of Object.entries(data.stats)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
  }

  //Prepare Stats
  _prepStats(actorData) {
  }    

  // Calculate derived scores
  _prepDerivedStats(actorData) {
  }    
}    