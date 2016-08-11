import React, { Component } from "react";
import DocumentTitle from "react-document-title";
import Config from "../config";

import UnderConstruction from "../images/underconstruction.png";

export default class Analytics extends Component {
  	render() {
    	return (
    		<DocumentTitle title={Config.APP_NAME + " | Analytics"}>
    			<div>
    				<h1>Under Construction</h1>
    				<img src={UnderConstruction} className="img-responsive" />
    			</div>
    		</DocumentTitle>
    	)
  	}
}