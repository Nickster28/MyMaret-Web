/*
 * FILE: EDITIONS ACTIONS
 * ------------------------
 * Action creators for fetching, selecting, deleting and creating editions.
 * Uses thunks to asynchronously interact with the server.
 * ------------------------
 */

 import { fetchAllNewspaperEditions, 
 		createNewspaperEditionWithName,
 		deleteNewspaperEdition,
 		setEditionPublished } from "../serverAPI";
 import { browserHistory } from "react-router";
 import {
	FETCHED_EDITIONS_SUCCESS, SELECT_EDITION, CREATED_EDITION_SUCCESS,
	DELETED_EDITION_SUCCESS, FETCHED_EDITIONS_ERROR, FETCH_EDITIONS,
	SHOW_CREATE_EDITION_MODAL_VIEW, HIDE_CREATE_EDITION_MODAL_VIEW,
	SHOW_DELETE_EDITION_MODAL_VIEW, HIDE_DELETE_EDITION_MODAL_VIEW,
	SHOW_TOGGLE_EDITION_PUBLISHED_MODAL_VIEW,
	HIDE_TOGGLE_EDITION_PUBLISHED_MODAL_VIEW, TOGGLED_EDITION_PUBLISHED_SUCCESS
 } from "../constants";
 import { List as immutableList } from "immutable";

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
 			dispatch(fetchedEditionsSuccess(immutableList(editions)));
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
		return createNewspaperEditionWithName(name).then(newEdition => {
			dispatch(createdEditionSuccess(newEdition));
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

// ACTION: show the delete edition modal
export function showDeleteEditionModalView() {
	return {
		type: SHOW_DELETE_EDITION_MODAL_VIEW
	}
}

// ACTION: hide the delete edition modal
export function hideDeleteEditionModalView() {
	return {
		type: HIDE_DELETE_EDITION_MODAL_VIEW
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

// ACTION: show the modal for publishing/unpublishing an edition
export function showToggleEditionPublishedModalView() {
	return {
		type: SHOW_TOGGLE_EDITION_PUBLISHED_MODAL_VIEW
	}
}

// ACTION: hide the modal for publishing/unpublishing an edition
export function hideToggleEditionPublishedModalView() {
	return {
		type: HIDE_TOGGLE_EDITION_PUBLISHED_MODAL_VIEW
	}
}

// ACTION: publish/unpublish the given edition on the server
export function toggleEditionPublished(edition) {
	return dispatch => {
		return setEditionPublished(edition, !edition.get("isPublished"))
			.then(updatedEdition => {
			dispatch(toggledEditionPublishedSuccess(updatedEdition));
		});
	}
}

/*
 * ACTION: the given edition had its published status updated (the given object
 * is the updated object).
 */
function toggledEditionPublishedSuccess(updatedEdition) {
	return {
		type: TOGGLED_EDITION_PUBLISHED_SUCCESS,
		payload: {
			edition: updatedEdition
		}
	}
}

/*
 * ACTION: selecting an edition to view if it's not already selected.  If id
 * is null, but redirect is true, pushes /editions as the next url.
 */
export function selectEditionWithId(shouldRedirect, id) {
	return (dispatch, getState) => {
		if (id && id !== getState().get("editionsInfo")
			.get("selectedEditionId")) {

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
		var editionId = getState().get("editionsInfo")
			.get("editionIdsNewestToOldest").get(0);
		dispatch(selectEditionWithId(true, editionId ? editionId : null));
	}
}