import React, { PureComponent } from 'react';
import classNames from './Loader.module.css';

export default class Loader extends PureComponent {    

    render() {
        const rowClass = this.props.isRow ? ` ${classNames.Row}` : '';
        return (
            <div className={`${classNames.Spinner}${rowClass}`}>
                <div className={classNames.bounce1}></div>
                <div className={classNames.bounce2}></div>
                <div className={classNames.bounce3}></div>
            </div> 
        );
    }
}