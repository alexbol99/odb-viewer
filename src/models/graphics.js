import Flatten from 'flatten-js';

// import * as PIXI from 'pixi.js';

let {Point, Segment, Circle, Arc, Polygon} = Flatten;

/* Provide conversion methods from FlattenJS objects to PIXI Graphics */

Point.prototype.graphics = function (graphics, style) {
    let radius = (style && style.radius) ? style.radius : 3;
    let color = style && style.fill ? style.fill : 0xFF0303;
    // let graphics = new PIXI.Graphics();
    // graphics.fill = graphics.beginFill(fill).command;
    // graphics.circle = graphics.drawCircle(this.x, this.y, radius).command;
    return graphics
        .clear()
        .lineStyle(0)
        .beginFill(color)
        .drawCircle(this.x, this.y, radius)
        .endFill();
};

Segment.prototype.graphics = function (graphics, style) {
    // let graphics = new PIXI.Graphics();
    let strokeStyle = style && style.strokeStyle ? style.strokeStyle : 2;
    let color = style && style.stroke ? style.stroke : 0;
    return graphics
        .clear()
        .lineStyle(strokeStyle, color)
        .moveTo(this.ps.x, this.ps.y)
        .lineTo(this.pe.x, this.pe.y)
};

Arc.prototype.graphics = function (graphics, style) {
    let startAngle = 2 * Math.PI - this.startAngle;
    let endAngle = 2 * Math.PI - this.endAngle;
    // let graphics = new PIXI.Graphics();
    let strokeStyle = style && style.strokeStyle ? style.strokeStyle : 2;
    let color = style && style.stroke ? style.stroke : 0;
    return graphics
        .clear()
        .lineStyle(strokeStyle, color)
        .arc(this.pc.x, this.pc.y, this.r, startAngle, endAngle, this.counterClockwise);
};

Circle.prototype.graphics = function (graphics, style) {
    // let graphics = new PIXI.Graphics();
    let strokeStyle = style && style.strokeStyle ? style.strokeStyle : 2;
    let color = style && style.stroke ? style.stroke : 0;
    // graphics.setStrokeStyle(2).beginStroke("black").beginFill("red").drawCircle(pcx, pcy, r);
    return graphics
        .clear()
        .lineStyle(strokeStyle, color)
        .beginFill(color)
        .drawCircle(this.pc.x, this.pc.y, this.r)
        .endFill();
};

function setGraphicsEdgeSegment(graphics, segment) {
    graphics.lineTo(segment.pe.x, segment.pe.y);
}

function setGraphicsEdgeArc(graphics, arc) {
    graphics.arc(arc.pc.x, arc.pc.y, arc.r, arc.startAngle, arc.endAngle, !arc.counterClockwise);
}

function setGraphicsEdge(graphics, edge) {
    if (edge.shape instanceof Segment) {
        setGraphicsEdgeSegment(graphics, edge.shape);
    }
    else if (edge.shape instanceof Arc) {
        setGraphicsEdgeArc(graphics, edge.shape);
    }
}

function setGraphicsFace(graphics, face) {
    let ps = face.first.start;
    graphics.moveTo(ps.x, ps.y);

    for (let edge of face) {
        setGraphicsEdge(graphics, edge);
    }
}

Polygon.prototype.graphics = function (graphics, style) {
    // let graphics = new PIXI.Graphics();
    let strokeStyle = style && style.strokeStyle ? style.strokeStyle : 1;
    let stroke = style && style.stroke ? style.stroke : 0xFF0303;
    let fill = style && style.fill ? style.fill : 0xFF0303;
    // graphics.setStrokeStyle(strokeStyle,0,0,10,true);
    // graphics.stroke = graphics.beginStroke(stroke).command;
    // graphics.fill = graphics.beginFill(fill).command;

    graphics
        .clear()
        .lineStyle(strokeStyle, stroke)
        .beginFill(fill);

    for (let face of this.faces) {
        setGraphicsFace(graphics, face);
    }

    graphics.endFill();
    return graphics;
};

