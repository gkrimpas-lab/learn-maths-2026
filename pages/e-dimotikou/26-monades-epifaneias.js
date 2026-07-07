import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function MonadesEpifaneias() {
  const [viewMode, setViewMode] = useState('cm_to_mm'); // cm_to_mm ή m_to_dm

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📐 Μονάδες Επιφάνειας - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR - 100% ΙΔΙΟ ΜΕ ΤΑ ΥΠΟΛΟΙΠΑ ΜΑΘΗΜΑΤΑ */}
        <nav className="bg-white w-full border-b border-gray-100">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            {/* Λογότυπο με το .gr σε text-indigo-600 όπως στο μάθημα 24 */}
            <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            
            {/* Κουμπί Επιστροφής */}
            <Link href="/e-dimotikou" className="bg-[#f1f1f4] hover:bg-[#e4e4e8] text-[#4a4a52] px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 tracking-wide">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600 stroke-[3] stroke-current">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span className="text-xl">📖</span> Θεωρία: Γιατί αλλάζουμε ανά 100;
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Στο μήκος, 1 εκατοστό έχει 10 χιλιοστά. Στην επιφάνεια όμως, επειδή πολλαπλασιάζουμε Μήκος × Πλάτος (10 × 10), το <strong>1 τετραγωνικό εκατοστό χωράει ακριβώς 100 τετραγωνικά χιλιοστά</strong>! Δες το γραφικά παρακάτω:
            </p>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΠΑΙΔΑΓΩΓΙΚΗ ΕΠΕΞΗΓΗΣΗ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    <span>🕹️</span> Διάλεξε Σχέση Μονάδων:
                  </h3>
                  
                  {/* Tabs Επιλογής Σχέσης */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setViewMode('cm_to_mm')}
                      className={`px-4 py-3 rounded-xl font-bold text-sm text-left transition shadow-sm border ${
                        viewMode === 'cm_to_mm'
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🔍 Από 1 cm² σε 100 mm² (Μικρά κουτάκια)
                    </button>
                    <button
                      onClick={() => setViewMode('m_to_dm')}
                      className={`px-4 py-3 rounded-xl font-bold text-sm text-left transition shadow-sm border ${
                        viewMode === 'm_to_dm'
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🏠 Από 1 m² σε 100 dm² (Μεγαλύτερη Μονάδα)
                    </button>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Επεξήγηση ανάλογα με το viewMode */}
                <div className="space-y-3">
                  {viewMode === 'cm_to_mm' ? (
                    <>
                      <h4 className="text-lg font-black text-slate-800">🔍 Κάνοντας &ldquo;Ζουμ&rdquo; στο 1 cm²</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Το μεγάλο τετράγωνο που βλέπεις δεξιά είναι <strong>1 τετραγωνικό εκατοστό</strong>. Αν μετρήσεις τα μικροσκοπικά κουτάκια στο εσωτερικό του, θα δεις ότι είναι ακριβώς 100! Το κάθε ένα από αυτά είναι <strong>1 τετραγωνικό χιλιοστό</strong>.
                      </p>
                    </>
                  ) : (
                    <>
                      <h4 className="text-lg font-black text-slate-800">🏠 Το 1 m² ως το &ldquo;Όλο&rdquo;</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Φαντάσου τώρα ότι ολόκληρο το μεγάλο τετράγωνο είναι <strong>1 τετραγωνικό μέτρο</strong> (π.χ. ένας μεγάλος τοίχος). Κάθε ένα από τα 100 τετράγωνα που τον γεμίζουν είναι ακριβώς <strong>1 τετραγωνικό δεκάμετρο</strong> (1 dm²).
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* ΠΡΑΣΙΝΗ ΚΑΡΤΑ: Ο ΚΑΝΟΝΑΣ */}
              <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 shadow-sm mt-auto">
                <p className="font-bold text-emerald-900 flex items-center gap-1">
                  <span>💡</span> Το μυστικό των Μαθηματικών:
                </p>
                <p className="text-slate-700 text-sm font-medium leading-relaxed">
                  Επειδή η πλευρά μεγαλώνει 10 φορές (1 cm = 10 mm), ολόκληρη η επιφάνεια μεγαλώνει 10 × 10 = <strong>100 φορές</strong>!
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[520px] w-full relative overflow-hidden">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-6 block text-center">
                {viewMode === 'cm_to_mm' 
                  ? 'Πλέγμα: 1 τετραγωνικό εκατοστό (cm²) σπασμένο σε 100 χιλιοστά' 
                  : 'Πλέγμα: 1 τετραγωνικό μέτρο (m²) σπασμένο σε 100 δεκάμετρα'
                }
              </span>

              {/* Το 10x10 Πλέγμα Υποδιαίρεσης */}
              <div 
                className="grid grid-cols-10 grid-rows-10 border-[3.5px] rounded-xl overflow-hidden shadow-sm transition-all duration-300"
                style={{ 
                  width: '320px', 
                  height: '320px',
                  borderColor: viewMode === 'cm_to_mm' ? 'rgb(59, 130, 246)' : 'rgb(16, 185, 129)'
                }}
              >
                {[...Array(100)].map((_, i) => (
                  <div
                    key={i}
                    className="border-[0.5px] border-gray-200/70 flex items-center justify-center text-[8px] font-bold font-mono transition-all duration-300 select-none hover:bg-blue-50"
                    style={{ 
                      backgroundColor: viewMode === 'cm_to_mm' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                      color: viewMode === 'cm_to_mm' ? 'rgb(37, 99, 235)' : 'rgb(5, 150, 105)'
                    }}
                  >
                    {i === 0 ? (viewMode === 'cm_to_mm' ? '1mm²' : '1dm²') : ''}
                    {i === 99 ? '100' : ''}
                  </div>
                ))}
              </div>

              {/* Δυναμική Μαθηματική Ισότητα κάτω από το σχήμα */}
              <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-base text-slate-700 w-64 text-center shadow-inner">
                {viewMode === 'cm_to_mm' ? '1 cm² = 100 mm²' : '1 m² = 100 dm²'}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Εμβαδού.</p>
      </footer>
    </div>
  );
}
