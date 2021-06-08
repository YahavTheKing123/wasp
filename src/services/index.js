import rosWebSocket from '../rosWebsocket';
import { store } from '../index';
// export const pointingFingerEncode = new window.ROSLIB.Service({
//     ros : rosWebSocket.getRosWebsocketObject(droneNumber),
//     name : 'EncodeCompressed',
//     serviceType : 'pointingfinger/EncodeCompressed'
// });

// export const pointingFingerLocate = new window.ROSLIB.Service({
//     ros : rosWebSocket.getRosWebsocketObject(droneNumber),
//     name : 'LocateCompressed',
//     serviceType : 'pointingfinger/LocateCompressed'
// });

// export const pointingFingerReset = new window.ROSLIB.Service({
//     ros : rosWebSocket.getRosWebsocketObject(droneNumber),
//     name : 'Reset',
//     serviceType : 'pointingfinger/Reset'
// });

// export const seekerReset = new window.ROSLIB.Service({
//     ros : rosWebSocket.getRosWebsocketObject(droneNumber),
//     name : 'seeker/Reset',
//     serviceType : 'seeker/Reset'
// });

// export const seekerTakeoff = new window.ROSLIB.Service({
//     ros : rosWebSocket.getRosWebsocketObject(droneNumber),
//     name : 'seeker/Takeoff',
//     serviceType : 'seeker/Takeoff'
// });

export function getService(serviceName,droneNumber = store.getState().map.selectedDrone) {
    const services = {
        pointingFingerEncode: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: 'EncodeCompressed',
            serviceType: 'pointingfinger/EncodeCompressed'
        }),
        pointingFingerLocate: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: 'LocateCompressed',
            serviceType: 'pointingfinger/LocateCompressed'
        }),
        pointingFingerReset: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: 'Reset',
            serviceType: 'pointingfinger/Reset'
        }),
        seekerReset: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: 'seeker/Reset',
            serviceType: 'seeker/Reset'
        }),
        seekerTakeoff: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: 'seeker/Takeoff',
            serviceType: 'seeker/Takeoff'
        }),
        startIndoorExploration: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: 'seeker/SetIndoorState',
            serviceType: 'seeker/SetIndoorState'
        }),
        flyToTopic: new window.ROSLIB.Topic({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: '/seeker/TranslatePosition',
            messageType: 'geometry_msgs/Vector3'
        }),
        setExposure: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: '/d415/rgb_camera/set_parameters',
            serviceType: 'dynamic_reconfigure/Reconfigure'
        }),
        getDronePosition: new window.ROSLIB.TFClient({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            fixedFrame: 'map',
            angularThres: 0.1,
            transThres: 0.1
        }),
        getDroneExploreState: new window.ROSLIB.Topic({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: '/seeker/state',
            messageType: 'std_msgs/String'
        }),
        getSkeletonRange: new window.ROSLIB.Topic({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: '/seeker/SkeletonPos',
            messageType: 'std_msgs/Vector3Stamped'
        }),
        // Mission Plan Execute - state
        doMissionReset: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: '/seeker/DoMissionReset',
            serviceType: '/seeker/DoMissionReset'
        }),
        doMissionExecute: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: '/seeker/DoMissionExecute',
            serviceType: '/seeker/DoMissionExecute'
        }),
        addMissionTakeoff: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: '/seeker/AddMissionTakeoff',
            serviceType: '/seeker/AddMissionTakeoff'
        }),
        addMissionWP: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(droneNumber),
            name: '/seeker/AddMissionWP',
            serviceType: '/seeker/AddMissionWP'
        }),
  
    }

    return services[serviceName];
}