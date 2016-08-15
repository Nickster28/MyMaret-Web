/* 
 * FUNCTION: AppView
 * ----------------------------
 * The root React component for this app.  Sets the main document title
 * and displays whatever child components also need to be displayed.
 *
 * Note that this is just a function because AppView has no internal state -
 * it is merely a function of props (its children), so we can declare
 * it as a function instead of a class.
 * ----------------------------
 */

import React from "react";
import DocumentTitle from "react-document-title";
import Config from "../config";

export default ({ children }) => {
	return (
		<DocumentTitle title={Config.APP_NAME}>
			<div>{children}</div>
		</DocumentTitle>
	) 
}