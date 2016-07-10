import React from 'react'
import DocumentTitle from 'react-document-title'

export default React.createClass({
  	render() {
    	return (
    		<DocumentTitle title="MyMaret">
    			<div>{this.props.children}</div>
    		</DocumentTitle>
    	)
  	}
});