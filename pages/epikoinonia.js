import Head from 'next/head';
import Link from 'next/link';

export default function Epikoinonia() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>Επικοινωνία - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-black text-blue-600 tracking-tight">
            <Link href="/" className="cursor-pointer">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition">
              🏠 Αρχική Σελήδα
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-4">✉️ Επικοινωνία</h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Έχετε απορίες, παρατηρήσεις ή ενδιαφέρεστε για ιδιαίτερα μαθήματα; Θα χαρώ να επικοινωνήσετε μαζί μου!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Πληροφορίες & Ιδιαίτερα */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-xl text-blue-900 mb-2">👨‍🏫 Σχετικά με τον Δημιουργό</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Ονομάζομαι <strong>Γιώργος Κρίμπας</strong> και είμαι ο δημιουργός του LearnMaths.gr. Στόχος μου είναι να κάνω τη μάθηση των Μαθηματικών προσιτή, διαδραστική και κατανοητή για κάθε μαθητή.
                </p>
              </div>

              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="font-bold text-xl text-indigo-900 mb-2">📐 Ιδιαίτερα Μαθήματα</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  Παραδίδονται υπεύθυνα ιδιαίτερα μαθήματα Μαθηματικών σε μαθητές Δημοτικού και Γυμνασίου:
                </p>
                <ul className="space-y-2 text-xs font-semibold text-indigo-950">
                  <li className="flex items-center gap-2">💻 Εξ αποστάσεως (Online) σε όλη την Ελλάδα</li>
                  <li className="flex items-center gap-2">📍 Δια ζώσης στην περιοχή της <strong>Πάτρας</strong></li>
                  <li className="flex items-center gap-2">🎯 Προετοιμασία για την εισαγωγή σε Πρότυπα Σχολεία</li>
                </ul>
              </div>
            </div>

            {/* Τρόπος Επικοινωνίας */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 h-full flex flex-col justify-center text-center">
              <span className="text-4xl mb-4 block">📧</span>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Στείλτε μου Email</h3>
              <p className="text-gray-600 text-sm mb-6">
                Για οποιαδήποτε ερώτηση, πρόταση, ή εκδήλωση ενδιαφέροντος για μαθήματα, μπορείτε να επικοινωνήσετε απευθείας στο:
              </p>
              <a 
                href="mailto:gkrimpas.apps@gmail.com?subject=Επικοινωνία μέσω LearnMaths.gr" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition duration-300 text-sm break-all"
              >
                gkrimpas.apps@gmail.com
              </a>
              <p className="text-xs text-gray-400 mt-4">
                * Απαντώ συνήθως εντός 24 ωρών.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm mt-12">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Με ❤️ για τους μαθητές μας.</p>
      </footer>
    </div>
  );
}
