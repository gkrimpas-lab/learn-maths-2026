import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function EmbadoSximatonPage() {
  const [shape, setShape] = useState('square');
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);

  const unitSize = 35; // 35px όπως στο μάθημα 24
  const maxUnits = 10; 

  const w = parseInt(width);
  const h = shape === 'square' ? w : parseInt(height);

  const canvasGridSize = (maxUnits + 2) * unitSize; 

  const getShapeStyle = () => {
    const baseStyle = {
      position: 'absolute',
      left: `${unitSize}px`,
      top: `${unitSize}px`,
      width: `${w * unitSize}px`,
      height: `${h * unitSize}px`,
      transition: 'all 0.3s ease',
      zIndex: 10,
    };

    if (shape === 'square') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(79, 70, 229, 0.20)',
        border: '3.5px solid rgb(79, 70, 229)',
        clipPath: 'none',
      };
    } else if (shape === 'rectangle') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(249, 115, 22, 0.20)',
        border: '3.5px solid rgb(249, 115, 22)',
        clipPath: 'none',
      };
    } else if (shape === 'triangle') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(14, 165, 233, 0.30)',
        border: '3.5px solid rgb(14, 165, 233)',
        clipPath: 'polygon(0 100%, 100% 100%, 0 0)',
      };
    }
    return baseStyle;
  };

  const getGhostRectangleStyle = () => {
    return {
      position: 'absolute',
      left: `${unitSize}px`,
      top: `${unitSize}px`,
      width: `${w * unitSize}px`,
      height: `${h * unitSize}px`,
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(148, 163, 184, 0.08)', 
      border: '2px dashed rgb(148, 163, 184)', 
      zIndex: 5,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📐 Εμβαδόν Σχημάτων - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR - ΠΛΗΡΩΣ ΠΡΟΣΑΡΜΟΣΜΕΝΟ ΜΕ ΤΗ ΦΩΤΟΓΡΑΦΙΑ */}
        <nav className="bg-white w-full border-b border-gray-100">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            {/* Λογότυπο με σωστά χρώματα */}
            <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            
            {/* Πιστό Κουμπί Επιστροφής (Απαλό γκρι οβάλ με BACK εικονίδιο) */}
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
              <span className="text-xl">📖</span> Θεωρία: Το Εμβαδόν των Βασικών Σχημάτων
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Αλλάζοντας το μέγεθος των σχημάτων, παρατηρούμε πώς αλλάζει η επιφάνεια που καλύπτουν. Δες πώς συνδέεται το τρίγωνο με το ορθογώνιο!
            </p>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ (2 Στήλες για έλεγχο μεγέθους οθόνης) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΚΑΤΑΜΕΤΡΗΣΗ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                    <span>🕹️</span> 1. Διάλεξε Σχήμα
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() => setShape('square')}
                      className={`px-4 py-3 rounded-xl font-bold text-sm text-left transition shadow-sm ${
                        shape === 'square'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🟩 Τετράγωνο
                    </button>
                    <button
                      onClick={() => setShape('rectangle')}
                      className={`px-4 py-3 rounded-xl font-bold text-sm text-left transition shadow-sm ${
                        shape === 'rectangle'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🟧 Ορθογώνιο
                    </button>
                    <button
                      onClick={() => setShape('triangle')}
                      className={`px-4 py-3 rounded-xl font-bold text-sm text-left transition shadow-sm ${
                        shape === 'triangle'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      📐 Ορθογώνιο Τρίγωνο
                    </button>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                    <span>📏</span> 2. Άλλαξε τις Διαστάσεις
                  </h3>
                  <div className="space-y-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-inner">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                        {shape === 'square' ? `Πλευρά: ${w} cm` : `Μήκος (Βάση): ${w} cm`}
                      </label>
                      <input
                        type="range"
                        min="2"
                        max={maxUnits}
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                        className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    {shape !== 'square' && (
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                          Πλάτος (Ύψος): {h} cm
                        </label>
                        <input
                          type="range"
                          min="2"
                          max={maxUnits}
                          value={height}
                          onChange={(e) => setHeight(parseInt(e.target.value))}
                          className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ΔΥΝΑΜΙΚΗ ΠΡΑΣΙΝΗ ΚΑΡΤΑ ΜΑΘΗΜΑΤΟΣ */}
              <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-3 shadow-sm mt-auto">
                {shape === 'square' && (
                  <>
                    <p className="font-bold text-emerald-900 flex items-center gap-2"><span>🟩</span> Τετράγωνο:</p>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      Όλες οι πλευρές είναι ίσες! Πολλαπλασιάζουμε την πλευρά με τον εαυτό της.
                      <br /><strong>Εμβαδόν = Πλευρά × Πλευρά</strong>
                    </p>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center font-black text-base text-emerald-600 font-mono">
                      {w} × {w} = {w * w} cm²
                    </div>
                  </>
                )}

                {shape === 'rectangle' && (
                  <>
                    <p className="font-bold text-emerald-900 flex items-center gap-2"><span>🟧</span> Ορθογώνιο:</p>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      Έχει μήκος και πλάτος. Πολλαπλασιάζουμε το μήκος επί το πλάτος!
                      <br /><strong>Εμβαδόν = Μήκος × Πλάτος</strong>
                    </p>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center font-black text-base text-emerald-600 font-mono">
                      {w} × {h} = {w * h} cm²
                    </div>
                  </>
                )}

                {shape === 'triangle' && (
                  <>
                    <p className="font-bold text-emerald-900 flex items-center gap-2"><span>📐</span> Ορθογώνιο Τρίγωνο:</p>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      Το τρίγωνο είναι <strong>ακριβώς το μισό</strong> του ορθογωνίου! Γι' αυτό διαιρούμε με το 2.
                      <br /><strong>Εμβαδόν = (Μήκος × Πλάτος) ÷ 2</strong>
                    </p>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center font-black text-base text-emerald-600 font-mono">
                      ({w} × {h}) ÷ 2 = {(w * h) / 2} cm²
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ ΜΕ ΠΛΕΓΜΑ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[520px] w-full relative overflow-hidden">
              <div
                className="border-2 border-slate-200 relative bg-slate-50/20 rounded-md shadow-inner"
                style={{
                  width: `${canvasGridSize}px`,
                  height: `${canvasGridSize}px`,
                  backgroundImage:
                    'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
                  backgroundSize: `${unitSize}px ${unitSize}px`,
                }}
              >
                {shape === 'triangle' && <div style={getGhostRectangleStyle()} />}
                <div style={getShapeStyle()} />
              </div>
              
              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-6 text-center">
                <span>🔍 Άλλαξε τα sliders για να δεις το εμβαδόν να μεγαλώνει στο πλέγμα.</span>
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
