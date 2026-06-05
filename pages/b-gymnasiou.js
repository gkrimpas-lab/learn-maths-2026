import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function BGymnasiou() {
  const [activeTab, setActiveTab] = useState('functions_ax');

  // State για την κλίση α της συνάρτησης y = ax [-10 έως 10]
  const [slopeA, setSlopeA] = useState(1);

  // Συναρτήσεις υπολογισμού για το SVG (Viewbox 0 έως 300, Κέντρο στο 150,150)
  // ΝΕΑ Κλίμακα: 1 μονάδα = 11 pixels (ώστε να χωράει άνετα έως το 12 και το -12)
  const toSvgX = (mathX) => 150 + mathX * 11;
  const toSvgY = (mathY) => 150 - mathY * 11;

  // Όρια σχεδίασης της γραμμής για να απλώνεται σε όλο το πλέγμα
  const xStart = -13;
  const yStart = slopeA * xStart;
  const xEnd = 13;
  const yEnd = slopeA * xEnd;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>Β' Γυμνασίου: Συναρτήσεις - LearnMaths.gr</title>
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
        <div className="flex bg-white p-2 rounded-xl shadow-sm gap-2 max-w-sm">
          <button onClick={() => setActiveTab('functions_ax')} className={`flex-1 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'functions_ax' ? 'bg-indigo-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            📈 1. Η συνάρτηση y = αx
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* TAB: ΣΥΝΑΡΤΗΣΗ y = ax */}
        {activeTab === 'functions_ax' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            
            {/* ΘΕΩΡΙΑ */}
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
                    <p>Η ευθεία "ανεβαίνει" (1ο και 3ο τεταρτημόριο).</p>
                  </div>
                  <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-rose-900">
                    <p className="font-bold mb-1">➖ Όταν το α &lt; 0 (Αρνητικό):</p>
                    <p>Η ευθεία "κατεβαίνει" (2ο και 4ο τεταρτημόριο).</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 rounded-2xl shadow-md flex flex-col justify-center">
                <h3 className="font-bold text-sm text-indigo-100 uppercase tracking-wider mb-2">💡 Η σημασία του σημείου Α(1, α)</h3>
                <p className="text-xs leading-relaxed opacity-95">
                  Παρατήρησε ότι για <span className="font-bold">x = 1</span>, η συνάρτηση δίνει πάντα <span className="font-bold">y = α</span>. Αυτό σημαίνει ότι το σημείο <span className="font-bold">Α(1, α)</span> μας δείχνει «καρφί» την τιμή της κλίσης πάνω στο γράφημα!
                </p>
              </div>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* ΧΕΙΡΙΣΤΗΡΙΑ */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700 text-xs uppercase tracking-wide">Όριο κλίσης [-10 έως 10]:</span>
                      <span className={`text-lg font-mono font-black px-3 py-1 rounded-lg ${slopeA > 0 ? 'bg-emerald-100 text-emerald-700' : slopeA < 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'}`}>
                        α = {slopeA.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Αλλαγή ανά 0.1 */}
                      <button onClick={() => setSlopeA(Math.max(-10, parseFloat((slopeA - 0.1).toFixed(1))))} className="bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-lg font-black text-xs transition shadow-sm">-0.1</button>
                      <input type="range" min="-10" max="10" step="0.1" value={slopeA} onChange={(e) => setSlopeA(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
                      <button onClick={() => setSlopeA(Math.min(10, parseFloat((slopeA + 0.1).toFixed(1))))} className="bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-lg font-black text-xs transition shadow-sm">+0.1</button>
                    </div>
                  </div>

                  {/* Εξίσωση & Πίνακας Τιμών */}
                  <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Η εξίσωση:</span>
                      <div className="text-xl font-mono font-black text-indigo-600 mt-0.5">
                        y = {slopeA === 0 ? '0' : slopeA === 1 ? 'x' : slopeA === -1 ? '-x' : `${slopeA.toFixed(1)}x`}
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">📋 Πίνακας Τιμών με το νέο σημείο</span>
                      <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-mono">
                        <div className="bg-slate-50 p-2 rounded-md border font-bold text-gray-500">Τιμή x</div>
                        <div className="bg-slate-50 p-2 rounded-md border font-bold text-gray-500">Πράξη (α · x)</div>
                        <div className="bg-slate-50 p-2 rounded-md border font-bold text-gray-500">Σημείο (x, y)</div>

                        {[-2, 0, 1].map((xVal) => {
                          const yVal = parseFloat((slopeA * xVal).toFixed(1));
                          return (
                            <g key={xVal}>
                              <div className="p-2 border-b font-semibold text-gray-700">{xVal}</div>
                              <div className="p-2 border-b text-[11px] text-gray-500">{slopeA.toFixed(1)} · ({xVal})</div>
                              <div className="p-2 border-b font-black text-indigo-600">({xVal}, {yVal})</div>
                            </g>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ΓΡΑΦΙΚΗ ΠΑΡΑΣΤΑΣΗ (ΜΕΓΑΛΥΤΕΡΟ ΠΛΕΓΜΑ ΕΩΣ 12) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-md border flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">📉 Σύστημα Αξόνων (Όρια έως 12)</span>
                  
                  <div className="relative w-full max-w-[420px] aspect-square bg-slate-50 rounded-xl border border-gray-200 p-2">
                    <svg viewBox="0 0 300 300" className="w-full h-full">
                      {/* Πλέγμα Φόντου: 25 γραμμές ανά 11 pixels (Σύνολο 300px, κέντρο στο 150) */}
                      {Array.from({ length: 27 }).map((_, i) => {
                        const pos = i * 11 + 7;
                        return (
                          <g key={i}>
                            <line x1={pos} y1="0" x2={pos} y2="300" className="stroke-gray-200/70 stroke-[0.5]" />
                            <line x1="0" y1={pos} x2="300" y2={pos} className="stroke-gray-200/70 stroke-[0.5]" />
                          </g>
                        );
                      })}

                      {/* Άξονας Χ */}
                      <line x1="10" y1="150" x2="285" y2="150" className="stroke-slate-600 stroke-2" />
                      <polygon points="285,146 292,150 285,154" className="fill-slate-600" />
                      <text x="285" y="168" className="text-xs font-bold fill-slate-600 font-mono">x</text>

                      {/* Άξονας Υ */}
                      <line x1="150" y1="290" x2="150" y2="15" className="stroke-slate-600 stroke-2" />
                      <polygon points="146,15 150,8 154,15" className="fill-slate-600" />
                      <text x="162" y="20" className="text-xs font-bold fill-slate-600 font-mono">y</text>

                      {/* Αρχή των αξόνων Ο */}
                      <circle cx="150" cy="150" r="3.5" className="fill-slate-800" />
                      <text x="138" y="164" className="text-xs font-bold fill-slate-800 font-mono">O</text>

                      {/* Η ΔΥΝΑΜΙΚΗ ΕΥΘΕΙΑ ΓΡΑΜΜΗ (y = ax) */}
                      <line x1={toSvgX(xStart)} y1={toSvgY(yStart)} x2={toSvgX(xEnd)} y2={toSvgY(yEnd)} className="stroke-indigo-600 stroke-[3] stroke-linecap-round drop-shadow-sm transition-all duration-75" />

                      {/* ΔΙΟΡΘΩΘΗΚΕ: Νέο αυτόνομο σημείο Α(1, α) που μένει πάντα εντός πλαισίου */}
                      {slopeA !== 0 && (
                        <g className="transition-all duration-75">
                          <circle cx={toSvgX(1)} cy={toSvgY(slopeA)} r="4.5" className="fill-amber-500 stroke-white stroke-1" />
                          <text x={toSvgX(1.3)} y={toSvgY(slopeA - 0.3)} className="text-[10px] font-black fill-amber-600 font-mono">A(1, {slopeA.toFixed(1)})</text>
                        </g>
                      )}
                    </svg>
                  </div>
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
