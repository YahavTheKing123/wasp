import {combineReducers} from 'redux';

import mapReducer from './mapReducer';
import videoReducer from './videoReducer';
import outputReducer from './outputReducer';
import layoutReducer from './layoutReducer';

const rootReducer = combineReducers({
	map: mapReducer,
    output: outputReducer,
    video: videoReducer,
    layout: layoutReducer,
});

export default rootReducer;
