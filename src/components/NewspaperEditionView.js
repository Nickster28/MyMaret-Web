import React, { Component, PropTypes } from "react";
import ModalView from "./ModalView";
import "../stylesheets/NewspaperEditionView.css";

class NewspaperEditionView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowingDeletePrompt: false,
            isDeletingEdition: false,
            deleteError: null
        };

        this.cancelDeleteEdition = this.cancelDeleteEdition.bind(this);
        this.deleteEdition = this.deleteEdition.bind(this);
    }

    // If the user cancels the delete, update our state
    cancelDeleteEdition() {
        this.setState({isShowingDeletePrompt: false});
    }

    // If the user confirms the deletion, call our delete handler
    deleteEdition() {
        this.cancelDeleteEdition();
        this.setState({isDeletingEdition: true});
        var savedThis = this;
        this.props.onDeleteEdition(this.props.edition).then(() => {
            savedThis.setState({isDeletingEdition: false});
            savedThis.props.selectNewestEdition();
        }, error => {
            savedThis.setState({isDeletingEdition: false, deleteError: error});
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
                        <span className="glyphicon glyphicon-plus">
                        </span>
                        <span className="hidden-xs">
                            Add Section
                        </span>
                    </button>
                    <button type="button" id="publishEditionButton"
                        className={buttonClassNames}>
                        <span className="glyphicon glyphicon-send">
                        </span>
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
                        disabled={this.state.isDeletingEdition ? "disabled": ""}
                        onClick={() => {
                            this.setState({isShowingDeletePrompt: true});
                        }}>
                        <span className="glyphicon glyphicon-trash">
                        </span>
                        {this.state.isDeletingEdition ? "Deleting..." :
                            <span className="hidden-xs">Delete</span>
                        }
                    </button>
                </div>
            </h3>
        )
    }

    /*
     * Returns the modal to display if we should display it (if we are currently
     * prompting the user about deleting)
     */
    deleteEditionModal() {
        if (this.state.isShowingDeletePrompt) {
            return (
                <ModalView title="Confirm Deletion" small cancelable
                    onCancel={this.cancelDeleteEdition}
                    onPrimaryClick={this.deleteEdition}
                    primaryButtonText="Delete">
                    Are you sure you want to delete this edition?
                </ModalView>
            )
        } else {
            return null;
        }
    }

    // Modal view for displaying error messages (if any).
    errorModal() {
        if (this.state.deleteError) {
            return <ModalView title="Error" primaryButtonText="OK"
                    onPrimaryClick={() => {
                        this.setState({deleteError: null});
                    }} small>
                    {"Could not delete this edition: " +
                        this.state.deleteError.message +
                        "  Please try again or refresh the page."}
                   </ModalView>
        } else {
            return null;
        }
    }

  	render() {
        if (!this.props.edition) return null;
        return (
            <div>
                {/* Modal shown to confirm deletion of the edition */}
                {this.deleteEditionModal()}

                {/* Modal shown when there's a delete error */}
                {this.errorModal()}

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
        )
  	}
}

NewspaperEditionView.propTypes = {
	edition: PropTypes.object,
    onDeleteEdition: PropTypes.func.isRequired
};

export default NewspaperEditionView;