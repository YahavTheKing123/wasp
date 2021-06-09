import actionTypes from './actionTypes';
import { getBase64Image } from '../../utils/imageUtils';
import { getService } from '../../services';
import { logSeverities } from '../../config';
import * as geoCalculations from '../../utils/geoCalculations';
import { showGlobalMessage } from './layoutActions';

export const locate = () => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.LOACTE_START });

        const img = document.getElementById('droneImage');
        if (img) {
            const imgURL = getBase64Image(img);
            //dispach img to send and pixel
            dispatch({ type: actionTypes.IMAGE_SENT_TO_DRONE, payload: { image: imgURL } });

            const dataX = imgURL && imgURL.replace("data:image/jpeg;base64,", "");
            if (!dataX) {
                dispatch({ type: actionTypes.LOACTE_FAILED });
                return;
            }

            const imageMessage = new window.ROSLIB.Message({ data: dataX, format: "jpeg" });
            const requestLocate = new window.ROSLIB.ServiceRequest({ image: imageMessage });

            getService('pointingFingerLocate').callService(requestLocate, result => {
                if (result.isSuccess) {
                    dispatch({ type: actionTypes.LOACTE_SUCCESS });
                } else {
                    dispatch({ type: actionTypes.LOACTE_FAILED });
                }
                console.log(getService('pointingFingerLocate').name, result)
            });
        } else {
            dispatch({ type: actionTypes.LOACTE_FAILED });
        }
    };
};

export const pointVideoImage = ev => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.POINT_ON_VIDEO_IMAGE_START });

        const img = document.getElementById('droneImage');
        // Adjusting pixel to original img sizes
        let adjustedX = (ev.pageX - img.getBoundingClientRect().x) / img.width * img.naturalWidth;
        let adjustedY = (ev.pageY - img.getBoundingClientRect().y) / img.height * img.naturalHeight;

        console.log(adjustedX, adjustedY);

        const roundedX = Math.round(adjustedX);
        const roundedY = Math.round(adjustedY);
        dispatch(showGlobalMessage({ text: `selected pixel: (${roundedX}, ${roundedY})`, type: logSeverities.info, isRemoved: true }));

        if (img) {
            const imgURL = getBase64Image(img);
            //dispach img to send and pixel
            dispatch({ type: actionTypes.IMAGE_SENT_TO_DRONE, payload: { image: imgURL, point: { roundedX, roundedY } } });

            const dataX = imgURL && imgURL.replace("data:image/jpeg;base64,", "");
            if (!dataX) {
                dispatch({ type: actionTypes.POINT_ON_VIDEO_IMAGE_FAILED });
                return;
            }
            const imageMessage = new window.ROSLIB.Message({ data: dataX, format: "jpeg" });

            const pointMessage = new window.ROSLIB.Message({
                x: roundedX,
                y: roundedY,
                z: 0.0
            });

            const requestEncode = new window.ROSLIB.ServiceRequest({ image: imageMessage, point: pointMessage });

            getService('pointingFingerEncode').callService(requestEncode, result => {

                console.log(getService('pointingFingerEncode').name, result);
            });

            const requestLocate = new window.ROSLIB.ServiceRequest({ image: imageMessage });

            getService('pointingFingerLocate').callService(requestLocate, result => {
                if (result.isSuccess) {
                    dispatch({ type: actionTypes.POINT_ON_VIDEO_IMAGE_SUCCESS });
                }
                console.log(getService('pointingFingerLocate').name, result);
            });

        } else {
            dispatch({ type: actionTypes.POINT_ON_VIDEO_IMAGE_FAILED });
        }
    };
};

export const reset = () => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.RESET_START });

        const requestReset = new window.ROSLIB.ServiceRequest({});

        getService('pointingFingerReset').callService(requestReset, result => {
            if (result.isSuccess) {
                dispatch({ type: actionTypes.RESET_SUCCESS });
            } else {
                dispatch({ type: actionTypes.RESET_FAILED });
            }
            console.log(getService('pointingFingerReset').name, result)
        });

        getService('seekerReset').callService(requestReset, function (result) {
            console.log('Result for service call on ' + getService('seekerReset').name + ': ' + result.isSuccess);
            console.log(getService('seekerReset').name, result)
        });

    };
};

