import {Base} from "../base.js";
import pluralize from "pluralize";

export default class Adapter extends Base {
  static property = {}
  static init(property) {
    Adapter.property = property
  }
}
