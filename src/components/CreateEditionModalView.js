/*
 * CLASS: CreateEditionModalView
 * --------------------------
 * Bootstrap modal component for creating a new NewspaperEdition.  Allows the
 * user to input an edition name, and then create the Edition or cancel.  When
 * the modal has been hidden, clears the input field.  Requires an onCreate
 * handler to be passed to it to use when an edition is created, which takes
 * the edition name as a parameter.  Should also take an onVerify handler that
 * takes an edition name and returns a Promise containing whether or not the
 * name is valid.  Also requires an id to put on the modal div.  Disables the
 * "Create" button if the entered name is invalid or if we're validating.
 * --------------------------
 */
 // TODO: handle enter press?
import React, { Component, PropTypes } from "react";
import ModalView from "./ModalView";

const defaultState = {
    editionName: "",                // Currently entered edition name
    nameIsValid: false,             // whether or not the name is valid
    isValidating: false,            // whether we're in the middle of validating
    validityCheckTimerId: null,     // Last timer for validation check,
    validationError: null           // Error from validation, if any
}

class CreateEditionModalView extends Component {

    constructor(props) {
        super(props);
        this.handleCreateEdition = this.handleCreateEdition.bind(this);
        this.handleEditionNameChange = this.handleEditionNameChange.bind(this);
        this.handleCancelCreateEdition =
            this.handleCancelCreateEdition.bind(this);
        this.state = defaultState;
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
                savedThis.setState({
                    nameIsValid,
                    isValidating: false,
                    validationError: null
                });
            }, error => {
                savedThis.setState({
                    nameIsValid: false,
                    isValidating: false,
                    validationError: error
                });
            });
        }, 500);

        this.setState({
            editionName: enteredName,
            isValidating: true,
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
        this.setState(defaultState);
    }

    // When the user cancels, clear our state and call our cancel handler
    handleCancelCreateEdition() {
        this.setState(defaultState);
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    // Returns the text to display below the input field (error or general info)
    helpText() {
        if (this.state.validationError) {
            return "An error occurred. (" +
                this.state.validationError.message + ")";
        } else {
            return "Displayed in-app.  Must be unique.";
        }
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
        if (!this.state.isValidating && this.state.editionName.length > 0) {
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
                    <label htmlFor="newEditionName" className="control-label">
                        Edition Name:
                    </label>
                    <input type="text" id="newEditionName"
                        className="form-control" value={this.state.editionName}
                        onChange={this.handleEditionNameChange}
                        aria-describedby={"helpBlock " + ariaDescribedBy}>
                    </input>
                    {feedbackElem}
                    <span id="helpBlock" className="help-block">
                        {this.helpText()}
                    </span>
                </div>
            </form>
        )
    }

    // Render a Bootstrap modal with an input field for edition name.
    render() {
        var canCreateEdition = this.state.nameIsValid &&
            !this.state.isValidating;

        return (
            <ModalView title="Create Edition" cancelable
                primaryButtonText="Create"
                primaryButtonDisabled={!canCreateEdition}
                onPrimaryClick={this.handleCreateEdition}
                onCancel={this.handleCancelCreateEdition}>
                {this.bodyForm()}
            </ModalView>
        )
    }
}

/*
 * PROPTYPES
 * -------------
 * onCreate - a required function that is called when a new edition is created.
 *          should take the name of the new edition as a parameter.
 * onCancel - an optional function that is called when the user cancels creating
 *          an edition.
 * onVerify - function that returns a promise passing back whether a given
 *             edition name is valid or invalid.
 * -------------
 */
CreateEditionModalView.propTypes = {
    onCreate: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onVerify: PropTypes.func.isRequired
}

export default CreateEditionModalView;