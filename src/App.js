import React, { Component } from 'react';
import './App.css';

import { HeaderComponent } from './components/headerComponent';
import { MainComponent } from './components/mainComponent';
import { LayersListComponent } from './components/layersListComponent';
import { AsideComponent } from './components/asideComponent';

// import * as ActionTypes from './actions/action-types';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.store.getState();
        this.props.store.subscribe(() => {
            this.setState(this.props.store.getState());
        });
    }

    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    }

    render() {
        return (
            <div className="App">
                <HeaderComponent {... this.props } />
                <div className="App-body">
                    <MainComponent {... this.props } />
                    <LayersListComponent {... this.props} />
                    <AsideComponent {... this.props} />
                </div>
            </div>
        );
    }
}

export default App;
