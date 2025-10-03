export default class AOVDialog extends foundry.applications.api.DialogV2 {

  static DEFAULT_OPTIONS = {
    classes: ["aov","item"],
    position: {
      width: 400,
      height: "auto",
      top: 200,
      left: 1200,
      zIndex: 500
    },
  }
}
