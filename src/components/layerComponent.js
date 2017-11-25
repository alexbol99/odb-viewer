import {Component} from 'react';
// import {ShapeComponent} from '../tools/shapeComponent';
// import {ImageComponent} from "../tools/imageComponent";
import * as PIXI from 'pixi.js';
import '../models/graphics';
import Utils from "../utils";

export class LayerComponent extends Component {
    constructor(params) {
        super();

        let container = new PIXI.Container();
        this.container = params.stage.addChild(container);

        this.graphics = undefined;
        this.vertices = undefined;
        this.labels = undefined;
        this.oldProps = undefined;
        this.oldWidthOn = undefined;
    }

     pointTexture(fillColor) {
        let pointGraphics = new PIXI.Graphics();
        pointGraphics
            .beginFill(fillColor)
            .drawCircle(5, 5, 2.5);
        let rt = PIXI.RenderTexture.create(10, 10);
        this.props.renderer.render(pointGraphics, rt);
        return rt;
    }

    redrawVertices() {
        this.container.removeChild(this.vertices);

        let layer = this.props.layer;
        let vertices = layer.getVertices();
        let fillColor = layer.color;
        let octFill = Number(`0x${fillColor.substr(1)}`);

        let sprites = new PIXI.particles.ParticleContainer(vertices.length, {
            scale: true,
            position: true,
            rotation: false,
            uvs: false,
            alpha: false
        });

        let rt = this.pointTexture(octFill);

        for (let vertex of vertices) {
            let sprite = new PIXI.Sprite(rt);
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.setTransform(vertex.x,vertex.y,1,1);
            sprites.addChild(sprite);
        }
        this.vertices = this.container.addChild(sprites);
    }

    redrawLabel(shape, labels) {

        if (!shape.label || shape.label === "") return;

        let label = shape.label;

        let stage = this.props.stage;

        let box = shape.geom.box;
        let point = {x: (box.xmin + box.xmax) / 2, y: (box.ymin + box.ymax) / 2};
        let dx = 6. / (stage.zoomFactor * stage.resolution);
        let dy = 4. / (stage.zoomFactor * stage.resolution);

        let style = {
            fontFamily : 'Arial',
            fontSize: 16
        };
        let labelSprite = new PIXI.Text(label,style);

        let unscale = 1. / (stage.zoomFactor * stage.resolution);

        // let tx = stage.canvas.offsetLeft / (stage.zoomFactor * stage.resolution) + point.x + dx;
        // let ty = -stage.canvas.offsetTop / (stage.zoomFactor * stage.resolution) + point.y + dy;
        let tx = point.x + dx;
        let ty = point.y + dy;
        labelSprite.setTransform(tx, ty, unscale, -unscale);

        labels.addChild(labelSprite);
    }

    redrawLabels() {
        this.container.removeChild(this.labels);

        let labels = new PIXI.Container();

        for (let shape of this.props.layer.shapes) {
            this.redrawLabel(shape, labels);
        }

        this.labels = this.container.addChild(labels);
    }

    redrawShape(shape, graphics) {
        let stage = this.props.stage;
        let layer = this.props.layer;

        let hovered = shape === this.props.hoveredShape;
        let selected = shape === this.props.firstMeasuredShape || shape === this.props.secondMeasuredShape;

        let widthOn = this.props.widthOn;
        let displayVertices = this.props.displayVertices;

        let color = (hovered || selected) ? "black" : layer.color;
        let fillColor = widthOn ? layer.color : undefined;
        let fillAlpha = (widthOn && !displayVertices) ? 1 : 0;

        let octColor = Number(`0x${color.substr(1)}`);
        let octFill = fillColor ? Number(`0x${fillColor.substr(1)}`) : undefined;

        shape.geom.graphics(graphics, {
            lineColor: octColor,
            fill: octFill,
            fillAlpha: fillAlpha,
            radius: 3. / (stage.zoomFactor * stage.resolution)
        });
    }

    redraw() {
        this.container.removeChild(this.graphics);

        let nativeLines = !this.props.widthOn;
        let graphics = new PIXI.Graphics(nativeLines);

        for (let shape of this.props.layer.shapes) {
            this.redrawShape(shape, graphics);
        }
        graphics.alpha = this.props.layer.displayed ? 0.6 : 0.0;
        this.graphics = this.container.addChild(graphics);

        if (this.props.displayVertices && this.props.layer.displayed) {
            this.redrawVertices();
        }
        if (this.props.displayLabels && this.props.layer.displayed) {
            this.redrawLabels();
        }
    }

