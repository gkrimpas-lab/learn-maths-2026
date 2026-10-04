// pages/st-dimotikou/32-metabliti.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Οριο τιμης μεταβλητης για το εργαστηριο
const MAX_X_VAL = 20;

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale και defensive checks
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

const PRESET_EXPRESSIONS = [
  { a: 2, b: 3, op: '+', label: '2x ＋ 3' },
  { a: 3, b: 5, op: '+', label: '3x ＋ 5' },
  { a: 4, b: 2, op: '-', label: '4x － 2' },
  { a: 5, b: 10, op: '+', label: '5x ＋ 10' },
  { a: 1, b: 7, op: '+', label: 'x ＋ 7' },
  { a: 6, b: 4, op: '-', label: '6x － 4' }
];

export default function MetablitiPage() {
  // Τιμη της μεταβλητης x
  const [xVal, setXVal] = useState(4);

  // Παραμετροι της αλγεβρικης παραστασης: a · x (op) b
  const [coeffA, setCoeffA] = useState(2);
  const [constantB, setConstantB] = useState(3);
  const [operator, setOperator] = useState('+'); // '+' η '-'

  // Χειρισμος αλλαγης x
  const handleXChange = (val) => {
    const clean = String(val).replace(/[^0-9]/g, '');
    if (clean === '') {
      setXVal(0);
      return;
    }
    const n = Math.min(MAX_X_VAL, Math.max(0, Number(clean)));
    setXVal(n);
  };

  const adjustX = (amount) => {
    setXVal(prev => Math.max(0, Math.min(MAX_X_VAL, (Number(prev) || 0) + amount)));
  };

  const adjustCoeffA = (amount) => {
    setCoeffA(prev => Math.max(1, Math.min(10, prev + amount)));
  };

  const adjustConstantB = (amount) => {
    setConstantB(prev => Math.max(0, Math.min(20, prev + amount)));
  };

  const toggleOperator = () => {
    setOperator(prev => (prev === '+' ? '-' : '+'));
  };

  // Ενεργη τιμη x
  const activeX = Number(xVal) || 0;

  // Υπολογισμος τιμης παραστασης
  const termAx = coeffA * activeX;
  const resultVal = operator === '+' ? termAx + constantB : Math.max(0, termAx - constantB);

  // Δημιουργια πινακα τιμων για x = 1, 2, 3, 4, 5
  const tableValues = [1, 2, 3, 4, 5].map(v => ({
    x: v,
    val: operator === '+' ? coeffA * v + constantB : coeffA * v - constantB
  }));

  return (
    <Layout
      title="Η Έννοια της Μεταβλητής - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστική θεωρία για την έννοια της μεταβλητής, τις αλγεβρικές παραστάσεις και τον υπολογισμό αριθμητικής τιμής για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/32-metabliti-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 32 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              32. Η Έννοια της Μεταβλητής και Αλγεβρικές Παραστάσεις
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε τι είναι η <strong>μεταβλητή (x, y, α)</strong>, πώς ένα γράμμα παίρνει τη θέση ενός αγνώστου ή μεταβαλλόμενου αριθμού και πώς υπολογίζουμε την <strong>αριθμητική τιμή</strong> μιας μαθηματικής έκφρασης!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Διαδραστική Μηχανή Υπολογισμού &amp; Δυναμικός Πίνακας Τιμών</span>
            </div>
            <Link
              href="/st-dimotikou/32-metabliti-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (3 COLS) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Βασικές Έννοιες: Μεταβλητές &amp; Αλγεβρικές Παραστάσεις
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την καθημερινή γλώσσα στη γλώσσα της Άλγεβρας και των συμβόλων.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΟΡΙΣΜΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">x, y, α, β</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι η Μεταβλητή;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Μεταβλητή</strong> είναι ένα γράμμα (συνήθως <strong>x, y, α, β</strong>) που χρησιμοποιούμε για να παραστήσουμε μια ποσότητα που <strong>αλλάζει τιμή</strong> ή είναι <strong>άγνωστη</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>x ＝ ηλικία, απόσταση, κόστος...</p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το ίδιο γράμμα x μπορεί να πάρει διαφορετικές τιμές ανάλογα με την περίπτωση (π.χ. x ＝ 1, x ＝ 5, x ＝ 10).
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΕΚΦΡΑΣΗ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">2x ＝ 2 · x</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Αλγεβρική Παράσταση
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Είναι μια μαθηματική έκφραση που περιέχει <strong>αριθμούς, πράξεις και μεταβλητές</strong>. Συνήθως παραλείπουμε το σύμβολο του πολλαπλασιασμού: <strong>2x ＝ 2 · x</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>2x ＋ 3, 5x － 4, x/2</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Στην έκφραση 2x ＋ 3, το 2 ονομάζεται συντελεστής του x και το 3 σταθερός όρος!
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΥΠΟΛΟΓΙΣΜΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">Αντικατάσταση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Αριθμητική Τιμή
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για να βρούμε την <strong>αριθμητική τιμή</strong>, αντικαθιστούμε το γράμμα με τον δοσμένο αριθμό και κάνουμε τις πράξεις με την προτεραιότητά τους.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>Αν x ＝ 4 ➔ 2 · 4 ＋ 3 ＝ <strong className="text-emerald-700">11</strong></p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🎯 Πρώτα εκτελούμε τον πολλαπλασιασμό του συντελεστή με το x και μετά την πρόσθεση ή αφαίρεση!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Η Μηχανή της Μεταβλητής &amp; Υπολογισμός Αριθμητικής Τιμής
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-1">
              Άλλαξε την τιμή του x, διάλεξε έκφραση και δες πώς η μηχανή αντικαθιστά το γράμμα και υπολογίζει το τελικό αποτέλεσμα!
            </p>
          </div>

          {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-3.5 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between overflow-hidden">
              <div className="space-y-4">
                
                {/* ΡΥΘΜΙΣΗ ΜΕΤΑΒΛΗΤΗΣ X */}
                <div className="bg-blue-50/60 p-3 sm:p-4 rounded-2xl border border-blue-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-blue-800 tracking-wider uppercase">
                      🔤 ΤΙΜΗ ΜΕΤΑΒΛΗΤΗΣ (x)
                    </span>
                    <span className="text-xs font-mono font-black text-blue-600 bg-white px-2.5 py-1 rounded-xl border border-blue-200 shadow-xs">
                      x ＝ {activeX}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center gap-2 w-full">
                    <button 
                      type="button" 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustX(-1); }} 
                      className="w-9 h-9 bg-white hover:bg-slate-100 text-blue-700 font-black rounded-xl border border-slate-200 text-base shadow-xs flex items-center justify-center touch-manipulation active:scale-95 transition"
                    >
                      －
                    </button>
                    <input
                      key={`var-range-x-${activeX}`}
                      id="var-range-x"
                      name="varRangeX"
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={activeX}
                      onChange={(e) => handleXChange(e.target.value)}
                      className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer h-2.5 bg-slate-200 rounded-lg block touch-manipulation"
                    />
                    <button 
                      type="button" 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustX(1); }} 
                      className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-base shadow-md flex items-center justify-center touch-manipulation active:scale-95 transition"
                    >
                      ＋
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
                    <span>x ＝ 0</span>
                    <span>x ＝ 10</span>
                    <span>x ＝ 20</span>
                  </div>
                </div>

                {/* ΠΑΡΑΜΕΤΡΟΠΟΙΗΣΗ ΕΚΦΡΑΣΗΣ (a · x ± b) */}
                <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                  <span className="text-xs font-black text-slate-700 tracking-wider block uppercase">
                    ⚙️ ΠΑΡΑΣΤΑΣΗ: a · x ± b
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {/* Συντελεστής (a) */}
                    <div className="flex flex-col justify-between space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 h-7 flex items-center justify-center leading-tight uppercase">
                        ΣΥΝΤΕΛΕΣΤΗΣ (a)
                      </span>
                      <div className="flex items-center justify-between bg-slate-50 p-1 rounded-xl border border-slate-200 h-10">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustCoeffA(-1); }} 
                          className="w-6 h-full flex items-center justify-center text-xs font-black text-slate-600 hover:bg-slate-200 rounded-lg touch-manipulation active:scale-95 transition"
                        >
                          －
                        </button>
                        <span className="font-mono font-black text-sm text-indigo-600">{coeffA}</span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustCoeffA(1); }} 
                          className="w-6 h-full flex items-center justify-center text-xs font-black text-indigo-600 hover:bg-slate-200 rounded-lg touch-manipulation active:scale-95 transition"
                        >
                          ＋
                        </button>
                      </div>
                    </div>

                    {/* Πράξη (op) */}
                    <div className="flex flex-col justify-between space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 h-7 flex items-center justify-center leading-tight uppercase">
                        ΠΡΑΞΗ (±)
                      </span>
                      <button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleOperator(); }} 
                        className="w-full h-10 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black rounded-xl border border-indigo-200 text-base flex items-center justify-center touch-manipulation active:scale-95 transition shadow-xs"
                      >
                        {operator === '+' ? '＋' : '－'}
                      </button>
                    </div>

                    {/* Σταθερά (b) */}
                    <div className="flex flex-col justify-between space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 h-7 flex items-center justify-center leading-tight uppercase">
                        ΣΤΑΘΕΡΑ (b)
                      </span>
                      <div className="flex items-center justify-between bg-slate-50 p-1 rounded-xl border border-slate-200 h-10">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustConstantB(-1); }} 
                          className="w-6 h-full flex items-center justify-center text-xs font-black text-slate-600 hover:bg-slate-200 rounded-lg touch-manipulation active:scale-95 transition"
                        >
                          －
                        </button>
                        <span className="font-mono font-black text-sm text-indigo-600">{constantB}</span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustConstantB(1); }} 
                          className="w-6 h-full flex items-center justify-center text-xs font-black text-indigo-600 hover:bg-slate-200 rounded-lg touch-manipulation active:scale-95 transition"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PRESET EXPRESSIONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    ΕΤΟΙΜΕΣ ΠΑΡΑΣΤΑΣΕΙΣ:
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
                        className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center touch-manipulation active:scale-95 ${
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

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                💡 <strong>Συμβουλή:</strong> Όταν αλλάζει η τιμή του <strong>x</strong>, αλλάζει αυτόματα και η τελική τιμή της παράστασης!
              </div>
            </div>

            {/* RIGHT: FUNCTION MACHINE & VALUE TABLE (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
              
              {/* 1. Η ΜΗΧΑΝΗ ΥΠΟΛΟΓΙΣΜΟΥ (FUNCTION MACHINE VISUAL) */}
              <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-inner space-y-4">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider block text-center">
                  ⚙️ ΜΗΧΑΝΗ ΑΝΤΙΚΑΤΑΣΤΑΣΗΣ ΚΑΙ ΥΠΟΛΟΓΙΣΜΟΥ:
                </span>

                <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 text-center">
                  
                  {/* Είσοδος (Input x) */}
                  <div className="bg-blue-100 border-2 border-blue-400 p-3.5 sm:p-4 rounded-2xl flex flex-col items-center min-w-[110px] sm:min-w-[120px] shadow-sm">
                    <span className="text-[10px] font-black text-blue-800 tracking-wider uppercase">ΕΙΣΟΔΟΣ (x)</span>
                    <span className="text-3xl sm:text-4xl font-mono font-black text-blue-700 mt-1">{activeX}</span>
                  </div>

                  <span className="text-2xl text-slate-400 font-black">➔</span>

                  {/* Εσωτερικό Μηχανής (Formula) */}
                  <div className="bg-gradient-to-br from-indigo-700 to-purple-800 text-white p-4 sm:p-5 rounded-3xl shadow-xl flex-1 max-w-md border border-indigo-500 w-full">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 block mb-1">
                      ΕΚΤΕΛΕΣΗ ΠΡΑΞΕΩΝ
                    </span>
                    <div className="font-mono text-lg sm:text-2xl font-black tracking-wide">
                      {coeffA} · <span className="text-amber-300 underline underline-offset-4">{activeX}</span> {operator === '+' ? '＋' : '－'} {constantB}
                    </div>
                    <div className="text-xs text-indigo-200 font-mono mt-2 pt-2 border-t border-indigo-500/50">
                      ＝ {termAx} {operator === '+' ? '＋' : '－'} {constantB}
                    </div>
                  </div>

                  <span className="text-2xl text-slate-400 font-black">➔</span>

                  {/* Έξοδος (Result Value) */}
                  <div className="bg-emerald-100 border-2 border-emerald-400 p-3.5 sm:p-4 rounded-2xl flex flex-col items-center min-w-[110px] sm:min-w-[120px] shadow-sm">
                    <span className="text-[10px] font-black text-emerald-800 tracking-wider uppercase">ΕΞΟΔΟΣ (ΤΙΜΗ)</span>
                    <span className="text-3xl sm:text-4xl font-mono font-black text-emerald-700 mt-1">{resultVal}</span>
                  </div>

                </div>
              </div>

              {/* 2. ΔΥΝΑΜΙΚΟΣ ΠΙΝΑΚΑΣ ΤΙΜΩΝ (TABLE OF VALUES) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                  <span className="text-xs font-black text-slate-500 tracking-wider block">
                    📊 ΠΙΝΑΚΑΣ ΤΙΜΩΝ ΓΙΑ ΤΗΝ ΠΑΡΑΣΤΑΣΗ: <strong className="text-indigo-600 font-mono">{coeffA}x {operator === '+' ? '＋' : '－'} {constantB}</strong>
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    x ＝ 1 έως 5
                  </span>
                </div>

                {/* Πλέγμα με 5 κάρτες */}
                <div className="flex flex-wrap justify-center sm:grid sm:grid-cols-5 gap-2 text-center">
                  {tableValues.map((row) => (
                    <div 
                      key={row.x}
                      className={`flex-1 min-w-[58px] sm:min-w-0 p-2 sm:p-3 rounded-2xl border transition-all ${
                        activeX === row.x 
                          ? 'bg-indigo-50 border-indigo-400 shadow-md ring-2 ring-indigo-400 scale-105' 
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 whitespace-nowrap">
                        x ＝ {row.x}
                      </div>
                      <div className="font-mono text-base sm:text-xl font-black text-slate-800 mt-1">
                        {row.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-3.5 sm:p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                💡 ΣΥΜΠΕΡΑΣΜΑ: Για <strong>x ＝ {activeX}</strong>, η αριθμητική τιμή της παράστασης <strong>{coeffA}x {operator === '+' ? '＋' : '－'} {constantB}</strong> ισούται με <strong>{resultVal}</strong>!
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Μεταβλητές!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατάλαβες πώς λειτουργεί η μεταβλητή και πώς υπολογίζουμε την τιμή μιας παράστασης; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/32-metabliti-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase('Έναρξη Ασκήσεων')}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
