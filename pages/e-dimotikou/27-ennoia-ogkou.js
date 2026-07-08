import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function formatGreekNumber(num) {
  return new Intl.NumberFormat("el-GR").format(num);
}

export default function EnnoiaOgkouPage() {
  // Σταθερές διαστάσεις του νοητού κουτιού (π.χ. Μήκος=4, Πλάτος=3, Ύψος=3)
  const length = 4;
  const width = 3;
  const height = 3;
  const totalCubes = length * width * height; // 36 κυβάκια συνολικά

  // Ο μαθητής γεμίζει το κουτί με κυβάκια από 0 έως 36
  const [cubesCount, setCubesCount] = useState(12);

  const isComplete = cubesCount === totalCubes;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📦 Η Έννοια του Όγκου - LearnMaths.gr</title>
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
              <span className="text-xl">📖</span> Θεωρία: Τι είναι ο Όγκος;
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Μέχρι τώρα μετρούσαμε επίπεδες επιφάνειες (Εμβαδόν). Όμως, τα αντικείμενα γύρω μας έχουν και πάχος ή ύψος! <strong>Όγκος</strong> είναι ο χώρος που πιάνει ένα σώμα. Για να τον μετρήσουμε, χρησιμοποιούμε μικρούς <strong>κύβους</strong> (π.χ. κυβικά εκατοστά - cm³).
            </p>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΚΑΡΤΕΣ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                    <span>🕹️</span> 1. Γέμισε το Κουτί
                  </h3>
                  <p className="text-gray-500 text-xs mb-3">
                    Σύρε τον δρομέα για να βάζεις ένα-ένα τα κυβάκια μέσα στο κουτί και να δεις πώς γεμίζει ο χώρος.
                  </p>
                  
                  {/* Slider Ελέγχου */}
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-inner space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-700">Κυβάκια στο κουτί:</span>
                      <span className={`text-2xl font-mono font-black ${isComplete ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {cubesCount} / {totalCubes}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={totalCubes}
                      step="1"
                      value={cubesCount}
                      onChange={(e) => setCubesCount(parseInt(e.target.value))}
                      className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-1">
                      <span>⚪ Άδειο κουτί</span>
                      <span className={isComplete ? 'text-emerald-600 font-black' : ''}>📦 Γεμάτο (36 κυβάκια)</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  <button onClick={() => setCubesCount(0)} className="p-2 px-4 rounded-xl font-bold text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm">🔄 Άδειασμα</button>
                  <button onClick={() => setCubesCount(totalCubes)} className="p-2 px-4 rounded-xl font-black text-xs bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm">🎯 Γέμισμα Όλων</button>
                </div>
              </div>

              {/* ΜΑΘΗΜΑΤΙΚΟ ΜΟΝΤΕΛΟ */}
              <div className={`p-5 rounded-2xl border transition-all duration-300 w-full text-center shadow-sm ${isComplete ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ:</span>
                <div className={`text-lg md:text-xl font-black mt-1 ${isComplete ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {isComplete 
                    ? `🏆 Όγκος = 4 × 3 × 3 = ${totalCubes} κυβικά εκατοστά!` 
                    : `📦 Μέσα στο κουτί χωράνε: ${cubesCount} κυβάκια`
                  }
                </div>
                <p className="text-xs font-medium text-slate-400 mt-2 leading-relaxed">
                  Για να βρούμε τον όγκο, πολλαπλασιάζουμε τις 3 διαστάσεις:<br />
                  <strong>Μήκος &times; Πλάτος &times; Ύψος</strong>
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: 3D-LIKE SVG ΟΠΤΙΚΟΠΟΙΗΣΗ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[520px] w-full relative overflow-hidden">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-4 block text-center">
                Τρισδιάστατη Αναπαράσταση Κουτιού (Μήκος: 4, Πλάτος: 3, Ύψος: 3)
              </span>

              {/* SVG Καμβάς με Isometric προβολή για ψευδαίσθηση 3D */}
              <div className="relative bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                <svg width="340" height="300" viewBox="0 0 340 300" className="overflow-visible">
                  
                  {/* Σχεδίαση των κύβων με βάση το cubesCount */}
                  {[...Array(totalCubes)].map((_, i) => {
                    // Υπολογισμός θέσης x, y, z στον τρισδιάστατο χώρο
                    const z = Math.floor(i / (length * width)); // Ύψος (layer)
                    const rem = i % (length * width);
                    const y = Math.floor(rem / length); // Πλάτος
                    const x = rem % length; // Μήκος

                    // Μετατροπή Isometric συντεταγμένων για το SVG
                    const startX = 70;
                    const startY = 200;
                    const size = 32;

                    // Μαθηματικός τύπος isometric προβολής
                    const isoX = startX + (x * size) + (y * size * 0.5);
                    const isoY = startY + (y * size * 0.25) - (z * size * 0.85);

                    const isActive = i < cubesCount;

                    return (
                      <g key={i} className="transition-all duration-300" opacity={isActive ? 1 : 0.08}>
                        {/* Μπροστινή Έδρα Κύβου */}
                        <path
                          d={`M ${isoX} ${isoY} L ${isoX + size} ${isoY + size*0.25} L ${isoX + size} ${isoY + size*1.1} L ${isoX} ${isoY + size*0.85} Z`}
                          fill="#3b82f6"
                          stroke="#1d4ed8"
                          strokeWidth="1"
                        />
                        {/* Πλάγια Έδρα Κύβου */}
                        <path
                          d={`M ${isoX + size} ${isoY + size*0.25} L ${isoX + size * 1.5} ${isoY - size*0.1} L ${isoX + size * 1.5} ${isoY + size*0.75} L ${isoX + size} ${isoY + size*1.1} Z`}
                          fill="#1d4ed8"
                          stroke="#1e40af"
                          strokeWidth="1"
                        />
                        {/* Πάνω Έδρα Κύβου */}
                        <path
                          d={`M ${isoX} ${isoY} L ${isoX + size*0.5} ${isoY - size*0.35} L ${isoX + size * 1.5} ${isoY - size*0.1} L ${isoX + size} ${isoY + size*0.25} Z`}
                          fill="#60a5fa"
                          stroke="#2563eb"
                          strokeWidth="1"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Βοηθητικές ενδείξεις διαστάσεων */}
              <div className="w-full flex justify-center gap-4 text-xs font-black text-slate-400 mt-6 pt-4 border-t border-gray-50 text-center">
                <span className="text-blue-600">↔️ Μήκος: 4</span>
                <span className="text-indigo-700">↗️ Πλάτος: 3</span>
                <span className="text-sky-500">⬆️ Ύψος: 3</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Όγκου.</p>
      </footer>
    </div>
  );
}
