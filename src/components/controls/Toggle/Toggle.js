import React, { Component } from 'react'
import cn from './Toggle.module.css';

export default class Toggle extends Component {
    constructor(props) {
        super(props);

        this.onToggleClick = this.onToggleClick.bind(this);
    }

    onToggleClick(e) {
        if (e) {
            e.preventDefault();
        }
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render() {
        return (
            <label htmlFor={this.props.id} className={cn.switch} onClick={this.onToggleClick}>
                <input type="checkbox" className={cn.Input} checked={this.props.isChecked} />
                <span className={cn.sliderRound} />
            </label>
        )
    }
}