import React, { PureComponent, Component } from 'react';
import logo from '../src/assets/images/newLogo.svg';
import classNames from './App.module.css';
import Loader from './components/LoaderAlt/LoaderAlt';
import Clock from './components/Clock/Clock';
import Popup from './components/Popup/Popup';
import FlightTelemetry from './components/FlightTelemetry/FlightTelemetry';
import Error from './components/Error/Error';
import MapContainer from './components/MapContainer/MapContainer';
import OutputTabs from './components/OutputTabs/OutputTabs';
import Video from './components/Video/Video';
import ActionButtons from './components/ActionButtons/ActionButtons';
import GlobalMessage from './components/GlobalMessage/GlobalMessage';
import actionTypes from './store/actions/actionTypes';
import { connect } from 'react-redux';
import ContextMenu from './components/ContextMenu/ContextMenu';
import externalConfig from './ExternalConfigurationHandler';


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
        window.addEventListener('touchstart', this.disableZoomInTouchScreen, {passive: false});
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

    getMainHeader() {
        return (
            <header className={classNames.AppHeader}>
                <img src={logo} alt='logo' />
                <div className={classNames.HeaderLeftWrapper}>
                <span className={classNames.HeaderItem}>
                        <span className={`${classNames.Icon} ${classNames.DroneIcon}`}></span>
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
                                <span className={classNames.lonLatLabel}>lat:</span>
                                <span className={classNames.lonLatValue}>32.35249</span>
                            </span>
                            <span>
                                <span className={classNames.lonLatLabel}>long:</span>
                                <span className={classNames.lonLatValue}>34.87586</span>
                            </span>
                        </span>
                    </span>
                    <span className={classNames.HeaderItem}><span className={`${classNames.Icon} ${classNames.WifiIcon}`}></span></span>
                    <span className={classNames.HeaderItem}>
                        <span className={`${classNames.Icon} ${classNames.BatteryIcon}`}></span>
                        <span className={classNames.BatteryValue}>59%</span>
                    </span>
                    <div className={classNames.RightHeader}>{this.getClock()}</div>
                </div>
            </header>
        );
    }

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

    getMainContent() {
        return (
            <div className={classNames.MainContentWrapper}>
                <div className={`${classNames.Split} ${classNames.Left}`}>
                    {this.getMainLeftPane()}
                </div>
                <div className={`${classNames.Split} ${classNames.Right}`}>
                    {this.getMainRightPane()}
                </div>
            </div>
        );
    }

    getActionButtons() {
        return <ActionButtons/>        
    }

    render() {
        if (this.props.isLoading) {
            return <Loader loadingMessage={'initializing...'} />;
        }
        return (
            <div className={classNames.App}>
                <GlobalMessage />
                {this.props.popupDetails ? <Popup popupDetails={this.props.popupDetails}/> : null}
                <FlightTelemetry/>
                {this.props.contextMenu ? <ContextMenu contextMenu={this.props.contextMenu}/> : null}
                {this.getActionButtons()}
                {this.getGeneralErrorPopup()}
                {this.getMainHeader()}
                {this.getMainContent()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
      contextMenu: state.layout.contextMenu,
      popupDetails: state.layout.popupDetails,
      missionState: state.output.missionState || 'N/A',
    }
  };

const mapDispachToProps = (dispatch) => {
    return {
        setMapCoreSDKLoadedFlag: () => dispatch({type: actionTypes.SET_MAPCORE_SDK_LOADED_FLAG}),
        setMapToShow: groupNode => dispatch({type: actionTypes.SET_MAP_TO_SHOW, payload: groupNode})
    };
};

export default connect(mapStateToProps, mapDispachToProps)(App);
