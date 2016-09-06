/* 
 * CLASS: LoginView
 * ----------------
 * A component containing the full login page.  Displays the main logo,
 * along with username + password fields and a login button.
 * On success, attempts to log the user in, and displays a Bootstrap error div
 * on failure.  This component is responsive - at larger widths, the login form
 * is smaller and centered horizontally, while at smaller widths the login
 * form fills the width of the screen.
 *
 * Takes a login handler as props.
 *
 * STATE:
 *		username - the currently-entered username
 *		password - the currently-entered password
 *		isLoggingIn - whether we're logging in via the server right now
 *		error - an error from the most recent login attempt
 * ----------------
 */

import React, { Component, PropTypes } from "react";
import DocumentTitle from "react-document-title";
import { browserHistory } from "react-router";
import Config from "../config";
import LoginLogo from "../images/logo.png";
import "../stylesheets/LoginView.css";

class LoginView extends Component {

	/* 
	 * Bind the methods we use in render() (since in ES6 this.FUNCTION
	 * is not automatically bound to "this", so "this" will be undefined).
	 * Also initialize our state.
	 */
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			username: "",
			password: "",
			isLoggingIn: false,
			error: null
		};
	}

	// Try to log the user in.  On completion, updates our state.
	handleSubmit(e) {
		e.preventDefault();
		this.setState({isLoggingIn: true});

		const savedThis = this;
		this.props.onLogin(this.state.username, this.state.password)
		.then(() => {
			savedThis.setState({isLoggingIn: false, error: null});

			// Redirect to the main page
			browserHistory.push("/");
		}, error => {
			// Save the error and clear the username and password fields
			savedThis.setState({
				isLoggingIn: false,
				username: "",
				password: "",
				error
			});
		});
	}

	/* 
	 * If there is an error message to display, returns a div displaying
	 * it using Bootstrap.  Otherwise, returns null to display nothing.
	 */
	errorMessage() {
		if (this.state.error) {
			return (
				<div className="alert alert-danger">
					<strong>Error: </strong>
					{this.state.error.message}
				</div>
			)
		} else {
			return null;
		}
	}

  	render() {
    	return (
    		<DocumentTitle title={Config.APP_NAME + " | Log In"}>
    			{/* loginScreen contains the color background */}
    			<div id="loginScreen">
    				{/* loginBox contains the actual login form elements */}
    				<div id="loginBox">
    					<img src={LoginLogo} alt={Config.APP_NAME + " logo."}
    					className="img-responsive" />
    					<form onSubmit={this.handleSubmit}>
    						{this.errorMessage()}

    						<input type="text" className="form-control"
    							placeholder="Username"
    							value={this.state.username}
    							onChange={e => {
    								this.setState({username: e.target.value});
    							}} />

    						<input type="password" className="form-control"
    							placeholder="Password"
    							value={this.state.password}
    							onChange={e => {
    								this.setState({password: e.target.value});
    							}} />

    						{/* The button text should indicate logging in or
    							not, and the button should be disabled while
    							logging in */}
    						<button type="submit" className="btn btn-default"
    							disabled={this.state.isLoggingIn ?
    								"disabled" : ""}>
    							{this.state.isLoggingIn ? "Logging in..." :
    								"Log In"}
    						</button>
    					</form>
    				</div>
    			</div>
    		</DocumentTitle>
    	)
  	}
}

/* 
 * PROPTYPES
 * ----------------
 * onLogin - the login handler to call when attempting a login.  Should take 2
 * 			parameters: the username and password (in that order) with which
 *			to log in.  Should return a promise.
 * ----------------
 */
LoginView.propTypes = {
	onLogin: PropTypes.func.isRequired
}

export default LoginView;