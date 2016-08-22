/*
 * CLASS: LoginContainerView
 * ------------------------------
 * A Redux container component aroung LoginView that passes in a login
 * handler that dispatches a login action.
 * ------------------------------
 */

import { connect } from "react-redux";
import { logIn } from "../actions/authentication";
import LoginView from "../components/LoginView";

/* 
 * REDUX: mapDispatchToProps
 * --------------------------
 * A function that takes the dispatch function and returns an object
 * containing Redux actions that are injected into the Login container's props.
 * We need a function to dispatch a login action.
 * --------------------------
 */
const mapDispatchToProps = dispatch => {
	return {
		onLogin: (username, password) => {
			return dispatch(logIn(username, password));
		}
	}
}

/*
 * REDUX: connect
 * ----------------
 * Combines mapStateToProps and mapDispatchToProps to create and export the
 * LoginView container component.
 * ----------------
 */
export default connect(
	null,
	mapDispatchToProps
)(LoginView);