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

const AlertModalViewId = "AlertModalView";
class AlertModalView extends Component {

	// Display the modal on mount
	componentDidMount() {
		$("#" + AlertModalViewId).modal({
		    keyboard: false,
		    backdrop: "static"
		});
	}

	// Dismiss the modal, and then call the passed-in onClick handler, if any
	onClick() {
		if (this.props.onClick) {
			var savedThis = this;
			$("#" + AlertModalViewId).on("hidden.bs.modal", e => {
				savedThis.props.onClick();
			});
		}

		$("#" + AlertModalViewId).modal("hide");
	}

	// Render a small Bootstrap modal view
	render() {
		return (
			<div className="modal fade" id={AlertModalViewId} tabIndex="-1"
				role="dialog" aria-labelledby={this.props.title}>
			    <div className="modal-dialog modal-sm" role="document">
			        <div className="modal-content">
			            <div className="modal-header">
			                <h4 className="modal-title">{this.props.title}</h4>
			            </div>
			            <div className="modal-body">{this.props.children}</div>
			            <div className="modal-footer">
			                <button type="button" className="btn btn-default"
			                onClick={this.onClick.bind(this)}>Ok</button>
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
 * onClick - an optional function to be called when the "Ok" button is pressed.
 */
AlertModalView.propTypes = {
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func
}

export default AlertModalView;