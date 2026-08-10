import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function PerimetrosTheoryPage() {
  const [shape, setShape] = useState('triangle'); // 'triangle', 'square', 'rectangle', 'polygon', 'hexagon'
  
  // Διαστάσεις πλευρών (σε cm)
  const [sideA, setSideA] = useState(7);
  const [sideB, setSideB] = useState(5);
  const [sideC, setSideC] = useState(3);
  const [sideD, setSideD] = useState(5);
  const [sideE, setSideE] = useState(6);
  const [sideF, setSideF] = useState(7);

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
  } else if (shape === 'hexagon') {
    perimeter = sideA + sideB + sideC + sideD + sideE + sideF;
    formulaText = `${sideA} + ${sideB} + ${sideC} + ${sideD} + ${sideE} + ${sideF} = ${perimeter} cm`;
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
                  <span>🧮</span> Διαδραστικό Εεργαστήριο Περιμέτρου
                </h2>
                <p className="text-gray-500 text-sm">
                  Επίλεξε σχήμα, άνοιξε τα sliders για να αλλάξεις τις πλευρές και δες τη ζωγραφιά να προσαρμόζεται ζωντανά!
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
                <button
                  onClick={() => setShape('hexagon')}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition ${
                    shape === 'hexagon' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⬢ Εξάγωνο (6)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ */}
              <div className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4">
                
                {/* DISPLAY RESULT BANNER */}
                <div className="bg-amber-500 text-slate-900 px-6 py-2.5 rounded-2xl font-black text-lg shadow-lg flex items-center gap-2">
                  <span>📏 Περίμετρος =</span>
                  <span className="font-mono text-2xl">{perimeter} cm</span>
                </div>

                <div className="w-full max-w-md h-[380px] bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 450 360">
                    
                    {/* 1. ΤΡΙΓΩΝΟ */}
                    {shape === 'triangle' && (() => {
                      let A = sideA;
                      let B = sideB;
                      let C = sideC;

                      if (A + B <= C) C = A + B - 0.5;
                      if (A + C <= B) B = A + C - 0.5;
                      if (B + C <= A) A = B + C - 0.5;

                      const x3 = (C * C + A * A - B * B) / (2 * C);
                      const y3 = Math.sqrt(Math.max(0.1, A * A - x3 * x3));

                      const minX = Math.min(0, x3);
                      const maxX = Math.max(C, x3);
                      const shapeW = maxX - minX;
                      const shapeH = y3;

                      const scale = Math.min(280 / Math.max(shapeW, 1), 220 / Math.max(shapeH, 1));

                      const scC = C * scale;
                      const scX3 = x3 * scale;
                      const scY3 = y3 * scale;

                      const cx = (scC + scX3) / 3;
                      const cy = scY3 / 3;

                      const ox = 225 - cx;
                      const oy = 190 + cy;

                      const p1 = { x: ox, y: oy };
                      const p2 = { x: ox + scC, y: oy };
                      const p3 = { x: ox + scX3, y: oy - scY3 };

                      return (
                        <g>
                          <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="5" strokeLinejoin="round" />
                          
                          <g transform={`translate(${(p1.x + p3.x) / 2 - 25}, ${(p1.y + p3.y) / 2 - 10})`}>
                            <rect x="-5" y="-14" width="70" height="22" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
                            <text x="30" y="2" fill="#fbbf24" fontWeight="black" fontSize="14" textAnchor="middle">a = {sideA} cm</text>
                          </g>

                          <g transform={`translate(${(p2.x + p3.x) / 2 + 25}, ${(p2.y + p3.y) / 2 - 10})`}>
                            <rect x="-35" y="-14" width="70" height="22" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
                            <text x="0" y="2" fill="#fbbf24" fontWeight="black" fontSize="14" textAnchor="middle">b = {sideB} cm</text>
                          </g>

                          <g transform={`translate(${(p1.x + p2.x) / 2}, ${p1.y + 25})`}>
                            <rect x="-35" y="-14" width="70" height="22" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
                            <text x="0" y="2" fill="#fbbf24" fontWeight="black" fontSize="14" textAnchor="middle">c = {sideC} cm</text>
                          </g>
                        </g>
                      );
                    })()}

                    {/* 2. ΤΕΤΡΑΓΩΝΟ - Πλήρως Δυναμική Αλλαγή Μεγέθους */}
                    {shape === 'square' && (() => {
                      // Το μέγεθος σε pixels αλλάζει άμεσα με βάση την τιμή sideA (από 40px έως 260px)
                      const size = Math.min(260, Math.max(40, sideA * 14.5));
                      const x = 225 - size / 2;
                      const y = 180 - size / 2;
                      return (
                        <g>
                          <rect x={x} y={y} width={size} height={size} fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="5" />
                          <g transform={`translate(225, ${y - 15})`}>
                            <rect x="-40" y="-14" width="80" height="22" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
                            <text x="0" y="2" fill="#fbbf24" fontWeight="black" fontSize="14" textAnchor="middle">a = {sideA} cm</text>
                          </g>
                          <g transform={`translate(${x + size + 35}, 180)`}>
                            <rect x="-40" y="-14" width="80" height="22" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
                            <text x="0" y="2" fill="#fbbf24" fontWeight="black" fontSize="14" textAnchor="middle">a = {sideA} cm</text>
                          </g>
                          <g transform={`translate(225, ${y + size + 20})`}>
                            <rect x="-40" y="-14" width="80" height="22" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
                            <text x="0" y="2" fill="#fbbf24" fontWeight="black" fontSize="14" textAnchor="middle">a = {sideA} cm</text>
                          </g>
                          <g transform={`translate(${x - 35}, 180)`}>
                            <rect x="-40" y="-14" width="80" height="22" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
                            <text x="0" y="2" fill="#fbbf24" fontWeight="black" fontSize="14" textAnchor="middle">a = {sideA} cm</text>
                          </g>
                        </g>
                      );
                    })()}

                    {/* 3. ΟΡΘΟΓΩΝΙΟ */}
                    {shape === 'rectangle' && (() => {
                      const maxDim = Math.max(sideA, sideB);
                      const scale = 220 / maxDim;
                      const w = Math.max(60, sideA * scale);
                      const h = Math.max(60, sideB * scale);
                      const x = 225 - w / 2;
                      const y = 180 - h / 2;
                      return (
                        <g>
                          <rect x={x} y={y} width={w} height={h} fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="5" />
                          <g transform={`translate(225, ${y - 15})`}>
                            <rect x="-40" y="-14" width="80" height="22" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
                            <text x="0" y="2" fill="#fbbf24" fontWeight="black" fontSize="14" textAnchor="middle">a = {sideA} cm</text>
                          </g>
                          <g transform={`translate(${x + w + 35}, 180)`}>
                            <rect x="-40" y="-14" width="80" height="22" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
                            <text x="0" y="2" fill="#fbbf24" fontWeight="black" fontSize="14" textAnchor="middle">b = {sideB} cm</text>
                          </g>
                          <g transform={`translate(225, ${y + h + 20})`}>
                            <rect x="-40" y="-14" width="80" height="22" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
                            <text x="0" y="2" fill="#fbbf24" fontWeight="black" fontSize="14" textAnchor="middle">a = {sideA} cm</text>
                          </g>
                          <g transform={`translate(${x - 35}, 180)`}>
                            <rect x="-40" y="-14" width="80" height="22" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1" />
                            <text x="0" y="2" fill="#fbbf24" fontWeight="black" fontSize="14" textAnchor="middle">b = {sideB} cm</text>
                          </g>
                        </g>
                      );
                    })()}

                    {/* 4. ΠΕΝΤΑΓΩΝΟ */}
                    {shape === 'polygon' && (() => {
                      const angles = [-90, -18, 54, 126, 198];
                      const maxS = Math.max(sideA, sideB, sideC, sideD, sideE);
                      const scale = 120 / maxS;
                      const sidesList = [sideA, sideB, sideC, sideD, sideE];
                      
                      const pts = angles.map((a, idx) => {
                        const r = Math.max(45, sidesList[idx] * scale);
                        const rad = (a * Math.PI) / 180;
                        return {
                          x: 225 + r * Math.cos(rad),
                          y: 180 + r * Math.sin(rad)
                        };
                      });

                      const ptsStr = pts.map(p => `${p.x},${p.y}`).join(' ');

                      return (
                        <g>
                          <polygon points={ptsStr} fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="5" strokeLinejoin="round" />
                          <text x="300" y="90" fill="#fbbf24" fontWeight="black" fontSize="13">a = {sideA} cm</text>
                          <text x="320" y="220" fill="#fbbf24" fontWeight="black" fontSize="13">b = {sideB} cm</text>
                          <text x="225" y="315" fill="#fbbf24" fontWeight="black" fontSize="13" textAnchor="middle">c = {sideC} cm</text>
                          <text x="100" y="220" fill="#fbbf24" fontWeight="black" fontSize="13">d = {sideD} cm</text>
                          <text x="110" y="90" fill="#fbbf24" fontWeight="black" fontSize="13">e = {sideE} cm</text>
                        </g>
                      );
                    })()}

                    {/* 5. ΚΥΡΤΟ ΕΞΑΓΩΝΟ */}
                    {shape === 'hexagon' && (() => {
                      const angles = [0, 55, 115, 180, 245, 305];
                      const maxS = Math.max(sideA, sideB, sideC, sideD, sideE, sideF);
                      const scale = 120 / maxS;
                      const sidesList = [sideA, sideB, sideC, sideD, sideE, sideF];
                      
                      const pts = angles.map((a, idx) => {
                        const r = Math.max(45, sidesList[idx] * scale);
                        const rad = (a * Math.PI) / 180;
                        return {
                          x: 225 + r * Math.cos(rad),
                          y: 180 - r * Math.sin(rad)
                        };
                      });

                      const ptsStr = pts.map(p => `${p.x},${p.y}`).join(' ');

                      return (
                        <g>
                          <polygon points={ptsStr} fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="5" strokeLinejoin="round" />
                          <text x="330" y="140" fill="#fbbf24" fontWeight="black" fontSize="12">a = {sideA} cm</text>
                          <text x="280" y="65" fill="#fbbf24" fontWeight="black" fontSize="12">b = {sideB} cm</text>
                          <text x="130" y="65" fill="#fbbf24" fontWeight="black" fontSize="12">c = {sideC} cm</text>
                          <text x="70" y="180" fill="#fbbf24" fontWeight="black" fontSize="12">d = {sideD} cm</text>
                          <text x="130" y="300" fill="#fbbf24" fontWeight="black" fontSize="12">e = {sideE} cm</text>
                          <text x="280" y="300" fill="#fbbf24" fontWeight="black" fontSize="12">f = {sideF} cm</text>
                        </g>
                      );
                    })()}

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
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 space-y-4">
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
                      max="18" 
                      value={sideA} 
                      onChange={(e) => setSideA(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}

                {(shape === 'triangle' || shape === 'rectangle' || shape === 'polygon' || shape === 'hexagon') && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                      <span>Πλευρά a {shape === 'rectangle' ? '(Μήκος)' : ''}:</span>
                      <span className="text-amber-600 font-mono text-base font-black">{sideA} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="18" 
                      value={sideA} 
                      onChange={(e) => setSideA(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}

                {(shape === 'triangle' || shape === 'rectangle' || shape === 'polygon' || shape === 'hexagon') && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                      <span>Πλευρά b {shape === 'rectangle' ? '(Πλάτος)' : ''}:</span>
                      <span className="text-amber-600 font-mono text-base font-black">{sideB} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="18" 
                      value={sideB} 
                      onChange={(e) => setSideB(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}

                {(shape === 'triangle' || shape === 'polygon' || shape === 'hexagon') && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                      <span>Πλευρά c:</span>
                      <span className="text-amber-600 font-mono text-base font-black">{sideC} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="18" 
                      value={sideC} 
                      onChange={(e) => setSideC(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}

                {(shape === 'polygon' || shape === 'hexagon') && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                      <span>Πλευρά d:</span>
                      <span className="text-amber-600 font-mono text-base font-black">{sideD} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="18" 
                      value={sideD} 
                      onChange={(e) => setSideD(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}

                {(shape === 'polygon' || shape === 'hexagon') && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                      <span>Πλευρά e:</span>
                      <span className="text-amber-600 font-mono text-base font-black">{sideE} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="18" 
                      value={sideE} 
                      onChange={(e) => setSideE(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}

                {shape === 'hexagon' && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                      <span>Πλευρά f:</span>
                      <span className="text-amber-600 font-mono text-base font-black">{sideF} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="18" 
                      value={sideF} 
                      onChange={(e) => setSideF(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
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
