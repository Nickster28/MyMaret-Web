/*
 * CLASS: NewspaperEditionView
 * -----------------
 * Component for the edition screen.  Displays information about a single
 * edition, and allows for modification of it, including adding sections,
 * publishing/unpublishing the edition, and deleting the edition.  Shows a modal
 * to confirm and handle the deleting of an edition.
 * -----------------
 */

import React, { Component, PropTypes } from "react";
import ModalView from "./ModalView";
import Visibility from "./Visibility";
import "../stylesheets/NewspaperEditionView.css";

/*
 * STATE
 * --------------
 * isDeletingEdition - whether we're currently deleting an edition on the server
 * deleteEditionError - an error (if any) from the most recent delete attempt
 * didDeleteEdition - whether or not the user confirmed the edition deletion
 * --------------
 */
const defaultProps = {
    isDeletingEdition: false,
    deleteEditionError: null,
    didDeleteEdition: false
}

class NewspaperEditionView extends Component {

    constructor(props) {
        super(props);
        this.state = defaultProps;
        this.onDeleteEdition = this.onDeleteEdition.bind(this);
    }

    // If the user confirms the deletion, call our delete handler
    onDeleteEdition() {
        this.setState({isDeletingEdition: true, deleteEditionError: null});

        var savedThis = this;
        this.props.deleteEdition(this.props.edition).then(() => {
            savedThis.setState({
                isDeletingEdition: false,
                deleteEditionError: null,
                didDeleteEdition: true
            });
            savedThis.props.hideDeleteEditionModalView();
        }, error => {
            savedThis.setState({
                isDeletingEdition: false,
                deleteEditionError: error
            });
        });
    }

    /*
     * The header that displays the edition title and delete, edit, add section,
     * and publish/unpublish buttons.
     */
    editionPanelTitle() {
        var isPublished = this.props.edition.get("isPublished");
        var buttonClassNames = "btn btn-default editionModifyToolbarButton";

        return (
            <h3 className="panel-title">
                {this.props.edition.get("editionName")}

                <div className="btn-group editionModifyButtonGroup"
                    role="group" aria-label="changeEditionButtons">
                    <button type="button"
                        className={buttonClassNames}>
                        <span className="glyphicon glyphicon-plus"></span>
                        <span className="hidden-xs">Add Section</span>
                    </button>
                    <button type="button" id="publishEditionButton"
                        className={buttonClassNames}>
                        <span className="glyphicon glyphicon-send"></span>
                        <span className="hidden-xs">
                            {isPublished ? "Unpublish" : "Publish"}
                        </span>
                    </button>
                </div>
                <div className="btn-group editionModifyButtonGroup"
                    role="group"
                    aria-label="deleteEditionButton">
                    <button type="button" id="deleteEditionButton"
                        className={buttonClassNames}
                        onClick={this.props.showDeleteEditionModalView}>
                        <span className="glyphicon glyphicon-trash"></span>
                        <span className="hidden-xs">Delete</span>
                    </button>
                </div>
            </h3>
        )
    }

    // Returns the modal displayed to confirm edition deletion
    deleteModalView() {
        return (
            <ModalView title="Confirm Deletion" small cancelable
                visible={this.props.deleteEditionModalViewVisible}
                onConfirm={this.onDeleteEdition}
                onCancel={this.props.hideDeleteEditionModalView}
                onDismissed={() => {
                    this.setState({deleteEditionError: null});

                    if (this.state.didDeleteEdition) {
                        this.props.selectNewestEdition();
                    }
                }}
                primaryButtonText={this.state.isDeletingEdition ?
                    "Deleting...": "Delete"}
                primaryButtonDisabled={this.state.isDeletingEdition}>
                Are you sure you want to delete this edition?

                {/* Error message, if any */}
                <Visibility
                    visible={this.state.deleteEditionError ? true : false}>
                    <p id="deleteEditionError" className="text-danger">
                        Error:
                        {" " + (this.state.deleteEditionError ?
                            this.state.deleteEditionError.message : "") + "  "}
                        Please try again.
                    </p>
                </Visibility>
            </ModalView>
        )
    }

  	render() {
        return (
            <div>
                {/* Modal shown to confirm deletion of the edition.  Always
                    visible, even if there's no edition, since the edition may
                    be deleted out from under it and we need it to stay visible.
                    */}
                {this.deleteModalView()}

                {(() => {
                    if (!this.props.edition) return null;
                    return (
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                {this.editionPanelTitle()}
                            </div>
                            <div className="panel-body">
                                <div className="row">

                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        );
  	}
}

/*
 * PROPTYPES
 * --------------
 * edition - the edition object to display info about (could be none if
 *              the specified edition ID is invalid)
 * deleteEditionModalViewVisible - whether the delete modal is visible
 * deleteEdition - a function that deletes the given edition from the server
 * selectNewestEdition - a function that routes to the newest edition
 * showDeleteEditionModalView - a function that makes the delete modal visible
 * hideDeleteEditionModalView - a function that makes the delete modal hidden
 * --------------
 */
NewspaperEditionView.propTypes = {
	edition: PropTypes.object,
    deleteEditionModalViewVisible: PropTypes.bool.isRequired,
    deleteEdition: PropTypes.func.isRequired,
    selectNewestEdition: PropTypes.func.isRequired,
    showDeleteEditionModalView: PropTypes.func.isRequired,
    hideDeleteEditionModalView: PropTypes.func.isRequired
};

export default NewspaperEditionView;