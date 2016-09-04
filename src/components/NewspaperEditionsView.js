/*
 * CLASS: NewspaperEditionsView
 * -----------------
 * Component for the editions screen.  Displays a header with either an edition
 * selection view (for either selecting the edition to view or creating a new
 * one) or a "create edition button", and child components (either nothing,
 * or a NewspaperEditionContainerView for the selected edition).  Also in charge
 * of displaying a modal for fetch, create, and invalid ID errors.
 * -----------------
 */

import React, { Component, PropTypes } from "react";
import DocumentTitle from "react-document-title";
import EditionsDropdownView from "./EditionsDropdownView";
import CreateEditionModalView from "./CreateEditionModalView";
import ModalView from "./ModalView";
import ConfirmationModalView from "./ConfirmationModalView";
import Loading from "react-loading-animation";
import Config from "../config";
import "../stylesheets/NewspaperEditionsView.css";


/*
 * STATE
 * -------------
 * hasFetched - whether we have already fetched editions.
 * showedInvalidEditionIdModal - whether we have already showed the alert modal
 *                          for an invalid edition Id to the user.  Used to know
 *                          when to not make the modal visible.
 * isCreatingEdition - same as this.props.createEditionModalViewVisible, but
 *                      true through the modal's dismissal handling/animation.
 * -------------
 */
const defaultState = {
    hasFetched: false,
    showedInvalidEditionIdModal: false,
    isCreatingEdition: false
};

class NewspaperEditionsView extends Component {

    constructor(props) {
        super(props);
        this.state = defaultState;
        this.props.fetchEditions();
    }

