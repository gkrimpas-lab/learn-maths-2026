import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Όριο τιμής μεταβλητής για το εργαστήριο
const MAX_X_VAL = 50;

const PRESET_EXPRESSIONS = [
  { a: 2, b: 3, op: '+', label: "2x ＋ 3" },
  { a: 3, b: 5, op: '+', label: "3x ＋ 5" },
  { a: 4, b: 2, op: '-', label: "4x － 2" },
  { a: 5, b: 10, op: '+', label: "5x ＋ 10" },
  { a: 1, b: 7, op: '+', label: "x ＋ 7" },
  { a: 6, b: 4, op: '-', label: "6x － 4" }
];

export default function MetablitiPage() {
  // Τιμή της μεταβλητής x
  const [xVal, setXVal] = useState(4);

  // Παράμετροι της αλγεβρικής παράστασης: a * x (op) b
  const [coeffA, setCoeffA] = useState(2);
  const [constantB, setConstantB] = useState(3);
  const [operator, setOperator] = useState('+'); // '+' ή '-'

  // Χειρισμός αλλαγής x
  const handleXChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setXVal('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_X_VAL) return;
    setXVal(n);
  };

  const adjustX = (amount) => {
    setXVal(prev => Math.max(0, Math.min(MAX_X_VAL, (Number(prev) || 0) + amount)));
  };

  // Ενεργή τιμή x
  const activeX = xVal === '' ? 0 : Number(xVal);

  // Υπολογισμός τιμής παράστασης
  const termAx = coeffA * activeX;
  const resultVal = operator === '+' ? termAx + constantB : Math.max(0, termAx - constantB);

  // Δημιουργία πίνακα τιμών για x = 1, 2, 3, 4, 5
  const tableValues = [1, 2, 3, 4, 5].map(v => ({
    x: v,
    val: operator === '+' ? coeffA * v + constantB : coeffA * v - constantB
  }));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔤 Η Έννοια της Μεταβλητής - LearnMaths.gr</title>
        <meta name="description" content="Διαδραστική θεωρία για την έννοια της μεταβλητής, τις αλγεβρικές παραστάσεις και τον υπολογισμό αριθμητικής τιμής για τη ΣΤ' Δημοτικού." />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 w-full">
          <div className={`${LAYOUT.CONTAINER} py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight flex items-center">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/st-dimotikou/32-metabliti-ask"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs md:text-sm font-black transition shadow-sm flex items-center gap-1.5"
              >
                <span>🎯</span> Ασκήσεις
              </Link>
              <Link
                href="/st-dimotikou"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition"
              >
                🔙 ΣΤ' Δημοτικού
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. MAIN LESSON CONTAINER */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-8 md:py-12 space-y-10`}>

          {/* HERO BANNER WITH PROMO CALLOUT CARD */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    🎓 ΣΤ' Δημοτικου
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενοτητα 32
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  32. Η Έννοια της Μεταβλητής και Αλγεβρικές Παραστάσεις
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε τι είναι η <strong>μεταβλητή (x, y, a)</strong>, πώς ένα γράμμα παίρνει τη θέση ενός αγνώστου ή μεταβαλλόμενου αριθμού και πώς υπολογίζουμε την <strong>αριθμητική τιμή</strong> μιας μαθηματικής έκφρασης!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις διαδραστικές ασκήσεις στην έννοια της μεταβλητής!</p>
                <Link
                  href="/st-dimotikou/32-metabliti-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-black text-slate-900">Τι είναι η Μεταβλητή;</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  <strong>Μεταβλητή</strong> είναι ένα γράμμα (συνήθως <strong>x, y, α, β</strong>) που χρησιμοποιούμε για να παραστήσουμε μια ποσότητα που <strong>αλλάζει τιμή</strong> ή είναι <strong>άγνωστη</strong>.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                  x ＝ ηλικία, απόσταση, κόστος...
                </span>
              </div>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900">Αλγεβρική Παράσταση</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Είναι μια μαθηματική έκφραση που περιέχει <strong>αριθμούς, πράξεις και μεταβλητές</strong>. Συνήθως παραλείπουμε το σύμβολο του πολλαπλασιασμού: <strong>2x ＝ 2 × x</strong>.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                  2x ＋ 3,  5x － 4,  x/2
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900">Αριθμητική Τιμή</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Για να βρούμε την <strong>αριθμητική τιμή</strong>, αντικαθιστούμε το γράμμα με τον δοσμένο αριθμό και κάνουμε τις πράξεις με την προτεραιότητά τους.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-900">
                  Αν x ＝ 4 ➔ 2×4 ＋ 3 ＝ <strong className="text-emerald-700">11</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο: Η Μηχανή της Μεταβλητής
                </h2>
                <p className="text-gray-500 text-sm">
                  Άλλαξε την τιμή του x, διάλεξε έκφραση και δες πώς η μηχανή αντικαθιστά το γράμμα και υπολογίζει το τελικό αποτέλεσμα!
                </p>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* ΡΥΘΜΙΣΗ ΜΕΤΑΒΛΗΤΗΣ X */}
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-blue-800 tracking-wider">
                        🔤 Τιμή Μεταβλητής (x)
                      </span>
                      <span className="text-xs font-mono font-black text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                        x ＝ {activeX}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => adjustX(-1)} 
                        className="w-10 py-1.5 bg-white hover:bg-slate-100 text-blue-700 font-black rounded-xl border border-slate-200 text-base shadow-xs"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={activeX}
                        onChange={(e) => setXVal(Number(e.target.value))}
                        className="flex-1 accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                      />
                      <button 
                        type="button" 
                        onClick={() => adjustX(1)} 
                        className="w-10 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-base shadow-md"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>x = 0</span>
                      <span>x = 10</span>
                      <span>x = 20</span>
                    </div>
                  </div>

                  {/* ΠΑΡΑΜΕΤΡΟΠΟΙΗΣΗ ΕΚΦΡΑΣΗΣ (a * x ± b) */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                    <span className="text-xs font-black text-slate-700 tracking-wider block">
                      ⚙️ Παράσταση: a · x ± b
                    </span>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400">Συντελεστής (a)</span>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => setCoeffA(prev => Math.max(1, prev - 1))} className="px-1.5 text-xs font-black text-slate-600">-</button>
                          <span className="w-full text-center font-mono font-black text-sm text-indigo-600">{coeffA}</span>
                          <button type="button" onClick={() => setCoeffA(prev => Math.min(10, prev + 1))} className="px-1.5 text-xs font-black text-indigo-600">+</button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400">Πράξη</span>
                        <button 
                          type="button" 
                          onClick={() => setOperator(prev => prev === '+' ? '-' : '+')}
                          className="w-full py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-xl border border-slate-200 text-sm"
                        >
                          {operator === '+' ? '＋' : '－'}
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400">Σταθερά (b)</span>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => setConstantB(prev => Math.max(0, prev - 1))} className="px-1.5 text-xs font-black text-slate-600">-</button>
                          <span className="w-full text-center font-mono font-black text-sm text-indigo-600">{constantB}</span>
                          <button type="button" onClick={() => setConstantB(prev => Math.min(20, prev + 1))} className="px-1.5 text-xs font-black text-indigo-600">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PRESET EXPRESSIONS */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Ετοιμες Παραστασεις:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_EXPRESSIONS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCoeffA(p.a);
                            setConstantB(p.b);
                            setOperator(p.op);
                          }}
                          className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center ${
                            coeffA === p.a && constantB === p.b && operator === p.op
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Συμβουλή:</strong> Όταν αλλάζει η τιμή του <strong>x</strong>, αλλάζει αυτόματα και η τελική τιμή της παράστασης!
                </div>
              </div>

              {/* RIGHT: FUNCTION MACHINE & VALUE TABLE (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
                
                {/* 1. Η ΜΗΧΑΝΗ ΥΠΟΛΟΓΙΣΜΟΥ (FUNCTION MACHINE VISUAL) */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-inner space-y-4">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block text-center">
                    ⚙️ Μηχανη Αντικαταστασης και Υπολογισμου:
                  </span>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                    
                    {/* Είσοδος (Input x) */}
                    <div className="bg-blue-100 border-2 border-blue-400 p-4 rounded-2xl flex flex-col items-center min-w-[120px] shadow-sm">
                      <span className="text-[10px] font-black text-blue-800 tracking-wider">Είσοδος (x)</span>
                      <span className="text-4xl font-mono font-black text-blue-700 mt-1">{activeX}</span>
                    </div>

                    <span className="text-2xl text-slate-400 font-black">➔</span>

                    {/* Εσωτερικό Μηχανής (Formula) */}
                    <div className="bg-gradient-to-br from-indigo-700 to-purple-800 text-white p-5 rounded-3xl shadow-xl flex-1 max-w-md border border-indigo-500">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 block mb-1">
                        Εκτελεση Πραξεων
                      </span>
                      <div className="font-mono text-xl sm:text-2xl font-black tracking-wide">
                        {coeffA} × <span className="text-amber-300 underline underline-offset-4">{activeX}</span> {operator === '+' ? '＋' : '－'} {constantB}
                      </div>
                      <div className="text-xs text-indigo-200 font-mono mt-2 pt-2 border-t border-indigo-500/50">
                        ＝ {termAx} {operator === '+' ? '＋' : '－'} {constantB}
                      </div>
                    </div>

                    <span className="text-2xl text-slate-400 font-black">➔</span>

                    {/* Έξοδος (Result Value) */}
                    <div className="bg-emerald-100 border-2 border-emerald-400 p-4 rounded-2xl flex flex-col items-center min-w-[120px] shadow-sm">
                      <span className="text-[10px] font-black text-emerald-800 tracking-wider">Έξοδος (Τιμή)</span>
                      <span className="text-4xl font-mono font-black text-emerald-700 mt-1">{resultVal}</span>
                    </div>

                  </div>
                </div>

                {/* 2. ΔΥΝΑΜΙΚΟΣ ΠΙΝΑΚΑΣ ΤΙΜΩΝ (TABLE OF VALUES) */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black text-slate-500 tracking-wider block">
                      📊 Πίνακας Τιμών για την Παράσταση: <strong className="text-indigo-600 font-mono">{coeffA}x {operator} {constantB}</strong>
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      x ＝ 1 έως 5
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-center">
                    {tableValues.map((row) => (
                      <div 
                        key={row.x}
                        className={`p-3 rounded-2xl border transition-all ${
                          activeX === row.x 
                            ? 'bg-indigo-50 border-indigo-400 shadow-md ring-2 ring-indigo-400 scale-105' 
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-slate-400">Αν x = {row.x}</div>
                        <div className="font-mono text-lg font-black text-slate-800 mt-0.5">{row.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
                <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                  💡 Συμπέρασμα: Για <strong>x ＝ {activeX}</strong>, η αριθμητική τιμή της παράστασης <strong>{coeffA}x {operator} {constantB}</strong> ισούται με <strong>{resultVal}</strong>!
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Κατάλαβες πώς λειτουργεί η μεταβλητή και πώς υπολογίζουμε την τιμή μιας παράστασης; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/32-metabliti-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* 6. GLOBAL FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
