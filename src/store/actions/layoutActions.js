import actionTypes from './actionTypes';
import { getService } from '../../services';

export const showGlobalMessage = ({text, type, isRemoved}) => {
    return (dispatch) => {
        const payload = {
            text,
            type
        }
        dispatch({type: actionTypes.SHOW_GLOBAL_MESSAGE, payload});
        if (isRemoved) {
            setTimeout(() => dispatch({type: actionTypes.REMOVE_GLOBAL_MESSAGE}), 3000)
        }
    };
};

export const toggleIsArmed = () => {
    return (dispatch,getState) => {

        const currentState = getState().output.isArmed;        
        
        
        debugger;
        const rossMessage = new window.ROSLIB.Message({
            isArmed: !currentState
        });

        const request = new window.ROSLIB.ServiceRequest({ rossMessage });

        getService('sendIsArmedFlag').callService(request, result => {

            console.log(getService('sendIsArmedFlag').name, result);
        });

        dispatch({type: actionTypes.TOGGLE_ARM_STATE});
    };
};


export const subscribeToBatteryLevel = (droneNumber) => {
    return (dispatch) => {

        getService('getBatteryLevel', droneNumber).subscribe(function (response) {
            console.log("subscribe: getBatteryLevel", response, 'drone:', droneNumber);

            if (response && response.data) {
                dispatch({ type: actionTypes.SET_BATTERY_LEVEL, payload: { batteryLevel: response.data, droneNumber } });
            }
        });
    };
};

export const subscribeToAirSpeed = (droneNumber) => {
    return (dispatch) => {

        getService('getAirSpeed', droneNumber).subscribe(function (response) {
            console.log("subscribe: getAirSpeed", response, 'drone:', droneNumber);

            if (response && response.data) {
                dispatch({ type: actionTypes.SET_AIR_SPEED, payload: { airSpeed: response.data, droneNumber } });
            }
        });
    };
};