    // Check the latest status of our fetch, and our route pathname
    componentWillReceiveProps(nextProps) {

        // isCreatingEdition is true whenever the modal is visible
        if (nextProps.createEditionModalViewVisible) {
            this.setState({isCreatingEdition: true});
        }

        var didFetch = (this.props.isFetching && !nextProps.isFetching) ||
            this.state.hasFetched;

        // If we're transitioning from detail to index, then reset
        if (this.isEditionDetailViewURL(this.props.location.pathname) &&
            this.isEditionsIndexURL(nextProps.location.pathname)) {

            this.setState({hasFetched: false});
            nextProps.fetchEditions();
        /*
         * Else, if we're done fetching without an error, check if we need to
         * redirect to the latest edition (only if we're not currently creating
         * an edition, which can cause new props).
         */
        } else if (didFetch && !nextProps.fetchError &&
            !this.state.isCreatingEdition) {

            this.setState({hasFetched: true});

            // If we're at the /editions page with editions, go to the newest
            if (this.isEditionsIndexURL(nextProps.location.pathname) &&
                nextProps.editionInfoNewestToOldest.length > 0) {
                nextProps.selectNewestEdition();
            }
        } 
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
        if (this.props.isFetching || this.props.fetchError ||
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
                    onCreateEdition={this.props.showCreateEditionModalView}
                />
            )

        // Otherwise, show the "create edition" button
        } else {
            return (
                <button id="createEditionButton" type="button"
                    className="btn btn-primary"
                    onClick={this.props.showCreateEditionModalView}>
                        Create Edition
                </button>
            )
        }
    }

    // Returns true if the url is an /editions/edition/:id URL, false otherwise.
    isEditionDetailViewURL(url) {
        var match = url.match(/\/editions\/edition\/.*/);
        return match !== null && match[0] === url;
    }

    // Returns true if the url is /editions or /editions/, false otherwise.
    isEditionsIndexURL(url) {
        var match = url.match(/\/editions\/?/);
        return match !== null && match[0] === url;
    }

    /*
     * Returns true if we're at /editions/edition/:id with an invalid id, and
     * we haven't shown the error modal yet.
     */
    shouldDisplayInvalidEditionIdModal() {
        var doneFetching = !this.props.isFetching && this.state.hasFetched &&
            !this.props.fetchError;

        /*
         * Check if the ID the user provided is valid (which is only true
         * If we're in a consistent state - aka what we're viewing is what is
         * selected.  If that's not the case, we must be in the middle of a
         * delete, and shouldn't show the modal.
         */
        var isValidId = (this.props.edition !== undefined
            || this.props.selectedEditionId === null) &&
            this.props.params.id === this.props.selectedEditionId;

        return this.isEditionDetailViewURL(this.props.location.pathname) &&
            doneFetching && !isValidId &&
            !this.state.showedInvalidEditionIdModal;
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
                    <CreateEditionModalView
                        visible={this.props.createEditionModalViewVisible}
                        onDismiss={this.props.hideCreateEditionModalView}
                        onDismissed={didCreateEdition => {
                            if (didCreateEdition) {
                                this.props.selectNewestEdition();
                            }
                            this.setState({isCreatingEdition: false});
                        }}
                        onCreateEdition={this.props.createEdition}/>

                    {/* Displayed when an id error occurs */}
                    <ModalView title="Whoops!" primaryButtonText="OK" small
                        visible={this.shouldDisplayInvalidEditionIdModal()}
                        onConfirm={this.setState.bind(this, {
                            showedInvalidEditionIdModal: true
                        })}
                        onDismissed={this.props.selectNewestEdition}>

                        We couldn't find that edition.  We'll redirect you to
                        the main editions page instead.
                    </ModalView>

                    {/* Displayed when the user wants to delete an edition */}
                    <ConfirmationModalView title="Confirm Deletion"
                        visible={this.props.deleteEditionModalViewVisible}
                        primaryButtonText="Delete"
                        primaryButtonConfirmingText="Deleting..."
                        onConfirm={() => {
                            return this.props.deleteEdition(this.props.edition);
                        }}
                        onHide={this.props.hideDeleteEditionModalView}
                        onDismissed={(didConfirm) => {
                            if (didConfirm) {
                                this.props.selectNewestEdition();
                            }
                        }}>
                        Are you sure you want to delete this edition?
                    </ConfirmationModalView>

                    {/* Display the edition's info within a single column */}
    				<div className="row">
    					<div className="col-xs-12">
                            <Loading isLoading={this.props.isFetching}>
                                {!this.props.fetchError ? this.props.children :
                                    <div className="alert alert-danger"
                                        role="alert">
                                        <strong>Fetch error: </strong>
                                        {this.props.fetchError.message + "  "}
                                        Please try refreshing the page.
                                    </div>
                                }
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
 * isFetching - whether we are currently fetching editions from the server
 * fetchError - the error, if any, from the most recent fetch
 * createEditionModalViewVisible - whether the modal for creating editions is up
 * selectEditionWithId - a function handler for when an edition is selected to
 *                  view.  Should take the objectId of the edition to select,
 *                  and whether or not we should also redirect to its url.
 * selectNewestEdition - same as selectEditionWithId, but pre-populates with the
 *                      id of the newest edition.
 * fetchEditions - a function that triggers a fetch of all NewspaperEditions.
 * createEdition - a function that takes an edition name to create and returns
 *                  a promise creating that edition object.
 * showCreateEditionModalView - a function that makes the modal visible
 * hideCreateEditionModalView - a function that hides the modal view
 * deleteEditionModalViewVisible - whether the delete modal is visible
 * deleteEdition - a function that deletes the given edition from the server
 * hideDeleteEditionModalView - a function that makes the delete modal hidden
 * edition - the edition object currently selected (or none if there is none)
 * ------------
 */
NewspaperEditionsView.propTypes = {
    editionInfoNewestToOldest: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        isPublished: PropTypes.bool.isRequired
    }).isRequired).isRequired,
    selectedEditionId: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    fetchError: PropTypes.shape({
        message: PropTypes.string.isRequired
    }),
    createEditionModalViewVisible: PropTypes.bool.isRequired,
    selectEditionWithId: PropTypes.func.isRequired,
    selectNewestEdition: PropTypes.func.isRequired,
    fetchEditions: PropTypes.func.isRequired,
    createEdition: PropTypes.func.isRequired,
    showCreateEditionModalView: PropTypes.func.isRequired,
    hideCreateEditionModalView: PropTypes.func.isRequired,
    deleteEditionModalViewVisible: PropTypes.bool.isRequired,
    deleteEdition: PropTypes.func.isRequired,
    hideDeleteEditionModalView: PropTypes.func.isRequired,
    edition: PropTypes.object
}

export default NewspaperEditionsView;