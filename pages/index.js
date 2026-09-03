import Link from 'next/link';
import Layout from '../components/Layout';
import { LAYOUT } from '../shared/layout-config';

export default function Home() {
  // Custom Navigation Links για την αρχική σελίδα
  const navLinks = (
    <>
      <a href="#demotiko" className="hover:text-blue-600 transition">Δημοτικό</a>
      <a href="#gymnasio" className="hover:text-indigo-600 transition">Γυμνάσιο</a>
      <Link 
        href="/protipa/protipa" 
        className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition duration-300"
      >
        🎯 Πρότυπα
      </Link>
      <Link href="/epikoinonia" className="text-gray-600 hover:text-blue-600 font-semibold transition border-l pl-3 sm:pl-4 border-gray-200">
        ✉️ Επικοινωνία
      </Link>
    </>
  );

  return (
    <Layout
      title="LearnMaths.gr - Τα Μαθηματικά Αλλιώς"
      description="Η σύγχρονη πλατφόρμα εκμάθησης Μαθηματικών για το Δημοτικό, το Γυμνάσιο και τα Πρότυπα Σχολεία."
      customNavContent={navLinks}
      fullWidth={true}
      showAds={true}
    >
      {/* COMPACT & MOBILE-FRIENDLY HERO SECTION */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-7 sm:py-9 md:py-10 text-center shadow-md -mt-2">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              LearnMaths<span className="text-amber-300">.gr</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-normal opacity-90 mt-2 max-w-xl mx-auto leading-relaxed">
              Μάθε τα Μαθηματικά εύκολα, γρήγορα και διαδραστικά από το Δημοτικό έως το Γυμνάσιο!
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 pt-1">
            <a 
              href="#demotiko" 
              className="bg-white text-blue-700 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold shadow-sm hover:bg-gray-100 transition text-xs sm:text-sm active:scale-95"
            >
              Δημοτικό 🎒
            </a>
            <a 
              href="#gymnasio" 
              className="bg-indigo-500 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold shadow-sm hover:bg-indigo-600 transition border border-indigo-400 text-xs sm:text-sm active:scale-95"
            >
              Γυμνάσιο 📐
            </a>
          </div>

          {/* APP BADGE */}
          <div className="flex flex-col items-center justify-center pt-2">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-200 mb-1">
              Κατεβάστε την εφαρμογή
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=com.gkrimpas.learn_maths&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transform hover:scale-105 transition duration-200"
            >
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/el_badge_web_generic.png"
                alt="Get it on Google Play"
                className="w-32 sm:w-36 h-auto mx-auto"
              />
            </a>
          </div>
        </div>
      </header>

      {/* ΠΡΟΤΥΠΑ SECTION - CALLOUT HUB BANNER */}
      <section id="protypa" className="py-8 sm:py-10 bg-amber-50/80 border-b border-amber-200">
        <div className={`${LAYOUT.CONTAINER} px-4 sm:px-6`}>
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-7 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 font-black px-3 py-0.5 rounded-full text-[11px] uppercase tracking-wider border border-amber-300">
                <span>🎯 Ειδικη Προετοιμασια</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                Εισαγωγή στα Πρότυπα Σχολεία
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                Προετοιμάσου για τις εξετάσεις με <strong>επίσημα θέματα προηγούμενων ετών</strong>, <strong>τεστ προσομοίωσης</strong> και <strong>δωρεάν λήψη όλων των θεμάτων σε PDF</strong>!
              </p>
            </div>

            <Link
              href="/protipa/protipa"
              className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-md transition transform hover:scale-105 active:scale-95 text-xs sm:text-sm md:text-base text-center whitespace-nowrap flex items-center justify-center gap-2 shrink-0"
            >
              <span>🚀 Είσοδος στα Πρότυπα</span>
              <span>➔</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ΔΗΜΟΤΙΚΟ SECTION */}
      <section id="demotiko" className="py-10 md:py-14 bg-white">
        <div className={`${LAYOUT.CONTAINER} px-4 sm:px-6`}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-center mb-1 text-blue-600">
            🎒 Μαθηματικά Δημοτικού
          </h2>
          <p className="text-center text-gray-500 mb-8 text-xs sm:text-sm">Χτίζουμε γερές βάσεις για το μέλλον</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Δ' ΔΗΜΟΤΙΚΟΥ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col justify-between">
              <div className="bg-teal-500 py-3 text-center text-white font-black text-base sm:text-lg">Δ' Δημοτικού ⭐</div>
              <div className="p-5 text-center flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-gray-800 font-bold mb-1.5 text-sm sm:text-base">Διαδραστικές Ενότητες</p>
                  <p className="text-gray-500 mb-5 text-xs">Μεγάλοι Αριθμοί, Διαίρεση, Κλάσματα, Μήκος, Βάρος κ.α.</p>
                </div>
                <Link href="/d-dimotikou" className="block w-full text-center bg-teal-500 text-white py-2 rounded-xl font-black hover:bg-teal-600 transition shadow-sm text-xs sm:text-sm">
                  🚀 Είσοδος στην Τάξη
                </Link>
              </div>
            </div>

            {/* Ε' ΔΗΜΟΤΙΚΟΥ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-cyan-400 transform md:scale-105 duration-300 flex flex-col justify-between">
              <div className="bg-cyan-500 py-3 text-center text-white font-black text-base sm:text-lg">Ε' Δημοτικού ⭐</div>
              <div className="p-5 text-center flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-gray-800 font-bold mb-1.5 text-sm sm:text-base">Διαδραστικές Ενότητες</p>
                  <p className="text-gray-500 mb-5 text-xs">Κλάσματα, Απλοποίηση, ΕΚΠ, ΜΚΔ, Ποσοστά, Μέση Τιμή κ.α. με προσομοιωτές!</p>
                </div>
                <Link href="/e-dimotikou" className="block w-full text-center bg-cyan-500 text-white py-2 rounded-xl font-black hover:bg-cyan-600 transition shadow-sm text-xs sm:text-sm">
                  🚀 Είσοδος στην Τάξη
                </Link>
              </div>
            </div>

            {/* ΣΤ' ΔΗΜΟΤΙΚΟΥ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col justify-between">
              <div className="bg-blue-500 py-3 text-center text-white font-black text-base sm:text-lg">ΣΤ' Δημοτικού</div>
              <div className="p-5 text-center flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-gray-800 font-bold mb-1.5 text-sm sm:text-base">Διαδραστικές Ενότητες</p>
                  <p className="text-gray-600 mb-5 text-xs">Ανάλογα ποσά, εξισώσεις, κλίμακες & προετοιμασία για το Γυμνάσιο.</p>
                </div>
                <Link href="/st-dimotikou" className="block w-full text-center bg-blue-600 text-white py-2 rounded-xl font-black hover:bg-blue-700 transition shadow-sm text-xs sm:text-sm">
                  🚀 Είσοδος στην Τάξη
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ΓΥΜΝΑΣΙΟ SECTION */}
      <section id="gymnasio" className="py-10 md:py-14 bg-gray-100">
        <div className={`${LAYOUT.CONTAINER} px-4 sm:px-6`}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-center mb-1 text-indigo-600">
            📐 Μαθηματικά Γυμνασίου
          </h2>
          <p className="text-center text-gray-500 mb-8 text-xs sm:text-sm">Εμβαθύνουμε στην άλγεβρα και τη γεωμετρία</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Α' ΓΥΜΝΑΣΙΟΥ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col justify-between">
              <div className="bg-indigo-500 py-3 text-center text-white font-black text-base sm:text-lg">Α' Γυμνασίου</div>
              <div className="p-5 text-center flex-1 flex flex-col justify-between">
                <p className="text-gray-600 mb-5 text-xs">Κλάσματα, Εξισώσεις, Ποσοστά & βασική Γεωμετρία.</p>
                <button className="w-full bg-indigo-400 text-white py-2 rounded-xl font-bold opacity-60 cursor-not-allowed text-xs">
                  Σύντομα Διαθέσιμο
                </button>
              </div>
            </div>

            {/* Β' ΓΥΜΝΑΣΙΟΥ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-indigo-400 transform md:scale-105 duration-300 flex flex-col justify-between">
              <div className="bg-indigo-600 py-3 text-center text-white font-black text-base sm:text-lg">Β' Γυμνασίου ⭐</div>
              <div className="p-5 text-center flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-gray-800 font-bold mb-1.5 text-sm sm:text-base">Ενότητα: Συναρτήσεις</p>
                  <p className="text-gray-500 mb-5 text-xs">Μελέτησε τη συνάρτηση y = αx και δες live τη γραφική παράσταση στο πλέγμα!</p>
                </div>
                <Link href="/b-gymnasiou" className="block w-full text-center bg-indigo-600 text-white py-2 rounded-xl font-black hover:bg-indigo-700 transition shadow-sm text-xs sm:text-sm">
                  🚀 Είσοδος στην Τάξη
                </Link>
              </div>
            </div>

            {/* Γ' ΓΥΜΝΑΣΙΟΥ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col justify-between">
              <div className="bg-purple-500 py-3 text-center text-white font-black text-base sm:text-lg">Γ' Γυμνασίου</div>
              <div className="p-5 text-center flex-1 flex flex-col justify-between">
                <p className="text-gray-600 mb-5 text-xs">Αλγεβρικές Παραστάσεις, Μονώνυμα, Ταυτότητες & Ομοιότητα.</p>
                <button className="w-full bg-purple-400 text-white py-2 rounded-xl font-bold opacity-60 cursor-not-allowed text-xs">
                  Σύντομα Διαθέσιμο
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
