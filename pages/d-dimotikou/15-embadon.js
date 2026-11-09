// pages/d-dimotikou/15-embadon.js
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
    metaTitle: 'Η Έννοια του Εμβαδού και Μετατροπές - Θεωρία | LearnMaths.gr',
    metaDesc:
      'Μαθαίνουμε τι είναι εμβαδόν, το τετραγωνικό μέτρο (τ.μ.), τα υποπολλαπλάσια (τ.δ., τ.εκ.) και τον κανόνα του 100 με διαδραστικό εργαστήριο zoom.',
    backText: "Δ' Δημοτικού",
    exercisesBtn: 'Ασκήσεις',
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: 'Η Έννοια του Εμβαδού και Μετατροπές',
    heroSubtitle:
      'Μαθαίνουμε τι είναι το εμβαδόν μιας επιφάνειας και πώς 1 τετραγωνικό μέτρο (τ.μ.) αναλύεται σε 100 τ.δ. και σε 10.000 τ.εκ.!',
    readyBoxTitle: 'Έτοιμος για εξάσκηση;',
    readyBoxDesc:
      'Δοκίμασε τις ασκήσεις στο εμβαδόν και τις μετατροπές για να σιγουρευτείς ότι τις κατανόησες πλήρως!',
    goToExercises: '🎯 Μετάβαση στις Ασκήσεις',
    theoryHeading: 'Αναλυτική Θεωρία: Τι είναι το Εμβαδόν;',
    card1Title: 'Τι είναι το Εμβαδόν;',
    card1Desc:
      'Εμβαδόν ενός γεωμετρικού σχήματος ονομάζεται το μέγεθος της εσωτερικής επιφάνειάς του (ο χώρος που περικλείεται μέσα στις γραμμές του).',
    card2Title: 'Το Τετραγωνικό Μέτρο',
    card2Desc:
      'Βασική μονάδα μέτρησης εμβαδού είναι το τετραγωνικό μέτρο (1 τ.μ.). Αντιστοιχεί στην επιφάνεια ενός τετραγώνου με πλευρά 1 μέτρο (1 m).',
    card3Title: 'Ο Κανόνας του 100',
    card3Desc:
      'Στο εμβαδόν κάθε μονάδα είναι 100 φορές μεγαλύτερη από την αμέσως μικρότερη, επειδή πολλαπλασιάζουμε μήκος επί πλάτος (10 · 10 ＝ 100)!',
    conversionsTitle: '⚡ Σχέσεις Μετατροπής Μονάδων Εμβαδού',
    conv1Label: '1 τ.μ. σε τ.δ.',
    conv1Rule: '1 τ.μ. ＝ 100 τ.δ.',
    conv1Sub: '10 dm · 10 dm ＝ 100 τ.δ.',
    conv2Label: '1 τ.δ. σε τ.εκ.',
    conv2Rule: '1 τ.δ. ＝ 100 τ.εκ.',
    conv2Sub: '10 cm · 10 cm ＝ 100 τ.εκ.',
    conv3Label: '1 τ.μ. σε τ.εκ.',
    conv3Rule: '1 τ.μ. ＝ 10.000 τ.εκ.',
    conv3Sub: '100 · 100 ＝ 10.000 τ.εκ.',
    labTitle: 'Διαδραστικό Εργαστήριο Zoom & Μετατροπών',
    labSubtitle: 'Δες πώς το 1 τ.μ. «σπάει» οπτικά σε 100 τ.δ. και σε 10.000 τ.εκ.!',
    zoomM: '1 τ.μ. (Μέτρο)',
    zoomDm: '100 τ.δ. (Δεκατόμετρα)',
    zoomCm: '10.000 τ.εκ. (Εκατοστά)',
    visualLegendM: 'Βασική Μονάδα (1 τ.μ.)',
    visualLegendDm: 'Πλέγμα 10 · 10 ＝ 100 τ.δ.',
    visualLegendCm: 'Πλέγμα 100 · 100 ＝ 10.000 τ.εκ.',
    converterTitle: '🧮 Ζωντανός Μετατροπέας Εμβαδού',
    valueIn: 'ΤΙΜΗ ΣΕ',
    decrease: 'Μείωση',
    increase: 'Αύξηση',
    placeholder: 'π.χ. 1',
    sqMeters: 'Τετραγωνικά Μέτρα (τ.μ.)',
    sqDecimeters: 'Τετραγωνικά Δεκατόμετρα (τ.δ.)',
    sqCentimeters: 'Τετραγωνικά Εκατοστά (τ.εκ.)',
    unitM2: 'τ.μ.',
    unitDm2: 'τ.δ.',
    unitCm2: 'τ.εκ.',
    bottomTitle: '📝 Ώρα για Εξάσκηση!',
    bottomDesc: 'Έμαθες το εμβαδόν και τις μετατροπές του; Δοκίμασε τις διαδραστικές ασκήσεις!',
    startExercises: 'Ξεκίνα τις Ασκήσεις ➔',
  },
  en: {
    metaTitle: 'The Concept of Area and Conversions - Theory | LearnMaths.gr',
    metaDesc:
      'Learn what area is, the square meter (sq.m), its submultiples (sq.dm, sq.cm), and the rule of 100 through an interactive zoom lab.',
    backText: 'Grade 4',
    exercisesBtn: 'Exercises',
    badge: 'GRADE 4',
    heroTitle: 'The Concept of Area and Unit Conversions',
    heroSubtitle:
      'Learn what surface area is and how 1 square meter (sq.m) breaks down into 100 sq.dm and 10,000 sq.cm!',
    readyBoxTitle: 'Ready for practice?',
    readyBoxDesc:
      'Try the practice exercises on area and unit conversions to ensure you fully master the concepts!',
    goToExercises: '🎯 Go to Exercises',
    theoryHeading: 'Detailed Theory: What is Area?',
    card1Title: 'What is Area?',
    card1Desc:
      'The area of a geometric shape is the measure of its flat surface enclosed within its boundary lines.',
    card2Title: 'The Square Meter',
    card2Desc:
      'The standard base unit for measuring area is the square meter (1 sq.m). It corresponds to the surface of a square with a side length of 1 meter (1 m).',
    card3Title: 'The Rule of 100',
    card3Desc:
      'In area measurements, each unit is 100 times larger than the immediately smaller one because we multiply length by width (10 · 10 ＝ 100)!',
    conversionsTitle: '⚡ Area Unit Conversion Relationships',
    conv1Label: '1 sq.m to sq.dm',
    conv1Rule: '1 sq.m ＝ 100 sq.dm',
    conv1Sub: '10 dm · 10 dm ＝ 100 sq.dm',
    conv2Label: '1 sq.dm to sq.cm',
    conv2Rule: '1 sq.dm ＝ 100 sq.cm',
    conv2Sub: '10 cm · 10 cm ＝ 100 sq.cm',
    conv3Label: '1 sq.m to sq.cm',
    conv3Rule: '1 sq.m ＝ 10,000 sq.cm',
    conv3Sub: '100 · 100 ＝ 10,000 sq.cm',
    labTitle: 'Interactive Zoom & Conversion Lab',
    labSubtitle: 'See how 1 sq.m visually breaks down into 100 sq.dm and 10,000 sq.cm!',
    zoomM: '1 sq.m (Meter)',
    zoomDm: '100 sq.dm (Decimeters)',
    zoomCm: '10,000 sq.cm (Centimeters)',
    visualLegendM: 'Base Unit (1 sq.m)',
    visualLegendDm: 'Grid 10 · 10 ＝ 100 sq.dm',
    visualLegendCm: 'Grid 100 · 100 ＝ 10,000 sq.cm',
    converterTitle: 'Live Area Converter',
    valueIn: 'VALUE IN',
    decrease: 'Decrease',
    increase: 'Increase',
    placeholder: 'e.g. 1',
    sqMeters: 'Square Meters (sq.m)',
    sqDecimeters: 'Square Decimeters (sq.dm)',
    sqCentimeters: 'Square Centimeters (sq.cm)',
    unitM2: 'sq.m',
    unitDm2: 'sq.dm',
    unitCm2: 'sq.cm',
    bottomTitle: '📝 Time to Practice!',
    bottomDesc: 'Mastered area and conversions? Put your knowledge to the test with interactive exercises!',
    startExercises: 'Start Exercises ➔',
  },
};

