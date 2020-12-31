import * as map from './mapActions';
import * as output from './outputActions';
import * as video from './videoActions';
import * as layout from './layoutActions';

const actionCreators = {
    ...map,    
    ...output,
    ...video,
    ...layout
};

export default actionCreators;