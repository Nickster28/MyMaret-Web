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
	DELETED_EDITION_SUCCESS, DELETED_EDITION_ERROR
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

// ACTION: create a new edition with the given name
export function createEdition(name) {
	return dispatch => {
		return createNewspaperEditionWithName(name).then(newEdition => {
			dispatch(createdEditionSuccess(newEdition));
			dispatch(selectEditionWithId(true, newEdition.id));
		}, (error) => {
			dispatch(createdEditionError(error));
			alert("The edition could not be created.  Please try again.");
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

// ACTION: delete the given edition from the server
export function deleteEdition(edition) {
	return dispatch => {
		return deleteNewspaperEdition(edition).then(() => {
			dispatch(deletedEditionSuccess(edition.id));
			dispatch(selectNewestEdition());
		}, (error) => {
			dispatch(deletedEditionError(error));
		});
	}
}

// ACTION: the edition with the given ID was deleted successfully
export function deletedEditionSuccess(editionId) {
	return {
		type: DELETED_EDITION_SUCCESS,
		payload: {
			editionId
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

// ACTION: selecting an edition to view if it's not already selected
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

		if (shouldRedirect) {
			browserHistory.push("/editions/edition/" + id);
		}
	}
}

// ACTION: select the most recent edition to view
export function selectNewestEdition() {
	return (dispatch, getState) => {
		var newestEditionId =
			getState().editionsInfo.editionIdsNewestToOldest[0];
		dispatch(selectEditionWithId(true, newestEditionId));
	}
}