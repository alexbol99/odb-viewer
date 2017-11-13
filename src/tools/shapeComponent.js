/**
 * Created by alexanderbol on 19/06/2017.
 */

import {Component} from 'react';
// import * as createjs from '../../public/easeljs-NEXT.combined.js';
import * as PIXI from 'pixi.js';
import '../models/graphics';

export class ShapeComponent extends Component {
    constructor(params) {
        super();

        let graphics = new PIXI.Graphics();
        this.graphics = params.stage.addChild(graphics);

        // this.vertexShapes = [];
        // this.labelShape = undefined;
        //
        // for (let vertex of params.model.geom.vertices) {
        //     let vertexShape = new createjs.Shape();
        //     vertexShape.geom = vertex;   // augment Shape with geom struct
        //     params.stage.addChild(vertexShape);
        //     this.vertexShapes.push(vertexShape);
        // }
        //
        // if (params.model.label && params.model.label.trim() !== "") {
        //     var html = document.createElement('div');
        //     html.innerText = params.model.label;
        //     html.style.position = "absolute";
        //     html.style.top = 0;
        //     html.style.left = 0;
        //
        //     document.body.appendChild(html);
        //
        //     this.labelShape = new createjs.DOMElement(html);
        //
        //     this.labelShape.geom = params.model.geom;     // augment label Shape with geom struct
        //     params.stage.addChild(this.labelShape);
        // }

        this.state = {
            model: params.model,
            color: params.color,
            displayed: params.displayed,
            displayVertices: params.displayVertices,
            displayLabels: params.displayLabels,
            hovered: params.hovered,
            selected: params.selected,
            widthOn: params.widthOn,
            zoomFactor: params.stage.zoomFactor
        };


        // this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    equalState(nextState) {
        let equal = true;
        for (let key of Object.keys(nextState)) {
            if (nextState[key] !== this.state[key]) {
                equal = false;
                break;
            }
        }
        return equal;
    }

    handleMouseOver(event) {
        this.props.onMouseOver(this.props.model);
    }

    handleMouseOut(event) {
        this.props.onMouseOut();
    }

    handleClick(event) {
        this.props.onClick(this.props.model, this.props.layer);
    }

    // redrawVertices(stroke, fill, alpha) {
    //     let stage = this.props.stage;
    //
    //     for (let vertexShape of this.vertexShapes) {
    //         let vertex = vertexShape.geom;
    //         if (vertexShape.graphics.isEmpty()) {
    //             vertexShape.graphics = vertex.graphics({
    //                 stroke: stroke,     // this.props.color,
    //                 fill: fill,
    //                 radius: 3. / (stage.zoomFactor * stage.resolution)
    //             });
    //         }
    //         else {
    //             vertexShape.graphics.circle.radius = 3. / (stage.zoomFactor * stage.resolution);
    //             vertexShape.graphics.fill.style = fill;
    //         }
    //         vertexShape.alpha = alpha;
    //     }
    // }
    //
    // redrawLabels(showLabel) {
    //     if (!this.labelShape) return;
    //
    //     let stage = this.props.stage;
    //
    //     this.labelShape.htmlElement.style.display = showLabel ? "block" : "none";
    //
    //     let box = this.props.model.geom.box;
    //     let point = {x: (box.xmin + box.xmax) / 2, y: (box.ymin + box.ymax) / 2};
    //     let dx = 6. / (stage.zoomFactor * stage.resolution);
    //     let dy = 4. / (stage.zoomFactor * stage.resolution);
    //
    //     this.labelShape.htmlElement.style.font = "16px Arial";
    //     let unscale = 1. / (stage.zoomFactor * stage.resolution);
    //     let tx = stage.canvas.offsetLeft / (stage.zoomFactor * stage.resolution) + point.x + dx;
    //     let ty = -stage.canvas.offsetTop / (stage.zoomFactor * stage.resolution) + point.y + dy;
    //     this.labelShape.setTransform(tx, ty, unscale, -unscale);
    //
    // }

    redraw() {
        // Draw shape
        let color = (this.props.hovered || this.props.selected) ? "black" : this.props.color;
        let alpha = (this.props.hovered || this.props.selected) ? 1.0 : 0.6;
        let widthOn = this.props.widthOn;
        let fill = (widthOn && !this.props.displayVertices) ? this.props.color : "white";

        let stage = this.props.stage;
        let octColor = Number(`0x${color.substr(1)}`);
        let octFill = Number(`0x${fill.substr(1)}`);

        // this.graphics.clear();
        if (this.graphics.graphicsData.length === 0) {
            this.state.model.geom.graphics(this.graphics, {
                stroke: octColor,
                fill: octFill,
                radius: 3. / (stage.zoomFactor * stage.resolution)
            });
        }
        else {
            for( let data of this.graphics.graphicsData) {
                data.lineColor = octColor;
                data.fillColor = octFill;
            }
            // if (this.shape.graphics.circle) this.shape.graphics.circle.radius =
            //     3. / (stage.zoomFactor * stage.resolution);
        }

        // if (this.shape.graphics.isEmpty()) {
        //     this.shape.graphics = this.state.model.geom.graphics({
        //         stroke: color,
        //         fill: fill,
        //         radius: 3. / (stage.zoomFactor * stage.resolution)
        //     });
        // }
        // else {
        //     if (this.shape.graphics.stroke) this.shape.graphics.stroke.style = color;
        //     if (this.shape.graphics.fill) this.shape.graphics.fill.style = fill;
        //     if (this.shape.graphics.circle) this.shape.graphics.circle.radius =
        //         3. / (stage.zoomFactor * stage.resolution);
        // }
        this.graphics.alpha = this.props.displayed ? alpha : 0.0;

        // let box = this.state.polygon.geom.box;
        // this.shape.cache(box.xmin, box.ymin, box.xmax - box.xmin, box.ymax - box.ymin);

        // Draw vertices
        // alpha = this.props.displayed && this.props.displayVertices ? 1.0 : 0.0;
        // this.redrawVertices(color, color, alpha);

        // Draw labels
        // let showLabel = this.props.displayed && this.props.displayLabels;
        // this.redrawLabels(showLabel);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.graphics.interactive = true;
        this.graphics.on("mouseover", this.handleMouseOver);
        this.graphics.on("mouseout", this.handleMouseOut);
        this.graphics.on("click", this.handleClick);

        this.redraw();
    }

    componentWillReceiveProps(nextProps) {
        // let redraw = (this.state.zoomFactor !== nextProps.zoomFactor &&
        //     nextProps.displayVertices);

        this.setState({
            model: nextProps.model,
            color: nextProps.color,
            displayed: nextProps.displayed,
            displayVertices: nextProps.displayVertices,
            displayLabels: nextProps.displayLabels,
            hovered: nextProps.hovered,
            selected: nextProps.selected,
            widthOn: nextProps.widthOn,
            zoomFactor: nextProps.stage.zoomFactor
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.equalState(nextState)) {
            return false;
        }
        return true;  // nextProps.polygon.parent.needToBeUpdated;
    }

    componentDidUpdate() {
        this.redraw();
    }

    componentWillUnmount() {
        this.vertices = undefined;
        this.graphics.off("mouseover", this.handleMouseOver);
        this.graphics.off("mouseout", this.handleMouseOut);
        this.graphics.off("click", this.handleClick);
    }

    render() {
        return null;
    }
}
