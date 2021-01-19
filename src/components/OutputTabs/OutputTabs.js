import React, { Component } from 'react'
import cn from './OutputTabs.module.css'
import { connect } from 'react-redux';

class OutputTabs extends Component {

    renderTabs() {

        let imageElement = null;
        const imageSrc = this.props.imageSentToDroneData && this.props.imageSentToDroneData.image;
        if (imageSrc) {
            imageElement = <img src={imageSrc}/>
        }
        return (
            <div className={cn.Tabs}>
                {imageElement}
            </div>
        );
    }

    renderNoOutputReceived() {
        return <div className={cn.ErrorMessage}><span className={cn.ErrorIcon}></span> No output has been received yet</div>
    }

    render() {
        return (
            <div className={cn.Wrapper}>
                {this.props.tabs ? this.renderTabs() : this.renderNoOutputReceived()}                
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