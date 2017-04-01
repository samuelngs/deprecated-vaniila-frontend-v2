
import React from 'react';

export default ({ onSignInClick }) => <section className="section">
  <style jsx>{`
    .section {
      margin-top: 0;
      margin-bottom: 0;
      margin-left: auto;
      margin-right: auto;
      padding-top: 40px;
      padding-bottom: 0px;
      padding-left: 0;
      padding-right: 0;
      width: 1195px;
      max-width: calc(100% - 40px);
      min-height: 600px;
      max-height: initial;
      display: flex;
      flex-direction: column;
    }
    .cell {
      display: flex;
      order: 2;
      flex: 1;
      flex-direction: column;
      justify-content: center;
    }
    .cell-right {
      align-items: center;
    }
    .cell-image {
      order: 1;
      margin-bottom: 50px;
    }
    h1 {
      margin-top: 0;
      margin-bottom: 0;
      margin-left: 0;
      margin-right: 0;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 0;
      padding-right: 0;
      font-size: 22px;
      font-weight: 300;
      text-align: center;
      color: #000;
      line-height: 1.1;
    }
    p {
      margin-top: 0;
      margin-bottom: 0;
      margin-left: auto;
      margin-right: auto;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 0;
      padding-right: 0;
      max-width: 400px;
      color: #4e5b68;
      font-size: 18px;
      font-weight: 300;
      text-align: center;
      line-height: 1.4;
    }
    button {
      outline: none;
      margin-top: 34px;
      margin-bottom: 0;
      margin-left: auto;
      margin-right: auto;
      padding-top: 15px;
      padding-bottom: 15px;
      padding-left: 15px;
      padding-right: 15px;
      width: 250px;
      max-width: calc(100% - 40px);
      position: relative;
      display: flex;
      align-items: center;
      background-color: #288feb;
      background-image: linear-gradient(180deg, #2abdf5 0%, #009efd 100%);
      border-radius: 3px;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(15, 113, 204);
      box-shadow: rgba(255, 255, 255, 0.270588) 0px 1px 0px 0px inset;
    }
    button > div {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      text-align: left;
      letter-spacing: 2px;
      color: #fff;
    }
    button > div > span {
      display: flex;
      align-items: center;
    }
    img {
      max-width: 500px;
    }
    @media (min-width: 600px) {
      font-size: 30px;
    }
    @media (min-width: 900px) {
      .section {
        padding-top: 100px;
        height: calc(100vh - 200px);
        max-height: 900px;
        flex-direction: row;
      }
      .cell {
        order: 1;
      }
      .cell-right {
        align-items: flex-end;
      }
      .cell-image {
        order: 2;
        margin-bottom: 0;
      }
      h1 {
        text-align: initial;
        font-size: 40px;
      }
      p {
        margin-left: 0;
        margin-right: 0;
        max-width: initial;
        text-align: initial;
        font-size: 26px;
      }
      button {
        margin-left: 0;
        margin-right: 0;
      }
      img {
        max-width: calc(100% - 60px);
      }
    }
  `}</style>
  <div className="cell">
    <h1>Connect to the world through remarkable stories</h1>
    <p>Vaniila, a community-driven story platform to connect people and ideas together.</p>
    <button onClick={onSignInClick}>
      <div>
        <span>Sign up with Twitter</span>
      </div>
    </button>
  </div>
  <div className="cell cell-right cell-image">
    <img src="/static/landing/hero.svg" />
  </div>
</section>

