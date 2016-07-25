import React, { Component } from "react";
import DocumentTitle from "react-document-title";
import EditionsList from "./EditionsList";
import EditionDetailView from "./EditionDetailView";
import Config from "../config";
import "../stylesheets/Editions.css";

export default class Editions extends Component {
  	render() {
    	return (
    		<DocumentTitle title={Config.APP_NAME + " | Editions"}>
    			<div>
    				<div className="page-header">
    					<div className="btn-toolbar pull-right">
    						<div className="btn-group">
    							<button type="button" id="newEditionButton" className="btn btn-primary">Create New</button>
    						</div>
    					</div>
    					<h2>Editions</h2>
    				</div>

    				<div className="row">
    					<div className="col-xs-3">
    						<EditionsList />
    					</div>
    					<div className="col-xs-9">
    						<EditionDetailView />
    					</div>
  					</div>
    			</div>
    		</DocumentTitle>
    	)
  	}
}