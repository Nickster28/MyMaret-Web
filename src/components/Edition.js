import React, { Component, PropTypes } from "react";

class Edition extends Component {
  	render() {
    	return (
            <div>Name = {this.props.edition.get("editionName")}</div>
    	)
  	}
}

Edition.propTypes = {
	edition: PropTypes.object.isRequired
};

export default Edition;