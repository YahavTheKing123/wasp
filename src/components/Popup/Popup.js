import React, { PureComponent } from 'react';
import cn from './Popup.module.css';
import closeImg from '../../assets/images/close.svg';


export default class Popup extends PureComponent {
    EscKey = 27;
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }
    
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (e) =>{
        if (e.keyCode === this.EscKey && this.props.onCancel){
            this.onCancelClicked(e);    
        }
    }

    onOkClicked = (e) => {
        e.preventDefault();
        if (this.props.onOk) {
            this.props.onOk();    
        }
    }

    onCancelClicked = (e) => {
        e.preventDefault();
        if (this.props.onCancel) {
            this.props.onCancel();    
        }
    }

    getXBtn() {
        return (
            this.props.hideXButton ? null :
                <a className={cn.Close} href="#" onClick={this.onCancelClicked}>
                    <img className={cn.closeBtn} src={closeImg}/>
                </a> 
        );
    }
    getFooter() {
        let okButton = null;
        let cancelButton = null;
        if (this.props.buttonOk) {
            okButton = <button onClick={this.onOkClicked} className={`${cn.FormButton} ${cn.Apply}`}>{this.props.buttonOk}</button>;            
        }
        if (this.props.buttonCancel) {
            cancelButton = <button onClick={this.onCancelClicked} className={`${cn.FormButton}`}>{this.props.buttonCancel}</button>;            
        }

        if (!okButton && !cancelButton) return null;
        return (

            <div className={cn.PopupFooter}>
                <div>         
                    {cancelButton}       
                    {okButton}
                </div>
            </div>
        );
    }
    getHeader() {
        return (
            <div className={cn.PopupHeader}>
                <div className={cn.PopupHeaderWrapper}>
                    <h2 className={cn.h2}>{this.props.header}</h2>                                            
                    {this.getXBtn()}                    
                </div>
            </div>
        );
    }

    getBody() {
        const noBodyOverflowClass = this.props.noBodyOverflow ? cn.NoBodyOverFlow : '';

        const body =  React.Children.count(this.props.children)  > 0 ?
            (<div className={`${cn.PopupBody} ${noBodyOverflowClass}`}>
                {this.props.children}
            </div>) : null;
        return body;
    }

    render() {
        const size = this.props.size ? cn[this.props.size] : '';
        return (this.props.children) ? 
                (
                   <div className={cn.Overlay}>
                       <div className={`${cn.Popup} ${size}`}>
                           {this.getHeader()}
                           {this.getBody()}
                           {this.getFooter()}
                       </div>
                   </div>
               ) : null;
        
    }
}
