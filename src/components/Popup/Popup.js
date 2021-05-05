import React, { PureComponent } from 'react';
import cn from './Popup.module.css';
import closeImg from '../../assets/images/close.svg';
import PopupChildren from './PopupChildren';
import { connect } from 'react-redux';
import actionTypes from '../../store/actions/actionTypes';

class Popup extends PureComponent {
    EscKey = 27;
    EnterKey = 13;

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        if (e.keyCode === this.EscKey) {
            this.closePopup();
        } else if ((e.keyCode === this.EnterKey) && this.props.popupDetails.primayButton && this.props.popupDetails.primayButton.callback) {
            this.props.popupDetails.primayButton.callback();
            this.closePopup();
        }
    }

    closePopup = () => {
        if (this.props.popupDetails && this.props.popupDetails.onCloseButtonClick) {
            this.props.popupDetails.onCloseButtonClick();
        }
        this.props.hidePopup();
    }

    onCloseBtnClick = e => {
        e.preventDefault();
        this.closePopup()
    }

    getXBtn() {
        return (
            this.props.hideXButton ? null :
                <a className={cn.Close} href="#" onClick={this.onCloseBtnClick}>
                    <img className={cn.closeBtn} src={closeImg} />
                </a>
        );
    }
    closePopup() {
        if (this.props.popupDetails && this.props.popupDetails.onCloseButtonClick) {
            this.props.popupDetails.onCloseButtonClick();
        }
        this.props.hidePopup();
    }

    onPrimaryBtnClick = e => {
        e.preventDefault();
        if (this.props.popupDetails.primayButton && this.props.popupDetails.primayButton.callback) {
            this.props.popupDetails.primayButton.callback();
        }
        this.closePopup();
    }

    onSecondaryBtnClick = e => {
        e.preventDefault();
        if (this.props.popupDetails.secondaryButton && this.props.popupDetails.secondaryButton.callback) {
            this.props.popupDetails.secondaryButton.callback();
        }
        this.closePopup();
    }

    renderButtons() {
        //default primary button in case no other button was injected as props
        let primaryButton = <button type="button" className={`${cn.Btn} ${cn.BtnPrimary}`} onClick={this.onPrimaryBtnClick}>Close</button>;
        let secondaryButton = null;
        const popupDetails = this.props.popupDetails;

        if (popupDetails.primayButton) {
            let disabled = popupDetails.primayButton.disabled;
            primaryButton =
                <button type="button"
                    className={`${cn.FormButton} ${cn.Apply} ${disabled ? cn.Disabled : ""}`}
                    onClick={disabled ? undefined : this.onPrimaryBtnClick}>
                    {popupDetails.primayButton.title}
                </button>;
        }

        if (popupDetails.secondaryButton) {
            let disabled = popupDetails.secondaryButton.disabled;
            secondaryButton =
                <button type="button"
                    className={`${cn.FormButton}   ${disabled ? cn.Disabled : ""}`}
                    onClick={disabled ? undefined : this.onSecondaryBtnClick}>
                    {popupDetails.secondaryButton.title}
                </button>
        }

        return (
            <>
                {secondaryButton}
                {primaryButton}
            </>
        )
    }

    getFooter() {
        return (

            <div className={cn.PopupFooter}>
                <div>
                    {this.renderButtons()}
                </div>
            </div>
        );
    }

    getHeader() {
        return (
            <div className={cn.PopupHeader}>
                <div className={cn.PopupHeaderWrapper}>
                    <h2 className={cn.h2}>{this.props.popupDetails.title}</h2>
                    {this.getXBtn()}
                </div>
            </div>
        );
    }

    renderChild() {
        const Child = PopupChildren[this.props.popupDetails.modalChild];
        return <Child {...this.props.popupDetails.modalChildProps} />;
    }

    getBody() {
        const noBodyOverflowClass = this.props.noBodyOverflow ? cn.NoBodyOverFlow : '';

        const body =
            <div className={`${cn.PopupBody} ${noBodyOverflowClass}`}>
                {this.props.popupDetails.modalChild ? this.renderChild() : null}
            </div>;
        return body;
    }

    render() {
        if (!this.props.popupDetails) return null;
        let visibility = this.props.isPointSelectionMode ? { visibility: "hidden" } : {};
        const size = this.props.popupDetails.size ? cn[this.props.popupDetails.size] : '';
        return (
            <div className={cn.Overlay} >
                <div className={`${cn.Popup} ${size}`} style={visibility}>
                    {this.getHeader()}
                    {this.getBody()}
                    {this.getFooter()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isPointSelectionMode: state.layout.isPointSelectionMode
    }
};

const mapDispachToProps = dispatch => {
    return {
        hidePopup: () => dispatch({ type: actionTypes.HIDE_POPUP })

    }
}

export default connect(
    mapStateToProps,
    mapDispachToProps
)(Popup)