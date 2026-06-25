import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function BGymnasiouYAXB() {
  // States για την κλίση (α) και τη μετατόπιση (β) όπως στο screenshot yaxkaib.png
  const [alpha, setAlpha] = useState(1.0);
  const [beta, setBeta] = useState(2.0);
  const [showReference, setShowReference] = useState(true);

  // Υπολογισμοί εκτός JSX για την απόλυτη προστασία του compiler από RegEx errors
  const formattedAlpha = alpha.toFixed(1);
  const formattedBeta = beta.toFixed(1);
  const absoluteBeta = Math.abs(beta).toFixed(1);
  const signBeta = beta >= 0 ? "+" : "-";
  
  // Υπολογισμός των συντεταγμένων για τη γραμμή SVG της κύριας ευθείας y = ax + b
  // Αντί για διαίρεση, πολλαπλασιάζουμε τις μονάδες μετατόπισης (β * 20 pixel ανά μονάδα)
  const yShift = beta * 20;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans p-4 md:p-8">
      <Head>
        <title>4. Η Συνάρτηση y = αx + β - Β' Γυμνασίου</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ΣΥΝΔΕΣΜΟΣ ΕΠΙΣΤΡΟΦΗΣ ΣΤΟ DASHBOARD */}
        <Link href="/b-gymnasiou" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
          &larr; Επιστροφή στον Πίνακα Μαθημάτων
        </Link>

        {/* ΚΥΡΙΩΣ ΠΛΑΙΣΙΟ ΜΑΘΗΜΑΤΟΣ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          
          {/* ΤΙΤΛΟΣ & ΕΠΕΞΗΓΗΣΗ (Από το screenshot yaxkaib.png) */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                🚀 4. Η Συνάρτηση y = αx + β
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Αυτή η συνάρτηση προκύπτει από την <strong>παράλληλη μετατόπιση</strong> της ευθείας <em>y = αx</em> κατά <em>β</em> μονάδες στον κατακόρυφο άξονα <strong>y'y</strong>.
              </p>
              
              {/* Πλαίσια Θεωρίας */}
              <div className="bg-amber-50 border border-amber-200 text-amber-950 text-xs p-4 rounded-xl font-semibold space-y-2">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span><strong>Σημείο Τομής με τον y'y:</strong> Η ευθεία τέμνει τον κατακόρυφο άξονα πάντα στο σημείο <strong>(0, β)</strong>.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📐</span>
                  <span><strong>Κλίση:</strong> Η κλίση παραμένει <strong>α</strong>, ακριβώς όπως και στη συνάρτηση <em>y = αx</em>.</span>
                </div>
              </div>
            </div>

            {/* Μοβ Πλαίσιο Δεξιά */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-5 rounded-2xl shadow w-full md:w-80 space-y-2">
              <h3 className="font-bold text-sm flex items-center gap-1">🔍 Τι κάνει το «β»;</h3>
              <p className="text-xs opacity-95 leading-relaxed">
                Αν το <strong>β &gt; 0</strong>, η ευθεία ανεβαίνει προς τα πάνω. Αν το <strong>β &lt; 0</strong>, η ευθεία κατεβαίνει προς τα κάτω. Όλες οι ευθείες με το ίδιο <strong>α</strong> είναι <strong>παράλληλες</strong> μεταξύ τους!
              </p>
            </div>
          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
          <div className="bg-slate-50 p-6 rounded-2xl border space-y-4">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Αριστερή Στήλη: Χειριστήρια & Sliders */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                
                {/* 1. Slider Κλίσης (α) */}
                <div className="bg-white p-4 rounded-xl border shadow-sm space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Κλίση (α):</span>
                    <span className="font-mono text-indigo-600 font-black">{formattedAlpha}</span>
                  </div>
                  <input 
                    type="range" min="-3" max="3" step="0.5" value={alpha} 
                    onChange={(e) => setAlpha(parseFloat(e.target.value))} 
                    className="w-full accent-indigo-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                  />
                </div>

                {/* 2. Slider Μετατόπισης (β) */}
                <div className="bg-white p-4 rounded-xl border shadow-sm space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Μετατόπιση (β):</span>
                    <span className="font-mono text-purple-600 font-black">{formattedBeta}</span>
                  </div>
                  <input 
                    type="range" min="-4" max="4" step="0.5" value={beta} 
                    onChange={(e) => setBeta(parseFloat(e.target.value))} 
                    className="w-full accent-purple-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                  />
                </div>

                {/* 3. Διακόπτης Εμφάνισης Ευθείας Αναφοράς (y=αx) */}
                <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between text-xs font-bold">
                  <span className="uppercase text-slate-500 tracking-wider">Εμφάνιση της y = {formattedAlpha}x:</span>
                  <button 
                    type="button" 
                    onClick={() => setShowReference(!showReference)} 
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${showReference ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform ${showReference ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* 4. Κουτί Εξισώσεων (Κύρια & Αναφοράς) */}
                <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase mb-0.5">Κύρια Ευθεία:</span>
                    <div className="text-base font-black text-indigo-600">
                      {"y = "}{formattedAlpha}{"x "}{signBeta}{" "}{absoluteBeta}
                    </div>
                  </div>
                  <div className="border-t border-dashed pt-2">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase mb-0.5">Ευθεία Αναφοράς:</span>
                    <div className="text-xs font-bold text-slate-400">
                      {"y = "}{formattedAlpha}{"x"}
                    </div>
                  </div>
                </div>

              </div>

              {/* Δεξιά Στήλη: Γραφική Παράσταση SVG */}
              <div className="lg:col-span-7 bg-white p-4 rounded-2xl border shadow-sm flex flex-col justify-center items-center">
                <svg viewBox="0 0 200 200" className="w-full max-w-[280px] overflow-visible font-mono">
                  {/* Πλέγμα φόντου */}
                  {Array.from({ length: 11 }).map((_, i) => (
                    <line key={`grid-x-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="200" className="stroke-slate-100 stroke-[0.5]" />
                  ))}
                  {Array.from({ length: 11 }).map((_, i) => (
                    <line key={`grid-y-${i}`} x1="0" y1={i * 20} x2="200" y2={i * 20} className="stroke-slate-100 stroke-[0.5]" />
                  ))}

                  {/* Άξονες */}
                  <line x1="0" y1="100" x2="200" y2="100" className="stroke-slate-400 stroke-[1]" />
                  <line x1="100" y1="0" x2="100" y2="200" className="stroke-slate-400 stroke-[1]" />

                  {/* Διακεκομμένη Ευθεία Αναφοράς y = αx */}
                  {showReference && (
                    <line 
                      x1="0" y1={100 + (100 * alpha)} 
                      x2="200" y2={100 - (100 * alpha)} 
                      className="stroke-slate-300 stroke-[1.5] stroke-dasharray-[3]" 
                    />
                  )}

                  {/* Κύρια Ευθεία y = αx + β (Μετατοπισμένη κατακόρυφα κατά yShift) */}
                  <line 
                    x1="0" y1={100 - yShift + (100 * alpha)} 
                    x2="200" y2={100 - yShift - (100 * alpha)} 
                    className="stroke-indigo-600 stroke-[2.5] stroke-linecap-round" 
                  />

                  {/* Σημείο Τομής Σ(0, β) */}
                  <circle cx="100" cy={100 - yShift} r="3" className="fill-purple-500 stroke-white stroke-[0.5]" />
                  <text x="106" y={103 - yShift} className="text-[6.5px] font-black fill-purple-800">
                    Σ(0, {formattedBeta})
                  </text>
                </svg>

                <p className="mt-4 text-[10px] text-slate-400 font-medium text-center px-4">
                  👋 <em>Σύρε το slider του β και δες την ευθεία να μετατοπίζεται πάνω-κάτω χωρίς να αλλάζει η γωνία (κλίση) της!</em>
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