export default function EmbadonTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [valInput, setValInput] = useState('1');
  const [zoomLevel, setZoomLevel] = useState('m'); // 'm', 'dm', 'cm'

  const handleInputChange = (e) => {
    let raw = e.target.value;
    if (locale === 'el') {
      raw = raw.replace('.', ',').replace(/[^0-9,]/g, '');
    } else {
      raw = raw.replace(',', '.').replace(/[^0-9.]/g, '');
    }
    const digitsOnly = raw.replace(/[^0-9]/g, '');

    if (digitsOnly.length <= 10) {
      setValInput(raw);
    }
  };

  const parseToNumber = (val) => {
    if (!val) return 0;
    const standardized = val.replace(',', '.');
    return parseFloat(standardized) || 0;
  };

  const numericVal = parseToNumber(valInput);

  let valInM2 = 0;
  if (zoomLevel === 'm') valInM2 = numericVal;
  if (zoomLevel === 'dm') valInM2 = numericVal / 100;
  if (zoomLevel === 'cm') valInM2 = numericVal / 10000;

  const valInDm2 = valInM2 * 100;
  const valInCm2 = valInM2 * 10000;

  const formatNum = (n) => {
    if (locale === 'el') {
      if (Number.isInteger(n)) return n.toLocaleString('el-GR');
      return Number(n.toFixed(4)).toString().replace('.', ',');
    }
    if (Number.isInteger(n)) return n.toLocaleString('en-US');
    return Number(n.toFixed(4)).toString();
  };

  const handleZoomChange = (e, level, defaultVal) => {
    e.preventDefault();
    e.stopPropagation();
    setZoomLevel(level);
    setValInput(defaultVal);
  };

  const handleDelta = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    const current = parseToNumber(valInput);
    const step = zoomLevel === 'cm' ? 500 : zoomLevel === 'dm' ? 5 : 1;
    const nextVal = Math.max(1, current + delta * step);
    const formattedNext = locale === 'el' ? nextVal.toString().replace('.', ',') : nextVal.toString();
    setValInput(formattedNext);
  };

  const currentUnitLabel =
    zoomLevel === 'm' ? t.unitM2 : zoomLevel === 'dm' ? t.unitDm2 : t.unitCm2;

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/15-embadon-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.badge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroSubtitle}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.readyBoxTitle}</h3>
              <p className="text-xs text-emerald-100">{t.readyBoxDesc}</p>
              <Link
                href="/d-dimotikou/15-embadon-ask"
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
            {/* 1. Ορισμός */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>📐</span> {t.card1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{t.card1Desc}</p>
            </div>

            {/* 2. Βασική Μονάδα */}
            <div className="bg-teal-50/70 p-5 sm:p-6 rounded-2xl border border-teal-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-teal-900 flex items-center gap-2">
                <span>🟩</span> {t.card2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{t.card2Desc}</p>
            </div>

            {/* 3. Ο Κανόνας του 100 */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>🔢</span> {t.card3Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{t.card3Desc}</p>
            </div>
          </div>

          {/* ΣΧΕΣΕΙΣ ΜΕΤΑΤΡΟΠΗΣ */}
          <div className="bg-slate-950 text-white p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-amber-400 text-center sm:text-left">
              {t.conversionsTitle}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center font-mono text-xs sm:text-sm">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 block text-[11px] uppercase font-black">
                  {toCleanUppercase(t.conv1Label)}
                </span>
                <div className="text-lg sm:text-xl font-black text-white">{t.conv1Rule}</div>
                <span className="text-[11px] text-slate-400 block">{t.conv1Sub}</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-teal-400 block text-[11px] uppercase font-black">
                  {toCleanUppercase(t.conv2Label)}
                </span>
                <div className="text-lg sm:text-xl font-black text-white">{t.conv2Rule}</div>
                <span className="text-[11px] text-slate-400 block">{t.conv2Sub}</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-indigo-400 block text-[11px] uppercase font-black">
                  {toCleanUppercase(t.conv3Label)}
                </span>
                <div className="text-lg sm:text-xl font-black text-amber-300">{t.conv3Rule}</div>
                <span className="text-[11px] text-slate-400 block">{t.conv3Sub}</span>
              </div>
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

            {/* ΚΟΥΜΠΙΑ ZOOM LEVEL */}
            <div className="flex flex-wrap gap-2 self-start sm:self-auto">
              <button
                onClick={(e) => handleZoomChange(e, 'm', '1')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  zoomLevel === 'm'
                    ? 'bg-emerald-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.zoomM}
              </button>
              <button
                onClick={(e) => handleZoomChange(e, 'dm', '100')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  zoomLevel === 'dm'
                    ? 'bg-teal-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.zoomDm}
              </button>
              <button
                onClick={(e) => handleZoomChange(e, 'cm', '10000')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  zoomLevel === 'cm'
                    ? 'bg-indigo-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.zoomCm}
              </button>
            </div>
          </div>

          {/* ΟΠΤΙΚΟΠΟΙΗΣΗ ΠΛΕΓΜΑΤΟΣ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* SVG GRID VISUALIZER */}
            <div className="bg-slate-950 p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-4">
              <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square bg-emerald-950/60 rounded-2xl border-4 border-emerald-500 p-2 relative flex items-center justify-center overflow-hidden shadow-inner">
                <svg className="w-full h-full block select-none" viewBox="0 0 300 300">
                  {/* LEVEL 1: 1 τ.μ. */}
                  {zoomLevel === 'm' && (
                    <g>
                      <rect
                        x="5"
                        y="5"
                        width="290"
                        height="290"
                        rx="12"
                        fill="#065f46"
                        fillOpacity="0.35"
                        stroke="#34d399"
                        strokeWidth="3"
                        strokeDasharray="8,8"
                      />
                      <text
                        x="150"
                        y="145"
                        fill="#6ee7b7"
                        fontSize="32"
                        fontWeight="900"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        1 {t.unitM2}
                      </text>
                      <text
                        x="150"
                        y="180"
                        fill="#a7f3d0"
                        fontSize="13"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        1 m · 1 m
                      </text>
                    </g>
                  )}

                  {/* LEVEL 2: 100 τ.δ. (Πλέγμα 10 x 10) */}
                  {zoomLevel === 'dm' && (
                    <g>
                      {Array.from({ length: 10 }).map((_, r) =>
                        Array.from({ length: 10 }).map((_, c) => (
                          <rect
                            key={`${r}-${c}`}
                            x={c * 30 + 1}
                            y={r * 30 + 1}
                            width="28"
                            height="28"
                            rx="3"
                            fill="#115e59"
                            fillOpacity="0.6"
                            stroke="#2dd4bf"
                            strokeWidth="1"
                          />
                        ))
                      )}
                    </g>
                  )}

                  {/* LEVEL 3: 10.000 τ.εκ. */}
                  {zoomLevel === 'cm' && (
                    <g>
                      {Array.from({ length: 20 }).map((_, r) =>
                        Array.from({ length: 20 }).map((_, c) => (
                          <rect
                            key={`${r}-${c}`}
                            x={c * 15 + 0.5}
                            y={r * 15 + 0.5}
                            width="14"
                            height="14"
                            rx="1"
                            fill="#312e81"
                            fillOpacity="0.4"
                            stroke="#818cf8"
                            strokeWidth="0.5"
                            strokeOpacity="0.4"
                          />
                        ))
                      )}
                      <rect
                        x="30"
                        y="105"
                        width="240"
                        height="90"
                        rx="14"
                        fill="#020617"
                        fillOpacity="0.9"
                        stroke="#6366f1"
                        strokeWidth="2"
                      />
                      <text
                        x="150"
                        y="145"
                        fill="#a5b4fc"
                        fontSize="20"
                        fontWeight="900"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {locale === 'el' ? '10.000' : '10,000'} {t.unitCm2}
                      </text>
                      <text
                        x="150"
                        y="172"
                        fill="#c7d2fe"
                        fontSize="12"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        100 cm · 100 cm
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block text-center">
                {toCleanUppercase(
                  zoomLevel === 'm'
                    ? t.visualLegendM
                    : zoomLevel === 'dm'
                    ? t.visualLegendDm
                    : t.visualLegendCm
                )}
              </span>
            </div>

            {/* ΖΩΝΤΑΝΟΣ ΜΕΤΑΤΡΟΠΕΑΣ ΕΜΒΑΔΟΥ */}
            <div className="bg-slate-50 p-5 sm:p-7 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.converterTitle}
              </h3>

              {/* Touch Stepper & Input */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <div className="h-8 flex items-center justify-between text-center px-1">
                  <span className="text-[11px] font-black uppercase text-slate-500 truncate">
                    {toCleanUppercase(`${t.valueIn} ${currentUnitLabel}`)}
                  </span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-emerald-600 text-base">
                    {valInput} {currentUnitLabel}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    onClick={(e) => handleDelta(e, -1)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title={t.decrease}
                    aria-label={t.decrease}
                  >
                    －
                  </button>

                  <input
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    id="area-calc-val"
                    name="area-calc-val"
                    value={valInput}
                    onChange={handleInputChange}
                    className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder={t.placeholder}
                  />

                  <button
                    onClick={(e) => handleDelta(e, 1)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title={t.increase}
                    aria-label={t.increase}
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* ΠΙΝΑΚΑΣ ΑΥΤΟΜΑΤΗΣ ΜΕΤΑΤΡΟΠΗΣ */}
              <div className="space-y-2.5">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <span className="text-xs font-bold text-slate-600">{t.sqMeters}</span>
                  <span className="text-base sm:text-lg font-mono font-black text-emerald-600">
                    {formatNum(valInM2)} {t.unitM2}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <span className="text-xs font-bold text-slate-600">{t.sqDecimeters}</span>
                  <span className="text-base sm:text-lg font-mono font-black text-teal-600">
                    {formatNum(valInDm2)} {t.unitDm2}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <span className="text-xs font-bold text-slate-600">{t.sqCentimeters}</span>
                  <span className="text-base sm:text-lg font-mono font-black text-indigo-600">
                    {formatNum(valInCm2)} {t.unitCm2}
                  </span>
                </div>
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
            href="/d-dimotikou/15-embadon-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.startExercises}
          </Link>
        </div>
      </div>
    </Layout>
  );
}