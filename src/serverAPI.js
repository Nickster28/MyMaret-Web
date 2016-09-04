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

const NewspaperEdition = Parse.Object.extend("NewspaperEdition");


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
export function isValidNewspaperEditionName(name) {
	return Parse.Cloud.run("IsValidNewspaperEditionName", {name});
}

/*
 * Returns a promise that fetches all NewspaperEditions and returns them in
 * order from newest to oldest.
 */
export function fetchAllNewspaperEditions() {
	var editionsQuery = new Parse.Query(NewspaperEdition);
	editionsQuery.descending("createdAt");
	editionsQuery.include("sections");
	return editionsQuery.find();
}

/*
 * Creates a new NewspaperEdition with the given name as its editionName,
 * and all other properties initialized to their defaults.
 */
export function createNewspaperEditionWithName(editionName) {
	var edition = new NewspaperEdition();
	return edition.save({editionName}).then(newEdition => {
		var editionQuery = new Parse.Query(NewspaperEdition);
		editionQuery.include("sections");
		return editionQuery.get(newEdition.id);
	});
}

// Returns a promise that deletes the given edition from the server
export function deleteNewspaperEdition(edition) {
	return edition.destroy();
}

// Returns a promise that updates the edition's published state
// TOOD: make a cloud function
export function setEditionPublished(edition, isPublished) {
	return edition.save("isPublished", isPublished);
}