import { AOVUtilities } from "./utilities.mjs";
export class AOVSystemSocket {

  static async callSocket(data) {
    //If a target (to) is specified then only carry this out if its this user
    if (!!data.to && game.userId !== data.to) {return}

    switch (data.type) {
      case 'updateChar':
          AOVUtilities.updateCharSheets();
        break;
    }
  }
}
