/* CLASS: NavigationBar
 * ---------------------
 * A top navigation bar component that displays the site name as well as links
 * to the Analytics and Editions pages.  Uses NavigationBarLink to properly route
 * between pages, as well as to mark the active link with a special classname.  The
 * NavigationBar also displays a logout button on the right to log the user out from
 * Parse, and at smaller widths, collapses into a dropdown menu.
 * ---------------------
 */

import React, { Component } from "react";
import Parse from "../ParseWrapper";
import { browserHistory } from "react-router";
import Config from "../config";

// Import other necessary components
import NavigationBarLink from "./NavigationBarLink";

// Import necessary CSS for this component
import "../stylesheets/NavigationBar.css";

export default class NavigationBar extends Component {
	
	// Logs the user out from Parse, and redirects back to /login on success
	logOut(e) {
		e.preventDefault();
		Parse.User.logOut().then(() => {
			browserHistory.push("/login");
		}, (error) => {
			alert("Could not log out - an error occured.");
		});
	}

	// Renders a responsive, Bootstrap, fixed-top navigation bar
	render() {
		return (
			<nav className="navbar navbar-default navbar-fixed-top">
			    <div className="container-fluid">
			        <div className="navbar-header">
			        	<button type="button" id="nav-toggle" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-items">
			        		<span className="sr-only">Toggle navigation</span>
			        		<span className="icon-bar"></span>
			        		<span className="icon-bar"></span>
			        		<span className="icon-bar"></span>
			        	</button>
			            <div className="navbar-brand">{Config.APP_NAME}</div>
			        </div>
			        <div className="collapse navbar-collapse" id="navbar-items">
			        	<ul className="nav navbar-nav">
			        	    <li><NavigationBarLink to="/analytics">Analytics</NavigationBarLink></li>
			        	    <li><NavigationBarLink to="/editions">Editions</NavigationBarLink></li>
			        	</ul>
			        	<button type="button" id="logoutButton" className="btn btn-default navbar-btn navbar-right" onClick={this.logOut.bind(this)}>
			        		<span className="glyphicon glyphicon-log-out" aria-hidden="true"></span> Log Out
			        	</button>
			        </div>
			    </div>
			</nav>
		)
	}
}