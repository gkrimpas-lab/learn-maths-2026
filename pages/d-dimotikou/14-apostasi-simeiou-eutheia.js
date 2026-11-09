// pages/d-dimotikou/14-apostasi-simeiou-eutheia.js
import { useState, useRef } from 'react';
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

// Συγκεντρωτικό λεξικό μεταφράσεων i18n
const TRANSLATIONS = {
  el: {
    metaTitle: "Απόσταση Σημείου από Ευθεία - Θεωρία | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε ότι η απόσταση ενός σημείου από μια ευθεία είναι το κάθετο ευθύγραμμο τμήμα (η συντομότερη διαδρομή) με διαδραστικό γεωμετρικό εργαστήριο.",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "📏 Απόσταση Σημείου από Ευθεία",
    heroDesc: "Μαθαίνουμε ότι η απόσταση ενός σημείου από μια ευθεία είναι πάντοτε το κάθετο ευθύγραμμο τμήμα, που αποτελεί τη συντομότερη διαδρομή!",
    readyPracticeTitle: "Έτοιμος για εξάσκηση;",
    readyPracticeDesc: "Δοκίμασε τις ασκήσεις στην απόσταση σημείου από ευθεία για να σιγουρευτείς ότι τις κατανόησες πλήρως!",
    goToExercises: "🎯 Μετάβαση στις Ασκήσεις",
    theorySectionTitle: "Αναλυτική Θεωρία και Βασικοί Κανόνες",
    defTitle: "Τι είναι η Απόσταση;",
    defDescPre: "Απόσταση ενός σημείου",
    defDescPointA: "Α",
    defDescMid: "από μια ευθεία (ε) ονομάζεται το μήκος του",
    defDescBold: "κάθετου ευθύγραμμου τμήματος (ΑΗ)",
    defDescPost: "που φέρνουμε από το σημείο προς την ευθεία.",
    shortestTitle: "Η Συντομότερη Διαδρομή",
    shortestDescPre: "Το κάθετο τμήμα είναι",
    shortestDescBold: "πάντοτε το μικρότερο σε μήκος",
    shortestDescPost: ". Οποιοδήποτε άλλο πλάγιο (λοξό) τμήμα που συνδέει το σημείο με την ευθεία είναι μεγαλύτερο!",
    measureTitle: "Πώς τη μετράμε;",
    measureDescPre: "Τοποθετούμε τον",
    measureDescBoldGnomon: "γνώμονα",
    measureDescMid: "πάνω στην ευθεία για να χαράξουμε την κάθετη γραμμή και έπειτα μετράμε το μήκος της με τον",
    measureDescBoldRuler: "χάρακα",
    measureDescPost: ".",
    labSectionTitle: "Διαδραστικό Εργαστήριο Απόστασης",
    labSectionDescPre: "Σύρε ελεύθερα το κόκκινο σημείο",
    labSectionDescPost: "(πάνω ή κάτω από την ευθεία) και δες σε πραγματικό χρόνο τη μεταβολή της απόστασης!",
    lineAngleLabel: "ΚΛΙΣΗ ΕΥΘΕΙΑΣ",
    decreaseAngleAria: "Μείωση κλίσης",
    increaseAngleAria: "Αύξηση κλίσης",
    lineLabel: "ευθεία (ε)",
    obliqueLabel: "Πλάγια",
    pointA_Label: "Α",
    pointH_Label: "Η",
    perpDistCardTitle: "🟢 ΚΑΘΕΤΗ ΑΠΟΣΤΑΣΗ (ΑΗ)",
    shortestBadge: "⚡ Η Συντομότερη Διαδρομή!",
    obliqueDistCardTitle: "⚪ ΠΛΑΓΙΑ ΔΙΑΔΡΟΜΗ",
    longerBadge: "❌ Μεγαλύτερη από την κάθετη",
    bottomBannerTitle: "Ώρα για Εξάσκηση!",
    bottomBannerDesc: "Έμαθες την απόσταση σημείου από ευθεία; Δοκίμασε τις διαδραστικές ασκήσεις!",
    bottomBannerBtn: "Ξεκίνα τις Ασκήσεις ➔"
  },
  en: {
    metaTitle: "Distance from a Point to a Line - Theory | LearnMaths.gr",
    metaDesc: "Learn that the distance from a point to a line is the perpendicular segment (the shortest path) with an interactive geometry lab.",
    backText: "Grade 4",
    exercisesBtn: "Exercises",
    gradeBadge: "GRADE 4",
    heroTitle: "📏 Distance from a Point to a Line",
    heroDesc: "Learn that the distance from a point to a line is always the perpendicular segment, representing the shortest path!",
    readyPracticeTitle: "Ready for practice?",
    readyPracticeDesc: "Try the exercises on the distance of a point from a line to test your understanding!",
    goToExercises: "🎯 Go to Exercises",
    theorySectionTitle: "Detailed Theory and Core Rules",
    defTitle: "What is Distance?",
    defDescPre: "The distance from a point",
    defDescPointA: "A",
    defDescMid: "to a line (L) is defined as the length of the",
    defDescBold: "perpendicular line segment (AH)",
    defDescPost: "drawn from the point to the line.",
    shortestTitle: "The Shortest Path",
    shortestDescPre: "The perpendicular segment is",
    shortestDescBold: "always the shortest in length",
    shortestDescPost: ". Any other oblique (slanted) segment connecting the point to the line is strictly longer!",
    measureTitle: "How Do We Measure It?",
    measureDescPre: "We place a",
    measureDescBoldGnomon: "set square",
    measureDescMid: "on the line to draw the perpendicular segment and then measure its length using a",
    measureDescBoldRuler: "ruler",
    measureDescPost: ".",
    labSectionTitle: "Interactive Distance Lab",
    labSectionDescPre: "Drag the red point",
    labSectionDescPost: "freely (above or below the line) and watch the distance values change in real time!",
    lineAngleLabel: "LINE SLOPE",
    decreaseAngleAria: "Decrease angle",
    increaseAngleAria: "Increase angle",
    lineLabel: "line (L)",
    obliqueLabel: "Oblique",
    pointA_Label: "A",
    pointH_Label: "H",
    perpDistCardTitle: "🟢 PERPENDICULAR DISTANCE (AH)",
    shortestBadge: "⚡ The Shortest Path!",
    obliqueDistCardTitle: "⚪ OBLIQUE SEGMENT",
    longerBadge: "❌ Longer than perpendicular",
    bottomBannerTitle: "Time for Practice!",
    bottomBannerDesc: "Did you master the distance of a point from a line? Try the interactive exercises!",
    bottomBannerBtn: "Start Exercises ➔"
  }
};

