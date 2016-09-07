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
const WebAppError = Parse.Object.extend("WebAppError");


// Returns the current user, according to Parse's client SDK
export function getCurrentUserFromCookie() {
	return Parse.User.current();
}

// Returns a promise that logs out the current user (if any)
export function serverLogOut() {
	return Parse.User.logOut().then(() => {}, error => {
		// Log the error, and pass it along
		return errorHandler(error, null, "serverLogOut").then(() => {
			return Parse.Promise.error(error);
		});
	});
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
	}, error => {
		// Log the error and pass it along
		const stateString = "serverLogIn - username = \"" + username + "\"";
		return errorHandler(error, null, stateString).then(() => {
			return Parse.Promise.error(error);
		});
	});
}

/*
 * Returns a promise that validates the given edition name for uniqueness and
 * non-emptiness.
 */
export function isValidNewspaperEditionName(name) {
	return Parse.Cloud.run("IsValidNewspaperEditionName", {name})
		.then(isValid => {
		return isValid;
	}, error => {
		// Log the error and pass it along
		const stateString = "isValidNewspaperEditionName - name = \""
			+ name + "\"";
		return errorHandler(error, null, stateString).then(() => {
			return Parse.Promise.error(error);
		});
	});
}

/*
 * Returns a promise that fetches all NewspaperEditions and returns them in
 * order from newest to oldest.
 */
export function fetchAllNewspaperEditions() {
	const editionsQuery = new Parse.Query(NewspaperEdition);
	editionsQuery.descending("createdAt");
	editionsQuery.include("sections");
	return editionsQuery.find().then(editions => {
		return editions;
	}, error => {
		// Log the error and pass it along
		return errorHandler(error, null, "fetchAllNewspaperEditions")
			.then(() => {
				return Parse.Promise.error(error);
		});
	});
}

/*
 * Creates a new NewspaperEdition with the given name as its editionName,
 * and all other properties initialized to their defaults.
 */
export function createNewspaperEditionWithName(editionName) {
	const edition = new NewspaperEdition();
	return edition.save({editionName}).then(newEdition => {
		const editionQuery = new Parse.Query(NewspaperEdition);
		editionQuery.include("sections");
		return editionQuery.get(newEdition.id);
	}, error => {
		// Log the error and pass it along
		const stateString = "createNewspaperEditionWithName - " + editionName;
		return errorHandler(error, null, stateString).then(() => {
			return Parse.Promise.error(error);
		});
	});
}

// Returns a promise that deletes the given edition from the server
export function deleteNewspaperEdition(edition) {
	return edition.destroy().then(deletedEdition => {
		return deletedEdition;
	}, error => {
		// Log the error and pass it along
		const stateString = "deleteNewspaperEdition - "
			+ JSON.stringify(edition);
		return errorHandler(error, null, stateString).then(() => {
			return Parse.Promise.error(error);
		});
	});
}

// Returns a promise that updates the edition's published state
export function setEditionPublished(edition, isPublished) {
	return edition.save("isPublished", isPublished).then(savedEdition => {
		return savedEdition;
	}, error => {
		// Log the error and pass it along
		const stateString = "setEditionPublished - " + isPublished + " - "
			+ JSON.stringify(edition);
		return errorHandler(error, null, stateString).then(() => {
			return Parse.Promise.error(error);
		});
	});
}

// Submits an error object to our server with the error and optional app state.
export function errorHandler(error, getState, state) {
	const errorObject = new WebAppError();
	return errorObject.save({
		error: JSON.stringify(error),
		state: getState ? JSON.stringify(getState()) : state
	}).then(savedErrorObject => {
		console.error(savedErrorObject);
		console.log("Error reported.")
	}, parseError => {
		console.error("Error not reported.");
		console.error(parseError);
	});
}