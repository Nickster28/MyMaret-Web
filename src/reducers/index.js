import authentication from "./authentication";
import editionsInfo from "./editions";
import routing from "./routing";
import { combineReducers } from "redux-immutable";

// Combine all the reducers into one root reducer and export that.
export default combineReducers({
	authentication,
	editionsInfo,
	routing
});