/*
 * CLASS: EditionsDropdown
 * ------------------------------
 * Component to display a dropdown to select an edition.  Displays the
 * current edition name on the dropdown button, and all edition names in the
 * dropdown along with a "create edition" button.  The current edition name is
 * bolded.  Also displays a divider followed by a "create edition" option.
 * Must be passed a sorted array of edition info from newest to oldest,
 * and a handler function for creating a new edition.
 * ------------------------------
 */

import React, { Component, PropTypes } from "react";
import "../stylesheets/EditionsDropdown.css";

class EditionsDropdown extends Component {

	/*
	 * Creates an array of <li> items for each edition for the dropdown.
	 * The currently-selected edition is bolded.
	 */
	editionNamesList() {
		var selectedEditionIndex = this.props.selectedEditionIndex;
		var onSelectEdition = this.props.onSelectEdition;
		return this.props.editionInfoNewestToOldest.map(
			(editionInfo, index) => {

			// See if we should bold this one or not
			var elemId = index === selectedEditionIndex ?
				"selectedEdition" :"";
			return (
				<li key={editionInfo.id}>
					<a id={elemId} className="editionsDropdownOption"
						onClick={onSelectEdition.bind(null, editionInfo.id)}>
						{editionInfo.title}
					</a>
				</li>
			)
		});
	}

	render() {
		/*
		 * If the selected index is invalid, display "Error" (should never
		 * be visible, since routing checks ensure that an invalid
		 * /editions/edition/:id is replaced by /404.  We just need this
		 * so there are no rendering errors preventing that replcacement)
		 */
		var selectedEditionName = "Error";
		if (this.props.selectedEditionIndex >= 0 &&
			this.props.selectedEditionIndex < this.props
			.editionInfoNewestToOldest.length) {
			
			selectedEditionName = this.props
			.editionInfoNewestToOldest[this.props.selectedEditionIndex].title;
		}
		return (
			<div className="dropdown">
				<button className="btn btn-default dropdown-toggle"
					type="button" id="editionsDropdown" data-toggle="dropdown"
					aria-haspopup="true" aria-expanded="false">
					{selectedEditionName}
					<span className="caret"></span>
				</button>
				<ul className="dropdown-menu dropdown-menu-right"
					aria-labelledby="editionsDropdown">
					{this.editionNamesList()}
					<li role="separator" className="divider"></li>
					<li id="createEditionRow">
						<a className="editionsDropdownOption"
							onClick={this.props.onCreateEdition}>
							<span className="glyphicon glyphicon-plus"
								aria-hidden="true"></span>
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
 * onCreateEdition - a function handler for creating a new edition.  TODO
 * editionInfoNewestToOldest - an array of edition info objects, sorted from
 *                          newest to oldest.  Each object should contain that
 *                          edition's title and id.
 * selectedEditionIndex - index of selected edition's info in
 *                          editionInfoNewestToOldest
 * ------------
 */
EditionsDropdown.propTypes = {
    onSelectEdition: PropTypes.func.isRequired,
    onCreateEdition: PropTypes.func.isRequired,
    editionInfoNewestToOldest: PropTypes.arrayOf(React.PropTypes.shape({
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired
    }).isRequired).isRequired,
    selectedEditionIndex: PropTypes.number.isRequired
}

export default EditionsDropdown;