export const takeoff = () => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.TAKE_OFF_START });
        dispatch(showGlobalMessage({ text: `Taking off...`, type: logSeverities.info, isRemoved: true }));
        const requestTakeoff = new window.ROSLIB.ServiceRequest({});

        getService('seekerTakeoff').callService(requestTakeoff, result => {
            dispatch({ type: actionTypes.TAKE_OFF_SUCCESS });
            /*if (result.isSuccess) {
                dispatch({ type: actionTypes.TAKE_OFF_SUCCESS });
            } else {
                dispatch({ type: actionTypes.TAKE_OFF_FAILED });
                dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Taking off failed...`, type: logSeverities.error } });
            }*/
            console.log(result)
        });
    };
};
export const startIndoorExploration = () => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.START_INDOOR_EXPLORATION });
        const requestIndoorExplorationFlag = new window.ROSLIB.ServiceRequest({});

        getService('startIndoorExploration').callService(requestIndoorExplorationFlag, result => {
            console.log(result);
        });
    };
};

export const goToLocation = (location) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.GO_TO_LOCATION_START });
        dispatch(showGlobalMessage({ text: `Go To Location ${location}`, type: logSeverities.info, isRemoved: true }));

        const [x, y, z] = location.split(',');
        const pointMessage = new window.ROSLIB.Message({
            x: parseFloat(x),
            y: parseFloat(y),
            z: parseFloat(z)
        });

        getService('flyToTopic').publish(pointMessage);
    };
};



export const setExposure = (exposureVal) => {
    return async (dispatch) => {
        dispatch({ type: actionTypes.SET_EXPOSURE_START });
        dispatch(showGlobalMessage({ text: `Setting Exposure...`, type: logSeverities.info, isRemoved: true }));
        const setExposure = new window.ROSLIB.ServiceRequest({
            config: {
                bools: [], strs: [], doubles: [], groups: [],
                ints: [
                    { name: 'exposure', value: exposureVal }
                ],

            }
        });

        getService('setExposure').callService(setExposure, result => {
            if (result.isSuccess) {
                dispatch({ type: actionTypes.SET_EXPOSURE_SUCCESS });
            } else {
                //   dispatch({ type: actionTypes.SET_EXPOSURE_FAILED });
                //  dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Setting Exposure failed...`, type: logSeverities.error } });
            }
            console.log(result)
        });
    };
};


export const subscribeToSkeletonRange = (droneNumber) => {
    return (dispatch, getState) => {

        getService('getSkeletonRange', droneNumber).subscribe(function (response) {
            console.log("subscribe: getSkeletonRange", response);
            try {
                if (getState().map.dronesPositions[droneNumber] && getState().map.dronesPositions[droneNumber].workingOrigin) {
                    if (response && response.point) {
                        //range = (response.data / 1000);
                        //const INDOOR_EXPLORATION = "INDOOR_EXPLORATION";
                        //  if(getState().output.missionState.startsWith(INDOOR_EXPLORATION)){
                        dispatch({ type: actionTypes.GET_ENEMY_POSITION, payload: { enemyOffset: response.point, droneNumber } });
                        // } 

                        if (getState().map.selectedDrone == droneNumber && getState().map.dronesPositions[droneNumber]) {
                            let skeletonRange = geoCalculations.calculateDistanceBetween2Points(getState().map.dronesPositions[droneNumber].offset, response.point, true);
                            dispatch({ type: actionTypes.UPDATE_SKELETON_RANGE, payload: { skeletonRange } });
                        }
                    }
                }
            } catch {

            }

        });
    };
};

export const subscribeToWeaponDetection = (droneNumber) => {
    return (dispatch) => {
        console.log("subscribe: getDroneExploreState");
        getService('getDroneExploreState', droneNumber).subscribe(function (response) {

            //const WEAPON_ID = 1;
            const INDOOR_EXPLORATION = "INDOOR_EXPLORATION";
            const INDOOR_EXPLORATION_THREAT = "INDOOR_EXPLORATION_THREAT";

            console.log(response);

            if (response && response.data) {


                if (response.data && response.data.startsWith(INDOOR_EXPLORATION)) {
                    dispatch({ type: actionTypes.SET_INDOOR_EXPLORATION_FLAG });
                    //    dispatch({ type: actionTypes.SET_WEAPON_DETECTION, payload: { weaponDetected: true } });                
                    //   dispatch(showGlobalMessage({ text: `Threat Detected`, type: logSeverities.warn, isRemoved: true }));                    
                } else if (response.data === INDOOR_EXPLORATION_THREAT) {
                    dispatch({ type: actionTypes.SET_WEAPON_DETECTION, payload: { weaponDetected: true } });
                    dispatch(showGlobalMessage({ text: `Threat Detected`, type: logSeverities.warn, isRemoved: true }));
                }

            }
        });
    };
};



