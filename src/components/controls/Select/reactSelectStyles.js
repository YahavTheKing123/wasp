import { components } from 'react-select';
import React from 'react';
import cn from './Select.module.css';

export const DropdownIndicator = props => {
    return (
        <components.DropdownIndicator {...props}>
            <span className={cn.DropDownArrow}/>
        </components.DropdownIndicator>
    );
};

export const dropDownStyles = {

    container: (provided, state) => ({
        ...provided,
        cursor: state.isDisabled ? "not-allowed" : "pointer",
        width: '100%',
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '1.5',
        color: 'var(--input-text-text-color)',
        background: 'var(--input-text-bg-color)',
        border: '1px solid var(--input-border-color)',
        borderRadius: '4px',
        textTransform: 'capitalize',

    }),
    option: (provided, state) => ({
        ...provided,
        '&:hover': {
            backgroundColor: '#b4b4b425',
        },
        color: 'var(--app-font-color)',
        fontSize: 'var(--app-font-size)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textTransform: 'capitalize',
        backgroundColor: state.isSelected || state.isFocused ? '#b4b4b425' : 'trasparent',
        border: state.isSelected ? '1px solid var(--app-select-selected-border-color)' : 'none',
        cursor: state.isDisabled ? "not-allowed" : "pointer",
    }),
    control: (provided, state) => ({
        // none of react-select's styles are passed to <Control />
        ...provided,
        borderRadius: '2px',
        backgroundColor: 'transparent',
        minHeight: 'unset',
        borderColor: "transparent",
        color: 'var(--app-font-color)',
        boxShadow: state.isFocused ? 0 : 0,
        '&:hover': {
            //borderColor: '#7f7f7f'
        },
        cursor: state.isDisabled ? "not-allowed" : "pointer",
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#191919',
        paddingTop: 0,
        marginTop: 2,
        border: '1px solid var(--input-border-color)',
        maxHeight: '150px',
        overflow: 'auto'
    }),
    valueContainer: (provided) => ({
        ...provided,
        fontSize: 'var(--app-font-size)',

    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none'
    }),
    dropdownIndicator: defaultStyles => ({
        ...defaultStyles,
        color: 'black' // your changes to the arrow
    }),
    singleValue: (provided) => ({
        ...provided,
        fontSize: 'var(--app-font-size)',
        fontWeight: 400,
        color: 'var(--container-list-header-item-color)'
    }),
    placeholder: (provided) => ({
        ...provided,        
        color: 'var(--app-font-color)'
    }),
    noOptionsMessage: (provided) => ({
        ...provided,
        fontWeight: 400,
        color: 'var(--app-font-color)',
        fontSize: 'var(--app-font-size)',
    }),

}
