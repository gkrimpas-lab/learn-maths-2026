import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function MetatropiDekadikaKlasmataPage() {
  const [activeTab, setActiveTab] = useState('toKlasma'); // 'toKlasma' ή 'toDekadiko'
  
  // Κατάσταση για Δεκαδικός -> Κλάσμα
  const [dekadikos, setDekadikos] = useState("0,45");
  
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
  const decPart = parts[1] || "";
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
            className={`transition-all duration-300 stroke-slate-300 stroke-[1.5] ${isFilled ? 'fill-amber-500' : 'fill-white'}`}
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
              className={`transition-all duration-200 stroke-slate-200 stroke-[1] ${isFilled ? 'fill-amber-500' : 'fill-white'}`}
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
    if (currentDenominator === 10) return "δέκατα";
    if (currentDenominator === 100) return "εκατοστά";
    return "χιλιοστά";
  };

  return (
    <Layout
      title="🔄 3. Μετατροπή Δεκαδικών και Κλασμάτων - LearnMaths.gr"
      description="Μάθε πώς κάθε δεκαδικός αριθμός γράφεται ως δεκαδικό κλάσμα και το αντίστροφο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/03-arithmoi-dekadika-klasmata-ask"
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <span>🎯</span>
          <span>Ασκήσεις</span>
        </Link>
      }
    >
      <div className="space-y-8 md:space-y-10 py-6 md:py-10">

        {/* HERO BANNER WITH PROMO CALLOUT CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  🎓 ΣΤ' Δημοτικού
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενότητα 3
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                3. Μετατροπή Δεκαδικών και Κλασμάτων
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε πώς κάθε δεκαδικός αριθμός γράφεται ως <strong>δεκαδικό κλάσμα</strong> και το αντίστροφο, ανακαλύπτοντας τον κανόνα των μηδενικών και της υποδιαστολής!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-blue-50">Δοκίμασε τις διαδραστικές ασκήσεις με 8 δυναμικά προβλήματα!</p>
              <Link
                href="/st-dimotikou/03-arithmoi-dekadika-klasmata-ask"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* THEORY CARDS (3 COLS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                1
              </div>
              <h3 className="text-lg font-black text-slate-900">Δεκαδικός Αριθμός σε Κλάσμα</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Στον <strong>αριθμητή</strong> γράφουμε τον αριθμό χωρίς την υποδιαστολή. Στον <strong>παρονομαστή</strong> βάζουμε το 1 με τόσα μηδενικά όσα τα δεκαδικά ψηφία.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center flex items-center justify-center gap-3 font-bold">
              <span className="text-blue-700">0,75</span>
              <span className="text-slate-400">➔</span>
              <div className="inline-flex flex-col items-center leading-none">
                <span className="text-emerald-700">75</span>
                <div className="w-8 h-[1.5px] bg-slate-400 my-0.5"></div>
                <span className="text-blue-700">100</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Κλάσμα σε Δεκαδικό Αριθμό</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Γράφουμε τον αριθμητή και χωρίζουμε με <strong>υποδιαστολή από δεξιά προς τα αριστερά</strong> τόσα ψηφία όσα είναι τα μηδενικά του παρονομαστή (10, 100, 1000).
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center flex items-center justify-center gap-3 font-bold">
              <div className="inline-flex flex-col items-center leading-none">
                <span className="text-emerald-700">6</span>
                <div className="w-8 h-[1.5px] bg-slate-400 my-0.5"></div>
                <span className="text-blue-700">100</span>
              </div>
              <span className="text-slate-400">➔</span>
              <span className="text-indigo-700">0,06</span>
            </div>
          </div>

          <div className="bg-cyan-50/80 border border-cyan-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Μονάδα και Υποδιαιρέσεις</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Το δεκαδικό κλάσμα δείχνει σε πόσα ίσα μέρη χωρίστηκε η ακέραιη μονάδα (10, 100 ή 1000) και πόσα από αυτά πήραμε.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-cyan-100 text-xs text-slate-800 font-mono text-center font-bold">
              💡 1 Μονάδα = 10/10 = 100/100 = 1000/1000
            </div>
          </div>
        </div>

        {/* INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Μετατροπών
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Επίλεξε κατεύθυνση μετατροπής, δοκίμασε αριθμούς και παρατήρησε το δυναμικό πλέγμα της μονάδας!
              </p>
            </div>

            {/* TABS ΕΝΑΛΛΑΓΗΣ */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('toKlasma')}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center ${
                  activeTab === 'toKlasma' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔢 Δεκαδικός ➔ Κλάσμα
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('toDekadiko')}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center ${
                  activeTab === 'toDekadiko' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🍕 Κλάσμα ➔ Δεκαδικός
              </button>
            </div>
          </div>

          <div className="space-y-6">

            {/* ROW 1: INPUTS & DYNAMIC READOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              
              {/* 1. INPUT CARD */}
              <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-inner flex flex-col justify-center">
                {activeTab === 'toKlasma' ? (
                  <>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                        Πληκτρολόγησε Δεκαδικό (0 έως 1):
                      </label>
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        έως 3 δεκαδικά
                      </span>
                    </div>
                    <input
                      type="text"
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
                          className="bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 transition shadow-xs"
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
                        <span className="text-xs font-black text-slate-600 uppercase">Αριθμητής:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setArithmitis(Math.max(0, arithmitis - 1))}
                            className="bg-white border border-slate-300 text-slate-700 w-8 h-8 rounded-lg font-black hover:bg-slate-100 transition flex items-center justify-center shadow-xs"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={arithmitis}
                            onChange={(e) => {
                              const clean = e.target.value.replace(/[^0-9]/g, '');
                              let val = parseInt(clean, 10);
                              if (isNaN(val)) val = 0;
                              if (val >= 0 && val <= paronomastis) {
                                setArithmitis(val);
                              }
                            }}
                            className="w-20 text-center font-black text-lg sm:text-xl text-emerald-600 bg-white border border-slate-300 rounded-xl py-1 focus:border-emerald-500 outline-none shadow-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setArithmitis(Math.min(paronomastis, arithmitis + 1))}
                            className="bg-white border border-slate-300 text-slate-700 w-8 h-8 rounded-lg font-black hover:bg-slate-100 transition flex items-center justify-center shadow-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-200">
                        <span className="text-xs font-black text-slate-600 uppercase">Παρονομαστής:</span>
                        <div className="flex gap-2">
                          {[10, 100, 1000].map((den) => (
                            <button
                              key={den}
                              type="button"
                              onClick={() => {
                                setParonomastis(den);
                                if (arithmitis > den) setArithmitis(den);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
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
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                  ✨ Αποτέλεσμα Μετατροπής:
                </span>
                
                {activeTab === 'toKlasma' ? (
                  <div className="flex items-center justify-center gap-3 sm:gap-4 text-xl sm:text-2xl md:text-3xl font-black font-mono flex-wrap">
                    <span className="bg-white/10 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-white">
                      {dekadikos || "0"}
                    </span>
                    <span className="text-amber-400">➔</span>
                    <div className="inline-flex flex-col items-center leading-tight bg-white/10 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-xl">
                      <span className="text-emerald-400">{dynamicNum}</span>
                      <div className="w-12 sm:w-14 h-[2px] bg-white my-1"></div>
                      <span className="text-cyan-300">{dynamicDen}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 sm:gap-4 text-xl sm:text-2xl md:text-3xl font-black font-mono flex-wrap">
                    <div className="inline-flex flex-col items-center leading-tight bg-white/10 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-xl">
                      <span className="text-emerald-400">{arithmitis}</span>
                      <div className="w-12 sm:w-14 h-[2px] bg-white my-1"></div>
                      <span className="text-cyan-300">{paronomastis}</span>
                    </div>
                    <span className="text-amber-400">➔</span>
                    <span className="bg-amber-400 text-slate-900 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-md">
                      {(arithmitis / paronomastis).toFixed(paronomastis === 10 ? 1 : paronomastis === 100 ? 2 : 3).replace('.', ',')}
                    </span>
                  </div>
                )}

                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  {activeTab === 'toKlasma' 
                    ? `${numDigits} δεκαδικά ψηφία ➔ ${numDigits} μηδενικά στον παρονομαστή`
                    : `${paronomastis.toString().length - 1} μηδενικά ➔ ${paronomastis.toString().length - 1} δεκαδικά ψηφία`}
                </p>
              </div>

            </div>

            {/* ROW 2: DYNAMIC SVG UNIT GRID */}
            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 md:p-6 rounded-2xl flex flex-col items-center justify-between space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  📊 Γεωμετρικό Πλέγμα Ακέραιας Μονάδας
                </span>
                <p className="text-xs text-slate-500">
                  Η ακέραιη μονάδα (τετράγωνο) χωρισμένη σε <strong className="text-slate-800">{currentDenominator}</strong> ίσα μέρη ({getGridLabel()}).
                </p>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center max-w-full overflow-hidden">
                <svg 
                  viewBox="0 0 300 300" 
                  className="bg-white rounded-lg drop-shadow-sm w-full max-w-[260px] sm:max-w-[280px] h-auto select-none"
                >
                  {renderGridSquares()}
                </svg>
              </div>

              <div className="bg-white border border-slate-200 px-4 sm:px-6 py-2.5 rounded-xl shadow-xs text-center">
                <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 tabular-nums">
                  Καλύφθηκαν: <span className="text-amber-500 font-mono text-base sm:text-lg">{currentNumerator}</span> / {currentDenominator} {getGridLabel()}
                </span>
              </div>

              <div className="text-center text-[11px] sm:text-xs font-bold text-slate-400 pt-1">
                <span>🔍 Παρατήρησε πώς αλλάζει το μέγεθος των υποδιαιρέσεων ανάλογα με τον παρονομαστή.</span>
              </div>
            </div>

            {/* ROW 3: STEP-BY-STEP MATHEMATICAL RULES BREAKDOWN */}
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  🧬 Βήμα-Βήμα Μαθηματικός Κανόνας Μετατροπής
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                  Πλήρης Εμφάνιση
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-black text-xs text-blue-800 uppercase block">
                    1. Από Δεκαδικό σε Κλάσμα:
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li>• <strong>0,8</strong> (1 ψηφίο) ➔ <strong>8 / 10</strong> (δέκατα)</li>
                    <li>• <strong>0,45</strong> (2 ψηφία) ➔ <strong>45 / 100</strong> (εκατοστά)</li>
                    <li>• <strong>0,125</strong> (3 ψηφία) ➔ <strong>125 / 1000</strong> (χιλιοστά)</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-black text-xs text-emerald-800 uppercase block">
                    2. Από Κλάσμα σε Δεκαδικό:
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li>• <strong>5 / 10</strong> (1 μηδενικό) ➔ <strong>0,5</strong></li>
                    <li>• <strong>7 / 100</strong> (2 μηδενικά) ➔ <strong>0,07</strong> (προσθήκη μηδενικού)</li>
                    <li>• <strong>34 / 1000</strong> (3 μηδενικά) ➔ <strong>0,034</strong></li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Κατανόησες τη σχέση δεκαδικών αριθμών και δεκαδικών κλασμάτων; Δοκίμασε τις διαδραστικές ασκήσεις για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>
          <Link
            href="/st-dimotikou/03-arithmoi-dekadika-klasmata-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}
