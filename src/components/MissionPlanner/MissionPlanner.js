import React, { Component } from 'react'
import cn from './MissionPlanner.module.css';
import {connect} from 'react-redux';
import actionTypes from '../../store/actions/actionTypes';
import MissionPlanStages from './MissionPlanStages/MissionPlanStages';
import {withRouter} from 'react-router-dom';

class MissionPlanner extends Component {

    addMissionPlanStageFormPopupOkBtnClick = () => {
        const addStageState = this.getAddMissionPlanStageFormState();
        if (addStageState) {
            this.props.addNewStage(addStageState)
        }
    }

    onStartNewMissionClick = () => {
        const popupDetails = {
            title: 'Add First Stage',            
            modalChild: 'AddMissionPlanStageForm',
            modalChildProps: {
                size: 'small',
                onPopupInitalLoad: getChildState => this.getAddMissionPlanStageFormState = getChildState
            },
            onCloseButtonClick: () => {
            },
            primayButton: {
                title: 'Add',
                callback: this.addMissionPlanStageFormPopupOkBtnClick
            },
            secondaryButton: {
                title: 'Cancel',
                callback: () => {}
            }
        };
        this.props.showPopup(popupDetails);
    }

    renderStartNewMissionButton() {
        return (
            <button className={cn.StartNewBtn} onClick={this.onStartNewMissionClick}>Start New Mission Plan</button>
        )
    }


    renderMissionPlanStages() {
        return <MissionPlanStages missionStages={this.props.missionStages} />
    }

    onBackBtnClick = () => {        
        this.props.history.push('/')
    }

    renderSideBar() {
        return (
            <div className={cn.SideBar}>
                <div className={cn.SideBarButtons}>
                    <button title='Back to Main' className={`${cn.SideBarBtn} ${cn.NavigateBack}`} onClick={this.onBackBtnClick}></button>
                    <button title='Load Mission Plan' className={`${cn.SideBarBtn} ${cn.Import}`}></button>
                    <button title='Download Mission Plan' className={`${cn.SideBarBtn} ${cn.Export}`}></button>
                </div>
                <span className={cn.SidebarLabel}>Mission Planner</span>
            </div>
        )
    }

    render() {
        const centerClass = !this.props.missionStages.length ? cn.Center : '';
        return (            
            <div className={`${cn.Wrapper} ${centerClass}`}>
                {this.props.missionStages.length ? this.renderMissionPlanStages() : this.renderStartNewMissionButton()}
                {this.renderSideBar()}
            </div>            
        )
    }
}

const mapStateToProps = (state) => {
    return {
        missionStages: state.planner.missionStages
    }
};

const mapDispachToProps = dispatch => {
    return {
        showPopup: details => dispatch({ type: actionTypes.SHOW_POPUP, payload: details }),
        addNewStage: stage => dispatch({ type: actionTypes.ADD_NEW_MISSION_PLAN_STAGE, payload: stage }),
    }
}

export default withRouter(connect(mapStateToProps, mapDispachToProps)(MissionPlanner));

// export default connect(
//     mapStateToProps,
//     mapDispachToProps
// )(MissionPlanner)
