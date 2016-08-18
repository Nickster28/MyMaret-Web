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
 		return fetchAllNewspaperEditions().then(editions => {
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
		return createNewspaperEditionWithName(name).then(newEdition => {
			dispatch(createdEditionSuccess(newEdition));
			dispatch(selectEditionWithIdAndRedirect(newEdition.id));
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
			browserHistory.push("/editions");
		}, (error) => {
			dispatch(deletedEditionError(error));
			alert("The edition could not be deleted.  Please try again.");
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