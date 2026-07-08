import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function formatGreekNumber(num) {
  return new Intl.NumberFormat("el-GR").format(num);
}

export default function EnnoiaOgkouPage() {
  // =========================================================================
  // ΡΥΘΜΙΣΕΙΣ ΔΙΑΣΤΑΣΕΩΝ ΚΟΥΤΙΟΥ (Αλλάξτε τις τιμές εδώ για μελλοντικές αλλαγές)
  // Προτίμηση σε διαφορετικά νούμερα για να μην μπερδεύονται οι μαθητές
  // =========================================================================
  const length = 5;  // Μήκος
  const width = 4;   // Πλάτος
  const height = 3;  // Ύψος
  // =========================================================================

  const totalCubes = length * width * height; // Δυναμικός υπολογισμός (π.χ. 5 * 4 * 3 = 60)

  // Δυναμικός Slider από 0 έως το μέγιστο πλήθος κύβων
  const [cubesCount, setCubesCount] = useState(20);

  const isComplete = cubesCount === totalCubes;

  // Γεωμετρικές σταθερές για την ισομετρική στοίχιση
  const size = 26; // Ελαφρώς μικρότερο μέγεθος για να χωράει άνετα το 5x4x3 κουτί
  const startX = 130; 
  const startY = 170; 

  const getIsoCoords = (x, y, z) => {
    const isoX = startX + (x * size * 0.866) - (y * size * 0.866);
    const isoY = startY + (x * size * 0.5) + (y * size * 0.5) - (z * size);
    return { x: isoX, y: isoY };
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📦 Η Έννοια του Όγκου - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white w-full border-b border-gray-100">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            
            <Link href="/e-dimotikou" className="bg-[#f1f1f4] hover:bg-[#e4e4e8] text-[#4a4a52] px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 tracking-wide">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600 stroke-[3] stroke-current">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span className="text-xl">📖</span> Θεωρία: Τι είναι ο Όγκος;
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              <strong>Όγκος</strong> είναι ο χώρος που πιάνει ένα τρισδιάστατο αντικείμενο (όπως ένα κουτί, μια μπάλα ή ένα δωμάτιο). Για να τον μετρήσουμε, κοιτάμε <strong>πόσα ομοιόμορφα κυβάκια</strong> χωράνε ακριβώς στο εσωτερικό του!
            </p>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[540px] w-full gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                    <span>🕹️</span> 1. Γέμισε το Κουτί
                  </h3>
                  
                  {/* Slider */}
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-inner space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-700">Κυβάκια μέσα στο κουτί:</span>
                      <span className={`text-2xl font-mono font-black ${isComplete ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {cubesCount} / {totalCubes}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={totalCubes}
                      step="1"
                      value={cubesCount}
                      onChange={(e) => setCubesCount(parseInt(e.target.value))}
                      className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  <button onClick={() => setCubesCount(0)} className="p-2 px-4 rounded-xl font-bold text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm">🔄 Άδειασμα</button>
                  <button onClick={() => setCubesCount(totalCubes)} className="p-2 px-4 rounded-xl font-black text-xs bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm">🎯 Γέμισμα Όλων</button>
                </div>
              </div>

              {/* ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ - ΔΙΟΡΘΩΜΕΝΟ STRING & ΔΥΝΑΜΙΚΑ ΝΟΥΜΕΡΑ */}
              <div className={`p-5 rounded-2xl border transition-all duration-300 w-full text-center shadow-sm ${isComplete ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΜΑΘΗΜΑΤΙΚΟΣ ΤΥΠΟΣ:</span>
                <div className={`text-lg md:text-xl font-black mt-1 ${isComplete ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {isComplete 
                    ? `🏆 Όγκος = ${length} × ${width} × ${height} = ${totalCubes} κυβικά εκατοστά!` 
                    : `🟩 Έχεις τοποθετήσει: ${cubesCount} κύβους`
                  }
                </div>
                <p className="text-xs font-medium text-slate-400 mt-2 leading-relaxed">
                  Αντί να τους μετράμε έναν-έναν, πολλαπλασιάζουμε τις 3 διαστάσεις:<br />
                  <strong>Μήκος ({length}) × Πλάτος ({width}) × Ύψος ({height})</strong>
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΕΥΘΥΓΡΑΜΜΙΣΜΕΝΟ SVG ΚΟΥΤΙ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[540px] w-full relative overflow-hidden">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block text-center">
                Τρισδιάστατη Αναπαράσταση Στερεού
              </span>

              <div className="text-xs font-bold text-blue-600 mb-4 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full font-mono">
                {length} × {width} × {height} κουτί
              </div>

              {/* Καμβάς */}
              <div className="relative bg-slate-50/40 p-4 rounded-2xl border border-slate-100 shadow-inner flex items-center justify-center w-full max-w-[360px] h-[320px]">
                <svg width="340" height="300" viewBox="-40 -20 380 300" className="overflow-visible" shapeRendering="geometricPrecision">
                  
                  {/* Σχέδιαση των κύβων */}
                  {[...Array(totalCubes)].map((_, i) => {
                    const z = Math.floor(i / (length * width)); 
                    const rem = i % (length * width);
                    const y = Math.floor(rem / length); 
                    const x = rem % length; 

                    const pt = getIsoCoords(x, y, z);
                    const isActive = i < cubesCount;

                    return (
                      <g key={i} className="transition-all duration-300" opacity={isActive ? 1 : 0.04}>
                        {/* Πάνω Έδρα (Top) */}
                        <path
                          d={`M ${pt.x} ${pt.y} L ${pt.x + size * 0.866} ${pt.y + size * 0.5} L ${pt.x} ${pt.y + size} L ${pt.x - size * 0.866} ${pt.y + size * 0.5} Z`}
                          fill="#60a5fa"
                          stroke="#2563eb"
                          strokeWidth="0.75"
                        />
                        {/* Αριστερή Έδρα (Left) */}
                        <path
                          d={`M ${pt.x - size * 0.866} ${pt.y + size * 0.5} L ${pt.x} ${pt.y + size} L ${pt.x} ${pt.y + size + size} L ${pt.x - size * 0.866} ${pt.y + size * 0.5 + size} Z`}
                          fill="#1d4ed8"
                          stroke="#1e40af"
                          strokeWidth="0.75"
                        />
                        {/* Δεξιά Έδρα (Right) */}
                        <path
                          d={`M ${pt.x} ${pt.y + size} L ${pt.x + size * 0.866} ${pt.y + size * 0.5} L ${pt.x + size * 0.866} ${pt.y + size * 0.5 + size} L ${pt.x} ${pt.y + size + size} Z`}
                          fill="#3b82f6"
                          stroke="#1d4ed8"
                          strokeWidth="0.75"
                        />
                        
                        {/* Μικρή ένδειξη 1 cm³ στον πρώτο κύβο */}
                        {i === 0 && isActive && (
                          <text x={pt.x - 10} y={pt.y + 22} fill="#ffffff" fontSize="7" fontWeight="bold" className="font-sans pointer-events-none">1 cm³</text>
                        )}
                      </g>
                    );
                  })}

                  {/* ΔΙΑΦΑΝΕΣ ΕΞΩΤΕΡΙΚΟ ΠΛΑΙΣΙΟ */}
                  {(() => {
                    const p000 = getIsoCoords(0, 0, 0);
                    const pMax00 = getIsoCoords(length, 0, 0);
                    const p0Max0 = getIsoCoords(0, width, 0);
                    const pMaxMax0 = getIsoCoords(length, width, 0);
                    const p00Max = getIsoCoords(0, 0, height);
                    const pMax0Max = getIsoCoords(length, 0, height);
                    const p0MaxMax = getIsoCoords(0, width, height);
                    const pMaxMaxMax = getIsoCoords(length, width, height);

                    return (
                      <g fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" className="pointer-events-none">
                        {/* Βάση κουτιού */}
                        <path d={`M ${p000.x} ${p000.y + size} L ${pMax00.x} ${pMax00.y + size} L ${pMaxMax0.x} ${pMaxMax0.y + size} L ${p0Max0.x} ${p0Max0.y + size} Z`} />
                        {/* Οροφή κουτιού */}
                        <path d={`M ${p00Max.x} ${p00Max.y + size} L ${pMax0Max.x} ${pMax0Max.y + size} L ${pMaxMaxMax.x} ${pMaxMaxMax.y + size} L ${p0MaxMax.x} ${p0MaxMax.y + size} Z`} fill="rgba(148,163,184,0.02)" />
                        {/* Κατακόρυφες ακμές */}
                        <line x1={p000.x} y1={p000.y + size} x2={p00Max.x} y2={p00Max.y + size} />
                        <line x1={pMax00.x} y1={pMax00.y + size} x2={pMax0Max.x} y2={pMax0Max.y + size} />
                        <line x1={p0Max0.x} y1={p0Max0.y + size} x2={p0MaxMax.x} y2={p0MaxMax.y + size} />
                        <line x1={pMaxMax0.x} y1={pMaxMax0.y + size} x2={pMaxMaxMax.x} y2={pMaxMaxMax.y + size} />
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Ετικέτες Διαστάσεων */}
              <div className="w-full flex justify-center gap-5 text-xs font-black text-slate-400 mt-6 pt-4 border-t border-gray-50 text-center">
                <span className="text-blue-600">↔️ Μήκος: {length} cm</span>
                <span className="text-indigo-600">↗️ Πλάτος: {width} cm</span>
                <span className="text-sky-500">⬆️ Ύψος: {height} cm</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Όγκου.</p>
      </footer>
    </div>
  );
}
