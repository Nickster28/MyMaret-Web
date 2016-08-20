import React, { Component, PropTypes } from "react";
import $ from "jquery";
import "../stylesheets/NewspaperEditionView.css";

let DeleteNewspaperEditionModalId = "confirmEditionDeleteModal";
class NewspaperEditionView extends Component {

    constructor(props) {
        super(props);
        this.onAddSection = this.onAddSection.bind(this);
        this.onTogglePublish = this.onTogglePublish.bind(this);
        this.onDeleteEdition = this.onDeleteEdition.bind(this);
    }

    onAddSection() {

    }

    onTogglePublish() {
        this.props.onChangeEditionPublished(this.props.edition);
    }

    onDeleteEdition() {
        $("#" + DeleteNewspaperEditionModalId).modal("hide");
        this.props.onDeleteEdition(this.props.edition);
    }

    /*
     * The header that displays the edition title and delete, edit, add section,
     * and publish/unpublish buttons.
     */
    editionPanelTitle() {
        var publishButtonText = this.props.edition.get("isPublished") ?
            "Unpublish" : "Publish";
        return (
            <h3 className="panel-title">
                {this.props.edition.get("editionName")}

                <div className="btn-group editionModifyButtonGroup"
                    role="group" aria-label="changeEditionButtons">
                    <button type="button"
                        className="btn btn-default editionModifyToolbarButton"
                        onClick={this.onAddSection}>
                        <span className="glyphicon glyphicon-plus"></span>
                        <span className="hidden-xs">
                            Add Section
                        </span>
                    </button>
                    <button type="button" id="publishEditionButton"
                        className="btn btn-default editionModifyToolbarButton"
                        onClick={this.onTogglePublish}>
                        <span className="glyphicon glyphicon-send"></span>
                        <span className="hidden-xs">
                            {publishButtonText}
                        </span>
                    </button>
                </div>
                <div className="btn-group editionModifyButtonGroup" role="group"
                    aria-label="deleteEditionButton">
                    <button type="button" id="deleteEditionButton"
                        className="btn btn-default editionModifyToolbarButton"
                        data-toggle="modal"
                        data-target={"#" + DeleteNewspaperEditionModalId}>
                        <span className="glyphicon glyphicon-trash"></span>
                        <span className="hidden-xs">
                            Delete
                        </span>
                    </button>
                </div>
            </h3>
        )
    }

  	render() {
        if (!this.props.edition) return null;
        return (
            <div>
                <div className="modal fade" id={DeleteNewspaperEditionModalId}
                    tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-sm" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">
                                    Confirm Deletion
                                </h4>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this edition?
                            </div>
                            <div className="modal-footer">
                                <button type="button"
                                    className="btn btn-default"
                                    data-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="button"
                                    className="btn btn-danger"
                                    onClick={this.onDeleteEdition}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

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
	edition: PropTypes.object
};

export default NewspaperEditionView;