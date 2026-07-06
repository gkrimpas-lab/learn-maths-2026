// pages/e-dimotikou/21-poligona.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function PoligonaPage() {
  // Ο αριθμός των πλευρών/κορυφών του πολυγώνου (από 3 έως 8)
  const [sides, setSides] = useState(5); // Αρχική τιμή: Πεντάγωνο

  // Ονόματα πολυγώνων ανάλογα με τις πλευρές τους
  const polygonNames = {
    3: { title: 'Τρίγωνο', desc: 'Το απλούστερο πολύγωνο με 3 πλευρές, 3 γωνίες και 3 κορυφές.' },
    4: { title: 'Τετράπλευρο', desc: 'Πολύγωνο με 4 πλευρές, 4 γωνίες και 4 κορυφές (π.χ. ένα τυχαίο τετράπλευρο σχήμα).' },
    5: { title: 'Πεντάγωνο', desc: 'Πολύγωνο με 5 πλευρές, 5 γωνίες και 5 κορυφές.' },
    6: { title: 'Εξάγωνο', desc: 'Πολύγωνο με 6 πλευρές, 6 γωνίες και 6 κορυφές.' },
    7: { title: 'Επτάγωνο', desc: 'Πολύγωνο με 7 πλευρές, 7 γωνίες και 7 κορυφές.' },
    8: { title: 'Οκτάγωνο', desc: 'Πολύγωνο με 8 πλευρές, 8 γωνίες και 8 κορυφές.' }
  };

  // --- ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΑΝΩΜΑΛΟΥ ΠΟΛΥΓΩΝΟΥ ---
  // Για να δείξουμε την έννοια του γενικού πολυγώνου, προσθέτουμε ελεγχόμενη "παραμόρφωση" (noise)
  // στις ακτίνες των κορυφών ώστε το σχήμα να ΜΗΝ είναι κανονικό.
  const cx = 220; // Κέντρο SVG (1:1 αναλογία με το δεξί πλαίσιο 440x260)
  const cy = 130;
  
  // Σταθερές προκαθορισμένες αποκλίσεις ακτίνας για κάθε κορυφή, ώστε το σχήμα να είναι ανώμαλο αλλά σταθερό κατά το slider
  const radiusVariations = [1.1, 0.75, 1.2, 0.85, 1.15, 0.7, 1.05, 0.9];
  const baseRadius = 75;

  const pointsArray = [];
  for (let i = 0; i < sides; i++) {
    // Κατανομή των γωνιών ομοιόμορφα σε κύκλο 360 μοιρών
    const angleRad = (i * 2 * Math.PI) / sides - Math.PI / 2;
    // Εφαρμογή της απόκλισης για να γίνει ανώμαλο το πολύγωνο
    const currentRadius = baseRadius * radiusVariations[i];
    
    const x = Math.round(cx + currentRadius * Math.cos(angleRad));
    const y = Math.round(cy + currentRadius * Math.sin(angleRad));
    pointsArray.push({ x, y });
  }

  // Μετατροπή του πίνακα σημείων σε string για το attribute "points" του SVG polygon
  const pointsString = pointsArray.map(p => `${p.x},${p.y}`).join(' ');

  const currentPolygon = polygonNames[sides];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🛑 Τι είναι τα Πολύγωνα; - LearnMaths.gr</title>
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
              📖 Θεωρία: Τι είναι τα Πολύγωνα;
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Στη Γεωμετρία, όταν ενώνουμε διαδοχικά ευθύγραμμα τμήματα έτσι ώστε να κλείσουν μια περιοχή, φτιάχνουμε ένα <strong>πολύγωνο</strong>.
            </p>
            
            <div className="bg-blue-50 text-slate-900 p-5 rounded-2xl border border-blue-100 space-y-3 text-sm md:text-base">
              <p className="font-bold text-blue-900">💡 Τα βασικά χαρακτηριστικά ενός πολυγώνου:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium pl-2">
                <li>Αποτελείται μόνο από <strong>ευθείες γραμμές</strong> (πλευρές) — δεν έχει ποτέ καμπύλες!</li>
                <li>Είναι πάντοτε <strong>κλειστό σχήμα</strong>.</li>
                <li>Το όνομά του βγαίνει από τον αριθμό των γωνιών του (π.χ. 3 γωνίες = τρίγωνο, 5 γωνίες = πεντάγωνο).</li>
                <li>Σε κάθε πολύγωνο, ο αριθμός των <strong>πλευρών</strong>, των <strong>γωνιών</strong> και των <strong>κορυφών</strong> είναι πάντα ο ίδιος!</li>
              </ul>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΣΤΑΤΙΣΤΙΚΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Άλλαξε τις Πλευρές
                </h3>
                <p className="text-gray-500 text-sm">
                  Σύρε τον δρομέα για να προσθέσεις ή να αφαιρέσεις πλευρές και δες πώς αλλάζει το πολύγωνο.
                </p>
              </div>

              {/* Slider και Μετρητές πλευρών */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                <div className="flex items-center justify-between px-2">
                  <span className="font-bold text-slate-700 text-sm md:text-base">Αριθμός Πλευρών:</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSides(Math.max(3, sides - 1))} className="bg-blue-500 text-white font-black w-10 h-10 rounded-lg text-sm hover:bg-blue-600 transition shadow-sm flex items-center justify-center">-1</button>
                    <span className="w-16 text-center font-black text-3xl text-blue-600 tabular-nums">{sides}</span>
                    <button onClick={() => setSides(Math.min(8, sides + 1))} className="bg-blue-500 text-white font-black w-10 h-10 rounded-lg text-sm hover:bg-blue-600 transition shadow-sm flex items-center justify-center">+1</button>
                  </div>
                </div>

                <div className="px-2">
                  <input 
                    type="range" 
                    min="3" 
                    max="8" 
                    value={sides} 
                    onChange={(e) => setSides(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-2 tracking-wide">
                    <span>3 (Τρίγωνο)</span>
                    <span>5 (Πεντάγωνο)</span>
                    <span>8 (Οκτάγωνο)</span>
                  </div>
                </div>
              </div>

              {/* ΟΝΟΜΑΣΙΑ ΚΑΙ ΠΕΡΙΓΡΑΦΗ */}
              <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/50 transition-all duration-300 w-full space-y-2">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΑΥΤΟ ΤΟ ΣΧΗΜΑ ΕΙΝΑΙ:</span>
                  <div className="text-2xl font-black text-blue-600">
                    {currentPolygon.title}
                  </div>
                  <p className="text-xs text-gray-600 font-medium mt-1 leading-relaxed">{currentPolygon.desc}</p>
                </div>
                
                {/* Πίνακας Ισότητας Στοιχείων */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-blue-100 text-center text-[11px] font-black text-slate-700">
                  <div className="bg-white p-2 rounded-lg border">📐 {sides} Γωνίες</div>
                  <div className="bg-white p-2 rounded-lg border">📏 {sides} Πλευρές</div>
                  <div className="bg-white p-2 rounded-lg border">📍 {sides} Κορυφές</div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ (Pixel-Perfect 440x260) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              {/* Αναλογία 1:1 με το πλαίσιο για κρυστάλλινη vector ευκρίνεια, χωρίς downscaling */}
              <svg 
                viewBox="0 0 440 260" 
                className="w-full h-auto my-auto"
                shapeRendering="geometricPrecision"
              >
                {/* Το Πολύγωνο Σχήμα */}
                <polygon 
                  points={pointsString} 
                  className="fill-blue-500/10 stroke-blue-600 stroke-[4] stroke-linejoin-round"
                />

                {/* Σχεδίαση των Κορυφών (τελείες) και των ονομάτων τους (Α, Β, Γ...) */}
                {pointsArray.map((point, idx) => {
                  const label = String.fromCharCode(65 + idx); // Παράγει Α, Β, Γ, Δ, Ε...
                  
                  // Υπολογισμός θέσης κειμένου ελαφρώς εξωτερικά από την κορυφή για να μην πέφτει πάνω
                  const dx = point.x - cx;
                  const dy = point.y - cy;
                  const len = Math.sqrt(dx*dx + dy*dy);
                  const textX = point.x + (dx / len) * 16;
                  const textY = point.y + (dy / len) * 16 + 4; // Μικρή διόρθωση baseline

                  return (
                    <g key={idx}>
                      {/* Κορυφή */}
                      <circle cx={point.x} cy={point.y} r={5} className="fill-slate-800" />
                      {/* Όνομα Κορυφής */}
                      <text 
                        x={textX} 
                        y={textY} 
                        textAnchor="middle" 
                        className="text-xs font-black fill-slate-800"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Εκπαιδευτική επισήμανση στο κάτω μέρος */}
              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>🔍 Παρατήρησε ότι οι πλευρές έχουν διαφορετικά μήκη. Είναι ένα ανώμαλο πολύγωνο!</span>
              </div>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Πολυγώνων.</p>
      </footer>
    </div>
  );
}
