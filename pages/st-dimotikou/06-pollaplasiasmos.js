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
  const [inputRows, setInputRows] = useState("5");
  const [inputCols, setInputCols] = useState("3");
  const [rotated, setRotated] = useState(false);

  const valRows = parseInt(inputRows, 10) || 0;
  const valCols = parseInt(inputCols, 10) || 0;
  const currentRows = rotated ? valCols : valRows;
  const currentCols = rotated ? valRows : valCols;
  const antimetathetikiResult = valRows * valCols;

  // Κατάσταση για Προσεταιριστική
  const [prosW, setProsW] = useState("4"); 
  const [prosD, setProsD] = useState("3"); 
  const [prosH, setProsH] = useState("2"); 

  const valW = Math.max(LIMITS.MIN_3D, Math.min(parseInt(prosW, 10) || 1, LIMITS.MAX_3D));
  const valD = Math.max(LIMITS.MIN_3D, Math.min(parseInt(prosD, 10) || 1, LIMITS.MAX_3D));
  const valH = Math.max(LIMITS.MIN_3D, Math.min(parseInt(prosH, 10) || 1, LIMITS.MAX_3D));
  const totalVolume = valW * valD * valH;

  // Κατάσταση για Επιμεριστική
  const [distA, setPropA] = useState("4");
  const [distB, setPropB] = useState("3");
  const [distC, setPropC] = useState("2");

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
      title="✖️ 6. Πολλαπλασιασμός Φυσικών Αριθμών και Ιδιότητες - LearnMaths.gr"
      description="Μάθε πώς να υπολογίζεις γρήγορα γινόμενα αξιοποιώντας την αντιμεταθετική, προσεταιριστική και επιμεριστική ιδιότητα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/06-pollaplasiasmos-ask"
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
                  🎓 ΣΤ' Δημοτικου
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενοτητα 6
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                6. Πολλαπλασιασμός Φυσικών Αριθμών και Ιδιότητες
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε πώς να υπολογίζεις γρήγορα γινόμενα αξιοποιώντας την <strong>αντιμεταθετική</strong>, την <strong>προσεταιριστική</strong> και την <strong>επιμεριστική ιδιότητα</strong> ως προς την πρόσθεση!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-blue-50">Δοκίμασε τις διαδραστικές ασκήσεις με 8 δυναμικά προβλήματα!</p>
              <Link
                href="/st-dimotikou/06-pollaplasiasmos-ask"
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
              <h3 className="text-lg font-black text-slate-900">Αντιμεταθετική Ιδιότητα</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Μπορούμε να αλλάξουμε τη σειρά των παραγόντων χωρίς να αλλάξει το αποτέλεσμα: <code className="text-blue-700 font-bold">α × β = β × α</code>.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs text-slate-700 space-y-1 font-mono text-center font-bold">
              <p>8 × 5 = 5 × 8 = <strong className="text-blue-700">40</strong></p>
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Προσεταιριστική Ιδιότητα</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Σε γινόμενο τριών παραγόντων, ομαδοποιούμε με όποιο ζευγάρι μάς διευκολύνει: <code className="text-indigo-700 font-bold">(α × β) × γ = α × (β × γ)</code>.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 text-xs text-slate-700 space-y-1 font-mono text-center font-bold">
              <p>(4 × 5) × 2 = 4 × (5 × 2) = <strong className="text-indigo-700">40</strong></p>
            </div>
          </div>

          <div className="bg-cyan-50/80 border border-cyan-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Επιμεριστική Ιδιότητα</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Πολλαπλασιάζουμε τον αριθμό ξεχωριστά με κάθε προσθετέο της παρένθεσης: <code className="text-cyan-800 font-bold">α × (β + γ) = α × β + α × γ</code>.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-cyan-100 text-xs text-slate-700 space-y-1 font-mono text-center font-bold">
              <p>4 × (10 + 2) = 40 + 8 = 48</p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Πολλαπλασιασμού
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Επίλεξε ιδιότητα, άλλαξε τους αριθμούς και παρατήρησε τη γεωμετρική και αριθμητική αναπαράσταση!
              </p>
            </div>

            {/* TABS ΕΝΑΛΛΑΓΗΣ */}
            <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('antimetathetiki')}
                className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center ${
                  activeTab === 'antimetathetiki' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔄 Αντιμεταθετική
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('prosetairistiki')}
                className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center ${
                  activeTab === 'prosetairistiki' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📦 Προσεταιριστική (3D)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('epimeristiki')}
                className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center ${
                  activeTab === 'epimeristiki' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📐 Επιμεριστική
              </button>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & COMPUTATION (6 COLS) */}
            <div className="lg:col-span-6 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-6 shadow-inner">
              
              {activeTab === 'antimetathetiki' && (
                <div className="space-y-5 my-auto">
                  <div>
                    <span className="text-xs font-black text-slate-500 tracking-wider block mb-1">
                      Ορισμός Παραγόντων (α × β):
                    </span>
                    <p className="text-xs text-slate-500">Πληκτρολόγησε ή άλλαξε με τα κουμπιά τις γραμμές και τις στήλες.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Factor A */}
                    <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 space-y-2 shadow-sm">
                      <span className="text-xs font-black text-emerald-800 block">Γραμμές (α):</span>
                      <input
                        type="text"
                        value={inputRows}
                        onChange={(e) => {
                          setInputRows(sanitizeInput(e.target.value));
                          setRotated(false);
                        }}
                        className="text-xl sm:text-2xl font-black text-center p-2 bg-emerald-50/50 border-2 border-emerald-300 rounded-xl focus:border-emerald-500 outline-none w-full text-emerald-700 font-mono"
                      />
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        <button type="button" onClick={() => setInputRows(adjustValue(inputRows, -1, 0, 20))} className="bg-slate-100 hover:bg-slate-200 text-xs font-black py-1 rounded-lg">-1</button>
                        <button type="button" onClick={() => setInputRows(adjustValue(inputRows, +1, 0, 20))} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-black py-1 rounded-lg">+1</button>
                      </div>
                    </div>

                    {/* Factor B */}
                    <div className="bg-white p-3.5 rounded-2xl border border-blue-200 space-y-2 shadow-sm">
                      <span className="text-xs font-black text-blue-800 block">Στήλες (β):</span>
                      <input
                        type="text"
                        value={inputCols}
                        onChange={(e) => {
                          setInputCols(sanitizeInput(e.target.value));
                          setRotated(false);
                        }}
                        className="text-xl sm:text-2xl font-black text-center p-2 bg-blue-50/50 border-2 border-blue-300 rounded-xl focus:border-blue-500 outline-none w-full text-blue-700 font-mono"
                      />
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        <button type="button" onClick={() => setInputCols(adjustValue(inputCols, -1, 0, 20))} className="bg-slate-100 hover:bg-slate-200 text-xs font-black py-1 rounded-lg">-1</button>
                        <button type="button" onClick={() => setInputCols(adjustValue(inputCols, +1, 0, 20))} className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-black py-1 rounded-lg">+1</button>
                      </div>
                    </div>
                  </div>

                  {/* Result Box */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
                    <div className="font-mono text-lg sm:text-xl md:text-2xl font-black text-slate-800 flex items-center justify-center flex-wrap">
                      <span className={rotated ? "text-blue-600" : "text-emerald-600"}>{currentRows}</span>
                      <span className="text-slate-400 mx-2">×</span>
                      <span className={rotated ? "text-emerald-600" : "text-blue-600"}>{currentCols}</span>
                      <span className="text-slate-400 mx-2">＝</span>
                      <span className="bg-amber-400 text-slate-900 px-3 py-0.5 rounded-xl">{antimetathetikiResult.toLocaleString('el-GR')}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {rotated ? "Περιστραμμένη διάταξη (β × α)" : "Αρχική διάταξη (α × β)"}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setRotated(!rotated)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs md:text-sm px-6 py-2.5 rounded-xl shadow-md transition transform active:scale-95 flex items-center gap-2"
                    >
                      <span>🔄</span> Περιστροφή Παραγόντων
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'prosetairistiki' && (
                <div className="space-y-5 my-auto">
                  <div>
                    <span className="text-xs font-black text-slate-500 tracking-wider block mb-1">
                      Τρεις Διαστάσεις Στερεού (α × β × γ):
                    </span>
                    <p className="text-xs text-slate-500">Επίλεξε διαστάσεις από {LIMITS.MIN_3D} έως {LIMITS.MAX_3D} για τρισδιάστατο υπολογισμό όγκου.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {/* Width */}
                    <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-indigo-200 text-center space-y-1.5 shadow-sm">
                      <span className="text-[10px] font-black text-indigo-700 block truncate">Πλάτος (α)</span>
                      <input type="text" value={prosW} onChange={(e) => setProsW(sanitizeInput(e.target.value, 1))} className="w-full text-center font-black text-lg sm:text-xl text-indigo-700 bg-indigo-50/50 rounded-lg p-1 outline-none font-mono" />
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        <button type="button" onClick={() => setProsW(adjustValue(prosW, -1, LIMITS.MIN_3D, LIMITS.MAX_3D))} className="bg-slate-100 text-xs font-black py-0.5 rounded">-</button>
                        <button type="button" onClick={() => setProsW(adjustValue(prosW, +1, LIMITS.MIN_3D, LIMITS.MAX_3D))} className="bg-indigo-100 text-indigo-800 text-xs font-black py-0.5 rounded">+</button>
                      </div>
                    </div>

                    {/* Depth */}
                    <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-blue-200 text-center space-y-1.5 shadow-sm">
                      <span className="text-[10px] font-black text-blue-700 block truncate">Βάθος (β)</span>
                      <input type="text" value={prosD} onChange={(e) => setProsD(sanitizeInput(e.target.value, 1))} className="w-full text-center font-black text-lg sm:text-xl text-blue-700 bg-blue-50/50 rounded-lg p-1 outline-none font-mono" />
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        <button type="button" onClick={() => setProsD(adjustValue(prosD, -1, LIMITS.MIN_3D, LIMITS.MAX_3D))} className="bg-slate-100 text-xs font-black py-0.5 rounded">-</button>
                        <button type="button" onClick={() => setProsD(adjustValue(prosD, +1, LIMITS.MIN_3D, LIMITS.MAX_3D))} className="bg-blue-100 text-blue-800 text-xs font-black py-0.5 rounded">+</button>
                      </div>
                    </div>

                    {/* Height */}
                    <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-amber-200 text-center space-y-1.5 shadow-sm">
                      <span className="text-[10px] font-black text-amber-700 block truncate">Ύψος (γ)</span>
                      <input type="text" value={prosH} onChange={(e) => setProsH(sanitizeInput(e.target.value, 1))} className="w-full text-center font-black text-lg sm:text-xl text-amber-600 bg-amber-50/50 rounded-lg p-1 outline-none font-mono" />
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        <button type="button" onClick={() => setProsH(adjustValue(prosH, -1, LIMITS.MIN_3D, LIMITS.MAX_3D))} className="bg-slate-100 text-xs font-black py-0.5 rounded">-</button>
                        <button type="button" onClick={() => setProsH(adjustValue(prosH, +1, LIMITS.MIN_3D, LIMITS.MAX_3D))} className="bg-amber-100 text-amber-800 text-xs font-black py-0.5 rounded">+</button>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown Calculations */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm font-mono text-xs md:text-sm text-left space-y-2 text-slate-700 overflow-x-auto">
                    <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl whitespace-nowrap">
                      📌 <strong className="text-amber-800">1ος Τρόπος (Βάση × Ύψος):</strong><br/>
                      ({valW} × {valD}) × {valH} ＝ {valW * valD} × {valH} ＝ <strong className="text-purple-700 font-black">{totalVolume}</strong>
                    </div>
                    <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl whitespace-nowrap">
                      📌 <strong className="text-blue-800">2ος Τρόπος (Πλάτος × Φέτα):</strong><br/>
                      {valW} × ({valD} × {valH}) ＝ {valW} × {valD * valH} ＝ <strong className="text-purple-700 font-black">{totalVolume}</strong>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'epimeristiki' && (
                <div className="space-y-5 my-auto">
                  <div>
                    <span className="text-xs font-black text-slate-500 tracking-wider block mb-1 uppercase">
                      Μαθηματικη Δομη Επιμεριστικης:
                    </span>
                    <p className="text-xs text-slate-500">α × (β ＋ γ) ＝ α × β ＋ α × γ</p>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 md:gap-2 font-mono font-black text-base sm:text-lg md:text-xl text-slate-700 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                    <input 
                      type="text" 
                      value={distA} 
                      onChange={(e) => setPropA(sanitizeInput(e.target.value, 2))} 
                      className="w-11 sm:w-12 h-10 sm:h-11 border-2 border-blue-300 rounded-xl text-center font-black text-blue-700 bg-blue-50/40 outline-none focus:border-blue-500 text-sm sm:text-base" 
                    />
                    <span className="text-slate-400 font-sans">×</span>
                    <span className="text-gray-400 text-xl sm:text-2xl font-light">(</span>
                    <input 
                      type="text" 
                      value={distB} 
                      onChange={(e) => setPropB(sanitizeInput(e.target.value, 2))} 
                      className="w-11 sm:w-12 h-10 sm:h-11 border-2 border-emerald-300 rounded-xl text-center font-black text-emerald-700 bg-emerald-50/40 outline-none focus:border-emerald-500 text-sm sm:text-base" 
                    />
                    <span className="text-slate-400 font-sans">＋</span>
                    <input 
                      type="text" 
                      value={distC} 
                      onChange={(e) => setPropC(sanitizeInput(e.target.value, 2))} 
                      className="w-11 sm:w-12 h-10 sm:h-11 border-2 border-cyan-300 rounded-xl text-center font-black text-cyan-700 bg-cyan-50/40 outline-none focus:border-cyan-500 text-sm sm:text-base" 
                    />
                    <span className="text-gray-400 text-xl sm:text-2xl font-light">)</span>
                  </div>

                  {/* Breakdown */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm font-mono text-xs md:text-sm text-left space-y-2 text-slate-700 overflow-x-auto">
                    <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl whitespace-nowrap">
                      🔹 <strong>Ενιαίο Άθροισμα:</strong> {valA} × ({valB} ＋ {valC}) ＝ {valA} × {valB + valC} ＝ <strong className="text-indigo-700 font-black">{valA * (valB + valC)}</strong>
                    </div>
                    <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl whitespace-nowrap">
                      🔹 <strong>Επιμερισμένο:</strong> ({valA} × {valB}) ＋ ({valA} × {valC}) ＝ {valA * valB} ＋ {valA * valC} ＝ <strong className="text-emerald-700 font-black">{valA * valB + valA * valC}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center text-[11px] sm:text-xs font-bold text-slate-400 pt-2 border-t border-slate-200">
                <span>✨ Παρατήρησε την ισότητα των αποτελεσμάτων σε κάθε βήμα!</span>
              </div>
            </div>

            {/* RIGHT: GRAPHICAL VISUALIZATION (6 COLS) */}
            <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-between min-h-[420px] sm:min-h-[460px] shadow-sm">
              <div className="w-full text-center border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  {activeTab === 'antimetathetiki' && "📊 Οπτικο Πλεγμα Τετραγωνων (Εμβαδον)"}
                  {activeTab === 'prosetairistiki' && "📦 3D Ισομετρικη Αναπαρασταση Ογκου"}
                  {activeTab === 'epimeristiki' && "📐 Γεωμετρικη Διαιρεση Εμβαδου"}
                </span>
              </div>

              {/* TAB 1 VISUAL: 2D TILES */}
              {activeTab === 'antimetathetiki' && (
                <div className="my-auto flex flex-col items-center gap-4 w-full text-center">
                  {currentRows === 0 || currentCols === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl max-w-xs mx-auto text-amber-900 text-sm font-medium space-y-2 shadow-inner">
                      <p className="text-base font-black">🍩 Απορροφητικό Στοιχείο (0)!</p>
                      <p className="text-xs text-amber-700 leading-relaxed font-normal">
                        Όταν πολλαπλασιάζουμε έναν αριθμό με το <strong>0</strong>, το αποτέλεσμα γίνεται πάντα <strong>0</strong>. Δεν υπάρχουν κουτάκια για να σχεδιαστούν!
                      </p>
                    </div>
                  ) : antimetathetikiResult <= LIMITS.MAX_VISUAL_DOTS ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-inner max-w-full overflow-hidden">
                        <svg viewBox="0 0 300 300" className="bg-white rounded-xl overflow-hidden drop-shadow-sm w-full max-w-[260px] sm:max-w-[300px] h-auto select-none">
                          {renderVisualTiles()}
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        Διάταξη: <strong className="text-slate-800">{currentRows}</strong> γραμμές × <strong className="text-slate-800">{currentCols}</strong> στήλες
                      </span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl max-w-xs mx-auto text-slate-600 text-sm font-medium space-y-2 shadow-inner">
                      <p className="font-bold">📏 Μεγάλο Γινόμενο!</p>
                      <p className="text-xs text-slate-500 leading-relaxed">
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
                    <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">1ος Τρόπος (Βάση)</span>
                    <svg viewBox="0 0 200 170" className="w-full h-32 sm:h-36 overflow-visible select-none">
                      {renderIsometricCube('base')}
                    </svg>
                    <span className="text-[11px] font-mono text-slate-600 font-bold">({valW} × {valD}) × {valH}</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 w-full shadow-xs">
                    <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">2ος Τρόπος (Φέτα)</span>
                    <svg viewBox="0 0 200 170" className="w-full h-32 sm:h-36 overflow-visible select-none">
                      {renderIsometricCube('slice')}
                    </svg>
                    <span className="text-[11px] font-mono text-slate-600 font-bold">{valW} × ({valD} × {valH})</span>
                  </div>
                </div>
              )}

              {/* TAB 3 VISUAL: DISTRIBUTIVE RECTANGLES */}
              {activeTab === 'epimeristiki' && (
                <div className="my-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md">
                  {/* Entire Shape */}
                  <div className="flex flex-col items-center gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 w-full shadow-xs">
                    <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">Ενιαίο Σχήμα</span>
                    <div className="border-2 border-indigo-700 rounded-xl overflow-hidden flex w-full h-24 sm:h-28 text-white font-mono font-black text-xs shadow-xs">
                      <div className="bg-indigo-500 flex flex-col justify-center items-center w-full transition-all p-1 text-center">
                        <span className="truncate max-w-full">{valA} × ({valB + valC})</span>
                        <span className="text-[11px] font-normal opacity-85">({valA * (valB + valC)})</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">Εμβαδόν ＝ {valA * (valB + valC)}</span>
                  </div>

                  {/* Split Shape */}
                  <div className="flex flex-col items-center gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 w-full shadow-xs">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Επιμερισμένο</span>
                    <div className="border-2 border-slate-700 rounded-xl overflow-hidden flex w-full h-24 sm:h-28 text-white font-mono font-black text-xs shadow-xs">
                      <div className="bg-emerald-500 flex flex-col justify-center items-center transition-all p-1 text-center" style={{ flexGrow: Math.max(valB, 1) }}>
                        <span className="truncate max-w-full">{valA} × {valB}</span>
                        <span className="text-[10px] font-normal opacity-85">({valA * valB})</span>
                      </div>
                      <div className="bg-cyan-500 flex flex-col justify-center items-center transition-all border-l-2 border-dashed border-white/60 p-1 text-center" style={{ flexGrow: Math.max(valC, 1) }}>
                        <span className="truncate max-w-full">{valA} × {valC}</span>
                        <span className="text-[10px] font-normal opacity-85">({valA * valC})</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">Εμβαδόν ＝ {valA * valB + valA * valC}</span>
                  </div>
                </div>
              )}

              <div className="text-center text-[11px] sm:text-xs font-bold text-slate-400 pt-2 border-t border-slate-100 w-full">
                <span>🔍 Οι ιδιότητες μάς επιτρέπουν να απλοποιούμε δύσκολους νοερούς υπολογισμούς!</span>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Κατανόησες τις ιδιότητες του πολλαπλασιασμού; Δοκίμασε τις διαδραστικές ασκήσεις για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>
          <Link
            href="/st-dimotikou/06-pollaplasiasmos-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}
