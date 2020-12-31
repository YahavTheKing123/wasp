import actionTypes from '../actions/actionTypes';

const initialState = {    
    isMapCoreSDKLoaded: false,
};

const mapReducer = (state = initialState, action ) => {
    switch (action.type) {
        case actionTypes.SET_MAPCORE_SDK_LOADED_FLAG:
            return {
                ...state,
                isMapCoreSDKLoaded: true
            }
        default:
            return state;
    }
};

export default mapReducer;