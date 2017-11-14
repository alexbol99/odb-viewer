import * as ActionTypes from '../actions/action-types';

const stageController = ({ getState, dispatch }) => next => action => {

    let state = getState();
    let stage = action.stage;
    let renderer = state.app.renderer;

    if (stage) {
        switch (action.type) {
            case ActionTypes.STAGE_RESIZED:
                stage.resize();
                break;

            case ActionTypes.MOUSE_DOWN_ON_STAGE:
                stage.panByMouseStart();
                break;

            case ActionTypes.MOUSE_MOVED_ON_STAGE:
                if (action.dx !== undefined && action.dy !== undefined) {
                    stage.panByMouseMove(action.dx, action.dy);
                }
                break;

            case ActionTypes.MOUSE_UP_ON_STAGE:
                stage.panByMouseStop();
                break;

            case ActionTypes.PAN_AND_ZOOM_TO_SHAPE:
                let center = action.shape.center;
                let box = action.shape.box;
                stage.panToCoordinate(center.x, center.y);
                stage.zoomToLimits(box.xmax - box.xmin, box.ymax - box.ymin);

                let origin = stage.origin;
                let zoomFactor = stage.zoomFactor*stage.resolution;
                stage.setTransform(origin.x, origin.y, zoomFactor, -zoomFactor);

                renderer.render(stage);
                // stage.cacheAsBitmap = true;
                break;

            case ActionTypes.MOUSE_WHEEL_MOVE_ON_STAGE:
                let bIn = action.delta > 0;
                // stage.zoomByMouse(action.x, action.y, bIn, 1 + Math.abs(action.delta)/100.);
                stage.zoomByMouse(action.x, action.y, bIn, 1.2);
                break;

            default:
                break;
        }
    }

    next(action);
};

export default stageController;