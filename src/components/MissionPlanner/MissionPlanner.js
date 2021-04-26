import React, { Component } from 'react'
import cn from './MissionPlanner.module.css';
import {connect} from 'react-redux';
import actionTypes from '../../store/actions/actionTypes';
import actions from '../../store/actions';
import MissionPlanStages from './MissionPlanStages/MissionPlanStages';
import {withRouter} from 'react-router-dom';
import {logSeverities} from '../../config';
import {viewerStates} from '../../store/reducers/plannerReducer';

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
        

        const {viewerState, draftMissionStages, savedMissionPlan} =  this.props;
        if (viewerState === viewerStates.draft) {
            return (
                    draftMissionStages.length ? 
                    <MissionPlanStages 
                        missionStages={viewerState === viewerStates.draft ? draftMissionStages : savedMissionPlan}
                        isReadOnly={viewerState === viewerStates.savedMission}
                    /> : 
                    this.renderStartNewMissionButton()
            )
        } else {
            // saved mission plan flow
            return (
                savedMissionPlan.length > 0 ? 
                <MissionPlanStages 
                    missionStages={viewerState === viewerStates.draft ? draftMissionStages : savedMissionPlan}
                    isReadOnly={viewerState === viewerStates.savedMission}
                /> : 
                <div className={cn.EmptyPlanStagesMessage}>
                    No Saved Plan in Memory
                </div>
            )
        }         
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
    
    onLoadMissionBtnClick = () => {
        this.props.importPlanFromFile();
    }

    onExportMissionBtnClick = () => {
        const {draftMissionStages, savedMissionPlan, viewerState} = this.props;
        const plan = viewerState === viewerStates.draft ? draftMissionStages : savedMissionPlan;
        this.props.exportPlanToFile(plan, viewerState);
    }

    renderDraftButtons(draftMissionStages) {
        const buttons = [<button title='Back to Main' className={`${cn.SideBarBtn} ${cn.NavigateBack}`} onClick={this.onBackBtnClick}></button>];
        
        if (draftMissionStages.length > 0) {
            buttons.push(<button title='Save Plan' className={`${cn.SideBarBtn} ${cn.Save}`} onClick={this.onSaveBtnClick}></button>)
            buttons.push(<button title='Clear Draft Stages' className={`${cn.SideBarBtn} ${cn.ClearStages}`} onClick={this.onClearDraftBtnClick}></button>)
            buttons.push(<button title='Download Draft' className={`${cn.SideBarBtn} ${cn.Export}`} onClick={this.onExportMissionBtnClick}></button>)
        }                        
        buttons.push(<button title='Load Mission Plan From File' className={`${cn.SideBarBtn} ${cn.Import}`} onClick={this.onLoadMissionBtnClick}></button>)

        return buttons;
    }

    renderSavedPlanButtons(savedMissionPlan) {
        const buttons = [<button title='Back to Main' className={`${cn.SideBarBtn} ${cn.NavigateBack}`} onClick={this.onBackBtnClick}></button>];

        if (savedMissionPlan.length > 0) {
            buttons.push(<button title='Remove Saved Plan' className={`${cn.SideBarBtn} ${cn.Remove}`} onClick={this.onRemoveSavedPlanBtnClick}></button>)
            buttons.push(<button title='Download Saved Plan' className={`${cn.SideBarBtn} ${cn.Export}`} onClick={this.onExportMissionBtnClick}></button>)
        }                        
        buttons.push(<button title='Load Mission Plan From File' className={`${cn.SideBarBtn} ${cn.Import}`} onClick={this.onLoadMissionBtnClick}></button>)

        return buttons;
    }


    renderSideBar() {
        const {draftMissionStages, savedMissionPlan, viewerState} = this.props;
        let buttons = [];
        if (viewerState === viewerStates.draft) {
            buttons = this.renderDraftButtons(draftMissionStages);
        } else {
            buttons = this.renderSavedPlanButtons(savedMissionPlan);
        }

        return (
            <div className={cn.SideBar}>
                <div className={cn.SideBarButtons}>
                    {buttons}
                </div>
                <span className={cn.SidebarLabel}>Mission Planner</span>
            </div>
        )
    }

    onSwitchViewStateClick = e => {
        e.preventDefault();
        this.props.toggleViewerState();
    }

    renderHeader() {
        const {viewerState} = this.props;
        const icon = viewerState === viewerStates.draft ? ` ${cn.DraftIcon}` : ` ${cn.SavedPlanIcon}`
        return (
            <div className={cn.Header}>
                <span></span>
                <span className={cn.HeaderTextWrapper}>
                    <span className={cn.HeaderTextState}>{viewerState === viewerStates.draft ? 'Mission Draft' : 'Saved Mission'}</span>
                    <a className={cn.HeaderBtn} href={'#'} onClick={this.onSwitchViewStateClick }>
                        {` View ${viewerState === viewerStates.draft ? 'Saved Mission' : 'Draft Mission'}`}
                    </a>
                </span>
            </div>
        )
    }

    render() {
        const centerClass = !this.props.draftMissionStages.length ? cn.Center : '';
        return (            
            <div className={`${cn.Wrapper} ${centerClass}`}>
                {this.renderHeader()}
                {this.renderMissionPlanStages()}                
                {this.renderSideBar()}
            </div>            
        )
    }
}

const mapStateToProps = (state) => {
    return {
        draftMissionStages: state.planner.draftMissionStages,
        savedMissionPlan: state.planner.savedMissionPlan,
        viewerState: state.planner.viewerState
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
        toggleViewerState: () => dispatch({ type: actionTypes.TOGGLE_MISSION_PLAN_VIEWER_STATE }),
        importPlanFromFile: () => dispatch(actions.importPlanFromFile()),
        exportPlanToFile: (plan, viewerState) => dispatch(actions.exportPlanToFile(plan, viewerState)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispachToProps)(MissionPlanner));

// export default connect(
//     mapStateToProps,
//     mapDispachToProps
// )(MissionPlanner)
