import actionTypes from '../actions/actionTypes';

const initialState = {        
    isPaused: false,
    isRecording: false
};

const videoReducer = (state = initialState, action ) => {
    switch (action.type) {
        case actionTypes.PAUSE_VIDEO:
            return {
                ...state,
                isPaused: true
            }
        case actionTypes.RESUME_VIDEO:
            return {
                ...state,
                isPaused: false
            }
        case actionTypes.TOGGLE_RECORDING_STATE:
            return {
                ...state,
                isRecording: !state.isRecording
            }    
        default:
            return state;
    }
};

export default videoReducer;