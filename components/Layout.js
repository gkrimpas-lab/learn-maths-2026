import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import AdSlot from './AdSlot';
import { LAYOUT } from '../shared/layout-config';

const SITE_URL = 'https://learnmaths.gr';

export default function Layout({
  children,
  title,
  description,
  image = "/og-image.png",
  schemaData = null,
  backUrl = null,
  backText,
  actionButton = null,
  hideNav = false,
  customNavContent = null,
  hideFooter = false,
  showAds = false,
  fullWidth = false,
}) {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const asPath = router?.asPath || '/';

  // Προεπιλεγμένοι δίγλωσσοι τίτλοι αν δεν δοθούν από τη σελίδα
  const finalTitle = title || (locale === 'en'
    ? "LearnMaths.gr - Interactive Mathematics"
    : "LearnMaths.gr - Τα Μαθηματικά Αλλιώς");

  const finalDescription = description || (locale === 'en'
    ? "The modern interactive mathematics learning platform for Elementary, Middle School, and Model School entrance exams."
    : "Η σύγχρονη πλατφόρμα εκμάθησης Μαθηματικών για το Δημοτικό, το Γυμνάσιο (Νέα Ύλη 2027-2028) και τα Πρότυπα Σχολεία.");

  const finalBackText = backText || (locale === 'en' ? "Back" : "Πίσω");

  // Καθαρισμός path από ?query, #hash, trailing slash και percent-encoding
  const rawPath = asPath.split('?')[0].split('#')[0];
  let decodedPath = rawPath;
  try {
    decodedPath = decodeURI(rawPath);
  } catch {
    decodedPath = rawPath;
  }
  const cleanPath = decodedPath === '/' ? '' : decodedPath.replace(/\/$/, '');

  // State για το Έξυπνο Banner ανίχνευσης ξένης γλώσσας
  const [showLanguageBanner, setShowLanguageBanner] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }

    if (typeof window !== 'undefined' && locale === 'el') {
      const isDismissed = sessionStorage.getItem('dismissed_lang_banner');
      const browserLang = navigator.language || navigator.userLanguage || '';
      const isNonGreekBrowser = browserLang && !browserLang.toLowerCase().startsWith('el');

      if (isNonGreekBrowser && !isDismissed) {
        setShowLanguageBanner(true);
      }
    }
  }, [locale]);

  const handleDismissBanner = () => {
    setShowLanguageBanner(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dismissed_lang_banner', 'true');
    }
  };

  // Υπολογισμός Canonical & Alternate URLs
  const canonicalUrl = locale === 'en'
    ? `${SITE_URL}/en${cleanPath}`
    : `${SITE_URL}${cleanPath}`;

  const greekUrl = `${SITE_URL}${cleanPath}`;
  const englishUrl = `${SITE_URL}/en${cleanPath}`;

  const ogImageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": `${SITE_URL}/`,
        "name": "LearnMaths.gr",
        "inLanguage": locale
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#organization`,
        "name": "LearnMaths.gr",
        "url": `${SITE_URL}/`,
        "logo": `${SITE_URL}/favicon.svg`,
        "inLanguage": locale,
        "founder": {
          "@type": "Person",
          "name": locale === 'en' ? "Dimitrios Gkrimpas" : "Δημήτρης Γκρίμπας",
          "jobTitle": locale === 'en' ? "Educator - Mathematician & Computer Engineer" : "Εκπαιδευτικός - Μαθηματικός & Μηχανικός Η/Υ",
          "alumniOf": {
            "@type": "EducationalOrganization",
            "name": locale === 'en' ? "University of Patras" : "Πανεπιστήμιο Πατρών",
            "url": "https://www.upatras.gr/"
          }
        }
      },
      ...(schemaData ? (Array.isArray(schemaData) ? schemaData : [schemaData]) : [])
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between scroll-smooth antialiased">
      <Head>
        <title>{finalTitle}</title>
        <meta name="description" content={finalDescription} />
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
        <meta property="og:title" content={finalTitle} />
        <meta property="og:description" content={finalDescription} />
        <meta property="og:site_name" content="LearnMaths.gr" />
        <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'el_GR'} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={finalTitle} />
        <meta name="twitter:description" content={finalDescription} />
        <meta name="twitter:image" content={ogImageUrl} />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />

        {/* Structured Data (Schema.org) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* 🇬🇧 ΕΞΥΠΝΟ BANNER ΠΡΟΤΡΟΠΗΣ ΑΓΓΛΙΚΗΣ ΕΚΔΟΣΗΣ ΓΙΑ ΞΕΝΟΥΣ BROWSERS */}
      {showLanguageBanner && (
        <div className="bg-indigo-900 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-md transition-all sticky top-0 z-[60] border-b border-indigo-750">
          <div className={`${LAYOUT.CONTAINER} flex flex-wrap justify-between items-center gap-2`}>
            <div className="flex items-center gap-2">
              <span className="text-base" aria-hidden="true">🌍</span>
              <span>
                Looking for English? We noticed your browser language isn&apos;t Greek.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={cleanPath || '/'}
                locale="en"
                className="bg-white text-indigo-900 hover:bg-indigo-50 px-3 py-1 rounded-lg font-bold transition shadow-sm text-xs"
              >
                Switch to English ➔
              </Link>
              <button
                onClick={handleDismissBanner}
                className="text-indigo-200 hover:text-white p-1 text-sm font-bold transition"
                aria-label="Dismiss language suggestion"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

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
                        <span aria-hidden="true">🔙</span>
                        <span>{finalBackText}</span>
                      </Link>
                    )}
                  </div>
                )}

                {/* ΕΥΔΙΑΚΡΙΤΟ LANGUAGE SWITCHER BUTTON */}
                <Link
                  href={cleanPath || '/'}
                  locale={locale === 'el' ? 'en' : 'el'}
                  hrefLang={locale === 'el' ? 'en' : 'el'}
                  lang={locale === 'el' ? 'en' : 'el'}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2 shrink-0 hover:scale-105 active:scale-95"
                  title={locale === 'el' ? "Switch to English" : "Αλλαγή σε Ελληνικά"}
                >
                  <span className="text-sm sm:text-base" aria-hidden="true">{locale === 'el' ? '🇬🇧' : '🇬🇷'}</span>
                  <span>{locale === 'el' ? 'English' : 'Ελληνικά'}</span>
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
            <p>© {new Date().getFullYear()} LearnMaths.gr — {locale === 'en' ? 'Curated by: Dimitrios Gkrimpas' : 'Επιμέλεια: Δημήτρης Γκρίμπας'}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
              <Link href="/st-dimotikou" locale={locale} className="hover:text-white transition">
                {locale === 'en' ? 'Grade 6 Math' : "ΣΤ' Δημοτικού"}
              </Link>
              <Link href="/protipa/protipa" locale={locale} className="text-amber-400 hover:text-amber-300 transition">
                {locale === 'en' ? 'Model Schools 2026' : '🎯 Θέματα Προτύπων 2026'}
              </Link>
              <Link href="/epikoinonia" locale={locale} className="hover:text-white transition">
                {locale === 'en' ? '👨‍🏫 About & Contact' : '👨‍🏫 Σχετικά & Επικοινωνία'}
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}