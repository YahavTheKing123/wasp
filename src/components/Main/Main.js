import React, { Component } from 'react'
import classNames from './Main.module.css';
import FlightTelemetry from '../FlightTelemetry/FlightTelemetry';
import MapContainer from '../MapContainer/MapContainer';
import Video from '../Video/Video';
import OutputTabs from '../OutputTabs/OutputTabs';
import ActionButtons from '../ActionButtons/ActionButtons';

export default class Main extends Component {

    getMainLeftPane() {
        return <MapContainer />;
    }

    getMainRightPane() {
        return (
            <div className={classNames.RightPaneWrapper}>
                <div className={classNames.RightPaneWrapperItem}>
                    <Video />
                </div>
                <div className={classNames.RightPaneWrapperItem}>
                    <OutputTabs />
                </div>
            </div>
        );
    }

    getActionButtons() {
        return <ActionButtons/>        
    }


    render() {
        return (
            <div className={classNames.MainContentWrapper}>
                <div className={`${classNames.Split} ${classNames.Left}`}>
                    {this.getMainLeftPane()}
                </div>
                <div className={`${classNames.Split} ${classNames.Right}`}>
                    {this.getMainRightPane()}
                </div>
                {this.getActionButtons()}
                <FlightTelemetry/>
            </div>
        )
    }
}
