import actionTypes from './actionTypes';
import {getBase64Image} from '../../utils/imageUtils';
import * as services from '../../services';
import {logSeverities} from '../../config';

export const locate = () => {
    return async (dispatch) => {        
        dispatch({ type: actionTypes.LOACTE_START });

        const img = document.getElementById('droneImage');
        if (img) {
            const dataX = getBase64Image(img);
            const imageMessage = new window.ROSLIB.Message({data : dataX, format : "jpeg"});
            const requestLocate = new window.ROSLIB.ServiceRequest({image : imageMessage});
                        
            services.pointingFingerLocate.callService(requestLocate, result => {
                if (result.isSuccess) {
                    dispatch({ type: actionTypes.LOACTE_SUCCESS });
                } else {
                    dispatch({ type: actionTypes.LOACTE_FAILED });        
                }
                console.log(services.pointingFingerLocate.name, result)
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

        if (img) {
            const dataX = getBase64Image(img);
            const imageMessage = new window.ROSLIB.Message({data : dataX, format : "jpeg"});
                        
            const pointMessage = new window.ROSLIB.Message({
                x : ev.pageX - img.offsetLeft,
                y : ev.pageY - img.offsetTop,
                z : 0.0
            });
    
            const requestEncode = new window.ROSLIB.ServiceRequest({image : imageMessage, point : pointMessage });
                
            services.pointingFingerEncode.callService(requestEncode, result => {
                
                console.log(services.pointingFingerEncode.name, result);
            });
    
            const requestLocate = new window.ROSLIB.ServiceRequest({image : imageMessage});
    
            services.pointingFingerLocate.callService(requestLocate, result => {
                if (result.isSuccess) {
                    dispatch({ type: actionTypes.POINT_ON_VIDEO_IMAGE_SUCCESS });
                }
                console.log(services.pointingFingerLocate.name, result);
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

        services.pointingFingerReset.callService(requestReset, result => {
            if (result.isSuccess) {
                dispatch({ type: actionTypes.RESET_SUCCESS });
            } else {
                dispatch({ type: actionTypes.RESET_FAILED });
            }
            console.log(services.pointingFingerReset.name, result)
        });

        services.seekerReset.callService(requestReset, function(result) { 
            console.log('Result for service call on ' + services.seekerReset.name + ': ' + result.isSuccess);
            console.log(services.seekerReset.name, result)
        });

    };
};

export const takeoff = () => {
    return async (dispatch) => {        
        dispatch({ type: actionTypes.TAKE_OFF_START });
        dispatch({type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: {text: `Taking off...`, type: logSeverities.info}});

        const requestTakeoff = new window.ROSLIB.ServiceRequest({});

        services.seekerTakeoff.callService(requestTakeoff,  result => {
            if (result.isSuccess) {
                dispatch({ type: actionTypes.TAKE_OFF_SUCCESS });
            } else {
                dispatch({ type: actionTypes.TAKE_OFF_FAILED });
                dispatch({type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: {text: `Taking off failed...`, type: logSeverities.error}});
            }
            console.log(result)
        });
    };
};