    updateFillColor(color) {
        let octFill = Number(`0x${color.substr(1)}`);
        for (let data of this.graphics.graphicsData) {
            data.fillColor = octFill;
            data.lineColor = octFill;
        }
        this.graphics.dirty++;
        this.graphics.clearDirty++;
    }

    display() {
        if (this.props.layer.color !== this.props.layer.oldColor) {
            this.redraw();
            // this.updateFillColor(this.props.layer.color);
        }
        this.container.visible = true;
    }

    undisplay() {
        this.container.visible = false;
    }

    toggleWidth() {
        if (!this.props.layer.displayed)
            return;
        this.redraw();
    }

    widthOn() {
        if (!this.props.layer.displayed)
            return;
        if (this.oldProps.widthOn !== this.props.widthOn ||
        this.oldWidthOn !== this.props.widthOn) {
            this.redraw();
            this.oldWidthOn = this.props.widthOn;
        }
        if (this.props.widthOn && this.vertices) {
            this.vertices.visible = false;
        }
    }

    displayVertices() {
        if (!this.props.layer.displayed)
            return;
        if (this.oldProps.widthOn && !this.props.widthOn) {
            this.redraw();
        }
        else if (this.vertices === undefined) {
            this.redrawVertices();
        }
        this.vertices.visible = true;
    }

    undisplayVertices() {
        if (this.vertices) {
            this.vertices.visible = false;
        }
    }

    displayLabels() {
        if (!this.props.layer.displayed)
            return;
        if (this.labels === undefined) {
            this.redrawVertices();
        }
        this.labels.visible = true;
    }

    undisplayLabels() {
        if (this.labels) {
            this.labels.visible = false;
        }
    }

    componentWillReceiveProps(nextProps) {
        this.oldProps = Object.assign({},this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (Utils.is_equal(this.props, nextProps)) {
            return false;
        }
        return true;
    }

    componentDidMount() {
        this.redraw();
    }

    componentDidUpdate() {
        if (!this.props.layer.displayed) {
            this.undisplay();
            return;
        }
        if (!this.oldProps.layer.displayed && this.props.layer.displayed) {
            this.display();
        }
        if (this.oldProps.widthOn !== this.props.widthOn ||
        this.oldWidthOn !== this.props.widthOn) {
            this.widthOn();
            // return;
        }
        if (this.props.displayVertices) {
            this.displayVertices();
        }
        else {
            this.undisplayVertices();
        }
        if (this.props.displayLabels) {
            this.displayLabels();
        }
        else {
            this.undisplayLabels();
        }

        // this.pan = !(this.props.originX === nextProps.originX && this.props.originY === nextProps.originY);
        // this.zoom = this.props.zoomFactor !== nextProps.zoomFactor;

        // this.redraw();
    }

    render() {
        return null;
    }
}

/*
        return (
            this.props.layer.shapes.map((shape, index) => {
                return shape.geom.uri ? (
                    <ImageComponent
                        key={index}
                        stage={this.props.stage}
                        layer={this.state.layer}
                        model={shape}
                        displayed={this.state.layer.displayed}
                        hovered={shape === this.state.hoveredShape}
                        selected={
                            shape === this.state.firstMeasuredShape ||
                            shape === this.state.secondMeasuredShape
                        }
                        color={this.state.layer.color}
                        widthOn={this.state.widthOn}
                        displayLabels={this.state.displayLabels}
                        onMouseOver={this.props.onMouseOver}
                        onMouseOut={this.props.onMouseOut}
                        onClick={this.props.onClick}
                    />
                    ) : (
                    <ShapeComponent
                        key={index}
                        stage={this.props.stage}
                        layer={this.state.layer}
                        model={shape}
                        displayed={this.state.layer.displayed}
                        hovered={shape === this.state.hoveredShape}
                        selected={
                            shape === this.state.firstMeasuredShape ||
                            shape === this.state.secondMeasuredShape
                        }
                        color={this.state.layer.color}
                        widthOn={this.state.widthOn}
                        displayVertices={this.state.displayVertices}
                        displayLabels={this.state.displayLabels}
                        onMouseOver={this.props.onMouseOver}
                        onMouseOut={this.props.onMouseOut}
                        onClick={this.props.onClick}
                    /> )
                }
            )
       )
 */