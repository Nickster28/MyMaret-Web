/*
 * CLASS: ModalView
 * -----------------------
 * A simple Bootstrap modal component that contains a modal with a title,
 * body, and OK button.  Clients can specify the modal contents and actions.
 * The modal wraps its contents in a <form>, so if the body of the modal
 * contains input fields it will submit both on ENTER or on clicking the primary
 * button.  When this happens the confirm handler will be called.
 *
 * The modal can also be specified as cancelable, meaning that the action can be
 * canceled by clicking "Cancel", the "X", outside the modal, or hitting ESC.
 * When this happens, the cancel handler will be called.
 *
 * Note that this modal is displayed on componentDidMount(), negating the need
 * for the client to manually display the modal. Instead, it will appear as soon
 * as it is added to the DOM.
 * -----------------------
 */

import React, { Component, PropTypes } from "react";
import $ from "jquery";
import "../stylesheets/ModalView.css";

const ModalViewId = "ModalView";
class ModalView extends Component {

	constructor(props) {
		super(props);
		this.state = {didClickPrimaryButton: false};
		this.onSubmit = this.onSubmit.bind(this);
	}

	/*
	 * Display the modal on mount.  If there's a cancel button, that means that
	 * we should also allow exiting via clicking outside and hitting ESC.
	 */
	componentDidMount() {
		// Reset our state
		this.setState({didClickPrimaryButton: false});

		var modalSettings = {};
		if (!this.props.cancelable) {
			modalSettings = {
			    keyboard: false,
			    backdrop: "static"
			};
		}

		$("#" + ModalViewId).modal(modalSettings);

		/*
		 * After dismiss, if the user didn't click the primary button to dismiss
		 * (only possible if cancelable = true), then call the cancel handler.
		 * Otherwise, call the primary click handler, if any.
		 */
		var savedThis = this;
		$("#" + ModalViewId).on("hidden.bs.modal", e => {
			if (!savedThis.state.didClickPrimaryButton &&
				savedThis.props.onCancel) {
				savedThis.props.onCancel();
			} else if (savedThis.state.didClickPrimaryButton &&
				savedThis.props.onConfirm) {
				savedThis.props.onConfirm();
			}
		});
	}

	// Dismiss ourselves, and record that we exited via the primary button
	onSubmit(e) {
		e.preventDefault();

		this.setState({didClickPrimaryButton: true});
		$("#" + ModalViewId).modal("hide");
	}

	// Render a small Bootstrap modal view
	render() {
		var classNames = "modal-dialog" + (this.props.small ? " modal-sm" : "");
		return (
			<div className="modal fade" id={ModalViewId} tabIndex="-1"
				role="dialog" aria-labelledby={this.props.title}>
			    <div className={classNames} role="document">
			        <div className="modal-content">
			            <form id="hi" onSubmit={this.onSubmit}>

			            	<div className="modal-header">

			            		{/* Add an "X" if this is cancel-able */}
			            		{!this.props.cancelable ? null :
			            			<button type="button" className="close"
			            			data-dismiss="modal" aria-label="Close">
			            				<span aria-hidden="true">&times;</span>
			            			</button>
			            		}

			            	    <h4 className="modal-title">
			            	    	{this.props.title}
			            	    </h4>
			            	</div>

			            	<div className="modal-body">
			            		{this.props.children}
			            	</div>

			            	<div className="modal-footer">

			            		{/* Add "Cancel" if this is cancel-able */}
			            		{!this.props.cancelable ? null :
			            			<button type="button" data-dismiss="modal"
			            			className="btn btn-default">Cancel</button>
			            		}

			            	    <button type="submit"
			            	    	id="modalViewPrimaryButton"
			            	    	className="btn btn-primary"
			            	    	disabled={this.props.primaryButtonDisabled ?
			            	    		"disabled" : ""}>
			            	    	{this.props.primaryButtonText}
			            	    </button>
			            	</div>
			            </form>
			        </div>
			    </div>
			</div>
		)
	}
}

/*
 * PROPTYPES
 * ------------
 * title - the title of the modal, displayed in Bold at the top
 * onConfirm - an optional function to be called when the primary button is
 *					pressed, or the user hits ENTER.
 * onCancel - an optional function to be called when the modal is canceled (only
 *				valid if it's cancelable).
 * cancelable - whether the user should be able to close out a different way
 * 				besides the primary button.  If this is true, adds a "Cancel"
 *				button, an "X" in the top right, and allows exiting by clicking
 *				outside of the modal or by hitting ESC.
 * small - if true, the modal is displayed as a small bootstrap modal.  Default
 *			is false.
 * primaryButtonText - the text to display in the primary button.
 * primaryButtonDisabled - whether the primary button should be deactivated.
 */
ModalView.propTypes = {
	title: PropTypes.string.isRequired,
	onConfirm: PropTypes.func,
	onCancel: PropTypes.func,
	cancelable: PropTypes.bool,
	small: PropTypes.bool,
	primaryButtonText: PropTypes.string.isRequired,
	primaryButtonDisabled: PropTypes.bool
}

export default ModalView;