import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Ονόματα πολυγώνων ανά αριθμό πλευρών
const POLYGON_NAMES = {
  3: { name: 'Τρίγωνο', badge: 'bg-amber-100 text-amber-900 border-amber-300' },
  4: { name: 'Τετράπλευρο (Τετράγωνο)', badge: 'bg-blue-100 text-blue-900 border-blue-300' },
  5: { name: 'Πεντάγωνο', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  6: { name: 'Εξάγωνο', badge: 'bg-purple-100 text-purple-900 border-purple-300' },
  7: { name: 'Επτάγωνο', badge: 'bg-pink-100 text-pink-900 border-pink-300' },
  8: { name: 'Οκτάγωνο', badge: 'bg-rose-100 text-rose-900 border-rose-300' }
};

// Υπολογισμός σημείων κανονικού πολυγώνου σε SVG
function generatePolygonPoints(sides, radius = 95, centerX = 170, centerY = 160) {
  const points = [];
  const sideLength = Math.round((2 * radius * Math.sin(Math.PI / sides)) / 10); // Ενδεικτικό μήκος πλευράς σε εκ.

  for (let i = 0; i < sides; i++) {
    // Περιστροφή ώστε η κορυφή να είναι επάνω
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = Math.round((centerX + radius * Math.cos(angle)) * 10) / 10;
    const y = Math.round((centerY + radius * Math.sin(angle)) * 10) / 10;
    points.push({ x, y });
  }

  return { points, sideLength };
}

export default function PoligonaTheoryPage() {
  const [sides, setSides] = useState(4);
  const [showVertices, setShowVertices] = useState(true);
  const [showLengths, setShowLengths] = useState(true);

  const { points, sideLength } = generatePolygonPoints(sides);
  const svgPointsString = points.map((p) => `${p.x},${p.y}`).join(' ');
  const perimeter = sideLength * sides;

  const handleSideSelect = (e, s) => {
    e.preventDefault();
    e.stopPropagation();
    setSides(s);
  };

  return (
    <Layout
      title="Τα Πολύγωνα και τα Στοιχεία τους - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε τα επίπεδα γεωμετρικά σχήματα, τις πλευρές, τις κορυφές, τις γωνίες και την περίμετρο των πολυγώνων με διαδραστική αναπαράσταση."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/2-poligona-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ (ΓΕΩΜΕΤΡΙΑ)
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                📐 Τα Πολύγωνα και τα Στοιχεία τους
              </h1>
              <p className="text-teal-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Ανακαλύπτουμε τα επίπεδα γεωμετρικά σχήματα, τις πλευρές, τις κορυφές, τις γωνίες και την περίμετρό τους!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-teal-100">
                Δοκίμασε τις ασκήσεις στα πολύγωνα για να σιγουρευτείς ότι τα κατάλαβες όλα!
              </p>
              <Link
                href="/d-dimotikou/2-poligona-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> Τι είναι Πολύγωνο;
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ορισμός */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>🔹</span> Ορισμός Πολυγώνου
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Πολύγωνο</strong> λέγεται κάθε επίπεδο γεωμετρικό σχήμα που σχηματίζεται από μια <strong>κλειστή τεθλασμένη γραμμή</strong>.
              </p>
              <div className="bg-white p-3 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-medium">
                💡 <i>Πολύγωνο ＝ «Πολλές» ＋ «Γωνίες»! Το λιγότερο πλήθος πλευρών που μπορεί να έχει ένα πολύγωνο είναι 3 (Τρίγωνο).</i>
              </div>
            </div>

            {/* Βασικά Στοιχεία */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>✨</span> Τα 3 Στοιχεία του Πολυγώνου
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Πλευρές:</strong> Τα ευθύγραμμα τμήματα που το περιβάλλουν.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Κορυφές:</strong> Τα σημεία όπου συναντιούνται δύο διαδοχικές πλευρές.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Γωνίες:</strong> Οι γωνίες που σχηματίζονται εσωτερικά ανάμεσα στις πλευρές.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ΠΙΝΑΚΑΣ ΟΝΟΜΑΣΙΩΝ - RESPONSIVE GRID */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
              🏷️ Πώς ονομάζουμε τα Πολύγωνα;
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Ονομάζουμε τα πολύγωνα ανάλογα με το πλήθος των πλευρών (ή των γωνιών) τους:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 text-center">
              {[
                { icon: '🔺', count: '3 Πλευρές', name: 'Τρίγωνο', color: 'text-amber-600' },
                { icon: '🟦', count: '4 Πλευρές', name: 'Τετράπλευρο', color: 'text-blue-600' },
                { icon: '⬟', count: '5 Πλευρές', name: 'Πεντάγωνο', color: 'text-emerald-600' },
                { icon: '⬢', count: '6 Πλευρές', name: 'Εξάγωνο', color: 'text-purple-600' },
                { icon: '🛑', count: '7 Πλευρές', name: 'Επτάγωνο', color: 'text-pink-600' },
                { icon: '🛑', count: '8 Πλευρές', name: 'Οκτάγωνο', color: 'text-rose-600' },
              ].map((poly, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-2xl block mb-1">{poly.icon}</span>
                  <span className={`font-mono font-black text-xs sm:text-sm ${poly.color}`}>
                    {poly.count}
                  </span>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{poly.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ΠΕΡΙΜΕΤΡΟΣ */}
          <div className="bg-amber-50/80 p-5 sm:p-6 rounded-2xl border border-amber-200 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-amber-900 flex items-center gap-2">
              <span>📏</span> Περίμετρος Πολυγώνου
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Περίμετρος (Π)</strong> ενός πολυγώνου είναι το <strong>συνολικό μήκος</strong> όλων των πλευρών του:
            </p>
            <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-1.5 leading-relaxed break-words px-3 py-2 bg-white rounded-xl border border-amber-200 font-mono font-bold text-amber-950 text-xs sm:text-sm w-full">
              <span>Περίμετρος (Π)</span>
              <span>＝</span>
              <span>Πλευρά 1</span>
              <span>＋</span>
              <span>Πλευρά 2</span>
              <span>＋</span>
              <span>...</span>
              <span>＋</span>
              <span>Πλευρά ν</span>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΗ ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🎨</span> Διαδραστική Αναπαράσταση Πολυγώνων
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Επίλεξε πλήθος πλευρών και παρατήρησε τις κορυφές, τα μήκη και την περίμετρο!
              </p>
            </div>

            <div className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black border self-start sm:self-auto ${POLYGON_NAMES[sides].badge}`}>
              {POLYGON_NAMES[sides].name}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* ΧΕΙΡΙΣΤΗΡΙΑ / TOGGLES */}
            <div className="space-y-5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-2.5">
                  ΕΠΙΛΟΓΗ ΠΛΕΥΡΩΝ ({sides}):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 4, 5, 6, 7, 8].map((s) => (
                    <button
                      key={s}
                      onClick={(e) => handleSideSelect(e, s)}
                      className={`py-2.5 px-2 rounded-xl font-mono font-black text-xs sm:text-sm border transition active:scale-95 touch-manipulation select-none flex items-center justify-center ${
                        sides === s
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                      }`}
                    >
                      {s} Πλευρές
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* TOGGLES ΓΙΑ ΚΟΡΥΦΕΣ & ΜΗΚΗ */}
              <div className="space-y-2.5">
                <span className="block text-xs font-black uppercase text-slate-500">
                  ΕΠΙΛΟΓΕΣ ΠΡΟΒΟΛΗΣ:
                </span>

                <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer select-none min-h-[44px]">
                  <span className="text-xs font-bold text-slate-700">🔴 Εμφάνιση Κορυφών</span>
                  <input
                    type="checkbox"
                    checked={showVertices}
                    onChange={(e) => setShowVertices(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer select-none min-h-[44px]">
                  <span className="text-xs font-bold text-slate-700">📏 Εμφάνιση Μήκους Πλευρών</span>
                  <input
                    type="checkbox"
                    checked={showLengths}
                    onChange={(e) => setShowLengths(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </label>
              </div>

              {/* ΣΤΑΤΙΣΤΙΚΑ ΣΧΗΜΑΤΟΣ */}
              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 text-xs font-mono shadow-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Πλευρές:</span>
                  <span className="font-bold text-amber-400">{sides}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Κορυφές:</span>
                  <span className="font-bold text-amber-400">{sides}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Γωνίες:</span>
                  <span className="font-bold text-amber-400">{sides}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between text-xs sm:text-sm font-bold">
                  <span className="text-slate-300">Περίμετρος (Π):</span>
                  <span className="text-emerald-400 font-mono">{perimeter} εκ.</span>
                </div>
              </div>
            </div>

            {/* GRAPHICAL CANVAS (RESPONSIVE SVG ΧΩΡΙΣ SCROLLBAR) */}
            <div className="lg:col-span-2 bg-slate-950 rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[380px] shadow-inner relative overflow-hidden border border-slate-800">
              <span className="absolute top-3 left-4 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                Γραφικη Αναπαρασταση
              </span>

              <div className="w-full flex justify-center py-2">
                <svg
                  viewBox="0 0 340 320"
                  className="w-full h-auto max-w-[300px] sm:max-w-[340px] block select-none font-sans"
                >
                  {/* Σχεδίαση Πολυγώνου */}
                  <polygon
                    points={svgPointsString}
                    fill="rgba(99, 102, 241, 0.18)"
                    stroke="#818cf8"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />

                  {/* Εμφάνιση Μήκους Πλευρών (με ασφαλή απόσταση offset) */}
                  {showLengths &&
                    points.map((p, i) => {
                      const nextP = points[(i + 1) % points.length];
                      const midX = (p.x + nextP.x) / 2;
                      const midY = (p.y + nextP.y) / 2;
                      // Μικρή μετατόπιση προς το κέντρο (170, 160)
                      const textX = midX + (170 - midX) * 0.22;
                      const textY = midY + (160 - midY) * 0.22;

                      return (
                        <g key={`len-${i}`}>
                          <rect
                            x={textX - 22}
                            y={textY - 9}
                            width="44"
                            height="18"
                            rx="4"
                            fill="#0f172a"
                            stroke="#334155"
                            strokeWidth="1"
                          />
                          <text
                            x={textX}
                            y={textY + 4}
                            fill="#fbbf24"
                            fontSize="10"
                            fontWeight="800"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            {sideLength} εκ.
                          </text>
                        </g>
                      );
                    })}

                  {/* Εμφάνιση Κορυφών (Κουκκίδες & Ετικέτες K1, K2...) */}
                  {showVertices &&
                    points.map((p, i) => {
                      const offsetX = p.x >= 170 ? 14 : -14;
                      const offsetY = p.y >= 160 ? 14 : -14;
                      return (
                        <g key={`vertex-${i}`}>
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="6"
                            fill="#ef4444"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <text
                            x={p.x + offsetX}
                            y={p.y + offsetY}
                            fill="#cbd5e1"
                            fontSize="11"
                            fontWeight="800"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            K{i + 1}
                          </text>
                        </g>
                      );
                    })}
                </svg>
              </div>

              {/* Μαθηματική Επεξήγηση Περιμέτρου */}
              <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-center mt-2">
                <p className="text-slate-300 text-xs font-mono">
                  {POLYGON_NAMES[sides].name}: {sides} ίσες πλευρές · {sideLength} εκ. ＝{' '}
                  <strong className="text-emerald-400 font-bold">{perimeter} εκ.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση στα Πολύγωνα!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες τις πλευρές, τις κορυφές και την περίμετρο; Κάνε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/2-poligona-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
