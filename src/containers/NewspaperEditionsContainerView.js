/*
 * CLASS: NewspaperEditionsContainerView
 * ---------------------------------
 * A Redux container component aroung NewspaperEditionsView that passes in info
 * about the state of edition fetching and creating, edition info to pass to
 * the dropdown view,  and actions to help select, fetch and create editions.
 * ---------------------------------
 */

import { connect } from "react-redux";
import { fetchEditions, selectEditionWithId, selectNewestEdition,
		showCreateEditionModalView, createEdition, deleteEdition,
		hideDeleteEditionModalView,
		hideCreateEditionModalView } from "../actions/editions";
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
		editionInfoNewestToOldest: state.get("editionsInfo")
			.get("editionIdsNewestToOldest").map(id => {
				const edition = state.get("editionsInfo").get("editions")
					.get(id);
				return {
					name: edition.get("editionName"),
					id,
					isPublished: edition.get("isPublished")
				}
		}),
		isFetching: state.get("editionsInfo").get("status")
			.get("isFetchingEditions"),
		fetchError: state.get("editionsInfo").get("errors")
			.get("fetchEditionsError"),
		createEditionModalViewVisible: state.get("editionsInfo").get("status")
			.get("createEditionModalViewVisible"),
		deleteEditionModalViewVisible: state.get("editionsInfo").get("status")
			.get("deleteEditionModalViewVisible"),
		edition: state.get("editionsInfo").get("editions")
			.get(state.get("editionsInfo").get("selectedEditionId"))
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
		selectEditionWithId: (shouldRedirect, editionId) => {
			return dispatch(selectEditionWithId(shouldRedirect, editionId));
		},
		selectNewestEdition: () => {
			return dispatch(selectNewestEdition());
		},
		fetchEditions: () => {
			return dispatch(fetchEditions());
		},
		createEdition: name => {
			return dispatch(createEdition(name));
		},
		showCreateEditionModalView: () => {
			return dispatch(showCreateEditionModalView());
		},
		hideCreateEditionModalView: () => {
			return dispatch(hideCreateEditionModalView());
		},
		deleteEdition: edition => {
			return dispatch(deleteEdition(edition));
		},
		hideDeleteEditionModalView: () => {
			return dispatch(hideDeleteEditionModalView());
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