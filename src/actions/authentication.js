/*
 * FILE: AUTHENTICATION ACTIONS
 * ------------------------------
 * Action creators for login and logout.
 * Login and logout actions are thunks, and log in/out via the server,
 * dispatching actions and re-routing on success.
 * ------------------------------
 */

import { serverLogIn, serverLogOut } from "../serverAPI";
import { LOGGED_IN_SUCCESS, LOGGED_OUT_SUCCESS } from "../constants";

/* 
 * FUNCTION: logIn
 * ------------------
 * Parameters:
 * 		username - the username to attempt a login with
 *		password - the password to attempt a login with
 *
 * Returns: a thunk that attempts a server login with the given username and
 * 			password, dispatches the appropriate action on success,
 * 			and redirects to the main page on success.
 * ------------------
 */
export function logIn(username, password) {
	return dispatch => {
		return serverLogIn(username, password).then(user => {
			dispatch(loggedInSuccess(user));
		});
	}
}

/*
 * FUNCTION: logOut
 * ------------------
 * Parameters: NA
 * Returns: a thunk that attempts a server logout, dispatches the appropriate
 * 			action and redirects to the login page on success.
 * ------------------
 */
export function logOut() {
	return dispatch => {
		return serverLogOut().then(() => {
			dispatch(loggedOutSuccess());
		});
	}
}

// ACTION: representing a successful login, containing the logged in user
function loggedInSuccess(user) {
	return {
		type: LOGGED_IN_SUCCESS,
		payload: {
			user
		}
	}
}

// ACTION: representing a successful logout.
function loggedOutSuccess() {
	return {
		type: LOGGED_OUT_SUCCESS
	}
}