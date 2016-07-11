import Parse from 'parse'

// TODO: change/remove these before prod

Parse.initialize("mymaret-api-prod");
Parse.serverURL = "https://mymaret-api-prod.herokuapp.com/parse";

export default Parse;