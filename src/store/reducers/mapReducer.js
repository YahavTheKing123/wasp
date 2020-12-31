import actionTypes from '../actions/actionTypes';

const initialState = {    
    isMapCoreSDKLoaded: false,
    mapToShow: null
};

const mapReducer = (state = initialState, action ) => {
    switch (action.type) {
        case actionTypes.SET_MAPCORE_SDK_LOADED_FLAG:
            return {
                ...state,
                isMapCoreSDKLoaded: true
            }
        case actionTypes.SET_MAP_TO_SHOW:
            return {
                ...state,
                mapToShow: action.payload
            }
        default:
            return state;
    }
};

export default mapReducer;