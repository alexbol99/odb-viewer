import Flatten from 'flatten-js';

let {Box} = Flatten;

export class Job {
    constructor() {
        this.filename = "";
        this.title = "";
        this.profiles = [];   // array of FlattenJS Polygons
        this.materials = [];  // array of FlattenJS Polygons
        this.shapes = [];     // array of other FlattenJS shapes
    }

    get box() {
        let b = new Box();
        for (let shape of this.profiles) {
            b.merge(shape.box);
        }
        for (let shape of this.materials) {
            b.merge(shape.box);
        }
        for (let shape of this.shapes) {
            b.merge(shape.box);
        }
        return b;
    }
}