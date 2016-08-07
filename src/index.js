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
import { Router, Route, browserHistory, IndexRedirect, Redirect } from "react-router";

// Import Redux components
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import rootReducer from "./reducers";

// Import the top-level components used
import App from "./components/App";
import Analytics from "./components/Analytics";
import LoginContainer from "./containers/LoginContainer";
import Editions from "./components/Editions";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

/* 
 * Import the necessary bootstrap CSS and JS (JQuery, also required, is
 * included in a script tag in index.html)
 */
import "./stylesheets/bootstrap.min.css";
import "./bootstrap.min.js";

/*
 * Create the Redux store with our reducer, logging+thunk middleware, and
 * support for the Redux Chrom Devtool.
 */
let store = createStore(
	rootReducer,
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
		console.log("Redirecting to login");
		replace({
			pathname: "/login"
		});
	}
}

// Check if user is already logged in, and redirect to main page
function checkLoginBypass(nextState, replace) {
	if (store.getState().authentication.user) {
		console.log("Redirecting to main page");
		replace({
			pathname: "/"
		});
	}
}

// Define the app router configuration
ReactDOM.render((
	<Provider store={store}>
		<Router history={browserHistory}>
		  	<Route path="/" component={App}>
		   		<IndexRedirect to="/analytics" />
		   		<Route path="login" component={LoginContainer} onEnter={checkLoginBypass} />
		   		<Route component={Home}>
		   			<Route path="editions" component={Editions} onEnter={requireLogin} />
		   			<Route path="analytics" component={Analytics} onEnter={requireLogin} />
		   		</Route>
		  	</Route>
			<Route path="404" component={NotFound} />
		  	<Redirect from="*" to="/404" />
		</Router>
	</Provider>
), document.getElementById("app"));