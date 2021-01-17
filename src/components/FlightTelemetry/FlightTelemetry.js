import React, { Component } from 'react'
import cn from './FlightTelemetry.module.css'

export default class FlightTelemetry extends Component {
    render() {
        return (
            <div className={cn.Wrapper}>
                <span className={cn.TelemetryWrapper}>
                    <span>Altitude:</span>
                    <span>4.5<span className={cn.Units}>m</span></span>
                </span>
                <span className={cn.TelemetryWrapper}>
                    <span>Speed:</span>
                    <span>21<span className={cn.Units}>km/h</span></span>
                </span>
            </div>
        )
    }
}
