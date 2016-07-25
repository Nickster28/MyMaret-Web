/* FUNCTION: Home
 * ----------------------------
 * A component for the main Home screen, which displays the top navigation
 * bar and below it whatever page the user is viewing.
 *
 * Note that this is just a function because Home has no
 * internal state - it is merely a function of props, so we can declare
 * it as a function instead of a class.
 * ----------------------------
 */
import React from "react";
import NavigationBar from "./NavigationBar";
import "../stylesheets/Home.css";

export default function Home(props) {
    return (
        <div>
            <NavigationBar />
        {/* Make this .container-fluid to properly display 
        	any child Bootstrap elements */}
            <div id="home" className="container-fluid">
                {props.children}
            </div>
        </div>
    )
}