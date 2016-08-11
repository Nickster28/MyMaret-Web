import React, { Component, PropTypes } from "react";

class Edition extends Component {
  	render() {
    	return (
            <div>ID = {this.props.params.id}</div>
    	)
  	}
}

Edition.propTypes = {
	params: PropTypes.shape({
		id: PropTypes.string
	}).isRequired
};

export default Edition;