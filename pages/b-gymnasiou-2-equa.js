import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function BGymnasiouEquations() {
  // Υπο-Tabs για την εναλλαγή των δύο μοντέλων: 'add' (x+α=β) και 'mult' (α·x=β)
  const [eqSubTab, setEqSubTab] = useState('add');

  // States για Μοντέλο Α (x + a = b) -> Sliders αριστερά & Μεγάλη Ζυγαριά
  const [weightA, setWeightA] = useState(3);
  const [totalB, setTotalB] = useState(8);
  const [addTimeline, setAddTimeline] = useState(0);
  const [isAddPlaying, setIsAddPlaying] = useState(false);

  // States για Μοντέλο Β (a * x = b) -> Play, Timeline, Ομάδες
  const [multA, setMultA] = useState(3);
  const [multB, setMultB] = useState(8);
  const [multTimeline, setMultTimeline] = useState(100);
  const [isMultPlaying, setIsMultPlaying] = useState(false);

  // Animation effect για το Μοντέλο Α (Πρόσθεση)
  useEffect(() => {
    let timer;
    if (isAddPlaying) {
      timer = setInterval(() => {
        setAddTimeline((prev) => {
          if (prev >= 100) {
            setIsAddPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isAddPlaying]);

  // Animation effect για το Μοντέλο Β (Πολλαπλασιασμός)
  useEffect(() => {
    let timer;
    if (isMultPlaying) {
      timer = setInterval(() => {
        setMultTimeline((prev) => {
          if (prev >= 100) {
            setIsMultPlaying(false);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isMultPlaying]);

  // Υπολογισμός στυλ κίνησης για το animation της Πρόσθεσης (Μοντέλο Α)
  const getAnimStyle = (stage, index, side) => {
    let ty = 0;
    let tx = 0;
    let op = 1;

    if (stage > 0) {
      // 1. Σήκωμα (0-40%)
      const liftProgress = Math.min(stage, 40) / 40;
      ty = -liftProgress * 35;

      // 2. Ένωση στο κέντρο (40-75%)
      if (stage > 40) {
        const moveProgress = Math.min(stage - 40, 35) / 35;
        tx = side === 'left' ? moveProgress * (90 - (34 + index * 6)) : -moveProgress * ((185 + index * 5) - 118);
      }

      // 3. Εξαφάνιση (75-100%)
      if (stage > 75) {
        op = 1 - (stage - 75) / 25;
      }
    }
    return { 
      transform: `translate(${tx}px, ${ty}px)`, 
      opacity: op, 
      transition: isAddPlaying ? 'none' : 'transform 0.2s ease, opacity 0.2s ease' 
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans p-4 md:p-8">
      <Head>
        <title>2. Η Εξίσωση - Β' Γυμνασίου</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ΣΥΝΔΕΣΜΟΣ ΕΠΙΣΤΡΟΦΗΣ ΣΤΟ DASHBOARD */}
        <Link href="/b-gymnasiou" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
          &larr; Επιστροφή στον Πίνακα Μαθημάτων
        </Link>

        {/* ΚΥΡΙΩΣ ΠΛΑΙΣΙΟ ΜΑΘΗΜΑΤΟΣ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          
          {/* Υπο-μενού επιλογής μορφής εξίσωσης */}
          <div className="flex border-b border-slate-200 pb-3 gap-4">
            <button 
              type="button" 
              onClick={() => setEqSubTab('add')} 
              className={`text-sm font-black pb-2 border-b-2 transition ${eqSubTab === 'add' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400'}`}
            >
              ⚖️ Μορφή x + α = β (Πρόσθεση)
            </button>
            <button 
              type="button" 
              onClick={() => setEqSubTab('mult')} 
              className={`text-sm font-black pb-2 border-b-2 transition ${eqSubTab === 'mult' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400'}`}
            >
              ⚖️ Μορφή α &middot; x = β (Πολλαπλασιασμός)
            </button>
          </div>

          {/* ============================================================================ */}
          {/* ΜΟΝΤΕΛΟ Α: ΠΡΟΣΘΕΣΗ (x + α = β) */}
          {eqSubTab === 'add' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-slate-900">⚖️ Εξίσωση της μορφής x + α = β</h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Για να απομονώσεις τον άγνωστο <span className="font-bold text-indigo-600">x</span>, αφαιρείς το βάρος <span className="font-bold text-orange-600">α</span> και από τα δύο μέρη της ζυγαριάς ώστε να διατηρηθεί η ισορροπία.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-4 rounded-2xl w-full md:w-72 shadow text-center font-mono">
                  <div className="text-xs uppercase opacity-75 tracking-wider mb-1">Τρέχουσα Εξίσωση</div>
                  <div className="text-xl font-black">x + {weightA} = {totalB}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Αριστερό Πλαίσιο: Sliders & Controls */}
                <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider">⚙️ Ρυθμίσεις Παραμέτρων</span>
                    
                    <div className="bg-white p-3 rounded-xl border shadow-sm space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Σταθερό Βάρος (α):</span>
                        <span className="text-orange-600 font-mono font-black">{weightA}</span>
                      </div>
                      <input 
                        type="range" min="1" max="6" value={weightA} 
                        onChange={(e) => { setWeightA(parseInt(e.target.value)); setAddTimeline(0); setIsAddPlaying(false); }} 
                        className="w-full accent-orange-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                      />
                    </div>

                    <div className="bg-white p-3 rounded-xl border shadow-sm space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Συνολικό Βάρος (β):</span>
                        <span className="text-blue-600 font-mono font-black">{totalB}</span>
                      </div>
                      <input 
                        type="range" min={weightA + 1} max="15" value={totalB} 
                        onChange={(e) => { setTotalB(parseInt(e.target.value)); setAddTimeline(0); setIsAddPlaying(false); }} 
                        className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                      />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border shadow-sm space-y-3">
                    <button 
                      type="button" 
                      onClick={() => { if(addTimeline >= 100) setAddTimeline(0); setIsAddPlaying(!isAddPlaying); }} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-2.5 px-4 rounded-xl shadow transition active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isAddPlaying ? '⏸ Παύση' : addTimeline >= 100 ? '🔄 Επανεκκίνηση' : '▶ Αναπαραγωγή'}
                    </button>
                    
                    <div className="flex items-center gap-2 font-mono text-[9px] text-slate-400">
                      <input 
                        type="range" min="0" max="100" value={addTimeline} 
                        onChange={(e) => { setIsAddPlaying(false); setAddTimeline(parseInt(e.target.value)); }} 
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer" 
                      />
                      <span className="w-8 text-right font-bold text-slate-600">{addTimeline}%</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center font-mono">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase mb-0.5">Αποτέλεσμα</div>
                    <div className="text-lg font-black text-emerald-700">x = {totalB - weightA}</div>
                  </div>
                </div>

                {/* Δεξιό Πλαίσιο: Μεγάλη Ζυγαριά με Animation */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-center items-center relative min-h-[340px]">
                  <div className="absolute top-3 right-3 text-[10px] font-bold font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {addTimeline === 0 ? '🎬 Αρχική Κατάσταση' : addTimeline < 40 ? '🔼 Αφαίρεση βαρών...' : addTimeline < 75 ? '🔄 Εξουδετέρωση...' : '✨ Λύση!'}
                  </div>

                  <svg viewBox="0 0 240 140" className="w-full max-w-lg overflow-visible font-sans select-none">
                    <rect x="116" y="45" width="8" height="65" className="fill-slate-400" />
                    <polygon points="100,110 140,110 148,122 92,122" className="fill-slate-600" />
                    <circle cx="120" cy="45" r="5" className="fill-slate-700" />
                    <line x1="35" y1="45" x2="205" y2="45" className="stroke-slate-600 stroke-[3]" />

                    {/* Αριστερός Δίσκος */}
                    <line x1="35" y1="45" x2="35" y2="85" className="stroke-slate-400 stroke-[1]" />
                    <path d="M 10,85 L 60,85 L 50,93 L 20,93 Z" className="fill-slate-300 stroke-slate-400 stroke-[0.5]" />
                    <rect x="15" y="70" width="14" height="14" className="fill-indigo-600 rx-[2]" />
                    <text x="22" y="80" className="text-[9px] fill-white font-black" textAnchor="middle">x</text>

                    {/* Κινούμενα σφαιρίδια αριστερά */}
                    {Array.from({ length: weightA }).map((_, i) => (
                      <circle 
                        key={`a-left-${i}`} cx={34 + (i * 6)} cy="81" r="2.5" 
                        className="fill-orange-500 stroke-orange-600 stroke-[0.3]" 
                        style={getAnimStyle(addTimeline, i, 'left')}
                      />
                    ))}

                    {/* Δεξιός Δίσκος */}
                    <line x1="205" y1="45" x2="205" y2="85" className="stroke-slate-400 stroke-[1]" />
                    <path d="M 180,85 L 230,85 L 220,93 L 190,93 Z" className="fill-slate-300 stroke-slate-400 stroke-[0.5]" />

                    {/* Κινούμενα σφαιρίδια δεξιά */}
                    {Array.from({ length: weightA }).map((_, i) => (
                      <circle 
                        key={`a-right-${i}`} cx={185 + (i * 5)} cy="81" r="2.5" 
                        className="fill-orange-400 stroke-orange-500 stroke-[0.3]" 
                        style={getAnimStyle(addTimeline, i, 'right')}
                      />
                    ))}
                    {/* Σταθερά σφαιρίδια αποτελέσματος */}
                    {Array.from({ length: totalB - weightA }).map((_, i) => {
                      const row = Math.floor(i / 6); const col = i % 6;
                      return (
                        <circle 
                          key={`b-stay-${i}`} cx={185 + (col * 6)} cy={81 - (row * 6)} r="2.5" 
                          className="fill-blue-600 stroke-blue-700 stroke-[0.3]" 
                        />
                      );
                    })}

                    {/* Εφέ εξουδετέρωσης στο κέντρο */}
                    {addTimeline > 65 && addTimeline < 85 && (
                      <g style={{ opacity: (85 - addTimeline) / 20 }}>
                        <circle cx="120" cy="25" r="8" className="fill-amber-200/40 stroke-amber-400 stroke-[1] stroke-dasharray-[2]" />
                        <text x="120" y="28" className="text-[7px] font-black fill-amber-700" textAnchor="middle">-&alpha;</text>
                      </g>
                    )}
                  </svg>

                  {/* 🔴 ΔΙΟΡΘΩΘΗΚΕ: Προστασία των συμβόλων με String Literals */}
                  <div className="mt-2 text-center text-xs font-mono font-bold text-slate-500">
                    x + {weightA} <span className="text-orange-500 font-black">-{weightA}</span> {"="} {totalB} <span className="text-orange-500 font-black">-{weightA}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================================ */}
            {/* ΜΟΝΤΕΛΟ Β: ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ (α · x = β) */}
            {eqSubTab === 'mult' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-slate-900">🎯 Εξίσωση της μορφής α &middot; x = β</h2>
                    <p className="text-slate-500 text-xs">Πίεσε το κουμπί ▶ Play για αυτόματη κίνηση, ή σύρε τη μπάρα για να ελέγξεις την ταχύτητα χειροκίνητα.</p>
                  </div>
                  {/* 🔴 ΔΙΟΡΘΩΘΗΚΕ: Προστασία του / με String Literal */}
                  <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white p-3 rounded-xl shadow max-w-xs text-xs font-bold font-mono">
                    <span className="block border-b border-white/20 pb-1 mb-1 text-[10px] tracking-widest text-orange-200">ΜΑΘΗΜΑΤΙΚΟΣ ΚΑΝΟΝΑΣ</span>
                    {"α · x = β \u2192 x = β / α"}
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border text-center space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold bg-white p-3 rounded-xl border shadow-sm max-w-xl mx-auto">
                    <div>Πλήθος κουτιών (α): <button onClick={() => { setMultA(Math.max(1, multA - 1)); setMultTimeline(0); }} className="bg-slate-100 px-2 rounded">-</button> <span className="text-orange-600 font-mono">{multA}</span> <button onClick={() => { setMultA(Math.min(4, multA + 1)); setMultTimeline(0); }} className="bg-slate-100 px-2 rounded">+</button></div>
                    <div>Συνολικά μπαλάκια (β): <button onClick={() => { setMultB(Math.max(multA, multB - 1)); setMultTimeline(0); }} className="bg-slate-100 px-2 rounded">-</button> <span className="text-blue-600 font-mono">{multB}</span> <button onClick={() => { setMultB(Math.min(12, multB + 1)); setMultTimeline(0); }} className="bg-slate-100 px-2 rounded">+</button></div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border shadow-sm flex items-center gap-4 max-w-xl mx-auto text-xs font-bold">
                    <button type="button" onClick={() => { if(multTimeline>=100) setMultTimeline(0); setIsMultPlaying(!isMultPlaying); }} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg font-black">{isMultPlaying ? '⏸ Παύση' : '▶ Αναπαραγωγή'}</button>
                    <div className="flex-1 flex justify-between items-center gap-2 font-mono text-[10px] text-slate-400">
                      <span>🎬 Αρχή</span>
                      <input type="range" min="0" max="100" value={multTimeline} onChange={(e) => { setIsMultPlaying(false); setMultTimeline(parseInt(e.target.value)); }} className="flex-1 accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer" />
                      <span>Λύση (100%)</span>
                    </div>
                  </div>

                  {/* 🔴 ΔΙΟΡΘΩΘΗΚΕ: Προστασία του / με String Literal */}
                  <div className="text-lg font-mono font-black text-orange-600 bg-white border border-dashed border-orange-200 px-4 py-1.5 rounded-xl inline-block shadow-sm">
                    {"("}{multA} {"· x) ÷"} {multA} {"="} {multB} {"÷"} {multA}
                  </div>

                  <div className="w-full max-w-md mx-auto bg-white p-4 rounded-2xl border shadow-sm">
                    <svg viewBox="0 0 200 120" className="w-full h-auto overflow-visible">
                      <line x1="100" y1="40" x2="100" y2="100" className="stroke-slate-400 stroke-[3]" />
                      <polygon points="90,100 110,100 115,110 85,110" className="fill-slate-500" />
                      <line x1="40" y1="55" x2="160" y2="55" className="stroke-slate-600 stroke-[2.5]" />
                      
                      <line x1="40" y1="55" x2="40" y2="85" className="stroke-slate-300 stroke-[0.8]" />
                      <line x1="20" y1="85" x2="60" y2="85" className="stroke-orange-400 stroke-[2]" />
                      {Array.from({ length: multTimeline >= 50 ? 1 : multA }).map((_, i) => (
                        <rect key={i} x={24 + (i * 8)} y="73" width="7" height="11" className="fill-indigo-600 border stroke-white stroke-[0.3]" />
                      ))}

                      <line x1="160" y1="55" x2="160" y2="85" className="stroke-slate-300 stroke-[0.8]" />
                      <line x1="140" y1="85" x2="180" y2="85" className="stroke-blue-400 stroke-[2]" />
                      {Array.from({ length: multTimeline >= 50 ? Math.floor(multB / multA) : multB }).map((_, i) => {
                        const row = Math.floor(i / 4); const col = i % 4;
                        return <circle key={i} cx={146 + (col * 5)} cy={81 - (row * 5)} r="2" className="fill-blue-600" />;
                      })}
                    </svg>
                  </div>

                  {/* 🔴 ΔΙΟΡΘΩΘΗΚΕ: Προστασία όλων των πλαγίων καθέτων (/) στις επεξηγήσεις βημάτων */}
                  <div className="bg-white p-4 rounded-xl border text-left max-w-xl mx-auto text-xs font-bold font-mono space-y-2">
                    <div className="flex items-center gap-2"><span>1</span> Αρχική κατάσταση: <span className="bg-slate-50 border px-1 rounded">{multA} &middot; x = {multB}</span></div>
                    <div className={`flex items-center gap-2 transition ${multTimeline >= 50 ? 'opacity-100 text-orange-600' : 'opacity-30'}`}>
                      <span>2</span> Διαιρούμε με το {multA}: <span className="bg-slate-50 border px-1 rounded">{`(${multA}·x)/${multA} = ${multB}/${multA}`}</span>
                    </div>
                    <div className={`flex items-center gap-2 transition ${multTimeline === 100 ? 'opacity-100 text-emerald-600' : 'opacity-30'}`}>
                      <span>3</span> Το 1 κουτί x ισούται με: <span className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-sm text-emerald-700 font-black">x = {(multB / multA).toFixed(2).replace('.00', '')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-runnable-track { background: #e2e8f0; height: 8px; border-radius: 8px; }
        input[type="range"]::-moz-range-track { background: #e2e8f0; height: 8px; border-radius: 8px; }
      `}</style>
    </div>
  );
}
