// pages/d-dimotikou/18-simmetria.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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

const translations = {
  el: {
    metaTitle: 'Συμμετρία και Άξονας Συμμετρίας - Θεωρία | LearnMaths.gr',
    metaDesc:
      'Μαθαίνουμε τι είναι ο άξονας συμμετρίας, το πλήθος αξόνων στα γεωμετρικά σχήματα και την ισότητα περιμέτρου και εμβαδού με διαδραστικό εργαστήριο αναδίπλωσης.',
    backText: "Δ' Δημοτικού",
    exercisesBtn: 'Ασκήσεις',
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: '🦋 Η Έννοια της Συμμετρίας',
    heroSubtitle:
      'Μαθαίνουμε τι είναι ο άξονας συμμετρίας, πώς ένα σχήμα μπορεί να έχει έναν, περισσότερους ή κανέναν άξονα και γιατί τα συμμετρικά μέρη έχουν πάντοτε ίση περίμετρο και ίσο εμβαδόν!',
    readyBoxTitle: 'Έτοιμος για εξάσκηση;',
    readyBoxDesc:
      'Δοκίμασε τις ασκήσεις στη συμμετρία για να σιγουρευτείς ότι κατανόησες πλήρως τους άξονες συμμετρίας!',
    goToExercises: '🎯 Μετάβαση στις Ασκήσεις',
    theoryHeading: 'Αναλυτική Θεωρία και Βασικοί Κανόνες',
    card1Title: 'Άξονας Συμμετρίας',
    card1Desc:
      'Άξονας συμμετρίας ονομάζεται η ευθεία γραμμή που χωρίζει ένα γεωμετρικό σχήμα σε δύο ακριβώς ίδια μέρη. Αν διπλώσουμε το σχήμα πάνω σε αυτή τη γραμμή, τα δύο μέρη ταυτίζονται τέλεια.',
    card2Title: 'Πλήθος Αξόνων',
    card2Desc:
      'Ένα σχήμα μπορεί να έχει έναν άξονα (ισοσκελές τρίγωνο), περισσότερους (τετράγωνο: 4, ισόπλευρο: 3, κύκλος: άπειροι) ή και κανέναν άξονα συμμετρίας (σκαληνό τρίγωνο).',
    card3Title: 'Ίση Περίμετρος & Εμβαδόν',
    card3Desc:
      'Επειδή τα δύο συμμετρικά μέρη είναι απολύτως ίσα μεταξύ τους, έχουν πάντοτε την ίδια περίμετρο και το ίδιο εμβαδόν.',
    labHeading: 'Διαδραστικό Εργαστήριο Συμμετρίας & Αναδίπλωσης',
    labSubheading:
      'Επίλεξε σχήμα, διάλεξε άξονα και σύρε το slider για να δεις το δίπλωμα και την τέλεια ταύτιση!',
    axesBadgeLabel: 'Άξονες:',
    noAxisVisualText: 'Κανένας Άξονας Συμμετρίας (0)',
    selectAxisTitle: '🎯 ΕΠΙΛΕΞΕ ΑΞΟΝΑ ΓΙΑ ΔΙΠΛΩΜΑ:',
    verticalAxis: '🟡 Κατακόρυφος',
    horizontalAxis: '🟢 Οριζόντιος',
    diag1Axis: '🔵 Διαγώνιος 1',
    diag2Axis: '🔵 Διαγώνιος 2',
    axisA: '🟡 Άξονας 1 (Κορυφή Α)',
    axisB: '🟢 Άξονας 2 (Κορυφή Β)',
    axisC: '🔵 Άξονας 3 (Κορυφή Γ)',
    scaleneWarning:
      '⚠️ Το Σκαληνό Τρίγωνο δεν διαθέτει κανέναν άξονα συμμετρίας, επομένως δεν μπορεί να διπλωθεί σε δύο ίσα μέρη.',
    foldingTitle: 'ΔΙΠΛΩΜΑ ΠΑΝΩ ΣΤΟΝ ΑΞΟΝΑ',
    decFold: 'Μείωση αναδίπλωσης',
    incFold: 'Αύξηση αναδίπλωσης',
    comparisonTitle: '📏 ΣΥΓΚΡΙΣΗ ΣΥΜΜΕΤΡΙΚΩΝ ΜΕΡΩΝ:',
    part1: '🟣 1ο Μέρος',
    part2: '🌸 2ο Μέρος',
    pLabel: 'Π:',
    eLabel: 'Ε:',
    unitCm: 'cm',
    unitCm2: 'cm²',
    equalPartsSuccess: 'Τα δύο συμμετρικά μέρη έχουν ακριβώς την ίδια περίμετρο και το ίδιο εμβαδόν.',
    noSymmetricParts: 'Δεν υπάρχουν συμμετρικά μέρη σε αυτό το σχήμα.',
    bottomTitle: '📝 Ώρα για Εξάσκηση!',
    bottomDesc:
      'Έμαθες τη συμμετρία και τους άξονες συμμετρίας; Δοκίμασε τις διαδραστικές ασκήσεις!',
    startExercises: 'Ξεκίνα τις Ασκήσεις ➔',
    shapesData: {
      square: {
        name: 'Τετράγωνο',
        btnText: '❏ Τετράγωνο (4)',
        totalAxes: '4',
        desc: 'Το τετράγωνο έχει 4 άξονες συμμετρίας (1 κατακόρυφο, 1 οριζόντιο και 2 διαγώνιους).',
        halfPerimeter: '25',
        halfArea: '50',
      },
      rectangle: {
        name: 'Ορθογώνιο',
        btnText: '▭ Ορθογώνιο (2)',
        totalAxes: '2',
        desc: 'Το ορθογώνιο έχει 2 άξονες συμμετρίας (1 κατακόρυφο και 1 οριζόντιο). Οι διαγώνιοί του δεν είναι άξονες συμμετρίας!',
        halfPerimeter: '22',
        halfArea: '40',
      },
      isoscelesTriangle: {
        name: 'Ισοσκελές Τρίγωνο',
        btnText: '▲ Ισοσκελές (1)',
        totalAxes: '1',
        desc: 'Το ισοσκελές τρίγωνο (με 2 ίσες πλευρές) έχει μόνο 1 κατακόρυφο άξονα συμμετρίας.',
        halfPerimeter: '16',
        halfArea: '12',
      },
      equilateralTriangle: {
        name: 'Ισόπλευρο Τρίγωνο',
        btnText: '▲ Ισόπλευρο (3)',
        totalAxes: '3',
        desc: 'Το ισόπλευρο τρίγωνο (με 3 ίσες πλευρές) έχει 3 άξονες συμμετρίας (έναν από κάθε κορυφή).',
        halfPerimeter: '18',
        halfArea: '15,5',
      },
      scaleneTriangle: {
        name: 'Σκαληνό Τρίγωνο',
        btnText: '▲ Σκαληνό (0)',
        totalAxes: '0',
        desc: 'Το σκαληνό τρίγωνο (με όλες τις πλευρές άνισες) δεν έχει κανέναν άξονα συμμετρίας (0).',
        halfPerimeter: '—',
        halfArea: '—',
      },
      rhombus: {
        name: 'Ρόμβος',
        btnText: '◇ Ρόμβος (2)',
        totalAxes: '2',
        desc: 'Ο ρόμβος έχει 2 άξονες συμμετρίας (τις δύο διαγώνιους του: την κατακόρυφη και την οριζόντια).',
        halfPerimeter: '20',
        halfArea: '24',
      },
      circle: {
        name: 'Κύκλος',
        btnText: '◯ Κύκλος (∞)',
        totalAxes: 'Άπειροι (∞)',
        desc: 'Ο κύκλος έχει αμέτρητους (άπειρους) άξονες συμμετρίας! Κάθε ευθεία που διέρχεται από το κέντρο του είναι άξονας συμμετρίας.',
        halfPerimeter: '18,7',
        halfArea: '39,25',
      },
    },
  },
  en: {
    metaTitle: 'Symmetry and Axis of Symmetry - Theory | LearnMaths.gr',
    metaDesc:
      'Learn what a line of symmetry is, the number of axes in geometric shapes, and equality of perimeter and area through an interactive folding lab.',
    backText: 'Grade 4',
    exercisesBtn: 'Exercises',
    badge: 'GRADE 4',
    heroTitle: '🦋 The Concept of Symmetry',
    heroSubtitle:
      'Learn what a line of symmetry is, how a shape can have one, multiple, or no lines of symmetry, and why symmetrical halves always have equal perimeter and area!',
    readyBoxTitle: 'Ready for practice?',
    readyBoxDesc:
      'Try the practice exercises on symmetry to make sure you fully understand lines of symmetry!',
    goToExercises: '🎯 Go to Exercises',
    theoryHeading: 'Detailed Theory & Fundamental Rules',
    card1Title: 'Line of Symmetry',
    card1Desc:
      'A line (axis) of symmetry is a straight line that divides a shape into two identical halves. If you fold the shape along this line, both halves match up perfectly.',
    card2Title: 'Number of Axes',
    card2Desc:
      'A shape may have one axis (isosceles triangle), several (square: 4, equilateral triangle: 3, circle: infinite), or no axis of symmetry at all (scalene triangle).',
    card3Title: 'Equal Perimeter & Area',
    card3Desc:
      'Because the two symmetrical halves are identical, they always have exactly the same perimeter and the same area.',
    labHeading: 'Interactive Symmetry & Folding Lab',
    labSubheading:
      'Select a shape, choose an axis, and drag the slider to fold and see perfect congruency!',
    axesBadgeLabel: 'Axes:',
    noAxisVisualText: 'No Line of Symmetry (0)',
    selectAxisTitle: '🎯 CHOOSE AN AXIS TO FOLD:',
    verticalAxis: '🟡 Vertical',
    horizontalAxis: '🟢 Horizontal',
    diag1Axis: '🔵 Diagonal 1',
    diag2Axis: '🔵 Diagonal 2',
    axisA: '🟡 Axis 1 (Vertex A)',
    axisB: '🟢 Axis 2 (Vertex B)',
    axisC: '🔵 Axis 3 (Vertex C)',
    scaleneWarning:
      '⚠️ The Scalene Triangle does not have any line of symmetry, so it cannot be folded into two identical halves.',
    foldingTitle: 'FOLD ALONG AXIS',
    decFold: 'Decrease fold',
    incFold: 'Increase fold',
    comparisonTitle: '📏 COMPARISON OF SYMMETRICAL PARTS:',
    part1: '🟣 1st Part',
    part2: '🌸 2nd Part',
    pLabel: 'P:',
    eLabel: 'A:',
    unitCm: 'cm',
    unitCm2: 'cm²',
    equalPartsSuccess: 'Both symmetrical halves have exactly the same perimeter and area.',
    noSymmetricParts: 'There are no symmetrical parts in this shape.',
    bottomTitle: '📝 Time to Practice!',
    bottomDesc:
      'Mastered symmetry and lines of symmetry? Test your skills with interactive exercises!',
    startExercises: 'Start Exercises ➔',
    shapesData: {
      square: {
        name: 'Square',
        btnText: '❏ Square (4)',
        totalAxes: '4',
        desc: 'A square has 4 lines of symmetry (1 vertical, 1 horizontal, and 2 diagonals).',
        halfPerimeter: '25',
        halfArea: '50',
      },
      rectangle: {
        name: 'Rectangle',
        btnText: '▭ Rectangle (2)',
        totalAxes: '2',
        desc: 'A rectangle has 2 lines of symmetry (1 vertical and 1 horizontal). Its diagonals are not lines of symmetry!',
        halfPerimeter: '22',
        halfArea: '40',
      },
      isoscelesTriangle: {
        name: 'Isosceles Triangle',
        btnText: '▲ Isosceles (1)',
        totalAxes: '1',
        desc: 'An isosceles triangle (with 2 equal sides) has only 1 vertical line of symmetry.',
        halfPerimeter: '16',
        halfArea: '12',
      },
      equilateralTriangle: {
        name: 'Equilateral Triangle',
        btnText: '▲ Equilateral (3)',
        totalAxes: '3',
        desc: 'An equilateral triangle (with 3 equal sides) has 3 lines of symmetry (one passing through each vertex).',
        halfPerimeter: '18',
        halfArea: '15.5',
      },
      scaleneTriangle: {
        name: 'Scalene Triangle',
        btnText: '▲ Scalene (0)',
        totalAxes: '0',
        desc: 'A scalene triangle (with all sides unequal) has no lines of symmetry (0).',
        halfPerimeter: '—',
        halfArea: '—',
      },
      rhombus: {
        name: 'Rhombus',
        btnText: '◇ Rhombus (2)',
        totalAxes: '2',
        desc: 'A rhombus has 2 lines of symmetry (its two diagonals: vertical and horizontal).',
        halfPerimeter: '20',
        halfArea: '24',
      },
      circle: {
        name: 'Circle',
        btnText: '◯ Circle (∞)',
        totalAxes: 'Infinite (∞)',
        desc: 'A circle has infinitely many lines of symmetry! Any straight line passing through its center is a line of symmetry.',
        halfPerimeter: '18.7',
        halfArea: '39.25',
      },
    },
  },
};

