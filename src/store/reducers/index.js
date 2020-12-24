import {combineReducers} from 'redux';

import mapReducer from './mapReducer';
import videoReducer from './videoReducer';
import outputReducer from './outputReducer';

const rootReducer = combineReducers({
	map: mapReducer,
    output: outputReducer,
    video: videoReducer,
});

export default rootReducer;
