import React, { PureComponent, Component } from 'react';
import logo from '../src/assets/images/newLogo.svg';
import classNames from './App.module.css';
import Loader from './components/LoaderAlt/LoaderAlt';
import Clock from './components/Clock/Clock';
import Select from './components/controls/Select/Select';
import Popup from './components/Popup/Popup';
import Error from './components/Error/Error';
import GlobalMessage from './components/GlobalMessage/GlobalMessage';
import actionTypes from './store/actions/actionTypes';
import { connect } from 'react-redux';
import ContextMenu from './components/ContextMenu/ContextMenu';
import externalConfig from './ExternalConfigurationHandler';
import { Switch, Route, withRouter } from 'react-router-dom';
import Main from './components/Main/Main';
import MissionPlanner from './components/MissionPlanner/MissionPlanner';
import * as geoCalculations from './utils/geoCalculations';

class App extends Component {

    disableZoomInTouchScreen = e => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }

    componentDidMount() {
        window.MapCore.SetStartCallbackFunction(this.props.setMapCoreSDKLoadedFlag);

        const defaultGroup = externalConfig.getConfiguration().streamingLayers[0];
        this.props.setMapToShow(defaultGroup);

        //Disable zoom in touch
        window.addEventListener('touchstart', this.disableZoomInTouchScreen, { passive: false });
    }

    componentWillUnmount() {
        window.removeEventListener('touchstart', this.disableZoomInTouchScreen);
    }

    closeErrorPopup = () => {
        this.setState({
            generalErrorMessage: false,
        });
    };

    getGeneralErrorPopup() {
        if (false) {
            return (
                <Popup
                    buttonOk='OK'
                    header={''}
                    hideXButton
                    onOk={this.closeErrorPopup}>
                    <Error errorMsg={''} />
                </Popup>
            );
        }
        return null;
    }

    getClock() {
        return <Clock />;
    }

    formatPosition(value) {
        if (value === null || value === undefined) return null;
        return Math.round(value);
    }
    renderDroneSelect() {
        const droneList = externalConfig.getConfiguration().DRONES_DATA.dronesList; 
        const options = droneList.map(number => ({label: number}))
        const dropDownData = {
            defaultValue: {label: droneList[0]},
            options,
            onChange: droneNumber => this.handleTypeChange(droneNumber)
        };

        return (
            <div className={classNames.Row}>
                <Select {...dropDownData} />
            </div>
        )
    }


    handleTypeChange = (droneNumber) => {
        this.props.selectDrone(droneNumber.label);
    }

    getMainHeader() {
        debugger;
        const dronePosition = this.props.dronesPositions[this.props.selectedDrone];
        let droneOffset = null;
        let coordinateWithOffset = null;
        if(dronePosition && dronePosition.offset){
            droneOffset = dronePosition.offset;
            coordinateWithOffset = geoCalculations.getMapCoordinate(dronePosition.workingOrigin , dronePosition.offset);
        }
        return (
            <header className={classNames.AppHeader}>
                <div className={classNames.LogoWrapper} onClick={() => this.props.history.push('/')}>
                    <img src={logo} alt='logo' />
                    <span className={classNames.VersionText}>version: 21.05.26 </span>
                </div>
                <div className={classNames.HeaderLeftWrapper}>
                    <span className={classNames.HeaderItem}>
                        <span className={`${classNames.Icon} ${classNames.DroneIcon}`}></span>
                        <span className={classNames.DroneSelectionWrapper}>
                            {this.renderDroneSelect()}
                        </span>
                    </span>
                    <span className={classNames.HeaderItem}>
                        <span className={classNames.LongLatWrapper}>
                            <span className={classNames.MissionWrapper}>
                                <span className={classNames.lonLatLabel}>Mission:</span>
                            </span>
                            <span className={classNames.MissionValueWrapper}>
                                <span className={classNames.MissionValue}>{this.props.missionState}</span>
                            </span>
                        </span>
                    </span>
                    <span className={classNames.HeaderItem}>
                        <span className={`${classNames.Icon} ${classNames.PositionIcon}`}></span>
                        <span className={classNames.LongLatWrapper}>
                            <span>
                                <span className={classNames.lonLatLabel}>X:</span>
                                <span className={classNames.lonLatValue}>{coordinateWithOffset ? this.formatPosition(coordinateWithOffset.x) : "N/A"}</span>
                            </span>
                            <span>
                                <span className={classNames.lonLatLabel}>Y:</span>
                                <span className={classNames.lonLatValue}>{coordinateWithOffset ? this.formatPosition(coordinateWithOffset.y) : "N/A"}</span>
                            </span>
                            <span>
                                <span className={classNames.lonLatLabel}>Z:</span>
                                <span className={classNames.lonLatValue}>{coordinateWithOffset ? this.formatPosition(coordinateWithOffset.z) : "N/A"}</span>
                            </span>
                        </span>
                    </span>
                    <span className={classNames.HeaderItem}>
                        <span className={`${classNames.Icon} ${classNames.CompassIcon}`}></span>
                        <span className={classNames.LongLatWrapper}>
                            <span>
                                <span className={classNames.lonLatLabel}>X:</span>
                                <span className={classNames.lonLatValue}>{droneOffset ? droneOffset.x : "N/A"}</span>
                            </span>
                            <span>
                                <span className={classNames.lonLatLabel}>Y:</span>
                                <span className={classNames.lonLatValue}>{droneOffset ? droneOffset.y : "N/A"}</span>
                            </span>
                            <span>
                                <span className={classNames.lonLatLabel}>Z:</span>
                                <span className={classNames.lonLatValue}>{droneOffset ? droneOffset.z : "N/A"}</span>
                            </span>
                        </span>
                    </span>
                    <span className={classNames.HeaderItem}><span className={`${classNames.Icon} ${classNames.WifiIcon}`}></span></span>
                    <span className={classNames.HeaderItem}>
                        <span className={`${classNames.Icon} ${classNames.BatteryIcon}`}></span>
                        <span className={classNames.BatteryValue}>59%</span>
                    </span>
                    <div className={classNames.HeaderItem}>{this.getClock()}</div>
                    <button className={classNames.MenuBtn}
                        onClick={this.props.dronesPositions[this.props.selectedDrone] &&
                            this.props.dronesPositions[this.props.selectedDrone].workingOrigin ?
                            this.props.toggleMissionPlannerScreen :
                            () => alert("Need to select working origin first.")}>
                        <span className={`${classNames.Icon} ${classNames.MissionPlannerIcon}`}></span>
                    </button>
                </div>
            </header>
        );
    }

    //  onMoreActionsClick = (e) => {
    //      e.preventDefault();
    //      e.stopPropagation();

    //      const menuItemsList = [
    //          {
    //              name: "Mission Planner Page",
    //              func: this.props.showMissionPlannerScreen,
    //              iconCss: "MissionPlannerIcon"
    //          }
    //      ];

    //      this.props.showContextMenu(e.clientX, e.clientY, menuItemsList);
    //  }

    render() {

        if (this.props.isLoading) {
            return <Loader loadingMessage={'initializing...'} />;
        }

        const plannerHiddenClass = this.props.isMissionPlanScreenHidden ? ` ${classNames.MissionPlannerHidden}` : '';

        return (
            <div className={classNames.App}>
                <GlobalMessage />
                {this.props.popupDetails ? <Popup popupDetails={this.props.popupDetails} /> : null}
                {this.props.contextMenu ? <ContextMenu contextMenu={this.props.contextMenu} /> : null}
                {this.getGeneralErrorPopup()}
                {this.getMainHeader()}
                <Main isMissionPlanScreenHidden={this.props.isMissionPlanScreenHidden} />
                <div className={`${classNames.MissionPlannerOverlay}${plannerHiddenClass}`}>
                    <MissionPlanner />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        contextMenu: state.layout.contextMenu,
        popupDetails: state.layout.popupDetails,
        missionState: state.output.missionState || 'N/A',
        isMissionPlanScreenHidden: state.layout.isMissionPlanScreenHidden,
        dronesPositions: state.map.dronesPositions,
        selectedDrone: state.map.selectedDrone
    }
};

const mapDispachToProps = (dispatch) => {
    return {
        setMapCoreSDKLoadedFlag: () => dispatch({ type: actionTypes.SET_MAPCORE_SDK_LOADED_FLAG }),
        setMapToShow: groupNode => dispatch({ type: actionTypes.SET_MAP_TO_SHOW, payload: groupNode }),
        showContextMenu: (x, y, items) => dispatch({ type: actionTypes.SHOW_CONTEXT_MENU, payload: { x, y, items } }),
        toggleMissionPlannerScreen: () => dispatch({ type: actionTypes.TOGGLE_MISSION_PLANNER_SCREEN }),
        selectDrone: (droneNumber) => dispatch({ type: actionTypes.SELECT_DRONE, payload: { droneNumber } }),
    };
};

export default withRouter(connect(mapStateToProps, mapDispachToProps)(App));

//export default connect(mapStateToProps, mapDispachToProps)(App);
