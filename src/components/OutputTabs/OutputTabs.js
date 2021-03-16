import React, { Component } from 'react'
import cn from './OutputTabs.module.css'
import WeaponDetection from '../../assets/images/WeaponDetection.png';
import externalConfig from '../../ExternalConfigurationHandler';
import config, { devVideoSnapshotUrl, devVideoStreamUrl } from '../../config';
import { connect } from 'react-redux';
import EnemySpottedSound from '../../assets/EnemySpotted.mp3';


class OutputTabs extends Component {


    constructor(props) {
        super(props);
        this.state = {
            pointPosition: null,
            showCapture: true,
            selectedTab: "Capture"
        }
        this.EnemySpotted = new Audio(EnemySpottedSound);

    }

    getCorrectPosition() {

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
        if (selectedTab == "Skeleton") {
            this.EnemySpotted.play();
        }
        this.setState({ selectedTab });
    }

    renderTabsToggle = () => {
        const selectedTab = this.state.selectedTab;
        return (<>

            <div className={cn.tabslidernav} >
                <ul className={cn.tabslidertabs} >
                    <li className={`${cn.tabslidertrigger} ${ selectedTab == "Capture" ? cn.TabSelected : ""}`}
                        onClick={() => this.onToggleTabClick("Capture")}>
                        Capture
                    </li>
                    <li className={`${cn.tabslidertrigger} ${selectedTab == "Skeleton"  ? cn.TabSelected : ""}`}
                        onClick={() => this.onToggleTabClick("Skeleton")}>
                        Skeleton
                    </li>
                    <li className={`${cn.tabslidertrigger} ${selectedTab == "WindowDetection"  ? cn.TabSelected : ""}`}
                        onClick={() => this.onToggleTabClick("WindowDetection")}>
                        Window
                    </li>
                </ul>
            </div>

        </>)

    }

    getCaptureTab() {
        return this.props.imageSentToDroneData ? this.renderTabs() : this.renderNoOutputReceived();
    }

    getSkeletonTab() {
        return (<div className={cn.SkeletonTab} >
            <img
                crossOrigin="anonymous"
                //    onLoad={this.onVideoLoaded}
                //   onError={this.onVideoError}
                className={cn.VideoImage}
                src={this.getVideoSrc()}
                id='droneImage'
            //    onClick={this.props.pointVideoImage}
            />
            <span className={`${cn.AlertIcon}`} />
            { this.props.skeletonRange && <span className={`${cn.SkeletonRange}`} > -{this.props.skeletonRange}mm- </span>}
        </div>)
    }

    getWindowDetectionTab() {
        return this.props.imageSentToDroneData ? this.renderTabs() : this.renderNoOutputReceived();
    }
    getVideoSrc() {
        const { BE_PORT, BE_IP } = externalConfig.getConfiguration();

        const snapshotUrl = `//${BE_IP}:${BE_PORT}${config.urls.skeletonSnapshot}`;
        const streamUrl = `//${BE_IP}:${BE_PORT}${config.urls.skeletonStream}`;

        if (this.props.isPaused) {
            return process.env.NODE_ENV === 'development' ? devVideoSnapshotUrl : snapshotUrl;
        } else {
            return process.env.NODE_ENV === 'development' ? devVideoStreamUrl : streamUrl;
        }
    }

    getSelectedTab() {
        switch (this.state.selectedTab) {
            case "Capture":
                return this.getCaptureTab();
            case "Skeleton":
                return this.getSkeletonTab();
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
        skeletonRange: state.output.skeletonRange
    };
};

const mapDispachToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispachToProps)(OutputTabs);