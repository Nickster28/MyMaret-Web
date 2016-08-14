/*
 * CLASS: CreateEditionModal
 * --------------------------
 * Bootstrap modal component for creating a new Edition.  Allows the user to
 * input an edition name, and then create the Edition or cancel.  When the
 * modal has been hidden, clears the input field.  Requires an onCreate
 * handler to be passed to it to use when an edition is created, which takes
 * the edition name as a parameter.  Should also take an onVerify handler that
 * takes an edition name and returns a Promise containing whether or not the
 * name is valid.  Also requires an id to put on the modal div.  Disables the
 * "Create" button if the entered name is invalid or if we're validating.
 * --------------------------
 */
import React, { Component, PropTypes } from "react";
import $ from "jquery";
import "../stylesheets/CreateEditionModal.css";

const defaultState = {
    editionName: "",                // Currently entered edition name
    nameIsValid: false,             // whether or not the name is valid
    isValidating: false,            // whether we're in the middle of validating
    hasEnteredName: false,          // whether the user has typed yet
    validityCheckTimerId: null      // Last timer for validation check
}

class CreateEditionModal extends Component {

    constructor(props) {
        super(props);
        this.handleCreateEdition = this.handleCreateEdition.bind(this);
        this.handleEditionNameChange = this.handleEditionNameChange.bind(this);
        this.state = defaultState;
    }

    // Once we load, make sure to add a listener to clear our state on dismiss
    componentDidMount() {
        var savedThis = this;
        $("#" + this.props.id).on("hidden.bs.modal", function (e) {
            savedThis.setState(defaultState);
        });
    }

    /*
     * Triggered whenever the user alters the typed in name.  Validate the name
     * and update state.
     */
    handleEditionNameChange(e) {
        if (this.state.validityCheckTimerId) {
            clearTimeout(this.state.validityCheckTimerId);
        }

        var enteredName = e.target.value;
        var savedThis = this;
        var timerId = setTimeout(() => {
            savedThis.setState({validityCheckTimerId: null});
            savedThis.props.onVerify(enteredName).then(nameIsValid => {
                savedThis.setState({nameIsValid, isValidating: false});
            }, error => {
                console.error("Can't validate name: " + JSON.stringify(error));
                savedThis.setState({nameIsValid: false, isValidating: false});
            });
        }, 500);

        this.setState({
            editionName: enteredName,
            isValidating: true,
            hasEnteredName: true,
            validityCheckTimerId: timerId
        });
    }

    /*
     * Triggered when the user clicks "Create".  Pass along the entered name.
     * Note that this can only be triggered when a valid edition name is
     * entered since the "Create" button is disabled when a name is invalid.
     */
    handleCreateEdition() {
        this.props.onCreate(this.state.editionName);
    }

    /*
     * Return the modal body, which is a form with one input field.  Also,
     * depending on the validity check result, render a glyphicon with feedback
     * on whether the entered name is valid or invalid.
     */
    bodyForm() {
        var classNames = "form-group";
        var ariaDescribedBy = "";
        var feedbackElem = "";
        if (!this.state.isValidating && this.state.hasEnteredName) {
            var isValid = this.state.nameIsValid;

            classNames += " has-feedback " +
                (isValid ? "has-success" : "has-error");
            ariaDescribedBy = "editionNameValidity";

            // The glyphicon for feedback, and a screenreader span describing it
            var feedbackGlyphiconClassName = "glyphicon form-control-feedback "
                + (isValid ? "glyphicon-ok" : "glyphicon-remove");
            feedbackElem = [
                <span key="0" className={feedbackGlyphiconClassName}
                    aria-hidden="true"></span>,
                <span key="1" id={ariaDescribedBy} className="sr-only">
                    {isValid ? "(valid)" : "(invalid)"}</span>
            ];
        }

        return (
            <form>
                <div className={classNames}>
                    <label htmlFor="newEditionName"
                        className="control-label">
                        Edition Name (must be unique):
                    </label>
                    <input type="text" className="form-control"
                        value={this.state.editionName}
                        onChange={this.handleEditionNameChange}
                        aria-describedby={ariaDescribedBy}>
                    </input>
                    {feedbackElem}
                </div>
            </form>
        )
    }

    // Render a Bootstrap modal with an input field for edition name.
    render() {
        var canCreateEdition = this.state.nameIsValid &&
            !this.state.isValidating;

        return (
            <div id={this.props.id} className="modal fade" tabIndex="-1"
                role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close"
                            data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">Create Edition</h4>
                        </div>
                        <div className="modal-body">
                            {this.bodyForm()}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default"
                                data-dismiss="modal">Cancel
                            </button>
                            <button id="createEditionConfirmButton"
                            onClick={this.handleCreateEdition} type="button"
                            className="btn btn-primary"
                            disabled={canCreateEdition ? "" : "disabled"}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

/*
 * PROPTYPES
 * -------------
 * onCreate - a required function that is called when a new edition is created.
 *          should take the name of the new edition as a parameter.
 * id - the id to put on our containing div.
 * onVerify - function that returns a promise passing back whether a given
 *             edition name is valid or invalid.
 * -------------
 */
CreateEditionModal.propTypes = {
    onCreate: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    onVerify: PropTypes.func.isRequired
}

export default CreateEditionModal;