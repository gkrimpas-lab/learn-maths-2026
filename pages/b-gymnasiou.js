import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function BGymnasiou() {
  const [activeTab, setActiveTab] = useState('functions');

  // State για την κλίση α της συνάρτησης y = ax
  // Επιτρέπουμε τιμές από -5 έως 5 με βήμα 0.5
  const [slopeA, setSlopeA] = useState(1);

  // Συναρτήσεις υπολογισμού για το SVG (Μετατροπή μαθηματικών συντεταγμένων σε pixels)
  // Έστω SVG viewbox 0 έως 200. Το κέντρο (0,0) είναι στο (100,100)
  // Κλίμακα: 1 μονάδα = 15 pixels
  const toSvgX = (mathX) => 100 + mathX * 15;
  const toSvgY = (mathY) => 100 - mathY * 15; // Αντίστροφα στο SVG το Y πάει προς τα κάτω

  // Υπολογισμός δύο σημείων για τη σχεδίαση της γραμμής (για x = -6 και x = 6)
  const x1 = -6;
  const y1 = slopeA * x1;
  const x2 = 6;
  const y2 = slopeA * x2;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>Β' Γυμνασίου: Μαθηματικά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">LearnMaths<span className="text-indigo-600">.gr</span></Link>
          <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">🏠 Αρχική</Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-10 text-center shadow-inner">
        <h1 className="text-4xl font-black mb-2">🎒 Μαθηματικά Β' Γυμνασίου</h1>
        <p className="text-indigo-100 opacity-90 font-medium">Διαδραστικά Εργαλεία Μάθησης</p>
      </header>

      {/* ΚΕΝΤΡΙΚΟ ΜΕΝΟΥ ΚΑΡΤΕΛΩΝ */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex bg-white p-2 rounded-xl shadow-sm gap-2 max-w-xs mx-auto sm:mx-0">
          <button onClick={() => setActiveTab('functions')} className={`flex-1 py-2 text-center rounded-lg font-bold transition duration-200 text-sm ${activeTab === 'functions' ? 'bg-indigo-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            📈 Συναρτήσεις
          </button>
          {/* Μπορείς να προσθέσεις μελλοντικά και άλλες καρτέλες εδώ (π.χ. Εξισώσεις, Πυθαγόρειο) */}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* TAB: ΣΥΝΑΡΤΗΣΕΙΣ */}
        {activeTab === 'functions' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            
            {/* 1. ΘΕΩΡΙΑ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>📈 Η Συνάρτηση</span> 
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-0.5 rounded-xl font-mono text-xl border border-indigo-100">y = αx</span>
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Η συνάρτηση αυτή εκφράζει δύο <strong>ανάλογα ποσά</strong>. Η γραφική της παράσταση είναι πάντοτε μια <strong>ευθεία γραμμή</strong> η οποία διέρχεται από την <strong>αρχή των αξόνων O(0,0)</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-emerald-900">
                    <p className="font-bold mb-1">➕ Όταν το α &gt; 0 (Θετικό):</p>
                    <p>Η ευθεία "ανεβαίνει" από αριστερά προς τα δεξιά (βρίσκεται στο 1ο και 3ο τεταρτημόριο).</p>
                  </div>
                  <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-rose-900">
                    <p className="font-bold mb-1">➖ Όταν το α &lt; 0 (Αρνητικό):</p>
                    <p>Η ευθεία "κατεβαίνει" από αριστερά προς τα δεξιά (βρίσκεται στο 2ο και 4ο τεταρτημόριο).</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 rounded-2xl shadow-md flex flex-col justify-center">
                <h3 className="font-bold text-sm text-indigo-100 uppercase tracking-wider mb-2">💡 Τι είναι το «α»;</h3>
                <p className="text-xs leading-relaxed opacity-95">
                  Ο αριθμός <strong>α</strong> ονομάζεται <strong>συντελεστής διεύθυνσης</strong> ή <strong>κλίση</strong> της ευθείας. Όσο μεγαλύτερο είναι το α (απόλυτα), τόσο πιο "απότομη" γίνεται η ανηφόρα ή η κατηφόρα της ευθείας!
                </p>
              </div>
            </div>

            {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <h3 className="text-base font-bold text-center text-gray-800">🎮 Πειραματίσου με την κλίση της ευθείας</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* ΧΕΙΡΙΣΤΗΡΙΑ & ΠΛΗΡΟΦΟΡΙΕΣ */}
                <div className="space-y-6">
                  {/* Slider για το α */}
                  <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700 text-sm">Μετάβαλλε την κλίση (α):</span>
                      <span className={`text-xl font-mono font-black px-3 py-1 rounded-lg ${slopeA > 0 ? 'bg-emerald-100 text-emerald-700' : slopeA < 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'}`}>
                        α = {slopeA}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setSlopeA(Math.max(-5, slopeA - 0.5))} className="bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded-lg font-black text-xs transition shadow-sm">-0.5</button>
                      <input type="range" min="-5" max="5" step="0.5" value={slopeA} onChange={(e) => setSlopeA(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
                      <button onClick={() => setSlopeA(Math.min(5, slopeA + 0.5))} className="bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded-lg font-black text-xs transition shadow-sm">+0.5</button>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 font-mono px-1">
                      <span>-5.0 (Έντονη Κατηφόρα)</span>
                      <span>0 (Οριζόντια)</span>
                      <span>+5.0 (Έντονη Ανηφόρα)</span>
                    </div>
                  </div>

                  {/* Τύπος & Πίνακας Τιμών */}
                  <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Η τρέχουσα εξίσωση</span>
                      <div className="text-2xl font-mono font-black text-indigo-600 mt-0.5">
                        y = {slopeA === 0 ? '0' : slopeA === 1 ? 'x' : slopeA === -1 ? '-x' : `${slopeA}x`}
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">📋 Ενδεικτικά Σημεία (Πίνακας Τιμών)</span>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                        <div className="bg-slate-50 p-2 rounded-lg border font-bold text-gray-500">x</div>
                        <div className="bg-slate-50 p-2 rounded-lg border font-bold text-gray-500">y = α · x</div>
                        <div className="bg-slate-50 p-2 rounded-lg border font-bold text-gray-500">Σημείο</div>
                        <div className="bg-slate-50 p-2 rounded-lg border font-bold text-gray-500">Τεταρτημόριο</div>

                        {[-1, 0, 2].map((xVal) => {
                          const yVal = slopeA * xVal;
                          let quadrant = 'Άξονας';
                          if (xVal > 0 && yVal > 0) quadrant = '1ο';
                          if (xVal < 0 && yVal > 0) quadrant = '2ο';
                          if (xVal < 0 && yVal < 0) quadrant = '3ο';
                          if (xVal > 0 && yVal < 0) quadrant = '4ο';
                          if (xVal === 0 && yVal === 0) quadrant = 'Αρχή Ο';

                          return (
                            <>
                              <div className="p-2 border-b font-semibold">{xVal}</div>
                              <div className="p-2 border-b font-bold text-indigo-600">{slopeA} · ({xVal}) = {yVal}</div>
                              <div className="p-2 border-b font-black text-slate-700">({xVal}, {yVal})</div>
                              <div className="p-2 border-b font-semibold text-gray-500">{quadrant}</div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>

                {/* ΖΩΓΡΑΦΙΑ ΣΥΝΑΡΤΗΣΗΣ (DYNAMIC SVG) */}
                <div className="bg-white p-4 rounded-2xl shadow-md border flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">📉 Σύστημα Συντεταγμένων</span>
                  
                  <div className="relative w-full max-w-[280px] aspect-square bg-slate-50 rounded-xl border border-gray-200 p-1">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Πλέγμα Φόντου (Grid Lines) */}
                      {Array.from({ length: 13 }).map((_, i) => {
                        const pos = i * 15 + 10; // 10, 25, 40... 190
                        return (
                          <g key={i}>
                            <line x1={pos} y1="0" x2={pos} y2="200" className="stroke-gray-200 stroke-[0.5]" />
                            <line x1="0" y1={pos} x2="200" y2={pos} className="stroke-gray-200 stroke-[0.5]" />
                          </g>
                        );
                      })}

                      {/* Άξονας Χ */}
                      <line x1="5" y1="100" x2="195" y2="100" className="stroke-slate-600 stroke-2" />
                      <polygon points="195,97 200,100 195,103" className="fill-slate-600" />
                      <text x="190" y="115" className="text-[10px] font-bold fill-slate-600 font-mono">x</text>

                      {/* Άξονας Υ */}
                      <line x1="100" y1="195" x2="100" y2="5" className="stroke-slate-600 stroke-2" />
                      <polygon points="97,5 100,0 103,5" className="fill-slate-600" />
                      <text x="110" y="15" className="text-[10px] font-bold fill-slate-600 font-mono">y</text>

                      {/* Αρχή των αξόνων Ο */}
                      <circle cx="100" cy="100" r="3" className="fill-slate-800" />
                      <text x="90" y="112" className="text-[9px] font-bold fill-slate-800 font-mono">O</text>

                      {/* Η ΔΥΝΑΜΙΚΗ ΕΥΘΕΙΑ ΓΡΑΜΜΗ (y = ax) */}
                      {slopeA !== 0 ? (
                        <line x1={toSvgX(x1)} y1={toSvgY(y1)} x2={toSvgX(x2)} y2={toSvgY(y2)} className="stroke-indigo-600 stroke-[2.5] stroke-linecap-round drop-shadow-sm transition-all duration-150" />
                      ) : (
                        // Αν α = 0, η ευθεία συμπίπτει με τον άξονα x
                        <line x1="0" y1="100" x2="200" y2="100" className="stroke-indigo-600 stroke-[2.5]" />
                      )}

                      {/* Ενδεικτικό Σημείο πάνω στην ευθεία (για x = 2) για οπτική βοήθεια */}
                      {slopeA !== 0 && (
                        <g className="transition-all duration-150">
                          <circle cx={toSvgX(2)} cy={toSvgY(2 * slopeA)} r="3.5" className="fill-amber-500 stroke-white stroke-1" />
                          <text x={toSvgX(2.3)} y={toSvgY(2 * slopeA - 0.5)} className="text-[8px] font-black fill-amber-600 font-mono">A(2, {2 * slopeA})</text>
                        </g>
                      )}
                    </svg>
                  </div>

                  <p className="text-[11px] text-gray-500 text-center mt-3 px-4 italic">
                    Η ευθεία περνάει πάντα από το κέντρο O(0,0) και στρέφεται καθώς αλλάζεις το α.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm mt-12">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη Β' Γυμνασίου.</p>
      </footer>
    </div>
  );
}
