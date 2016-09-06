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
import NewspaperSectionView from "./NewspaperSectionView";

import "../stylesheets/NewspaperEditionView.css";

class NewspaperEditionView extends Component {

    /*
     * The header that displays the edition title and delete, add section,
     * and publish/unpublish buttons.
     */
    editionPanelTitle() {
        const isPublished = this.props.edition.get("isPublished");
        const buttonClassNames = "btn btn-default editionModifyToolbarButton";

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

    // Returns the modal displayed to publish/unpublish an edition
    toggleEditionPublishedModalView() {
        const modalTitle = "Confirm " +
            (this.props.edition.get("isPublished") ? "Unpublish" : "Publish");
        const confirmButtonTitle = this.props.edition.get("isPublished") ?
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

    /*
     * Returns a list of elements that display each section in this edition.
     * The elements are styled with the bootstrap grid system, and shows 1
     * section per row in xs, 2 in sm and md, and 3 in lg and above.
     */
    sectionElements() {
        return this.props.edition.get("sections").map((section, i) => {
            return (
                <div key={i} className="col-xs-12 col-sm-6 col-lg-4">
                    <NewspaperSectionView section={section}/>
                </div>
            )
        });
    }

  	render() {
        if (!this.props.edition) {
            return null;
        }

        return (
            <div>
                {this.toggleEditionPublishedModalView()}

                <div className="panel panel-default">
                    <div className="panel-heading">
                        {this.editionPanelTitle()}
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            {this.sectionElements()}
                        </div>
                    </div>
                </div>
            </div>
        );
  	}
}

/*
 * PROPTYPES
 * --------------
 * edition - the edition object to display info about (could be none if
 *              the specified edition ID is invalid)
 * toggleEditionPublishedModalViewVisible - whether the publish/unpublish modal
 *                                          is visible.
 * selectNewestEdition - a function that routes to the newest edition
 * toggleEditionPublished - a function that returns a promise that toggles the
 *                          published status of the given edition
 * showToggleEditionPublishedModalView - a function that makes the publish/
 *                                  unpublish modal visible.
 * hideToggleEditionPublishedModalView - a function that makes the publish/
 *                                  unpublish modal hidden.
 * showDeleteEditionModalView - a function that makes the delete modal visible
 * --------------
 */
NewspaperEditionView.propTypes = {
	edition: PropTypes.object,
    toggleEditionPublishedModalViewVisible: PropTypes.bool.isRequired,
    selectNewestEdition: PropTypes.func.isRequired,
    toggleEditionPublished: PropTypes.func.isRequired,
    showToggleEditionPublishedModalView: PropTypes.func.isRequired,
    hideToggleEditionPublishedModalView: PropTypes.func.isRequired,
    showDeleteEditionModalView: PropTypes.func.isRequired
};

export default NewspaperEditionView;