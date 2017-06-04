
import React from 'react';
import Link from 'next/link';

export default class AppFooter extends React.PureComponent {

  render() {
    return <footer>
      <style jsx>{`
        footer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 20px;
          padding-bottom: 30px;
          padding-left: 14px;
          padding-right: 14px;
          border-top: 1px solid #f4f4f4;
        }
        footer ul, footer li {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          list-style: none;
        }
        footer ul {
          display: flex;
          flex-direction: column;
        }
        footer li {
          padding-top: 2px;
          padding-bottom: 2px;
          padding-left: 6px;
          padding-right: 6px;
        }
        footer a {
          color: #666;
          text-decoration: none;
          font-size: 15px;
          font-weight: 400;
        }
        footer span {
          color: #000;
          font-size: 13px;
          font-weight: 500;
        }
        @media (max-width: 680px) {
          footer li.copyright {
            margin-top: 20px;
            order: 10;
          }
        }
        @media (min-width: 680px) {
          footer {
            align-items: center;
            border-top: none;
          }
          footer ul {
            flex-direction: row;
          }
          footer a {
            font-size: 13px;
            font-weight: 400;
          }
        }
      `}</style>
      <nav>
        <ul>
          <li>
            <a href="mailto:hello@vaniila.com" target="_blank">Contact us</a>
          </li>
          <li>
            <Link href="/privacy" as="/privacy"><a>Privacy Policy</a></Link>
          </li>
          <li className="copyright">
            <span><b>©</b> 2017 Vaniila, Inc.</span>
          </li>
          <li>
            <Link href="/tos" as="/tos"><a>Terms of Service</a></Link>
          </li>
          <li>
            <a href="https://twitter.com/vaniilacom" target="_blank">Twitter</a>
          </li>
        </ul>
      </nav>
    </footer>
  }

}

