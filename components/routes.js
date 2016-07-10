import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './App.js'

function requireLogin(nextState, replace) {
	
}

module.exports = (
  <Route path="/" component={App}>
  	<IndexRoute component={Home}/>
  	<Route path="login" component={LogIn}/>
  	<Route path="newspaper" component={Newspaper}/>
  </Route>
)