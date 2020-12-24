import React, { PureComponent } from 'react';
import classNames from './LoaderAlt.module.css';

export default class Loader extends PureComponent {

  renderOverlay() {
    return this.props.withOverlay ? <div className={classNames.Overlay}></div> : null;
  }
  render() {
    return (
      <>
        {this.renderOverlay()}
        <div className={classNames.loader} data-message={this.props.loadingMessage}>
          <div className={classNames.bg}></div>
          <div className={classNames.circle}></div>
          <div className={classNames.circle}></div>
          <div className={classNames.circle}></div>
          <div className={classNames.circle}></div>
          <div className={classNames.circle}></div>
        </div>
      </>
    );
  }
}