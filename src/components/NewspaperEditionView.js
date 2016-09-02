/*
 * CLASS: NewspaperEditionView
 * -----------------
 * Component for the edition screen.  Displays information about a single
 * edition, and allows for modification of it, including adding sections,
 * publishing/unpublishing the edition, and deleting the edition.
 * -----------------
 */

import React, { Component, PropTypes } from "react";
import ConfirmationModalView from "./ConfirmationModalView";
import "../stylesheets/NewspaperEditionView.css";

class NewspaperEditionView extends Component {

    /*
     * The header that displays the edition title and delete, add section,
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
                        className={buttonClassNames}
                        onClick={this.props
                            .showToggleEditionPublishedModalView}>
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
        );
    }

    // Returns the modal displayed to publish/unpublish an edition
    toggleEditionPublishedModalView() {
        var modalTitle = "Confirm " +
            (this.props.edition.get("isPublished") ? "Unpublish" : "Publish");
        var confirmButtonTitle = this.props.edition.get("isPublished") ?
            "Unpublish" : "Publish";

        return (
            <ConfirmationModalView title={modalTitle}
                primaryButtonText={confirmButtonTitle}
                primaryButtonConfirmingText={confirmButtonTitle + "ing..."}
                visible={this.props.toggleEditionPublishedModalViewVisible}
                onConfirm={() => {
                    return this.props.toggleEditionPublished(this.props
                        .edition);
                }}
                onHide={this.props.hideToggleEditionPublishedModalView}>

                Are you sure you want to
                {" " + confirmButtonTitle.toLowerCase() + " "}
                this edition?
            </ConfirmationModalView>
        );
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
                        <div>
                            {this.toggleEditionPublishedModalView()}

                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    {this.editionPanelTitle()}
                                </div>
                                <div className="panel-body">
                                    <div className="row">

                                    </div>
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
 * toggleEditionPublished - a function that returns a promise that toggles the
 *                          published status of the given edition
 * showToggleEditionPublishedModalView - a function that makes the publish/
 *                                  unpublish modal visible.
 * hideToggleEditionPublishedModalView - a function that makes the publish/
 *                                  unpublish modal hidden.
 * --------------
 */
NewspaperEditionView.propTypes = {
	edition: PropTypes.object,
    deleteEditionModalViewVisible: PropTypes.bool.isRequired,
    deleteEdition: PropTypes.func.isRequired,
    selectNewestEdition: PropTypes.func.isRequired,
    showDeleteEditionModalView: PropTypes.func.isRequired,
    hideDeleteEditionModalView: PropTypes.func.isRequired,
    toggleEditionPublished: PropTypes.func.isRequired,
    showToggleEditionPublishedModalView: PropTypes.func.isRequired,
    hideToggleEditionPublishedModalView: PropTypes.func.isRequired
};

export default NewspaperEditionView;