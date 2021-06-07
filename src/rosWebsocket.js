import { logSeverities } from './config';
import actionTypes from './store/actions/actionTypes';
import actions from './store/actions';
import externalConfig from './ExternalConfigurationHandler';
import { store } from './index';


class RosWebSocket {

    rosWebSocket = null;
    rosWebSockets = {};

    RECONNECT_TIMEOUT = 2000;


    register(droneNumber) {
        try {
            const { ROS_BE_PORT, ROS_BE_PROTOCOL, DRONES_DATA } = externalConfig.getConfiguration();
            const url = `${ROS_BE_PROTOCOL}://${DRONES_DATA.segment}.${droneNumber}:${ROS_BE_PORT}`;
            store.dispatch({ type: actionTypes.SHOW_GLOBAL_MESSAGE, payload: { text: `Trying to connect ros websocket on: ${url}`, type: logSeverities.info } })
            store.dispatch(actions.showGlobalMessage({ text: `Trying to connect ros websocket on: ${url}`, type: logSeverities.info }))
            console.log("Trying to connect ros websocket");
            this.rosWebSockets[droneNumber] = new window.ROSLIB.Ros({ url });

            this.rosWebSockets[droneNumber].on('connection', () => {
                store.dispatch(actions.showGlobalMessage({ text: `Connected successfuly to ros websocket`, type: logSeverities.success, isRemoved: true }))
                store.dispatch({ type: actionTypes.ROSS_WEBSOCKET_CONNECTION_SUCCESS });

                store.dispatch(actions.subscribeToDroneData(droneNumber));
                store.dispatch(actions.subscribeToSkeletonRange(droneNumber));
                store.dispatch(actions.subscribeToWeaponDetection(droneNumber));
                var viewer = new window.ROSLIB.Viewer({
                    divID: 'occupancyTab',
                    width: 600,
                    height: 500
                });
                var gridClient =  new window.ROSLIB.OccupancyGridClient({
                    ros: this.rosWebSockets[droneNumber],
                    rootObject: viewer.scene
                });
                gridClient.on('change', function () {
                    viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
                });



            });

            this.rosWebSockets[droneNumber].on('error', error => {
                store.dispatch(actions.showGlobalMessage({ text: `Failed to connect ros websocket on: ${url}`, type: logSeverities.error }));
                store.dispatch({ type: actionTypes.ROSS_WEBSOCKET_CONNECTION_FAILED });
                console.log(error);
            });

            this.rosWebSockets[droneNumber].on('close', () => {
                store.dispatch(actions.showGlobalMessage({ text: `Connection to ros websocket on: ${url} closed`, type: logSeverities.error }))
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



