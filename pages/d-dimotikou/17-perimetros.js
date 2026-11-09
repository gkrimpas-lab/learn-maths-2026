// pages/d-dimotikou/17-perimetros.js
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

// Βοηθητικό εξάρτημα για Ενιαίο Στυλ Ετικέτας Πλευράς με ασφαλή όρια
function SideLabel({ x, y, text }) {
  const safeX = Math.max(45, Math.min(405, x));
  const safeY = Math.max(25, Math.min(335, y));

  return (
    <g transform={`translate(${safeX}, ${safeY})`}>
      <rect
        x="-36"
        y="-12"
        width="72"
        height="24"
        rx="8"
        fill="#0f172a"
        fillOpacity="0.95"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />
      <text
        x="0"
        y="1"
        fill="#fbbf24"
        fontWeight="bold"
        fontSize="11.5"
        fontFamily="monospace"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {text}
      </text>
    </g>
  );
}

const translations = {
  el: {
    metaTitle: 'Υπολογισμός Περιμέτρου Σχημάτων - Θεωρία | LearnMaths.gr',
    metaDesc:
      'Μαθαίνουμε τι είναι η περίμετρος και πώς την υπολογίζουμε σε τρίγωνα, τετράγωνα, ορθογώνια και πολύγωνα με διαδραστικό γεωμετρικό εργαστήριο.',
    backText: "Δ' Δημοτικού",
    exercisesBtn: 'Ασκήσεις',
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: '📏 Υπολογισμός Περιμέτρου Σχημάτων',
    heroSubtitle:
      'Μαθαίνουμε τι είναι η περίμετρος (το συνολικό μήκος του περιγράμματος ενός σχήματος) και πώς την υπολογίζουμε προσθέτοντας όλες τις πλευρές του!',
    readyBoxTitle: 'Έτοιμος για εξάσκηση;',
    readyBoxDesc:
      'Δοκίμασε τις ασκήσεις στην περίμετρο για να σιγουρευτείς ότι κατανόησες πλήρως τους υπολογισμούς!',
    goToExercises: '🎯 Μετάβαση στις Ασκήσεις',
    theoryHeading: 'Αναλυτική Θεωρία και Κανόνες Περιμέτρου',
    cardDefTitle: 'Τι είναι η Περίμετρος;',
    cardDefDesc:
      'Περίμετρος ονομάζεται το συνολικό μήκος του εξωτερικού περιγράμματος (της «περίφραξης») ενός επίπεδου γεωμετρικού σχήματος.',
    cardRuleTitle: 'Ο Βασικός Κανόνας',
    cardRuleDesc:
      'Για να βρούμε την περίμετρο οποιουδήποτε πολυγώνου, προσθέτουμε τα μήκη όλων των πλευρών του μία προς μία!',
    cardShortcutsTitle: 'Γρήγοροι Τύποι',
    squareShortcutLabel: 'Τετράγωνο:',
    squareShortcutFormula: '4 · πλευρά',
    rectShortcutLabel: 'Ορθογώνιο:',
    rectShortcutFormula: '(2 · μήκος) ＋ (2 · πλάτος)',
    labTitle: 'Διαδραστικό Εργαστήριο Περιμέτρου',
    labSubtitle:
      'Επίλεξε γεωμετρικό σχήμα, άλλαξε τα μήκη των πλευρών και παρατήρησε τη ζωντανή προσαρμογή!',
    shapes: {
      triangle: '▲ Τρίγωνο',
      square: '❏ Τετράγωνο',
      rectangle: '▭ Ορθογώνιο',
      polygon: '⬟ Πεντάγωνο',
      hexagon: '⬢ Εξάγωνο',
    },
    perimeterResultLabel: '📏 Περίμετρος ＝',
    formulaHeader: 'ΑΝΑΛΥΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ:',
    controlsTitle: '🎛️ Μήκη Πλευρών (2 έως 18 cm)',
    sideALabel: 'ΠΛΕΥΡΑ a',
    sideALengthSuffix: '(ΜΗΚΟΣ)',
    sideBLabel: 'ΠΛΕΥΡΑ b',
    sideBWidthSuffix: '(ΠΛΑΤΟΣ)',
    sideCLabel: 'ΠΛΕΥΡΑ c',
    sideDLabel: 'ΠΛΕΥΡΑ d',
    sideELabel: 'ΠΛΕΥΡΑ e',
    sideFLabel: 'ΠΛΕΥΡΑ f',
    decrease: 'Μείωση',
    increase: 'Αύξηση',
    unitCm: 'cm',
    bottomTitle: '📝 Ώρα για Εξάσκηση!',
    bottomDesc:
      'Έμαθες να υπολογίζεις την περίμετρο σχημάτων; Δοκίμασε τις διαδραστικές ασκήσεις!',
    startExercises: 'Ξεκίνα τις Ασκήσεις ➔',
  },
  en: {
    metaTitle: 'Calculating Perimeter of Shapes - Theory | LearnMaths.gr',
    metaDesc:
      'Learn what perimeter is and how to calculate it in triangles, squares, rectangles, and polygons through an interactive geometry lab.',
    backText: 'Grade 4',
    exercisesBtn: 'Exercises',
    badge: 'GRADE 4',
    heroTitle: '📏 Calculating Perimeter of Shapes',
    heroSubtitle:
      'Learn what perimeter is (the total boundary length of a 2D shape) and how to calculate it by adding all its sides together!',
    readyBoxTitle: 'Ready for practice?',
    readyBoxDesc:
      'Try the practice exercises on perimeter to make sure you fully master all the calculations!',
    goToExercises: '🎯 Go to Exercises',
    theoryHeading: 'Detailed Theory & Perimeter Rules',
    cardDefTitle: 'What is Perimeter?',
    cardDefDesc:
      'Perimeter is the total continuous length of the outer boundary (the "fence") enclosing a flat 2D geometric shape.',
    cardRuleTitle: 'The Core Rule',
    cardRuleDesc:
      'To find the perimeter of any polygon, we simply add the lengths of all its outer sides together one by one!',
    cardShortcutsTitle: 'Shortcut Formulas',
    squareShortcutLabel: 'Square:',
    squareShortcutFormula: '4 · side',
    rectShortcutLabel: 'Rectangle:',
    rectShortcutFormula: '(2 · length) ＋ (2 · width)',
    labTitle: 'Interactive Perimeter Lab',
    labSubtitle:
      'Choose a geometric shape, adjust the side lengths, and observe real-time visual updates!',
    shapes: {
      triangle: '▲ Triangle',
      square: '❏ Square',
      rectangle: '▭ Rectangle',
      polygon: '⬟ Pentagon',
      hexagon: '⬢ Hexagon',
    },
    perimeterResultLabel: '📏 Perimeter ＝',
    formulaHeader: 'STEP-BY-STEP CALCULATION:',
    controlsTitle: '🎛️ Side Lengths (2 to 18 cm)',
    sideALabel: 'SIDE a',
    sideALengthSuffix: '(LENGTH)',
    sideBLabel: 'SIDE b',
    sideBWidthSuffix: '(WIDTH)',
    sideCLabel: 'SIDE c',
    sideDLabel: 'SIDE d',
    sideELabel: 'SIDE e',
    sideFLabel: 'SIDE f',
    decrease: 'Decrease',
    increase: 'Increase',
    unitCm: 'cm',
    bottomTitle: '📝 Time to Practice!',
    bottomDesc:
      'Learned how to calculate the perimeter of shapes? Put your skills to the test with interactive exercises!',
    startExercises: 'Start Exercises ➔',
  },
};

