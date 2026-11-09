// pages/e-dimotikou/23-kanonika-poligona.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Ε')/g);
  return parts
    .map((part) => {
      if (part === "Ε'") return "Ε'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

const dictionary = {
  el: {
    pageTitle: "Κανονικά Πολύγωνα - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθετε τι είναι τα κανονικά πολύγωνα (ισόπλευρα τρίγωνα, τετράγωνα, κανονικά εξάγωνα), τις γωνίες τους, τους άξονες συμμετρίας και πώς προσεγγίζουν τον κύκλο.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    badge: "ΚΕΦΑΛΑΙΟ 23 • Ε' ΔΗΜΟΤΙΚΟΥ",
    mainTitle: "Κανονικά Πολύγωνα",
    mainDesc: "Ανακαλύπτουμε την πιο συμμετρική οικογένεια πολυγώνων, όπου όλες οι πλευρές και όλες οι γωνίες είναι απόλυτα ίσες, πώς υπολογίζουμε την περίμετρό τους και πώς καθώς αυξάνονται οι πλευρές, το σχήμα μεταμορφώνεται σε κύκλο.",
    statusTheory: "Θεωρία & Δυναμικός Καμβάς Κανονικών Πολυγώνων",
    tryExercisesBtn: "Δοκίμασε τις Ασκήσεις",
    stepsSectionTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsSectionSubtitle: "Η γεωμετρική τελειότητα των κανονικών πολυγώνων, οι γωνίες και η συμμετρία τους.",
    step1Tag: "ΒΗΜΑ 1",
    step1Category: "Ορισμός",
    step1Title: "Ο Διπλός Κανόνας",
    step1Desc: "Ένα πολύγωνο ονομάζεται κανονικό όταν ικανοποιεί ταυτόχρονα δύο ιδιότητες:",
    step1Rule1Title: "1. Ισόπλευρο:",
    step1Rule1Desc: "Έχει όλες τις πλευρές ίσες μεταξύ τους.",
    step1Rule2Title: "2. Ισογώνιο:",
    step1Rule2Desc: "Έχει όλες τις γωνίες ίσες μεταξύ τους.",
    step1Tip: "Παραδείγματα: Το ισόπλευρο τρίγωνο (3 ίσες πλευρές & 3 γωνίες των 60°) και το τετράγωνο (4 ίσες πλευρές & 4 γωνίες των 90°).",
    step2Tag: "ΒΗΜΑ 2",
    step2Category: "Γωνίες",
    step2Title: "Κεντρική & Εσωτερική Γωνία",
    step2Desc: "Σε κάθε κανονικό πολύγωνο με ν πλευρές:",
    step2CentralAngleTitle: "Κεντρική Γωνία:",
    step2CentralAngleDesc: "Χωρίζει τον κύκλο σε ν ίσα μέρη:",
    step2PerimeterTitle: "Περίμετρος:",
    step2PerimeterDesc: "Επειδή όλες οι πλευρές α είναι ίσες:",
    step2Warning: "Στο κανονικό εξάγωνο, η κεντρική γωνία είναι 60° και η εσωτερική γωνία είναι 120°.",
    step3Tag: "ΒΗΜΑ 3",
    step3Category: "Συμμετρία",
    step3Title: "Άξονες Συμμετρίας",
    step3Desc: "Τα κανονικά πολύγωνα έχουν εξαιρετική γεωμετρική συμμετρία:",
    step3AxesRule: "Άξονες Συμμετρίας ＝ Αριθμός Πλευρών ( ν )",
    step3Equilateral: "Ισόπλευρο τρίγωνο",
    step3Square: "Τετράγωνο",
    step3Pentagon: "Κανονικό πεντάγωνο",
    step3Hexagon: "Κανονικό εξάγωνο",
    step3AxesUnit: "άξονες",
    step3Tip: "Όλοι οι άξονες συμμετρίας διέρχονται από το κέντρο του κανονικού πολυγώνου!",
    step4Tag: "ΒΗΜΑ 4",
    step4Category: "Συσχέτιση",
    step4Title: "Η Προσέγγιση του Κύκλου",
    step4Desc: "Όσο αυξάνουμε τον αριθμό των πλευρών σε ένα κανονικό πολύγωνο:",
    step4Point1: "Οι γωνίες ανοίγουν και πλησιάζουν τις 180°.",
    step4Point2: "Οι πλευρές μικραίνουν και το περίγραμμα ταυτίζεται σχεδόν απόλυτα με τον κύκλο!",
    step4Tip: "Με αυτήν ακριβώς τη μέθοδο υπολόγισε ο Αρχιμήδης την τιμή του αριθμού π ≈ 3,14!",
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Δυναμικός Καμβάς Κανονικών Πολυγώνων",
    labDesc: "Άλλαξε τον αριθμό των πλευρών από 3 έως 30. Παρατήρησε πώς μεταβάλλεται το σχήμα, η κεντρική και η εσωτερική γωνία και πώς το σχήμα τείνει να γίνει κύκλος.",
    controlsHeader: "ΠΛΗΘΟΣ ΠΛΕΥΡΩΝ ( 3 ΕΩΣ 30 )",
    sidesLabel: "Αριθμός Πλευρών:",
    decreaseAria: "Μείωση πλευρών κατά 1",
    increaseAria: "Αύξηση πλευρών κατά 1",
    sliderAria: "Αριθμός πλευρών κανονικού πολυγώνου",
    identityCardHeader: "ΓΕΩΜΕΤΡΙΚΗ ΤΑΥΤΟΤΗΤΑ",
    centralAngleHeader: "ΚΕΝΤΡΙΚΗ ΓΩΝΙΑ",
    interiorAngleHeader: "ΕΣΩΤΕΡΙΚΗ ΓΩΝΙΑ",
    symmetryAxesLabel: "Άξονες Συμμετρίας:",
    symmetryAxesDesc: "όσοι και οι πλευρές",
    circleConvergenceNote: "πλευρές, το σχήμα έχει πλέον σχεδόν ταυτιστεί με κύκλο!",
    canvasHeader: "ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ",
    conclusionPrefix: "Κανονικό σχήμα με",
    conclusionSides: "ίσες πλευρές",
    conclusionAngles: "ίσες γωνίες των",
    bottomBannerTitle: "Ώρα για Εξάσκηση στα Κανονικά Πολύγωνα!",
    bottomBannerDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού γωνιών, περιμέτρου, αξόνων συμμετρίας και αναγνώρισης κανονικών πολυγώνων.",
    startExercisesBtn: "Έναρξη Ασκήσεων",
    names: {
      3: 'Ισόπλευρο Τρίγωνο',
      4: 'Τετράγωνο',
      5: 'Κανονικό Πεντάγωνο',
      6: 'Κανονικό Εξάγωνο',
      7: 'Κανονικό Επτάγωνο',
      8: 'Κανονικό Οκτάγωνο',
      10: 'Κανονικό Δεκάγωνο',
      12: 'Κανονικό Δωδεκάγωνο',
      pattern: (s) => `Κανονικό ${s}-γωνο`
    },
    letters: ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ']
  },
  en: {
    pageTitle: "Regular Polygons - Grade 5 | LearnMaths.gr",
    pageDesc: "Learn what regular polygons are (equilateral triangles, squares, regular hexagons), their angles, axes of symmetry, and how they approach a circle.",
    backText: "Grade 5",
    exercisesBtn: "Exercises",
    badge: "CHAPTER 23 • GRADE 5",
    mainTitle: "Regular Polygons",
    mainDesc: "We discover the most symmetrical family of polygons, where all sides and angles are strictly congruent, how to calculate their perimeter, and how increasing the sides transforms the figure into a circle.",
    statusTheory: "Theory & Dynamic Regular Polygon Canvas",
    tryExercisesBtn: "Try the Exercises",
    stepsSectionTitle: "Core Concepts in 4 Steps",
    stepsSectionSubtitle: "Geometric perfection of regular polygons, their angles, and axes of symmetry.",
    step1Tag: "STEP 1",
    step1Category: "Definition",
    step1Title: "The Double Rule",
    step1Desc: "A polygon is called regular when it satisfies two properties simultaneously:",
    step1Rule1Title: "1. Equilateral:",
    step1Rule1Desc: "Has all of its sides equal to each other.",
    step1Rule2Title: "2. Equiangular:",
    step1Rule2Desc: "Has all of its angles equal to each other.",
    step1Tip: "Examples: The equilateral triangle (3 equal sides & 3 angles of 60°) and the square (4 equal sides & 4 angles of 90°).",
    step2Tag: "STEP 2",
    step2Category: "Angles",
    step2Title: "Central & Interior Angles",
    step2Desc: "In every regular polygon with n sides:",
    step2CentralAngleTitle: "Central Angle:",
    step2CentralAngleDesc: "Divides the circle into n equal parts:",
    step2PerimeterTitle: "Perimeter:",
    step2PerimeterDesc: "Since all side lengths a are equal:",
    step2Warning: "In a regular hexagon, the central angle is 60° and the interior angle is 120°.",
    step3Tag: "STEP 3",
    step3Category: "Symmetry",
    step3Title: "Axes of Symmetry",
    step3Desc: "Regular polygons exhibit exceptional geometric symmetry:",
    step3AxesRule: "Axes of Symmetry ＝ Number of Sides ( n )",
    step3Equilateral: "Equilateral triangle",
    step3Square: "Square",
    step3Pentagon: "Regular pentagon",
    step3Hexagon: "Regular hexagon",
    step3AxesUnit: "axes",
    step3Tip: "All axes of symmetry pass directly through the center of the regular polygon!",
    step4Tag: "STEP 4",
    step4Category: "Correlation",
    step4Title: "Approaching the Circle",
    step4Desc: "As we increase the number of sides in a regular polygon:",
    step4Point1: "The interior angles widen and approach 180°.",
    step4Point2: "The side lengths decrease and the perimeter almost completely matches a circle!",
    step4Tip: "This is the exact method Archimedes used to estimate the value of pi: π ≈ 3.14!",
    labBadge: "INTERACTIVE LABORATORY",
    labTitle: "Dynamic Regular Polygon Canvas",
    labDesc: "Change the number of sides from 3 to 30. Observe how the shape, central angle, and interior angle transform, approaching a circle.",
    controlsHeader: "NUMBER OF SIDES ( 3 TO 30 )",
    sidesLabel: "Number of Sides:",
    decreaseAria: "Decrease sides by 1",
    increaseAria: "Increase sides by 1",
    sliderAria: "Number of sides of regular polygon",
    identityCardHeader: "GEOMETRIC IDENTITY",
    centralAngleHeader: "CENTRAL ANGLE",
    interiorAngleHeader: "INTERIOR ANGLE",
    symmetryAxesLabel: "Axes of Symmetry:",
    symmetryAxesDesc: "equal to number of sides",
    circleConvergenceNote: "sides, the polygon is almost identical to a circle!",
    canvasHeader: "GEOMETRIC VISUALIZATION",
    conclusionPrefix: "Regular figure with",
    conclusionSides: "equal sides",
    conclusionAngles: "equal angles of",
    bottomBannerTitle: "Time to Practice Regular Polygons!",
    bottomBannerDesc: "Test your skills with challenging exercises on angles, perimeter, axes of symmetry, and identifying regular polygons.",
    startExercisesBtn: "Start Exercises",
    names: {
      3: 'Equilateral Triangle',
      4: 'Square',
      5: 'Regular Pentagon',
      6: 'Regular Hexagon',
      7: 'Regular Heptagon',
      8: 'Regular Octagon',
      10: 'Regular Decagon',
      12: 'Regular Dodecagon',
      pattern: (s) => `Regular ${s}-gon`
    },
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  }
};

export default function KanonikaPoligonaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = dictionary[locale];
  const numLoc = locale === 'el' ? 'el-GR' : 'en-US';

  const [sides, setSides] = useState(6);

  const getPolygonName = (s) => {
    if (t.names[s]) return t.names[s];
    return t.names.pattern(s);
  };

  const cx = 240;
  const cy = 135;
  const radius = 85;

  const pointsArray = [];
  for (let i = 0; i < sides; i++) {
    const angleRad = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = Math.round(cx + radius * Math.cos(angleRad));
    const y = Math.round(cy + radius * Math.sin(angleRad));
    pointsArray.push({ x, y });
  }

  const pointsString = pointsArray.map((p) => `${p.x},${p.y}`).join(' ');

  const centralAngleVal = 360 / sides;
  const interiorAngleVal = ((sides - 2) * 180) / sides;

  const centralAngleStr = centralAngleVal.toLocaleString(numLoc, {
    maximumFractionDigits: 1
  });

  const interiorAngleStr = interiorAngleVal.toLocaleString(numLoc, {
    maximumFractionDigits: 1
  });

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/23-kanonika-poligona-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.exercisesBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.mainTitle}
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.mainDesc}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.statusTheory}</span>
            </div>
            <Link
              href="/e-dimotikou/23-kanonika-poligona-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>{t.tryExercisesBtn}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.stepsSectionTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              {t.stepsSectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step1Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong>{t.step1Rule1Title}</strong> {t.step1Rule1Desc}
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong>{t.step1Rule2Title}</strong> {t.step1Rule2Desc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 <strong>{t.step1Tip}</strong>
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Desc}
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm font-mono">
                  {/* Κεντρική Γωνία με κανονικό κλάσμα */}
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-sans font-bold text-slate-800">• {t.step2CentralAngleTitle}</span> {t.step2CentralAngleDesc}
                    <div className="text-emerald-700 font-black pt-1.5 flex items-center gap-1.5 font-mono">
                      <span>{locale === 'el' ? 'Κεντρική Γωνία' : 'Central Angle'} ＝</span>
                      <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1 font-mono">
                        <span className="border-b border-emerald-700 w-full text-center pb-0.5">360°</span>
                        <span className="pt-0.5">{locale === 'el' ? 'ν' : 'n'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Περίμετρος */}
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-sans font-bold text-slate-800">• {t.step2PerimeterTitle}</span> {t.step2PerimeterDesc}
                    <div className="text-emerald-700 font-black pt-1 font-mono">
                      {locale === 'el' ? 'Περίμετρος ＝ ν · α' : 'Perimeter ＝ n · a'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ {t.step2Warning}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step3Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-amber-950 shadow-inner">
                    {t.step3AxesRule}
                  </div>
                  <div className="text-slate-600 text-xs font-sans text-left pt-1 space-y-0.5">
                    <div>• {t.step3Equilateral} ➔ <strong>3 {t.step3AxesUnit}</strong></div>
                    <div>• {t.step3Square} ➔ <strong>4 {t.step3AxesUnit}</strong></div>
                    <div>• {t.step3Pentagon} ➔ <strong>5 {t.step3AxesUnit}</strong></div>
                    <div>• {t.step3Hexagon} ➔ <strong>6 {t.step3AxesUnit}</strong></div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step4Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • {t.step4Point1}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    • {t.step4Point2}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΚΑΝΟΝΙΚΩΝ ΠΟΛΥΓΩΝΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {t.labBadge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.labDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Μετρήσεις */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.controlsHeader)}
              </h4>

              {/* Stepper Πλευρών */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.sidesLabel}</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-2xl text-emerald-600 bg-white px-2.5 py-0.5 rounded-xl border border-emerald-200 shadow-sm">
                    {sides}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.decreaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSides((prev) => Math.max(3, prev - 1));
                    }}
                    disabled={sides <= 3}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="3"
                    max="30"
                    step="1"
                    value={sides}
                    onChange={(e) => setSides(Number(e.target.value))}
                    aria-label={t.sliderAria}
                    className="w-full min-w-0 max-w-full accent-emerald-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.increaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSides((prev) => Math.min(30, prev + 1));
                    }}
                    disabled={sides >= 30}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά επιλογής */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {[3, 4, 5, 6, 8, 12, 24].map((val) => (
                    <button
                      key={`btn-side-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSides(val);
                      }}
                      className={`text-xs font-mono px-2.5 py-1 rounded-lg font-semibold transition ${
                        sides === val
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Ταυτότητας Κανονικού Πολυγώνου */}
              <div className="p-5 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3 shadow-sm text-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  {t.identityCardHeader}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                  {getPolygonName(sides)}
                </div>

                {/* Πίνακας Μετρήσεων με κανονική κατακόρυφη μορφή κλασμάτων */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-100 font-mono text-xs sm:text-sm font-bold text-slate-800">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-between gap-1">
                    <span className="text-slate-500 block text-[10px]">{t.centralAngleHeader}</span>
                    <div className="inline-flex items-center gap-1 font-mono text-[11px]">
                      <span className="inline-flex flex-col items-center justify-center align-middle leading-tight px-0.5">
                        <span className="border-b border-slate-700 w-full text-center pb-0.5">360°</span>
                        <span className="pt-0.5">{sides}</span>
                      </span>
                      <span>＝</span>
                    </div>
                    <strong className="text-emerald-700 text-sm font-black">{centralAngleStr}°</strong>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-between gap-1">
                    <span className="text-slate-500 block text-[10px]">{t.interiorAngleHeader}</span>
                    <div className="inline-flex items-center gap-1 font-mono text-[11px]">
                      <span className="inline-flex flex-col items-center justify-center align-middle leading-tight px-0.5">
                        <span className="border-b border-slate-700 w-full text-center pb-0.5">({sides} － 2) · 180°</span>
                        <span className="pt-0.5">{sides}</span>
                      </span>
                      <span>＝</span>
                    </div>
                    <strong className="text-emerald-700 text-sm font-black">{interiorAngleStr}°</strong>
                  </div>
                </div>

                <div className="p-2 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                  {t.symmetryAxesLabel} <strong className="text-emerald-700 font-black">{sides}</strong> ({t.symmetryAxesDesc})
                </div>

                {sides >= 20 && (
                  <div className="p-2 bg-emerald-100/60 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900 animate-pulse">
                    💡 Με {sides} {t.circleConvergenceNote}
                  </div>
                )}
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικό Σχήμα */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{t.canvasHeader}</span>
                <span className="font-mono text-emerald-700 font-bold">{getPolygonName(sides)}</span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[500px] aspect-[480/270] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 480 270"
                  className="w-full h-full drop-shadow-sm"
                  shapeRendering="geometricPrecision"
                >
                  {/* Αχνός περιγεγραμμένος κύκλος */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    className="stroke-slate-200 stroke-[1.5]"
                    strokeDasharray="4 4"
                  />

                  {/* Κανονικό Πολύγωνο */}
                  <polygon
                    points={pointsString}
                    className="fill-emerald-500/10 stroke-emerald-600 stroke-[3] stroke-linejoin-round"
                  />

                  {/* Κέντρο Πολυγώνου */}
                  <circle cx={cx} cy={cy} r="3" className="fill-slate-400" />

                  {/* Κορυφές & Ετικέτες */}
                  {pointsArray.map((point, idx) => {
                    const label = t.letters[idx] || '';

                    const dx = point.x - cx;
                    const dy = point.y - cy;
                    const len = Math.sqrt(dx * dx + dy * dy) || 1;
                    const textX = point.x + (dx / len) * 16;
                    const textY = point.y + (dy / len) * 16 + 4;

                    return (
                      <g key={idx}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={sides > 16 ? 2.5 : 4}
                          className="fill-slate-900"
                        />
                        {sides <= 10 && label && (
                          <text
                            x={textX}
                            y={textY}
                            textAnchor="middle"
                            className="font-sans text-xs font-black fill-slate-900"
                          >
                            {label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {t.conclusionPrefix} <strong>{sides} {t.conclusionSides}</strong> {locale === 'el' ? 'και' : 'and'} <strong>{sides} {t.conclusionAngles}</strong> {interiorAngleStr}°.
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.bottomBannerTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.bottomBannerDesc}
            </p>
          </div>

          <Link
            href="/e-dimotikou/23-kanonika-poligona-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {t.startExercisesBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}