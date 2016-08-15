/* 
 * FILE: config.js
 * ------------------
 * Exports an object containing app-wide constants such as the school
 * name and API server information.
 * ------------------
 */
 
let configObject = {
	SCHOOL_NAME: "Maret",
	API_APP_ID: "mymaret-api-frogs",
	//API_URL: "https://mymaret-api.herokuapp.com/parse"
	API_URL: "http://localhost:1337/parse"
};

// The app name is a function of the school name
configObject.APP_NAME = "My" + configObject.SCHOOL_NAME;

export default configObject;