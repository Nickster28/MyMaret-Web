/*
 * CLASS: LogoutButtonContainerView
 * ------------------------------
 * A Redux container component aroung LogoutButton that passes in a logout
 * handler that dispatches a logout action, and passes in the logout error
 * (if any) from our Redux store.
 * ------------------------------
 */

import { connect } from "react-redux";
import { logOut } from "../actions/authentication";
import LogoutButton from "../components/LogoutButton";

/* 
 * REDUX: mapStateToProps
 * -----------------------
 * A function that takes the current Redux state and returns an object
 * that is set as the LogoutButton container's props.  The LogoutButton
 * container only needs the logout error, if any.
 * -----------------------
 */
const mapStateToProps = state => {
	return {
		logoutError: state.authentication.error
	}
}

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
		onLogout:() => {
			dispatch(logOut());
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
	mapStateToProps,
	mapDispatchToProps
)(LogoutButton);
