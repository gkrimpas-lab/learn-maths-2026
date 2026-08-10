import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function PerimetrosTheoryPage() {
  const [shape, setShape] = useState('triangle'); // 'triangle', 'square', 'rectangle', 'polygon'
  
  // Διαστάσεις πλευρών (σε cm)
  const [sideA, setSideA] = useState(6);
  const [sideB, setSideB] = useState(8);
  const [sideC, setSideC] = useState(7);
  const [sideD, setSideD] = useState(5);
  const [sideE, setSideE] = useState(6);

  // Υπολογισμός περιμέτρου & βήμα-βήμα πράξης
  let perimeter = 0;
  let formulaText = '';

  if (shape === 'triangle') {
    perimeter = sideA + sideB + sideC;
    formulaText = `${sideA} + ${sideB} + ${sideC} = ${perimeter} cm`;
  } else if (shape === 'square') {
    perimeter = 4 * sideA;
    formulaText = `4 × ${sideA} = ${sideA} + ${sideA} + ${sideA} + ${sideA} = ${perimeter} cm`;
  } else if (shape === 'rectangle') {
    perimeter = 2 * sideA + 2 * sideB;
    formulaText = `(2 × ${sideA}) + (2 × ${sideB}) = ${sideA} + ${sideB} + ${sideA} + ${sideB} = ${perimeter} cm`;
  } else if (shape === 'polygon') {
    perimeter = sideA + sideB + sideC + sideD + sideE;
    formulaText = `${sideA} + ${sideB} + ${sideC} + ${sideD} + ${sideE} = ${perimeter} cm`;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📏 Υπολογισμός Περιμέτρου - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/d-dimotikou/17-perimetros-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
                <span>📝</span> Ασκήσεις
              </Link>
              <Link href="/d-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
                🔙 Επιστροφή
              </Link>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10 space-y-8`}>
          
          {/* HEADER & EXERCISES PROMO CARD */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 17
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  📏 Υπολογισμός Περιμέτρου Σχημάτων
                </h1>
                <p className="text-amber-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε τι είναι **περίμετρος** (το γύρω-γύρω ενός σχήματος) και πώς την υπολογίζουμε προσθέτοντας όλες τις πλευρές του!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-amber-100">Δοκίμασε τις ασκήσεις στην περίμετρο για να σιγουρευτείς ότι την έμαθες!</p>
                <Link 
                  href="/d-dimotikou/17-perimetros-ask"
                  className="inline-block w-full bg-slate-900 hover:bg-black text-white font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* ΘΕΩΡΙΑ - SECTION 1 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <div className="border-b pb-4 border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span>📖</span> Αναλυτική Θεωρία & Κανόνες
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Ορισμός */}
              <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-100 space-y-3">
                <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                  <span>🏃</span> Τι είναι η Περίμετρος;
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  <strong>Περίμετρος</strong> είναι το συνολικό μήκος του περιγράμματος (του «σύνορου») ενός επίπεδου σχήματος.
                </p>
              </div>

              {/* 2. Ο Κανόνας */}
              <div className="bg-orange-50/70 p-6 rounded-2xl border border-orange-100 space-y-3">
                <h3 className="text-lg font-bold text-orange-900 flex items-center gap-2">
                  <span>➕</span> Ο Βασικός Κανόνας
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Για να βρούμε την περίμετρο οποιουδήποτε σχήματος, <strong>προσθέτουμε τα μήκη όλων των πλευρών του</strong>!
                </p>
              </div>

              {/* 3. Σύντομοι Τύποι */}
              <div className="bg-rose-50/70 p-6 rounded-2xl border border-rose-100 space-y-3">
                <h3 className="text-lg font-bold text-rose-900 flex items-center gap-2">
                  <span>⚡</span> Γρήγοροι Τύποι
                </h3>
                <ul className="text-xs text-gray-700 space-y-1 font-medium">
                  <li>• <strong>Τετράγωνο:</strong> 4 × πλευρά</li>
                  <li>• <strong>Ορθογώνιο:</strong> (2 × μήκος) + (2 × πλάτος)</li>
                </ul>
              </div>

            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικό Εργαστήριο Περιμέτρου
                </h2>
                <p className="text-gray-500 text-sm">
                  Επίλεξε σχήμα, άνοιξε τα sliders για να αλλάξεις τις πλευρές και δες τον υπολογισμό της περιμέτρου!
                </p>
              </div>

              {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ ΣΧΗΜΑΤΟΣ */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShape('triangle')}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition ${
                    shape === 'triangle' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ▲ Τρίγωνο
                </button>
                <button
                  onClick={() => setShape('square')}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition ${
                    shape === 'square' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ❏ Τετράγωνο
                </button>
                <button
                  onClick={() => setShape('rectangle')}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition ${
                    shape === 'rectangle' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ▭ Ορθογώνιο
                </button>
                <button
                  onClick={() => setShape('polygon')}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition ${
                    shape === 'polygon' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⬟ Πεντάγωνο
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ (SVG) */}
              <div className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4">
                
                {/* DISPLAY RESULT BANNER */}
                <div className="bg-amber-500 text-slate-900 px-6 py-2.5 rounded-2xl font-black text-lg shadow-lg flex items-center gap-2">
                  <span>📏 Περίμετρος =</span>
                  <span className="font-mono text-2xl">{perimeter} cm</span>
                </div>

                <div className="w-full max-w-[320px] h-[300px] bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 300 300">
                    
                    {/* 1. ΤΡΙΓΩΝΟ */}
                    {shape === 'triangle' && (
                      <g>
                        <polygon points="150,50 50,220 250,220" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="4" strokeLinejoin="round" />
                        <text x="90" y="130" fill="#fbbf24" fontWeight="bold" fontSize="14" textAnchor="end">a = {sideA} cm</text>
                        <text x="210" y="130" fill="#fbbf24" fontWeight="bold" fontSize="14" textAnchor="start">b = {sideB} cm</text>
                        <text x="150" y="245" fill="#fbbf24" fontWeight="bold" fontSize="14" textAnchor="middle">c = {sideC} cm</text>
                      </g>
                    )}

                    {/* 2. ΤΕΤΡΑΓΩΝΟ */}
                    {shape === 'square' && (
                      <g>
                        <rect x="75" y="75" width="150" height="150" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="4" />
                        <text x="150" y="60" fill="#fbbf24" fontWeight="bold" fontSize="14" textAnchor="middle">a = {sideA} cm</text>
                        <text x="240" y="155" fill="#fbbf24" fontWeight="bold" fontSize="14" textAnchor="start">a = {sideA} cm</text>
                        <text x="150" y="250" fill="#fbbf24" fontWeight="bold" fontSize="14" textAnchor="middle">a = {sideA} cm</text>
                        <text x="60" y="155" fill="#fbbf24" fontWeight="bold" fontSize="14" textAnchor="end">a = {sideA} cm</text>
                      </g>
                    )}

                    {/* 3. ΟΡΘΟΓΩΝΙΟ */}
                    {shape === 'rectangle' && (
                      <g>
                        <rect x="40" y="90" width="220" height="120" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="4" />
                        <text x="150" y="75" fill="#fbbf24" fontWeight="bold" fontSize="14" textAnchor="middle">Μήκος (a) = {sideA} cm</text>
                        <text x="270" y="155" fill="#fbbf24" fontWeight="bold" fontSize="14" textAnchor="start">b = {sideB} cm</text>
                        <text x="150" y="235" fill="#fbbf24" fontWeight="bold" fontSize="14" textAnchor="middle">Μήκος (a) = {sideA} cm</text>
                        <text x="30" y="155" fill="#fbbf24" fontWeight="bold" fontSize="14" textAnchor="end">b = {sideB} cm</text>
                      </g>
                    )}

                    {/* 4. ΠΕΝΤΑΓΩΝΟ */}
                    {shape === 'polygon' && (
                      <g>
                        <polygon points="150,40 250,110 210,230 90,230 50,110" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="4" strokeLinejoin="round" />
                        <text x="210" y="70" fill="#fbbf24" fontWeight="bold" fontSize="12">a = {sideA} cm</text>
                        <text x="240" y="180" fill="#fbbf24" fontWeight="bold" fontSize="12">b = {sideB} cm</text>
                        <text x="150" y="250" fill="#fbbf24" fontWeight="bold" fontSize="12" textAnchor="middle">c = {sideC} cm</text>
                        <text x="60" y="180" fill="#fbbf24" fontWeight="bold" fontSize="12">d = {sideD} cm</text>
                        <text x="90" y="70" fill="#fbbf24" fontWeight="bold" fontSize="12">e = {sideE} cm</text>
                      </g>
                    )}

                  </svg>
                </div>

                {/* FORMULA DISPLAY */}
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center w-full">
                  <span className="text-xs uppercase font-black tracking-wider block text-slate-400 mb-1">
                    Αναλυτικός Υπολογισμός:
                  </span>
                  <div className="font-mono font-black text-lg md:text-xl text-amber-400 break-words">
                    {formulaText}
                  </div>
                </div>

              </div>

              {/* SLIDERS ΧΕΙΡΙΣΜΟΥ */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 space-y-5">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span>🎛️</span> Αλλαγή Μηκών Πλευρών
                </h3>

                {/* SLIDERS ΑΝΑΛΟΓΑ ΜΕ ΤΟ ΣΧΗΜΑ */}
                {shape === 'square' && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                      <span>Πλευρά (a):</span>
                      <span className="text-amber-600 font-mono text-base font-black">{sideA} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="20" 
                      value={sideA} 
                      onChange={(e) => setSideA(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}

                {(shape === 'triangle' || shape === 'rectangle' || shape === 'polygon') && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                      <span>Πλευρά a {shape === 'rectangle' ? '(Μήκος)' : ''}:</span>
                      <span className="text-amber-600 font-mono text-base font-black">{sideA} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="20" 
                      value={sideA} 
                      onChange={(e) => setSideA(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}

                {(shape === 'triangle' || shape === 'rectangle' || shape === 'polygon') && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                      <span>Πλευρά b {shape === 'rectangle' ? '(Πλάτος)' : ''}:</span>
                      <span className="text-amber-600 font-mono text-base font-black">{sideB} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="20" 
                      value={sideB} 
                      onChange={(e) => setSideB(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}

                {(shape === 'triangle' || shape === 'polygon') && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                      <span>Πλευρά c:</span>
                      <span className="text-amber-600 font-mono text-base font-black">{sideC} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="20" 
                      value={sideC} 
                      onChange={(e) => setSideC(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}

                {shape === 'polygon' && (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                        <span>Πλευρά d:</span>
                        <span className="text-amber-600 font-mono text-base font-black">{sideD} cm</span>
                      </div>
                      <input 
                        type="range" 
                        min="2" 
                        max="20" 
                        value={sideD} 
                        onChange={(e) => setSideD(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                        <span>Πλευρά e:</span>
                        <span className="text-amber-600 font-mono text-base font-black">{sideE} cm</span>
                      </div>
                      <input 
                        type="range" 
                        min="2" 
                        max="20" 
                        value={sideE} 
                        onChange={(e) => setSideE(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </>
                )}

              </div>

            </div>

          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες να υπολογίζεις την περίμετρο σχημάτων; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/17-perimetros-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη Δ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
