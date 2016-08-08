import Parse from "../ParseWrapper";
import {
	LOGGED_IN_SUCCESS, LOGGED_IN_ERROR,
	LOGGED_OUT_SUCCESS, LOGGED_OUT_ERROR
} from "../constants";

/*
 * FUNCTION: authentication
 * ---------------------------
 * Parameters:
 * 		state - the current state to use when generating the next state
 *		action - the action to use to modify the state
 *
 * Returns: updated authentication state based on the login/logout action
 *
 * Decomposed reducer for authentication state - the currently logged-in user,
 * and an error, if any, that occurred during login and logout.
 *
 * Initial State = {
 *		user: Parse.User.current() // logged-in Parse user object (if any)
 *		errr: null // error from last login/logout (if any)
 * }
 * ---------------------------
 */

export default function authentication(state = {user: Parse.User.current(), error: null}, action) {
	switch (action.type) {
		case LOGGED_IN_SUCCESS:
			return Object.assign({}, state, {
				user: action.payload.user,
				error: null
			});
		case LOGGED_OUT_SUCCESS:
			return Object.assign({}, state, {
				user: null,
				error: null
			});
		case LOGGED_IN_ERROR:
		case LOGGED_OUT_ERROR:
			return Object.assign({}, state, {
				error: action.payload
			});
		default:
			return state;
	}
}