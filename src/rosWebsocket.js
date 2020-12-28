import config, { logSeverities } from './config';
import actionTypes from './store/actions/actionTypes';
import axios from 'axios';
import externalConfig from './ExternalConfigurationHandler';

class RosWebSocket {

    rosWebSocket = null;

    async register(store) {
        try {
                        
            const { ROS_BE_PROTOCOL, BE_IP, ROS_BE_PORT } = externalConfig.getConfiguration();
            const url =  `${ROS_BE_PROTOCOL}://${BE_IP}:${ROS_BE_PORT}`;
            store.dispatch({type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: {text: `Trying to connect ros websocket on: ${url}`, type:logSeverities.info}})

            this.rosWebSocket = new window.ROSLIB.Ros({url});
    
            this.rosWebSocket.on('connection', () => {
                store.dispatch({type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: {text: `Connected successfuly to ros websocket`, type:logSeverities.success}})
                store.dispatch({type: actionTypes.ROSS_WEBSOCKET_CONNECTION_SUCCESS});
            });
    
            this.rosWebSocket.on('error', error => {                
                store.dispatch({type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: {text: `Failed to connect ros websocket on: ${url}`, type:logSeverities.error}})
                store.dispatch({type: actionTypes.ROSS_WEBSOCKET_CONNECTION_FAILED});
                console.log(error);
            });
    
            this.rosWebSocket.on('close', () => {
                store.dispatch({type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: {text: `Connection to ros websocket on: ${url} closed`, type:logSeverities.error}})
                store.dispatch({type: actionTypes.ROSS_WEBSOCKET_CONNECTION_CLOSED});
            });
        } catch (e) {
            console.log(e);
        }
    }

    getRosWebsocketObject() {
        return this.rosWebSocket;
    }
}

export default new RosWebSocket();



