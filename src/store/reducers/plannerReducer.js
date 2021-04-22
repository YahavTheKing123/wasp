import actionTypes from '../actions/actionTypes';

const initialState = {
    missionStages: [],
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
                missionStages: [...state.missionStages, action.payload]
            }
        case actionTypes.DELETE_MISSION_PLAN_STAGE:
            return {
                ...state,
                missionStages: state.missionStages.filter(stage => stage.stageId !== action.payload.id)
            }
        case actionTypes.EDIT_MISSION_PLAN_STAGE: {
            return {
                ...state,
                missionStages: [
                    ...state.missionStages.slice(0, action.payload.stageIndex),
                    action.payload.stage,
                    ...state.missionStages.slice(action.payload.stageIndex + 1),
                ]
            }
        }
        case actionTypes.MOVE_DOWN_MISSION_PLAN_STAGE: {
            const currentStageIndex = action.payload;

            if (currentStageIndex === 0) return state;
            // swapping the elements in immutable way:
            return {
                ...state,
                missionStages: immutablySwapItems(state.missionStages, currentStageIndex, currentStageIndex - 1)

            }            
        }
        case actionTypes.MOVE_UP_MISSION_PLAN_STAGE: {
            const currentStageIndex = action.payload;

            if (state.missionStages.length === 0 ||
                currentStageIndex === state.missionStages.length - 1) return state;
            // swapping the elements in immutable way:
            return {
                ...state,
                missionStages: immutablySwapItems(state.missionStages, currentStageIndex, currentStageIndex + 1)
            }            
        }
        default:
            return state;
    }
};

export default plannerReducer;