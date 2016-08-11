/* 
 * CLASS: Login
 * ----------------
 * A component containing the full login page.  Displays the main logo,
 * along with username + password fields and a login button.
 * On success, attempts to log the user in, and displays a Bootstrap error div
 * on failure.  This component is responsive - at larger widths, the login form
 * is smaller and centered horizontally, while at smaller widths the login
 * form fills the width of the screen.
 *
 * Takes a login handler and an optional login error object as props.
 * ----------------
 */

import React, { Component, PropTypes } from "react";
import DocumentTitle from "react-document-title";
import Config from "../config";

// Import the necessary CSS and image resources
import LoginLogo from "../images/logo.png";
import "../stylesheets/Login.css";

class Login extends Component {

	/* 
	 * Bind the methods we use in render() (since in ES6 this.FUNCTION
	 * is not automatically bound to "this", so "this" will be undefined).
	 * Also initialize our state.
	 */
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.state = {username: "", password: ""};
	}

	// Try to log the user in
	handleSubmit(e) {
		e.preventDefault();
		this.props.onLogin(this.state.username, this.state.password);
	}

	// Triggered when the user types in the username field
	handleUsernameChange(e) {
		this.setState({username: e.target.value});
	}

	// Triggered when the user types in the password field
	handlePasswordChange(e) {
		this.setState({password: e.target.value});
	}

	/* 
	 * If there is an error message to display, returns a div displaying
	 * it using Bootstrap.  Otherwise, returns an empty string to display
	 * nothing.
	 */
	errorMessage() {
		if (this.props.loginError) {
			return (
				<div className="alert alert-danger">
					<strong>Error: </strong>
					{this.props.loginError.message}
				</div>
			)
		} else {
			return "";
		}
	}

  	render() {
    	return (
    		<DocumentTitle title={Config.APP_NAME + " | Log In"}>
    			{/* loginScreen contains the color background */}
    			<div id="loginScreen">
    				{/* loginBox contains the actual login form elements */}
    				<div id="loginBox">
    					<img src={LoginLogo} className="img-responsive" />
    					<form onSubmit={this.handleSubmit}>
    						{this.errorMessage()}
    						<input type="text" className="form-control"
    							placeholder="Username"
    							value={this.state.username}
    							onChange={this.handleUsernameChange} />
    						<input type="password" className="form-control"
    							placeholder="Password"
    							value={this.state.password}
    							onChange={this.handlePasswordChange} />
    						<button type="submit" className="btn btn-default">
    							Log In
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
 *			to log in.
 * loginError - an optional error object from the most recent login attempt.
 * 			Must contain a message field.
 * ----------------
 */
Login.propTypes = {
	onLogin: PropTypes.func.isRequired,
	loginError: PropTypes.shape({
		message: PropTypes.string.isRequired
	})
}

export default Login;