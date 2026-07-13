import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../shared/layout-config'; // Σωστό import από τον global φάκελο

export default function Epikoinonia() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>✉️ Επικοινωνία - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🏠 Αρχική Σελίδα
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT (Με βάση το ωφέλιμο layout του μαθήματος) */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100">
            
            {/* Header Τίτλος */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-black text-gray-900 mb-4">✉️ Επικοινωνία</h1>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Έχετε απορίες, παρατηρήσεις ή ενδιαφέρεστε για ιδιαίτερα μαθήματα; Θα χαρώ να επικοινωνήσετε μαζί μου!
              </p>
            </div>

            {/* Grid 2 Στηλών */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
              
              {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΠΛΗΡΟΦΟΡΙΕΣ */}
              <div className="space-y-6 flex flex-col justify-between">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="font-bold text-xl text-blue-900 mb-2">👨‍🏫 Σχετικά με τον Δημιουργό</h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    Ονομάζομαι <strong>Δημήτρης Γκρίμπας</strong> και είμαι ο δημιουργός του LearnMaths.gr. Είμαι Μηχανικός Η/Υ και Πληροφορικής του Πανεπιστημίου Πατρών με Μεταπτυχιακό στη Διδακτική των θετικών Επιστημών και κάτοχος 2ου πτυχίου από το τμήμα Μαθηματικών του Πανεπιστημίου Πατρών. Στόχος μου είναι να κάνω τη μάθηση των Μαθηματικών προσιτή, διαδραστική και κατανοητή για κάθε μαθητή.
                  </p>
                </div>

                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 h-full flex flex-col justify-center">
                  <h3 className="font-bold text-xl text-indigo-900 mb-2">📐 Ιδιαίτερα Μαθήματα</h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
                    Παραδίδονται υπεύθυνα ιδιαίτερα μαθήματα Μαθηματικών σε μαθητές Δημοτικού και Γυμνασίου:
                  </p>
                  <ul className="space-y-2.5 text-xs md:text-sm font-semibold text-indigo-950">
                    <li className="flex items-center gap-2">💻 Εξ αποστάσεως (Online) σε όλη την Ελλάδα</li>
                    <li className="flex items-center gap-2">📍 Δια ζώσης στην περιοχή της <strong>Πάτρας</strong></li>
                    <li className="flex items-center gap-2">🎯 Προετοιμασία για την εισαγωγή σε Πρότυπα Σχολεία</li>
                  </ul>
                </div>
              </div>

              {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: E-MAIL */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-gray-200 flex flex-col justify-center items-center text-center shadow-inner min-h-[320px]">
                <span className="text-5xl mb-4 block">📧</span>
                <h3 className="font-bold text-2xl text-gray-900 mb-2">Στείλτε μου Email</h3>
                <p className="text-gray-500 text-sm md:text-base max-w-sm mb-6">
                  Για οποιαδήποτε ερώτηση, πρόταση, ή εκδήλωση ενδιαφέροντος για μαθήματα, μπορείτε να επικοινωνήσετε απευθείας στο:
                </p>
                <a 
                  href="mailto:gkrimpas.apps@gmail.com?subject=Επικοινωνία μέσω LearnMaths.gr" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition duration-300 text-sm md:text-base break-all"
                >
                  gkrimpas.apps@gmail.com
                </a>
                <p className="text-xs text-gray-400 mt-4 font-medium">
                  * Απαντώ συνήθως εντός 24 ωρών.
                </p>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700 mt-12">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Με ❤️ για τους μαθητές μας.</p>
      </footer>
    </div>
  );
}
