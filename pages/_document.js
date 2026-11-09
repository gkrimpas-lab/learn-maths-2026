// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    // Το Next.js περνά αυτόματα το locale στο this.props.__NEXT_DATA__.locale
    const locale = this.props.__NEXT_DATA__?.locale || 'el';

    return (
      <Html lang={locale} className="scroll-smooth">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Head>
        <body className="bg-gray-50 text-gray-800 antialiased selection:bg-amber-200 selection:text-amber-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;