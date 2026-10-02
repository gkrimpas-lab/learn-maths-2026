// pages/st-dimotikou/20-ekp-protoi.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μεγιστος αριθμος για εισαγωγη
const MAX_ALLOWED_NUMBER = 1000;

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
function formatNumber(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

const PRESETS_2 = [
  { n1: 12, n2: 18, label: 'Ε.Κ.Π.(12, 18)' },
  { n1: 24, n2: 36, label: 'Ε.Κ.Π.(24, 36)' },
  { n1: 20, n2: 50, label: 'Ε.Κ.Π.(20, 50)' },
  { n1: 45, n2: 60, label: 'Ε.Κ.Π.(45, 60)' }
];

const PRESETS_3 = [
  { n1: 8, n2: 12, n3: 15, label: 'Ε.Κ.Π.(8, 12, 15)' },
  { n1: 10, n2: 15, n3: 20, label: 'Ε.Κ.Π.(10, 15, 20)' },
  { n1: 12, n2: 18, n3: 24, label: 'Ε.Κ.Π.(12, 18, 24)' },
  { n1: 6, n2: 20, n3: 45, label: 'Ε.Κ.Π.(6, 20, 45)' }
];

const EXPONENTS_UNICODE = {
  1: '',
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
  7: '⁷',
  8: '⁸',
  9: '⁹'
};

// Συναρτηση που επιστρεφει τους πρωτους παραγοντες ενος αριθμου και τα βηματα της καθετης αναλυσης
function factorize(num) {
  const parsed = Number(num);
  if (!parsed || isNaN(parsed) || parsed < 2) {
    return {
      steps: [{ current: parsed || 1, divisor: null }],
      factors: {},
      expr: `${parsed || 1}`
    };
  }

  let temp = parsed;
  const steps = [];
  const factors = {};
  let d = 2;

  while (temp > 1) {
    if (temp % d === 0) {
      steps.push({ current: temp, divisor: d });
      factors[d] = (factors[d] || 0) + 1;
      temp = Math.floor(temp / d);
    } else {
      d++;
      if (d * d > temp) {
        if (temp > 1) {
          steps.push({ current: temp, divisor: temp });
          factors[temp] = (factors[temp] || 0) + 1;
          temp = 1;
        }
        break;
      }
    }
    if (d > 1000) break;
  }
  steps.push({ current: 1, divisor: null });

  const parts = Object.keys(factors)
    .map(Number)
    .sort((a, b) => a - b)
    .map((f) => {
      const exp = factors[f];
      return exp > 1 ? `${f}${EXPONENTS_UNICODE[exp] || `^${exp}`}` : `${f}`;
    });

  const expr = parts.length > 0 ? parts.join(' · ') : `${parsed}`;

  return { steps, factors, expr };
}

export default function EkpProtoiPage() {
  const [numCount, setNumCount] = useState(2); // 2 η 3 αριθμοι

  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(18);
  const [num3, setNum3] = useState(15);

  const handleInputChange = (setter, val) => {
    const clean = val.replace(/[^0-9]/g, '');

    if (clean === '') {
      setter('');
      return;
    }

    const n = Number(clean);
    if (n <= MAX_ALLOWED_NUMBER) {
      setter(n);
    }
  };

  const safeNum1 = num1 === '' ? 1 : Number(num1);
  const safeNum2 = num2 === '' ? 1 : Number(num2);
  const safeNum3 = num3 === '' ? 1 : Number(num3);

  const f1 = factorize(safeNum1);
  const f2 = factorize(safeNum2);
  const f3 =
    numCount === 3
      ? factorize(safeNum3)
      : { steps: [{ current: 1, divisor: null }], factors: {}, expr: '1' };

  const allPrimeBases = Array.from(
    new Set([
      ...Object.keys(f1.factors).map(Number),
      ...Object.keys(f2.factors).map(Number),
      ...(numCount === 3 ? Object.keys(f3.factors).map(Number) : [])
    ])
  ).sort((a, b) => a - b);

  let ekp = 1;
  const calculationFormulaParts = [];
  const ruleBreakdown = [];

  allPrimeBases.forEach((base) => {
    const e1 = f1.factors[base] || 0;
    const e2 = f2.factors[base] || 0;
    const e3 = numCount === 3 ? f3.factors[base] || 0 : 0;

    const maxExp = Math.max(e1, e2, e3);
    if (maxExp > 0) {
      ekp *= Math.pow(base, maxExp);

      const expStr =
        maxExp > 1
          ? `${base}${EXPONENTS_UNICODE[maxExp] || `^${maxExp}`}`
          : `${base}`;
      calculationFormulaParts.push(expStr);

      const appearances = [];
      if (e1 > 0) appearances.push(`στο ${safeNum1}: ${base}${EXPONENTS_UNICODE[e1] || ''}`);
      if (e2 > 0) appearances.push(`στο ${safeNum2}: ${base}${EXPONENTS_UNICODE[e2] || ''}`);
      if (numCount === 3 && e3 > 0) appearances.push(`στο ${safeNum3}: ${base}${EXPONENTS_UNICODE[e3] || ''}`);

      ruleBreakdown.push({
        base,
        maxExp,
        expStr,
        appearances: appearances.join(', ')
      });
    }
  });

  const activeNumbers =
    numCount === 2 ? [safeNum1, safeNum2] : [safeNum1, safeNum2, safeNum3];

  const numbersList = [
    {
      val: num1,
      safeVal: safeNum1,
      color: 'text-blue-600',
      fact: f1,
      label: '1ΟΣ ΑΡΙΘΜΟΣ',
      badge: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      val: num2,
      safeVal: safeNum2,
      color: 'text-indigo-600',
      fact: f2,
      label: '2ΟΣ ΑΡΙΘΜΟΣ',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
  ];

  if (numCount === 3) {
    numbersList.push({
      val: num3,
      safeVal: safeNum3,
      color: 'text-purple-600',
      fact: f3,
      label: '3ΟΣ ΑΡΙΘΜΟΣ',
      badge: 'bg-purple-100 text-purple-800 border-purple-200'
    });
  }

  const currentNumbersString = activeNumbers.join(', ');

  return (
    <Layout
      title="Ε.Κ.Π. με Ανάλυση σε Πρώτους Παράγοντες - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Υπολόγισε ταχύτατα το Ελάχιστο Κοινό Πολλαπλάσιο μεγάλων αριθμών εφαρμόζοντας τον κανόνα των κοινών και μη κοινών πρώτων παραγόντων με τον μεγαλύτερο εκθέτη για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/20-ekp-protoi-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 20 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ε.Κ.Π. με Ανάλυση σε Πρώτους Παράγοντες
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Υπολόγισε ταχύτατα το Ελάχιστο Κοινό Πολλαπλάσιο μεγάλων αριθμών εφαρμόζοντας τον χρυσό κανόνα: <strong>Κοινοί και μη κοινοί πρώτοι παράγοντες με τον μεγαλύτερο εκθέτη</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Κατακόρυφη Ανάλυση &amp; Αυτόματη Επιλογή Μέγιστων Εκθετών</span>
            </div>
            <Link
              href="/st-dimotikou/20-ekp-protoi-ask"
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
              Βασικές Έννοιες &amp; Κανόνας Υπολογισμού Ε.Κ.Π.
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Η μέθοδος των πρώτων παραγόντων σε τρία απλά και ξεκάθαρα βήματα.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Κατακόρυφη Γραμμή</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Παραγοντοποίηση
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αναλύουμε κάθε αριθμό χωριστά σε <strong>γινόμενο πρώτων παραγόντων</strong> και γράφουμε τις επαναλήψεις με <strong>εκθέτες (δυνάμεις)</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold space-y-1">
                  <p>12 ＝ <strong className="text-sky-700">2² · 3</strong></p>
                  <p>18 ＝ <strong className="text-sky-700">2 · 3²</strong></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Διαιρούμε διαδοχικά μόνο με πρώτους αριθμούς: 2, 3, 5, 7, 11...
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">Ο Χρυσός Κανόνας</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Επιλογή Παραγόντων
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Επιλέγουμε όλους τους <strong>κοινούς ΚΑΙ μη κοινούς</strong> πρώτους παράγοντες, παίρνοντας για τον καθένα τον <strong>μεγαλύτερο εκθέτη</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold space-y-1">
                  <p>Από το 2: επιλέγουμε <strong className="text-indigo-700">2²</strong> (όχι το 2¹)</p>
                  <p>Από το 3: επιλέγουμε <strong className="text-indigo-700">3²</strong> (όχι το 3¹)</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Στο Ε.Κ.Π. δεν αφήνουμε κανέναν παράγοντα έξω και διαλέγουμε πάντα τη μεγαλύτερη δύναμη!
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-cyan-700">Γινόμενο Δυνάμεων</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Υπολογισμός Ε.Κ.Π.
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Σχηματίζουμε το γινόμενο των δυνάμεων που επιλέξαμε και εκτελούμε τους πολλαπλασιασμούς για το τελικό αποτέλεσμα.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>Ε.Κ.Π.(12, 18) ＝ 2² · 3² ＝ 4 · 9 ＝ <strong className="text-cyan-700">36</strong></p>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                🎯 Το αποτέλεσμα είναι το μικρότερο κοινό πολλαπλάσιο που διαιρείται ακριβώς από όλους τους αριθμούς.
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Ε.Κ.Π. με Πρώτους Παράγοντες
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Διάλεξε 2 ή 3 αριθμούς και παρακολούθησε βήμα προς βήμα την κατακόρυφη ανάλυση και την επιλογή των μέγιστων εκθετών!
              </p>
            </div>

            {/* NUMBER COUNT TOGGLE */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setNumCount(2)}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 ${
                  numCount === 2
                    ? 'bg-blue-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2 ΑΡΙΘΜΟΙ
              </button>
              <button
                type="button"
                onClick={() => setNumCount(3)}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 ${
                  numCount === 3
                    ? 'bg-indigo-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3 ΑΡΙΘΜΟΙ
              </button>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID (3 COLS LEFT / 9 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUTS & PRESETS (3 COLS) */}
            <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    ΤΙΜΕΣ ΑΡΙΘΜΩΝ (2 － {formatNumber(MAX_ALLOWED_NUMBER)}):
                  </span>
                  
                  <div className="space-y-2.5">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        1ΟΣ ΑΡΙΘΜΟΣ:
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={num1}
                        onChange={(e) => handleInputChange(setNum1, e.target.value)}
                        className="w-full text-base sm:text-lg font-mono font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-xs text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                        placeholder="π.χ. 12"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        2ΟΣ ΑΡΙΘΜΟΣ:
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={num2}
                        onChange={(e) => handleInputChange(setNum2, e.target.value)}
                        className="w-full text-base sm:text-lg font-mono font-black text-center p-2.5 bg-white border-2 border-indigo-200 rounded-xl shadow-xs text-indigo-600 outline-none focus:border-indigo-500 tracking-wider"
                        placeholder="π.χ. 18"
                      />
                    </div>

                    {numCount === 3 && (
                      <div className="space-y-0.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                          3ΟΣ ΑΡΙΘΜΟΣ:
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={num3}
                          onChange={(e) => handleInputChange(setNum3, e.target.value)}
                          className="w-full text-base sm:text-lg font-mono font-black text-center p-2.5 bg-white border-2 border-purple-200 rounded-xl shadow-xs text-purple-600 outline-none focus:border-purple-500 tracking-wider"
                          placeholder="π.χ. 15"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* PRESET EXAMPLES */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {numCount === 2
                      ? PRESETS_2.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setNum1(p.n1);
                              setNum2(p.n2);
                            }}
                            className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center touch-manipulation active:scale-95 bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs"
                          >
                            ({p.n1}, {p.n2})
                          </button>
                        ))
                      : PRESETS_3.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setNum1(p.n1);
                              setNum2(p.n2);
                              setNum3(p.n3);
                            }}
                            className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center touch-manipulation active:scale-95 bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs"
                          >
                            ({p.n1}, {p.n2}, {p.n3})
                          </button>
                        ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Επιλέγουμε <strong>όλους</strong> τους πρώτους παράγοντες (κοινούς και μη κοινούς), κρατώντας τον <strong>μεγαλύτερο εκθέτη</strong>!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION (9 COLS) */}
            <div className="lg:col-span-9 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] space-y-6">
              
              {/* HEADER STATUS */}
              <div className="w-full text-center">
                <span className="text-xs 2xl:text-sm font-bold text-slate-400 uppercase tracking-wider block">
                  ΥΠΟΛΟΓΙΣΜΟΣ Ε.Κ.Π. ΜΕ ΠΡΩΤΟΥΣ ΠΑΡΑΓΟΝΤΕΣ:
                </span>
                <div className="text-lg sm:text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 sm:px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-wider shadow-sm">
                  Ε.Κ.Π.({currentNumbersString}) ＝ <span className="text-amber-500">{formatNumber(ekp)}</span>
                </div>
              </div>

              {/* 1. ΚΑΤΑΚΟΡΥΦΕΣ ΑΝΑΛΥΣΕΙΣ */}
              <div className="w-full space-y-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block text-center">
                  📋 1. ΚΑΤΑΚΟΡΥΦΗ ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗ ΚΑΘΕ ΑΡΙΘΜΟΥ:
                </span>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 justify-center bg-slate-50 p-3 sm:p-6 rounded-3xl border border-slate-200 shadow-inner">
                  {numbersList.map((numObj, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-between bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                    >
                      <span className={`text-[11px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 rounded-md border text-center ${numObj.badge}`}>
                        {numObj.label} ({numObj.safeVal})
                      </span>

                      {/* ΚΑΘΕΤΗ ΓΡΑΜΜΗ ΔΙΑΙΡΕΣΗΣ */}
                      <div className="font-mono text-xs sm:text-sm md:text-base w-full max-w-[120px] my-auto">
                        {numObj.fact.steps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="grid grid-cols-2 text-right border-b border-slate-100 last:border-0 py-0.5"
                          >
                            <span className="pr-2 font-black text-slate-800">
                              {step.current}
                            </span>
                            <span className="pl-2 font-black text-rose-600 border-l-2 border-slate-300 text-left">
                              {step.divisor || '—'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* ΜΟΡΦΗ ΔΥΝΑΜΕΩΝ */}
                      <div className="text-center pt-2 border-t border-slate-100 w-full">
                        <span className="text-[9px] sm:text-[10px] text-slate-400 block font-bold uppercase">
                          ΜΟΡΦΗ ΔΥΝΑΜΕΩΝ:
                        </span>
                        <span className="font-mono font-black text-xs sm:text-sm text-slate-800">
                          {numObj.safeVal} ＝ <span className="text-blue-600">{numObj.fact.expr}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. ΕΠΕΞΗΓΗΣΗ ΕΠΙΛΟΓΗΣ ΜΕΓΙΣΤΩΝ ΕΚΘΕΤΩΝ */}
              <div className="w-full bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                <span className="text-xs 2xl:text-sm font-bold text-amber-400 uppercase tracking-wider block text-center">
                  🔍 2. ΕΦΑΡΜΟΓΗ ΚΑΝΟΝΑ (ΚΟΙΝΟΙ ΚΑΙ ΜΗ ΚΟΙΝΟΙ ΜΕ ΜΕΓΙΣΤΟ ΕΚΘΕΤΗ):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                  {ruleBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/90 p-2.5 sm:p-3 rounded-xl border border-slate-700 space-y-1 text-center font-mono"
                    >
                      <span className="text-xs text-slate-300 block">
                        Για τη βάση <strong className="text-cyan-400 font-black">{item.base}</strong>:
                      </span>
                      <div className="text-xs sm:text-sm font-black text-amber-300">
                        Επιλέγουμε ➔ {item.expStr}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        ({item.appearances})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-4 sm:p-5 rounded-2xl text-center shadow-lg font-mono space-y-1.5">
                <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                  ΤΕΛΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ Ε.Κ.Π.:
                </span>
                <div className="text-base sm:text-lg md:text-xl font-black tracking-wide flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                  <span>Ε.Κ.Π.({currentNumbersString}) ＝</span>
                  <span className="text-amber-300">
                    {calculationFormulaParts.length > 0 ? calculationFormulaParts.join(' · ') : '1'}
                  </span>
                  <span> ＝ </span>
                  <span className="text-amber-400 text-lg sm:text-xl md:text-2xl font-black bg-white/10 px-3 py-1 rounded-xl shadow-xs inline-block">
                    {formatNumber(ekp)}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στο Ε.Κ.Π.!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατάλαβες πώς βρίσκουμε το Ε.Κ.Π. με ανάλυση σε πρώτους παράγοντες; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/20-ekp-protoi-ask"
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
