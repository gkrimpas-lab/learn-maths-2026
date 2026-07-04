// pages/e-dimotikou/19-mikos-kiklou.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function MikosKiklouPage() {
  const [rollProgress, setRollProgress] = useState(0);

  // --- ΓΕΩΜΕΤΡΙΚΕΣ ΣΤΑΘΕΡΕΣ (Προσαρμοσμένες για 1:1 καμβά 440x260) ---
  const radius = 35; // Ιδανική ακτίνα για πεντακάθαρη vector σχεδίαση
  const diametros = radius * 2; // 70
  const pi = 3.14159;
  const totalLength = Math.round(2 * pi * radius); // ~220 pixels ιδανικά για το πλάτος 440

  const startCx = 60; // Ξεκινάει από αριστερά
  const startCy = 110;
  const groundY = startCy + radius; // 145 (Το επίπεδο του εδάφους)

  // Υπολογισμοί κίνησης με απόλυτη ακρίβεια pixel
  const currentCx = Math.round(startCx + (rollProgress / 100) * totalLength);
  const rotationDeg = (rollProgress / 100) * 360;
  const unfoldedLength = Math.round((rollProgress / 100) * totalLength);

  // Μετρικές για το UI
  const displayDiametrosCm = (diametros / 10).toFixed(1); // 7.0 cm
  const displayMikosCm = (totalLength / 10).toFixed(1); // 22.0 cm
  const displayCurrentCm = (unfoldedLength / 10).toFixed(1);

  const isComplete = rollProgress === 100;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⭕ Μήκος Κύκλου - LearnMaths.gr</title>
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
              📖 Θεωρία: Το Μήκος του Κύκλου (Περίμετρος)
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Αν ξετυλίξουμε την περιφέρεια ενός κύκλου πάνω σε μια ευθεία γραμμή, το μήκος που προκύπτει είναι το <strong>Μήκος του Κύκλου</strong>.
            </p>
            <div className="bg-indigo-50 text-slate-900 p-5 rounded-2xl border border-indigo-100 space-y-3 text-sm md:text-base">
              <p className="font-bold text-indigo-900">⭕ Πώς το υπολογίζουμε;</p>
              <p className="text-slate-700 leading-relaxed">
                Το μήκος κάθε κύκλου είναι πάντα ίσο με τη διάμετρό του πολλαπλασιασμένη με τον σταθερό αριθμό <strong className="text-indigo-700">π = 3,14</strong>.
              </p>
              <div className="p-3 bg-white rounded-xl border border-indigo-200 text-center font-black text-base text-indigo-600">
                Μήκος Κύκλου = 3,14 × Διάμετρος &nbsp; (Μ = π × δ)
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Κύλισε τον Κύκλο
                </h3>
                <p className="text-gray-500 text-sm">
                  Σύρε τον δρομέα για να ξετυλίξεις τον κύκλο 1 πλήρη στροφή.
                </p>
              </div>

              {/* Slider και Μετρήσεις */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-3 rounded-xl border shadow-sm">
                    <span className="text-[10px] font-black text-gray-400 block tracking-wide">ΔΙΑΜΕΤΡΟΣ (δ)</span>
                    <span className="text-xl font-black text-slate-800">{displayDiametrosCm} cm</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border shadow-sm">
                    <span className="text-[10px] font-black text-gray-400 block tracking-wide">ΜΗΚΟΣ ΓΡΑΜΜΗΣ</span>
                    <span className={`text-xl font-black ${isComplete ? 'text-emerald-600' : 'text-blue-600'}`}>
                      {displayCurrentCm} cm
                    </span>
                  </div>
                </div>

                <div className="px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={rollProgress} 
                    onChange={(e) => setRollProgress(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-2">
                    <span>🎬 Αφετηρία (0%)</span>
                    <span className={isComplete ? 'text-emerald-600 font-black' : ''}>🏁 Πλήρης Στροφή (100%)</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button onClick={() => setRollProgress(0)} className="p-2 px-4 rounded-xl font-bold text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm">🔄 Επαναφορά</button>
                  <button onClick={() => setRollProgress(100)} className={`p-2 px-4 rounded-xl font-black text-xs transition shadow-sm ${isComplete ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>🎯 Ξετύλιγμα</button>
                </div>
              </div>

              {/* ΑΠΟΤΕΛΕΣΜΑ */}
              <div className={`p-5 rounded-2xl border text-center ${isComplete ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`text-xl font-black ${isComplete ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {isComplete ? `🏆 Συνολικό Μήκος = ${displayMikosCm} cm` : '📐 Ο τροχός κυλάει ομαλά...'}
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ (Pixel-Perfect 440x260) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              {/* Σχεδίαση χωρίς downscaling για απόλυτη vector καθαρότητα */}
              <svg 
                viewBox="0 0 440 260" 
                className="w-full h-auto my-auto"
                shapeRendering="geometricPrecision"
              >
                {/* 🛤️ Η κύρια γραμμή του εδάφους */}
                <line x1="20" y1={groundY} x2="420" y2={groundY} className="stroke-slate-300 stroke-[3]" />
                
                {/* Αφετηρία 0 */}
                <line x1={startCx} y1={groundY} x2={startCx} y2={groundY + 8} className="stroke-slate-400 stroke-2" />
                <text x={startCx} y={groundY + 22} className="fill-slate-400 text-[11px] font-black" textAnchor="middle">0</text>

                {/* Τέρμα 3,14δ */}
                <line x1={startCx + totalLength} y1={groundY} x2={startCx + totalLength} y2={8} className="stroke-emerald-500 stroke-[2] stroke-dasharray-[3,3]" />
                <line x1={startCx + totalLength} y1={groundY} x2={startCx + totalLength} y2={groundY + 8} className="stroke-emerald-600 stroke-2" />
                <text x={startCx + totalLength} y={groundY + 22} className="fill-emerald-600 text-[11px] font-black" textAnchor="middle">Μήκος (3,14δ)</text>

                {/* 🔵 Η μπλε/πράσινη γραμμή ξετυλίγματος - Πεντακάθαρη stroke-[6] */}
                {rollProgress > 0 && (
                  <line 
                    x1={startCx} y1={groundY} x2={startCx + unfoldedLength} y2={groundY} 
                    className={`stroke-[6] stroke-linecap-round ${isComplete ? 'stroke-emerald-500' : 'stroke-blue-500'}`} 
                  />
                )}

                {/* ⭕ Ο ΚΥΚΛΟΣ */}
                <g transform={`translate(${currentCx - startCx}, 0)`}>
                  <circle 
                    cx={startCx} 
                    cy={startCy} 
                    r={radius} 
                    className={`fill-white stroke-[4] ${isComplete ? 'stroke-emerald-600 fill-emerald-50/10' : 'stroke-slate-800'}`} 
                  />
                  
                  {/* Περιστρεφόμενη ακτίνα */}
                  <g transform={`rotate(${rotationDeg}, ${startCx}, ${startCy})`}>
                    <line x1={startCx} y1={startCy} x2={startCx} y2={startCy + radius} className="stroke-indigo-600 stroke-[3] stroke-linecap-round" />
                    <circle cx={startCx} cy={startCy + radius} r={4.5} className="fill-indigo-600" />
                  </g>

                  <circle cx={startCx} cy={startCy} r={4} className="fill-slate-800" />
                  
                  {/* Ετικέτα διαμέτρου μέσα στον κύκλο */}
                  <line x1={startCx - radius + 4} y1={startCy} x2={startCx + radius - 4} y2={startCy} className="stroke-slate-400 stroke-[1] stroke-dasharray-[2,2]" />
                  <text x={startCx} y={startCy - 6} className="text-[10px] font-black fill-slate-800 text-anchor-middle">δ = {displayDiametrosCm} cm</text>
                </g>

                {/* 📏 ΟΠΤΙΚΟΣ ΟΔΗΓΟΣ ΣΥΓΚΡΙΣΗΣ (Κάτω από τον άξονα) */}
                {isComplete && (
                  <g transform="translate(0, 45)">
                    {/* Σχεδιάζουμε ακριβώς το μέγεθος 1 Διάμετρου για να δει ο μαθητής τη σχέση */}
                    <line x1={startCx} y1={groundY} x2={startCx + diametros} y2={groundY} className="stroke-amber-500 stroke-[4] stroke-linecap-round" />
                    <text x={startCx + diametros / 2} y={groundY + 16} className="fill-amber-600 text-[10px] font-black" textAnchor="middle">1 Διάμετρος (δ)</text>
                    <text x={startCx + totalLength - 40} y={groundY + 16} className="fill-slate-400 text-[10px] font-bold"> χωράει ~3,14 φορές</text>
                  </g>
                )}
              </svg>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto">
                <span>{isComplete ? '🟢 Το μήκος της γραμμής είναι ακριβώς π (3,14) φορές η διάμετρος!' : '🔍 Δες την ακράδαντη vector ευκρίνεια κατά την κύλιση.'}</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Κύκλου.</p>
      </footer>
    </div>
  );
}
