import { logSeverities } from './config';
import actionTypes from './store/actions/actionTypes';
import actions from './store/actions';
import externalConfig from './ExternalConfigurationHandler';
import { store } from './index';


class RosWebSocket {

    rosWebSocket = null;
    rosWebSockets = {};

    RECONNECT_TIMEOUT = 2000;

    showMessage(droneNum, message, severity, isRemoved = false) {
        const {dispatch, getState} = store;

        const {selectedDrone} = getState().map;
        if (droneNum !== selectedDrone) return;

        dispatch(
            actions.showGlobalMessage({ text: message, type: severity, isRemoved })
        );
    }

    register(droneNumber) {
        try {
            const { ROS_BE_PORT, ROS_BE_PROTOCOL, DRONES_DATA } = externalConfig.getConfiguration();
            const url = `${ROS_BE_PROTOCOL}://${DRONES_DATA.segment}.${droneNumber}:${ROS_BE_PORT}`;

            this.showMessage(droneNumber, `Trying to connect ros websocket on: ${url}`, logSeverities.info, true);

            this.rosWebSockets[droneNumber] = new window.ROSLIB.Ros({ url });

            this.rosWebSockets[droneNumber].on('connection', () => {
                this.showMessage(droneNumber, `Connected successfuly to ros websocket`, logSeverities.success, true);
                store.dispatch({ type: actionTypes.ROSS_WEBSOCKET_CONNECTION_SUCCESS });

                store.dispatch(actions.subscribeToDroneData(droneNumber));
                store.dispatch(actions.subscribeToSkeletonRange(droneNumber));
                store.dispatch(actions.subscribeToWeaponDetection(droneNumber));
            });

            this.rosWebSockets[droneNumber].on('error', error => {
                this.showMessage(droneNumber, `Failed to connect ros websocket on: ${url}`, logSeverities.error);
                store.dispatch({ type: actionTypes.ROSS_WEBSOCKET_CONNECTION_FAILED });
                console.log(error);
            });

            this.rosWebSockets[droneNumber].on('close', () => {
                this.showMessage(droneNumber, `Connection to ros websocket on: ${url} closed`, logSeverities.error);
                store.dispatch({ type: actionTypes.ROSS_WEBSOCKET_CONNECTION_CLOSED });
                this.reRegister(droneNumber);
            });
        } catch (e) {
            console.log("RosWebSocket.register() Exception:" + e);
        }
    }


    registerAll = () => {
        const { DRONES_DATA } = externalConfig.getConfiguration();
        for (const droneNumber of DRONES_DATA.dronesList) {
            this.register(droneNumber);
        }
    }


    reRegister = (droneNumber) => {
        setTimeout(() => this.register(droneNumber), this.RECONNECT_TIMEOUT);
    }

    getRosWebsocketObject(droneNumber = externalConfig.getConfiguration().selectedDrone) {
        if (this.rosWebSockets[droneNumber] == null) {
            this.register(droneNumber);
        }
        return this.rosWebSockets[droneNumber];
    }
}

export default new RosWebSocket();



