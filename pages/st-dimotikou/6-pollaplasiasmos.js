// pages/st-dimotikou/6-pollaplasiasmos.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ΜΕΤΑΒΛΗΤΕΣ ΟΡΙΩΝ
const LIMITS = {
  MIN_VALUE: 0,
  MAX_VALUE: 10000,
  MAX_VISUAL_DOTS: 10000,
  MIN_3D: 1,
  MAX_3D: 5
};

export default function PollaplasiasmosPage() {
  const [activeTab, setActiveTab] = useState('antimetathetiki'); // 'antimetathetiki', 'prosetairistiki', 'epimeristiki'
  
  // Κατάσταση για Αντιμεταθετική
  const [inputRows, setInputRows] = useState("5");
  const [inputCols, setInputCols] = useState("3");
  const [rotated, setRotated] = useState(false);

  const valRows = parseInt(inputRows) || 0;
  const valCols = parseInt(inputCols) || 0;
  const currentRows = rotated ? valCols : valRows;
  const currentCols = rotated ? valRows : valCols;
  const antimetathetikiResult = valRows * valCols;

  // Κατάσταση για Προσεταιριστική
  const [prosW, setProsW] = useState("4"); 
  const [prosD, setProsD] = useState("3"); 
  const [prosH, setProsH] = useState("2"); 

  const valW = Math.max(LIMITS.MIN_3D, Math.min(parseInt(prosW) || 1, LIMITS.MAX_3D));
  const valD = Math.max(LIMITS.MIN_3D, Math.min(parseInt(prosD) || 1, LIMITS.MAX_3D));
  const valH = Math.max(LIMITS.MIN_3D, Math.min(parseInt(prosH) || 1, LIMITS.MAX_3D));
  const totalVolume = valW * valD * valH;

  // Κατάσταση για Επιμεριστική
  const [distA, setPropA] = useState("4");
  const [distB, setPropB] = useState("3");
  const [distC, setPropC] = useState("2");

  const valA = parseFloat(distA) || 0;
  const valB = parseFloat(distB) || 0;
  const valC = parseFloat(distC) || 0;

  // Έλεγχος εισαγωγής για Αντιμεταθετική
  const handleAntimetathetikiChange = (val, setter) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    if (cleanVal === "") {
      setter("");
      setRotated(false);
      return;
    }
    const num = parseInt(cleanVal);
    if (num >= LIMITS.MIN_VALUE && num <= LIMITS.MAX_VALUE) {
      setter(cleanVal);
      setRotated(false);
    }
  };

  // Έλεγχος εισαγωγής για Προσεταιριστική
  const handleProsetairistikiChange = (val, setter) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    if (cleanVal === "") {
      setter("");
      return;
    }
    const num = parseInt(cleanVal);
    if (num >= LIMITS.MIN_3D && num <= LIMITS.MAX_3D) {
      setter(cleanVal);
    }
  };

  // Έλεγχος εισαγωγής για Επιμεριστική (Μέχρι 2 ψηφία ή δεκαδικό)
  const handleInputChange = (val, setter) => {
    const cleanVal = val.replace(/[^0-9.]/g, '');
    if (cleanVal.length <= 3) {
      setter(cleanVal);
    }
  };

  // Σχεδίαση εφαπτόμενων τετραγώνων (Tab 1)
  const renderVisualTiles = () => {
    const tiles = [];
    const containerSize = 340;
    const cellW = containerSize / currentCols;
    const cellH = containerSize / currentRows;
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
            className="fill-amber-400 stroke-amber-500 stroke-[0.5] transition-all duration-200"
          />
        );
      }
    }
    return tiles;
  };

  // Σχεδίαση 3D Ισομετρικού Κύβου (Tab 2)
  const renderIsometricCube = (highlightMode) => {
    const cubes = [];
    const size = 16;
    const isoX = (x, y, z) => 100 + (x - y) * size * 0.866;
    const isoY = (x, y, z) => 90 + (x + y) * size * 0.5 - z * size;

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

          const topFace = `${cx},${cy} ${cx + size*0.866},${cy + size*0.5} ${cx},${cy + size} ${cx - size*0.866},${cy + size*0.5}`;
          const leftFace = `${cx - size*0.866},${cy + size*0.5} ${cx},${cy + size} ${cx},${cy + size + size} ${cx - size*0.866},${cy + size*0.5 + size}`;
          const rightFace = `${cx},${cy + size} ${cx + size*0.866},${cy + size*0.5} ${cx + size*0.866},${cy + size*0.5 + size} ${cx},${cy + size + size}`;

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
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>✖️ Ιδιότητες Πολλαπλασιασμού - LearnMaths.gr</title>
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
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>📖</span> Θεωρία: Ιδιότητες Πολλαπλασιασμού
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  Ο πολλαπλασιασμός είναι μια σύντομη πρόσθεση ίσων προσθετέων. Για να κάνουμε πιο γρήγορα τις πράξεις, χρησιμοποιούμε τρεις βασικές ιδιότητες.
                </p>
                <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 text-sm md:text-base font-medium">
                  <p>🔄 <strong>Αντιμεταθετική:</strong> Μπορούμε να αλλάξουμε τη σειρά των παραγόντων (α × β = β × α).</p>
                  <p>🧠 <strong>Προσεταιριστική:</strong> Σε έναν πολλαπλασιασμό τριών αριθμών, μπορούμε να επιλέξουμε ποια ζευγάρια θα πολλαπλασιάσουμε πρώτα.</p>
                  <p>📐 <strong>Επιμεριστική:</strong> Μπορούμε να πολλαπλασιάσουμε έναν αριθμό με ένα άθροισμα, πολλαπλασιάζοντάς τον ξεχωριστά με κάθε προσθετέο [α × (β + γ) = α × β + α × γ].</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md text-center py-10 flex flex-col justify-center items-center gap-3">
                <span className="text-amber-300 font-black text-lg">✨ Το «Ένα» και το «Μηδέν»</span>
                <p className="text-xs md:text-sm text-indigo-50 leading-relaxed font-medium max-w-sm">
                  • Το <strong>1</strong> είναι το ουδέτερο στοιχείο: Κάθε αριθμός που πολλαπλασιάζεται με το 1 παραμένει ο ίδιος (5 × 1 = 5).<br/>
                  • Το <strong>0</strong> είναι το απορροφητικό στοιχείο: Κάθε αριθμός που πολλαπλασιάζεται με το 0 γίνεται μηδέν (5 × 0 = 0).</p>
              </div>
            </div>
          </div>

          {/* TABS ΕΝΑΛΛΑΓΗΣ */}
          <div className="flex flex-wrap justify-center bg-gray-200/60 p-1.5 rounded-2xl max-w-xl mx-auto shadow-inner gap-1">
            <button  
              onClick={() => setActiveTab('antimetathetiki')}
              className={`flex-1 min-w-[140px] py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'antimetathetiki' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              🔄 Αντιμεταθετική
            </button>
            <button  
              onClick={() => setActiveTab('prosetairistiki')}
              className={`flex-1 min-w-[140px] py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'prosetairistiki' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              📦 Προσεταιριστική
            </button>
            <button  
              onClick={() => setActiveTab('epimeristiki')}
              className={`flex-1 min-w-[140px] py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'epimeristiki' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              📐 Επιμεριστική
            </button>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[480px] w-full gap-6">
              
              {activeTab === 'antimetathetiki' && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Δυναμική Αντιμεταθετική Ιδιότητα</h3>
                    <p className="text-gray-500 text-sm">Γράψε δύο αριθμούς (από {LIMITS.MIN_VALUE} έως {LIMITS.MAX_VALUE}) και δες το πλέγμα των τετραγώνων να προσαρμόζεται.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col gap-4 shadow-inner my-auto">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                      <div className="flex flex-col items-center gap-1 w-full sm:max-w-[140px]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παράγοντας Α</span>
                        <input  
                          type="text"  
                          value={inputRows}
                          onChange={(e) => handleAntimetathetikiChange(e.target.value, setInputRows)}
                          className="text-lg font-black text-center p-2 bg-white border-2 border-emerald-200 rounded-xl shadow-sm w-full text-emerald-600 outline-none focus:border-emerald-500 tracking-normal"
                          placeholder="Σειρές"
                        />
                      </div>
                      <span className="text-xl font-black text-slate-400 mt-4 flex-shrink-0">×</span>
                      <div className="flex flex-col items-center gap-1 w-full sm:max-w-[140px]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παράγοντας Β</span>
                        <input  
                          type="text"  
                          value={inputCols}
                          onChange={(e) => handleAntimetathetikiChange(e.target.value, setInputCols)}
                          className="text-lg font-black text-center p-2 bg-white border-2 border-blue-200 rounded-xl shadow-sm w-full text-blue-600 outline-none focus:border-blue-500 tracking-normal"
                          placeholder="Στήλες"
                        />
                      </div>
                    </div>

                    <div className="font-mono font-black text-lg md:text-xl bg-white p-3 rounded-xl border shadow-sm text-center w-full max-w-sm mx-auto text-slate-700">
                      <span className={rotated ? "text-blue-600" : "text-emerald-600"}>{currentRows || 0}</span>
                      <span className="text-slate-400 mx-2">×</span>
                      <span className={rotated ? "text-emerald-600" : "text-blue-600"}>{currentCols || 0}</span>
                      <span className="text-slate-400 mx-2">=</span>
                      <span className="text-purple-600 bg-purple-50 px-3 py-0.5 rounded-lg">{antimetathetikiResult.toLocaleString('el-GR')}</span>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={() => setRotated(!rotated)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow transition-all flex items-center gap-2"
                      >
                        🔄 Περιστροφή Παραγόντων
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs md:text-sm font-bold text-emerald-900 text-center shadow-inner">
                    🎯 Το γινόμενο παραμένει ακριβώς το ίδιο, όποια σειρά κι αν έχουν οι αριθμοί!
                  </div>
                </>
              )}

              {activeTab === 'prosetairistiki' && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Δυναμική Προσεταιριστική Ιδιότητα</h3>
                    <p className="text-gray-500 text-sm">Άλλαξε τις 3 διαστάσεις (από {LIMITS.MIN_3D} έως {LIMITS.MAX_3D}) για να δεις τους δύο τρόπους υπολογισμού του όγκου.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl w-full flex flex-col gap-4 shadow-inner my-auto">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Πλάτος (α)</span>
                        <input type="text" value={prosW} onChange={(e) => handleProsetairistikiChange(e.target.value, setProsW)} className="w-full max-w-[70px] p-2 border-2 border-slate-200 rounded-xl text-center font-black text-indigo-600 outline-none focus:border-indigo-500" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Βάθος (β)</span>
                        <input type="text" value={prosD} onChange={(e) => handleProsetairistikiChange(e.target.value, setProsD)} className="w-full max-w-[70px] p-2 border-2 border-slate-200 rounded-xl text-center font-black text-blue-600" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Ύψος (γ)</span>
                        <input type="text" value={prosH} onChange={(e) => handleProsetairistikiChange(e.target.value, setProsH)} className="w-full max-w-[70px] p-2 border-2 border-slate-200 rounded-xl text-center font-black text-amber-500" />
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border shadow-sm font-mono text-xs md:text-sm text-left space-y-2 text-slate-700">
                      <div className="p-2 bg-amber-50/50 border border-amber-100 rounded-lg">
                        📌 <strong className="text-amber-600">1ος Τρόπος (Βάση × Ύψος):</strong><br/>
                        ({valW} × {valD}) × {valH} = {valW * valD} × {valH} = <strong className="text-purple-600">{totalVolume}</strong>
                      </div>
                      <div className="p-2 bg-blue-50/40 border border-blue-100 rounded-lg">
                        📌 <strong className="text-blue-600">2ος Τρόπος (Πλάτος × Φέτα):</strong><br/>
                        {valW} × ({valD} × {valH}) = {valW} × {valD * valH} = <strong className="text-purple-600">{totalVolume}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-900 font-medium">
                    💡 Παρατήρησε στα δεξιά πώς φωτίζεται με κίτρινο χρώμα η ομάδα των κύβων που πολλαπλασιάζουμε κάθε φορά πρώτα!
                  </div>
                </>
              )}

              {activeTab === 'epimeristiki' && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Επιμεριστική Ιδιότητα</h3>
                    <p className="text-gray-500 text-sm">Συμπλήρωσε τους αριθμούς στην οριζόντια μαθηματική δομή και δες πώς μοιράζεται ο πολλαπλασιασμός.</p>
                  </div>

                  {/* ΑΝΑΒΑΘΜΙΣΜΕΝΟ ΜΑΘΗΜΑΤΙΚΟ ΠΛΑΙΣΙΟ ΜΕ ΣΥΜΒΟΛΑ, ΠΑΡΕΝΘΕΣΕΙΣ ΚΑΙ ΠΡΟΣΘΕΣΗ */}
                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full flex flex-col gap-5 shadow-inner my-auto items-center justify-center">
                    <div className="flex items-center gap-2 font-mono font-black text-xl md:text-2xl text-slate-700 flex-wrap justify-center">
                      
                      {/* Input α */}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">α</span>
                        <input 
                          type="text" 
                          value={distA} 
                          onChange={(e) => handleInputChange(e.target.value, setPropA)} 
                          className="w-14 p-2 border-2 border-blue-200 rounded-xl text-center font-black text-blue-600 bg-white outline-none focus:border-blue-500 text-lg shadow-sm" 
                        />
                      </div>

                      <span className="text-slate-400 mx-0.5">×</span>
                      <span className="text-gray-400 text-2xl font-light">(</span>

                      {/* Input β */}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">β</span>
                        <input 
                          type="text" 
                          value={distB} 
                          onChange={(e) => handleInputChange(e.target.value, setPropB)} 
                          className="w-14 p-2 border-2 border-emerald-200 rounded-xl text-center font-black text-emerald-500 bg-white outline-none focus:border-emerald-400 text-lg shadow-sm" 
                        />
                      </div>

                      <span className="text-slate-400 mx-0.5">+</span>

                      {/* Input γ */}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">γ</span>
                        <input 
                          type="text" 
                          value={distC} 
                          onChange={(e) => handleInputChange(e.target.value, setPropC)} 
                          className="w-14 p-2 border-2 border-cyan-200 rounded-xl text-center font-black text-cyan-600 bg-white outline-none focus:border-cyan-500 text-lg shadow-sm" 
                        />
                      </div>

                      <span className="text-gray-400 text-2xl font-light">)</span>
                    </div>

                    {/* Αναλυτικά Αποτελέσματα */}
                    <div className="bg-white p-3 rounded-xl border shadow-sm font-mono text-xs md:text-sm text-center w-full max-w-sm space-y-1.5 text-slate-700">
                      <div>Oλόκληρο: {valA} × ({valB} + {valC}) = {valA} × {valB + valC} = <strong>{valA * (valB + valC)}</strong></div>
                      <div className="text-slate-200 border-t border-dashed my-1"></div>
                      <div>Επιμερισμένα: ({valA} × {valB}) + ({valA} × {valC}) = {valA * valB} + {valA * valC} = <strong>{valA * valB + valA * valC}</strong></div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-900 font-medium text-center shadow-inner">
                    📐 Παρατήρησε στα δεξιά τη σύγκριση ανάμεσα στο ενιαίο και στο μοιρασμένο σχήμα!
                  </div>
                </>
              )}
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[480px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              {activeTab === 'antimetathetiki' && (
                <div className="my-auto flex flex-col items-center gap-4 w-full px-4 text-center">
                  {antimetathetikiResult <= LIMITS.MAX_VISUAL_DOTS && currentRows > 0 && currentCols > 0 ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-slate-50 p-4 rounded-2xl border shadow-inner">
                        <svg width="340" height="340" viewBox="0 0 340 340" className="bg-white rounded-xl overflow-hidden">
                          {renderVisualTiles()}
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Διάταξη: {currentRows} γραμμές × {currentCols} στήλες</span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl max-w-xs mx-auto text-slate-500 text-sm font-medium space-y-2 shadow-inner">
                      <p>📏 <strong>Πάρα πολύ μεγάλο γινόμενο!</strong></p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Το γινόμενο ({antimetathetikiResult.toLocaleString('el-GR')}) ξεπερνάει το όριο οπτικοποίησης, αλλά η μαθηματική σχέση παραμένει απόλυτα σωστή!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'prosetairistiki' && (
                <div className="my-auto flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl">
                  <div className="flex flex-col items-center gap-1 bg-slate-50 p-3 rounded-2xl border w-full max-w-[210px] shadow-sm">
                    <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded uppercase">1ος Τρόπος (Βάση)</span>
                    <svg viewBox="0 0 200 180" className="w-full h-auto overflow-visible">
                      {renderIsometricCube('base')}
                    </svg>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">({valW} × {valD}) × {valH}</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 bg-slate-50 p-3 rounded-2xl border w-full max-w-[210px] shadow-sm">
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase">2ος Τρόπος (Φέτα)</span>
                    <svg viewBox="0 0 200 180" className="w-full h-auto overflow-visible">
                      {renderIsometricCube('slice')}
                    </svg>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">{valW} × ({valD} × {valH})</span>
                  </div>
                </div>
              )}

              {activeTab === 'epimeristiki' && (
                /* ΔΥΟ ΣΧΗΜΑΤΑ ΔΙΠΛΑ-ΔΙΠΛΑ: ΟΛΟΚΛΗΡΟ ΚΑΙ ΕΠΙΜΕΡΙΣΜΕΝΟ */
                <div className="my-auto flex flex-col sm:flex-row items-center justify-center gap-6 w-full px-2 max-w-xl">
                  
                  {/* Σχήμα 1: Ολόκληρο */}
                  <div className="flex flex-col items-center gap-2 bg-slate-50 p-3.5 rounded-2xl border w-full max-w-[220px] shadow-sm">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">Ολόκληρο Σχήμα</span>
                    <div className="border-2 border-indigo-700 rounded-xl overflow-hidden flex w-full h-32 text-white font-mono font-black text-sm shadow-sm">
                      <div className="bg-indigo-500 flex flex-col justify-center items-center w-full transition-all duration-300">
                        <span>{valA} × ({valB + valC})</span>
                        <span className="text-xs font-normal opacity-85">({valA * (valB + valC)})</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 font-bold">Εμβαδόν = {valA * (valB + valC)}</span>
                  </div>

                  {/* Σχήμα 2: Επιμερισμένο */}
                  <div className="flex flex-col items-center gap-2 bg-slate-50 p-3.5 rounded-2xl border w-full max-w-[220px] shadow-sm">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">Επιμερισμένο Σχήμα</span>
                    <div className="border-2 border-slate-700 rounded-xl overflow-hidden flex w-full h-32 text-white font-mono font-black text-sm shadow-sm">
                      <div className="bg-emerald-500 flex flex-col justify-center items-center transition-all duration-300" style={{ flexGrow: Math.max(valB, 1) }}>
                        <span>{valA} × {valB}</span>
                        <span className="text-[11px] font-normal opacity-85">({valA * valB})</span>
                      </div>
                      <div className="bg-cyan-500 flex flex-col justify-center items-center transition-all duration-300 border-l-2 border-dashed border-white/50" style={{ flexGrow: Math.max(valC, 1) }}>
                        <span>{valA} × {valC}</span>
                        <span className="text-[11px] font-normal opacity-85">({valA * valC})</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 font-bold">Εμβαδόν = {valA * valB + valA * valC}</span>
                  </div>

                </div>
              )}

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>🔍 Οι ιδιότητες μάς βοηθούν να σπάμε μεγάλους αριθμούς σε πιο απλά γινόμενα με το μυαλό!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστικός Πολλαπλασιασμός ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
