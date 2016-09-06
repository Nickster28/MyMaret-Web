/* 
 * CLASS: LogoutButton
 * ---------------------
 * A button that logs the user out, and displays a message in the button itself
 * on failure.  Takes a logout handler as a prop.
 *
 * STATE:
 *		isLoggingOut - whether or not we're logging out via the server right now
 *		error - an error from the most recent logout attempt
 * ---------------------
 */

import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import "../stylesheets/LogoutButton.css";

class LogoutButton extends Component {

	constructor(props) {
		super(props);
		this.state = {isLoggingOut: false, error: null};
		this.handleLogout = this.handleLogout.bind(this);
		this.logoutButtonTitle = this.logoutButtonTitle.bind(this);
	}
	
	// Attempts to log the user out.  On completion, updates our state.
	handleLogout(e) {
		e.preventDefault();
		this.setState({isLoggingOut: true});

		const savedThis = this;
		this.props.onLogout().then(() => {
			savedThis.setState({isLoggingOut: false, error: null});

			// Redirect to the login page
			browserHistory.push("/login");
		}, error => {
			savedThis.setState({isLoggingOut: false, error});
		});
	}

	// Display "Log Out", except if there's an error or we are logging out
	logoutButtonTitle() {
		if (this.state.error) {
			return "Logout Error: Try Again";
		} else if (this.state.isLoggingOut) {
			return "Logging out...";
		} else {
			return "Log Out";
		}
	}

	/*
	 * Renders a Bootstrap button for logout with a logout glyphicon on the
	 * left.  The button should be disabled when logging out, and should
	 * have button text that reflects the state.
	 */
	render() {
		return (
			<button type="button" id="logoutButton" onClick={this.handleLogout}
				className="btn btn-default navbar-btn navbar-right"
				disabled={this.state.isLoggingOut ? "disabled" : ""}>
				<span id="logoutIcon" className="glyphicon glyphicon-log-out"
					aria-hidden="true"></span>
				{this.logoutButtonTitle()}
			</button>
		)
	}
}

/*
 * PROPTYPES
 * ---------------
 * onLogout - the logout handler to call when attempting a logout.  Should take
 * 				no parameters.  Should return a promise.
 * ---------------
 */
LogoutButton.propTypes = {
	onLogout: PropTypes.func.isRequired
}

export default LogoutButton;