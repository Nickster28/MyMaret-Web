import React, { Component } from "react";
import DocumentTitle from "react-document-title";
import Config from "../config";

export default class Analytics extends Component {
  	render() {
    	return (
    		<DocumentTitle title={Config.APP_NAME + " | Analytics"}>
    			<div>Analytics</div>
    		</DocumentTitle>
    	)
  	}
}