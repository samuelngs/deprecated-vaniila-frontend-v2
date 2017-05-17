
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
          align-items: center;
          margin-top: 20px;
          margin-bottom: 30px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
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
          flex-direction: row;
        }
        footer li {
          padding-left: 6px;
          padding-right: 6px;
        }
        footer a {
          color: #666;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }
        footer span {
          color: #000;
          font-size: 13px;
          font-weight: 600;
        }
      `}</style>
      <nav>
        <ul>
          <li>
            <a href="mail:hello@vaniila.com" target="_blank">Contact us</a>
          </li>
          <li>
            <Link href="/privacy" as="/privacy"><a>Privacy Policy</a></Link>
          </li>
          <li>
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

