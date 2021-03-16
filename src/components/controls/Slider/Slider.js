import React, { Component } from 'react';
import cn from './Slider.module.css';

export default class Slider extends Component {

    constructor(props) {
        super(props);

        this.sliderLine = React.createRef();

        this.state = {
            offset: 0,
            prevOffset: 0,
            dragging: false,
            startY: null
        };
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.dragging && !prevState.dragging) {
            document.addEventListener('mousemove', this.onMouseMove)
            document.addEventListener('mouseup', this.onMouseUp)
        } else if (!this.state.dragging && prevState.dragging) {
            document.removeEventListener('mousemove', this.onMouseMove)
            document.removeEventListener('mouseup', this.onMouseUp)
        }
    }

    getOffset = () => {
        let offset = this.state.prevOffset + this.state.offset;
        return offset > 100 ? 100 : offset < 0 ? 0 : offset;
    }

    onMouseDown = (e) => {
        this.setState({ dragging: true, startY: e.pageY, prevOffset: this.getOffset(), offset: 0 })
        e.stopPropagation();
        e.preventDefault();
    }
    onMouseUp = (e) => {
        this.setState({ dragging: false });
        this.props.updatePosition(this.getOffset());
        e.stopPropagation();
        e.preventDefault();
    }
    onMouseMove = (e) => {
        if (!this.state.dragging) return;
        this.setState({
            offset: (e.pageY - this.state.startY)
        })
        e.stopPropagation();
        e.preventDefault();
    }
    onLineClick = (e) => {
        this.setState({
            offsetY: e.pageY - this.state.prevPos
        })
        e.stopPropagation();
        e.preventDefault();
    }



    render() {
        let moveDraggable = { "marginTop": `${this.getOffset()}px` };
        return (
            <div className={cn.sliderWrapper}>
                <div className={cn.mapslider}>
                    <div className={cn.buttons}>
                        <div className={cn.dragline}>
                            <div className={cn.line} ref={this.sliderLine} onClick={(e) => this.onLineClick(e)} />
                            <div className={cn.draggablebutton} style={moveDraggable}
                                onMouseDown={(e) => this.onMouseDown(e)}
                                onMouseUp={(e) => this.onMouseUp(e)}
                                onMouseMove={(e) => this.onMouseMove(e)} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
