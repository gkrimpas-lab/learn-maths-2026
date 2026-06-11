import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// ============================================================================
// ΡΥΘΜΙΣΕΙΣ ΜΗΧΑΝΗΜΑΤΟΣ ΜΑΘΗΜΑΤΙΚΩΝ (ΚΑΡΤΕΛΑ 0)
// ============================================================================
const VAR_MACHINE_CONFIG = {
  minX: -20,
  maxX: 20,
  a: 3,    // Ο συντελεστής (πολλαπλασιαστής)
  b: 5     // Η σταθερά (πρόσθεση)
};

export default function BGymnasiou() {
  // Tabs: variables, equation, func_ax, func_axb
  const [activeTab, setActiveTab] = useState('variables');
  
  // States για Καρτέλα 0: Μεταβλητές
  const [inputX, setInputX] = useState(5);

  // States για Καρτέλα 1: Εξισώσεις (Ζυγαριά)
  const [weightA, setWeightA] = useState(3);
  const [totalB, setTotalB] = useState(8);
  const [isBalanced, setIsBalanced] = useState(true);

  // States για Καρτέλα 2: Συνάρτηση y = ax
  const [alpha, setAlpha] = useState(1.0);

  // States για Καρτέλα 3: Συνάρτηση y = ax + b
  const [alpha2, setAlpha2] = useState(1.0);
  const [beta, setBeta] = useState(2.0);
  const [showReference, setShowReference] = useState(true);

  // Βοηθητική συνάρτηση για εμφάνιση του x με παρενθέσεις αν είναι αρνητικός
  const formatX = (val) => val < 0 ? `(${val})` : val;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans scroll-smooth">
      <Head>
        <title>Β' Γυμνασίου: Μαθηματικά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">
            LearnMaths<span className="text-indigo-600">.gr</span>
          </Link>
          <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">
            🏠 Αρχική
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 text-center shadow-inner">
        <h1 className="text-4xl font-black mb-2">📐 Μαθηματικά Β' Γυμνασίου</h1>
        <p className="text-indigo-100 opacity-90 font-medium">Συναρτήσεις, Εξισώσεις &amp; Γεωμετρία</p>
      </header>

      {/* ΜΕΝΟΥ ΠΛΟΗΓΗΣΗΣ */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap bg-slate-200/60 p-1.5 rounded-xl gap-1 w-full md:w-max border border-slate-300/50 shadow-sm">
          <button onClick={() => setActiveTab('variables')} className={`px-4 py-2 text-center rounded-lg font-bold text-xs sm:text-sm transition ${activeTab === 'variables' ? 'bg-amber-500 text-white shadow' : 'text-slate-600 hover:bg-white/50'}`}>📦 0. Η Μεταβλητή</button>
          <button onClick={() => setActiveTab('equation')} className={`px-4 py-2 text-center rounded-lg font-bold text-xs sm:text-sm transition ${activeTab === 'equation' ? 'bg-amber-500 text-white shadow' : 'text-slate-600 hover:bg-white/50'}`}>⚖️ 1. Η Εξίσωση</button>
          <button onClick={() => setActiveTab('func_ax')} className={`px-4 py-2 text-center rounded-lg font-bold text-xs sm:text-sm transition ${activeTab === 'func_ax' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-white/50'}`}>📊 2. Η συνάρτηση y = αx</button>
          <button onClick={() => setActiveTab('func_axb')} className={`px-4 py-2 text-center rounded-lg font-bold text-xs sm:text-sm transition ${activeTab === 'func_axb' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-white/50'}`}>🚀 3. Η συνάρτηση y = αx + β</button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* 📦 ΚΑΡΤΕΛΑ 0: Η ΜΕΤΑΒΛΗΤΗ */}
        {activeTab === 'variables' && (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-3 max-w-2xl">
                <h2 className="text-2xl font-black text-slate-900">📦 Τι είναι η Μεταβλητή;</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Στα Μαθηματικά, <strong>μεταβλητή</strong> είναι ένα γράμμα (συνήθως το <span className="text-amber-600 font-bold">x</span>) που χρησιμοποιούμε για να παραστήσουμε έναν αριθμό που <strong>δεν είναι σταθερός</strong>, αλλά μπορεί να αλλάζει τιμές.
                </p>
                <div className="bg-amber-50 text-amber-900 p-3 rounded-xl border border-amber-200 text-xs font-semibold">
                  💡 Σκέψου το σαν ένα κουτί: Το όνομα του κουτιού είναι το &quot;x&quot;, αλλά το περιεχόμενο μέσα μπορεί να αλλάξει!
                </div>
              </div>

              {/* Πλαίσιο Δεξιά */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 rounded-2xl shadow w-full md:w-80">
                <h3 className="font-bold text-sm mb-2">🔍 Μεταβλητή vs Σταθερά</h3>
                <p className="text-xs opacity-90 leading-relaxed">
                  Στην έκφραση <span className="font-mono font-bold bg-black/20 px-1 rounded">{VAR_MACHINE_CONFIG.a} · x + {VAR_MACHINE_CONFIG.b}</span>, το <span className="font-bold text-yellow-300">x</span> είναι η μεταβλητή, ενώ το <span className="font-bold">{VAR_MACHINE_CONFIG.a}</span> και το <span className="font-bold">{VAR_MACHINE_CONFIG.b}</span> είναι σταθερές.
                </p>
              </div>
            </div>

            {/* ΤΟ ΜΗΧΑΝΗΜΑ ΤΩΝ ΜΑΘΗΜΑΤΙΚΩΝ */}
            <div className="bg-slate-50 p-6 rounded-2xl border text-center space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">⚙️ Το Μηχάνημα των Μαθηματικών</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* 1. Είσοδος */}
                <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">1. ΕΙΣΟΔΟΣ (X)</span>
                  <div className="text-3xl font-mono font-black text-amber-500">{inputX}</div>
                  <input 
                    type="range" 
                    min={VAR_MACHINE_CONFIG.minX} 
                    max={VAR_MACHINE_CONFIG.maxX} 
                    value={inputX} 
                    onChange={(e) => setInputX(parseInt(e.target.value))} 
                    className="w-full accent-amber-500 appearance-none h-1.5 bg-slate-200 rounded-lg cursor-pointer" 
                  />
                  <div className="flex justify-between text-[8px] font-bold text-slate-400 px-1">
                    <span>{VAR_MACHINE_CONFIG.minX}</span>
                    <span>{VAR_MACHINE_CONFIG.maxX}</span>
                  </div>
                </div>
                
                {/* 2. Επεξεργασία */}
                <div className="bg-white p-4 rounded-xl border-2 border-indigo-600 shadow-md">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase block mb-2">2. ΕΠΕΞΕΡΓΑΣΙΑ (ΑΝΤΙΚΑΤΑΣΤΑΣΗ)</span>
                  <div className="text-xl font-mono font-bold text-slate-700">
                    {VAR_MACHINE_CONFIG.a} &middot; <span className="bg-amber-100 px-2 py-0.5 rounded text-amber-700 font-black">{formatX(inputX)}</span> + {VAR_MACHINE_CONFIG.b} = <span className="bg-emerald-100 px-2 py-0.5 rounded text-emerald-700 font-black">{VAR_MACHINE_CONFIG.a * inputX + VAR_MACHINE_CONFIG.b}</span>
                  </div>
                </div>

                {/* 3. Έξοδος */}
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">3. ΕΞΟΔΟΣ (Y)</span>
                  <div className="text-3xl font-mono font-black text-emerald-500">{VAR_MACHINE_CONFIG.a * inputX + VAR_MACHINE_CONFIG.b}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ⚖️ ΚΑΡΤΕΛΑ 1: Η ΕΞΙΣΩΣΗ */}
        {activeTab === 'equation' && (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">⚖️ Τι είναι η Εξίσωση;</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Εξίσωση είναι μια μαθηματική ισότητα που περιέχει μια μεταβλητή (άγνωστο). <strong>Λύση</strong> της εξίσωσης είναι η τιμή που πρέπει να πάρει ο άγνωστος ώστε η ισότητα να είναι αληθινή.
                </p>
                <div className="bg-amber-50 text-amber-900 p-3 rounded-xl border border-amber-200 text-xs font-semibold">
                  ⚖️ Σκέψου την εξίσωση σαν μια <strong>ζυγαριά που ισορροπεί</strong>. Ό,τι πράξη κάνουμε στην αριστερή πλευρά, πρέπει να κάνουμε ακριβώς την ίδια και στη δεξιά!
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-4 rounded-2xl w-full md:w-72 shadow text-center">
                <span className="text-[10px] uppercase font-bold tracking-widest block opacity-75">Η Βασική μορφή</span>
                <div className="text-2xl font-mono font-black my-1">x + α = β</div>
                <p className="text-[10px] opacity-90 leading-relaxed">Για να απομονώσουμε το x, αφαιρούμε τον αριθμό «α» και από τα δύο μέλη της εξίσωσης.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border text-center space-y-4">
              <h3 className="font-bold text-sm text-slate-700">🏆 Οπτική Επίλυση με τη Ζυγαριά των Μαθηματικών</h3>
              
              <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-bold bg-white p-3 rounded-xl border shadow-sm max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                  <span>Βάρος α:</span>
                  <button onClick={() => { setWeightA(Math.max(1, weightA - 1)); setIsBalanced(true); }} className="bg-slate-100 px-2 py-0.5 border rounded font-black">-</button>
                  <span className="text-orange-600 font-mono text-sm">{weightA}</span>
                  <button onClick={() => { setWeightA(Math.min(5, weightA + 1)); setIsBalanced(true); }} className="bg-slate-100 px-2 py-0.5 border rounded font-black">+</button>
                </div>
                <div className="flex items-center gap-2">
                  <span>Σύνολο β:</span>
                  <button onClick={() => { setTotalB(Math.max(weightA + 1, totalB - 1)); setIsBalanced(true); }} className="bg-slate-100 px-2 py-0.5 border rounded font-black">-</button>
                  <span className="text-blue-600 font-mono text-sm">{totalB}</span>
                  <button onClick={() => { setTotalB(Math.min(10, totalB + 1)); setIsBalanced(true); }} className="bg-slate-100 px-2 py-0.5 border rounded font-black">+</button>
                </div>
              </div>

              <div className="text-xl font-mono font-black text-slate-700 bg-white border px-4 py-2 rounded-xl inline-block shadow-sm">
                x + {weightA} = {isBalanced ? totalB : totalB - weightA}
              </div>

              <div className="w-full max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm relative">
                <svg viewBox="0 0 200 120" className="w-full h-auto overflow-visible">
                  <line x1="100" y1="40" x2="100" y2="100" className="stroke-slate-400 stroke-[3]" />
                  <polygon points="90,100 110,100 115,110 85,110" className="fill-slate-500" />
                  <line x1="40" y1="40" x2="160" y2="40" className="stroke-slate-600 stroke-[2.5]" />
                  <circle cx="100" cy="40" r="3" className="fill-slate-800" />
                  <line x1="40" y1="40" x2="40" y2="75" className="stroke-slate-400 stroke-[0.8]" />
                  <line x1="20" y1="75" x2="60" y2="75" className="stroke-blue-500 stroke-[2]" />
                  <rect x="23" y="60" width="14" height="14" className="fill-indigo-600" />
                  <text x="30" y="70" className="text-[8px] fill-white font-black text-center font-sans" textAnchor="middle">x</text>
                  {isBalanced && Array.from({ length: weightA }).map((_, i) => (
                    <circle key={i} cx={43 + (i * 6)} cy="71" r="2.5" className="fill-orange-500" />
                  ))}
                  <line x1="160" y1="40" x2="160" y2="75" className="stroke-slate-400 stroke-[0.8]" />
                  <line x1="140" y1="75" x2="180" y2="75" className="stroke-blue-500 stroke-[2]" />
                  {Array.from({ length: isBalanced ? totalB : totalB - weightA }).map((_, i) => {
                    const row = Math.floor(i / 4);
                    const col = i % 4;
                    return <circle key={i} cx={146 + (col * 6)} cy={71 - (row * 6)} r="2.5" className="fill-blue-600" />;
                  })}
                </svg>
                {isBalanced && (
                  <button type="button" onClick={() => setIsBalanced(false)} className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition w-full">
                    ⚡ Αφαίρεσε το βάρος {weightA} (Λύση Εξίσωσης)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 📊 ΚΑΡΤΕΛΑ 2: y = αx */}
        {activeTab === 'func_ax' && (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-2 max-w-2xl">
                <h2 className="text-2xl font-black text-slate-900">📊 Η Σύνάρτηση y = αx</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Η γραφική της παράσταση είναι πάντα μια <strong>ευθεία γραμμή</strong> η οποία διέρχεται από την αρχή των αξόνων $O(0,0)$.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-green-50 border border-green-200 text-green-800 text-xs px-3 py-1.5 rounded-xl font-medium">🍏 <strong>α &gt; 0:</strong> Ανεβαίνει από αριστερά προς τα δεξιά.</span>
                  <span className="bg-red-50 border border-red-200 text-red-800 text-xs px-3 py-1.5 rounded-xl font-medium">🍎 <strong>α &lt; 0:</strong> Κατεβαίνει από αριστερά προς τα δεξιά.</span>
                </div>
              </div>
              <div className="bg-indigo-600 text-white p-4 rounded-2xl w-full md:w-72 shadow">
                <h4 className="text-xs font-black uppercase opacity-75 tracking-wider">💡 Τι είναι το «α»;</h4>
                <p className="text-xs mt-1 leading-relaxed opacity-90">Είναι η <strong>κλίση</strong>. Όσο μεγαλύτερο το α, τόσο πιο &quot;απότομη&quot; η ευθεία.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
                      <span className="text-[10px] font-black text-slate-400 block uppercase">Κλίση (α):</span>
                      <div className="flex items-center justify-between font-mono font-black text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                        <span>α =</span> <span>{alpha.toFixed(1)}</span>
                      </div>
                      <input type="range" min="-5" max="5" step="0.5" value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
                      <div className="text-2xl font-mono font-black text-indigo-600 mt-1">y = {alpha.toFixed(1)}x</div>
                    </div>
                  </div>
                  <div className="lg:col-span-8 bg-white p-4 rounded-2xl border shadow-sm flex justify-center">
                    <svg viewBox="0 0 200 200" className="w-full max-w-[280px] overflow-visible font-mono">
                      {Array.from({ length: 11 }).map((_, i) => (
                        <g key={i}>
                          <line x1={i * 20} y1="0" x2={i * 20} y2="200" className="stroke-slate-100 stroke-[0.5]" />
                          <line x1="0" y1={i * 20} x2="200" y2={i * 20} className="stroke-slate-100 stroke-[0.5]" />
                        </g>
                      ))}
                      <line x1="0" y1="100" x2="200" y2="100" className="stroke-slate-500 stroke-[1.2]" />
                      <line x1="100" y1="0" x2="100" y2="200" className="stroke-slate-500 stroke-[1.2]" />
                      <line x1="0" y1={100 + (100 * alpha)} x2="200" y2={100 - (100 * alpha)} className="stroke-indigo-600 stroke-[2.5] transition-all" />
                      <circle cx="140" cy={100 - (40 * alpha)} r="3" className="fill-amber-500 stroke-white" />
                      <text x="146" y={103 - (40 * alpha)} className="text-[7px] font-black fill-amber-700">A(2, {(2 * alpha).toFixed(1)})</text>
                    </svg>
                  </div>
                </div>
            </div>
          </div>
        )}

        {/* 🚀 ΚΑΡΤΕΛΑ 3: y = αx + β */}
        {activeTab === 'func_axb' && (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-2 max-w-2xl">
                <h2 className="text-2xl font-black text-slate-900">🚀 Η Σύνάρτηση y = αx + β</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Προκύπτει από την <strong>παράλληλη μετατόπιση</strong> της ευθείας $y = \alpha x$ κατά $\beta$ μονάδες στον άξονα $y'y$.
                </p>
                <div className="bg-amber-50 border border-amber-200 text-amber-950 text-xs p-3 rounded-xl font-semibold space-y-1">
                  <div>📍 <strong>Σημείο Τομής:</strong> Τέμνει τον άξονα $y'y$ στο σημείο <strong>(0, β)</strong>.</div>
                  <div>📐 <strong>Κλίση:</strong> Η κλίση παραμένει <strong>α</strong>.</div>
                </div>
              </div>
              <div className="bg-indigo-600 text-white p-4 rounded-2xl w-full md:w-72 shadow">
                <h4 className="text-xs font-black uppercase opacity-75 tracking-wider">🔍 Τι κάνει το «β»;</h4>
                <p className="text-xs mt-1 leading-relaxed opacity-90">Αν <strong>β &gt; 0</strong>, η ευθεία ανεβαίνει. Αν <strong>β &lt; 0</strong>, κατεβαίνει. Οι ευθείες με το ίδιο α είναι <strong>παράλληλες</strong>!</p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white p-4 rounded-xl border shadow-sm space-y-1">
                      <div className="flex justify-between text-xs font-bold"><span>Κλίση (α):</span> <span className="font-mono text-indigo-600">{alpha2.toFixed(1)}</span></div>
                      <input type="range" min="-3" max="3" step="0.5" value={alpha2} onChange={(e) => setAlpha2(parseFloat(e.target.value))} className="w-full accent-indigo-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="bg-white p-4 rounded-xl border shadow-sm space-y-1">
                      <div className="flex justify-between text-xs font-bold"><span>Μετατόπιση (β):</span> <span className="font-mono text-purple-600">{beta.toFixed(1)}</span></div>
                      <input type="range" min="-4" max="4" step="0.5" value={beta} onChange={(e) => setBeta(parseFloat(e.target.value))} className="w-full accent-purple-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between text-xs font-bold">
                      <span>ΕΜΦΑΝΙΣΗ ΤΗΣ Y = {alpha2.toFixed(1)}X:</span>
                      <button onClick={() => setShowReference(!showReference)} className={`w-10 h-5 rounded-full p-0.5 transition-colors ${showReference ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform ${showReference ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <div className="bg-white p-4 rounded-xl border shadow-sm font-mono text-sm">
                      <span className="text-indigo-600 font-black">y = {alpha2.toFixed(1)}x {beta >= 0 ? `+ ${beta.toFixed(1)}` : `- ${Math.abs(beta).toFixed(1)}`}</span>
                    </div>
                  </div>
                  <div className="lg:col-span-7 bg-white p-4 rounded-2xl border shadow-sm flex justify-center">
                    <svg viewBox="0 0 200 200" className="w-full max-w-[280px] overflow-visible font-mono">
                      {Array.from({ length: 11 }).map((_, i) => (
                        <line key={i} x1={i * 20} y1="0" x2={i * 20} y2="200" className="stroke-slate-100 stroke-[0.5]" />
                      ))}
                      {Array.from({ length: 11 }).map((_, i) => (
                        <line key={i} x1="0" y1={i * 20} x2="200" y2={i * 20} className="stroke-slate-100 stroke-[0.5]" />
                      ))}
                      <line x1="0" y1="100" x2="200" y2="100" className="stroke-slate-400 stroke-[1]" />
                      <line x1="100" y1="0" x2="100" y2="200" className="stroke-slate-400 stroke-[1]" />
                      {showReference && (
                        <line x1="0" y1={100 + (100 * alpha2)} x2="200" y2={100 - (100 * alpha2)} className="stroke-slate-300 stroke-[1.5] stroke-dasharray-[3]" />
                      )}
                      <line x1="0" y1={100 - (beta * 20) + (100 * alpha2)} x2="200" y2={100 - (beta * 20) - (100 * alpha2)} className="stroke-indigo-600 stroke-[2.5]" />
                      <circle cx="100" cy={100 - (beta * 20)} r="3" className="fill-purple-500 stroke-white" />
                      <text x="106" y={103 - (beta * 20)} className="text-[6.5px] font-black fill-purple-800">Σ(0, {beta.toFixed(1)})</text>
                    </svg>
                  </div>
                </div>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm mt-12">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη Β' Γυμνασίου.</p>
      </footer>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}
