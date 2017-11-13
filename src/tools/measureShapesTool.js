/**
 * Created by alexanderbol on 21/04/2017.
 */

import {Component} from 'react';
// import createjs from 'easel-js';
import * as createjs from '../../public/easeljs-NEXT.combined.js';

import '../App.css';
export class MeasureShapesTool extends Component {
    constructor(params) {
        super();
        this.segment = undefined;
    }

    componentDidUpdate() {
        if (this.props.firstMeasuredShape && this.props.secondMeasuredShape &&
            this.props.firstMeasuredLayer.displayed &&
            this.props.secondMeasuredLayer.displayed) {

            if (this.props.shortestSegment && this.props.stage) {
                let shortest_segment = this.props.shortestSegment;

                if (!this.segment) {
                    this.segment = new createjs.Shape();
                    this.props.stage.addChild(this.segment);
                }
                this.segment.graphics.clear();
                this.segment.graphics = shortest_segment.graphics();
            }
        }
        else {
            if (this.segment) {
                this.segment.graphics.clear();
            }
        }
    }

    render() {
        return null
    }
}
