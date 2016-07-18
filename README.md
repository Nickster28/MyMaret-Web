# MyMaret-Web

A Parse+React+Flux web dashboard for MyMaret newspaper configuration and analytics.  To start, run `npm install` to install all necessary packages, and then run

`npm start`

##Expects the following environment variables:
- **API_APP_ID** - App ID of the MyMaret API to connect to
- **API_URL** - URL of the MyMaret API to connect to
- **(OPTIONAL) PORT** - the port to run from (defaults to 8080)

## Testing and Debugging
Optionally, you can run additional webapp server configurations with different debugging options.  These configurations are all run using the runLocal.js script, which requires a `apiServerInfo.json` file to be in the same directory, with the following structure:

```javascript
{
	"appId": {
		// KEY-VALUE PAIRS OF POSSIBLE MYMARET API APP IDS
	},
	"serverURL": {
		// KEY-VALUE PAIRS OF POSSIBLE MYMARET API URLS
	}
}
```

runLocal.js takes care of all of the required environment variables for you using `apiServerInfo.json`.  It allows you to run a MyMaret-Web instance locally, while connecting to either local or hosted instances of the MyMaret API.  There are premade npm scripts that allow you to run these various configurations:
- `npm run start:prod` - runs locally connecting to the hosted prod MyMaret API.
- `npm run start:staging` - runs locally connecting to the hosted staging MyMaret API.
- `npm run start:prod-local` - runs locally connecting to a local prod version of the MyMaret API.
- `npm run start:staging-local` - runs locally connecting to a local staging version of the MyMaret API.

## `runLocal.js` Details
If you're interested in the JS code that underlies the above npm scripts, the `runLocal.js` script takes 1 or two arguments:

`runLocal.js APP_ID_NAME URL_NAME`

- **(REQUIRED) APP_ID_NAME** - must match a key in the "appId" object within
apiServerInfo.json.  Specifies the App ID to use when running the webapp server.
- **(OPTIONAL) URL_NAME** - must match a key in the "serverURL" object within
apiServerInfo.json.  Specifies the server URL to use when running the webapp
server.  If not given, defaults to the same value as APP_ID_NAME.

## Additional Tidbits
There is a `commitAndPushAll.sh` script included, which if run, will commit and push the entered file changes to both staging and master.  It will ask for a commit message on launch.  Note that you will need to add any untracked files before running this script.