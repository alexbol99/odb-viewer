/**
 * Created by alexanderbol on 13/04/2017.
 */

import * as ActionTypes from './actions/action-types';
import {combineReducers} from 'redux';

import Flatten from 'flatten-js';

import {Layers} from './models/layers';
// import {Parser} from './models/parser';

const unitsList = [
    {
        name: "pixels",
        decimals: 0,
        divisor: 1
    },
    {
        name: "inch",
        decimals: 7,
        divisor: 10160000
    },
    {
        name: "mm",
        decimals: 6,
        divisor: 400000
    }];

const defaultAppState = {
    title: "ODB Viewer",
    units: "pixels",
    decimals: 0,
    divisor: 1,
    bg: "#F1F1F1",
    hoveredShape: null,
    /*parser: new Parser(),*/
    widthOn: true,
    displayVertices: false,
    displayLabels: true,
    measurePointsActive: false,
    measureShapesActive: false,
    measureShapesFirstClick: true,
    firstMeasuredShape: null,
    secondMeasuredShape: null,
    firstMeasuredLayer: null,
    secondMeasuredLayer: null,
    distance: undefined,
    shortestSegment: null,
    renderer: null,
    zoomFactor: undefined,
    originX: undefined,
    originY: undefined
};

const defaultMouseState = {
    x: 0,
    y: 0,
    startX: undefined,
    startY: undefined
};

function app(state = defaultAppState, action) {
    switch (action.type) {
        case ActionTypes.MAIN_CANVAS_MOUNTED:
            return Object.assign({}, state, {
                renderer: action.renderer,
                zoomFactor: action.stage.zoomFactor * action.stage.resolution,
                originX: action.stage.origin.x,
                originY: action.stage.origin.y
            });
        case ActionTypes.MOUSE_WHEEL_MOVE_ON_STAGE:
        case ActionTypes.PAN_AND_ZOOM_TO_SHAPE:
            return Object.assign({}, state, {
                zoomFactor: action.stage.zoomFactor * action.stage.resolution,
                originX: action.stage.origin.x,
                originY: action.stage.origin.y
            });
        case ActionTypes.MOUSE_MOVED_ON_STAGE:
            return Object.assign({}, state, {
                originX: action.stage.origin.x,
                originY: action.stage.origin.y
            });
        // case ActionTypes.STAGE_UPDATED:
        //     return state;
        case ActionTypes.TOGGLE_UNITS_CLICKED:
            let curUnitsId = unitsList.findIndex(units => state.units === units.name);
            let newUnits = unitsList[(curUnitsId + 1) % 3];
            return Object.assign({}, state, {
                units: newUnits.name,
                decimals: newUnits.decimals,
                divisor: newUnits.divisor
            });
        case ActionTypes.MOUSE_ROLL_OVER_SHAPE:
            return Object.assign({}, state, {
                hoveredShape: state.measureShapesActive ? action.shape : null
            });
        case ActionTypes.MOUSE_ROLL_OUT_SHAPE:
            return Object.assign({}, state, {
                hoveredShape: null
            });
        case ActionTypes.MOUSE_CLICKED_ON_SHAPE:
            if (!state.measureShapesActive) {
                return state;
            }
            // measureShapesActive

            if (state.measureShapesFirstClick) {
                return Object.assign({}, state, {
                    firstMeasuredShape: action.shape,
                    firstMeasuredLayer: action.layer,
                    secondMeasuredShape: null,
                    secondMeasuredLayer: null,
                    measureShapesFirstClick: false,
                    distance: undefined,
                    shortestSegment: null
                })
            }
            else {    // second click
                if (action.shape === state.firstMeasuredShape) {
                    return state;  // second click on the same shape
                }

                let shape1 = state.firstMeasuredShape.geom;
                let shape2 = action.shape.geom;
                let distance, shortestSegment;
                // if (shape1 instanceof Flatten.Polygon && shape2 instanceof Flatten.Polygon) {
                //     [distance, shortestSegment] = Flatten.Distance.polygon2polygon(shape1, shape2);
                // }
                // else {
                    [distance, shortestSegment] = Flatten.Distance.distance(shape1, shape2);
                // }


                return Object.assign({}, state, {
                    secondMeasuredShape: action.shape,
                    secondMeasuredLayer: action.layer,
                    measureShapesFirstClick: true,
                    distance: distance,
                    shortestSegment: shortestSegment
                });
            }
        case ActionTypes.PAN_BY_DRAG_BUTTON_CLICKED:
            return Object.assign({}, state, {
                measurePointsActive: false,
                measureShapesActive: false,
                measureShapesFirstClick: true,
                firstMeasuredShape: null,
                firstMeasuredLayer: null,
                secondMeasuredShape: null,
                secondMeasuredLayer: null,
                distance: undefined,
                shortestSegment: null
            });
        case ActionTypes.TOGGLE_WIDTH_MODE_CLICKED:
            return Object.assign({}, state, {
                widthOn: !state.widthOn,
                displayVertices: state.widthOn ? state.displayVertices : false
            });
        case ActionTypes.TOGGLE_DISPLAY_VERTICES_CLICKED:
            if (state.displayVertices) {
                return Object.assign({}, state, {
                    displayVertices: false
                });
            }
            else {
                return Object.assign({}, state, {
                    widthOn: false,
                    displayVertices: true
                });
            }

        case ActionTypes.TOGGLE_DISPLAY_LABELS_CLICKED:
            return Object.assign({}, state, {
                displayLabels: !state.displayLabels
            });

        case ActionTypes.MEASURE_POINTS_BUTTON_PRESSED:
            return Object.assign({}, state, {
                measurePointsActive: true,
                measureShapesActive: false,
                measureShapesFirstClick: true,
                firstMeasuredShape: null,
                firstMeasuredLayer: null,
                secondMeasuredShape: null,
                secondMeasuredLayer: null,
                distance: undefined,
                shortestSegment: null
            });
        case ActionTypes.MEASURE_SHAPES_BUTTON_PRESSED:
            return Object.assign({}, state, {
                measurePointsActive: false,
                measureShapesActive: true,
                measureShapesFirstClick: true,
                firstMeasuredShape: null,
                firstMeasuredLayer: null,
                secondMeasuredShape: null,
                secondMeasuredLayer: null,
                distance: undefined,
                shortestSegment: null
            });
        case ActionTypes.LAYER_LIST_PANEL_PRESSED:
            return state;  // only to cause refresh of layers list component
        default:
            return state;
    }
}

