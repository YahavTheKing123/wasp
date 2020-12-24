import React from 'react'
import cn from './Error.module.css';

export default function Error(props) {
    return (
        <div className={cn.Wrapper}>
            {props.errorMsg}
        </div>
    )
}
