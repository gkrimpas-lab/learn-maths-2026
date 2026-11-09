// pages/d-dimotikou/13-paralliles.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση μετατροπής σε άτονα ελληνικά κεφαλαία με εξαίρεση το "Δ'"
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

// Βοηθητική συνάρτηση για clipping γραμμής μέσα στα όρια [minX, maxX, minY, maxY]
function clipLine(x0, y0, angleDeg, minX, maxX, minY, maxY) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);

  let tMin = -1000;
  let tMax = 1000;

  if (Math.abs(dx) > 0.0001) {
    const t1 = (minX - x0) / dx;
    const t2 = (maxX - x0) / dx;
    tMin = Math.max(tMin, Math.min(t1, t2));
    tMax = Math.min(tMax, Math.max(t1, t2));
  }
  if (Math.abs(dy) > 0.0001) {
    const t1 = (minY - y0) / dy;
    const t2 = (maxY - y0) / dy;
    tMin = Math.max(tMin, Math.min(t1, t2));
    tMax = Math.min(tMax, Math.max(t1, t2));
  }

  return {
    x1: x0 + tMin * dx,
    y1: y0 + tMin * dy,
    x2: x0 + tMax * dx,
    y2: y0 + tMax * dy
  };
}

// Συγκεντρωτικό λεξικό μεταφράσεων i18n
const TRANSLATIONS = {
  el: {
    metaTitle: "Παράλληλες και Τεμνόμενες Ευθείες - Θεωρία | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε πότε δύο ευθείες είναι παράλληλες, πότε τεμνόμενες και πότε κάθετες με διαδραστικό γεωμετρικό εργαστήριο μεταβολής γωνίας και απόστασης.",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "📐 Παράλληλες και Τεμνόμενες Ευθείες",
    heroDesc: "Μαθαίνουμε πότε δύο ευθείες είναι παράλληλες (δεν συναντιούνται ποτέ), πότε είναι τεμνόμενες (τέμνονται σε ένα σημείο) και πότε είναι κάθετες!",
    readyPracticeTitle: "Έτοιμος για εξάσκηση;",
    readyPracticeDesc: "Δοκίμασε τις ασκήσεις στις παράλληλες και τεμνόμενες ευθείες για να σιγουρευτείς ότι τις κατανόησες πλήρως!",
    goToExercises: "🎯 Μετάβαση στις Ασκήσεις",
    theorySectionTitle: "Αναλυτική Θεωρία και Είδη Ευθειών",
    parallelTitle: "Παράλληλες Ευθείες",
    parallelDescPre: "Δύο ευθείες λέγονται",
    parallelDescBold: "παράλληλες (ε₁ ∥ ε₂)",
    parallelDescMid: "όταν διατηρούν πάντοτε σταθερή απόσταση μεταξύ τους και",
    parallelDescBold2: "δεν συναντιούνται ποτέ",
    parallelDescPost: ", όσο κι αν τις προεκτείνουμε.",
    parallelExample: "Παράδειγμα: Οι γραμμές του τρένου 🚂",
    intersectingTitle: "Τεμνόμενες Ευθείες",
    intersectingDescPre: "Δύο ευθείες λέγονται",
    intersectingDescBold: "τεμνόμενες",
    intersectingDescMid: "όταν διασταυρώνονται και συναντιούνται σε",
    intersectingDescBold2: "ένα ακριβώς κοινό σημείο",
    intersectingDescPost: ", το οποίο ονομάζεται σημείο τομής (Σ).",
    intersectingExample: "Παράδειγμα: Ένα σταυροδρόμι ✖️",
    perpendicularTitle: "Κάθετες Ευθείες",
    perpendicularDescPre: "Όταν δύο τεμνόμενες ευθείες σχηματίζουν στο σημείο τομής τους",
    perpendicularDescBold: "ορθή γωνία (90°)",
    perpendicularDescPost: ", ονομάζονται κάθετες ευθείες (ε₁ ⊥ ε₂).",
    perpendicularExample: "Έλεγχος με τον γεωμετρικό γνώμονα 📐",
    labSectionTitle: "Διαδραστικό Εργαστήριο Ευθειών",
    labSectionDesc: "Επίλεξε είδος ευθειών, ρύθμισε τη γωνία ή την απόστασή τους και παρατήρησε τη γεωμετρική συμπεριφορά!",
    btnParallel: "∥ Παράλληλες",
    btnIntersecting: "✂️ Τεμνόμενες",
    btnPerpendicular: "📐 Κάθετες",
    distLabel: "ΑΠΟΣΤΑΣΗ ΕΥΘΕΙΩΝ",
    angleLabel: "ΓΩΝΙΑ ΚΛΙΣΗΣ",
    crossAngleLabel: "ΓΩΝΙΑ ΔΙΑΣΤΑΥΡΩΣΗΣ",
    decreaseDistAria: "Μείωση απόστασης",
    increaseDistAria: "Αύξηση απόστασης",
    decreaseAngleAria: "Μείωση γωνίας",
    increaseAngleAria: "Αύξηση γωνίας",
    perpendicularFixedNote: "Οι κάθετες ευθείες σχηματίζουν σταθερή ορθή γωνία 90° στο σημείο τομής τους (ε₁ ⊥ ε₂)!",
    line1Symbol: "ε₁",
    line2Symbol: "ε₂",
    pointSymbol: "Σ",
    displayHeaderParallel: "Παράλληλες Ευθείες (ε₁ ∥ ε₂)",
    displayHeaderIntersecting: "Τεμνόμενες Ευθείες",
    displayHeaderPerpendicular: "Κάθετες Ευθείες (ε₁ ⊥ ε₂)",
    displayDescParallel: "Δεν τέμνονται ποτέ! Η απόστασή τους παραμένει αυστηρά σταθερή.",
    displayDescIntersecting: "Τέμνονται ακριβώς σε ένα κοινό σημείο, το σημείο τομής Σ!",
    displayDescPerpendicular: "Τέμνονται σχηματίζοντας ορθή γωνία 90° (σύμβολο τετραγώνου 🟧)!",
    bottomBannerTitle: "Ώρα για Εξάσκηση!",
    bottomBannerDesc: "Έμαθες τις παράλληλες, τις τεμνόμενες και τις κάθετες ευθείες; Δοκίμασε τις διαδραστικές ασκήσεις!",
    bottomBannerBtn: "Ξεκίνα τις Ασκήσεις ➔"
  },
  en: {
    metaTitle: "Parallel and Intersecting Lines - Theory | LearnMaths.gr",
    metaDesc: "Learn when lines are parallel, intersecting, or perpendicular with an interactive geometry lab adjusting angles and distances.",
    backText: "Grade 4",
    exercisesBtn: "Exercises",
    gradeBadge: "GRADE 4",
    heroTitle: "📐 Parallel and Intersecting Lines",
    heroDesc: "Learn when two lines are parallel (they never meet), intersecting (they meet at one point), and perpendicular!",
    readyPracticeTitle: "Ready for practice?",
    readyPracticeDesc: "Try the exercises on parallel and intersecting lines to master the concept!",
    goToExercises: "🎯 Go to Exercises",
    theorySectionTitle: "Detailed Theory and Line Types",
    parallelTitle: "Parallel Lines",
    parallelDescPre: "Two lines are called",
    parallelDescBold: "parallel (L₁ ∥ L₂)",
    parallelDescMid: "when they always maintain a constant distance between them and",
    parallelDescBold2: "never meet",
    parallelDescPost: ", no matter how far they are extended.",
    parallelExample: "Example: Train tracks 🚂",
    intersectingTitle: "Intersecting Lines",
    intersectingDescPre: "Two lines are called",
    intersectingDescBold: "intersecting",
    intersectingDescMid: "when they cross and meet at",
    intersectingDescBold2: "exactly one common point",
    intersectingDescPost: ", called the intersection point (P).",
    intersectingExample: "Example: A crossroads ✖️",
    perpendicularTitle: "Perpendicular Lines",
    perpendicularDescPre: "When two intersecting lines form a",
    perpendicularDescBold: "right angle (90°)",
    perpendicularDescPost: " at their intersection, they are called perpendicular lines (L₁ ⊥ L₂).",
    perpendicularExample: "Check with a set square 📐",
    labSectionTitle: "Interactive Geometry Lab",
    labSectionDesc: "Select a line type, adjust the angle or distance, and observe their geometric behavior!",
    btnParallel: "∥ Parallel",
    btnIntersecting: "✂️ Intersecting",
    btnPerpendicular: "📐 Perpendicular",
    distLabel: "DISTANCE BETWEEN LINES",
    angleLabel: "INCLINATION ANGLE",
    crossAngleLabel: "INTERSECTION ANGLE",
    decreaseDistAria: "Decrease distance",
    increaseDistAria: "Increase distance",
    decreaseAngleAria: "Decrease angle",
    increaseAngleAria: "Increase angle",
    perpendicularFixedNote: "Perpendicular lines always form a fixed 90° right angle at their intersection point (L₁ ⊥ L₂)!",
    line1Symbol: "L₁",
    line2Symbol: "L₂",
    pointSymbol: "P",
    displayHeaderParallel: "Parallel Lines (L₁ ∥ L₂)",
    displayHeaderIntersecting: "Intersecting Lines",
    displayHeaderPerpendicular: "Perpendicular Lines (L₁ ⊥ L₂)",
    displayDescParallel: "They never meet! The distance between them remains strictly constant.",
    displayDescIntersecting: "They intersect at exactly one common point, the intersection point P!",
    displayDescPerpendicular: "They intersect forming a 90° right angle (square symbol 🟧)!",
    bottomBannerTitle: "Time for Practice!",
    bottomBannerDesc: "Did you master parallel, intersecting, and perpendicular lines? Try the interactive exercises!",
    bottomBannerBtn: "Start Exercises ➔"
  }
};

