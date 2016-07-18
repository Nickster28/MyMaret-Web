import React from 'react'
import NavBar from './NavBar'

export default class Home extends React.Component {
  	render() {
    	return (
    		<div>
    			<NavBar />
    			<div id="home-body">
    				{this.props.children}
    			</div>
    		</div>
    	)
  	}
}