/*
 * CLASS: NewspaperEditionsView
 * -----------------
 * Component for the editions screen.  Displays a header with either an edition
 * selection view (for either selecting the edition to view or creating a new
 * one) or a "create edition button", and child components (either nothing,
 * or a NewspaperEditionContainerView for the selected edition).  Also in charge
 * of displaying a modal when a selected edition is invalid.
 * -----------------
 */

import React, { Component, PropTypes } from "react";
import { isValidNewspaperEditionName } from "../serverAPI";
import DocumentTitle from "react-document-title";
import EditionsDropdownView from "./EditionsDropdownView";
import CreateEditionModalView from "./CreateEditionModalView";
import ModalView from "./ModalView";
import Loading from "react-loading-animation";
import Config from "../config";
import "../stylesheets/NewspaperEditionsView.css";

class NewspaperEditionsView extends Component {

    constructor(props) {
        super(props);
        this.state = {isCreatingEdition: false};

        this.handleStartCreatingEdition =
            this.handleStartCreatingEdition.bind(this);
        this.handleFinishCreatingEdition =
            this.handleFinishCreatingEdition.bind(this);
        this.handleCancelCreatingEdition =
            this.handleCancelCreatingEdition.bind(this);
        this.dismissErrorModal = this.dismissErrorModal.bind(this);
    }

    // Do a fetch on mount
    componentWillMount() {
        this.props.fetchEditions();
    }

    /*
     * Whenever our props update, check the URL and fetch status, and
     * route to the newest edition if we're at /editions, or potentially
     * show a modal if the selected edition is invalid.
     */
    componentWillReceiveProps(nextProps) {
        var newPath = nextProps.location.pathname;
        var isEditionsIndexPath = newPath === "/editions" ||
            newPath === "/editions/";
        /*
         * If these props tell us that we're at /editions, not fetching,
         * and have editions to show, redirect to the newest one.
         */
        if (isEditionsIndexPath && !nextProps.isFetching &&
            !nextProps.latestFetchError &&
            nextProps.editionInfoNewestToOldest.length > 0) {
            nextProps.selectNewestEdition();
        }
    }

    // Show a modal screen to configure a new edition
    handleStartCreatingEdition() {
        this.setState({isCreatingEdition: true});
    }

    // Hide the modal screen and create the edition
    handleFinishCreatingEdition(name) {
        this.handleCancelCreatingEdition();
        this.props.onCreateEdition(name);
    }

    // Hide the modal screen
    handleCancelCreatingEdition() {
        this.setState({isCreatingEdition: false});
    }

    // On dismiss, clear the error so we don't display it again
    dismissErrorModal() {
        if (this.props.latestFetchError) {
            this.props.clearFetchedEditionsError();
        } else if (this.props.latestCreateError) {
            this.props.clearCreatedEditionError();
        }
    }

    /*
     * METHOD: editionsToolbarItem
     * ----------------------------
     * Returns: if we are fetching or errored, nothing.  If there are >0
     * editions, the selection view.  Otherwise, a "Create Edition" button.
     */
    editionsToolbarItem() {
        if (this.props.isFetching || this.props.latestFetchError ||
            this.props.selectedEditionIndex === -1) {
            return null;
        } else if (this.props.editionInfoNewestToOldest.length > 0) {
            return (
                <EditionsDropdownView editionInfoNewestToOldest={this.props
                    .editionInfoNewestToOldest}
                    selectedEditionIndex={this.props.selectedEditionIndex}
                    onSelectEdition={
                        this.props.selectEditionWithId.bind(null, true)
                    }
                    onCreateEdition={this.handleStartCreatingEdition}
                />
            )
        } else {
            return (
                <button id="createEditionButton" type="button"
                    className="btn btn-primary"
                    onClick={this.handleStartCreatingEdition}>
                        Create Edition
                </button>
            )
        }
    }