export default function ApostasiTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];
  const isEn = locale === 'en';

  // Θέση του σημείου Α (x, y)
  const [pointA, setPointA] = useState({ x: 250, y: 95 });
  // Γωνία κλίσης της ευθείας
  const [lineAngle, setLineAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null);

  // Σημείο αναφοράς της ευθείας (κέντρο καμβά)
  const linePoint = { x: 250, y: 240 };
  const rad = (lineAngle * Math.PI) / 180;

  // Διανύσματα ευθείας
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);

  // Υπολογισμός της προβολής του Α πάνω στην ευθεία (Σημείο H - ίχνος κάθετης)
  const vx = pointA.x - linePoint.x;
  const vy = pointA.y - linePoint.y;
  const projLen = vx * dx + vy * dy;

  const pointH = {
    x: linePoint.x + projLen * dx,
    y: linePoint.y + projLen * dy
  };

  // Υπολογισμός απόστασης (σε pixels & μετατροπή σε cm: 35px ≈ 1cm)
  const distPx = Math.hypot(pointA.x - pointH.x, pointA.y - pointH.y);
  const distCmRaw = (distPx / 35).toFixed(1);
  const distCm = isEn ? distCmRaw : distCmRaw.replace('.', ',');

  // Υπολογισμός ενός πλάγιου σημείου P για σύγκριση μηκών
  const pointP = {
    x: pointH.x + 85 * dx,
    y: pointH.y + 85 * dy
  };
  const distPlagiaPx = Math.hypot(pointA.x - pointP.x, pointA.y - pointP.y);
  const distPlagiaCmRaw = (distPlagiaPx / 35).toFixed(1);
  const distPlagiaCm = isEn ? distPlagiaCmRaw : distPlagiaCmRaw.replace('.', ',');

  // Ακριβής μετατροπή clientX/clientY σε SVG viewBox συντεταγμένες
  const updateCoordinates = (clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return;

    const ctm = svg.getScreenCTM();
    if (!ctm) return;

    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgCoords = pt.matrixTransform(ctm.inverse());

    const x = Math.max(40, Math.min(460, svgCoords.x));
    const y = Math.max(40, Math.min(380, svgCoords.y));
    setPointA({ x, y });
  };

  // Mouse Dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updateCoordinates(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updateCoordinates(e.clientX, e.clientY);
  };

  // Touch Dragging
  const handleTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    if (e.touches[0]) {
      updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches[0]) return;
    e.preventDefault();
    e.stopPropagation();
    updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  const updateAngle = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setLineAngle((prev) => Math.max(-45, Math.min(45, prev + delta)));
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
          href="/d-dimotikou/14-apostasi-simeiou-eutheia-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div
        className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8"
        onMouseUp={handleEndDrag}
        onTouchEnd={handleEndDrag}
      >
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.gradeBadge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-teal-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.readyPracticeTitle}</h3>
              <p className="text-xs text-teal-100">
                {t.readyPracticeDesc}
              </p>
              <Link
                href="/d-dimotikou/14-apostasi-simeiou-eutheia-ask"
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
            {/* 1. Ορισμός */}
            <div className="bg-teal-50/70 p-5 sm:p-6 rounded-2xl border border-teal-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-teal-900 flex items-center gap-2">
                <span>📐</span> {t.defTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>{t.defDescPre} {t.defDescPointA}</strong> {t.defDescMid} <strong>{t.defDescBold}</strong> {t.defDescPost}
              </p>
            </div>

            {/* 2. Η Μικρότερη Διαδρομή */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>⚡</span> {t.shortestTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.shortestDescPre} <strong>{t.shortestDescBold}</strong>{t.shortestDescPost}
              </p>
            </div>

            {/* 3. Πώς τη μετράμε */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>📏</span> {t.measureTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.measureDescPre} <strong>{t.measureDescBoldGnomon}</strong> {t.measureDescMid} <strong>{t.measureDescBoldRuler}</strong>{t.measureDescPost}
              </p>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.labSectionTitle}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                <strong>{t.labSectionDescPre} {t.pointA_Label}</strong> {t.labSectionDescPost}
              </p>
            </div>

            {/* CONTROL SLIDER ΓΙΑ ΤΗ ΓΩΝΙΑ ΤΗΣ ΕΥΘΕΙΑΣ */}
            <div className="w-full sm:w-72 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 self-start sm:self-auto">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">
                  {toCleanUppercase(t.lineAngleLabel)} ({isEn ? 'L' : 'ε'})
                </span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                  {lineAngle}°
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => updateAngle(e, -5)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title={t.decreaseAngleAria}
                  aria-label={t.decreaseAngleAria}
                >
                  －
                </button>

                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={lineAngle}
                  onChange={(e) => setLineAngle(Number(e.target.value))}
                  className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                />

                <button
                  type="button"
                  onClick={(e) => updateAngle(e, 5)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title={t.increaseAngleAria}
                  aria-label={t.increaseAngleAria}
                >
                  ＋
                </button>
              </div>
            </div>
          </div>

          {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ */}
          <div className="bg-slate-950 p-4 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-5">
            <div
              style={{ touchAction: 'none' }}
              className="w-full max-w-xl aspect-[5/4] bg-slate-900/60 rounded-2xl border border-slate-800 relative select-none cursor-crosshair overflow-hidden touch-none"
            >
              <svg
                ref={svgRef}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="w-full h-full block select-none touch-none"
                viewBox="0 0 500 420"
                style={{ touchAction: 'none' }}
              >
                {/* Ευθεία ε / L */}
                <line
                  x1={linePoint.x - 300 * dx}
                  y1={linePoint.y - 300 * dy}
                  x2={linePoint.x + 300 * dx}
                  y2={linePoint.y + 300 * dy}
                  stroke="#3b82f6"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <text
                  x={linePoint.x + 200 * dx}
                  y={linePoint.y + 200 * dy - 14}
                  fill="#60a5fa"
                  fontWeight="900"
                  fontSize="18"
                  fontFamily="sans-serif"
                >
                  {t.lineLabel}
                </text>

                {/* Πλάγια Γραμμή (για σύγκριση) - Διακεκομμένη */}
                <line
                  x1={pointA.x}
                  y1={pointA.y}
                  x2={pointP.x}
                  y2={pointP.y}
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                  strokeDasharray="6,6"
                />
                <circle cx={pointP.x} cy={pointP.y} r="4.5" fill="#94a3b8" />
                <text
                  x={pointP.x + 8}
                  y={pointP.y + 18}
                  fill="#94a3b8"
                  fontWeight="700"
                  fontSize="13"
                  fontFamily="sans-serif"
                >
                  {t.obliqueLabel}
                </text>

                {/* Κάθετη Γραμμή (Απόσταση ΑΗ) - Πράσινη */}
                <line
                  x1={pointA.x}
                  y1={pointA.y}
                  x2={pointH.x}
                  y2={pointH.y}
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx={pointH.x} cy={pointH.y} r="5" fill="#10b981" />
                <text
                  x={pointH.x - 16}
                  y={pointH.y > pointA.y ? pointH.y + 22 : pointH.y - 12}
                  fill="#34d399"
                  fontWeight="900"
                  fontSize="16"
                  fontFamily="sans-serif"
                >
                  {t.pointH_Label}
                </text>

                {/* Καθαρό γωνιακό σύμβολο ορθής γωνίας (L) στο σημείο Η */}
                {distPx > 18 && (() => {
                  const normX = (pointA.x - pointH.x) / distPx;
                  const normY = (pointA.y - pointH.y) / distPx;
                  const size = 16;
                  const armH_X = pointH.x + dx * size;
                  const armH_Y = pointH.y + dy * size;
                  const cornerX = pointH.x + dx * size + normX * size;
                  const cornerY = pointH.y + dy * size + normY * size;
                  const armV_X = pointH.x + normX * size;
                  const armV_Y = pointH.y + normY * size;

                  return (
                    <path
                      d={`M ${armH_X} ${armH_Y} L ${cornerX} ${cornerY} L ${armV_X} ${armV_Y}`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />
                  );
                })()}

                {/* Σημείο Α (Συρόμενο με mouse ή touch & διευρυμένο hitbox) */}
                <g
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  className="cursor-grab active:cursor-grabbing touch-none"
                  style={{ touchAction: 'none' }}
                >
                  <circle cx={pointA.x} cy={pointA.y} r="40" fill="transparent" />
                  <circle cx={pointA.x} cy={pointA.y} r="18" fill="#f43f5e" fillOpacity="0.25" />
                  <circle cx={pointA.x} cy={pointA.y} r="8.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2.5" />
                  <text
                    x={pointA.x - 6}
                    y={pointA.y > pointH.y ? pointA.y + 26 : pointA.y - 14}
                    fill="#f43f5e"
                    fontWeight="900"
                    fontSize="20"
                    fontFamily="sans-serif"
                  >
                    {t.pointA_Label}
                  </text>
                </g>
              </svg>
            </div>

            {/* ΠΙΝΑΚΑΣ ΜΕΤΡΗΣΕΩΝ & ΣΥΓΚΡΙΣΗΣ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl text-center">
              <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-600/50 text-emerald-200 shadow-sm">
                <span className="text-[11px] uppercase font-black tracking-wider block text-emerald-400">
                  {toCleanUppercase(t.perpDistCardTitle)}
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-300 my-1">
                  {distCm} cm
                </div>
                <span className="text-[11px] font-bold text-emerald-400 block">
                  {t.shortestBadge}
                </span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-slate-300 shadow-sm">
                <span className="text-[11px] uppercase font-black tracking-wider block text-slate-400">
                  {toCleanUppercase(t.obliqueDistCardTitle)}
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-slate-200 my-1">
                  {distPlagiaCm} cm
                </div>
                <span className="text-[11px] font-bold text-rose-400 block">
                  {t.longerBadge}
                </span>
              </div>
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
            href="/d-dimotikou/14-apostasi-simeiou-eutheia-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.bottomBannerBtn}
          </Link>
        </div>
      </div>
    </Layout>
  );
}