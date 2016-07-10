import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRedirect } from 'react-router'
import Parse from 'Parse'
import App from './components/App'
import Analytics from './components/Analytics'
import Login from './components/Login'
import Newspaper from './components/Newspaper'

function requireLogin(nextState, replace) {
	if (!Parse.User.current()) {
		replace({
			pathname: '/login'
		});
	}
}

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
	   		<IndexRedirect to="/analytics"/>
	   		<Route path="login" component={Login} onEnter={checkLoginBypass}/>
	   		<Route path="newspaper" component={Newspaper} onEnter={requireLogin}/>
	   		<Route path="analytics" component={Analytics} onEnter={requireLogin}/>
	   	</Route>
	  </Router>
  ), document.getElementById('app'))
}