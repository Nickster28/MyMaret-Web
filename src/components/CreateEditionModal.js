import React, { Component } from "react";
import "../stylesheets/CreateEditionModal.css";

class CreateEditionModal extends Component {

    render() {
        return (
            <div id={this.props.id} className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">Create Edition</h4>
                        </div>
                        <div className="modal-body">
                            <p>One fine body&hellip;</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                            <button id="createEditionConfirmButton" type="button" className="btn btn-primary">Create</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateEditionModal;