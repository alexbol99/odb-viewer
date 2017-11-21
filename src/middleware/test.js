import * as ActionTypes from '../actions/action-types';
import { Layers } from '../models/layers';
// import { Model } from "../models/model";

import { Parser } from '../models/parser';

// let {point, arc, segment, circle, Polygon} = Flatten;

function zoomHome(shape, stage) {
    let box = shape.box;
    let x = (box.xmin + box.xmax)/2;
    let y = (box.ymin + box.ymax)/2;
    stage.panToCoordinate(x, y);
    stage.zoomToLimits(box.xmax - box.xmin, box.ymax - box.ymin);
}

const demo = ({ dispatch, getState }) => next => action => {

    if (action.type === ActionTypes.MAIN_CANVAS_MOUNTED) {
        if (document.location.href.split('#')[1] === 'test1') {
            // console.log(document.location.pathname);
            // console.log(getState());

            let stage = action.stage;
            let state = getState();
            let parser = new Parser();
            let layers = state.layers;
            let layer = Layers.newLayer(stage, layers);
            layer.name = "test1";
            layer.title = "test1";

            let xhr = new XMLHttpRequest();
            xhr.open('GET',process.env.PUBLIC_URL + 'polygon.txt',true);
            xhr.onreadystatechange = function(event) {
                if (this.readyState == 4 && this.status == 200) {
                    let text = this.responseText;
                    // let text = atob(binStr.split(',')[1]);
                    let polygon = parser.parseToPolygon(text);
                    layer.add(polygon);

                    zoomHome(layer, stage);
                    state.layers.push(layer);

                    dispatch({
                        type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
                        stage: stage,
                        shape: layer
                    })
                }
            };
            xhr.send();
        }
    }
    return next(action);
};


export default demo;
