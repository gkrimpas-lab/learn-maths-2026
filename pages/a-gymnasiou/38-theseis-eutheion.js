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

export default function TheseisEutheionTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 1: Σχετική Θέση Δύο Ευθειών
  // --------------------------------------------------------------------------
  const [relPositionMode, setRelPositionMode] = useState('intersecting');
  const [interAngle, setInterAngle] = useState(55);

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 2: Παράλληλες που Τέμνονται από Τρίτη
  // --------------------------------------------------------------------------
  const [angleTrans, setAngleTrans] = useState(65); // οξεία γωνία τέμνουσας (35° - 80°)
  const [anglePairHighlight, setAnglePairHighlight] = useState('alternateInterior');

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 3: Απόσταση Παράλληλων Ευθειών
  // --------------------------------------------------------------------------
  const [parallelDist, setParallelDist] = useState(70);

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
      pageTitle: "Σχετικές Θέσεις Ευθειών & Γωνίες Παραλλήλων | Α' Γυμνασίου",
      pageDesc: "Σχετικές θέσεις δύο ευθειών, παράλληλες, απόσταση παραλλήλων, τέμνουσα, εντός εναλλάξ, εντός εκτός και επί τα αυτά, εντός και επί τα αυτά γωνίες με διαδραστικά εργαστήρια.",
      backText: "Α' Γυμνασίου",
      btnExercises: "ΑΣΚΗΣΕΙΣ",
      bannerBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΓΕΩΜΕΤΡΙΑ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
      bannerTitle: "Σχετικές Θέσεις Ευθειών & Γωνίες Παραλλήλων",
      bannerSubtitle: "Εξερεύνησε διαδραστικά πώς συνδέονται δύο ευθείες στο επίπεδο (τεμνόμενες, κάθετες, παράλληλες, ταυτιζόμενες) και ανακάλυψε τους κανόνες των γωνιών που σχηματίζονται όταν δύο παράλληλες τέμνονται από μία τρίτη ευθεία.",
      sec1Title: "1. Σχετικές Θέσεις Δύο Ευθειών στο Επίπεδο",
      sec2Title: "2. Απόσταση Παράλληλων Ευθειών",
      sec3Title: "3. Γωνίες Δύο Παράλληλων που Τέμνονται από Τρίτη",
      sec4Title: "4. Κριτήρια Παραλληλίας Ευθειών",
      sec5Title: "5. Λυμένα Παραδείγματα & Προβλήματα",
      lab1Header: "Εργαστήριο 1: Εξερεύνησε τις 4 δυνατές σχετικές θέσεις δύο ευθειών στο επίπεδο",
      lab2Header: "Εργαστήριο 2: Δύο Παράλληλες & Τέμνουσα — Εντός Εναλλάξ, Εντός Εκτός & Εντός Επί τα Αυτά",
      lab3Header: "Εργαστήριο 3: Μεταβολή Απόστασης Παράλληλων Ευθειών & Σταθερό Πλάτος",
      relModes: {
        intersecting: "ΤΕΜΝΟΜΕΝΕΣ",
        perpendicular: "ΚΑΘΕΤΕΣ (90°)",
        parallel: "ΠΑΡΑΛΛΗΛΕΣ (//)",
        coincident: "ΤΑΥΤΙΖΟΜΕΝΕΣ"
      },
      pairModes: {
        alternateInterior: "ΕΝΤΟΣ ΕΝΑΛΛΑΞ (ΙΣΕΣ)",
        corresponding: "ΕΝΤΟΣ, ΕΚΤΟΣ & ΕΠΙ ΤΑ ΑΥΤΑ (ΙΣΕΣ)",
        consecutiveInterior: "ΕΝΤΟΣ & ΕΠΙ ΤΑ ΑΥΤΑ (180°)"
      }
    },
    en: {
      pageTitle: "Relative Positions of Lines & Parallel Angles | Grade 7",
      pageDesc: "Relative positions of two lines, parallel lines, distance between parallels, transversal line, alternate interior, corresponding, consecutive interior angles with interactive labs.",
      backText: "Grade 7",
      btnExercises: "EXERCISES",
      bannerBadge: "GRADE 7 (A' GYMNASIUM) • GEOMETRY • THEORY & LAB",
      bannerTitle: "Relative Positions of Lines & Angles Formed by Parallels",
      bannerSubtitle: "Interactively explore how two lines relate in a plane (intersecting, perpendicular, parallel, coincident) and discover angle relationships formed when two parallel lines are cut by a transversal.",
      sec1Title: "1. Relative Positions of Two Lines in a Plane",
      sec2Title: "2. Distance Between Parallel Lines",
      sec3Title: "3. Angles Formed by Two Parallel Lines Cut by a Transversal",
      sec4Title: "4. Tests for Parallel Lines",
      sec5Title: "5. Worked Examples & Problems",
      lab1Header: "Lab 1: Explore the 4 possible relative positions of two lines in a plane",
      lab2Header: "Lab 2: Two Parallel Lines & a Transversal — Alternate Interior, Corresponding & Consecutive Interior",
      lab3Header: "Lab 3: Changing the Distance Between Parallel Lines & Constant Width",
      relModes: {
        intersecting: "INTERSECTING",
        perpendicular: "PERPENDICULAR (90°)",
        parallel: "PARALLEL (//)",
        coincident: "COINCIDENT"
      },
      pairModes: {
        alternateInterior: "ALTERNATE INTERIOR (EQUAL)",
        corresponding: "CORRESPONDING (EQUAL)",
        consecutiveInterior: "CONSECUTIVE INTERIOR (180°)"
      }
    }
  };

  const curr = t[locale] || t.el;

  const obtuseAngle = useMemo(() => 180 - angleTrans, [angleTrans]);

  // --------------------------------------------------------------------------
  // ΑΚΡΙΒΕΙΣ ΔΥΝΑΜΙΚΟΙ ΥΠΟΛΟΓΙΣΜΟΙ ΓΙΑ ΤΗΝ ΤΕΜΝΟΥΣΑ ΚΑΙ ΤΑ ΤΟΞΑ ΓΩΝΙΩΝ
  // --------------------------------------------------------------------------
  const geom = useMemo(() => {
    const rad = (angleTrans * Math.PI) / 180;
    const cot = 1 / Math.tan(rad);
    const cosVal = Math.cos(rad);
    const sinVal = Math.sin(rad);

    // Παράλληλες στα y = 100 (K) και y = 170 (Λ). Μέσο στα y = 135, x = 240
    const kX = 240 - 35 * cot;
    const lX = 240 + 35 * cot;

    // Άκρα τέμνουσας (μήκος πάνω και κάτω από το μέσο)
    const tX1 = 240 - 100 * cot;
    const tY1 = 135 - 100;
    const tX2 = 240 + 100 * cot;
    const tY2 = 135 + 100;

    const R = 28; // ακτίνα τόξων

    // Τόξο 1: Στο Κ, κάτω-δεξιά (Εσωτερική δεξιά οξεία γωνία = angleTrans)
    const arcK_InteriorRight = `M ${kX + R} 100 A ${R} ${R} 0 0 1 ${kX + R * cosVal} ${100 + R * sinVal}`;

    // Τόξο 2: Στο Λ, πάνω-αριστερά (Εσωτερική αριστερή οξεία γωνία = angleTrans)
    const arcL_InteriorLeft = `M ${lX - R} 170 A ${R} ${R} 0 0 1 ${lX - R * cosVal} ${170 - R * sinVal}`;

    // Τόξο 3: Στο Κ, πάνω-δεξιά (Εξωτερική δεξιά αμβλεία γωνία = obtuseAngle)
    const arcK_ExteriorRight = `M ${kX + R} 100 A ${R} ${R} 0 0 0 ${kX - R * cosVal} ${100 - R * sinVal}`;

    // Τόξο 4: Στο Λ, πάνω-δεξιά (Εσωτερική δεξιά αμβλεία γωνία = obtuseAngle)
    const arcL_InteriorRight = `M ${lX + R} 170 A ${R} ${R} 0 0 0 ${lX - R * cosVal} ${170 - R * sinVal}`;

    // Τόξο 5: Στο Λ, κάτω-δεξιά (Εξωτερική δεξιά οξεία γωνία = angleTrans)
    const arcL_ExteriorRight = `M ${lX + R} 170 A ${R} ${R} 0 0 1 ${lX + R * cosVal} ${170 + R * sinVal}`;

    return {
      kX,
      lX,
      tX1,
      tY1,
      tX2,
      tY2,
      cosVal,
      sinVal,
      arcK_InteriorRight,
      arcL_InteriorLeft,
      arcK_ExteriorRight,
      arcL_InteriorRight,
      arcL_ExteriorRight
    };
  }, [angleTrans]);

  return (
    <Layout
      title={curr.pageTitle}
      description={curr.pageDesc}
      backUrl="/a-gymnasiou"
      backText={curr.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/38-theseis-eutheion-ask"
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
            1. ΣΧΕΤΙΚΕΣ ΘΕΣΕΙΣ ΔΥΟ ΕΥΘΕΙΩΝ ΣΤΟ ΕΠΙΠΕΔΟ + ΕΡΓΑΣΤΗΡΙΟ 1
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm leading-relaxed text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                1. ΤΕΜΝΟΜΕΝΕΣ ΕΥΘΕΙΕΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Ακριβώς 1 Κοινό Σημείο</h3>
              <p className="text-slate-600">
                Δύο ευθείες ε₁ και ε₂ στο ίδιο επίπεδο λέγονται <strong>τεμνόμενες</strong> όταν έχουν <strong>ένα και μοναδικό κοινό σημείο Α</strong> (σημείο τομής).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                2. ΚΑΘΕΤΕΣ ΕΥΘΕΙΕΣ (⊥)
              </span>
              <h3 className="font-bold text-slate-900 text-base">Ορθή Γωνία 90°</h3>
              <p className="text-slate-600">
                Ειδική περίπτωση τεμνομένων ευθειών. Τέμνονται σχηματίζοντας <strong>τέσσερις ορθές γωνίες (90°)</strong>. Συμβολισμός: <strong>ε₁ ⊥ ε₂</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                3. ΠΑΡΑΛΛΗΛΕΣ ΕΥΘΕΙΕΣ (//)
              </span>
              <h3 className="font-bold text-slate-900 text-base">Κανένα Κοινό Σημείο</h3>
              <p className="text-slate-600">
                Δύο ευθείες του ίδιου επιπέδου που <strong>δεν έχουν κανένα κοινό σημείο</strong>, όσο κι αν προεκταθούν, λέγονται <strong>παράλληλες</strong>. Συμβολισμός: <strong>ε₁ // ε₂</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded inline-block">
                4. ΤΑΥΤΙΖΟΜΕΝΕΣ ΕΥΘΕΙΕΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Άπειρα Κοινά Σημεία</h3>
              <p className="text-slate-600">
                Αν δύο ευθείες έχουν <strong>δύο κοινά σημεία</strong>, τότε συμπίπτουν πλήρως και έχουν <strong>άπειρα κοινά σημεία</strong> (είναι η ίδια ευθεία).
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΕΣ ΣΧΕΤΙΚΕΣ ΘΕΣΕΙΣ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ {curr.lab1Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'intersecting', label: curr.relModes.intersecting },
                    { id: 'perpendicular', label: curr.relModes.perpendicular },
                    { id: 'parallel', label: curr.relModes.parallel },
                    { id: 'coincident', label: curr.relModes.coincident }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setRelPositionMode(m.id)}
                      className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-center ${
                        relPositionMode === m.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {relPositionMode === 'intersecting' && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                      <span>ΟΞΕΙΑ ΓΩΝΙΑ ΤΟΜΗΣ</span>
                      <span className="font-mono font-black text-indigo-700 text-sm">{interAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="85"
                      step="1"
                      value={interAngle}
                      onChange={(e) => setInterAngle(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                )}

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                  <div>
                    • <strong>Κοινά Σημεία:</strong>{' '}
                    <span className="font-bold text-indigo-700">
                      {relPositionMode === 'intersecting' || relPositionMode === 'perpendicular'
                        ? '1 κοινό σημείο (το σημείο τομής)'
                        : relPositionMode === 'parallel'
                        ? 'Κανένα κοινό σημείο (τομή ＝ ∅)'
                        : 'Άπειρα κοινά σημεία (πλήρης σύμπτωση)'}
                    </span>
                  </div>
                  <div>
                    • <strong>Συμβολισμός:</strong>{' '}
                    <span className="font-bold">
                      {relPositionMode === 'intersecting' && 'ε₁ τέμνει ε₂'}
                      {relPositionMode === 'perpendicular' && 'ε₁ ⊥ ε₂ (ορθή γωνία 90°)'}
                      {relPositionMode === 'parallel' && 'ε₁ // ε₂ (παράλληλες)'}
                      {relPositionMode === 'coincident' && 'ε₁ ≡ ε₂ (ταυτίζονται)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΟΠΤΙΚΟΠΟΙΗΣΗ ΣΧΕΤΙΚΗΣ ΘΕΣΗΣ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    {relPositionMode === 'intersecting' && `ΓΩΝΙΑ: ${interAngle}°`}
                    {relPositionMode === 'perpendicular' && 'ΟΡΘΗ ΓΩΝΙΑ 90°'}
                    {relPositionMode === 'parallel' && 'ε₁ // ε₂'}
                    {relPositionMode === 'coincident' && 'ε₁ ≡ ε₂'}
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg viewBox="0 0 480 230" className="w-full max-w-[460px] h-auto">
                    <line x1="40" y1="120" x2="440" y2="120" stroke="#38bdf8" strokeWidth="3" />
                    <text x="445" y="124" fill="#38bdf8" fontSize="13" fontWeight="bold">ε₁</text>

                    {relPositionMode === 'parallel' && (
                      <g>
                        <line x1="40" y1="60" x2="440" y2="60" stroke="#f59e0b" strokeWidth="3" />
                        <text x="445" y="64" fill="#f59e0b" fontSize="13" fontWeight="bold">ε₂</text>
                        <line x1="240" y1="60" x2="240" y2="120" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />
                        <rect x="240" y="108" width="12" height="12" fill="none" stroke="#10b981" strokeWidth="1.5" />
                        <text x="248" y="95" fill="#6ee7b7" fontSize="11" fontStyle="italic">d</text>
                      </g>
                    )}

                    {relPositionMode === 'coincident' && (
                      <g>
                        <line x1="40" y1="120" x2="440" y2="120" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="8 6" />
                        <text x="445" y="140" fill="#f59e0b" fontSize="13" fontWeight="bold">ε₂ (συμπίπτει)</text>
                      </g>
                    )}

                    {relPositionMode === 'perpendicular' && (
                      <g>
                        <line x1="240" y1="30" x2="240" y2="210" stroke="#f59e0b" strokeWidth="3" />
                        <text x="248" y="35" fill="#f59e0b" fontSize="13" fontWeight="bold">ε₂</text>
                        <rect x="240" y="108" width="12" height="12" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                        <circle cx="240" cy="120" r="5" fill="#ffffff" />
                        <text x="222" y="140" fill="#ffffff" fontSize="12" fontWeight="bold">Α</text>
                      </g>
                    )}

                    {relPositionMode === 'intersecting' && (
                      <g>
                        {(() => {
                          const rad = (interAngle * Math.PI) / 180;
                          const dx = 100 * Math.cos(rad);
                          const dy = 100 * Math.sin(rad);
                          return (
                            <>
                              <line x1={240 - dx} y1={120 + dy} x2={240 + dx} y2={120 - dy} stroke="#f59e0b" strokeWidth="3" />
                              <text x={240 + dx + 6} y={120 - dy} fill="#f59e0b" fontSize="13" fontWeight="bold">ε₂</text>
                              <circle cx="240" cy="120" r="5" fill="#ffffff" />
                              <text x="238" y="142" fill="#ffffff" fontSize="12" fontWeight="bold">Α</text>
                              <path
                                d={`M 270 120 A 30 30 0 0 0 ${240 + 30 * Math.cos(rad)} ${120 - 30 * Math.sin(rad)}`}
                                fill="none"
                                stroke="#fde68a"
                                strokeWidth="2"
                              />
                              <text x="280" y="112" fill="#fde68a" fontSize="11">{interAngle}°</text>
                            </>
                          );
                        })()}
                      </g>
                    )}
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200">
                  {relPositionMode === 'intersecting' && 'Οι ευθείες τέμνονται στο σημείο Α και σχηματίζουν δύο ζεύγη κατακορυφήν γωνιών.'}
                  {relPositionMode === 'perpendicular' && 'Οι ευθείες είναι κάθετες (ε₁ ⊥ ε₂) και σχηματίζουν τέσσερις ορθές γωνίες των 90°.'}
                  {relPositionMode === 'parallel' && 'Οι ευθείες είναι παράλληλες (ε₁ // ε₂) και διατηρούν ακριβώς την ίδια απόσταση d σε κάθε σημείο.'}
                  {relPositionMode === 'coincident' && 'Οι ευθείες ταυτίζονται (ε₁ ≡ ε₂) έχοντας άπειρα κοινά σημεία.'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            2. ΑΠΟΣΤΑΣΗ ΠΑΡΑΛΛΗΛΩΝ ΕΥΘΕΙΩΝ + ΕΡΓΑΣΤΗΡΙΟ 3
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                ΟΡΙΣΜΟΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Κοινό Κάθετο Τμήμα</h3>
              <p className="text-slate-600">
                <strong>Απόσταση δύο παράλληλων ευθειών ε₁ και ε₂</strong> ονομάζεται το μήκος οποιουδήποτε <strong>κάθετου ευθύγραμμου τμήματος ΑΒ</strong> με τα άκρα του πάνω στις δύο ευθείες.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                ΒΑΣΙΚΗ ΙΔΙΟΤΗΤΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Σταθερό Μήκος Παντού</h3>
              <p className="text-slate-600">
                Η απόσταση των παραλλήλων είναι <strong>ακριβώς η ίδια σε όλα τα σημεία τους</strong> (σταθερό πλάτος). Κάθε σημείο της μίας ισαπέχει από την άλλη.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                ΕΦΑΡΜΟΓΕΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Στην Πράξη</h3>
              <p className="text-slate-600">
                Οι <strong>σιδηροδρομικές ράγες</strong>, τα <strong>όρια ενός δρόμου σταθερού πλάτους</strong> και οι <strong>γραμμές ενός τετραδίου</strong> αποτελούν καθημερινά παραδείγματα παράλληλων ευθειών σταθερής απόστασης.
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 3: ΔΙΑΔΡΑΣΤΙΚΗ ΑΠΟΣΤΑΣΗ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ {curr.lab3Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>ΑΠΟΣΤΑΣΗ d ΜΕΤΑΞΥ ε₁ ΚΑΙ ε₂</span>
                    <span className="font-mono font-black text-indigo-700 text-base">
                      {(parallelDist / 10).toFixed(1).replace('.', ',')} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="110"
                    step="5"
                    value={parallelDist}
                    onChange={(e) => setParallelDist(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="flex gap-1.5">
                  {[-15, -5, 5, 15].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={(e) => handleStep(setParallelDist, step, 35, 110, e)}
                      className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-xs font-mono active:scale-95"
                    >
                      {step > 0 ? `＋${step}` : step}
                    </button>
                  ))}
                  {[50, 70, 90].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setParallelDist(preset)}
                      className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 font-bold text-xs font-mono active:scale-95"
                    >
                      {(preset / 10).toFixed(1).replace('.', ',')} cm
                    </button>
                  ))}
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                  <div>• <strong>Απόσταση d:</strong> {(parallelDist / 10).toFixed(1).replace('.', ',')} cm</div>
                  <div>• <strong>Κάθετο Τμήμα ΑΒ ＝ ΓΔ ＝ ΕΖ ＝ d</strong></div>
                  <div className="font-bold text-indigo-700 pt-1 border-t border-slate-100">
                    Το πλάτος παραμένει αυστηρά σταθερό σε όλο το μήκος των ευθειών!
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΣΤΑΘΕΡΗ ΑΠΟΣΤΑΣΗ ΠΑΡΑΛΛΗΛΩΝ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    d ＝ {(parallelDist / 10).toFixed(1).replace('.', ',')} cm
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg viewBox="0 0 480 230" className="w-full max-w-[460px] h-auto">
                    <line x1="40" y1="180" x2="440" y2="180" stroke="#38bdf8" strokeWidth="3" />
                    <text x="445" y="184" fill="#38bdf8" fontSize="13" fontWeight="bold">ε₂</text>

                    <line x1="40" y1={180 - parallelDist} x2="440" y2={180 - parallelDist} stroke="#f59e0b" strokeWidth="3" />
                    <text x="445" y={184 - parallelDist} fill="#f59e0b" fontSize="13" fontWeight="bold">ε₁</text>

                    {[120, 240, 360].map((xPos, idx) => (
                      <g key={idx}>
                        <line
                          x1={xPos}
                          y1={180 - parallelDist}
                          x2={xPos}
                          y2="180"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeDasharray="4 3"
                        />
                        <rect x={xPos} y="168" width="12" height="12" fill="none" stroke="#10b981" strokeWidth="1.5" />
                        <circle cx={xPos} cy={180 - parallelDist} r="4" fill="#f59e0b" />
                        <circle cx={xPos} cy="180" r="4" fill="#38bdf8" />
                        <text x={xPos + 6} y={180 - parallelDist / 2 + 4} fill="#6ee7b7" fontSize="11" fontWeight="bold">
                          {(parallelDist / 10).toFixed(1).replace('.', ',')}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200">
                  Όλα τα κάθετα τμήματα ανάμεσα στις ευθείες ε₁ και ε₂ έχουν το ίδιο ακριβώς μήκος, αποδεικνύοντας ότι η απόσταση δύο παραλλήλων ευθειών είναι αναλλοίωτη.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. ΓΩΝΙΕΣ ΠΑΡΑΛΛΗΛΩΝ ΠΟΥ ΤΕΜΝΟΝΤΑΙ ΑΠΟ ΤΡΙΤΗ + ΕΡΓΑΣΤΗΡΙΟ 2
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

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Όταν δύο παράλληλες ευθείες <strong>ε₁ // ε₂</strong> τέμνονται από μία τρίτη ευθεία (<strong>τέμνουσα ε₃</strong>), σχηματίζονται συνολικά <strong>8 γωνίες</strong>. Από αυτές:
            <strong> 4 είναι ίσες οξείες</strong> και <strong>4 είναι ίσες αμβλείες</strong> (ή και οι 8 ορθές των 90° αν η τέμνουσα είναι κάθετη).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Εντός Εναλλάξ */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                ΖΕΥΓΟΣ 1 (ΣΧΗΜΑ "Z")
              </span>
              <h3 className="font-bold text-slate-900 text-base">Εντός Εναλλάξ Γωνίες</h3>
              <p className="text-slate-600">
                Βρίσκονται <strong>ανάμεσα</strong> στις παράλληλες (εντός) και σε <strong>διαφορετικές πλευρές</strong> της τέμνουσας (εναλλάξ).
              </p>
              <div className="p-2 bg-white rounded-lg border border-indigo-200 font-mono text-center font-bold text-indigo-950">
                ΕΙΝΑΙ ΠΑΝΤΑ ΙΣΕΣ!
              </div>
            </div>

            {/* Εντός, Εκτός και Επί τα Αυτά */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                ΖΕΥΓΟΣ 2 (ΣΧΗΜΑ "F")
              </span>
              <h3 className="font-bold text-slate-900 text-base">Εντός, Εκτός & Επί τα Αυτά</h3>
              <p className="text-slate-600">
                Η μία βρίσκεται <strong>εντός</strong>, η άλλη <strong>εκτός</strong> των παραλλήλων, και βρίσκονται στην <strong>ίδια πλευρά</strong> της τέμνουσας.
              </p>
              <div className="p-2 bg-white rounded-lg border border-emerald-200 font-mono text-center font-bold text-emerald-950">
                ΕΙΝΑΙ ΠΑΝΤΑ ΙΣΕΣ!
              </div>
            </div>

            {/* Εντός και Επί τα Αυτά */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                ΖΕΥΓΟΣ 3 (ΣΧΗΜΑ "C / U")
              </span>
              <h3 className="font-bold text-slate-900 text-base">Εντός & Επί τα Αυτά</h3>
              <p className="text-slate-600">
                Βρίσκονται και οι δύο <strong>εντός</strong> των παραλλήλων και στην <strong>ίδια πλευρά</strong> της τέμνουσας ευθείας.
              </p>
              <div className="p-2 bg-white rounded-lg border border-amber-200 font-mono text-center font-bold text-amber-950">
                ΑΘΡΟΙΣΜΑ ＝ 180° (ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ)
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΕΣ ΓΩΝΙΕΣ ΠΑΡΑΛΛΗΛΩΝ (ΔΙΟΡΘΩΜΕΝΑ ΤΟΞΑ) */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ {curr.lab2Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Χειριστήρια (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    ΕΠΙΛΟΓΗ ΧΑΡΑΚΤΗΡΙΣΤΙΚΟΥ ΖΕΥΓΟΥΣ
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'alternateInterior', label: curr.pairModes.alternateInterior },
                      { id: 'corresponding', label: curr.pairModes.corresponding },
                      { id: 'consecutiveInterior', label: curr.pairModes.consecutiveInterior }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setAnglePairHighlight(p.id)}
                        className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-left flex justify-between items-center ${
                          anglePairHighlight === p.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{p.label}</span>
                        {anglePairHighlight === p.id && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>ΚΛΙΣΗ ΤΕΜΝΟΥΣΑΣ (ΟΞΕΙΑ ΓΩΝΙΑ)</span>
                    <span className="font-mono font-black text-amber-700 text-sm">{angleTrans}°</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="80"
                    step="1"
                    value={angleTrans}
                    onChange={(e) => setAngleTrans(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="flex gap-1.5 pt-1">
                    {[-10, -1, 1, 10].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={(e) => handleStep(setAngleTrans, step, 35, 80, e)}
                        className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-xs font-mono active:scale-95"
                      >
                        {step > 0 ? `＋${step}°` : `－${Math.abs(step)}°`}
                      </button>
                    ))}
                    {[45, 60].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAngleTrans(preset)}
                        className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 font-bold text-xs font-mono active:scale-95"
                      >
                        {preset}°
                      </button>
                    ))}
                  </div>
                </div>

                {/* Πίνακας Τιμών Γωνιών */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-2 text-slate-700">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                    <span>• Οξείες Γωνίες (4 ίσες):</span>
                    <strong className="text-amber-600 font-bold text-sm">{angleTrans}°</strong>
                  </div>
                  <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                    <span>• Αμβλείες Γωνίες (4 ίσες):</span>
                    <strong className="text-indigo-600 font-bold text-sm">{obtuseAngle}°</strong>
                  </div>
                  <div className="text-[11px] font-sans text-slate-600">
                    {anglePairHighlight === 'alternateInterior' && (
                      <span className="text-indigo-700 font-bold">
                        Εντός εναλλάξ: Σχηματίζουν το γράμμα «Ζ» και είναι ίσες ({angleTrans}° ＝ {angleTrans}°).
                      </span>
                    )}
                    {anglePairHighlight === 'corresponding' && (
                      <span className="text-emerald-700 font-bold">
                        Εντός, εκτός & επί τα αυτά: Σχηματίζουν το γράμμα «F» και είναι ίσες ({angleTrans}° ＝ {angleTrans}°).
                      </span>
                    )}
                    {anglePairHighlight === 'consecutiveInterior' && (
                      <span className="text-amber-700 font-bold">
                        Εντός & επί τα αυτά: Σχηματίζουν το γράμμα «C» και έχουν άθροισμα {angleTrans}° ＋ {obtuseAngle}° ＝ 180°.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer με απόλυτη εφαρμογή τόξων και σημείων */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΠΕΙΚΟΝΙΣΗ 8 ΓΩΝΙΩΝ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    {anglePairHighlight === 'alternateInterior' && `ΕΝΤΟΣ ΕΝΑΛΛΑΞ: ${angleTrans}° ＝ ${angleTrans}°`}
                    {anglePairHighlight === 'corresponding' && `ΑΝΤΙΣΤΟΙΧΕΣ: ${angleTrans}° ＝ ${angleTrans}°`}
                    {anglePairHighlight === 'consecutiveInterior' && `ΑΘΡΟΙΣΜΑ: ${angleTrans}° ＋ ${obtuseAngle}° ＝ 180°`}
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg viewBox="0 0 480 270" className="w-full max-w-[460px] h-auto">
                    {/* Παράλληλη ευθεία ε1 (y = 100) */}
                    <line x1="40" y1="100" x2="440" y2="100" stroke="#38bdf8" strokeWidth="3" />
                    <text x="445" y="104" fill="#38bdf8" fontSize="13" fontWeight="bold">ε₁</text>

                    {/* Παράλληλη ευθεία ε2 (y = 170) */}
                    <line x1="40" y1="170" x2="440" y2="170" stroke="#38bdf8" strokeWidth="3" />
                    <text x="445" y="174" fill="#38bdf8" fontSize="13" fontWeight="bold">ε₂</text>

                    {/* Τέμνουσα ευθεία ε3 */}
                    <line
                      x1={geom.tX1}
                      y1={geom.tY1}
                      x2={geom.tX2}
                      y2={geom.tY2}
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                    />
                    <text x={geom.tX2 + 8} y={geom.tY2} fill="#f59e0b" fontSize="13" fontWeight="bold">ε₃</text>

                    {/* Δυναμικά Τόξα με απόλυτη εφαρμογή στις πλευρές */}
                    {anglePairHighlight === 'alternateInterior' && (
                      <g>
                        {/* Γωνία 1: Στο Κ, κάτω δεξιά (εντός εναλλάξ) */}
                        <path
                          d={geom.arcK_InteriorRight}
                          fill="rgba(192, 132, 252, 0.25)"
                          stroke="#c084fc"
                          strokeWidth="2.5"
                        />
                        <text x={geom.kX + 18} y="126" fill="#c084fc" fontSize="11" fontWeight="bold">
                          {angleTrans}°
                        </text>

                        {/* Γωνία 2: Στο Λ, πάνω αριστερά (εντός εναλλάξ) */}
                        <path
                          d={geom.arcL_InteriorLeft}
                          fill="rgba(192, 132, 252, 0.25)"
                          stroke="#c084fc"
                          strokeWidth="2.5"
                        />
                        <text x={geom.lX - 44} y="152" fill="#c084fc" fontSize="11" fontWeight="bold">
                          {angleTrans}°
                        </text>
                      </g>
                    )}

                    {anglePairHighlight === 'corresponding' && (
                      <g>
                        {/* Γωνία 1: Στο Κ, κάτω δεξιά (εντός δεξιά) */}
                        <path
                          d={geom.arcK_InteriorRight}
                          fill="rgba(16, 185, 129, 0.25)"
                          stroke="#10b981"
                          strokeWidth="2.5"
                        />
                        <text x={geom.kX + 18} y="126" fill="#6ee7b7" fontSize="11" fontWeight="bold">
                          {angleTrans}°
                        </text>

                        {/* Γωνία 2: Στο Λ, κάτω δεξιά (εκτός δεξιά) */}
                        <path
                          d={geom.arcL_ExteriorRight}
                          fill="rgba(16, 185, 129, 0.25)"
                          stroke="#10b981"
                          strokeWidth="2.5"
                        />
                        <text x={geom.lX + 18} y="196" fill="#6ee7b7" fontSize="11" fontWeight="bold">
                          {angleTrans}°
                        </text>
                      </g>
                    )}

                    {anglePairHighlight === 'consecutiveInterior' && (
                      <g>
                        {/* Γωνία 1: Στο Κ, κάτω δεξιά (οξεία = angleTrans) */}
                        <path
                          d={geom.arcK_InteriorRight}
                          fill="rgba(245, 158, 11, 0.25)"
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                        />
                        <text x={geom.kX + 18} y="126" fill="#fde68a" fontSize="11" fontWeight="bold">
                          {angleTrans}°
                        </text>

                        {/* Γωνία 2: Στο Λ, πάνω δεξιά (αμβλεία = obtuseAngle) */}
                        <path
                          d={geom.arcL_InteriorRight}
                          fill="rgba(56, 189, 248, 0.25)"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                        />
                        <text x={geom.lX + 12} y="152" fill="#7dd3fc" fontSize="11" fontWeight="bold">
                          {obtuseAngle}°
                        </text>
                      </g>
                    )}

                    {/* Σημεία τομής Κ (πάνω) και Λ (κάτω) πάνω στην τέμνουσα */}
                    <circle cx={geom.kX} cy="100" r="5" fill="#ffffff" />
                    <text x={geom.kX - 16} y="94" fill="#ffffff" fontSize="12" fontWeight="bold">Κ</text>

                    <circle cx={geom.lX} cy="170" r="5" fill="#ffffff" />
                    <text x={geom.lX - 16} y="188" fill="#ffffff" fontSize="12" fontWeight="bold">Λ</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200">
                  Γνωρίζοντας <strong>μία μόνο γωνία</strong> (π.χ. {angleTrans}°), μπορούμε να υπολογίσουμε άμεσα και τις <strong>8 γωνίες</strong>: τέσσερις είναι ίσες με {angleTrans}° και τέσσερις είναι ίσες με 180° － {angleTrans}° ＝ {obtuseAngle}°!
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. ΚΡΙΤΗΡΙΑ ΠΑΡΑΛΛΗΛΙΑΣ ΕΥΘΕΙΩΝ
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

          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 text-xs sm:text-sm leading-relaxed text-slate-700">
            <h3 className="font-bold text-slate-900 text-base">
              Πώς αποδεικνύουμε ότι δύο ευθείες είναι παράλληλες;
            </h3>
            <p className="text-slate-600">
              Αν δύο ευθείες ε₁ και ε₂ τέμνονται από μία τρίτη ευθεία ε₃, είναι <strong>παράλληλες (ε₁ // ε₂)</strong> αν ισχύει <strong>τουλάχιστον ένα</strong> από τα παρακάτω κριτήρια:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-xl border border-indigo-200 space-y-1">
                <span className="font-bold text-indigo-950 block">Κριτήριο 1</span>
                <div>Δύο <strong>εντός εναλλάξ</strong> γωνίες είναι <strong>ίσες</strong>.</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-950 block">Κριτήριο 2</span>
                <div>Δύο <strong>εντός, εκτός και επί τα αυτά</strong> γωνίες είναι <strong>ίσες</strong>.</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1">
                <span className="font-bold text-amber-950 block">Κριτήριο 3</span>
                <div>Δύο <strong>εντός και επί τα αυτά</strong> γωνίες είναι <strong>παραπληρωματικές (άθροισμα 180°)</strong>.</div>
              </div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
              <strong>Επιπλέον Κριτήριο Καθετότητας:</strong> Δύο ευθείες του επιπέδου που είναι κάθετες στην ίδια ευθεία είναι μεταξύ τους παράλληλες (αν ε₁ ⊥ ε₃ και ε₂ ⊥ ε₃, τότε <strong>ε₁ // ε₂</strong>).
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
                ΠΡΟΒΛΗΜΑ 1: ΥΠΟΛΟΓΙΣΜΟΣ ΓΩΝΙΩΝ ΣΕ ΣΙΔΗΡΟΔΡΟΜΙΚΕΣ ΡΑΓΕΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Διαγώνιος Σύνδεσμος σε Γέφυρα
              </h3>
              <p className="text-slate-600">
                Δύο παράλληλες σιδηροτροχιές <strong>ε₁ // ε₂</strong> συνδέονται με μια λοξή μεταλλική ράβδο <strong>ε₃</strong>. Αν η μία οξεία γωνία που σχηματίζεται στη ράγα ε₁ είναι <strong>ω ＝ 52°</strong>:
                1) Πόσο είναι η <strong>εντός εναλλάξ</strong> γωνία στη ράγα ε₂;
                2) Πόσο είναι η <strong>εντός και επί τα αυτά</strong> γωνία στην ίδια πλευρά;
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm space-y-2 text-slate-800">
                <div className="font-sans font-bold text-indigo-950">Αναλυτική Λύση:</div>
                <div>1. Επειδή ε₁ // ε₂, οι εντός εναλλάξ γωνίες είναι ίσες: <strong>ω' ＝ 52°</strong>.</div>
                <div className="text-emerald-700 font-bold">
                  2. Οι εντός και επί τα αυτά γωνίες είναι παραπληρωματικές: 180° － 52° ＝ <strong>128°</strong>.
                </div>
              </div>
            </div>

            {/* Πρόβλημα 2 */}
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded inline-block">
                ΠΡΟΒΛΗΜΑ 2: ΕΛΕΓΧΟΣ ΠΑΡΑΛΛΗΛΙΑΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Ευθυγράμμιση Ηλιακών Πάνελ
              </h3>
              <p className="text-slate-600">
                Ένας τεχνικός εγκαθιστά δύο βάσεις πάνελ ε₁ και ε₂. Μια ράβδος μέτρησης τέμνει τις δύο βάσεις και μετρά δύο γωνίες εντός και επί τα αυτά ίσες με <strong>68°</strong> και <strong>112°</strong>. Είναι οι βάσεις των πάνελ παράλληλες μεταξύ τους;
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-amber-100 font-mono text-xs sm:text-sm space-y-2 text-slate-800">
                <div className="font-sans font-bold text-amber-950">Αναλυτική Λύση:</div>
                <div>1. Εξετάζουμε το άθροισμα των γωνιών εντός και επί τα αυτά: 68° ＋ 112° ＝ <strong>180°</strong>.</div>
                <div className="text-emerald-700 font-bold">
                  2. Σύμφωνα με το Κριτήριο 3, επειδή οι εντός και επί τα αυτά γωνίες είναι παραπληρωματικές (άθροισμα 180°), οι βάσεις είναι <strong>αυστηρά παράλληλες (ε₁ // ε₂)</strong>!
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
