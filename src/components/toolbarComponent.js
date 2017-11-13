/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, {Component} from 'react';

// import { ButtonToolbar, Button } from 'react-bootstrap';
// import logo from '../logo.svg';

// import open from '../../public/icons/Browse.png';
// import home from '../../public/icons/homeIcon20x20.png';
// import pan from '../../public/icons/handDrag20.png';
// import measureShapes from '../../public/icons/measureContour.png';
// import measurePoints from '../../public/icons/measurePoints.png';
// import width from '../../public/icons/WidthOn.png';
// import vertices from '../../public/icons/editContourVertextOnOff.png';
// import label from '../../public/icons/label_icon.png';
// import setting from '../../public/icons/Setting.png';
// import about from '../../public/icons/About.png';

import '../App.css';

export class ToolbarComponent extends Component {
    constructor() {
        super();
        this.openJobButtonClicked = this.openJobButtonClicked.bind(this);
        this.notImplemented = this.notImplemented.bind(this);
    }

    openJobButtonClicked() {
        document.getElementById("browseFiles").click();
    }

    notImplemented() {
        alert("Not implemented yet")
    }

    render() {
        // let public = process.env.PUBLIC_URL;
        return (
            <div className="App-toolbar">
                {/*<h4>Toolbar</h4>*/}
                <button title="Open file" onClick={this.openJobButtonClicked}>
                    <img src={process.env.PUBLIC_URL + '/icons/Browse.png'} alt="open" />
                </button>

                <input style={{fontSize: 16, marginTop: 5, marginBottom: 5, display: "none"}}
                       type="file" id="browseFiles" name="files[]" multiple
                       onChange={this.props.onFileSelected}
                />

                <button title="Zoom and pan to home view" onClick={this.props.onHomeButtonPressed}>
                    <img src={process.env.PUBLIC_URL + '/icons/homeIcon20x20.png'} alt="home" />
                </button>
                <button title="Pan by drag" onClick={this.props.onPanByDragPressed}>
                    <img src={process.env.PUBLIC_URL + '/icons/handDrag20.png'} alt="panByDrag" />
                </button>
                <button title="Measure distance between points" onClick={this.props.onMeasurePointsButtonPressed}>
                    <img src={process.env.PUBLIC_URL + '/icons/measurePoints.png'} alt="measurePoints" />
                </button>
                <button title="Measure distance between shapes" onClick={this.props.onMeasureBetweenShapesButtonPressed}>
                    <img src={process.env.PUBLIC_URL + '/icons/measureContour.png'} alt="measureShapes" />
                </button>
                <button title="Display solid or wire" onClick={this.props.onToggleWidthModePressed}>
                    <img src={process.env.PUBLIC_URL + '/icons/WidthOn.png'} alt="width" />
                </button>
                <button title="Display vertices on/off" onClick={this.props.onToggleVerticesPressed}>
                    <img src={process.env.PUBLIC_URL + '/icons/editContourVertextOnOff.png'} alt="vertices" />
                </button>
                <button title="Display labels on/off" onClick={this.props.onToggleLabelsPressed}>
                    <img src={process.env.PUBLIC_URL + '/icons/label_icon.png'} alt="labels" />
                </button>
                <button title="Settings" onClick={this.notImplemented}>
                    <img src={process.env.PUBLIC_URL + '/icons/Setting.png'} alt="setting" />
                </button>
                <button title="About" onClick={this.notImplemented}>
                    <img src={process.env.PUBLIC_URL + '/icons/About.png'} alt="about" />
                </button>
            </div>
        )
    }
};
