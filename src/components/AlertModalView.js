/*
 * CLASS: AlertModalView
 * -----------------------
 * A simple Bootstrap modal component that contains a small modal with a title,
 * body, and OK button.  Clients can specify the modal title, element id, and
 * a handler for when the Ok button is clicked.  The body of the modal is
 * whatever child element(s) is/are within the AlertModalView component.  Note
 * that this modal is displayed on componentDidMount(), negating the need for
 * the client to manually display the modal. Instead, it will appear as soon
 * as it is added to the DOM.  The displayed modal can only be exited by
 * clicking "OK".
 * -----------------------
 */

import React, { Component, PropTypes } from "react";
import $ from "jquery";
import "../stylesheets/AlertModalView.css";

const AlertModalViewId = "AlertModalView";
class AlertModalView extends Component {

	/*
	 * Display the modal on mount.  If there's a cancel button, that means that
	 * we should also allow exiting via clicking outside and hitting ESC.
	 */
	componentDidMount() {
		var modalSettings = {};
		if (!this.props.cancelable) {
			modalSettings = {
			    keyboard: false,
			    backdrop: "static"
			};
		}

		$("#" + AlertModalViewId).modal(modalSettings);
	}

	// Dismiss the modal, and then call the passed-in onClick handler, if any
	onClick() {
		var savedThis = this;
		$("#" + AlertModalViewId).on("hidden.bs.modal", e => {
			savedThis.props.onPrimaryClick();
		});

		$("#" + AlertModalViewId).modal("hide");
	}

	// Render a small Bootstrap modal view
	render() {
		var classNames = "modal-dialog" + (this.props.small ? " modal-sm" : "");
		return (
			<div className="modal fade" id={AlertModalViewId} tabIndex="-1"
				role="dialog" aria-labelledby={this.props.title}>
			    <div className={classNames} role="document">
			        <div className="modal-content">
			            <div className="modal-header">

			            	{/* Add an "X" if this is cancel-able */}
			            	{!this.props.cancelable ? "" :
			            		<button type="button" className="close"
			            		data-dismiss="modal" aria-label="Close">
			            			<span aria-hidden="true">&times;</span>
			            		</button>
			            	}

			                <h4 className="modal-title">{this.props.title}</h4>
			            </div>
			            <div className="modal-body">{this.props.children}</div>
			            <div className="modal-footer">

			            	{/* Add "Cancel" if this is cancel-able */}
			            	{!this.props.cancelable ? null :
			            		<button type="button" data-dismiss="modal"
			            		className="btn btn-default">Cancel</button>
			            	}

			                <button type="button" className="btn btn-primary"
			                id="alertModalViewPrimaryButton"
			                onClick={this.onClick.bind(this)}>
			                	{this.props.primaryButtonText}
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
 * ------------
 * title - the title of the modal, displayed in Bold at the top
 * onPrimaryClick - an optional function to be called when the primary button is
 *					pressed.
 * cancelable - whether the user should be able to close out a different way
 * 				besides the primary button.  If this is true, adds a "Cancel"
 *				button, an "X" in the top right, and allows exiting by clicking
 *				outside of the modal or by hitting ESC.
 * small - if true, the modal is displayed as a small bootstrap modal.  Default
 *			is false.
 * primaryButtonText - the text to display in the primary button.
 */
AlertModalView.propTypes = {
	title: PropTypes.string.isRequired,
	onPrimaryClick: PropTypes.func,
	cancelable: PropTypes.bool,
	small: PropTypes.bool,
	primaryButtonText: PropTypes.string.isRequired
}

export default AlertModalView;