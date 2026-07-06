// pages/e-dimotikou/22-kanonika-poligona.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function KanonikaPoligonaPage() {
  // Ο αριθμός των πλευρών (από 3 έως 30)
  const [sides, setSides] = useState(6); // Αρχική τιμή: Κανονικό Εξάγωνο

  // Ειδικά ονόματα για τα πρώτα βασικά κανονικά πολύγωνα
  const getPolygonName = (s) => {
    if (s === 3) return 'Ισόπλευρο Τρίγωνο';
    if (s === 4) return 'Τετράγωνο';
    if (s === 5) return 'Κανονικό Πεντάγωνο';
    if (s === 6) return 'Κανονικό Εξάγωνο';
    if (s === 7) return 'Κανονικό Επτάγωνο';
    if (s === 8) return 'Κανονικό Οκτάγωνο';
    return `Κανονικό ${s}-γωνο`;
  };

  // --- ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ ---
  // Όλες οι κορυφές ισαπέχουν από το κέντρο (cx, cy) έχοντας σταθερή ακτίνα radius
  const cx = 220; 
  const cy = 130;
  const radius = 85; // Σταθερή ακτίνα περικυκλωμένου κύκλου

  const pointsArray = [];
  for (let i = 0; i < sides; i++) {
    // Χωρίζουμε τις 360 μοίρες (2*PI) σε ακριβώς ίσα τμήματα
    const angleRad = (i * 2 * Math.PI) / sides - Math.PI / 2; // -PI/2 για να δείχνει η πρώτη κορυφή προς τα πάνω
    
    const x = Math.round(cx + radius * Math.cos(angleRad));
    const y = Math.round(cy + radius * Math.sin(angleRad));
    pointsArray.push({ x, y });
  }

  // Δημιουργία του string για το SVG
  const pointsString = pointsArray.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🛑 Κανονικά Πολύγωνα - LearnMaths.gr</title>
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
              📖 Θεωρία: Τι είναι τα Κανονικά Πολύγωνα;
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Στο προηγούμενο μάθημα είδαμε τα πολύγωνα γενικά. Τώρα θα γνωρίσουμε την πιο «τέλεια» και συμμετρική κατηγορία τους.
            </p>
            
            <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 text-sm md:text-base">
              <p className="font-bold text-emerald-900">📐 Ο διπλός κανόνας των Κανονικών Πολυγώνων:</p>
              <p className="text-slate-700 leading-relaxed font-medium">
                Ένα πολύγωνο ονομάζεται <strong>κανονικό</strong> όταν έχει:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 font-bold pl-2">
                <li><span className="text-emerald-600">Όλες τις πλευρές του ίσες</span> μεταξύ τους.</li>
                <li><span className="text-emerald-600">Όλες τις γωνίες του ίσες</span> μεταξύ τους.</li>
              </ul>
              <p className="text-xs font-bold text-emerald-800 pt-1">
                ⭐ Παρατήρηση: Όσο περισσότερες πλευρές έχει ένα κανονικό πολύγωνο, τόσο περισσότερο το σχήμα του αρχίζει να μοιάζει με <strong>κύκλο</strong>!
              </p>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΣΤΑΤΙΣΤΙΚΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Αυξομείωσε τις Πλευρές
                </h3>
                <p className="text-gray-500 text-sm">
                  Μετάβαλλε τον δρομέα από τις 3 έως τις 30 πλευρές και παρατήρησε τη μεταμόρφωση του σχήματος.
                </p>
              </div>

              {/* Slider και Buttons */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                <div className="flex items-center justify-between px-2">
                  <span className="font-bold text-slate-700 text-sm md:text-base">Πλευρές πολυγώνου:</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSides(Math.max(3, sides - 1))} className="bg-emerald-500 text-white font-black w-10 h-10 rounded-lg text-sm hover:bg-emerald-600 transition flex items-center justify-center">-1</button>
                    <span className="w-16 text-center font-black text-3xl text-emerald-600 tabular-nums">{sides}</span>
                    <button onClick={() => setSides(Math.min(30, sides + 1))} className="bg-emerald-500 text-white font-black w-10 h-10 rounded-lg text-sm hover:bg-emerald-600 transition flex items-center justify-center">+1</button>
                  </div>
                </div>

                <div className="px-2">
                  <input 
                    type="range" 
                    min="3" 
                    max="30" 
                    value={sides} 
                    onChange={(e) => setSides(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-2 tracking-wide">
                    <span>3 (Ισόπλευρο)</span>
                    <span>15-γωνο</span>
                    <span>30-γωνο (Κυκλικό)</span>
                  </div>
                </div>
              </div>

              {/* ΟΝΟΜΑΣΙΑ ΚΑΙ ΕΚΠΑΙΔΕΥΤΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 transition-all duration-300 w-full space-y-3">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΓΕΩΜΕΤΡΙΚΟ ΟΝΟΜΑ:</span>
                  <div className="text-2xl font-black text-emerald-600">
                    {getPolygonName(sides)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-bold text-slate-600">
                  <div className="bg-white p-2 rounded-lg border">📐 {sides} Ίσες Γωνίες</div>
                  <div className="bg-white p-2 rounded-lg border">📏 {sides} Ίσες Πλευρές</div>
                </div>

                {sides >= 20 && (
                  <div className="text-center text-[11px] bg-white text-emerald-700 border border-emerald-100 p-2 rounded-lg font-extrabold animate-pulse">
                    💡 Δες! Το σχήμα έχει γίνει σχεδόν ένας τέλειος κύκλος!
                  </div>
                )}
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ (Pixel-Perfect 440x260) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              {/* Απόλυτη vector ευκρίνεια, χωρίς σκιές ή downscaling που θολώνουν τις λεπτές πλευρές */}
              <svg 
                viewBox="0 0 440 260" 
                className="w-full h-auto my-auto"
                shapeRendering="geometricPrecision"
              >
                {/* Αχνός βοηθητικός κύκλος στο background για να βλέπουν οι μαθητές πώς το πολύγωνο "πατάει" πάνω του */}
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={radius} 
                  fill="none" 
                  className="stroke-slate-100 stroke-[1.5] stroke-dasharray-[3,3]" 
                />

                {/* Το Κανονικό Πολύγωνο */}
                <polygon 
                  points={pointsString} 
                  className="fill-emerald-500/5 stroke-emerald-500 stroke-[3.5] stroke-linejoin-round"
                />

                {/* Σχεδιάζουμε τις κορυφές ως μικρές τελείες. 
                    Αν οι πλευρές είναι πάνω από 12, κρύβουμε τα γράμματα Α, Β, Γ για να μην πέφτει το ένα πάνω στο άλλο και μπερδεύεται το UI */}
                {pointsArray.map((point, idx) => {
                  const label = String.fromCharCode(65 + (idx % 26)); // Α, Β, Γ...
                  
                  // Υπολογισμός θέσης κειμένου ελαφρώς εξωτερικά
                  const dx = point.x - cx;
                  const dy = point.y - cy;
                  const len = Math.sqrt(dx*dx + dy*dy);
                  const textX = point.x + (dx / len) * 14;
                  const textY = point.y + (dy / len) * 14 + 3;

                  return (
                    <g key={idx}>
                      {/* Κορυφή */}
                      <circle cx={point.x} cy={point.y} r={sides > 15 ? 2 : 4} className="fill-slate-800" />
                      
                      {/* Γράμματα (εμφανίζονται μόνο αν οι πλευρές είναι λίγες και καθαρές) */}
                      {sides <= 10 && (
                        <text 
                          x={textX} 
                          y={textY} 
                          textAnchor="middle" 
                          className="text-[10px] font-black fill-slate-700"
                        >
                          {label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Εκπαιδευτική επισήμανση στο κάτω μέρος */}
              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>✨ Όλες οι πλευρές και όλες οι γωνίες αυτού του σχήματος είναι απόλυτα ίσες.</span>
              </div>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Κανονικών Πολυγώνων.</p>
      </footer>
    </div>
  );
}
