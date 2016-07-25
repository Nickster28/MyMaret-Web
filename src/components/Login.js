/* CLASS: Login
 * ----------------
 * A component containing the full login page.  Displays the main logo,
 * along with username + password fields and a login button.
 * On success, logs the user in through Parse and redirects them to the
 * main page.  Displays a Bootstrap error div on failure.
 * This component is responsive - at larger widths, the login form is
 * smaller and centered horizontally, while at smaller widths the login
 * form fills the width of the screen.
 * ----------------
 */

import React, { Component } from "react";
import Parse from "../ParseWrapper";
import { browserHistory } from "react-router";
import DocumentTitle from "react-document-title";
import Config from "../config";

// Import the necessary CSS and image resources
import LoginLogo from "../images/logo.png";
import "../stylesheets/Login.css";

export default class Login extends Component {

	/* Bind the methods we use in render() (since in ES6 this.FUNCTION
	 * is not automatically bound to "this", so "this" will be undefined).
	 * Also initialize our state.
	 */
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);

		this.state = {username: "", password: "", error: ""};
	}

	/* Try to log the user in via Parse, and redirect to / on success.
	 * Update our state with an error message on failure.
	 */
	handleSubmit(e) {
		e.preventDefault();
		var savedThis = this;
		Parse.User.logIn(this.state.username, this.state.password).then(function() {
			browserHistory.push("/");
		}, function(error) {
			savedThis.setState({username: "", password: "", error: error.message});
		});
	}

	// Triggered when the user types in the username field
	handleUsernameChange(e) {
		this.setState({username: e.target.value});
	}

	// Triggered when the user types in the password field
	handlePasswordChange(e) {
		this.setState({password: e.target.value});
	}

	/* If there is an error message to display, returns a div displaying
	 * it using Bootstrap.  Otherwise, returns an empty string to display
	 * nothing.
	 */
	errorMessage() {
		if (this.state.error) {
			return (
				<div className="alert alert-danger">
					<strong>Error: </strong>
					{this.state.error}
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
    						<input type="text" className="form-control" placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange} />
    						<input type="password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange} />
    						<button type="submit" className="btn btn-default"> Log In </button>
    					</form>
    				</div>
    			</div>
    		</DocumentTitle>
    	)
  	}
}