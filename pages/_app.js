import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/next';

const GA_MEASUREMENT_ID = 'G-LNBTZ4JKCB';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: url,
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* 1. Φόρτωση Google Tag (gtag.js) σε global επίπεδο */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      <Component {...pageProps} />
      <Analytics />
    </>
  );
}