/*
 * CLASS: NewspaperEditionsView
 * -----------------
 * Component for the editions screen.  Displays a header with either an edition
 * selection view (for either selecting the edition to view or creating a new
 * one) or a "create edition button", and child components (either nothing,
 * or a NewspaperEditionContainer view for the selected edition).
 * -----------------
 */

 // TODO: put fetching call in here instead of router to show loading to user

import React, { Component, PropTypes } from "react";
import { isValidNewspaperEditionName } from "../serverAPI";
import DocumentTitle from "react-document-title";
import EditionsDropdownView from "./EditionsDropdownView";
import CreateEditionModalView from "./CreateEditionModalView";
import NewspaperEditionContainerView
    from "../containers/NewspaperEditionContainerView";
import Loading from "react-loading-animation";
import Config from "../config";
import $ from "jquery";
import "../stylesheets/NewspaperEditionsView.css";

let CreateEditionModalViewId = "createEditionModal"; // id for "create" modal
let InvalidEditionModalViewId = "invalidEditionModal"; // id for "invalid" modal
class NewspaperEditionsView extends Component {

    constructor(props) {
        super(props);
        this.handleShowCreateEditionModalView =
            this.handleShowCreateEditionModalView.bind(this);
        this.handleCreateEdition = this.handleCreateEdition.bind(this);
        this.handleVerifyEditionName = this.handleVerifyEditionName.bind(this);
        this.hideInvalidEditionModalView =
            this.hideInvalidEditionModalView.bind(this);
    }

    componentDidMount() {
        this.props.fetchEditions();
    }

    // TODO: handle invalid edition ID
    componentWillReceiveProps(nextProps) {
        var newPath = nextProps.location.pathname;
        /*
         * If these props tell us that we're at /editions, not fetching,
         * and have editions to show, redirect to the newest one.
         */
        if (newPath === "/editions" && !nextProps.isFetching &&
            nextProps.editionInfoNewestToOldest.length > 0) {

            var redirectEditionId = nextProps.editionInfoNewestToOldest[0].id;
            nextProps.selectEditionWithId(true, redirectEditionId);

        /*
         * Otherwise, if we're going to /editions/edition/:id and we're not
         * fetching, trigger a "select edition" action to make sure our state
         * is up to date with where we are.
         */
        } else if ((/\/editions\/edition\/.*/).exec(newPath) != null &&
            !nextProps.isFetching) {

            var isValidId = nextProps.editionInfoNewestToOldest.find(info => {
                return nextProps.params.id === info.id;
            }) !== undefined;

            if (isValidId) {
                nextProps.selectEditionWithId(false, nextProps.params.id);
            } else {
                $("#" + InvalidEditionModalViewId).modal({keyboard: false});
            }
        }
    }

    // Show a modal screen to configure a new edition
    handleShowCreateEditionModalView() {
        $("#" + CreateEditionModalViewId).modal();
    }

    hideInvalidEditionModalView() {
        $("#" + InvalidEditionModalViewId).modal("hide");
        var redirectEditionId = this.props.editionInfoNewestToOldest[0].id;
        this.props.selectEditionWithId(true, redirectEditionId);
    }

    // Hide the modal and pass the new edition name on to our props handler
    handleCreateEdition(name) {
        $("#" + CreateEditionModalViewId).modal("hide");
        this.props.onCreateEdition(name);
    }

    // Returns a promise to the modal whether the given edition name is valid
    handleVerifyEditionName(name) {
        return isValidNewspaperEditionName(name);
    }

    /*
     * METHOD: editionsToolbarItem
     * ----------------------------
     * Returns: if we are fetching, nothing.  If there are >0 editions, the
     * selection view.  Otherwise, a "Create Edition" button.
     */
    editionsToolbarItem() {
        if (this.props.isFetching || this.props.selectedEditionIndex === -1) {
            return "";
        } else if (this.props.editionInfoNewestToOldest.length > 0) {
            return (
                <EditionsDropdownView editionInfoNewestToOldest={this.props
                    .editionInfoNewestToOldest}
                    selectedEditionIndex={this.props.selectedEditionIndex}
                    onSelectEdition={
                        this.props.selectEditionWithId.bind(null, true)
                    }
                    onCreateEdition={this.handleShowCreateEditionModalView}
                />
            )
        } else {
            return (
                <button id="createEditionButton" type="button"
                    className="btn btn-primary"
                    onClick={this.handleShowCreateEditionModalView}>
                        Create Edition
                </button>
            )
        }
    }

    bodyView() {
        var editionToShow = this.props
            .editionInfoNewestToOldest[this.props.selectedEditionIndex];
        if (editionToShow) {
            return (
                <NewspaperEditionContainerView edition={editionToShow} />
            )
        } else return "";
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

                    <CreateEditionModalView id={CreateEditionModalViewId}
                        onCreate={this.handleCreateEdition}
                        onVerify={this.handleVerifyEditionName}/>

                    {/* Modal displayed when we get an invalid edition id */}
                    <div className="modal fade" id={InvalidEditionModalViewId}
                        tabIndex="-1" role="dialog"
                        aria-labelledby="invalid edition">
                        <div className="modal-dialog modal-sm" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title">Whoops!</h4>
                                </div>
                                <div className="modal-body">
                                    We couldn't find that edition.  We'll
                                    redirect you to the newest edition instead.
                                </div>
                                <div className="modal-footer">
                                    <button type="button"
                                    className="btn btn-default"
                                    onClick={this.hideInvalidEditionModalView}
                                    data-dismiss="modal">Ok</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Display the edition's info within a single column */}
    				<div className="row">
    					<div className="col-xs-12">
                            <Loading isLoading={this.props.isFetching}>
                                {this.bodyView()}
                            </Loading>
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
NewspaperEditionsView.propTypes = {
    onCreateEdition: PropTypes.func.isRequired,
    selectEditionWithId: PropTypes.func.isRequired,
    editionInfoNewestToOldest: PropTypes.arrayOf(React.PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        isPublished: PropTypes.bool.isRequired
    }).isRequired).isRequired,
    selectedEditionIndex: PropTypes.number.isRequired,
}

export default NewspaperEditionsView;