import React, { Component } from 'react';
import cn from './Video.module.css';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import actionTypes from '../../store/actions/actionTypes';
import externalConfig from '../../ExternalConfigurationHandler';
import config, {devVideoSnapshotUrl, devVideoStreamUrl} from '../../config';
import liveFeed from '../../assets/images/live_feed.svg';

class Video extends Component {

    state = {
        isImageLoadingError: false,
        isImageLoading: true,
        isFullScreen: false
    }

    getVideoSrc() {
        const {BE_PORT, BE_IP} = externalConfig.getConfiguration();

        const snapshotUrl = `//${BE_IP}:${BE_PORT}${config.urls.snapshot}`;
        const streamUrl = `//${BE_IP}:${BE_PORT}${config.urls.stream}`;

        if (this.props.isPaused) {
            return process.env.NODE_ENV === 'development' ? devVideoSnapshotUrl : snapshotUrl;
        } else {
            return process.env.NODE_ENV === 'development' ? devVideoStreamUrl : streamUrl;
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
    
    onFullScreenClick = () => {
        //const elem = document.querySelector('#droneImage');
        const elem = document.querySelector('#videoWrapper');
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
        this.setState({isFullScreen: true})
    }

    onExitFullScreenClick = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        this.setState({isFullScreen: false})
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
                    {this.props.isPaused ? 'Video paused' : <span className={cn.StreamingIconWrapper}>Video Feed<span className={cn.StreamingIcon}></span></span>}
                </div>
                <span className={cn.MoreActionsBtn} onClick={this.onMoreActionsClick}></span>
            </div>
        )
    }
    
    renderVideoFooter() {
        return (
            <>
                <button 
                    onClick={this.onPauseOrPlayClick} 
                    title={this.getPlayOrPauseTitle()} 
                    className={`${cn.ControlBtn} ${this.getPlayOrPauseButton()}`}>
                </button>
                <button 
                    onClick={this.state.isFullScreen ?  this.onExitFullScreenClick : this.onFullScreenClick} 
                    title={this.state.isFullScreen ? 'Exit Full Screen' : 'Full Screen'} 
                    className={`${cn.ControlBtn} ${this.state.isFullScreen ? cn.ExitFullScreen : cn.FullScreen}`}>
                </button>
            </>
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
                    crossorigin="anonymous"
                    onLoad={this.onVideoLoaded}
                    onError={this.onVideoError}
                    className={cn.VideoImage}
                    src={this.getVideoSrc()}
                    id='droneImage'
                    onClick={this.props.pointVideoImage}
                    //onTouchStart={this.props.pointVideoImage}
                />
                {this.renderVideoFooter()}
            </>
        )
    }

    render() {
        const fullHeightClass = this.state.isImageLoadingError || this.state.isImageLoading ? cn.FullHeight : '';
        return (
            <div className={`${cn.Wrapper} ${fullHeightClass}`} id='videoWrapper'>
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


