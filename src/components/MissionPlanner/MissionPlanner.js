import React, { Component } from 'react'
import cn from './MissionPlanner.module.css';
import { connect } from 'react-redux';
import actionTypes from '../../store/actions/actionTypes';
import actions from '../../store/actions';
import MissionPlanStages from './MissionPlanStages/MissionPlanStages';
import { withRouter } from 'react-router-dom';
import { logSeverities } from '../../config';
import { viewerStates } from '../../store/reducers/plannerReducer';

class MissionPlanner extends Component {

    inputRef = React.createRef();

    addMissionPlanStageFormPopupOkBtnClick = () => {
        const addStageState = this.getAddMissionPlanStageFormState();
        if (addStageState && addStageState.selectedStageType) {
            this.props.addNewStage(addStageState)
        }
    }

    onStartNewMissionClick = () => {
        const popupDetails = {
            title: 'Add First Stage',
            modalChild: 'AddMissionPlanStageForm',
            modalChildProps: {
                size: 'small',
                onPopupInitalLoad: getChildState => this.getAddMissionPlanStageFormState = getChildState,
                selectPointFromMap: this.selectPointFromMap,
            },
            onCloseButtonClick: () => {
            },
            primayButton: {
                title: 'Add',
                disabled: false,
                callback: this.addMissionPlanStageFormPopupOkBtnClick
            },
            secondaryButton: {
                title: 'Cancel',
                callback: () => { }
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


        const { viewerState, draftMissionStages, savedMissionPlan } = this.props;
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

    selectPointFromMap = () => {
        this.props.togglePointSelectionMode();
    }

    onBackBtnClick = () => {
        this.props.toggleMissionPlannerScreen();
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

    onLoadMissionFromDroneBtnClick = () => {
        this.props.importMissionFromDroneFile();
    }

    onLoadMissionFromPcBtnClick = () => {
        this.inputRef.current.click();

    }

    parseConfigurationFile = (e) => {
        const fileReader = new FileReader();
        if (e.target.files && e.target.files[0]) {
            console.log("Reading file: " + e.target.files[0]);
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = e => {
                const missionData = JSON.parse(e.target.result);
                this.props.importMissionFromPcFile(missionData);
            };
            fileReader.onerror = e => {
                console.log("parseConfigurationFile: error reading file");
            };
        }
    }


    onExportMissionBtnClick = () => {
        const { draftMissionStages, savedMissionPlan, viewerState } = this.props;
        const plan = viewerState === viewerStates.draft ? draftMissionStages : savedMissionPlan;
        this.props.exportPlanToFile(plan, viewerState);
    }


    onLoadMissionBtnClick = e => {
        e.preventDefault();
        e.stopPropagation();

        const menuItemsList = [
            {
                name: "Load From PC",
                func: this.onLoadMissionFromPcBtnClick,
                iconCss: "PcIcon"
            },
            {
                name: "Load From Drone",
                func: this.onLoadMissionFromDroneBtnClick,
                iconCss: "DroneIcon"
            },
        ];

        this.props.showContextMenu(e.clientX, e.clientY, { side: 'left' }, menuItemsList);
    }


    renderDraftButtons(draftMissionStages) {
        const buttons = [];

        if (draftMissionStages.length > 0) {
            buttons.push(<button title='Save Plan' className={`${cn.SideBarBtn} ${cn.Save}`} onClick={this.onSaveBtnClick} />)
            buttons.push(<button title='Clear Draft Stages' className={`${cn.SideBarBtn} ${cn.ClearStages}`} onClick={this.onClearDraftBtnClick} />)
            buttons.push(<button title='Download Draft' className={`${cn.SideBarBtn} ${cn.Export}`} onClick={this.onExportMissionBtnClick} />)
        }
        buttons.push(<button title='Load Mission Plan' className={`${cn.SideBarBtn} ${cn.Import}`} onClick={e => this.onLoadMissionBtnClick(e)} />)

        return buttons;
    }

    renderSavedPlanButtons(savedMissionPlan) {
        const buttons = [];

        if (savedMissionPlan.length > 0) {
            buttons.push(<button title='Remove Saved Plan' className={`${cn.SideBarBtn} ${cn.Remove}`} onClick={this.onRemoveSavedPlanBtnClick} />)
            buttons.push(<button title='Download Saved Plan' className={`${cn.SideBarBtn} ${cn.Export}`} onClick={this.onExportMissionBtnClick} />)
        }
        buttons.push(<button title='Load Mission Plan From File' className={`${cn.SideBarBtn} ${cn.Import}`} onClick={this.onLoadMissionBtnClick} />)

        return buttons;
    }


    renderSideBar() {
        const { draftMissionStages, savedMissionPlan, viewerState } = this.props;
        let buttons = [<button title='Back to Main' className={`${cn.SideBarBtn} ${cn.ClosePlanner}`} onClick={this.onBackBtnClick} />];
        ;
        if (viewerState === viewerStates.draft) {
            buttons.push(...this.renderDraftButtons(draftMissionStages));
        } else {
            buttons.push(...this.renderSavedPlanButtons(savedMissionPlan));
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

    getSwithBtnTitle(viewerState) {
        return `View ${viewerState === viewerStates.draft ? 'Saved Mission' : 'Draft Mission'}`;
    }

    renderHeader() {
        const { viewerState } = this.props;
        const icon = viewerState === viewerStates.draft ? ` ${cn.DraftIcon}` : ` ${cn.SavedPlanIcon}`
        return (
            <div className={cn.Header}>
                <span></span>
                <span className={cn.HeaderTextWrapper}>
                    <span className={cn.HeaderTextState}>{viewerState === viewerStates.draft ? 'Mission Draft' : 'Saved Mission'}</span>
                    <a href={'#'} className={cn.HeaderBtnWrapper} onClick={this.onSwitchViewStateClick} title={this.getSwithBtnTitle(viewerState)}>
                        <span className={cn.HeaderBtn}></span>
                    </a>
                </span>
            </div>
        )
    }


    render() {
        const centerClass = !this.props.draftMissionStages.length ? cn.Center : '';
        return (
            <>
                {this.renderSideBar()}
                <div className={`${cn.Wrapper} ${centerClass}`}>
                    {this.renderHeader()}
                    {this.renderMissionPlanStages()}
                </div>
                <input type="file" style={{ display: 'none' }} accept={"application/json"} ref={this.inputRef} onChange={(e) => this.parseConfigurationFile(e)} />
            </>)
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
        showGlobalMessage: text => dispatch(actions.showGlobalMessage({ text, type: logSeverities.success, isRemoved: true })),
        addNewStage: stage => dispatch({ type: actionTypes.ADD_NEW_MISSION_PLAN_STAGE, payload: stage }),
        toggleMissionPlannerScreen: () => dispatch({ type: actionTypes.TOGGLE_MISSION_PLANNER_SCREEN }),
        saveMissionPlan: () => dispatch({ type: actionTypes.SAVE_MISSION_PLAN }),
        removeDraftPlan: () => dispatch({ type: actionTypes.REMOVE_DRAFT_MISSION_PLAN }),
        removeSavedPlan: () => dispatch({ type: actionTypes.REMOVE_SAVED_MISSION_PLAN }),
        toggleViewerState: () => dispatch({ type: actionTypes.TOGGLE_MISSION_PLAN_VIEWER_STATE }),
        importMissionFromDroneFile: () => dispatch(actions.importMissionFromDroneFile()),
        importMissionFromPcFile: (missionData) => dispatch(actions.importMissionFromPcFile(missionData)),
        exportPlanToFile: (plan, viewerState) => dispatch(actions.exportPlanToFile(plan, viewerState)),
        togglePointSelectionMode: () => dispatch({ type: actionTypes.TOGGLE_POINT_SELECTION_MODE }),
        showContextMenu: (x, y, options, items) => dispatch({ type: actionTypes.SHOW_CONTEXT_MENU, payload: { x, y, options, items } }),
    }
}

export default withRouter(connect(mapStateToProps, mapDispachToProps)(MissionPlanner));

// export default connect(
//     mapStateToProps,
//     mapDispachToProps
// )(MissionPlanner)
