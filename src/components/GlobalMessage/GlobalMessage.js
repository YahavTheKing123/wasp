import React,{ PureComponent } from 'react';
import classNames from './GlobalMessage.module.css';
import infoIcon from '../../assets/images/infoFull.svg';
import successIcon from '../../assets/images/success.svg';
import errorIcon from '../../assets/images/errorIcon.svg';
import warnIcon from '../../assets/images/warnIcon.svg';
import { connect } from 'react-redux';
import { logSeverities } from '../../config';

class GlobalMessage extends PureComponent {    
    
    renderIcon() {
        let icon;
        switch (this.props.appGlobalMessage.type) {
            case logSeverities.info:
                icon = infoIcon;
                break;
            case logSeverities.success:
                icon = successIcon;
                break;
            case logSeverities.warn:
                icon = warnIcon;
                break;
            case logSeverities.error:
                icon = errorIcon;
                break;        
            default:
                icon = infoIcon;
                break;
        }
        return <img className={classNames.Icon} src={icon}></img>
    }
    renderText(text) {
        return <div className={classNames.Text}>{text}</div>
    }

    renderNotification(notification) {
        return (
            <div className={classNames.Wrapper}>
                {this.renderIcon()}
                {this.renderText(notification.text)}
            </div>
        );
    }

    render() {      
        const {appGlobalMessage} = this.props;
        return appGlobalMessage && appGlobalMessage.text ? this.renderNotification(appGlobalMessage) : null
    }
}

const mapStateToProps = (state) => {
    return {
        appGlobalMessage: state.layout.appGlobalMessage
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispachToProps)(GlobalMessage);