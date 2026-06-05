import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function BGymnasiou() {
  const [activeTab, setActiveTab] = useState('variable');

  // States για την 0η καρτέλα (Μεταβλητή)
  const [varX, setVarX] = useState(5);

  // States για την 1η καρτέλα (Εξισώσεις - ΝΕΟ)
  const [eqA, setEqA] = useState(3);
  const [eqB, setEqB] = useState(8);
  const [isSolved, setIsSolved] = useState(false);

  // States για την 2η καρτέλα (y = ax)
  const [slopeA1, setSlopeA1] = useState(1);

  // States για τη 3η καρτέλα (y = ax + b)
  const [slopeA2, setSlopeA2] = useState(1);
  const [interceptB, setInterceptB] = useState(2);
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

      {/* ΚΕΝΤΡΙΚΟ ΜΕΝΟΥ ΚΑΡΤΕΛΩΝ (ΤΩΡΑ ΜΕ 4 ΚΑΡΤΕΛΕΣ) */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white p-2 rounded-xl shadow-sm w-full lg:w-max">
          <button onClick={() => setActiveTab('variable')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'variable' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            📦 0. Η Μεταβλητή
          </button>
          <button onClick={() => setActiveTab('equations')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'equations' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            ⚖️ 1. Η Εξίσωση
          </button>
          <button onClick={() => setActiveTab('functions_ax')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'functions_ax' ? 'bg-indigo-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            `📈 2. Η συνάρτηση y = αx`
          </button>
          <button onClick={() => setActiveTab('functions_axb')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'functions_axb' ? 'bg-indigo-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            🚀 3. Η συνάρτηση y = αx + β
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
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-xs text-amber-900"><p>💡 <strong>Σκέψου το σαν ένα κουτί:</strong> Το όνομα του κουτιού είναι το "x", αλλά το περιεχόμενο μέσα μπορεί να αλλάζει!</p></div>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 rounded-2xl shadow-md flex flex-col justify-center">
                <h3 className="font-bold text-sm text-amber-100 mb-1">🔍 Μεταβλητή vs Σταθερά</h3>
                <p className="text-xs opacity-95">Στην έκφραση <strong>3·x + 2</strong>, το <strong>x</strong> είναι η μεταβλητή, ενώ το <strong>3</strong> και το <strong>2</strong> είναι σταθερές.</p>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 space-y-10">
              <h3 className="text-center font-black text-gray-400 uppercase tracking-widest text-sm">Το Μηχάνημα των Μαθηματικών</h3>
              <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border text-center space-y-4 w-48">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">1. Είσοδος (x)</span>
                    <div className="text-4xl font-black text-amber-500">{varX}</div>
                    <input type="range" min="-10" max="10" value={varX} onChange={(e) => setVarX(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg cursor-pointer accent-amber-500"/>
                  </div>
                </div>
                <div className="bg-indigo-600 p-1 rounded-2xl shadow-xl">
                  <div className="bg-white p-8 rounded-xl border-4 border-indigo-600 text-center space-y-4">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase block">2. Επεξεργασία (Αντικατάσταση)</span>
                    <div className="flex items-center justify-center gap-2 text-2xl font-black text-slate-800">
                      <span>3 ·</span>
                      <div className="flex items-center">
                        {varX < 0 && <span className="text-indigo-600 mr-1 text-3xl font-light">(</span>}
                        <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-lg border border-amber-200">{varX}</span>
                        {varX < 0 && <span className="text-indigo-600 ml-1 text-3xl font-light">)</span>}
                      </div>
                      <span>+ 2 =</span>
                      <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg border border-emerald-200">{(3 * varX) + 2}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border text-center space-y-4 w-48">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">3. Έξοδος (y)</span>
                    <div className="text-4xl font-black text-emerald-500">{(3 * varX) + 2}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: Η ΕΝΝΟΙΑ ΤΗΣ ΕΞΙΣΩΣΗΣ (NEW FEATURE) */}
        {activeTab === 'equations' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">⚖️ Τι είναι η Εξίσωση;</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Εξίσωση είναι μια μαθηματική ισότητα που περιέχει μια μεταβλητή (άγνωστο). <strong>Λύση</strong> της εξίσωσης είναι η τιμή που πρέπει να πάρει ο άγνωστος ώστε η ισότητα να είναι αληθινή.
                </p>
                <p className="text-gray-600 leading-relaxed text-sm font-medium">
                  💡 Σκέψου την εξίσωση σαν μια <strong>ζυγαριά που ισορροπεί</strong>. Ό,τι πράξη κάνουμε στην αριστερή πλευρά, πρέπει να κάνουμε ακριβώς την ίδια και στη δεξιά για να μην χαλάσει η ισορροπία!
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-5 rounded-2xl shadow-md flex flex-col justify-center">
                <h3 className="font-bold text-sm text-amber-100 mb-1">🎯 Η βασική μορφή</h3>
                <p className="text-xs opacity-95 font-mono bg-black/10 p-2 rounded text-center text-lg font-bold">x + α = β</p>
                <p className="text-[11px] opacity-90 mt-2 leading-relaxed">Για να απομονώσουμε το x, αφαιρούμε τον αριθμό «α» και από τα δύο μέλη της εξίσωσης.</p>
              </div>
            </div>

            {/* ΠΡΟΣΟΜΟΙΩΤΗΣ ΖΥΓΑΡΙΑΣ */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <h3 className="text-base font-bold text-center text-gray-800">⚖️ Οπτική Επίλυση με τη Ζυγαριά των Μαθηματικών</h3>
              
              {/* Ρύθμιση Παραμέτρων */}
              <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap justify-center items-center gap-6 text-xs max-w-xl mx-auto">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-600">Βάρος α (1 έως 5):</span>
                  <button onClick={() => { setEqA(Math.max(1, eqA - 1)); setIsSolved(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">-</button>
                  <span className="font-black text-orange-600 text-sm w-4 text-center">{eqA}</span>
                  <button onClick={() => { if(eqA < eqB) setEqA(eqA + 1); setIsSolved(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">+</button>
                </div>
                <div className="w-[1px] h-4 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-600">Σύνολο β (α+1 έως 10):</span>
                  <button onClick={() => { setEqB(Math.max(eqA + 1, eqB - 1)); setIsSolved(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">-</button>
                  <span className="font-black text-blue-600 text-sm w-4 text-center">{eqB}</span>
                  <button onClick={() => { setEqB(Math.min(10, eqB + 1)); setIsSolved(false); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold">+</button>
                </div>
              </div>

              {/* ΓΡΑΦΙΚΟ SVG ΖΥΓΑΡΙΑΣ */}
              <div className="bg-white p-6 rounded-2xl border flex flex-col items-center justify-center max-w-xl mx-auto shadow-sm space-y-4">
                <div className="text-lg font-mono font-black text-slate-700 bg-slate-50 p-2 px-6 rounded-lg border">
                  {!isSolved ? `x + ${eqA} = ${eqB}` : `x + ${eqA} - ${eqA} = ${eqB} - ${eqA}`}
                </div>

                <div className="w-full max-w-[340px] aspect-[4/3] bg-slate-50/50 rounded-xl border p-2">
                  <svg viewBox="0 0 200 150" className="w-full h-full">
                    {/* Βάση Ζυγαριάς */}
                    <path d="M 85 130 L 115 130 L 105 90 L 95 90 Z" className="fill-slate-400" />
                    <line x1="100" y1="90" x2="100" y2="40" className="stroke-slate-500 stroke-[3]" />
                    <line x1="40" y1="40" x2="160" y2="40" className="stroke-slate-500 stroke-2" /> {/* Οριζόντιος Μοχλός */}

                    {/* ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ */}
                    <g className="transition-all duration-500">
                      <line x1="40" y1="40" x2="20" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="40" y1="40" x2="60" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="15" y1="85" x2="65" y2="85" className="stroke-orange-500 stroke-2" /> {/* Δίσκος */}
                      
                      {/* Αντικείμενα Αριστερά */}
                      <rect x="22" y="67" width="16" height="16" className="fill-indigo-500 stroke-indigo-700 rounded" />
                      <text x="27" y="79" className="text-[10px] font-black fill-white font-mono">x</text>

                      {!isSolved && (
                        <g className="transition-opacity duration-300">
                          {Array.from({ length: eqA }).map((_, i) => (
                            <circle key={i} cx={45 + (i%2)*10} cy={79 - Math.floor(i/2)*8} r="3.5" className="fill-orange-500 stroke-orange-600" />
                          ))}
                        </g>
                      )}
                    </g>

                    {/* ΔΕΞΙΟΣ ΔΙΣΚΟΣ */}
                    <g className="transition-all duration-500">
                      <line x1="160" y1="40" x2="140" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="160" y1="40" x2="180" y2="85" className="stroke-slate-400 stroke-[0.5]" />
                      <line x1="135" y1="85" x2="185" y2="85" className="stroke-blue-500 stroke-2" /> {/* Δίσκος */}

                      {/* Αντικείμενα Δεξιά */}
                      <g>
                        {Array.from({ length: !isSolved ? eqB : (eqB - eqA) }).map((_, i) => (
                          <circle key={i} cx={145 + (i%3)*10} cy={79 - Math.floor(i/3)*8} r="3.5" className="fill-blue-500 stroke-blue-600" />
                        ))}
                      </g>
                    </g>
                  </svg>
                </div>

                {/* Κουμπί Ενέργειας */}
                <button 
                  onClick={() => setIsSolved(!isSolved)}
                  className={`w-full py-2.5 rounded-xl font-black text-xs shadow transition-all duration-200 text-white
                    ${!isSolved ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-600 hover:bg-slate-700'}`}
                >
                  {!isSolved ? '⚡ Αφαίρεσε το βάρος (Λύση Εξίσωσης)' : '🔄 Επαναφορά Ζυγαριάς'}
                </button>
              </div>

              {/* Επεξήγηση βημάτων */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3 max-w-xl mx-auto text-xs">
                <span className="font-bold text-gray-400 uppercase tracking-wide block text-center">Μαθηματικά Βήματα:</span>
                <div className="space-y-2 font-medium text-slate-700">
                  <p className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">1</span> Αρχική κατάσταση ισορροπίας: <span className="font-mono font-bold bg-slate-50 px-1 border rounded">x + {eqA} = {eqB}</span></p>
                  
                  <div className={`transition-all duration-300 space-y-2 ${isSolved ? 'opacity-100 max-h-40' : 'opacity-30 max-h-0 overflow-hidden'}`}>
                    <p className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-[10px]">2</span> Αφαιρούμε το {eqA} και από τις δύο πλευρές: <span className="font-mono font-bold bg-orange-50 px-1 border border-orange-200 rounded text-orange-700">x + {eqA} - {eqA} = {eqB} - {eqA}</span></p>
                    <p className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">3</span> Το x απομονώθηκε και βρήκαμε τη λύση: <span className="font-mono font-black bg-emerald-50 px-2 py-0.5 border border-emerald-300 rounded text-emerald-700 text-sm">x = {eqB - eqA}</span></p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: y = ax */}
        {activeTab === 'functions_ax' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>📈 Η Συνάρτηση</span> 
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-0.5 rounded-xl font-mono text-xl border border-indigo-100">y = αx</span>
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">Εκφράζει <strong>ανάλογα ποσά</strong>. Η γραφική της παράσταση είναι μια ευθεία που διέρχεται από την <strong>αρχή των αξόνων O(0,0)</strong>.</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 rounded-2xl shadow-md flex flex-col justify-center">
                <h3 className="font-bold text-sm text-indigo-100 mb-1">💡 Σημείο Α(1, α)</h3>
                <p className="text-xs opacity-95">Για x = 1, η τιμή y είναι ίση με την κλίση α. Το σημείο Α(1, α) "μαρτυρά" την κλίση της ευθείας!</p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
                    <div className="flex justify-between items-center"><span className="font-bold text-gray-700 text-xs uppercase tracking-wide">Κλίση (α):</span><span className={`text-lg font-mono font-black px-3 py-1 rounded-lg ${slopeA1 > 0 ? 'bg-emerald-100 text-emerald-700' : slopeA1 < 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'}`}>{slopeA1.toFixed(1)}</span></div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setSlopeA1(Math.max(-10, parseFloat((slopeA1 - 0.1).toFixed(1))))} className="bg-slate-100 px-2 py-1 rounded font-black text-xs hover:bg-slate-200">-0.1</button>
                      <input type="range" min="-10" max="10" step="0.1" value={slopeA1} onChange={(e) => setSlopeA1(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
                      <button onClick={() => setSlopeA1(Math.min(10, parseFloat((slopeA1 + 0.1).toFixed(1))))} className="bg-slate-100 px-2 py-1 rounded font-black text-xs hover:bg-slate-200">+0.1</button>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border flex flex-col items-center shadow-inner">
                  <div className="relative w-full max-w-[400px] aspect-square bg-slate-50 rounded-xl border border-gray-200 p-2">
                    <svg viewBox="0 0 300 300" className="w-full h-full">
                      {Array.from({ length: 27 }).map((_, i) => (<line key={i} x1={i * 11 + 7} y1="0" x2={i * 11 + 7} y2="300" className="stroke-gray-200/70 stroke-[0.5]" />))}
                      {Array.from({ length: 27 }).map((_, i) => (<line key={i} x1="0" y1={i * 11 + 7} x2="300" y2={i * 11 + 7} className="stroke-gray-200/70 stroke-[0.5]" />))}
                      <line x1="10" y1="150" x2="290" y2="150" className="stroke-slate-600 stroke-2" /><polygon points="290,146 298,150 290,154" className="fill-slate-600" />
                      <line x1="150" y1="290" x2="150" y2="10" className="stroke-slate-600 stroke-2" /><polygon points="146,10 150,2 154,10" className="fill-slate-600" />
                      {renderLine(slopeA1, 0, "indigo")}
                      {slopeA1 !== 0 && (
                        <g><circle cx={toSvgX(1)} cy={toSvgY(slopeA1)} r="4.5" className="fill-amber-500 stroke-white" /><text x={toSvgX(1.3)} y={toSvgY(slopeA1 - 0.3)} className="text-[10px] font-black fill-amber-600 font-mono">A(1, {slopeA1.toFixed(1)})</text></g>
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: y = ax + b */}
        {activeTab === 'functions_axb' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2"><span>🚀 Η Συνάρτηση</span> <span className="bg-indigo-50 text-indigo-600 px-3 py-0.5 rounded-xl font-mono text-xl border border-indigo-100">y = αx + β</span></h2>
                <p className="text-gray-600 leading-relaxed text-sm">Προκύπτει από την <strong>παράλληλη μετατόπιση</strong> της ευθείας y = αx κατά β μονάδες στον άξονα y'y.</p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-5">
                  <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2"><input type="range" min="-10" max="10" step="0.1" value={slopeA2} onChange={(e) => setSlopeA2(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"/></div>
                  <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2"><input type="range" min="-10" max="10" step="0.1" value={interceptB} onChange={(e) => setInterceptB(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg cursor-pointer accent-purple-500"/></div>
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

      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm mt-12">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Με ❤️ για τους μαθητές μας.</p>
      </footer>
      
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}
