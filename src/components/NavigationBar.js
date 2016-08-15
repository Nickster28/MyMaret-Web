/* 
 * CLASS: NavigationBar
 * ---------------------
 * A top navigation bar component that displays the site name as well as links
 * to the Analytics and Editions pages.  Uses NavigationBarLink to properly
 * route between pages, as well as to mark the active link with a special
 * classname.  The NavigationBar also displays a logout button on the right to
 * log the user out, and at smaller widths, collapses into a dropdown menu.
 * ---------------------
 */

import React, { Component } from "react";
import Config from "../config";

// Import other necessary components
import NavigationBarLink from "./NavigationBarLink";
import LogoutButtonContainerView from "../containers/LogoutButtonContainerView";

// Import necessary CSS for this component
import "../stylesheets/NavigationBar.css";

export default class NavigationBar extends Component {

	// Renders a responsive, Bootstrap, fixed-top navigation bar
	render() {
		return (
			<nav className="navbar navbar-default navbar-fixed-top">
			    <div className="container-fluid">
			        <div className="navbar-header">
			        	<button type="button" id="nav-toggle"
			        		className="navbar-toggle collapsed"
			        		data-toggle="collapse" data-target="#navbar-items">
			        		<span className="sr-only">Toggle navigation</span>
			        		<span className="icon-bar"></span>
			        		<span className="icon-bar"></span>
			        		<span className="icon-bar"></span>
			        	</button>
			            <div className="navbar-brand">{Config.APP_NAME}</div>
			        </div>
			        <div className="collapse navbar-collapse" id="navbar-items">
			        	<ul className="nav navbar-nav">
			        	    <li><NavigationBarLink to="/analytics">
			        	    	Analytics
			        	    </NavigationBarLink></li>
			        	    <li><NavigationBarLink to="/editions">
			        	    	Editions
			        	    </NavigationBarLink></li>
			        	</ul>
			        	<LogoutButtonContainerView />
			        </div>
			    </div>
			</nav>
		)
	}
}