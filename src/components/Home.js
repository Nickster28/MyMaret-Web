import React from 'react';
import NavBar from './NavBar';
import '../stylesheets/Home.css';

export default function Home(props) {
    return (
        <div>
            <NavBar />
            <div id="home" className="container-fluid">
                {props.children}
            </div>
        </div>
    )
}