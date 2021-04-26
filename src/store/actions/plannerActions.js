import { showGlobalMessage } from './layoutActions';
import config, { logSeverities } from '../../config';
import { getService } from '../../services';
import axios from 'axios';
import actionTypes from './actionTypes';

export const runSavedMissionPlan = () => {
    return (dispatch, getState) => {
        dispatch(showGlobalMessage({ text: `Starting to execute planned mission`, type: logSeverities.info, isRemoved: true }));
                                                    
        // 1. reset
        const requestMissionReset = new window.ROSLIB.ServiceRequest({});
        getService('doMissionReset').callService(requestMissionReset, function (result) {});
        
        
        // 2. mission plan stages
        const missionStages = getState().planner.savedMissionPlan;

        missionStages.forEach(stage => {

            const {rossService} = stage.selectedStageType;
            if (rossService) {
                debugger;
                switch (rossService) {
                    case 'addMissionWP':
                        
                        const [x, y, z] = stage.stageParamsInput.split(',');
                        const pointMessage = new window.ROSLIB.Message({
                            x: parseFloat(x),
                            y: parseFloat(y),
                            z: parseFloat(z)
                        });
                        
                        getService(rossService).publish(pointMessage);
                        break;
                        
                    case 'addMissionTakeoff':
                        const stageRequest = new window.ROSLIB.ServiceRequest({});             
                        getService(rossService).callService(stageRequest, function (result) {});    
                        break;   
                    default:
                        break;
                }
            }
            
        });

        // 3. execute
        const requestMissionExecute = new window.ROSLIB.ServiceRequest({});
        getService('doMissionExecute').callService(requestMissionExecute, function (result) {});



    };
};

export const importPlanFromFile = () => {    
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

export const exportPlanToFile = (plan, viewerState) => {    
    return async (dispatch) => {
        try {            
            const url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(plan));
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


