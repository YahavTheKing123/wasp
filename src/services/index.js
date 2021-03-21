import rosWebSocket from '../rosWebsocket';

// export const pointingFingerEncode = new window.ROSLIB.Service({
//     ros : rosWebSocket.getRosWebsocketObject(),
//     name : 'EncodeCompressed',
//     serviceType : 'pointingfinger/EncodeCompressed'
// });

// export const pointingFingerLocate = new window.ROSLIB.Service({
//     ros : rosWebSocket.getRosWebsocketObject(),
//     name : 'LocateCompressed',
//     serviceType : 'pointingfinger/LocateCompressed'
// });

// export const pointingFingerReset = new window.ROSLIB.Service({
//     ros : rosWebSocket.getRosWebsocketObject(),
//     name : 'Reset',
//     serviceType : 'pointingfinger/Reset'
// });

// export const seekerReset = new window.ROSLIB.Service({
//     ros : rosWebSocket.getRosWebsocketObject(),
//     name : 'seeker/Reset',
//     serviceType : 'seeker/Reset'
// });

// export const seekerTakeoff = new window.ROSLIB.Service({
//     ros : rosWebSocket.getRosWebsocketObject(),
//     name : 'seeker/Takeoff',
//     serviceType : 'seeker/Takeoff'
// });

export function getService(serviceName) {

    const services = {
        pointingFingerEncode: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(),
            name: 'EncodeCompressed',
            serviceType: 'pointingfinger/EncodeCompressed'
        }),
        pointingFingerLocate: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(),
            name: 'LocateCompressed',
            serviceType: 'pointingfinger/LocateCompressed'
        }),
        pointingFingerReset: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(),
            name: 'Reset',
            serviceType: 'pointingfinger/Reset'
        }),
        seekerReset: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(),
            name: 'seeker/Reset',
            serviceType: 'seeker/Reset'
        }),
        seekerTakeoff: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(),
            name: 'seeker/Takeoff',
            serviceType: 'seeker/Takeoff'
        }),
        flyToTopic: new window.ROSLIB.Topic({
            ros: rosWebSocket.getRosWebsocketObject(),
            name: '/seeker/TranslatePosition',
            messageType: 'geometry_msgs/Vector3'
        }),
        setExposure: new window.ROSLIB.Service({
            ros: rosWebSocket.getRosWebsocketObject(),
            name: '/d415/rgb_camera/set_parameters',
            serviceType: 'dynamic_reconfigure/Reconfigure'
        }),
        getDronePosition: new window.ROSLIB.TFClient({
            ros: rosWebSocket.getRosWebsocketObject(),
            fixedFrame: 'map',
            angularThres: 0.1,
            transThres: 0.1
        }),
        getDetectionImage: new window.ROSLIB.Topic({
            ros: rosWebSocket.getRosWebsocketObject(),
            name: '/seeker/detections',
            messageType: 'vision_msgs/Detection2DArray'
        }),
        getSkeletonRenge: new window.ROSLIB.Topic({
            ros: rosWebSocket.getRosWebsocketObject(),
            name: '/seeker/Range',
            messageType: ''
        }),
        

        
    }

    return services[serviceName];
}