import actionTypes from '../actions/actionTypes';

const initialState = {
    appGlobalMessage: null,
    isRosWebsocketConncted: false,
    contextMenu: null,    //{x,y,menuItems}
    popupDetails: null,
    imageSentToDroneData: null,
    isMissionPlanScreenHidden: true,
    isPointSelectionMode: false
};

const layoutReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHOW_GLOBAL_MESSAGE:
            return {
                ...state,
                appGlobalMessage: { text: action.payload.text, type: action.payload.type }
            }
        case actionTypes.REMOVE_GLOBAL_MESSAGE:
            return {
                ...state,
                appGlobalMessage: null
            }
        case actionTypes.ROSS_WEBSOCKET_CONNECTION_SUCCESS: {
            return {
                ...state,
                isRosWebsocketConncted: true
            }
        }
        case actionTypes.ROSS_WEBSOCKET_CONNECTION_FAILED: {
            return {
                ...state,
                isRosWebsocketConncted: false
            }
        }
        case actionTypes.ROSS_WEBSOCKET_CONNECTION_CLOSED: {
            return {
                ...state,
                isRosWebsocketConncted: false
            }
        }
        case actionTypes.SHOW_CONTEXT_MENU: {
            const contextMenu = {
                x: action.payload.x,
                y: action.payload.y,
                options: action.payload.options,
                items: action.payload.items
            };
            return {
                ...state,
                contextMenu
            }
        }
        case actionTypes.CLOSE_CONTEXT_MENU: {
            return {
                ...state,
                contextMenu: null
            }
        }
        case actionTypes.SHOW_POPUP: {
            return {
                ...state,
                popupDetails: { ...action.payload }
            }
        }
        case actionTypes.HIDE_POPUP: {
            return {
                ...state,
                popupDetails: null
            }
        }
        case actionTypes.SELECT_POINT_FROM_MAP: {
            let popupDetails = {...state.popupDetails};
            popupDetails.modalChildProps.pointFromMap = action.payload.pointFromMap;
            return {
                ...state,
                popupDetails
            }
        }
        case actionTypes.TOGGLE_POINT_SELECTION_MODE: {
            return {
                ...state,
                isPointSelectionMode: !state.isPointSelectionMode
            }
        }
        case actionTypes.IMAGE_SENT_TO_DRONE: {
            return {
                ...state,
                imageSentToDroneData: action.payload
            }
        }
        case actionTypes.TOGGLE_MISSION_PLANNER_SCREEN: {
            return {
                ...state,
                isMissionPlanScreenHidden: !state.isMissionPlanScreenHidden
            }
        }
        default:
            return state;
    }
};

export default layoutReducer;