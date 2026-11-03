import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ============================================================================
// ΕΠΑΝΑΧΡΗΣΙΜΟΠΟΙΗΣΙΜΟ COMPONENT ΚΛΑΣΜΑΤΟΣ
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

export default function MesokathetosTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 1: Μεσοκάθετος (Κινούμενο σημείο M κατά ύψος Y)
  // --------------------------------------------------------------------------
  const [pointMY, setPointMY] = useState(60); // απόσταση από το μέσο O(0,0)

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 2: Απόσταση Σημείου & Παράλληλες Ευθείες
  // --------------------------------------------------------------------------
  const [distMode, setDistMode] = useState('pointToLine'); // 'pointToLine' | 'parallels'
  const [pointHeight, setPointHeight] = useState(70);
  const [obliqueShift, setObliqueShift] = useState(50); // μετατόπιση πλάγιου τμήματος

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 3: Διχοτόμος & Ισαπόσταση
  // --------------------------------------------------------------------------
  const [bisectPos, setBisectPos] = useState(80); // απόσταση σημείου πάνω στη διχοτόμο
  const [angleTotal, setAngleTotal] = useState(60);

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 4: Ισοσκελές & Ισόπλευρο Τρίγωνο
  // --------------------------------------------------------------------------
  const [triangleType, setTriangleType] = useState('isosceles'); // 'isosceles' | 'equilateral'
  const [vertexAngle, setVertexAngle] = useState(50); // γωνία κορυφής για ισοσκελές

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
      pageTitle: "Μεσοκάθετος, Αποστάσεις & Τρίγωνα | Α' Γυμνασίου",
      pageDesc: "Μεσοκάθετος ευθυγράμμου τμήματος, απόσταση σημείου από ευθεία, απόσταση παραλλήλων, ιδιότητα διχοτόμου, ισοσκελές και ισόπλευρο τρίγωνο.",
      backText: "Α' Γυμνασίου",
      btnExercises: "ΑΣΚΗΣΕΙΣ",
      bannerBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΓΕΩΜΕΤΡΙΑ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
      bannerTitle: "Μεσοκάθετος, Αποστάσεις, Διχοτόμος & Τρίγωνα",
      bannerSubtitle: "Ανακάλυψε διαδραστικά τη μεσοκάθετο και την ιδιότητα των σημείων της, τη συντομότερη απόσταση σημείου από ευθεία, την ισαπόσταση της διχοτόμου, καθώς και τις ιδιότητες του ισοσκελούς και ισόπλευρου τριγώνου.",
      sec1Title: "1. Μεσοκάθετος Ευθυγράμμου Τμήματος",
      sec2Title: "2. Απόσταση Σημείου από Ευθεία & Απόσταση Παραλλήλων Ευθειών",
      sec3Title: "3. Χαρακτηριστική Ιδιότητα της Διχοτόμου Γωνίας",
      sec4Title: "4. Ισοσκελές & Ισόπλευρο Τρίγωνο",
      sec5Title: "5. Λυμένα Παραδείγματα & Προβλήματα",
      lab1Header: "Εργαστήριο 1: Κίνησε το σημείο Μ πάνω στη μεσοκάθετο και δες την ισαπόσταση ΜΑ ＝ ΜΒ",
      lab2Header: "Εργαστήριο 2: Κάθετη Απόσταση (Συντομότερη Οδός) & Απόσταση Παραλλήλων",
      lab3Header: "Εργαστήριο 3: Κάθε σημείο της Διχοτόμου ισαπέχει από τις πλευρές της γωνίας",
      lab4Header: "Εργαστήριο 4: Ισοσκελές vs Ισόπλευρο Τρίγωνο — Γωνίες, Πλευρές & Άξονας Συμμετρίας",
      distModes: {
        pointToLine: "ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ",
        parallels: "ΑΠΟΣΤΑΣΗ 2 ΠΑΡΑΛΛΗΛΩΝ ΕΥΘΕΙΩΝ"
      },
      triModes: {
        isosceles: "ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ",
        equilateral: "ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ"
      }
    },
    en: {
      pageTitle: "Perpendicular Bisector, Distances & Triangles | Grade 7",
      pageDesc: "Perpendicular bisector of a segment, distance from point to line, distance between parallel lines, bisector property, isosceles and equilateral triangles.",
      backText: "Grade 7",
      btnExercises: "EXERCISES",
      bannerBadge: "GRADE 7 (A' GYMNASIUM) • GEOMETRY • THEORY & LAB",
      bannerTitle: "Perpendicular Bisector, Distances, Bisector & Triangles",
      bannerSubtitle: "Interactively explore the perpendicular bisector and its equidistant property, shortest distance from point to line, angle bisector properties, and isosceles & equilateral triangles.",
      sec1Title: "1. Perpendicular Bisector of a Line Segment",
      sec2Title: "2. Distance from a Point to a Line & Distance between Parallel Lines",
      sec3Title: "3. Equidistant Property of the Angle Bisector",
      sec4Title: "4. Isosceles & Equilateral Triangles",
      sec5Title: "5. Worked Examples & Problems",
      lab1Header: "Lab 1: Move point M along the perpendicular bisector to observe MA ＝ MB",
      lab2Header: "Lab 2: Perpendicular Distance (Shortest Path) & Parallel Lines Distance",
      lab3Header: "Lab 3: Every point on the Angle Bisector is equidistant from the sides",
      lab4Header: "Lab 4: Isosceles vs Equilateral Triangle — Angles, Sides & Axis of Symmetry",
      distModes: {
        pointToLine: "POINT TO LINE DISTANCE",
        parallels: "DISTANCE BETWEEN PARALLELS"
      },
      triModes: {
        isosceles: "ISOSCELES TRIANGLE",
        equilateral: "EQUILATERAL TRIANGLE"
      }
    }
  };

  const curr = t[locale] || t.el;

  // --------------------------------------------------------------------------
  // ΥΠΟΛΟΓΙΣΜΟΙ ΕΡΓΑΣΤΗΡΙΟΥ 1 (Μεσοκάθετος)
  // Σταθερό ΑΒ = 160px (άρα Α = -80, Β = +80 από το κέντρο 240, 150)
  // --------------------------------------------------------------------------
  const segHalf = 80; // 8 cm σε κλίμακα 10px = 1cm
  const distMA = useMemo(() => {
    const val = Math.hypot(segHalf, pointMY) / 10;
    return val.toFixed(1).replace('.', ',');
  }, [pointMY]);

  // --------------------------------------------------------------------------
  // ΥΠΟΛΟΓΙΣΜΟΙ ΕΡΓΑΣΤΗΡΙΟΥ 2 (Απόσταση Σημείου & Παράλληλες)
  // --------------------------------------------------------------------------
  const perpDistCm = (pointHeight / 10).toFixed(1).replace('.', ',');
  const obliqueDistCm = useMemo(() => {
    const val = Math.hypot(obliqueShift, pointHeight) / 10;
    return val.toFixed(1).replace('.', ',');
  }, [obliqueShift, pointHeight]);

  // --------------------------------------------------------------------------
  // ΥΠΟΛΟΓΙΣΜΟΙ ΕΡΓΑΣΤΗΡΙΟΥ 3 (Διχοτόμος)
  // --------------------------------------------------------------------------
  const halfAngle = angleTotal / 2;
  const perpDistFromBisector = useMemo(() => {
    const rad = (halfAngle * Math.PI) / 180;
    const d = (bisectPos * Math.sin(rad)) / 10;
    return d.toFixed(1).replace('.', ',');
  }, [bisectPos, halfAngle]);

  // --------------------------------------------------------------------------
  // ΥΠΟΛΟΓΙΣΜΟΙ ΕΡΓΑΣΤΗΡΙΟΥ 4 (Ισοσκελές & Ισόπλευρο)
  // --------------------------------------------------------------------------
  const baseAngleIsosceles = useMemo(() => {
    if (triangleType === 'equilateral') return 60;
    return Math.round((180 - vertexAngle) / 2);
  }, [triangleType, vertexAngle]);

  const effectiveVertex = triangleType === 'equilateral' ? 60 : vertexAngle;

  return (
    <Layout
      title={curr.pageTitle}
      description={curr.pageDesc}
      backUrl="/a-gymnasiou"
      backText={curr.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/37-mesokathetos-ask"
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
            1. ΜΕΣΟΚΑΘΕΤΟΣ ΕΥΘΥΓΡΑΜΜΟΥ ΤΜΗΜΑΤΟΣ + ΕΡΓΑΣΤΗΡΙΟ 1
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                ΟΡΙΣΜΟΣ ΜΕΣΟΚΑΘΕΤΟΥ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Κάθετη στο Μέσο</h3>
              <p className="text-slate-600">
                <strong>Μεσοκάθετος</strong> ενός ευθύγραμμου τμήματος ΑΒ ονομάζεται η ευθεία (<strong>ε</strong>) που είναι <strong>κάθετη</strong> στο τμήμα ΑΒ και διέρχεται από το <strong>μέσο Μ</strong> του.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                ΧΑΡΑΚΤΗΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Ισαπόσταση από τα Άκρα</h3>
              <p className="text-slate-600">
                <strong>Κάθε σημείο</strong> της μεσοκαθέτου ενός ευθύγραμμου τμήματος <strong>ισαπέχει από τα άκρα του</strong>:
              </p>
              <div className="p-1.5 bg-white rounded-lg border border-emerald-200 font-mono text-center font-bold text-emerald-950">
                ΜΑ ＝ ΜΒ
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                ΑΝΤΙΣΤΡΟΦΗ ΙΔΙΟΤΗΤΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Γεωμετρικός Τόπος</h3>
              <p className="text-slate-600">
                Αντίστροφα, <strong>αν ένα σημείο Σ ισαπέχει από τα άκρα Α και Β</strong> ενός τμήματος (δηλαδή ΣΑ ＝ ΣΒ), τότε το σημείο αυτό <strong>ανήκει υποχρεωτικά στη μεσοκάθετο</strong> του ΑΒ.
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΜΕΣΟΚΑΘΕΤΟΣ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ {curr.lab1Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>ΘΕΣΗ ΣΗΜΕΙΟΥ Μ (ΥΨΟΣ)</span>
                    <span className="text-base font-mono font-black text-indigo-700">
                      {(pointMY / 10).toFixed(1).replace('.', ',')} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="5"
                    value={pointMY}
                    onChange={(e) => setPointMY(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[-20, -5, 5, 20].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={(e) => handleStep(setPointMY, step, -90, 90, e)}
                      className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-xs font-mono active:scale-95"
                    >
                      {step > 0 ? `＋${step}` : step}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPointMY(0)}
                    className="px-2.5 py-1 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold text-xs font-mono active:scale-95"
                  >
                    Μέσο (0 cm)
                  </button>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                  <div>• Τμήμα ΑΒ ＝ <strong>16,0 cm</strong> (Μέσο Ο: ΟΑ ＝ ΟΒ ＝ 8,0 cm)</div>
                  <div>• Απόσταση ΜΑ ＝ <strong className="text-emerald-700">{distMA} cm</strong></div>
                  <div>• Απόσταση ΜΒ ＝ <strong className="text-emerald-700">{distMA} cm</strong></div>
                  <div className="font-bold text-indigo-700 pt-1 border-t border-slate-100">
                    Ισχύει πάντα: ΜΑ ＝ ΜΒ!
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΟΠΤΙΚΟΠΟΙΗΣΗ ΜΕΣΟΚΑΘΕΤΟΥ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    ΜΑ ＝ ΜΒ ＝ {distMA} cm
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg viewBox="0 0 480 260" className="w-full max-w-[460px] h-auto">
                    {/* Ευθύγραμμο τμήμα ΑΒ */}
                    <line x1="160" y1="130" x2="320" y2="130" stroke="#38bdf8" strokeWidth="4" />
                    <circle cx="160" cy="130" r="5" fill="#38bdf8" />
                    <text x="145" y="135" fill="#38bdf8" fontSize="13" fontWeight="bold">Α</text>
                    <circle cx="320" cy="130" r="5" fill="#38bdf8" />
                    <text x="330" y="135" fill="#38bdf8" fontSize="13" fontWeight="bold">Β</text>

                    {/* Μεσοκάθετος ευθεία (ε) */}
                    <line x1="240" y1="20" x2="240" y2="240" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="5 4" />
                    <text x="248" y="32" fill="#c084fc" fontSize="12" fontWeight="bold">ε (μεσοκάθετος)</text>

                    {/* Σύμβολο ορθής γωνίας στο μέσο Ο */}
                    <rect x="240" y="118" width="12" height="12" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                    <circle cx="246" cy="124" r="1.5" fill="#a855f7" />
                    <circle cx="240" cy="130" r="4" fill="#ffffff" />
                    <text x="246" y="146" fill="#cbd5e1" fontSize="11" fontWeight="bold">Ο</text>

                    {/* Αποστάσεις ΜΑ και ΜΒ */}
                    <line x1="160" y1="130" x2="240" y2={130 - pointMY} stroke="#10b981" strokeWidth="2.5" />
                    <line x1="320" y1="130" x2="240" y2={130 - pointMY} stroke="#10b981" strokeWidth="2.5" />

                    {/* Κινούμενο σημείο Μ */}
                    <circle cx="240" cy={130 - pointMY} r="6.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="252" y={130 - pointMY + 4} fill="#fde68a" fontSize="13" fontWeight="bold">Μ</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200">
                  Όπου κι αν τοποθετηθεί το σημείο <strong>Μ</strong> πάνω στη μεσοκάθετο, το τρίγωνο <strong>ΜΑΒ</strong> παραμένει πάντοτε <strong>ισοσκελές</strong> με ίσες πλευρές ΜΑ και ΜΒ!
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            2. ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ & ΠΑΡΑΛΛΗΛΩΝ + ΕΡΓΑΣΤΗΡΙΟ 2
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Το Κάθετο Τμήμα είναι το Συντομότερο</h3>
              <p className="text-slate-600">
                <strong>Απόσταση ενός σημείου Α από μια ευθεία ε</strong> ονομάζεται το μήκος του <strong>κάθετου ευθύγραμμου τμήματος ΑΗ</strong> που φέρνουμε από το Α προς την ε.
              </p>
              <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-xs text-indigo-950 font-bold">
                ΑΗ ＜ ΑΒ (για κάθε πλάγιο σημείο Β της ευθείας ε)
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                ΑΠΟΣΤΑΣΗ ΠΑΡΑΛΛΗΛΩΝ ΕΥΘΕΙΩΝ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Σταθερό Πλάτος Παντού</h3>
              <p className="text-slate-600">
                <strong>Απόσταση δύο παράλληλων ευθειών ε₁ και ε₂</strong> ονομάζεται η απόσταση οποιουδήποτε σημείου της μίας από την άλλη. Το κοινό κάθετο τμήμα έχει το <strong>ίδιο ακριβώς μήκος</strong> σε όλα τα σημεία τους.
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΗ ΑΠΟΣΤΑΣΗ & ΠΑΡΑΛΛΗΛΕΣ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ {curr.lab2Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDistMode('pointToLine')}
                    className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-center ${
                      distMode === 'pointToLine'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {curr.distModes.pointToLine}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistMode('parallels')}
                    className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-center ${
                      distMode === 'parallels'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {curr.distModes.parallels}
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>ΚΑΘΕΤΗ ΑΠΟΣΤΑΣΗ ΑΗ</span>
                    <span className="font-mono font-black text-indigo-700 text-sm">{perpDistCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="5"
                    value={pointHeight}
                    onChange={(e) => setPointHeight(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {distMode === 'pointToLine' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                      <span>ΘΕΣΗ ΠΛΑΓΙΟΥ ΣΗΜΕΙΟΥ Β</span>
                      <span className="font-mono font-black text-amber-700 text-sm">
                        {(obliqueShift / 10).toFixed(1).replace('.', ',')} cm
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      step="5"
                      value={obliqueShift}
                      onChange={(e) => setObliqueShift(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>
                )}

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                  <div>• <strong>Κάθετο Τμήμα ΑΗ:</strong> {perpDistCm} cm</div>
                  {distMode === 'pointToLine' && (
                    <>
                      <div>• <strong>Πλάγιο Τμήμα ΑΒ:</strong> {obliqueDistCm} cm</div>
                      <div className="font-bold text-emerald-700 pt-1 border-t border-slate-100">
                        ΑΗ ({perpDistCm} cm) ＜ ΑΒ ({obliqueDistCm} cm)
                      </div>
                    </>
                  )}
                  {distMode === 'parallels' && (
                    <div className="font-bold text-indigo-700 pt-1 border-t border-slate-100">
                      Η απόσταση των ε₁ και ε₂ παραμένει σταθερά <strong>{perpDistCm} cm</strong> σε όλο το μήκος τους!
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic SVG Visualizer */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΠΕΙΚΟΝΙΣΗ ΑΠΟΣΤΑΣΗΣ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans">
                    d ＝ {perpDistCm} cm
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg viewBox="0 0 480 240" className="w-full max-w-[460px] h-auto">
                    {/* Ευθεία ε (βάση) */}
                    <line x1="40" y1="180" x2="440" y2="180" stroke="#94a3b8" strokeWidth="3" />
                    <text x="445" y="184" fill="#94a3b8" fontSize="13" fontWeight="bold">ε</text>

                    {distMode === 'parallels' && (
                      <>
                        {/* Παράλληλη ευθεία ε1 */}
                        <line x1="40" y1={180 - pointHeight} x2="440" y2={180 - pointHeight} stroke="#818cf8" strokeWidth="3" />
                        <text x="445" y={184 - pointHeight} fill="#818cf8" fontSize="13" fontWeight="bold">ε₁</text>

                        {/* Δύο κάθετα τμήματα ένδειξης σταθερότητας */}
                        <line x1="160" y1={180 - pointHeight} x2="160" y2="180" stroke="#10b981" strokeWidth="3" strokeDasharray="4 3" />
                        <rect x="160" y="168" width="12" height="12" fill="none" stroke="#10b981" strokeWidth="1.5" />
                        <line x1="320" y1={180 - pointHeight} x2="320" y2="180" stroke="#10b981" strokeWidth="3" strokeDasharray="4 3" />
                        <rect x="320" y="168" width="12" height="12" fill="none" stroke="#10b981" strokeWidth="1.5" />
                        <text x="168" y={180 - pointHeight / 2} fill="#6ee7b7" fontSize="11">{perpDistCm} cm</text>
                        <text x="328" y={180 - pointHeight / 2} fill="#6ee7b7" fontSize="11">{perpDistCm} cm</text>
                      </>
                    )}

                    {distMode === 'pointToLine' && (
                      <>
                        {/* Σημείο Α */}
                        <circle cx="200" cy={180 - pointHeight} r="6" fill="#38bdf8" />
                        <text x="190" y={174 - pointHeight} fill="#38bdf8" fontSize="13" fontWeight="bold">Α</text>

                        {/* Κάθετο τμήμα ΑΗ */}
                        <line x1="200" y1={180 - pointHeight} x2="200" y2="180" stroke="#10b981" strokeWidth="3.5" />
                        <rect x="200" y="168" width="12" height="12" fill="none" stroke="#10b981" strokeWidth="1.5" />
                        <circle cx="206" cy="174" r="1.5" fill="#10b981" />
                        <circle cx="200" cy="180" r="4.5" fill="#10b981" />
                        <text x="206" y="198" fill="#10b981" fontSize="12" fontWeight="bold">Η</text>

                        {/* Πλάγιο τμήμα ΑΒ */}
                        <line x1="200" y1={180 - pointHeight} x2={200 + obliqueShift} y2="180" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5 3" />
                        <circle cx={200 + obliqueShift} cy="180" r="4.5" fill="#f59e0b" />
                        <text x={200 + obliqueShift + 6} y="198" fill="#f59e0b" fontSize="12" fontWeight="bold">Β</text>
                      </>
                    )}
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200">
                  {distMode === 'pointToLine'
                    ? 'Το κάθετο τμήμα ΑΗ είναι η συντομότερη απόσταση από το σημείο Α στην ευθεία ε. Οποιοδήποτε άλλο σημείο Β της ευθείας απέχει περισσότερο (ΑΒ ＞ ΑΗ).'
                    : 'Η απόσταση μεταξύ δύο παράλληλων ευθειών είναι παντού η ίδια, όποιο σημείο κι αν επιλέξουμε για να φέρουμε την κάθετο.'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. ΧΑΡΑΚΤΗΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ ΔΙΧΟΤΟΜΟΥ ΓΩΝΙΑΣ + ΕΡΓΑΣΤΗΡΙΟ 3
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

          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 text-xs sm:text-sm leading-relaxed text-slate-700">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
              ΘΕΩΡΗΜΑ ΔΙΧΟΤΟΜΟΥ
            </span>
            <h3 className="font-bold text-slate-900 text-base">Ισαπόσταση από τις Πλευρές της Γωνίας</h3>
            <p className="text-slate-600">
              <strong>Κάθε σημείο Σ της διχοτόμου</strong> μιας γωνίας <strong>ισαπέχει από τις πλευρές της</strong>. Αν φέρουμε από το Σ τις κάθετες ΣΗ₁ και ΣΗ₂ στις πλευρές Ox και Oy, ισχύει πάντα:
            </p>
            <div className="p-2 bg-white rounded-lg border border-indigo-200 font-mono text-center font-bold text-indigo-950 max-w-sm mx-auto">
              ΣΗ₁ ＝ ΣΗ₂
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 3: ΔΙΑΔΡΑΣΤΙΚΗ ΙΣΑΠΟΣΤΑΣΗ ΔΙΧΟΤΟΜΟΥ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ {curr.lab3Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>ΘΕΣΗ ΣΗΜΕΙΟΥ Σ ΠΑΝΩ ΣΤΗ ΔΙΧΟΤΟΜΟ</span>
                    <span className="font-mono font-black text-indigo-700">{(bisectPos / 10).toFixed(1).replace('.', ',')} cm</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="140"
                    step="5"
                    value={bisectPos}
                    onChange={(e) => setBisectPos(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>ΑΝΟΙΓΜΑ ΓΩΝΙΑΣ xÔy</span>
                    <span className="font-mono font-black text-amber-700">{angleTotal}°</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="90"
                    step="2"
                    value={angleTotal}
                    onChange={(e) => setAngleTotal(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                  <div>• Γωνία xÔy ＝ {angleTotal}° (Διχοτόμος στις {halfAngle}°)</div>
                  <div>• Απόσταση ΣΗ₁ (από πλευρά Ox): <strong className="text-emerald-700">{perpDistFromBisector} cm</strong></div>
                  <div>• Απόσταση ΣΗ₂ (από πλευρά Oy): <strong className="text-emerald-700">{perpDistFromBisector} cm</strong></div>
                  <div className="font-bold text-indigo-700 pt-1 border-t border-slate-100">
                    ΣΗ₁ ＝ ΣΗ₂ (Η διχοτόμος είναι ο γεωμετρικός τόπος των σημείων που ισαπέχουν από τις πλευρές)
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΟΠΤΙΚΟΠΟΙΗΣΗ ΔΙΧΟΤΟΜΟΥ & ΚΑΘΕΤΩΝ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    d₁ ＝ d₂ ＝ {perpDistFromBisector} cm
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg viewBox="0 0 480 250" className="w-full max-w-[460px] h-auto">
                    {/* Πλευρά Ox (κάτω πλευρά) */}
                    <line
                      x1="100"
                      y1="180"
                      x2={100 + 220 * Math.cos((halfAngle * Math.PI) / 180)}
                      y2={180 + 220 * Math.sin((halfAngle * Math.PI) / 180)}
                      stroke="#94a3b8"
                      strokeWidth="3"
                    />
                    <text x="320" y="235" fill="#94a3b8" fontSize="13" fontWeight="bold">x</text>

                    {/* Πλευρά Oy (πάνω πλευρά) */}
                    <line
                      x1="100"
                      y1="180"
                      x2={100 + 220 * Math.cos((-halfAngle * Math.PI) / 180)}
                      y2={180 + 220 * Math.sin((-halfAngle * Math.PI) / 180)}
                      stroke="#94a3b8"
                      strokeWidth="3"
                    />
                    <text x="320" y="70" fill="#94a3b8" fontSize="13" fontWeight="bold">y</text>

                    {/* Διχοτόμος Οδ (οριζόντια στο y=180) */}
                    <line x1="100" y1="180" x2="330" y2="180" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="5 3" />
                    <text x="340" y="184" fill="#c084fc" fontSize="12" fontWeight="bold">δ</text>

                    {/* Σημείο Σ πάνω στη διχοτόμο */}
                    <circle cx={100 + bisectPos} cy="180" r="6" fill="#f59e0b" />
                    <text x={100 + bisectPos - 4} y="166" fill="#fde68a" fontSize="12" fontWeight="bold">Σ</text>

                    {/* Κάθετες αποστάσεις από το Σ προς Ox και Oy */}
                    {(() => {
                      const rad = (halfAngle * Math.PI) / 180;
                      const projLen = bisectPos * Math.cos(rad);
                      const ptH1 = {
                        x: 100 + projLen * Math.cos(rad),
                        y: 180 + projLen * Math.sin(rad)
                      };
                      const ptH2 = {
                        x: 100 + projLen * Math.cos(-rad),
                        y: 180 + projLen * Math.sin(-rad)
                      };
                      return (
                        <g>
                          <line x1={100 + bisectPos} y1="180" x2={ptH1.x} y2={ptH1.y} stroke="#10b981" strokeWidth="2.5" />
                          <circle cx={ptH1.x} cy={ptH1.y} r="4" fill="#10b981" />
                          <text x={ptH1.x + 6} y={ptH1.y + 12} fill="#6ee7b7" fontSize="11">Η₁</text>

                          <line x1={100 + bisectPos} y1="180" x2={ptH2.x} y2={ptH2.y} stroke="#10b981" strokeWidth="2.5" />
                          <circle cx={ptH2.x} cy={ptH2.y} r="4" fill="#10b981" />
                          <text x={ptH2.x + 6} y={ptH2.y - 6} fill="#6ee7b7" fontSize="11">Η₂</text>
                        </g>
                      );
                    })()}

                    {/* Κορυφή O */}
                    <circle cx="100" cy="180" r="5" fill="#38bdf8" />
                    <text x="82" y="184" fill="#38bdf8" fontSize="13" fontWeight="bold">O</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200">
                  Τα δύο ορθογώνια τρίγωνα που σχηματίζονται εκατέρωθεν της διχοτόμου είναι ίσα, επιβεβαιώνοντας ότι <strong>ΣΗ₁ ＝ ΣΗ₂</strong>.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. ΙΣΟΣΚΕΛΕΣ & ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ + ΕΡΓΑΣΤΗΡΙΟ 4
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              {curr.sec4Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Ισοσκελές Τρίγωνο */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Δύο Ίσες Πλευρές & Ίσες Γωνίες Βάσης</h3>
              <p className="text-slate-600">
                <strong>Ισοσκελές</strong> λέγεται το τρίγωνο που έχει <strong>δύο πλευρές ίσες</strong> (ΑΒ ＝ ΑΓ).
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 pt-1">
                <li>Οι <strong>γωνίες της βάσης</strong> είναι ίσες: <strong>Β̂ ＝ Γ̂</strong>.</li>
                <li>Η <strong>διχοτόμος</strong> της γωνίας κορυφής είναι ταυτόχρονα <strong>διάμεσος</strong>, <strong>ύψος</strong> και <strong>μεσοκάθετος</strong> της βάσης.</li>
                <li>Έχει <strong>1 άξονα συμμετρίας</strong> (τη μεσοκάθετο της βάσης).</li>
              </ul>
            </div>

            {/* Ισόπλευρο Τρίγωνο */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Τρεις Ίσες Πλευρές & Όλες οι Γωνίες 60°</h3>
              <p className="text-slate-600">
                <strong>Ισόπλευρο</strong> λέγεται το τρίγωνο που έχει και τις <strong>τρεις πλευρές του ίσες</strong> (ΑΒ ＝ ΒΓ ＝ ΓΑ).
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 pt-1">
                <li>Όλες οι γωνίες του είναι ίσες μεταξύ τους και ισούνται με <strong>60°</strong> (180° : 3).</li>
                <li>Κάθε ύψος είναι ταυτόχρονα διάμεσος, διχοτόμος και μεσοκάθετος.</li>
                <li>Έχει <strong>3 άξονες συμμετρίας</strong>.</li>
              </ul>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 4: ΔΙΑΔΡΑΣΤΙΚΟ ΤΡΙΓΩΝΟ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ {curr.lab4Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTriangleType('isosceles')}
                    className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-center ${
                      triangleType === 'isosceles'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {curr.triModes.isosceles}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTriangleType('equilateral')}
                    className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-center ${
                      triangleType === 'equilateral'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {curr.triModes.equilateral}
                  </button>
                </div>

                {triangleType === 'isosceles' && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                      <span>ΓΩΝΙΑ ΚΟΡΥΦΗΣ Â</span>
                      <span className="font-mono font-black text-amber-700 text-sm">{vertexAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      step="2"
                      value={vertexAngle}
                      onChange={(e) => setVertexAngle(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>
                )}

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-2 text-slate-700">
                  <div>• Γωνία Κορυφής Â ＝ <strong>{effectiveVertex}°</strong></div>
                  <div className="flex items-center flex-wrap">
                    <span>• Γωνίες Βάσης: Β̂ ＝ Γ̂ ＝ </span>
                    <Frac num={`180° － ${effectiveVertex}°`} den="2" />
                    <span> ＝ <strong className="text-indigo-700">{baseAngleIsosceles}°</strong></span>
                  </div>
                  <div>• Άξονες Συμμετρίας: <strong>{triangleType === 'equilateral' ? '3' : '1 (η μεσοκάθετος της βάσης)'}</strong></div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΠΕΙΚΟΝΙΣΗ ΤΡΙΓΩΝΟΥ & ΑΞΟΝΑ ΣΥΜΜΕΤΡΙΑΣ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    Â ＝ {effectiveVertex}°, Β̂ ＝ Γ̂ ＝ {baseAngleIsosceles}°
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg viewBox="0 0 480 250" className="w-full max-w-[460px] h-auto">
                    {/* Βάση ΒΓ */}
                    <line x1="160" y1="190" x2="320" y2="190" stroke="#38bdf8" strokeWidth="3.5" />
                    <circle cx="160" cy="190" r="5" fill="#38bdf8" />
                    <text x="145" y="205" fill="#38bdf8" fontSize="13" fontWeight="bold">Β</text>
                    <circle cx="320" cy="190" r="5" fill="#38bdf8" />
                    <text x="328" y="205" fill="#38bdf8" fontSize="13" fontWeight="bold">Γ</text>

                    {/* Κορυφή Α */}
                    {(() => {
                      const baseHalf = 80;
                      const rad = (baseAngleIsosceles * Math.PI) / 180;
                      const height = Math.min(150, Math.max(40, baseHalf * Math.tan(rad)));
                      const apexY = 190 - height;
                      return (
                        <g>
                          {/* Πλευρές ΑΒ και ΑΓ */}
                          <line x1="160" y1="190" x2="240" y2={apexY} stroke="#f59e0b" strokeWidth="3.5" />
                          <line x1="320" y1="190" x2="240" y2={apexY} stroke="#f59e0b" strokeWidth="3.5" />

                          {/* Άξονας συμμετρίας (μεσοκάθετος/ύψος/διχοτόμος) */}
                          <line x1="240" y1={apexY - 15} x2="240" y2="215" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 3" />
                          <rect x="240" y="178" width="12" height="12" fill="none" stroke="#a855f7" strokeWidth="1.5" />

                          {/* Κορυφή Α */}
                          <circle cx="240" cy={apexY} r="5.5" fill="#f59e0b" />
                          <text x="240" y={apexY - 10} fill="#fde68a" fontSize="13" fontWeight="bold" textAnchor="middle">Α</text>

                          {/* Ενδείξεις γωνιών βάσης */}
                          <text x="180" y="182" fill="#38bdf8" fontSize="11" fontWeight="bold">{baseAngleIsosceles}°</text>
                          <text x="286" y="182" fill="#38bdf8" fontSize="11" fontWeight="bold">{baseAngleIsosceles}°</text>
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200">
                  Στο ισοσκελές τρίγωνο ΑΒΓ, ο άξονας συμμετρίας ταυτίζει τέσσερις θεμελιώδεις γραμμές: είναι ταυτόχρονα <strong>μεσοκάθετος της βάσης</strong>, <strong>ύψος</strong>, <strong>διάμεσος</strong> και <strong>διχοτόμος</strong> της γωνίας κορυφής!
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            5. ΠΑΡΑΔΕΙΓΜΑΤΑ ΜΕ ΠΡΟΒΛΗΜΑΤΑ
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                5
              </span>
              {curr.sec5Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Πρόβλημα 1 */}
            <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded inline-block">
                ΠΡΟΒΛΗΜΑ 1: ΜΕΣΟΚΑΘΕΤΟΣ ΣΤΗΝ ΠΡΑΞΗ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Εγκατάσταση Κεραίας Κινητής Τηλεφωνίας
              </h3>
              <p className="text-slate-600">
                Δύο οικισμοί <strong>Α</strong> και <strong>Β</strong> απέχουν μεταξύ τους <strong>12 km</strong>. Μια εταιρεία τηλεπικοινωνιών θέλει να τοποθετήσει έναν σταθμό αναμετάδοσης <strong>Σ</strong> πάνω σε έναν ευθύγραμμο δρόμο <strong>ε</strong>, έτσι ώστε ο σταθμός να <strong>ισαπέχει ακριβώς</strong> από τους δύο οικισμούς (ΣΑ ＝ ΣΒ). Πώς θα προσδιοριστεί η ακριβής θέση του σταθμού;
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm space-y-2 text-slate-800">
                <div className="font-sans font-bold text-indigo-950">Αναλυτική Λύση:</div>
                <div>1. Σύμφωνα με τη χαρακτηριστική ιδιότητα, όλα τα σημεία που ισαπέχουν από τα Α και Β ανήκουν στη <strong>μεσοκάθετο</strong> του τμήματος ΑΒ.</div>
                <div>2. Κατασκευάζουμε τη μεσοκάθετο (μ) του τμήματος ΑΒ (κάθετη στο μέσο Μ, όπου ΑΜ ＝ 6 km).</div>
                <div className="text-emerald-700 font-bold">
                  3. Η ακριβής θέση του σταθμού Σ είναι το σημείο τομής της μεσοκαθέτου (μ) με τον δρόμο (ε)!
                </div>
              </div>
            </div>

            {/* Πρόβλημα 2 */}
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded inline-block">
                ΠΡΟΒΛΗΜΑ 2: ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ & ΓΩΝΙΕΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Τριγωνικό Πλαίσιο Στέγης
              </h3>
              <p className="text-slate-600">
                Σε ένα ισοσκελές τριγωνικό πλαίσιο στέγης ΑΒΓ (ΑΒ ＝ ΑΓ), η γωνία κορυφής είναι <strong>Â ＝ 44°</strong>. 
                1) Πόσο είναι το μέτρο των γωνιών βάσης <strong>Β̂</strong> και <strong>Γ̂</strong>; 
                2) Αν φέρουμε το ύψος ΑΔ, πόσο είναι η γωνία <strong>ΒÂΔ</strong>;
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-amber-100 font-mono text-xs sm:text-sm space-y-2 text-slate-800">
                <div className="font-sans font-bold text-amber-950">Αναλυτική Λύση:</div>
                <div>1. Το άθροισμα των γωνιών είναι 180°: Â ＋ Β̂ ＋ Γ̂ ＝ 180°.</div>
                <div className="flex items-center flex-wrap">
                  <span>2. Επειδή Β̂ ＝ Γ̂: Β̂ ＝ </span>
                  <Frac num="180° － 44°" den="2" />
                  <span> ＝ </span>
                  <Frac num="136°" den="2" />
                  <span> ＝ <strong>68°</strong>.</span>
                </div>
                <div className="flex items-center flex-wrap text-emerald-700 font-bold">
                  <span>3. Το ύψος ΑΔ είναι και διχοτόμος της Â, άρα ΒÂΔ ＝ </span>
                  <Frac num="44°" den="2" />
                  <span> ＝ 22°.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
