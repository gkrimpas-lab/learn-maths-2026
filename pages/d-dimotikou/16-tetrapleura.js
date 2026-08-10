import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Βοηθητική συνάρτηση υπολογισμού κεντραρισμένων κορυφών τετραπλεύρου
function getCenteredQuad(baseWidth, sideLength, angleDeg, centerX = 150, centerY = 150) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = sideLength * Math.cos(rad);
  const dy = sideLength * Math.sin(rad);

  // Κέντρο βάρους του παραλληλογράμμου
  const cx = (baseWidth + dx) / 2;
  const cy = dy / 2;

  // Μετατόπιση ώστε το κέντρο να πάει στο (centerX, centerY)
  const offsetX = centerX - cx;
  const offsetY = centerY + cy; // Στο SVG το Y αυξάνεται προς τα κάτω

  const p1 = { x: offsetX, y: offsetY };
  const p2 = { x: offsetX + baseWidth, y: offsetY };
  const p3 = { x: offsetX + baseWidth + dx, y: offsetY - dy };
  const p4 = { x: offsetX + dx, y: offsetY - dy };

  return { p1, p2, p3, p4, dx, dy };
}

export default function TetrapleuraTheoryPage() {
  // Κατάσταση διαδραστικού σχήματος
  const [baseWidth, setBaseWidth] = useState(130);
  const [sideLength, setSideLength] = useState(130);
  const [angleDeg, setAngleDeg] = useState(60);

  // Αυτόματος προσδιορισμός είδους σχήματος
  const isRightAngle = angleDeg === 90;
  const areSidesEqual = Math.abs(baseWidth - sideLength) < 5;

  let shapeType = '';
  let shapeIcon = '';
  let shapeBadgeColor = '';
  let shapeDesc = '';

  if (isRightAngle && areSidesEqual) {
    shapeType = 'Τετράγωνο';
    shapeIcon = '❏';
    shapeBadgeColor = 'bg-indigo-600 text-white';
    shapeDesc = 'Όλες οι πλευρές είναι ίσες και όλες οι γωνίες είναι ορθές (90°)!';
  } else if (isRightAngle && !areSidesEqual) {
    shapeType = 'Ορθογώνιο Παραλληλόγραμμο';
    shapeIcon = '▭';
    shapeBadgeColor = 'bg-blue-600 text-white';
    shapeDesc = 'Οι απέναντι πλευρές είναι ίσες και όλες οι γωνίες είναι ορθές (90°)!';
  } else if (!isRightAngle && areSidesEqual) {
    shapeType = 'Ρόμβος';
    shapeIcon = '◇';
    shapeBadgeColor = 'bg-purple-600 text-white';
    shapeDesc = 'Όλες οι 4 πλευρές είναι ίσες, αλλά οι γωνίες του είναι πλάγιες (όχι 90°)!';
  } else {
    shapeType = 'Πλάγιο Παραλληλόγραμμο';
    shapeIcon = '▱';
    shapeBadgeColor = 'bg-teal-600 text-white';
    shapeDesc = 'Οι απέναντι πλευρές είναι ίσες & παράλληλες, αλλά οι γωνίες δεν είναι ορθές!';
  }

  // Υπολογισμός σημείων για το SVG
  const { p1, p2, p3, p4 } = getCenteredQuad(baseWidth, sideLength, angleDeg, 150, 150);
  const pointsString = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`;

  // Προεπιλογές για γρήγορο κλικάρισμα
  const setPreset = (type) => {
    if (type === 'square') {
      setBaseWidth(130);
      setSideLength(130);
      setAngleDeg(90);
    } else if (type === 'rectangle') {
      setBaseWidth(170);
      setSideLength(100);
      setAngleDeg(90);
    } else if (type === 'rhombus') {
      setBaseWidth(130);
      setSideLength(130);
      setAngleDeg(60);
    } else if (type === 'parallelogram') {
      setBaseWidth(170);
      setSideLength(110);
      setAngleDeg(65);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔷 Τα Τετράπλευρα & οι Ιδιότητές τους - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/16-tetrapleura-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 16
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  🔷 Ομοιότητες & Διαφορές Τετραπλεύρων
                </h1>
                <p className="text-blue-100 text-base lg:text-lg leading-relaxed">
                  Συγκρίνουμε το **ορθογώνιο**, το **τετράγωνο**, τον **ρόμβο** και το **πλάγιο παραλληλόγραμμο** αλλάζοντας τις πλευρές και τις γωνίες τους!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-blue-100">Δοκίμασε τις ασκήσεις στα τετράπλευρα για να σιγουρευτείς ότι έμαθες τις ιδιότητές τους!</p>
                <Link 
                  href="/d-dimotikou/16-tetrapleura-ask"
                  className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
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
                <span>📖</span> Αναλυτική Θεωρία & Χαρακτηριστικά
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* 1. Ορθογώνιο */}
              <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-blue-900">Ορθογώνιο</h3>
                  <span className="text-2xl">▭</span>
                </div>
                <ul className="text-xs text-gray-700 space-y-1.5 font-medium">
                  <li>• Απέναντι πλευρές <strong>ίσες & παράλληλες</strong></li>
                  <li>• <strong>4 ορθές γωνίες (90°)</strong></li>
                </ul>
              </div>

              {/* 2. Τετράγωνο */}
              <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-indigo-900">Τετράγωνο</h3>
                  <span className="text-2xl">❏</span>
                </div>
                <ul className="text-xs text-gray-700 space-y-1.5 font-medium">
                  <li>• <strong>Όλες οι 4 πλευρές ίσες</strong></li>
                  <li>• <strong>4 ορθές γωνίες (90°)</strong></li>
                </ul>
              </div>

              {/* 3. Ρόμβος */}
              <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-purple-900">Ρόμβος</h3>
                  <span className="text-2xl">◇</span>
                </div>
                <ul className="text-xs text-gray-700 space-y-1.5 font-medium">
                  <li>• <strong>Όλες οι 4 πλευρές ίσες</strong></li>
                  <li>• Απέναντι γωνίες ίσες (όχι ορθές)</li>
                </ul>
              </div>

              {/* 4. Πλάγιο Παραλληλόγραμμο */}
              <div className="bg-teal-50/70 p-5 rounded-2xl border border-teal-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-teal-900">Πλάγιο Παραλλ.</h3>
                  <span className="text-2xl">▱</span>
                </div>
                <ul className="text-xs text-gray-700 space-y-1.5 font-medium">
                  <li>• Απέναντι πλευρές <strong>ίσες & παράλληλες</strong></li>
                  <li>• Απέναντι γωνίες ίσες (όχι ορθές)</li>
                </ul>
              </div>

            </div>

            {/* ΠΙΝΑΚΑΣ ΣΥΓΚΡΙΣΗΣ ΙΔΙΟΤΗΤΩΝ */}
            <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-4">
              <h3 className="text-lg font-extrabold text-amber-400">
                📊 Συγκριτικός Πίνακας Ιδιοτήτων
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm font-bold border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 uppercase">
                      <th className="py-3 px-2">Σχήμα</th>
                      <th className="py-3 px-2 text-center">Απέναντι πλευρές παράλληλες</th>
                      <th className="py-3 px-2 text-center">Όλες οι πλευρές ίσες (4)</th>
                      <th className="py-3 px-2 text-center">4 Ορθές Γωνίες (90°)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="py-3 px-2 text-blue-400 flex items-center gap-2"><span>▭</span> Ορθογώνιο</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι</td>
                      <td className="py-3 px-2 text-center text-rose-400">❌ Όχι (μόνο απέναντι)</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι (4)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="py-3 px-2 text-indigo-400 flex items-center gap-2"><span>❏</span> Τετράγωνο</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι (4)</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι (4)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="py-3 px-2 text-purple-400 flex items-center gap-2"><span>◇</span> Ρόμβος</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι (4)</td>
                      <td className="py-3 px-2 text-center text-rose-400">❌ Όχι</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="py-3 px-2 text-teal-400 flex items-center gap-2"><span>▱</span> Πλάγιο Παραλληλόγραμμο</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι</td>
                      <td className="py-3 px-2 text-center text-rose-400">❌ Όχι (μόνο απέναντι)</td>
                      <td className="py-3 px-2 text-center text-rose-400">❌ Όχι</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικό Εργαστήριο Αναγνώρισης Σχήματος
                </h2>
                <p className="text-gray-500 text-sm">
                  Άλλαξε τις πλευρές και τις γωνίες και δες τον αυτόματο υπολογιστή να αναγνωρίζει το σχήμα!
                </p>
              </div>

              {/* PRESET BUTTONS */}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setPreset('square')} className="px-3 py-2 rounded-xl text-xs font-black bg-indigo-100 hover:bg-indigo-200 text-indigo-900 transition">
                  ❏ Τετράγωνο
                </button>
                <button onClick={() => setPreset('rectangle')} className="px-3 py-2 rounded-xl text-xs font-black bg-blue-100 hover:bg-blue-200 text-blue-900 transition">
                  ▭ Ορθογώνιο
                </button>
                <button onClick={() => setPreset('rhombus')} className="px-3 py-2 rounded-xl text-xs font-black bg-purple-100 hover:bg-purple-200 text-purple-900 transition">
                  ◇ Ρόμβος
                </button>
                <button onClick={() => setPreset('parallelogram')} className="px-3 py-2 rounded-xl text-xs font-black bg-teal-100 hover:bg-teal-200 text-teal-900 transition">
                  ▱ Πλάγιο Παραλλ.
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ (SVG - ΑΠΟΛΥΤΑ ΚΕΝΤΡΑΡΙΣΜΕΝΟ) */}
              <div className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4">
                
                {/* DYNAMIC SHAPE BADGE */}
                <div className={`px-5 py-2.5 rounded-2xl font-black text-base shadow-lg flex items-center gap-2 transition-all ${shapeBadgeColor}`}>
                  <span className="text-2xl">{shapeIcon}</span>
                  <span>{shapeType}</span>
                </div>

                <div className="w-full max-w-[320px] h-[320px] bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 300 300">
                    
                    {/* Τετράπλευρο Polygon */}
                    <polygon 
                      points={pointsString} 
                      fill="#818cf8" 
                      fillOpacity="0.2" 
                      stroke="#818cf8" 
                      strokeWidth="4" 
                      strokeLinejoin="round" 
                    />

                    {/* Ορθές γωνίες (αν είναι 90 μοίρες) */}
                    {isRightAngle && (
                      <g>
                        <rect x={p1.x} y={p1.y - 15} width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                        <rect x={p2.x - 15} y={p2.y - 15} width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                        <rect x={p3.x - 15} y={p3.y} width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                        <rect x={p4.x} y={p4.y} width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                      </g>
                    )}

                    {/* Ετικέτες Πλευρών */}
                    <text x={(p1.x + p2.x) / 2} y={p1.y + 20} fill="#a5b4fc" fontWeight="bold" fontSize="12" textAnchor="middle">
                      {baseWidth} px
                    </text>
                    <text x={(p1.x + p4.x) / 2 - 15} y={(p1.y + p4.y) / 2} fill="#a5b4fc" fontWeight="bold" fontSize="12" textAnchor="end">
                      {sideLength} px
                    </text>

                  </svg>
                </div>

                <p className="text-center text-xs font-bold text-slate-300 max-w-xs leading-relaxed">
                  {shapeDesc}
                </p>
              </div>

              {/* SLIDERS ΧΕΙΡΙΣΜΟΥ */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 space-y-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span>🎛️</span> Ρύθμιση Πλευρών & Γωνιών
                </h3>

                {/* 1. Γωνία Κλίσης */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                    <span>Γωνία Κλίσης:</span>
                    <span className="text-indigo-600 font-mono text-base font-black">{angleDeg}° {isRightAngle ? '(Ορθή 90°)' : ''}</span>
                  </div>
                  <input 
                    type="range" 
                    min="30" 
                    max="90" 
                    value={angleDeg} 
                    onChange={(e) => setAngleDeg(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* 2. Μήκος Βάσης */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                    <span>Μήκος Βάσης (Οριζόντια):</span>
                    <span className="text-indigo-600 font-mono text-base font-black">{baseWidth} px</span>
                  </div>
                  <input 
                    type="range" 
                    min="80" 
                    max="180" 
                    value={baseWidth} 
                    onChange={(e) => setBaseWidth(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* 3. Μήκος Πλάγιας Πλευράς */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-black uppercase text-gray-600">
                    <span>Μήκος Πλάγιας Πλευράς:</span>
                    <span className="text-indigo-600 font-mono text-base font-black">{sideLength} px</span>
                  </div>
                  <input 
                    type="range" 
                    min="80" 
                    max="180" 
                    value={sideLength} 
                    onChange={(e) => setSideLength(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Κουμπί εξίσωσης πλευρών */}
                <button
                  onClick={() => setSideLength(baseWidth)}
                  className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-slate-200 hover:bg-slate-300 text-slate-800 transition"
                >
                  ⚖️ Κάνε όλες τις πλευρές ίσες ({baseWidth} px)
                </button>

              </div>

            </div>

          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες τις ομοιότητες και τις διαφορές των τετραπλεύρων; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/16-tetrapleura-ask"
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
