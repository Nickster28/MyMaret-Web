import Parse from 'parse'

// TODO: change/remove these before prod
Parse.initialize(window.API_APP_ID);
Parse.serverURL = window.API_URL;

export default Parse;