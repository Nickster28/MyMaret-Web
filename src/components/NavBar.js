import React, { Component } from 'react';
import NavLink from './NavLink';
import Parse from '../ParseWrapper';
import { browserHistory } from 'react-router';
import '../stylesheets/NavBar.css';

export default class NavBar extends Component {
	
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
			        <div className="navbar-header">
			        	<button type="button" id="nav-toggle" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-items">
			        		<span className="sr-only">Toggle navigation</span>
			        		<span className="icon-bar"></span>
			        		<span className="icon-bar"></span>
			        		<span className="icon-bar"></span>
			        	</button>
			            <div className="navbar-brand">MyMaret</div>
			        </div>
			        <div className="collapse navbar-collapse" id="navbar-items">
			        	<ul className="nav navbar-nav">
			        	    <li><NavLink to="/analytics">Analytics</NavLink></li>
			        	    <li><NavLink to="/editions">Editions</NavLink></li>
			        	</ul>
			        	<button type="button" id="logoutButton" className="btn btn-default navbar-btn navbar-right" onClick={this.logOut.bind(this)}>
			        		<span className="glyphicon glyphicon-log-out" aria-hidden="true"></span> Log Out
			        	</button>
			        </div>
			    </div>
			</nav>
		)
	}
}