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

    getSpeed() {
        let airSpeedValue = parseInt(this.props.airSpeed);
        
        if (isNaN(airSpeedValue)) {
            airSpeedValue = ` - `;
        }

        const displayValue = airSpeedValue !== ` - ` ? `${airSpeedValue}` : ` - `;
        return displayValue;
    }

    render() {
        const dronePosition = this.props.dronesPositions && this.props.dronesPositions[this.props.selectedDrone];
        return (
            <div className={cn.Wrapper}>
                <span className={cn.TelemetryWrapper}>
                    <span>Altitude:</span>
                    <span>{this.getAltitue(dronePosition && dronePosition.offset)}<span className={cn.Units}>m</span></span>
                </span>
                <span className={cn.TelemetryWrapper}>
                    <span>Speed:</span>
                    <span>{this.getSpeed()}<span className={cn.Units}>km/h</span></span>
                </span>
            </div>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        dronesPositions: state.map.dronesPositions,
        selectedDrone: state.map.selectedDrone,
        airSpeed: state.layout.airSpeedMap[state.map.selectedDrone]
    };
};

const mapDispachToProps = (dispatch) => {
    return {
      
    };
};

export default connect(mapStateToProps, mapDispachToProps)(FlightTelemetry);