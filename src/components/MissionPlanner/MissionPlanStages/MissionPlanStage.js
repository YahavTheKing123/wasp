import React, { Component } from 'react'
import { connect } from 'react-redux'
import cn from './MissionPlanStages.module.css';
import actionTypes from '../../../store/actions/actionTypes';

class MissionPlanStage extends Component {

    renderMenuBtnIcon() {
        return (
            <span className={cn.BtnIconWrapper}>
                <span className={cn.BtnIconBall}></span>
                <span className={cn.BtnIconBall}></span>
                <span className={cn.BtnIconBall}></span>
            </span>
        )
    }

    addOrEditMissionPlanStageFormPopupOkBtnClick = (isAddStage) => {
        const addOrEditStageFormState = this.getAddMissionPlanStageFormState();
        if (isAddStage) {
            this.props.addNewStage(addOrEditStageFormState);
        } else {
            this.props.editStage(addOrEditStageFormState, this.props.stageIndex);
        }
    }

    selectPointFromMap = () => {
        this.props.togglePointSelectionMode();
    }

    onAddOrEditStageBtnClicked = (isAddStage = false) => {
        const popupDetails = {
            title: isAddStage ? 'Add New Stage' : `Edit Stage #${this.props.stageIndex + 1} `,
            modalChild: 'AddMissionPlanStageForm',
            modalChildProps: {
                stage: isAddStage ? null : this.props.stage,
                size: 'small',
                onPopupInitalLoad: getChildState => this.getAddMissionPlanStageFormState = getChildState,
                selectPointFromMap: this.selectPointFromMap,
            },
            onCloseButtonClick: () => { },
            primayButton: {
                title: 'Done',
                callback: () => this.addOrEditMissionPlanStageFormPopupOkBtnClick(isAddStage)
            },
            secondaryButton: {
                title: 'Cancel',
                callback: () => { }
            }
        };
        this.props.showPopup(popupDetails);
    }

    onMenuBtnClick = e => {
        e.preventDefault();
        e.stopPropagation();

        const menuItemsList = [
            {
                name: "Delete",
                func: () => this.props.deleteStage(this.props.stage.stageId),
                iconCss: "DeleteIcon"
            },
            {
                name: "Edit",
                func: this.onAddOrEditStageBtnClicked,
                iconCss: "EditIcon"
            },
            {
                name: "Move Back",
                func: () => this.props.moveStageDown(this.props.stageIndex),
                iconCss: "ArrowDownIcon"
            },
            {
                name: "Move Forward",
                func: () => this.props.moveStageUp(this.props.stageIndex),
                iconCss: "ArrowUpIcon"
            },
        ];

        this.props.showContextMenu(e.clientX, e.clientY, { side: 'right' }, menuItemsList);
    }

    renderAddNewStageBtn() {
        if (this.props.isShowAddStageBtn) {
            return <button className={cn.AddNewStageBtn} onClick={() => this.onAddOrEditStageBtnClicked(true)}>+</button>
        }
        return false;
    }

    renderMenuBtn() {
        const { isShowMenu } = this.props;
        if (!isShowMenu) return null;
        return (
            <button className={cn.MenuBtn} onClick={this.onMenuBtnClick}>{this.renderMenuBtnIcon()}</button>
        )
    }

    render() {
        const { selectedStageType, stageParamsInput } = this.props.stage;

        return (
            <div className={cn.StageWrapper}>
                {this.renderMenuBtn()}
                <div className={cn.LabelsWrapper}>
                    <div className={cn.StageTypeLabel}>{selectedStageType.label}</div>
                    <div className={cn.StageParamsLabel}>{stageParamsInput}</div>
                </div>
                {this.renderAddNewStageBtn()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispachToProps = (dispatch) => {
    return {
        showPopup: details => dispatch({ type: actionTypes.SHOW_POPUP, payload: details }),
        togglePointSelectionMode: () => dispatch({ type: actionTypes.TOGGLE_POINT_SELECTION_MODE }),
        showContextMenu: (x, y, options, items) => dispatch({ type: actionTypes.SHOW_CONTEXT_MENU, payload: { x, y, options, items } }),
        deleteStage: id => dispatch({ type: actionTypes.DELETE_MISSION_PLAN_STAGE, payload: { id } }),
        editStage: (stage, index) => dispatch({ type: actionTypes.EDIT_MISSION_PLAN_STAGE, payload: { stage, stageIndex: index } }),
        moveStageDown: (index) => dispatch({ type: actionTypes.MOVE_DOWN_MISSION_PLAN_STAGE, payload: index }),
        moveStageUp: (index) => dispatch({ type: actionTypes.MOVE_UP_MISSION_PLAN_STAGE, payload: index }),
        addNewStage: stage => dispatch({ type: actionTypes.ADD_NEW_MISSION_PLAN_STAGE, payload: stage }),
    };
};

export default connect(mapStateToProps, mapDispachToProps)(MissionPlanStage)
