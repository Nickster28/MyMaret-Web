/*
 * REDUCER: authentication
 * --------------------------
 * Handles all state regarding users/auth.  The state structure is:
 * {
 *		user // the server user object representing the logged-in user
 * }
 * --------------------------
 */

import { combineReducers } from "redux-immutable";
import { getCurrentUserFromCookie } from "../serverAPI";
import { LOGGED_IN_SUCCESS, LOGGED_OUT_SUCCESS } from "../constants";

// The currently logged-in user object
function user(state = getCurrentUserFromCookie(), action) {
	switch (action.type) {
		case LOGGED_IN_SUCCESS:
			return action.payload.user;
		case LOGGED_OUT_SUCCESS:
			return null;
		default:
			return state;
	}
}

export default combineReducers({
	user
});