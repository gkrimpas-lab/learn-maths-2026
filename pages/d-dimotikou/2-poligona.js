import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Ονόματα πολυγώνων ανά αριθμό πλευρών
const POLYGON_NAMES = {
  3: { name: 'Τρίγωνο', color: 'from-amber-500 to-orange-500', badge: 'bg-amber-100 text-amber-900 border-amber-300' },
  4: { name: 'Τετράπλευρο (Τετράγωνο/Ρόμβος)', color: 'from-blue-500 to-indigo-600', badge: 'bg-blue-100 text-blue-900 border-blue-300' },
  5: { name: 'Πεντάγωνο', color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  6: { name: 'Εξάγωνο', color: 'from-purple-500 to-indigo-600', badge: 'bg-purple-100 text-purple-900 border-purple-300' },
  7: { name: 'Επτάγωνο', color: 'from-pink-500 to-rose-600', badge: 'bg-pink-100 text-pink-900 border-pink-300' },
  8: { name: 'Οκτάγωνο', color: 'from-red-500 to-amber-600', badge: 'bg-red-100 text-red-900 border-red-300' }
};

// Υπολογισμός σημείων κανονικού πολυγώνου σε SVG
function generatePolygonPoints(sides, radius = 100, centerX = 150, centerY = 140) {
  const points = [];
  const sideLength = Math.round(2 * radius * Math.sin(Math.PI / sides) / 10); // Ενδεικτικό μήκος πλευράς σε εκ.

  for (let i = 0; i < sides; i++) {
    // Περιστροφή ώστε η βάση να είναι οριζόντια
    const angle = (i * 2 * Math.PI / sides) - (Math.PI / 2);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push({ x, y });
  }

  return { points, sideLength };
}

export default function PoligonaTheoryPage() {
  const [sides, setSides] = useState(4);
  const [showVertices, setShowVertices] = useState(true);
  const [showLengths, setShowLengths] = useState(true);

  const { points, sideLength } = generatePolygonPoints(sides);
  const svgPointsString = points.map(p => `${p.x},${p.y}`).join(' ');
  const perimeter = sideLength * sides;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📐 Πολύγωνα - Θεωρία & Διαδραστική Αναπαράσταση - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/2-poligona-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ (ΓΕΩΜΕΤΡΙΑ)
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  📐 Τα Πολύγωνα και τα Στοιχεία τους
                </h1>
                <p className="text-teal-100 text-base lg:text-lg leading-relaxed">
                  Ανακαλύπτουμε τα επίπεδα γεωμετρικά σχήματα, τις πλευρές, τις κορυφές, τις γωνίες και την περίμετρό τους!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-teal-100">Δοκίμασε τις ασκήσεις στα πολύγωνα για να σιγουρευτείς ότι τα κατάλαβες όλα!</p>
                <Link 
                  href="/d-dimotikou/2-poligona-ask"
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
                <span>📖</span> Τι είναι Πολύγωνο;
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Ορισμός */}
              <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-100 space-y-3">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <span>🔹</span> Ορισμός Πολυγώνου
                </h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  <strong>Πολύγωνο</strong> λέγεται κάθε επίπεδο γεωμετρικό σχήμα που σχηματίζεται από μια <strong>κλειστή τεθλασμένη γραμμή</strong>.
                </p>
                <div className="bg-white p-3 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-medium">
                  💡 <i>Πολύγωνο = «Πολλές» + «Γωνίες»! Το λιγότερο πλήθος πλευρών που μπορεί να έχει ένα πολύγωνο είναι 3 (Τρίγωνο).</i>
                </div>
              </div>

              {/* Βασικά Στοιχεία */}
              <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-100 space-y-3">
                <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                  <span>✨</span> Τα 3 Στοιχεία του Πολυγώνου
                </h3>
                <ul className="space-y-2 text-sm md:text-base text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Πλευρές:</strong> Τα ευθύγραμμα τμήματα που το περιβάλλουν.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Κορυφές:</strong> Τα σημεία όπου συναντιούνται δύο πλευρές.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Γωνίες:</strong> Οι γωνίες που σχηματίζονται εσωτερικά μεταξύ των πλευρών.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* ΠΙΝΑΚΑΣ ΟΝΟΜΑΣΙΩΝ */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-800">
                🏷️ Πώς ονομάζουμε τα Πολύγωνα;
              </h3>
              <p className="text-sm text-gray-600">
                Ονομάζουμε τα πολύγωνα ανάλογα με το "πλήθος των πλευρών" (ή των γωνιών) που έχουν:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-2xl block">🔺</span>
                  <span className="font-mono font-black text-amber-600">3 Πλευρές</span>
                  <p className="text-xs font-bold text-gray-700 mt-1">Τρίγωνο</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-2xl block">🟦</span>
                  <span className="font-mono font-black text-blue-600">4 Πλευρές</span>
                  <p className="text-xs font-bold text-gray-700 mt-1">Τετράπλευρο</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-2xl block">⬟</span>
                  <span className="font-mono font-black text-emerald-600">5 Πλευρές</span>
                  <p className="text-xs font-bold text-gray-700 mt-1">Πεντάγωνο</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-2xl block">⬢</span>
                  <span className="font-mono font-black text-purple-600">6 Πλευρές</span>
                  <p className="text-xs font-bold text-gray-700 mt-1">Εξάγωνο</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-2xl block">🛑</span>
                  <span className="font-mono font-black text-pink-600">7 Πλευρές</span>
                  <p className="text-xs font-bold text-gray-700 mt-1">Επτάγωνο</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-2xl block">🛑</span>
                  <span className="font-mono font-black text-red-600">8 Πλευρές</span>
                  <p className="text-xs font-bold text-gray-700 mt-1">Οκτάγωνο</p>
                </div>
              </div>
            </div>

            {/* ΠΕΡΙΜΕΤΡΟΣ */}
            <div className="bg-amber-50/80 p-6 rounded-2xl border border-amber-200 space-y-2">
              <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                <span>📏</span> Περίμετρος Πολυγώνου
              </h3>
              <p className="text-sm md:text-base text-gray-700">
                <strong>Περίμετρος (Π)</strong> ενός πολυγώνου είναι το <strong>συνολικό μήκος όλων των πλευρών του</strong>.
              </p>
              <div className="p-3 bg-white rounded-xl border border-amber-200 font-mono font-bold text-amber-900 text-sm">
                Περίμετρος = Πλευρά 1 + Πλευρά 2 + ... + Πλευρά ν
              </div>
            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΗ ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🎨</span> Διαδραστική Γραφική Αναπαράσταση Πολυγώνων
                </h2>
                <p className="text-gray-500 text-sm">
                  Επίλεξε πλήθος πλευρών και παρατήρησε πώς μεταβάλλεται το πολύγωνο, οι κορυφές και η περίμετρός του!
                </p>
              </div>

              <div className={`px-4 py-2 rounded-xl text-sm font-black border ${POLYGON_NAMES[sides].badge}`}>
                {POLYGON_NAMES[sides].name}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              
              {/* ΧΕΙΡΙΣΤΗΡΙΑ / ΚΟΥΜΠΙΑ */}
              <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Επιλογη Πλευρων ({sides}):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 4, 5, 6, 7, 8].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSides(s)}
                        className={`py-2.5 px-3 rounded-xl font-mono font-black text-sm border transition ${
                          sides === s
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                        }`}
                      >
                        {s} Πλευρές
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* TOGGLES ΓΙΑ ΚΟΡΥΦΕΣ & ΜΗΚΗ */}
                <div className="space-y-3">
                  <span className="block text-xs font-black uppercase text-gray-500">
                    Επιλογές Προβολής:
                  </span>

                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                    <span className="text-xs font-bold text-gray-700">🔴 Εμφάνιση Κορυφών</span>
                    <input 
                      type="checkbox" 
                      checked={showVertices} 
                      onChange={(e) => setShowVertices(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                    <span className="text-xs font-bold text-gray-700">📏 Εμφάνιση Μήκους Πλευρών</span>
                    <input 
                      type="checkbox" 
                      checked={showLengths} 
                      onChange={(e) => setShowLengths(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                  </label>
                </div>

                {/* ΣΤΑΤΙΣΤΙΚΑ ΣΧΗΜΑΤΟΣ */}
                <div className="bg-indigo-900 text-white p-4 rounded-xl space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-indigo-300">Πλευρές:</span>
                    <span className="font-bold text-amber-400">{sides}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-300">Κορυφές:</span>
                    <span className="font-bold text-amber-400">{sides}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-300">Γωνίες:</span>
                    <span className="font-bold text-amber-400">{sides}</span>
                  </div>
                  <div className="border-t border-indigo-700 pt-2 flex justify-between text-sm">
                    <span className="text-indigo-200 font-bold">Περίμετρος (Π):</span>
                    <span className="font-bold text-emerald-400">{perimeter} εκ.</span>
                  </div>
                </div>

              </div>

              {/* GRAPHICAL CANVAS (SVG) */}
              <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[360px] shadow-inner relative overflow-hidden">
                <span className="absolute top-4 left-4 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Γραφικη Αναπαρασταση
                </span>

                <svg className="w-full max-w-[320px] h-[280px]" viewBox="0 0 300 280">
                  {/* Σχεδίαση Πολυγώνου */}
                  <polygon
                    points={svgPointsString}
                    className="fill-indigo-500/30 stroke-indigo-400 stroke-[4] transition-all duration-500 ease-in-out"
                  />

                  {/* Εμφάνιση Μήκους Πλευρών */}
                  {showLengths && points.map((p, i) => {
                    const nextP = points[(i + 1) % points.length];
                    const midX = (p.x + nextP.x) / 2;
                    const midY = (p.y + nextP.y) / 2;
                    return (
                      <text
                        key={`len-${i}`}
                        x={midX}
                        y={midY}
                        fill="#FBBF24"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="font-mono select-none"
                      >
                        {sideLength} εκ.
                      </text>
                    );
                  })}

                  {/* Εμφάνιση Κορυφών (Κουκκίδες) */}
                  {showVertices && points.map((p, i) => (
                    <g key={`vertex-${i}`}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="7"
                        className="fill-red-500 stroke-white stroke-2 animate-pulse"
                      />
                      <text
                        x={p.x + (p.x > 150 ? 12 : -12)}
                        y={p.y + (p.y > 140 ? 12 : -12)}
                        fill="#A5B4FC"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="font-mono select-none"
                      >
                        K{i + 1}
                      </text>
                    </g>
                  ))}
                </svg>

                <p className="text-slate-400 text-xs text-center mt-2 font-mono">
                  {POLYGON_NAMES[sides].name}: {sides} Ίσες Πλευρές x {sideLength} εκ. = {perimeter} εκ.
                </p>
              </div>

            </div>
          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση στα Πολύγωνα!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες τις πλευρές, τις κορυφές και την περίμετρο; Κάνε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/2-poligona-ask"
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
