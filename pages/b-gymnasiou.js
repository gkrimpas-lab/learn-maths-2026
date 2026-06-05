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
  equation2: { // ax = b (ΝΕΟ)
    aMin: 2,
    aMax: 5,
    aDefault: 3,
    bMin: 2,
    bMax: 20,
    bDefault: 12 // Πρέπει το b να διαιρείται ιδανικά με το a για καθαρά μπαλάκια
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

  // States για τη νέα 2η καρτέλα (Εξισώσεις μορφής ax = b)
  const [eq2A, setEq2A] = useState(CONFIG.equation2.aDefault);
  const [eq2B, setEq2B] = useState(CONFIG.equation2.bDefault);
  const [isSolved2, setIsSolved2] = useState(false);

  // States για την 3η καρτέλα (y = ax)
  const [slopeA1, setSlopeA1] = useState(CONFIG.functions.defaultA1);

  // States για τη 4η καρτέλα (y = ax + b)
  const [slopeA2, setSlopeA2] = useState(CONFIG.functions.defaultA2);
  const [interceptB, setInterceptB] = useState(CONFIG.functions.defaultB);
  const [showComparison, setShowComparison] = useState(true);

  // Συναρτήσεις υπολογισμού για το SVG των συναρτήσεων
  const toSvgX = (mathX) => 150 + mathX * 11;
  const toSvgY = (mathY) => 150 - mathY * 11;

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

      {/* ΚΕΝΤΡΙΚΟ ΜΕΝΟΥ ΚΑΡΤΕΛΩΝ (ΤΩΡΑ ΜΕ 5 ΠΛΗΡΕΙΣ ΚΑΡΤΕΛΕΣ) */}
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
             Pall 3. Συνάρτηση y = αx
          </button>
          <button onClick={() => setActiveTab('functions_axb')} className={`px-3 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'functions_axb' ? 'bg-indigo-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            🚀 4. Συνάρτηση y = αx + β
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* TAB 0: Η ΕΝΝΟΙΑ ΤΗΣ ΜΕΤΑΒΛΗΤΗΣ */}
        {activeTab === 'variable' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
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
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">⚖️ Εξίσωση της μορφής x + α = β</h2>
                <p className="text-gray-600 leading-relaxed text-sm">💡 <strong>Η αρχή της ισορροπίας:</strong> Για να απομονώσουμε το x, αφαιρούμε το ίδιο βάρος «α» και από τις δύο μεριές της ζυγαριάς.</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap justify-center items-center gap-6 text-xs max-w-xl mx-auto">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-600">Βάρος α:</span>
                  <button onClick={() => { setEq1A(Math.max(CONFIG.equation1.aMin, eq1A - 1)); setIsSolved1(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">-</button>
                  <span className="font-black text-orange-600 text-sm w-4 text-center">{eq1A}</span>
                  <button onClick={() => { if(eq1A < eq1B) setEq1A(Math.min(CONFIG.equation1.aMax, eq1A + 1)); setIsSolved1(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">+</button>
                </div>
                <div className="w-[1px] h-4 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-600">Σύνολο β:</span>
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
                    {isSolved1 && (
                      <g className="animate-burst">
                        <circle cx="100" cy="25" r="8" className="fill-amber-400/30 stroke-amber-500" />
                        <line x1="100" y1="13" x2="100" y2="7" className="stroke-amber-500 stroke-2" />
                        <line x1="100" y1="37" x2="100" y2="43" className="stroke-amber-500 stroke-2" />
                      </g>
                    )}
                  </svg>
                </div>

                <button onClick={() => setIsSolved1(!isSolved1)} className={`w-full py-2.5 rounded-xl font-black text-xs text-white ${!isSolved1 ? 'bg-orange-500' : 'bg-slate-600'}`}>
                  {!isSolved1 ? `⚡ Αφαίρεσε το βάρος ${eq1A}` : '🔄 Επαναφορά Ζυγαριάς'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ΕΞΙΣΩΣΗ ax = b (NEW FEATURE) */}
        {activeTab === 'functions_mult' || activeTab === 'equations_mult' ? (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">🎯 Εξίσωση της μορφής α·x = β</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Όταν ο άγνωστος πολλαπλασιάζεται με έναν αριθμό, για να τον απομονώσουμε κάνουμε την αντίστροφη πράξη. <strong>Διαιρούμε και τα δύο μέλη της εξίσωσης με τον συντελεστή «α»</strong>.
                </p>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-xs text-amber-900 leading-relaxed">
                  <p>⚖️ <strong>Οπτική ομαδοποίηση:</strong> Χωρίζουμε τα βάρη της δεξιάς πλευράς σε «α» ίσα μέρη. Κάθε κουτί $x$ αντιστοιχεί ακριβώς σε μία από αυτές τις ομάδες!</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white p-5 rounded-2xl shadow-md flex flex-col justify-center">
                <h3 className="font-bold text-sm text-amber-100 mb-1">📋 Μαθηματικός Κανόνας</h3>
                <p className="text-xs font-mono bg-black/10 p-2 rounded text-center text-base font-bold">α·x = β  ⇒  x = β / α</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              
              {/* Επιλογές Παραμέτρων */}
              <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap justify-center items-center gap-6 text-xs max-w-xl mx-auto">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-600">Πλήθος κουτιών (α):</span>
                  <button onClick={() => { setEq2A(Math.max(CONFIG.equation2.aMin, eq2A - 1)); setIsSolved2(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">-</button>
                  <span className="font-black text-amber-600 text-sm w-4 text-center">{eq2A}</span>
                  <button onClick={() => { setEq2A(Math.min(CONFIG.equation2.aMax, eq2A + 1)); setIsSolved2(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">+</button>
                </div>
                <div className="w-[1px] h-4 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-600">Συνολικά μπαλάκια (β):</span>
                  <button onClick={() => { setEq2B(Math.max(CONFIG.equation2.bMin, eq2B - 1)); setIsSolved2(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">-</button>
                  <span className="font-black text-blue-600 text-sm w-4 text-center">{eq2B}</span>
                  <button onClick={() => { setEq2B(Math.min(CONFIG.equation2.bMax, eq2B + 1)); setIsSolved2(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">+</button>
                </div>
                {eq2B % eq2A !== 0 && (
                  <div className="w-full text-center text-[10px] text-amber-600 font-medium">⚠️ Προτίμησε αριθμό που διαιρείται ακριβώς με το {eq2A} (π.χ. {eq2A * 2}, {eq2A * 3}) για τέλεια μοιρασιά!</div>
                )}
              </div>

              {/* ΖΥΓΑΡΙΑ ΜΟΡΦΗΣ ax = b */}
              <div className="bg-white p-6 rounded-2xl border flex flex-col items-center justify-center max-w-xl mx-auto shadow-sm space-y-4">
                
                <div className="text-lg font-mono font-black text-slate-700 bg-slate-50 p-2 px-6 rounded-lg border">
                  {!isSolved2 ? (
                    <span>{eq2A} · x = {eq2B}</span>
                  ) : (
                    <span className="text-amber-600">
                      ({eq2A} · x) ÷ {eq2A} = {eq2B} ÷ {eq2A}
                    </span>
                  )}
                </div>

                <div className="w-full max-w-[340px] aspect-[4/3] bg-slate-50/50 rounded-xl border p-2">
                  <svg viewBox="0 0 200 150" className="w-full h-full">
                    {/* Βάση */}
                    <path d="M 85 130 L 115 130 L 105 90 L 95 90 Z" className="fill-slate-400" />
                    <line x1="100" y1="90" x2="100" y2="40" className="stroke-slate-500 stroke-[3]" />
                    <line x1="40" y1="40" x2="160" y2="40" className="stroke-slate-500 stroke-2" />

                    {/* ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ: Πλήθος από "α" κουτιά x */}
                    <g>
                      <line x1="40" y1="40" x2="20" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="40" y1="40" x2="60" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="15" y1="85" x2="65" y2="85" className="stroke-amber-500 stroke-2" />

                      {/* Το 1ο κουτί x (Μένει πάντα) */}
                      <rect x="18" y="67" width="14" height="14" className="fill-indigo-500 stroke-indigo-700 rounded" />
                      <text x="23" y="78" className="text-[9px] font-black fill-white font-mono">x</text>

                      {/* Τα υπόλοιπα κουτιά x (Εξαφανίζονται στο animation της διαίρεσης) */}
                      {Array.from({ length: eq2A - 1 }).map((_, i) => (
                        <rect 
                          key={i} 
                          x={34 + i*11} 
                          y="67" 
                          width="14" 
                          height="14" 
                          className={`fill-indigo-400 stroke-indigo-600 rounded transition-all duration-300 ${isSolved2 ? 'animate-lift-left' : ''}`} 
                        />
                      ))}
                    </g>

                    {/* ΔΕΞΙΟΣ ΔΙΣΚΟΣ: Συνολικά β μπαλάκια */}
                    <g>
                      <line x1="160" y1="40" x2="140" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="160" y1="40" x2="180" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="135" y1="85" x2="185" y2="85" className="stroke-blue-500 stroke-2" />

                      {/* Η 1η ομάδα που αντιστοιχεί στο 1ο x (Μένει πάντα) */}
                      {Array.from({ length: Math.floor(eq2B / eq2A) }).map((_, i) => (
                        <circle key={i} cx={140 + i*6} cy="79" r="2.5" className="fill-blue-600 stroke-blue-700" />
                      ))}

                      {/* Τα υπόλοιπα μπαλάκια (Χωρισμένα σε στρώματα/ομάδες - Φεύγουν στο animation) */}
                      {Array.from({ length: eq2B - Math.floor(eq2B / eq2A) }).map((_, i) => {
                        const globalIndex = Math.floor(eq2B / eq2A) + i;
                        return (
                          <circle 
                            key={i} 
                            cx={140 + (globalIndex % 6)*6} 
                            cy={79 - Math.floor(globalIndex / 6)*6} 
                            r="2.5" 
                            className={`fill-blue-400 stroke-blue-500 ${isSolved2 ? 'animate-lift-right' : ''}`} 
                          />
                        );
                      })}
                    </g>

                    {/* Εφέ Σύγκρουσης/Διαγραφής στο Κέντρο */}
                    {isSolved2 && (
                      <g className="animate-burst">
                        <circle cx="100" cy="25" r="10" className="fill-orange-400/20 stroke-orange-500 stroke-dashed" />
                      </g>
                    )}
                  </svg>
                </div>

                <button 
                  onClick={() => setIsSolved2(!isSolved2)} 
                  className={`w-full py-2.5 rounded-xl font-black text-xs text-white tracking-wide transition-all ${!isSolved2 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-600 hover:bg-slate-700'}`}
                >
                  {!isSolved2 ? `⚡ Χώρισε σε ${eq2A} ίσα μέρη (Διαίρεση)` : '🔄 Επαναφορά Ζυγαριάς'}
                </button>
              </div>

              {/* Ανάλυση Βημάτων */}
              <div className="bg-white p-5 rounded-xl border text-xs max-w-xl mx-auto space-y-3 shadow-sm">
                <span className="font-bold text-gray-400 uppercase tracking-wide block text-center">Μαθηματικά Βήματα Επίλυσης:</span>
                <div className="space-y-2 font-medium text-slate-700">
                  <p className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">1</span> Αρχική κατάσταση: <span className="font-mono font-bold bg-slate-50 px-1 border rounded">{eq2A} · x = {eq2B}</span></p>
                  <div className={`transition-all duration-300 space-y-2 ${isSolved2 ? 'opacity-100 max-h-40' : 'opacity-30 max-h-0 overflow-hidden'}`}>
                    <p className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">2</span> Διαιρούμε με το {eq2A}: <span className="font-mono font-bold bg-amber-50 px-1 border rounded text-amber-700">({eq2A}·x)/{eq2A} = {eq2B}/{eq2A}</span></p>
                    <p className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">3</span> Το 1 κουτί x ισούται με: <span className="font-mono font-black bg-emerald-50 px-2 py-0.5 border border-emerald-300 rounded text-emerald-700 text-sm">x = {(eq2B / eq2A).toFixed(1).replace('.0', '')}</span></p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : null}

        {/* TAB 3: y = ax */}
        {activeTab === 'functions_ax' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
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
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
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
      
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }

        @keyframes liftLeft {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(65px, -50px); opacity: 0; }
        }
        .animate-lift-left { animation: liftLeft 0.9s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

        @keyframes liftRight {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(-50px, -50px); opacity: 0; }
        }
        .animate-lift-right { animation: liftRight 0.9s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

        @keyframes burstEffect {
          0% { opacity: 0; transform: scale(0.3); transform-origin: 100px 25px; }
          80% { opacity: 1; transform: scale(1.2); transform-origin: 100px 25px; }
          100% { opacity: 0; transform: scale(1.5); transform-origin: 100px 25px; }
        }
        .animate-burst { animation: burstEffect 1.1s ease-out forwards; }
      `}</style>
    </div>
  );
}
