import actionTypes from '../actions/actionTypes';
import * as geoCalculations from '../../utils/geoCalculations';
import externalConfig from '../../ExternalConfigurationHandler';
const initialState = {
    isMapCoreSDKLoaded: false,
    mapToShow: null,
    enemyPositionOffset: null,
    dronesPositions: {},
    selectedDrone: null
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
        case actionTypes.GET_DRONE_POSITION_OFFSET: {
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
        }
        case actionTypes.GET_ENEMY_POSITION: {
            let range = action.payload.range;
            let droneNumber = action.payload.droneNumber;
            let droneAngle = state.dronesPositions[droneNumber].angle;

            let enemyOffsetFromDrone = {
                x: range * Math.sin(360 - droneAngle),
                y: - range * Math.cos(360 - droneAngle),
                z: 0
            }
            let enemyOffset = geoCalculations.addCoordinates(state.dronesPositions[droneNumber].offset, enemyOffsetFromDrone);

            let dronePosition = { ...state.dronesPositions[action.payload.droneNumber] };

            if (dronePosition.enemyOffsets &&
                dronePosition.enemyOffsets.some(offset => (geoCalculations.calculateDistanceBetween2Points(offset, enemyOffset) < 0.5))) {
                //enemy already exists in this radius
                return state;
            }
            dronePosition.enemyOffsets = dronePosition.enemyOffsets ? [...dronePosition.enemyOffsets, enemyOffset] : [enemyOffset];

            return {
                ...state,
                dronesPositions: {
                    ...state.dronesPositions,
                    [action.payload.droneNumber]: dronePosition
                },
            }
        }
        case actionTypes.SELECT_DRONE: {
            return {
                ...state,
                selectedDrone: action.payload.droneNumber
            }
        }
        case actionTypes.DELETE_DRONE_POSITION: {
            return {
                ...state,
                dronesPositions: {
                    ...state.dronesPositions,
                    [state.selectedDrone]: null
                },
            }
        }
        case actionTypes.SAVE_ORIGIN_COORDINATE: {
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