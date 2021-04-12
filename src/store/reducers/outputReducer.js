import actionTypes from '../actions/actionTypes';

const initialState = {
    skeletonRange: 'N/A',
    weaponDetected: false,
    indoorExplorationFlag: false,
    missionState: ''
};

const outputReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_SIDE_BAR: {
            return {
                ...state,
                toasts: state.toasts.filter(t => !t.alwaysOnTop)
            }
        }
        case actionTypes.UPDATE_SKELETON_RANGE:
            return {
                ...state,
                skeletonRange: action.payload.skeletonRange
            }
        case actionTypes.SET_WEAPON_DETECTION:
            return {
                ...state,
                weaponDetected: action.payload.weaponDetected
            }
        case actionTypes.SET_INDOOR_EXPLORATION_FLAG:
            return {
                ...state,
                indoorExplorationFlag: true
            }
        case actionTypes.REMOVE_INDOOR_EXPLORATION_FLAG:
            return {
                ...state,
                indoorExplorationFlag: false
            }
        case actionTypes.SET_MISSION_STATE:
            return {
                ...state,
                missionState: action.payload.missionState
            }
        default:
            return state;
    }
};

export default outputReducer;