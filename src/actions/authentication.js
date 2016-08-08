/*
 * FILE: AUTHENTICATION ACTIONS
 * ------------------------------
 * Action creators for login (success/failure) and logout (success/failure).
 * Login and logout actions are thunks, and log in/out via Parse, dispatching
 * actions and re-routing on success or failure.
 * ------------------------------
 */

import Parse from "../ParseWrapper";
import { browserHistory } from "react-router";
import {
	LOGGED_IN_SUCCESS, LOGGED_IN_ERROR,
	LOGGED_OUT_SUCCESS, LOGGED_OUT_ERROR
} from "../constants";

/* 
 * FUNCTION: logIn
 * ------------------
 * Parameters:
 * 		username - the username to attempt a login with
 *		password - the password to attempt a login with
 *
 * Returns: a thunk that attempts a Parse login with the given username and
 * 			password, verifies that the user is a newspaper admin, dispatches
 *			the appropriate action on success/failure, and redirects to the
 *			main page on success.
 * ------------------
 */
export function logIn(username, password) {
	return dispatch => {
		var loggedInUser = null;
		Parse.User.logIn(username, password).then(user => {
			loggedInUser = user;
			return Parse.Cloud.run("IsNewspaperAdmin");
		}).then(isNewspaperAdmin => {
			if (!isNewspaperAdmin) {
				dispatch(loggedInError({message: "Unauthorized."}));
			} else {
				dispatch(loggedInSuccess(loggedInUser));
				browserHistory.push("/");
			}
		}, error => {
			dispatch(loggedInError(error));
		});
	}
}

/*
 * FUNCTION: logOut
 * ------------------
 * Parameters: NA
 * Returns: a thunk that attempts a Parse logout, dispatches the appropriate
 * 			action on success/failure, and redirects to the login page on
 * 			success.
 * ------------------
 */
export function logOut() {
	return dispatch => {
		Parse.User.logOut().then(() => {
			dispatch(loggedOutSuccess());
			browserHistory.push("/login");
		}, error => {
			dispatch(loggedOutError(error));
		});
	}
}

// ACTION: representing a successful login, containing the logged in Parse user
function loggedInSuccess(user) {
	return {
		type: LOGGED_IN_SUCCESS,
		payload: {
			user
		}
	}
}

// ACTION: representing a failed login, containing the Parse error.
function loggedInError(error) {
	return {
		type: LOGGED_IN_ERROR,
		payload: error,
		error: true
	}
}

// ACTION: representing a successful logout.
function loggedOutSuccess() {
	return {
		type: LOGGED_OUT_SUCCESS
	}
}

// ACTION: representing a failed logout, containing the Parse error.
function loggedOutError(error) {
	return {
		type: LOGGED_OUT_ERROR,
		payload: error,
		error: true
	}
}