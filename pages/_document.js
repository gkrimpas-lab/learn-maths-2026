// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    const locale = this.props.__NEXT_DATA__?.locale || 'el';

    return (
      <Html lang={locale} className="scroll-smooth">
        <Head>
          {/* Mobile browser theme color */}
          <meta name="theme-color" content="#2563eb" />

          {/* Preconnect & DNS-Prefetch για γραμματοσειρές και Analytics */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
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