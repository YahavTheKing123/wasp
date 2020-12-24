import actionTypes from '../actions/actionTypes';

const initialState = {
    
};

const outputReducer = (state = initialState, action ) => {
    switch (action.type) {
        case actionTypes.TOGGLE_SIDE_BAR: {
            return {
                ...state,
                toasts: state.toasts.filter(t => !t.alwaysOnTop)
            }
        }
        default:
            return state;
    }
};

export default outputReducer;