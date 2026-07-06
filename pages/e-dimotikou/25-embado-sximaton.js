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

  // Δημιουργία των συντεταγμένων για τις κάθετες γραμμές
  const verticalLines = [];
  for (let i = 0; i <= baseCm; i++) {
    verticalLines.push(startX + i * squareSize);
  }

  // Δημιουργία των συντεταγμένων για τις οριζόντιες γραμμές
  const horizontalLines = [];
  for (let i = 0; i <= heightCm; i++) {
    horizontalLines.push(startY + i * squareSize);
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
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Διάλεξε Σχήμα
                </h3>
              </div>

              {/* Slider */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-5 shadow-inner my-auto">
                <div className="flex justify-between items-center font-black text-xs text-slate-500 uppercase tracking-wide px-1">
                  <span className={shapeIndex === 0 ? 'text-blue-600' : ''}>Τετράγωνο</span>
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

              {/* ΠΡΑΞΗ */}
              <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50 w-full space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-slate-500">{shapeIndex === 0 ? 'Ε = 5 × 5' : shapeIndex === 1 ? 'Ε = 6 × 4' : 'Ε = (6 × 4) : 2'}</span>
                  <span className="text-xl font-black text-slate-800 bg-white px-3 py-1 rounded-xl border shadow-sm tabular-nums">
                    {shapeIndex === 0 ? '25 cm²' : shapeIndex === 1 ? '24 cm²' : '12 cm²'}
                  </span>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ - ΠΡΩΤΑ ΤΟ ΠΛΕΓΜΑ, ΜΕΤΑ ΤΟ ΣΧΗΜΑ */}
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

                {/* ΒΗΜΑ 1: ΣΧΕΔΙΑΣΗ ΟΛΩΝ ΤΩΝ ΓΡΑΜΜΩΝ ΤΟΥ ΠΛΕΓΜΑΤΟΣ (Με το ίδιο ακριβώς πάχος) */}
                <g className="stroke-slate-200 stroke-[1.5]">
                  {/* Όλες οι κάθετες γραμμές */}
                  {verticalLines.map((x, idx) => (
                    <line key={`v-${idx}`} x1={x} y1={startY} x2={x} y2={startY + currentHeightPx} />
                  ))}
                  {/* Όλες οι οριζόντιες γραμμές */}
                  {horizontalLines.map((y, idx) => (
                    <line key={`h-${idx}`} x1={startX} y1={y} x2={startX + currentWidthPx} y2={y} />
                  ))}
                </g>

                {/* ΒΗΜΑ 2: ΤΟ ΠΡΑΣΙΝΟ (Ή ΜΠΛΕ/ΙΝΔΙΓΟ) ΧΡΩΜΑ ΚΑΙ ΤΟ ΠΑΧΥ ΠΕΡΙΓΡΑΜΜΑ ΑΠΟ ΠΑΝΩ */}
                {shapeIndex === 0 && (
                  <g>
                    <rect x={startX} y={startY} width={currentWidthPx} height={currentHeightPx} className="fill-blue-500/10 pointer-events-none" />
                    <polygon points={`${startX},${startY} ${startX + currentWidthPx},${startY} ${startX + currentWidthPx},${startY + currentHeightPx} ${startX},${startY + currentHeightPx}`} className="fill-none stroke-blue-600 stroke-[3.5] stroke-linejoin-miter" />
                  </g>
                )}
                
                {shapeIndex === 1 && (
                  <g>
                    <rect x={startX} y={startY} width={currentWidthPx} height={currentHeightPx} className="fill-indigo-500/10 pointer-events-none" />
                    <polygon points={`${startX},${startY} ${startX + currentWidthPx},${startY} ${startX + currentWidthPx},${startY + currentHeightPx} ${startX},${startY + currentHeightPx}`} className="fill-none stroke-indigo-600 stroke-[3.5] stroke-linejoin-miter" />
                  </g>
                )}

                {shapeIndex === 2 && (
                  <g>
                    {/* Το πράσινο ημιδιαφανές γέμισμα κλιπαρισμένο */}
                    <rect x={startX} y={startY} width={currentWidthPx} height={currentHeightPx} className="fill-emerald-500/10 pointer-events-none" clipPath="url(#triangleClip)" />
                    {/* Το παχύ περίγραμμα του τριγώνου ακριβώς από πάνω */}
                    <polygon 
                      points={`${startX},${startY} ${startX},${startY + currentHeightPx} ${startX + currentWidthPx},${startY + currentHeightPx}`} 
                      className="fill-none stroke-emerald-600 stroke-[3.5] stroke-linejoin-miter"
                    />
                  </g>
                )}

                {/* 3. ΚΕΙΜΕΝΑ / ΕΝΔΕΙΞΕΙΣ */}
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
