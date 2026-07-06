// pages/e-dimotikou/25-embado-sximaton.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function EmbadoSximatonPage() {
  // 0: Τετράγωνο, 1: Ορθογώνιο, 2: Τρίγωνο
  const [shapeIndex, setShapeIndex] = useState(1);

  // Σταθερές παραμέτροι πλέγματος (Pixel-Perfect)
  const squareSize = 35;
  const startX = 115;
  const startY = 60;

  // Σταθερές διαστάσεις πλέγματος (6 στήλες x 4 σειρές για το ορθογώνιο / 5x5 για το τετράγωνο)
  const baseCm = shapeIndex === 0 ? 5 : 6;
  const heightCm = shapeIndex === 0 ? 5 : 4;

  const currentWidthPx = baseCm * squareSize;
  const currentHeightPx = heightCm * squareSize;

  // Δεδομένα σχημάτων και περιγραφών
  const getShapeData = () => {
    if (shapeIndex === 0) {
      return { 
        title: 'Τετράγωνο', 
        formula: 'Ε = πλευρά × πλευρά', 
        calc: '5 × 5 = 25 cm²', 
        desc: 'Όλες οι πλευρές του τετράγωνου είναι ίσες (5 cm), οπότε η βάση και το ύψος του συμπίπτουν.' 
      };
    }
    if (shapeIndex === 1) {
      return { 
        title: 'Ορθογώνιο', 
        formula: 'Ε = βάση × ύψος', 
        calc: '6 × 4 = 24 cm²', 
        desc: 'Για να βρούμε πόσα τετραγωνικά εκατοστά χωράνε, πολλαπλασιάζουμε το μήκος της βάσης με το ύψος.' 
      };
    }
    return { 
      title: 'Ορθογώνιο Τρίγωνο', 
      formula: 'Ε = (βάση × ύψος) : 2', 
      calc: '(6 × 4) : 2 = 12 cm²', 
      desc: 'Παρατήρησε τη γραφική αναπαράσταση: Το ορθογώνιο τρίγωνο είναι ακριβώς το μισό ενός ορθογωνίου με τις ίδιες διαστάσεις, γι\' αυτό και διαιρούμε το αποτέλεσμα διά 2!' 
    };
  };

  const currentShape = getShapeData();

  // Υπολογισμός εσωτερικών γραμμών πλέγματος (χωρίς τις εξωτερικές που διπλασιάζουν το stroke)
  const internalVerticals = [];
  for (let i = 1; i < baseCm; i++) {
    internalVerticals.push(startX + i * squareSize);
  }

  const internalHorizontals = [];
  for (let i = 1; i < heightCm; i++) {
    internalHorizontals.push(startY + i * squareSize);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📐 Εμβαδόν Σχημάτων - LearnMaths.gr</title>
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
              📖 Θεωρία: Εμβαδόν Τετραγώνου, Ορθογωνίου & Τριγώνου
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm font-medium">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl space-y-1">
                <p className="font-bold text-blue-900">⏹️ Τετράγωνο</p>
                <p className="font-black text-blue-600 bg-white p-1.5 rounded-lg text-center border">Ε = πλευρά × πλευρά</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl space-y-1">
                <p className="font-bold text-indigo-900">▱ Ορθογώνιο</p>
                <p className="font-black text-indigo-600 bg-white p-1.5 rounded-lg text-center border">Ε = βάση × ύψος</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl space-y-1">
                <p className="font-bold text-emerald-900">🔺 Τρίγωνο</p>
                <p className="font-black text-emerald-600 bg-white p-1.5 rounded-lg text-center border">Ε = (βάση × ύψος) : 2</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΚΕΙΜΕΝΑ ΠΟΥ ΕΠΕΣΤΡΕΨΑΝ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Διάλεξε Σχήμα
                </h3>
              </div>

              {/* Slider */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-5 shadow-inner my-4">
                <div className="flex justify-between items-center font-black text-xs text-slate-500 uppercase tracking-wide px-1">
                  <span className={shapeIndex === 0 ? 'text-blue-600 font-extrabold' : ''}>Τετράγωνο</span>
                  <span className={shapeIndex === 1 ? 'text-indigo-600' : ''}>Ορθογώνιο</span>
                  <span className={shapeIndex === 2 ? 'text-emerald-600' : ''}>Τρίγωνο</span>
                </div>
                <div className="px-2">
                  <input 
                    type="range" min="0" max="2" step="1" value={shapeIndex} 
                    onChange={(e) => setShapeIndex(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              {/* ΕΠΕΞΗΓΗΜΑΤΙΚΟ ΚΕΙΜΕΝΟ (ΠΟΥ ΕΙΧΕ ΧΑΘΕΙ) */}
              <div className="bg-blue-50/40 border border-blue-100 p-5 rounded-2xl text-sm text-gray-600 leading-relaxed my-auto font-medium">
                <span className="font-black text-blue-700 block mb-1">💡 Επεξήγηση Σχήματος:</span>
                {currentShape.desc}
              </div>

              {/* ΠΡΑΞΗ */}
              <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50 w-full space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-slate-500">{currentShape.formula}</span>
                  <span className="text-xl font-black text-slate-800 bg-white px-3 py-1 rounded-xl border shadow-sm tabular-nums">
                    {currentShape.calc}
                  </span>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ - ΜΕ ΣΤΑΘΕΡΟ ΠΛΕΓΜΑ ΓΡΑΜΜΩΝ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <svg 
                viewBox="0 0 440 260" 
                className="w-full h-auto my-auto"
                shapeRendering="geometricPrecision"
              >
                <defs>
                  {/* Clip Path για το Τρίγωνο */}
                  <clipPath id="triangleClip">
                    <polygon points={`${startX},${startY} ${startX},${startY + currentHeightPx} ${startX + currentWidthPx},${startY + currentHeightPx}`} />
                  </clipPath>
                </defs>

                {/* 1. ΧΡΩΜΑΤΙΣΤΟ ΓΕΜΙΣΜΑ */}
                {shapeIndex === 0 && (
                  <rect x={startX} y={startY} width={currentWidthPx} height={currentHeightPx} className="fill-blue-500/10 pointer-events-none" />
                )}
                {shapeIndex === 1 && (
                  <rect x={startX} y={startY} width={currentWidthPx} height={currentHeightPx} className="fill-indigo-500/10 pointer-events-none" />
                )}
                {shapeIndex === 2 && (
                  <rect x={startX} y={startY} width={currentWidthPx} height={currentHeightPx} className="fill-emerald-500/10 pointer-events-none" clipPath="url(#triangleClip)" />
                )}

                {/* 2. ΣΧΕΔΙΑΣΗ ΤΟΥ ΠΛΕΓΜΑΤΟΣ */}
                {/* Το εξωτερικό κουτί γίνεται με rect για να μην χάνει ποτέ το πάχος του στις άκρες */}
                <rect 
                  x={startX} 
                  y={startY} 
                  width={currentWidthPx} 
                  height={currentHeightPx} 
                  className="fill-none stroke-slate-200 stroke-[1.5]"
                />

                {/* Οι εσωτερικές μόνο γραμμές, με το ίδιο ακριβώς stroke */}
                <g className="stroke-slate-200 stroke-[1.5]">
                  {internalVerticals.map((x, idx) => (
                    <line key={`v-${idx}`} x1={x} y1={startY} x2={x} y2={startY + currentHeightPx} />
                  ))}
                  {internalHorizontals.map((y, idx) => (
                    <line key={`h-${idx}`} x1={startX} y1={y} x2={startX + currentWidthPx} y2={y} />
                  ))}
                </g>

                {/* 3. ΤΟ ΕΝΤΟΝΟ ΠΡΑΣΙΝΟ Ή ΜΠΛΕ ΠΕΡΙΓΡΑΜΜΑ ΑΠΟ ΠΑΝΩ */}
                {shapeIndex === 2 ? (
                  <polygon 
                    points={`${startX},${startY} ${startX},${startY + currentHeightPx} ${startX + currentWidthPx},${startY + currentHeightPx}`} 
                    className="fill-none stroke-emerald-600 stroke-[3.5] stroke-linejoin-miter"
                  />
                ) : (
                  <polygon 
                    points={`${startX},${startY} ${startX + currentWidthPx},${startY} ${startX + currentWidthPx},${startY + currentHeightPx} ${startX},${startY + currentHeightPx}`}
                    className={`fill-none stroke-[3.5] stroke-linejoin-miter transition-colors duration-300 ${shapeIndex === 0 ? 'stroke-blue-600' : 'stroke-indigo-600'}`}
                  />
                )}

                {/* 4. ΚΕΙΜΕΝΑ / ΕΝΔΕΙΞΕΙΣ */}
                <g className="text-[12px] font-black fill-slate-500 text-anchor-middle">
                  <text x={startX + currentWidthPx / 2} y={startY + currentHeightPx + 18} className="fill-blue-600">Βάση = {baseCm} cm</text>
                  <text x={startX - 14} y={startY + currentHeightPx / 2 + 4} className="fill-rose-500" textAnchor="end">Ύψος = {heightCm} cm</text>
                </g>
              </svg>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>{shapeIndex === 2 ? '🔺 Το τρίγωνο είναι το μισό ενός ορθογωνίου!' : '🟩 Το εμβαδόν μετράει πόσα τετραγωνάκια cm² χωράνε μέσα.'}</span>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
