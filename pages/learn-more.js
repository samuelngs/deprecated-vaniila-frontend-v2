
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

import WindowObserver from '../components/WindowObserver';
import BackToTop from '../components/BackToTop';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

import withRedux from '../storage';

class LearnMore extends React.PureComponent {

  render () {

    return <div>

      <style jsx>{`
        .container {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: auto;
          margin-right: auto;
          padding-top: 80px;
          padding-bottom: 130px;
          padding-left: 0;
          padding-right: 0;
          width: 300px;
          max-width: 100%;
          max-width: calc(100% - 40px);
        }
        .headline {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 22px;
          font-weight: 400;
          line-height: 1.3;
          color: #000;
        }
        h2.headline {
          font-size: 22px;
          font-weight: 400;
          line-height: 1.3;
          color: #000;
        }
        .headline-bold {
          color: #00d68f;
          font-weight: 500;
        }
        .headline span {
          display: block;
        }
        .grid {
          display: flex;
          flex-direction: column;
        }
        .column {
          display: flex;
          flex-direction: column;
          margin-top: 30px;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .column-fill {
          flex: 1;
        }
        .column-center {
          justify-content: center;
        }
        .column-highlight {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          background-image: url('/static/learn/highlight.jpg');
          background-position: center;
          background-size: cover;
          width: 100%;
          height: 312px;
        }
        .column p {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 18px;
          font-weight: 400;
          color: #536168;
        }
        .column p + p {
          margin-top: 20px;
        }
        .layout-center {
          position: relative;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 40px;
          padding-bottom: 40px;
          padding-left: 40px;
          padding-right: 40px;
          background-color: #f4f4f4;
          font-size: 20px;
          font-weight: 400;
          color: #666;
        }
        @media (min-width: 780px) {
          .container {
            width: 700px;
          }
          .headline {
            margin-top: 0;
            font-size: 42px;
          }
          .column-highlight {
            height: 412px;
            margin-top: 40px;
          }
        }
        @media (min-width: 1160px) {
          .container {
            width: 1080px;
          }
          .grid {
            flex-direction: row;
          }
          h2.headline {
            margin-top: 40px;
            font-size: 24px;
          }
          .column {
            margin-top: 0;
          }
          .column-highlight {
            margin-left: 70px;
            height: 612px;
          }
          .column p {
            font-size: 20px;
            line-height: 1.4;
          }
          .column p:first-child {
            margin-top: 40px;
          }
          .column p:last-child {
            margin-bottom: 20px;
          }
          .layout-center {
            padding-top: 100px;
            padding-bottom: 100px;
            padding-left: 100px;
            padding-right: 100px;
            margin-top: -75px;
            margin-bottom: 40px;
            font-size: 26px;
            line-height: 1.4;
          }
        }
      `}</style>

      <Head>

        <title>Vaniila • Capture, highlight, and share your moments for any event</title>

        {/* site info metatags */}
        <meta name="distribution" content="Global" />
        <meta name="description" content="Share all your moments from last night’s party, this week’s tech conference, and next month’s political debate." />
        <meta name="creator" content="vaniila.com" />
        <meta name="publisher" content="vaniila.com" />
        <meta name="rating" content="general" />
        <meta name="robots" content="index, follow" />

        {/* twitter metatags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vaniilacom" />
        <meta name="twitter:creator" content="@vaniilacom" />
        <meta name="twitter:title" content="Vaniila" />
        <meta name="twitter:description" content="Share all your moments from last night’s party, this week’s tech conference, and next month’s political debate." />
        <meta name="twitter:image:alt" content="Share all your moments from last night’s party, this week’s tech conference, and next month’s political debate." />
        <meta name="twitter:image" content="https://cdn-images.vaniila.com/xqLNOwneZ4a3bDY9QDmkGQdpyRK8B7/embed" />
        <meta name="twitter:player" content="https://vaniila.com" />

        {/* google, facebook metatags */}
        <meta name="og:url" content="https://vaniila.com" />
        <meta name="og:image" content="https://cdn-images.vaniila.com/xqLNOwneZ4a3bDY9QDmkGQdpyRK8B7/embed" />
        <meta name="og:image:secure_url" content="https://cdn-images.vaniila.com/xqLNOwneZ4a3bDY9QDmkGQdpyRK8B7/embed" />
        <meta name="og:image:height" content="600" />
        <meta name="og:image:width" content="600" />
        <meta name="og:type" content="website" />
        <meta name="og:title" content="Vaniila" />
        <meta name="og:description" content="Share all your moments from last night’s party, this week’s tech conference, and next month’s political debate." />
        <meta name="og:locale" content="en_US" />
        <meta name="og:site_name" content="vaniila.com" />

      </Head>

      <BackToTop id="learn-more" />
      <WindowObserver />

      <AppHeader />

      <div className="container">

        <div className="grid">
          <div className="column column-fill column-center">
            <h1 className="headline">
              <b className="headline-bold">Highlight</b> all the best parts of last night’s party, this week’s tech conference, or next month’s political debate
            </h1>
          </div>
          <div className="column column-fill">
            <div className="column-highlight" />
          </div>
        </div>

        <div className="layout-center">
          Vaniila is a new take on live blogging, focusing on social engagement, a super-easy slideshow format, and an extremely-focused feed highlighting only the best moments. This social live blogging platform is for anyone who is passionate about sharing events.
        </div>

        <div className="grid">
          <div className="column column-fill">
            <h2 className="headline">
              <span>Share any event.</span>
              <span><b className="headline-bold">Anytime</b>.</span>
            </h2>
          </div>
          <div className="column column-fill">
            <p>Broadcast an event live or simply share it on your own time with Vaniila Moments. These Moments are snapshots of time presented in a large and attractive slideshow style. With stylized text and vivid photos, you can easily highlight all the best parts of last night’s party, this week’s tech conference, or next month’s political debate.</p>
            <p>People can watch your stories live, as they happen, or they can check out all the stories you’ve created and easily browse back and forth through your timestamped Moments. You can even cover online events by taking screen captures, sharing only the most noteworthy highlights.</p>
          </div>
        </div>

        <div className="grid">
          <div className="column column-fill">
            <h2 className="headline">
              <span>Create a feed that</span>
              <span>stands out.</span>
            </h2>
          </div>
          <div className="column column-fill">
            <p>If you’re covering an event live, the last thing you want is for people to miss your posts in their busy social media feeds. With Vaniila, you’re sure to stand out, with its clean and focused layout showcasing only the events you love to share.</p>
            <p>Your stories will never get lost in an overwhelming feed of posts. Instead, they stay as stories should—organized and kept-in-place.</p>
          </div>
        </div>

        <div className="grid">
          <div className="column column-fill">
            <h2 className="headline">
              <span>Engage with your</span>
              <span>audience.</span>
            </h2>
          </div>
          <div className="column column-fill">
            <p>It’s one thing to share an event, but how do you keep people engaged? Vaniila makes this easy. People can comment on each individual Moment, and you can ask and answer questions to keep people engaged.</p>
            <p>Most importantly, you can interact with people who share the same passions as you, and this brings you one step closer to building a community around all the events you want to cover.</p>
          </div>
        </div>

        <div className="grid">
          <div className="column column-fill">
            <h2 className="headline">
              <span>Collaborate with others.</span>
            </h2>
          </div>
          <div className="column column-fill">
            <p>What better way to cover an event than to invite your friends to cover it with you? Within one story, you can invite multiple people to add Moments. While you’re taking awesome photos, your friend could be adding compelling text. This is especially useful when covering live events, so the best moments aren’t missed.</p>
          </div>
        </div>

      </div>

      <AppFooter />

    </div>
  }

}

export default withRedux(LearnMore);

