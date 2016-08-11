/*
 * CLASS: Editions
 * -----------------
 * Component for the editions screen.  Displays a header with either an edition
 * selection view (for either selecting the edition to view or creating a new
 * one) or a "create edition button", and child components (either nothing,
 * or an Edition view for the selected edition).
 * -----------------
 */

import React, { Component, PropTypes } from "react";
import DocumentTitle from "react-document-title";
import EditionsDropdown from "./EditionsDropdown";
import Config from "../config";
import "../stylesheets/Editions.css";

class Editions extends Component {

    constructor(props) {
        super(props);
        this.handleCreateEdition = this.handleCreateEdition.bind(this);
    }

    // Show a modal screen to configure a new edition
    handleCreateEdition() {
        // TODO
        this.props.onCreateEdition();
    }

    /*
     * METHOD: editionsToolbarItem
     * ----------------------------
     * Returns: if there are >0 editions, the selection view.  Otherwise, a
     * "Create Edition" button.
     */
    editionsToolbarItem() {
        if (this.props.editionInfoNewestToOldest.length > 0) {
            return (
                <EditionsDropdown editionInfoNewestToOldest={this.props.editionInfoNewestToOldest}
                    onSelectEdition={this.props.onSelectEdition} onCreateEdition={this.handleCreateEdition}/>
            )
        } else {
            return (
                <button id="createEditionButton" type="button" className="btn btn-primary"
                    onClick={this.handleCreateEdition}>Create Edition</button>
            )
        }
    }

  	render() {
    	return (
    		<DocumentTitle title={Config.APP_NAME + " | Editions"}>
    			<div>
    				<div className="page-header">
    					<div className="btn-toolbar pull-right">
    						<div className="btn-group">
    							{this.editionsToolbarItem()}
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

/* 
 * PROPTYPES
 * ------------
 * onSelectEdition - a function handler for when an edition is selected to
 *                  view.  Should take the objectId of the edition to select.
 * onCreateEdition - a function handler for creating a new edition.  TODO
 * editionInfoNewestToOldest - an array of edition info objects, sorted from
 *                          newest to oldest.  Each object should contain that
 *                          edition's title and id.
 * ------------
 */
Editions.propTypes = {
    onSelectEdition: PropTypes.func.isRequired,
    onCreateEdition: PropTypes.func.isRequired,
    editionInfoNewestToOldest: PropTypes.arrayOf(React.PropTypes.shape({
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired
    }).isRequired).isRequired
}

export default Editions;