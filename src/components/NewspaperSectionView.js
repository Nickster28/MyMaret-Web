import React, { Component, PropTypes } from "react";

class NewspaperSectionView extends Component {
	render() {
		<div key={i} className="col-xs-12 col-sm-6 col-lg-4">
    		<div className="panel panel-default">
    		    <div className="panel-heading">
    		    	<h3 className="panel-title edition-section-title">
    		    		Really really really long long Section Name
    		    		<a>
    		    			<span className="glyphicon glyphicon-edit editSectionNameButton"></span>
    		    		</a>
    		    		<a>
    		    			<span className="glyphicon glyphicon-remove removeSectionButton"></span>
    		    		</a>
    		    	</h3>
    		    </div>
    		   	<div className="panel-body">
    		    	<ul className="list-group">
    		    	    <li className="list-group-item">{"Item " + i}</li>
    		    	    <li className="list-group-item">{"Item " + i}</li>
    		    	    <li className="list-group-item">{"Item " + i}</li>
    		    	    <li className="list-group-item">{"Item " + i}</li>
    		    	    <li className="list-group-item">{"Item " + i}</li>
    		    	</ul>
    		    	<a>
    		    	    <span className="glyphicon glyphicon-plus addArticleButton"></span>
    		    	</a>
    		   	</div>
    		</div>
    	</div>
	}
}

export default NewspaperSectionView;