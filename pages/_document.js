
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
      <Head>
        <style jsx global>{`
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_thinweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_thinweb.woff') format('woff'); font-weight: 200; font-style: normal; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_thinitweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_thinitweb.woff') format('woff'); font-weight: 200; font-style: italic; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_lightweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_lightweb.woff') format('woff'); font-weight: 300; font-style: normal; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_lightitweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_lightitweb.woff') format('woff'); font-weight: 300; font-style: italic; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_regularweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_regularweb.woff') format('woff'); font-weight: 400; font-style: normal; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_regularitweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_regularitweb.woff') format('woff'); font-weight: 400; font-style: italic; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_mediumweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_mediumweb.woff') format('woff'); font-weight: 500; font-style: normal; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_mediumitweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_mediumitweb.woff') format('woff'); font-weight: 500; font-style: italic; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_semiboldweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_semiboldweb.woff') format('woff'); font-weight: 600; font-style: normal; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_semibolditweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_semibolditweb.woff') format('woff'); font-weight: 600; font-style: italic; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_boldweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_boldweb.woff') format('woff'); font-weight: 700; font-style: normal; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_bolditweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_bolditweb.woff') format('woff'); font-weight: 700; font-style: italic; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_extraboldweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_extraboldweb.woff') format('woff'); font-weight: 800; font-style: normal; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_extrabolditweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_extrabolditweb.woff') format('woff'); font-weight: 800; font-style: italic; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_blackweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_blackweb.woff') format('woff'); font-weight: 900; font-style: normal; font-display: fallback; }
          @font-face { font-family: 'Proxima Nova'; src: url('/static/fonts/proxima_nova/proximanovaalt_blackitweb.eot'); src: url('/static/fonts/proxima_nova/proximanovaalt_blackitweb.woff') format('woff'); font-weight: 900; font-style: italic; font-display: fallback; }
          @font-face { font-family: 'Abhaya Libre'; src: url('/static/fonts/abhayalibre/abhayalibre-regular-webfont.eot'); src: url('/static/fonts/abhayalibre/abhayalibre-regular-webfont.woff') format('woff'); font-weight: 400; font-display: fallback; }
          @font-face { font-family: 'Abhaya Libre'; src: url('/static/fonts/abhayalibre/abhayalibre-medium-webfont.eot'); src: url('/static/fonts/abhayalibre/abhayalibre-medium-webfont.woff') format('woff'); font-weight: 500; font-display: fallback; }
          @font-face { font-family: 'Abhaya Libre'; src: url('/static/fonts/abhayalibre/abhayalibre-semibold-webfont.eot'); src: url('/static/fonts/abhayalibre/abhayalibre-semibold-webfont.woff') format('woff'); font-weight: 600; font-display: fallback; }
          @font-face { font-family: 'Abhaya Libre'; src: url('/static/fonts/abhayalibre/abhayalibre-bold-webfont.eot'); src: url('/static/fonts/abhayalibre/abhayalibre-bold-webfont.woff') format('woff'); font-weight: 700; font-display: fallback; }
          @font-face { font-family: 'Ubuntu Mono'; src: url('/static/fonts/ubuntumono/ubuntumono-regular-webfont.eot'); src: url('/static/fonts/ubuntumono/ubuntumono-regular-webfont.woff') format('woff'); font-weight: 400; font-style: normal; font-display: fallback; }
          @font-face { font-family: 'Ubuntu Mono'; src: url('/static/fonts/ubuntumono/ubuntumono-italic-webfont.eot'); src: url('/static/fonts/ubuntumono/ubuntumono-italic-webfont.woff') format('woff'); font-weight: 400; font-style: italic; font-display: fallback; }
          @font-face { font-family: 'Ubuntu Mono'; src: url('/static/fonts/ubuntumono/ubuntumono-bold-webfont.eot'); src: url('/static/fonts/ubuntumono/ubuntumono-bold-webfont.woff') format('woff'); font-weight: 500; font-style: normal; font-display: fallback; }
          @font-face { font-family: 'Ubuntu Mono'; src: url('/static/fonts/ubuntumono/ubuntumono-bolditalic-webfont.eot'); src: url('/static/fonts/ubuntumono/ubuntumono-bolditalic-webfont.woff') format('woff'); font-weight: 500; font-style: italic; font-display: fallback; }
          body { margin: 0; padding: 0; font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; font-weight: 400; color-profile: sRGB; rendering-intent: auto; }
          input, textarea, select, button { font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; }
          blockquote { font-family: 'Abhaya Libre', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", serif; font-weight: 400; color: #60696d; }
          h1, h2, h3, h4, h5, h6, ul, ol, li, div, p, span { margin: 0; padding: 0; }
          .no-select { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
          .placeholder:before { content: attr(data-placeholder); display: block; color: #ccc; font-weight: 300; text-align: center; }
          .code { font-family: 'Ubuntu Mono', 'Proxima Nova', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", serif; font-weight: 400; margin-top: 10px; margin-bottom: 10px; background-color: #dbffef; color: #44b17d; }
          ::selection { background-color: #60ffb4; color: #004f2a; }
        `}</style>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="MobileOptimized" content="320" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="referrer" content="origin-when-cross-origin" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </html>
  }
}
