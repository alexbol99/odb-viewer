/**
 * Created by alexanderbol on 06/05/2017.
 */

import React, {Component} from 'react';
import '../App.css';
import * as ActionTypes from '../actions/action-types';
// import { debug_str } from '../sample';
import {Layers} from '../models/layers';
// import {Shape} from '../models/shape';

class WatchElement extends Component {
    render() {
        let watch = this.props.shape.watch;
        if (watch === undefined) return null;
        let expandedSign = this.props.shape.expanded ? '-' : '+';
        return (
            <div>
                { this.props.shape.expanded ?
                    watch.map( (edgeWatch, index) => {
                        return (
                            <div
                                key={index}
                                className="Watch-element-title"
                            >
                                <div
                                    style={{flex: 1}}
                                    onClick={(event) => this.props.onToggleWatchExpandButtonClicked(this.props.shape)}>
                                    -
                                </div>
                                <div
                                    title={edgeWatch}
                                    onClick={(event) => this.props.onSelectShapeClicked(this.props.shape)}>
                                    {edgeWatch}
                                </div>
                            </div>
                        )
                    }) :

                    <div className="Watch-element-title"
                    >
                        <div
                            style={{flex: 1}}
                            onClick={(event) => this.props.onToggleWatchExpandButtonClicked(this.props.shape)}>
                            {expandedSign}
                        </div>
                        <div
                            title={watch[0]}
                            onClick={(event) => this.props.onSelectShapeClicked(this.props.shape)}>
                            {watch[0]}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export class AsideComponent extends Component {
    constructor() {
        super();
        this.onToggleWatchExpandButtonClicked = this.onToggleWatchExpandButtonClicked.bind(this);
        this.onSelectShapeClicked = this.onSelectShapeClicked.bind(this);
        // this.addSamplePolygon = this.addSamplePolygon.bind(this);
        this.height = 0;
    }

    onToggleWatchExpandButtonClicked(shape) {
        if (!shape) return;
        this.dispatch({
            type: ActionTypes.TOGGLE_WATCH_EXPAND_CLICKED,
            shape: shape
        });
    }

    onSelectShapeClicked(shape) {
        if (!shape) return;
        this.dispatch({
            type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
            shape: shape
        });
    }

    // addSamplePolygon() {
    //     let parser = this.state.app.parser;
    //     let poly = parser.parseToPolygon(debug_str);
    //     let watch = parser.parseToWatchArray(debug_str);
    //
    //     let shape = new Shape(poly, this.state.stage, {}, watch);
    //
    //     this.dispatch({
    //         type: ActionTypes.NEW_SHAPE_PASTED,
    //         shape: shape
    //     });
    //
    //     this.dispatch({
    //         type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
    //         shape: shape
    //     });
    // }

    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    }

    componentDidUpdate() {
        this.height = this.refs.aside.clientHeight;
        // let container = this.refs.watchContainer;
        // let parentHeight = container.parentElement.clientHeight;
        // container.style.maxHeight = 0.7*parentHeight;
    }

    render() {
        let layer = Layers.getAffected(this.state.layers);
        let shapes = layer ? [...layer.shapes] : undefined;
        let title = layer ? layer.title : "";
        let watchContainerHeight = 0.75*this.height;
        return (
            <aside className="App-aside" ref="aside">
                <h5>Info</h5>
                {/*<h3>... or paste data here</h3>*/}
                <h5>{title}</h5>
                <div
                    className="Watch-container"
                    style={{maxHeight:watchContainerHeight}}
                >
                    {
                        shapes ?
                            shapes.map((shape, index) =>
                                <WatchElement
                                    key={index}
                                    shape={shape}
                                    onToggleWatchExpandButtonClicked={this.onToggleWatchExpandButtonClicked}
                                    onSelectShapeClicked={this.onSelectShapeClicked}
                                />
                            ) : null
                    }
                </div>
                {/*<button className="Aside-add-sample-polygon"*/}
                     {/*onClick={this.addSamplePolygon}*/}
                {/*>*/}
                    {/*Add sample polygon*/}
                {/*</button>*/}
            </aside>
        )
    }
}