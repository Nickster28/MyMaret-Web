/*
 * FILE: EDITIONS ACTIONS
 * ------------------------
 * Action creators for fetching, selecting, and creating editions.
 * Uses thunks to asynchronously interact with the server.
 * ------------------------
 */

 import { fetchAllNewspaperEditions, 
 		createNewspaperEditionWithName,
 		deleteNewspaperEdition } from "../serverAPI";
 import { browserHistory } from "react-router";
 import {
	FETCH_EDITIONS, FETCHED_EDITIONS_SUCCESS, FETCHED_EDITIONS_ERROR,
	SELECT_EDITION, CREATED_EDITION_SUCCESS, CREATED_EDITION_ERROR,
	DELETED_EDITION_SUCCESS, DELETED_EDITION_ERROR,
	CLEAR_FETCHED_EDITIONS_ERROR, CLEAR_CREATED_EDITION_ERROR,
	CLEAR_DELETED_EDITION_ERROR, DELETE_EDITION, CREATE_EDITION
 } from "../constants";

/*
 * FUNCTION: fetchEditions
 * -------------------------
 * Parameters: NA
 * Returns: a thunk that attempts to query for all Edition objects in our
 * 			database.  Dispatches an appropriate action on success/failure.
 * -------------------------
 */
export function fetchEditions() {
 	return dispatch => {
 		
 		dispatch({
 			type: FETCH_EDITIONS
 		});

 		// Query for Editions from the database
 		var t0 = performance.now();
 		return fetchAllNewspaperEditions().then(editions => {

 			// Delay long enough that we can have a loading indicator appear
 			var t1 = performance.now();
 			if ((t1 - t0) < 2000) {
 				setTimeout(() => {
 					dispatch(fetchedEditionsSuccess(editions));
 				}, 2000 - (t1 - t0));
 			} else {
 				dispatch(fetchedEditionsSuccess(editions));
 			}
 			
 		}, error => {
 			dispatch(fetchedEditionsError(error));
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

// ACTION: representing a failed fetch of all editions
function fetchedEditionsError(error) {
	return {
		type: FETCHED_EDITIONS_ERROR,
		payload: error,
		error: true
	}
}

// ACTION: Mark the error as "handled" aka remove it
export function clearFetchedEditionsError() {
	return {
		type: CLEAR_FETCHED_EDITIONS_ERROR
	}
}

// ACTION: create a new edition with the given name
export function createEdition(name) {
	return dispatch => {

		dispatch({
			type: CREATE_EDITION
		});

		return createNewspaperEditionWithName(name).then(newEdition => {
			dispatch(createdEditionSuccess(newEdition));
			dispatch(selectEditionWithId(true, newEdition.id));
		}, (error) => {
			dispatch(createdEditionError(error));
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

// ACTION: an error occurred while trying to create a new Edition object.
export function createdEditionError(error) {
	return {
		type: CREATED_EDITION_ERROR,
		payload: error,
		error: true
	}
}

// ACTION: Mark the error as "handled" aka remove it
export function clearCreatedEditionError() {
	return {
		type: CLEAR_CREATED_EDITION_ERROR
	}
}

// ACTION: delete the given edition from the server
export function deleteEdition(edition) {
	return dispatch => {

		dispatch({
			type: DELETE_EDITION
		});

		return deleteNewspaperEdition(edition).then(() => {
			dispatch(deletedEditionSuccess(edition.id));
			dispatch(selectNewestEdition());
		}, (error) => {
			dispatch(deletedEditionError(error));
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

// ACTION: the given error occurred while trying to delete an edition
export function deletedEditionError(error) {
	return {
		type: DELETED_EDITION_ERROR,
		payload: error,
		error: true
	}
}

// ACTION: Mark the error as "handled" aka remove it
export function clearDeletedEditionError() {
	return {
		type: CLEAR_DELETED_EDITION_ERROR
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