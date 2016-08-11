/*
 * FILE: EDITIONS ACTIONS
 * ------------------------
 * Action creators for fetching editions and creating new editions.
 * Uses thunks to asynchronously interact with the server.
 * ------------------------
 */

 import Parse from "../ParseWrapper";
 import { browserHistory } from "react-router";
 import {
 	FETCH_EDITIONS, FETCHED_EDITIONS_SUCCESS, FETCHED_EDITIONS_ERROR,
 	SELECT_EDITION, EDITIONS_INDEX_REDIRECT_TRUE,
 	EDITIONS_INDEX_REDIRECT_FALSE, CREATE_EDITION
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
 		var editionQuery = new Parse.Query("Edition");
 		editionQuery.descending("createdAt");
 		return editionQuery.find().then(editions => {
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

// TODO:
export function createEdition() {
	return {
		type: CREATE_EDITION
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

// ACTION: we just redirected from /editions
export function editionsIndexRedirectTrue() {
	return {
		type: EDITIONS_INDEX_REDIRECT_TRUE
	}
}

// ACTION: we no longer just redirected from /editions
export function editionsIndexRedirectFalse() {
	return {
		type: EDITIONS_INDEX_REDIRECT_FALSE
	}
}