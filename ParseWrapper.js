import Parse from 'parse'

Parse.initialize(window.API_APP_ID);
Parse.serverURL = window.API_URL;

export default Parse;