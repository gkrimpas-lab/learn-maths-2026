// pages/st-dimotikou/28-afairesi-klasmaton.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Εξωτερικες μεταβλητες ρυθμισης
const MAX_LIMIT = 100;

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale και defensive checks
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

const PRESETS = [
  { nA: 5, dA: 7, nB: 2, dB: 7, label: '5/7 － 2/7 (Ομώνυμα)' },
  { nA: 3, dA: 4, nB: 1, dB: 2, label: '3/4 － 1/2 (Ετερώνυμα ➔ 1/4)' },
  { nA: 1, dA: 1, nB: 3, dB: 4, label: '1 － 3/4 (Αφαίρεση από Μονάδα)' },
  { nA: 5, dA: 6, nB: 1, dB: 3, label: '5/6 － 1/3 (Ε.Κ.Π. ＝ 6 ➔ 1/2)' }
];

// Βοηθητικη συναρτηση για ευρεση Μεγιστου Κοινου Διαιρετη (ΜΚΔ)
function findGCD(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Βοηθητικη συναρτηση για ευρεση Ελαχιστου Κοινου Πολλαπλασιου (ΕΚΠ)
function findLCM(a, b) {
  if (!a || !b) return 1;
  return Math.abs(a * b) / findGCD(a, b);
}

export default function AfairesiKlasmatonPage() {
  // Κλασμα Α (Αριστερα - Μπλε - Μειωτεος)
  const [numA, setNumA] = useState(3);
  const [denA, setDenA] = useState(4);

  // Κλασμα B (Δεξια - Πορτοκαλι - Αφαιρετεος)
  const [numB, setNumB] = useState(1);
  const [denB, setDenB] = useState(2);

  // Ασφαλης ελεγχος εισαγωγης κειμενου
  const handleNumAChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNumA(''); return; }
    const n = Number(clean);
    if (n <= MAX_LIMIT) setNumA(n);
  };

  const handleDenAChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setDenA(''); return; }
    const n = Number(clean);
    if (n > 0 && n <= MAX_LIMIT) setDenA(n);
  };

  const handleNumBChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNumB(''); return; }
    const n = Number(clean);
    if (n <= MAX_LIMIT) setNumB(n);
  };

  const handleDenBChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setDenB(''); return; }
    const n = Number(clean);
    if (n > 0 && n <= MAX_LIMIT) setDenB(n);
  };

  // Αυξομειωση με κουμπια για Κλασμα Α
  const adjustNumA = (amount) => {
    setNumA(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenA = (amount) => {
    setDenA(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
  };

  // Αυξομειωση με κουμπια για Κλασμα Β
  const adjustNumB = (amount) => {
    setNumB(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenB = (amount) => {
    setDenB(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
  };

  // Ενεργες τιμες για υπολογισμους
  const activeNumA = numA === '' ? 0 : Number(numA);
  const activeDenA = denA === '' || Number(denA) === 0 ? 1 : Number(denA);
  const activeNumB = numB === '' ? 0 : Number(numB);
  const activeDenB = denB === '' || Number(denB) === 0 ? 1 : Number(denB);

  // Υπολογισμος Ε.Κ.Π. και ομωνυμων κλασματων
  const lcm = findLCM(activeDenA, activeDenB) || 1;
  const multiplierA = lcm / activeDenA;
  const multiplierB = lcm / activeDenB;

  const equivalentNumA = activeNumA * multiplierA;
  const equivalentNumB = activeNumB * multiplierB;

  // Υπολογισμος Αφαιρεσεως με βαση το Ε.Κ.Π.
  const lcmResultNumRaw = equivalentNumA - equivalentNumB;
  const lcmResultDen = lcm;

  // Ελεγχος αν το αποτελεσμα ειναι αρνητικο
  const isNegative = lcmResultNumRaw < 0;
  const lcmResultNum = Math.abs(lcmResultNumRaw);

  // Απλοποιηση Αποτελεσματος
  const gcdResult = findGCD(lcmResultNum, lcmResultDen);
  const simplifiedNum = lcmResultNum / gcdResult;
  const simplifiedDen = lcmResultDen / gcdResult;
  const isSimplified = gcdResult > 1 && lcmResultNum !== 0;

  const isOriginallyOmonima = activeDenA === activeDenB;

  // Σχεδιαση κυκλικων διαγραμματων
  const renderFractionVisual = (num, den, fillColor = 'fill-blue-500', strokeColor = 'stroke-blue-700') => {
    const totalPizzasNeeded = Math.max(1, Math.ceil(num / den));
    const pizzas = [];

    const radius = 45;
    const cx = 55;
    const cy = 55;

    for (let p = 0; p < totalPizzasNeeded; p++) {
      const slices = [];
      const remainingNumForThisPizza = Math.max(0, Math.min(den, num - p * den));

      for (let i = 0; i < den; i++) {
        const angleStep = 360 / den;
        const startAngle = i * angleStep - 90;
        const endAngle = (i + 1) * angleStep - 90;

        const rad1 = (startAngle * Math.PI) / 180;
        const rad2 = (endAngle * Math.PI) / 180;

        const x1 = cx + radius * Math.cos(rad1);
        const y1 = cy + radius * Math.sin(rad1);
        const x2 = cx + radius * Math.cos(rad2);
        const y2 = cy + radius * Math.sin(rad2);

        const largeArcFlag = angleStep > 180 ? 1 : 0;

        const d = den === 1
          ? `M ${cx} ${cy} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
          : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

        const isFilled = i < remainingNumForThisPizza;

        slices.push(
          <path
            key={i}
            d={d}
            className={`${
              isFilled ? `${fillColor} ${strokeColor}` : 'fill-slate-100 stroke-slate-300'
            } transition-colors duration-200 stroke-[0.8]`}
          />
        );
      }

      pizzas.push(
        <div key={p} className="flex flex-col items-center space-y-1">
          <svg width="100" height="100" viewBox="0 0 110 110" className="drop-shadow-xs overflow-visible">
            {slices}
            <circle cx={cx} cy={cy} r="2.5" className="fill-slate-800" />
          </svg>
          <span className="text-[9px] font-bold text-slate-400 uppercase">
            ΜΟΝΑΔΑ {p + 1}
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-2 max-w-full p-2.5 bg-white rounded-2xl border border-slate-200 shadow-inner">
        {pizzas}
      </div>
    );
  };

  // Επεξηγηματικο παιδαγωγικο μηνυμα βημα-βημα
  const getStepByStepExplanation = () => {
    let typeHeader = isOriginallyOmonima 
      ? `🔵 ΟΜΩΝΥΜΑ ΚΛΑΣΜΑΤΑ (ΙΔΙΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ: ${activeDenA})`
      : `🟣 ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ (${activeDenA} ≠ ${activeDenB})`;

    return (
      <div className="space-y-3">
        <span className={`font-black uppercase block text-[11px] ${isOriginallyOmonima ? 'text-blue-800' : 'text-indigo-800'}`}>
          {typeHeader}
        </span>
        <div className="text-slate-600 space-y-1.5 text-xs md:text-sm">
          {!isOriginallyOmonima && (
            <>
              <p>1. Βρίσκουμε το <strong>Ε.Κ.Π.</strong>({activeDenA}, {activeDenB}) ＝ <strong>{lcm}</strong>.</p>
              <p>
                2. Μετατρέπουμε σε ομώνυμα:
                <br />
                • 1ο Κλάσμα (· {multiplierA}): <strong className="text-blue-700">{equivalentNumA}/{lcm}</strong>
                <br />
                • 2ο Κλάσμα (· {multiplierB}): <strong className="text-orange-700">{equivalentNumB}/{lcm}</strong>
              </p>
            </>
          )}
          <p>{isOriginallyOmonima ? 'Αφαιρούμε' : '3. Αφαιρούμε'} τους αριθμητές:</p>
        </div>
        
        <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-xs md:text-sm">
          {isOriginallyOmonima ? (
            <span>
              {activeNumA}/{activeDenA} － {activeNumB}/{activeDenB} ＝ ({activeNumA} － {activeNumB})/{activeDenA} ＝{' '}
            </span>
          ) : (
            <span>
              {equivalentNumA}/{lcm} － {equivalentNumB}/{lcm} ＝ ({equivalentNumA} － {equivalentNumB})/{lcm} ＝{' '}
            </span>
          )}
          <strong className={isNegative ? 'text-rose-600' : 'text-emerald-700'}>
            {isNegative ? '－' : ''}{lcmResultNum}/{lcmResultDen}
          </strong>
        </div>

        {isNegative && (
          <p className="text-rose-600 text-xs font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            ⚠️ Προσοχή: Το 2ο κλάσμα είναι μεγαλύτερο, οπότε το αποτέλεσμα είναι αρνητικό!
          </p>
        )}

        {isSimplified && (
          <p className="text-emerald-700 text-xs font-bold pt-1 border-t border-slate-100">
            ✨ Απλοποιώντας με το {gcdResult}, το τελικό ανάγωγο κλάσμα γίνεται: {isNegative ? '－' : ''}{simplifiedNum}/{simplifiedDen}
          </p>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Αφαίρεση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς αφαιρούμε ομώνυμα και ετερώνυμα κλάσματα με το Ε.Κ.Π. και πώς απλοποιούμε τη διαφορά για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/28-afairesi-klasmaton-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 28 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Αφαίρεση Κλασμάτων (Ομώνυμα και Ετερώνυμα)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς αφαιρούμε <strong>ομώνυμα κλάσματα</strong> αφαιρώντας μόνο τους αριθμητές, και πώς κάνουμε τα <strong>ετερώνυμα ομώνυμα με το Ε.Κ.Π.</strong> πριν εκτελέσουμε την αφαίρεση!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Βήμα-προς-Βήμα Ε.Κ.Π., Ομώνυμα &amp; Οπτική Αφαίρεση σε Πίτσες</span>
            </div>
            <Link
              href="/st-dimotikou/28-afairesi-klasmaton-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (3 COLS) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Βασικές Έννοιες &amp; Κανόνες Αφαίρεσης Κλασμάτων
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Όλα όσα πρέπει να γνωρίζεις για τα ομώνυμα, τα ετερώνυμα και την απλοποίηση της διαφοράς.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    1. ΟΜΩΝΥΜΑ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ίδιος Παρονομαστής</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ομώνυμα Κλάσματα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Όταν οι παρονομαστές είναι ίδιοι, <strong>αφαιρούμε μόνο τους αριθμητές</strong> και αφήνουμε τον ίδιο παρονομαστή.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>5/7 － 2/7 ＝ <strong className="text-sky-700">3/7</strong></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 <strong>Προσοχή SOS:</strong> Ποτέ δεν αφαιρούμε τους παρονομαστές μεταξύ τους (5/7 － 2/7 ≠ 3/0)!
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    2. ΕΤΕΡΩΝΥΜΑ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">Με Ε.Κ.Π.</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ετερώνυμα Κλάσματα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Βρίσκουμε το <strong>Ε.Κ.Π.</strong> των παρονομαστών, βάζουμε καπελάκια για να τα κάνουμε ομώνυμα και μετά αφαιρούμε!
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>3/4 (3/4) － 1/2 (2/4) ＝ <strong className="text-indigo-700">1/4</strong></p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Όταν αφαιρούμε κλάσμα από ακέραια μονάδα, γράφουμε τη μονάδα ως κλάσμα (π.χ. 1 ＝ 4/4, άρα 1 － 3/4 ＝ 1/4).
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    3. ΑΠΛΟΠΟΙΗΣΗ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">Σε Ανάγωγο</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Απλοποίηση Διαφοράς
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αν η διαφορά δεν είναι ανάγωγο κλάσμα, διαιρούμε με τον <strong>Μ.Κ.Δ.</strong> για να φτάσουμε στην απλούστερη μορφή.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>5/6 － 1/3 ＝ 3/6 ➔ <strong className="text-emerald-700">1/2</strong></p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🎯 Αν ο μειωτέος και ο αφαιρετέος είναι ίσοι, η διαφορά είναι πάντα 0 (π.χ. 3/4 － 3/4 ＝ 0).
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Διαδραστικό Εργαστήριο Αφαίρεσης Κλασμάτων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-1">
              Ρύθμισε τα δύο κλάσματα και παρακολούθησε βήμα-βήμα την αφαίρεση, τη μετατροπή σε ομώνυμα και την οπτικοποίηση!
            </p>
          </div>

          {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Α (ΜΠΛΕ - ΜΕΙΩΤΕΟΣ) */}
                <div className="bg-blue-50/60 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-3">
                  <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                    🔵 ΚΛΑΣΜΑ 1 (ΜΕΙΩΤΕΟΣ)
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">ΑΡΙΘΜΗΤΗΣ</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`numA-${numA}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={numA === '' ? '' : String(numA)}
                          onChange={(e) => handleNumAChange(e.target.value)}
                          placeholder="3"
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">ΠΑΡΟΝΟΜΑΣΤΗΣ</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`denA-${denA}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={denA === '' ? '' : String(denA)}
                          onChange={(e) => handleDenAChange(e.target.value)}
                          placeholder="4"
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Β (ΠΟΡΤΟΚΑΛΙ - ΑΦΑΙΡΕΤΕΟΣ) */}
                <div className="bg-orange-50/60 p-3.5 sm:p-4 rounded-2xl border border-orange-200 space-y-3">
                  <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                    🟠 ΚΛΑΣΜΑ 2 (ΑΦΑΙΡΕΤΕΟΣ)
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">ΑΡΙΘΜΗΤΗΣ</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`numB-${numB}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={numB === '' ? '' : String(numB)}
                          onChange={(e) => handleNumBChange(e.target.value)}
                          placeholder="1"
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">ΠΑΡΟΝΟΜΑΣΤΗΣ</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`denB-${denB}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={denB === '' ? '' : String(denB)}
                          onChange={(e) => handleDenBChange(e.target.value)}
                          placeholder="2"
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNumA(p.nA);
                          setDenA(p.dA);
                          setNumB(p.nB);
                          setDenB(p.dB);
                        }}
                        className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center touch-manipulation active:scale-95 ${
                          activeNumA === p.nA && activeDenA === p.dA && activeNumB === p.nB && activeDenB === p.dB
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ΒΗΜΑ-ΒΗΜΑ ΕΠΕΞΗΓΗΣΗ */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs">
                  {getStepByStepExplanation()}
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                💡 <strong>Θυμήσου:</strong> Αφαιρούμε μόνο τους αριθμητές (α － β), ο παρονομαστής παραμένει ίδιος!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & AUTO-EXPANDING PIZZAS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΑΦΑΙΡΕΣΗΣ */}
              <div className="flex items-center justify-center p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2.5 sm:gap-4 font-mono font-black text-lg sm:text-xl md:text-3xl select-none flex-wrap justify-center">
                  
                  {/* 1ο Κλάσμα */}
                  <div className="flex flex-col items-center">
                    <span className="text-blue-600">{activeNumA}</span>
                    <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                    <span className="text-blue-600">{activeDenA}</span>
                  </div>

                  {/* Σύμβολο － */}
                  <div className="text-slate-400 font-light">－</div>

                  {/* 2ο Κλάσμα */}
                  <div className="flex flex-col items-center">
                    <span className="text-orange-600">{activeNumB}</span>
                    <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                    <span className="text-orange-600">{activeDenB}</span>
                  </div>

                  {/* Ενδιάμεσο βήμα ομωνύμων (αν ήταν ετερώνυμα) */}
                  {!isOriginallyOmonima && (
                    <>
                      <div className="text-slate-400 font-light">＝</div>

                      <div className="flex flex-col items-center">
                        <span className="text-blue-600/80">{equivalentNumA}</span>
                        <div className="w-8 sm:w-10 h-0.5 bg-slate-400 my-1 rounded-full" />
                        <span className="text-slate-700">{lcm}</span>
                      </div>

                      <div className="text-slate-400 font-light">－</div>

                      <div className="flex flex-col items-center">
                        <span className="text-orange-600/80">{equivalentNumB}</span>
                        <div className="w-8 sm:w-10 h-0.5 bg-slate-400 my-1 rounded-full" />
                        <span className="text-slate-700">{lcm}</span>
                      </div>
                    </>
                  )}

                  <div className="text-slate-500 font-bold">＝</div>

                  {/* Διαφορά (με βάση το ΕΚΠ) */}
                  <div className="flex items-center font-mono">
                    {isNegative && <span className="text-rose-600 text-2xl sm:text-3xl font-black mr-1">－</span>}
                    <div className={`flex flex-col items-center ${isNegative ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'} px-2.5 sm:px-3 py-1.5 rounded-xl border`}>
                      <span className={isNegative ? 'text-rose-700' : 'text-emerald-700'}>{lcmResultNum}</span>
                      <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className={isNegative ? 'text-rose-700' : 'text-emerald-700'}>{lcmResultDen}</span>
                    </div>
                  </div>

                  {/* Τελικό Ανάγωγο (αν απλοποιείται) */}
                  {isSimplified && (
                    <>
                      <div className={isNegative ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>＝</div>
                      <div className="flex items-center font-mono">
                        {isNegative && <span className="text-rose-600 text-2xl sm:text-3xl font-black mr-1">－</span>}
                        <div className={`flex flex-col items-center ${isNegative ? 'bg-rose-100 border-rose-300' : 'bg-emerald-100 border-emerald-300'} px-2.5 sm:px-3 py-1.5 rounded-xl border`}>
                          <span className={isNegative ? 'text-rose-800' : 'text-emerald-800'}>{simplifiedNum}</span>
                          <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                          <span className={isNegative ? 'text-rose-800' : 'text-emerald-800'}>{simplifiedDen}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 2. ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΠΙΤΣΑΣ (AUTO-EXPANDING ΧΩΡΙΣ SCROLL) */}
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                    🍕 ΟΠΤΙΚΗ ΑΦΑΙΡΕΣΗ (ΚΥΚΛΙΚΟ ΜΟΝΤΕΛΟ):
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Εμφανίζονται όλες οι μονάδες
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner p-3 sm:p-5">
                  {/* Πίτσα Α */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider text-center">ΚΛΑΣΜΑ 1 ({activeNumA}/{activeDenA})</span>
                    {renderFractionVisual(activeNumA, activeDenA, 'fill-blue-500', 'stroke-blue-700')}
                  </div>

                  <div className="text-xl text-slate-400 font-black px-1">－</div>

                  {/* Πίτσα Β */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider text-center">ΚΛΑΣΜΑ 2 ({activeNumB}/{activeDenB})</span>
                    {renderFractionVisual(activeNumB, activeDenB, 'fill-orange-500', 'stroke-orange-700')}
                  </div>

                  {/* Ενδιάμεσες ομώνυμες πίτσες */}
                  {!isOriginallyOmonima && (
                    <>
                      <div className="text-xl text-slate-400 font-black px-1">＝</div>

                      <div className="flex flex-col items-center space-y-1.5 opacity-90">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider text-center">ΟΜΩΝΥΜΟ 1 ({equivalentNumA}/{lcm})</span>
                        {renderFractionVisual(equivalentNumA, lcm, 'fill-blue-500/90', 'stroke-blue-600')}
                      </div>

                      <div className="text-xl text-slate-400 font-black px-1">－</div>

                      <div className="flex flex-col items-center space-y-1.5 opacity-90">
                        <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider text-center">ΟΜΩΝΥΜΟ 2 ({equivalentNumB}/{lcm})</span>
                        {renderFractionVisual(equivalentNumB, lcm, 'fill-orange-500/90', 'stroke-orange-600')}
                      </div>
                    </>
                  )}

                  <div className="text-xl text-slate-500 font-black px-1">＝</div>

                  {/* Πίτσα Αποτελέσματος */}
                  <div className={`flex flex-col items-center space-y-1.5 p-2 rounded-2xl border ${isNegative ? 'bg-rose-50/70 border-rose-200' : 'bg-emerald-50/70 border-emerald-200'}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${isNegative ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {isNegative ? 'ΕΛΛΕΙΜΜΑ' : 'ΥΠΟΛΟΙΠΟ'} ({isNegative ? '－' : ''}{lcmResultNum}/{lcmResultDen})
                    </span>
                    {renderFractionVisual(lcmResultNum, lcmResultDen, isNegative ? 'fill-rose-500' : 'fill-emerald-500', isNegative ? 'stroke-rose-700' : 'stroke-emerald-700')}
                  </div>

                  {/* Πίτσα Ανάγωγου */}
                  {isSimplified && (
                    <>
                      <div className={`text-xl font-black px-1 ${isNegative ? 'text-rose-600' : 'text-emerald-600'}`}>＝</div>
                      <div className={`flex flex-col items-center space-y-1.5 p-2 rounded-2xl border ${isNegative ? 'bg-rose-100/70 border-rose-300' : 'bg-emerald-100/70 border-emerald-300'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${isNegative ? 'text-rose-800' : 'text-emerald-800'}`}>
                          ΑΝΑΓΩΓΟ ({isNegative ? '－' : ''}{simplifiedNum}/{simplifiedDen})
                        </span>
                        {renderFractionVisual(simplifiedNum, simplifiedDen, isNegative ? 'fill-rose-600' : 'fill-emerald-600', isNegative ? 'stroke-rose-800' : 'stroke-emerald-800')}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-3.5 sm:p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                💡 ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ: {activeNumA}/{activeDenA} － {activeNumB}/{activeDenB} ＝ {isNegative ? '－' : ''}{isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${lcmResultNum}/${lcmResultDen}`}
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στην Αφαίρεση Κλασμάτων!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες να αφαιρείς ομώνυμα και ετερώνυμα κλάσματα; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/28-afairesi-klasmaton-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase('Έναρξη Ασκήσεων')}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
