import { AOVactorDetails } from "./actor-details.mjs";


export class AOVChat{

  //Hides Owner-Only sections of chat message from anyone other than the owner and the GM  
  static async renderMessageHook (message, html) {
    ui.chat.scrollBottom()
    if (!game.user.isGM) {
      const ownerOnly = html.find('.owner-only')
      const actor = await AOVactorDetails._getParticipant(message.flags.config.partic.particId,message.flags.config.partic.particType);
      for (const zone of ownerOnly) {
        if ((actor && !actor.isOwner) || (!actor && !game.user.isGM)) {
            zone.style.display = 'none'
        } 
      }
    }
    return
  }

}