import React, { Component } from "react";
import DocumentTitle from "react-document-title";
import EditionsDropdown from "./EditionsDropdown";
import Config from "../config";
import "../stylesheets/Editions.css";

export default class Editions extends Component {

	createEdition() {
		alert("New edition!");
	}

    // TODO: separate pulldown into own component, based on router state?
  	render() {
    	return (
    		<DocumentTitle title={Config.APP_NAME + " | Editions"}>
    			<div>
    				<div className="page-header">
    					<div className="btn-toolbar pull-right">
    						<div className="btn-group">
    							<EditionsDropdown handleCreate={this.createEdition.bind(this)}/>
    						</div>
    					</div>
    					<h2>Editions</h2>
    				</div>

    				<div className="row">
    					<div className="col-xs-12">
    						{this.props.children}
    					</div>
    				</div>
    			</div>
    		</DocumentTitle>
    	)
  	}
}