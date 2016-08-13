import { combineReducers } from "redux";
import { getCurrentUserFromCookie } from "../serverAPI";
import {
	LOGGED_IN_SUCCESS, LOG_IN_ERROR,
	LOGGED_OUT_SUCCESS, LOG_OUT_ERROR
} from "../constants";

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

// The error (if any) from the most recent login/logout attempt
function error(state = null, action) {
	switch (action.type) {
		case LOGGED_IN_SUCCESS:
		case LOGGED_OUT_SUCCESS:
			return null;
		case LOG_IN_ERROR:
		case LOG_OUT_ERROR:
			return action.payload;
		default:
			return state;
	}
}

// Combine the above reducers into one reducer for authentication state
export default combineReducers({
	user,
	error
});