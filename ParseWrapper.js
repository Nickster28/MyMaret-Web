import Parse from 'parse'

Parse.initialize("mymaret-api-prod");
Parse.serverURL = "http://mymaret-api-prod.herokuapp.com/parse";

export default Parse;