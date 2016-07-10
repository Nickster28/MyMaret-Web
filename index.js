import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRedirect, Redirect } from 'react-router'
import Parse from 'Parse'
import App from './components/App'
import Analytics from './components/Analytics'
import Login from './components/Login'
import Newspaper from './components/Newspaper'
import Home from './components/Home'
import NotFound from './components/NotFound'

Parse.User.current = function() { return true; }

// Check if user has not logged in yet, and redirect to login page
function requireLogin(nextState, replace) {
	if (!Parse.User.current()) {
		replace({
			pathname: '/login'
		});
	}
}

// Check if user is already logged in, and redirect to main page
function checkLoginBypass(nextState, replace) {
	if (Parse.User.current()) {
		replace({
			pathname: '/'
		});
	}
}

window.onload = function() {
	Parse.initialize("mymaret-api-prod");

  render((
	  <Router history={browserHistory}>
	   	<Route path="/" component={App}>
	   		<IndexRedirect to="/analytics" />
	   		<Route path="login" component={Login} onEnter={checkLoginBypass} />
	   		<Route component={Home}>
	   			<Route path="newspaper" component={Newspaper} onEnter={requireLogin} />
	   			<Route path="analytics" component={Analytics} onEnter={requireLogin} />
	   		</Route>
	   	</Route>
	   	<Route path='404' component={NotFound} />
	   	<Redirect from='*' to='/404' />
	  </Router>
  ), document.getElementById('app'))
}