import Head from 'next/head';
import Link from 'next/link';

export default function BGymnasiouDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans scroll-smooth">
      <Head>
        <title>Β' Γυμνασίου: Μαθηματικά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">
            LearnMaths<span className="text-indigo-600">.gr</span>
          </Link>
          <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">
            🏠 Αρχική
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 text-center shadow-inner">
        <h1 className="text-4xl font-black mb-2">📐 Μαθηματικά Β' Γυμνασίου</h1>
        <p className="text-indigo-100 opacity-90 font-medium">Ψηφιακή Τάξη &amp; Διαδραστικά Εργαστήρια</p>
      </header>

      {/* ΚΕΝΤΡΙΚΟΣ ΠΙΝΑΚΑΣ ΜΑΘΗΜΑΤΩΝ */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">📂 Ενότητες Μαθημάτων</h2>
            <p className="text-xs text-slate-500 mt-0.5">Επίλεξε ένα μάθημα για να ξεκινήσεις την εξερεύνηση.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ΜΑΘΗΜΑ 1: Η ΜΕΤΑΒΛΗΤΗ */}
            <Link href="/b-gymnasiou-1-met" className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex items-start gap-4 group">
              <div className="bg-amber-100 text-amber-600 text-2xl p-4 rounded-2xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
                📦
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-base text-slate-900">1. Η Μεταβλητή</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Μάθε τι είναι η μεταβλητή και πειραματίσου με το ψηφιακό μηχάνημα αντικατάστασης τιμών.</p>
                <span className="text-[11px] font-bold text-amber-600 block pt-1">Έναρξη Μαθήματος &rarr;</span>
              </div>
            </Link>

            {/* ΜΑΘΗΜΑ 2: Η ΕΞΙΣΩΣΗ */}
            <Link href="/b-gymnasiou-2-equa" className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex items-start gap-4 group">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm opacity-60 flex items-start gap-4">
                <div className="bg-slate-100 text-slate-500 text-2xl p-4 rounded-2xl">
                  ⚖️
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-base text-slate-700">2. Η Εξίσωση (x+α=β &amp; α·x=β)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Η διαδραστική ζυγαριά επίλυσης εξισώσεων μεταφέρεται σε αυτόνομη σελίδα σύντομα.</p>
                </div>
              </div>
              </Link>
            {/* ΜΑΘΗΜΑ 3: y = ax */}
            <Link href="/b-gymnasiou-3-yax" className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex items-start gap-4 group">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm opacity-60 flex items-start gap-4">
                <div className="bg-slate-100 text-slate-500 text-2xl p-4 rounded-2xl">
                  📈
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-base text-slate-700">3. Η συνάρτηση y = αx</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Μελέτη της κλίσης της ευθείας και του συντελεστή αναλογίας.</p>
                </div>
              </div>
              </Link>
            {/* ΜΑΘΗΜΑ 4: y = ax + b */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm opacity-60 flex items-start gap-4">
              <div className="bg-slate-100 text-slate-500 text-2xl p-4 rounded-2xl">
                🚀
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-base text-slate-700">4. Η συνάρτηση y = αx + β</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Εξερεύνηση της παράλληλης μετατόπισης ευθειών στον άξονα y'y.</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm mt-12">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη Β' Γυμνασίου.</p>
      </footer>
    </div>
  );
}
