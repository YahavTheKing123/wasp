import React, { Component } from 'react'
import classNames from './Main.module.css';
import FlightTelemetry from '../FlightTelemetry/FlightTelemetry';
import MapContainer from '../MapContainer/MapContainer';
import Video from '../Video/Video';
import OutputTabs from '../OutputTabs/OutputTabs';
import ActionButtons from '../ActionButtons/ActionButtons';
import { connect } from 'react-redux';
import {appUiElements} from '../../store/reducers/layoutReducer'
class Main extends Component {

    getMainLeftPane() {
        switch (this.props.appPrimaryUiElement) {
            case appUiElements.map:
                return <MapContainer />;
            case appUiElements.tabs:
                return <OutputTabs />;                
            default:
                return <MapContainer />;

        }
    }

    getSecondaryAppUiElement() {
        switch (this.props.appPrimaryUiElement) {
            case appUiElements.map:
                return <OutputTabs />;
            case appUiElements.tabs:
                return <MapContainer />;                
            default:
                return <OutputTabs />;

        }
    }

    getMainRightPane() {
        return (
            <div className={classNames.RightPaneWrapper}>
                <div className={classNames.RightPaneWrapperItem}>
                    <Video />
                </div>
                <div className={classNames.RightPaneWrapperItem}>
                    {this.getSecondaryAppUiElement()}
                </div>
            </div>
        );
    }

    getActionButtons() {
        return <ActionButtons/>        
    }


    render() {

        //const hiddenClass = !this.props.isMissionPlanScreenHidden ? ` ${classNames.Hidden}` : '';

        return (
            <div className={`${classNames.MainContentWrapper}`}>
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

const mapStateToProps = state => {
    return {
        appPrimaryUiElement: state.layout.appPrimaryUiElement
    }
};


export default connect(mapStateToProps, null)(Main);