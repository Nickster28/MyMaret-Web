import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import Config from "../config";

export default class Editions extends Component {
  	render() {
    	return (
    		<DocumentTitle title={Config.APP_NAME + " | Editions"}>
    			<div>Editions</div>
    		</DocumentTitle>
    	)
  	}
}