/**
 * Created by alexanderbol on 21/04/2017.
 */

import React, {Component} from 'react';
// import * as createjs from '../../public/easeljs-NEXT.combined.js';
import '../App.css';
import {Stage} from '../models/stage';

import * as PIXI from 'pixi.js';

export class CanvasComponent extends Component {
    constructor() {
        super();
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
        this.handleMouseWheelFox = this.handleMouseWheelFox.bind(this);
    }

    handleMouseMove(event) {
        let point = event.data.global;
        if (!this.props.stage.inside(point)) return false;

        if (this.props.renderer) this.props.renderer.view.focus();
        this.props.onMouseMove(point.x, point.y);
    }

    handleMouseDown(event) {
        let point = event.data.global;
        this.props.onMouseDown(point.x, point.y);
    }

    handleMouseUp(event) {
        event.stopPropagation();
        // event.preventDefault();
        let point = event.data.global;
        this.props.onMouseUp(point.x, point.y);
    }

    handleMouseLeave(event) {   // nothing works except click
        if (this.props.renderer) this.props.renderer.view.blur();
        document.body.focus();
    }

    handleMouseWheel(event) {
        event.preventDefault();

        let delta = event.detail || event.wheelDelta;
        if (delta !== 0) {
            this.props.onMouseWheelMove(event.offsetX, event.offsetY, delta);
        }
    }

    handleMouseWheelFox(event) {
        event.preventDefault();
        if (event.detail !== 0) {
            this.props.onMouseWheelMove(event.layerX, event.layerY, -event.detail);
        }
    }

    componentDidMount() {
        let width = this.refs.canvas.clientWidth > 0 ? this.refs.canvas.clientWidth : 300;
        let height = this.refs.canvas.clientHeight > 0 ? this.refs.canvas.clientHeight : 200;
        let renderer = PIXI.autoDetectRenderer(width, height, {
            transparent: true,
            view: this.refs.canvas
        });

        let stage = new Stage(this.refs.canvas);

        stage.interactive = true;

        stage.on("mousemove", this.handleMouseMove);
        stage.on("mousedown", this.handleMouseDown);
                 // stage.on("pointerdown", this.handleMouseDown);
                 // stage.on("touchstart", this.handleMouseDown);
        stage.on("mouseup", this.handleMouseUp);
        stage.on("mouseout", this.handleMouseLeave);

        this.refs.canvas.addEventListener("mousewheel", this.handleMouseWheel);
        this.refs.canvas.addEventListener("DOMMouseScroll", this.handleMouseWheelFox);

        this.props.onMainCanvasMounted(renderer, stage);
    }

    render() {
        return (
            <canvas tabIndex="1" ref="canvas" id="mainCanvas" className="App-canvas">
            </canvas>
    )
    }
}
