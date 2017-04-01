
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
          body { margin: 0; padding: 0; font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; font-weight: 400; }
          h1, h2, h3, h4, h5, h6, ul, ol, li, div, p, span { margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 12px; background-color: transparent; }
          ::-webkit-scrollbar-track { background-color: transparent; margin: 2px; }
          ::-webkit-scrollbar-thumb { background-color: #dcdcdc; border: 4px solid rgba(0, 0, 0, 0); background-clip: padding-box; }
          ::-webkit-scrollbar-button { display: none; }
          ::-webkit-scrollbar-corner { display: none; }
        `}</style>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="MobileOptimized" content="320" />
        <meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="referrer" content="origin-when-cross-origin" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </html>
  }
}
