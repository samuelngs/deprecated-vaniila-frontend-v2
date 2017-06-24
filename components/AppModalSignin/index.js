
import React from 'react';
import PropTypes from 'prop-types';

import If from '../If';
import AppLoginForm from '../AppLoginForm';

export default class AppModalSignin extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  state = {
    credential: false,
  }

  handleTwitterSignin = e => {
    e.preventDefault();

    const { store: { getState } } = this.context;
    const { serverQuery } = getState();
    const { redirect, current = '/' } = serverQuery;

    if (current === '/signin') {
      location.href = `${BACKEND_URL}/i/auth?redirect=/`;
    } else {
      location.href = `${BACKEND_URL}/i/auth?redirect=${redirect || current}`;
    }
  }

  handleSiteSignin = e => {
    e.preventDefault();
    this.setState({ credential: true });
  }

  render() {
    const { credential } = this.state;
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          padding: 0;
          min-height: 400px;
          max-height: 90vh;
          width: 800px;
          max-width: calc(100% - 80px);
        }
        .container {
          max-width: 100%;
        }
        .title {
          font-size: 30px;
          font-weight: 400;
        }
        .option {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 14px;
          padding-bottom: 14px;
          padding-left: 16px;
          padding-right: 16px;
          display: flex;
          flex-direction: row;
          align-items: center;
          background-color: #fff;
          border: none;
          border-radius: 3px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          color: #939ea3;
          width: 500px;
          min-height: 66px;
          max-width: 100%;
          border: 1px solid #e8e8e8;
          outline: none;
        }
        .option + .option {
          margin-top: 10px;
        }
        .option-twitter {
          background-color: #5ab1ff;
          border: none;
          color: #fff;
        }
        .option-twitter:hover {
          background-color: #4caaff;
        }
        .option-twitter:active {
          background-color: #3f96e5;
        }
        .option-vaniila {
          box-shadow: 0 2px 10px -2px rgba(0, 0, 0, .1);
        }
        .option-vaniila:hover {
          background-color: #f7f7f7;
        }
        .option-vaniila:active {
          background-color: #f3f3f3;
        }
        .details {
          display: flex;
          flex-direction: column;
        }
        .details-row {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          text-align: left;
          word-break: break-all;
        }
        .details-title {
          font-size: 14px;
          font-weight: 500;
        }
        .details-description {
          font-size: 12px;
          font-weight: 400;
        }
        .svg {
          height: 20px;
          width: 20px;
          min-height: 20px;
          min-width: 20px;
          margin-right: 8px;
        }
        @media (min-width: 768px) {
          .details-title {
            font-size: 16px;
          }
          .details-description {
            font-size: 13px;
          }
        }
      `}</style>

      <If condition={!credential}>
        <div className="container">
          <button className="option option-twitter" onClick={this.handleTwitterSignin}>
            <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path fill="#fff" fillRule="evenodd" d="M34.4060938 85.5994107c32.5490624-.8109492 50.3240624-27.8905087 50.3240624-51.4219913 0-.7844293-.016875-1.5646713-.0520312-2.3393301 3.5578125-2.5486972 6.6473437-5.7338709 9.0885937-9.3587159C90.5 23.9170285 86.99 24.8884926 83.305625 25.3253722c3.7603125-2.237438 6.64875-5.7799318 8.0085937-10.0021712-3.5198437 2.0713399-7.4179687 3.5759925-11.5664062 4.3869417C76.4234375 16.1969603 71.69 14 66.4517187 14c-10.0603125 0-18.2165624 8.0955335-18.2165624 18.0809553 0 1.4167184.1617187 2.7957507.4724999 4.1189516-15.1396875-.753722-28.5609374-7.9517679-37.5454687-18.8891129-1.56796875 2.6701303-2.4665625 5.7757445-2.4665625 9.0893301 0 6.2712469 3.2160938 11.8055211 8.1042188 15.0479218-2.986875-.0935174-5.7951563-.9072581-8.25187505-2.2611662-.00140625.0753722-.00140625.1521402-.00140625.2275124 0 8.7599255 6.2789063 16.0668424 14.6123438 17.7278225-1.5285938.4131514-3.1373438.6350807-4.7995313.6350807-1.1728125 0-2.3146875-.1144541-3.4270312-.3252171 2.3189062 7.1826923 9.0449999 12.4098945 17.0170312 12.5564516-6.2353125 4.8489454-14.0892187 7.7396092-22.62234375 7.7396092-1.46390625 0-2.908125-.0851427-4.32703125-.2512407v.0097704c7.7779688 4.9452544 16.965 7.8931452 26.8382813 8.092742h2.5678125"/>
            </svg>
            <div className="details">
              <div className="details-row">
                <span className="details-title">Continue with Twitter</span>
              </div>
              <div className="details-row">
                <span className="details-description">We’ll never post to Twitter without your permission.</span>
              </div>
            </div>
          </button>
          <button className="option option-vaniila" onClick={this.handleSiteSignin}>
            <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
              <path fill="#00d68f" d="M15.8 39.63c-.39 0-.78 0-.976-.195-1.172-.586-1.953-1.758-1.563-3.125l2.93-11.525h-3.32c-.97 0-1.95-.586-2.34-1.367-.39-.78-.39-1.953 0-2.734L21.86 1.737c.193-.195.193-.39.39-.586.78-.78 1.95-.97 2.93-.58 1.17.588 1.95 1.76 1.56 3.127L23.81 15.61h3.32c.977 0 1.954.585 2.344 1.366.39.782.39 1.954 0 2.735l-11.33 18.56c-.194.196-.194.39-.39.587-.585.39-1.366.585-1.952.78z"/>
            </svg>
            <div className="details">
              <div className="details-row">
                <span className="details-title">Sign in with your username or email</span>
              </div>
            </div>
          </button>
        </div>
      </If>

      <If condition={credential}>
        <div className="container">
          <AppLoginForm />
        </div>
      </If>

    </div>
  }

}

