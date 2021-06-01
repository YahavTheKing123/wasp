import actionTypes from './actionTypes';
import { getService } from '../../services';

export const subscribeToDroneData = (droneNumber) => {
    return async (dispatch) => {
        //dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Subscribe to Drone Position...`, type: logSeverities.info } });
        console.log("subscribe: getDronePosition");
        getService('getDronePosition', droneNumber).subscribe('base_link', function (response) {
            console.log(response);
            dispatch({ type: actionTypes.GET_DRONE_POSITION_OFFSET, payload: { droneNumber, dronePositionOffset: response.translation, droneRotationQuaternion: response.rotation } });
        });

    };
};