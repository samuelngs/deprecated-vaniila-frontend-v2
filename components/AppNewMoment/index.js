
import 'isomorphic-fetch';

import React from 'react';
import Router from 'next/router';

import AppNewLiveMoment from '../AppNewLiveMoment';
import AppNewOfflineMoment from '../AppNewOfflineMoment';

export default class AppNewMoment extends React.PureComponent {

  handleCreateAction = (e, live = false) => {

    e.preventDefault && e.preventDefault();

    const body = new FormData();
    body.append('live', live);

    fetch(`${BACKEND_URL}/i/moment`, {
      method      : 'post',
      credentials : 'include',
      body,
    }).then(res => {
      return res.json()
    }).then(res => {
      const { id, author: { username } } = res;
      return Router.replace({
        pathname: '/edit-moment',
        query: { username, id }
      }, `/${username}/${id}/edit`)
    });
  }

  handleCreateLiveMoment = e => {
    this.handleCreateAction(e, true);
  }

  handleCreateMoment = e => {
    this.handleCreateAction(e, false);
  }

  render() {
    return <div className="base">
      <style jsx>{`
        .base {
          margin: 0;
          padding: 0;
          flex: 1;
          flex-direction: column;
          display: flex;
        }
        .title {
          font-size: 40px;
          font-weight: 200;
          width: 100%;
          display: none;
          text-align: center;
        }
        .options {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
        }
        .option {
          margin: 0;
          padding: 0;
          flex: 1;
          flex-direction: column;
          display: flex;
          align-items: inherit;
          height: 450px;
          background-color: transparent;
          border-radius: 3px;
          border: none;
          cursor: pointer;
          outline: none;
        }
        .option:hover {
          background-color: #f5feff;
        }
        .option-container {
          flex: 1;
          flex-direction: column;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .option-name {
          margin-top: 0;
          margin-bottom: 14px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 15px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #1977f3;
        }
        .option-description {
          margin-top: 0;
          margin-bottom: 34px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-right: 40px;
          padding-left: 40px;
          line-height: 1.3;
          font-size: 15px;
          font-weight: 400;
          color: #87989e;
        }
        .option-fake-button {
          margin-top: 0;
          margin-bottom: 54px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 12px;
          padding-bottom: 12px;
          padding-right: 20px;
          padding-left: 20px;
          background-color: #1977f3;
          border-radius: 20px;
          font-size: 15px;
          font-weight: 400;
          color: #fff;
        }
        .option-fake-button:hover,
        .option-fake-button:active {
          background-color: #185be7;
        }
        @media (min-width: 768px) {
          .options {
            flex-direction: row;
          }
          .title {
            display: block;
          }
        }
      `}</style>
      <h4 className="title">Choose a moment type</h4>
      <div className="options">
        <button className="option" onClick={this.handleCreateLiveMoment}>
          <div className="option-container">
            <AppNewLiveMoment style={{ width: '100%', maxWidth: 300 }} />
            <h6 className="option-name">Share Live Event</h6>
            <p className="option-description">Capture live moments at any event.</p>
            <div className="option-fake-button">Create Live Moment</div>
          </div>
        </button>
        <button className="option" onClick={this.handleCreateMoment}>
          <div className="option-container">
            <AppNewOfflineMoment style={{ width: '100%', maxWidth: 300 }} />
            <h6 className="option-name">Moment</h6>
            <p className="option-description">Post something cool you want to share to the world.</p>
            <div className="option-fake-button">Create Moment</div>
          </div>
        </button>
      </div>
    </div>
  }

}
