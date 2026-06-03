import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans scroll-smooth">
      <Head>
        <title>LearnMaths.gr - Τα Μαθηματικά Αλλιώς</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <meta name="description" content="Η σύγχρονη πλατφόρμα εκμάθησης Μαθηματικών για το Δημοτικό, το Γυμνάσιο και τα Πρότυπα Σχολεία" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-black text-blue-600 tracking-tight">
            LearnMaths<span className="text-indigo-600">.gr</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a href="#demotiko" className="hover:text-blue-600 transition">Δημοτικό</a>
            <a href="#gymnasio" className="hover:text-indigo-600 transition">Γυμνάσιο</a>
            <a href="#protypa" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition duration-300">
              🎯 Εισαγωγή σε Πρότυπα
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="bg-gradient-to-r py-16 text-center text-white from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">LearnMaths.gr</h1>
          <p className="text-xl font-light opacity-90 mb-8">
            Μάθε τα Μαθηματικά εύκολα, γρήγορα και διαδραστικά από το Δημοτικό έως το Γυμνάσιο!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a href="#demotiko" className="bg-white text-blue-700 px-6 py-3 rounded-full font-bold shadow-md hover:bg-gray-100 transition duration-300">Δημοτικό 🎒</a>
            <a href="#gymnasio" className="bg-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-indigo-600 transition duration-300 border border-indigo-400">Γυμνάσιο 📐</a>
          </div>

          <div className="flex flex-col items-center justify-center mt-4">
            <p className="text-xs font-semibold opacity-75 mb-2 uppercase tracking-wider">Κατεβάστε την εφαρμογή</p>
            <a href="https://play.google.com/store/apps/details?id=com.gkrimpas.learn_maths&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" className="inline-block transform hover:scale-105 transition duration-300">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/el_badge_web_generic.png" alt="Get it on Google Play" className="w-48 h-auto mx-auto" />
            </a>
          </div>
        </div>
      </header>

      {/* ΠΡΟΤΥΠΑ SECTION */}
      <section id="protypa" className="py-16 bg-amber-50 border-b border-amber-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-block bg-amber-200 text-amber-800 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide mb-3">Ειδική Προετοιμασία</div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">🎯 Εισαγωγή στα Πρότυπα Σχολεία</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-12">
            Κάνε τη μετάβαση από την ΣΤ' Δημοτικού στην Α' Γυμνασίου με απόλυτη επιτυχία! Κατέβασε συγκεντρωμένα όλα τα θέματα και τις επίσημες απαντήσεις προηγούμενων ετών.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 flex flex-col justify-between hover:shadow-md transition">
              <div><span className="text-2xl mb-3 block">📚</span><h4 className="font-bold text-gray-900 mb-2 text-base leading-tight">Μαθηματικά & Γλώσσα</h4><p className="text-gray-500 text-xs mb-4">Θέματα εξετάσεων μαζί για τα έτη 2020 έως και 2025.</p></div>
              <a href="/protypa_2020_2025.pdf" download className="w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm">📥 Λήψη Αρχείου (PDF)</a>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 flex flex-col justify-between hover:shadow-md transition">
              <div><span className="text-2xl mb-3 block">📐</span><h4 className="font-bold text-gray-900 mb-2 text-base leading-tight">Μαθηματικά</h4><p className="text-gray-500 text-xs mb-4">Ξεχωριστά όλα τα θέματα Μαθηματικών από το 2016 έως και το 2019.</p></div>
              <a href="/maths_2016_2019.pdf" download className="w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm">📥 Λήψη Αρχείου (PDF)</a>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 flex flex-col justify-between hover:shadow-md transition">
              <div><span className="text-2xl mb-3 block">✍️</span><h4 className="font-bold text-gray-900 mb-2 text-base leading-tight">Νεοελληνική Γλώσσα</h4><p className="text-gray-500 text-xs mb-4">Ξεχωριστά όλα τα θέματα της Γλώσσας από το 2016 έως και το 2019.</p></div>
              <a href="/glossa_2016_2019.pdf" download className="w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm">📥 Λήψη Αρχείου (PDF)</a>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-emerald-400 bg-emerald-50/30 flex flex-col justify-between hover:shadow-md transition">
              <div><span className="text-2xl mb-3 block">✅</span><h4 className="font-bold text-emerald-900 mb-2 text-base leading-tight">Απαντήσεις Θεμάτων</h4><p className="text-emerald-700 text-xs mb-4">Ένα ενιαίο αρχείο με τις απαντήσεις για όλα τα έτη (2016 έως 2025).</p></div>
              <a href="/apanteseis_2016_2025.pdf" download className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm">📥 Λήψη Απαντήσεων</a>
            </div>
          </div>
        </div>
      </section>

      {/* ΔΗΜΟΤΙΚΟ SECTION */}
      <section id="demotiko" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-blue-600">🎒 Μαθηματικά Δημοτικού</h2>
          <p className="text-center text-gray-500 mb-10">Χτίζουμε γερές βάσεις για το μέλλον</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <div className="bg-teal-500 py-4 text-center text-white font-bold text-xl">Δ' Δημοτικού</div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6 text-sm">Μεγάλοι αριθμοί, γεωμετρικά σχήματα & βασικές πράξεις.</p>
                <button className="w-full bg-teal-500 text-white py-2 rounded-lg font-medium opacity-60 cursor-not-allowed">Σύντομα Διαθέσιμο</button>
              </div>
            </div>

            {/* Ε' ΔΗΜΟΤΙΚΟΥ - ΣΥΝΔΕΣΗ ΜΕ ΤΗ ΝΕΑ ΣΕΛΙΔΑ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-cyan-400 transform scale-105 duration-300">
              <div className="bg-cyan-500 py-4 text-center text-white font-bold text-xl">Ε' Δημοτικού ⭐</div>
              <div className="p-6 text-center">
                <p className="text-gray-800 font-semibold mb-2 text-sm">Ενότητα: Κλάσματα</p>
                <p className="text-gray-500 mb-6 text-xs">Μάθε για τα κλάσματα και τα ισοδύναμα με διαδραστικούς προσομοιωτές!</p>
                <Link href="/e-dimotikou" className="block w-full text-center bg-cyan-500 text-white py-2 rounded-lg font-bold hover:bg-cyan-600 transition shadow-md">
                  🚀 Είσοδος στην Τάξη
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <div className="bg-blue-500 py-4 text-center text-white font-bold text-xl">ΣΤ' Δημοτικού</div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6 text-sm">Ανάλογα ποσά, εξισώσεις, κλίμακες & προετοιμασία για το Γυμνάσιο.</p>
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium opacity-60 cursor-not-allowed">Σύντομα Διαθέσιμο</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ΓΥΜΝΑΣΙΟΥ SECTION */}
      <section id="gymnasio" className="py-16 bg-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-indigo-600">📐 Μαθηματικά Γυμνασίου</h2>
          <p className="text-center text-gray-500 mb-10">Εμβαθύνουμε στην άλγεβρα και τη γεωμετρία</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200"><div className="bg-indigo-500 py-4 text-center text-white font-bold text-xl">Α' Γυμνασίου</div><div className="p-6 text-center"><p className="text-gray-600 mb-6 text-sm">Κλάσματα, Εξισώσεις, Ποσοστά & βασική Γεωμετρία.</p><button className="w-full bg-indigo-500 text-white py-2 rounded-lg font-medium opacity-60 cursor-not-allowed">Σύντομα Διαθέσιμο</button></div></div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200"><div className="bg-violet-500 py-4 text-center text-white font-bold text-xl">Β' Γυμνασίου</div><div className="p-6 text-center"><p className="text-gray-600 mb-6 text-sm">Ρητοί Αριθμοί, Συναρτήσεις, Πυθαγόρειο Θεώρημα.</p><button className="w-full bg-violet-500 text-white py-2 rounded-lg font-medium opacity-60 cursor-not-allowed">Σύντομα Διαθέσιμο</button></div></div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200"><div className="bg-purple-500 py-4 text-center text-white font-bold text-xl">Γ' Γυμνασίου</div><div className="p-6 text-center"><p className="text-gray-600 mb-6 text-sm">Αλγεβρικές Παραστάσεις, Μονώνυμα, Ταυτότητες & Ομοιότητα.</p><button className="w-full bg-purple-500 text-white py-2 rounded-lg font-medium opacity-60 cursor-not-allowed">Σύντομα Διαθέσιμο</button></div></div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Με ❤️ για τους μαθητές μας.</p>
      </footer>
    </div>
  );
}
