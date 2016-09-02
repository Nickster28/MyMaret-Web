/*
 * CLASS: NewspaperEditionContainerView
 * ---------------------------------
 * A Redux container component aroung NewspaperEditionView that passes in the
 * NewspaperEdition object to display, along with delete operation information.
 * ---------------------------------
 */

import { connect } from "react-redux";
import { deleteEdition, selectNewestEdition, toggleEditionPublished,
		showDeleteEditionModalView,
		hideDeleteEditionModalView,
		showToggleEditionPublishedModalView,
		hideToggleEditionPublishedModalView } from "../actions/editions";
import NewspaperEditionView from "../components/NewspaperEditionView";

/* 
 * REDUX: mapStateToProps
 * -----------------------
 * A function that takes the current Redux state and returns an object
 * that is set as the edition container's props.  The container needs the
 * Edition object to display and info about visible modals.
 * -----------------------
 */
const mapStateToProps = (state, ownProps) => {
	return {
		edition: state.editionsInfo.editions[ownProps.params.id],
		deleteEditionModalViewVisible: state.editionsInfo.status
			.deleteEditionModalViewVisible,
		toggleEditionPublishedModalViewVisible: state.editionsInfo.status
			.toggleEditionPublishedModalViewVisible
	}
}

/* 
 * REDUX: mapDispatchToProps
 * --------------------------
 * A function that takes the dispatch function and returns an object
 * containing Redux actions that are injected into the edition container's
 * props.
 * --------------------------
 */
const mapDispatchToProps = dispatch => {
	return {
		deleteEdition: edition => {
			return dispatch(deleteEdition(edition));
		},
		selectNewestEdition: () => {
			return dispatch(selectNewestEdition());
		},
		showDeleteEditionModalView: () => {
			return dispatch(showDeleteEditionModalView());
		},
		hideDeleteEditionModalView: () => {
			return dispatch(hideDeleteEditionModalView());
		},
		toggleEditionPublished: edition => {
			return dispatch(toggleEditionPublished(edition));
		},
		showToggleEditionPublishedModalView: () => {
			return dispatch(showToggleEditionPublishedModalView());
		},
		hideToggleEditionPublishedModalView: () => {
			return dispatch(hideToggleEditionPublishedModalView());
		}
	}
}

/*
 * REDUX: connect
 * ----------------
 * Combines mapStateToProps and mapDispatchToProps to create and export the
 * edition container component.
 * ----------------
 */
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NewspaperEditionView);