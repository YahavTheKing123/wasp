import config, { logSeverities } from './config';
import actionTypes from './store/actions/actionTypes';
import actions from './store/actions';
import externalConfig from './ExternalConfigurationHandler';
import {store} from './index';


class RosWebSocket {

    rosWebSocket = null;
    RECONNECT_TIMEOUT = 2000;


    register() {
        try {
            const { ROS_BE_PROTOCOL, BE_IP, ROS_BE_PORT } = externalConfig.getConfiguration();
            const url =  `${ROS_BE_PROTOCOL}://${BE_IP}:${ROS_BE_PORT}`;
            store.dispatch({type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: {text: `Trying to connect ros websocket on: ${url}`, type:logSeverities.info}})
            store.dispatch(actions.showGlobalMessage({text: `Trying to connect ros websocket on: ${url}`, type:logSeverities.info}))
            console.log("Trying to connect ros websocket");
            this.rosWebSocket = new window.ROSLIB.Ros({url});
    
            this.rosWebSocket.on('connection', () => {
                store.dispatch(actions.showGlobalMessage({text: `Connected successfuly to ros websocket`, type:logSeverities.success, isRemoved: true}))                
                store.dispatch({type: actionTypes.ROSS_WEBSOCKET_CONNECTION_SUCCESS});

                store.dispatch(actions.subscribeToDroneData());
                store.dispatch(actions.subscribeToSkeletonRange());
                store.dispatch(actions.subscribeToWeaponDetection());

            });
    
            this.rosWebSocket.on('error', error => {                
                store.dispatch(actions.showGlobalMessage({text: `Failed to connect ros websocket on: ${url}`, type:logSeverities.error}));
                store.dispatch({type: actionTypes.ROSS_WEBSOCKET_CONNECTION_FAILED});
                console.log(error);
            });
    
            this.rosWebSocket.on('close', () => {
                store.dispatch(actions.showGlobalMessage({text: `Connection to ros websocket on: ${url} closed`, type:logSeverities.error}))
                store.dispatch({type: actionTypes.ROSS_WEBSOCKET_CONNECTION_CLOSED});
                this.reRegister();
            });
        } catch (e) {
            console.log("RosWebSocket.register() Exception:" + e);
        }
    }

    reRegister = () => {
        setTimeout( () => this.register() , this.RECONNECT_TIMEOUT);
    }

    getRosWebsocketObject() {
        if (this.rosWebSocket == null) {
            this.register();
        }
        return this.rosWebSocket;
    }
}

export default new RosWebSocket();



