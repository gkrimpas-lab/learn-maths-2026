// pages/d-dimotikou/16-tetrapleura.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

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
  const offsetY = centerY + cy;

  const p1 = { x: offsetX, y: offsetY };
  const p2 = { x: offsetX + baseWidth, y: offsetY };
  const p3 = { x: offsetX + baseWidth + dx, y: offsetY - dy };
  const p4 = { x: offsetX + dx, y: offsetY - dy };

  return { p1, p2, p3, p4 };
}

export default function TetrapleuraTheoryPage() {
  // Κατάσταση διαδραστικού σχήματος
  const [baseWidth, setBaseWidth] = useState(130);
  const [sideLength, setSideLength] = useState(130);
  const [angleDeg, setAngleDeg] = useState(60);

  // Αυτόματος προσδιορισμός είδους σχήματος
  const isRightAngle = angleDeg === 90;
  // Αυστηρός έλεγχος ισότητας πλευρών χωρίς ανοχή pixel
  const areSidesEqual = baseWidth === sideLength;
  
  let shapeType = '';
  let shapeIcon = '';
  let shapeBadgeColor = '';
  let shapeDesc = '';

  if (isRightAngle && areSidesEqual) {
    shapeType = 'Τετράγωνο';
    shapeIcon = '❏';
    shapeBadgeColor = 'bg-indigo-600 text-white';
    shapeDesc = 'Όλες οι 4 πλευρές είναι ίσες και όλες οι γωνίες είναι ορθές (90°)!';
  } else if (isRightAngle && !areSidesEqual) {
    shapeType = 'Ορθογώνιο Παραλληλόγραμμο';
    shapeIcon = '▭';
    shapeBadgeColor = 'bg-blue-600 text-white';
    shapeDesc = 'Οι απέναντι πλευρές είναι ίσες και όλες οι 4 γωνίες είναι ορθές (90°)!';
  } else if (!isRightAngle && areSidesEqual) {
    shapeType = 'Ρόμβος';
    shapeIcon = '◇';
    shapeBadgeColor = 'bg-purple-600 text-white';
    shapeDesc = 'Όλες οι 4 πλευρές είναι ίσες, αλλά οι γωνίες του δεν είναι ορθές!';
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
  const setPreset = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
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

  const updateAngle = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setAngleDeg((prev) => Math.max(30, Math.min(90, prev + delta)));
  };

  const updateBaseWidth = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setBaseWidth((prev) => Math.max(80, Math.min(180, prev + delta)));
  };

  const updateSideLength = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setSideLength((prev) => Math.max(80, Math.min(180, prev + delta)));
  };

  return (
    <Layout
      title="Ομοιότητες και Διαφορές Τετραπλεύρων - Θεωρία | LearnMaths.gr"
      description="Συγκρίνουμε το ορθογώνιο, το τετράγωνο, τον ρόμβο και το πλάγιο παραλληλόγραμμο με διαδραστικό γεωμετρικό εργαστήριο μεταβολής πλευρών και γωνιών."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/16-tetrapleura-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                🔷 Ομοιότητες και Διαφορές Τετραπλεύρων
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Συγκρίνουμε το ορθογώνιο, το τετράγωνο, τον ρόμβο και το πλάγιο παραλληλόγραμμο παρατηρώντας πώς αλλάζουν οι πλευρές και οι γωνίες τους!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-blue-100">
                Δοκίμασε τις ασκήσεις στα τετράπλευρα για να σιγουρευτείς ότι κατέκτησες όλες τις ιδιότητές τους!
              </p>
              <Link
                href="/d-dimotikou/16-tetrapleura-ask"
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
              <span>📖</span> Αναλυτική Θεωρία & Χαρακτηριστικά Τετραπλεύρων
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* 1. Ορθογώνιο */}
            <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-100 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-blue-900">Ορθογώνιο</h3>
                <span className="text-2xl">▭</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                <li>• Απέναντι πλευρές <strong>ίσες & παράλληλες</strong></li>
                <li>• <strong>4 ορθές γωνίες (90°)</strong></li>
              </ul>
            </div>

            {/* 2. Τετράγωνο */}
            <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-100 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-indigo-900">Τετράγωνο</h3>
                <span className="text-2xl">❏</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                <li>• <strong>Όλες οι 4 πλευρές ίσες</strong></li>
                <li>• <strong>4 ορθές γωνίες (90°)</strong></li>
              </ul>
            </div>

            {/* 3. Ρόμβος */}
            <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-100 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-purple-900">Ρόμβος</h3>
                <span className="text-2xl">◇</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                <li>• <strong>Όλες οι 4 πλευρές ίσες</strong></li>
                <li>• Απέναντι γωνίες ίσες (όχι ορθές)</li>
              </ul>
            </div>

            {/* 4. Πλάγιο Παραλληλόγραμμο */}
            <div className="bg-teal-50/70 p-5 rounded-2xl border border-teal-100 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-teal-900">Πλάγιο Παραλληλόγραμμο</h3>
                <span className="text-2xl">▱</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                <li>• Απέναντι πλευρές <strong>ίσες & παράλληλες</strong></li>
                <li>• Απέναντι γωνίες ίσες (όχι ορθές)</li>
              </ul>
            </div>
          </div>

          {/* ΣΥΓΚΡΙΤΙΚΟΣ ΠΙΝΑΚΑΣ ΙΔΙΟΤΗΤΩΝ */}
          <div className="bg-slate-950 text-white p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-amber-400 text-center sm:text-left">
              📊 Συγκριτικός Πίνακας Ιδιοτήτων
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm font-bold border-collapse min-w-[520px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                    <th className="py-3 px-3">Σχημα</th>
                    <th className="py-3 px-3 text-center">Απεναντι πλευρες παραλληλες</th>
                    <th className="py-3 px-3 text-center">4 Πλευρες ισες</th>
                    <th className="py-3 px-3 text-center">4 Ορθες γωνιες (90°)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-3 text-blue-400 flex items-center gap-2"><span>▭</span> Ορθογώνιο</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-mono">Ναι</td>
                    <td className="py-3 px-3 text-center text-rose-400 font-mono">Όχι (μόνο απέναντι)</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-mono">Ναι (4)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-3 text-indigo-400 flex items-center gap-2"><span>❏</span> Τετράγωνο</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-mono">Ναι</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-mono">Ναι (4)</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-mono">Ναι (4)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-3 text-purple-400 flex items-center gap-2"><span>◇</span> Ρόμβος</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-mono">Ναι</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-mono">Ναι (4)</td>
                    <td className="py-3 px-3 text-center text-rose-400 font-mono">Όχι</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-3 text-teal-400 flex items-center gap-2"><span>▱</span> Πλάγιο Παραλληλόγραμμο</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-mono">Ναι</td>
                    <td className="py-3 px-3 text-center text-rose-400 font-mono">Όχι (μόνο απέναντι)</td>
                    <td className="py-3 px-3 text-center text-rose-400 font-mono">Όχι</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικό Εργαστήριο Αναγνώρισης Σχήματος
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Άλλαξε τις πλευρές και τη γωνία και παρατήρησε τον αυτόματο προσδιορισμό του τετραπλεύρου!
              </p>
            </div>

            {/* PRESET BUTTONS */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              <button
                onClick={(e) => setPreset(e, 'square')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-900 transition active:scale-95 touch-manipulation"
              >
                ❏ Τετράγωνο
              </button>
              <button
                onClick={(e) => setPreset(e, 'rectangle')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-900 transition active:scale-95 touch-manipulation"
              >
                ▭ Ορθογώνιο
              </button>
              <button
                onClick={(e) => setPreset(e, 'rhombus')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 active:bg-purple-200 text-purple-900 transition active:scale-95 touch-manipulation"
              >
                ◇ Ρόμβος
              </button>
              <button
                onClick={(e) => setPreset(e, 'parallelogram')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 active:bg-teal-200 text-teal-900 transition active:scale-95 touch-manipulation"
              >
                ▱ Πλάγιο
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ (RESPONSIVE SVG ΧΩΡΙΣ SCROLL) */}
            <div className="bg-slate-950 p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-4">
              {/* DYNAMIC SHAPE BADGE */}
              <div className={`px-4 py-2 rounded-2xl font-black text-sm sm:text-base shadow-md flex items-center gap-2 transition-all ${shapeBadgeColor}`}>
                <span className="text-xl">{shapeIcon}</span>
                <span>{shapeType}</span>
              </div>

              <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square bg-slate-900/60 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full block select-none" viewBox="0 0 300 300">
                  {/* Τετράπλευρο Polygon */}
                  <polygon
                    points={pointsString}
                    fill="#818cf8"
                    fillOpacity="0.2"
                    stroke="#818cf8"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />

                  {/* Ορθές γωνίες (καθαρά σύμβολα L αν είναι 90°) */}
                  {isRightAngle && (
                    <g>
                      <path d={`M ${p1.x} ${p1.y - 14} L ${p1.x + 14} ${p1.y - 14} L ${p1.x + 14} ${p1.y}`} fill="none" stroke="#f59e0b" strokeWidth="2" />
                      <path d={`M ${p2.x - 14} ${p2.y} L ${p2.x - 14} ${p2.y - 14} L ${p2.x} ${p2.y - 14}`} fill="none" stroke="#f59e0b" strokeWidth="2" />
                      <path d={`M ${p3.x} ${p3.y + 14} L ${p3.x - 14} ${p3.y + 14} L ${p3.x - 14} ${p3.y}`} fill="none" stroke="#f59e0b" strokeWidth="2" />
                      <path d={`M ${p4.x + 14} ${p4.y} L ${p4.x + 14} ${p4.y + 14} L ${p4.x} ${p4.y + 14}`} fill="none" stroke="#f59e0b" strokeWidth="2" />
                    </g>
                  )}

                  {/* Ετικέτες Πλευρών */}
                  <text x={(p1.x + p2.x) / 2} y={p1.y + 18} fill="#a5b4fc" fontWeight="700" fontSize="12" fontFamily="monospace" textAnchor="middle">
                    {baseWidth} px
                  </text>
                  <text x={(p1.x + p4.x) / 2 - 12} y={(p1.y + p4.y) / 2} fill="#a5b4fc" fontWeight="700" fontSize="12" fontFamily="monospace" textAnchor="end">
                    {sideLength} px
                  </text>
                </svg>
              </div>

              <p className="text-center text-xs font-bold text-slate-300 max-w-xs leading-relaxed">
                {shapeDesc}
              </p>
            </div>

            {/* SLIDERS ΧΕΙΡΙΣΜΟΥ (ΚΑΝΟΝΑΣ 2) */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🎛️</span> Ρύθμιση Πλευρών & Γωνιών
              </h3>

              {/* 1. Γωνία Κλίσης */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <div className="h-8 flex items-center justify-between text-center px-1">
                  <span className="text-[11px] font-black uppercase text-slate-500">ΓΩΝΙΑ ΚΛΙΣΗΣ</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-sm sm:text-base">
                    {angleDeg}° {isRightAngle ? '(90°)' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    onClick={(e) => updateAngle(e, -5)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title="Μείωση γωνίας"
                    aria-label="Μείωση γωνίας"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="30"
                    max="90"
                    value={angleDeg}
                    onChange={(e) => setAngleDeg(Number(e.target.value))}
                    className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                  />

                  <button
                    onClick={(e) => updateAngle(e, 5)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title="Αύξηση γωνίας"
                    aria-label="Αύξηση γωνίας"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* 2. Μήκος Βάσης */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <div className="h-8 flex items-center justify-between text-center px-1">
                  <span className="text-[11px] font-black uppercase text-slate-500">ΜΗΚΟΣ ΒΑΣΗΣ</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-sm sm:text-base">
                    {baseWidth} px
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    onClick={(e) => updateBaseWidth(e, -5)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title="Μείωση βάσης"
                    aria-label="Μείωση βάσης"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="80"
                    max="180"
                    value={baseWidth}
                    onChange={(e) => setBaseWidth(Number(e.target.value))}
                    className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                  />

                  <button
                    onClick={(e) => updateBaseWidth(e, 5)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title="Αύξηση βάσης"
                    aria-label="Αύξηση βάσης"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* 3. Μήκος Πλάγιας Πλευράς */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <div className="h-8 flex items-center justify-between text-center px-1">
                  <span className="text-[11px] font-black uppercase text-slate-500">ΜΗΚΟΣ ΠΛΑΓΙΑΣ ΠΛΕΥΡΑΣ</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-sm sm:text-base">
                    {sideLength} px
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    onClick={(e) => updateSideLength(e, -5)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title="Μείωση πλευράς"
                    aria-label="Μείωση πλευράς"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="80"
                    max="180"
                    value={sideLength}
                    onChange={(e) => setSideLength(Number(e.target.value))}
                    className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                  />

                  <button
                    onClick={(e) => updateSideLength(e, 5)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title="Αύξηση πλευράς"
                    aria-label="Αύξηση πλευράς"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Κουμπί εξίσωσης πλευρών */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSideLength(baseWidth);
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-200 hover:bg-slate-300 text-slate-800 transition active:scale-95 touch-manipulation shadow-sm"
              >
                ⚖️ Εξίσωση Όλων των Πλευρών ({baseWidth} px)
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες τις ομοιότητες και τις διαφορές των τετραπλεύρων; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/16-tetrapleura-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
