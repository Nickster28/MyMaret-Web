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
import ConfirmationModalView from "./ConfirmationModalView";
import Loading from "react-loading-animation";
import Config from "../config";
import "../stylesheets/NewspaperEditionsView.css";


/*
 * STATE
 * -------------
 * hasFetched - whether we have already fetched editions.
 * isCreatingEdition - whether we're in the middle of a server create operation
 * isInvalidEdition - whether the specified edition is invalid, in which case
 *                  we should show an error.
 * isDeletingEdition - whether we're in the middle of a server delete operation
 * -------------
 */
const defaultState = {
    hasFetched: false,
    isCreatingEdition: false,
    isInvalidEdition: false,
    isDeletingEdition: false
};

class NewspaperEditionsView extends Component {

    constructor(props) {
        super(props);
        this.state = defaultState;
        this.props.fetchEditions();
    }

    // Check the latest status of our fetch, and our route pathname
    componentWillReceiveProps(nextProps) {

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
         * or deleting an edition, which can cause new props) or have an invalid
         * edition.
         */
        } else if (didFetch && !nextProps.fetchError &&
            !this.state.isCreatingEdition && !this.state.isDeletingEdition) {

            this.setState({hasFetched: true});

            // If we're at the /editions page with editions, go to the newest
            if (this.isEditionsIndexURL(nextProps.location.pathname) &&
                nextProps.editionInfoNewestToOldest.length > 0) {
                nextProps.selectNewestEdition();

            // If we're viewing an edition, but it doesn't exist, it's invalid
            } else if (this.isEditionDetailViewURL(nextProps.location.pathname)
                && !nextProps.edition) {
                this.setState({isInvalidEdition: true});

            // If we changed to a non-invalid edition...
            } else if (this.state.isInvalidEdition && nextProps.edition) {
                this.setState({isInvalidEdition: false});
            }
        } 
    }

    /*
     * METHOD: editionsToolbarItem
     * ----------------------------
     * Returns: if we haven't fetched, are fetching, or errored, nothing.  If
     * there are >0 editions, the selection view.  Otherwise, a "Create Edition"
     * button.
     */
    editionsToolbarItem() {
        var savedThis = this;
        var selectedEditionIndex = this.props.editionInfoNewestToOldest
            .findIndex((elem, index) => {
            return elem.id === (savedThis.props.edition ?
                savedThis.props.edition.id : null);
        });

        // If we haven't fetched, are fetching, or errored, show nothing
        if (!this.state.hasFetched || this.props.isFetching
            || this.props.fetchError) {
            return null;

        // If there are editions (or the selected on is invalid) show a dropdown
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

    // Returns what's displayed once we're done loading (error or children)
    bodyElement() {
        /*
         * Prioritize fetchError first since if we get a fetch error we will
         * also get an invalid edition error (since a fetch error also fulfills
         * all the requirements of an invalid edition error).
         */
        if (this.props.fetchError) {
            return (
                <div className="alert alert-danger" role="alert">
                    <strong>Fetch error: </strong>
                    {this.props.fetchError.message + "  "}
                    Please try refreshing the page.
                </div>
            );
        } else if (this.state.isInvalidEdition) {
            return (
                <div className="alert alert-warning" role="alert">
                    <strong>Whoops! </strong>
                    We couldn't find that edition.  Please select another one
                    from the dropdown up above.
                </div>
            );
        } else {
            return this.props.children;
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
                    <CreateEditionModalView
                        visible={this.props.createEditionModalViewVisible}
                        onCreateEdition={editionName => {
                            this.setState({isCreatingEdition: true});
                            return this.props.createEdition(editionName);
                        }}
                        onDismiss={this.props.hideCreateEditionModalView}
                        onDismissed={didCreateEdition => {
                            if (didCreateEdition) {
                                this.props.selectNewestEdition();
                            }
                            this.setState({isCreatingEdition: false});
                        }}
                    />

                    {/* Displayed when the user wants to delete an edition */}
                    <ConfirmationModalView title="Confirm Deletion"
                        visible={this.props.deleteEditionModalViewVisible}
                        primaryButtonText="Delete"
                        primaryButtonConfirmingText="Deleting..."
                        onConfirm={() => {
                            this.setState({isDeletingEdition: true});
                            return this.props.deleteEdition(this.props.edition);
                        }}
                        onHide={this.props.hideDeleteEditionModalView}
                        onDismissed={(didConfirm) => {
                            if (didConfirm) {
                                this.props.selectNewestEdition();
                                this.setState({isDeletingEdition: false});
                            }
                        }}>
                        Are you sure you want to delete this edition?  This will
                        also delete all sections and articles in this edition.
                    </ConfirmationModalView>

                    {/* Show our body element once we're done loading */}
    				<Loading isLoading={this.props.isFetching}>
                        {this.bodyElement()}
                    </Loading>
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