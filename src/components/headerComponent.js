/**
 * Created by alexanderbol on 13/04/2017.
 */

import React from 'react';
import logo from '../logo.svg';
import '../App.css';

export const HeaderComponent = (props) => {
    let state = props.store.getState();
    return (
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>{state.app.title}</h2>
        </header>
    )
};