import React, { Component, PropTypes } from "react";
import "../stylesheets/NewspaperEditionView.css";

class NewspaperEditionView extends Component {

  	render() {
    	return (
    		<div className="panel panel-default">
    		  	<div className="panel-heading">
    		    	<h3 className="panel-title">{this.props.edition.get("editionName")}</h3>
    		  	</div>
    		  	<div className="panel-body">
    		    	<div className="row">
    		    	  	
    		    	</div>
    		  	</div>
    		</div>
    	)
  	}
}

NewspaperEditionView.propTypes = {
	edition: PropTypes.object
};

export default NewspaperEditionView;