export default function PerimetrosTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [shape, setShape] = useState('triangle'); // 'triangle', 'square', 'rectangle', 'polygon', 'hexagon'

  // Διαστάσεις πλευρών (σε cm) - Όρια sliders: 2 έως 18
  const [sideA, setSideA] = useState(9);
  const [sideB, setSideB] = useState(6);
  const [sideC, setSideC] = useState(8);
  const [sideD, setSideD] = useState(7);
  const [sideE, setSideE] = useState(6);
  const [sideF, setSideF] = useState(8);

  // Υπολογισμός περιμέτρου & αναλυτικού τύπου
  let perimeter = 0;
  let formulaText = '';

  if (shape === 'triangle') {
    perimeter = sideA + sideB + sideC;
    formulaText = `${sideA} ＋ ${sideB} ＋ ${sideC} ＝ ${perimeter} cm`;
  } else if (shape === 'square') {
    perimeter = 4 * sideA;
    formulaText = `4 · ${sideA} ＝ ${sideA} ＋ ${sideA} ＋ ${sideA} ＋ ${sideA} ＝ ${perimeter} cm`;
  } else if (shape === 'rectangle') {
    perimeter = 2 * sideA + 2 * sideB;
    formulaText = `(2 · ${sideA}) ＋ (2 · ${sideB}) ＝ ${sideA} ＋ ${sideB} ＋ ${sideA} ＋ ${sideB} ＝ ${perimeter} cm`;
  } else if (shape === 'polygon') {
    perimeter = sideA + sideB + sideC + sideD + sideE;
    formulaText = `${sideA} ＋ ${sideB} ＋ ${sideC} ＋ ${sideD} ＋ ${sideE} ＝ ${perimeter} cm`;
  } else if (shape === 'hexagon') {
    perimeter = sideA + sideB + sideC + sideD + sideE + sideF;
    formulaText = `${sideA} ＋ ${sideB} ＋ ${sideC} ＋ ${sideD} ＋ ${sideE} ＋ ${sideF} ＝ ${perimeter} cm`;
  }

  // Σταθερή Κλίμακα: 1 cm = 13 pixels
  const PX_PER_CM = 13;

  const handleShapeSelect = (e, newShape) => {
    e.preventDefault();
    e.stopPropagation();
    setShape(newShape);
  };

  const updateSide = (e, setter, currentVal, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setter(Math.max(2, Math.min(18, currentVal + delta)));
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
          href="/d-dimotikou/17-perimetros-ask"
          className="bg-slate-900 hover:bg-black text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.badge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-amber-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroSubtitle}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.readyBoxTitle}</h3>
              <p className="text-xs text-amber-100">{t.readyBoxDesc}</p>
              <Link
                href="/d-dimotikou/17-perimetros-ask"
                className="inline-block w-full bg-slate-900 hover:bg-black text-white font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
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
            {/* 1. Ορισμός */}
            <div className="bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-amber-900 flex items-center gap-2">
                <span>🏃</span> {t.cardDefTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{t.cardDefDesc}</p>
            </div>

            {/* 2. Ο Κανόνας */}
            <div className="bg-orange-50/70 p-5 sm:p-6 rounded-2xl border border-orange-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-orange-900 flex items-center gap-2">
                <span>➕</span> {t.cardRuleTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{t.cardRuleDesc}</p>
            </div>

            {/* 3. Σύντομοι Τύποι */}
            <div className="bg-rose-50/70 p-5 sm:p-6 rounded-2xl border border-rose-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-rose-900 flex items-center gap-2">
                <span>⚡</span> {t.cardShortcutsTitle}
              </h3>
              <ul className="text-xs text-slate-700 space-y-1.5 font-mono font-bold">
                <li>
                  <strong>{t.squareShortcutLabel}</strong> {t.squareShortcutFormula}
                </li>
                <li>
                  <strong>{t.rectShortcutLabel}</strong> {t.rectShortcutFormula}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.labTitle}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">{t.labSubtitle}</p>
            </div>

            {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ ΣΧΗΜΑΤΟΣ */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              <button
                onClick={(e) => handleShapeSelect(e, 'triangle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'triangle'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.shapes.triangle}
              </button>
              <button
                onClick={(e) => handleShapeSelect(e, 'square')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'square'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.shapes.square}
              </button>
              <button
                onClick={(e) => handleShapeSelect(e, 'rectangle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'rectangle'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.shapes.rectangle}
              </button>
              <button
                onClick={(e) => handleShapeSelect(e, 'polygon')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'polygon'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.shapes.polygon}
              </button>
              <button
                onClick={(e) => handleShapeSelect(e, 'hexagon')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'hexagon'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.shapes.hexagon}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ */}
            <div className="bg-slate-950 p-4 sm:p-7 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-4">
              {/* DISPLAY RESULT BANNER */}
              <div className="bg-amber-400 text-slate-950 px-5 py-2 rounded-2xl font-black text-base sm:text-lg shadow-md flex items-center gap-2">
                <span>{t.perimeterResultLabel}</span>
                <span className="font-mono text-xl sm:text-2xl">{perimeter} {t.unitCm}</span>
              </div>

              <div className="w-full max-w-[360px] aspect-[5/4] bg-slate-900/60 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full block select-none" viewBox="0 0 450 360">
                  {/* 1. ΤΡΙΓΩΝΟ */}
                  {shape === 'triangle' && (() => {
                    const total = sideA + sideB + sideC;
                    let rA = sideA / total;
                    let rB = sideB / total;
                    let rC = sideC / total;

                    const rList = [rA, rB, rC];
                    for (let i = 0; i < 3; i++) {
                      if (rList[i] >= 0.46) {
                        const overflow = rList[i] - 0.46;
                        rList[i] = 0.46 + overflow * 0.25;
                      }
                    }
                    const sumR = rList[0] + rList[1] + rList[2];
                    rA = rList[0] / sumR;
                    rB = rList[1] / sumR;
                    rC = rList[2] / sumR;

                    const sc = total * PX_PER_CM;
                    const scA = rA * sc;
                    const scB = rB * sc;
                    const scC = rC * sc;

                    const x3 = (scC * scC + scA * scA - scB * scB) / (2 * scC);
                    const y3 = Math.sqrt(Math.max(1, scA * scA - x3 * x3));

                    const cx = (scC + x3) / 3;
                    const cy = y3 / 3;

                    const ox = 225 - cx;
                    const oy = 190 + cy;

                    const p1 = { x: ox, y: oy };
                    const p2 = { x: ox + scC, y: oy };
                    const p3 = { x: ox + x3, y: oy - y3 };

                    return (
                      <g>
                        <polygon
                          points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
                          fill="#f59e0b"
                          fillOpacity="0.25"
                          stroke="#f59e0b"
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />
                        <SideLabel x={(p1.x + p3.x) / 2 - 40} y={(p1.y + p3.y) / 2 - 10} text={`a ＝ ${sideA} cm`} />
                        <SideLabel x={(p2.x + p3.x) / 2 + 40} y={(p2.y + p3.y) / 2 - 10} text={`b ＝ ${sideB} cm`} />
                        <SideLabel x={(p1.x + p2.x) / 2} y={p1.y + 30} text={`c ＝ ${sideC} cm`} />
                      </g>
                    );
                  })()}

                  {/* 2. ΤΕΤΡΑΓΩΝΟ */}
                  {shape === 'square' && (() => {
                    const size = sideA * PX_PER_CM;
                    const x = 225 - size / 2;
                    const y = 180 - size / 2;
                    return (
                      <g>
                        <rect x={x} y={y} width={size} height={size} rx="3" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="4" />
                        <SideLabel x={225} y={y - 26} text={`a ＝ ${sideA} cm`} />
                        <SideLabel x={x + size + 44} y={180} text={`a ＝ ${sideA} cm`} />
                        <SideLabel x={225} y={y + size + 26} text={`a ＝ ${sideA} cm`} />
                        <SideLabel x={x - 44} y={180} text={`a ＝ ${sideA} cm`} />
                      </g>
                    );
                  })()}

                  {/* 3. ΟΡΘΟΓΩΝΙΟ */}
                  {shape === 'rectangle' && (() => {
                    const w = sideA * PX_PER_CM;
                    const h = sideB * PX_PER_CM;
                    const x = 225 - w / 2;
                    const y = 180 - h / 2;
                    return (
                      <g>
                        <rect x={x} y={y} width={w} height={h} rx="3" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="4" />
                        <SideLabel x={225} y={y - 26} text={`a ＝ ${sideA} cm`} />
                        <SideLabel x={x + w + 44} y={180} text={`b ＝ ${sideB} cm`} />
                        <SideLabel x={225} y={y + h + 26} text={`a ＝ ${sideA} cm`} />
                        <SideLabel x={x - 44} y={180} text={`b ＝ ${sideB} cm`} />
                      </g>
                    );
                  })()}

                  {/* 4. ΠΕΝΤΑΓΩΝΟ */}
                  {shape === 'polygon' && (() => {
                    const angles = [-90, -18, 54, 126, 198];
                    const sidesList = [sideA, sideB, sideC, sideD, sideE];

                    const pts = angles.map((a, idx) => {
                      const r = sidesList[idx] * (PX_PER_CM * 0.68);
                      const aRad = (a * Math.PI) / 180;
                      return {
                        x: 225 + r * Math.cos(aRad),
                        y: 180 + r * Math.sin(aRad),
                      };
                    });

                    const ptsStr = pts.map((p) => `${p.x},${p.y}`).join(' ');

                    const labels = pts.map((p, i) => {
                      const nextP = pts[(i + 1) % pts.length];
                      const midX = (p.x + nextP.x) / 2;
                      const midY = (p.y + nextP.y) / 2;

                      const dirX = midX - 225;
                      const dirY = midY - 180;
                      const len = Math.hypot(dirX, dirY) || 1;
                      const offset = 36;
                      return {
                        x: midX + (dirX / len) * offset,
                        y: midY + (dirY / len) * offset,
                      };
                    });

                    return (
                      <g>
                        <polygon points={ptsStr} fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="4" strokeLinejoin="round" />
                        <SideLabel x={labels[0].x} y={labels[0].y} text={`a ＝ ${sideA} cm`} />
                        <SideLabel x={labels[1].x} y={labels[1].y} text={`b ＝ ${sideB} cm`} />
                        <SideLabel x={labels[2].x} y={labels[2].y} text={`c ＝ ${sideC} cm`} />
                        <SideLabel x={labels[3].x} y={labels[3].y} text={`d ＝ ${sideD} cm`} />
                        <SideLabel x={labels[4].x} y={labels[4].y} text={`e ＝ ${sideE} cm`} />
                      </g>
                    );
                  })()}

                  {/* 5. ΕΞΑΓΩΝΟ */}
                  {shape === 'hexagon' && (() => {
                    const angles = [0, 55, 115, 180, 245, 305];
                    const sidesList = [sideA, sideB, sideC, sideD, sideE, sideF];

                    const pts = angles.map((a, idx) => {
                      const r = sidesList[idx] * (PX_PER_CM * 0.68);
                      const aRad = (a * Math.PI) / 180;
                      return {
                        x: 225 + r * Math.cos(aRad),
                        y: 180 - r * Math.sin(aRad),
                      };
                    });

                    const ptsStr = pts.map((p) => `${p.x},${p.y}`).join(' ');

                    const labels = pts.map((p, i) => {
                      const nextP = pts[(i + 1) % pts.length];
                      const midX = (p.x + nextP.x) / 2;
                      const midY = (p.y + nextP.y) / 2;

                      const dirX = midX - 225;
                      const dirY = midY - 180;
                      const len = Math.hypot(dirX, dirY) || 1;
                      const offset = 35;
                      return {
                        x: midX + (dirX / len) * offset,
                        y: midY + (dirY / len) * offset,
                      };
                    });

                    return (
                      <g>
                        <polygon points={ptsStr} fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="4" strokeLinejoin="round" />
                        <SideLabel x={labels[0].x} y={labels[0].y} text={`a ＝ ${sideA} cm`} />
                        <SideLabel x={labels[1].x} y={labels[1].y} text={`b ＝ ${sideB} cm`} />
                        <SideLabel x={labels[2].x} y={labels[2].y} text={`c ＝ ${sideC} cm`} />
                        <SideLabel x={labels[3].x} y={labels[3].y} text={`d ＝ ${sideD} cm`} />
                        <SideLabel x={labels[4].x} y={labels[4].y} text={`e ＝ ${sideE} cm`} />
                        <SideLabel x={labels[5].x} y={labels[5].y} text={`f ＝ ${sideF} cm`} />
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* FORMULA DISPLAY */}
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-center w-full shadow-sm">
                <span className="text-[11px] uppercase font-black tracking-wider block text-slate-400 mb-1">
                  {t.formulaHeader}
                </span>
                <div className="font-mono font-black text-sm sm:text-base text-amber-400 break-words">
                  {formulaText}
                </div>
              </div>
            </div>

            {/* SLIDERS ΧΕΙΡΙΣΜΟΥ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-3.5">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🎛️</span> {t.controlsTitle}
              </h3>

              {/* SLIDER A */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
                <div className="h-7 flex items-center justify-between text-center px-1">
                  <span className="text-[11px] font-black uppercase text-slate-500">
                    {toCleanUppercase(
                      `${t.sideALabel} ${shape === 'rectangle' ? t.sideALengthSuffix : ''}`
                    )}
                  </span>
                  <span className="min-w-[64px] text-center whitespace-nowrap font-mono font-black text-amber-600 text-sm">
                    {sideA} {t.unitCm}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    onClick={(e) => updateSide(e, setSideA, sideA, -1)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title={t.decrease}
                    aria-label={`${t.decrease} ${t.sideALabel}`}
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="2"
                    max="18"
                    value={sideA}
                    onChange={(e) => setSideA(Number(e.target.value))}
                    className="w-full min-w-0 max-w-full accent-amber-500 cursor-pointer"
                  />

                  <button
                    onClick={(e) => updateSide(e, setSideA, sideA, 1)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title={t.increase}
                    aria-label={`${t.increase} ${t.sideALabel}`}
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* SLIDER B */}
              {(shape === 'triangle' || shape === 'rectangle' || shape === 'polygon' || shape === 'hexagon') && (
                <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
                  <div className="h-7 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black uppercase text-slate-500">
                      {toCleanUppercase(
                        `${t.sideBLabel} ${shape === 'rectangle' ? t.sideBWidthSuffix : ''}`
                      )}
                    </span>
                    <span className="min-w-[64px] text-center whitespace-nowrap font-mono font-black text-amber-600 text-sm">
                      {sideB} {t.unitCm}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateSide(e, setSideB, sideB, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.decrease}
                      aria-label={`${t.decrease} ${t.sideBLabel}`}
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="2"
                      max="18"
                      value={sideB}
                      onChange={(e) => setSideB(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-amber-500 cursor-pointer"
                    />

                    <button
                      onClick={(e) => updateSide(e, setSideB, sideB, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.increase}
                      aria-label={`${t.increase} ${t.sideBLabel}`}
                    >
                      ＋
                    </button>
                  </div>
                </div>
              )}

              {/* SLIDER C */}
              {(shape === 'triangle' || shape === 'polygon' || shape === 'hexagon') && (
                <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
                  <div className="h-7 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black uppercase text-slate-500">
                      {toCleanUppercase(t.sideCLabel)}
                    </span>
                    <span className="min-w-[64px] text-center whitespace-nowrap font-mono font-black text-amber-600 text-sm">
                      {sideC} {t.unitCm}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateSide(e, setSideC, sideC, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.decrease}
                      aria-label={`${t.decrease} ${t.sideCLabel}`}
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="2"
                      max="18"
                      value={sideC}
                      onChange={(e) => setSideC(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-amber-500 cursor-pointer"
                    />

                    <button
                      onClick={(e) => updateSide(e, setSideC, sideC, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.increase}
                      aria-label={`${t.increase} ${t.sideCLabel}`}
                    >
                      ＋
                    </button>
                  </div>
                </div>
              )}

              {/* SLIDER D */}
              {(shape === 'polygon' || shape === 'hexagon') && (
                <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
                  <div className="h-7 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black uppercase text-slate-500">
                      {toCleanUppercase(t.sideDLabel)}
                    </span>
                    <span className="min-w-[64px] text-center whitespace-nowrap font-mono font-black text-amber-600 text-sm">
                      {sideD} {t.unitCm}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateSide(e, setSideD, sideD, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.decrease}
                      aria-label={`${t.decrease} ${t.sideDLabel}`}
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="2"
                      max="18"
                      value={sideD}
                      onChange={(e) => setSideD(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-amber-500 cursor-pointer"
                    />

                    <button
                      onClick={(e) => updateSide(e, setSideD, sideD, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.increase}
                      aria-label={`${t.increase} ${t.sideDLabel}`}
                    >
                      ＋
                    </button>
                  </div>
                </div>
              )}

              {/* SLIDER E */}
              {(shape === 'polygon' || shape === 'hexagon') && (
                <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
                  <div className="h-7 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black uppercase text-slate-500">
                      {toCleanUppercase(t.sideELabel)}
                    </span>
                    <span className="min-w-[64px] text-center whitespace-nowrap font-mono font-black text-amber-600 text-sm">
                      {sideE} {t.unitCm}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateSide(e, setSideE, sideE, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.decrease}
                      aria-label={`${t.decrease} ${t.sideELabel}`}
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="2"
                      max="18"
                      value={sideE}
                      onChange={(e) => setSideE(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-amber-500 cursor-pointer"
                    />

                    <button
                      onClick={(e) => updateSide(e, setSideE, sideE, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.increase}
                      aria-label={`${t.increase} ${t.sideELabel}`}
                    >
                      ＋
                    </button>
                  </div>
                </div>
              )}

              {/* SLIDER F */}
              {shape === 'hexagon' && (
                <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
                  <div className="h-7 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black uppercase text-slate-500">
                      {toCleanUppercase(t.sideFLabel)}
                    </span>
                    <span className="min-w-[64px] text-center whitespace-nowrap font-mono font-black text-amber-600 text-sm">
                      {sideF} {t.unitCm}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateSide(e, setSideF, sideF, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.decrease}
                      aria-label={`${t.decrease} ${t.sideFLabel}`}
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="2"
                      max="18"
                      value={sideF}
                      onChange={(e) => setSideF(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-amber-500 cursor-pointer"
                    />

                    <button
                      onClick={(e) => updateSide(e, setSideF, sideF, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title={t.increase}
                      aria-label={`${t.increase} ${t.sideFLabel}`}
                    >
                      ＋
                    </button>
                  </div>
                </div>
              )}
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
            href="/d-dimotikou/17-perimetros-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.startExercises}
          </Link>
        </div>
      </div>
    </Layout>
  );
}