import React, { Component } from 'react'
import cn from './ActionButtons.module.css'
import { connect } from 'react-redux';
import actions from '../../store/actions';
import actionTypes from '../../store/actions/actionTypes';

class ActionButtons extends Component {

    getPauseIcon() {
        return this.props.isPaused ? cn.PlayIcon : cn.PauseIcon
    }

    render() {
        const isHiddenClass = this.props.isRosWebsocketConncted ? '' : cn.Hidden;
        return (
            <div className={`${cn.Wrapper} ${isHiddenClass}`}>
                    <button className={cn.Button} onClick={this.props.takeoff}>
                        <span className={`${cn.Icon} ${cn.TakeoffIcon}`}></span>
                        <span className={cn.ButtonLabel}>Takeoff</span>
                    </button>
                    <button className={cn.Button} onClick={this.props.locate}>
                        <span className={`${cn.Icon} ${cn.LocateIcon}`}></span>
                        <span className={cn.ButtonLabel}>Locate</span>
                    </button>
                    <button className={cn.Button} onClick={this.props.reset}>
                        <span className={`${cn.Icon} ${cn.ResetIcon}`}></span>
                        <span className={cn.ButtonLabel}>Reset</span>
                    </button>
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
        takeoff: () => dispatch(actions.takeoff()),
        locate: () => dispatch(actions.locate()),
        restart: () => dispatch(actions.restart()),
    }
}

export default connect(
    mapStateToProps,
    mapDispachToProps
)(ActionButtons)