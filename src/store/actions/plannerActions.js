import { showGlobalMessage } from './layoutActions';
import config, { logSeverities } from '../../config';
import { getService } from '../../services';
import axios from 'axios';
import actionTypes from './actionTypes';
import * as geoCalculations from '../../utils/geoCalculations';

export const runSavedMissionPlan = () => {
    return (dispatch, getState) => {
        dispatch(showGlobalMessage({ text: `Starting to execute planned mission`, type: logSeverities.info, isRemoved: true }));
        let promises = [];
        let payload;
        // 1. reset
        const requestMissionReset = new window.ROSLIB.ServiceRequest({});


        promises.push(
            new Promise((resolve) => {
                getService('doMissionReset').callService(requestMissionReset, (result) => resolve('doMissionReset',result));
            })
        )

        // 2. mission plan stages
        const missionStages = getState().planner.savedMissionPlan;
        console.log("stages", missionStages);
        const workingOrigin = getState().map.workingOrigin;

        missionStages.forEach(stage => {
            const { rossService } = stage.selectedStageType;
            if (rossService) {
                switch (rossService) {
                    case 'addMissionWP':
                        const [x, y, z] = stage.stageParamsInput.split(',');
                        const offset = geoCalculations.getCoordinatesOffset(workingOrigin.coordinate, { x, y, z });
                        const offsetWithAngle = geoCalculations.calculateOffsetWithAngle(offset, -(workingOrigin.angle));
                        payload = new window.ROSLIB.Message({
                            x: parseFloat(offsetWithAngle.x),
                            y: parseFloat(offsetWithAngle.y),
                            z: parseFloat(offsetWithAngle.z)
                        });
                        break;

                    case 'addMissionTakeoff':
                        payload = new window.ROSLIB.ServiceRequest({});
                        break;
                    default:
                        payload = null;
                        break;
                }

                promises.push(
                    new Promise((resolve) => {
                        getService(rossService).callService(payload, (result) => resolve(rossService,result));
                    })
                )
            }
         

        });

        // 3. execute
        const requestMissionExecute = new window.ROSLIB.ServiceRequest({});
        promises.push(
            new Promise((resolve) => {
                getService('doMissionExecute').callService(requestMissionExecute,  (result) => resolve("doMissionExecute", result));
            })
        )

        promises.reduce((promiseChain, currentTask) => {
            return promiseChain.then(chainResults =>
                currentTask.then(currentResult =>
                    [ ...chainResults, currentResult ]
                )
            );
        }, Promise.resolve([])).then(arrayOfResults => {
            console.log("MissionResults",arrayOfResults)
        }).catch(alert);

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


