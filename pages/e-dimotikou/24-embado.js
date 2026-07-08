// pages/e-dimotikou/24-embado.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function EmbadoPage() {
  // Πλέον ελέγχουμε τον συνολικό αριθμό των τετραγώνων (από 0 έως 24)
  const [squaresFilled, setSquaresFilled] = useState(0);

  // Διαστάσεις του ορθογωνίου σε "εκατοστά"
  const widthCm = 6;
  const heightCm = 4;
  const totalEmbado = widthCm * heightCm; // 24 cm²

  // Διαστάσεις SVG
  const squareSize = 35;
  const startX = 115;
  const startY = 60;

  // Δημιουργία των τετραγώνων για το πλέγμα
  const gridSquares = [];
  let currentIdx = 0;
  for (let r = 0; r < heightCm; r++) {
    for (let c = 0; c < widthCm; c++) {
      gridSquares.push({
        index: currentIdx,
        row: r,
        col: c,
        x: startX + c * squareSize,
        y: startY + r * squareSize,
        // Το τετράγωνο γεμίζει αν ο αύξων αριθμός του είναι μικρότερος από την τιμή του slider
        isFilled: currentIdx < squaresFilled
      });
      currentIdx++;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🟩 Έννοια του Εμβαδού - LearnMaths.gr</title>
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
              📖 Θεωρία: Τι είναι το Εμβαδόν;
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Στο προηγούμενο μάθημα μετρήσαμε το «γύρω-γύρω» ενός σχήματος (Περίμετρος). Τώρα, θα μάθουμε να μετράμε την **εσωτερική του επιφάνεια**.
            </p>
            
            <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-3 text-sm md:text-base">
              <p className="font-bold text-emerald-900">📐 Ο κανόνας του Εμβαδού:</p>
              <p className="text-slate-700 leading-relaxed font-medium">
                <strong>Εμβαδόν</strong> είναι το μέγεθος της επίπεδης επιφάνειας που κλείνεται μέσα σε ένα σχήμα. Για να το μετρήσουμε, χρησιμοποιούμε μικρά <strong>τετραγωνικά εκατοστά (<span className="text-emerald-600">cm²</span>)</strong>.
              </p>
              <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center font-black text-base text-emerald-600">
                Εμβαδόν Ορθογωνίου = Μήκος × Πλάτος
              </div>
              <p className="text-xs font-bold text-emerald-800">
                💡 Σκέψου το απλά: Αν η Περίμετρος είναι ο φράχτης ενός κήπου, το Εμβαδόν είναι το γρασίδι που καλύπτει όλο το έδαφος εσωτερικά!
              </p>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Γέμισε την Επιφάνεια
                </h3>
                <p className="text-gray-500 text-sm">
                  Άλλαξε το slider για να δεις πώς ένα-ένα τα τετραγωνάκια καλύπτουν το εσωτερικό του ορθογωνίου.
                </p>
              </div>

              {/* Slider ελέγχου κουτιών */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                <div className="flex items-center justify-between px-2">
                  <span className="font-bold text-slate-700 text-sm md:text-base">Τετραγωνάκια στο σχήμα:</span>
                  <span className={`text-3xl font-black tabular-nums ${squaresFilled === totalEmbado ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {squaresFilled} / {totalEmbado}
                  </span>
                </div>

                <div className="px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max={totalEmbado} 
                    value={squaresFilled} 
                    onChange={(e) => setSquaresFilled(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-2">
                    <span>⚪ Άδειο (0 cm²)</span>
                    <span>Κουτάκι-κουτάκι</span>
                    <span className={squaresFilled === totalEmbado ? 'text-emerald-600 font-black' : ''}>🟩 Γεμάτο (24 cm²)</span>
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  <button onClick={() => setSquaresFilled(0)} className="p-2 px-4 rounded-xl font-bold text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm">🔄 Καθαρισμός</button>
                  <button onClick={() => setSquaresFilled(totalEmbado)} className="p-2 px-4 rounded-xl font-black text-xs bg-emerald-500 text-white hover:bg-emerald-600 transition shadow-sm">🎯 Γέμισμα Όλων</button>
                </div>
              </div>

              {/* ΜΑΘΗΜΑΤΙΚΗ ΚΑΤΑΜΕΤΡΗΣΗ */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 w-full text-center ${squaresFilled === totalEmbado ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΚΑΤΑΜΕΤΡΗΣΗ ΕΜΒΑΔΟΥ:</span>
                <div className={`text-xl md:text-2xl font-black mt-1 ${squaresFilled === totalEmbado ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {squaresFilled === totalEmbado 
                    ? `🏆 Εμβαδόν = 6 × 4 = ${totalEmbado} cm²` 
                    : `🟩 Έχεις τοποθετήσει: ${squaresFilled} τετραγωνάκια (${squaresFilled} cm²)`
                  }
                </div>
                <p className="text-xs font-bold text-slate-400 mt-2">
                  Κάθε σειρά περιέχει ακριβώς 6 τετραγωνάκια του 1 cm²
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ ΜΕ ΠΛΕΓΜΑ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <svg 
                viewBox="0 0 440 260" 
                className="w-full h-auto my-auto"
                shapeRendering="geometricPrecision"
              >
                {/* 1. Σταθερές Ενδείξεις Μήκους και Πλάτους */}
                <g className="text-[12px] font-black fill-slate-500 text-anchor-middle">
                  <text x={startX + (widthCm * squareSize) / 2} y={startY - 12} className="fill-emerald-600 font-black text-[13px]">Μήκος = 6 cm</text>
                  <text 
                    x={startX - 18} 
                    y={startY + (heightCm * squareSize) / 2 + 4} 
                    className="fill-blue-600 font-black text-[13px]"
                    textAnchor="end"
                  >
                    Πλάτος = 4 cm
                  </text>
                </g>

                {/* 2. Σχεδίαση των 24 τετραγώνων */}
                {gridSquares.map((sq) => (
                  <rect
                    key={sq.index}
                    x={sq.x}
                    y={sq.y}
                    width={squareSize}
                    height={squareSize}
                    className={`transition-all duration-200 stroke-slate-200 stroke-[1.5] ${
                      sq.isFilled 
                        ? 'fill-emerald-500/30 stroke-emerald-500/60' 
                        : 'fill-transparent'
                    }`}
                  />
                ))}

                {/* 3. Υπόμνημα 1 cm² */}
                <g transform="translate(340, 215)">
                  <rect x="0" y="0" width="16" height="16" className="fill-emerald-500/30 stroke-emerald-500 stroke-[1.5]" />
                  <text x="24" y="13" className="text-[10px] font-black fill-slate-400">= 1 cm²</text>
                </g>

                {/* 4. Το εξωτερικό παχύ περίγραμμα */}
                <rect 
                  x={startX} 
                  y={startY} 
                  width={widthCm * squareSize} 
                  height={heightCm * squareSize} 
                  className="fill-none stroke-slate-700 stroke-[3.5] stroke-linejoin-round"
                />

                {/* 5. Δυναμική εσωτερική ετικέτα με το τρέχον εμβαδόν */}
                {squaresFilled > 0 && (
                  <text 
                    x={startX + (widthCm * squareSize) / 2} 
                    y={startY + (heightCm * squareSize) / 2 + 5} 
                    textAnchor="middle"
                    className="fill-emerald-800 font-black text-[16px] bg-white pointer-events-none tracking-wide drop-shadow-sm"
                  >
                    {squaresFilled} cm²
                  </text>
                )}
              </svg>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>{squaresFilled === totalEmbado ? '🟢 Όλη η επιφάνεια καλύφθηκε με 24 τετραγωνάκια!' : '🔍 Σύρε το slider για να μετρήσεις ένα-ένα τα τετραγωνάκια.'}</span>
              </div>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Εμβαδού.</p>
      </footer>
    </div>
  );
}
