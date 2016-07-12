import Parse from 'parse'

// TODO: change/remove these before prod

Parse.initialize(process.env.API_APP_ID);
Parse.serverURL = process.env.API_URL;

export default Parse;