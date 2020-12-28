import React, { Component } from 'react';
import cn from './Video.module.css';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import externalConfig from '../../ExternalConfigurationHandler';
import config from '../../config';

class Video extends Component {

    async getVideoSrc() {
        const {BE_PORT, BE_IP} = await externalConfig.getConfiguration();

        //const snapshotUrl = `${config}`

        if (this.props.isPaused) {
            //return `http://192.168.1.100:8081/snapshot?topic=/d415/color/image_raw`
            return `//camera.ehps.ncsu.edu:8100/c8`
        } else {
            //return `//192.168.1.100:8081/stream?topic=/d415/color/image_raw`
            return `//camera.ehps.ncsu.edu:8100/c8`
        }
    }
    
    onVideoError = (e) => {
        console.log('error when trying to load camera video', e);
    }

    render() {
        return (
            <div className={cn.Wrapper}>
                <img
                    onError={this.onVideoError}
                    className={cn.VideoImage}
                    src={this.getVideoSrc()}
                    id='droneImage'
                    onClick={this.props.pointVideoImage}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isPaused: state.video.isPaused
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        pointVideoImage: e => dispatch(actions.pointVideoImage(e))
    };
};

export default connect(mapStateToProps, mapDispachToProps)(Video);


