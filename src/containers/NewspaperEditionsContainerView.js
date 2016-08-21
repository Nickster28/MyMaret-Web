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
		selectEditionWithId, selectNewestEdition } from "../actions/editions";
import NewspaperEditionsView from "../components/NewspaperEditionsView";

/* 
 * REDUX: mapStateToProps
 * -----------------------
 * A function that takes the current Redux state and returns an object
 * that is set as the editions container's props.  The container needs the list
 * of edition info (name + id + is published?) sorted from newest to oldest, and
 * the index in that list of the currently selected edition.
 * -----------------------
 */
const mapStateToProps = state => {
	var props = {
		editionInfoNewestToOldest: state.editionsInfo
			.editionIdsNewestToOldest.map(id => {
			return {
				name: state.editionsInfo.editions[id].get("editionName"),
				id,
				isPublished: state.editionsInfo.editions[id].get("isPublished")
			}
		}),
		isFetching: state.editionsInfo.isFetching,
		hasFetched: state.editionsInfo.hasFetched
	};

	// Search the above array we just created for the selected edition's id
	props.selectedEditionIndex = props
		.editionInfoNewestToOldest.findIndex((elem, index) => {
		return elem.id === state.editionsInfo.selectedEditionId;
	});

	return props;
}

/* 
 * REDUX: mapDispatchToProps
 * --------------------------
 * A function that takes the dispatch function and returns an object
 * containing Redux actions that are injected into the editions container's
 * props.  We need a function to dispatch a "create edition" action with a name,
 * a "switch to this edition" action (and a wrapper that selects the newest
 * edition), and an action to fetch all editions.
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