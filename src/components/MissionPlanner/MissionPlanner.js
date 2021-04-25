import React, { Component } from 'react'
import cn from './MissionPlanner.module.css';
import {connect} from 'react-redux';
import actionTypes from '../../store/actions/actionTypes';
import actions from '../../store/actions';
import MissionPlanStages from './MissionPlanStages/MissionPlanStages';
import {withRouter} from 'react-router-dom';
import {logSeverities} from '../../config';
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
        return <MissionPlanStages missionStages={this.props.draftMissionStages} />
    }

    onBackBtnClick = () => {        
        this.props.hideMissionPlannerScreen();
    }

    onSaveBtnClick = () => {
        this.props.saveMissionPlan();
        this.props.showGlobalMessage('Draft Successfuly Saved');
    }

    onClearDraftBtnClick = () => {
        this.props.removeDraftPlan();
    }

    onRemoveSavedPlanBtnClick = () => {        
        this.props.removeSavedPlan();
        this.props.showGlobalMessage('Mission Plan Successfuly Removed');
    }

    renderSideBar() {
        const {draftMissionStages, savedMissionPlan} = this.props;

        return (
            <div className={cn.SideBar}>
                <div className={cn.SideBarButtons}>
                    <button title='Back to Main' className={`${cn.SideBarBtn} ${cn.NavigateBack}`} onClick={this.onBackBtnClick}></button>
                    {
                        draftMissionStages.length > 0 ? 
                        <>
                            <button title='Save Plan' className={`${cn.SideBarBtn} ${cn.Save}`} onClick={this.onSaveBtnClick}></button> 
                            <button title='Clear Draft Stages' className={`${cn.SideBarBtn} ${cn.ClearStages}`} onClick={this.onClearDraftBtnClick}></button> 
                            <button title='Download Draft' className={`${cn.SideBarBtn} ${cn.Export}`}></button>
                        </> : null
                    }
                    {
                        savedMissionPlan.length > 0 ?                         
                            <button title='Remove Saved Plan' className={`${cn.SideBarBtn} ${cn.Remove}`} onClick={this.onRemoveSavedPlanBtnClick}></button>
                            : null
                    }                    
                    <button title='Load Mission Plan From File' className={`${cn.SideBarBtn} ${cn.Import}`}></button>
                </div>
                <span className={cn.SidebarLabel}>Mission Planner</span>
            </div>
        )
    }

    render() {
        const centerClass = !this.props.draftMissionStages.length ? cn.Center : '';
        return (            
            <div className={`${cn.Wrapper} ${centerClass}`}>
                {this.props.draftMissionStages.length ? this.renderMissionPlanStages() : this.renderStartNewMissionButton()}
                {this.renderSideBar()}
            </div>            
        )
    }
}

const mapStateToProps = (state) => {
    return {
        draftMissionStages: state.planner.draftMissionStages,
        savedMissionPlan: state.planner.savedMissionPlan
    }
};

const mapDispachToProps = dispatch => {
    return {
        showPopup: details => dispatch({ type: actionTypes.SHOW_POPUP, payload: details }),
        showGlobalMessage: text => dispatch(actions.showGlobalMessage({text, type: logSeverities.success, isRemoved: true})),
        addNewStage: stage => dispatch({ type: actionTypes.ADD_NEW_MISSION_PLAN_STAGE, payload: stage }),
        hideMissionPlannerScreen: () => dispatch({ type: actionTypes.HIDE_MISSION_PLANNER_SCREEN }),
        saveMissionPlan: () => dispatch({ type: actionTypes.SAVE_MISSION_PLAN }),
        removeDraftPlan: () => dispatch({ type: actionTypes.REMOVE_DRAFT_MISSION_PLAN }),
        removeSavedPlan: () => dispatch({ type: actionTypes.REMOVE_SAVED_MISSION_PLAN }),
    }
}

export default withRouter(connect(mapStateToProps, mapDispachToProps)(MissionPlanner));

// export default connect(
//     mapStateToProps,
//     mapDispachToProps
// )(MissionPlanner)
