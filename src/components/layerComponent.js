import {Component} from 'react';
// import {ShapeComponent} from '../tools/shapeComponent';
// import {ImageComponent} from "../tools/imageComponent";
import * as PIXI from 'pixi.js';
import '../models/graphics';

export class LayerComponent extends Component {
    constructor(params) {
        super();

        this.graphics = undefined;
        this.vertices = undefined;

        this.state = {
            layer: params.layer,
            color: params.color,
            displayed: params.displayed,
            displayVertices: params.displayVertices,
            displayLabels: params.displayLabels,
            hovered: params.hovered,
            selected: params.selected,
            widthOn: params.widthOn,
            /*origin: params.stage.origin,*/
            /*zoomFactor: params.stage.zoomFactor,*/
            hoveredShape: params.hoveredShape,
            firstMeasuredShape: params.firstMeasuredShape,
            secondMeasuredShape: params.secondMeasuredShape
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            layer: nextProps.layer,
            color: nextProps.color,
            displayed: nextProps.displayed,
            displayVertices: nextProps.displayVertices,
            displayLabels: nextProps.displayLabels,
            hovered: nextProps.hovered,
            selected: nextProps.selected,
            widthOn: nextProps.widthOn,
            /*origin: nextProps.stage.origin,*/
            /*zoomFactor: nextProps.stage.zoomFactor,*/
            hoveredShape: nextProps.hoveredShape,
            firstMeasuredShape: nextProps.firstMeasuredShape,
            secondMeasuredShape: nextProps.secondMeasuredShape
        })
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

    redrawShape(shape, graphics) {
        let stage = this.props.stage;
        let layer = this.props.layer;

        let hovered = shape === this.state.hoveredShape;
        let selected = shape === this.state.firstMeasuredShape || shape === this.state.secondMeasuredShape;

        let widthOn = this.state.widthOn;
        let displayVertices = this.state.displayVertices;
        // let displayLabels = this.state.displayLabels;

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
        this.sprites = this.props.stage.addChild(sprites);
    }

    redraw() {
        this.props.stage.removeChild(this.graphics);
        this.props.stage.removeChild(this.sprites);

        let nativeLines = !this.state.widthOn;
        let graphics = new PIXI.Graphics(nativeLines);

        for (let shape of this.props.layer.shapes) {
            this.redrawShape(shape, graphics);
        }
        graphics.alpha = this.props.layer.displayed ? 0.6 : 0.0;
        this.graphics = this.props.stage.addChild(graphics);

        if (this.props.displayVertices && this.props.layer.displayed) {
            this.redrawVertices();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.equalState(nextState)) {
            return false;
        }
        return true;
    }

    componentDidMount() {
        this.redraw();
    }

    componentDidUpdate() {
        this.redraw();
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