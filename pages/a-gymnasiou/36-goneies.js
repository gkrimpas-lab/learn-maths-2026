import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Καθαρισμός τόνων για ελληνικά κεφαλαία (διατηρεί μόνο το Α')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Α')/g);
  return parts
    .map((part) => {
      if (part === "Α'") return "Α'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Βοηθητική συνάρτηση κατακόρυφης κλασματικής μορφής (Mobile safe)
const renderFraction = (num, den) =>
  `<span class="inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">` +
  `<span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${num}</span>` +
  `<span class="pt-0.5 break-all">${den}</span>` +
  `</span>`;

export default function GoneiesTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // State για το διαδραστικό εργαστήριο γωνιών
  const [angleDeg, setAngleDeg] = useState(55);
  // State για το εργαστήριο σχέσεων γωνιών (συμπληρωματικές / παραπληρωματικές / εφεξής)
  const [relationMode, setRelationMode] = useState('supplementary'); // 'free', 'complementary', 'supplementary'
  const [angle1, setAngle1] = useState(60);

  // Stepper με πλήρη αποτροπή propagation
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Συγκεντρωτικό Λεξικό i18n
  const t = {
    el: {
      badge: "Α' ΓΥΜΝΑΣΙΟΥ - ΓΕΩΜΕΤΡΙΑ",
      title: "Γωνίες: Είδη, Σύγκριση & Σχέσεις Γωνιών",
      subtitle: "Ανακάλυψε διαδραστικά πώς σχηματίζονται οι γωνίες, πώς ταξινομούνται και πώς συνδέονται μεταξύ τους.",
      btnExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",
      sections: {
        intro: "1. Τι είναι Γωνία;",
        types: "2. Είδη & Κατηγορίες Γωνιών",
        relations: "3. Σχέσεις Γωνιών: Εφεξής & Διαδοχικές",
        specialPairs: "4. Συμπληρωματικές, Παραπληρωματικές & Κατακορυφήν",
        bisector: "5. Διχοτόμος Γωνίας",
        problems: "6. Λυμένα Παραδείγματα & Προβλήματα"
      },
      interactiveLab1Title: "Διαδραστικός Μοιρογνώμονας (Εξερεύνησε τα είδη)",
      angleValue: "Μέτρο Γωνίας:",
      typeLabel: "Είδος Γωνίας:",
      interactiveLab2Title: "Εργαστήριο Σχέσεων & Ζευγών Γωνιών",
      angle1Label: "Γωνία α:",
      angle2Label: "Γωνία β:",
      sumLabel: "Άθροισμα (α ＋ β):",
      modes: {
        free: "Ελεύθερη Εφεξής",
        complementary: "Συμπληρωματικές (90°)",
        supplementary: "Παραπληρωματικές (180°)"
      },
      angleTypes: {
        zero: "Μηδενική Γωνία (0°)",
        acute: "Οξεία Γωνία (0° ＜ x ＜ 90°)",
        right: "Ορθή Γωνία (90°)",
        obtuse: "Αμβλεία Γωνία (90° ＜ x ＜ 180°)",
        straight: "Ευθεία Γωνία (180°)",
        reflex: "Μη Κυρτή / Ανακλώμενη (180° ＜ x ＜ 360°)",
        full: "Πλήρης Γωνία (360°)"
      },
      introText1: "Γωνία ονομάζεται το γεωμετρικό σχήμα που αποτελείται από δύο ημιευθείες με κοινή αρχή, μαζί με το μέρος του επιπέδου που περικλείεται μεταξύ τους.",
      introVertex: "Κορυφή της γωνίας:",
      introSides: "Πλευρές της γωνίας:",
      adjacentDesc: "Δύο γωνίες λέγονται **εφεξής** όταν έχουν την ίδια κορυφή, μία κοινή πλευρά και κανένα άλλο κοινό σημείο (δεν επικαλύπτονται).",
      consecutiveDesc: "Τρεις ή περισσότερες γωνίες λέγονται **διαδοχικές** όταν ανά δύο είναι εφεξής.",
      compDesc: "Δύο γωνίες ονομάζονται **συμπληρωματικές** όταν το άθροισμά τους ισούται ακριβώς με 90° (ορθή γωνία).",
      suppDesc: "Δύο γωνίες ονομάζονται **παραπληρωματικές** όταν το άθροισμά τους ισούται ακριβώς με 180° (ευθεία γωνία).",
      vertDesc: "Δύο γωνίες λέγονται **κατακορυφήν** όταν οι πλευρές της μίας είναι αντικείμενες ημιευθείες των πλευρών της άλλης. Οι κατακορυφήν γωνίες είναι πάντα ίσες.",
      bisectorDesc: "Διχοτόμος μιας γωνίας ονομάζεται η ημιευθεία που ξεκινά από την κορυφή της και τη χωρίζει σε δύο ίσες γωνίες.",
      solveTitle: "Λύση:",
      checkBack: "ΕΠΙΣΤΡΟΦΗ ΣΤΗΝ ΑΡΧΗ"
    },
    en: {
      badge: "GRADE 7 (A' GYMNASIUM) - GEOMETRY",
      title: "Angles: Types, Comparison & Angle Relations",
      subtitle: "Interactively explore how angles are formed, classified, and related to one another.",
      btnExercises: "GO TO EXERCISES",
      sections: {
        intro: "1. What is an Angle?",
        types: "2. Types & Classification of Angles",
        relations: "3. Angle Relations: Adjacent & Consecutive",
        specialPairs: "4. Complementary, Supplementary & Vertically Opposite",
        bisector: "5. Angle Bisector",
        problems: "6. Worked Examples & Problems"
      },
      interactiveLab1Title: "Interactive Protractor (Explore the types)",
      angleValue: "Angle Measure:",
      typeLabel: "Angle Type:",
      interactiveLab2Title: "Angle Pairs & Relations Lab",
      angle1Label: "Angle α:",
      angle2Label: "Angle β:",
      sumLabel: "Sum (α ＋ β):",
      modes: {
        free: "Free Adjacent",
        complementary: "Complementary (90°)",
        supplementary: "Supplementary (180°)"
      },
      angleTypes: {
        zero: "Zero Angle (0°)",
        acute: "Acute Angle (0° ＜ x ＜ 90°)",
        right: "Right Angle (90°)",
        obtuse: "Obtuse Angle (90° ＜ x ＜ 180°)",
        straight: "Straight Angle (180°)",
        reflex: "Reflex Angle (180° ＜ x ＜ 360°)",
        full: "Full Angle (360°)"
      },
      introText1: "An angle is the geometric figure formed by two rays sharing a common endpoint, along with the portion of the plane enclosed between them.",
      introVertex: "Vertex of the angle:",
      introSides: "Sides of the angle:",
      adjacentDesc: "Two angles are called **adjacent** when they share a common vertex and one common side, but have no other common interior points.",
      consecutiveDesc: "Three or more angles are called **consecutive** when each pair of successive angles is adjacent.",
      compDesc: "Two angles are called **complementary** when their sum is equal to 90° (a right angle).",
      suppDesc: "Two angles are called **supplementary** when their sum is equal to 180° (a straight angle).",
      vertDesc: "Two angles are called **vertically opposite** when the sides of one are opposite rays to the sides of the other. Vertically opposite angles are always equal.",
      bisectorDesc: "The bisector of an angle is the ray starting from its vertex that divides the angle into two equal angles.",
      solveTitle: "Solution:",
      checkBack: "BACK TO TOP"
    }
  };

  const currT = t[locale] || t.el;

  // Υπολογισμός τύπου γωνίας για το Εργαστήριο 1
  const getAngleTypeName = (deg) => {
    if (deg === 0) return currT.angleTypes.zero;
    if (deg > 0 && deg < 90) return currT.angleTypes.acute;
    if (deg === 90) return currT.angleTypes.right;
    if (deg > 90 && deg < 180) return currT.angleTypes.obtuse;
    if (deg === 180) return currT.angleTypes.straight;
    if (deg > 180 && deg < 360) return currT.angleTypes.reflex;
    return currT.angleTypes.full;
  };

  // Υπολογισμός γωνίας 2 για το Εργαστήριο 2 ανάλογα με το mode
  const effectiveAngle2 =
    relationMode === 'complementary'
      ? Math.max(0, 90 - angle1)
      : relationMode === 'supplementary'
      ? Math.max(0, 180 - angle1)
      : 40;

  // SVG Helper: Μετατροπή μοιρών σε συντεταγμένες τόξου
  const getRayCoordinates = (originX, originY, length, deg) => {
    const rad = ((360 - deg) * Math.PI) / 180;
    return {
      x: originX + length * Math.cos(rad),
      y: originY + length * Math.sin(rad)
    };
  };

  const lab1Ray = getRayCoordinates(140, 140, 100, angleDeg);
  const lab2RayA = getRayCoordinates(140, 140, 95, angle1);
  const lab2RayB = getRayCoordinates(140, 140, 95, angle1 + effectiveAngle2);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans selection:bg-amber-500 selection:text-slate-950">
      <Head>
        <title>{currT.title} | LearnMaths.gr</title>
        <meta name="description" content={currT.subtitle} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      {/* Main Container Ultra-Wide & Mobile Safe */}
      <main className="w-full min-w-0 max-w-full overflow-x-hidden">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 box-border">

          {/* Header Banner */}
          <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 border border-indigo-700/50 shadow-2xl p-6 sm:p-10 mb-8 sm:mb-12">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-4xl">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-amber-300 font-mono text-xs sm:text-sm uppercase tracking-wider mb-3">
                  {toCleanUppercase(currT.badge)}
                </span>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
                  {currT.title}
                </h1>
                <p className="mt-3 text-sm sm:text-base lg:text-lg text-indigo-200 leading-relaxed max-w-3xl break-words">
                  {currT.subtitle}
                </p>
              </div>

              <Link
                href="/36-goneies-ask"
                className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-amber-500/25 active:scale-95 shrink-0"
              >
                {toCleanUppercase(currT.btnExercises)}
                <span className="ml-2 font-mono">→</span>
              </Link>
            </div>
          </header>

          {/* Section 1: Τι είναι Γωνία */}
          <section className="mb-10 sm:mb-14 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-8 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4 break-words">
              {toCleanUppercase(currT.sections.intro)}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed break-words">
                <p>{currT.introText1}</p>
                <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                    <span><strong>{currT.introVertex}</strong> Το κοινό σημείο εκκίνησης <span className="font-mono text-amber-300">Ο</span>.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0"></span>
                    <span><strong>{currT.introSides}</strong> Οι δύο ημιευθείες <span className="font-mono text-indigo-300">Οχ</span> και <span className="font-mono text-indigo-300">Οψ</span>.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span><strong>Συμβολισμός:</strong> <span className="font-mono text-emerald-300 font-bold">xÔy</span> ή απλά <span className="font-mono text-emerald-300 font-bold">Ô</span>.</span>
                  </div>
                </div>
              </div>

              {/* Στατικό SVG Εισαγωγής */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[280px] sm:max-w-[320px] bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
                  <svg viewBox="0 0 200 160" className="w-full h-auto max-w-full">
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
                      </marker>
                    </defs>
                    {/* Τόξο γωνίας */}
                    <path d="M 120 120 A 40 40 0 0 0 108 92" fill="none" stroke="#f59e0b" strokeWidth="3" />
                    <text x="118" y="102" fill="#f59e0b" fontSize="12" fontWeight="bold">Ô</text>
                    {/* Πλευρές */}
                    <line x1="80" y1="120" x2="180" y2="120" stroke="#818cf8" strokeWidth="3" markerEnd="url(#arrow)" />
                    <line x1="80" y1="120" x2="140" y2="35" stroke="#818cf8" strokeWidth="3" markerEnd="url(#arrow)" />
                    {/* Κορυφή και ονόματα */}
                    <circle cx="80" cy="120" r="4" fill="#fbbf24" />
                    <text x="65" y="130" fill="#f8fafc" fontSize="13" fontWeight="bold">Ο</text>
                    <text x="180" y="138" fill="#c7d2fe" fontSize="13" fontWeight="bold">x</text>
                    <text x="145" y="32" fill="#c7d2fe" fontSize="13" fontWeight="bold">y</text>
                  </svg>
                  <span className="text-xs text-slate-400 mt-2 font-mono">xÔy (Κορυφή Ο, Πλευρές Ox, Oy)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Είδη & Κατηγορίες Γωνιών + Interactive Lab 1 */}
          <section className="mb-10 sm:mb-14 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-8 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-3 break-words">
              {toCleanUppercase(currT.sections.types)}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
              Οι γωνίες ταξινομούνται με βάση το μέγεθός τους (άνοιγμα των πλευρών τους) σε μοίρες (°):
            </p>

            {/* Διαδραστικό Εργαστήριο 1: Μοιρογνώμονας */}
            <div className="bg-slate-950 border border-indigo-900/60 rounded-2xl p-5 sm:p-7 mb-8 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-6">
                <h3 className="font-bold text-base sm:text-lg text-indigo-300">
                  🕹️ {currT.interactiveLab1Title}
                </h3>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Interactive Lab
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* SVG Οπτικοποίηση */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center">
                  <div className="w-full max-w-[320px] sm:max-w-[360px] aspect-square bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center relative shadow-lg">
                    <svg viewBox="0 0 280 280" className="w-full h-full max-w-full">
                      {/* Κύκλος μοιρογνωμόνoυ / οδηγός */}
                      <circle cx="140" cy="140" r="100" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                      {/* Σταθερή πλευρά Ox (0 μοίρες, δεξιά) */}
                      <line x1="140" y1="140" x2="245" y2="140" stroke="#94a3b8" strokeWidth="3" />
                      <circle cx="245" cy="140" r="3" fill="#94a3b8" />
                      <text x="252" y="144" fill="#94a3b8" fontSize="12" fontWeight="bold">x</text>

                      {/* Κινούμενη πλευρά Oy */}
                      <line x1="140" y1="140" x2={lab1Ray.x} y2={lab1Ray.y} stroke="#f59e0b" strokeWidth="3.5" />
                      <circle cx={lab1Ray.x} cy={lab1Ray.y} r="4" fill="#f59e0b" />
                      <text x={lab1Ray.x + 8} y={lab1Ray.y} fill="#fbbf24" fontSize="12" fontWeight="bold">y</text>

                      {/* Τόξο γωνίας */}
                      {angleDeg > 0 && angleDeg < 360 && (
                        <path
                          d={`M 175 140 A 35 35 0 ${angleDeg > 180 ? 1 : 0} 0 ${
                            140 + 35 * Math.cos(((360 - angleDeg) * Math.PI) / 180)
                          } ${140 + 35 * Math.sin(((360 - angleDeg) * Math.PI) / 180)}`}
                          fill="rgba(245, 158, 11, 0.15)"
                          stroke="#f59e0b"
                          strokeWidth="2"
                        />
                      )}

                      {/* Κορυφή Ο */}
                      <circle cx="140" cy="140" r="5" fill="#38bdf8" />
                      <text x="122" y="156" fill="#38bdf8" fontSize="14" fontWeight="bold">Ο</text>
                    </svg>

                    <div className="mt-2 text-center">
                      <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                        {angleDeg}°
                      </span>
                    </div>
                  </div>
                </div>

                {/* Χειριστήρια & Κατηγορία */}
                <div className="lg:col-span-6 flex flex-col space-y-5">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs uppercase text-slate-400 font-bold tracking-wider block mb-1">
                      {currT.typeLabel}
                    </span>
                    <span className="text-lg sm:text-xl font-black text-emerald-400 break-words">
                      {getAngleTypeName(angleDeg)}
                    </span>
                  </div>

                  {/* Slider & Steppers */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300">
                      <span>{currT.angleValue}</span>
                      <span className="font-mono font-bold text-amber-400 text-base">{angleDeg}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="1"
                      value={angleDeg}
                      onChange={(e) => setAngleDeg(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />

                    {/* Steppers */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {[-10, -1, 1, 10].map((step) => (
                        <button
                          key={step}
                          type="button"
                          onClick={(e) => handleStep(setAngleDeg, step, 0, 360, e)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono font-bold border border-slate-700 active:scale-95 transition-all"
                        >
                          {step > 0 ? `＋${step}°` : `－${Math.abs(step)}°`}
                        </button>
                      ))}
                      {/* Κουμπιά γρήγορης επιλογής */}
                      <button
                        type="button"
                        onClick={() => setAngleDeg(90)}
                        className="px-3 py-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 rounded-lg text-xs font-mono font-bold border border-indigo-700 active:scale-95 transition-all"
                      >
                        90° (Ορθή)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAngleDeg(180)}
                        className="px-3 py-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 rounded-lg text-xs font-mono font-bold border border-indigo-700 active:scale-95 transition-all"
                      >
                        180° (Ευθεία)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Πίνακας Ταξινόμησης Γωνιών */}
            <div className="w-full overflow-x-auto block border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950 text-indigo-300 font-mono text-xs uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3 sm:p-4">Είδος Γωνίας</th>
                    <th className="p-3 sm:p-4">Μέτρο (Μοίρες)</th>
                    <th className="p-3 sm:p-4">Χαρακτηριστικό</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-sans">
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-slate-200">Μηδενική</td>
                    <td className="p-3 sm:p-4 font-mono text-amber-300">0°</td>
                    <td className="p-3 sm:p-4">Οι δύο πλευρές συμπίπτουν πλήρως.</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-slate-200">Οξεία</td>
                    <td className="p-3 sm:p-4 font-mono text-amber-300">0° ＜ x ＜ 90°</td>
                    <td className="p-3 sm:p-4">Μικρότερη από μία ορθή γωνία.</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-slate-200">Ορθή</td>
                    <td className="p-3 sm:p-4 font-mono text-amber-300">90°</td>
                    <td className="p-3 sm:p-4">Οι πλευρές είναι κάθετες μεταξύ τους.</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-slate-200">Αμβλεία</td>
                    <td className="p-3 sm:p-4 font-mono text-amber-300">90° ＜ x ＜ 180°</td>
                    <td className="p-3 sm:p-4">Μεγαλύτερη από ορθή και μικρότερη από ευθεία.</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-slate-200">Ευθεία</td>
                    <td className="p-3 sm:p-4 font-mono text-amber-300">180°</td>
                    <td className="p-3 sm:p-4">Οι δύο πλευρές είναι αντικείμενες ημιευθείες.</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-slate-200">Μη Κυρτή (Ανακλώμενη)</td>
                    <td className="p-3 sm:p-4 font-mono text-amber-300">180° ＜ x ＜ 360°</td>
                    <td className="p-3 sm:p-4">Μεγαλύτερη από ευθεία γωνία.</td>
                  </tr>
                  <tr>
                    <td className="p-3 sm:p-4 font-bold text-slate-200">Πλήρης</td>
                    <td className="p-3 sm:p-4 font-mono text-amber-300">360°</td>
                    <td className="p-3 sm:p-4">Πλήρης περιστροφή της κινούμενης πλευράς.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 & 4: Σχέσεις Γωνιών & Εργαστήριο Ζευγών */}
          <section className="mb-10 sm:mb-14 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-8 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-3 break-words">
              {toCleanUppercase(currT.sections.relations)}
            </h2>

            {/* Θεωρητικές κάρτες */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-950/80 border border-slate-800 p-4 sm:p-5 rounded-xl">
                <h4 className="font-bold text-indigo-300 mb-2 text-base">📐 Εφεξής Γωνίες</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Δύο γωνίες λέγονται <strong>εφεξής</strong> όταν έχουν:
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-400 mt-2 space-y-1">
                  <li>Την ίδια κορυφή</li>
                  <li>Μία κοινή πλευρά</li>
                  <li>Κανένα άλλο κοινό σημείο (δεν «πατάει» η μία μέσα στην άλλη)</li>
                </ul>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-4 sm:p-5 rounded-xl">
                <h4 className="font-bold text-indigo-300 mb-2 text-base">📐 Διαδοχικές Γωνίες</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Τρεις ή περισσότερες γωνίες που βρίσκονται στο ίδιο επίπεδο λέγονται <strong>διαδοχικές</strong> όταν ανά δύο είναι εφεξής, τοποθετημένες στη σειρά γύρω από την ίδια κορυφή.
                </p>
              </div>
            </div>

            {/* Section 4: Συμπληρωματικές - Παραπληρωματικές - Κατακορυφήν */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-200 mb-4 break-words">
              {currT.sections.specialPairs}
            </h3>

            {/* Διαδραστικό Εργαστήριο 2: Ζεύγη Γωνιών */}
            <div className="bg-slate-950 border border-indigo-900/60 rounded-2xl p-5 sm:p-7 mb-8 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-6">
                <h4 className="font-bold text-base sm:text-lg text-indigo-300">
                  🕹️ {currT.interactiveLab2Title}
                </h4>
                {/* Mode Selectors */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => { setRelationMode('complementary'); setAngle1(40); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      relationMode === 'complementary'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {currT.modes.complementary}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRelationMode('supplementary'); setAngle1(70); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      relationMode === 'supplementary'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {currT.modes.supplementary}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* SVG Απεικόνιση Ζεύγους */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center">
                  <div className="w-full max-w-[320px] sm:max-w-[360px] aspect-square bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center relative shadow-lg">
                    <svg viewBox="0 0 280 280" className="w-full h-full max-w-full">
                      {/* Αρχική πλευρά Οx (οριζόντια) */}
                      <line x1="140" y1="140" x2="235" y2="140" stroke="#94a3b8" strokeWidth="3" />
                      <text x="240" y="144" fill="#94a3b8" fontSize="12" fontWeight="bold">x</text>

                      {/* Ενδιάμεση κοινή πλευρά Oy */}
                      <line x1="140" y1="140" x2={lab2RayA.x} y2={lab2RayA.y} stroke="#f59e0b" strokeWidth="3.5" />
                      <text x={lab2RayA.x + 6} y={lab2RayA.y} fill="#fbbf24" fontSize="12" fontWeight="bold">y</text>

                      {/* Τελική πλευρά Oz */}
                      <line x1="140" y1="140" x2={lab2RayB.x} y2={lab2RayB.y} stroke="#818cf8" strokeWidth="3.5" />
                      <text x={lab2RayB.x + 6} y={lab2RayB.y} fill="#818cf8" fontSize="12" fontWeight="bold">z</text>

                      {/* Κορυφή Ο */}
                      <circle cx="140" cy="140" r="5" fill="#38bdf8" />
                      <text x="124" y="156" fill="#38bdf8" fontSize="14" fontWeight="bold">Ο</text>
                    </svg>

                    <div className="mt-2 flex items-center justify-center gap-4 text-xs sm:text-sm font-mono">
                      <span className="text-amber-400 font-bold">α ＝ {angle1}°</span>
                      <span className="text-indigo-400 font-bold">β ＝ {effectiveAngle2}°</span>
                      <span className="text-emerald-400 font-bold">Άθροισμα ＝ {angle1 + effectiveAngle2}°</span>
                    </div>
                  </div>
                </div>

                {/* Χειριστήρια & Επεξήγηση Ζεύγους */}
                <div className="lg:col-span-6 flex flex-col space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-xs uppercase text-slate-400 font-bold tracking-wider block">
                      {relationMode === 'complementary' ? 'Συμπληρωματικές Γωνίες' : 'Παραπληρωματικές Γωνίες'}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {relationMode === 'complementary' ? currT.compDesc : currT.suppDesc}
                    </p>
                  </div>

                  {/* Slider ρύθμισης της γωνίας 1 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300">
                      <span>Ρύθμιση Γωνίας α:</span>
                      <span className="font-mono font-bold text-amber-400">{angle1}°</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max={relationMode === 'complementary' ? 85 : 175}
                      step="1"
                      value={angle1}
                      onChange={(e) => setAngle1(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Υπολογισμοί βήμα-βήμα */}
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs sm:text-sm space-y-1 font-mono text-slate-300">
                    <div>α ＝ {angle1}°</div>
                    <div>
                      β ＝ {relationMode === 'complementary' ? '90°' : '180°'} － {angle1}° ＝ <span className="text-indigo-300 font-bold">{effectiveAngle2}°</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Κάρτα Κατακορυφήν Γωνιών */}
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl">
              <h4 className="font-bold text-indigo-300 mb-2 text-base">✖️ Κατακορυφήν Γωνίες</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                {currT.vertDesc}
              </p>
              <div className="bg-indigo-950/40 border border-indigo-900/60 p-3 rounded-xl text-xs sm:text-sm text-indigo-200">
                <strong>Βασική Ιδιότητα:</strong> Αν δύο ευθείες τέμνονται, σχηματίζουν δύο ζεύγη κατακορυφήν γωνιών και τέσσερα ζεύγη παραπληρωματικών γωνιών.
              </div>
            </div>
          </section>

          {/* Section 5: Διχοτόμος Γωνίας */}
          <section className="mb-10 sm:mb-14 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-8 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4 break-words">
              {toCleanUppercase(currT.sections.bisector)}
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>{currT.bisectorDesc}</p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center gap-2">
                <span>Αν η ημιευθεία <span className="font-mono text-amber-300">Οδ</span> είναι διχοτόμος της γωνίας <span className="font-mono text-amber-300">xÔy</span>, τότε:</span>
                <span className="inline-flex items-center font-mono text-emerald-400 font-bold">
                  xÔδ ＝ δÔy ＝
                  <span
                    dangerouslySetInnerHTML={{
                      __html: renderFraction('xÔy', '2')
                    }}
                  />
                </span>
              </div>
            </div>
          </section>

          {/* Section 6: Λυμένα Παραδείγματα & Προβλήματα */}
          <section className="mb-10 sm:mb-14 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-8 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6 break-words">
              {toCleanUppercase(currT.sections.problems)}
            </h2>

            <div className="space-y-6">
              {/* Πρόβλημα 1: Συμπληρωματικές */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                    ΠΑΡΑΔΕΙΓΜΑ 1
                  </span>
                  <span className="text-xs text-slate-400">Υπολογισμός Συμπληρωματικής</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium mb-3">
                  Μία γωνία <span className="font-mono text-amber-300">ω</span> έχει μέτρο 34°. Να υπολογίσετε το μέτρο της συμπληρωματικής της γωνίας.
                </p>
                <div className="bg-slate-900/90 border-l-4 border-amber-500 p-3.5 rounded-r-xl text-xs sm:text-sm space-y-2 text-slate-300">
                  <span className="font-bold text-amber-400 block">{currT.solveTitle}</span>
                  <p>
                    Γνωρίζουμε ότι δύο γωνίες είναι συμπληρωματικές αν το άθροισμά τους είναι 90°.
                  </p>
                  <div className="inline-flex flex-wrap items-center font-mono text-slate-200">
                    <span>συμπλήρωμα ＝ 90° － 34° ＝&nbsp;</span>
                    <strong className="text-emerald-400 font-bold">56°</strong>
                  </div>
                </div>
              </div>

              {/* Πρόβλημα 2: Παραπληρωματικές με λόγο / κλάσμα */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                    ΠΑΡΑΔΕΙΓΜΑ 2
                  </span>
                  <span className="text-xs text-slate-400">Παραπληρωματικές & Κλάσματα</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium mb-3 flex flex-wrap items-center">
                  <span>Δύο γωνίες <span className="font-mono text-amber-300">α</span> και <span className="font-mono text-indigo-300">β</span> είναι εφεξής και παραπληρωματικές. Αν η γωνία <span className="font-mono text-amber-300">α</span> είναι ίση με το&nbsp;</span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: renderFraction('1', '3')
                    }}
                  />
                  <span>&nbsp;της γωνίας <span className="font-mono text-indigo-300">β</span>, να βρεθούν τα μέτρα των δύο γωνιών.</span>
                </p>
                <div className="bg-slate-900/90 border-l-4 border-indigo-500 p-3.5 rounded-r-xl text-xs sm:text-sm space-y-2 text-slate-300">
                  <span className="font-bold text-indigo-400 block">{currT.solveTitle}</span>
                  <p>
                    Επειδή οι γωνίες είναι παραπληρωματικές ισχύει: <span className="font-mono">α ＋ β ＝ 180°</span>.
                  </p>
                  <p className="flex flex-wrap items-center">
                    <span>Αν χωρίσουμε τη γωνία <span className="font-mono">β</span> σε 3 ίσα μέρη, τότε η γωνία <span className="font-mono">α</span> είναι 1 τέτοιο μέρος.</span>
                  </p>
                  <p className="flex flex-wrap items-center">
                    <span>Συνολικά έχουμε 1 ＋ 3 ＝ 4 ίσα μέρη που ισούνται με 180°:</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2 font-mono">
                    <span>1 μέρος ＝&nbsp;</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: renderFraction('180°', '4')
                      }}
                    />
                    <span>＝ 45°</span>
                  </div>
                  <div className="pt-1 text-slate-200 font-mono">
                    <div>Άρα: <span className="text-amber-300 font-bold">α ＝ 45°</span></div>
                    <div>και: <span className="text-indigo-300 font-bold">β ＝ 3 · 45° ＝ 135°</span></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Navigation Call-To-Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Έμαθες τη θεωρία για τις γωνίες;
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Δοκίμασε τις γνώσεις σου με 10 δυναμικές ασκήσεις και άμεση αξιολόγηση.
              </p>
            </div>
            <Link
              href="/36-goneies-ask"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg hover:shadow-amber-500/25 active:scale-95 shrink-0"
            >
              {toCleanUppercase(currT.btnExercises)}
              <span className="ml-2 font-mono">→</span>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
