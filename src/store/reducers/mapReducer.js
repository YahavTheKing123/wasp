import actionTypes from '../actions/actionTypes';

const initialState = {
    isMapCoreSDKLoaded: false,
    mapToShow: null,
    droneMoveOffset: [],
    lastPosition: {},
    workingOrigin : null
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
        case actionTypes.SAVE_DRONE_LAST_POSITION:
            return {
                ...state,
                lastPosition: action.payload.lastPosition
            }
        case actionTypes.SAVE_ORIGIN_COORDINATE:
            return {
                ...state,
                workingOrigin: {
                    coordinate: action.payload.coordinate,
                    angle: action.payload.angle
                }
            }

        default:
            return state;
    }
};

export default mapReducer;