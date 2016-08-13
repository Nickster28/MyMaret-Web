/*
 * FILE: EDITIONS ACTIONS
 * ------------------------
 * Action creators for fetching, selecting, and creating editions.
 * Uses thunks to asynchronously interact with the server.
 * ------------------------
 */

 import { fetchAllEditions, createEditionWithName } from "../serverAPI";
 import { browserHistory } from "react-router";
 import {
	FETCH_EDITIONS, FETCHED_EDITIONS_SUCCESS, FETCHED_EDITIONS_ERROR,
	SELECT_EDITION, CREATE_EDITION_SUCCESS, CREATE_EDITION_ERROR
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
 		return fetchAllEditions().then(editions => {
 			dispatch(fetchedEditionsSuccess(editions));
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
		return createEditionWithName(name).then(newEdition => {
			dispatch(createEditionSuccess(newEdition));
			dispatch(selectEditionWithIdAndRedirect(newEdition.id));
		}, (error) => {
			dispatch(createEditionError(error));
			alert("The edition could not be created.  Please try again.");
		});
	}
}

// ACTION: the given new Edition was successfully uploaded to the server
export function createEditionSuccess(edition) {
	return {
		type: CREATE_EDITION_SUCCESS,
		payload: {
			edition
		}
	}
}

// ACTION: an error occurred while trying to create a new Edition object.
export function createEditionError(error) {
	return {
		type: CREATE_EDITION_ERROR,
		payload: error,
		error: true
	}
}

// ACTION: selecting an edition to view
export function selectEditionWithId(id) {
	return {
		type: SELECT_EDITION,
		payload: {
			id
		}
	};
}

// ACTION: user selecting an edition to view, and redirecting the URL to it
export function selectEditionWithIdAndRedirect(id) {
	return dispatch => {
		dispatch(selectEditionWithId(id));
		browserHistory.push("/editions/edition/" + id);
	}
}