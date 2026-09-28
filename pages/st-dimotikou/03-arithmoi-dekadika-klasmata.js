// pages/st-dimotikou/03-arithmoi-dekadika-klasmata.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητικο component εμφανισης κλασματος με οριζοντια γραμμη (καθαρο JSX, οχι LaTeX)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 3) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function MetatropiDekadikaKlasmataPage() {
  const [activeTab, setActiveTab] = useState('toKlasma'); // 'toKlasma' ή 'toDekadiko'
  
  // Κατάσταση για Δεκαδικός -> Κλάσμα
  const [dekadikos, setDekadikos] = useState('0,45');
  
  // Κατάσταση για Κλάσμα -> Δεκαδικός
  const [arithmitis, setArithmitis] = useState(45);
  const [paronomastis, setParonomastis] = useState(100); // 10, 100, 1000

  const presetsDekadikos = [
    { label: '🥛 0,5 λ. (Γάλα)', val: '0,5' },
    { label: '💶 0,75 € (Τιμή)', val: '0,75' },
    { label: '📏 0,125 μ. (Μήκος)', val: '0,125' },
    { label: '⚖️ 0,8 κιλά (Μέλι)', val: '0,8' }
  ];

  // Υπολογισμοί για Δεκαδικό -> Κλάσμα
  const sanitizedDekadikos = dekadikos.replace(',', '.');
  const cleanDekadikos = parseFloat(sanitizedDekadikos) || 0;
  const parts = sanitizedDekadikos.split('.');
  const decPart = parts[1] || '';
  const numDigits = Math.max(1, Math.min(decPart.length, 3));
  const dynamicDen = Math.pow(10, numDigits);
  const dynamicNum = Math.round(cleanDekadikos * dynamicDen);

  // Τρέχουσες τιμές για το δυναμικό SVG πλέγμα
  const currentDenominator = activeTab === 'toKlasma' ? dynamicDen : paronomastis;
  const currentNumerator = activeTab === 'toKlasma' ? dynamicNum : arithmitis;

  // Σχεδίαση των δυναμικών κουτιών μέσω SVG (300x300)
  const renderGridSquares = () => {
    const squares = [];
    const size = 300;

    if (currentDenominator === 10) {
      const height = size / 10;
      for (let i = 0; i < 10; i++) {
        const isFilled = i < currentNumerator;
        squares.push(
          <rect
            key={i}
            x="0"
            y={i * height}
            width={size}
            height={height}
            className={`transition-colors duration-200 stroke-slate-300 stroke-[1.5] ${isFilled ? 'fill-amber-500' : 'fill-white'}`}
          />
        );
      }
    } else if (currentDenominator === 100) {
      const boxSize = size / 10;
      let count = 0;
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          const isFilled = count < currentNumerator;
          squares.push(
            <rect
              key={count}
              x={c * boxSize}
              y={r * boxSize}
              width={boxSize}
              height={boxSize}
              className={`transition-colors duration-150 stroke-slate-200 stroke-[1] ${isFilled ? 'fill-amber-500' : 'fill-white'}`}
            />
          );
          count++;
        }
      }
    } else {
      const rows = 25;
      const cols = 40;
      const boxW = size / cols;
      const boxH = size / rows;
      let count = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isFilled = count < currentNumerator;
          squares.push(
            <rect
              key={count}
              x={c * boxW}
              y={r * boxH}
              width={boxW}
              height={boxH}
              className={`transition-colors duration-100 stroke-slate-100/40 stroke-[0.3] ${isFilled ? 'fill-amber-500' : 'fill-white'}`}
            />
          );
          count++;
        }
      }
    }
    return squares;
  };

  const getGridLabel = () => {
    if (currentDenominator === 10) return 'δέκατα';
    if (currentDenominator === 100) return 'εκατοστά';
    return 'χιλιοστά';
  };

  return (
    <Layout
      title="Μετατροπή Δεκαδικών και Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς κάθε δεκαδικός αριθμός γράφεται ως δεκαδικό κλάσμα και το αντίστροφο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/03-arithmoi-dekadika-klasmata-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 3 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Μετατροπή Δεκαδικών &amp; Κλασμάτων
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς κάθε δεκαδικός αριθμός γράφεται ως <strong>δεκαδικό κλάσμα</strong> και το αντίστροφο, ανακαλύπτοντας τον κανόνα των μηδενικών και της υποδιαστολής!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Κανόνες Μετατροπής &amp; Διαδραστικό Γεωμετρικό Πλέγμα Μονάδας</span>
            </div>
            <Link
              href="/st-dimotikou/03-arithmoi-dekadika-klasmata-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Κανόνες Μετατροπής σε 3 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Η άμεση σχέση μεταξύ των δεκαδικών ψηφίων και των μηδενικών του παρονομαστή.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Δεκαδικός σε Κλάσμα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Από Δεκαδικό σε Κλάσμα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στον <strong>αριθμητή</strong> γράφουμε τον αριθμό χωρίς την υποδιαστολή. Στον <strong>παρονομαστή</strong> βάζουμε το 1 με τόσα μηδενικά όσα τα δεκαδικά ψηφία.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center flex items-center justify-center gap-3 font-bold">
                  <span className="text-blue-700 text-base">0,75</span>
                  <span className="text-slate-400">➔</span>
                  <div className="flex items-center text-emerald-800 text-base">
                    <Fraction num="75" den="100" />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 2 δεκαδικά ψηφία σημαίνουν παρονομαστή το 100 (εκατοστά).
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Κλάσμα σε Δεκαδικό</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Από Κλάσμα σε Δεκαδικό
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Γράφουμε τον αριθμητή και χωρίζουμε με <strong>υποδιαστολή από δεξιά προς τα αριστερά</strong> τόσα ψηφία όσα είναι τα μηδενικά του παρονομαστή (10, 100, 1.000).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center flex items-center justify-center gap-3 font-bold">
                  <div className="flex items-center text-emerald-800 text-base">
                    <Fraction num="6" den="100" />
                  </div>
                  <span className="text-slate-400">➔</span>
                  <span className="text-indigo-700 text-base">0,06</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Αν δεν φτάνουν τα ψηφία του αριθμητή, προσθέτουμε μηδενικά στα αριστερά!
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Η Ακέραιη Μονάδα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μονάδα &amp; Υποδιαιρέσεις
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Το δεκαδικό κλάσμα δείχνει σε πόσα ίσα μέρη χωρίστηκε η ακέραιη μονάδα (10, 100 ή 1.000) και πόσα από αυτά πήραμε.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-mono text-center font-bold flex flex-wrap items-center justify-center gap-1.5">
                  <span>1 Μονάδα ＝</span>
                  <Fraction num="10" den="10" />
                  <span>＝</span>
                  <Fraction num="100" den="100" />
                  <span>＝</span>
                  <Fraction num="1.000" den="1.000" />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 Όταν αριθμητής και παρονομαστής είναι ίσοι, το κλάσμα ισούται ακριβώς με 1.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΜΕΤΑΤΡΟΠΩΝ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικός Μετατροπέας Δεκαδικών &amp; Κλασμάτων
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Επίλεξε κατεύθυνση μετατροπής, δοκίμασε αριθμούς και παρατήρησε το δυναμικό πλέγμα της μονάδας!
              </p>
            </div>

            {/* TABS ΕΝΑΛΛΑΓΗΣ */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('toKlasma')}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center touch-manipulation active:scale-95 ${
                  activeTab === 'toKlasma' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔢 Δεκαδικός ➔ Κλάσμα
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('toDekadiko')}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center touch-manipulation active:scale-95 ${
                  activeTab === 'toDekadiko' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🍕 Κλάσμα ➔ Δεκαδικός
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* ROW 1: INPUTS & DYNAMIC READOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
              
              {/* 1. INPUT CARD */}
              <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-inner flex flex-col justify-center">
                {activeTab === 'toKlasma' ? (
                  <>
                    <div className="flex justify-between items-center">
                      <label className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                        Πληκτρολόγησε Δεκαδικό (0 έως 1):
                      </label>
                      <span className="text-[11px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        έως 3 δεκαδικά
                      </span>
                    </div>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={dekadikos}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\./g, ',').replace(/[^0-9,]/g, '');
                        if (val.startsWith(',')) val = '0' + val;
                        const commaParts = val.split(',');
                        if ((val.match(/,/g) || []).length <= 1 && (!commaParts[1] || commaParts[1].length <= 3)) {
                          const numCheck = parseFloat(val.replace(',', '.'));
                          if (isNaN(numCheck) || numCheck <= 1) {
                            setDekadikos(val);
                          }
                        }
                      }}
                      className="text-xl sm:text-2xl md:text-3xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all w-full tracking-wider text-blue-600 font-mono"
                      placeholder="π.χ. 0,45"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {presetsDekadikos.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setDekadikos(p.val)}
                          className="bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 transition shadow-sm touch-manipulation active:scale-95"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs 2xl:text-sm font-black text-slate-600 uppercase tracking-wider">Αριθμητης:</span>
                        <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-44 gap-2">
                          <button
                            type="button"
                            aria-label="Μείωση αριθμητή"
                            onClick={() => setArithmitis(Math.max(0, arithmitis - 1))}
                            className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                          >
                            －
                          </button>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={arithmitis}
                            onChange={(e) => {
                              const clean = e.target.value.replace(/[^0-9]/g, '');
                              let val = parseInt(clean, 10);
                              if (isNaN(val)) val = 0;
                              if (val >= 0 && val <= paronomastis) {
                                setArithmitis(val);
                              }
                            }}
                            className="w-full text-center font-black text-base sm:text-lg text-emerald-700 bg-white border border-slate-300 rounded-xl py-1.5 focus:border-emerald-500 outline-none shadow-sm font-mono"
                          />
                          <button
                            type="button"
                            aria-label="Αύξηση αριθμητή"
                            onClick={() => setArithmitis(Math.min(paronomastis, arithmitis + 1))}
                            className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                          >
                            ＋
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-200">
                        <span className="text-xs 2xl:text-sm font-black text-slate-600 uppercase tracking-wider">Παρονομαστης:</span>
                        <div className="flex gap-2">
                          {[10, 100, 1000].map((den) => (
                            <button
                              key={den}
                              type="button"
                              onClick={() => {
                                setParonomastis(den);
                                if (arithmitis > den) setArithmitis(den);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all touch-manipulation active:scale-95 ${
                                paronomastis === den
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {den}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 2. DYNAMIC READOUT */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-md flex flex-col justify-center items-center text-center">
                <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-wider block">
                  ✨ Αποτελεσμα Μετατροπης:
                </span>
                
                {activeTab === 'toKlasma' ? (
                  <div className="flex items-center justify-center gap-3 sm:gap-4 text-xl sm:text-2xl md:text-3xl font-black font-mono flex-wrap">
                    <span className="bg-white/10 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-white">
                      {dekadikos || '0'}
                    </span>
                    <span className="text-amber-400">➔</span>
                    <div className="inline-flex items-center bg-white/10 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-xl text-emerald-400">
                      <Fraction num={dynamicNum} den={dynamicDen} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 sm:gap-4 text-xl sm:text-2xl md:text-3xl font-black font-mono flex-wrap">
                    <div className="inline-flex items-center bg-white/10 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-xl text-emerald-400">
                      <Fraction num={arithmitis} den={paronomastis} />
                    </div>
                    <span className="text-amber-400">➔</span>
                    <span className="bg-amber-400 text-slate-900 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-md">
                      {formatNum(arithmitis / paronomastis, paronomastis === 10 ? 1 : paronomastis === 100 ? 2 : 3)}
                    </span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
                  {activeTab === 'toKlasma' 
                    ? `${numDigits} δεκαδικά ψηφία ➔ ${numDigits} μηδενικά στον παρονομαστή`
                    : `${paronomastis.toString().length - 1} μηδενικά ➔ ${paronomastis.toString().length - 1} δεκαδικά ψηφία`}
                </p>
              </div>

            </div>

            {/* ROW 2: DYNAMIC SVG UNIT GRID - 100% FLUID ΧΩΡΙΣ SCROLL */}
            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-6 rounded-2xl flex flex-col items-center justify-between space-y-4 sm:space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                  📊 Γεωμετρικο Πλεγμα Ακεραιας Μοναδας
                </span>
                <p className="text-xs sm:text-sm text-slate-500">
                  Η ακέραιη μονάδα (τετράγωνο) χωρισμένη σε <strong className="text-slate-800">{currentDenominator}</strong> ίσα μέρη ({getGridLabel()}).
                </p>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center w-full max-w-[260px] sm:max-w-[280px] aspect-square overflow-hidden">
                <svg 
                  viewBox="0 0 300 300" 
                  className="bg-white rounded-lg w-full h-full select-none"
                >
                  {renderGridSquares()}
                </svg>
              </div>

              <div className="bg-white border border-slate-200 px-4 sm:px-6 py-2.5 rounded-xl shadow-sm text-center">
                <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 tabular-nums">
                  Καλύφθηκαν: <span className="text-amber-600 font-mono text-base sm:text-lg">{currentNumerator}</span> / {currentDenominator} {getGridLabel()}
                </span>
              </div>

              <div className="text-center text-[11px] sm:text-xs font-bold text-slate-400 pt-1">
                <span>🔍 Παρατήρησε πώς αλλάζει το μέγεθος των υποδιαιρέσεων ανάλογα με τον παρονομαστή.</span>
              </div>
            </div>

            {/* ROW 3: ΒΗΜΑ-ΒΗΜΑ ΜΑΘΗΜΑΤΙΚΟΙ ΚΑΝΟΝΕΣ */}
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5 uppercase">
                  🧬 Βημα-Βημα Μαθηματικος Κανονας Μετατροπης
                </span>
                <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                  Πλήρης Εμφάνιση
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-black text-xs sm:text-sm text-blue-800 uppercase tracking-wider block">
                    1. Απο Δεκαδικο σε Κλασμα:
                  </span>
                  <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5">
                    <li>• <strong>0,8</strong> (1 ψηφίο) ➔ <Fraction num="8" den="10" className="text-xs" /> (δέκατα)</li>
                    <li>• <strong>0,45</strong> (2 ψηφία) ➔ <Fraction num="45" den="100" className="text-xs" /> (εκατοστά)</li>
                    <li>• <strong>0,125</strong> (3 ψηφία) ➔ <Fraction num="125" den="1.000" className="text-xs" /> (χιλιοστά)</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-black text-xs sm:text-sm text-emerald-800 uppercase tracking-wider block">
                    2. Απο Κλασμα σε Δεκαδικο:
                  </span>
                  <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5">
                    <li>• <Fraction num="5" den="10" className="text-xs" /> (1 μηδενικό) ➔ <strong>0,5</strong></li>
                    <li>• <Fraction num="7" den="100" className="text-xs" /> (2 μηδενικά) ➔ <strong>0,07</strong> (προσθήκη μηδενικού)</li>
                    <li>• <Fraction num="34" den="1.000" className="text-xs" /> (3 μηδενικά) ➔ <strong>0,034</strong></li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Δεκαδικά Κλάσματα!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατανόησες τη σχέση δεκαδικών αριθμών και δεκαδικών κλασμάτων; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/03-arithmoi-dekadika-klasmata-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
