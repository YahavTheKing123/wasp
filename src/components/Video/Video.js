import React, { Component } from 'react';
import cn from './Video.module.css';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import actionTypes from '../../store/actions/actionTypes';
import externalConfig from '../../ExternalConfigurationHandler';
import config, { devVideoSnapshotUrl, devVideoStreamUrl } from '../../config';
import targetIcon from '../../assets/images/target.svg';
import Slider from '../controls/Slider/Slider';


class Video extends Component {

    state = {
        isImageLoadingError: false,
        isImageLoading: true,
        isFullScreen: false,
        targetPosition: null,
        showTarget: true,
        showExposure: false,
        isRecording: false

    }

    componentDidMount() {
        //window.addEventListener('resize', this.setTargetPosition)
    }

    getVideoSrc() {
        const { BE_PORT, BE_IP } = externalConfig.getConfiguration();

        const snapshotUrl = `//${BE_IP}:${BE_PORT}${config.urls.videoSnapshot}`;
        const streamUrl = `//${BE_IP}:${BE_PORT}${config.urls.videoStream}`;

        if (this.props.isPaused) {
            return process.env.NODE_ENV === 'developments' ? devVideoSnapshotUrl : snapshotUrl;
        } else {
            return process.env.NODE_ENV === 'developments' ? devVideoStreamUrl : streamUrl;
        }
    }

    onVideoError = (e) => {
        console.log('error when trying to load camera video', e);
        this.setState({
            isImageLoadingError: true
        })
    }

    setTargetPosition = () => {
        const img = document.getElementById('droneImage');
        if (!img) return;
        const rect = img.getBoundingClientRect();
        if (!rect) return;

        this.setState({
            targetPosition: {
                top: rect.top + (rect.height / 2),
                left: rect.left + (rect.width / 2)
            }
        })
    }

    onVideoLoaded = e => {
        //this.setTargetPosition();
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
        this.setState({ isFullScreen: true })
    }

    onExitFullScreenClick = () => {
        // bug when we are in full screen and click on ESC key
        if (document.fullscreenElement === null) {
            this.onFullScreenClick();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
            this.setState({ isFullScreen: false })
        }
    }

    getPlayOrPauseButton() {
        return this.props.isPaused ? cn.Play : cn.Pause
    }

    getPlayOrPauseTitle() {
        return this.props.isPaused ? 'Play' : 'Pause'
    }

    getRecordButton = () => {
        return this.state.isRecording ? cn.RecordindIcon : cn.RecordIcon
    }

    getRecordTitle = () => {
        return this.state.isRecording ? 'Recording' : 'Start Recording'
    }

    renderVideoHeader() {
        const hideTargetClass = this.state.showTarget ? '' : cn.HideTarget;
        return (
            <div className={`${cn.VideoHeader}`}>
                <div className={cn.Description}>
                    {this.props.isPaused ? 'Video paused' :
                        <span className={cn.StreamingIconWrapper}>Video Feed<span className={cn.StreamingIcon} /></span>
                    }
                </div>
                <span className={`${cn.Exposure}`}
                    onClick={() => this.setState({ showExposure: !this.state.showExposure })}>
                </span>
                {this.props.weaponDetected && <span className={`${cn.ToggleTarget} ${hideTargetClass}`}
                    onClick={() => this.setState({ showTarget: !this.state.showTarget })}>
                </span>
                }
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
                    onClick={() => this.setState({ isRecording: !this.state.isRecording })}
                    title={this.getRecordTitle()}
                    className={`${cn.ControlBtn} ${cn.RecordButton}`}>
                    <span className={`${this.getRecordButton()}`} />
                </button>
                <button
                    onClick={this.state.isFullScreen ? this.onExitFullScreenClick : this.onFullScreenClick}
                    title={this.state.isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                    className={`${cn.ControlBtn} ${this.state.isFullScreen ? cn.ExitFullScreen : cn.FullScreen}`}>
                </button>
            </>
        )
    }

    updateExposure(sliderOffset) {
        const exposureValue = config.EXPOSURE_MAX_LEVEL * (100 - sliderOffset) / 100;
        console.log("new exposureValue is ", exposureValue);
        this.setState({ sliderOffset });
        this.props.setExposure(exposureValue)
    }

    renderImgElement() {

        if (this.state.isImageLoadingError) {
            return (
                <div className={cn.ErrorMessage}><span className={cn.ErrorIcon}></span> Error loading video stream</div>
            )
        }
        const largeTarget = this.state.isFullScreen ? ` ${cn.TargetLarge}` : '';
        return (
            <>
                {this.renderVideoHeader()}

                {this.state.showTarget && this.props.weaponDetected &&
                    <img className={`${cn.TargetIcon}${largeTarget}`} style={this.state.targetPosition} src={targetIcon} />
                }

                {this.state.showExposure &&
                    <Slider sliderOffset={this.state.sliderOffset} updatePosition={(offset) => this.updateExposure(offset)} />
                }

                <img
                    crossOrigin="anonymous"
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
        isPaused: state.video.isPaused,
        weaponDetected: state.output.weaponDetected,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        pointVideoImage: e => dispatch(actions.pointVideoImage(e)),
        setExposure: exposureValue => dispatch(actions.setExposure(exposureValue)),
        pause: () => dispatch({ type: actionTypes.PAUSE_VIDEO }),
        resume: () => dispatch({ type: actionTypes.RESUME_VIDEO }),
    };
};

export default connect(mapStateToProps, mapDispachToProps)(Video);


