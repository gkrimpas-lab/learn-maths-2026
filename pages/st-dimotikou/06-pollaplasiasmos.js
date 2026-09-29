// pages/st-dimotikou/06-pollaplasiasmos.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// ΜΕΤΑΒΛΗΤΕΣ ΟΡΙΩΝ
const LIMITS = {
  MIN_VALUE: 0,
  MAX_VALUE: 9999,
  MAX_VISUAL_DOTS: 100,
  MIN_3D: 1,
  MAX_3D: 5
};

export default function PollaplasiasmosPage() {
  const [activeTab, setActiveTab] = useState('antimetathetiki'); // 'antimetathetiki', 'prosetairistiki', 'epimeristiki'
  
  // Κατάσταση για Αντιμεταθετική
  const [inputRows, setInputRows] = useState('5');
  const [inputCols, setInputCols] = useState('3');
  const [rotated, setRotated] = useState(false);

  const valRows = parseInt(inputRows, 10) || 0;
  const valCols = parseInt(inputCols, 10) || 0;
  const currentRows = rotated ? valCols : valRows;
  const currentCols = rotated ? valRows : valCols;
  const antimetathetikiResult = valRows * valCols;

  // Κατάσταση για Προσεταιριστική
  const [prosW, setProsW] = useState('4'); 
  const [prosD, setProsD] = useState('3'); 
  const [prosH, setProsH] = useState('2'); 

  const valW = Math.max(LIMITS.MIN_3D, Math.min(parseInt(prosW, 10) || 1, LIMITS.MAX_3D));
  const valD = Math.max(LIMITS.MIN_3D, Math.min(parseInt(prosD, 10) || 1, LIMITS.MAX_3D));
  const valH = Math.max(LIMITS.MIN_3D, Math.min(parseInt(prosH, 10) || 1, LIMITS.MAX_3D));
  const totalVolume = valW * valD * valH;

  // Κατάσταση για Επιμεριστική
  const [distA, setPropA] = useState('4');
  const [distB, setPropB] = useState('3');
  const [distC, setPropC] = useState('2');

  const valA = parseFloat(distA.replace(',', '.')) || 0;
  const valB = parseFloat(distB.replace(',', '.')) || 0;
  const valC = parseFloat(distC.replace(',', '.')) || 0;

  // Βοηθητικές συναρτήσεις καθαρισμού
  const sanitizeInput = (val, maxDigits = 4) => {
    let clean = val.replace(/\./g, ',').replace(/[^0-9,]/g, '');
    const parts = clean.split(',');
    let intPart = (parts[0] || '').slice(0, maxDigits);
    if (parts.length > 1) {
      let decPart = parts.slice(1).join('').slice(0, 3);
      return `${intPart},${decPart}`;
    }
    return intPart;
  };

  const adjustValue = (currentStr, delta, min = 0, max = LIMITS.MAX_VALUE) => {
    const current = parseFloat(currentStr.replace(',', '.')) || 0;
    const updated = Math.max(min, Math.min(max, current + delta));
    return updated.toString().replace('.', ',');
  };

  // Σχεδίαση εφαπτόμενων τετραγώνων (Tab 1)
  const renderVisualTiles = () => {
    const tiles = [];
    const containerSize = 300;
    const cellW = containerSize / Math.max(1, currentCols);
    const cellH = containerSize / Math.max(1, currentRows);
    const cellSize = Math.min(cellW, cellH);
    const offsetX = (containerSize - (currentCols * cellSize)) / 2;
    const offsetY = (containerSize - (currentRows * cellSize)) / 2;

    for (let r = 0; r < currentRows; r++) {
      for (let c = 0; c < currentCols; c++) {
        tiles.push(
          <rect
            key={`${r}-${c}`}
            x={offsetX + (c * cellSize)}
            y={offsetY + (r * cellSize)}
            width={cellSize}
            height={cellSize}
            className="fill-amber-400 stroke-amber-500 stroke-[0.8] transition-all duration-200"
          />
        );
      }
    }
    return tiles;
  };

  // Σχεδίαση 3D Ισομετρικού Κύβου (Tab 2)
  const renderIsometricCube = (highlightMode) => {
    const cubes = [];
    const size = 15;
    const isoX = (x, y, z) => 95 + (x - y) * size * 0.866;
    const isoY = (x, y, z) => 85 + (x + y) * size * 0.5 - z * size;

    for (let z = 0; z < valH; z++) {
      for (let y = 0; y < valD; y++) {
        for (let x = 0; x < valW; x++) {
          let isHighlighted = false;
          if (highlightMode === 'base') {
            isHighlighted = (z === 0);
          } else if (highlightMode === 'slice') {
            isHighlighted = (x === 0);
          }

          const cx = isoX(x, y, z);
          const cy = isoY(x, y, z);

          const topFace = `${cx},${cy} ${cx + size * 0.866},${cy + size * 0.5} ${cx},${cy + size} ${cx - size * 0.866},${cy + size * 0.5}`;
          const leftFace = `${cx - size * 0.866},${cy + size * 0.5} ${cx},${cy + size} ${cx},${cy + size + size} ${cx - size * 0.866},${cy + size * 0.5 + size}`;
          const rightFace = `${cx},${cy + size} ${cx + size * 0.866},${cy + size * 0.5} ${cx + size * 0.866},${cy + size * 0.5 + size} ${cx},${cy + size + size}`;

          const fillTop = isHighlighted ? 'fill-amber-300' : 'fill-slate-300';
          const fillLeft = isHighlighted ? 'fill-amber-400' : 'fill-slate-400';
          const fillRight = isHighlighted ? 'fill-amber-500' : 'fill-slate-500';
          const strokeColor = isHighlighted ? 'stroke-amber-600' : 'stroke-slate-600';

          cubes.push(
            <g key={`${x}-${y}-${z}`} className="transition-all duration-300">
              <polygon points={topFace} className={`${fillTop} ${strokeColor} stroke-[0.5]`} />
              <polygon points={leftFace} className={`${fillLeft} ${strokeColor} stroke-[0.5]`} />
              <polygon points={rightFace} className={`${fillRight} ${strokeColor} stroke-[0.5]`} />
            </g>
          );
        }
      }
    }
    return cubes;
  };

  return (
    <Layout
      title="Πολλαπλασιασμός Φυσικών Αριθμών και Ιδιότητες - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς να υπολογίζεις γρήγορα γινόμενα αξιοποιώντας την αντιμεταθετική, προσεταιριστική και επιμεριστική ιδιότητα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/06-pollaplasiasmos-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 6 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Πολλαπλασιασμός Φυσικών Αριθμών &amp; Ιδιότητες
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς να υπολογίζεις γρήγορα γινόμενα αξιοποιώντας την <strong>αντιμεταθετική</strong>, την <strong>προσεταιριστική</strong> και την <strong>επιμεριστική ιδιότητα</strong> ως προς την πρόσθεση!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Αντιμεταθετική, Προσεταιριστική σε 3D &amp; Επιμεριστική Ιδιότητα</span>
            </div>
            <Link
              href="/st-dimotikou/06-pollaplasiasmos-ask"
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
              Οι 3 Βασικές Ιδιότητες του Πολλαπλασιασμού
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Εργαλεία που διευκολύνουν τους νοερούς και γραπτούς υπολογισμούς.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Αλλαγή Σειράς</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Αντιμεταθετική Ιδιότητα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Μπορούμε να αλλάξουμε τη σειρά των παραγόντων χωρίς να αλλάξει το αποτέλεσμα: <code className="text-blue-700 font-bold font-mono">α · β ＝ β · α</code>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>8 · 5 ＝ 5 · 8 ＝ <strong className="text-blue-700">40</strong></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Η αντιμεταθετική ισχύει για οποιοδήποτε πλήθος παραγόντων.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ομαδοποίηση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Προσεταιριστική Ιδιότητα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Σε γινόμενο τριών παραγόντων, ομαδοποιούμε με όποιο ζευγάρι μάς διευκολύνει: <code className="text-indigo-700 font-bold font-mono">(α · β) · γ ＝ α · (β · γ)</code>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>(4 · 5) · 2 ＝ 4 · (5 · 2) ＝ <strong className="text-indigo-700">40</strong></p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Αναζητούμε ζευγάρια παραγόντων που δημιουργούν δεκάδες ή εκατοντάδες (π.χ. 5 · 2 ＝ 10 ή 4 · 25 ＝ 100).
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Διανομή</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Επιμεριστική Ιδιότητα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Πολλαπλασιάζουμε τον αριθμό ξεχωριστά με κάθε προσθετέο της παρένθεσης: <code className="text-cyan-800 font-bold font-mono">α · (β ＋ γ) ＝ α · β ＋ α · γ</code>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono text-center font-bold">
                  <p>4 · (10 ＋ 2) ＝ 40 ＋ 8 ＝ 48</p>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                🎯 Μας επιτρέπει να «σπάμε» δύσκολους αριθμούς σε δεκάδες και μονάδες για εύκολους νοερούς υπολογισμούς.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Πολλαπλασιασμού &amp; Ιδιοτήτων
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Επίλεξε ιδιότητα, άλλαξε τους αριθμούς και παρατήρησε τη γεωμετρική και αριθμητική αναπαράσταση!
              </p>
            </div>

            {/* TABS ΕΝΑΛΛΑΓΗΣ */}
            <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('antimetathetiki')}
                className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center touch-manipulation active:scale-95 ${
                  activeTab === 'antimetathetiki' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔄 Αντιμεταθετική
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('prosetairistiki')}
                className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center touch-manipulation active:scale-95 ${
                  activeTab === 'prosetairistiki' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📦 Προσεταιριστική (3D)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('epimeristiki')}
                className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center touch-manipulation active:scale-95 ${
                  activeTab === 'epimeristiki' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📐 Επιμεριστική
              </button>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID - 100% FLUID ΧΩΡΙΣ SCROLL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & COMPUTATION (6 COLS) */}
            <div className="lg:col-span-6 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-6 shadow-inner">
              
              {activeTab === 'antimetathetiki' && (
                <div className="space-y-5 my-auto">
                  <div>
                    <span className="text-xs 2xl:text-sm font-black text-slate-500 tracking-wider block mb-1">
                      Ορισμός Παραγόντων (α · β):
                    </span>
                    <p className="text-xs sm:text-sm text-slate-500">Πληκτρολόγησε ή άλλαξε με τα κουμπιά τις γραμμές και τις στήλες.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Factor A */}
                    <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 space-y-2 shadow-sm">
                      <span className="text-xs font-black text-emerald-800 block">Γραμμές (α):</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={inputRows}
                        onChange={(e) => {
                          setInputRows(sanitizeInput(e.target.value));
                          setRotated(false);
                        }}
                        className="text-xl sm:text-2xl font-black text-center p-2 bg-emerald-50/50 border-2 border-emerald-300 rounded-xl focus:border-emerald-500 outline-none w-full text-emerald-700 font-mono"
                      />
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        <button type="button" onClick={() => setInputRows(adjustValue(inputRows, -1, 0, 20))} className="bg-slate-100 hover:bg-slate-200 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95">－1</button>
                        <button type="button" onClick={() => setInputRows(adjustValue(inputRows, +1, 0, 20))} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95">＋1</button>
                      </div>
                    </div>

                    {/* Factor B */}
                    <div className="bg-white p-3.5 rounded-2xl border border-blue-200 space-y-2 shadow-sm">
                      <span className="text-xs font-black text-blue-800 block">Στήλες (β):</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={inputCols}
                        onChange={(e) => {
                          setInputCols(sanitizeInput(e.target.value));
                          setRotated(false);
                        }}
                        className="text-xl sm:text-2xl font-black text-center p-2 bg-blue-50/50 border-2 border-blue-300 rounded-xl focus:border-blue-500 outline-none w-full text-blue-700 font-mono"
                      />
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        <button type="button" onClick={() => setInputCols(adjustValue(inputCols, -1, 0, 20))} className="bg-slate-100 hover:bg-slate-200 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95">－1</button>
                        <button type="button" onClick={() => setInputCols(adjustValue(inputCols, +1, 0, 20))} className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-black py-2 rounded-lg transition touch-manipulation active:scale-95">＋1</button>
                      </div>
                    </div>
                  </div>

                  {/* Result Box */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
                    <div className="font-mono text-lg sm:text-xl md:text-2xl font-black text-slate-800 flex items-center justify-center flex-wrap">
                      <span className={rotated ? 'text-blue-600' : 'text-emerald-600'}>{currentRows}</span>
                      <span className="text-slate-400 mx-2">·</span>
                      <span className={rotated ? 'text-emerald-600' : 'text-blue-600'}>{currentCols}</span>
                      <span className="text-slate-400 mx-2">＝</span>
                      <span className="bg-amber-400 text-slate-900 px-3 py-0.5 rounded-xl">{antimetathetikiResult.toLocaleString('el-GR')}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500">
                      {rotated ? 'Περιστραμμένη διάταξη (β · α)' : 'Αρχική διάταξη (α · β)'}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setRotated(!rotated)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs md:text-sm px-6 py-2.5 rounded-xl shadow-md transition touch-manipulation active:scale-95 flex items-center gap-2"
                    >
                      <span>🔄</span> Περιστροφή Παραγόντων
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'prosetairistiki' && (
                <div className="space-y-5 my-auto">
                  <div>
                    <span className="text-xs 2xl:text-sm font-black text-slate-500 tracking-wider block mb-1 uppercase">
                      Τρεις Διαστάσεις Στερεού (α · β · γ):
                    </span>
                    <p className="text-xs sm:text-sm text-slate-500">Επίλεξε διαστάσεις από {LIMITS.MIN_3D} έως {LIMITS.MAX_3D} για τρισδιάστατο υπολογισμό όγκου.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {/* Width */}
                    <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-indigo-200 text-center space-y-1.5 shadow-sm">
                      <span className="text-[10px] sm:text-xs font-black text-indigo-700 block truncate uppercase">Πλάτος (α)</span>
                      <input type="text" inputMode="numeric" value={prosW} onChange={(e) => setProsW(sanitizeInput(e.target.value, 1))} className="w-full text-center font-black text-lg sm:text-xl text-indigo-700 bg-indigo-50/50 rounded-lg p-1 outline-none font-mono" />
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        <button type="button" onClick={() => setProsW(adjustValue(prosW, -1, LIMITS.MIN_3D, LIMITS.MAX_3D))} className="bg-slate-100 text-xs font-black py-1.5 rounded transition touch-manipulation active:scale-95">－</button>
                        <button type="button" onClick={() => setProsW(adjustValue(prosW, +1, LIMITS.MIN_3D, LIMITS.MAX_3D))} className="bg-indigo-100 text-indigo-800 text-xs font-black py-1.5 rounded transition touch-manipulation active:scale-95">＋</button>
                      </div>
                    </div>

                    {/* Depth */}
                    <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-blue-200 text-center space-y-1.5 shadow-sm">
                      <span className="text-[10px] sm:text-xs font-black text-blue-700 block truncate uppercase">Βάθος (β)</span>
                      <input type="text" inputMode="numeric" value={prosD} onChange={(e) => setProsD(sanitizeInput(e.target.value, 1))} className="w-full text-center font-black text-lg sm:text-xl text-blue-700 bg-blue-50/50 rounded-lg p-1 outline-none font-mono" />
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        <button type="button" onClick={() => setProsD(adjustValue(prosD, -1, LIMITS.MIN_3D, LIMITS.MAX_3D))} className="bg-slate-100 text-xs font-black py-1.5 rounded transition touch-manipulation active:scale-95">－</button>
                        <button type="button" onClick={() => setProsD(adjustValue(prosD, +1, LIMITS.MIN_3D, LIMITS.MAX_3D))} className="bg-blue-100 text-blue-800 text-xs font-black py-1.5 rounded transition touch-manipulation active:scale-95">＋</button>
                      </div>
                    </div>

                    {/* Height */}
                    <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-amber-200 text-center space-y-1.5 shadow-sm">
                      <span className="text-[10px] sm:text-xs font-black text-amber-700 block truncate uppercase">Ύψος (γ)</span>
                      <input type="text" inputMode="numeric" value={prosH} onChange={(e) => setProsH(sanitizeInput(e.target.value, 1))} className="w-full text-center font-black text-lg sm:text-xl text-amber-600 bg-amber-50/50 rounded-lg p-1 outline-none font-mono" />
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        <button type="button" onClick={() => setProsH(adjustValue(prosH, -1, LIMITS.MIN_3D, LIMITS.MAX_3D))} className="bg-slate-100 text-xs font-black py-1.5 rounded transition touch-manipulation active:scale-95">－</button>
                        <button type="button" onClick={() => setProsH(adjustValue(prosH, +1, LIMITS.MIN_3D, LIMITS.MAX_3D))} className="bg-amber-100 text-amber-800 text-xs font-black py-1.5 rounded transition touch-manipulation active:scale-95">＋</button>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown Calculations */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm font-mono text-xs md:text-sm text-left space-y-2 text-slate-700">
                    <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl break-words">
                      📌 <strong className="text-amber-800">1ος Τρόπος (Βάση · Ύψος):</strong><br/>
                      ({valW} · {valD}) · {valH} ＝ {valW * valD} · {valH} ＝ <strong className="text-purple-700 font-black">{totalVolume}</strong>
                    </div>
                    <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl break-words">
                      📌 <strong className="text-blue-800">2ος Τρόπος (Πλάτος · Φέτα):</strong><br/>
                      {valW} · ({valD} · {valH}) ＝ {valW} · {valD * valH} ＝ <strong className="text-purple-700 font-black">{totalVolume}</strong>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'epimeristiki' && (
                <div className="space-y-5 my-auto">
                  <div>
                    <span className="text-xs 2xl:text-sm font-black text-slate-500 tracking-wider block mb-1 uppercase">
                      Μαθηματικη Δομη Επιμεριστικης:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-500">α · (β ＋ γ) ＝ α · β ＋ α · γ</p>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 md:gap-2 font-mono font-black text-base sm:text-lg md:text-xl text-slate-700 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex-wrap">
                    <input 
                      type="text" 
                      inputMode="decimal"
                      value={distA} 
                      onChange={(e) => setPropA(sanitizeInput(e.target.value, 2))} 
                      className="w-12 h-11 border-2 border-blue-300 rounded-xl text-center font-black text-blue-700 bg-blue-50/40 outline-none focus:border-blue-500 text-sm sm:text-base font-mono" 
                    />
                    <span className="text-slate-400 font-sans">·</span>
                    <span className="text-gray-400 text-xl sm:text-2xl font-light">(</span>
                    <input 
                      type="text" 
                      inputMode="decimal"
                      value={distB} 
                      onChange={(e) => setPropB(sanitizeInput(e.target.value, 2))} 
                      className="w-12 h-11 border-2 border-emerald-300 rounded-xl text-center font-black text-emerald-700 bg-emerald-50/40 outline-none focus:border-emerald-500 text-sm sm:text-base font-mono" 
                    />
                    <span className="text-slate-400 font-sans">＋</span>
                    <input 
                      type="text" 
                      inputMode="decimal"
                      value={distC} 
                      onChange={(e) => setPropC(sanitizeInput(e.target.value, 2))} 
                      className="w-12 h-11 border-2 border-cyan-300 rounded-xl text-center font-black text-cyan-700 bg-cyan-50/40 outline-none focus:border-cyan-500 text-sm sm:text-base font-mono" 
                    />
                    <span className="text-gray-400 text-xl sm:text-2xl font-light">)</span>
                  </div>

                  {/* Breakdown */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm font-mono text-xs md:text-sm text-left space-y-2 text-slate-700">
                    <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl break-words">
                      🔹 <strong>Ενιαίο Άθροισμα:</strong> {valA} · ({valB} ＋ {valC}) ＝ {valA} · {valB + valC} ＝ <strong className="text-indigo-700 font-black">{valA * (valB + valC)}</strong>
                    </div>
                    <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl break-words">
                      🔹 <strong>Επιμερισμένο:</strong> ({valA} · {valB}) ＋ ({valA} · {valC}) ＝ {valA * valB} ＋ {valA * valC} ＝ <strong className="text-emerald-700 font-black">{valA * valB + valA * valC}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center text-[11px] sm:text-xs font-bold text-slate-400 pt-2 border-t border-slate-200">
                <span>✨ Παρατήρησε την ισότητα των αποτελεσμάτων σε κάθε βήμα!</span>
              </div>
            </div>

            {/* RIGHT: GRAPHICAL VISUALIZATION (6 COLS) */}
            <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-between min-h-[400px] sm:min-h-[460px] shadow-sm">
              <div className="w-full text-center border-b border-slate-100 pb-3">
                <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider">
                  {activeTab === 'antimetathetiki' && '📊 Οπτικο Πλεγμα Τετραγωνων (Εμβαδον)'}
                  {activeTab === 'prosetairistiki' && '📦 3D Ισομετρικη Αναπαρασταση Ογκου'}
                  {activeTab === 'epimeristiki' && '📐 Γεωμετρικη Διαιρεση Εμβαδου'}
                </span>
              </div>

              {/* TAB 1 VISUAL: 2D TILES */}
              {activeTab === 'antimetathetiki' && (
                <div className="my-auto flex flex-col items-center gap-4 w-full text-center">
                  {currentRows === 0 || currentCols === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl max-w-xs mx-auto text-amber-900 text-sm font-medium space-y-2 shadow-inner">
                      <p className="text-base font-black">🍩 Απορροφητικό Στοιχείο (0)!</p>
                      <p className="text-xs sm:text-sm text-amber-700 leading-relaxed font-normal">
                        Όταν πολλαπλασιάζουμε έναν αριθμό με το <strong>0</strong>, το αποτέλεσμα γίνεται πάντα <strong>0</strong>. Δεν υπάρχουν κουτάκια για να σχεδιαστούν!
                      </p>
                    </div>
                  ) : antimetathetikiResult <= LIMITS.MAX_VISUAL_DOTS ? (
                    <div className="flex flex-col items-center gap-3 w-full">
                      <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-inner w-full max-w-[260px] sm:max-w-[300px] aspect-square flex items-center justify-center overflow-hidden">
                        <svg viewBox="0 0 300 300" className="bg-white rounded-xl w-full h-full select-none">
                          {renderVisualTiles()}
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-600">
                        Διάταξη: <strong className="text-slate-800 font-mono">{currentRows}</strong> γραμμές · <strong className="text-slate-800 font-mono">{currentCols}</strong> στήλες
                      </span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl max-w-xs mx-auto text-slate-600 text-sm font-medium space-y-2 shadow-inner">
                      <p className="font-bold">📏 Μεγάλο Γινόμενο!</p>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        Το γινόμενο ({antimetathetikiResult.toLocaleString('el-GR')}) είναι πολύ μεγάλο για σχεδίαση, αλλά η ισότητα ισχύει απόλυτα!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2 VISUAL: 3D ISOMETRIC CUBE */}
              {activeTab === 'prosetairistiki' && (
                <div className="my-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md">
                  <div className="flex flex-col items-center gap-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 w-full shadow-xs">
                    <span className="text-[10px] sm:text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase">1ος Τροπος (Βαση)</span>
                    <svg viewBox="0 0 200 170" className="w-full h-32 sm:h-36 overflow-visible select-none">
                      {renderIsometricCube('base')}
                    </svg>
                    <span className="text-[11px] sm:text-xs font-mono text-slate-600 font-bold">({valW} · {valD}) · {valH}</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 w-full shadow-xs">
                    <span className="text-[10px] sm:text-xs font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase">2ος Τροπος (Φετα)</span>
                    <svg viewBox="0 0 200 170" className="w-full h-32 sm:h-36 overflow-visible select-none">
                      {renderIsometricCube('slice')}
                    </svg>
                    <span className="text-[11px] sm:text-xs font-mono text-slate-600 font-bold">{valW} · ({valD} · {valH})</span>
                  </div>
                </div>
              )}

              {/* TAB 3 VISUAL: DISTRIBUTIVE RECTANGLES */}
              {activeTab === 'epimeristiki' && (
                <div className="my-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md">
                  {/* Entire Shape */}
                  <div className="flex flex-col items-center gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 w-full shadow-xs">
                    <span className="text-[10px] sm:text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full uppercase">Ενιαιο Σχημα</span>
                    <div className="border-2 border-indigo-700 rounded-xl overflow-hidden flex w-full h-24 sm:h-28 text-white font-mono font-black text-xs shadow-xs">
                      <div className="bg-indigo-500 flex flex-col justify-center items-center w-full transition-all p-1 text-center">
                        <span className="truncate max-w-full">{valA} · ({valB + valC})</span>
                        <span className="text-[11px] font-normal opacity-85">({valA * (valB + valC)})</span>
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-xs font-mono text-slate-500 font-bold">Εμβαδόν ＝ {valA * (valB + valC)}</span>
                  </div>

                  {/* Split Shape */}
                  <div className="flex flex-col items-center gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 w-full shadow-xs">
                    <span className="text-[10px] sm:text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">Επιμερισμενο</span>
                    <div className="border-2 border-slate-700 rounded-xl overflow-hidden flex w-full h-24 sm:h-28 text-white font-mono font-black text-xs shadow-xs">
                      <div className="bg-emerald-500 flex flex-col justify-center items-center transition-all p-1 text-center" style={{ flexGrow: Math.max(valB, 1) }}>
                        <span className="truncate max-w-full">{valA} · {valB}</span>
                        <span className="text-[10px] font-normal opacity-85">({valA * valB})</span>
                      </div>
                      <div className="bg-cyan-500 flex flex-col justify-center items-center transition-all border-l-2 border-dashed border-white/60 p-1 text-center" style={{ flexGrow: Math.max(valC, 1) }}>
                        <span className="truncate max-w-full">{valA} · {valC}</span>
                        <span className="text-[10px] font-normal opacity-85">({valA * valC})</span>
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-xs font-mono text-slate-500 font-bold">Εμβαδόν ＝ {valA * valB + valA * valC}</span>
                  </div>
                </div>
              )}

              <div className="text-center text-[11px] sm:text-xs font-bold text-slate-400 pt-2 border-t border-slate-100 w-full">
                <span>🔍 Οι ιδιότητες μάς επιτρέπουν να απλοποιούμε δύσκολους νοερούς υπολογισμούς!</span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στον Πολλαπλασιασμό!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατανόησες τις ιδιότητες του πολλαπλασιασμού; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/06-pollaplasiasmos-ask"
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
