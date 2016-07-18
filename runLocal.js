/* FILE: runLocal.js
------------------------
Runs different configurations of the MyMaret webapp server.  Takes 1-2 command
line arguments:

node runLocal.js APP_ID_NAME URL_NAME

- (REQUIRED) APP_ID_NAME - must match a key in the "appId" object within
apiServerInfo.json.  Specifies the App ID, and optionally the server URL, to
use when running the webapp server.
- (OPTIONAL) URL_NAME - must match a key in the "serverURL" object within
apiServerInfo.json.  Specifies the server URL to use when running the webapp
server.  If not given, defaults to the same value as APP_ID_NAME.

Runs 'webpack' to compile bundle.js, followed by 'nodemon server.js' with
API_APP_ID and API_URL environment variables specified by the above command
line arguments.
------------------------
*/

var execSync = require('child_process').execSync;
var fs = require('fs');
var apiServerInfo = JSON.parse(fs.readFileSync('apiServerInfo.json', 'utf8'));

/* FUNCTION: apiArgsStringForNames
 * ----------------------------------------
 * Parameters:
 * 		appIdName - name of the appId to use from apiServerInfo.json
 *		urlName - name of the serverURL to use from apiServerInfo.json.
 *					If not specified, defaults to the same value as appIdName.
 *
 * Returns: the command line string needed to start webapp server.
 * 		Format: "API_APP_ID={APP_ID} API_URL={SERVER_URL}"
 * ----------------------------------------
 */
function apiArgsStringForNames(appIdName, urlName) {
	if (urlName == undefined) urlName = appIdName;

	var appId = apiServerInfo["appId"][appIdName];
	var serverURL = apiServerInfo["serverURL"][urlName];

	if (!appId || !serverURL) return null;

	return 'API_APP_ID=\"' + appId + '\" API_URL=\"' + serverURL + '\"';
}


// Ignore the first 2 'node' and process name args
var args = process.argv.slice(2)

var argsString = apiArgsStringForNames(args[0], args[1]);
if (!argsString) {
	console.error("Error: invalid arguments");
} else {
	execSync("webpack && " + argsString + " nodemon server.js",
		{stdio:[0,1,2]});
}
