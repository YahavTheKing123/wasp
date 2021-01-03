import React, { Component } from 'react'
import cn from './OutputTabs.module.css'
import { connect } from 'react-redux';

class OutputTabs extends Component {

    renderTabs() {
        return <div className={cn.Tabs}></div>
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
        tabs: state.video.tabs
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispachToProps)(OutputTabs);