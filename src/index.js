import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import { reducer } from './reducer';
import log from './middleware/log';
import readFiles from './middleware/readFiles';
import stageController from './middleware/stageController';
import test from './middleware/test';
import webgl_test from './middleware/webgl-test';

const store = createStore(reducer, compose(applyMiddleware(
    log,
    readFiles,
    test,
    webgl_test,
    stageController
)));

ReactDOM.render(
    <App store={store} />,
    document.getElementById('root')
);
registerServiceWorker();
