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

    /*
     * METHOD: editionsToolbarItem
     * ----------------------------
     * Returns: if we are fetching or errored, nothing.  If there are >0
     * editions, the selection view.  Otherwise, a "Create Edition" button.
     */
    editionsToolbarItem() {
        var savedThis = this;
        var selectedEditionIndex = this.props.editionInfoNewestToOldest
            .findIndex((elem, index) => {
            return elem.id === savedThis.props.selectedEditionId;
        });

        // If we're fetching, errored, or have an invalid selected ID...
        if (this.props.isFetching || this.props.latestFetchError ||
            (this.props.selectedEditionId != null &&
                selectedEditionIndex === -1)) {
            return null;

        // If we have valid editions, show a dropdown
        } else if (this.props.editionInfoNewestToOldest.length > 0) {
            return (
                <EditionsDropdownView editionInfoNewestToOldest={this.props
                    .editionInfoNewestToOldest}
                    selectedEditionIndex={selectedEditionIndex}
                    onSelectEdition={
                        this.props.selectEditionWithId.bind(null, true)
                    }
                    onCreateEdition={this.handleStartCreatingEdition}
                />
            )

        // Otherwise, show the "create edition" button
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
        if (isViewingEdition && !isValidId && !this.props.deleted) {
            return <ModalView title="Whoops!" primaryButtonText="OK"
                    onPrimaryClick={this.props.selectNewestEdition} small>
                        {"We couldn't find that edition.  " +
                        "We'll redirect you to the main page instead."}
                   </ModalView>
        } else {
            return null;
        }
    }

    // Modal view for displaying error messages (if any).
    errorModal() {
        var errorMessage = null;
        var handler = null;
        if (this.props.latestFetchError) {
            errorMessage = "Could not fetch newspaper editions: " +
                this.props.latestFetchError.message;
            handler = this.props.clearFetchedEditionsError;
        } else if (this.props.latestCreateError) {
            errorMessage = "Could not create edition: " +
                this.props.latestCreateError.message;
            handler = this.props.clearCreatedEditionError;
        }

        if (errorMessage && handler) {
            return <ModalView title="Error" primaryButtonText="OK"
                    onPrimaryClick={handler} small>
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
 * editionInfoNewestToOldest - an array of edition info objects, sorted from
 *                          newest to oldest.  Each object should contain that
 *                          edition's name, id, and whether it's published.
 *                          Used primarily to configure the dropdown.
 * isFetching - true/false whether we're in a fetch.  Used to update render.
 * selectedEditionId - id of selected edition.  Used to update render.
 * hasFetched - true/false whether we have fetched.  Used to update render.
 * deleted - true/false whether the currently-selected edition has been deleted.
 *          used to make sure we don't display an error about an unknown edition
 *          when an edition is actually just being deleted.
 * latestFetchError - most recent fetch error, if any.  Displayed in dropdown.
 * latestCreateError - most recent create error, if any.  Displayed in dropdown.
 * onCreateEdition - a function handler for creating a new edition.  Takes the
 *                  name of the edition to create as a parameter.
 * selectEditionWithId - a function handler for when an edition is selected to
 *                  view.  Should take the objectId of the edition to select,
 *                  and whether or not we should also redirect to its url.
 * selectNewestEdition - same as selectEditionWithId, but pre-populates with the
 *                      id of the newest edition.
 * fetchEditions - a function that triggers a fetch of all NewspaperEditions.
 * clearFetchedEditionsError - dispatch function that clears the fetch error.
 * clearCreatedEditionsError - dispatch function that clears the create error.
 * ------------
 */
NewspaperEditionsView.propTypes = {
    editionInfoNewestToOldest: PropTypes.arrayOf(React.PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        isPublished: PropTypes.bool.isRequired
    }).isRequired).isRequired,
    isFetching: PropTypes.bool.isRequired,
    selectedEditionId: PropTypes.string,
    hasFetched: PropTypes.bool.isRequired,
    deleted: PropTypes.bool.isRequired,
    latestFetchError: PropTypes.object,
    latestCreateError: PropTypes.object,
    onCreateEdition: PropTypes.func.isRequired,
    selectEditionWithId: PropTypes.func.isRequired,
    selectNewestEdition: PropTypes.func.isRequired,
    fetchEditions: PropTypes.func.isRequired,
    clearFetchedEditionsError: PropTypes.func.isRequired,
    clearCreatedEditionError: PropTypes.func.isRequired
}

export default NewspaperEditionsView;