import React, { Component } from 'react'
import cn from './SwitchMapForm.module.css';
import actionTypes from '../../store/actions/actionTypes';
import { connect } from 'react-redux';
import externalConfig from '../../ExternalConfigurationHandler';
import RadioGroup from '../controls/RadioGroup/RadioGroup';
import Radio from '../controls/Radio/Radio';

class SwitchMapForm extends Component {
    state = {
        isShown: false,
        selectedGroup: this.props.currentShownMap
    }

    renderHeader() {
        return (
            <div className={cn.Header}>
                Select Map to Show:
            </div>
        )
    }

    componentDidMount() {
        setTimeout(() => this.setState({isShown: true}), 300)
    }

    selectMapRadioButton(selectedGroup) {
        this.setState({
            selectedGroup
            })
    }

    renderBody() {
        const layers = externalConfig.getConfiguration().streamingLayers;
        const maps = layers.map(item => <div>{item.groupName}</div>)

        return (
            <div className={cn.Body}>
                <RadioGroup>
                    {layers.map((item, i) => {
                        return (
                            <Radio
                                key={i}
                                id={item.groupName}
                                isChecked={item.groupName === this.state.selectedGroup.groupName}
                                label={item.groupName}
                                onClick={() => this.selectMapRadioButton(item)} />
                        )
                    })}
                </RadioGroup>
            </div>
        )
    }

    onMapSelection = () => {
        if (this.state.selectedGroup.groupName !== this.props.currentShownMap.groupName) {

            this.props.setMapToShow(this.state.selectedGroup);            
        }
        this.props.onCancel()
    }

    renderFooter() {
        return (
            <div className={cn.Footer}>
                <button className={`${cn.Button} ${cn.Apply}`} onClick={this.onMapSelection}>Select</button>
                <button className={`${cn.Button}`} onClick={this.props.onCancel}>Cancel</button>
            </div>
        )
    }

    render() {
        const isShownClass = this.state.isShown ? cn.Shown : '';
        return (
            <div className={`${cn.Wrapper} ${isShownClass}`}>
                {this.renderHeader()}
                {this.renderBody()}
                {this.renderFooter()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {      
      currentShownMap: state.map.mapToShow,
    }
  };

const mapDispachToProps = (dispatch) => {
    return {        
        setMapToShow: groupNode => dispatch({type: actionTypes.SET_MAP_TO_SHOW, payload: groupNode})
    };
};

export default connect(mapStateToProps, mapDispachToProps)(SwitchMapForm);