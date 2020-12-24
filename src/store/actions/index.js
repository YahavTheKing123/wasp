import * as map from './mapActions';
import * as output from './outputActions';
import * as video from './videoActions';

const actionCreators = {
    ...map,    
    ...output,
    ...video,
};

export default actionCreators;