    /*
     * Returns the modal to display if we should display it (if we're at
     * /editions/edition/:id with an invalid id)
     */
    invalidEditionModal() {
        // Whether we're done fetching and at a /editions/edition/:id URL
        var isViewingEdition = (/\/editions\/edition\/.*/)
        .exec(this.props.location.pathname) != null &&
            !this.props.isFetching && this.props.hasFetched &&
            !this.props.latestFetchError;

        // Check if the ID the user provided is valid
        var savedThis = this;
        var isValidId = this.props.editionInfoNewestToOldest.find(info => {
                return savedThis.props.params.id === info.id;
            }) !== undefined;

        /*
         * If they specified an invalid edition, show an alert modal
         * (note - this modal view appears after mounting)
         */
        if (isViewingEdition && !isValidId) {
            return <ModalView title="Whoops!" primaryButtonText="OK"
                    onPrimaryClick={this.props.selectNewestEdition} small>
                        We couldn't find that edition.  We'll redirect you to
                        the newest edition instead.
                   </ModalView>
        } else {
            return null;
        }
    }

    // Modal view for displaying error messages (if any).
    errorModal() {
        var errorMessage = null;
        if (this.props.latestFetchError) {
            errorMessage = "Could not fetch newspaper editions: " +
                this.props.latestFetchError.message;
        } else if (this.props.latestCreateError) {
            errorMessage = "Could not create edition: " +
                this.props.latestCreateError.message;
        }

        if (errorMessage) {
            return <ModalView title="Error" primaryButtonText="OK"
                    onPrimaryClick={this.dismissErrorModal} small>
                    {errorMessage + "  Please try again or refresh the page."}
                   </ModalView>
        } else {
            return null;
        }
    }

    /* 
     * Returns the modal to display if we should display it (if we are currently
     * creating an edition)
     */
    createEditionModal() {
        if (this.state.isCreatingEdition) {
            return (
                <CreateEditionModalView
                    onCreate={this.handleFinishCreatingEdition}
                    onCancel={this.handleCancelCreatingEdition}
                    onVerify={isValidNewspaperEditionName}/>
            )
        } else {
            return null;
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

                    {/* Modal displayed when the user is creating an edition */}
                    {this.createEditionModal()}

                    {/* Modal displayed when an edition is invalid */}
                    {this.invalidEditionModal()}

                    {/* Modal displayed when a fetch or create error occurs */}
                    {this.errorModal()}

                    {/* Display the edition's info within a single column */}
    				<div className="row">
    					<div className="col-xs-12">
                            <Loading isLoading={this.props.isFetching ||
                                (this.props.latestFetchError ? true : false)}>
                                {this.props.children}
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
 * selectEditionWithId - a function handler for when an edition is selected to
 *                  view.  Should take the objectId of the edition to select,
 *                  and whether or not we should also redirect to its url.
 * selectNewestEdition - same as selectEditionWithId, but pre-populates with the
 *                      id of the newest edition.
 * onCreateEdition - a function handler for creating a new edition.  Takes the
 *                  name of the edition to create as a parameter.
 * fetchEditions - a function that triggers a fetch of all NewspaperEditions.
 * editionInfoNewestToOldest - an array of edition info objects, sorted from
 *                          newest to oldest.  Each object should contain that
 *                          edition's name, id, and whether it's published.
 * selectedEditionIndex - index of selected edition's info in
 *                          editionInfoNewestToOldest
 * ------------
 */
NewspaperEditionsView.propTypes = {
    selectEditionWithId: PropTypes.func.isRequired,
    selectNewestEdition: PropTypes.func.isRequired,
    onCreateEdition: PropTypes.func.isRequired,
    fetchEditions: PropTypes.func.isRequired,
    editionInfoNewestToOldest: PropTypes.arrayOf(React.PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        isPublished: PropTypes.bool.isRequired
    }).isRequired).isRequired,
    selectedEditionIndex: PropTypes.number.isRequired
}

export default NewspaperEditionsView;