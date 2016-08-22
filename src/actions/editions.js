/*
 * FILE: EDITIONS ACTIONS
 * ------------------------
 * Action creators for fetching, selecting, deleting and creating editions.
 * Uses thunks to asynchronously interact with the server.
 * ------------------------
 */

 import { fetchAllNewspaperEditions, 
 		createNewspaperEditionWithName,
 		deleteNewspaperEdition, delay } from "../serverAPI";
 import { browserHistory } from "react-router";
 import {
	FETCHED_EDITIONS_SUCCESS, SELECT_EDITION, CREATED_EDITION_SUCCESS,
	DELETED_EDITION_SUCCESS
 } from "../constants";

/*
 * FUNCTION: fetchEditions
 * -------------------------
 * Parameters: NA
 * Returns: a thunk that attempts to query for all Edition objects in our
 * 			database.  Dispatches a success action on success.
 * -------------------------
 */
export function fetchEditions() {
 	return dispatch => {

 		var t0 = performance.now();

 		// Query for Editions from the database
 		return fetchAllNewspaperEditions().then(editions => {
 			/*
 			 * Delay long enough that we can have a loading indicator appear.
 			 * We want a min 2s loading time, so delay the difference.  Note
 			 * that delay immediately resolves if the passed in delay time is
 			 * negative or 0.
 			 */
 			return delay(2000 - (performance.now() - t0)).then(() => {
 				dispatch(fetchedEditionsSuccess(editions));
 			});
 		});
 	}
}

// ACTION: representing a successful fetch of all editions
function fetchedEditionsSuccess(editions) {
 	return {
 		type: FETCHED_EDITIONS_SUCCESS,
 		payload: {
 			editions
 		}
 	}
}

// ACTION: create a new edition with the given name
export function createEdition(name) {
	return dispatch => {
		return createNewspaperEditionWithName(name).then(newEdition => {
			dispatch(createdEditionSuccess(newEdition));
			dispatch(selectEditionWithId(true, newEdition.id));
		});
	}
}

// ACTION: the given new Edition was successfully uploaded to the server
export function createdEditionSuccess(edition) {
	return {
		type: CREATED_EDITION_SUCCESS,
		payload: {
			edition
		}
	}
}

// ACTION: delete the given edition from the server
export function deleteEdition(edition) {
	return dispatch => {
		return deleteNewspaperEdition(edition).then(() => {
			dispatch(deletedEditionSuccess(edition.id));
		});
	}
}

// ACTION: the edition with the given ID was deleted successfully
export function deletedEditionSuccess(id) {
	return {
		type: DELETED_EDITION_SUCCESS,
		payload: {
			id
		}
	}
}

/*
 * ACTION: selecting an edition to view if it's not already selected.  If id
 * is null, but redirect is true, pushes /editions as the next url.
 */
export function selectEditionWithId(shouldRedirect, id) {
	return (dispatch, getState) => {
		if (id !== getState().editionsInfo.selectedEditionId) {
			dispatch({
				type: SELECT_EDITION,
				payload: {
					id
				}
			});
		}

		if (shouldRedirect && id) {
			browserHistory.push("/editions/edition/" + id);
		} else if (shouldRedirect) {
			browserHistory.push("/editions")
		}
	}
}

// ACTION: select the most recent edition to view
export function selectNewestEdition() {
	return (dispatch, getState) => {
		var editionId = getState().editionsInfo.editionIdsNewestToOldest[0];
		dispatch(selectEditionWithId(true, editionId ? editionId : null));
	}
}