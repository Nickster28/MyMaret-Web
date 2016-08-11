/* 
 * CLASS: LogoutButton
 * ---------------------
 * A button that logs the user out, and displays a message in the button itself
 * on failure.  Takes a logout handler and an optional logout error object as
 * props.
 * ---------------------
 */

import React, { Component, PropTypes } from "react";

// Import necessary CSS for this component
import "../stylesheets/LogoutButton.css";

class LogoutButton extends Component {

	constructor(props) {
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
		this.logoutButtonTitle = this.logoutButtonTitle.bind(this);
	}
	
	// Attempts to log the user out
	handleLogout(e) {
		e.preventDefault();
		this.props.onLogout();
	}

	// The logout button either displays "Log Out" or an error if one occurred
	logoutButtonTitle() {
		if (this.props.logoutError) {
			return "Logout Error: Try Again";
		} else {
			return "Log Out";
		}
	}

	// Renders a Bootstrap button for logout with a logout glyphicon on the left
	render() {
		return (
			<button type="button" id="logoutButton"
				className="btn btn-default navbar-btn navbar-right"
				onClick={this.handleLogout}>
				<span className="glyphicon glyphicon-log-out"
					aria-hidden="true"></span> {this.logoutButtonTitle()}
			</button>
		)
	}
}

/*
 * PROPTYPES
 * ---------------
 * onLogout - the logout handler to call when attempting a logout.  Should take
 * 				no parameters.
 * logoutError - an optional error object from the most recent logout attempt.
 *				Must contain a message field.
 * ---------------
 */
LogoutButton.propTypes = {
	onLogout: PropTypes.func.isRequired,
	logoutError: PropTypes.shape({
		message: PropTypes.string.isRequired
	})
}

export default LogoutButton;