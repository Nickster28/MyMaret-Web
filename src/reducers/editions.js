import { combineReducers } from "redux";
import {
	FETCHED_EDITIONS_SUCCESS, SELECT_EDITION, CREATED_EDITION_SUCCESS,
	DELETED_EDITION_SUCCESS, FETCHED_EDITIONS_ERROR, FETCH_EDITIONS,
	SHOW_CREATE_EDITION_MODAL_VIEW, HIDE_CREATE_EDITION_MODAL_VIEW,
	SHOW_DELETE_EDITION_MODAL_VIEW, HIDE_DELETE_EDITION_MODAL_VIEW,
	SHOW_TOGGLE_EDITION_PUBLISHED_MODAL_VIEW,
	HIDE_TOGGLE_EDITION_PUBLISHED_MODAL_VIEW, TOGGLED_EDITION_PUBLISHED_SUCCESS
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
			let smallerEditionsMap = Object.assign({}, state);
			delete smallerEditionsMap[action.payload.id];
			return smallerEditionsMap;
		case TOGGLED_EDITION_PUBLISHED_SUCCESS:
			let updatedEditionsMap = Object.assign({}, state);
			updatedEditionsMap[action.payload.updatedEdition.id] =
				action.payload.updatedEdition;
			return updatedEditionsMap;
		default:
			return state;
	}
}

// Object containing booleans tracking different states, e.g. fetching, etc.
function status(state = {}, action) {
	return combineReducers({
		isFetchingEditions,
		createEditionModalViewVisible,
		deleteEditionModalViewVisible,
		toggleEditionPublishedModalViewVisible
	})(state, action);
}

// Whether or not we are currently in the middle of fetching editions
function isFetchingEditions(state = false, action) {
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

// Whether or not the modal to create a new edition is currently visible
function createEditionModalViewVisible(state = false, action) {
	switch (action.type) {
		case SHOW_CREATE_EDITION_MODAL_VIEW:
			return true;
		case HIDE_CREATE_EDITION_MODAL_VIEW:
			return false;
		default:
			return state;
	}
}

// Whether or not the modal to delete an edition is currently visible
function deleteEditionModalViewVisible(state = false, action) {
	switch (action.type) {
		case SHOW_DELETE_EDITION_MODAL_VIEW:
			return true;
		case HIDE_DELETE_EDITION_MODAL_VIEW:
			return false;
		default:
			return state;
	}
}

// Whether or not the modal to publish/unpublish an edition is currently visible
function toggleEditionPublishedModalViewVisible(state = false, action) {
	switch (action.type) {
		case SHOW_TOGGLE_EDITION_PUBLISHED_MODAL_VIEW:
			return true;
		case HIDE_TOGGLE_EDITION_PUBLISHED_MODAL_VIEW:
			return false;
		default:
			return state;
	}
}

// Object containing errors (if any) for different operations
function errors(state = {}, action) {
	return combineReducers({
		fetchEditionsError
	})(state, action);
}

// Error (if any) from most recent editions fetch
function fetchEditionsError(state = null, action) {
	switch (action.type) {
		case FETCHED_EDITIONS_SUCCESS:
			return null;
		case FETCHED_EDITIONS_ERROR:
			return action.payload;
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
		case DELETED_EDITION_SUCCESS:
			if (action.payload.id === state) {
				return null;
			} else {
				return state;
			}
		default:
			return state;
	}
}

// Combine all of the above reducers into one reducer
export default combineReducers({
	editions,
	editionIdsNewestToOldest,
	errors,
	status,
	selectedEditionId
});