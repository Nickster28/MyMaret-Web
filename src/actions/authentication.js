/*
 * FILE: AUTHENTICATION ACTIONS
 * ------------------------------
 * Action creators for login (success/failure) and logout (success/failure).
 * Login and logout actions are thunks, and log in/out via the server,
 * dispatching actions and re-routing on success or failure.
 * ------------------------------
 */

import { serverLogIn, serverLogOut } from "../serverAPI";
import { browserHistory } from "react-router";
import {
	LOGGED_IN_SUCCESS, LOG_IN_ERROR,
	LOGGED_OUT_SUCCESS, LOG_OUT_ERROR
} from "../constants";

/* 
 * FUNCTION: logIn
 * ------------------
 * Parameters:
 * 		username - the username to attempt a login with
 *		password - the password to attempt a login with
 *
 * Returns: a thunk that attempts a server login with the given username and
 * 			password, dispatches the appropriate action on success/failure,
 * 			and redirects to the main page on success.
 * ------------------
 */
export function logIn(username, password) {
	return dispatch => {
		return serverLogIn(username, password).then(user => {
			dispatch(loggedInSuccess(user));
			browserHistory.push("/");
		}, error => {
			dispatch(logInError(error));
		});
	}
}

/*
 * FUNCTION: logOut
 * ------------------
 * Parameters: NA
 * Returns: a thunk that attempts a server logout, dispatches the appropriate
 * 			action on success/failure, and redirects to the login page on
 * 			success.
 * ------------------
 */
export function logOut() {
	return dispatch => {
		return serverLogOut().then(() => {
			dispatch(loggedOutSuccess());
			browserHistory.push("/login");
		}, error => {
			dispatch(logOutError(error));
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

// ACTION: representing a failed login, containing the server error.
function logInError(error) {
	return {
		type: LOG_IN_ERROR,
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

// ACTION: representing a failed logout, containing the server error.
function logOutError(error) {
	return {
		type: LOG_OUT_ERROR,
		payload: error,
		error: true
	}
}