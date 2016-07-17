var execSync = require('child_process').execSync;
var fs = require('fs');
var apiServerInfo = JSON.parse(fs.readFileSync('apiServerInfo.json', 'utf8'));

/* FUNCTION: apiArgsStringForServerName
 * ----------------------------------------
 * Parameters:
 * 		apiServerName - name of the API server to create a string for
 *
 * Returns: the command line string needed to start webapp server.
 * 		Format: "API_APP_ID={APP_ID} API_URL={SERVER_URL}"
 * ----------------------------------------
 */
function apiArgsStringForServerName(apiServerName) {
	var selectedServerInfo = apiServerInfo[apiServerName];
	if (!selectedServerInfo) return null;

	return 'API_APP_ID=\"' + selectedServerInfo.appId + '\" API_URL=\"' +
		selectedServerInfo.serverURL + '\"';
}


// Ignore the first 2 'node' and process name args
var args = process.argv.slice(2)

var argsString = apiArgsStringForServerName(args[0]);
if (!argsString) {
	console.error("Error: invalid server name");
} else {
	execSync("webpack && " + argsString + " nodemon server.js", {stdio:[0,1,2]});
}
