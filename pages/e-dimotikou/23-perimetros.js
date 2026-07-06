// pages/e-dimotikou/23-perimetros.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function PerimetrosPage() {
  // Η πρόοδος του "ξετυλίγματος" της περιμέτρου (από 0% έως 100%)
  const [unfoldProgress, setUnfoldProgress] = useState(0);

  // --- ΓΕΩΜΕΤΡΙΚΕΣ ΣΤΑΘΕΡΕΣ ΠΟΛΥΓΩΝΟΥ ---
  // Ορίζουμε 4 σταθερές πλευρές ενός ανώμαλου τετράπλευρου
  const sidesData = [
    { id: 1, label: 'α', lengthCm: 6,  px: 60,  color: 'stroke-cyan-500', fill: 'fill-cyan-500' },
    { id: 2, label: 'β', lengthCm: 5,  px: 50,  color: 'stroke-indigo-500', fill: 'fill-indigo-500' },
    { id: 3, label: 'γ', lengthCm: 7,  px: 70,  color: 'stroke-purple-500', fill: 'fill-purple-500' },
    { id: 4, label: 'δ', lengthCm: 4,  px: 40,  color: 'stroke-amber-500', fill: 'fill-amber-500' }
  ];

  const totalPerimetrosCm = sidesData.reduce((acc, s) => acc + s.lengthCm, 0); // 6 + 5 + 7 + 4 = 22 cm
  const totalLengthPx = sidesData.reduce((acc, s) => acc + s.px, 0); // 220 px

  // Συντεταγμένες των κορυφών του κλειστού σχήματος (στο 0%)
  const p1 = { x: 160, y: 70 };  // Κορυφή Α
  const p2 = { x: 280, y: 70 };  // Κορυφή Β
  const p3 = { x: 250, y: 150 }; // Κορυφή Γ
  const p4 = { x: 130, y: 140 }; // Κορυφή Δ

  // Γραμμή εδάφους όπου θα γίνει η ανάπτυξη (Unfolding)
  const groundY = 210;
  const startX = 110; // Σημείο έναρξης του χάρακα

  const isComplete = unfoldProgress === 100;
  const factor = unfoldProgress / 100;

  // --- ΔΥΝΑΜΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΓΡΑΜΜΩΝ ΠΟΥ ΞΕΤΥΛΙΓΟΝΤΑΙ ---
  // Πλευρά 1 (ΑΒ): Από το σχήμα, πηγαίνει στο [startX, startX + px1]
  const l1 = {
    x1: p1.x + (startX - p1.x) * factor,
    y1: p1.y + (groundY - p1.y) * factor,
    x2: p2.x + ((startX + sidesData[0].px) - p2.x) * factor,
    y2: p2.y + (groundY - p2.y) * factor
  };

  // Πλευρά 2 (ΒΓ): Από το σχήμα, πηγαίνει στο [startX + px1, startX + px1 + px2]
  const l2 = {
    x1: p2.x + ((startX + sidesData[0].px) - p2.x) * factor,
    y1: p2.y + (groundY - p2.y) * factor,
    x2: p3.x + ((startX + sidesData[0].px + sidesData[1].px) - p3.x) * factor,
    y2: p3.y + (groundY - p3.y) * factor
  };

  // Πλευρά 3 (ΓΔ): Από το σχήμα, πηγαίνει στο [startX + px1 + px2, startX + px1 + px2 + px3]
  const l3 = {
    x1: p3.x + ((startX + sidesData[0].px + sidesData[1].px) - p3.x) * factor,
    y1: p3.y + (groundY - p3.y) * factor,
    x2: p4.x + ((startX + sidesData[0].px + sidesData[1].px + sidesData[2].px) - p4.x) * factor,
    y2: p4.y + (groundY - p4.y) * factor
  };

  // Πλευρά 4 (ΔΑ): Από το σχήμα, πηγαίνει στο [startX + px1 + px2 + px3, startX + totalLengthPx]
  const l4 = {
    x1: p4.x + ((startX + sidesData[0].px + sidesData[1].px + sidesData[2].px) - p4.x) * factor,
    y1: p4.y + (groundY - p4.y) * factor,
    x2: p1.x + ((startX + totalLengthPx) - p1.x) * factor,
    y2: p1.y + (groundY - p1.y) * factor
  };

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
                Για να βρούμε την περίμετρο οποιουδήποτε σχήματος με ευθείες πλευρές (πολυγώνου), <strong>προσθέτουμε τα μήκη όλων των πλευρών του</strong>.
              </p>
              <div className="p-3 bg-white rounded-xl border border-blue-200 text-center font-black text-base text-blue-600">
                Περίμετρος = Πλευρά₁ + Πλευρά₂ + Πλευρά₃ + Πλευρά₄ + ...
              </div>
              <p className="text-xs font-bold text-blue-800">
                🏠 Παράδειγμα: Αν θέλουμε να βάλουμε περίφραξη (σταγόνες/συρματόπλεγμα) σε ένα οικόπεδο, το συνολικό μήκος του σύρματος που θα αγοράσουμε είναι ακριβώς η περίμετρος του οικοπέδου!
              </p>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Ξετύλιξε το Σχήμα
                </h3>
                <p className="text-gray-500 text-sm">
                  Σύρε τον δρομέα προς τα δεξιά για να «ανοίξεις» τις πλευρές του πολυγώνου πάνω στον χάρακα.
                </p>
              </div>

              {/* Slider και Στατιστικά Περιμέτρου */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                <div className="flex items-center justify-between px-2">
                  <span className="font-bold text-slate-700 text-sm md:text-base">Πρόοδος Ανάπτυξης:</span>
                  <span className={`text-3xl font-black tabular-nums ${isComplete ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {unfoldProgress}%
                  </span>
                </div>

                <div className="px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={unfoldProgress} 
                    onChange={(e) => setUnfoldProgress(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-2 tracking-wide">
                    <span>🔷 Κλειστό Σχήμα</span>
                    <span className={isComplete ? 'text-emerald-600 font-black' : ''}>📏 Ευθεία Γραμμή (100%)</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button onClick={() => setUnfoldProgress(0)} className="p-2 px-4 rounded-xl font-bold text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm">🔄 Κλείσιμο</button>
                  <button onClick={() => setUnfoldProgress(100)} className={`p-2 px-4 rounded-xl font-black text-xs transition shadow-sm ${isComplete ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>🎯 Πλήρες Άνοιγμα</button>
                </div>
              </div>

              {/* ΑΘΡΟΙΣΜΑ ΠΛΕΥΡΩΝ */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 w-full text-center ${isComplete ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ:</span>
                <div className={`text-xl md:text-2xl font-black mt-1 ${isComplete ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {isComplete 
                    ? `🏆 Περίμετρος = 6 + 5 + 7 + 4 = ${totalPerimetrosCm} cm` 
                    : '📐 Πρόσθεσε τις πλευρές γύρω-γύρω...'
                  }
                </div>
                {/* Αναλυτικά Κουτάκια Πλευρών */}
                <div className="flex justify-center gap-2 pt-3">
                  {sidesData.map(s => (
                    <span key={s.id} className={`text-xs p-1 px-2.5 rounded-lg font-black text-white ${s.fill}`}>
                      {s.label} = {s.lengthCm} cm
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ - PIXEL-PERFECT ΑΝΑΠΤΥΞΗ (440x260) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <svg 
                viewBox="0 0 440 260" 
                className="w-full h-auto my-auto"
                shapeRendering="geometricPrecision"
              >
                {/* 1. Ο Χάρακας / Έδαφος υποδοχής (Εμφανίζεται αχνά) */}
                <line x1="30" y1={groundY} x2="410" y2={groundY} className="stroke-slate-200 stroke-[2] stroke-dasharray-[3,3]" />
                
                {/* 2. Το αχνό εσωτερικό γέμισμα του πολυγώνου που εξαφανίζεται καθώς ανοίγει */}
                {unfoldProgress < 40 && (
                  <polygon 
                    points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`} 
                    className="fill-slate-500/5 transition-opacity duration-300"
                  />
                )}

                {/* 3. ΟΙ ΔΥΝΑΜΙΚΕΣ ΠΛΕΥΡΕΣ ΠΟΥ ΑΝΟΙΓΟΥΝ (Μεγάλο πάχος stroke-[4.5]) */}
                {/* Πλευρά α (ΑΒ) */}
                <line x1={l1.x1} y1={l1.y1} x2={l1.x2} y2={l1.y2} className={`${sidesData[0].color} stroke-[4.5] stroke-linecap-round`} />
                {/* Πλευρά β (ΒΓ) */}
                <line x1={l2.x1} y1={l2.y1} x2={l2.x2} y2={l2.y2} className={`${sidesData[1].color} stroke-[4.5] stroke-linecap-round`} />
                {/* Πλευρά γ (ΓΔ) */}
                <line x1={l3.x1} y1={l3.y1} x2={l3.x2} y2={l3.y2} className={`${sidesData[2].color} stroke-[4.5] stroke-linecap-round`} />
                {/* Πλευρά δ (ΔΑ) */}
                <line x1={l4.x1} y1={l4.y1} x2={l4.x2} y2={l4.y2} className={`${sidesData[3].color} stroke-[4.5] stroke-linecap-round`} />

                {/* 4. ΣΤΑΘΕΡΕΣ ΕΝΔΕΙΞΕΙΣ ΚΑΙ ΓΡΑΜΜΑΤΑ ΚΟΡΥΦΩΝ (Μόνο όταν το σχήμα είναι κλειστό) */}
                {unfoldProgress < 15 && (
                  <g className="text-[11px] font-black fill-slate-700 animate-fade-in">
                    <text x={p1.x - 10} y={p1.y - 4}>Α</text>
                    <text x={p2.x + 8}  y={p2.y - 4}>Β</text>
                    <text x={p3.x + 10} y={p3.y + 4}>Γ</text>
                    <text x={p4.x - 12} y={p4.y + 4}>Δ</text>

                    {/* Μήκη πλευρών δίπλα στα γράμματα */}
                    <text x={(p1.x + p2.x)/2} y={p1.y - 6} className="fill-cyan-600 text-anchor-middle">6 cm</text>
                    <text x={(p2.x + p3.x)/2 + 12} y={(p2.y + p3.y)/2} className="fill-indigo-600">5 cm</text>
                    <text x={(p3.x + p4.x)/2} y={p3.y + 14} className="fill-purple-600 text-anchor-middle">7 cm</text>
                    <text x={(p4.x + p1.x)/2 - 32} y={(p4.y + p1.y)/2} className="fill-amber-600">4 cm</text>
                  </g>
                )}

                {/* 5. ΔΙΑΓΡΑΜΜΙΣΕΙΣ ΧΑΡΑΚΑ (Εμφανίζονται πλήρως στο 100%) */}
                {isComplete && (
                  <g className="fill-slate-400 text-[10px] font-black animate-fade-in">
                    <line x1={startX} y1={groundY} x2={startX} y2={groundY + 8} className="stroke-slate-400 stroke-2" />
                    <text x={startX} y={groundY + 20} textAnchor="middle">0</text>

                    <line x1={startX + sidesData[0].px} y1={groundY} x2={startX + sidesData[0].px} y2={groundY + 8} className="stroke-slate-400" />
                    <text x={startX + sidesData[0].px} y={groundY + 20} textAnchor="middle" className="fill-cyan-600">6</text>

                    <line x1={startX + sidesData[0].px + sidesData[1].px} y1={groundY} x2={startX + sidesData[0].px + sidesData[1].px} y2={groundY + 8} className="stroke-slate-400" />
                    <text x={startX + sidesData[0].px + sidesData[1].px} y={groundY + 20} textAnchor="middle" className="fill-indigo-600">11</text>

                    <line x1={startX + sidesData[0].px + sidesData[1].px + sidesData[2].px} y1={groundY} x2={startX + sidesData[0].px + sidesData[1].px + sidesData[2].px} y2={groundY + 8} className="stroke-slate-400" />
                    <text x={startX + sidesData[0].px + sidesData[1].px + sidesData[2].px} y={groundY + 20} textAnchor="middle" className="fill-purple-600">18</text>

                    <line x1={startX + totalLengthPx} y1={groundY} x2={startX + totalLengthPx} y2={groundY + 10} className="stroke-emerald-500 stroke-2" />
                    <text x={startX + totalLengthPx} y={groundY + 22} textAnchor="middle" className="fill-emerald-600 font-extrabold text-[11px]">{totalPerimetrosCm} cm</text>
                  </g>
                )}
              </svg>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>{isComplete ? '🟢 Οι πλευρές έγιναν μια ευθεία γραμμή! Αυτή είναι η Περίμετρος.' : '🔍 Σύρε το slider για να "ξεπλύνεις" το σύνορο του σχήματος.'}</span>
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