const SHAPE_CONFIGS = {
  square: { allowedAxes: ['vertical', 'horizontal', 'diag1', 'diag2'] },
  rectangle: { allowedAxes: ['vertical', 'horizontal'] },
  isoscelesTriangle: { allowedAxes: ['vertical'] },
  equilateralTriangle: { allowedAxes: ['axisA', 'axisB', 'axisC'] },
  scaleneTriangle: { allowedAxes: [] },
  rhombus: { allowedAxes: ['vertical', 'horizontal'] },
  circle: { allowedAxes: ['vertical', 'horizontal', 'diag1', 'diag2'] },
};

export default function SimmetriaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [shape, setShape] = useState('square');
  const [activeAxis, setActiveAxis] = useState('vertical');
  const [foldProgress, setFoldProgress] = useState(0);

  const activeData = t.shapesData[shape];
  const activeAllowedAxes = SHAPE_CONFIGS[shape].allowedAxes;

  const handleShapeChange = (e, newShape) => {
    e.preventDefault();
    e.stopPropagation();
    setShape(newShape);
    setFoldProgress(0);
    const available = SHAPE_CONFIGS[newShape].allowedAxes;
    if (available.length > 0 && !available.includes(activeAxis)) {
      setActiveAxis(available[0]);
    }
  };

  const handleAxisSelect = (e, axisKey) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveAxis(axisKey);
    setFoldProgress(0);
  };

  const updateFoldDelta = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setFoldProgress((prev) => Math.max(0, Math.min(100, prev + delta)));
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
          href="/d-dimotikou/18-simmetria-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.badge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-purple-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroSubtitle}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.readyBoxTitle}</h3>
              <p className="text-xs text-purple-100">{t.readyBoxDesc}</p>
              <Link
                href="/d-dimotikou/18-simmetria-ask"
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
              <span>📖</span> {t.theoryHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Άξονας Συμμετρίας */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-purple-900 flex items-center gap-2">
                <span>✂️</span> {t.card1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{t.card1Desc}</p>
            </div>

            {/* 2. Πλήθος Αξόνων */}
            <div className="bg-pink-50/70 p-5 sm:p-6 rounded-2xl border border-pink-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-pink-900 flex items-center gap-2">
                <span>🔢</span> {t.card2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{t.card2Desc}</p>
            </div>

            {/* 3. Ίση Περίμετρος & Εμβαδόν */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>📐</span> {t.card3Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{t.card3Desc}</p>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.labHeading}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">{t.labSubheading}</p>
            </div>

            {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ ΣΧΗΜΑΤΟΣ */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              <button
                onClick={(e) => handleShapeChange(e, 'square')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'square'
                    ? 'bg-purple-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.shapesData.square.btnText}
              </button>
              <button
                onClick={(e) => handleShapeChange(e, 'rectangle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'rectangle'
                    ? 'bg-purple-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.shapesData.rectangle.btnText}
              </button>
              <button
                onClick={(e) => handleShapeChange(e, 'isoscelesTriangle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'isoscelesTriangle'
                    ? 'bg-purple-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.shapesData.isoscelesTriangle.btnText}
              </button>
              <button
                onClick={(e) => handleShapeChange(e, 'equilateralTriangle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'equilateralTriangle'
                    ? 'bg-purple-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.shapesData.equilateralTriangle.btnText}
              </button>
              <button
                onClick={(e) => handleShapeChange(e, 'scaleneTriangle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'scaleneTriangle'
                    ? 'bg-rose-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.shapesData.scaleneTriangle.btnText}
              </button>
              <button
                onClick={(e) => handleShapeChange(e, 'rhombus')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'rhombus'
                    ? 'bg-purple-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.shapesData.rhombus.btnText}
              </button>
              <button
                onClick={(e) => handleShapeChange(e, 'circle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'circle'
                    ? 'bg-purple-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.shapesData.circle.btnText}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ & ΑΝΑΔΙΠΛΩΣΗΣ */}
            <div className="bg-slate-950 p-4 sm:p-7 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-4">
              {/* SHAPE BADGE & INFO */}
              <div className="bg-purple-600 text-white px-4 py-1.5 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center gap-2">
                <span>🦋 {activeData.name}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-mono">
                  {t.axesBadgeLabel} {activeData.totalAxes}
                </span>
              </div>

              <div className="w-full max-w-[340px] aspect-[5/4] bg-slate-900/60 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full block select-none" viewBox="0 0 400 320">
                  {(() => {
                    const rad = (foldProgress * 1.8 * Math.PI) / 180;
                    const scaleFold = Math.cos(rad);

                    return (
                      <g transform="translate(200, 160)">
                        {/* ΣΚΑΛΗΝΟ ΤΡΙΓΩΝΟ (0 ΑΞΟΝΕΣ) */}
                        {shape === 'scaleneTriangle' && (
                          <g>
                            <polygon
                              points="-40,-70 -90,70 100,70"
                              fill="#a855f7"
                              fillOpacity="0.35"
                              stroke="#c084fc"
                              strokeWidth="3.5"
                              strokeLinejoin="round"
                            />
                            <text
                              x="0"
                              y="5"
                              fill="#fb7185"
                              fontWeight="900"
                              fontSize="13"
                              fontFamily="sans-serif"
                              textAnchor="middle"
                            >
                              {t.noAxisVisualText}
                            </text>
                          </g>
                        )}

                        {/* 1. ΚΑΤΑΚΟΡΥΦΟΣ ΑΞΟΝΑΣ */}
                        {activeAxis === 'vertical' && shape !== 'scaleneTriangle' && shape !== 'equilateralTriangle' && (
                          <g>
                            {foldProgress > 0 && (
                              <g opacity="0.4">
                                {shape === 'square' && (
                                  <path d="M 0,-90 L 90,-90 L 90,90 L 0,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                                {shape === 'rectangle' && (
                                  <path d="M 0,-70 L 120,-70 L 120,70 L 0,70 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                                {shape === 'isoscelesTriangle' && (
                                  <path d="M 0,-100 L 100,80 L 0,80 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                                {shape === 'rhombus' && (
                                  <path d="M 0,-100 L 110,0 L 0,100 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                                {shape === 'circle' && (
                                  <path d="M 0,-90 A 90,90 0 0,1 0,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                              </g>
                            )}

                            {shape === 'square' && (
                              <path d="M -90,-90 L 0,-90 L 0,90 L -90,90 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                            )}
                            {shape === 'rectangle' && (
                              <path d="M -120,-70 L 0,-70 L 0,70 L -120,70 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                            )}
                            {shape === 'isoscelesTriangle' && (
                              <path d="M 0,-100 L -100,80 L 0,80 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                            )}
                            {shape === 'rhombus' && (
                              <path d="M 0,-100 L -110,0 L 0,100 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                            )}
                            {shape === 'circle' && (
                              <path d="M 0,-90 A 90,90 0 0,0 0,90 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                            )}

                            <g transform={`scale(${scaleFold}, 1)`}>
                              {shape === 'square' && (
                                <path d="M 0,-90 L 90,-90 L 90,90 L 0,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              )}
                              {shape === 'rectangle' && (
                                <path d="M 0,-70 L 120,-70 L 120,70 L 0,70 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              )}
                              {shape === 'isoscelesTriangle' && (
                                <path d="M 0,-100 L 100,80 L 0,80 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              )}
                              {shape === 'rhombus' && (
                                <path d="M 0,-100 L 110,0 L 0,100 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              )}
                              {shape === 'circle' && (
                                <path d="M 0,-90 A 90,90 0 0,1 0,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              )}
                            </g>
                          </g>
                        )}

                        {/* 2. ΟΡΙΖΟΝΤΙΟΣ ΑΞΟΝΑΣ */}
                        {activeAxis === 'horizontal' && shape !== 'scaleneTriangle' && shape !== 'equilateralTriangle' && (
                          <g>
                            {foldProgress > 0 && (
                              <g opacity="0.4">
                                {shape === 'square' && (
                                  <path d="M -90,0 L 90,0 L 90,90 L -90,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                                {shape === 'rectangle' && (
                                  <path d="M -120,0 L 120,0 L 120,70 L -120,70 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                                {shape === 'rhombus' && (
                                  <path d="M -110,0 L 0,100 L 110,0 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                                {shape === 'circle' && (
                                  <path d="M -90,0 A 90,90 0 0,0 90,0 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                              </g>
                            )}

                            {shape === 'square' && (
                              <path d="M -90,-90 L 90,-90 L 90,0 L -90,0 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                            )}
                            {shape === 'rectangle' && (
                              <path d="M -120,-70 L 120,-70 L 120,0 L -120,0 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                            )}
                            {shape === 'rhombus' && (
                              <path d="M -110,0 L 0,-100 L 110,0 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                            )}
                            {shape === 'circle' && (
                              <path d="M -90,0 A 90,90 0 0,1 90,0 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                            )}

                            <g transform={`scale(1, ${scaleFold})`}>
                              {shape === 'square' && (
                                <path d="M -90,0 L 90,0 L 90,90 L -90,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              )}
                              {shape === 'rectangle' && (
                                <path d="M -120,0 L 120,0 L 120,70 L -120,70 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              )}
                              {shape === 'rhombus' && (
                                <path d="M -110,0 L 0,100 L 110,0 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              )}
                              {shape === 'circle' && (
                                <path d="M -90,0 A 90,90 0 0,0 90,0 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              )}
                            </g>
                          </g>
                        )}

                        {/* 3. ΔΙΑΓΩΝΙΟΙ */}
                        {activeAxis === 'diag1' && shape !== 'scaleneTriangle' && shape !== 'equilateralTriangle' && (
                          <g>
                            {foldProgress > 0 && (
                              <g opacity="0.4">
                                {shape === 'square' && (
                                  <path d="M -90,-90 L 90,-90 L 90,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                                {shape === 'circle' && (
                                  <path d="M -63.6,-63.6 A 90,90 0 0,1 63.6,63.6 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                              </g>
                            )}
                            {shape === 'square' && (
                              <path d="M -90,-90 L -90,90 L 90,90 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                            )}
                            {shape === 'circle' && (
                              <path d="M -63.6,-63.6 A 90,90 0 0,0 63.6,63.6 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                            )}

                            <g transform={`rotate(-45) scale(${scaleFold}, 1) rotate(45)`}>
                              {shape === 'square' && (
                                <path d="M -90,-90 L 90,-90 L 90,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              )}
                              {shape === 'circle' && (
                                <path d="M -63.6,-63.6 A 90,90 0 0,1 63.6,63.6 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              )}
                            </g>
                          </g>
                        )}

                        {activeAxis === 'diag2' && shape !== 'scaleneTriangle' && shape !== 'equilateralTriangle' && (
                          <g>
                            {foldProgress > 0 && (
                              <g opacity="0.4">
                                {shape === 'square' && (
                                  <path d="M -90,-90 L 90,-90 L -90,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                                {shape === 'circle' && (
                                  <path d="M -63.6,63.6 A 90,90 0 0,1 63.6,-63.6 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                )}
                              </g>
                            )}
                            {shape === 'square' && (
                              <path d="M -90,90 L 90,90 L 90,-90 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                            )}
                            {shape === 'circle' && (
                              <path d="M -63.6,63.6 A 90,90 0 0,0 63.6,-63.6 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                            )}

                            <g transform={`rotate(45) scale(${scaleFold}, 1) rotate(-45)`}>
                              {shape === 'square' && (
                                <path d="M -90,-90 L 90,-90 L -90,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              )}
                              {shape === 'circle' && (
                                <path d="M -63.6,63.6 A 90,90 0 0,1 63.6,-63.6 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              )}
                            </g>
                          </g>
                        )}

                        {/* 4. ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ */}
                        {shape === 'equilateralTriangle' && (() => {
                          let rotDeg = 0;
                          if (activeAxis === 'axisA') rotDeg = 0;
                          if (activeAxis === 'axisB') rotDeg = -120;
                          if (activeAxis === 'axisC') rotDeg = 120;

                          return (
                            <g transform={`translate(0, 20) rotate(${rotDeg})`}>
                              {foldProgress > 0 && (
                                <polygon
                                  points="0,-100 86.6,50 0,50"
                                  fill="none"
                                  stroke="#f472b6"
                                  strokeWidth="2"
                                  strokeDasharray="5,5"
                                  opacity="0.4"
                                />
                              )}
                              <polygon
                                points="0,-100 -86.6,50 0,50"
                                fill="#a855f7"
                                fillOpacity="0.35"
                                stroke="#c084fc"
                                strokeWidth="3"
                              />
                              <g transform={`scale(${scaleFold}, 1)`}>
                                <polygon
                                  points="0,-100 86.6,50 0,50"
                                  fill="#ec4899"
                                  fillOpacity="0.8"
                                  stroke="#f472b6"
                                  strokeWidth="3.5"
                                />
                              </g>
                            </g>
                          );
                        })()}

                        {/* ΓΡΑΜΜΕΣ ΑΞΟΝΩΝ ΣΥΜΜΕΤΡΙΑΣ */}
                        {activeAllowedAxes.includes('vertical') && (
                          <g opacity={activeAxis === 'vertical' ? 1 : 0.25}>
                            <line
                              x1="0"
                              y1="-135"
                              x2="0"
                              y2="135"
                              stroke="#f59e0b"
                              strokeWidth={activeAxis === 'vertical' ? '4' : '2'}
                              strokeDasharray="6,6"
                            />
                          </g>
                        )}
                        {activeAllowedAxes.includes('horizontal') && (
                          <g opacity={activeAxis === 'horizontal' ? 1 : 0.25}>
                            <line
                              x1="-155"
                              y1="0"
                              x2="155"
                              y2="0"
                              stroke="#10b981"
                              strokeWidth={activeAxis === 'horizontal' ? '4' : '2'}
                              strokeDasharray="6,6"
                            />
                          </g>
                        )}
                        {activeAllowedAxes.includes('diag1') && (
                          <g opacity={activeAxis === 'diag1' ? 1 : 0.25}>
                            <line
                              x1="-125"
                              y1="-125"
                              x2="125"
                              y2="125"
                              stroke="#3b82f6"
                              strokeWidth={activeAxis === 'diag1' ? '4' : '2'}
                              strokeDasharray="6,6"
                            />
                          </g>
                        )}
                        {activeAllowedAxes.includes('diag2') && (
                          <g opacity={activeAxis === 'diag2' ? 1 : 0.25}>
                            <line
                              x1="125"
                              y1="-125"
                              x2="-125"
                              y2="125"
                              stroke="#3b82f6"
                              strokeWidth={activeAxis === 'diag2' ? '4' : '2'}
                              strokeDasharray="6,6"
                            />
                          </g>
                        )}

                        {shape === 'equilateralTriangle' && (
                          <g>
                            <line
                              x1="0"
                              y1="-115"
                              x2="0"
                              y2="95"
                              stroke="#f59e0b"
                              strokeWidth={activeAxis === 'axisA' ? '4' : '2'}
                              strokeDasharray="6,6"
                              opacity={activeAxis === 'axisA' ? 1 : 0.3}
                            />
                            <line
                              x1="-105"
                              y1="80"
                              x2="68"
                              y2="-20"
                              stroke="#10b981"
                              strokeWidth={activeAxis === 'axisB' ? '4' : '2'}
                              strokeDasharray="6,6"
                              opacity={activeAxis === 'axisB' ? 1 : 0.3}
                            />
                            <line
                              x1="105"
                              y1="80"
                              x2="-68"
                              y2="-20"
                              stroke="#3b82f6"
                              strokeWidth={activeAxis === 'axisC' ? '4' : '2'}
                              strokeDasharray="6,6"
                              opacity={activeAxis === 'axisC' ? 1 : 0.3}
                            />
                          </g>
                        )}
                      </g>
                    );
                  })()}
                </svg>
              </div>

              <p className="text-center text-xs font-bold text-slate-300 max-w-xs leading-relaxed">
                {activeData.desc}
              </p>
            </div>

            {/* CONTROLS SLIDERS & AXES SELECTION */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              {/* 1. ΕΠΙΛΟΓΗ ΕΝΕΡΓΟΥ ΑΞΟΝΑ */}
              {activeAllowedAxes.length > 0 ? (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-black uppercase text-slate-600 block">
                    {toCleanUppercase(t.selectAxisTitle)}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeAllowedAxes.includes('vertical') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'vertical')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'vertical'
                            ? 'bg-amber-500 text-slate-950 font-black border-amber-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{t.verticalAxis}</span>
                        <span>{activeAxis === 'vertical' ? '🔘' : '⚪'}</span>
                      </button>
                    )}

                    {activeAllowedAxes.includes('horizontal') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'horizontal')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'horizontal'
                            ? 'bg-emerald-600 text-white font-black border-emerald-700 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{t.horizontalAxis}</span>
                        <span>{activeAxis === 'horizontal' ? '🔘' : '⚪'}</span>
                      </button>
                    )}

                    {activeAllowedAxes.includes('diag1') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'diag1')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'diag1'
                            ? 'bg-blue-600 text-white font-black border-blue-700 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{t.diag1Axis}</span>
                        <span>{activeAxis === 'diag1' ? '🔘' : '⚪'}</span>
                      </button>
                    )}

                    {activeAllowedAxes.includes('diag2') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'diag2')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'diag2'
                            ? 'bg-blue-600 text-white font-black border-blue-700 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{t.diag2Axis}</span>
                        <span>{activeAxis === 'diag2' ? '🔘' : '⚪'}</span>
                      </button>
                    )}

                    {activeAllowedAxes.includes('axisA') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'axisA')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'axisA'
                            ? 'bg-amber-500 text-slate-950 font-black border-amber-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{t.axisA}</span>
                        <span>{activeAxis === 'axisA' ? '🔘' : '⚪'}</span>
                      </button>
                    )}

                    {activeAllowedAxes.includes('axisB') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'axisB')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'axisB'
                            ? 'bg-emerald-600 text-white font-black border-emerald-700 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{t.axisB}</span>
                        <span>{activeAxis === 'axisB' ? '🔘' : '⚪'}</span>
                      </button>
                    )}

                    {activeAllowedAxes.includes('axisC') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'axisC')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'axisC'
                            ? 'bg-blue-600 text-white font-black border-blue-700 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{t.axisC}</span>
                        <span>{activeAxis === 'axisC' ? '🔘' : '⚪'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 text-rose-800 text-xs font-bold text-center shadow-sm">
                  {t.scaleneWarning}
                </div>
              )}

              {/* 2. TOUCH SLIDER ΑΝΑΔΙΠΛΩΣΗΣ */}
              {activeAllowedAxes.length > 0 && (
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black uppercase text-purple-950 truncate">
                      {toCleanUppercase(t.foldingTitle)}
                    </span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-purple-700 text-base">
                      {foldProgress}%
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateFoldDelta(e, -10)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-purple-50 hover:bg-purple-100 active:bg-purple-200 text-purple-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.decFold}
                      aria-label={t.decFold}
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={foldProgress}
                      onChange={(e) => setFoldProgress(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-purple-600 cursor-pointer"
                    />

                    <button
                      onClick={(e) => updateFoldDelta(e, 10)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-purple-50 hover:bg-purple-100 active:bg-purple-200 text-purple-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.incFold}
                      aria-label={t.incFold}
                    >
                      ＋
                    </button>
                  </div>
                </div>
              )}

              {/* 3. ΠΙΝΑΚΑΣ ΙΣΟΤΗΤΑΣ ΠΕΡΙΜΕΤΡΟΥ & ΕΜΒΑΔΟΥ */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2.5 shadow-sm">
                <span className="text-[11px] font-black uppercase text-indigo-950 block">
                  {toCleanUppercase(t.comparisonTitle)}
                </span>

                <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
                  <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                    <span className="text-purple-900 block text-[10px] font-black">{t.part1}</span>
                    <p className="text-purple-700 font-mono text-xs sm:text-sm mt-1">
                      {t.pLabel} {activeData.halfPerimeter} {activeData.halfPerimeter !== '—' ? t.unitCm : ''}
                    </p>
                    <p className="text-purple-700 font-mono text-xs sm:text-sm">
                      {t.eLabel} {activeData.halfArea} {activeData.halfArea !== '—' ? t.unitCm2 : ''}
                    </p>
                  </div>

                  <div className="bg-pink-50 p-2.5 rounded-xl border border-pink-100">
                    <span className="text-pink-900 block text-[10px] font-black">{t.part2}</span>
                    <p className="text-pink-700 font-mono text-xs sm:text-sm mt-1">
                      {t.pLabel} {activeData.halfPerimeter} {activeData.halfPerimeter !== '—' ? t.unitCm : ''}
                    </p>
                    <p className="text-pink-700 font-mono text-xs sm:text-sm">
                      {t.eLabel} {activeData.halfArea} {activeData.halfArea !== '—' ? t.unitCm2 : ''}
                    </p>
                  </div>
                </div>

                {activeData.totalAxes !== '0' ? (
                  <p className="text-[11px] font-bold text-center text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    {t.equalPartsSuccess}
                  </p>
                ) : (
                  <p className="text-[11px] font-bold text-center text-rose-800 bg-rose-50 p-2 rounded-xl border border-rose-200">
                    {t.noSymmetricParts}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">{t.bottomTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">{t.bottomDesc}</p>
          </div>
          <Link
            href="/d-dimotikou/18-simmetria-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.startExercises}
          </Link>
        </div>
      </div>
    </Layout>
  );
}