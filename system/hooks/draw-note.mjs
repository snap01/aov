/**
 * Draw Note Icon
 * @param {ApplicationV2} application
 */
export default function (application) {
  if (application.document.getFlag('aov', 'hide-background') ?? false) {
    application.controlIcon.bg.clear()
  }
}
