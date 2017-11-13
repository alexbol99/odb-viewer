/**
 * Created by alexanderbol on 20/04/2017.
 */

import { Layer } from '../models/layer';

const colors = [
    "#FF0303",
    "#4AA403",
    "#540080",
    "#FFFF40",
    "#FF0080",
    "#AED424",
    "#545400",
    "#FFA980",
    "#A95480",
    "#A9A9FF",
    "#00FF00",
    "#FFEE76",
    "#A40576",
    "#4385C8",
    "#1CC826",
    "#BDBD00",
    "#48316E",
    "#14616E",
    "#8040BD",
    "#DC7676",
    "#924845",
    "#A90000",
    "#FFA900"
];

export class Layers {

    static newLayer(stage, layers) {
        let layer = new Layer(stage);
        layer.name = Layers.getNewName(layers);
        if (layers.length === 0) { // first layer
            layer.color = Layers.getNextColor(layers);
            layer.displayed = true;
            layer.affected = true;
        }
        return layer;
    }

    static get defaultName() {
        return "layer";
    }

    static getNewName(layers) {
        let name = Layers.defaultName;
        let inc = 1;
        let comparator = (layer) => layer.name === name;
        while (layers.find(comparator) ) {
            name = Layers.defaultName + inc;
            inc++;
        }
        return name;
    }

    static getAffected(layers) {
        return layers.find((lay) => lay.affected);
    }

    static getNextColor(layers) {
        let color = "";
        for (let col of colors) {
            if (!layers.find((layer) =>
                layer.displayed && layer.color === col)) {
                color = col;
                break;
            }
        }
        return color;
    }
}