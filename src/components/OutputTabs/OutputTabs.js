import React, { Component } from 'react'
import cn from './OutputTabs.module.css'
import WeaponDetection from '../../assets/images/WeaponDetection.png';
import externalConfig from '../../ExternalConfigurationHandler';
import actions from '../../store/actions';
import config, { devVideoSnapshotUrl, devVideoStreamUrl } from '../../config';
import { connect } from 'react-redux';
import EnemySpottedSound from '../../assets/EnemySpotted.mp3';
import ArmedRed from '../../assets/images/armedRed.svg';


class OutputTabs extends Component {


    constructor(props) {
        super(props);
        this.state = {
            pointPosition: null,
            showCapture: true,
            selectedTab: "WindowDetection"
        }
        this.EnemySpotted = new Audio(EnemySpottedSound);

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onImageLoaded())
    }

    onImageLoaded = (e) => {
        if (!this.props.imageSentToDroneData || !this.props.imageSentToDroneData.point) {
            console.log("Error, this.props.imageSentToDroneData.point as it is undefined");
            return;
        }

        const tabsWrapper = document.getElementById('tabs-wrapper');

        const img = e.target;
        const xFactor = img.naturalWidth / tabsWrapper.getBoundingClientRect().width;
        const yFactor = img.naturalHeight / tabsWrapper.getBoundingClientRect().height;
        const { roundedX, roundedY } = this.props.imageSentToDroneData.point;
        this.setState({
            pointPosition: {
                top: roundedY / yFactor,
                left: roundedX / xFactor,
            }
        })

    }

    componentDidUpdate(prevProps) {
        if (prevProps.imageSentToDroneData !== this.props.imageSentToDroneData) {
            const img = document.createElement('img');
            img.onload = this.onImageLoaded;
            img.src = this.props.imageSentToDroneData.image;
            window.addEventListener('resize', () => this.onImageLoaded({ target: img }))
        }

        if (prevProps.weaponDetected !== this.props.weaponDetected) {
            this.EnemySpotted.play();
            this.onToggleTabClick("Skeleton");
        }

        if ((prevProps.skeletonRange === 'N/A' && this.props.skeletonRange !== 'N/A') ||
            (!prevProps.indoorExplorationFlag && this.props.indoorExplorationFlag)) {
            this.onToggleTabClick("Skeleton");
        }
    }

    renderTabs() {

        let imageElement = null;
        let pointElement = null;

        const imageDataUrl = this.props.imageSentToDroneData && this.props.imageSentToDroneData.image;
        const point = this.props.imageSentToDroneData && this.props.imageSentToDroneData.point;
        if (imageDataUrl && point) {
            imageElement = <img className={cn.OutputImage} src={imageDataUrl} />
            pointElement = <div className={cn.Point} style={this.state.pointPosition}></div>
        }
        return (<>
            { imageElement}
            { pointElement}
        </>
        );
    }

    renderNoOutputReceived() {
        return <div className={cn.ErrorMessage}><span className={cn.ErrorIcon}></span> No output has been received yet</div>
    }

    onToggleTabClick = (selectedTab) => {
        this.setState({ selectedTab });
    }

    renderTabsToggle = () => {
        const selectedTab = this.state.selectedTab;
        return (<>
            <div className={cn.tabslidernav} >
                <ul className={cn.tabslidertabs} >
                    <li className={`${cn.tabslidertrigger} ${selectedTab == "Capture" ? cn.TabSelected : ""}`}
                        onClick={() => this.onToggleTabClick("Capture")}>
                        Capture
                    </li>
                    <li className={`${cn.tabslidertrigger} ${selectedTab == "Skeleton" ? cn.TabSelected : ""}`}
                        onClick={() => this.onToggleTabClick("Skeleton")}>
                        Skeleton
                    </li>
                    <li className={`${cn.tabslidertrigger} ${selectedTab == "WindowDetection" ? cn.TabSelected : ""}`}
                        onClick={() => this.onToggleTabClick("WindowDetection")}>
                        Window
                    </li>
                    <li className={`${cn.tabslidertrigger} ${selectedTab == "Occupancy" ? cn.TabSelected : ""}`}
                        onClick={() => this.onToggleTabClick("Occupancy")}>
                        Occupancy
                    </li>
                </ul>
            </div>

        </>)

    }

    getCaptureTab() {
        return this.props.imageSentToDroneData ? this.renderTabs() : this.renderNoOutputReceived();
    }

    getSkeletonRange() {
        if (this.props.skeletonRange && this.props.skeletonRange !== 'N/A') {
            return `${this.props.skeletonRange} m`;
        }
        return this.props.skeletonRange;
    }

    getSkeletonTab() {
        let weaponDetectedClass = this.props.weaponDetected ? cn.WeaponDetected : undefined;
        return (<div className={`${cn.SkeletonTab} ${weaponDetectedClass}`} >
            <img
                key={"skeleton" + this.props.selectedDrone}
                crossOrigin="anonymous"
                //    onLoad={this.onVideoLoaded}
                //   onError={this.onVideoError}
                className={cn.VideoImage}
                src={this.getSkeletonVideoSrc()}
                id='droneImage'
            //    onClick={this.props.pointVideoImage}
            />
            {this.props.weaponDetected && <img className={`${cn.AlertIcon}`} src={ArmedRed} />}
            { this.props.skeletonRange && <span className={`${cn.SkeletonRange}`} > {this.getSkeletonRange()} </span>}
        </div>)
    }

    getWindowDetectionTab() {
        return (<div className={`${cn.WindowTab}`} >
            <img
                key={"window" + this.props.selectedDrone}
                crossOrigin="anonymous"
                //    onLoad={this.onVideoLoaded}
                //   onError={this.onVideoError}
                className={cn.VideoImage}
                src={this.getWindowDetectionVideoSrc()}
                id='droneImage'
            //    onClick={this.props.pointVideoImage}
            />
            <span className={`${cn.AlertIcon}`} />
        </div>)
    }

    getOccupancyTab() {
        return (<div id="occupancyTab"/>);
    }

    

    getWindowDetectionVideoSrc() {
        const { DRONES_DATA } = externalConfig.getConfiguration();
        const ip = `//${DRONES_DATA.segment}.${this.props.selectedDrone}:${DRONES_DATA.port}`;
        const snapshotUrl = `${ip}${config.urls.windowDetectionSnapshot}`;
        const streamUrl = `${ip}${config.urls.windowDetectionStream}`;

        if (this.props.isPaused) {
            return process.env.NODE_ENV === 'developments' ? devVideoSnapshotUrl : snapshotUrl;
        } else {
            return process.env.NODE_ENV === 'developments' ? devVideoStreamUrl : streamUrl;
        }
    }
    getSkeletonVideoSrc() {
        const { DRONES_DATA } = externalConfig.getConfiguration();
        const ip = `//${DRONES_DATA.segment}.${this.props.selectedDrone}:${DRONES_DATA.port}`;
        const snapshotUrl = `${ip}${config.urls.skeletonSnapshot}`;
        const streamUrl = `${ip}${config.urls.skeletonStream}`;

        if (this.props.isPaused) {
            return process.env.NODE_ENV === 'developments' ? devVideoSnapshotUrl : snapshotUrl;
        } else {
            return process.env.NODE_ENV === 'developments' ? devVideoStreamUrl : streamUrl;
        }
    }

    getSelectedTab() {
        switch (this.state.selectedTab) {
            case "Capture":
                return this.getCaptureTab();
            case "Skeleton":
                return this.getSkeletonTab();
            case "Occupancy":
                return this.getOccupancyTab();
            case "WindowDetection":
                return this.getWindowDetectionTab();
            default:
                return "";
        }
    }

    render() {

        return (
            <div className={cn.Wrapper}>
                {this.renderTabsToggle()}
                <div className={cn.Tabs} id='tabs-wrapper'>
                    {this.getSelectedTab()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        tabs: state.video.tabs,
        imageSentToDroneData: state.layout.imageSentToDroneData,
        skeletonRange: state.output.skeletonRange,
        weaponDetected: state.output.weaponDetected,
        indoorExplorationFlag: state.output.indoorExplorationFlag,
        selectedDrone: state.map.selectedDrone
    };
};

const mapDispachToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispachToProps)(OutputTabs);