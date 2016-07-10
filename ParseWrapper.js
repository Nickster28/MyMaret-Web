import Parse from 'parse'

Parse.initialize("mymaret-api-prod");
Parse.serverURL = "https://www.mymaret-api-prod.herokuapp.com/parse";

Parse.User.current = function() { return false; }

export default Parse;