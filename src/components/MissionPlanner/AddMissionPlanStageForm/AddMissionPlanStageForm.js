import React, { Component } from 'react'
import cn from './AddMissionPlanStageForm.module.css';
import Select from '../../controls/Select/Select';
import Input from '../../controls/Input/Input';

export default class AddMissionPlanStageForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedStageType: props.stage && props.stage.selectedStageType || null,
            stageParamsInput: props.stage && props.stage.stageParamsInput || '',
            stageId: props.stage && props.stage.stageId || Math.round(Math.random() * 100000)
        }
    }

    componentDidMount() {
        if (this.props.onPopupInitalLoad) {
            this.props.onPopupInitalLoad(this.getMissionPlanState);
        }        
    }

    getMissionPlanState = () =>{
        return this.state;
    }

    handleTypeChange(selectedStageType) {
        this.setState({
            selectedStageType,
            stageParamsInput: ''
        });
    }

    getParamsLabel() {
        const {selectedStageType} = this.state;
        return selectedStageType && 
                selectedStageType.params && 
                    selectedStageType.params.label || 'Stage Parameters:';
    }


    renderStageType() {
        const options = [
            { value: 'Go To Waypoint', label: 'Go To Waypoint', params: {label: 'Waypoint Values(x,y,z):'}},
            { value: 'Pause', label: 'Pause', params: {label: 'Pause for (sec):'}},
            { value: 'Takeoff', label: 'Takeoff' },
            { value: 'Set Speed', label: 'Set Speed', params: {label: 'Speed Value (km/h):'} },
            { value: 'Set Waypoint Radius', label: 'Set Waypoint Radius',  params: {label: 'Radius Value (m):'} },
        ]
        
        const dropDownData = {
            label: 'Select Stage Type:',
            defaultValue: this.state.selectedStageType || { label: "Select...", value: "Select..." },
            options,
            onChange: selectedTypeValue => this.handleTypeChange(selectedTypeValue)
        };


        return (
            <div className={cn.Row}>
                <Select {...dropDownData} />
            </div>
        )
    }

    isParamsEnabled() {
        const {selectedStageType} = this.state;
        return selectedStageType && 
                selectedStageType.params && 
                    selectedStageType.params.label;
    }

    renderStageParamsInput() {
        return (
            <div className={cn.Row}>
                <Input 
                    parentRef={this.inputRef}
                    value={this.state.stageParamsInput}
                    onChange={e => this.setState({stageParamsInput: e.target.value})}
                    disabled={!this.isParamsEnabled()}
                    label={this.getParamsLabel()} />
            </div>
        )
    }

    render() {
        return (
            <div className={cn.Wrapper}>
                {this.renderStageType()}
                {this.renderStageParamsInput()}
            </div>
        )
    }
}
