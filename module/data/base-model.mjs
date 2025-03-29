export default class AovDataModel extends foundry.abstract.TypeDataModel {
  toPlainObject() {
    return {...this};
  }
}