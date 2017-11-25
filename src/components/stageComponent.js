import React, {Component} from 'react';
import * as PIXI from 'pixi.js';
import {LayerComponent} from './layerComponent';
import Utils from "../utils";

export class StageComponent extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (Utils.is_equal(this.props, nextProps)) {
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        if (this.props.renderer && this.props.stage) {
            let origin = this.props.stage.origin;
            let zoomFactor = this.props.stage.zoomFactor*this.props.stage.resolution;

            for (let layer of this.props.stage.children) {
                for (let child of layer.children) {
                    if (child instanceof PIXI.particles.ParticleContainer) {
                        for (let sprite of child.children) {
                            let p = sprite.transform.position;
                            sprite.setTransform(p.x, p.y, 1. / zoomFactor, 1. / zoomFactor);
                        }
                    }
                    if (child instanceof PIXI.Container) {
                        for (let text of child.children) {
                            let p = text.transform.position;
                            text.setTransform(p.x, p.y, 1. / zoomFactor, -1. / zoomFactor);
                        }
                    }
                }
            }
            this.props.stage.setTransform(origin.x, origin.y, zoomFactor, -zoomFactor);

            this.props.renderer.render(this.props.stage);
        }
    }

    render() {
        return (
            this.props.layers.map((layer) =>
                <LayerComponent
                    key={layer.name}
                    stage={this.props.stage}
                    renderer={this.props.renderer}
                    layer={layer}
                    displayVertices={this.props.displayVertices}
                    displayLabels={this.props.displayLabels}
                    widthOn={this.props.widthOn}
                    hoveredShape={this.props.hoveredShape}
                    firstMeasuredShape={this.props.firstMeasuredShape}
                    secondMeasuredShape={this.props.secondMeasuredShape}
                    onMouseOver={this.props.onMouseOver}
                    onMouseOut={this.props.onMouseOut}
                    onClick={this.props.onClick}
                />
            )
        )
    }
}