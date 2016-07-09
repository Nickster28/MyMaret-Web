import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import routes from './modules/routes'
import App from './modules/App'
import About from './modules/About'
import Repos from './modules/Repos'
import Repo from './modules/Repo'
import Home from './modules/Home'

window.onload = function() {
    render(
	   <Router routes={routes} history={browserHistory}/>,
	   document.getElementById('app')
    )
}