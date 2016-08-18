import { combineReducers } from "redux";
import {
	FETCH_EDITIONS, FETCHED_EDITIONS_SUCCESS, FETCHED_EDITIONS_ERROR,
	SELECT_EDITION, CREATED_EDITION_SUCCESS, CREATED_EDITION_ERROR,
	DELETED_EDITION_SUCCESS, DELETED_EDITION_ERROR
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
			delete newEditionsMap[action.payload.editionId];
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
				return elem !== action.payload.editionId
			});
		default:
			return state;
	}
}

// Whether or not we are in the middle of fetching Editions from the server
function isFetching(state = false, action) {
	switch (action.type) {
		case FETCH_EDITIONS:
			return true;
		case FETCHED_EDITIONS_SUCCESS:
		case FETCHED_EDITIONS_ERROR:
			return false;
		default:
			return state;
	}
}

// The error from the most recent server call (if any)
function latestServerError(state = null, action) {
	switch (action.type) {
		case FETCHED_EDITIONS_ERROR:
		case CREATED_EDITION_ERROR:
		case DELETED_EDITION_ERROR:
			return action.payload;
		case FETCHED_EDITIONS_SUCCESS:
		case CREATED_EDITION_SUCCESS:
		case DELETED_EDITION_SUCCESS:
			return null;
		default:
			return state;
	} 
}

// The Edition object ID of the edition we are currently viewing
function selectedEditionId(state = null, action) {
	switch (action.type) {
		case SELECT_EDITION:
			return action.payload.id
		default:
			return state;
	}
}

// Combine all of the above reducers into one reducer
export default combineReducers({
	editions,
	editionIdsNewestToOldest,
	isFetching,
	latestServerError,
	selectedEditionId
});