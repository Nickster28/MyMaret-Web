/*
 * CLASS: NewspaperEditionsContainerView
 * ---------------------------------
 * A Redux container component aroung NewspaperEditionsView that passes in a
 * sorted list of edition info (ids + names), which edition is currently
 * selected, and action dispatchers for creating a new edition and selecting an
 * edition to view.
 * ---------------------------------
 */

import { connect } from "react-redux";
import { createEdition, fetchEditions,
		selectEditionWithId, selectNewestEdition, clearFetchedEditionsError,
		clearCreatedEditionError } from "../actions/editions";
import NewspaperEditionsView from "../components/NewspaperEditionsView";

/* 
 * REDUX: mapStateToProps
 * -----------------------
 * A function that takes the current Redux state and returns an object
 * that is set as the editions container's props.
 * -----------------------
 */
const mapStateToProps = (state, ownProps) => {
	return {
		editionInfoNewestToOldest: state.editionsInfo
			.editionIdsNewestToOldest.map(id => {
			return {
				name: state.editionsInfo.editions[id].get("editionName"),
				id,
				isPublished: state.editionsInfo.editions[id].get("isPublished")
			}
		}),
		isFetching: state.editionsInfo.isFetching,
		isCreatingEdition: state.editionsInfo.isCreatingEdition,
		selectedEditionId: state.editionsInfo.selectedEditionId,
		hasFetched: state.editionsInfo.hasFetched,
		deleted: state.editionsInfo.lastDeletedEditionId === ownProps.params.id,
		latestFetchError: state.editionsInfo.latestServerErrors.fetchError,
		latestCreateError: state.editionsInfo.latestServerErrors.createError
	};
}

/* 
 * REDUX: mapDispatchToProps
 * --------------------------
 * A function that takes the dispatch function and returns an object
 * containing Redux actions that are injected into the editions container's
 * props.
 * --------------------------
 */
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onCreateEdition: name => {
			dispatch(createEdition(name));
		},
		selectEditionWithId: (shouldRedirect, editionId) => {
			dispatch(selectEditionWithId(shouldRedirect, editionId));
		},
		selectNewestEdition: () => {
			dispatch(selectNewestEdition());
		},
		fetchEditions: () => {
			return dispatch(fetchEditions());
		},
		clearFetchedEditionsError: () => {
			dispatch(clearFetchedEditionsError());
		},
		clearCreatedEditionError: () => {
			dispatch(clearCreatedEditionError());
		}
	}
}

/*
 * REDUX: connect
 * ----------------
 * Combines mapStateToProps and mapDispatchToProps to create and export the
 * editions view container component.
 * ----------------
 */
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NewspaperEditionsView);