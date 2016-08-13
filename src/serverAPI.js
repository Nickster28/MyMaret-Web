/* 
 * FILE: serverAPI.js
 * ----------------------
 * Parse wrapper file exporting all needed API calls.  This way it's easy to
 * sub in another backend if needed - all logic requiring the backend stems
 * from this file.
 * ----------------------
 */

import Parse from "parse";
import Config from "./config";

Parse.initialize(Config.API_APP_ID);
Parse.serverURL = Config.API_URL;

// Returns the current user, according to Parse's client SDK
export function getCurrentUserFromCookie() {
	return Parse.User.current();
}

// Returns a promise that logs out the current user (if any)
export function serverLogOut() {
	return Parse.User.logOut();
}

/*
 * Returns a promise that attempts to log in with the given username and
 * password.  If the credentials are valid, but the user does not have
 * valid permissions to access this page, we log the user out and return a
 * promise with an error message.
 */
export function serverLogIn(username, password) {
	return Parse.User.logIn(username, password).then(user => {
		return Parse.Cloud.run("IsNewspaperAdmin").then(isNewspaperAdmin => {
			if (isNewspaperAdmin) {
				return user;
			} else {
				return serverLogOut().then(() => {
					return Parse.Promise.error({message: "Not authorized."});
				});
			}
		});
	});
}

/*
 * Returns a promise that validates the given edition name for uniqueness and
 * non-emptiness.
 */
export function isValidEditionName(name) {
	return Parse.Cloud.run("IsValidEditionName", {name});
}

/*
 * Returns a promise that fetches all Editions and returns them in order from
 * newest to oldest.
 */
export function fetchAllEditions() {
	var editionQuery = new Parse.Query("Edition");
	editionQuery.descending("createdAt");
	return editionQuery.find();
}