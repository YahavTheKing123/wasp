import { showGlobalMessage } from './layoutActions';
import { logSeverities } from '../../config';
import { getService } from '../../services';

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

