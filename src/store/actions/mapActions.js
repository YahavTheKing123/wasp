import actionTypes from './actionTypes';
import axios from 'axios';
import {urls, logSeverities} from '../../config';
import { getService } from '../../services';


export const subscribeToDronePosition = () => {
    console.log("subscribeToDronePosition");
    return async (dispatch) => {
        dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Subscribe to Drone Position...`, type: logSeverities.info } });

        getService('getDronePosition').subscribe('base_link', function (positionOffset) {
            console.log(positionOffset);
            dispatch({ type: actionTypes.GET_DRONE_POSITION_OFFSET, payload: { positionOffset } });
        });

    };
};