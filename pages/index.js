import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>LearnMaths.gr - Διαδραστικά Μαθηματικά</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4 text-center shadow-inner relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight animate-fade-in">
            LearnMaths<span className="text-cyan-300">.gr</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium opacity-90">
            Κάνουμε τα Μαθηματικά παιχνίδι! Ψηφιακοί, διαδραστικοί προσομοιωτές για το Δημοτικό και το Γυμνάσιο, σχεδιασμένοι για βαθιά και βιωματική κατανόηση.
          </p>
        </div>
        {/* Διακριτικό background σχήμα */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      </section>

      {/* ΕΠΙΛΟΓΗ ΤΑΞΕΩΝ */}
      <main className="max-w-5xl mx-auto px-4 py-16 text-center space-y-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900">🎒 Διάλεξε την Τάξη σου</h2>
          <p className="text-gray-500 text-sm">Μπες στους διαδραστικούς κόσμους και πειραματίσου με τους αριθμούς και τα σχήματα.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* ΚΑΡΤΑ: Ε' ΔΗΜΟΤΙΚΟΥ */}
          <Link href="/e-dimotikou" className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-cyan-200 transition-all duration-300 text-left flex flex-col justify-between transform hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
                🍕
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Ε' Δημοτικού</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Μάθε τα πάντα για τα Κλάσματα (έννοια, ισοδύναμα, απλοποίηση, αναγωγή), τα Πολλαπλάσια, τους Διαιρέτες, το ΕΚΠ, το ΜΚΔ, τα Κριτήρια Διαιρετότητας, τη Μέση Τιμή και τα Ποσοστά.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-cyan-600 group-hover:text-cyan-700">
              <span>🚀 Ξεκίνα το Μάθημα</span>
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* ΚΑΡΤΑ: Β' ΓΥΜΝΑΣΙΟΥ (ΤΩΡΑ ΕΝΕΡΓΗ!) */}
          <Link href="/b-gymnasiou" className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 text-left flex flex-col justify-between transform hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                📐
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Β' Γυμνασίου</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Εξερεύνησε τον κόσμο των Συναρτήσεων! Μελέτησε τη γραφική παράσταση της συνάρτησης <span className="font-mono bg-slate-50 border p-0.5 rounded text-indigo-600 font-bold">y = αx</span> και δες πώς αλλάζει live η ευθεία γραμμή στο σύστημα συντεταγμένων.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-indigo-600 group-hover:text-indigo-700">
              <span>🏁 Είσοδος στην Τάξη</span>
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-10 text-center text-sm border-t border-gray-700">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="font-bold text-gray-300">LearnMaths.gr</p>
          <p>© {new Date().getFullYear()} - Δημιουργήθηκε με ❤️ για τους μαθητές και τους εκπαιδευτικούς μας.</p>
        </div>
      </footer>
    </div>
  );
}
