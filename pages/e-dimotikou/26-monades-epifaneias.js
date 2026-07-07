import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function MonadesEpifaneias() {
  const [selectedUnit, setSelectedUnit] = useState('cm2');
  const [inputValue, setInputValue] = useState(1); // Η ποσότητα που αλλάζει ο μαθητής

  const unitsData = {
    mm2: {
      title: "📐 Τετραγωνικό Χιλιοστό (mm²)",
      emoji: "🔍",
      desc: "Είναι η επιφάνεια ενός πολύ μικρού τετραγώνου με πλευρά 1 χιλιοστό. Το χρησιμοποιούμε για πολύ μικρά αντικείμενα.",
      color: "rgb(239, 68, 68)",
      bgAlpha: "rgba(239, 68, 68, 0.15)",
      gridContent: "mm",
      // Συντελεστές μετατροπής με βάση το mm2
      toCm2: (val) => (val / 100).toFixed(2),
      toDm2: (val) => (val / 10000).toFixed(4),
      toM2: (val) => (val / 1000000).toFixed(6),
    },
    cm2: {
      title: "🟩 Τετραγωνικό Εκατοστό (cm²)",
      emoji: "📏",
      desc: "Είναι η επιφάνεια ενός τετραγώνου με πλευρά 1 εκατοστό. Χρησιμοποιείται για να μετράμε πράγματα στο τετράδιό μας.",
      color: "rgb(59, 130, 246)",
      bgAlpha: "rgba(59, 130, 246, 0.15)",
      gridContent: "cm",
      toMm2: (val) => val * 100,
      toDm2: (val) => (val / 100).toFixed(2),
      toM2: (val) => (val / 10000).toFixed(4),
    },
    dm2: {
      title: "🟧 Τετραγωνικό Δεκάμετρο (dm²)",
      emoji: "📦",
      desc: "Είναι η επιφάνεια ενός τετραγώνου με πλευρά 10 εκατοστά (1 δεκάμετρο). Σαν ένα μικρό πλακάκι.",
      color: "rgb(249, 115, 22)",
      bgAlpha: "rgba(249, 115, 22, 0.15)",
      gridContent: "dm",
      toMm2: (val) => val * 10000,
      toCm2: (val) => val * 100,
      toM2: (val) => (val / 100).toFixed(2),
    },
    m2: {
      title: "🏠 Τετραγωνικό Μέτρο (m²)",
      emoji: "🏡",
      desc: "Η βασική μονάδα για μεγάλες επιφάνειες, όπως ένα δωμάτιο. Είναι ένα μεγάλο τετράγωνο με πλευρά 1 μέτρο.",
      color: "rgb(16, 185, 129)",
      bgAlpha: "rgba(16, 185, 129, 0.15)",
      gridContent: "m",
      toMm2: (val) => val * 1000000,
      toCm2: (val) => val * 10000,
      toDm2: (val) => val * 100,
    }
  };

  const current = unitsData[selectedUnit];
  const val = parseFloat(inputValue) || 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📐 Μονάδες Επιφάνειας - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white w-full border-b border-gray-100">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            
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
          
          {/* ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span className="text-xl">📖</span> Θεωρία & Διάδραση: Οι Μονάδες Επιφάνειας
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Άλλαξε τους αριθμούς στο εργαλείο για να δεις πώς όταν μεγαλώνει ή μικραίνει μια μονάδα επιφάνειας, οι υπόλοιπες αλλάζουν <strong>ανά 100</strong>!
            </p>
          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & LIVE ΜΕΤΑΤΡΟΠΕΑΣ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[560px] w-full gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    <span>🕹️</span> 1. Επίλεξε Μονάδα και Ποσότητα
                  </h3>
                  
                  {/* Buttons Επιλογής */}
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {Object.keys(unitsData).map((u) => (
                      <button
                        key={u}
                        onClick={() => { setSelectedUnit(u); setInputValue(1); }}
                        className={`px-3 py-2.5 rounded-xl font-bold text-xs text-center transition shadow-sm border ${
                          selectedUnit === u
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {u === 'mm2' && '📐 mm²'}
                        {u === 'cm2' && '🟩 cm²'}
                        {u === 'dm2' && '🟧 dm²'}
                        {u === 'm2' && '🏠 m²'}
                      </button>
                    ))}
                  </div>

                  {/* Input / Slider Διάδρασης */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-inner space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Ποσότητα:</span>
                      <span className="text-lg font-mono font-black text-blue-600">{val} {selectedUnit}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={inputValue}
                      onChange={(e) => setInputValue(parseInt(e.target.value))}
                      className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* LIVE ΣΧΕΣΕΙΣ ΜΕΤΑΤΡΟΠΗΣ (Πίνακας αποτελεσμάτων) */}
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider">
                    🔄 Δυναμική Μετατροπή:
                  </h4>
                  <div className="grid grid-cols-1 gap-2 font-mono">
                    {selectedUnit !== 'm2' && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-gray-100 flex justify-between text-sm">
                        <span className="text-gray-500 font-sans font-medium">Σε Τετραγωνικά Μέτρα:</span>
                        <span className="font-bold text-slate-800">{current.toM2 ? current.toM2(val) : '-'} m²</span>
                      </div>
                    )}
                    {selectedUnit !== 'dm2' && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-gray-100 flex justify-between text-sm">
                        <span className="text-gray-500 font-sans font-medium">Σε Τετραγωνικά Δεκάμετρα:</span>
                        <span className="font-bold text-slate-800">{current.toDm2 ? current.toDm2(val) : '-'} dm²</span>
                      </div>
                    )}
                    {selectedUnit !== 'cm2' && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-gray-100 flex justify-between text-sm">
                        <span className="text-gray-500 font-sans font-medium">Σε Τετραγωνικά Εκατοστά:</span>
                        <span className="font-bold text-slate-800">{current.toCm2 ? current.toCm2(val) : '-'} cm²</span>
                      </div>
                    )}
                    {selectedUnit !== 'mm2' && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-gray-100 flex justify-between text-sm">
                        <span className="text-gray-500 font-sans font-medium">Σε Τετραγωνικά Χιλιοστά:</span>
                        <span className="font-bold text-slate-800">{current.toMm2 ? current.toMm2(val) : '-'} mm²</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ΠΡΑΣΙΝΗ ΚΑΡΤΑ ΚΑΝΟΝΑ */}
              <div className="bg-emerald-50 text-slate-900 p-4 rounded-2xl border border-emerald-100 text-center font-bold text-sm text-emerald-700 shadow-sm mt-auto">
                👉 Όταν κατεβαίνουμε μονάδα (πάμε σε μικρότερη), ΠΟΛΛΑΠΛΑΣΙΑΖΟΥΜΕ με το 100. <br/>
                👉 Όταν ανεβαίνουμε μονάδα (πάμε σε μεγαλύτερη), ΔΙΑΙΡΟΥΜΕ με το 100.
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΔΥΝΑΜΙΚΟ ΓΡΑΦΙΚΟ ΠΛΕΓΜΑ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[560px] w-full relative overflow-hidden">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-4 block">
                Γραφική Αναπαράσταση Επιφάνειας ({val} Μονάδες)
              </span>

              {/* Δυναμικό Grid που χρωματίζει τόσα 10x10 πλέγματα όσα λέει το Slider */}
              <div className="grid grid-cols-2 gap-4 max-w-[340px] justify-center items-center">
                {[...Array(Math.min(val, 4))].map((_, gridIdx) => (
                  <div 
                    key={gridIdx}
                    className="grid grid-cols-5 grid-rows-5 border-2 rounded-lg overflow-hidden transition-all duration-300"
                    style={{ width: '130px', height: '130px', borderColor: current.color }}
                  >
                    {[...Array(25)].map((_, i) => (
                      <div
                        key={i}
                        className="border-[0.5px] border-gray-200/40 flex items-center justify-center text-[7px] font-bold"
                        style={{ backgroundColor: current.bgAlpha, color: current.color }}
                      >
                        {i === 0 && gridIdx === 0 ? `1${current.gridContent}²` : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {val > 4 && (
                <p className="text-xs font-bold text-blue-500 mt-3">
                  + άλλα {val - 4} τετράγωνα στην επιφάνεια!
                </p>
              )}

              <div className="w-full flex flex-col items-center justify-center text-xs font-bold text-slate-500 pt-4 border-t border-gray-50 mt-6 text-center space-y-1">
                <p>💡 Παρατήρησε τα νούμερα αριστερά!</p>
                <p className="font-medium text-slate-400 max-w-sm">
                  Κάθε φορά που αυξάνεις την ποσότητα, βλέπεις αμέσως πόσα εκατοστά, χιλιοστά ή μέτρα γεμίζουν ταυτόχρονα.
                </p>
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
