import React from 'react';
import NavigationBar from './NavigationBar';
import '../stylesheets/Home.css';

export default function Home(props) {
    return (
        <div>
            <NavigationBar />
            <div id="home" className="container-fluid">
                {props.children}
            </div>
        </div>
    )
}