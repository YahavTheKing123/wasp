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
            multiParamsInput: this.parseMultiParams() || {},
            stageId: props.stage && props.stage.stageId || Math.round(Math.random() * 100000),
        }
    }

    componentDidMount() {
        if (this.props.onPopupInitalLoad) {
            this.props.onPopupInitalLoad(this.getMissionPlanState);
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.pointFromMap != this.props.pointFromMap) {
            const pointFromMap = this.props.pointFromMap;
            const stageParamsInput = pointFromMap.x + "," +pointFromMap.y + "," + pointFromMap.z;
            this.setState({ multiParamsInput: pointFromMap , stageParamsInput })
        }
    }
    parseMultiParams = () => {
        if (this.props.stage && this.props.stage.stageParamsInput!="") {
            const [x, y, z] = this.props.stage.stageParamsInput.split(',');
            return {x,y,z};
        }
        else{
            return null
        }
    }
    getMissionPlanState = () => {
        return this.state;
    }

    handleTypeChange(selectedStageType) {
        this.setState({
            selectedStageType,
            stageParamsInput: '',
            multiParamsInput: {}
        });
    }


    renderStageType() {
        const options = [
            { label: 'Takeoff', params: { label: 'Height:', placeHolder: "meters" }, rossService: 'addMissionTakeoff' },
            { label: 'Go To Waypoint', isMultiInputs: true, params: { label: 'Waypoint Coordinate:', }, rossService: 'addMissionWP' },
            { label: 'Pause', params: { label: 'Pause for:', placeHolder: "seconds" } },
            { label: 'Set Speed', params: { label: 'Speed Value:', placeHolder: "km/h" } },
            { label: 'Set Waypoint Radius', params: { label: 'Radius Value:', placeHolder: "meters" } },
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
    onInputChange(e, subField) {
        let { stageParamsInput, multiParamsInput } = this.state;
        if (subField) {

            multiParamsInput[subField] = e.target.value;
            stageParamsInput = multiParamsInput.x + "," + multiParamsInput.y + "," + multiParamsInput.z;
        }
        else {
            stageParamsInput = e.target.value;
        }
        this.setState({ stageParamsInput, multiParamsInput });

    }

    renderStageInput() {
        if (!this.state.selectedStageType ||
            !this.state.selectedStageType.params) {
            return;
        }

        const { selectedStageType, stageParamsInput, multiParamsInput } = this.state;


        return (
            <div className={cn.Row}>
                <span className={`${cn.Label}`}>{this.state.selectedStageType.label + ":"}</span>
                <div className={cn.InputWrapper}>
                    {selectedStageType.isMultiInputs ?
                        <>
                            <span className={`${cn.Icon} ${cn.PositionIcon}`} title="Select On Map" onClick={this.props.selectPointFromMap} />
                            {this.getInputField(multiParamsInput.x, 'x')}
                            {this.getInputField(multiParamsInput.y, 'y')}
                            {this.getInputField(multiParamsInput.z, 'z')}
                        </>
                        :
                        this.getInputField(stageParamsInput)
                    }
                </div>
            </div>
        )

    }

    getInputField = (value, subField) => {
        const selectedStageType = this.state.selectedStageType;
        return (
            <div className={cn.InnerInputWrapper}>
                <Input
                    parentRef={this.inputRef}
                    value={value !== null && value !== undefined? value : ""}
                    onChange={e => this.onInputChange(e, subField)}
                    disabled={false}
                    type={selectedStageType.params.type || ""}
                    placeHolder={subField || selectedStageType.params.placeHolder || ""}
                    button={selectedStageType.params.button || null}
                />
            </div>
        )
    }

    render() {
        return (
            <div className={cn.Wrapper}>
                {this.renderStageType()}
                {this.renderStageInput()}
            </div>
        )
    }
}
