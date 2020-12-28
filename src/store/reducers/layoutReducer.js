import actionTypes from '../actions/actionTypes';

const initialState = {        
    appGlobalMessage: null,
    isRosWebsocketConncted: false
};

const layoutReducer = (state = initialState, action ) => {
    switch (action.type) {
        case actionTypes.SHOW_GLOBAL_MESSAGE:
            return {
                ...state,
                appGlobalMessage: {text: action.payload.text, type: action.payload.type}
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
        default:
            return state;
    }
};

export default layoutReducer;