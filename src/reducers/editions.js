import { combineReducers } from "redux";
import {
	FETCHED_EDITIONS_SUCCESS, SELECT_EDITION, CREATED_EDITION_SUCCESS,
	DELETED_EDITION_SUCCESS
} from "../constants";

// Map of Edition object IDs to the Edition object
function editions(state = {}, action) {
	switch (action.type) {
		case FETCHED_EDITIONS_SUCCESS:
			var editionsMap = {};
			action.payload.editions.forEach(edition => {
				editionsMap[edition.id] = edition;
			});
			return editionsMap;
		case CREATED_EDITION_SUCCESS:
			return Object.assign({}, state, {
				[action.payload.edition.id]: action.payload.edition
			});
		case DELETED_EDITION_SUCCESS:
			var newEditionsMap = Object.assign({}, state);
			delete newEditionsMap[action.payload.id];
			return newEditionsMap;
		default:
			return state;
	}
}

// Array of Edition object IDs, sorted from newest to oldest
function editionIdsNewestToOldest(state = [], action) {
	switch (action.type) {
		case FETCHED_EDITIONS_SUCCESS:
			return action.payload.editions.map(edition => edition.id);
		case CREATED_EDITION_SUCCESS:
			return [action.payload.edition.id, ...state];
		case DELETED_EDITION_SUCCESS:
			return state.filter(elem => {
				return elem !== action.payload.id
			});
		default:
			return state;
	}
}

// The Edition object ID of the edition we are currently viewing
function selectedEditionId(state = null, action) {
	switch (action.type) {
		case SELECT_EDITION:
			return action.payload.id;
		default:
			return state;
	}
}

// The most recently-deleted edition id
function lastDeletedEditionId(state = null, action) {
	switch (action.type) {
		case DELETED_EDITION_SUCCESS:
			return action.payload.id;
		default:
			return state;
	}
}

// Combine all of the above reducers into one reducer
export default combineReducers({
	editions,
	editionIdsNewestToOldest,
	lastDeletedEditionId,
	selectedEditionId
});