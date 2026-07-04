// pages/e-dimotikou/19-mikos-kiklou.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function MikosKiklouPage() {
  // Η πρόοδος της περιστροφής/κύλισης του κύκλου (από 0% έως 100%)
  const [rollProgress, setRollProgress] = useState(0);

  // --- ΓΕΩΜΕΤΡΙΚΕΣ ΣΤΑΘΕΡΕΣ ---
  const radius = 40; // Ακτίνα του κύκλου σε pixels
  const diametros = radius * 2; // Διάμετρος = 80
  const pi = 3.14159;
  const totalLength = 2 * pi * radius; // Συνολικό μήκος κύκλου (~251.3 px)

  // Αρχικές συντεταγμένες του κύκλου στο start (0%)
  const startCx = 100;
  const startCy = 180;
  const groundY = startCy + radius; // 220 (Η γραμμή του εδάφους/χάρακα)

  // Τρέχουσα οριζόντια θέση του κέντρου του κύκλου καθώς κυλάει
  const currentCx = startCx + (rollProgress / 100) * totalLength;

  // Η τρέχουσα γωνία περιστροφής του κύκλου σε μοίρες
  const rotationDeg = (rollProgress / 100) * 360;

  // Το μήκος της γραμμής που έχει ξετυλιχθεί στο έδαφος
  const unfoldedLength = (rollProgress / 100) * totalLength;

  // Εκπαιδευτικά εκατοστά
  const displayDiametrosCm = (diametros / 10).toFixed(1); // 8.0 cm
  const displayMikosCm = ((2 * pi * radius) / 10).toFixed(1); // 25.1 cm
  const displayCurrentCm = (unfoldedLength / 10).toFixed(1);

  // Έλεγχος αν ολοκληρώθηκε η περιστροφή
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
              Αν πάρουμε μια κλωστή, τη σχηματίσουμε σε κύκλο και μετά την κόψουμε και την απλώσουμε σε μια ευθεία, το μήκος της γραμμής αυτής είναι το <strong>Μήκος του Κύκλου</strong>.
            </p>
            <div className="bg-indigo-50 text-slate-900 p-5 rounded-2xl border border-indigo-100 space-y-3 text-sm md:text-base">
              <p>
                ⭕ <strong>Πώς υπολογίζουμε το Μήκος;</strong>
              </p>
              <p className="text-slate-700 leading-relaxed font-medium">
                Οι μαθηματικοί ανακάλυψαν ότι αν διαιρέσουμε το μήκος οποιουδήποτε κύκλου με τη διάμετρό του, βρίσκουμε πάντα τον ίδιο μαγικό αριθμό, τον αριθμό <strong className="text-indigo-700">π = 3,14</strong>!
              </p>
              <div className="p-3 bg-white rounded-xl border border-indigo-200 text-center font-black text-base md:text-lg text-indigo-600">
                Μήκος Κύκλου = π × Διάμετρος &nbsp; (Μ = 3,14 × δ)
              </div>
              <p className="text-xs font-bold text-indigo-800">
                💡 Ή εναλλακτικά με την ακτίνα (αφού η διάμετρος είναι δύο ακτίνες): Μ = 2 × π × α
              </p>
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
                  Σύρε τον δρομέα για να ξετυλίξεις τον κύκλο πάνω στον χάρακα και δες πώς σχηματίζεται το μήκος του.
                </p>
              </div>

              {/* Slider και Μετρήσεις */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-3 rounded-xl border shadow-sm flex flex-col justify-center">
                    <span className="text-[10px] font-black text-gray-400 block uppercase tracking-wide">ΔΙΑΜΕΤΡΟΣ (δ)</span>
                    <span className="text-xl font-black text-slate-800">
                      {displayDiametrosCm} cm
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border shadow-sm flex flex-col justify-center">
                    <span className="text-[10px] font-black text-gray-400 block uppercase tracking-wide">ΑΠΟΤΥΠΩΜΑ ΣΤΟ ΕΔΑΦΟΣ</span>
                    <span className={`text-xl font-black ${isComplete ? 'text-emerald-600 scale-105 transition-transform' : 'text-blue-600'}`}>
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
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-2 tracking-wide">
                    <span>🎬 Αφετηρία (0%)</span>
                    <span className={isComplete ? 'text-emerald-600 font-black' : ''}>🏁 1 Πλήρης Στροφή (100%)</span>
                  </div>
                </div>

                {/* Γρήγορο Reset/Complete */}
                <div className="flex justify-center gap-3 pt-1">
                  <button 
                    onClick={() => setRollProgress(0)}
                    className="p-2 px-4 rounded-xl font-bold text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm"
                  >
                    🔄 Επαναφορά
                  </button>
                  <button 
                    onClick={() => setRollProgress(100)}
                    className={`p-2 px-4 rounded-xl font-black text-xs transition shadow-sm ${isComplete ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    🎯 Πλήρες Ξετύλιγμα
                  </button>
                </div>
              </div>

              {/* ΑΠΟΤΕΛΕΣΜΑ */}
              <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 w-full text-center ${isComplete ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΜΑΘΗΜΑΤΙΚΗ ΕΠΙΒΕΒΑΙΩΣΗ:</span>
                <div className={`text-xl md:text-2xl font-black mt-1 ${isComplete ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {isComplete ? `🏆 Συνολικό Μήκος = ${displayMikosCm} cm` : '📐 Ο τροχός κυλάει...'}
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                  {isComplete 
                    ? `Παρατήρησε! Το μήκος (${displayMikosCm} cm) είναι ακριβώς 3,14 φορές μεγαλύτερο από τη διάμετρο (${displayDiametrosCm} cm)!` 
                    : `Το τρέχον αποτύπωμα μεγαλώνει συνεχώς καθώς ο κύκλος ξετυλίγεται.`
                  }
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ - Διορθωμένη ευκρίνεια κειμένων */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              {/* Αφαιρέθηκε το drop-shadow και το hardware-acceleration στυλ για κρυστάλλινα vector γράμματα */}
              <svg viewBox="0 0 800 340" className="w-full h-auto my-auto px-2">
                
                {/* 📏 Ο Οριζόντιος Χάρακας / Έδαφος */}
                <line x1="50" y1={groundY} x2="750" y2={groundY} className="stroke-slate-300 stroke-[3] stroke-linecap-round" />
                
                {/* Διαγραμμίσεις στον χάρακα - Μεγαλύτερα και πεντακάθαρα κείμενα */}
                <g className="stroke-slate-400 stroke-2 fill-slate-500 font-bold">
                  {/* Σημείο 0 */}
                  <line x1={startCx} y1={groundY} x2={startCx} y2={groundY + 8} />
                  <text x={startCx} y={groundY + 24} textAnchor="middle" className="text-sm font-black border-none shadow-none">0</text>

                  {/* 1η Διάμετρος */}
                  <line x1={startCx + diametros} y1={groundY} x2={startCx + diametros} y2={groundY + 8} />
                  <text x={startCx + diametros} y={groundY + 24} textAnchor="middle" className="text-sm font-black">1δ</text>

                  {/* 2η Διάμετρος */}
                  <line x1={startCx + 2 * diametros} y1={groundY} x2={startCx + 2 * diametros} y2={groundY + 8} />
                  <text x={startCx + 2 * diametros} y={groundY + 24} textAnchor="middle" className="text-sm font-black">2δ</text>

                  {/* 3η Διάμετρος */}
                  <line x1={startCx + 3 * diametros} y1={groundY} x2={startCx + 3 * diametros} y2={groundY + 8} />
                  <text x={startCx + 3 * diametros} y={groundY + 24} textAnchor="middle" className="text-sm font-black">3δ</text>

                  {/* Τελικό Σημείο 3.14δ (Μήκος) */}
                  <line x1={startCx + totalLength} y1={groundY} x2={startCx + totalLength} y2={groundY + 12} className="stroke-emerald-500 stroke-2" />
                  <text x={startCx + totalLength} y={groundY + 26} textAnchor="middle" className="fill-emerald-600 font-black text-base">3,14δ (Μήκος)</text>
                </g>

                {/* 🔵 Το αποτύπωμα στο έδαφος */}
                {rollProgress > 0 && (
                  <line 
                    x1={startCx} y1={groundY} x2={startCx + unfoldedLength} y2={groundY} 
                    className={`stroke-[5] stroke-linecap-round ${isComplete ? 'stroke-emerald-500' : 'stroke-blue-500'}`} 
                  />
                )}

                {/* ⭕ Ο ΚΙΝΟΥΜΕΝΟΣ ΚΥΚΛΟΣ */}
                <g transform={`translate(${currentCx - startCx}, 0)`}>
                  
                  {/* Κύκλος - Προσθήκη drop shadow ΜΟΝΟ στον ίδιο τον κύκλο και όχι στα γράμματα */}
                  <circle 
                    cx={startCx} 
                    cy={startCy} 
                    r={radius} 
                    className={`fill-white stroke-[4] filter drop-shadow-sm ${isComplete ? 'stroke-emerald-600 fill-emerald-50/10' : 'stroke-slate-800'}`} 
                  />
                  
                  {/* Περιστρεφόμενα στοιχεία (ακτίνες) */}
                  <g transform={`rotate(${rotationDeg}, ${startCx}, ${startCy})`}>
                    <line x1={startCx} y1={startCy} x2={startCx} y2={startCy + radius} className="stroke-indigo-600 stroke-[3] stroke-linecap-round" />
                    <line x1={startCx} y1={startCy} x2={startCx + radius} y2={startCy} className="stroke-slate-300 stroke-[1.5]" />
                    <circle cx={startCx} cy={startCy + radius} r={4} className="fill-indigo-600" />
                  </g>

                  {/* Κέντρο του κύκλου */}
                  <circle cx={startCx} cy={startCy} r={4} className="fill-slate-800" />
                  
                  {/* Διάμετρος - Μετακινήθηκε το κείμενο πιο ψηλά (y={startCy - 12}) για να μην μπερδεύεται με τη γραμμή */}
                  <line x1={startCx - radius + 5} y1={startCy} x2={startCx + radius - 5} y2={startCy} className="stroke-slate-400 stroke stroke-dasharray-[2,2]" />
                  <text x={startCx} y={startCy - 12} textAnchor="middle" className="text-xs font-black fill-slate-700">{`δ = ${displayDiametrosCm} cm`}</text>
                </g>

              </svg>

              {/* Ετικέτα στο κάτω μέρος του καμβά */}
              <div className="w-full flex justify-center text-xs md:text-sm font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto">
                <span>{isComplete ? '🟢 1 πλήρης στροφή απέδειξε ότι: Μήκος = 3,14 επί τη Διάμετρο!' : '🔍 Παρατήρησε την ακτίνα πώς γυρνάει καθώς ο κύκλος προχωράει.'}</span>
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
