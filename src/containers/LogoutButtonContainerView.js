/*
 * CLASS: LogoutButtonContainerView
 * ------------------------------
 * A Redux container component aroung LogoutButton that passes in a logout
 * handler that dispatches a logout action.
 * ------------------------------
 */

import { connect } from "react-redux";
import { logOut } from "../actions/authentication";
import LogoutButton from "../components/LogoutButton";

/* 
 * REDUX: mapDispatchToProps
 * --------------------------
 * A function that takes the dispatch function and returns an object
 * containing Redux actions that are injected into the Login container's props.
 * We need a function to dispatch a logout action.
 * --------------------------
 */
const mapDispatchToProps = dispatch => {
	return {
		onLogout: () => {
			return dispatch(logOut());
		}
	}
}

/*
 * REDUX: connect
 * ----------------
 * Combines mapStateToProps and mapDispatchToProps to create and export the
 * LogoutButton container component.
 * ----------------
 */
export default connect(
	null,
	mapDispatchToProps
)(LogoutButton);
