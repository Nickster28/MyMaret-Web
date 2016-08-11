/*
 * CLASS: EditionsDropdown
 * ------------------------------
 * Component to display a dropdown to select an edition.  Displays the
 * newest edition name on the dropdown button, and all edition names in the
 * dropdown along with a "create edition" button.  Also displays a divider
 * followed by a "create edition" option.  Must be passed a sorted
 * array of edition info from newest to oldest, and a handler function for
 * creating a new edition.
 * ------------------------------
 */

import React, { Component, PropTypes } from "react";
import "../stylesheets/EditionsDropdown.css";

class EditionsDropdown extends Component {



	// Creates an array of <li> items for each edition for the dropdown.
	editionNamesList() {
		return this.props.editionInfoNewestToOldest.map(editionInfo => {
			return (
				<li key={editionInfo.id}>
					<a href="#" onClick={this.props.onSelectEdition.bind(editionInfo.id)}>
						{editionInfo.title}
					</a>
				</li>
			)
		});
	}

	render() {
		return (
			<div className="dropdown">
				<button className="btn btn-default dropdown-toggle" type="button" id="editionsDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
					{this.props.editionInfoNewestToOldest[0].title}
					<span className="caret"></span>
				</button>
				<ul className="dropdown-menu" aria-labelledby="editionsDropdown">
					{this.editionNamesList()}
					<li role="separator" className="divider"></li>
					<li id="createEditionRow">
						<a onClick={this.props.onCreateEdition} href="#">
							<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
							Create Edition
						</a>
					</li>
				</ul>
			</div>
		)
	}
}

/* 
 * PROPTYPES
 * ------------
 * onSelectEdition - a function handler for when an edition is selected to
 *                  view.  Should take the objectId of the edition to select.
 * onCreateEdition - a function handler for creating a new edition.  Doesn't
 *					take any parameters.
 * editionInfoNewestToOldest - an array of edition info objects, sorted from
 *                          newest to oldest.  Each object should contain that
 *                          edition's title and id.
 * ------------
 */
EditionsDropdown.propTypes = {
    onSelectEdition: PropTypes.func.isRequired,
    onCreateEdition: PropTypes.func.isRequired,
    editionInfoNewestToOldest: PropTypes.arrayOf(React.PropTypes.shape({
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired
    })).isRequired
}

export default EditionsDropdown;