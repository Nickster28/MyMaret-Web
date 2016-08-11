import { combineReducers } from "redux";
import Parse from "../ParseWrapper";
import {
	LOGGED_IN_SUCCESS, LOGGED_IN_ERROR,
	LOGGED_OUT_SUCCESS, LOGGED_OUT_ERROR
} from "../constants";

// The currently logged-in user object
function user(state = Parse.User.current(), action) {
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
		case LOGGED_IN_ERROR:
		case LOGGED_OUT_ERROR:
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