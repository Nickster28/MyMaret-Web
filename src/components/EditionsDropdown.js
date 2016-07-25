import React, { Component } from "react";
import "../stylesheets/EditionsDropdown.css";

export default class EditionsDropdown extends Component {
	render() {
		return (
			<div className="dropdown">
				<button className="btn btn-default dropdown-toggle" type="button" id="editionsDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
					Winter (current) 
					<span className="caret"></span>
				</button>
				<ul className="dropdown-menu" aria-labelledby="editionsDropdown">
					<li><a href="#">Action 1</a></li>
					<li><a href="#">Action 2</a></li>
					<li><a href="#">Action 3</a></li>
					<li><a href="#">Action 4</a></li>
					<li role="separator" className="divider"></li>
					<li id="newEditionRow"><a onClick={this.props.handleCreate} href="#"><span className="glyphicon glyphicon-plus" aria-hidden="true"></span>Create New</a></li>
				</ul>
			</div>
		)
	}
}