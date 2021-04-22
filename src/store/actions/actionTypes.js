const actionTypes = {
	/* Video */
	PAUSE_VIDEO: 'PAUSE_VIDEO',
	RESUME_VIDEO: 'RESUME_VIDEO',

	LOACTE_START: 'LOACTE_START',
	LOACTE_SUCCESS: 'LOACTE_SUCCESS',
	LOACTE_FAILED: 'LOACTE_FAILED',

	RESET_START: 'RESET_START',
	RESET_SUCCESS: 'RESET_SUCCESS',
	RESET_FAILED: 'RESET_FAILED',

	TAKE_OFF_START: 'TAKE_OFF_START',
	TAKE_OFF_SUCCESS: 'TAKE_OFF_SUCCESS',
	TAKE_OFF_FAILED: 'TAKE_OFF_FAILED',

	SET_EXPOSURE_START: 'SET_EXPOSURE_START',
	SET_EXPOSURE_SUCCESS: 'SET_EXPOSURE_SUCCESS',
	SET_EXPOSURE_FAILED: 'SET_EXPOSURE_FAILED',
	
	START_INDOOR_EXPLORATION: 'START_INDOOR_EXPLORATION',
	SET_INDOOR_EXPLORATION_FLAG: 'SET_INDOOR_EXPLORATION_FLAG',
	REMOVE_INDOOR_EXPLORATION_FLAG: 'REMOVE_INDOOR_EXPLORATION_FLAG',
	SET_MISSION_STATE: 'SET_MISSION_STATE',

	GO_TO_LOCATION_START: 'GO_TO_LOCATION_START',
	GO_TO_LOCATION_SUCCESS: 'GO_TO_LOCATION_SUCCESS',
	GO_TO_LOCATION_FAILED: 'GO_TO_LOCATION_FAILED',

	POINT_ON_VIDEO_IMAGE_START: 'POINT_ON_VIDEO_IMAGE_START',
	POINT_ON_VIDEO_IMAGE_SUCCESS: 'POINT_ON_VIDEO_IMAGE_SUCCESS',
	POINT_ON_VIDEO_IMAGE_FAILED: 'POINT_ON_VIDEO_IMAGE_FAILED',

	ROSS_WEBSOCKET_CONNECTION_SUCCESS: 'ROSS_WEBSOCKET_CONNECTION_SUCCESS',
	ROSS_WEBSOCKET_CONNECTION_FAILED: 'ROSS_WEBSOCKET_CONNECTION_FAILED',
	ROSS_WEBSOCKET_CONNECTION_CLOSED: 'ROSS_WEBSOCKET_CONNECTION_CLOSED',
	ROSS_WEBSOCKET_CONNECTION_START: 'ROSS_WEBSOCKET_CONNECTION_START',

	/* UI */
	SHOW_GLOBAL_MESSAGE: 'SHOW_GLOBAL_MESSAGE',
	REMOVE_GLOBAL_MESSAGE: 'REMOVE_GLOBAL_MESSAGE',
	SHOW_CONTEXT_MENU: 'SHOW_CONTEXT_MENU',
	CLOSE_CONTEXT_MENU: 'CLOSE_CONTEXT_MENU',
	SHOW_POPUP: 'SHOW_POPUP',
	HIDE_POPUP: 'HIDE_POPUP',
	IMAGE_SENT_TO_DRONE: 'IMAGE_SENT_TO_DRONE',

	/* Map */
	SET_MAPCORE_SDK_LOADED_FLAG: 'SET_MAPCORE_SDK_LOADED_FLAG',
	SET_MAP_TO_SHOW: 'SET_MAP_TO_SHOW' ,
	GET_DRONE_POSITION_OFFSET: 'GET_DRONE_POSITION_OFFSET',
	UPDATE_DRONE_LAST_POSITION: 'UPDATE_DRONE_LAST_POSITION',
	

	/* Output */
	UPDATE_SKELETON_RANGE: 'UPDATE_SKELETON_RANGE',
	SET_WEAPON_DETECTION: 'SET_WEAPON_DETECTION',
	
	/*Planner */
	ADD_NEW_MISSION_PLAN_STAGE: 'ADD_NEW_MISSION_PLAN_STAGE',
	DELETE_MISSION_PLAN_STAGE: 'DELETE_MISSION_PLAN_STAGE',
	EDIT_MISSION_PLAN_STAGE: 'EDIT_MISSION_PLAN_STAGE',
	MOVE_UP_MISSION_PLAN_STAGE: 'MOVE_UP_MISSION_PLAN_STAGE',
	MOVE_DOWN_MISSION_PLAN_STAGE: 'MOVE_DOWN_MISSION_PLAN_STAGE',
};
export default actionTypes;
