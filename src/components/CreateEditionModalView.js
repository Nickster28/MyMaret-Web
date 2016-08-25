/*
 * CLASS: CreateEditionModalView
 * --------------------------
 * Bootstrap modal component for creating a new NewspaperEdition.  Allows the
 * user to input an edition name, and then create the Edition or cancel.  When
 * the modal has been hidden, clears the input field.
 *
 * Handles the process of creating an edition, including verifying the name is
 * valid, creating the edition, and displaying an error, if any.  Requires
 * an afterDismiss handler that is called when the user cancels or successfully
 * creates an edition, and is passed a boolean whether or not the user created
 * an edition.  The "Create" button is disabled if the entered name is
 * invalid, if we're validating, or if we're creating.  Can be submitted on
 * ENTER or by clicking the primary button, and canceled by clicking "Cancel",
 * hitting ESC, or clicking outside the modal or on the "X".
 * --------------------------
 */

import React, { Component, PropTypes } from "react";
import { isValidNewspaperEditionName } from "../serverAPI";
import ModalView from "./ModalView";

const defaultState = {
    editionName: "",                // Currently entered edition name
    nameIsValid: false,             // Whether or not the name is valid
    isValidating: false,            // Whether we're in the middle of validating
    validityCheckTimerId: null,     // Last timer for validation check,
    validationError: null,          // Error from validation, if any
    createEditionError: null,       // Error from creating edition, if any
    isCreatingEdition: false        // Whether we're in the middle of creating
}

class CreateEditionModalView extends Component {

    constructor(props) {
        super(props);
        this.handleCreateEdition = this.handleCreateEdition.bind(this);
        this.handleEditionNameChange = this.handleEditionNameChange.bind(this);
        this.afterDismiss = this.afterDismiss.bind(this);
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
            isValidNewspaperEditionName(enteredName).then(nameIsValid => {
                savedThis.setState({
                    nameIsValid,
                    isValidating: false,
                    validationError: nameIsValid ? null : {
                        message: "Must be unique."
                    }
                });
            }, error => {
                savedThis.setState({
                    nameIsValid: false,
                    isValidating: false,
                    validationError: error
                });
            });
        }, 500);

        // Clear all errors, since they're obsolete
        this.setState({
            editionName: enteredName,
            createEditionError: null,
            validationError: null,
            isValidating: true,
            validityCheckTimerId: timerId
        });
    }

    /*
     * Triggered when the user clicks "Create".  Pass along the entered name to
     * attempt to create a new edition.  On finish, update our state accordingly
     * and hide ourselves on success. Note that this can only be triggered when
     * a valid edition name is entered since the "Create" button is disabled
     * when a name is invalid.
     */
    handleCreateEdition(hide) {
        this.setState({isCreatingEdition: true});
        var name = this.state.editionName;
        var savedThis = this;

        this.props.createEdition(name).then(() => {
            savedThis.setState({
                isCreatingEdition: false,
                createEditionError: null
            });
            hide();
        }, error => {
            savedThis.setState({
                isCreatingEdition: false,
                createEditionError: error
            });
        });
    }

    // Called once the modal is dismissed.  Reset our state and call our client
    afterDismiss(didCreateEdition) {
        this.setState(defaultState);
        this.props.afterDismiss(didCreateEdition);
    }

    // Returns the text to display below the input field (error or general info)
    helpText() {
        if (this.state.createEditionError) {
            return "An error occurred. (" +
                this.state.createEditionError.message + ")";
        } else if (this.state.validationError) {
            return "An error occurred. (" +
                this.state.validationError.message + ")";
        } else {
            return null;
        }
    }

    /*
     * Return the modal body, which is has one input field.  Also,
     * depending on the validity check result, render a glyphicon with feedback
     * on whether the entered name is valid or invalid.
     */
    formBody() {
        var classNames = "form-group";
        var ariaDescribedBy = "";
        var feedbackElem = "";
        if (!this.state.isValidating && this.state.editionName.length > 0) {
            var isValid = this.state.nameIsValid &&
                !this.state.createEditionError;

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
            <div className={classNames}>
                <label htmlFor="newEditionName" className="control-label">
                    Edition Name (displayed in-app):
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
        )
    }

    // Render a Bootstrap modal with an input field for edition name.
    render() {
        var canCreateEdition = this.state.nameIsValid &&
            !this.state.isValidating && !this.state.isCreatingEdition;

        return (
            <ModalView title="Create Edition" cancelable
                primaryButtonText={this.state.isCreatingEdition ?
                    "Creating..." : "Create"}
                primaryButtonDisabled={!canCreateEdition}
                onPrimaryButtonClicked={this.handleCreateEdition}
                afterDismiss={this.afterDismiss}>
                {this.formBody()}
            </ModalView>
        )
    }
}

/*
 * PROPTYPES
 * -------------
 * afterDismiss - a required function called after the modal is dismissed, and
 *                  passed a boolean whether or not a new edition was created.
 * createEdition - a required function that should return a promise that creates
 *                  a new edition object.
 * -------------
 */
CreateEditionModalView.propTypes = {
    afterDismiss: PropTypes.func.isRequired,
    createEdition: PropTypes.func.isRequired
}

export default CreateEditionModalView;