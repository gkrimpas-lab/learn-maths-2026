import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// ============================================================================
// ΚΕΝΤΡΙΚΕΣ ΡΥΘΜΙΣΕΙΣ ΕΦΑΡΜΟΓΗΣ (CONFIG)
// ============================================================================
const CONFIG = {
  variable: {
    min: -10,
    max: 10,
    default: 5,
    multiplier: 3,
    adder: 2
  },
  equation1: { // x + a = b
    aMin: 1,
    aMax: 5,
    aDefault: 3,
    bMin: 1,
    bMax: 20,
    bDefault: 8
  },
  equation2: { // ax = b
    aMin: 2,
    aMax: 5,
    aDefault: 3,
    bMin: 2,
    bMax: 20,
    bDefault: 8
  },
  functions: {
    min: -10,
    max: 10,
    step: 0.1,
    defaultA1: 1,
    defaultA2: 1,
    defaultB: 2
  }
};

export default function BGymnasiou() {
  const [activeTab, setActiveTab] = useState('variable');

  // States για την 0η καρτέλα (Μεταβλητή)
  const [varX, setVarX] = useState(CONFIG.variable.default);

  // States για την 1η καρτέλα (Εξισώσεις μορφής x + a = b)
  const [eq1A, setEq1A] = useState(CONFIG.equation1.aDefault);
  const [eq1B, setEq1B] = useState(CONFIG.equation1.bDefault);
  const [isSolved1, setIsSolved1] = useState(false);

  // States για τη 2η καρτέλα (Εξισώσεις μορφής ax = b)
  const [eq2A, setEq2A] = useState(CONFIG.equation2.aDefault);
  const [eq2B, setEq2B] = useState(CONFIG.equation2.bDefault);
  const [timeline, setTimeline] = useState(0); // Μπάρα προόδου από 0 έως 100

  // States για την 3η καρτέλα (y = ax)
  const [slopeA1, setSlopeA1] = useState(CONFIG.functions.defaultA1);

  // States για τη 4η καρτέλα (y = ax + b)
  const [slopeA2, setSlopeA2] = useState(CONFIG.functions.defaultA2);
  const [interceptB, setInterceptB] = useState(CONFIG.functions.defaultB);
  const [showComparison, setShowComparison] = useState(true);

  // Συναρτήσεις υπολογισμού για το SVG των συναρτήσεων
  const toSvgX = (mathX) => 150 + mathX * 11;
  const toSvgY = (mathY) => 150 - mathY * 11;

  // Σχεδίαση κλασματικής πίτας-μπαλονιού
  const renderDotPie = (cx, cy, r, totalSlices) => {
    const slices = [];
    for (let i = 0; i < totalSlices; i++) {
      const startAngle = (i * 360) / totalSlices - 90;
      const endAngle = ((i + 1) * 360) / totalSlices - 90;
      const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
      const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
      const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
      const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);
      
      const isFirstSlice = i === 0; 
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
      slices.push(
        <path 
          key={i} d={pathData} 
          className={`${isFirstSlice ? 'fill-blue-500 stroke-blue-600' : 'fill-slate-200 stroke-slate-400'} stroke-[0.3]`} 
        />
      );
    }
    return slices;
  };

  const renderLine = (a, b = 0, color = "indigo", dashed = false) => {
    const xStart = -15; const yStart = a * xStart + b;
    const xEnd = 15; const yEnd = a * xEnd + b;
    return (
      <line 
        x1={toSvgX(xStart)} y1={toSvgY(yStart)} 
        x2={toSvgX(xEnd)} y2={toSvgY(yEnd)} 
        className={`${dashed ? 'stroke-slate-400 opacity-40' : 'stroke-' + color + '-600'} transition-all duration-150`}
        strokeWidth={dashed ? "2" : "3"} strokeDasharray={dashed ? "5,5" : "0"} strokeLinecap="round"
      />
    );
  };

  const wholePart = Math.floor(eq2B / eq2A); 
  const remainderPart = eq2B % eq2A; 

  // ============================================================================
  // ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΘΕΣΕΩΝ ΓΙΑ ΤΟ TIMELINE SLIDER (Στάδια 0% έως 100%)
  // ============================================================================
  // 0% - 40%: Ταξίδι και συγκέντρωση στο κέντρο της ζυγαριάς
  // 40% - 85%: Στάση και αναμονή για παρατήρηση των ομάδων
  // 85% - 100%: Εξαφανίζονται τα πλεονάζοντα στοιχεία (Fade out)
  const getInterpolatedCoords = (startX, startY, targetX, targetY) => {
    let currentX = startX;
    let currentY = startY;
    let opacity = 1;

    if (timeline <= 40) {
      // Φάση 1: Κίνηση προς το κέντρο
      const p = timeline / 40;
      currentX = startX + (targetX - startX) * p;
      currentY = startY + (targetY - startY) * p;
    } else if (timeline > 40 && timeline <= 85) {
      // Φάση 2: Σταθεροποίηση στο κέντρο
      currentX = targetX;
      currentY = targetY;
    } else {
      // Φάση 3: Fade out
      currentX = targetX;
      currentY = targetY;
      opacity = 1 - (timeline - 85) / 15;
    }

    return { x: currentX, y: currentY, opacity };
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>Β' Γυμνασίου: Μαθηματικά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </Head>

      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">LearnMaths<span className="text-indigo-600">.gr</span></Link>
          <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">🏠 Αρχική</Link>
        </div>
      </nav>

      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-10 text-center shadow-inner">
        <h1 className="text-4xl font-black mb-2">🎒 Μαθηματικά Β' Γυμνασίου</h1>
        <p className="text-indigo-100 opacity-90 font-medium">Αλγεβρικές Έννοιες & Συναρτήσεις</p>
      </header>

      {/* ΚΕΝΤΡΙΚΟ ΜΕΝΟΥ */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-white p-2 rounded-xl shadow-sm w-full lg:w-max">
          <button onClick={() => setActiveTab('variable')} className={`px-3 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'variable' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            📦 0. Η Μεταβλητή
          </button>
          <button onClick={() => setActiveTab('equations')} className={`px-3 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'equations' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            ⚖️ 1. Εξίσωση x + α = β
          </button>
          <button onClick={() => setActiveTab('equations_mult')} className={`px-3 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'equations_mult' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            🎯 2. Εξίσωση α·x = β
          </button>
          <button onClick={() => setActiveTab('functions_ax')} className={`px-3 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'functions_ax' ? 'bg-indigo-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            🎒 3. Συνάρτηση y = αx
          </button>
          <button onClick={() => setActiveTab('functions_axb')} className={`px-3 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'functions_axb' ? 'bg-indigo-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            🚀 4. Συνάρτηση y = αx + β
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* TAB 0: Η ΕΝΝΟΙΑ ΤΗΣ ΜΕΤΑΒΛΗΤΗΣ */}
        {activeTab === 'variable' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">📦 Τι είναι η Μεταβλητή;</h2>
                <p className="text-gray-600 leading-relaxed text-sm">Στα Μαθηματικά, <strong>μεταβλητή</strong> είναι ένα γράμμα (συνήθως το <span className="font-bold text-amber-600">x</span>) που χρησιμοποιούμε για να παραστήσουμε έναν αριθμό που <strong>δεν είναι σταθερός</strong>, αλλά μπορεί να αλλάζει τιμές.</p>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 space-y-10">
              <h3 className="text-center font-black text-gray-400 uppercase tracking-widest text-sm">Το Μηχάνημα των Μαθηματικών</h3>
              <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border text-center space-y-4 w-48">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">1. Είσοδος (x)</span>
                    <div className="text-4xl font-black text-amber-500">{varX}</div>
                    <input type="range" min={CONFIG.variable.min} max={CONFIG.variable.max} value={varX} onChange={(e) => setVarX(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg cursor-pointer accent-amber-500"/>
                  </div>
                </div>
                <div className="bg-indigo-600 p-1 rounded-2xl shadow-xl">
                  <div className="bg-white p-8 rounded-xl border-4 border-indigo-600 text-center space-y-4">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase block">2. Επεξεργασία (Αντικατάσταση)</span>
                    <div className="flex items-center justify-center gap-2 text-2xl font-black text-slate-800">
                      <span>{CONFIG.variable.multiplier} ·</span>
                      <div className="flex items-center">
                        {varX < 0 && <span className="text-indigo-600 mr-1 text-3xl font-light">(</span>}
                        <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-lg border border-amber-200">{varX}</span>
                        {varX < 0 && <span className="text-indigo-600 ml-1 text-3xl font-light">)</span>}
                      </div>
                      <span>+ {CONFIG.variable.adder} =</span>
                      <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg border border-emerald-200">{(CONFIG.variable.multiplier * varX) + CONFIG.variable.adder}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border text-center space-y-4 w-48">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">3. Έξοδος (y)</span>
                    <div className="text-4xl font-black text-emerald-500">{(CONFIG.variable.multiplier * varX) + CONFIG.variable.adder}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: ΕΞΙΣΩΣΗ x + a = b */}
        {activeTab === 'equations' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">⚖️ Εξίσωση της μορφής x + α = β</h2>
                <p className="text-gray-600 leading-relaxed text-sm">💡 <strong>Η αρχή της ισορροπίας:</strong> Αφαιρούμε το ίδιο βάρος «α» και από τις δύο μεριές της ζυγαριάς.</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap justify-center items-center gap-6 text-xs max-w-xl mx-auto">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">Βάρος α:</span>
                  <button onClick={() => { setEq1A(Math.max(CONFIG.equation1.aMin, eq1A - 1)); setIsSolved1(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">-</button>
                  <span className="font-black text-orange-600 text-sm w-4 text-center">{eq1A}</span>
                  <button onClick={() => { if(eq1A < eq1B) setEq1A(Math.min(CONFIG.equation1.aMax, eq1A + 1)); setIsSolved1(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">+</button>
                </div>
                <div className="w-[1px] h-4 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">Σύνολο β:</span>
                  <button onClick={() => { setEq1B(Math.max(eq1A + 1, eq1B - 1)); setIsSolved1(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">-</button>
                  <span className="font-black text-blue-600 text-sm w-4 text-center">{eq1B}</span>
                  <button onClick={() => { setEq1B(Math.min(CONFIG.equation1.bMax, eq1B + 1)); setIsSolved1(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">+</button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border flex flex-col items-center justify-center max-w-xl mx-auto shadow-sm space-y-4">
                <div className="text-lg font-mono font-black text-slate-700 bg-slate-50 p-2 px-6 rounded-lg border">
                  {!isSolved1 ? <span>x + {eq1A} = {eq1B}</span> : <span className="text-orange-600">x + {eq1A} <span className="font-light opacity-40">- {eq1A}</span> = {eq1B} <span className="font-light opacity-40">- {eq1A}</span></span>}
                </div>

                <div className="w-full max-w-[340px] aspect-[4/3] bg-slate-50/50 rounded-xl border p-2">
                  <svg viewBox="0 0 200 150" className="w-full h-full">
                    <path d="M 85 130 L 115 130 L 105 90 L 95 90 Z" className="fill-slate-400" />
                    <line x1="100" y1="90" x2="100" y2="40" className="stroke-slate-500 stroke-[3]" />
                    <line x1="40" y1="40" x2="160" y2="40" className="stroke-slate-500 stroke-2" />
                    <g>
                      <line x1="40" y1="40" x2="20" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="40" y1="40" x2="60" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="15" y1="85" x2="65" y2="85" className="stroke-orange-500 stroke-2" />
                      <rect x="22" y="67" width="16" height="16" className="fill-indigo-500 stroke-indigo-700 rounded" />
                      <text x="27" y="79" className="text-[10px] font-black fill-white font-mono">x</text>
                      {Array.from({ length: eq1A }).map((_, i) => (
                        <circle key={i} cx={45 + (i%2)*10} cy={79 - Math.floor(i/2)*8} r="3.5" className={`fill-orange-500 stroke-orange-600 ${isSolved1 ? 'animate-lift-left' : ''}`} />
                      ))}
                    </g>
                    <g>
                      <line x1="160" y1="40" x2="140" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="160" y1="40" x2="180" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="135" y1="85" x2="185" y2="85" className="stroke-blue-500 stroke-2" />
                      {Array.from({ length: (eq1B - eq1A) }).map((_, i) => (
                        <circle key={i} cx={142 + (i%4)*9} cy={79 - Math.floor(i/4)*7} r="3" className="fill-blue-500 stroke-blue-600" />
                      ))}
                      {isSolved1 && Array.from({ length: eq1A }).map((_, i) => {
                        const startIndex = (eq1B - eq1A) + i;
                        return <circle key={startIndex} cx={142 + (startIndex%4)*9} cy={79 - Math.floor(startIndex/4)*7} r="3" className="fill-blue-500 stroke-blue-600 animate-lift-right" />
                      })}
                      {!isSolved1 && Array.from({ length: eq1A }).map((_, i) => {
                        const startIndex = (eq1B - eq1A) + i;
                        return <circle key={startIndex} cx={142 + (startIndex%4)*9} cy={79 - Math.floor(startIndex/4)*7} r="3" className="fill-blue-500 stroke-blue-600" />
                      })}
                    </g>
                  </svg>
                </div>

                <button onClick={() => setIsSolved1(!isSolved1)} className={`w-full py-2.5 rounded-xl font-black text-xs text-white ${!isSolved1 ? 'bg-orange-500' : 'bg-slate-600'}`}>
                  {!isSolved1 ? `⚡ Αφαίρεσε το βάρος ${eq1A}` : '🔄 Επαναφορά Ζυγαριάς'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ΕΞΙΣΩΣΗ ax = b (ΜΕ TIMELINE SLIDER ΚΑΙ ΧΩΡΙΣ ΚΟΥΜΠΙ ΠΑΥΣΗΣ) */}
        {(activeTab === 'functions_mult' || activeTab === 'equations_mult') && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">🎯 Εξίσωση της μορφής α·x = β</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Σύρετε τη <strong>Μπάρα Προόδου (Timeline)</strong> για να ελέγξετε την κίνηση των στοιχείων και να δείτε πώς χωρίζονται και εξουδετερώνονται live οι όροι!
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white p-5 rounded-2xl shadow-md flex flex-col justify-center">
                <h3 className="font-bold text-sm text-amber-100 mb-1">📋 Μαθηματικός Κανόνας</h3>
                <p className="text-xs font-mono bg-black/10 p-2 rounded text-center text-base font-bold">α·x = β  ⇒  x = β / α</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              
              {/* Ρυθμίσεις Παραμέτρων */}
              <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap justify-center items-center gap-6 text-xs max-w-xl mx-auto">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">Πλήθος κουτιών (α):</span>
                  <button onClick={() => { setEq2A(Math.max(CONFIG.equation2.aMin, eq2A - 1)); setTimeline(0); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">-</button>
                  <span className="font-black text-amber-600 text-sm w-4 text-center">{eq2A}</span>
                  <button onClick={() => { setEq2A(Math.min(CONFIG.equation2.aMax, eq2A + 1)); setTimeline(0); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">+</button>
                </div>
                <div className="w-[1px] h-4 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">Συνολικά μπαλάκια (β):</span>
                  <button onClick={() => { setEq2B(Math.max(CONFIG.equation2.bMin, eq2B - 1)); setTimeline(0); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">-</button>
                  <span className="font-black text-blue-600 text-sm w-4 text-center">{eq2B}</span>
                  <button onClick={() => { setEq2B(Math.min(CONFIG.equation2.bMax, eq2B + 1)); setTimeline(0); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">+</button>
                </div>
              </div>

              {/* ΔΙΟΡΘΩΘΗΚΕ: ΝΕΟ ΔΙΑΔΡΑΣΤΙΚΟ TIMELINE SLIDER (Όλο το animation κρέμεται από εδώ) */}
              <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm max-w-xl mx-auto space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                  <span className={timeline === 0 ? 'text-amber-600 font-black' : ''}>🏁 1. Αρχική Μορφή</span>
                  <span className={timeline > 0 && timeline < 85 ? 'text-indigo-600 font-black' : ''}>🔄 2. Διαίρεση / Ομάδες</span>
                  <span className={timeline === 100 ? 'text-emerald-600 font-black' : ''}>✅ 3. Λύση</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={timeline} 
                  onChange={(e) => setTimeline(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 shadow-inner"
                />
                <div className="text-center font-mono text-[11px] font-black text-slate-400">
                  Θέση Animation: {timeline}%
                </div>
              </div>

              {/* ΖΥΓΑΡΙΑ ΜΟΡΦΗΣ ax = b */}
              <div className="bg-white p-6 rounded-2xl border flex flex-col items-center justify-center max-w-xl mx-auto shadow-sm space-y-4">
                
                <div className="text-lg font-mono font-black text-slate-700 bg-slate-50 p-2 px-6 rounded-lg border">
                  {timeline < 15 ? (
                    <span>{eq2A} · x = {eq2B}</span>
                  ) : (
                    <span className="text-amber-600">({eq2A} · x) ÷ {eq2A} = {eq2B} ÷ {eq2A}</span>
                  )}
                </div>

                <div className="w-full max-w-[340px] aspect-[4/3] bg-slate-50/50 rounded-xl border p-2">
                  <svg viewBox="0 0 200 150" className="w-full h-full">
                    <path d="M 85 130 L 115 130 L 105 90 L 95 90 Z" className="fill-slate-400" />
                    <line x1="100" y1="90" x2="100" y2="40" className="stroke-slate-500 stroke-[3]" />
                    <line x1="40" y1="40" x2="160" y2="40" className="stroke-slate-500 stroke-2" />

                    {/* ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ */}
                    <g>
                      <line x1="40" y1="40" x2="20" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="40" y1="40" x2="60" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="15" y1="85" x2="65" y2="85" className="stroke-amber-500 stroke-2" />

                      {/* 1ο Κουτί x - Μένει πάντα σταθερό κάτω αριστερά */}
                      <rect x="20" y="71" width="14" height="14" className="fill-indigo-600 stroke-indigo-800 rounded shadow-sm" />
                      <text x="24" y="81" className="text-[8px] font-black fill-white font-mono">x</text>

                      {/* Τα υπόλοιπα κουτιά x - Μετακινούνται δυναμικά βάσει του slider */}
                      {Array.from({ length: eq2A - 1 }).map((_, i) => {
                        const idx = i + 1;
                        const startGridX = 20 + (idx % 2) * 16;
                        const startGridY = 71 - Math.floor(idx / 2) * 15;
                        
                        const targetCenterX = (75 + i * 17) - startGridX;
                        const targetCenterY = 22 - startGridY;

                        // Υπολογισμός θέσης
                        const state = getInterpolatedCoords(0, 0, targetCenterX, targetCenterY);

                        return (
                          <g key={i} transform={`translate(${state.x}, ${state.y})`} opacity={state.opacity}>
                            <rect x={startGridX} y={startGridY} width="14" height="14" className="fill-indigo-400 stroke-indigo-600 rounded" />
                            <text x={startGridX + 4} y={startGridY + 10} className="text-[8px] font-bold fill-white font-mono">x</text>
                          </g>
                        );
                      })}
                    </g>

                    {/* ΔΕΞΙΟΣ ΔΙΣΚΟΣ */}
                    <g>
                      <line x1="160" y1="40" x2="140" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="160" y1="40" x2="180" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="135" y1="85" x2="185" y2="85" className="stroke-blue-500 stroke-2" />

                      {/* 1. Ολόκληρα μπαλάκια που μένουν πάντα κάτω δεξιά */}
                      {Array.from({ length: wholePart }).map((_, i) => (
                        <circle key={i} cx={140 + (i % 5) * 8} cy="78" r="3" className="fill-blue-600 stroke-blue-700" />
                      ))}

                      {/* 2. Τα υπόλοιπα ολόκληρα μπαλάκια που πετούν στο κέντρο */}
                      {Array.from({ length: eq2B - wholePart - remainderPart }).map((_, i) => {
                        const globalIndex = wholePart + i;
                        const startX = 140 + (globalIndex % 5) * 8;
                        const startY = 78 - Math.floor(globalIndex / 5) * 8;
                        
                        const targetBoxIdx = i % (eq2A - 1);
                        const targetCenterX = (75 + targetBoxIdx * 17 + 4) - startX;
                        const targetCenterY = 27 - startY;

                        // Υπολογισμός θέσης
                        const state = getInterpolatedCoords(0, 0, targetCenterX, targetCenterY);

                        return (
                          <circle 
                            key={i} cx={startX} cy={startY} r="3" 
                            className="fill-blue-400 stroke-blue-500" 
                            transform={`translate(${state.x}, ${state.y})`}
                            opacity={state.opacity}
                          />
                        );
                      })}

                      {/* 3. Μη τέλεια διαίρεση: Μπαλάκια που γίνονται πίτες μόνο κατά τη λύση (timeline > 10) */}
                      {remainderPart > 0 && Array.from({ length: eq2A }).map((_, i) => {
                        const baseIndex = eq2B - remainderPart + i;
                        const startX = 140 + (baseIndex % 5) * 8;
                        const startY = 78 - Math.floor(baseIndex / 5) * 8;
                        
                        const targetBoxIdx = Math.max(0, i - 1);
                        const targetCenterX = (75 + targetBoxIdx * 17 + 4) - startX;
                        const targetCenterY = 27 - startY;

                        // Η 1η πίτα μένει κάτω δεξιά (σταθερή), οι υπόλοιπες πετούν
                        const state = i === 0 
                          ? { x: 0, y: 0, opacity: 1 } 
                          : getInterpolatedCoords(0, 0, targetCenterX, targetCenterY);

                        return (
                          <g 
                            key={i} transform={`translate(${startX + state.x}, ${startY + state.y})`}
                            opacity={state.opacity}
                          >
                            {timeline < 15 ? (
                              <circle cx="0" cy="0" r="3" className="fill-blue-400 stroke-blue-500" />
                            ) : (
                              renderDotPie(0, 0, 2.5, eq2A)
                            )}
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </div>
              </div>

              {/* Ανάλυση Βημάτων */}
              <div className="bg-white p-5 rounded-xl border text-xs max-w-xl mx-auto space-y-3 shadow-sm">
                <span className="font-bold text-gray-400 uppercase tracking-wide block text-center">Μαθηματικά Βήματα Επίλυσης:</span>
                <div className="space-y-2 font-medium text-slate-700">
                  <p className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">1</span> Αρχική κατάσταση: <span className="font-mono font-bold bg-slate-50 px-1 border rounded">{eq2A} · x = {eq2B}</span></p>
                  <div className={`transition-all duration-300 space-y-2 ${timeline > 15 ? 'opacity-100 max-h-40' : 'opacity-30 max-h-0 overflow-hidden'}`}>
                    <p className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">2</span> Διαιρούμε με το {eq2A}: <span className="font-mono font-bold bg-amber-50 px-1 border rounded text-amber-700">({eq2A}·x)/{eq2A} = {eq2B}/{eq2A}</span></p>
                    <p className={`flex items-center gap-2 transition-all duration-300 ${timeline === 100 ? 'opacity-100 scale-100' : 'opacity-40'}`}>
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">3</span> 
                      Το 1 κουτί x ισούται με: &nbsp;
                      <span className="font-mono font-black bg-emerald-50 px-2 py-0.5 border border-emerald-300 rounded text-emerald-700 text-sm">
                        x = {wholePart > 0 ? `${wholePart} ` : ''} 
                        {remainderPart > 0 ? ` και 1/${eq2A}` : ''} 
                        &nbsp;({(eq2B / eq2A).toFixed(2).replace('.00', '')})
                      </span>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: y = ax */}
        {activeTab === 'functions_ax' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2"><span>📈 Η Συνάρτηση</span> <span className="bg-indigo-50 text-indigo-600 px-3 py-0.5 rounded-xl font-mono text-xl border border-indigo-100">y = αx</span></h2>
                <p className="text-gray-600 leading-relaxed text-sm">Εκφράζει ανάλογα ποσά. Η γραφική της παράσταση διέρχεται από το O(0,0).</p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
                    <div className="flex justify-between items-center"><span className="font-bold text-gray-700 text-xs uppercase tracking-wide">Κλίση (α):</span><span className="text-lg font-mono font-black text-indigo-600">{slopeA1.toFixed(1)}</span></div>
                    <input type="range" min={CONFIG.functions.min} max={CONFIG.functions.max} step={CONFIG.functions.step} value={slopeA1} onChange={(e) => setSlopeA1(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"/>
                  </div>
                </div>
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border flex flex-col items-center shadow-inner">
                  <div className="relative w-full max-w-[400px] aspect-square bg-slate-50 rounded-xl border border-gray-200 p-2">
                    <svg viewBox="0 0 300 300" className="w-full h-full">
                      {Array.from({ length: 27 }).map((_, i) => (<line key={i} x1={i * 11 + 7} y1="0" x2={i * 11 + 7} y2="300" className="stroke-gray-200/70 stroke-[0.5]" />))}
                      {Array.from({ length: 27 }).map((_, i) => (<line key={i} x1="0" y1={i * 11 + 7} x2="300" y2={i * 11 + 7} className="stroke-gray-200/70 stroke-[0.5]" />))}
                      <line x1="10" y1="150" x2="290" y2="150" className="stroke-slate-600 stroke-2" />
                      <line x1="150" y1="290" x2="150" y2="10" className="stroke-slate-600 stroke-2" />
                      {renderLine(slopeA1, 0, "indigo")}
                      <circle cx={toSvgX(1)} cy={toSvgY(slopeA1)} r="4.5" className="fill-amber-500 stroke-white" /><text x={toSvgX(1.3)} y={toSvgY(slopeA1 - 0.3)} className="text-[10px] font-black fill-amber-600 font-mono">A(1, {slopeA1.toFixed(1)})</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: y = ax + b */}
        {activeTab === 'functions_axb' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2"><span>🚀 Η Συνάρτηση</span> <span className="bg-indigo-50 text-indigo-600 px-3 py-0.5 rounded-xl font-mono text-xl border border-indigo-100">y = αx + β</span></h2>
                <p className="text-gray-600 leading-relaxed text-sm">Παράλληλη μετατόπιση της ευθείας y = αx κατά β μονάδες.</p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-5">
                  <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2"><input type="range" min={CONFIG.functions.min} max={CONFIG.functions.max} step={CONFIG.functions.step} value={slopeA2} onChange={(e) => setSlopeA2(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"/></div>
                  <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2"><input type="range" min={CONFIG.functions.min} max={CONFIG.functions.max} step={CONFIG.functions.step} value={interceptB} onChange={(e) => setInterceptB(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg cursor-pointer accent-purple-500"/></div>
                  <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-xl border"><button onClick={() => setShowComparison(!showComparison)} className={`relative inline-flex h-6 w-11 items-center rounded-full ${showComparison ? 'bg-indigo-600' : 'bg-gray-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showComparison ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
                </div>
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border flex flex-col items-center shadow-inner">
                  <div className="relative w-full max-w-[400px] aspect-square bg-slate-50 rounded-xl border border-gray-200 p-2">
                    <svg viewBox="0 0 300 300" className="w-full h-full">
                      {Array.from({ length: 27 }).map((_, i) => (<line key={i} x1={i * 11 + 7} y1="0" x2={i * 11 + 7} y2="300" className="stroke-gray-200/70 stroke-[0.5]" />))}
                      {Array.from({ length: 27 }).map((_, i) => (<line key={i} x1="0" y1={i * 11 + 7} x2="300" y2={i * 11 + 7} className="stroke-gray-200/70 stroke-[0.5]" />))}
                      <line x1="10" y1="150" x2="290" y2="150" className="stroke-slate-600 stroke-2" />
                      <line x1="150" y1="290" x2="150" y2="10" className="stroke-slate-600 stroke-2" />
                      {showComparison && renderLine(slopeA2, 0, "slate", true)}
                      {renderLine(slopeA2, interceptB, "indigo")}
                      <circle cx={toSvgX(0)} cy={toSvgY(interceptB)} r="4" className="fill-purple-500 stroke-white" /><text x={toSvgX(0.5)} y={toSvgY(interceptB + 0.5)} className="text-[9px] font-black fill-purple-700 font-mono">Β(0, {interceptB.toFixed(1)})</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Με ❤️ για τους μαθητές μας.</p>
      </footer>
    </div>
  );
}
