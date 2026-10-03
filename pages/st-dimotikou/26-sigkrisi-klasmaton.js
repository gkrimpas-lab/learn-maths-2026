// pages/st-dimotikou/26-sigkrisi-klasmaton.js
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
  { nA: 3, dA: 8, nB: 5, dB: 8, label: '3/8 vs 5/8 (Ομώνυμα)' },
  { nA: 2, dA: 3, nB: 2, dB: 5, label: '2/3 vs 2/5 (Ίδιος Αριθμητής)' },
  { nA: 2, dA: 3, nB: 3, dB: 4, label: '2/3 vs 3/4 (Ετερώνυμα)' },
  { nA: 3, dA: 6, nB: 4, dB: 8, label: '3/6 vs 4/8 (Ισοδύναμα ＝ 1/2)' }
];

// Υπολογισμος Μ.Κ.Δ. και Ε.Κ.Π.
function gcd(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a, b) {
  if (!a || !b) return 1;
  return Math.abs(a * b) / gcd(a, b);
}

export default function SigkrisiKlasmatonPage() {
  // Κλασμα Α (Αριστερα - Μπλε)
  const [numA, setNumA] = useState(2);
  const [denA, setDenA] = useState(7);

  // Κλασμα Β (Δεξια - Πορτοκαλι)
  const [numB, setNumB] = useState(7);
  const [denB, setDenB] = useState(4);

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

  const valA = activeNumA / activeDenA;
  const valB = activeNumB / activeDenB;

  // Υπολογισμος δυναμικης κλιμακας αριθμογραμμης
  const maxDecimal = Math.max(valA, valB);
  const maxLineVal = Math.max(2, Math.ceil(maxDecimal + 0.2));

  // Δημιουργια των σημειων της αριθμογραμμης
  const step = maxLineVal > 10 ? Math.ceil(maxLineVal / 6) : 1;
  const lineMarkers = [];
  for (let m = 0; m <= maxLineVal; m += step) {
    lineMarkers.push(m);
  }
  if (!lineMarkers.includes(maxLineVal)) {
    lineMarkers.push(maxLineVal);
  }

  // Υπολογισμος Ε.Κ.Π. και Ομωνυμων Κλασματων
  const commonDen = lcm(activeDenA, activeDenB) || 1;
  const multA = commonDen / activeDenA;
  const multB = commonDen / activeDenB;
  const homoNumA = activeNumA * multA;
  const homoNumB = activeNumB * multB;

  // Υπολογισμος Χιαστι Γινομενων
  const crossA = activeNumA * activeDenB;
  const crossB = activeNumB * activeDenA;

  // Ευρεση του συμβολου συγκρισης
  const getComparisonSymbol = () => {
    if (valA > valB) return '＞';
    if (valA < valB) return '＜';
    return '＝';
  };

  // Σχεδιαση των κυκλικων διαγραμματων
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
      <div className="flex flex-wrap justify-center gap-2 max-w-full p-3 bg-white rounded-2xl border border-slate-200 shadow-inner">
        {pizzas}
      </div>
    );
  };

  return (
    <Layout
      title="Σύγκριση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς συγκρίνουμε κλάσματα: ομώνυμα με το Ε.Κ.Π., σύγκριση αριθμητών και μέθοδος χιαστί για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/26-sigkrisi-klasmaton-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 26 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Σύγκριση Κλασμάτων (Ομώνυμα, Ε.Κ.Π. και Χιαστί)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς συγκρίνουμε κλάσματα: κάνοντάς τα <strong>ομώνυμα με το Ε.Κ.Π.</strong>, συγκρίνοντας τους <strong>αριθμητές</strong> ή εφαρμόζοντας τον ταχύτατο <strong>πολλαπλασιασμό χιαστί</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Παράλληλη Επεξήγηση με Ε.Κ.Π. &amp; Χιαστί σε Πραγματικό Χρόνο</span>
            </div>
            <Link
              href="/st-dimotikou/26-sigkrisi-klasmaton-ask"
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
              Βασικές Έννοιες &amp; Μέθοδοι Σύγκρισης Κλασμάτων
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Οι τρεις αποτελεσματικοί κανόνες για να συγκρίνεις οποιαδήποτε δύο κλάσματα.
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
                  Όταν οι παρονομαστές είναι ίδιοι, <strong>μεγαλύτερο</strong> είναι το κλάσμα με τον <strong>μεγαλύτερο αριθμητή</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>5/8 ＞ 3/8</p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Αν έχουν τον ίδιο αριθμητή, μεγαλύτερο είναι εκείνο με τον <strong>μικρότερο</strong> παρονομαστή (π.χ. 2/3 ＞ 2/5).
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    2. ΜΕ Ε.Κ.Π.
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">Ετερώνυμα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μετατροπή σε Ομώνυμα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Βρίσκουμε το <strong>Ε.Κ.Π.</strong> των παρονομαστών, φτιάχνουμε ισοδύναμα ομώνυμα κλάσματα και συγκρίνουμε τους νέους αριθμητές.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>2/3 (8/12) ＜ 3/4 (9/12)</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Η μέθοδος των ομώνυμων είναι η βασική μέθοδος που χρησιμοποιούμε και στην πρόσθεση ή αφαίρεση κλασμάτων!
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    3. ΧΙΑΣΤΙ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-amber-600">Ταχύτατος Έλεγχος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μέθοδος Χιαστί
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Πολλαπλασιάζουμε χιαστί: (α · δ) και (γ · β). Συγκρίνουμε τα γινόμενα για άμεσο αποτέλεσμα!
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>2 · 4 ＝ 8 ＜ 3 · 3 ＝ 9 ➔ 2/3 ＜ 3/4</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 Ο χιαστί έλεγχος είναι ιδανικός όταν θέλουμε άμεση σύγκριση χωρίς να ψάχνουμε το Ε.Κ.Π.
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
              Διαδραστικό Εργαστήριο Σύγκρισης Κλασμάτων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-1">
              Ρύθμισε τα δύο κλάσματα και παρακολούθησε ταυτόχρονα και τις δύο μεθόδους (Ομώνυμα &amp; Χιαστί) μαζί με την οπτική αναπαράσταση!
            </p>
          </div>

          {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Α (ΜΠΛΕ) */}
                <div className="bg-blue-50/60 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-3">
                  <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                    🔵 ΚΛΑΣΜΑ Α (ΑΡΙΣΤΕΡΟ)
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
                          placeholder="2"
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
                          placeholder="7"
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

                {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Β (ΠΟΡΤΟΚΑΛΙ) */}
                <div className="bg-orange-50/60 p-3.5 sm:p-4 rounded-2xl border border-orange-200 space-y-3">
                  <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                    🟠 ΚΛΑΣΜΑ Β (ΔΕΞΙ)
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
                          placeholder="7"
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
                          placeholder="4"
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

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-4">
                💡 <strong>Χρυσός Κανόνας:</strong> Δύο κλάσματα συγκρίνονται πάντα ευκολότερα είτε αν έχουν ίδιο παρονομαστή είτε με πολλαπλασιασμό χιαστί!
              </div>
            </div>

            {/* RIGHT: PARALLEL COMPARISON METHODS, NUMBER LINE & PIZZAS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΜΕ ΤΟ ΣΥΜΒΟΛΟ */}
              <div className="flex items-center justify-center p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-4 sm:gap-10 font-mono font-black text-2xl sm:text-3xl md:text-5xl select-none">
                  {/* Κλάσμα Α */}
                  <div className="flex flex-col items-center">
                    <span className="text-blue-600">{activeNumA}</span>
                    <div className="w-10 sm:w-16 h-1 sm:h-1.5 bg-slate-800 my-1 rounded-full" />
                    <span className="text-blue-600">{activeDenA}</span>
                  </div>

                  {/* Σύμβολο Σύγκρισης */}
                  <div className="text-3xl sm:text-4xl md:text-6xl text-amber-500 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-md border border-slate-200">
                    {getComparisonSymbol()}
                  </div>

                  {/* Κλάσμα Β */}
                  <div className="flex flex-col items-center">
                    <span className="text-orange-600">{activeNumB}</span>
                    <div className="w-10 sm:w-16 h-1 sm:h-1.5 bg-slate-800 my-1 rounded-full" />
                    <span className="text-orange-600">{activeDenB}</span>
                  </div>
                </div>
              </div>

              {/* 2. ΟΙ 2 ΜΕΘΟΔΟΙ ΣΥΓΚΡΙΣΗΣ ΔΙΠΛΑ-ΔΙΠΛΑ (PARALLEL METHODS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* ΜΕΘΟΔΟΣ 1: ΟΜΩΝΥΜΑ ΜΕ Ε.Κ.Π. */}
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                    <span className="text-xs font-black text-blue-900 uppercase">
                      📐 1. ΜΕΤΑΤΡΟΠΗ ΣΕ ΟΜΩΝΥΜΑ
                    </span>
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                      Ε.Κ.Π. ＝ {commonDen}
                    </span>
                  </div>
                  
                  {activeDenA === activeDenB ? (
                    <p className="text-xs text-slate-700 leading-relaxed pt-1">
                      Τα κλάσματα είναι ήδη ομώνυμα με παρονομαστή <strong>{activeDenA}</strong>. Συγκρίνουμε τους αριθμητές: 
                      <span className="font-mono font-bold block pt-1 text-sm text-slate-900">
                        {activeNumA} {getComparisonSymbol()} {activeNumB}
                      </span>
                    </p>
                  ) : (
                    <div className="text-xs text-slate-700 space-y-1.5 pt-1 font-mono">
                      <p>
                        • 1ο: <span className="text-blue-700 font-bold">({activeNumA} · {multA}) / {commonDen} ＝ {homoNumA}/{commonDen}</span>
                      </p>
                      <p>
                        • 2ο: <span className="text-orange-700 font-bold">({activeNumB} · {multB}) / {commonDen} ＝ {homoNumB}/{commonDen}</span>
                      </p>
                      <p className="font-sans font-bold text-slate-900 border-t border-blue-200/60 pt-1">
                        Σύγκριση νέων αριθμητών: <span className="font-mono">{homoNumA} {getComparisonSymbol()} {homoNumB}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* ΜΕΘΟΔΟΣ 2: ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΧΙΑΣΤΙ */}
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <span className="text-xs font-black text-amber-900 uppercase">
                      ⚡ 2. ΜΕΘΟΔΟΣ ΧΙΑΣΤΙ
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200">
                      Γρήγορος Έλεγχος
                    </span>
                  </div>
                  
                  <div className="text-xs text-slate-700 space-y-1.5 pt-1 font-mono">
                    <p>
                      • Αριστερά: <span className="text-blue-700 font-bold">{activeNumA} · {activeDenB} ＝ {crossA}</span>
                    </p>
                    <p>
                      • Δεξιά: <span className="text-orange-700 font-bold">{activeNumB} · {activeDenA} ＝ {crossB}</span>
                    </p>
                    <p className="font-sans font-bold text-slate-900 border-t border-amber-200/60 pt-1">
                      Σύγκριση γινομένων: <span className="font-mono">{crossA} {getComparisonSymbol()} {crossB}</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* 3. ΔΥΝΑΜΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ (DYNAMIC NUMBER LINE) */}
              <div className="space-y-2 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider">
                    📍 ΔΥΝΑΜΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ (0 ΕΩΣ {maxLineVal}):
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Προσαρμόζεται αυτόματα στο μέγεθος
                  </span>
                </div>

                <div className="relative w-full pt-12 pb-6 px-4 sm:px-6 select-none">
                  <div className="relative w-full h-1.5 bg-slate-300 rounded-full">
                    {/* Δυναμικοί Ακέραιοι/Σημεία */}
                    {lineMarkers.map((num) => {
                      const pct = (num / maxLineVal) * 100;
                      return (
                        <div key={num} className="absolute flex flex-col items-center" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
                          <div className="w-0.5 h-4 bg-slate-800 -top-2 relative" />
                          <span className="text-xs font-mono font-black text-slate-700 top-1 relative">{num}</span>
                        </div>
                      );
                    })}

                    {/* Δείκτης Κλάσματος Α (Μπλε) */}
                    <div 
                      className="absolute flex flex-col items-center -top-9 transition-all duration-500 ease-out z-10"
                      style={{ left: `${Math.min(100, Math.max(0, (valA / maxLineVal) * 100))}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="bg-blue-600 text-white font-mono text-[10px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-lg shadow-md mb-0.5 whitespace-nowrap">
                        Α: {activeNumA}/{activeDenA} ({valA.toFixed(2).replace('.', ',')})
                      </div>
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-md animate-bounce" />
                    </div>

                    {/* Δείκτης Κλάσματος Β (Πορτοκαλί) */}
                    <div 
                      className="absolute flex flex-col items-center -top-9 transition-all duration-500 ease-out z-20"
                      style={{ left: `${Math.min(100, Math.max(0, (valB / maxLineVal) * 100))}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="bg-orange-600 text-white font-mono text-[10px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-lg shadow-md mb-0.5 whitespace-nowrap">
                        Β: {activeNumB}/{activeDenB} ({valB.toFixed(2).replace('.', ',')})
                      </div>
                      <div className="w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-md animate-bounce" />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 italic text-center pt-1">
                  Το κλάσμα που βρίσκεται <strong>πιο δεξιά στην αριθμογραμμή</strong> είναι το μεγαλύτερο!
                </p>
              </div>

              {/* 4. ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΠΙΤΣΑΣ (AUTO-EXPANDING ΧΩΡΙΣ SCROLL) */}
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                    🍕 ΟΠΤΙΚΗ ΣΥΓΚΡΙΣΗ ΕΠΙΦΑΝΕΙΑΣ:
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Εμφανίζονται όλες οι μονάδες
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                  {/* Πίτσα Α */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                      ΚΛΑΣΜΑ Α ({activeNumA}/{activeDenA})
                    </span>
                    {renderFractionVisual(activeNumA, activeDenA, 'fill-blue-500', 'stroke-blue-700')}
                    <span className="font-mono text-xs text-slate-600 font-bold bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-xs">
                      {activeDenA !== commonDen ? `Ομώνυμο: ${homoNumA}/${commonDen}` : `Αξία: ${valA.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>

                  {/* Πίτσα Β */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs font-black text-orange-600 uppercase tracking-wider">
                      ΚΛΑΣΜΑ Β ({activeNumB}/{activeDenB})
                    </span>
                    {renderFractionVisual(activeNumB, activeDenB, 'fill-orange-500', 'stroke-orange-700')}
                    <span className="font-mono text-xs text-slate-600 font-bold bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-xs">
                      {activeDenA !== commonDen ? `Ομώνυμο: ${homoNumB}/${commonDen}` : `Αξία: ${valB.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 text-white p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                ⚖️️ ΣΥΜΠΕΡΑΣΜΑ: {activeNumA}/{activeDenA} {getComparisonSymbol()} {activeNumB}/{activeDenB} (Το κλάσμα που καλύπτει μεγαλύτερη επιφάνεια και βρίσκεται πιο δεξιά στην αριθμογραμμή είναι το μεγαλύτερο!)
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στη Σύγκριση Κλασμάτων!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες να συγκρίνεις ομώνυμα, ετερώνυμα και ισοδύναμα κλάσματα; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/26-sigkrisi-klasmaton-ask"
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
