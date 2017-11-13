
let defaultStyle = {
    strokeStyle: 1,
    stroke: "#FF0303",
    fill: "#FF0303",
    alpha: 1.0
};

/* Class Model represents data model that will be added to layer */
export class Model {
    constructor(geom = undefined, style = undefined, label = "") {
        this.geom = geom;
        this.style = style || defaultStyle;
        this.label = label;
    }

    clone() {
        let model = new Model(this.geom, this.style);
        return Object.assign(model, this);
    }

    get box() {
        return this.geom.box;
    }
/*
    static transformPoint(pt, stage) {
        return new Flatten.Point(stage.W2C_X(pt.x), stage.W2C_Y(pt.y));
    }

    static transformSegment(segment, stage) {
        return new Flatten.Segment(
            Model.transformPoint(segment.ps, stage),
            Model.transformPoint(segment.pe, stage)
        )
    }

    static transformArc(arc, stage) {
        return new Flatten.Arc(
            Model.transformPoint(arc.pc, stage),
            stage.W2C_Scalar(arc.r),
            arc.startAngle,
            arc.endAngle,
            arc.counterClockwise
        )
    }

    static transformEdge(shape, stage) {
        if (shape instanceof Flatten.Segment) {
            return Model.transformSegment(shape, stage);
        }
        else if (shape instanceof Flatten.Arc) {
            return Model.transformArc(shape, stage);
        }
    }

    static transformFace(face, stage) {
        // Get shapes of face as array
        let shapes = [];
        for (let edge of face) {
            shapes.push(edge.shape);
        }

        // Transform array of edges
        return shapes.map(shape => Model.transformEdge(shape, stage));
    }

    static transformPolygon(polygon, stage) {
        let newPolygon = new Flatten.Polygon();
        let shapes = [];
        for (let face of polygon.faces) {
            shapes = Model.transformFace(face, stage);
            newPolygon.addFace(shapes);
        }
        return newPolygon;
    }
*/
}
