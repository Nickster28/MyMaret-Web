import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

export default class App extends Component {
  	render() {
    	return (
    		<DocumentTitle title="MyMaret">
    			<div>{this.props.children}</div>
    		</DocumentTitle>
    	)
  	}
}