import React, { Component } from 'react';
import cn from './SingleInputForm.module.css';
import {connect} from 'react-redux';
import Input from '../controls/Input/Input';

class SingleInputForm extends Component {
    inputRef = React.createRef()
    state = {
        value: ''
    }

    componentDidMount() {
        if (this.inputRef && this.inputRef.current) {
          this.inputRef.current.focus();
        }
    }

    
    onValueChange = e => {        
        const newValue = e.target.value;

        this.setState({
            value: newValue
        }, () => this.props.onValueChange(newValue))
    }

    render() {
        return (            
            <div className={cn.Wrapper}>                
                <Input 
                    parentRef={this.inputRef}
                    value={this.state.value || this.props.defaultValue}
                    onChange={this.onValueChange}
                    placeHolder= {this.props.placeHolder || ""}
                    label={this.props.label} />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {        
    return {        
        //scaleValue: state.layout.selectedConfigPerService[ownProps.name].scale
    }
};

const mapDispachToProps = dispatch => {
    return {        
        
    }
}

export default connect(
    mapStateToProps,
    mapDispachToProps
)(SingleInputForm)
