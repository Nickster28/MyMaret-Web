import {
	FETCH_EDITIONS, FETCHED_EDITIONS_SUCCESS, FETCHED_EDITIONS_ERROR,
	SELECT_EDITION, EDITIONS_INDEX_REDIRECT_TRUE, EDITIONS_INDEX_REDIRECT_FALSE
} from "../constants";

/*
 * FUNCTION: editionsInfo
 * ---------------------------
 * Parameters:
 * 		state - the current state to use when generating the next state
 *		action - the action to use to modify the state.
 *
 * Returns: updated editions state based on the action
 *
 * Decomposed reducer for editions state - an object containing each edition
 * object and their info, along with information about whether or not we're
 * currently fetching editions, the error that most recently occurred
 * (if any), the edition being viewed, and whether we just redirected from
 * the index page (/editions).
 *
 * Initial State = {
 *		editions: {},    // map of objectId to Edition
 *		editionIdsNewestToOldest: [],
 *		isFetching: false,
 *		fetchError: null,
 *		redirectedFromIndex: false	// whether we just came from /editions
 *										(to avoid fetching 2x in src/index.js)
 *		selectedEditionId: null	// ID of currently viewable edition in Editions
 * }
 * ---------------------------
 */

const initialState = {editions: {}, editionIdsNewestToOldest: [],
					isFetching: false, fetchError: null, 
					redirectedFromIndex: false, selectedEditionId: null};
export default function editionsInfo(state = initialState, action) {
	switch (action.type) {
		case FETCH_EDITIONS:
			return Object.assign({}, state, {
				isFetching: true,
				fetchError: null
			});
		case FETCHED_EDITIONS_SUCCESS:
			// On success, the payload has editions sorted newest to oldest
			var editions = action.payload.editions;
			return Object.assign({}, state, {
				editions: editionsMapWithEditions(editions),
				editionIdsNewestToOldest: editions.map(edition => edition.id),
				isFetching: false,
				fetchError: null
			});
		case FETCHED_EDITIONS_ERROR:
			return Object.assign({}, state, {
				isFetching: false,
				fetchError: action.payload
			});
		case SELECT_EDITION:
			return Object.assign({}, state, {
				selectedEditionId: action.payload.id
			});
		case EDITIONS_INDEX_REDIRECT_FALSE:
			return Object.assign({}, state, {
				redirectedFromIndex: false
			});
		case EDITIONS_INDEX_REDIRECT_TRUE:
			return Object.assign({}, state, {
				redirectedFromIndex: true
			});
		default:
			return state;
	}
}

/*
 * FUNCTION: editionsMapWithEditions
 * ----------------------------------
 * Parameters:
 * 		editions - an array of Edition objects from the server to make a map of
 *
 * Returns: a map from objectIds to Edition objects for all given Editions.
 * ----------------------------------
 */
function editionsMapWithEditions(editions) {
	var editionsMap = {};
	editions.forEach(edition => {
		editionsMap[edition.id] = edition;
	});
	return editionsMap;
}