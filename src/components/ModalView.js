/*
 * CLASS: ModalView
 * -----------------------
 * A simple Bootstrap modal component that contains a modal with a title,
 * body, and OK button.  Clients can specify the modal contents and actions.
 * The modal wraps its contents in a <form>, so if the body of the modal
 * contains input fields it will submit both on ENTER or on clicking the primary
 * button.  onConfirm (required) and onCancel handlers are available to further
 * customize behavior.
 *
 * The modal can be specified as cancelable, meaning that the action can be
 * canceled by clicking "Cancel", or the "X" in the top right.  When this
 * happens, onCancel will be called.
 *
 * This modal is animated in on mount and out on unmount.  To achieve this, this
 * file contains 2 modal classes - one wrapper class that just adds the
 * animations via ReactTransitionGroup, and the InnerModalView class itself that
 * contains the Bootstrap modal HTML.  All of the animation code is in
 * InnerModalView, since ReactTransitionGroup calls its animation callbacks on
 * its *direct children* components.
 * -----------------------
 */

import React, { Component, PropTypes } from "react";
import Visibility from "./Visibility";
import ReactTransitionGroup from "react-addons-transition-group";
import $ from "jquery";
import "../stylesheets/ModalView.css";

/*
 * A wrapper class that adds the ReactTransitionGroup animations.  Note that
 * InnerModalView must be a *direct* child of ReactTransitionGroup in order for
 * it to be animated in/out.
 */
class ModalView extends Component {
	render() {
		return (
			<ReactTransitionGroup>
				{!this.props.visible ? null :
					<InnerModalView {...this.props} />
				}
			</ReactTransitionGroup>
		);
	}
}

const InnerModalViewId = "ModalView"; // HTML elem id

// The actual modal component that is animated in and out
class InnerModalView extends Component {

	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	/*
	 * Display the modal on mount.  Disable ESC and clicking outside the modal
	 * so we can have full control over the cancel action (since we get no
	 * callback if the user clicks outside the modal, for instance, but it
	 * dismisses the modal).
	 */
	componentWillEnter(callback) {
		$("#" + InnerModalViewId).on("shown.bs.modal", callback);
		$("#" + InnerModalViewId).modal({
			keyboard: false,
			backdrop: "static"
		});
	}

	// Call our given onConfirm handler when the primary button is clicked
	onSubmit(e) {
		e.preventDefault();
		this.props.onConfirm();
	}

	// Call our given onCancel handler when the cancel button or "X" are clicked
	onCancel() {
		if (this.props.onCancel) {
			this.props.onCancel();
		}
	}

	// Animate out on unmount, calling our dismiss handler, if any
	componentWillLeave(callback) {
		const savedThis = this;
		$("#" + InnerModalViewId).on("hidden.bs.modal", () => {
			callback();
			if (savedThis.props.onDismissed) {
				savedThis.props.onDismissed();
			}
		});
		$("#" + InnerModalViewId).modal("hide");
	}

	// Render a small Bootstrap modal view
	render() {
		const classNames = "modal-dialog" + (this.props.small ? " modal-sm" : "");
		const cancelable = this.props.cancelable ? true : false;

		return (
			<div className="modal fade" id={InnerModalViewId} tabIndex="-1"
				role="dialog" aria-labelledby={this.props.title}>
			    <div className={classNames} role="document">
			        <div className="modal-content">
			            <form onSubmit={this.onSubmit}>

			            	<div className="modal-header">

			            		{/* Add an "X" if this is cancel-able */}
			            		<Visibility visible={cancelable}
			            			createElement={() => {
			            				return (
			            					<button type="button"
			            						className="close"
			            						onClick={this.onCancel}
			            						aria-label="Close">
			            							<span aria-hidden="true">
			            								&times;
			            							</span>
			            					</button>
			            				);
			            			}} />

			            	    <h4 className="modal-title">
			            	    	{this.props.title}
			            	    </h4>
			            	</div>

			            	<div className="modal-body">
			            		{this.props.children}
			            	</div>

			            	<div className="modal-footer">

			            		{/* Add "Cancel" if this is cancel-able */}
			            		<Visibility visible={cancelable}
			            			createElement={() => {
			            				return (
			            					<button type="button"
			            					onClick={this.onCancel}
			            					className="btn btn-default">
			            						Cancel
			            					</button>
			            				);
			            		}} />

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
 * visible - whether the modal is visible or not.  Fades in and out when this
 *			changes.
 * onConfirm - a required function called when the primary modal button is
 *				clicked.
 * onCancel - an optional function called when the modal is cancelled.  This
 *				is only relevant if the modal is cancelable.
 * onDismissed - an optional function called after the modal is dismissed.
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
	visible: PropTypes.bool.isRequired,
	onConfirm: PropTypes.func.isRequired,
	onCancel: PropTypes.func,
	onDismissed: PropTypes.func,
	cancelable: PropTypes.bool,
	small: PropTypes.bool,
	primaryButtonText: PropTypes.string.isRequired,
	primaryButtonDisabled: PropTypes.bool
}

export default ModalView;