// pages/e-dimotikou/23-perimetros.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function PerimetrosPage() {
  // Πρόοδος από 0 έως 100
  const [progress, setProgress] = useState(0);

  // --- ΓΕΩΜΕΤΡΙΚΕΣ ΣΤΑΘΕΡΕΣ ---
  const sidesData = [
    { id: 0, label: 'α', lengthCm: 6, px: 60,  color: 'stroke-cyan-500', fill: 'fill-cyan-500' },
    { id: 1, label: 'β', lengthCm: 5, px: 50,  color: 'stroke-indigo-500', fill: 'fill-indigo-500' },
    { id: 2, label: 'γ', lengthCm: 7, px: 70,  color: 'stroke-purple-500', fill: 'fill-purple-500' },
    { id: 3, label: 'δ', lengthCm: 4, px: 40,  color: 'stroke-amber-500', fill: 'fill-amber-500' }
  ];

  const totalPerimetrosCm = 22;
  const totalLengthPx = 220;
  const startX = 110; // Αφετηρία χάρακα
  const groundY = 210; // Ύψος χάρακα

  // Σταθερές συντεταγμένες του κλειστού σχήματος στο πάνω μέρος
  const pA = { x: 160, y: 60 };
  const pB = { x: 280, y: 60 };
  const pΓ = { x: 250, y: 130 };
  const pΔ = { x: 140, y: 120 };

  // Συναρτήσεις υπολογισμού της κίνησης για κάθε πλευρά ξεχωριστά
  // Κάθε πλευρά έχει το δικό της "παράθυρο" στο slider (0-25, 25-50, 50-75, 75-100)
  const getSideCoords = (id) => {
    // Αρχικές θέσεις στο σχήμα
    let origX1, origY1, origX2, origY2;
    if (id === 0) { origX1 = pA.x; origY1 = pA.y; origX2 = pB.x; origY2 = pB.y; }
    if (id === 1) { origX1 = pB.x; origY1 = pB.y; origX2 = pΓ.x; origY2 = pΓ.y; }
    if (id === 2) { origX1 = pΓ.x; origY1 = pΓ.y; origX2 = pΔ.x; origY2 = pΔ.y; }
    if (id === 3) { origX1 = pΔ.x; origY1 = pΔ.y; origX2 = pA.x; origY2 = pA.y; }

    // Τελικές θέσεις στον χάρακα (κολλητά η μία μετά την άλλη)
    let targetX1 = startX;
    if (id > 0) targetX1 += sidesData[0].px;
    if (id > 1) targetX1 += sidesData[1].px;
    if (id > 2) targetX1 += sidesData[2].px;
    let targetX2 = targetX1 + sidesData[id].px;

    // Υπολογισμός τοπικού factor για το συγκεκριμένο step
    const stepMin = id * 25;
    const stepMax = stepMin + 25;
    
    let localFactor = 0;
    if (progress > stepMax) localFactor = 1;
    else if (progress > stepMin) localFactor = (progress - stepMin) / 25;

    return {
      x1: Math.round(origX1 + (targetX1 - origX1) * localFactor),
      y1: Math.round(origY1 + (groundY - origY1) * localFactor),
      x2: Math.round(origX2 + (targetX2 - origX2) * localFactor),
      y2: Math.round(origY2 + (groundY - origY2) * localFactor),
      active: progress > stepMin
    };
  };

  const s0 = getSideCoords(0);
  const s1 = getSideCoords(1);
  const s2 = getSideCoords(2);
  const s3 = getSideCoords(3);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📏 Περίμετρος Σχημάτων - LearnMaths.gr</title>
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
              📖 Θεωρία: Τι είναι η Περίμετρος;
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Όταν θέλουμε να μετρήσουμε το μέγεθος ενός σχήματος «γύρω-γύρω», βρίσκουμε την <strong>Περίμετρό</strong> του.
            </p>
            
            <div className="bg-blue-50 text-slate-900 p-5 rounded-2xl border border-blue-100 space-y-3 text-sm md:text-base">
              <p className="font-bold text-blue-900">📐 Ο απλός κανόνας της Περιμέτρου:</p>
              <p className="text-slate-700 leading-relaxed font-medium">
                Για να βρούμε την περίμετρο οποιουδήποτε σχήματος, <strong>προσθέτουμε τα μήκη όλων των πλευρών του</strong>, τη μία μετά την άλλη.
              </p>
              <div className="p-3 bg-white rounded-xl border border-blue-200 text-center font-black text-base text-blue-600">
                Περίμετρος = Πλευρά α + Πλευρά β + Πλευρά γ + Πλευρά δ
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Κατέβασε τις Πλευρές
                </h3>
                <p className="text-gray-500 text-sm">
                  Σύρε τον δρομέα για να δεις πώς οι πλευρές τοποθετούνται στη σειρά και προστίθενται.
                </p>
              </div>

              {/* Slider */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                <div className="flex items-center justify-between px-2">
                  <span className="font-bold text-slate-700 text-sm md:text-base">Συναρμολόγηση γραμμής:</span>
                  <span className={`text-3xl font-black tabular-nums ${progress === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {progress}%
                  </span>
                </div>

                <div className="px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={progress} 
                    onChange={(e) => setProgress(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-2">
                    <span>🔷 Κλειστό Σχήμα</span>
                    <span>α ➡️ β ➡️ γ ➡️ δ</span>
                    <span className={progress === 100 ? 'text-emerald-600 font-black' : ''}>📏 Έτοιμο (100%)</span>
                  </div>
                </div>
              </div>

              {/* ΑΘΡΟΙΣΜΑ ΠΛΕΥΡΩΝ */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 w-full text-center ${progress === 100 ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΑΘΡΟΙΣΜΑ ΜΗΚΩΝ:</span>
                <div className={`text-xl md:text-2xl font-black mt-1 ${progress === 100 ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {progress === 100 
                    ? `🏆 Περίμετρος = 6 + 5 + 7 + 4 = ${totalPerimetrosCm} cm` 
                    : `📏 Τρέχον μήκος: ${
                        (progress === 0 ? 0 : 
                         progress <= 25 ? (6 * (progress/25)).toFixed(1) :
                         progress <= 50 ? (6 + 5 * ((progress-25)/25)).toFixed(1) :
                         progress <= 75 ? (11 + 7 * ((progress-50)/25)).toFixed(1) :
                         (18 + 4 * ((progress-75)/25)).toFixed(1))
                      } cm`
                  }
                </div>
                <div className="flex justify-center gap-2 pt-3">
                  {sidesData.map(s => (
                    <span key={s.id} className={`text-xs p-1 px-2.5 rounded-lg font-black text-white ${s.fill}`}>
                      {s.label} = {s.lengthCm} cm
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ - PIXEL-PERFECT ΣΤΑΔΙΑΚΗ ΜΕΤΑΦΟΡΑ (440x260) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <svg 
                viewBox="0 0 440 260" 
                className="w-full h-auto my-auto"
                shapeRendering="geometricPrecision"
              >
                {/* 1. Ο Χάρακας / Έδαφος */}
                <line x1="30" y1={groundY} x2="410" y2={groundY} className="stroke-slate-300 stroke-[2] stroke-dasharray-[3,3]" />
                
                {/* 2. Το σταθερό αχνό background σχήμα για αναφορά */}
                <polygon 
                  points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pΓ.x},${pΓ.y} ${pΔ.x},${pΔ.y}`} 
                  className="fill-none stroke-slate-200 stroke-[3] stroke-dasharray-[2,2]"
                />

                {/* 3. ΟΙ ΔΥΝΑΜΙΚΕΣ ΠΛΕΥΡΕΣ ΠΟΥ ΠΕΦΤΟΥΝ ΜΙΑ-ΜΙΑ ΣΤΗ ΣΕΙΡΑ */}
                {/* Πλευρά α (ΑΒ) */}
                <line x1={s0.x1} y1={s0.y1} x2={s0.x2} y2={s0.y2} className={`${sidesData[0].color} stroke-[5] stroke-linecap-round`} />
                
                {/* Πλευρά β (ΒΓ) */}
                <line x1={s1.x1} y1={s1.y1} x2={s1.x2} y2={s1.y2} className={`${sidesData[1].color} stroke-[5] stroke-linecap-round`} />
                
                {/* Πλευρά γ (ΓΔ) */}
                <line x1={s2.x1} y1={s2.y1} x2={s2.x2} y2={s2.y2} className={`${sidesData[2].color} stroke-[5] stroke-linecap-round`} />
                
                {/* Πλευρά δ (ΔΑ) */}
                <line x1={s3.x1} y1={s3.y1} x2={s3.x2} y2={s3.y2} className={`${sidesData[3].color} stroke-[5] stroke-linecap-round`} />

                {/* Γράμματα και σταθερές ενδείξεις στο αρχικό σχήμα */}
                <g className="text-[10px] font-black fill-slate-400">
                  <text x={pA.x - 10} y={pA.y - 4}>Α</text>
                  <text x={pB.x + 8}  y={pB.y - 4}>Β</text>
                  <text x={pΓ.x + 8}  y={pΓ.y + 4}>Γ</text>
                  <text x={pΔ.x - 12} y={pΔ.y + 4}>Δ</text>
                </g>

                {/* 4. ΣΤΑΔΙΑΚΗ ΕΜΦΑΝΙΣΗ ΔΙΑΓΡΑΜΜΙΣΕΩΝ ΧΑΡΑΚΑ */}
                <g className="fill-slate-400 text-[10px] font-black">
                  {/* Σημείο 0 */}
                  <line x1={startX} y1={groundY} x2={startX} y2={groundY + 6} className="stroke-slate-400 stroke-2" />
                  <text x={startX} y={groundY + 18} textAnchor="middle">0</text>

                  {/* Τέλος α (6 cm) */}
                  {progress >= 25 && (
                    <g className="animate-fade-in">
                      <line x1={startX + 60} y1={groundY} x2={startX + 60} y2={groundY + 6} className="stroke-slate-400" />
                      <text x={startX + 60} y={groundY + 18} textAnchor="middle" className="fill-cyan-600">6</text>
                    </g>
                  )}

                  {/* Τέλος β (11 cm) */}
                  {progress >= 50 && (
                    <g className="animate-fade-in">
                      <line x1={startX + 110} y1={groundY} x2={startX + 110} y2={groundY + 6} className="stroke-slate-400" />
                      <text x={startX + 110} y={groundY + 18} textAnchor="middle" className="fill-indigo-600">11</text>
                    </g>
                  )}

                  {/* Τέλος γ (18 cm) */}
                  {progress >= 75 && (
                    <g className="animate-fade-in">
                      <line x1={startX + 180} y1={groundY} x2={startX + 180} y2={groundY + 6} className="stroke-slate-400" />
                      <text x={startX + 180} y={groundY + 18} textAnchor="middle" className="fill-purple-600">18</text>
                    </g>
                  )}

                  {/* Τελικό Σύνολο δ (22 cm) */}
                  {progress === 100 && (
                    <g className="animate-fade-in">
                      <line x1={startX + totalLengthPx} y1={groundY} x2={startX + totalLengthPx} y2={groundY + 10} className="stroke-emerald-500 stroke-2" />
                      <text x={startX + totalLengthPx} y={groundY + 20} textAnchor="middle" className="fill-emerald-600 font-extrabold text-[11px]">{totalPerimetrosCm} cm</text>
                    </g>
                  )}
                </g>
              </svg>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>{progress === 100 ? '🟢 Όλες οι πλευρές μπήκαν στη σειρά! Αυτή είναι η Περίμετρος.' : '🔍 Δες πώς οι πλευρές κατεβαίνουν μία-μία και ενώνονται.'}</span>
              </div>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Περιμέτρου.</p>
      </footer>
    </div>
  );
}
