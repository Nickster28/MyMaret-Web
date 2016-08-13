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
import { isValidEditionName } from "../serverAPI";
import DocumentTitle from "react-document-title";
import EditionsDropdown from "./EditionsDropdown";
import CreateEditionModal from "./CreateEditionModal";
import Config from "../config";
import "../stylesheets/Editions.css";

let CreateEditionModalId = "createEditionModal"; // Default id for modal elem
class Editions extends Component {

    constructor(props) {
        super(props);
        this.handleShowCreateEditionModal =
            this.handleShowCreateEditionModal.bind(this);
        this.handleCreateEdition = this.handleCreateEdition.bind(this);
        this.handleVerifyEditionName = this.handleVerifyEditionName.bind(this);
    }

    // Show a modal screen to configure a new edition
    handleShowCreateEditionModal() {
        window.$("#" + CreateEditionModalId).modal();
    }

    // Hide the modal and pass the new edition name on to our props handler
    handleCreateEdition(name) {
        window.$("#" + CreateEditionModalId).modal("hide");
        this.props.onCreateEdition(name);
    }

    // Returns a promise to the modal whether the given edition name is valid
    handleVerifyEditionName(name) {
        return isValidEditionName(name);
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
                <EditionsDropdown editionInfoNewestToOldest={this.props
                    .editionInfoNewestToOldest}
                    selectedEditionIndex={this.props.selectedEditionIndex}
                    onSelectEdition={this.props.onSelectEdition}
                    onCreateEdition={this.handleShowCreateEditionModal}/>
            )
        } else {
            return (
                <button id="createEditionButton" type="button"
                    className="btn btn-primary"
                    onClick={this.handleShowCreateEditionModal}>
                        Create Edition
                </button>
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

                    <CreateEditionModal id={CreateEditionModalId}
                        onCreate={this.handleCreateEdition}
                        onVerify={this.handleVerifyEditionName}/>

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
 * onCreateEdition - a function handler for creating a new edition.  Takes the
 *                  name of the edition to create as a parameter.
 * editionInfoNewestToOldest - an array of edition info objects, sorted from
 *                          newest to oldest.  Each object should contain that
 *                          edition's name, id, and whether it's published.
 * selectedEditionIndex - index of selected edition's info in
 *                          editionInfoNewestToOldest
 * ------------
 */
Editions.propTypes = {
    onSelectEdition: PropTypes.func.isRequired,
    onCreateEdition: PropTypes.func.isRequired,
    editionInfoNewestToOldest: PropTypes.arrayOf(React.PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        isPublished: PropTypes.bool.isRequired
    }).isRequired).isRequired,
    selectedEditionIndex: PropTypes.number.isRequired,
}

export default Editions;