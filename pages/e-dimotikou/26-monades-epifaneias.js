import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const areaUnits = [
  { key: "m2", label: "τ. μέτρα (m²)", factorFromM2: 1, color: "#0f766e", emoji: "🏠" },
  { key: "dm2", label: "τ. δεκατόμετρα (dm²)", factorFromM2: 100, color: "#2563eb", emoji: "🟩" },
  { key: "cm2", label: "τ. εκατοστά (cm²)", factorFromM2: 10000, color: "#d97706", emoji: "📏" },
  { key: "mm2", label: "τ. χιλιοστά (mm²)", factorFromM2: 1000000, color: "#dc2626", emoji: "🔍" },
];

function formatGreekNumber(num) {
  return new Intl.NumberFormat("el-GR").format(num);
}

export default function MonadesEpifaneiasPage() {
  const [squareMeters, setSquareMeters] = useState(3);

  const values = useMemo(() => {
    return areaUnits.map((unit) => ({
      ...unit,
      value: squareMeters * unit.factorFromM2,
    }));
  }, [squareMeters]);

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
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span className="text-xl">📖</span> Θεωρία: Πώς μετατρέπουμε τις Μονάδες Επιφάνειας;
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Επειδή οι μονάδες επιφάνειας είναι τετράγωνα (Μήκος &times; Πλάτος), όταν πηγαίνουμε από μια μονάδα στην αμέσως μικρότερη <strong>πολλαπλασιάζουμε με το 100</strong>. Όταν πηγαίνουμε προς μεγαλύτερη, <strong>διαιρούμε με το 100</strong>!
            </p>
            
            {/* ΟΠΤΙΚΗ ΑΛΥΣΙΔΑ ΜΕΤΑΤΡΟΠΗΣ (m2 -> dm2 -> cm2 -> mm2) */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-center gap-4 text-sm font-black text-slate-700">
              <span className="px-3 py-1.5 bg-teal-50 text-teal-800 rounded-xl border border-teal-100">1 m²</span>
              <span className="text-blue-500 font-mono">&rarr; &times;100 &rarr;</span>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">100 dm²</span>
              <span className="text-amber-500 font-mono">&rarr; &times;100 &rarr;</span>
              <span className="px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">10.000 cm²</span>
              <span className="text-red-500 font-mono">&rarr; &times;100 &rarr;</span>
              <span className="px-3 py-1.5 bg-red-50 text-red-800 rounded-xl border border-red-100">1.000.000 mm²</span>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ (2 Στήλες) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΚΑΡΤΕΣ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[540px] w-full gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                    <span>🕹️</span> 1. Διάλεξε Ποσότητα
                  </h3>
                  
                  {/* Slider Επιλογής */}
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-inner space-y-2">
                    <label htmlFor="m2range" className="block text-sm font-bold text-slate-700">
                      Τετραγωνικά μέτρα (m²): <span className="text-lg font-mono font-black text-blue-600">{squareMeters}</span>
                    </label>
                    <input
                      id="m2range"
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={squareMeters}
                      onChange={(e) => setSquareMeters(Number(e.target.value))}
                      className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Δυναμικές Κάρτες Αποτελεσμάτων */}
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">
                    2. Δες τις Μετατροπές
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {values.map((unit) => (
                      <div
                        key={unit.key}
                        className="bg-white border rounded-2xl p-4 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md"
                        style={{ borderTop: `5px solid ${unit.color}` }}
                      >
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                          <span>{unit.emoji}</span> {unit.label}
                        </span>
                        <span className="text-xl font-mono font-black text-slate-800 mt-2 tracking-tight">
                          {formatGreekNumber(unit.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ΠΑΙΔΑΓΩΓΙΚΟ ΜΟΝΤΕΛΟ: ΒΗΜΑ-ΒΗΜΑ ΑΝΑΛΥΣΗ */}
              <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2.5 shadow-sm mt-auto">
                <p className="font-bold text-emerald-900 flex items-center gap-2 text-sm">
                  <span>🧠</span> Πώς προκύπτουν οι αριθμοί (Βήμα-Βήμα):
                </p>
                <div className="space-y-1.5 font-mono text-xs md:text-sm text-emerald-800">
                  <div className="flex justify-between border-b border-emerald-100/50 pb-1">
                    <span>{squareMeters} m² &times; 100 =</span>
                    <span className="font-bold">{formatGreekNumber(squareMeters * 100)} dm²</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-100/50 pb-1">
                    <span>{formatGreekNumber(squareMeters * 100)} dm² &times; 100 =</span>
                    <span className="font-bold">{formatGreekNumber(squareMeters * 10000)} cm²</span>
                  </div>
                  <div className="flex justify-between pb-0.5">
                    <span>{formatGreekNumber(squareMeters * 10000)} cm² &times; 100 =</span>
                    <span className="font-bold">{formatGreekNumber(squareMeters * 1000000)} mm²</span>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-700/80 leading-relaxed pt-1 border-t border-emerald-200/40 text-center font-medium">
                  &ldquo;Κάθε φορά που πάω σε αμέσως μικρότερη μονάδα επιφάνειας, πολλαπλασιάζω με 100.&rdquo;
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟ ΠΛΕΓΜΑ 10x10 ΓΙΑ dm2 & ZOOM-LEVEL */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[540px] w-full relative overflow-hidden">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block text-center">
                Γραφική Αναπαράσταση: 1 m² σπάει σε 100 dm²
              </span>
              
              <div className="text-sm font-bold text-blue-600 mb-4 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full font-mono">
                {squareMeters} m² = {formatGreekNumber(squareMeters * 100)} dm²
              </div>

              {/* Το 10x10 πλέγμα για τα dm2 */}
              <div 
                className="grid grid-cols-10 grid-rows-10 border-4 border-blue-500 rounded-xl overflow-hidden shadow-inner bg-slate-50 p-1 gap-[3px]"
                style={{ width: '290px', height: '290px' }}
              >
                {[...Array(100)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[3px] border border-blue-400/20 flex items-center justify-center text-[7px] font-bold font-mono transition-all duration-150 select-none bg-blue-400/20 text-blue-700"
                  >
                    {i === 0 ? '1dm²' : ''}
                  </div>
                ))}
              </div>

              {/* ΕΠΙΠΕΔΟ ZOOM ΓΙΑ cm2 ΚΑΙ mm2 */}
              <div className="w-full grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-gray-100">
                <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl text-center">
                  <span className="text-[10px] font-black text-amber-700 block uppercase mb-1">🔍 Επίπεδο Zoom cm²</span>
                  <p className="text-xs text-slate-600 font-medium">
                    Μέσα σε <strong>κάθε 1</strong> από τα παραπάνω μπλε τετραγωνάκια (dm²) υπάρχουν άλλα <strong>100 ακόμα πιο μικρά</strong> εκατοστά (cm²)!
                  </p>
                </div>
                <div className="bg-red-50/50 border border-red-100 p-3 rounded-xl text-center">
                  <span className="text-[10px] font-black text-red-700 block uppercase mb-1">🔬 Επίπεδο Zoom mm²</span>
                  <p className="text-xs text-slate-600 font-medium">
                    Και μέσα σε <strong>κάθε 1</strong> εκατοστό (cm²), φωλιάζουν <strong>100 μικροσκοπικά</strong> χιλιοστά (mm²)!
                  </p>
                </div>
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
