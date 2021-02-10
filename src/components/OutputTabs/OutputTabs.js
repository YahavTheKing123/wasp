import React, { Component } from 'react'
import cn from './OutputTabs.module.css'
import { connect } from 'react-redux';

class OutputTabs extends Component {

    state = {
        pointPosition: null
    }

    getCorrectPosition() {

    }

    onImageLoaded = (e) => {
        const tabsWrapper = document.getElementById('tabs-wrapper');

        const img = e.target;
        const xFactor = img.naturalWidth / tabsWrapper.getBoundingClientRect().width;
        const yFactor = img.naturalHeight / tabsWrapper.getBoundingClientRect().height;
        const {roundedX, roundedY} = this.props.imageSentToDroneData.point;
        this.setState({
            pointPosition: {
                top: roundedY / yFactor,
                left: roundedX / xFactor,                
            }
        })
        
    }

    componentDidUpdate(prevProps) {
        if (prevProps.imageSentToDroneData !==  this.props.imageSentToDroneData) {
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
            imageElement = <img className={cn.OutputImage} src={imageDataUrl}/>
            pointElement = <div className={cn.Point} style={this.state.pointPosition}></div>
        }
        return (
            <div className={cn.Tabs} id='tabs-wrapper'>
                {imageElement}
                {pointElement}
            </div>
        );
    }

    renderNoOutputReceived() {
        return <div className={cn.ErrorMessage}><span className={cn.ErrorIcon}></span> No output has been received yet</div>
    }

    render() {
        return (
            <div className={cn.Wrapper}>
                {this.props.imageSentToDroneData ? this.renderTabs() : this.renderNoOutputReceived()}                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        tabs: state.video.tabs,
        imageSentToDroneData: state.layout.imageSentToDroneData
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispachToProps)(OutputTabs);