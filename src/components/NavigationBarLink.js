/* 
 * CLASS: NavigationBarLink
 * ----------------------------
 * A simple wrapper around React Router's Link component to ensure
 * that the activeClassName for every Link is always set to "active".
 *
 * Also attaches an onClick handler to collapse the navigation drawer
 * on smaller screens, since that doesn't happen automatically.
 * ----------------------------
 */

import React, { Component } from "react";
import { Link } from "react-router";

export default class NavigationBarLink extends Component {
	
	/* 
	 * Collapses the navigation drawer on smaller width screens.
	 * This is needed because the drawer doesn't collapse, since it
	 * is normally used in non-single-page-apps where the page will
	 * refresh and the drawer state won't matter anymore.
	 */
	collapseNavigation() {
		if (window.$(document).width() < 768) {
			window.$("#nav-toggle").click();
		}
	}

	render() {
		return <Link {...this.props}
			onClick={this.collapseNavigation.bind(this)}
			activeClassName="active"/>;
	}
}