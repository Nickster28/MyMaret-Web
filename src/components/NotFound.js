/* FUNCTION: NotFound
 * ----------------------------
 * A simple "404 - Not Found" component to display for invalid pages.
 *
 * Note that this is just a function because NotFound has no
 * internal state - its HTML is always the same regardless of props or state.
 * Therefore we can simply declare it as a function that returns static HTML.
 * ----------------------------
 */

import React from "react";
import DocumentTitle from "react-document-title";
import Config from "../config";

export default () => {
  	return (
    	<DocumentTitle title={Config.APP_NAME + " | Not Found"}>
    		<div>
    	  		<h1>404 Not Found</h1>
    		</div>
    	</DocumentTitle>
  	)
}