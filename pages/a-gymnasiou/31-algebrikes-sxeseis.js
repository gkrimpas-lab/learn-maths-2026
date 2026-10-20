import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Επαναχρησιμοποιήσιμο component για κλασματική γραφή με ασφαλή ανίχνευση προσήμου
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-1 align-middle mx-1 font-mono ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-1 border-b-2 w-full text-center" style={{ borderColor: 'currentColor' }}>
          {displayNum}
        </span>
        <span className="pt-0.5 px-1 w-full text-center">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

export default function AlgebrikesSxeseisTheoria() {
  // State για Εργαστήριο 1: Διαδραστική Ζυγαριά (a*x + b = c)
  const [scaleCoeffA, setScaleCoeffA] = useState(2); // Συντελεστής του x (πλήθος κουτιών)
  const [scaleConstB, setScaleConstB] = useState(3); // Σταθερός όρος (έξτρα μπάλες αριστερά)
  const [scaleTargetC, setScaleTargetC] = useState(11); // Βάρος δεξιού δίσκου (μπάλες δεξιά)
  const [scaleTestX, setScaleTestX] = useState(4); // Δοκιμαστική τιμή x (μπάλες ΜΕΣΑ σε κάθε κουτί)

  // State για Εργαστήριο 2: Επαλήθευση Ρίζας Εξίσωσης
  const [eqA, setEqA] = useState(3);
  const [eqB, setEqB] = useState(-4);
  const [eqC, setEqC] = useState(11);
  const [userX, setUserX] = useState(5);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Ζυγαριά)
  const leftWeight = useMemo(() => scaleCoeffA * scaleTestX + scaleConstB, [scaleCoeffA, scaleTestX, scaleConstB]);
  const rightWeight = scaleTargetC;
  const isBalanced = leftWeight === rightWeight;
  const tiltAngle = useMemo(() => {
    if (leftWeight === rightWeight) return 0;
    // Περιορισμός κλίσης ζυγαριάς έως +/- 12 μοίρες
    const diff = leftWeight - rightWeight;
    return Math.max(-12, Math.min(12, diff * 1.5));
  }, [leftWeight, rightWeight]);

  // Υπολογισμοί Εργαστηρίου 2 (Επαλήθευση)
  const leftSideVal = useMemo(() => eqA * userX + eqB, [eqA, userX, eqB]);
  const isRootCorrect = leftSideVal === eqC;

  return (
    <Layout
      title="Αλγεβρικές Σχέσεις & Εξισώσεις | Α' Γυμνασίου"
      description="Η έννοια της εξίσωσης, ο άγνωστος x, ο συντελεστής του αγνώστου, η επαλήθευση λύσης, η ζυγαριά ισορροπίας και διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/31-algebrikes-sxeseis-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>ΑΣΚΗΣΕΙΣ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 28 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Αλγεβρικές Σχέσεις & Η Έννοια της Εξίσωσης
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε τι είναι μια εξίσωση, πώς ορίζεται ο άγνωστος x και ο συντελεστής του, πώς αναπαριστούμε την εξίσωση σαν μια ζυγαριά σε ισορροπία και πώς επαληθεύουμε αν ένας αριθμός είναι λύση της.
            </p>
          </div>
        </section>

        {/* 1. ΤΙ ΕΙΝΑΙ Η ΕΞΙΣΩΣΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Τι Είναι η Εξίσωση;
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Εξίσωση</strong> ονομάζεται μια <strong>ισότητα δύο παραστάσεων</strong> (1ο μέλος ＝ 2ο μέλος) που περιέχει τουλάχιστον ένα γράμμα, το οποίο ονομάζεται <strong>άγνωστος</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-lg sm:text-2xl font-mono shadow-sm">
                2 · x ＋ 3 ＝ 11
              </div>
              <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600">
                <li><strong>1ο Μέλος:</strong> Η παράσταση αριστερά από το σύμβολο ίσον (2x ＋ 3).</li>
                <li><strong>2ο Μέλος:</strong> Η παράσταση δεξιά από το σύμβολο ίσον (11).</li>
                <li><strong>Άγνωστος (x):</strong> Ο αριθμός του οποίου την τιμή ψάχνουμε ώστε να αληθεύει η ισότητα.</li>
                <li><strong>Συντελεστής του Αγνώστου:</strong> Ο αριθμός που πολλαπλασιάζει το x (εδώ το 2).</li>
              </ul>
            </div>

            {/* Λύση / Ρίζα της Εξίσωσης */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                ΛΥΣΗ (Η ΡΙΖΑ) ΤΗΣ ΕΞΙΣΩΣΗΣ
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                <strong>Λύση (ή ρίζα)</strong> μιας εξίσωσης ονομάζεται ο αριθμός που, όταν μπει στη θέση του αγνώστου, <strong>επαληθεύει την ισότητα</strong> (κάνει το 1ο μέλος ίσο με το 2ο).
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm space-y-2">
                <div className="text-indigo-950 font-bold">Έλεγχος για την εξίσωση 2x ＋ 3 ＝ 11:</div>
                <div className="text-slate-600">• Αν βάλουμε x ＝ 3: 2 · 3 ＋ 3 ＝ 6 ＋ 3 ＝ 9 ≠ 11 (το 3 <strong>δεν</strong> είναι λύση).</div>
                <div className="text-emerald-700 font-bold">• Αν βάλουμε x ＝ 4: 2 · 4 ＋ 3 ＝ 8 ＋ 3 ＝ 11 (το 4 <strong>είναι η λύση</strong>!).</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Η ΖΥΓΑΡΙΑ ΙΣΟΡΡΟΠΙΑΣ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Η Εξίσωση ως Ζυγαριά σε Ισορροπία
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            Μπορούμε να φανταστούμε μια εξίσωση σαν μια <strong>παραδοσιακή ζυγαριά δύο δίσκων</strong>. Το σύμβολο του ίσον (＝) σημαίνει ότι η ζυγαριά βρίσκεται σε <strong>τέλεια ισορροπία</strong>: το βάρος στον αριστερό δίσκο είναι ακριβώς ίσο με το βάρος στον δεξιό δίσκο.
          </p>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΖΥΓΑΡΙΑ ΜΕ ΚΟΥΤΙΑ ΚΑΙ ΜΠΑΛΕΣ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 1: Διαδραστική Ζυγαριά Ισορροπίας (α · x ＋ β ＝ γ)
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Χειριστήρια Steppers (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-indigo-900 uppercase block">
                    ΚΟΥΤΙΑ x (ΣΥΝΤΕΛΕΣΤΗΣ α)
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleCoeffA, -1, 1, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-xs font-mono text-indigo-950">
                      {scaleCoeffA} {scaleCoeffA === 1 ? 'κουτί' : 'κουτιά'}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleCoeffA, 1, 1, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">
                    ΜΠΑΛΕΣ ΑΡΙΣΤΕΡΑ (β)
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleConstB, -1, 0, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono">
                      ＋{scaleConstB} μπάλες
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleConstB, 1, 0, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-amber-700 uppercase block">
                    ΜΠΑΛΕΣ ΔΕΞΙΑ (γ)
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleTargetC, -1, 1, 25, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-xs font-mono text-amber-950">
                      {scaleTargetC} μπάλες
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleTargetC, 1, 1, 25, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-sky-700 uppercase block">
                    ΔΟΚΙΜΗ x (ΜΠΑΛΕΣ/ΚΟΥΤΙ)
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleTestX, -1, 0, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-xs font-mono text-sky-950">
                      x ＝ {scaleTestX}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleTestX, 1, 0, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Υπόμνημα Χρωμάτων */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-200 grid grid-cols-3 gap-1 text-[10px] font-bold text-center">
                  <div className="p-1 rounded bg-sky-100 text-sky-900 border border-sky-200">
                    📦 Κουτί x ({scaleTestX} •)
                  </div>
                  <div className="p-1 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                    🔵 Μπάλες β ({scaleConstB})
                  </div>
                  <div className="p-1 rounded bg-amber-100 text-amber-900 border border-amber-200">
                    🟡 Μπάλες γ ({scaleTargetC})
                  </div>
                </div>
              </div>

              {/* Οπτική Ζυγαριά σε SVG (7 cols) */}
              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΚΑΤΑΣΤΑΣΗ ΖΥΓΑΡΙΑΣ
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                      isBalanced
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                    }`}
                  >
                    {isBalanced ? 'ΙΣΟΡΡΟΠΙΑ (ΣΩΣΤΗ ΛΥΣΗ)' : 'ΑΝΙΣΟΡΡΟΠΙΑ (ΚΛΙΣΗ)'}
                  </span>
                </div>

                {/* SVG Ζυγαριά - Πολύ ευρύχωρη (740x400), Responsive και Χωρίς Scroll */}
                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg
                    viewBox="0 0 740 400"
                    className="w-full max-w-[680px] h-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Βάση & Κολόνα */}
                    <rect x="310" y="360" width="120" height="20" rx="6" fill="#334155" />
                    <polygon points="370,160 340,360 400,360" fill="#475569" stroke="#1e293b" strokeWidth="2" />
                    <circle cx="370" cy="160" r="12" fill="#f59e0b" />

                    {/* Κινούμενο σύστημα ζυγού */}
                    <g transform={`rotate(${tiltAngle} 370 160)`} className="transition-transform duration-300">
                      {/* Κεντρικός βραχίονας */}
                      <line x1="140" y1="160" x2="600" y2="160" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

                      {/* --- ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ --- */}
                      <g transform="translate(140, 160)">
                        {/* Νήματα ανάρτησης */}
                        <line x1="0" y1="0" x2="-120" y2="140" stroke="#64748b" strokeWidth="2.5" />
                        <line x1="0" y1="0" x2="120" y2="140" stroke="#64748b" strokeWidth="2.5" />

                        {/* Επιφάνεια Δίσκου */}
                        <ellipse cx="0" cy="140" rx="130" ry="22" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />

                        {/* ΚΟΥΤΙΑ x (Συντελεστής α) */}
                        <g transform="translate(-115, 80)">
                          {Array.from({ length: scaleCoeffA }).map((_, boxIdx) => {
                            const bX = boxIdx * 38; // 34 width + 4 spacing
                            return (
                              <g key={`box-${boxIdx}`}>
                                <rect
                                  x={bX}
                                  y="0"
                                  width="34"
                                  height="55"
                                  rx="4"
                                  fill="#0c4a6e"
                                  stroke="#38bdf8"
                                  strokeWidth="1.5"
                                />
                                <text x={bX + 17} y="13" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                                  x
                                </text>
                                {/* Μπάλες μέσα στο κουτί (έως 15) */}
                                {Array.from({ length: Math.min(scaleTestX, 15) }).map((_, bIdx) => (
                                  <circle
                                    key={`bb-${boxIdx}-${bIdx}`}
                                    cx={bX + 7 + (bIdx % 3) * 10}
                                    cy={48 - Math.floor(bIdx / 3) * 8}
                                    r="3.5"
                                    fill="#7dd3fc"
                                  />
                                ))}
                              </g>
                            );
                          })}
                        </g>

                        {/* ΜΠΑΛΕΣ β (Σταθερός όρος, τοποθέτηση δίπλα στα κουτιά) */}
                        <g transform={`translate(${-115 + scaleCoeffA * 38 + 10}, 132)`}>
                          {Array.from({ length: scaleConstB }).map((_, bIdx) => (
                            <circle
                              key={`const-b-${bIdx}`}
                              cx={(bIdx % 3) * 14}
                              cy={-6 - Math.floor(bIdx / 3) * 14}
                              r="6"
                              fill="#818cf8"
                              stroke="#c7d2fe"
                              strokeWidth="1"
                            />
                          ))}
                        </g>

                        {/* Καθαρή ετικέτα βάρους κάτω από τον δίσκο */}
                        <text x="0" y="185" fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="middle">
                          {leftWeight} μπάλες ({scaleCoeffA}x ＋ {scaleConstB})
                        </text>
                      </g>

                      {/* --- ΔΕΞΙΟΣ ΔΙΣΚΟΣ --- */}
                      <g transform="translate(600, 160)">
                        {/* Νήματα ανάρτησης */}
                        <line x1="0" y1="0" x2="-120" y2="140" stroke="#64748b" strokeWidth="2.5" />
                        <line x1="0" y1="0" x2="120" y2="140" stroke="#64748b" strokeWidth="2.5" />

                        {/* Επιφάνεια Δίσκου */}
                        <ellipse cx="0" cy="140" rx="130" ry="22" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />

                        {/* ΜΠΑΛΕΣ γ (Δεξιός δίσκος, σε σειρές των 7) */}
                        <g transform="translate(-42, 132)">
                          {Array.from({ length: Math.min(scaleTargetC, 25) }).map((_, bIdx) => {
                            const col = bIdx % 7;
                            const row = Math.floor(bIdx / 7);
                            return (
                              <circle
                                key={`target-c-${bIdx}`}
                                cx={col * 14}
                                cy={-6 - row * 14}
                                r="6"
                                fill="#f59e0b"
                                stroke="#fde68a"
                                strokeWidth="1"
                              />
                            );
                          })}
                        </g>

                        {/* Καθαρή ετικέτα βάρους κάτω από τον δίσκο */}
                        <text x="0" y="185" fill="#f59e0b" fontSize="14" fontWeight="bold" textAnchor="middle">
                          {rightWeight} μπάλες (γ)
                        </text>
                      </g>
                    </g>
                  </svg>
                </div>

                {/* Επεξήγηση αποτελέσματος */}
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1.5 text-slate-200">
                  <div className="font-mono text-base font-bold text-amber-300">
                    Εξίσωση: {scaleCoeffA} · x ＋ {scaleConstB} ＝ {scaleTargetC}
                  </div>
                  <div>
                    Δοκιμάζουμε <strong>x ＝ {scaleTestX}</strong> μπάλες σε κάθε κουτί:
                    <br />
                    Αριστερός δίσκος: {scaleCoeffA} · ({scaleTestX}) ＋ {scaleConstB} ＝ <strong>{leftWeight} μπάλες</strong>.
                    <br />
                    Δεξιός δίσκος: <strong>{rightWeight} μπάλες</strong>.
                  </div>
                  <div className={isBalanced ? 'text-emerald-400 font-bold pt-1' : 'text-rose-400 font-bold pt-1'}>
                    {isBalanced
                      ? `✅ Η ζυγαριά ισορροπεί τέλεια! Ο αριθμός x ＝ ${scaleTestX} είναι η λύση της εξίσωσης.`
                      : `❌ Η ζυγαριά γέρνει (${leftWeight > rightWeight ? 'βαρύτερος ο αριστερός δίσκος' : 'βαρύτερος ο δεξιός δίσκος'}). Το ${scaleTestX} δεν είναι λύση.`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΔΟΚΙΜΑΣΤΗΡΙΟ ΕΠΑΛΗΘΕΥΣΗΣ ΕΞΙΣΩΣΗΣ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Επαλήθευση Λύσης Εξίσωσης
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Steppers (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block">ΣΥΝΤΕΛΕΣΤΗΣ (α)</label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setEqA, -1, -6, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-indigo-950">
                    {eqA > 0 ? `＋${eqA}` : eqA}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setEqA, 1, -6, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">ΣΤΑΘΕΡΟΣ (β)</label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setEqB, -1, -15, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono">
                    {eqB > 0 ? `＋${eqB}` : eqB}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setEqB, 1, -15, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-700 uppercase block">2Ο ΜΕΛΟΣ (γ)</label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setEqC, -1, -25, 25, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-xs font-mono text-amber-950">
                    {eqC > 0 ? `＋${eqC}` : eqC}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setEqC, 1, -25, 25, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sky-700 uppercase block">ΔΟΚΙΜΑΣΤΙΚΟ x</label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setUserX, -1, -15, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-xs font-mono text-sky-950">
                    x ＝ {userX}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setUserX, 1, -15, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>
            </div>

            {/* Αναλυτικός Έλεγχος (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  ΔΟΚΙΜΑΣΤΗΡΙΟ ΕΠΑΛΗΘΕΥΣΗΣ
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                  isRootCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                }`}>
                  {isRootCorrect ? 'Η ΙΣΟΤΗΤΑ ΕΠΑΛΗΘΕΥΕΤΑΙ' : 'ΔΕΝ ΕΠΑΛΗΘΕΥΕΤΑΙ'}
                </span>
              </div>

              {/* Εμφάνιση Εξίσωσης */}
              <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-center text-lg sm:text-2xl font-black">
                <span className="text-sky-300">{eqA}x</span>{' '}
                <span className="text-slate-300">{eqB >= 0 ? `＋ ${eqB}` : `－ ${Math.abs(eqB)}`}</span>{' '}
                <span className="text-amber-400">＝</span>{' '}
                <span className="text-emerald-400">{eqC}</span>
              </div>

              {/* Βήματα Υπολογισμού */}
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1.5 text-slate-200">
                <div>
                  <strong>Υπολογισμός 1ου μέλους για x ＝ {userX}:</strong>
                </div>
                <div className="font-mono text-sm sm:text-base text-indigo-200">
                  1ο μέλος ＝ ({eqA}) · ({userX}) ＋ ({eqB}) ＝ {eqA * userX} {eqB >= 0 ? `＋ ${eqB}` : `－ ${Math.abs(eqB)}`} ＝ <strong>{leftSideVal}</strong>
                </div>
                <div className="font-mono text-sm sm:text-base text-amber-300">
                  2ο μέλος ＝ <strong>{eqC}</strong>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border text-xs sm:text-sm font-sans font-bold ${
                isRootCorrect
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                  : 'bg-rose-500/20 border-rose-400/40 text-rose-300'
              }`}>
                {isRootCorrect
                  ? `Συμπέρασμα: Επειδή 1ο μέλος ＝ 2ο μέλος (και τα δύο ισούνται με ${eqC}), ο αριθμός x ＝ ${userX} είναι η λύση της εξίσωσης!`
                  : `Συμπέρασμα: Επειδή 1ο μέλος (${leftSideVal}) ≠ 2ο μέλος (${eqC}), ο αριθμός x ＝ ${userX} ΔΕΝ είναι λύση της εξίσωσης.`}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
