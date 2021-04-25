import * as map from './mapActions';
import * as output from './outputActions';
import * as video from './videoActions';
import * as layout from './layoutActions';
import * as planner from './plannerActions';

const actionCreators = {
    ...map,    
    ...output,
    ...video,
    ...layout,
    ...planner
};

export default actionCreators;