import actionTypes from '../actions/actionTypes';

const initialState = {
    isMapCoreSDKLoaded: false,
    mapToShow: null,
    droneMoveOffset: [],
    lastPosition: {}
};

const mapReducer = (state = initialState, action) => {
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
        case actionTypes.GET_DRONE_POSITION_OFFSET:
            return {
                ...state,
                dronePositionOffset: action.payload.dronePositionOffset
            }
        case actionTypes.UPDATE_DRONE_LAST_POSITION:
            return {
                ...state,
                lastPosition: action.payload.lastPosition
            }

        default:
            return state;
    }
};

export default mapReducer;