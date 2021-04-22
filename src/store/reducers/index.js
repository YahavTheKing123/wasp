import {combineReducers} from 'redux';

import mapReducer from './mapReducer';
import videoReducer from './videoReducer';
import outputReducer from './outputReducer';
import layoutReducer from './layoutReducer';
import plannerReducer from './plannerReducer';

const rootReducer = combineReducers({
	map: mapReducer,
    output: outputReducer,
    video: videoReducer,
    layout: layoutReducer,
    planner: plannerReducer,
});

export default rootReducer;
