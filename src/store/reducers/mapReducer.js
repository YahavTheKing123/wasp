import actionTypes from '../actions/actionTypes';

const initialState = {    
    selectedSystem: null,
};

const mapReducer = (state = initialState, action ) => {
    switch (action.type) {
        case actionTypes.GET_SYSTEMS_START:
            return {
                ...state,
                error: null,
                systems: null,
                formations: null,
                versions: null,
                systemsLoading: true
            }
        default:
            return state;
    }
};

export default mapReducer;