import React, {Component} from 'react';
import cn from './RadioGroup.module.css';

export default class RadioGroup extends Component {

    render() {
        return (            
            <div className={cn.Wrapper}>
                {this.props.label ? <legend className={cn.Label}>{this.props.label}</legend> : null}
                <div className={cn.RadioGroupValuesWrapper}>
                    {
                        this.props.children.map((child, i) => 
                            React.cloneElement(child, {
                                key: i,
                                onClick: () => child.props.onClick(i),
                                isChecked: child.props.isChecked,
                                radioIndex: i
                            })
                        )
                    }
                </div>
            </div>
        );
    }
}
