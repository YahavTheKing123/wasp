import React, { Component } from 'react'
import cn from './Input.module.css';
//import validationX from '../../assets/images/close-red.svg';
//import Tooltip from '../Tooltip/Tooltip';

export default class Input extends Component {
    state = {
        isShowInfoTooltip: false
    }

    showInfoTooltip = e => {
        this.setState({ isShowInfoTooltip: true, clientX: e.target.getBoundingClientRect().left, clientY: e.target.getBoundingClientRect().top });
    }

    hideTooltip = () => this.setState({ isShowInfoTooltip: false, clientX: null, clientY: null })

    renderInfo() {
        if (this.props.info) {
            return (
                <span className={cn.InfoImage} onMouseEnter={this.showInfoTooltip} onMouseLeave={this.hideTooltip}>
                    {/* {
                        this.state.isShowInfoTooltip ? 
                            (<Tooltip 
                                title={this.props.info.title}
                                text={this.props.info.text}
                                x={this.state.clientX}
                                y={this.state.clientY}
                            />) : null
                    } */}
                </span>
            )
        }
    }

    getInputByType = () => {
        const value = this.props.value;
        switch (this.props.type) {
            case "Coordinate":
                return (
                    <div className={cn.InnerInputWrapper}>
                        {this.props.button && <span className={`${cn.Icon} ${cn.PositionIcon}`} title="Select On Map" onClick={() => this.props.button.action()} />}
                        {this.getInputField(value && value.x || "", 'X')}
                        {this.getInputField(value && value.y || "", 'Y')}
                        {this.getInputField(value && value.z || "", 'Z')}
                    </div>)
            default:
                return this.getInputField(value, this.props.placeHolder);
        }
    }



    render() {
        const mandatoyClass = this.props.mandatory ? ` ${cn.Mandatory}` : '';
        const disabled = this.props.disabled ? ` ${cn.Disabled}` : '';
        const errorClass = this.props.error ? ` ${cn.ShowError}` : '';
        const readOnly = this.props.readOnly ? ` ${cn.readOnly}` : '';
        return (
            <div className={`${cn.Row}${disabled}`}>
                <span className={`${cn.Label}${mandatoyClass}`}>{this.props.label}{this.renderInfo()}</span>
                <div className={cn.InputWrapper}>
                <div className={cn.InnerInputWrapper}>
                    <input
                        ref={this.props.parentRef || null}
                        placeholder={this.props.placeHolder}
                        value={this.props.value}
                        name={this.props.name}
                        className={`${cn.Input}${errorClass}${readOnly}`}
                        maxLength={this.props.maxLength || null}
                        type={this.props.type || 'text'}
                        onFocus={this.props.onFocus}
                        onChange={this.props.onChange}
                        readOnly={this.props.readOnly || this.props.disabled} />
                         </div>
                    {/*<img className={`${cn.ValidationImg}${errorClass}`} src={validationX} alt=""/>*/}
                    <div className={`${cn.ValidationMessage}${errorClass}`}>{this.props.error || ''}</div>
                </div>
            </div>
        )
    }
}
