/*
 * CLASS: NewspaperEditionsContainerView
 * ---------------------------------
 * A Redux container component aroung NewspaperEditionsView that passes in info
 * about the state of edition fetching and creating, edition info to pass to
 * the dropdown view,  and actions to help select, fetch and create editions.
 * ---------------------------------
 */

import { connect } from "react-redux";
import { createEdition, fetchEditions,
		selectEditionWithId, selectNewestEdition } from "../actions/editions";
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
		selectedEditionId: state.editionsInfo.selectedEditionId,
		selectedEditionDeleted: state.editionsInfo.lastDeletedEditionId != null
			&& state.editionsInfo.lastDeletedEditionId === ownProps.params.id,
		isFetching: state.editionsInfo.status.isFetchingEditions,
		fetchError: state.editionsInfo.errors.fetchEditionsError
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
			return dispatch(createEdition(name));
		},
		selectEditionWithId: (shouldRedirect, editionId) => {
			return dispatch(selectEditionWithId(shouldRedirect, editionId));
		},
		selectNewestEdition: () => {
			return dispatch(selectNewestEdition());
		},
		fetchEditions: () => {
			return dispatch(fetchEditions());
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