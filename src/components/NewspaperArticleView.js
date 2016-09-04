import React, { Component, PropTypes } from "react";

class NewspaperArticleView extends Component {

	render() {
		return <div>Hello World</div>;
	}
}

NewspaperArticleView.propTypes = {
    article: PropTypes.object
}

export default NewspaperArticleView;