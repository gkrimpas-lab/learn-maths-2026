import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ ΚΑΘΑΡΙΣΜΟΥ ΚΑΙ ΤΥΠΟΓΡΑΦΙΑΣ --- //

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Δ')/g);
  return parts
    .map((part) => {
      if (part === "Δ'") return "Δ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function formatNumberLocale(num, locale = 'el') {
  if (num === null || num === undefined || isNaN(num)) return '';
  return num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
}

// Ονόματα πολυγώνων ανά αριθμό πλευρών
const POLYGON_NAMES = {
  3: {
    nameEl: 'Τρίγωνο',
    nameEn: 'Triangle',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  4: {
    nameEl: 'Τετράπλευρο (Τετράγωνο)',
    nameEn: 'Quadrilateral (Square)',
    badge: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  5: {
    nameEl: 'Πεντάγωνο',
    nameEn: 'Pentagon',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  6: {
    nameEl: 'Εξάγωνο',
    nameEn: 'Hexagon',
    badge: 'bg-purple-100 text-purple-900 border-purple-300',
  },
  7: {
    nameEl: 'Επτάγωνο',
    nameEn: 'Heptagon',
    badge: 'bg-pink-100 text-pink-900 border-pink-300',
  },
  8: {
    nameEl: 'Οκτάγωνο',
    nameEn: 'Octagon',
    badge: 'bg-rose-100 text-rose-900 border-rose-300',
  },
};

// Υπολογισμός σημείων κανονικού πολυγώνου σε SVG
function generatePolygonPoints(sides, radius = 95, centerX = 170, centerY = 160) {
  const points = [];
  const sideLength = Math.round((2 * radius * Math.sin(Math.PI / sides)) / 10);

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = Math.round((centerX + radius * Math.cos(angle)) * 10) / 10;
    const y = Math.round((centerY + radius * Math.sin(angle)) * 10) / 10;
    points.push({ x, y });
  }

  return { points, sideLength };
}

// --- ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n --- //
const translations = {
  el: {
    metaTitle: "Τα Πολύγωνα και τα Στοιχεία τους - Θεωρία | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε τα επίπεδα γεωμετρικά σχήματα, τις πλευρές, τις κορυφές, τις γωνίες και την περίμετρο των πολυγώνων με διαδραστική αναπαράσταση.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    exercisesUrl: "/d-dimotikou/2-poligona-ask",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ (ΓΕΩΜΕΤΡΙΑ)",
    heroTitle: "Τα Πολύγωνα και τα Στοιχεία τους",
    heroDesc: "Ανακαλύπτουμε τα επίπεδα γεωμετρικά σχήματα, τις πλευρές, τις κορυφές, τις γωνίες και την περίμετρό τους!",
    promoReadyTitle: "Έτοιμος για εξάσκηση;",
    promoReadyDesc: "Δοκίμασε τις ασκήσεις στα πολύγωνα για να σιγουρευτείς ότι τα κατάλαβες όλα!",
    promoReadyBtn: "Μετάβαση στις Ασκήσεις",
    // Section 1
    sec1Title: "Τι είναι Πολύγωνο;",
    cardDefTitle: "Ορισμός Πολυγώνου",
    cardDefText1: "λέγεται κάθε επίπεδο γεωμετρικό σχήμα που σχηματίζεται από μια",
    cardDefBold1: "Πολύγωνο",
    cardDefBold2: "κλειστή τεθλασμένη γραμμή",
    cardDefNote: "Πολύγωνο ＝ «Πολλές» ＋ «Γωνίες»! Το λιγότερο πλήθος πλευρών που μπορεί να έχει ένα πολύγωνο είναι 3 (Τρίγωνο).",
    cardPropsTitle: "Τα 3 Στοιχεία του Πολυγώνου",
    prop1Label: "Πλευρές:",
    prop1Desc: "Τα ευθύγραμμα τμήματα που το περιβάλλουν.",
    prop2Label: "Κορυφές:",
    prop2Desc: "Τα σημεία όπου συναντιούνται δύο διαδοχικές πλευρές.",
    prop3Label: "Γωνίες:",
    prop3Desc: "Οι γωνίες που σχηματίζονται εσωτερικά ανάμεσα στις πλευρές.",
    namingTitle: "Πώς ονομάζουμε τα Πολύγωνα;",
    namingDesc: "Ονομάζουμε τα πολύγωνα ανάλογα με το πλήθος των πλευρών (ή των γωνιών) τους:",
    sidesCountSuffix: "Πλευρές",
    triName: "Τρίγωνο",
    quadName: "Τετράπλευρο",
    pentaName: "Πεντάγωνο",
    hexaName: "Εξάγωνο",
    heptaName: "Επτάγωνο",
    octaName: "Οκτάγωνο",
    perimTitle: "Περίμετρος Πολυγώνου",
    perimDesc1: "ενός πολυγώνου είναι το",
    perimDesc2: "όλων των πλευρών του:",
    perimBold1: "Περίμετρος (Π)",
    perimBold2: "συνολικό μήκος",
    perimFormulaName: "Περίμετρος (Π)",
    perimSide: "Πλευρά",
    // Section 2
    sec2Title: "Διαδραστική Αναπαράσταση Πολυγώνων",
    sec2Desc: "Επίλεξε πλήθος πλευρών και παρατήρησε τις κορυφές, τα μήκη και την περίμετρο!",
    sidesSelectionLabel: "ΕΠΙΛΟΓΗ ΠΛΕΥΡΩΝ",
    displayOptionsLabel: "ΕΠΙΛΟΓΕΣ ΠΡΟΒΟΛΗΣ:",
    showVerticesLabel: "🔴 Εμφάνιση Κορυφών",
    showLengthsLabel: "📏 Εμφάνιση Μήκους Πλευρών",
    statsSides: "Πλευρές:",
    statsVertices: "Κορυφές:",
    statsAngles: "Γωνίες:",
    statsPerimeter: "Περίμετρος (Π):",
    canvasTitle: "Γραφικη Αναπαρασταση",
    unitCm: "εκ.",
    vertexPrefix: "K",
    equalSidesSummary: "{name}: {sides} ίσες πλευρές · {len} εκ. ＝",
    // Bottom Promo
    bottomPromoTitle: "Ώρα για Εξάσκηση στα Πολύγωνα!",
    bottomPromoDesc: "Έμαθες τις πλευρές, τις κορυφές και την περίμετρο; Κάνε τις διαδραστικές ασκήσεις!",
    bottomPromoBtn: "Ξεκίνα τις Ασκήσεις ➔",
  },
  en: {
    metaTitle: "Polygons and their Properties - Theory | LearnMaths.gr",
    metaDesc: "Learn 2D geometric shapes, sides, vertices, angles, and perimeter of polygons with an interactive visualization.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    exercisesBtn: "Exercises",
    exercisesUrl: "/en/d-dimotikou/2-poligona-ask",
    badge: "4TH GRADE (GEOMETRY)",
    heroTitle: "Polygons and their Properties",
    heroDesc: "Explore two-dimensional geometric shapes, their sides, vertices, angles, and perimeter!",
    promoReadyTitle: "Ready for practice?",
    promoReadyDesc: "Try the polygon exercises to make sure you have understood everything thoroughly!",
    promoReadyBtn: "Go to Exercises",
    // Section 1
    sec1Title: "What is a Polygon?",
    cardDefTitle: "Definition of a Polygon",
    cardDefText1: "is any two-dimensional geometric shape formed by a",
    cardDefBold1: "Polygon",
    cardDefBold2: "closed polygonal chain",
    cardDefNote: "Polygon ＝ \"Many\" ＋ \"Angles\"! The minimum number of sides a polygon can have is 3 (Triangle).",
    cardPropsTitle: "The 3 Elements of a Polygon",
    prop1Label: "Sides:",
    prop1Desc: "The line segments that form its boundary.",
    prop2Label: "Vertices:",
    prop2Desc: "The points where two adjacent sides meet.",
    prop3Label: "Angles:",
    prop3Desc: "The interior angles formed between adjacent sides.",
    namingTitle: "How do we name Polygons?",
    namingDesc: "We classify and name polygons according to the number of their sides (or angles):",
    sidesCountSuffix: "Sides",
    triName: "Triangle",
    quadName: "Quadrilateral",
    pentaName: "Pentagon",
    hexaName: "Hexagon",
    heptaName: "Heptagon",
    octaName: "Octagon",
    perimTitle: "Perimeter of a Polygon",
    perimDesc1: "of a polygon is the",
    perimDesc2: "of all its sides:",
    perimBold1: "Perimeter (P)",
    perimBold2: "total boundary length",
    perimFormulaName: "Perimeter (P)",
    perimSide: "Side",
    // Section 2
    sec2Title: "Interactive Polygon Visualizer",
    sec2Desc: "Choose the number of sides and inspect vertices, side lengths, and perimeter live!",
    sidesSelectionLabel: "SELECT SIDES",
    displayOptionsLabel: "DISPLAY OPTIONS:",
    showVerticesLabel: "🔴 Show Vertices",
    showLengthsLabel: "📏 Show Side Lengths",
    statsSides: "Sides:",
    statsVertices: "Vertices:",
    statsAngles: "Angles:",
    statsPerimeter: "Perimeter (P):",
    canvasTitle: "Graphical Representation",
    unitCm: "cm",
    vertexPrefix: "V",
    equalSidesSummary: "{name}: {sides} equal sides · {len} cm ＝",
    // Bottom Promo
    bottomPromoTitle: "Time to Practice Polygons!",
    bottomPromoDesc: "Mastered sides, vertices, and perimeter? Try the interactive practice exercises!",
    bottomPromoBtn: "Start Exercises ➔",
  },
};

export default function PoligonaTheoryPage() {
  const router = useRouter();
  const rawLocale = router.locale || router.query.locale;
  const currentLocale = rawLocale === 'en' ? 'en' : 'el';
  const t = translations[currentLocale];

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

  const currentPolygonName =
    currentLocale === 'en'
      ? POLYGON_NAMES[sides].nameEn
      : POLYGON_NAMES[sides].nameEl;

  const polygonCards = [
    { icon: '🔺', count: 3, name: t.triName, color: 'text-amber-600' },
    { icon: '🟦', count: 4, name: t.quadName, color: 'text-blue-600' },
    { icon: '⬟', count: 5, name: t.pentaName, color: 'text-emerald-600' },
    { icon: '⬢', count: 6, name: t.hexaName, color: 'text-purple-600' },
    { icon: '🛑', count: 7, name: t.heptaName, color: 'text-pink-600' },
    { icon: '🛑', count: 8, name: t.octaName, color: 'text-rose-600' },
  ];

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl={t.backUrl}
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href={t.exercisesUrl}
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.badge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                📐 {t.heroTitle}
              </h1>
              <p className="text-teal-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.promoReadyTitle}</h3>
              <p className="text-xs text-teal-100">
                {t.promoReadyDesc}
              </p>
              <Link
                href={t.exercisesUrl}
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 {t.promoReadyBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.sec1Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ορισμός */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>🔹</span> {t.cardDefTitle}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>{t.cardDefBold1}</strong> {t.cardDefText1} <strong>{t.cardDefBold2}</strong>.
              </p>
              <div className="bg-white p-3 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-medium">
                💡 <i>{t.cardDefNote}</i>
              </div>
            </div>

            {/* Βασικά Στοιχεία */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>✨</span> {t.cardPropsTitle}
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>{t.prop1Label}</strong> {t.prop1Desc}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>{t.prop2Label}</strong> {t.prop2Desc}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>{t.prop3Label}</strong> {t.prop3Desc}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ΠΙΝΑΚΑΣ ΟΝΟΜΑΣΙΩΝ - RESPONSIVE GRID */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
              🏷️ {t.namingTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.namingDesc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 text-center">
              {polygonCards.map((poly, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-2xl block mb-1">{poly.icon}</span>
                  <span className={`font-mono font-black text-xs sm:text-sm ${poly.color}`}>
                    {poly.count} {t.sidesCountSuffix}
                  </span>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{poly.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ΠΕΡΙΜΕΤΡΟΣ */}
          <div className="bg-amber-50/80 p-5 sm:p-6 rounded-2xl border border-amber-200 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-amber-900 flex items-center gap-2">
              <span>📏</span> {t.perimTitle}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>{t.perimBold1}</strong> {t.perimDesc1} <strong>{t.perimBold2}</strong> {t.perimDesc2}
            </p>
            <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-1.5 leading-relaxed break-words px-3 py-2 bg-white rounded-xl border border-amber-200 font-mono font-bold text-amber-950 text-xs sm:text-sm w-full">
              <span>{t.perimFormulaName}</span>
              <span>＝</span>
              <span>{t.perimSide} 1</span>
              <span>＋</span>
              <span>{t.perimSide} 2</span>
              <span>＋</span>
              <span>...</span>
              <span>＋</span>
              <span>{t.perimSide} ν</span>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΗ ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🎨</span> {t.sec2Title}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                {t.sec2Desc}
              </p>
            </div>

            <div className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black border self-start sm:self-auto ${POLYGON_NAMES[sides].badge}`}>
              {currentPolygonName}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* ΧΕΙΡΙΣΤΗΡΙΑ / TOGGLES */}
            <div className="space-y-5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-2.5">
                  {t.sidesSelectionLabel} ({sides}):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 4, 5, 6, 7, 8].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={(e) => handleSideSelect(e, s)}
                      className={`py-2.5 px-2 rounded-xl font-mono font-black text-xs sm:text-sm border transition active:scale-95 touch-manipulation select-none flex items-center justify-center ${
                        sides === s
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                      }`}
                    >
                      {s} {t.sidesCountSuffix}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* TOGGLES ΓΙΑ ΚΟΡΥΦΕΣ & ΜΗΚΗ */}
              <div className="space-y-2.5">
                <span className="block text-xs font-black uppercase text-slate-500">
                  {t.displayOptionsLabel}
                </span>

                <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer select-none min-h-[44px]">
                  <span className="text-xs font-bold text-slate-700">{t.showVerticesLabel}</span>
                  <input
                    type="checkbox"
                    checked={showVertices}
                    onChange={(e) => setShowVertices(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer select-none min-h-[44px]">
                  <span className="text-xs font-bold text-slate-700">{t.showLengthsLabel}</span>
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
                  <span className="text-slate-400">{t.statsSides}</span>
                  <span className="font-bold text-amber-400">{sides}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.statsVertices}</span>
                  <span className="font-bold text-amber-400">{sides}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.statsAngles}</span>
                  <span className="font-bold text-amber-400">{sides}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between text-xs sm:text-sm font-bold">
                  <span className="text-slate-300">{t.statsPerimeter}</span>
                  <span className="text-emerald-400 font-mono">
                    {formatNumberLocale(perimeter, currentLocale)} {t.unitCm}
                  </span>
                </div>
              </div>
            </div>

            {/* GRAPHICAL CANVAS (RESPONSIVE SVG) */}
            <div className="lg:col-span-2 bg-slate-950 rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[380px] shadow-inner relative overflow-hidden border border-slate-800">
              <span className="absolute top-3 left-4 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                {t.canvasTitle}
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

                  {/* Εμφάνιση Μήκους Πλευρών */}
                  {showLengths &&
                    points.map((p, i) => {
                      const nextP = points[(i + 1) % points.length];
                      const midX = (p.x + nextP.x) / 2;
                      const midY = (p.y + nextP.y) / 2;
                      const textX = midX + (170 - midX) * 0.22;
                      const textY = midY + (160 - midY) * 0.22;

                      return (
                        <g key={`len-${i}`}>
                          <rect
                            x={textX - 24}
                            y={textY - 9}
                            width="48"
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
                            {formatNumberLocale(sideLength, currentLocale)} {t.unitCm}
                          </text>
                        </g>
                      );
                    })}

                  {/* Εμφάνιση Κορυφών (Κουκκίδες & Ετικέτες V1, V2... ή K1, K2...) */}
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
                            {t.vertexPrefix}{i + 1}
                          </text>
                        </g>
                      );
                    })}
                </svg>
              </div>

              {/* Μαθηματική Επεξήγηση Περιμέτρου */}
              <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-center mt-2">
                <p className="text-slate-300 text-xs font-mono">
                  {t.equalSidesSummary
                    .replace('{name}', currentPolygonName)
                    .replace('{sides}', sides)
                    .replace('{len}', formatNumberLocale(sideLength, currentLocale))}{' '}
                  <strong className="text-emerald-400 font-bold">
                    {formatNumberLocale(perimeter, currentLocale)} {t.unitCm}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 {t.bottomPromoTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.bottomPromoDesc}
            </p>
          </div>
          <Link
            href={t.exercisesUrl}
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.bottomPromoBtn}
          </Link>
        </div>
      </div>
    </Layout>
  );
}