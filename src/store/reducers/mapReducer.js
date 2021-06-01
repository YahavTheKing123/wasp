import actionTypes from '../actions/actionTypes';
import * as geoCalculations from '../../utils/geoCalculations';

const initialState = {
    isMapCoreSDKLoaded: false,
    mapToShow: null,
    workingOrigin: null,
    enemyPositionOffset: null,
    dronesPositions: {},
    selectedDrone: "115" //externalConfig.getConfiguration().DRONES_DATA.selectedDrone
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
            let dronePosition = { ...state.dronesPositions[action.payload.droneNumber] };
            dronePosition.angle = geoCalculations.quaternionToYaw(action.payload.droneRotationQuaternion);
            dronePosition.offset = action.payload.dronePositionOffset;
            return {
                ...state,
                dronesPositions: {
                    ...state.dronesPositions,
                    [action.payload.droneNumber]: dronePosition
                },
            }
        case actionTypes.GET_ENEMY_POSITION:
            return {
                ...state,
                enemyPositionOffset: action.payload.enemyPosition
            }
        case actionTypes.SELECT_DRONE: {
            return {
                ...state,
                selectedDrone: action.payload.droneNumber
            }
        }
        case actionTypes.DELETE_DRONE_POSITION:{
            return {
                ...state,
                dronesPositions: {
                    ...state.dronesPositions,
                    [state.selectedDrone]: null
                },
            }
        }
        case actionTypes.SAVE_ORIGIN_COORDINATE:{
            let droneData = { ...state.dronesPositions[state.selectedDrone] };
            droneData.workingOrigin = {
                coordinate: action.payload.coordinate,
                angle: action.payload.angle
            };

            return {
                ...state,
                dronesPositions: {
                    ...state.dronesPositions,
                    [state.selectedDrone]: droneData
                },
            }
        }
        default:
            return state;
    }
};

export default mapReducer;