import Head from 'next/head';
import Link from 'next/link';
import AdSlot from './AdSlot';

export default function Layout({
  children,
  title = "LearnMaths.gr - Τα Μαθηματικά Αλλιώς",
  description = "Η σύγχρονη πλατφόρμα εκμάθησης Μαθηματικών για το Δημοτικό, το Γυμνάσιο και τα Πρότυπα Σχολεία.",
  // Props για Overload του Navbar
  backUrl = null,
  backText = "Πίσω",
  actionButton = null,
  hideNav = false,
  customNavContent = null, // Για προσαρμοσμένα links όπως της αρχικής σελίδας
  // Props για Overload του Footer & Ads
  hideFooter = false,
  showAds = true,
  fullWidth = false,
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between scroll-smooth antialiased">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* Απαραίτητο για άψογο scaling σε κινητά και τάμπλετ */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        {/* SVG Favicon (μοντέρνο, υψηλής ανάλυσης για όλες τις οθόνες) */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="flex-1 flex flex-col">
        {/* 1. KΕΝΤΡΙΚΟ STICKY NAVBAR */}
        {!hideNav && (
          <nav className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50 transition-all border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-2xl font-black text-blue-600 tracking-tight shrink-0">
                <Link href="/">
                  <span className="cursor-pointer">LearnMaths<span className="text-indigo-600">.gr</span></span>
                </Link>
              </div>

              {/* Είτε ειδικό navigation (π.χ. στην αρχική) είτε standard back/action buttons */}
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
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0"
                    >
                      <span>🔙</span>
                      <span>{backText}</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </nav>
        )}

        {/* 2. ΕΠΑΝΩ ΔΙΑΚΡΙΤΙΚΟΣ ΧΩΡΟΣ ΔΙΑΦΗΜΙΣΗΣ */}
        {showAds && (
          <div className="max-w-7xl mx-auto w-full px-4 pt-2">
            <AdSlot slotId="top-horizontal-banner" format="horizontal" />
          </div>
        )}

        {/* 3. ΚΥΡΙΟ ΠΕΡΙΕΧΟΜΕΝΟ */}
        <main className={`w-full flex-1 ${fullWidth ? 'max-w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
          {children}
        </main>

        {/* 4. ΚΑΤΩ ΔΙΑΚΡΙΤΙΚΟΣ ΧΩΡΟΣ ΔΙΑΦΗΜΙΣΗΣ */}
        {showAds && (
          <div className="max-w-7xl mx-auto w-full px-4 py-4">
            <AdSlot slotId="bottom-horizontal-banner" format="horizontal" />
          </div>
        )}
      </div>

      {/* 5. ΚΕΝΤΡΙΚΟ FOOTER */}
      {!hideFooter && (
        <footer className="bg-gray-800 text-gray-400 py-8 text-center text-xs sm:text-sm border-t border-gray-700 w-full">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} LearnMaths.gr. Με ❤️ για τους μαθητές μας.</p>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <Link href="/epikoinonia" className="hover:text-white transition">✉️ Επικοινωνία</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
