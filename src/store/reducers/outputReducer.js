import actionTypes from '../actions/actionTypes';

const initialState = {
    skeletonRange: 'N/A',
    weaponDetected: false
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
        default:
            return state;
    }
};

export default outputReducer;