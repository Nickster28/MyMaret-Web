/* FILE: index.js
 * ----------------------
 * The root JS file of this project.  Declares the React Router
 * configuration (what pages to go to for what URLs) and also defines the
 * auto-redirection for login (always redirect to /login if not logged in,
 * and if they go to /login logged in, redirect to /).
 * ----------------------
 */

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRedirect, Redirect } from "react-router";
import Parse from "./ParseWrapper";

// Import the top-level components used
import App from "./components/App";
import Analytics from "./components/Analytics";
import Login from "./components/Login";
import Editions from "./components/Editions";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

/* Import the necessary bootstrap CSS and JS (JQuery, also required, is
 * included in a script tag in index.html)
 */
import "./stylesheets/bootstrap.min.css";
import "./bootstrap.min.js";


// Check if user has not logged in yet, and redirect to login page
function requireLogin(nextState, replace) {
	if (!Parse.User.current()) {
		replace({
			pathname: "/login"
		});
	}
}

// Check if user is already logged in, and redirect to main page
function checkLoginBypass(nextState, replace) {
	if (Parse.User.current()) {
		replace({
			pathname: "/"
		});
	}
}

// Define the app router configuration
ReactDOM.render((
	<Router history={browserHistory}>
	  	<Route path="/" component={App}>
	   		<IndexRedirect to="/analytics" />
	   		<Route path="login" component={Login} onEnter={checkLoginBypass} />
	   		<Route component={Home}>
	   			<Route path="editions" component={Editions} onEnter={requireLogin} />
	   			<Route path="analytics" component={Analytics} onEnter={requireLogin} />
	   		</Route>
	  	</Route>
		<Route path="404" component={NotFound} />
	  	<Redirect from="*" to="/404" />
	</Router>
), document.getElementById("app"));