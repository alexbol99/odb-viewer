import Flatten from 'flatten-js';

// import * as PIXI from 'pixi.js';

let {Point, Segment, Circle, Arc, Polygon} = Flatten;

/* Provide conversion methods from FlattenJS objects to PIXI Graphics */

Point.prototype.graphics = function (graphics, style) {
    let radius = (style && style.radius) ? style.radius : 3;
    let fill = style && style.fill ? style.fill : 0xFF0303;
    return graphics
        .lineStyle(0)
        .beginFill(fill)
        .drawCircle(this.x, this.y, radius)
        .endFill();
};

Segment.prototype.graphics = function (graphics, style) {
    let lineWidth = style && style.lineWidth ? style.lineWidth : 2;
    let lineColor = style && style.lineColor ? style.lineColor : 0xFF0303;
    return graphics
        .lineStyle(lineWidth, lineColor)
        .moveTo(this.ps.x, this.ps.y)
        .lineTo(this.pe.x, this.pe.y)
};

Arc.prototype.graphics = function (graphics, style) {
    let startAngle = 2 * Math.PI - this.startAngle;
    let endAngle = 2 * Math.PI - this.endAngle;
    let lineWidth = style && style.lineWidth ? style.lineWidth : 2;
    let lineColor = style && style.lineColor ? style.lineColor : 0xFF0303;
    return graphics
        .lineStyle(lineWidth, lineColor, 1)
        .arc(this.pc.x, this.pc.y, this.r, startAngle, endAngle, this.counterClockwise);
};

Circle.prototype.graphics = function (graphics, style) {
    let lineWidth = style && style.lineWidth ? style.lineWidth : 1;
    let lineColor = style && style.lineColor ? style.lineColor : 0xFF0303;
    let fillColor = style && style.fill ? style.fill : 0xFF0303;
    return graphics
        .lineStyle(lineWidth, lineColor)
        .beginFill(fillColor)
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
    let lineWidth = style && style.lineWidth ? style.lineWidth : 1;
    let lineColor = style && style.lineColor ? style.lineColor : 0xFF0303;
    let fill = style && style.fill ? style.fill : 0xFF0303;
    let fillAlpha = style && style.fillAlpha !== undefined ? style.fillAlpha : 1;

    graphics.beginFill(fill, fillAlpha);
    graphics.lineStyle(lineWidth, lineColor, 1);

    for (let face of this.faces) {
        setGraphicsFace(graphics, face);
    }

    graphics.endFill();
    return graphics;
};

