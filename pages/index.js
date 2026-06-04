import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>LearnMaths.gr - Διαδραστικά Μαθηματικά</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-black text-blue-600 tracking-tight">
            LearnMaths<span className="text-indigo-600">.gr</span>
          </div>
          <div className="flex gap-4 text-sm font-bold text-gray-600">
            <a href="#classes" className="hover:text-blue-600 transition">🎒 Τάξεις</a>
            <a href="#features" className="hover:text-blue-600 transition">✨ Χαρακτηριστικά</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-24 px-4 text-center relative overflow-hidden shadow-inner">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-block bg-white/10 backdrop-blur-md text-cyan-200 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-white/10 mb-2">
            🚀 Ψηφιακό Σχολείο Μαθηματικών
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
            Η οπτικοποίηση των <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-amber-300">Μαθηματικών εννοιών</span>
          </h1>
          <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto font-medium opacity-90 leading-relaxed">
            Διαδραστικοί προσομοιωτές και οπτικά εργαλεία για το Δημοτικό και το Γυμνάσιο. Μετατρέπουμε την αφηρημένη θεωρία σε ζωντανή, βιωματική γνώση για τους μαθητές.
          </p>
          <div className="pt-4">
            <a href="#classes" className="bg-white text-indigo-700 hover:bg-cyan-50 px-8 py-3.5 rounded-2xl text-base font-black transition duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2">
              Ξεκινήστε την Εξερεύνηση 👇
            </a>
          </div>
        </div>
        {/* Διακοσμητικά σχήματα φόντου */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* SECTION: ΤΑΞΕΙΣ */}
      <main id="classes" className="max-w-6xl mx-auto px-4 py-20 text-center space-y-12 scroll-mt-16">
        <div className="space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">🎒 Διαδραστικές Τάξεις</h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Επιλέξτε τάξη για να αποκτήσετε πρόσβαση στα ειδικά σχεδιασμένα ψηφιακά εργαλεία και τη θεωρία.
          </p>
        </div>

        {/* GRID ΤΑΞΕΩΝ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Α' ΔΗΜΟΤΙΚΟΥ (Σύντομα) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 opacity-60 relative group">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center text-xl mb-4">
              ✏️
            </div>
            <h3 className="text-lg font-black text-gray-400 text-left mb-1">Α' Δημοτικού</h3>
            <p className="text-gray-400 text-xs text-left leading-relaxed">
              Πρώτη γνωριμία με τους αριθμούς, την πρόσθεση και τα βασικά γεωμετρικά σχήματα.
            </p>
            <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Σύντομα
            </div>
          </div>

          {/* Β' ΔΗΜΟΤΙΚΟΥ (Σύντομα) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 opacity-60 relative group">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center text-xl mb-4">
              🧮
            </div>
            <h3 className="text-lg font-black text-gray-400 text-left mb-1">Β' Δημοτικού</h3>
            <p className="text-gray-400 text-xs text-left leading-relaxed">
              Εμβάθυνση στην αφαίρεση, εισαγωγή στον πολλαπλασιασμό και την προπαίδεια.
            </p>
            <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Σύντομα
            </div>
          </div>

          {/* Γ' ΔΗΜΟΤΙΚΟΥ (Σύντομα) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 opacity-60 relative group">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center text-xl mb-4">
              📏
            </div>
            <h3 className="text-lg font-black text-gray-400 text-left mb-1">Γ' Δημοτικού</h3>
            <p className="text-gray-400 text-xs text-left leading-relaxed">
              Τριψήφιοι αριθμοί, κάθετες πράξεις και η πρώτη επαφή με την έννοια του κλάσματος.
            </p>
            <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Σύντομα
            </div>
          </div>

          {/* Δ' ΔΗΜΟΤΙΚΟΥ (Σύντομα) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 opacity-60 relative group">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center text-xl mb-4">
              🛒
            </div>
            <h3 className="text-lg font-black text-gray-400 text-left mb-1">Δ' Δημοτικού</h3>
            <p className="text-gray-400 text-xs text-left leading-relaxed">
              Μεγάλοι αριθμοί, δεκαδικοί, γεωμετρικά μοτίβα και εισαγωγή στα προβλήματα.
            </p>
            <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Σύντομα
            </div>
          </div>

          {/* ΚΑΡΤΑ: Ε' ΔΗΜΟΤΙΚΟΥ (ΕΝΕΡΓΗ) */}
          <Link href="/e-dimotikou" className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-cyan-200 transition-all duration-300 text-left flex flex-col justify-between transform hover:-translate-y-1 relative">
            <div>
              <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
                💎
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Ε' Δημοτικού</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Πλήρης ενότητα με 11 διαδραστικά εργαλεία: Κλάσματα, ΕΚΠ, ΜΚΔ, Κριτήρια Διαιρετότητας, Ποσοστά, Μέση Τιμή κ.α.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-cyan-600 group-hover:text-cyan-700">
              <span>🚀 Είσοδος στο Μάθημα</span>
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="absolute top-4 right-4 bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
              11 Ενότητες
            </div>
          </Link>

          {/* ΣΤ' ΔΗΜΟΤΙΚΟΥ (Σύντομα) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 opacity-60 relative group">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center text-xl mb-4">
              🎓
            </div>
            <h3 className="text-lg font-black text-gray-400 text-left mb-1">Στ' Δημοτικού</h3>
            <p className="text-gray-400 text-xs text-left leading-relaxed">
              Εξισώσεις, αναλογίες, αρνητικοί αριθμοί και γεωμετρικά στερεά για την προετοιμασία για το Γυμνάσιο.
            </p>
            <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Σύντομα
            </div>
          </div>

          {/* Α' ΓΥΜΝΑΣΙΟΥ (Σύντομα) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 opacity-60 relative group">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center text-xl mb-4">
              🎒
            </div>
            <h3 className="text-lg font-black text-gray-400 text-left mb-1">Α' Γυμνασίου</h3>
            <p className="text-gray-400 text-xs text-left leading-relaxed">
              Μετάβαση στην Άλγεβρα, εξισώσεις α' βαθμού, απόλυτη τιμή και βασική Γεωμετρία.
            </p>
            <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Σύντομα
            </div>
          </div>

          {/* ΚΑΡΤΑ: Β' ΓΥΜΝΑΣΙΟΥ (ΕΝΕΡΓΗ!) */}
          <Link href="/b-gymnasiou" className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 text-left flex flex-col justify-between transform hover:-translate-y-1 relative">
            <div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                📈
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Β' Γυμνασίου</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Μελέτη των Συναρτήσεων. Εξερευνήστε τη συνάρτηση <span className="font-mono bg-slate-50 px-1 py-0.5 rounded text-indigo-600 font-bold">y = αx</span> με live μεταβολή της κλίσης.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
              <span>🏁 Είσοδος στην Τάξη</span>
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Νέο!
            </div>
          </Link>

          {/* Γ' ΓΥΜΝΑΣΙΟΥ (Σύντομα) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 opacity-60 relative group">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center text-xl mb-4">
              📐
            </div>
            <h3 className="text-lg font-black text-gray-400 text-left mb-1">Γ' Γυμνασίου</h3>
            <p className="text-gray-400 text-xs text-left leading-relaxed">
              Αλγεβρικές παραστάσεις, ταυτότητες, εξισώσεις β' βαθμού και ομοιότητα σχημάτων.
            </p>
            <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Σύντομα
            </div>
          </div>

        </div>
      </main>

      {/* SECTION: ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ */}
      <section id="features" className="bg-white py-20 border-t border-gray-100 scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">✨ Γιατί το LearnMaths ξεχωρίζει;</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="space-y-3">
              <div className="text-2xl">⚡</div>
              <h4 className="text-base font-bold text-gray-900">Ακαριαία Απόκριση</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Κάθε slider, κουμπί και αλλαγή τιμής επανασχεδιάζει τα γραφικά σε πραγματικό χρόνο χωρίς καθυστερήσεις.</p>
            </div>
            <div className="space-y-3">
              <div className="text-2xl">🎯</div>
              <h4 className="text-base font-bold text-gray-900">Παιδαγωγική Εστίαση</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Σχεδιασμένο με βάση το αναλυτικό πρόγραμμα σπουδών, ιδανικό για χρήση στην τάξη από τον εκπαιδευτικό ή για μελέτη στο σπίτι.</p>
            </div>
            <div className="space-y-3">
              <div className="text-2xl">📱</div>
              <h4 className="text-base font-bold text-gray-900">Πλήρως Responsive</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Λειτουργεί άψογα σε διαδραστικούς πίνακες, υπολογιστές, tablets αλλά και κινητά τηλέφωνα.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-12 text-center text-sm border-t border-gray-700">
        <div className="max-w-5xl mx-auto px-4 space-y-3">
          <p className="font-bold text-gray-300 text-base">LearnMaths.gr</p>
          <p className="text-xs">Ένα σύγχρονο υποστηρικτικό εργαλείο για τη διδασκαλία των Μαθηματικών στην Πρωτοβάθμια και Δευτεροβάθμια Εκπαίδευση.</p>
          <p className="text-[11px] pt-4 border-t border-gray-700/50 text-gray-500">© {new Date().getFullYear()} - Δημιουργήθηκε με ❤️ για τους μαθητές και τους εκπαιδευτικούς μας.</p>
        </div>
      </footer>
    </div>
  );
}
