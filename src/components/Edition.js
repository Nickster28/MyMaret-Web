import React, { Component, PropTypes } from "react";

class Edition extends Component {
  	render() {
    	return (
            <div>Name = {this.props.edition ?
            	this.props.edition.get("editionName") : "Unknown"}</div>
    	)
  	}
}

Edition.propTypes = {
	edition: PropTypes.object
};

export default Edition;