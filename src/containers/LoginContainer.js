/*
 * CLASS: LoginContainer
 * ------------------------------
 * A Redux container component aroung Login that passes in a login
 * handler that dispatches a login action, and passes in the login error
 * (if any) from our Redux store.
 * ------------------------------
 */

import { connect } from "react-redux";
import { logIn } from "../actions/authentication";

import Login from "../components/Login";

/* 
 * REDUX: mapStateToProps
 * -----------------------
 * A function that takes the current Redux state and returns an object
 * that is set as the Login container's props.  The Login container only
 * needs the authentication error, if any.
 * -----------------------
 */
const mapStateToProps = state => {
	return {
		loginError: state.authentication.error
	}
}

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
			dispatch(logIn(username, password));
		}
	}
}

/*
 * REDUX: connect
 * ----------------
 * Combines mapStateToProps and mapDispatchToProps to create and export the
 * Login container component.
 * ----------------
 */
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Login);