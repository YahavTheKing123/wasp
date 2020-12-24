import config, { logSeverities } from '../config';
import actionTypes from './actions/actionTypes';
//import {addToast} from './actions/toastsActions';
import actions from './actions';
import axios from 'axios';

export async function websocketRegistration(store) {
    try {
        const configRes = await axios.get(`/configuration.json`);
        
        const { BE_PROTOCOL, BE_IP, BE_PORT } = configRes.data;

        const rosWebSocket = new window.ROSLIB.Ros({
            url: `${BE_PROTOCOL}://${BE_IP}:${BE_PORT}`,
        });

        rosWebSocket.on('connection', function () {
            console.log('Connected to websocket server.');
        });

        rosWebSocket.on('error', function (error) {
            console.log('Error connecting to websocket server: ', error);
        });

        rosWebSocket.on('close', function () {
            console.log('Connection to websocket server closed.');
        });
    } catch (e) {
        console.log(e);
    }
}
