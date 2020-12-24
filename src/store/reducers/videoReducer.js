import actionTypes from '../actions/actionTypes';

const initialState = {    
    systemCurrentAction: '',
};

const videoReducer = (state = initialState, action ) => {
    switch (action.type) {
        case actionTypes.COMPOSE_WITH_PULL_SUCCESS:
            return {
                ...state,
                isComposeWithPullAction: false
            }
        default:
            return state;
    }
};

export default videoReducer;