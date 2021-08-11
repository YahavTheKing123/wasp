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