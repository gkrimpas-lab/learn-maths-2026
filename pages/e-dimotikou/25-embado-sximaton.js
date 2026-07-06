// pages/e-dimotikou/25-embado-sximaton.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function EmbadoSximatonPage() {
  // 0: Τετράγωνο, 1: Ορθογώνιο, 2: Τρίγωνο
  const [shapeIndex, setShapeIndex] = useState(1);

  // Σταθερές διαστάσεις για το πλέγμα (pixels)
  const squareSize = 35;
  const startX = 115;
  const startY = 60;

  // Καθορισμός διαστάσεων βάσης (β) και ύψους (υ) ανά σχήμα
  const getShapeData = () => {
    if (shapeIndex === 0) {
      return { title: 'Τετράγωνο', b: 5, y: 5, formula: 'Ε = πλευρά × πλευρά', calc: '5 × 5 = 25 cm²', desc: 'Όλες οι πλευρές είναι ίσες (5 cm), οπότε η βάση και το ύψος είναι ίδια.' };
    }
    if (shapeIndex === 1) {
      return { title: 'Ορθογώνιο', b: 6, y: 4, formula: 'Ε = βάση × ύψος', calc: '6 × 4 = 24 cm²', desc: 'Πολλαπλασιάζουμε το μήκος της βάσης με το ύψος του σχήματος.' };
    }
    return { title: 'Ορθογώνιο Τρίγωνο', b: 6, y: 4, formula: 'Ε = (βάση × ύψος) : 2', calc: '(6 × 4) : 2 = 12 cm²', desc: 'Παρατήρησε ότι το τρίγωνο είναι ακριβώς το μισό ενός ορθογωνίου με βάση 6 cm και ύψος 4 cm!' };
  };

  const currentShape = getShapeData();
  const baseCm = currentShape.b;
  const heightCm = currentShape.y;

  // Δημιουργία των τετραγώνων του πλέγματος
  const gridSquares = [];
  for (let r = 0; r < heightCm; r++) {
    for (let c = 0; c < baseCm; c++) {
      gridSquares.push({
        x: startX + c * squareSize,
        y: startY + r * squareSize,
        row: r,
        col: c
      });
    }
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
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Κάθε γεωμετρικό σχήμα έχει τον δικό του τρόπο για να μετράμε την εσωτερική του επιφάνεια (Εμβαδόν).
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm font-medium">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl space-y-1">
                <p className="font-bold text-blue-900">⏹️ Τετράγωνο</p>
                <p className="text-slate-600">Επειδή έχει όλες τις πλευρές ίσες:</p>
                <p className="font-black text-blue-600 bg-white p-1.5 rounded-lg text-center border">Ε = πλευρά × πλευρά</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl space-y-1">
                <p className="font-bold text-indigo-900">▱ Ορθογώνιο</p>
                <p className="text-slate-600">Πολλαπλασιάζουμε τις δύο διαφορετικές πλευρές:</p>
                <p className="font-black text-indigo-600 bg-white p-1.5 rounded-lg text-center border">Ε = βάση × ύψος</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl space-y-1">
                <p className="font-bold text-emerald-900">🔺 Τρίγωνο</p>
                <p className="text-slate-600">Κάθε ορθογώνιο τρίγωνο είναι το <strong>μισό</strong> ενός ορθογωνίου:</p>
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
                <p className="text-gray-500 text-sm">
                  Σύρε τον δρομέα για να αλλάξεις το σχήμα και να δεις πώς υπολογίζεται το εμβαδόν του.
                </p>
              </div>

              {/* Slider Επιλογής Σχήματος */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-5 shadow-inner my-auto">
                <div className="flex justify-between items-center font-black text-xs text-slate-500 uppercase tracking-wide px-1">
                  <span className={shapeIndex === 0 ? 'text-blue-600' : ''}>Τετράγωνο</span>
                  <span className={shapeIndex === 1 ? 'text-indigo-600' : ''}>Ορθογώνιο</span>
                  <span className={shapeIndex === 2 ? 'text-emerald-600' : ''}>Τρίγωνο</span>
                </div>
                
                <div className="px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="1"
                    value={shapeIndex} 
                    onChange={(e) => setShapeIndex(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Quick-Click Buttons */}
                <div className="flex justify-center gap-2 pt-1">
                  <button onClick={() => setShapeIndex(0)} className={`p-2 px-3 rounded-xl font-bold text-xs transition ${shapeIndex === 0 ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'}`}>⏹️ Τετράγωνο</button>
                  <button onClick={() => setShapeIndex(1)} className={`p-2 px-3 rounded-xl font-bold text-xs transition ${shapeIndex === 1 ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-gray-50'}`}>▱ Ορθογώνιο</button>
                  <button onClick={() => setShapeIndex(2)} className={`p-2 px-3 rounded-xl font-bold text-xs transition ${shapeIndex === 2 ? 'bg-emerald-600 text-white' : 'bg-white border hover:bg-gray-50'}`}>🔺 Τρίγωνο</button>
                </div>
              </div>

              {/* ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ */}
              <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50 w-full space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΤΥΠΟΣ & ΠΡΑΞΗ:</span>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-sm font-black text-slate-500">{currentShape.formula}</span>
                  <span className="text-xl font-black text-slate-800 bg-white px-3 py-1 rounded-xl border shadow-sm tabular-nums">{currentShape.calc}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed pt-2 border-t border-gray-200/60">
                  💡 {currentShape.desc}
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ - ΔΙΟΡΘΩΜΕΝΟ ΠΛΕΓΜΑ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <svg 
                viewBox="0 0 440 260" 
                className="w-full h-auto my-auto"
                shapeRendering="geometricPrecision"
              >
                {/* 1. Σταθερές ενδείξεις διαστάσεων έξω από το σχήμα */}
                <g className="text-[12px] font-black fill-slate-500 text-anchor-middle">
                  {/* Βάση (Κάτω) */}
                  <text x={startX + (baseCm * squareSize) / 2} y={startY + (heightCm * squareSize) + 18} className="fill-blue-600">Βάση = {baseCm} cm</text>
                  {/* Ύψος (Αριστερά) */}
                  <text 
                    x={startX - 14} 
                    y={startY + (heightCm * squareSize) / 2 + 4} 
                    className="fill-rose-500"
                    textAnchor="end"
                  >
                    Ύψος = {heightCm} cm
                  </text>
                </g>

                {/* 2. Σχεδίαση των τετραγώνων του πλέγματος */}
                {gridSquares.map((sq, index) => {
                  let fillClass = 'fill-blue-500/10 stroke-blue-500/30';
                  if (shapeIndex === 0) fillClass = 'fill-blue-500/10 stroke-blue-500/30';
                  if (shapeIndex === 1) fillClass = 'fill-indigo-500/10 stroke-indigo-500/30';
                  
                  if (shapeIndex === 2) {
                    // ΔΙΟΡΘΩΣΗ: Σωστή μαθηματική σχέση κύριας διαγωνίου (από πάνω-αριστερά προς κάτω-δεξιά)
                    // Ένα τετράγωνο ανήκει στο κάτω-αριστερά τρίγωνο αν: row * baseCm >= col * heightCm
                    const isLowerLeft = (sq.row * baseCm) >= (sq.col * heightCm);
                    fillClass = isLowerLeft 
                      ? 'fill-emerald-500/20 stroke-emerald-500/40' 
                      : 'fill-transparent stroke-slate-100';
                  }

                  return (
                    <rect
                      key={index}
                      x={sq.x}
                      y={sq.y}
                      width={squareSize}
                      height={squareSize}
                      className={`transition-all duration-300 stroke-[1.5] ${fillClass}`}
                    />
                  );
                })}

                {/* 3. Η σωστή Διαγώνιος Γραμμή και το "Σβησμένο Μισό" */}
                {shapeIndex === 2 && (
                  <g className="animate-fade-in">
                    {/* Έντονο ορθογώνιο τρίγωνο (Κάτω-Αριστερά μισό) */}
                    <polygon 
                      points={`${startX},${startY} ${startX},${startY + heightCm * squareSize} ${startX + baseCm * squareSize},${startY + heightCm * squareSize}`} 
                      className="fill-none stroke-emerald-600 stroke-[4] stroke-linejoin-round"
                    />
                    
                    {/* Η κύρια διαγώνιος τομή από πάνω-αριστερά προς κάτω-δεξιά */}
                    <line 
                      x1={startX} 
                      y1={startY} 
                      x2={startX + baseCm * squareSize} 
                      y2={startY + heightCm * squareSize} 
                      className="stroke-emerald-600 stroke-[2] stroke-dasharray-[1,1]"
                    />

                    {/* Λέξη "ΣΒΗΣΜΕΝΟ ΜΙΣΟ" σωστά τοποθετημένη στο πάνω-δεξιά κομμάτι */}
                    <text 
                      x={startX + (baseCm * squareSize) * 0.7} 
                      y={startY + (heightCm * squareSize) * 0.35} 
                      className="fill-slate-400 text-[10px] font-black uppercase tracking-wider text-anchor-middle"
                    >
                      Σβησμένο Μισό
                    </text>
                  </g>
                )}

                {/* 4. Το εξωτερικό περίγραμμα για το Τετράγωνο και το Ορθογώνιο */}
                {shapeIndex !== 2 && (
                  <rect 
                    x={startX} 
                    y={startY} 
                    width={baseCm * squareSize} 
                    height={heightCm * squareSize} 
                    className={`fill-none stroke-[3.5] stroke-linejoin-round transition-colors duration-300 ${shapeIndex === 0 ? 'stroke-blue-600' : 'stroke-indigo-600'}`}
                  />
                )}
              </svg>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>{shapeIndex === 2 ? '🔺 Δες πώς η διαγώνιος χωρίζει το ορθογώνιο ακριβώς στη μέση!' : '🟩 Το εμβαδόν μετράει πόσα τετραγωνάκια cm² χωράνε μέσα στο σχήμα.'}</span>
              </div>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Εμβαδών.</p>
      </footer>
    </div>
  );
}
