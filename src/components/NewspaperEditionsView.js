/*
 * CLASS: NewspaperEditionsView
 * -----------------
 * Component for the editions screen.  Displays a header with either an edition
 * selection view (for either selecting the edition to view or creating a new
 * one) or a "create edition button", and child components (either nothing,
 * or a NewspaperEditionContainerView for the selected edition).  Also in charge
 * of displaying a modal for fetch, create, and invalid ID errors.
 *
 * STATE:
 *      isCreatingEdition - whether we're currently in the process of saving
 *                          a new edition to the server.
 *      isShowingCreateEditionModal - whether the modal for creating a new
 *                          edition is visible.
 *      isFetching - whether we're currently in the process of fetching all
 *                  editions from the server.
 *      hasFetched - whether, on this mount, we have already fetched editions.
 *      fetchError - an error, if any, from the most recent fetch that has not
 *                  been displayed to the user.  (null if there is no error,
 *                  or if there was an error but it was displayed to the user).
 *      createError - an error, if any, from the most recent "CREATE" operation
 *                  that has not been displayed to the user.  (null if there is
 *                  no error, or if there was an error but it was displayed to
 *                  the user).
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
        this.state = {
            isCreatingEdition: false,
            isShowingCreateEditionModal: false,
            isFetching: false,
            hasFetched: false,
            fetchError: null,
            createError: null
        };

        this.handleStartCreatingEdition =
            this.handleStartCreatingEdition.bind(this);
        this.handleFinishCreatingEdition =
            this.handleFinishCreatingEdition.bind(this);
        this.handleCancelCreatingEdition =
            this.handleCancelCreatingEdition.bind(this);
    }

    // Do a fetch on mount
    componentWillMount() {
        this.setState({isFetching: true});

        var savedThis = this;
        this.props.fetchEditions().then(() => {
            savedThis.setState({isFetching: false, hasFetched: true});

            // Navigate to the newest edition if we're at the /editions page
            var pathname = savedThis.props.location.pathname;
            var isEditionsIndexPath = pathname === "/editions" ||
                pathname === "/editions/";
            if (isEditionsIndexPath &&
                savedThis.props.editionInfoNewestToOldest.length > 0) {
                savedThis.props.selectNewestEdition();
            }
        }, error => {
            savedThis.setState({isFetching: false, fetchError: error});
        });
    }

    // Reset our state on unmount
    componentWillUnmount() {
        this.setState({hasFetched: false});
    }

    // Show a modal screen to configure a new edition
    handleStartCreatingEdition() {
        this.setState({isShowingCreateEditionModal: true});
    }

    // Hide the modal screen and create the edition
    handleFinishCreatingEdition(name) {
        this.handleCancelCreatingEdition();

        this.setState({isCreatingEdition: true});
        this.props.onCreateEdition(name).then(() => {
            this.setState({isCreatingEdition: false});
        }, error => {
            this.setState({isCreatingEdition: false, createError: error});
        });
    }

    // Hide the modal screen
    handleCancelCreatingEdition() {
        this.setState({isShowingCreateEditionModal: false});
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
        if (this.state.isFetching || this.state.fetchError ||
            (this.props.selectedEditionId != null &&
                selectedEditionIndex === -1)) {
            return null;

        // If we have valid editions, show a dropdown (disabled while creating)
        } else if (this.props.editionInfoNewestToOldest.length > 0) {
            return (
                <EditionsDropdownView editionInfoNewestToOldest={this.props
                    .editionInfoNewestToOldest}
                    selectedEditionIndex={selectedEditionIndex}
                    onSelectEdition={
                        this.props.selectEditionWithId.bind(null, true)
                    }
                    onCreateEdition={this.handleStartCreatingEdition}
                    dropdownTitle={this.state.isCreatingEdition ?
                        "Creating..." : null}
                    isDisabled={this.state.isCreatingEdition}
                />
            )

        // Otherwise, show the "create edition" button (disabled while creating)
        } else {
            return (
                <button id="createEditionButton" type="button"
                    className="btn btn-primary"
                    disabled={this.state.isCreatingEdition ? "disabled" : ""}
                    onClick={this.handleStartCreatingEdition}>
                        {this.state.isCreatingEdition ? "Creating..." :
                            "Create Edition"}
                </button>
            )
        }
    }

    // Returns true if we're at /editions/edition/:id with an invalid id
    displayingInvalidEditionId() {

        // Whether we're at a /editions/edition/:id URL
        var isViewingEdition = (/\/editions\/edition\/.*/)
        .exec(this.props.location.pathname) != null;

        var doneFetching = !this.state.isFetching && this.state.hasFetched &&
            !this.state.fetchError;

        // Check if the ID the user provided is valid
        var savedThis = this;
        var isValidId = this.props.editionInfoNewestToOldest.find(info => {
                return savedThis.props.params.id === info.id;
            }) !== undefined;

        return isViewingEdition && doneFetching && !isValidId &&
            !this.props.selectedEditionDeleted;
    }

    // Modal view for displaying error messages (if any).
    errorModal() {
        var errorMessage = null;
        var handler = null;
        if (this.state.fetchError) {
            errorMessage = "Could not fetch newspaper editions: " +
                this.state.fetchError.message + "  Please try refreshing.";
            handler = () => { this.setState({fetchError: null}); };
        } else if (this.displayingInvalidEditionId()) {
            errorMessage = "We couldn't find that edition.  We'll redirect " +
            "you to the main editions page instead.";
            handler = this.props.selectNewestEdition;
        } else if (this.state.createError) {
            errorMessage = "Could not create edition: " +
                this.state.createError.message + "  Please try again.";
            handler = () => { this.setState({createError: null}); };
        }

        // If there's an error, show a modal with a handler to clear the error
        if (errorMessage && handler) {
            return <ModalView title="An error occurred" primaryButtonText="OK"
                    onConfirm={handler} small>
                    {errorMessage}
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
        if (this.state.isShowingCreateEditionModal) {
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

                    {/* Displayed when a fetch, create, or id error occurs */}
                    {this.errorModal()}

                    {/* Display the edition's info within a single column */}
    				<div className="row">
    					<div className="col-xs-12">
                            <Loading isLoading={this.state.isFetching ||
                                (this.state.fetchError ? true : false)}>
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
 * selectedEditionId - id of selected edition.  Used to update render.
 * selectedEditionDeleted - true/false whether the currently-selected edition
 *          was deleted. Used to make sure we don't display an error about an
 *          unknown edition when an edition is actually just being deleted.
 * onCreateEdition - a function handler for creating a new edition.  Takes the
 *                  name of the edition to create as a parameter.
 * selectEditionWithId - a function handler for when an edition is selected to
 *                  view.  Should take the objectId of the edition to select,
 *                  and whether or not we should also redirect to its url.
 * selectNewestEdition - same as selectEditionWithId, but pre-populates with the
 *                      id of the newest edition.
 * fetchEditions - a function that triggers a fetch of all NewspaperEditions.
 * ------------
 */
NewspaperEditionsView.propTypes = {
    editionInfoNewestToOldest: PropTypes.arrayOf(React.PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        isPublished: PropTypes.bool.isRequired
    }).isRequired).isRequired,
    selectedEditionId: PropTypes.string,
    selectedEditionDeleted: PropTypes.bool.isRequired,
    onCreateEdition: PropTypes.func.isRequired,
    selectEditionWithId: PropTypes.func.isRequired,
    selectNewestEdition: PropTypes.func.isRequired,
    fetchEditions: PropTypes.func.isRequired,
}

export default NewspaperEditionsView;