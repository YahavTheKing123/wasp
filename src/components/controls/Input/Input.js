import React, { Component } from 'react'
import cn from './Input.module.css';
//import validationX from '../../assets/images/close-red.svg';
//import Tooltip from '../Tooltip/Tooltip';

export default class Input extends Component {
    state = {
        isShowInfoTooltip: false
    }

    showInfoTooltip = e => {
        this.setState({isShowInfoTooltip: true, clientX: e.target.getBoundingClientRect().left, clientY: e.target.getBoundingClientRect().top});
    }

    hideTooltip = () => this.setState({isShowInfoTooltip: false, clientX: null, clientY: null})

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

    render() {
        const mandatoyClass = this.props.mandatory ? ` ${cn.Mandatory}` : '';
        const errorClass = this.props.error ? ` ${cn.ShowError}` : '';
        const readOnly = this.props.readOnly ? ` ${cn.readOnly}` : '';
        return (
            <div className={cn.Row}>
                <span className={`${cn.Label}${mandatoyClass}`}>{this.props.label}{this.renderInfo()}</span>
                <div className={cn.InputWrapper}>
                    <div className={cn.InnerInputWrapper}>
                        <input
                            ref={this.props.parentRef || null}
                            value={this.props.value}
                            name={this.props.name} 
                            className={`${cn.Input}${errorClass}${readOnly}`} 
                            maxLength={this.props.maxLength || null} 
                            type={this.props.type || 'text'}                  
                            onFocus={this.props.onFocus}
                            onChange={this.props.onChange}
                            readOnly = {this.props.readOnly} />                        
                        {/*<img className={`${cn.ValidationImg}${errorClass}`} src={validationX} alt=""/>*/}
                    </div>
                    <div className={`${cn.ValidationMessage}${errorClass}`}>{this.props.error || ''}</div>                   
                </div>
            </div>
        )
    }
}
