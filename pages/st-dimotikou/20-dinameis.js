import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Όρια εισαγωγής για να είναι εφικτή η οπτική/γραφική αναπαράσταση
const MAX_BASE = 10;
const MAX_EXPONENT = 5;

export default function DinameisPage() {
  const [base, setBase] = useState(3);
  const [exponent, setExponent] = useState(2);

  const handleBaseChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setBase('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_BASE) return; // Κλείδωμα εισόδου
    setBase(n);
  };

  const handleExponentChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setExponent('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_EXPONENT) return; // Κλείδωμα εισόδου
    setExponent(n);
  };

  const activeBase = base || 0;
  const activeExponent = exponent === '' ? 0 : exponent;
  const result = Math.pow(activeBase, activeExponent);

  const multiplicationSteps = () => {
    if (activeExponent === 0) return "1 (Κάθε αριθμός υψωμένος στο 0 ισούται με 1)";
    if (activeExponent === 1) return `${activeBase}`;
    return Array(activeExponent).fill(activeBase).join(" · ");
  };

  const renderVisualRepresentation = () => {
    if (activeBase === 0) {
      return <div className="text-slate-400 italic py-8">Το αποτέλεσμα είναι 0.</div>;
    }
    if (activeExponent === 0) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="w-16 h-16 bg-amber-400 text-slate-900 rounded-2xl flex items-center justify-center font-black text-2xl shadow-md border-2 border-amber-300">
            1
          </div>
        </div>
      );
    }

    // 1D Αναπαράσταση (Εκθέτης = 1)
    if (activeExponent === 1) {
      return (
        <div className="space-y-4 py-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Μονοδιάστατη γραμμή ({activeBase} μονάδες):</span>
          <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
            {Array.from({ length: activeBase }).map((_, i) => (
              <div 
                key={i} 
                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm border border-blue-400 flex items-center justify-center text-white font-mono text-[10px] font-bold"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 2D Αναπαράσταση (Τετράγωνο - Εκθέτης = 2) - ΠΛΕΓΜΑ ΕΜΒΑΔΟΥ
    if (activeExponent === 2) {
      return (
        <div className="space-y-4 py-4">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">📐 Εμβαδόν Τετραγώνου ({activeBase} × {activeBase} = {result} τετραγωνάκια):</span>
          <div 
            className="grid gap-1 p-2 bg-slate-900 rounded-2xl border-4 border-slate-950 mx-auto shadow-inner"
            style={{ 
              gridTemplateColumns: `repeat(${activeBase}, minmax(0, 1fr))`,
              width: `${Math.min(activeBase * 38, 340)}px`
            }}
          >
            {Array.from({ length: result }).map((_, i) => (
              <div 
                key={i} 
                className="aspect-square bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md border border-blue-400/30 flex items-center justify-center text-[10px] text-white font-mono font-bold"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 3D Αναπαράσταση (Κύβος - Εκθέτης = 3) - ΠΛΗΡΩΣ ΔΥΝΑΜΙΚΟΣ, ΚΕΝΤΡΑΡΙΣΜΕΝΟΣ ΚΑΙ ΠΡΟΣΑΡΜΟΣΜΕΝΟΣ ΣΤΑ ΟΡΙΑ
    if (activeExponent === 3) {
      const N = activeBase;

      // ΔΥΝΑΜΙΚΟ ΜΕΓΕΘΟΣ: Μικραίνουμε το μέγεθος (size) όσο μεγαλώνει η βάση (N) για να μη βγαίνει ποτέ εκτός!
      let size = 16;
      if (N > 4) size = 12;
      if (N > 7) size = 9;

      // Υπολογισμός ορίων SVG με βάση το δυναμικό size
      const svgW = (N * 2) * size * 0.866 + 40;
      const svgH = N * size + (N * 2) * size * 0.5 + 40;

      // Υπολογισμός του origin για τέλεια τοποθέτηση στο κέντρο του SVG
      const originX = svgW / 2;
      const originY = svgH - 20 - (N * size * 0.5);

      const isoX = (x, y, z) => originX + (x - y) * size * 0.866;
      const isoY = (x, y, z) => originY + (x + y) * size * 0.5 - z * size;

      const cubes = [];
      for (let z = 0; z < N; z++) {
        for (let y = 0; y < N; y++) {
          for (let x = 0; x < N; x++) {
            const cx = isoX(x, y, z);
            const cy = isoY(x, y, z);

            const topFace = `${cx},${cy} ${cx + size * 0.866},${cy + size * 0.5} ${cx},${cy + size} ${cx - size * 0.866},${cy + size * 0.5}`;
            const leftFace = `${cx - size * 0.866},${cy + size * 0.5} ${cx},${cy + size} ${cx},${cy + size + size} ${cx - size * 0.866},${cy + size * 0.5 + size}`;
            const rightFace = `${cx},${cy + size} ${cx + size * 0.866},${cy + size * 0.5} ${cx + size * 0.866},${cy + size * 0.5 + size} ${cx},${cy + size + size}`;

            cubes.push(
              <g key={`${x}-${y}-${z}`}>
                <polygon points={topFace} className="fill-purple-300 stroke-purple-600/60 stroke-[0.5]" />
                <polygon points={leftFace} className="fill-purple-400 stroke-purple-600/60 stroke-[0.5]" />
                <polygon points={rightFace} className="fill-purple-500 stroke-purple-600/60 stroke-[0.5]" />
              </g>
            );
          }
        }
      }

      return (
        <div className="space-y-4 py-4 w-full">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">📦 Όγκος Κύβου ({activeBase} × {activeBase} × {activeBase} = {result} κυβάκια):</span>
          
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 flex items-center justify-center shadow-inner min-h-[260px]">
            <svg 
              viewBox={`0 0 ${svgW} ${svgH}`} 
              width="100%" 
              style={{ maxWidth: '300px', height: 'auto' }}
              className="overflow-visible"
            >
              {cubes}
            </svg>
          </div>
        </div>
      );
    }

    // 4η και 5η Δύναμη -> Αλυσίδα Εκθετικής Μεγέθυνσης
    return (
      <div className="space-y-4 py-4">
        <span className="text-xs font-bold text-pink-500 uppercase tracking-wider block">📈 Εκθετική Μεγέθυνση (Αλυσίδα Πολλαπλασιασμού):</span>
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center font-mono">
            {Array.from({ length: activeExponent }).map((_, i) => {
              const currentPower = Math.pow(activeBase, i + 1);
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex flex-col items-center bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-inner">
                    <span className="text-[10px] text-slate-400 font-bold">Βήμα {i + 1}</span>
                    <span className="text-sm font-black text-pink-500">{activeBase}<sup>{i + 1}</sup></span>
                    <span className="text-xs text-white font-black mt-1">({currentPower})</span>
                  </div>
                  {i < activeExponent - 1 && (
                    <span className="text-slate-500 font-bold">× {activeBase} ➔</span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 italic text-center max-w-md">
            💡 Δες πώς κάθε φορά που μεγαλώνει ο εκθέτης κατά 1, ολόκληρο το προηγούμενο αποτέλεσμα πολλαπλασιάζεται ξανά με τη βάση ({activeBase})!
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚡ Δυνάμεις Φυσικών Αριθμών - LearnMaths.gr</title>
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
          
          {/* SECTION 1: ΘΕΩΡΙΑ ΔΥΝΑΜΕΩΝ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <span>📖</span> Τι είναι η Δύναμη ενός αριθμού;
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    Στα μαθηματικά, όταν θέλουμε να γράψουμε ένα **γινόμενο με πολλούς ίδιους παράγοντες**, χρησιμοποιούμε μια σύντομη γραφή που λέγεται <strong>Δύναμη</strong>.
                  </p>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    Μια δύναμη αποτελείται από δύο αριθμούς:
                  </p>
                  <ul className="list-disc pl-5 text-gray-500 text-xs md:text-sm space-y-1">
                    <li><strong>Βάση:</strong> Ο αριθμός που πολλαπλασιάζεται με τον εαυτό του.</li>
                    <li><strong>Εκθέτης:</strong> Δείχνει πόσες φορές πολλαπλασιάζεται η βάση.</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md space-y-3 flex flex-col justify-center">
                <span className="text-amber-300 font-black text-lg block border-b border-white/20 pb-1">⚡ Πώς το διαβάζουμε;</span>
                <div className="text-xs md:text-sm font-mono space-y-2 leading-relaxed">
                  <p>🔹 5<sup>2</sup> = «5 στη δευτέρα» ή <strong>«5 στο τετράγωνο»</strong> (5 · 5 = 25)</p>
                  <p>🔹 5<sup>3</sup> = «5 στην τρίτη» ή <strong>«5 στον κύβο»</strong> (5 · 5 · 5 = 125)</p>
                  <p>🔹 5<sup>4</sup> = «5 στην τετάρτη» (5 · 5 · 5 · 5 = 625)</p>
                </div>
                <p className="text-[11px] font-bold text-amber-200 pt-2 border-t border-white/10 leading-relaxed">
                  💡 Προσοχή: Το 5<sup>2</sup> ΔΕΝ είναι 5 · 2 = 10, αλλά 5 · 5 = 25!
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΔΥΝΑΜΙΚΑ INPUTS */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 justify-between">
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Φτιάξε τη Δύναμή σου!</h3>
                  <p className="text-gray-500 text-xs">Όριο βάσης: {MAX_BASE} | Όριο εκθέτη: {MAX_EXPONENT}</p>
                </div>

                <div className="space-y-4">
                  {/* INPUT ΓΙΑ ΤΗ ΒΑΣΗ */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-500 uppercase">Βάση (αριθμός)</span>
                      <span className="text-xs font-bold text-blue-600">Έως {MAX_BASE}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setBase(prev => Math.max(0, prev - 1))}
                        className="w-10 h-10 bg-white border border-slate-300 rounded-lg font-black hover:bg-slate-100 active:scale-95 transition-all text-lg"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={base}
                        onChange={(e) => handleBaseChange(e.target.value)}
                        className="flex-1 text-center font-mono font-black text-xl text-blue-600 bg-white border-2 border-blue-200 rounded-lg p-1.5 focus:border-blue-500 outline-none"
                      />
                      <button 
                        onClick={() => setBase(prev => Math.min(MAX_BASE, prev + 1))}
                        className="w-10 h-10 bg-white border border-slate-300 rounded-lg font-black hover:bg-slate-100 active:scale-95 transition-all text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* INPUT ΓΙΑ ΤΟΝ ΕΚΘΕΤΗ */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-500 uppercase">Εκθέτης (δύναμη)</span>
                      <span className="text-xs font-bold text-indigo-600">Έως {MAX_EXPONENT}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setExponent(prev => Math.max(0, prev - 1))}
                        className="w-10 h-10 bg-white border border-slate-300 rounded-lg font-black hover:bg-slate-100 active:scale-95 transition-all text-lg"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={exponent}
                        onChange={(e) => handleExponentChange(e.target.value)}
                        className="flex-1 text-center font-mono font-black text-xl text-indigo-600 bg-white border-2 border-indigo-200 rounded-lg p-1.5 focus:border-indigo-500 outline-none"
                      />
                      <button 
                        onClick={() => setExponent(prev => Math.min(MAX_EXPONENT, prev + 1))}
                        className="w-10 h-10 bg-white border border-slate-300 rounded-lg font-black hover:bg-slate-100 active:scale-95 transition-all text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* ΓΡΗΓΟΡΑ ΚΟΥΜΠΙΑ - PRESETS */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Γρήγορα Παραδείγματα:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setBase(3); setExponent(2); }} className="px-3 py-2 rounded-xl border font-mono font-bold text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all text-center">3 στο τετράγωνο (3²)</button>
                    <button onClick={() => { setBase(4); setExponent(3); }} className="px-3 py-2 rounded-xl border font-mono font-bold text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all text-center">4 στον κύβο (4³)</button>
                    <button onClick={() => { setBase(2); setExponent(5); }} className="px-3 py-2 rounded-xl border font-mono font-bold text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all text-center">2 στην πέμπτη (2⁵)</button>
                    <button onClick={() => { setBase(10); setExponent(2); }} className="px-3 py-2 rounded-xl border font-mono font-bold text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all text-center">Δύναμη του 10 (10²)</button>
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ & ΑΠΟΤΕΛΕΣΜΑ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[500px] space-y-6">
              
              {/* ΟΠΤΙΚΟΣ ΕΞΗΓΗΤΗΣ ΜΑΘΗΜΑΤΙΚΗΣ ΔΟΜΗΣ */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-center">
                <div className="text-center font-mono">
                  <span className="text-sm font-sans text-slate-400 block mb-2 font-bold">Μαθηματική Συμβολή:</span>
                  <div className="inline-flex items-baseline justify-center">
                    <span className="text-6xl font-black text-blue-600">{activeBase}</span>
                    <span className="text-3xl font-black text-indigo-600 self-start -mt-3">{activeExponent}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Η βάση είναι το <span className="text-blue-600 font-bold">{activeBase}</span> και ο εκθέτης είναι το <span className="text-indigo-600 font-bold">{activeExponent}</span>
                  </div>
                </div>
              </div>

              {/* ΓΡΑΦΙΚΗ / ΓΕΩΜΕΤΡΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
              <div className="w-full text-center py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-4">
                {renderVisualRepresentation()}
              </div>

              {/* ΑΝΑΛΥΣΗ ΤΗΣ ΠΡΑΞΗΣ */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2 font-mono">
                <div className="text-xs font-sans text-slate-400 font-bold uppercase tracking-wider">
                  📝 Ανάλυση Πράξης ως Γινόμενο:
                </div>
                <div className="text-base md:text-lg font-black text-slate-100 flex items-center gap-2 flex-wrap">
                  {activeBase}<sup>{activeExponent}</sup> = {multiplicationSteps()} = <span className="text-amber-400 font-black">{result}</span>
                </div>
              </div>

              {/* TΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-lg font-mono flex items-center justify-between">
                <div className="text-left">
                  <span className="text-xs font-sans uppercase tracking-wider text-blue-100 block">Τελικό Αποτέλεσμα:</span>
                  <span className="text-xl md:text-2xl font-black">
                    {activeBase}<sup>{activeExponent}</sup> = {result}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-amber-300 block">💡 Ήξερες ότι:</span>
                  <span className="text-xs font-sans text-slate-200">
                    {activeExponent === 2 ? "Υπολογίζεις το εμβαδόν ενός τετραγώνου!" : activeExponent === 3 ? "Υπολογίζεις τον όγκο ενός κύβου!" : "Κάνεις επαναλαμβανόμενο πολλαπλασισμό!"}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Δυνάμεις Φυσικών Αριθμών - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
