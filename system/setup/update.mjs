/**
 * Perform a system migration for the entire World, applying migrations for Actors, Items, and Compendium packs.
 * @param {object} [options={}]
 * @param {boolean} [options.bypassVersionCheck=false]  Bypass certain migration restrictions gated behind system
 *                                                      version stored in item stats.
 * @returns {Promise}      A Promise which resolves once the migration is completed
 */
export async function updateWorld({ bypassVersionCheck=false }={}) {
    const currentVersion = game.settings.get("aov", "systemVersion");
    const targetVersion = game.system.version;


    //Message if current system is less that Version 13.1
    if (foundry.utils.isNewerVersion('13.1', currentVersion ?? '0')) {
    const content = await foundry.applications.handlebars.renderTemplate('systems/aov/templates/updates/update13.1.hbs')
    const response = await foundry.applications.api.DialogV2.prompt({
      position: {
        width:500,
        height: 450,
      },
      classes:['aov', 'item'],
      window: {
        title: "Update",
      },
      content,
      modal: true
    })
   }

   await game.settings.set("aov", "systemVersion", targetVersion);
}
