import { AOVUtilities } from "./utilities.mjs";
import { RECard } from "../chat/resistance-chat.mjs";

export class AOVSystemSocket {

  static async callSocket(data) {
    //If a target (to) is specified then only carry this out if its this user
    if (!!data.to && game.userId !== data.to) {return}

    switch (data.type) {
      case 'updateChar':
        AOVUtilities.updateCharSheets();
        break;
      case 'REAdd':
        if (data.to === game.user.id) {
          RECard.REAdd(data.value.config, data.value.msgId);
        }
        break;
    }
  }
}
