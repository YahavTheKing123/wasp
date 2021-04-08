import React, { Component } from 'react'
import cn from './FlightTelemetry.module.css'
import { connect } from 'react-redux';
class FlightTelemetry extends Component {

    getAltitue(dronePositionOffset) {
        if (dronePositionOffset && dronePositionOffset.z > 0) {
            return dronePositionOffset.z.toFixed(1);
        }
        return 0;
    }

    render() {
        const {dronePositionOffset} = this.props;
        return (
            <div className={cn.Wrapper}>
                <span className={cn.TelemetryWrapper}>
                    <span>Altitude:</span>
                    <span>{this.getAltitue(dronePositionOffset)}<span className={cn.Units}>m</span></span>
                </span>
                <span className={cn.TelemetryWrapper}>
                    <span>Speed:</span>
                    <span>21<span className={cn.Units}>km/h</span></span>
                </span>
            </div>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        dronePositionOffset: state.map.dronePositionOffset
    };
};

const mapDispachToProps = (dispatch) => {
    return {
      
    };
};

export default connect(mapStateToProps, mapDispachToProps)(FlightTelemetry);