import React, { Component } from 'react';
import cn from './Video.module.css';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import actionTypes from '../../store/actions/actionTypes';
import externalConfig from '../../ExternalConfigurationHandler';
import config from '../../config';

class Video extends Component {

    state = {
        isImageLoadingError: false,
        isImageLoading: true
    }

    getVideoSrc() {
        const {BE_PORT, BE_IP} = externalConfig.getConfiguration();

        const snapshotUrl = `//${BE_IP}:${BE_PORT}${config.urls.snapshot}`;
        const streamUrl = `//${BE_IP}:${BE_PORT}${config.urls.stream}`;

        if (this.props.isPaused) {
            //return `//camera.ehps.ncsu.edu:8100/c8`
            return snapshotUrl;
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

    onVideoLoaded = e => {
        this.setState({
            isImageLoading: false
        })
    }

    onPauseOrPlayClick = e => {
        e.stopPropagation();
        this.props.isPaused ? this.props.resume() : this.props.pause()
    }

    getPlayOrPauseButton() {
        return this.props.isPaused ? cn.Play : cn.Pause
    }

    getPlayOrPauseTitle() {
        return this.props.isPaused ? 'Play' : 'Pause'
    }

    renderVideoHeader() {        
        return (
            <div className={`${cn.VideoHeader}`}>
                <div className={cn.Description}>
                    {this.props.isPaused ? 'Video paused' : 'Streaming video'}
                </div>
                <span className={cn.MoreActionsBtn} onClick={this.onMoreActionsClick}></span>
            </div>
        )
    }

    renderImgElement() {

        if (this.state.isImageLoadingError) {
            return (
                <div className={cn.ErrorMessage}><span className={cn.ErrorIcon}></span> Error loading video stream</div>
            )
        }

        return (
            <>
                {this.renderVideoHeader()}
                <img
                    onLoad={this.onVideoLoaded}
                    onError={this.onVideoError}
                    className={cn.VideoImage}
                    src={this.getVideoSrc()}
                    id='droneImage'
                    onClick={this.props.pointVideoImage}
                />
                <div className={cn.VideoFooter}>
                    <button onClick={this.onPauseOrPlayClick} title={this.getPlayOrPauseTitle()} className={`${cn.ControlBtn} ${this.getPlayOrPauseButton()}`}></button>
                </div>
            </>
        )
    }

    render() {
        const fullHeightClass = this.state.isImageLoadingError || this.state.isImageLoading ? cn.FullHeight : '';
        return (
            <div className={`${cn.Wrapper} ${fullHeightClass}`}>
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
        pointVideoImage: e => dispatch(actions.pointVideoImage(e)),
        pause: () => dispatch({type:actionTypes.PAUSE_VIDEO}),
        resume: () => dispatch({type:actionTypes.RESUME_VIDEO}),
    };
};

export default connect(mapStateToProps, mapDispachToProps)(Video);


