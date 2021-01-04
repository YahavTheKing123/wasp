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
            ros : rosWebSocket.getRosWebsocketObject(),
            name : 'EncodeCompressed',
            serviceType : 'pointingfinger/EncodeCompressed'
        }),
        pointingFingerLocate: new window.ROSLIB.Service({
            ros : rosWebSocket.getRosWebsocketObject(),
            name : 'LocateCompressed',
            serviceType : 'pointingfinger/LocateCompressed'
        }),
        pointingFingerReset: new window.ROSLIB.Service({
            ros : rosWebSocket.getRosWebsocketObject(),
            name : 'Reset',
            serviceType : 'pointingfinger/Reset'
        }),
        seekerReset: new window.ROSLIB.Service({
            ros : rosWebSocket.getRosWebsocketObject(),
            name : 'seeker/Reset',
            serviceType : 'seeker/Reset'
        }),    
        seekerTakeoff: new window.ROSLIB.Service({
            ros : rosWebSocket.getRosWebsocketObject(),
            name : 'seeker/Takeoff',
            serviceType : 'seeker/Takeoff'
        })    
    }    

    return services[serviceName];
}