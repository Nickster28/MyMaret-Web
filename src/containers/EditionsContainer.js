/*
 * CLASS: EditionsContainer
 * ---------------------------------
 * A Redux container component aroung Editions that passes in a sorted
 * list of edition info (ids + names), and action dispatchers for creating
 * a new edition and selecting an edition to view.
 * ---------------------------------
 */

import { connect } from "react-redux";
import { createEdition, selectEditionWithId } from "../actions/editions";
import Editions from "../components/Editions";

/* 
 * REDUX: mapStateToProps
 * -----------------------
 * A function that takes the current Redux state and returns an object
 * that is set as the dropdown container's props.  The container only
 * needs the list of edition info (title + id) sorted from newest to oldest.
 * -----------------------
 */
const mapStateToProps = state => {
	return {
		editionInfoNewestToOldest: state.editionsInfo.editionIdsNewestToOldest.map(id => {
			return {
				title: state.editionsInfo.editions[id].get("editionTitle"),
				id
			}
		})
	}
}

/* 
 * REDUX: mapDispatchToProps
 * --------------------------
 * A function that takes the dispatch function and returns an object
 * containing Redux actions that are injected into the dropdown container's
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
			dispatch(selectEditionWithId(editionId));
		}
	}
}

/*
 * REDUX: connect
 * ----------------
 * Combines mapStateToProps and mapDispatchToProps to create and export the
 * dropdown container component.
 * ----------------
 */
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Editions);