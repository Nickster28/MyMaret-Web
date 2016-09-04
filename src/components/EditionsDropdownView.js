/*
 * CLASS: EditionsDropdownView
 * ------------------------------
 * Component to display a dropdown to select a newspaper edition.  Displays the
 * current edition name on the dropdown button, and all edition names in the
 * dropdown along with a "create edition" button.  The current edition name is
 * bolded.  Published editions have a star next to them.
 * Also displays a divider followed by a "create edition" option.
 * Must be passed a sorted array of edition info from newest to oldest, which
 * is selected, and a handler function for creating a new edition and
 * selecting an edition.
 * ------------------------------
 */

import React, { Component, PropTypes } from "react";
import "../stylesheets/EditionsDropdownView.css";

class EditionsDropdownView extends Component {

	/*
	 * Creates an array of <li> items for each edition for the dropdown.
	 * The currently-selected edition is bolded, and published editions have
	 * visible stars next to them.  Note that the span for the star glyphicon
	 * is always added, but is marked hidden for non-published editions.  This
	 * is to keep the edition names aligned.
	 */
	editionNamesList() {
		var selectedEditionIndex = this.props.selectedEditionIndex;
		var onSelectEdition = this.props.onSelectEdition;
		return this.props.editionInfoNewestToOldest.map(
			(editionInfo, index) => {

			// See if we should bold this one or not
			var elemId = index === selectedEditionIndex ?
				"selectedEdition" :"";

			// All elements have a glyphicon - but for non-published it's hidden
			var publishedIconClassNames =
				"glyphicon glyphicon-send dropdownPublishedIcon" +
				(editionInfo.isPublished ? "" : " dropdownPublishedIconHidden");

			return (
				<li key={editionInfo.id}>
					<a id={elemId} className="editionsDropdownViewOption"
						onClick={onSelectEdition.bind(null, editionInfo.id)}>
						<span className={publishedIconClassNames}
							aria-hidden="true"></span>
						{editionInfo.name}
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
		var selectedEditionName = "Select Edition";
		if (this.props.selectedEditionIndex >= 0 &&
			this.props.selectedEditionIndex < this.props
			.editionInfoNewestToOldest.length) {
			
			selectedEditionName = this.props
			.editionInfoNewestToOldest[this.props.selectedEditionIndex].name;
		}
		return (
			<div className="dropdown">
				<button className="btn btn-default dropdown-toggle"
					type="button" id="editionsDropdown" data-toggle="dropdown"
					aria-haspopup="true" aria-expanded="false">
					<div>{selectedEditionName}<span className="caret"></span>
					</div>
				</button>
				<ul className="dropdown-menu dropdown-menu-right"
					aria-labelledby="editionsDropdown">
					{this.editionNamesList()}
					<li role="separator" className="divider"></li>
					<li id="createEditionRow">
						<a onClick={this.props.onCreateEdition}>
							<span id="createEditionPlus"
								className="glyphicon glyphicon-plus"
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
 * onCreateEdition - a function handler for creating a new edition.  Takes no
 *					parameters.
 * editionInfoNewestToOldest - an array of edition info objects, sorted from
 *                          newest to oldest.  Each object should contain that
 *                          edition's name, id, and whether it's published.
 * selectedEditionIndex - index of selected edition's info in
 *                          editionInfoNewestToOldest
 * ------------
 */
EditionsDropdownView.propTypes = {
    onSelectEdition: PropTypes.func.isRequired,
    onCreateEdition: PropTypes.func.isRequired,
    editionInfoNewestToOldest: PropTypes.arrayOf(React.PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        isPublished: PropTypes.bool.isRequired
    }).isRequired).isRequired,
    selectedEditionIndex: PropTypes.number.isRequired,
}

export default EditionsDropdownView;