import actionTypes from './actionTypes';
import axios from 'axios';
import { urls, logSeverities } from '../../config';
import { getService } from '../../services';

export const subscribeToDetectionImage = () => {
    console.log("getDetectionImage");
    return async (dispatch) => {
        dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Subscribe to subscribeToDetectionImage...`, type: logSeverities.info } });


    };
};