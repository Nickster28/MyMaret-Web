/*
 * CLASS: ModalView
 * -----------------------
 * A simple Bootstrap modal component that contains a modal with a title,
 * body, and OK button.  Clients can specify the modal contents and actions.
 * The modal wraps its contents in a <form>, so if the body of the modal
 * contains input fields it will submit both on ENTER or on clicking the primary
 * button.  onPrimarybuttonButtonClicked and afterDismiss handlers can
 * optionally be specified to further customize modal behavior.
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
		this.hide = this.hide.bind(this);
	}

	/*
	 * Display the modal on mount.  If there's a cancel button, that means that
	 * we should also allow exiting via clicking outside and hitting ESC.
	 */
	componentDidMount() {
		// Reset our state
		this.setState({didClickPrimaryButton: false});

		var modalSettings = this.props.cancelable ? {} : {
			keyboard: false,
			backdrop: "static"
		};

		$("#" + ModalViewId).modal(modalSettings);

		/*
		 * After dismiss, call the dismiss handler, passing in whether or not
		 * the primary button was used to dismiss.
		 */
		var savedThis = this;
		$("#" + ModalViewId).on("hidden.bs.modal", e => {
			if (savedThis.props.afterDismiss) {
				savedThis.props.afterDismiss(savedThis.state
					.didClickPrimaryButton);
			}
		});
	}

	/*
	 * If there's an onPrimaryButtonClicked handler, call that and pass in our
	 * hide function.  Otherwise, just hide ourselves immediately.
	 */
	onSubmit(e) {
		e.preventDefault();

		this.setState({didClickPrimaryButton: true});
		if (this.props.onPrimaryButtonClicked) {
			this.props.onPrimaryButtonClicked(this.hide);
		} else {
			this.hide();
		}
	}

	// Hides the modal
	hide() {
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
 * onPrimaryButtonClicked - an optional function called when the primary modal
 * 						button is clicked.  This function is called *before* the
 *						modal is dismissed, and allows the client to e.g.
 *						validate data before dismissing the modal.  This handler
 *						is passed a "dismiss" handler that can be called if the
 *						client wishes to dismiss the modal.
 * afterDismiss - an optional function called after the modal has dismissed.
 *					This function is passed 1 parameter, a boolean indicating
 *					whether or not the dismiss was caused by the user clicking
 *					the primary button.
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
	onPrimaryButtonClicked: PropTypes.func,
	afterDismiss:PropTypes.func,
	cancelable: PropTypes.bool,
	small: PropTypes.bool,
	primaryButtonText: PropTypes.string.isRequired,
	primaryButtonDisabled: PropTypes.bool
}

export default ModalView;