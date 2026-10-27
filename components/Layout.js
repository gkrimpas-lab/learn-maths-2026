import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdSlot from './AdSlot';
import Script from 'next/script';
import { LAYOUT } from '../shared/layout-config';

const GA_MEASUREMENT_ID = 'G-LNBTZ4JKCB';
const SITE_URL = 'https://learnmaths.gr';

export default function Layout({
  children,
  title = "LearnMaths.gr - Τα Μαθηματικά Αλλιώς",
  description = "Η σύγχρονη πλατφόρμα εκμάθησης Μαθηματικών για το Δημοτικό, το Γυμνάσιο (Νέα Ύλη 2027-2028) και τα Πρότυπα Σχολεία.",
  schemaData = null,
  backUrl = null,
  backText = "Πίσω",
  actionButton = null,
  hideNav = false,
  customNavContent = null,
  hideFooter = false,
  showAds = true,
  fullWidth = false,
}) {
  const router = useRouter();
  const { locale, asPath } = router;
  const currentPath = asPath.split('?')[0];

  // Υπολογισμός Canonical & Alternate URLs
  const cleanPath = currentPath === '/' ? '' : currentPath;
  const canonicalUrl = locale === 'en' 
    ? `${SITE_URL}/en${cleanPath}` 
    : `${SITE_URL}${cleanPath}`;
  
  const greekUrl = `${SITE_URL}${cleanPath}`;
  const englishUrl = `${SITE_URL}/en${cleanPath}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": `${SITE_URL}/`,
        "name": "LearnMaths.gr",
        "inLanguage": locale === 'en' ? 'en' : 'el'
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#organization`,
        "name": "LearnMaths.gr",
        "url": `${SITE_URL}/`,
        "logo": `${SITE_URL}/favicon.svg`,
        "founder": {
          "@type": "Person",
          "name": "Δημήτρης Γκρίμπας",
          "jobTitle": locale === 'en' ? "Educator - Mathematician & Computer Engineer" : "Εκπαιδευτικός - Μαθηματικός & Μηχανικός Η/Υ",
          "alumniOf": "Πανεπιστήμιο Πατρών"
        }
      },
      ...(schemaData ? (Array.isArray(schemaData) ? schemaData : [schemaData]) : [])
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between scroll-smooth antialiased">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />

        {/* Dynamic Canonical & Hreflang SEO Tags */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" href={greekUrl} hrefLang="el" />
        <link rel="alternate" href={englishUrl} hrefLang="en" />
        <link rel="alternate" href={greekUrl} hrefLang="x-default" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="LearnMaths.gr" />
        <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'el_GR'} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />

        {/* Structured Data (Schema.org) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* Google Analytics (GA4) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      <div className="flex-1 flex flex-col">
        {!hideNav && (
          <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all border-b border-gray-100 w-full">
            <div className={`${LAYOUT.CONTAINER} py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3`}>
              <div className="text-2xl font-black text-blue-600 tracking-tight shrink-0">
                <Link href="/" locale={locale}>
                  <span className="cursor-pointer">LearnMaths<span className="text-indigo-600">.gr</span></span>
                </Link>
              </div>

              <div className="flex items-center gap-3 sm:gap-6">
                {customNavContent ? (
                  <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-6 font-medium text-sm sm:text-base">
                    {customNavContent}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-3">
                    {actionButton}
                    {backUrl && (
                      <Link
                        href={backUrl}
                        locale={locale}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0"
                      >
                        <span>🔙</span>
                        <span>{backText}</span>
                      </Link>
                    )}
                  </div>
                )}

                {/* Language Switcher Button */}
                <Link
                  href={currentPath}
                  locale={locale === 'el' ? 'en' : 'el'}
                  className="bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                  title={locale === 'el' ? "Switch to English" : "Αλλαγή σε Ελληνικά"}
                >
                  <span>{locale === 'el' ? '🇬🇧' : '🇬🇷'}</span>
                  <span>{locale === 'el' ? 'EN' : 'ΕΛ'}</span>
                </Link>
              </div>
            </div>
          </nav>
        )}

        {showAds && (
          <div className={`${LAYOUT.CONTAINER} pt-2`}>
            <AdSlot slotId="top-horizontal-banner" format="horizontal" />
          </div>
        )}

        <main className={`w-full flex-1 ${fullWidth ? 'max-w-full' : LAYOUT.LESSON_CONTAINER}`}>
          {children}
        </main>

        {showAds && (
          <div className={`${LAYOUT.CONTAINER} py-4`}>
            <AdSlot slotId="bottom-horizontal-banner" format="horizontal" />
          </div>
        )}
      </div>

      {!hideFooter && (
        <footer className="bg-gray-800 text-gray-400 py-6 text-center text-xs sm:text-sm border-t border-gray-700 w-full mt-12">
          <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-4`}>
            <p>© {new Date().getFullYear()} LearnMaths.gr — {locale === 'en' ? 'Curated by' : 'Επιμέλεια'}: Δημήτρης Γκρίμπας</p>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <Link href="/epikoinonia" locale={locale} className="hover:text-white transition">
                {locale === 'en' ? '👨‍🏫 About the Creator' : '👨‍🏫 Σχετικά με τον Δημιουργό'}
              </Link>
              <Link href="/epikoinonia" locale={locale} className="hover:text-white transition">
                {locale === 'en' ? '✉️ Contact' : '✉️ Επικοινωνία'}
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}