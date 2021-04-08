import actionTypes from './actionTypes';
import { getService } from '../../services';

export const subscribeToDroneData = () => {
    console.log("subscribeToDroneData");

    return async (dispatch) => {
        //dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Subscribe to Drone Position...`, type: logSeverities.info } });

        console.log("subscribe: getDronePosition");
        getService('getDronePosition').subscribe('base_link', function (response) {
            dispatch({ type: actionTypes.GET_DRONE_POSITION_OFFSET, payload: { dronePositionOffset : response.translation } });
        });

    };
};

