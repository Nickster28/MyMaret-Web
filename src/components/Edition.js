import React, { Component } from "react";

export default class Edition extends Component {
  	render() {
    	return (
            <div>{this.props.params.id}</div>
    	)
  	}
}