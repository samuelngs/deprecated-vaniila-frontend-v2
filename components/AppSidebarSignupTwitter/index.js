
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

export default class AppSidebarSignupTwitter extends React.PureComponent {

  render() {
    return <a className="base" href="/signin">
      <style jsx>{`
        .base {
          margin-top: 12px;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-left: 12px;
          padding-right: 12px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          background-color: #5ab1ff;
          border: none;
          border-radius: 3px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }
        .svg {
          height: 20px;
          width: 20px;
          margin-right: 4px;
        }
      `}</style>
      <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path fill="#fff" fillRule="evenodd" d="M34.4060938 85.5994107c32.5490624-.8109492 50.3240624-27.8905087 50.3240624-51.4219913 0-.7844293-.016875-1.5646713-.0520312-2.3393301 3.5578125-2.5486972 6.6473437-5.7338709 9.0885937-9.3587159C90.5 23.9170285 86.99 24.8884926 83.305625 25.3253722c3.7603125-2.237438 6.64875-5.7799318 8.0085937-10.0021712-3.5198437 2.0713399-7.4179687 3.5759925-11.5664062 4.3869417C76.4234375 16.1969603 71.69 14 66.4517187 14c-10.0603125 0-18.2165624 8.0955335-18.2165624 18.0809553 0 1.4167184.1617187 2.7957507.4724999 4.1189516-15.1396875-.753722-28.5609374-7.9517679-37.5454687-18.8891129-1.56796875 2.6701303-2.4665625 5.7757445-2.4665625 9.0893301 0 6.2712469 3.2160938 11.8055211 8.1042188 15.0479218-2.986875-.0935174-5.7951563-.9072581-8.25187505-2.2611662-.00140625.0753722-.00140625.1521402-.00140625.2275124 0 8.7599255 6.2789063 16.0668424 14.6123438 17.7278225-1.5285938.4131514-3.1373438.6350807-4.7995313.6350807-1.1728125 0-2.3146875-.1144541-3.4270312-.3252171 2.3189062 7.1826923 9.0449999 12.4098945 17.0170312 12.5564516-6.2353125 4.8489454-14.0892187 7.7396092-22.62234375 7.7396092-1.46390625 0-2.908125-.0851427-4.32703125-.2512407v.0097704c7.7779688 4.9452544 16.965 7.8931452 26.8382813 8.092742h2.5678125"/>
      </svg>
      Continue with Twitter
    </a>
  }

}

