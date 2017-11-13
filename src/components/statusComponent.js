/**
 * Created by alexanderbol on 17/06/2017.
 */
import React, {Component} from 'react';
// import '../App.css';

export class StatusComponent extends Component {
    measurement() {
        let message = ""
        if (this.props.shortestSegment && this.props.distance) {
            let segment = this.props.shortestSegment;
            let dx = segment.end.x - segment.start.x;
            let dy = segment.end.y - segment.start.y;
            let dist = this.props.distance;

            message = "DX=" + this.format(dx) + ",DY=" + this.format(dy) + ",D=" + this.format(dist);
        }
        return message;
    }

    format(num) {
        return (num/this.props.divisor).toFixed(this.props.decimals);
    }

    render() {
        let stage = this.props.stage;
        let coordX = 0;
        let coordY = 0;
        if (stage) {
            coordX = this.format(stage.C2W_X(this.props.coordX));
            coordY = this.format(stage.C2W_Y(this.props.coordY));
        }
        let message = this.measurement();

        return (
            <div className="App-status-bar">
                <div style={{flex: 4, textAlign: "left", marginLeft: 10, padding: 5}}>
                    <h5>
                        {`X: ${coordX} Y: ${coordY}`}
                    </h5>
                </div>

                <div style={{flex: 6, textAlign: "left", marginLeft: 10, padding: 5}}>
                    <h5>
                        {message}
                    </h5>
                </div>

                <button
                    style={{flex: 2, height: "50%", margin: 5, border: "1px", backgroundColor: "inherit"}}
                    onClick={this.props.onUnitClicked}
                >
                    <h3>Units</h3>
                </button>
                <h5 style={{flex: 2, height: "50%", margin: 5}}>
                    {this.props.units}
                </h5>

            </div>
        )
    }
}
