import React, { Component } from 'react'
import cn from './Select.module.css';
import { DropdownIndicator, dropDownStyles } from './reactSelectStyles';
import Select from 'react-select';

export default class CustomSelect extends Component {



    render() {
        const props = {
            ...this.props,
            styles: dropDownStyles,
            components: {
                DropdownIndicator
            },
        }


        return (
            <div className={cn.DropDownWrapper}>
                <label className={cn.ComboLabel}>{this.props.label}</label>
                <Select {...props} />
            </div>
        )
    }
}