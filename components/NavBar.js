import React from 'react';
import NavLink from './NavLink'
import Parse from '../ParseWrapper'
import { browserHistory } from 'react-router'

export default class NavBar extends React.Component {
	
	logOut(e) {
		e.preventDefault();
		Parse.User.logOut().then(() => {
			browserHistory.push('/login');
		}, (error) => {
			alert("Could not log out - an error occured.");
		});
	}

	render() {
		return (
			<nav className="navbar navbar-default navbar-fixed-top">
				<div className="container-fluid">

				    {/* Toggle button for smaller screens, MyMaret header */}
				    <div className="navbar-header">
				        <button type="button" id="toggle-button" className="navbar-toggle" data-toggle="collapse" data-target="#toolbar-items">
				            <span className="sr-only">Toggle navigation</span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				        </button>
				        <p className="navbar-text h3" id="brand">MyMaret</p>
				    </div>
				    
				    {/* Page links and logout button */}
				    <div className="collapse navbar-collapse" id="toolbar-items">
				        <ul className="nav navbar-nav navbar">
				        	<li className="navBarItem"><NavLink to="/analytics">Analytics</NavLink></li>
							<li className="navBarItem"><NavLink to="/editions">Editions</NavLink></li>
				        </ul>
				    
				        <form onSubmit={this.logOut.bind(this)}>
				            <button type="button submit" id="logOutButton" className="btn btn-default navbar-btn navbar-right">Log Out</button>
				        </form>
				    </div>
				</div>
			</nav>
		)
	}
}