function layers(state = [], action) {
    let curLayer = state.find(layer => layer.affected);
    let curLayerId = state.findIndex(layer => layer.affected);

    switch (action.type) {
        /*
        case ActionTypes.NEW_STAGE_CREATED:
            return [...state, action.layer];
            */

        case ActionTypes.ADD_LAYER_PRESSED:
            return [...state, action.layer];

        case ActionTypes.TOGGLE_DISPLAY_LAYER_PRESSED:
            let color = "";
            if (!action.layer.displayed) {
                color = Layers.getNextColor(state);
                if (color === "") return;  // no free colors
            }
            return state.map((layer) => {
                if (layer !== action.layer) {
                    // if action.layer will be undisplayed,
                    // it cannot become affected, then
                    // keep affected on this layer
                    if (action.layer.displayed) {
                        return layer;
                    }
                    else {
                        return layer.setAffected(false);
                    }
                }
                else {
                    let newLayer = layer.toggleDisplayed(color);
                    newLayer.affected = newLayer.displayed;
                    return newLayer;
                }
                // return layer.toggleDisplayed(color);
            });

        case ActionTypes.TOGGLE_AFFECTED_LAYER_PRESSED:
            return state.map((layer) => {
                if (layer !== action.layer) {
                    return layer.setAffected(false);
                }
                else {
                    return layer.setAffected(!layer.affected);
                }
            });

        case ActionTypes.NEW_SHAPE_PASTED:
            return state.map((layer) => {
                if (layer.affected) {
                    return layer.add(action.shape);
                }
                else {
                    return layer;
                }
            });

        case ActionTypes.TOGGLE_WATCH_EXPAND_CLICKED:
            return state.map((layer) => {
                if (layer.affected) {
                    return layer.toggleExpanded(action.shape);
                }
                else {
                    return layer;
                }
            });

        case ActionTypes.EDIT_LAYER_NAME_PRESSED:
            return state.map((layer) => {
                if (layer !== action.layer) {
                    return layer;
                }
                return Object.assign({}, layer, {
                    edited: true,
                })

            });

        case ActionTypes.LAYERS_LIST_ARROW_DOWN_PRESSED:
            if (curLayerId === state.length - 1) {
                return state;
            }
            else {

                let nextLayer = state[curLayerId + 1];

                return state.map(layer => {
                    if (layer === curLayer) {
                        let newCurLayer = layer.toggleDisplayed("")
                        newCurLayer.affected = false;
                        return newCurLayer;
                    }
                    else if (layer === nextLayer) {
                        let color = curLayer.color;
                        let newNextLayer = layer.toggleDisplayed(color);
                        newNextLayer.affected = true;
                        return newNextLayer;
                    }
                    else {
                        return layer;
                    }
                });
            }

        case ActionTypes.LAYERS_LIST_ARROW_UP_PRESSED:
            if (curLayerId === 0) {
                return state;
            }
            else {
                let nextLayer = state[curLayerId - 1];

                return state.map(layer => {
                    if (layer === curLayer) {
                        let newCurLayer = layer.toggleDisplayed("");
                        newCurLayer.affected = false;
                        return newCurLayer;
                    }
                    else if (layer === nextLayer) {
                        let newNextLayer = layer.toggleDisplayed(curLayer.color);
                        newNextLayer.displayed = true;
                        newNextLayer.affected = true;
                        return newNextLayer;
                    }
                    else {
                        return layer;
                    }
                });
            }

        // case ActionTypes.MOUSE_MOVED_ON_STAGE:
        //     if (action.dx !== undefined && action.dy !== undefined) {
        //         return state.map( layer =>
        //             layer.setTransform(action.stage.origin, action.stage.zoomFactor))
        //     }
        //     else {
        //         return state;
        //     }

        // case ActionTypes.PAN_AND_ZOOM_TO_SHAPE:
        // case ActionTypes.MOUSE_WHEEL_MOVE_ON_STAGE:
        //     return state.map(layer =>
        //         layer.setTransform(action.stage.origin, action.stage.zoomFactor));

        default:
            return state;
    }
}

function stage(state = null, action) {
    switch (action.type) {
        case ActionTypes.NEW_STAGE_CREATED:
        case ActionTypes.MAIN_CANVAS_MOUNTED:
            return action.stage;

        default:
            return state;
    }
}

function mouse(state = defaultMouseState, action) {
    switch (action.type) {
        case ActionTypes.MOUSE_MOVED_ON_STAGE:
            return Object.assign({}, state, {
                x: action.x,
                y: action.y
            });
        case ActionTypes.MOUSE_DOWN_ON_STAGE:
            return Object.assign({}, state, {
                startX: action.x,
                startY: action.y
            });
        case ActionTypes.MOUSE_UP_ON_STAGE:
            return Object.assign({}, state, {
                startX: undefined,
                startY: undefined
            });
        default:
            return state;
    }
}

export let reducer = combineReducers({
    app,
    layers,
    stage,
    mouse
});
