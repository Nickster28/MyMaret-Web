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
	IndexRoute, Redirect } from "react-router";

// Import Redux components
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import * as reducers from "./reducers";
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { fetchEditions, selectEditionWithId } from "./actions/editions";

// Import the top-level components used
import App from "./components/App";
import Analytics from "./components/Analytics";
import LoginContainer from "./containers/LoginContainer";
import EditionsContainer from "./containers/EditionsContainer";
import EditionContainer from "./containers/EditionContainer";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

/* 
 * Import the necessary bootstrap CSS and JS (JQuery, also required, is
 * imported within the bootstrap js file)
 */
import "./stylesheets/bootstrap.min.css";
import "./bootstrap.js";

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

// Tracks whether we just came from /editions
var didJustRedirectFromIndex = false;

/*
 * FUNCTION: onEnterEditionsIndex
 * --------------------------
 * Parameters:
 *		nextState - the state the router will have after this onEnter
 *		replace - a function to use to overwrite the router location
 *		callback - a function to execute when we're done
 *
 * Called when we're entering /editions.  Fetch all editions and, if there are
 * editions, redirect to /editions/edition/:id to show the newest one.
 * Keep track of the index redirect action so when onEnterEdition is
 * called it knows it doesn't need to fetch again.
 * --------------------------
 */
function onEnterEditionsIndex(nextState, replace, callback) {
	store.dispatch(fetchEditions()).then(() => {
		var editionIdsArr =
			store.getState().editionsInfo.editionIdsNewestToOldest;
		var newestEditionId = editionIdsArr.length > 0 ?
			editionIdsArr[0] : null;
		if (newestEditionId) {
			didJustRedirectFromIndex = true;
			replace("/editions/edition/" + newestEditionId);
		}
		callback();
	});
}

/*
 * FUNCTION: onEnterEdition
 * --------------------------
 * Parameters:
 *		nextState - the state the router will have after this onEnter
 *		replace - a function to use to overwrite the router location
 *		callback - a function to execute when we're done
 *
 * Called when we're entering /editions/edition/:id.  If we are entering
 * it *directly* (i.e. not coming from a /editions redirect) then also fetch
 * all editions.  Otherwise don't, since we don't need to fetch twice.  Also
 * check if the :id is a valid edition id.
 * --------------------------
 */
function onEnterEdition(nextState, replace, callback) {
	if (!didJustRedirectFromIndex) {
		store.dispatch(fetchEditions()).then(() => {

			// If this is an invalid ID, redirect to 404
			if (!store.getState().editionsInfo.editions[nextState.params.id]) {
				replace("/404");
			} else if (store.getState().editionsInfo.selectedEditionId !==
				nextState.params.id) {
				// Otherwise, select this edition if we haven't already
				store.dispatch(selectEditionWithId(nextState.params.id));
			}
			callback();
		});
	} else {
		store.dispatch(selectEditionWithId(nextState.params.id));
		didJustRedirectFromIndex = false;
		callback();
	}
}

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

// Define the app router configuration
ReactDOM.render((
	<Provider store={store}>
		<Router history={history}>
		  	<Route path="/" component={App}>
		   		<IndexRedirect to="/editions" />
		   		<Route path="login" component={LoginContainer}
		   			onEnter={checkLoginBypass} />
		   		<Route component={Home}>
		   			<Route path="analytics" component={Analytics}
		   				onEnter={requireLogin} />
		   			<Route path="editions" component={EditionsContainer}>
		   				<IndexRoute onEnter={onEnterEditionsIndex} />
		   				<Route path="edition/:id" component={EditionContainer}
		   					onEnter={onEnterEdition} />
		   			</Route>
		   		</Route>
		   		<Route path="404" component={NotFound} />
		  	</Route>
		  	<Redirect from="*" to="/404" />
		</Router>
	</Provider>
), document.getElementById("app"));