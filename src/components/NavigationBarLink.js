/* FUNCTION: NavigationBarLink
 * ----------------------------
 * A simple wrapper around React Router's Link component to ensure
 * that the activeClassName for every Link is always set to "active".
 *
 * Note that this is just a function because NavigationBarLink has no
 * internal state - it is merely a function of props, so we can declare
 * it as a function instead of a class.
 * ----------------------------
 */

import React from "react";
import { Link } from "react-router";

export default function NavigationBarLink(props) {
	return <Link {...props} activeClassName="active"/>;
}