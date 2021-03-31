import actionTypes from './actionTypes';
import axios from 'axios';
import { urls, logSeverities } from '../../config';
import { getService } from '../../services';



export const subscribeToDroneData = () => {
    console.log("subscribeToDroneData");

    const WEAPON_ID = 1;
    const WEAPON_MESSAGE = "INDOOR_EXPLORATION_THREAT";

    return async (dispatch) => {
        dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Subscribe to Drone Position...`, type: logSeverities.info } });

        console.log("subscribe: getDronePosition");
        getService('getDronePosition').subscribe('base_link', function (response) {
            dispatch({ type: actionTypes.GET_DRONE_POSITION_OFFSET, payload: { dronePositionOffset : response.translation } });
        });

        console.log("subscribe: getDetectionImage");
        getService('getDetectionImage').subscribe(function (response) {
            console.log(response);
            if(response && response.data == WEAPON_MESSAGE){
                dispatch({ type: actionTypes.SET_WEAPON_DETECTION, payload: { weaponDetected: true } });
                dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Weapon Detected!!!!`, type: logSeverities.warn } });
            }
        });

      //  console.log("subscribe: getSkeletonRenge");
      //  getService('getSkeletonRenge').subscribe(function (response) {
      //      dispatch({ type: actionTypes.UPDATE_SKELETON_RANGE, payload: { skeletonRange: response.range } });
      //  });
//
    };
};

