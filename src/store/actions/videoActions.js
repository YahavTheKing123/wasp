import actionTypes from './actionTypes';
import { getBase64Image } from '../../utils/imageUtils';
import { getService } from '../../services';
import { logSeverities } from '../../config';
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
        const adjustedX = (ev.pageX - img.getBoundingClientRect().x) / img.width * img.naturalWidth;
        const adjustedY = (ev.pageY - img.getBoundingClientRect().y) / img.height * img.naturalHeight;

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
        dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Taking off...`, type: logSeverities.info } });

        const requestTakeoff = new window.ROSLIB.ServiceRequest({});

        getService('seekerTakeoff').callService(requestTakeoff, result => {
            if (result.isSuccess) {
                dispatch({ type: actionTypes.TAKE_OFF_SUCCESS });
            } else {
                dispatch({ type: actionTypes.TAKE_OFF_FAILED });
                dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Taking off failed...`, type: logSeverities.error } });
            }
            console.log(result)
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
        dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Setting Exposure...`, type: logSeverities.info } });

        const setExposure = new window.ROSLIB.ServiceRequest({
            config: {
                bools: [], strs: [], strs: [], doubles: [], groups: [],
                ints: [
                    { name: 'exposure', value: exposureVal }
                ],

            }
        });

        getService('setExposure').callService(setExposure, result => {
            if (result.isSuccess) {
                dispatch({ type: actionTypes.SET_EXPOSURE_SUCCESS });
            } else {
                dispatch({ type: actionTypes.SET_EXPOSURE_FAILED });
                dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Setting Exposure failed...`, type: logSeverities.error } });
            }
            console.log(result)
        });
    };
};


