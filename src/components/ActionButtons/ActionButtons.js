import React, { Component } from 'react'
import cn from './ActionButtons.module.css'
import { connect } from 'react-redux';
import actions from '../../store/actions';
import actionTypes from '../../store/actions/actionTypes';

class ActionButtons extends Component {

    pauseOrResume = () => {
        this.props.isPaused ? this.props.resume() : this.props.pause()
    }

    getPauseIcon() {
        return this.props.isPaused ? cn.PlayIcon : cn.PauseIcon
    }

    render() {
        const isHiddenClass = this.props.isRosWebsocketConncted ? '' : cn.Hidden;
        return (
            <div className={`${cn.Wrapper} ${isHiddenClass}`}>
                    <button className={cn.Button} onClick={this.props.locate}><span className={`${cn.Icon} ${cn.LocateIcon}`}></span></button>
                    <button className={cn.Button} onClick={this.pauseOrResume}><span className={`${cn.Icon} ${this.getPauseIcon()}`}></span></button>
                    <button className={cn.Button} onClick={this.props.reset}><span className={`${cn.Icon} ${cn.ResetIcon}`}></span></button>
                    <button className={cn.Button} onClick={this.props.takeoff}><span className={`${cn.Icon} ${cn.TakeoffIcon}`}></span></button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isPaused: state.video.isPaused,
        isRosWebsocketConncted: state.layout.isRosWebsocketConncted
    }
};

const mapDispachToProps = dispatch => {
    return {
        locate: () => dispatch(actions.locate()),
        pause: () => dispatch({type:actionTypes.PAUSE_VIDEO}),
        resume: () => dispatch({type:actionTypes.RESUME_VIDEO}),
        restart: () => dispatch(actions.restart()),
        takeoff: () => dispatch(actions.takeoff()),
    }
}

export default connect(
    mapStateToProps,
    mapDispachToProps
)(ActionButtons)