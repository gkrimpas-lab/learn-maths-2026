// pages/e-dimotikou/20-monades-mikous.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function MonadesMikousPage() {
  const [selectedUnit, setSelectedUnit] = useState(3); // Αρχική επιλογή: Μέτρο (m)
  const [inputValue, setInputValue] = useState(1); // Αρχική τιμή: 1

  const units = [
    { id: 0, name: 'χιλιοστό (mm)', short: 'mm', factorToMeters: 0.001, desc: 'Για πολύ μικρά πράγματα (π.χ. το πάχος ενός νομίσματος).' },
    { id: 1, name: 'εκατοστό (cm)', short: 'cm', factorToMeters: 0.01, desc: 'Για καθημερινά αντικείμενα (π.χ. ένα μολύβι ή ένα τετράδιο).' },
    { id: 2, name: 'δεκάμετρο (dm)', short: 'dm', factorToMeters: 0.1, desc: 'Ισούται με 10 εκατοστά (π.χ. το άνοιγμα μιας παλάμης).' },
    { id: 3, name: 'μέτρο (m)', short: 'm', factorToMeters: 1, desc: 'Η βασική μονάδα μέτρησης (π.χ. το ύψος μιας πόρτας).' },
    { id: 4, name: 'χιλιόμετρο (km)', short: 'km', factorToMeters: 1000, desc: 'Για μεγάλες αποστάσεις (π.χ. η απόσταση μεταξύ δύο πόλεων).' }
  ];

  const currentUnit = units[selectedUnit];

  const convertValue = (targetUnitObj) => {
    if (isNaN(inputValue) || inputValue <= 0) return 0;
    const valueInMeters = inputValue * currentUnit.factorToMeters;
    const finalValue = valueInMeters / targetUnitObj.factorToMeters;
    if (finalValue % 1 === 0) return finalValue;
    return finalValue.toLocaleString('el-GR', { maximumFractionDigits: 4 });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📏 Μονάδες Μέτρησης Μήκους - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/e-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              📖 Θεωρία: Πώς μετράμε το Μήκος;
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Για να μετρήσουμε πόσο μακριά είναι κάτι, χρησιμοποιούμε τις <strong>μονάδες μέτρησης μήκους</strong>. Η βασική μονάδα είναι το <strong>Μέτρο (m)</strong>.
            </p>
            
            <div className="bg-blue-50 text-slate-900 p-5 rounded-2xl border border-blue-100 space-y-3 text-sm md:text-base">
              <p className="font-bold text-blue-900">🪜 Ο Κανόνας της Σκάλας (Μετατροπές):</p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium pl-2">
                <li>Όταν πάμε από <strong>μεγαλύτερη</strong> μονάδα σε <strong>μικρότερη</strong> (κατεβαίνουμε τη σκάλα), κάνουμε <span className="text-blue-600 font-bold">πολλαπλασιασμό (×)</span>.</li>
                <li>Όταν πάμε από <strong>μικρότερη</strong> μονάδα σε <strong>μεγαλύτερη</strong> (ανεβαίνουμε τη σκάλα), κάνουμε <span className="text-rose-600 font-bold">διαίρεση (:)</span>.</li>
              </ul>
              <p className="text-xs font-bold text-blue-800 bg-white/80 p-2 rounded-lg border border-blue-100">
                💡 Κάθε σκαλοπάτι (ανάμεσα σε mm, cm, dm, m) αξίζει 10! Προσοχή: Το άλμα από το μέτρο (m) στο χιλιόμετρο (km) αξίζει 1.000!
              </p>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΠΙΝΑΚΑΣ ΜΕΤΑΤΡΟΠΩΝ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[540px] w-full">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-gray-900">🕹️ Μετατροπέας Μονάδων</h3>
                  <p className="text-gray-500 text-sm">Πληκτρολόγησε μια τιμή και επίλεξε τη μονάδα σου για να δεις τις μετατροπές.</p>
                </div>

                <div className="flex gap-4 bg-slate-50 p-4 rounded-2xl border">
                  <div className="flex-1">
                    <label className="text-[11px] font-black text-gray-400 block mb-1 uppercase">ΠΟΣΟΤΗΤΑ</label>
                    <input 
                      type="number" 
                      value={inputValue} 
                      onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border font-black text-xl p-2.5 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-40">
                    <label className="text-[11px] font-black text-gray-400 block mb-1 uppercase">ΜΟΝΑΔΑ ΒΑΣΗΣ</label>
                    <select 
                      value={selectedUnit} 
                      onChange={(e) => setSelectedUnit(parseInt(e.target.value))}
                      className="w-full bg-white border font-black text-sm p-3 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>{u.short}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 my-auto py-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΙΣΟΔΥΝΑΜΑ ΜΗΚΗ:</span>
                {units.map((u) => {
                  const isCurrent = u.id === selectedUnit;
                  return (
                    <div 
                      key={u.id} 
                      onClick={() => setSelectedUnit(u.id)}
                      className={`p-3 px-4 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${isCurrent ? 'bg-blue-600 border-blue-600 text-white font-bold scale-[1.02] shadow-md' : 'bg-white hover:bg-gray-50 text-slate-700'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs p-1 px-2 rounded-md font-black ${isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{u.short}</span>
                        <span className="text-xs md:text-sm font-bold">{u.name}</span>
                      </div>
                      <span className="font-black text-base md:text-lg tabular-nums">{convertValue(u)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border text-center text-xs text-gray-500 font-medium">
                💡 {currentUnit.desc}
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ - ΜΕΤΑΤΟΠΙΣΜΕΝΗ ΚΑΙ ΔΙΟΡΘΩΜΗ ΣΚΑΛΑ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[540px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <svg 
                viewBox="0 0 440 260" 
                className="w-full h-auto my-auto"
                shapeRendering="geometricPrecision"
              >
                {/* Μετατοπίσαμε το x κατά -45 pixels αριστερά και μειώσαμε το πλάτος σκαλιού σε 70 */}
                {[
                  { id: 4, short: 'km', x: 15,  y: 50 },
                  { id: 3, short: 'm',  x: 85,  y: 90 },
                  { id: 2, short: 'dm', x: 155, y: 130 },
                  { id: 1, short: 'cm', x: 225, y: 170 },
                  { id: 0, short: 'mm', x: 295, y: 210 }
                ].map((step, idx, arr) => {
                  const isSelected = step.id === selectedUnit;
                  const stepWidth = 70; // Συμπτυγμένο πλάτος σκαλοπατιού
                  
                  return (
                    <g key={step.id}>
                      {/* Οριζόντιο πάτημα σκαλιού */}
                      <line x1={step.x} y1={step.y} x2={step.x + stepWidth} y2={step.y} className="stroke-slate-400 stroke-[3]" />
                      
                      {/* Κάθετο κατέβασμα σκαλιού */}
                      {idx < arr.length - 1 && (
                        <line x1={step.x + stepWidth} y1={step.y} x2={step.x + stepWidth} y2={step.y + 40} className="stroke-slate-400 stroke-[3]" />
                      )}

                      {/* Φωτεινό highlight επιλογής */}
                      {isSelected && (
                        <rect 
                          x={step.x + 2} 
                          y={step.y - 25} 
                          width={stepWidth - 4} 
                          height="24" 
                          rx="6" 
                          className="fill-blue-500/10 stroke-blue-500 stroke-[1.5] animate-pulse" 
                        />
                      )}

                      {/* Όνομα μονάδας */}
                      <text 
                        x={step.x + stepWidth / 2} 
                        y={step.y - 8} 
                        textAnchor="middle" 
                        className={`text-xs font-black ${isSelected ? 'fill-blue-600 text-[13px]' : 'fill-slate-700'}`}
                      >
                        {step.short}
                      </text>

                      {/* Κινούμενος δείκτης */}
                      {isSelected && (
                        <circle cx={step.x + stepWidth / 2} cy={step.y - 32} r={6} className="fill-blue-600 animate-bounce" />
                      )}
                    </g>
                  );
                })}

                {/* 🔽 Διορθωμένα Βέλη με απόλυτη ασφάλεια ορίων */}
                {/* Κατηφόρα = Πολλαπλασιασμός */}
                <g transform="translate(290, 45)">
                  <path d="M 0 0 L 25 25 M 25 25 L 18 25 M 25 25 L 25 18" fill="none" className="stroke-blue-500 stroke-2 stroke-linecap-round" />
                  <text x="30" y="15" className="fill-blue-600 text-[10px] font-black">Κατεβαίνω: ×10</text>
                </g>

                {/* Ανηφόρα = Διαίρεση */}
                <g transform="translate(25, 175)">
                  <path d="M 25 25 L 0 0 M 0 0 L 8 0 M 0 0 L 0 8" fill="none" className="stroke-rose-500 stroke-2 stroke-linecap-round" />
                  <text x="32" y="20" className="fill-rose-600 text-[10px] font-black">Ανεβαίνω: :10</text>
                </g>
              </svg>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto">
                <span>🪜 Κάθε σκαλοπάτι προς τα κάτω πολλαπλασιάζει με το 10!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Μέτρηση Μηκών.</p>
      </footer>
    </div>
  );
}
