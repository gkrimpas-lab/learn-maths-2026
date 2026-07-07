import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function MonadesEpifaneias() {
  const [viewMode, setViewMode] = useState('cm_to_mm'); // cm_to_mm ή m_to_dm
  const [quantity, setQuantity] = useState(1); // Ποσότητα από 1 έως 4 για οπτικοποίηση

  const q = parseInt(quantity) || 1;

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
              <span className="text-xl">📖</span> Θεωρία &amp; Διάδραση: Γιατί αλλάζουμε ανά 100;
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Σύρε τον δρομέα για να αλλάξεις την ποσότητα. Παρατήρησε πώς κάθε φορά που προσθέτεις 1 μεγάλη μονάδα, στο πλέγμα εμφανίζονται αμέσως <strong>100 μικρότερα κουτάκια</strong>!
            </p>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & LIVE ΥΠΟΛΟΓΙΣΜΟΣ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    <span>🕹️</span> 1. Διάλεξε Σχέση Μονάδων
                  </h3>
                  
                  {/* Tabs Επιλογής Σχέσης */}
                  <div className="flex flex-col gap-2.5 mb-6">
                    <button
                      onClick={() => { setViewMode('cm_to_mm'); setQuantity(1); }}
                      className={`px-4 py-3 rounded-xl font-bold text-sm text-left transition shadow-sm border ${
                        viewMode === 'cm_to_mm'
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🔍 Από cm² σε mm² (Εκατοστά σε Χιλιοστά)
                    </button>
                    <button
                      onClick={() => { setViewMode('m_to_dm'); setQuantity(1); }}
                      className={`px-4 py-3 rounded-xl font-bold text-sm text-left transition shadow-sm border ${
                        viewMode === 'm_to_dm'
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🏠 Από m² σε dm² (Μέτρα σε Δεκάμετρα)
                    </button>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                    <span>📏</span> 2. Άλλαξε την Ποσότητα
                  </h3>

                  {/* Δυναμικό Slider Διάδρασης */}
                  <div className="space-y-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-inner">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">
                        {viewMode === 'cm_to_mm' ? 'Επιλεγμένα Εκατοστά:' : 'Επιλεγμένα Μέτρα:'}
                      </label>
                      <span className="text-lg font-mono font-black text-blue-600">
                        {q} {viewMode === 'cm_to_mm' ? 'cm²' : 'm²'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[11px] font-bold text-gray-400">
                      <span>1 Μονάδα</span>
                      <span>4 Μονάδες</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ΔΥΝΑΜΙΚΗ ΠΡΑΣΙΝΗ ΚΑΡΤΑ ΜΕ ΤΟΝ ΚΑΝΟΝΑ ΜΕΤΑΤΡΟΠΗΣ */}
              <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-3 shadow-sm mt-auto">
                <p className="font-bold text-emerald-900 flex items-center gap-2">
                  <span>📊</span> Live Αποτέλεσμα Καταμέτρησης:
                </p>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center font-black text-lg text-emerald-600 font-mono">
                  {viewMode === 'cm_to_mm' 
                    ? `${q} cm² = ${q} × 100 = ${q * 100} mm²` 
                    : `${q} m² = ${q} × 100 = ${q * 100} dm²`
                  }
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium text-center">
                  Βλέπεις; Κάθε φορά που αυξάνεις τις μεγάλες μονάδες, οι μικρές πολλαπλασιάζονται <strong>πάντα με το 100</strong>!
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΔΥΝΑΜΙΚΗ ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΠΛΕΓΜΑΤΩΝ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[520px] w-full relative overflow-hidden">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-6 block text-center">
                {viewMode === 'cm_to_mm' 
                  ? `Συνολική επιφάνεια: ${q * 100} μικρά τετραγωνικά χιλιοστά` 
                  : `Συνολική επιφάνεια: ${q * 100} τετραγωνικά δεκάμετρα`
                }
              </span>

              {/* Δυναμικό Grid που εμφανίζει όσα 10x10 πλέγματα επιλέγει ο μαθητής */}
              <div className="grid grid-cols-2 gap-4 max-w-[340px] w-full justify-center items-center">
                {[...Array(q)].map((_, gridIdx) => (
                  <div 
                    key={gridIdx}
                    className="grid grid-cols-10 grid-rows-10 border-2 rounded-lg overflow-hidden shadow-sm transition-all duration-300"
                    style={{ 
                      width: '140px', 
                      height: '140px', 
                      borderColor: viewMode === 'cm_to_mm' ? 'rgb(59, 130, 246)' : 'rgb(16, 185, 129)' 
                    }}
                  >
                    {[...Array(100)].map((_, i) => (
                      <div
                        key={i}
                        className="border-[0.2px] border-gray-200/30 flex items-center justify-center text-[7px] font-bold"
                        style={{ 
                          backgroundColor: viewMode === 'cm_to_mm' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(16, 185, 129, 0.08)', 
                          color: viewMode === 'cm_to_mm' ? 'rgb(37, 99, 235)' : 'rgb(5, 150, 105)' 
                        }}
                      >
                        {i === 0 && gridIdx === 0 ? (viewMode === 'cm_to_mm' ? '1mm²' : '1dm²') : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-8 text-center">
                <span>🔍 Κουνώντας το slider, βλέπεις τα 100άρια των μικρών μονάδων να προστίθενται στην οθόνη.</span>
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
