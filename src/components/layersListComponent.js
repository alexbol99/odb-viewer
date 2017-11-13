/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, {Component} from 'react';

// import { ListGroup } from 'react-bootstrap';
import '../App.css';

import {LayerListElement} from './layerListElement';

import * as ActionTypes from '../actions/action-types';
import { Layers } from '../models/layers';

export class LayersListComponent extends Component {
    constructor() {
        super();
        this.onLayerListClicked = this.onLayerListClicked.bind(this);
        this.onLayerClicked = this.onLayerClicked.bind(this);
        this.onLayerDoubleClicked = this.onLayerDoubleClicked.bind(this);
        this.onAddLayerSelected = this.onAddLayerSelected.bind(this);
        this.onAffectedBoxClicked = this.onAffectedBoxClicked.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.height = 0;
    }

    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    }

    onLayerListClicked() {
        this.dispatch({
            type: ActionTypes.LAYER_LIST_PANEL_PRESSED
        });
    }

    onLayerClicked(layer) {
        this.dispatch({
            type: ActionTypes.TOGGLE_DISPLAY_LAYER_PRESSED,
            layer: layer
        });
    }

    onLayerDoubleClicked(layer) {
        // this.dispatch({
        //     type: ActionTypes.EDIT_LAYER_NAME_PRESSED,
        //     layer: layer
        // });
    }

    onAffectedBoxClicked(layer) {
        this.dispatch({
            type: ActionTypes.TOGGLE_AFFECTED_LAYER_PRESSED,
            layer: layer
        });
    }

    onAddLayerSelected() {
        let layer = Layers.newLayer(this.state.stage, this.state.layers);

        this.dispatch({
            type: ActionTypes.ADD_LAYER_PRESSED,
            stage: this.state.stage,
            layer: layer
        })
    }

    handleKeyDown(e) {
        // e.stopPropagation();
        // e.preventDefault();

        if (e.target.parentElement.parentElement &&
            e.target.parentElement.parentElement.id &&
            e.target.parentElement.parentElement.id === "layersList") {


            switch (e.code) {
                case "ArrowRight":
                case "ArrowDown":
                    this.dispatch({
                        type: ActionTypes.LAYERS_LIST_ARROW_DOWN_PRESSED
                    });
                    break;
                case "ArrowLeft":
                case "ArrowUp":
                    this.dispatch({
                        type: ActionTypes.LAYERS_LIST_ARROW_UP_PRESSED
                    });
                    break;
                /* tab does not work properly
            case "Tab":
                if (e.shiftKey) {
                    this.dispatch({
                        type: ActionTypes.LAYERS_LIST_ARROW_UP_PRESSED
                    });
                }
                else {
                    this.dispatch({
                        type: ActionTypes.LAYERS_LIST_ARROW_DOWN_PRESSED
                    });
                }
                break;
                */
                default:
                    break;
            }
        }

    }

    componentDidMount() {
        // Keyboard event
        // var _keydown = _.throttle(this.keydown, 100);
        document.addEventListener('keydown', this.handleKeyDown);
        // var _keyup = _.throttle(this.keyup, 500);
        // document.addEventListener('keyup', this.handleKeyUp);
    }

    componentDidUpdate() {
        this.height = this.refs.layersComponent.clientHeight;
        // let container = this.refs.watchContainer;
        // let parentHeight = container.parentElement.clientHeight;
        // container.style.maxHeight = 0.7*parentHeight;
    }

    render() {
        let addLayer =
            (<div
                style={{padding:4, backgroundColor: "lightgray"}}
                onClick={this.onAddLayerSelected}>
                <h5 style={{margin:0}}>Add layer</h5>
            </div>)

        return (
            <div className="App-layers"
                 ref="layersComponent"
                 onClick={this.onLayerListClicked}
            >
                <h5>Layers</h5>
                <ul id="layersList"
                    style={{maxHeight:0.82*(this.height-40),padding:0,overflow:'auto'}}>
                { this.state.layers.map((layer) =>
                    <LayerListElement
                        onLayerClicked={() => this.onLayerClicked(layer)}
                        onLayerDoubleClicked={() => this.onLayerDoubleClicked(layer)}
                        onAffectedBoxClicked={() => this.onAffectedBoxClicked(layer)}
                        key={layer.name}
                        layer={layer}
                    />)
                }
                </ul>
                {addLayer}
            </div>
        )

    }
}