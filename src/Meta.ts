/**
 * @typedef {{
 *   version: string;
 *   date: string;
 * }} MetaType
 */

/** @type {MetaType} */
const meta = {
  version: __APP_VERSION__,
  date: __BUILD_DATE__,
};
export default meta;
