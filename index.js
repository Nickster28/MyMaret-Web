import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './components/App'

window.onload = function() {
  render((
	  <Router history={browserHistory}>
	   	<Route path="/" component={App}>
	   		<IndexRoute component={Home}/>
	   		<Route path="/login" component={LogIn}/>
	   		<Route path="/newspaper" component={Newspaper}/>
	   	</Route>
	  </Router>
  ), document.getElementById('app'))
}