export default function ParallilesTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [lineType, setLineType] = useState('parallel'); // 'parallel', 'intersecting', 'perpendicular'
  const [angle, setAngle] = useState(65); // Γωνία κλίσης / διασταύρωσης
  const [distance, setDistance] = useState(60); // Απόσταση για παράλληλες

  const handleTypeSelect = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setLineType(type);
    if (type === 'parallel') {
      setAngle(65);
      setDistance(60);
    } else if (type === 'intersecting') {
      setAngle(60);
    } else {
      setAngle(90);
    }
  };

  const updateDistance = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setDistance((prev) => Math.max(30, Math.min(110, prev + delta)));
  };

  const updateAngle = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    const minA = lineType === 'intersecting' ? 20 : 10;
    const maxA = lineType === 'intersecting' ? 160 : 170;
    setAngle((prev) => Math.max(minA, Math.min(maxA, prev + delta)));
  };

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/13-paralliles-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.gradeBadge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.readyPracticeTitle}</h3>
              <p className="text-xs text-blue-100">
                {t.readyPracticeDesc}
              </p>
              <Link
                href="/d-dimotikou/13-paralliles-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                {t.goToExercises}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.theorySectionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Παράλληλες Ευθείες */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
                <span>∥</span> {t.parallelTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.parallelDescPre} <strong>{t.parallelDescBold}</strong> {t.parallelDescMid} <strong>{t.parallelDescBold2}</strong>{t.parallelDescPost}
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-xs font-mono font-bold text-blue-800 text-center shadow-sm">
                {t.parallelExample}
              </div>
            </div>

            {/* 2. Τεμνόμενες Ευθείες */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-purple-900 flex items-center gap-2">
                <span>✂️</span> {t.intersectingTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.intersectingDescPre} <strong>{t.intersectingDescBold}</strong> {t.intersectingDescMid} <strong>{t.intersectingDescBold2}</strong>{t.intersectingDescPost}
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-purple-100 text-xs font-mono font-bold text-purple-800 text-center shadow-sm">
                {t.intersectingExample}
              </div>
            </div>

            {/* 3. Κάθετες Ευθείες */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>📐</span> {t.perpendicularTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.perpendicularDescPre} <strong>{t.perpendicularDescBold}</strong>{t.perpendicularDescPost}
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 text-xs font-mono font-bold text-emerald-800 text-center shadow-sm">
                {t.perpendicularExample}
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.labSectionTitle}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                {t.labSectionDesc}
              </p>
            </div>

            {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ ΕΙΔΟΥΣ */}
            <div className="flex flex-wrap gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={(e) => handleTypeSelect(e, 'parallel')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  lineType === 'parallel'
                    ? 'bg-blue-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.btnParallel}
              </button>
              <button
                type="button"
                onClick={(e) => handleTypeSelect(e, 'intersecting')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  lineType === 'intersecting'
                    ? 'bg-purple-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.btnIntersecting}
              </button>
              <button
                type="button"
                onClick={(e) => handleTypeSelect(e, 'perpendicular')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  lineType === 'perpendicular'
                    ? 'bg-emerald-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.btnPerpendicular}
              </button>
            </div>
          </div>

          {/* CONTROLS SLIDERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
            {lineType === 'parallel' ? (
              <>
                {/* Slider Απόστασης */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-xs font-black uppercase text-slate-500">
                      {toCleanUppercase(t.distLabel)}
                    </span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-blue-600 text-base">
                      {distance} px
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => updateDistance(e, -5)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.decreaseDistAria}
                      aria-label={t.decreaseDistAria}
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="30"
                      max="110"
                      value={distance}
                      onChange={(e) => setDistance(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                    />

                    <button
                      type="button"
                      onClick={(e) => updateDistance(e, 5)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.increaseDistAria}
                      aria-label={t.increaseDistAria}
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Slider Γωνίας Κλίσης */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-xs font-black uppercase text-slate-500">
                      {toCleanUppercase(t.angleLabel)}
                    </span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-blue-600 text-base">
                      {angle}°
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => updateAngle(e, -5)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.decreaseAngleAria}
                      aria-label={t.decreaseAngleAria}
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="10"
                      max="170"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                    />

                    <button
                      type="button"
                      onClick={(e) => updateAngle(e, 5)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.increaseAngleAria}
                      aria-label={t.increaseAngleAria}
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </>
            ) : lineType === 'intersecting' ? (
              <div className="md:col-span-2 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="h-8 flex items-center justify-between text-center px-1">
                  <span className="text-xs font-black uppercase text-slate-500">
                    {toCleanUppercase(t.crossAngleLabel)}
                  </span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-purple-600 text-base">
                    {angle}°
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => updateAngle(e, -5)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-purple-50 hover:bg-purple-100 active:bg-purple-200 text-purple-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title={t.decreaseAngleAria}
                    aria-label={t.decreaseAngleAria}
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="20"
                    max="160"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full min-w-0 max-w-full accent-purple-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={(e) => updateAngle(e, 5)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-purple-50 hover:bg-purple-100 active:bg-purple-200 text-purple-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title={t.increaseAngleAria}
                    aria-label={t.increaseAngleAria}
                  >
                    ＋
                  </button>
                </div>
              </div>
            ) : (
              <div className="md:col-span-2 text-center text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 shadow-sm">
                {t.perpendicularFixedNote}
              </div>
            )}
          </div>

          {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ (RESPONSIVE SVG) */}
          <div className="bg-slate-950 p-4 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-w-xl aspect-[5/4] bg-slate-900/60 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full block select-none" viewBox="0 0 500 420">
                {lineType === 'parallel' && (() => {
                  const rad = (angle * Math.PI) / 180;
                  const nx = -Math.sin(rad) * (distance / 2);
                  const ny = Math.cos(rad) * (distance / 2);

                  const x01 = 250 + nx;
                  const y01 = 210 + ny;
                  const x02 = 250 - nx;
                  const y02 = 210 - ny;

                  const line1 = clipLine(x01, y01, angle, 30, 470, 30, 390);
                  const line2 = clipLine(x02, y02, angle, 30, 470, 30, 390);

                  const label1X = line1.y1 < line1.y2 ? line1.x1 : line1.x2;
                  const label1Y = line1.y1 < line1.y2 ? line1.y1 : line1.y2;

                  const label2X = line2.y1 < line2.y2 ? line2.x1 : line2.x2;
                  const label2Y = line2.y1 < line2.y2 ? line2.y1 : line2.y2;

                  return (
                    <g>
                      {/* Ευθεία ε1 / L1 */}
                      <line
                        x1={line1.x1}
                        y1={line1.y1}
                        x2={line1.x2}
                        y2={line1.y2}
                        stroke="#3b82f6"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <text x={label1X + 8} y={label1Y + 18} fill="#60a5fa" fontWeight="900" fontSize="18" fontFamily="sans-serif">
                        {t.line1Symbol}
                      </text>

                      {/* Ευθεία ε2 / L2 */}
                      <line
                        x1={line2.x1}
                        y1={line2.y1}
                        x2={line2.x2}
                        y2={line2.y2}
                        stroke="#60a5fa"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <text x={label2X + 8} y={label2Y + 18} fill="#93c5fd" fontWeight="900" fontSize="18" fontFamily="sans-serif">
                        {t.line2Symbol}
                      </text>
                    </g>
                  );
                })()}

                {lineType === 'intersecting' && (() => {
                  const line1 = clipLine(250, 210, 0, 30, 470, 30, 390);
                  const line2 = clipLine(250, 210, angle, 30, 470, 30, 390);

                  return (
                    <g>
                      {/* Ευθεία ε1 / L1 */}
                      <line
                        x1={line1.x1}
                        y1={line1.y1}
                        x2={line1.x2}
                        y2={line1.y2}
                        stroke="#a855f7"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <text x={line1.x2 - 28} y={line1.y2 - 12} fill="#c084fc" fontWeight="900" fontSize="18" fontFamily="sans-serif">
                        {t.line1Symbol}
                      </text>

                      {/* Ευθεία ε2 / L2 */}
                      <line
                        x1={line2.x1}
                        y1={line2.y1}
                        x2={line2.x2}
                        y2={line2.y2}
                        stroke="#e879f9"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <text x={line2.x2 - 15} y={line2.y2 + 20} fill="#f0abfc" fontWeight="900" fontSize="18" fontFamily="sans-serif">
                        {t.line2Symbol}
                      </text>

                      {/* Σημείο Τομής Σ / P */}
                      <circle cx="250" cy="210" r="7" fill="#f43f5e" />
                      <text x="262" y="202" fill="#f43f5e" fontWeight="900" fontSize="20" fontFamily="sans-serif">
                        {t.pointSymbol}
                      </text>
                    </g>
                  );
                })()}

                {lineType === 'perpendicular' && (
                  <g>
                    {/* Ευθεία ε1 / L1 (Οριζόντια) */}
                    <line x1="40" y1="210" x2="460" y2="210" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
                    <text x={435} y={195} fill="#34d399" fontWeight="900" fontSize="18" fontFamily="sans-serif">
                      {t.line1Symbol}
                    </text>

                    {/* Ευθεία ε2 / L2 (Κάθετη) */}
                    <line x1="250" y1="35" x2="250" y2="385" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
                    <text x={265} y={60} fill="#6ee7b7" fontWeight="900" fontSize="18" fontFamily="sans-serif">
                      {t.line2Symbol}
                    </text>

                    {/* Καθαρό γωνιακό σύμβολο ορθής γωνίας (L) */}
                    <path
                      d="M 250 185 L 275 185 L 275 210"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />

                    {/* Σημείο Τομής Σ / P */}
                    <circle cx="250" cy="210" r="6" fill="#f43f5e" />
                    <text x="230" y="235" fill="#f43f5e" fontWeight="900" fontSize="18" fontFamily="sans-serif">
                      {t.pointSymbol}
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* ΕΠΕΞΗΓΗΣΗ ΣΤΗΝ ΟΘΟΝΗ */}
            <div className="text-center space-y-1">
              <span className="text-xs font-black tracking-wider text-slate-400 block">
                {lineType === 'parallel'
                  ? t.displayHeaderParallel
                  : lineType === 'intersecting'
                  ? t.displayHeaderIntersecting
                  : t.displayHeaderPerpendicular}
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">
                {lineType === 'parallel'
                  ? t.displayDescParallel
                  : lineType === 'intersecting'
                  ? t.displayDescIntersecting
                  : t.displayDescPerpendicular}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 {t.bottomBannerTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.bottomBannerDesc}
            </p>
          </div>
          <Link
            href="/d-dimotikou/13-paralliles-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.bottomBannerBtn}
          </Link>
        </div>
      </div>
    </Layout>
  );
}