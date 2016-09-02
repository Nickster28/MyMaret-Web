/*
 * CLASS: ConfirmationModalView
 * -----------------------------
 * TODO
 * -----------------------------
 */

import React, { Component, PropTypes } from "react";
import ModalView from "./ModalView";

const defaultState = {
	isConfirming: false,
 	confirmationError: null,
 	didConfirm: false
}

class ConfirmationModalView extends Component {

 	constructor(props) {
 		super(props);
 		this.state = defaultState;
 	}

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
 			    onConfirm={this.props.onHide}
 			    onCancel={this.onCancel}
 			    onDismissed={() => {
 			    	this.props.onDismissed(this.state.didConfirm);
 			    }}
 			    primaryButtonText={this.props.primaryButtonText +
 			    	(this.state.isConfirming ? "ing..." + "")}
 			    primaryButtonDisabled={this.state.isConfirming}>
 			    	{this.props.children}
 			    	<Visibility visible={this.state.confirmationError ?
 			    		true : false}>
 			    		{this.props.createErrorElement(this.state
 			    			.confirmationError)}
 			    	</Visibility>
 			</ModalView>
 		)
 	}
}

ConfirmationModalView.propTypes = {
	title: PropTypes.string.isRequired,
	primaryButtonText: PropTypes.string.isRequired,
	visible: PropTypes.bool.isRequired,
	onDismissed: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	createErrorElement: PropTypes.func.isRequired
}