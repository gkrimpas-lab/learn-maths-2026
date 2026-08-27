import Link from 'next/link';
import Layout from '../components/Layout';
import { LAYOUT } from '../shared/layout-config';

export default function Home() {
  // Custom Navigation Links για την αρχική σελίδα (περνούν ως Overload στο Layout)
  const navLinks = (
    <>
      <a href="#demotiko" className="hover:text-blue-600 transition">Δημοτικό</a>
      <a href="#gymnasio" className="hover:text-indigo-600 transition">Γυμνάσιο</a>
      <a href="#protypa" className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition duration-300">
        🎯 Πρότυπα
      </a>
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
      {/* HERO SECTION */}
      <header className="bg-gradient-to-r py-12 md:py-16 text-center text-white from-blue-600 to-indigo-700 shadow-lg -mt-2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 leading-tight">
            LearnMaths<span className="text-amber-300">.gr</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-light opacity-95 mb-8 max-w-2xl mx-auto leading-relaxed">
            Μάθε τα Μαθηματικά εύκολα, γρήγορα και διαδραστικά από το Δημοτικό έως το Γυμνάσιο!
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
            <a href="#demotiko" className="bg-white text-blue-700 px-6 py-3 rounded-full font-bold shadow-md hover:bg-gray-100 transition duration-300 text-sm sm:text-base transform active:scale-95">
              Δημοτικό 🎒
            </a>
            <a href="#gymnasio" className="bg-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-indigo-600 transition duration-300 border border-indigo-400 text-sm sm:text-base transform active:scale-95">
              Γυμνάσιο 📐
            </a>
          </div>

          <div className="flex flex-col items-center justify-center mt-6">
            <p className="text-xs font-semibold opacity-80 mb-2 uppercase tracking-wider">Κατεβάστε την εφαρμογή</p>
            <a
              href="https://play.google.com/store/apps/details?id=com.gkrimpas.learn_maths&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transform hover:scale-105 transition duration-300"
            >
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/el_badge_web_generic.png"
                alt="Get it on Google Play"
                className="w-40 sm:w-48 h-auto mx-auto"
              />
            </a>
          </div>
        </div>
      </header>

      {/* ΠΡΟΤΥΠΑ SECTION */}
      <section id="protypa" className="py-12 md:py-16 bg-amber-50 border-b border-amber-200">
        <div className={`${LAYOUT.CONTAINER} text-center px-4 sm:px-6`}>
          <div className="inline-block bg-amber-200 text-amber-900 font-black px-4 py-1 rounded-full text-xs uppercase tracking-wide mb-3">
            Ειδική Προετοιμασία
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-2">
            🎯 Εισαγωγή στα Πρότυπα Σχολεία
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Κάνε τη μετάβαση από την ΣΤ' Δημοτικού στην Α' Γυμνασίου με απόλυτη επιτυχία! Κατέβασε συγκεντρωμένα όλα τα θέματα και τις λύσεις των εξετάσεων.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-3 block">📚</span>
                <h4 className="font-bold text-slate-800 mb-2 text-base sm:text-lg">Πρότυπα Σχολεία 2020 - 2025</h4>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">Θέματα και ενδεικτικές απαντήσεις εξετάσεων.</p>
              </div>
              <a
                href="/protypa_2020_2025.pdf"
                download
                className="w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-900 font-black py-2.5 px-4 rounded-xl text-sm transition shadow-sm"
              >
                📥 Λήψη PDF
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-3xl mb-3 block">📐</span>
                <h4 className="font-bold text-slate-800 mb-2 text-base sm:text-lg">Μαθηματικά 2016 - 2019</h4>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">Παλαιότερα θέματα εξετάσεων με λύσεις.</p>
              </div>
              <a
                href="/maths_2016_2019.pdf"
                download
                className="w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-900 font-black py-2.5 px-4 rounded-xl text-sm transition shadow-sm"
              >
                📥 Λήψη PDF
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-emerald-400 bg-emerald-50/30 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-3xl mb-3 block">✅</span>
                <h4 className="font-bold text-emerald-900 mb-2 text-base sm:text-lg leading-tight">Απαντήσεις Θεμάτων</h4>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">Αναλυτικές λύσεις όλων των ετών.</p>
              </div>
              <a
                href="/apanteseis_2016_2025.pdf"
                download
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm"
              >
                📥 Λήψη PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ΔΗΜΟΤΙΚΟ SECTION */}
      <section id="demotiko" className="py-12 md:py-16 bg-white">
        <div className={`${LAYOUT.CONTAINER} px-4 sm:px-6`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-2 text-blue-600">
            🎒 Μαθηματικά Δημοτικού
          </h2>
          <p className="text-center text-gray-500 mb-10 text-sm sm:text-base">Χτίζουμε γερές βάσεις για το μέλλον</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Δ' ΔΗΜΟΤΙΚΟΥ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 flex flex-col justify-between">
              <div className="bg-teal-500 py-4 text-center text-white font-black text-lg sm:text-xl">Δ' Δημοτικού ⭐</div>
              <div className="p-6 text-center flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-gray-800 font-bold mb-2 text-sm sm:text-base">Διαδραστικές Ενότητες</p>
                  <p className="text-gray-500 mb-6 text-xs sm:text-sm">Μεγάλοι Αριθμοί, Διαίρεση, Κλάσματα, Μήκος, Βάρος κ.α.</p>
                </div>
                <Link href="/d-dimotikou" className="block w-full text-center bg-teal-500 text-white py-2.5 rounded-xl font-black hover:bg-teal-600 transition shadow-md text-sm">
                  🚀 Είσοδος στην Τάξη
                </Link>
              </div>
            </div>

            {/* Ε' ΔΗΜΟΤΙΚΟΥ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-cyan-400 transform md:scale-105 duration-300 flex flex-col justify-between">
              <div className="bg-cyan-500 py-4 text-center text-white font-black text-lg sm:text-xl">Ε' Δημοτικού ⭐</div>
              <div className="p-6 text-center flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-gray-800 font-bold mb-2 text-sm sm:text-base">Διαδραστικές Ενότητες</p>
                  <p className="text-gray-500 mb-6 text-xs sm:text-sm">Κλάσματα, Απλοποίηση, ΕΚΠ, ΜΚΔ, Ποσοστά, Μέση Τιμή κ.α. με προσομοιωτές!</p>
                </div>
                <Link href="/e-dimotikou" className="block w-full text-center bg-cyan-500 text-white py-2.5 rounded-xl font-black hover:bg-cyan-600 transition shadow-md text-sm">
                  🚀 Είσοδος στην Τάξη
                </Link>
              </div>
            </div>

            {/* ΣΤ' ΔΗΜΟΤΙΚΟΥ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 flex flex-col justify-between">
              <div className="bg-blue-500 py-4 text-center text-white font-black text-lg sm:text-xl">ΣΤ' Δημοτικού</div>
              <div className="p-6 text-center flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-gray-800 font-bold mb-2 text-sm sm:text-base">Διαδραστικές Ενότητες</p>
                  <p className="text-gray-600 mb-6 text-xs sm:text-sm">Ανάλογα ποσά, εξισώσεις, κλίμακες & προετοιμασία για το Γυμνάσιο.</p>
                </div>
                <Link href="/st-dimotikou" className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-xl font-black hover:bg-blue-700 transition shadow-md text-sm">
                  🚀 Είσοδος στην Τάξη
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ΓΥΜΝΑΣΙΟ SECTION */}
      <section id="gymnasio" className="py-12 md:py-16 bg-gray-100">
        <div className={`${LAYOUT.CONTAINER} px-4 sm:px-6`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-2 text-indigo-600">
            📐 Μαθηματικά Γυμνασίου
          </h2>
          <p className="text-center text-gray-500 mb-10 text-sm sm:text-base">Εμβαθύνουμε στην άλγεβρα και τη γεωμετρία</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Α' ΓΥΜΝΑΣΙΟΥ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 flex flex-col justify-between">
              <div className="bg-indigo-500 py-4 text-center text-white font-black text-lg sm:text-xl">Α' Γυμνασίου</div>
              <div className="p-6 text-center flex-1 flex flex-col justify-between">
                <p className="text-gray-600 mb-6 text-xs sm:text-sm">Κλάσματα, Εξισώσεις, Ποσοστά & βασική Γεωμετρία.</p>
                <button className="w-full bg-indigo-400 text-white py-2.5 rounded-xl font-bold opacity-60 cursor-not-allowed text-xs sm:text-sm">
                  Σύντομα Διαθέσιμο
                </button>
              </div>
            </div>

            {/* Β' ΓΥΜΝΑΣΙΟΥ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-indigo-400 transform md:scale-105 duration-300 flex flex-col justify-between">
              <div className="bg-indigo-600 py-4 text-center text-white font-black text-lg sm:text-xl">Β' Γυμνασίου ⭐</div>
              <div className="p-6 text-center flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-gray-800 font-bold mb-2 text-sm sm:text-base">Ενότητα: Συναρτήσεις</p>
                  <p className="text-gray-500 mb-6 text-xs sm:text-sm">Μελέτησε τη συνάρτηση y = αx και δες live τη γραφική παράσταση στο πλέγμα!</p>
                </div>
                <Link href="/b-gymnasiou" className="block w-full text-center bg-indigo-600 text-white py-2.5 rounded-xl font-black hover:bg-indigo-700 transition shadow-md text-sm">
                  🚀 Είσοδος στην Τάξη
                </Link>
              </div>
            </div>

            {/* Γ' ΓΥΜΝΑΣΙΟΥ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 flex flex-col justify-between">
              <div className="bg-purple-500 py-4 text-center text-white font-black text-lg sm:text-xl">Γ' Γυμνασίου</div>
              <div className="p-6 text-center flex-1 flex flex-col justify-between">
                <p className="text-gray-600 mb-6 text-xs sm:text-sm">Αλγεβρικές Παραστάσεις, Μονώνυμα, Ταυτότητες & Ομοιότητα.</p>
                <button className="w-full bg-purple-400 text-white py-2.5 rounded-xl font-bold opacity-60 cursor-not-allowed text-xs sm:text-sm">
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
