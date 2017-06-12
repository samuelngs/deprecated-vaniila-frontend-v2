
import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';

export default class _Document extends Document {

  static getInitialProps ({ renderPage }) {
    const { html, head } = renderPage();
    const styles = flush();
    return { html, head, styles };
  }

  render () {
    return <html>
      <style jsx global>{`
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-extralight-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-extralight-webfont.woff') format('woff'); font-weight: 200; font-style: normal; font-display: fallback; }
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-extralightitalic-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-extralightitalic-webfont.woff') format('woff'); font-weight: 200; font-style: italic; font-display: fallback; }
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-light-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-light-webfont.woff') format('woff'); font-weight: 300; font-style: normal; font-display: fallback; }
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-lightitalic-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-lightitalic-webfont.woff') format('woff'); font-weight: 300; font-style: italic; font-display: fallback; }
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-regular-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-regular-webfont.woff') format('woff'); font-weight: 400; font-style: normal; font-display: fallback; }
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-italic-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-italic-webfont.woff') format('woff'); font-weight: 400; font-style: italic; font-display: fallback; }
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-medium-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-medium-webfont.woff') format('woff'); font-weight: 500; font-style: normal; font-display: fallback; }
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-mediumitalic-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-mediumitalic-webfont.woff') format('woff'); font-weight: 500; font-style: italic; font-display: fallback; }
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-bold-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-bold-webfont.woff') format('woff'); font-weight: 700; font-style: normal; font-display: fallback; }
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-bolditalic-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-bolditalic-webfont.woff') format('woff'); font-weight: 700; font-style: italic; font-display: fallback; }
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-extrabold-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-extrabold-webfont.woff') format('woff'); font-weight: 800; font-style: normal; font-display: fallback; }
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-extrabolditalic-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-extrabolditalic-webfont.woff') format('woff'); font-weight: 800; font-style: italic; font-display: fallback; }
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-black-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-black-webfont.woff') format('woff'); font-weight: 900; font-style: normal; font-display: fallback; }
        @font-face { font-family: 'TT Norms'; src: url('/static/fonts/ttnorms/tt-norms-blackitalic-webfont.woff2') format('woff2'); src: url('/static/fonts/ttnorms/tt-norms-blackitalic-webfont.woff2') format('woff'); font-weight: 900; font-style: italic; font-display: fallback; }
        @font-face { font-family: 'Abhaya Libre'; src: url('/static/fonts/abhayalibre/abhayalibre-regular-webfont.eot'); src: url('/static/fonts/abhayalibre/abhayalibre-regular-webfont.woff') format('woff'); font-weight: 400; font-display: fallback; }
        @font-face { font-family: 'Abhaya Libre'; src: url('/static/fonts/abhayalibre/abhayalibre-medium-webfont.eot'); src: url('/static/fonts/abhayalibre/abhayalibre-medium-webfont.woff') format('woff'); font-weight: 500; font-display: fallback; }
        @font-face { font-family: 'Abhaya Libre'; src: url('/static/fonts/abhayalibre/abhayalibre-semibold-webfont.eot'); src: url('/static/fonts/abhayalibre/abhayalibre-semibold-webfont.woff') format('woff'); font-weight: 600; font-display: fallback; }
        @font-face { font-family: 'Abhaya Libre'; src: url('/static/fonts/abhayalibre/abhayalibre-bold-webfont.eot'); src: url('/static/fonts/abhayalibre/abhayalibre-bold-webfont.woff') format('woff'); font-weight: 700; font-display: fallback; }
        @font-face { font-family: 'Ubuntu Mono'; src: url('/static/fonts/ubuntumono/ubuntumono-regular-webfont.eot'); src: url('/static/fonts/ubuntumono/ubuntumono-regular-webfont.woff') format('woff'); font-weight: 400; font-style: normal; font-display: fallback; }
        @font-face { font-family: 'Ubuntu Mono'; src: url('/static/fonts/ubuntumono/ubuntumono-italic-webfont.eot'); src: url('/static/fonts/ubuntumono/ubuntumono-italic-webfont.woff') format('woff'); font-weight: 400; font-style: italic; font-display: fallback; }
        @font-face { font-family: 'Ubuntu Mono'; src: url('/static/fonts/ubuntumono/ubuntumono-bold-webfont.eot'); src: url('/static/fonts/ubuntumono/ubuntumono-bold-webfont.woff') format('woff'); font-weight: 500; font-style: normal; font-display: fallback; }
        @font-face { font-family: 'Ubuntu Mono'; src: url('/static/fonts/ubuntumono/ubuntumono-bolditalic-webfont.eot'); src: url('/static/fonts/ubuntumono/ubuntumono-bolditalic-webfont.woff') format('woff'); font-weight: 500; font-style: italic; font-display: fallback; }
        body { margin: 0; padding: 0; font-family: 'TT Norms', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; font-weight: 400; color-profile: sRGB; rendering-intent: auto; background-color: #fff; }
        input, textarea, select, button { font-family: 'TT Norms', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; }
        blockquote { font-family: 'Abhaya Libre', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", serif; font-weight: 400; color: #60696d; }
        h1, h2, h3, h4, h5, h6, ul, ol, li, div, p, span { margin: 0; padding: 0; }
        .no-select { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
        .placeholder:before { content: attr(data-placeholder); display: block; color: #ccc; font-weight: 300; text-align: center; }
        .code { font-family: 'Ubuntu Mono', 'TT Norms', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", serif; font-weight: 400; margin-top: 10px; margin-bottom: 10px; background-color: #dbffef; color: #44b17d; }
        ::selection { background-color: #60ffb4; color: #004f2a; }
      `}</style>

      {/* inject head prefix to document */}
      <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# business: http://ogp.me/ns/business#" />

      <Head>

        {/* viewport metatags */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="MobileOptimized" content="320" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        {/* app metatags */}
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="google" value="notranslate" />
        <meta name="google-site-verification" content="tf8YxPbyH9QpkRZc28QISiHPk-EFDR4PJlT7aNKKs_Y" />
        <meta name="fb:app_id" content="1058096164319914" />

        <script src="//platform.twitter.com/widgets.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </html>
  }
}
