import actionTypes from './actionTypes';
import axios from 'axios';
import { urls, logSeverities } from '../../config';
import { getService } from '../../services';



export const subscribeToDroneData = () => {
    console.log("subscribeToDroneData");

    const WEAPON_ID = 2;

    return async (dispatch) => {
        dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Subscribe to Drone Position...`, type: logSeverities.info } });

        console.log("subscribe: getDronePosition");
        getService('getDronePosition').subscribe('base_link', function (positionOffset) {
            console.log(positionOffset);
            dispatch({ type: actionTypes.GET_DRONE_POSITION_OFFSET, payload: { positionOffset } });
        });

        console.log("subscribe: getDetectionImage");
        getService('getDetectionImage').subscribe(function (response) {
            response.detections.forEach(detection => {
                if (detection.results[0].id == WEAPON_ID) {
                    dispatch({ type: actionTypes.SET_WEAPON_DETECTION, payload: { weaponDetected: true } });
                    dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Weapon Detected!!!!`, type: logSeverities.warn } });
                    return;
                }
            });
        });

      //  console.log("subscribe: getSkeletonRenge");
      //  getService('getSkeletonRenge').subscribe(function (response) {
      //      dispatch({ type: actionTypes.UPDATE_SKELETON_RANGE, payload: { skeletonRange: response.range } });
      //  });
//
    };
};

