/* 
 * CLASS: NavigationBarLink
 * ----------------------------
 * A simple wrapper around React Router's Link component to ensure
 * that the activeClassName for every Link is always set to "active".  Note
 * that this component can just be a function since it is merely a function of
 * its props, and has no internal state.
 *
 * All other props we receive are just passed through to Link.
 * ----------------------------
 */

import React from "react";
import { Link } from "react-router";

const activeClassName = "active";

export default props => {
	return <Link {...props} activeClassName={activeClassName}/>
}