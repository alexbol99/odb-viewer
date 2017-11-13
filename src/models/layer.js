/**
 * Created by alexanderbol on 17/04/2017.
 */

import Flatten from 'flatten-js';
// import { Shape } from '../models/shape';
import { Model } from './model';

export class Layer {
    constructor(stage) {
        // super();
        // cannot define Layer as extension of PlanarSet due to bug in compiler ?
        this.stage = stage;
        this.shapes = [];         // new Flatten.PlanarSet();
        this.name = "";
        this.color = "";
        this.title = "";
        this.displayed = false;
        this.edited = false;
        this.affected = false;
    }

    clone() {
        let layer = new Layer(this.stage);
        return Object.assign(layer, this);
    }

    add(shape) {
        if (shape instanceof Model) {
            this.shapes.push(shape);       // add(shape)
        }
        else {
            let geom = shape;
            let newShape = new Model(geom) // , this.stage);
            this.shapes.push(newShape);     // add(newShape);
        }
        return this;
    }

    get box() {
        let box = new Flatten.Box();
        for (let shape of this.shapes) {
            box = box.merge(shape.box);
        }
        return box;
    }

    get center() {
        let box = this.box;
        return new Flatten.Point((box.xmin + box.xmax)/2, (box.ymin + box.ymax)/2);
    }

    toggleDisplayed(color) {
        let displayed = !this.displayed;
        return Object.assign(this.clone(),
            {
                displayed : displayed,
                color: color
            });
    }

    setAffected(affected) {
        return Object.assign(this.clone(),
            {
                affected : affected
            });
    }

    setAlpha() {
        for(let shape of this.shapes) {
            shape.alpha = this.displayed ? 1 : 0;
        }
        return this.shapes;
    }

    toggleExpanded(shapeToggle) {
        for(let shape of this.shapes) {
            if (shape === shapeToggle) {
                shape.expanded = !shape.expanded;
            }
        }
        return this;
    }
}