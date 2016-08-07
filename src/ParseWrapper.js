/* 
 * FILE: ParseWrapper.js
 * ----------------------
 * Create our own Parse module since importing the module directly seems
 * to create a new Parse instance each time.  Also configure it with the
 * correct App ID and server URL.
 * ----------------------
 */

import Parse from "parse";
import Config from "./config";

Parse.initialize(Config.API_APP_ID);
Parse.serverURL = Config.API_URL;

export default Parse;