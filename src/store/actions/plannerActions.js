import { showGlobalMessage } from './layoutActions';
import config, { logSeverities } from '../../config';
import { getService } from '../../services';
import axios from 'axios';
import actionTypes from './actionTypes';
import * as geoCalculations from '../../utils/geoCalculations';



function asyncCallRossService(serviceName, params) {
    console.log('starting calling service ', serviceName, 'with params:', params);
    return new Promise((resolve, reject) => {
        getService(serviceName).callService(params, result => {
            // TODO - check how to get failure from the service and then call the reject() func.
            console.log('finish calling service ', serviceName);
            resolve(result);
        })
    })
}


export const runSavedMissionPlan = () => {
    return async (dispatch, getState) => {
        dispatch(showGlobalMessage({ text: `Starting to execute planned mission`, type: logSeverities.info, isRemoved: true }));
debugger;
        // 1. reset
        const requestMissionReset = new window.ROSLIB.ServiceRequest({});
        await asyncCallRossService('doMissionReset', requestMissionReset);        
        
        // 2. mission plan stages
        const missionStages = getState().planner.savedMissionPlan;        
        const workingOrigin = getState().map.workingOrigin;
        let serviceRequest;

        for (const stage of missionStages) {
            
            const { rossService } = stage.selectedStageType;
            if (rossService) {
                switch (rossService) {
                    case 'addMissionWP':
                        const [x, y, z] = stage.stageParamsInput.split(',');
                        const offset = geoCalculations.getCoordinatesOffset(workingOrigin.coordinate, { x, y, z });
                        const offsetWithAngle = geoCalculations.calculateOffsetWithAngle(offset, -(workingOrigin.angle));
                        const droneOffset = geoCalculations.convertDroneOffsetToMapOffset(offsetWithAngle);
                        serviceRequest = new window.ROSLIB.ServiceRequest({
                            coordinate: droneOffset
                        });
                        break;

                    case 'addMissionTakeoff':
                        serviceRequest = new window.ROSLIB.ServiceRequest({});
                        break;
                    default:
                        serviceRequest = null;
                        break;
                }
                await asyncCallRossService(rossService, serviceRequest);
            }
        };

        // 3. execute
        const requestMissionExecute = new window.ROSLIB.ServiceRequest({});
        await asyncCallRossService('doMissionExecute', requestMissionExecute);
    };
};

export const importMissionFromDroneFile = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(config.urls.loadMission);
            dispatch({ type: actionTypes.LOAD_DEFAULT_PLAN, payload: response.data });
            dispatch(showGlobalMessage({ text: `Default plan loaded successfully`, type: logSeverities.success, isRemoved: true }));
        } catch (e) {
            dispatch(showGlobalMessage({ text: `Unable to load default plan`, type: logSeverities.error, isRemoved: true }));
            console.log(e)
        }
    };
};

export const importMissionFromPcFile = (missionData) => {
    return async (dispatch) => {
        try {
            dispatch({ type: actionTypes.LOAD_DEFAULT_PLAN, payload: missionData });
            dispatch(showGlobalMessage({ text: `Default plan loaded successfully`, type: logSeverities.success, isRemoved: true }));
        } catch (e) {
            dispatch(showGlobalMessage({ text: `Unable to load default plan`, type: logSeverities.error, isRemoved: true }));
            console.log(e)
        }
    };
};

export const exportPlanToFile = (plan, viewerState) => {
    
    return async (dispatch) => {
        try {
            const url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", url);
            downloadAnchor.setAttribute("download", `${viewerState}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        } catch (e) {
            dispatch(showGlobalMessage({ text: `Unable to load default plan`, type: logSeverities.error, isRemoved: true }));
            console.log(e)
        }
    };
};


