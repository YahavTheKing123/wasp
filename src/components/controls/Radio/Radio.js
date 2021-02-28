import React, { Component } from 'react'
import cn from './Radio.module.css';

export default class Radio extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isChecked: this.props.isChecked
        };

        this.onRadioClick = this.onRadioClick.bind(this); 
    }

    componentWillReceiveProps(newProps) {
        this.setState({isChecked: newProps.isChecked});
    }

    onRadioClick(e) {
        if (e) {
            e.preventDefault();
        }
        this.setState({isChecked: !this.state.isChecked});        
        if (this.props.onClick) {
            this.props.onClick(this.props.radioIndex);
        }
    }    

    render() {
        return (
            <label htmlFor={this.props.id} className={cn.radio} onClick={this.onRadioClick}>
                <input className={cn.radio__input} type="radio" id={this.props.id} checked={this.props.isChecked} readOnly/>
                <div className={cn.radio__radio}></div>
                <span className={cn.Label} title={this.props.label}>{this.props.label}</span>
            </label>
        )
    }
}