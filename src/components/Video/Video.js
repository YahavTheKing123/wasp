import React, { Component } from 'react';
import cn from './Video.module.css';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import externalConfig from '../../ExternalConfigurationHandler';
import config from '../../config';

class Video extends Component {

    state = {
        isImageLoadingError: false
    }

    getVideoSrc() {
        const {BE_PORT, BE_IP} = externalConfig.getConfiguration();

        const snapshotUrl = `//${BE_IP}:${BE_PORT}${config.urls.snapshot}`;
        const streamUrl = `//${BE_IP}:${BE_PORT}${config.urls.stream}`;

        if (this.props.isPaused) {
            return snapshotUrl;
            //return `//camera.ehps.ncsu.edu:8100/c8`
        } else {
            return streamUrl;
            //return `//camera.ehps.ncsu.edu:8100/c8`
        }
    }
    
    onVideoError = (e) => {        
        console.log('error when trying to load camera video', e);
        this.setState({
            isImageLoadingError: true
        })
    }

    renderImgElement() {

        if (this.state.isImageLoadingError) {
            return (
                <div className={cn.ErrorMessage}><span className={cn.ErrorIcon}></span> Error loading video stream</div>
            )
        }

        return (
            <img
                onError={this.onVideoError}
                className={cn.VideoImage}
                src={this.getVideoSrc()}
                id='droneImage'
                onClick={this.props.pointVideoImage}
            />
        )
    }

    render() {
        return (
            <div className={cn.Wrapper}>
                {this.renderImgElement()}
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


