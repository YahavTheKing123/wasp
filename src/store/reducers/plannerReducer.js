import actionTypes from '../actions/actionTypes';

export const viewerStates = {
    draft: 'draft',
    savedMission: 'savedMission'
}

const initialState = {    
    draftMissionStages: [],
    savedMissionPlan: [],
    viewerState: viewerStates.draft
};

function immutablySwapItems(items, firstIndex, secondIndex) {
    return items.map(function(element, index) {
        if (index === firstIndex) return items[secondIndex];
        else if (index === secondIndex) return items[firstIndex];
        else return element;
    })
}

const plannerReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_NEW_MISSION_PLAN_STAGE:
            return {
                ...state,
                draftMissionStages: [...state.draftMissionStages, action.payload]
            }
        case actionTypes.DELETE_MISSION_PLAN_STAGE:
            return {
                ...state,
                draftMissionStages: state.draftMissionStages.filter(stage => stage.stageId !== action.payload.id)
            }
        case actionTypes.EDIT_MISSION_PLAN_STAGE: {
            return {
                ...state,
                draftMissionStages: [
                    ...state.draftMissionStages.slice(0, action.payload.stageIndex),
                    action.payload.stage,
                    ...state.draftMissionStages.slice(action.payload.stageIndex + 1),
                ]
            }
        }
        case actionTypes.MOVE_DOWN_MISSION_PLAN_STAGE: {
            const currentStageIndex = action.payload;

            if (currentStageIndex === 0) return state;
            // swapping the elements in immutable way:
            return {
                ...state,
                draftMissionStages: immutablySwapItems(state.draftMissionStages, currentStageIndex, currentStageIndex - 1)

            }            
        }
        case actionTypes.MOVE_UP_MISSION_PLAN_STAGE: {
            const currentStageIndex = action.payload;

            if (state.draftMissionStages.length === 0 ||
                currentStageIndex === state.draftMissionStages.length - 1) return state;
            // swapping the elements in immutable way:
            return {
                ...state,
                draftMissionStages: immutablySwapItems(state.draftMissionStages, currentStageIndex, currentStageIndex + 1)
            }            
        }
        case actionTypes.SAVE_MISSION_PLAN: {
            // deep array clone
            const savedMissionPlan = JSON.parse(JSON.stringify(state.draftMissionStages)); 

            return {
                ...state,
                savedMissionPlan
            }            
        }
        case actionTypes.REMOVE_DRAFT_MISSION_PLAN: {
            return {
                ...state,
                draftMissionStages: []
            }            
        }
        case actionTypes.REMOVE_SAVED_MISSION_PLAN: {
            return {
                ...state,
                savedMissionPlan: []
            }            
        }
        case actionTypes.TOGGLE_MISSION_PLAN_VIEWER_STATE: {            
            return {
                ...state,
                viewerState: state.viewerState === viewerStates.draft ? viewerStates.savedMission : viewerStates.draft
            }            
        }
        case actionTypes.LOAD_DEFAULT_PLAN: {

            if (state.viewerState === viewerStates.savedMission) {
                return {
                    ...state,
                    savedMissionPlan: action.payload                
                }   
            } else {
                return {
                    ...state,
                    draftMissionStages: action.payload                
                }   
            }
         
        }
        default:
            return state;
    }
};

export default plannerReducer;