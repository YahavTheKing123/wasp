import React, { Component } from 'react'
import cn from './ActionButtons.module.css'
import { connect } from 'react-redux';
import actions from '../../store/actions';
import actionTypes from '../../store/actions/actionTypes';

class ActionButtons extends Component {

    getPauseIcon() {
        return this.props.isPaused ? cn.PlayIcon : cn.PauseIcon        
    }

    goToLocation = () => {
        const popupDetails = {
            title: 'Go To Location',            
            modalChild: 'GoToLocationForm',            
            modalChildProps: {
                size: 'small',
                onValueChange: value => this.tempLocationValue = value
            },
            onCloseButtonClick: () => {
                this.tempLocationValue = null
            },
            primayButton: {
                title: 'Go',
                callback: this.onGoToLocationPopupOkBtnClick
            },
            secondaryButton: {
                title: 'Cancel',
                callback: () => {
                    this.tempLocationValue = null
                }
            }
        };
        this.props.showPopup(popupDetails);
    }

    onGoToLocationPopupOkBtnClick = () => {
        if (this.tempLocationValue) {
            this.props.goToLocation(this.tempLocationValue);
        } else {
            this.tempLocationValue = null;
        }
    }

    render() {
        const isHiddenClass = this.props.isRosWebsocketConncted ? '' : cn.Hidden;
        return (
            <div className={`${cn.Wrapper} ${isHiddenClass}`}>
                    <button className={cn.Button} onClick={this.props.takeoff}>
                        <span className={`${cn.Icon} ${cn.TakeoffIcon}`}></span>
                        <span className={cn.ButtonLabel}>Takeoff</span>
                    </button>
                    <button className={`${cn.Button} ${this.props.indoorExplorationFlag ? cn.Clicked : ''}`} onClick={this.props.startIndoorExploration}>
                        <span className={`${cn.Icon} ${cn.IndoorExploration}`}></span>
                        <span className={cn.ButtonLabel}>{'Indoor \nExploration'}</span>
                    </button>
                    <button className={cn.Button } onClick={this.props.locate}>
                        <span className={`${cn.Icon} ${cn.LocateIcon}`}></span>
                        <span className={cn.ButtonLabel}>Locate</span>
                    </button>
                    <button className={cn.Button} onClick={this.goToLocation}>
                        <span className={`${cn.Icon} ${cn.SetLocationIcon}`}></span>
                        <span className={cn.ButtonLabel}>Go To</span>
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
        isRosWebsocketConncted: state.layout.isRosWebsocketConncted,
        indoorExplorationFlag: state.output.indoorExplorationFlag
    }
};

const mapDispachToProps = dispatch => {
    return {
        takeoff: () => dispatch(actions.takeoff()),
        startIndoorExploration: () => dispatch(actions.startIndoorExploration()),
        locate: () => dispatch(actions.locate()),
        restart: () => dispatch(actions.restart()),
        showPopup: details => dispatch({ type: actionTypes.SHOW_POPUP, payload: details }),
        goToLocation: location => dispatch(actions.goToLocation(location)),
    }
}

export default connect(
    mapStateToProps,
    mapDispachToProps
)(ActionButtons)