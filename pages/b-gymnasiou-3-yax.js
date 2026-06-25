import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function BGymnasiouYAX() {
  // State για την κλίση της ευθείας (α) όπως στο αρχικό screenshot
  const [alpha, setAlpha] = useState(1.0);

  // Σταθερές τιμές x για τον Πίνακα Τιμών, όπως ακριβώς φαίνεται στην εικόνα yax.png
  const xValues = [-1, 0, 2];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans p-4 md:p-8">
      <Head>
        <title>3. Η Συνάρτηση y = αx - Β' Γυμνασίου</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ΣΥΝΔΕΣΜΟΣ ΕΠΙΣΤΡΟΦΗΣ ΣΤΟ DASHBOARD */}
        <Link href="/b-gymnasiou" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
          &larr; Επιστροφή στον Πίνακα Μαθημάτων
        </Link>

        {/* ΚΥΡΙΩΣ ΠΛΑΙΣΙΟ ΜΑΘΗΜΑΤΟΣ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          
          {/* ΤΙΤΛΟΣ & ΕΠΕΞΗΓΗΣΗ (Από το screenshot yax.png) */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                📈 3. Η Συνάρτηση y = αx
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Η συνάρτηση αυτή εκφράζει δύο <strong>ανάλογα ποσά</strong>. Η γραφική της παράσταση είναι πάντοτε μια <strong>ευθεία γραμμή</strong> η οποία διέρχεται από την αρχή των αξόνων <strong>O(0,0)</strong>.
              </p>
              
              {/* Χρωματιστά Πλαίσια Θεωρίας */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-3 rounded-xl font-medium flex-1">
                  🍏 <strong>Όταν το α &gt; 0 (Θετικό):</strong><br />
                  Η ευθεία &quot;ανεβαίνει&quot; από αριστερά προς τα δεξιά (βρίσκεται στο 1ο και 3ο τεταρτημόριο).
                </div>
                <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-xl font-medium flex-1">
                  🍎 <strong>Όταν το α &lt; 0 (Αρνητικό):</strong><br />
                  Η ευθεία &quot;κατεβαίνει&quot; από αριστερά προς τα δεξιά (βρίσκεται στο 2ο και 4ο τεταρτημόριο).
                </div>
              </div>
            </div>

            {/* Μπλε Πλαίσιο Δεξιά */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 rounded-2xl shadow w-full md:w-80 space-y-2">
              <h3 className="font-bold text-sm flex items-center gap-1">💡 ΤΙ ΕΙΝΑΙ ΤΟ «Α»;</h3>
              <p className="text-xs opacity-90 leading-relaxed">
                Ο αριθμός <strong>α</strong> ονομάζεται <strong>συντελεστής διεύθυνσης</strong> ή <strong>κλίση</strong> της ευθείας. Όσο μεγαλύτερο είναι το α (απόλυτα), τόσο πιο &quot;απότομη&quot; γίνεται η ανηφόρα ή η κατηφόρα της ευθείας!
              </p>
            </div>
          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
          <div className="bg-slate-50 p-6 rounded-2xl border space-y-4">
            <h3 className="text-sm font-black text-slate-700 text-center flex items-center justify-center gap-2">
              🎮 Πειραματίσου με την κλίση της ευθείας
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Αριστερή Στήλη: Sliders & Πίνακας Τιμών */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                
                {/* Χειριστήριο Κλίσης */}
                <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">ΚΛΙΣΗ ΤΗΣ ΕΥΘΕΙΑΣ:</span>
                    <span className="font-mono bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200 font-black text-sm">
                      α = {alpha.toFixed(1)}
                    </span>
                  </div>
                  
                  {/* Μπάρα Slider και Κουμπιά Μικρορύθμισης */}
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setAlpha(parseFloat(Math.max(-5, alpha - 0.1).toFixed(1)))} className="bg-slate-100 hover:bg-slate-200 font-mono font-black px-2 py-0.5 border rounded text-xs">-0.1</button>
                    <input 
                      type="range" min="-5" max="5" step="0.5" value={alpha} 
                      onChange={(e) => setAlpha(parseFloat(e.target.value))} 
                      className="flex-1 accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                    />
                    <button type="button" onClick={() => setAlpha(parseFloat(Math.min(5, alpha + 0.1).toFixed(1)))} className="bg-slate-100 hover:bg-slate-200 font-mono font-black px-2 py-0.5 border rounded text-xs">+0.1</button>
                  </div>
                  <div className="flex justify-between text-[8px] font-bold text-slate-400 font-mono px-1">
                    <span>-5.0 (Κατηφόρα)</span>
                    <span>0.0 (Οριζόντια)</span>
                    <span>+5.0 (Ανηφόρα)</span>
                  </div>
                </div>

                {/* Τρέχουσα Εξίσωση */}
                <div className="bg-white p-4 rounded-xl border shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Η ΕΞΙΣΩΣΗ ΤΗΣ ΕΥΘΕΙΑΣ:</span>
                  <div className="text-xl font-mono font-black text-indigo-600">
                    {"y = "}{alpha === 0 ? "0" : alpha === 1 ? "x" : alpha === -1 ? "-x" : `${alpha.toFixed(1)}x`}
                  </div>
                </div>

                {/* Πίνακας Τιμών (X, Y) */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden text-center">
                  <div className="p-2 bg-slate-100 border-b text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    📋 Πίνακας Τιμών (X, Y)
                  </div>
                  <table className="w-full font-mono text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b text-[10px]">
                        <th className="py-1.5 border-r">Τιμή x</th>
                        <th className="py-1.5 border-r">Πράξη (α &middot; x)</th>
                        <th className="py-1.5">Σημείο (x, y)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {xValues.map((x) => {
                        const calculatedY = parseFloat((alpha * x).toFixed(1));
                        return (
                          <tr key={x} className="border-b last:border-0 hover:bg-slate-50/50">
                            <td className="py-2 border-r font-bold text-slate-600">{x}</td>
                            <td className="py-2 border-r text-slate-400">
                              {alpha.toFixed(1)} &middot; {x < 0 ? `(${x})` : x}
                            </td>
                            <td className="py-2 text-indigo-600 font-black">
                              ({x}, {calculatedY})
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Δεξιά Στήλη: Καρτεσιανό Επίπεδο SVG */}
              <div className="lg:col-span-7 bg-white p-4 rounded-2xl border shadow-sm flex flex-col justify-center items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase block mb-3 tracking-wider">
                  📉 Καρτεσιανό Σύστημα Συντεταγμένων
                </span>

                <svg viewBox="0 0 200 200" className="w-full max-w-[280px] overflow-visible font-mono">
                  {/* Πλέγμα Φόντου */}
                  {Array.from({ length: 11 }).map((_, i) => (
                    <g key={i}>
                      <line x1={i * 20} y1="0" x2={i * 20} y2="200" className="stroke-slate-100 stroke-[0.5]" />
                      <line x1="0" y1={i * 20} x2="200" y2={i * 20} className="stroke-slate-100 stroke-[0.5]" />
                    </g>
                  ))}

                  {/* Άξονες X'X και Y'Y */}
                  <line x1="0" y1="100" x2="200" y2="100" className="stroke-slate-500 stroke-[1.2]" />
                  <line x1="100" y1="0" x2="100" y2="200" className="stroke-slate-500 stroke-[1.2]" />
                  <text x="192" y="111" className="text-[8px] font-bold fill-slate-500">x</text>
                  <text x="106" y="10" className="text-[8px] font-bold fill-slate-500">y</text>
                  <text x="94" y="111" className="text-[7px] fill-slate-400">O</text>

                  {/* Δυναμικό Σημείο Α(2, 2α) όπως στην εικόνα yax.png */}
                  <circle cx="140" cy={100 - (40 * alpha)} r="3" className="fill-amber-500 stroke-white stroke-[0.5]" />
                  <text x="145" y={103 - (40 * alpha)} className="text-[7px] font-black fill-amber-700">
                    A(2, {(2 * alpha).toFixed(1).replace('.0', '')})
                  </text>

                  {/* 📈 Η ΕΥΘΕΙΑ ΓΡΑΜΜΗ (Χωρίς κανένα σύμβολο διαίρεσης στο JSX) */}
                  <line 
                    x1="0" y1={100 + (100 * alpha)} 
                    x2="200" y2={100 - (100 * alpha)} 
                    className="stroke-indigo-600 stroke-[2.5] stroke-linecap-round transition-all duration-150" 
                  />
                </svg>

                <p className="mt-4 text-[10px] text-slate-400 font-medium text-center px-4">
                  💡 <em>Παρατήρησε πώς η ευθεία πλησιάζει τον κατακόρυφο άξονα καθώς μεγαλώνει το α, και πώς &quot;ξαπλώνει&quot; στον οριζόντιο άξονα όταν το α πλησιάζει το 0.</em>
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-runnable-track { background: #e2e8f0; height: 8px; border-radius: 8px; }
        input[type="range"]::-moz-range-track { background: #e2e8f0; height: 8px; border-radius: 8px; }
      `}</style>
    </div>
  );
}
