/*
 * CLASS: ConfirmationModalView
 * -----------------------------
 * A composition of ModalView meant for confirmation dialogs that make async
 * network calls.  Always displays a small, cancelable ModalView, invokes the
 * onConfirm function on confirm (which must return a promise), and displays an
 * error message if there's an error.  On dismiss, it calls the onDismissed
 * handler, passing back whether the user confirmed or not.
 * -----------------------------
 */

import React, { Component, PropTypes } from "react";
import ModalView from "./ModalView";
import Visibility from "./Visibility";
import "../stylesheets/ConfirmationModalView.css";

/*
 * STATE
 * -----------
 * isConfirming - whether we're in the middle of a confirmation (i.e. loading)
 * confirmationError - the error (if any) from the most recent confirm
 * didConfirm - whether the user dismissed the modal with the confirm button
 * -----------
 */
const defaultState = {
	isConfirming: false,
 	confirmationError: null,
 	didConfirm: false
}

class ConfirmationModalView extends Component {

 	constructor(props) {
 		super(props);
 		this.state = defaultState;
 		this.onConfirm = this.onConfirm.bind(this);
 	}

 	// Update our state and call onConfirm
 	onConfirm() {
 		this.setState({
 			isConfirming: true,
 			confirmationError: null
 		});

 		var savedThis = this;
 		this.props.onConfirm().then(() => {
 			savedThis.setState({
 				isConfirming: false,
 				confirmationError: null,
 				didConfirm: true
 			});
 			savedThis.props.onHide();
 		}, error => {
 			savedThis.setState({
 				isConfirming: false,
 				confirmationError: error
 			});
 		});
 	}

 	render() {
 		return (
 			<ModalView title={this.props.title} small cancelable
 			    visible={this.props.visible}
 			    onConfirm={this.onConfirm}
 			    onCancel={this.props.onHide}
 			    onDismissed={() => {
 			    	if (this.props.onDismissed) {
 			    		this.props.onDismissed(this.state.didConfirm);
 			    	}
 			    }}
 			    primaryButtonText={this.state.isConfirming ?
 			    	this.props.primaryButtonConfirmingText :
 			    	this.props.primaryButtonText}
 			    primaryButtonDisabled={this.state.isConfirming}>
 			    	{this.props.children}
 			    	<Visibility visible={this.state.confirmationError ?
 			    		true : false} createElement={() => {
 			    			return (
 			    				<p id="confirmationModalViewError"
 			    					className="text-danger">
 			    					{"Error: " +
 			    						this.state.confirmationError.message +
 			    						"  Please try again."
 			    					}
 			    				</p>
 			    			);
 			    		}} />
 			</ModalView>
 		)
 	}
}

/*
 * PROP TYPES
 * ---------------
 * title - the modal title
 * primaryButtonText - the text to display on the primary button when it is not
 * 						loading.
 * primaryButtonConfirmingText - the text to display on the primary button when
 * 						it *is* loading.
 * visible - whether the modal is visible.
 * onDismissed - optional function called after the modal is dismissed.  Passed
 * 				one parameter, a boolean whether or not the modal was dismissed
 *				using the confirmation button.
 * onConfirm - the function called when the user clicks the confirmation button.
 *				must return a promise.
 * onHide - the function called when the modal should hide.
 * ---------------
 */
ConfirmationModalView.propTypes = {
	title: PropTypes.string.isRequired,
	primaryButtonText: PropTypes.string.isRequired,
	primaryButtonConfirmingText: PropTypes.string.isRequired,
	visible: PropTypes.bool.isRequired,
	onDismissed: PropTypes.func,
	onConfirm: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired
}

export default ConfirmationModalView;