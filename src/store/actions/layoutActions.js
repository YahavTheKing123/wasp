


import actionTypes from './actionTypes';


export const showGlobalMessage = ({text, type, isRemoved}) => {
    return (dispatch) => {
        const payload = {
            text,
            type
        }
        dispatch({type: actionTypes.SHOW_GLOBAL_MESSAGE, payload});
        if (isRemoved) {
            setTimeout(() => dispatch({type: actionTypes.REMOVE_GLOBAL_MESSAGE}), 3000)
        }
    };
};

