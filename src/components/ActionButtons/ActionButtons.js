import React, { Component } from 'react'
import cn from './ActionButtons.module.css'

export default class ActionButtons extends Component {
    render() {
        return (
            <div className={cn.Wrapper}>
                    <button className={cn.Button}><span className={`${cn.Icon} ${cn.LocateIcon}`}></span></button>
                    <button className={cn.Button}><span className={`${cn.Icon} ${cn.PauseIcon}`}></span></button>
                    <button className={cn.Button}><span className={`${cn.Icon} ${cn.ResetIcon}`}></span></button>
                    <button className={cn.Button}><span className={`${cn.Icon} ${cn.TakeoffIcon}`}></span></button>
            </div>
        )
    }
}
