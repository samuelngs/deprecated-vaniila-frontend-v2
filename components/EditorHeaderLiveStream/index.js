
import React from 'react';

import EditorLiveStream from '../EditorLiveStream';

function isLivestreamStarted(livestreamStartedAt) {
  return typeof livestreamStartedAt === 'string' && livestreamStartedAt.indexOf('000') !== 0;
}

function isLivestreamEnded(livestreamEndedAt) {
  return typeof livestreamEndedAt === 'string' && livestreamEndedAt.indexOf('000') !== 0;
}

/**
 * before streaming view
 */
function EditorLiveStreamBegin({ confirmation, onPress }) {
  return <div className="base">
    <style jsx>{`
      .base {
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 0;
        margin-right: 0;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        display: flex;
        flex-direction: row;
      }
      .btn {
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 0;
        margin-right: 0;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 20px;
        padding-right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: none;
        cursor: pointer;
        outline: none;
        font-size: 14px;
        font-weight: 500;
        color: #8aa7b1;
      }
      .btn:hover {
        background-color: rgb(245, 245, 245);
      }
      .btn:active {
        background-color: rgb(239, 239, 239);
      }
      .btn span {
          margin-top: 2px;
          display: none;
      }
      .btn i {
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 0;
        margin-right: 10px;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        background-color: #185be7;
        border-radius: 2px;
        box-shadow: inset rgba(0, 0, 0, 0.09) 0px -1px;
      }
      .btn svg {
        width: 14px;
        height: 14px;
        fill: #fff;
      }
      @media (min-width: 768px) {
        .base span {
          display: block;
        }
      }
    `}</style>
    <button className="btn" onClick={e => onPress(true, e)}>
      <i>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <path d="M77.58 48.29l-44.84-27.5a2 2 0 0 0-3 1.71v55a2 2 0 0 0 2 2 2 2 0 0 0 1-.3l44.84-27.5a2 2 0 0 0 0-3.41z" />
        </svg>
      </i>
      <span>Start Live Moment</span>
    </button>
  </div>;
}

/**
 * streaming component view
 */
function EditorLiveStreamOnair({ confirmation, onPress }) {
  return <div className="base">
    <style jsx>{`
      .base {
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 0;
        margin-right: 0;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        display: flex;
        flex-direction: row;
      }
      .btn {
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 0;
        margin-right: 0;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 20px;
        padding-right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: none;
        cursor: pointer;
        outline: none;
        font-size: 14px;
        font-weight: 500;
        color: #8aa7b1;
      }
      .btn:hover {
        background-color: rgb(245, 245, 245);
      }
      .btn:active {
        background-color: rgb(239, 239, 239);
      }
      .btn span {
          margin-top: 2px;
          display: none;
      }
      .btn i {
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 0;
        margin-right: 10px;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        background-color: #1ec369;
        border-radius: 2px;
        box-shadow: inset rgba(0, 0, 0, 0.09) 0px -1px;
      }
      .btn svg {
        width: 14px;
        height: 14px;
        fill: #fff;
      }
      @media (min-width: 768px) {
        .base span {
          display: block;
        }
      }
    `}</style>
    <button className="btn" onClick={e => onPress(true, e)}>
      <i>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <rect x="56" y="24" width="12" height="52" rx="1.76" ry="1.76"/>
          <rect x="30" y="24" width="12" height="52" rx="1.76" ry="1.76"/>
        </svg>
      </i>
      <span>Stop Live Moment</span>
    </button>
  </div>;
}

/**
 * live stream result component (after streaming view)
 */
function EditorLiveStreamResult() {
  return <div className="base">
    <style jsx>{`
      .base {
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 0;
        margin-right: 0;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 20px;
        padding-right: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 500;
        color: #8aa7b1;
      }
      .base span {
        display: none;
        margin-left: 10px;
        margin-top: 2px;
      }
      @media (min-width: 768px) {
        .base span {
          display: block;
        }
      }
    `}</style>
    <EditorLiveStream active={true} />
    <span>Live Moment</span>
  </div>;
}

/**
 * live stream status component
 */
function EditorLiveStreamStatus({
  livestreamStartedAt,
  livestreamEndedAt,
  livestreamStartConfirmation,
  livestreamEndConfirmation,
  onStartConfirmationPress,
  onEndConfirmationPress
}) {
  if ( isLivestreamStarted(livestreamStartedAt) && isLivestreamEnded(livestreamEndedAt) ) {
    return <EditorLiveStreamResult />
  }
  if ( isLivestreamStarted(livestreamStartedAt) ) {
    return <EditorLiveStreamOnair confirmation={livestreamEndConfirmation} onPress={onEndConfirmationPress} />
  }
  return <EditorLiveStreamBegin confirmation={livestreamStartConfirmation} onPress={onStartConfirmationPress} />
}

/**
 * header livestream component
 */
export default ({
  headerHeight,
  livestreamStartedAt,
  livestreamEndedAt,
  livestreamStartConfirmation,
  livestreamEndConfirmation,
  onStartConfirmationPress,
  onEndConfirmationPress
}) => <div className="header-nav-livestream" style={{ height: headerHeight }}>
  <style jsx>{`
    .header-nav-livestream {
      margin-top: 0;
      margin-bottom: 0;
      margin-left: 0;
      margin-right: 0;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
      display: flex;
      flex-direction: row;
      background-color: transparent;
    }
  `}</style>
  <EditorLiveStreamStatus
    livestreamStartedAt={livestreamStartedAt}
    livestreamEndedAt={livestreamEndedAt}
    livestreamStartConfirmation={livestreamStartConfirmation}
    livestreamEndConfirmation={livestreamEndConfirmation}
    onStartConfirmationPress={onStartConfirmationPress}
    onEndConfirmationPress={onEndConfirmationPress}
  />
</div>

