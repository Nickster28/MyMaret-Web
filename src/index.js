/* 
 * FILE: index.js
 * ----------------------
 * The root JS file of this project.  Declares the React Router
 * configuration (what pages to go to for what URLs) and also defines the
 * auto-redirection for login (always redirect to /login if not logged in,
 * and if they go to /login logged in, redirect to /).  Also sets up Redux
 * to manage the data flow.
 * ----------------------
 */

// Import React and React Router components
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRedirect,
		Redirect } from "react-router";

// Import Redux components
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import * as reducers from "./reducers";
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { selectEditionWithId } from "./actions/editions";

// Import the top-level components used
import AppView from "./components/AppView";
import AnalyticsView from "./components/AnalyticsView";
import LoginContainerView from "./containers/LoginContainerView";
import NewspaperEditionsContainerView from
	"./containers/NewspaperEditionsContainerView";
import NewspaperEditionContainerView from
	"./containers/NewspaperEditionContainerView";
import HomeView from "./components/HomeView";
import NotFoundView from "./components/NotFoundView";

/* 
 * Import the necessary bootstrap CSS and JS (JQuery, also required, is
 * imported within the bootstrap js file)
 */
import "./stylesheets/bootstrap.min.css";
import "./bootstrap-modified.js";

/*
 * Create the Redux store with our reducer, react router reducer, 
 * logging+thunk middlewares, and support for the Redux Chrome Devtool.
 */
let store = createStore(
	combineReducers({
		...reducers,
		routing: routerReducer
	}),
	compose(
		applyMiddleware(
			thunkMiddleware,
			createLogger()
		),
		window.devToolsExtension ? window.devToolsExtension() : f => f
	)
);

// Check if user has not logged in yet, and redirect to login page
function requireLogin(nextState, replace) {
	if (!store.getState().authentication.user) {
		replace("/login");
	}
}

// Check if user is already logged in, and redirect to main page
function checkLoginBypass(nextState, replace) {
	if (store.getState().authentication.user) {
		replace("/");
	}
}

// Trigger a "SELECT_EDITION" action when we go to /editions/edition/:id
function selectEdition(nextState, replace) {
	store.dispatch(selectEditionWithId(false, nextState.params.id));
}

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

// Define the app router configuration
ReactDOM.render((
	<Provider store={store}>
		<Router history={history}>
		  	<Route path="/" component={AppView}>
		   		<IndexRedirect to="/editions" />
		   		<Route path="login" component={LoginContainerView}
		   			onEnter={checkLoginBypass} />
		   		<Route component={HomeView}>
		   			<Route path="analytics" component={AnalyticsView}
		   				onEnter={requireLogin} />
		   			<Route path="editions"
		   				component={NewspaperEditionsContainerView}>
		   				<Route path="edition/:id" onEnter={selectEdition}
		   					component={NewspaperEditionContainerView} />
		   			</Route>
		   		</Route>
		   		<Route path="404" component={NotFoundView} />
		  	</Route>
		  	<Redirect from="*" to="/404" />
		</Router>
	</Provider>
), document.getElementById("app"));