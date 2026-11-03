import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ============================================================================
// ΕΠΑΝΑΧΡΗΣΙΜΟΠΟΙΗΣΙΜΟ COMPONENT ΚΛΑΣΜΑΤΟΣ (Πρόσημο πάντα μπροστά από τη γραμμή)
// ============================================================================
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 align-middle mx-1 font-mono ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-1.5 border-b-2 w-full text-center" style={{ borderColor: 'currentColor' }}>
          {displayNum}
        </span>
        <span className="pt-0.5 px-1.5 w-full text-center">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

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

export default function GoneiesTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 1: Μοιρογνώμονας & Είδη Γωνιών (0° - 360°)
  // --------------------------------------------------------------------------
  const [angleDeg, setAngleDeg] = useState(55);

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 2: Εφεξής, Συμπληρωματικές, Παραπληρωματικές & Κατακορυφήν
  // modes: 'adjacent' | 'complementary' | 'supplementary' | 'vertical'
  // --------------------------------------------------------------------------
  const [relationMode, setRelationMode] = useState('complementary');
  const [angleA, setAngleA] = useState(35);

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 3: Διχοτόμος Γωνίας
  // --------------------------------------------------------------------------
  const [bisectMainAngle, setBisectMainAngle] = useState(70);

  // Stepper με πλήρη αποτροπή event propagation
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // --------------------------------------------------------------------------
  // ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n
  // --------------------------------------------------------------------------
  const t = {
    el: {
      pageTitle: "Γωνίες: Είδη, Σύγκριση & Σχέσεις Γωνιών | Α' Γυμνασίου",
      pageDesc: "Έννοια γωνίας, είδη γωνιών, σύγκριση, εφεξής, διαδοχικές, συμπληρωματικές, παραπληρωματικές, κατακορυφήν γωνίες και διχοτόμος με διαδραστικά εργαστήρια.",
      backText: "Α' Γυμνασίου",
      btnExercises: "ΑΣΚΗΣΕΙΣ",
      bannerBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ ΓΕΩΜΕΤΡΙΑΣ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
      bannerTitle: "Γωνίες: Είδη, Σύγκριση & Σχέσεις Γωνιών",
      bannerSubtitle: "Εξερευνούμε διαδραστικά πώς σχηματίζονται οι γωνίες, τα είδη τους (οξεία, ορθή, αμβλεία, ευθεία κ.ά.), τις εφεξής και διαδοχικές γωνίες, τα ειδικά ζεύγη και τη διχοτόμο.",
      sec1Title: "Έννοια της Γωνίας, Κορυφή, Πλευρές & Είδη Γωνιών",
      sec2Title: "Σχέσεις Γωνιών: Εφεξής, Συμπληρωματικές, Παραπληρωματικές & Κατακορυφήν",
      sec3Title: "Διχοτόμος Γωνίας",
      sec4Title: "Παραδείγματα με Προβλήματα",
      lab1Header: "Εργαστήριο 1: Διαδραστικός Μοιρογνώμονας — Περίστρεψε την πλευρά Oy και δες το είδος της γωνίας",
      lab2Header: "Εργαστήριο 2: Πειραματίσου με τα Ζεύγη Γωνιών (Εφεξής, Συμπληρωματικές, Παραπληρωματικές, Κατακορυφήν)",
      lab3Header: "Εργαστήριο 3: Διχοτόμος Γωνίας — Ζωντανός Χωρισμός σε 2 Ίσα Μέρη",
      angleMeasure: "ΜΕΤΡΟ ΓΩΝΙΑΣ",
      angleType: "ΕΙΔΟΣ ΓΩΝΙΑΣ",
      types: {
        zero: "Μηδενική Γωνία (0°)",
        acute: "Οξεία Γωνία (0° ＜ x ＜ 90°)",
        right: "Ορθή Γωνία (90°)",
        obtuse: "Αμβλεία Γωνία (90° ＜ x ＜ 180°)",
        straight: "Ευθεία Γωνία (180°)",
        reflex: "Μη Κυρτή / Ανακλώμενη (180° ＜ x ＜ 360°)",
        full: "Πλήρης Γωνία (360°)"
      },
      relModes: {
        adjacent: "ΕΦΕΞΗΣ ΓΩΝΙΕΣ",
        complementary: "ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ (90°)",
        supplementary: "ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ (180°)",
        vertical: "ΚΑΤΑΚΟΡΥΦΗΝ (ΙΣΕΣ)"
      }
    },
    en: {
      pageTitle: "Angles: Types, Comparison & Relations | Grade 7",
      pageDesc: "Concept of angle, types, comparison, adjacent, consecutive, complementary, supplementary, vertically opposite angles and bisector with interactive labs.",
      backText: "Grade 7",
      btnExercises: "EXERCISES",
      bannerBadge: "GRADE 7 (A' GYMNASIUM) • GEOMETRY • THEORY & LAB",
      bannerTitle: "Angles: Types, Comparison & Angle Relations",
      bannerSubtitle: "Interactively explore how angles are formed, their types (acute, right, obtuse, straight, etc.), adjacent and consecutive angles, special pairs, and angle bisectors.",
      sec1Title: "Concept of Angle, Vertex, Sides & Angle Types",
      sec2Title: "Angle Relations: Adjacent, Complementary, Supplementary & Vertically Opposite",
      sec3Title: "Angle Bisector",
      sec4Title: "Worked Examples & Problems",
      lab1Header: "Lab 1: Interactive Protractor — Rotate ray Oy to see the resulting angle classification",
      lab2Header: "Lab 2: Experiment with Angle Pairs (Adjacent, Complementary, Supplementary, Vertically Opposite)",
      lab3Header: "Lab 3: Angle Bisector — Live Equal Division into 2 Halves",
      angleMeasure: "ANGLE MEASURE",
      angleType: "ANGLE TYPE",
      types: {
        zero: "Zero Angle (0°)",
        acute: "Acute Angle (0° ＜ x ＜ 90°)",
        right: "Right Angle (90°)",
        obtuse: "Obtuse Angle (90° ＜ x ＜ 180°)",
        straight: "Straight Angle (180°)",
        reflex: "Reflex Angle (180° ＜ x ＜ 360°)",
        full: "Full Angle (360°)"
      },
      relModes: {
        adjacent: "ADJACENT ANGLES",
        complementary: "COMPLEMENTARY (90°)",
        supplementary: "SUPPLEMENTARY (180°)",
        vertical: "VERTICALLY OPPOSITE"
      }
    }
  };

  const curr = t[locale] || t.el;

  // Βοηθητική συνάρτηση ταξινόμησης γωνίας για το Εργαστήριο 1
  const getAngleTypeInfo = (deg) => {
    if (deg === 0) return { name: curr.types.zero, color: 'text-slate-300' };
    if (deg > 0 && deg < 90) return { name: curr.types.acute, color: 'text-amber-400' };
    if (deg === 90) return { name: curr.types.right, color: 'text-emerald-400' };
    if (deg > 90 && deg < 180) return { name: curr.types.obtuse, color: 'text-sky-400' };
    if (deg === 180) return { name: curr.types.straight, color: 'text-indigo-400' };
    if (deg > 180 && deg < 360) return { name: curr.types.reflex, color: 'text-purple-400' };
    return { name: curr.types.full, color: 'text-rose-400' };
  };

  const angleTypeInfo = useMemo(() => getAngleTypeInfo(angleDeg), [angleDeg, locale]);

  // Υπολογισμοί Εργαστηρίου 2: Γωνία Β ανάλογα με τη λειτουργία
  const angleB = useMemo(() => {
    if (relationMode === 'complementary') return Math.max(0, 90 - angleA);
    if (relationMode === 'supplementary') return Math.max(0, 180 - angleA);
    if (relationMode === 'vertical') return angleA;
    return 45; // 'adjacent' σταθερή ενδεικτική δεύτερη γωνία
  }, [relationMode, angleA]);

  const pairSum = useMemo(() => {
    if (relationMode === 'vertical') return null;
    return angleA + angleB;
  }, [relationMode, angleA, angleB]);

  // Helper για συντεταγμένες ακτίνας (κέντρο cx, cy, ακτίνα r, μοίρες deg)
  const getRayPoint = (cx, cy, r, deg) => {
    const rad = ((360 - deg) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  const rayLab1 = useMemo(() => getRayPoint(240, 150, 110, angleDeg), [angleDeg]);
  const rayLab2_A = useMemo(() => getRayPoint(240, 150, 105, angleA), [angleA]);
  const rayLab2_B = useMemo(
    () => getRayPoint(240, 150, 105, relationMode === 'vertical' ? 180 : angleA + angleB),
    [angleA, angleB, relationMode]
  );
  const rayLab2_OppA = useMemo(() => getRayPoint(240, 150, 105, (angleA + 180) % 360), [angleA]);

  // Υπολογισμοί Εργαστηρίου 3 (Διχοτόμος)
  const bisectHalf = useMemo(() => bisectMainAngle / 2, [bisectMainAngle]);
  const rayBisectMain = useMemo(() => getRayPoint(240, 150, 110, bisectMainAngle), [bisectMainAngle]);
  const rayBisectMid = useMemo(() => getRayPoint(240, 150, 110, bisectHalf), [bisectHalf]);

  return (
    <Layout
      title={curr.pageTitle}
      description={curr.pageDesc}
      backUrl="/a-gymnasiou"
      backText={curr.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/36-goneies-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(curr.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              {toCleanUppercase(curr.bannerBadge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {curr.bannerTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words">
              {curr.bannerSubtitle}
            </p>
          </div>
        </section>

        {/* ====================================================================
            1. ΕΝΝΟΙΑ ΓΩΝΙΑΣ, ΚΟΡΥΦΗ, ΠΛΕΥΡΕΣ & ΕΙΔΗ ΓΩΝΙΩΝ + ΕΡΓΑΣΤΗΡΙΟ 1
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              {curr.sec1Title}
            </h2>
          </div>

          {/* Κάρτες Θεωρίας Ενότητας 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm leading-relaxed text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                1. ΟΡΙΣΜΟΣ ΓΩΝΙΑΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Κορυφή & Πλευρές</h3>
              <p className="text-slate-600">
                Γωνία ονομάζεται το γεωμετρικό σχήμα που αποτελείται από δύο ημιευθείες <strong>Ox</strong> και <strong>Oy</strong> με κοινή αρχή το <strong>O (κορυφή)</strong>, μαζί με το μέρος του επιπέδου που ορίζουν. Συμβολίζεται: <strong>xÔy</strong> ή απλά <strong>Ô</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                2. ΟΡΘΗ & ΕΥΘΕΙΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Γωνίες Αναφοράς</h3>
              <p className="text-slate-600">
                <strong>Ορθή</strong> είναι η γωνία ίση με <strong>90°</strong> (κάθετες πλευρές). <strong>Ευθεία</strong> είναι η γωνία ίση με <strong>180°</strong>, της οποίας οι πλευρές είναι αντικείμενες ημιευθείες πάνω στην ίδια ευθεία.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                3. ΟΞΕΙΑ & ΑΜΒΛΕΙΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Σύγκριση με την Ορθή</h3>
              <p className="text-slate-600">
                <strong>Οξεία</strong> είναι κάθε γωνία μικρότερη από ορθή (<strong>0° ＜ x ＜ 90°</strong>). <strong>Αμβλεία</strong> είναι κάθε γωνία μεγαλύτερη από ορθή και μικρότερη από ευθεία (<strong>90° ＜ x ＜ 180°</strong>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded inline-block">
                4. ΜΗ ΚΥΡΤΗ & ΠΛΗΡΗΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Μεγαλύτερες των 180°</h3>
              <p className="text-slate-600">
                <strong>Μη κυρτή (ανακλώμενη)</strong> ονομάζεται η γωνία με <strong>180° ＜ x ＜ 360°</strong>. <strong>Πλήρης</strong> ονομάζεται η γωνία <strong>360°</strong> (πλήρης περιστροφή της κινούμενης πλευράς).
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΟΣ ΜΟΙΡΟΓΝΩΜΟΝΑΣ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ {curr.lab1Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Χειριστήρια & Κατηγοριοποίηση (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>{curr.angleMeasure}</span>
                    <span className="text-base font-mono font-black text-indigo-700">{angleDeg}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={angleDeg}
                    onChange={(e) => setAngleDeg(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Steppers & Presets */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    ΜΙΚΡΟΡΥΘΜΙΣΗ & ΣΥΝΗΘΗ ΜΕΤΡΑ
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[-10, -1, 1, 10].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={(e) => handleStep(setAngleDeg, step, 0, 360, e)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 font-bold text-xs font-mono hover:bg-slate-100 active:scale-95"
                      >
                        {step > 0 ? `＋${step}°` : `－${Math.abs(step)}°`}
                      </button>
                    ))}
                    {[0, 45, 90, 135, 180, 270, 360].map((pVal) => (
                      <button
                        key={pVal}
                        type="button"
                        onClick={() => setAngleDeg(pVal)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all active:scale-95 ${
                          angleDeg === pVal
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pVal}°
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    {curr.angleType}
                  </span>
                  <div className="font-bold text-sm sm:text-base text-slate-900">
                    {angleTypeInfo.name}
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer (7 cols) */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΟΠΤΙΚΟΠΟΙΗΣΗ ΜΟΙΡΟΓΝΩΜΟΝΑ (0° - 360°)
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans">
                    xÔy ＝ {angleDeg}°
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg viewBox="0 0 480 270" className="w-full max-w-[460px] h-auto">
                    {/* Κυκλικός οδηγός μοιρογνωμόνα */}
                    <circle cx="240" cy="150" r="110" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />

                    {/* Βαθμονομημένες γραμμές κάθε 30° */}
                    {Array.from({ length: 12 }).map((_, idx) => {
                      const ang = idx * 30;
                      const ptInner = getRayPoint(240, 150, 103, ang);
                      const ptOuter = getRayPoint(240, 150, 110, ang);
                      return (
                        <line
                          key={ang}
                          x1={ptInner.x}
                          y1={ptInner.y}
                          x2={ptOuter.x}
                          y2={ptOuter.y}
                          stroke="#475569"
                          strokeWidth="1.5"
                        />
                      );
                    })}

                    {/* Σταθερή ημιευθεία Ox (δεξιά, 0°) */}
                    <line x1="240" y1="150" x2="365" y2="150" stroke="#94a3b8" strokeWidth="3.5" />
                    <circle cx="365" cy="150" r="4" fill="#94a3b8" />
                    <text x="378" y="154" fill="#94a3b8" fontSize="13" fontWeight="bold">x</text>

                    {/* Κινούμενη ημιευθεία Oy */}
                    <line x1="240" y1="150" x2={rayLab1.x} y2={rayLab1.y} stroke="#f59e0b" strokeWidth="4" />
                    <circle cx={rayLab1.x} cy={rayLab1.y} r="5" fill="#f59e0b" />
                    <text x={rayLab1.x + 8} y={rayLab1.y + 4} fill="#fde68a" fontSize="13" fontWeight="bold">y</text>

                    {/* Τόξο γωνίας */}
                    {angleDeg > 0 && angleDeg < 360 && (
                      <path
                        d={`M 275 150 A 35 35 0 ${angleDeg > 180 ? 1 : 0} 0 ${
                          240 + 35 * Math.cos(((360 - angleDeg) * Math.PI) / 180)
                        } ${150 + 35 * Math.sin(((360 - angleDeg) * Math.PI) / 180)}`}
                        fill="rgba(245, 158, 11, 0.2)"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Κορυφή O */}
                    <circle cx="240" cy="150" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="240" y="174" fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="middle">O</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                  Η γωνία <strong>xÔy ({angleDeg}°)</strong> ταξινομείται ως <strong className={angleTypeInfo.color}>{angleTypeInfo.name}</strong>.
                  {angleDeg === 90 && ' Οι ημιευθείες Ox και Oy είναι κάθετες μεταξύ τους (Ox ⊥ Oy).'}
                  {angleDeg === 180 && ' Οι ημιευθείες Ox και Oy είναι αντικείμενες και σχηματίζουν μία ενιαία ευθεία xy.'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            2. ΣΧΕΣΕΙΣ ΓΩΝΙΩΝ & ΕΡΓΑΣΤΗΡΙΟ 2 (ΕΦΕΞΗΣ, ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ, ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ, ΚΑΤΑΚΟΡΥΦΗΝ)
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              {curr.sec2Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm leading-relaxed text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                ΕΦΕΞΗΣ & ΔΙΑΔΟΧΙΚΕΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Κοινή Πλευρά & Κορυφή</h3>
              <p className="text-slate-600">
                Δύο γωνίες λέγονται <strong>εφεξής</strong> όταν έχουν κοινή κορυφή, μία κοινή πλευρά και κανένα άλλο κοινό σημείο. Τρεις ή περισσότερες γωνίες λέγονται <strong>διαδοχικές</strong> όταν ανά δύο είναι εφεξής.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Άθροισμα ＝ 90°</h3>
              <p className="text-slate-600">
                Δύο γωνίες ονομάζονται <strong>συμπληρωματικές</strong> όταν το άθροισμα των μέτρων τους ισούται με <strong>90°</strong> (μία ορθή γωνία). Κάθε μία λέγεται <strong>συμπλήρωμα</strong> της άλλης.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Άθροισμα ＝ 180°</h3>
              <p className="text-slate-600">
                Δύο γωνίες ονομάζονται <strong>παραπληρωματικές</strong> όταν το άθροισμα των μέτρων τους ισούται με <strong>180°</strong> (μία ευθεία γωνία). Κάθε μία λέγεται <strong>παραπλήρωμα</strong> της άλλης.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded inline-block">
                ΚΑΤΑΚΟΡΥΦΗΝ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Αντικείμενες Πλευρές</h3>
              <p className="text-slate-600">
                Δύο γωνίες λέγονται <strong>κατακορυφήν</strong> όταν οι πλευρές της μίας είναι αντικείμενες ημιευθείες των πλευρών της άλλης. <strong>Οι κατακορυφήν γωνίες είναι πάντα ίσες μεταξύ τους</strong>.
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΖΕΥΓΩΝ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ {curr.lab2Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Χειριστήρια & Επιλογή Mode (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'complementary', label: curr.relModes.complementary },
                    { id: 'supplementary', label: curr.relModes.supplementary },
                    { id: 'adjacent', label: curr.relModes.adjacent },
                    { id: 'vertical', label: curr.relModes.vertical }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setRelationMode(m.id);
                        if (m.id === 'complementary' && angleA >= 90) setAngleA(40);
                      }}
                      className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-center ${
                        relationMode === m.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Ρύθμιση Γωνίας Α */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>ΡΥΘΜΙΣΗ ΓΩΝΙΑΣ α</span>
                    <span className="font-mono font-black text-amber-700 text-sm">{angleA}°</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max={relationMode === 'complementary' ? 85 : relationMode === 'supplementary' ? 175 : 160}
                    step="1"
                    value={angleA}
                    onChange={(e) => setAngleA(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="flex gap-1.5 pt-1">
                    {[-5, -1, 1, 5].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={(e) =>
                          handleStep(
                            setAngleA,
                            step,
                            5,
                            relationMode === 'complementary' ? 85 : relationMode === 'supplementary' ? 175 : 160,
                            e
                          )
                        }
                        className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-xs font-mono active:scale-95"
                      >
                        {step > 0 ? `＋${step}°` : `－${Math.abs(step)}°`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                  <div>• <strong>Γωνία α:</strong> {angleA}°</div>
                  <div>• <strong>Γωνία β:</strong> {angleB}°</div>
                  {pairSum !== null && (
                    <div className="font-bold text-indigo-700 pt-0.5 border-t border-slate-100">
                      • Άθροισμα (α ＋ β): {angleA} ＋ {angleB} ＝ {pairSum}°
                    </div>
                  )}
                  {relationMode === 'vertical' && (
                    <div className="font-bold text-emerald-700 pt-0.5 border-t border-slate-100">
                      • Κατακορυφήν: α ＝ β ＝ {angleA}° (ΠΑΝΤΑ ΙΣΕΣ)
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic SVG Ζεύγους (7 cols) */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΠΕΙΚΟΝΙΣΗ ΣΧΕΣΗΣ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    {relationMode === 'complementary' && 'ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ (90°)'}
                    {relationMode === 'supplementary' && 'ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ (180°)'}
                    {relationMode === 'adjacent' && 'ΕΦΕΞΗΣ ΓΩΝΙΕΣ'}
                    {relationMode === 'vertical' && 'ΚΑΤΑΚΟΡΥΦΗΝ (ΙΣΕΣ)'}
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg viewBox="0 0 480 270" className="w-full max-w-[460px] h-auto">
                    {/* Αρχική πλευρά Ox (οριζόντια, 0°) */}
                    <line x1="240" y1="150" x2="355" y2="150" stroke="#94a3b8" strokeWidth="3" />
                    <circle cx="355" cy="150" r="4" fill="#94a3b8" />
                    <text x="368" y="154" fill="#94a3b8" fontSize="13" fontWeight="bold">x</text>

                    {/* Ενδιάμεση κοινή πλευρά Oy */}
                    <line x1="240" y1="150" x2={rayLab2_A.x} y2={rayLab2_A.y} stroke="#f59e0b" strokeWidth="3.5" />
                    <circle cx={rayLab2_A.x} cy={rayLab2_A.y} r="4.5" fill="#f59e0b" />
                    <text x={rayLab2_A.x + 8} y={rayLab2_A.y} fill="#fde68a" fontSize="13" fontWeight="bold">y</text>

                    {/* Τρίτη πλευρά Oz (ή αντίθετη Ox για κατακορυφήν) */}
                    <line x1="240" y1="150" x2={rayLab2_B.x} y2={rayLab2_B.y} stroke="#38bdf8" strokeWidth="3.5" />
                    <circle cx={rayLab2_B.x} cy={rayLab2_B.y} r="4.5" fill="#38bdf8" />
                    <text x={rayLab2_B.x - 12} y={rayLab2_B.y} fill="#38bdf8" fontSize="13" fontWeight="bold">z</text>

                    {/* Αντικείμενη ακτίνα για κατακορυφήν */}
                    {relationMode === 'vertical' && (
                      <g>
                        <line x1="240" y1="150" x2={rayLab2_OppA.x} y2={rayLab2_OppA.y} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 3" />
                        <text x={rayLab2_OppA.x - 12} y={rayLab2_OppA.y + 12} fill="#fde68a" fontSize="12">y'</text>
                        <line x1="240" y1="150" x2="125" y2="150" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 3" />
                        <text x="110" y="154" fill="#94a3b8" fontSize="12">x'</text>
                      </g>
                    )}

                    {/* Κορυφή O */}
                    <circle cx="240" cy="150" r="6" fill="#ffffff" />
                    <text x="240" y="174" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">O</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                  {relationMode === 'complementary' && (
                    <div>
                      Οι γωνίες <strong>α ({angleA}°)</strong> και <strong>β ({angleB}°)</strong> είναι <strong>συμπληρωματικές</strong>: σχηματίζουν μαζί μία ορθή γωνία xÔz ＝ 90°.
                    </div>
                  )}
                  {relationMode === 'supplementary' && (
                    <div>
                      Οι γωνίες <strong>α ({angleA}°)</strong> και <strong>β ({angleB}°)</strong> είναι <strong>παραπληρωματικές</strong>: σχηματίζουν μία ευθεία γωνία xÔz ＝ 180°.
                    </div>
                  )}
                  {relationMode === 'adjacent' && (
                    <div>
                      Οι γωνίες <strong>xÔy ({angleA}°)</strong> και <strong>yÔz ({angleB}°)</strong> είναι <strong>εφεξής</strong>: έχουν κοινή κορυφή το O, κοινή πλευρά την Oy και δεν επικαλύπτονται.
                    </div>
                  )}
                  {relationMode === 'vertical' && (
                    <div>
                      Οι γωνίες <strong>xÔy</strong> και <strong>x'Ôy'</strong> είναι <strong>κατακορυφήν</strong>: έχουν αντικείμενες πλευρές και μέτρο ακριβώς <strong>{angleA}°</strong>.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. ΔΙΧΟΤΟΜΟΣ ΓΩΝΙΑΣ & ΕΡΓΑΣΤΗΡΙΟ 3
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              {curr.sec3Title}
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 text-xs sm:text-sm leading-relaxed text-slate-700">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
              ΟΡΙΣΜΟΣ ΔΙΧΟΤΟΜΟΥ
            </span>
            <h3 className="font-bold text-slate-900 text-base">Χωρισμός Γωνίας σε 2 Ίσα Μέρη</h3>
            <p className="text-slate-600">
              <strong>Διχοτόμος</strong> μιας γωνίας xÔy ονομάζεται η εσωτερική ημιευθεία <strong>Οδ</strong> που ξεκινά από την κορυφή Ο και χωρίζει τη γωνία σε <strong>δύο ίσες γωνίες</strong>:
            </p>
            <div className="p-2 bg-white rounded-xl border border-indigo-200 font-mono text-center font-bold text-indigo-950 flex items-center justify-center max-w-md mx-auto">
              <span>xÔδ ＝ δÔy ＝ </span>
              <Frac num="xÔy" den="2" />
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 3: ΔΙΑΔΡΑΣΤΙΚΗ ΔΙΧΟΤΟΜΟΣ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ {curr.lab3Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Χειριστήρια (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>ΚΥΡΙΑ ΓΩΝΙΑ xÔy</span>
                    <span className="text-base font-mono font-black text-indigo-700">{bisectMainAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="180"
                    step="2"
                    value={bisectMainAngle}
                    onChange={(e) => setBisectMainAngle(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="flex gap-1.5">
                  {[-10, -2, 2, 10].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={(e) => handleStep(setBisectMainAngle, step, 10, 180, e)}
                      className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-xs font-mono active:scale-95"
                    >
                      {step > 0 ? `＋${step}°` : `－${Math.abs(step)}°`}
                    </button>
                  ))}
                  {[60, 90, 120].map((pVal) => (
                    <button
                      key={pVal}
                      type="button"
                      onClick={() => setBisectMainAngle(pVal)}
                      className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 font-bold text-xs font-mono active:scale-95"
                    >
                      {pVal}°
                    </button>
                  ))}
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                  <div>• <strong>Αρχική Γωνία xÔy:</strong> {bisectMainAngle}°</div>
                  <div className="flex items-center flex-wrap">
                    <span>• <strong>Κάθε ίσο τμήμα:</strong> </span>
                    <Frac num={bisectMainAngle} den={2} />
                    <span> ＝ <strong>{bisectHalf.toString().replace('.', ',')}°</strong></span>
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer (7 cols) */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΗΜΙΕΥΘΕΙΑ ΔΙΧΟΤΟΜΟΥ Οδ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    xÔδ ＝ δÔy ＝ {bisectHalf}°
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg viewBox="0 0 480 270" className="w-full max-w-[460px] h-auto">
                    {/* Πλευρά Ox */}
                    <line x1="240" y1="150" x2="365" y2="150" stroke="#94a3b8" strokeWidth="3" />
                    <text x="375" y="154" fill="#94a3b8" fontSize="13" fontWeight="bold">x</text>

                    {/* Πλευρά Oy */}
                    <line x1="240" y1="150" x2={rayBisectMain.x} y2={rayBisectMain.y} stroke="#38bdf8" strokeWidth="3" />
                    <text x={rayBisectMain.x + 8} y={rayBisectMain.y} fill="#38bdf8" fontSize="13" fontWeight="bold">y</text>

                    {/* Διχοτόμος Οδ (διακεκομμένη πράσινη) */}
                    <line
                      x1="240"
                      y1="150"
                      x2={rayBisectMid.x}
                      y2={rayBisectMid.y}
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeDasharray="5 4"
                    />
                    <circle cx={rayBisectMid.x} cy={rayBisectMid.y} r="5" fill="#10b981" />
                    <text x={rayBisectMid.x + 8} y={rayBisectMid.y} fill="#6ee7b7" fontSize="13" fontWeight="bold">δ</text>

                    {/* Κορυφή O */}
                    <circle cx="240" cy="150" r="6" fill="#ffffff" />
                    <text x="240" y="174" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">O</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200">
                  Η ημιευθεία <strong>Οδ</strong> είναι η διχοτόμος: χωρίζει τη γωνία <strong>xÔy ({bisectMainAngle}°)</strong> σε δύο ακριβώς ίσες γωνίες <strong>{bisectHalf}°</strong>.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. ΠΑΡΑΔΕΙΓΜΑΤΑ ΜΕ ΠΡΟΒΛΗΜΑΤΑ
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              {curr.sec4Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Πρόβλημα 1 */}
            <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded inline-block">
                ΠΡΟΒΛΗΜΑ 1: ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ & ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ ΓΩΝΙΕΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Κλίση Στέγης σε Βιοκλιματική Κατοικία
              </h3>
              <p className="text-slate-600">
                Η κλίση μιας ηλιακής στέγης σχηματίζει με τον κατακόρυφο τοίχο μία οξεία γωνία <strong>ω ＝ 28°</strong>. 
                1) Να βρεθεί η <strong>συμπληρωματική</strong> της γωνία (η κλίση ως προς το οριζόντιο έδαφος). 
                2) Να βρεθεί η <strong>παραπληρωματική</strong> της γωνία.
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm space-y-2 text-slate-800">
                <div className="font-sans font-bold text-indigo-950">Αναλυτική Λύση:</div>
                <div>1. Συμπλήρωμα: 90° － 28° ＝ <strong>62°</strong> (κλίση προς το έδαφος).</div>
                <div className="text-emerald-700 font-bold">
                  2. Παραπλήρωμα: 180° － 28° ＝ 152°.
                </div>
              </div>
            </div>

            {/* Πρόβλημα 2 */}
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded inline-block">
                ΠΡΟΒΛΗΜΑ 2: ΕΦΕΞΗΣ ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ & ΔΙΧΟΤΟΜΟΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Διαχωρισμός Ακτίνας Laser σε Οπτικό Εργαστήριο
              </h3>
              <p className="text-slate-600">
                Δύο εφεξής γωνίες <strong>α</strong> και <strong>β</strong> είναι παραπληρωματικές (α ＋ β ＝ 180°). Αν η γωνία α είναι διπλάσια της β (<strong>α ＝ 2 · β</strong>) και χαράξουμε τη διχοτόμο <strong>δ</strong> της γωνίας α, ποιο είναι το μέτρο της γωνίας που σχηματίζει η διχοτόμος με την πλευρά της γωνίας β;
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-amber-100 font-mono text-xs sm:text-sm space-y-2 text-slate-800">
                <div className="font-sans font-bold text-amber-950">Αναλυτική Λύση:</div>
                <div>1. α ＋ β ＝ 180° ⇒ 2 · β ＋ β ＝ 3 · β ＝ 180°.</div>
                <div className="flex items-center flex-wrap">
                  <span>2. Άρα β ＝ </span>
                  <Frac num="180°" den="3" />
                  <span> ＝ <strong>60°</strong> και α ＝ 2 · 60° ＝ <strong>120°</strong>.</span>
                </div>
                <div className="flex items-center flex-wrap">
                  <span>3. Η διχοτόμος χωρίζει την α σε δύο γωνίες: </span>
                  <Frac num="120°" den="2" />
                  <span> ＝ 60°.</span>
                </div>
                <div className="text-emerald-700 font-bold">
                  4. Ζητούμενη γωνία: 60° (μισό της α) ＋ 60° (γωνία β) ＝ 120°.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
