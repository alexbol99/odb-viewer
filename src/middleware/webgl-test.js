import Flatten from 'flatten-js';
import * as ActionTypes from '../actions/action-types';
import { Layers } from '../models/layers';
// import { Model } from "../models/model";

// import * as PIXI from 'pixi.js';
import '../models/graphics';

let {point, arc, segment, circle, Polygon} = Flatten;

function zoomHome(shape, stage) {
    let box = shape.box;
    let x = (box.xmin + box.xmax)/2;
    let y = (box.ymin + box.ymax)/2;
    stage.panToCoordinate(x, y);
    stage.zoomToLimits(box.xmax - box.xmin, box.ymax - box.ymin);
}

const webgl_test = ({ dispatch, getState }) => next => action => {

    if (action.type === ActionTypes.MAIN_CANVAS_MOUNTED) {
        if (document.location.pathname === '/webgl_test') {

            let stage = action.stage;
            // let renderer = action.renderer;

            let state = getState();
            let layers = state.layers;

            let layer = Layers.newLayer(stage, layers);
            layer.name = "webgl-demo";
            layer.title = "webgl-demo";

            // let stage = new PIXI.Container();
            stage.width = action.renderer.width;
            stage.height = action.renderer.height;

            // let geoms = [/*point(0,0),
            //     point(100,0),
            //     point(0,100),
            //     point(-100,0),
            //     point(0,-100),*/
            //     segment(-100, 0, 100, 0),
            //     segment(0, -100, 0, 50),
            //     arc(point(0,0),100,Math.PI/4,3*Math.PI/4,true),
            //     circle(point(-50,50), 50)
            // ];
            //
            // for (let geom of geoms) {
            //     layer.add(geom);
            // }


            let polygon = new Polygon();
            polygon.addFace( [
                segment(-500000,-500000, 500000, -500000),
                segment(500000, -500000, 1000000, 1000000),
                segment(1000000,1000000, -1000000, 1000000),
                segment(-1000000,1000000, -500000, -500000)
            ]);
            polygon.addFace([
                circle(point(0,100000), 500000).toArc(true)
            ]);
            layer.add(polygon);

            zoomHome(layer, stage);
            state.layers.push(layer);
        }
    }
    return next(action);
};


export default webgl_test;
