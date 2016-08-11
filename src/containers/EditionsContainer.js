/*
 * CLASS: EditionsContainer
 * ---------------------------------
 * A Redux container component aroung Editions that passes in a sorted
 * list of edition info (ids + names), which edition is currently selected,
 * and action dispatchers for creating a new edition and selecting an edition
 * to view.
 * ---------------------------------
 */

import { connect } from "react-redux";
import { createEdition,
		selectEditionWithIdAndRedirect } from "../actions/editions";
import Editions from "../components/Editions";

/* 
 * REDUX: mapStateToProps
 * -----------------------
 * A function that takes the current Redux state and returns an object
 * that is set as the editions container's props.  The container needs the list
 * of edition info (title + id) sorted from newest to oldest, and the index in
 * that list of the currently selected edition.
 * -----------------------
 */
const mapStateToProps = state => {
	var props = {
		editionInfoNewestToOldest: state.editionsInfo.editionIdsNewestToOldest.map(id => {
			return {
				title: state.editionsInfo.editions[id].get("editionTitle"),
				id
			}
		})
	};

	// Search the above array we just created for the selected edition's id
	props.selectedEditionIndex = props.editionInfoNewestToOldest.findIndex((elem, index) => {
		return elem.id === state.editionsInfo.selectedEditionId;
	});

	return props;
}

/* 
 * REDUX: mapDispatchToProps
 * --------------------------
 * A function that takes the dispatch function and returns an object
 * containing Redux actions that are injected into the editions container's
 * props.  We need a function to dispatch a "create edition" action and
 * a "switch to this edition" action.
 * --------------------------
 */
const mapDispatchToProps = dispatch => {
	return {
		onCreateEdition: () => {
			// TODO
			dispatch(createEdition());
		},
		onSelectEdition: (editionId) => {
			dispatch(selectEditionWithIdAndRedirect(editionId));
		}
	}
}

/*
 * REDUX: connect
 * ----------------
 * Combines mapStateToProps and mapDispatchToProps to create and export the
 * editions container component.
 * ----------------
 */
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Editions);