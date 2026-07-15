import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function DinameisDekaPage() {
  const [exponent, setExponent] = useState(2);

  const activeExponent = exponent === '' ? 0 : Number(exponent);
  const result = Math.pow(10, activeExponent);

  // Δημιουργία των βημάτων πολλαπλασιασμού (π.χ. 10 · 10 · 10)
  const getMultiplicationSteps = () => {
    if (activeExponent === 0) return "1 (Κάθε αριθμός με εκθέτη 0 ισούται με 1)";
    if (activeExponent === 1) return "10";
    return Array(activeExponent).fill(10).join(" · ");
  };

  // Γραφική / Οπτική αναπαράσταση των δυνάμεων του 10 (Base-10 Blocks)
  const renderVisualRepresentation = () => {
    // 10^0 = 1 (Μονάδα: Ένα μικρό κυβάκι)
    if (activeExponent === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-6 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">1 Μονάδα</span>
          <div className="w-8 h-8 bg-amber-400 border border-amber-500 rounded shadow-md flex items-center justify-center text-slate-900 font-bold text-xs">
            1
          </div>
        </div>
      );
    }

    // 10^1 = 10 (Δεκάδα: Μια ράβδος από 10 ενωμένα κυβάκια)
    if (activeExponent === 1) {
      return (
        <div className="flex flex-col items-center justify-center p-6 space-y-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">1 Δεκάδα (10 μονάδες)</span>
          <div className="flex flex-row bg-slate-900 p-2 rounded-lg border border-slate-800 gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className="w-6 h-6 bg-blue-500 border border-blue-400 text-[9px] text-white font-mono flex items-center justify-center font-bold"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 10^2 = 100 (Εκατοντάδα: Ένα επίπεδο πλέγμα 10x10)
    if (activeExponent === 2) {
      return (
        <div className="flex flex-col items-center justify-center p-4 space-y-3 w-full">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">1 Εκατοντάδα (10 × 10 = 100 μονάδες)</span>
          <div 
            className="grid gap-0.5 p-1.5 bg-slate-900 rounded-xl border border-slate-800 mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(10, minmax(0, 1fr))`,
              width: '220px'
            }}
          >
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i} 
                className="aspect-square bg-teal-500 border border-teal-400/30 text-[7px] text-white font-mono flex items-center justify-center font-bold"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 10^3 = 1.000 (Χιλιάδα: Ο τέλειος 3D Ισομετρικός Κύβος 10x10x10)
    if (activeExponent === 3) {
      const N = 10;
      const size = 9; // Μικρό μέγεθος για να χωράει τέλεια ο 10x10x10

      const cos30 = 0.866;
      const sin30 = 0.5;

      const rawCubes = [];
      for (let z = 0; z < N; z++) {
        for (let y = 0; y < N; y++) {
          for (let x = 0; x < N; x++) {
            const rx = (x - y) * size * cos30;
            const ry = (x + y) * size * sin30 - z * size;
            rawCubes.push({ x, y, z, rx, ry });
          }
        }
      }

      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;

      rawCubes.forEach(({ rx, ry }) => {
        const leftPoint = rx - size * cos30;
        const rightPoint = rx + size * cos30;
        const topPoint = ry - size;
        const bottomPoint = ry + size + size * sin30;

        if (leftPoint < minX) minX = leftPoint;
        if (rightPoint > maxX) maxX = rightPoint;
        if (topPoint < minY) minY = topPoint;
        if (bottomPoint > maxY) maxY = bottomPoint;
      });

      const padding = 15;
      const svgW = (maxX - minX) + padding * 2;
      const svgH = (maxY - minY) + padding * 2;

      const shiftX = -minX + padding;
      const shiftY = -minY + padding;

      const cubes = rawCubes.map(({ x, y, z, rx, ry }) => {
        const cx = rx + shiftX;
        const cy = ry + shiftY;

        const topFace = `${cx},${cy} ${cx + size * cos30},${cy + size * sin30} ${cx},${cy + size} ${cx - size * cos30},${cy + size * sin30}`;
        const leftFace = `${cx - size * cos30},${cy + size * sin30} ${cx},${cy + size} ${cx},${cy + size + size} ${cx - size * cos30},${cy + size * sin30 + size}`;
        const rightFace = `${cx},${cy + size} ${cx + size * cos30},${cy + size * sin30} ${cx + size * cos30},${cy + size * sin30 + size} ${cx},${cy + size + size}`;

        return (
          <g key={`${x}-${y}-${z}`}>
            <polygon points={topFace} className="fill-purple-300 stroke-purple-600/30 stroke-[0.3]" />
            <polygon points={leftFace} className="fill-purple-400 stroke-purple-600/30 stroke-[0.3]" />
            <polygon points={rightFace} className="fill-purple-500 stroke-purple-600/30 stroke-[0.3]" />
          </g>
        );
      });

      return (
        <div className="flex flex-col items-center justify-center p-2 space-y-3 w-full">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">1 Χιλιάδα (10 × 10 × 10 = 1.000 κύβοι!)</span>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-center shadow-inner w-full max-w-[280px]">
            <svg 
              viewBox={`0 0 ${svgW} ${svgH}`} 
              width="100%" 
              className="overflow-visible"
            >
              {cubes}
            </svg>
          </div>
        </div>
      );
    }

    // 10^4, 10^5, 10^6 (Μεγάλες Δυνάμεις: Οπτικοποίηση μεγέθους με αλυσίδα/κλίμακα)
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <span className="text-xs font-bold text-pink-500 uppercase tracking-wider">Μεγάλη Κλίμακα (Εκθετική Μεγέθυνση)</span>
        <div className="flex flex-col items-center p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 w-full max-w-sm">
          <span className="text-3xl font-black text-pink-500">{result.toLocaleString('el-GR')}</span>
          <p className="text-[11px] text-slate-300 text-center leading-relaxed">
            Αυτός ο αριθμός αποτελείται από το <strong>1</strong> ακολουθούμενο από <strong>{activeExponent} μηδενικά</strong>!
          </p>
          <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden flex">
            {Array.from({ length: activeExponent }).map((_, i) => (
              <div key={i} className="flex-1 bg-pink-500 border-r border-slate-900 last:border-0" />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔟 Οι Δυνάμεις του 10 - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/st-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-8`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ ΔΥΝΑΜΕΩΝ ΤΟΥ 10 */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span>📖</span> Οι Δυνάμεις με βάση το 10
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                <p>
                  Οι δυνάμεις με βάση το 10 είναι εξαιρετικά χρήσιμες στα Μαθηματικά και την Επιστήμη, γιατί μας βοηθούν να γράφουμε **πολύ μεγάλους αριθμούς** εύκολα και γρήγορα!
                </p>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-2">
                  <span className="text-xs font-black text-blue-800 block uppercase">💡 Ο Χρυσός Κανόνας:</span>
                  <p className="text-xs md:text-sm text-blue-900 leading-relaxed">
                    Κάθε δύναμη του 10 ισούται με το <strong>1</strong> ακολουθούμενο από <strong>τόσα μηδενικά όσα δείχνει ο εκθέτης</strong>!
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md flex flex-col justify-center space-y-3">
                <span className="text-amber-300 font-black text-base block border-b border-white/20 pb-1">⚡ Παραδείγματα:</span>
                <div className="text-xs md:text-sm font-mono space-y-2">
                  <p>🔹 10<sup>1</sup> = 10 <span className="text-slate-300 text-[11px]">(1 μηδενικό)</span></p>
                  <p>🔹 10<sup>2</sup> = 100 <span className="text-slate-300 text-[11px]">(2 μηδενικά - Εκατό)</span></p>
                  <p>🔹 10<sup>3</sup> = 1.000 <span className="text-slate-300 text-[11px]">(3 μηδενικά - Χίλια)</span></p>
                  <p>🔹 10<sup>6</sup> = 1.000.000 <span className="text-slate-300 text-[11px]">(6 μηδενικά - Ένα εκατομμύριο)</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΕΠΙΛΟΓΕΑΣ ΕΚΘΕΤΗ */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Δες τις Δυνάμεις</h3>
                  <p className="text-gray-500 text-xs">Επίλεξε εκθέτη από το 0 έως το 6 για να δεις τη μεταβολή.</p>
                </div>

                {/* SLIDER ΓΙΑ ΤΟΝ ΕΚΘΕΤΗ */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-500 uppercase">Εκθέτης</span>
                    <span className="text-lg font-black text-blue-600 font-mono">10<sup>{activeExponent}</sup></span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={activeExponent}
                    onChange={(e) => setExponent(e.target.value)}
                    className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
                    <span>10⁰</span>
                    <span>10¹</span>
                    <span>10²</span>
                    <span>10³</span>
                    <span>10⁴</span>
                    <span>10⁵</span>
                    <span>10⁶</span>
                  </div>
                </div>

                {/* ΓΡΗΓΟΡΑ ΚΟΥΜΠΙΑ */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Άμεση Επιλογή:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2, 3, 4, 6].map((num) => (
                      <button 
                        key={num}
                        onClick={() => setExponent(num)}
                        className={`py-2 rounded-xl border font-mono font-bold text-xs transition-all ${
                          activeExponent === num 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        10<sup>{num}</sup>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ & ΑΠΟΤΕΛΕΣΜΑ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[500px] space-y-6">
              
              {/* ΜΑΘΗΜΑΤΙΚΗ ΣΥΜΒΟΛΗ */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-center">
                <div className="text-center font-mono">
                  <span className="text-xs font-sans text-slate-400 block mb-2 font-bold uppercase">Μαθηματικός Συμβολισμός:</span>
                  <div className="inline-flex items-baseline justify-center">
                    <span className="text-6xl font-black text-blue-600">10</span>
                    <span className="text-3xl font-black text-indigo-600 self-start -mt-3">{activeExponent}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Η βάση είναι το <span className="text-blue-600 font-bold">10</span> και ο εκθέτης είναι το <span className="text-indigo-600 font-bold">{activeExponent}</span>
                  </div>
                </div>
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
              <div className="w-full text-center py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-4 min-h-[340px] flex items-center justify-center">
                {renderVisualRepresentation()}
              </div>

              {/* ΑΝΑΛΥΣΗ ΠΡΑΞΗΣ */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2 font-mono">
                <div className="text-xs font-sans text-slate-400 font-bold uppercase tracking-wider">
                  📝 Ανάλυση ως Γινόμενο:
                </div>
                <div className="text-base md:text-lg font-black text-slate-100 flex items-center gap-2 flex-wrap">
                  10<sup>{activeExponent}</sup> = {getMultiplicationSteps()} = <span className="text-amber-400 font-black">{result.toLocaleString('el-GR')}</span>
                </div>
              </div>

              {/* ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-lg font-mono flex items-center justify-between">
                <div className="text-left">
                  <span className="text-xs font-sans uppercase tracking-wider text-blue-100 block">Τελική Αξία:</span>
                  <span className="text-xl md:text-2xl font-black">
                    10<sup>{activeExponent}</sup> = {result.toLocaleString('el-GR')}
                  </span>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-amber-300 block">💡 Παρατήρηση:</span>
                  <span className="text-xs font-sans text-slate-200">
                    {activeExponent === 0 
                      ? "Κάθε αριθμός στο μηδέν κάνει 1!" 
                      : `Το 1 ακολουθείται από ${activeExponent} μηδενικά.`}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Δυνάμεις του 10 - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
