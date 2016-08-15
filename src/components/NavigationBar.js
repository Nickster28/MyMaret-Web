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
import $ from "jquery";

// Import other necessary components
import NavigationBarLink from "./NavigationBarLink";
import LogoutButtonContainerView from "../containers/LogoutButtonContainerView";

// Import necessary CSS for this component
import "../stylesheets/NavigationBar.css";

const navToggleButtonId = "nav-toggle";
export default class NavigationBar extends Component {

	constructor(props) {
		super(props);
		this.collapseNavigation = this.collapseNavigation.bind(this);
	}

	/* 
	 * Collapses the navigation drawer on smaller width screens when a nav link
	 * is clicked.  This is needed because the drawer doesn't collapse, since it
	 * is normally used in non-single-page-apps where the page will
	 * refresh and the drawer state won't matter anymore.
	 */
	collapseNavigation() {
		if ($(document).width() < 768) {
			$("#" + navToggleButtonId).click();
		}
	}

	// Renders a responsive, Bootstrap, fixed-top navigation bar
	render() {
		return (
			<nav className="navbar navbar-default navbar-fixed-top">
			    <div className="container-fluid">
			        <div className="navbar-header">
			        	<button type="button" id={navToggleButtonId}
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
			        	    <li><NavigationBarLink to="/analytics"
			        	    	onClick={this.collapseNavigation}>
			        	    	Analytics
			        	    </NavigationBarLink></li>
			        	    <li><NavigationBarLink to="/editions"
			        	    	onClick={this.collapseNavigation}>
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