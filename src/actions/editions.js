/*
 * FILE: EDITIONS ACTIONS
 * ------------------------
 * Action creators for fetching, selecting, deleting and creating editions.
 * Uses thunks to asynchronously interact with the server.
 * ------------------------
 */

 import { fetchAllNewspaperEditions, 
 		createNewspaperEditionWithName,
 		deleteNewspaperEdition } from "../serverAPI";
 import { browserHistory } from "react-router";
 import {
	FETCHED_EDITIONS_SUCCESS, SELECT_EDITION, CREATED_EDITION_SUCCESS,
	DELETED_EDITION_SUCCESS, FETCHED_EDITIONS_ERROR, FETCH_EDITIONS,
	CREATE_EDITION, SHOW_CREATE_EDITION_MODAL_VIEW,
	HIDE_CREATE_EDITION_MODAL_VIEW, CREATED_EDITION_ERROR
 } from "../constants";

/*
 * FUNCTION: fetchEditions
 * -------------------------
 * Parameters: NA
 * Returns: a thunk that attempts to query for all Edition objects in our
 * 			database.  Dispatches a success action on success, and an error
 *			action on failure.
 * -------------------------
 */
export function fetchEditions() {
 	return dispatch => {

 		dispatch({
 			type: FETCH_EDITIONS
 		});

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

// ACTION: representing a failed fetch of editions
function fetchedEditionsError(error) {
	return {
		type: FETCHED_EDITIONS_ERROR,
		payload: error,
		error: true
	}
}

// ACTION: show the create edition modal
export function showCreateEditionModalView() {
	return {
		type: SHOW_CREATE_EDITION_MODAL_VIEW
	}
}

// ACTION: hide the create edition modal
export function hideCreateEditionModalView() {
	return {
		type: HIDE_CREATE_EDITION_MODAL_VIEW
	}
}

// ACTION: create a new edition with the given name.
export function createEdition(name) {
	return dispatch => {

		dispatch({
			type: CREATE_EDITION
		});

		return createNewspaperEditionWithName(name).then(newEdition => {
			dispatch(createdEditionSuccess(newEdition));
			dispatch(selectEditionWithId(true, newEdition.id));
		}, error => {
			dispatch(createdEditionError(error));
		});
	}
}

// ACTION: the given new Edition was successfully uploaded to the server
function createdEditionSuccess(edition) {
	return {
		type: CREATED_EDITION_SUCCESS,
		payload: {
			edition
		}
	}
}

// ACTION: the new edition failed to be created on the server
function createdEditionError(error) {
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
		});
	}
}

// ACTION: the edition with the given ID was deleted successfully
function deletedEditionSuccess(id) {
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