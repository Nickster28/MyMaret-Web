/*
 * CLASS: NewspaperEditionContainerView
 * ---------------------------------
 * A Redux container component aroung NewspaperEditionView that passes in the
 * NewspaperEdition object to display.
 * ---------------------------------
 */

import { connect } from "react-redux";
import { deleteEdition } from "../actions/editions";
import NewspaperEditionView from "../components/NewspaperEditionView";

/* 
 * REDUX: mapStateToProps
 * -----------------------
 * A function that takes the current Redux state and returns an object
 * that is set as the edition container's props.  The container needs the
 * Edition object to display.
 * -----------------------
 */
const mapStateToProps = (state, ownProps) => {
	return {
		edition: state.editionsInfo.editions[ownProps.params.id]
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
	// TODO
	return {
		onChangeEditionPublished: function(edition, isPublished) {

		},
		onDeleteEdition: function(edition) {
			dispatch(deleteEdition(edition));
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