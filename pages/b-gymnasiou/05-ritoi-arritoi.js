import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μέγιστος Κοινός Διαιρετής (GCD)
function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

// Component Frac με ασφαλή ανίχνευση προσήμου
const Frac = ({ num, den, className = "" }) => {
  const numStr = String(num).trim();
  const denStr = String(den).trim();

  const isNumNeg = numStr.startsWith('-');
  const isDenNeg = denStr.startsWith('-');
  const isNegative = (isNumNeg && !isDenNeg) || (!isNumNeg && isDenNeg);

  const cleanNum = numStr.replace('-', '');
  const cleanDen = denStr.replace('-', '');

  return (
    <span className={`inline-flex items-center align-middle mx-1 font-mono font-semibold ${className}`}>
      {isNegative && <span className="mr-0.5 text-base sm:text-lg font-bold">-</span>}
      <span className="inline-flex flex-col items-center text-center leading-none text-xs sm:text-sm">
        <span className="border-b border-current px-1 pb-0.5">{cleanNum}</span>
        <span className="pt-0.5 px-1">{cleanDen}</span>
      </span>
    </span>
  );
};

// Ενιαίο SVG σύμβολο ρίζας: μονοκόμματο σχήμα με οριζόντια γραμμή (vinculum)
const Sqrt = ({ children, className = "" }) => {
  return (
    <span className={`inline-flex items-center align-middle mx-1 relative font-mono font-semibold ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none text-current overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 58 L 4 52 L 10 92 L 16 6 L 100 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="pl-4 sm:pl-4.5 pr-1 pt-1 pb-0.5 leading-none inline-flex items-center">
        {children}
      </span>
    </span>
  );
};

// Component εμφάνισης περιοδικού δεκαδικού με οριζόντια γραμμή πάνω από την περίοδο
const PeriodicNumber = ({ intPart, nonPeriodic, period }) => {
  return (
    <span className="inline-flex items-baseline font-mono font-bold">
      <span>{intPart}</span>
      {(nonPeriodic !== '' || period !== '') && <span>,</span>}
      {nonPeriodic !== '' && <span>{nonPeriodic}</span>}
      {period !== '' && (
        <span className="border-t-2 border-amber-400 text-amber-300 pt-0.5 px-0.5 ml-0.5 inline-block">
          {period}
        </span>
      )}
    </span>
  );
};

// Αλγόριθμος εύρεσης περιόδου κλάσματος (Long Division with Remainders Map)
function fractionToDecimalAnalysis(numerator, denominator) {
  let num = parseInt(numerator, 10);
  let den = parseInt(denominator, 10);

  if (isNaN(num) || isNaN(den)) return { error: 'Συμπλήρωσε έγκυρους ακεραίους αριθμούς.' };
  if (den === 0) return { error: 'Ο παρονομαστής δεν μπορεί να είναι 0.' };

  const isNeg = (num < 0 && den > 0) || (num > 0 && den < 0);
  num = Math.abs(num);
  den = Math.abs(den);

  const g = gcd(num, den);
  const simpNum = num / g;
  const simpDen = den / g;

  let tempDen = simpDen;
  while (tempDen % 2 === 0) tempDen /= 2;
  while (tempDen % 5 === 0) tempDen /= 5;

  const intPart = Math.floor(simpNum / simpDen);
  let remainder = simpNum % simpDen;

  if (remainder === 0) {
    return {
      simplified: `${simpNum}/${simpDen}`,
      isTerminating: true,
      intPart: isNeg ? `-${intPart}` : `${intPart}`,
      nonPeriodic: '',
      period: '',
      fullString: `${isNeg ? '-' : ''}${intPart}`,
      typeDesc: 'Ακέραιος Αριθμός'
    };
  }

  const remainderMap = new Map();
  let decimalDigits = '';
  let startIndex = -1;

  while (remainder !== 0) {
    if (remainderMap.has(remainder)) {
      startIndex = remainderMap.get(remainder);
      break;
    }
    remainderMap.set(remainder, decimalDigits.length);

    remainder *= 10;
    const digit = Math.floor(remainder / simpDen);
    decimalDigits += digit.toString();
    remainder = remainder % simpDen;
  }

  const signStr = isNeg ? '-' : '';
  const fullInt = `${signStr}${intPart}`;

  if (startIndex === -1) {
    return {
      simplified: `${simpNum}/${simpDen}`,
      isTerminating: true,
      intPart: fullInt,
      nonPeriodic: decimalDigits,
      period: '',
      fullString: `${fullInt},${decimalDigits}`,
      typeDesc: 'Πεπερασμένος Δεκαδικός (ο παρονομαστής περιέχει μόνο πρώτους παράγοντες 2 ή 5)'
    };
  } else {
    const nonPeriodicPart = decimalDigits.slice(0, startIndex);
    const periodPart = decimalDigits.slice(startIndex);
    const isPure = nonPeriodicPart.length === 0;

    return {
      simplified: `${simpNum}/${simpDen}`,
      isTerminating: false,
      intPart: fullInt,
      nonPeriodic: nonPeriodicPart,
      period: periodPart,
      isPure,
      fullString: `${fullInt},${nonPeriodicPart}(${periodPart})`,
      typeDesc: isPure
        ? 'Καθαρός (Απλός) Περιοδικός Δεκαδικός'
        : 'Μικτός Περιοδικός Δεκαδικός'
    };
  }
}

// Δείγματα για το Εργαστήριο 2 με χρήση του Component <Sqrt> στα σχετικά σημεία
const CLASSIFICATION_SAMPLES = [
  { 
    label: '3/4', 
    renderDisplay: <span>3/4</span>, 
    isRational: true, 
    reason: 'Γράφεται ως κλάσμα ακεραίων (3/4 = 0,75, πεπερασμένος δεκαδικός).' 
  },
  { 
    label: '√2', 
    renderDisplay: <Sqrt>2</Sqrt>, 
    isRational: false, 
    reason: 'Η ρίζα του 2 δεν είναι ακέραιος (1,41421356...). Έχει άπειρα δεκαδικά ψηφία χωρίς καμία περίοδο.' 
  },
  { 
    label: '1/3', 
    renderDisplay: <span>1/3</span>, 
    isRational: true, 
    reason: 'Κλάσμα ακεραίων με άπειρα ψηφία, αλλά με περίοδο το 3 (0,333... = 0,3̄).' 
  },
  { 
    label: 'π (pi)', 
    renderDisplay: <span>π</span>, 
    isRational: false, 
    reason: 'Ο αριθμός π = 3,14159265... έχει άπειρα ψηφία χωρίς περίοδο και δεν γράφεται ως κλάσμα ακεραίων.' 
  },
  { 
    label: '√25', 
    renderDisplay: <Sqrt>25</Sqrt>, 
    isRational: true, 
    reason: 'Επειδή 25 = 5², ισχύει √25 = 5 = 5/1 (ρητός, φυσικός αριθμός).' 
  },
  { 
    label: '-7', 
    renderDisplay: <span>-7</span>, 
    isRational: true, 
    reason: 'Κάθε ακέραιος είναι και ρητός, καθώς -7 = -7/1.' 
  },
  { 
    label: '0,121121112...', 
    renderDisplay: <span>0,121121112...</span>, 
    isRational: false, 
    reason: 'Έχει άπειρα ψηφία με κανόνα (τα 1 αυξάνονται), αλλά ΔΕΝ επαναλαμβάνεται σταθερή ομάδα ψηφίων (δεν έχει περίοδο).' 
  }
];

export default function RitoiArritoiTheoria() {
  // State Εργαστηρίου 1
  const [numInput, setNumInput] = useState('1');
  const [denInput, setDenInput] = useState('6');

  // State Εργαστηρίου 2: Επιλεγμένος αριθμός προς ταξινόμηση
  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);

  const decAnalysis = useMemo(() => {
    return fractionToDecimalAnalysis(numInput, denInput);
  }, [numInput, denInput]);

  return (
    <Layout
      title="Ρητοί, Άρρητοι & Περιοδικοί Δεκαδικοί | Β' Γυμνασίου"
      description="Θεωρία, δεκαδικές αναπαραστάσεις, η έννοια της περιόδου, καθαροί και μικτοί περιοδικοί αριθμοί με διαδραστικά εργαστήρια."
      backUrl="/b-gymnasiou"
      backText="Β' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/b-gymnasiou/05-ritoi-arritoi-ask"
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
              Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 5
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase">
              ΡΗΤΟΙ ΚΑΙ ΑΡΡΗΤΟΙ ΑΡΙΘΜΟΙ
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Εξερευνούμε τη δεκαδική μορφή των αριθμών: πότε ένα κλάσμα δίνει πεπερασμένο δεκαδικό, τι είναι η περίοδος ενός περιοδικού αριθμού και ποιοι αριθμοί ονομάζονται άρρητοι.
            </p>
          </div>
        </section>

        {/* 1. ΡΗΤΟΙ ΑΡΙΘΜΟΙ & ΔΕΚΑΔΙΚΗ ΜΟΡΦΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Η Δεκαδική Μορφή των Ρητών Αριθμών
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Ρητός αριθμός</strong> (σύνολο <span className="font-serif font-bold text-indigo-700">ℚ</span>) ονομάζεται κάθε αριθμός που μπορεί να γραφεί ως κλάσμα της μορφής <span className="font-mono font-bold">α/β</span>, όπου <span className="font-mono">α</span> ακέραιος και <span className="font-mono">β</span> φυσικός αριθμός διάφορος του μηδενός (<span className="font-mono">β ≠ 0</span>).
              </p>
              <p>
                Όταν διαιρέσουμε τον αριθμητή με τον παρονομαστή ενός κλάσματος, προκύπτει <strong>πάντοτε μία από τις δύο</strong> παρακάτω μορφές:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                  <strong className="text-indigo-950 block">1. Πεπερασμένος Δεκαδικός Αριθμός:</strong>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Η διαίρεση τελειώνει (υπόλοιπο 0). Συμβαίνει όταν ο παρονομαστής του ανάγωγου κλάσματος αναλύεται σε πρώτους παράγοντες που περιέχουν <strong>μόνο το 2, μόνο το 5 ή και τα δύο</strong>.
                  </p>
                  <div className="font-mono text-xs sm:text-sm font-bold text-indigo-800 pt-1">
                    π.χ. 3/4 ＝ 0,75 &nbsp;|&nbsp; 7/10 ＝ 0,7 &nbsp;|&nbsp; 1/8 ＝ 0,125
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1">
                  <strong className="text-amber-950 block">2. Άπειρος Περιοδικός Δεκαδικός Αριθμός:</strong>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Η διαίρεση δεν τελειώνει ποτέ, αλλά ένα ψηφίο ή μια ομάδα ψηφίων επαναλαμβάνεται επ' άπειρον. Συμβαίνει όταν ο παρονομαστής περιέχει κι άλλους πρώτους παράγοντες (π.χ. 3, 7, 11).
                  </p>
                  <div className="font-mono text-xs sm:text-sm font-bold text-amber-800 pt-1">
                    π.χ. 1/3 ＝ 0,333... &nbsp;|&nbsp; 1/6 ＝ 0,1666... &nbsp;|&nbsp; 2/11 ＝ 0,1818...
                  </div>
                </div>
              </div>
            </div>

            {/* Περίοδος & Συμβολισμός */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ΤΙ ΕΙΝΑΙ Η ΠΕΡΙΟΔΟΣ ΚΑΙ ΠΩΣ ΣΥΜΒΟΛΙΖΕΤΑΙ;
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <p>
                  <strong>Περίοδος</strong> ενός περιοδικού δεκαδικού αριθμού ονομάζεται το ψηφίο ή η ομάδα των ψηφίων που επαναλαμβάνεται επ' άπειρον.
                </p>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                    ΣΥΜΒΟΛΙΣΜΟΣ ΜΕ ΟΡΙΖΟΝΤΙΑ ΓΡΑΜΜΗ
                  </span>
                  <p className="text-slate-600">
                    Αντί να γράφουμε αποσιωπητικά (...), τοποθετούμε μια <strong>οριζόντια γραμμή</strong> πάνω από την περίοδο:
                  </p>
                  <div className="font-mono text-base font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-wrap gap-4">
                    <span>0,333... ＝ 0,<span className="border-t-2 border-indigo-600 pt-0.5">3</span></span>
                    <span>1,2727... ＝ 1,<span className="border-t-2 border-indigo-600 pt-0.5">27</span></span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block">Καθαροί vs Μικτοί Περιοδικοί:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>
                      <strong>Καθαρός (Απλός) Περιοδικός:</strong> Η περίοδος αρχίζει αμέσως μετά την υποδιαστολή, π.χ. 0,<span className="border-t-2 border-indigo-600">6</span> ή 2,<span className="border-t-2 border-indigo-600">15</span>.
                    </li>
                    <li>
                      <strong>Μικτός Περιοδικός:</strong> Υπάρχει μη περιοδικό μέρος πριν ξεκινήσει η περίοδος, π.χ. 0,1<span className="border-t-2 border-indigo-600">6</span> (το 1 είναι μη περιοδικό, το 6 είναι η περίοδος).
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΝΙΧΝΕΥΤΗΣ ΠΕΡΙΟΔΟΥ & ΔΙΑΙΡΕΣΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              🛠️ Εργαστήριο 1: Μετατροπέας Κλάσματος σε Δεκαδικό & Ανιχνευτής Περιόδου
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Γράψε έναν αριθμητή και έναν παρονομαστή ή διάλεξε ένα έτοιμο παράδειγμα για να δεις τη μετατροπή του κλάσματος σε δεκαδικό και την <strong>αυτόματη ανίχνευση της περιόδου</strong>:
          </p>

          {/* Προκαθορισμένα Κουμπιά */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase self-center mr-1">ΠΑΡΑΔΕΙΓΜΑΤΑ:</span>
            {[
              { label: '1/3 (Καθαρός)', n: '1', d: '3' },
              { label: '1/6 (Μικτός)', n: '1', d: '6' },
              { label: '1/7 (6ψήφια περίοδος)', n: '1', d: '7' },
              { label: '3/8 (Πεπερασμένος)', n: '3', d: '8' },
              { label: '4/11 (Καθαρός)', n: '4', d: '11' },
              { label: '7/12 (Μικτός)', n: '7', d: '12' }
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { setNumInput(item.n); setDenInput(item.d); }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all touch-manipulation font-mono"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Εισαγωγή Κλάσματος */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 max-w-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">ΚΛΑΣΜΑ:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={numInput}
                onChange={(e) => setNumInput(e.target.value)}
                placeholder="Αριθμητής"
                className="w-24 h-12 px-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-600 font-mono text-center text-lg font-bold text-slate-900 outline-none"
              />
              <span className="text-2xl font-bold text-slate-400">/</span>
              <input
                type="number"
                value={denInput}
                onChange={(e) => setDenInput(e.target.value)}
                placeholder="Παρονομαστής"
                className="w-24 h-12 px-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-600 font-mono text-center text-lg font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Οθόνη Ανάλυσης */}
          <div className="bg-slate-900 rounded-3xl p-5 sm:p-8 text-white space-y-6 shadow-inner">
            {decAnalysis.error ? (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{decAnalysis.error}</span>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                  <div>
                    <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider block mb-1">
                      ΔΕΚΑΔΙΚΗ ΜΟΡΦΗ
                    </span>
                    <div className="text-2xl sm:text-4xl font-black font-mono text-amber-300 flex items-center flex-wrap">
                      <span className="mr-2">{decAnalysis.simplified} ＝</span>
                      <PeriodicNumber
                        intPart={decAnalysis.intPart}
                        nonPeriodic={decAnalysis.nonPeriodic}
                        period={decAnalysis.period}
                      />
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        decAnalysis.isTerminating
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {decAnalysis.isTerminating ? 'ΠΕΠΕΡΑΣΜΕΝΟΣ' : 'ΑΠΕΙΡΟΣ ΠΕΡΙΟΔΙΚΟΣ'}
                    </span>
                  </div>
                </div>

                {/* Ανάλυση Στοιχείων */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-sm">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-xs text-slate-400 font-sans block uppercase">ΑΚΕΡΑΙΟ ΜΕΡΟΣ:</span>
                    <span className="text-xl font-bold text-white">{decAnalysis.intPart}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-xs text-slate-400 font-sans block uppercase">ΜΗ ΠΕΡΙΟΔΙΚΟ ΜΕΡΟΣ:</span>
                    <span className="text-xl font-bold text-indigo-300">
                      {decAnalysis.nonPeriodic ? decAnalysis.nonPeriodic : '(κανένα)'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-xs text-slate-400 font-sans block uppercase">ΠΕΡΙΟΔΟΣ:</span>
                    <span className="text-xl font-bold text-amber-300">
                      {decAnalysis.period ? decAnalysis.period : '(δεν υπάρχει)'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-300 font-sans">
                  💡 <strong>Τύπος:</strong> {decAnalysis.typeDesc}.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. ΑΡΡΗΤΟΙ ΑΡΙΘΜΟΙ & ΠΡΑΓΜΑΤΙΚΟΙ ΑΡΙΘΜΟΙ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Άρρητοι Αριθμοί & Το Σύνολο των Πραγματικών Αριθμών
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2">
                <strong className="text-purple-950 block text-base sm:text-lg">Ορισμός Άρρητου Αριθμού:</strong>
                <p className="text-slate-700 text-sm sm:text-base">
                  <strong>Άρρητος αριθμός</strong> ονομάζεται κάθε αριθμός που <strong>δεν μπορεί να γραφεί ως κλάσμα</strong> ακεραίων. 
                </p>
                <p className="text-xs sm:text-sm text-slate-600 font-sans">
                  Η δεκαδική του αναπαράσταση έχει <strong>άπειρα δεκαδικά ψηφία χωρίς καμία περίοδο</strong> (δεν επαναλαμβάνεται σταθερή ομάδα ψηφίων).
                </p>
              </div>

              <div className="space-y-2 text-sm sm:text-base">
                <strong className="text-slate-900 block">Κλασικά Παραδείγματα Άρρητων Αριθμών:</strong>
                <ul className="space-y-2 list-disc pl-5 text-slate-600 font-mono text-xs sm:text-sm">
                  <li>
                    <span className="font-bold text-indigo-700"><Sqrt>2</Sqrt></span> ＝ 1,4142135623... (η διαγώνιος τετραγώνου πλευράς 1)
                  </li>
                  <li>
                    <span className="font-bold text-indigo-700"><Sqrt>3</Sqrt></span> ＝ 1,7320508075...
                  </li>
                  <li>
                    <span className="font-bold text-indigo-700"><Sqrt>5</Sqrt></span> ＝ 2,2360679774...
                  </li>
                  <li>
                    <span className="font-bold text-indigo-700">π</span> ＝ 3,1415926535... (ο λόγος μήκους κύκλου προς διάμετρο)
                  </li>
                </ul>
              </div>
            </div>

            {/* Το Δέντρο των Πραγματικών Αριθμών */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ΤΟ ΣΥΝΟΛΟ ΤΩΝ ΠΡΑΓΜΑΤΙΚΩΝ ΑΡΙΘΜΩΝ (ℝ)
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <p>
                  Όλοι οι ρητοί αριθμοί μαζί με όλους τους άρρητους αριθμούς αποτελούν το σύνολο των <strong>Πραγματικών Αριθμών</strong> (<span className="font-serif font-bold text-indigo-700">ℝ</span>):
                </p>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center font-mono font-bold text-slate-900 text-sm sm:text-base space-y-2">
                  <div className="text-indigo-700">ΠΡΑΓΜΑΤΙΚΟΙ (ℝ) ＝ ΡΗΤΟΙ (ℚ) ∪ ΑΡΡΗΤΟΙ</div>
                  <div className="text-xs text-slate-500 font-sans font-normal pt-1">
                    Κάθε σημείο της ευθείας των αριθμών αντιστοιχεί σε έναν μοναδικό πραγματικό αριθμό (άξονας πραγματικών αριθμών).
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                  ⚠️ <strong>Σημαντικό:</strong> Οι τετραγωνικές ρίζες όλων των φυσικών αριθμών που <strong>δεν είναι τέλεια τετράγωνα</strong> (π.χ. √2, √3, √5, √6, √7, √8, √10) είναι <strong>άρρητοι αριθμοί</strong>!
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΤΑΞΙΝΟΜΗΤΗΣ ΑΡΙΘΜΩΝ (ΔΙΟΡΘΩΜΕΝΗ ΡΙΖΑ) */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              🛠️ Εργαστήριο 2: Ταξινομητής Αριθμών (Ρητός ή Άρρητος;)
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Επίλεξε έναν αριθμό για να εξετάσεις αν ανήκει στους <strong>Ρητούς (ℚ)</strong> ή στους <strong>Άρρητους</strong> και δες την αναλυτική αιτιολόγηση:
          </p>

          {/* Κουμπιά Επιλογής Αριθμών με χρήση <Sqrt> όπου υπάρχει ρίζα */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {CLASSIFICATION_SAMPLES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedSampleIdx(idx)}
                className={`p-3 rounded-2xl border text-sm font-mono font-bold transition-all touch-manipulation flex items-center justify-center ${
                  selectedSampleIdx === idx
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-102'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.renderDisplay}
              </button>
            ))}
          </div>

          {/* Κάρτα Αποτελέσματος Ταξινόμησης με ενιαίο <Sqrt> */}
          {(() => {
            const current = CLASSIFICATION_SAMPLES[selectedSampleIdx];
            return (
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">
                      ΕΠΙΛΕΓΜΕΝΟΣ ΑΡΙΘΜΟΣ
                    </span>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300 flex items-center">
                      {current.renderDisplay}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        current.isRational
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}
                    >
                      {current.isRational ? '✓ ΡΗΤΟΣ ΑΡΙΘΜΟΣ (ℚ)' : '✗ ΑΡΡΗΤΟΣ ΑΡΙΘΜΟΣ'}
                    </span>
                  </div>
                </div>

                <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                  <strong>Αιτιολόγηση:</strong> {current.reason}
                </div>
              </div>
            );
          })()}
        </section>

        {/* 5. ΑΝΑΛΥΤΙΚΑ ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg">
                5
              </span>
              Αναλυτικά Λυμένα Παραδείγματα
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Παράδειγμα 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">
                ΠΑΡΑΔΕΙΓΜΑ 1: ΜΕΤΑΤΡΟΠΗ ΚΛΑΣΜΑΤΟΣ ΣΕ ΠΕΡΙΟΔΙΚΟ ΔΕΚΑΔΙΚΟ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono">
                Να μετατραπεί το κλάσμα 5/6 σε δεκαδικό αριθμό και να βρεθεί η περίοδος.
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div>1. Εκτελούμε τη διαίρεση 5 : 6</div>
                <div className="pl-3 text-slate-500">5 : 6 ＝ 0,8333...</div>
                <div>2. Το ψηφίο 8 δεν επαναλαμβάνεται (μη περιοδικό μέρος).</div>
                <div>3. Το ψηφίο 3 επαναλαμβάνεται επ' άπειρον (περίοδος).</div>
                <div className="pl-3 font-bold text-indigo-700">
                  ➔ 5/6 ＝ 0,8<span className="border-t-2 border-indigo-700 pt-0.5">3</span> (Μικτός Περιοδικός)
                </div>
              </div>
            </div>

            {/* Παράδειγμα 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">
                ΠΑΡΑΔΕΙΓΜΑ 2: ΕΛΕΓΧΟΣ ΑΡΡΗΤΟΥ ΑΠΟ ΡΙΖΙΚΟ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono flex items-center flex-wrap">
                <span>Ποιοι από τους αριθμούς </span>
                <Sqrt>16</Sqrt><span>, </span><Sqrt>18</Sqrt><span>, </span><Sqrt>49</Sqrt><span> είναι άρρητοι;</span>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center flex-wrap">
                  <span>1. </span><Sqrt>16</Sqrt><span> ＝ 4 ＝ 4/1 ➔ <strong>ΡΗΤΟΣ</strong> (το 16 είναι τέλειο τετράγωνο).</span>
                </div>
                <div className="flex items-center flex-wrap">
                  <span>2. </span><Sqrt>18</Sqrt><span> ＝ 4,24264... ➔ <strong>ΑΡΡΗΤΟΣ</strong> (το 18 δεν είναι τέλειο τετράγωνο).</span>
                </div>
                <div className="flex items-center flex-wrap">
                  <span>3. </span><Sqrt>49</Sqrt><span> ＝ 7 ＝ 7/1 ➔ <strong>ΡΗΤΟΣ</strong> (το 49 είναι τέλειο τετράγωνο).</span>
                </div>
                <div className="pl-3 font-bold text-indigo-700 flex items-center">
                  <span>Μοναδικός άρρητος είναι το </span><Sqrt>18</Sqrt>.
                </div>
              </div>
            </div>

            {/* Παράδειγμα 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">
                ΠΑΡΑΔΕΙΓΜΑ 3: ΠΡΟΒΛΕΨΗ ΕΙΔΟΥΣ ΔΕΚΑΔΙΚΟΥ ΧΩΡΙΣ ΔΙΑΙΡΕΣΗ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono">
                Χωρίς διαίρεση, να βρεθεί αν το 7/40 είναι πεπερασμένος ή περιοδικός.
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div>1. Το κλάσμα 7/40 είναι ανάγωγο (ΜΚΔ(7,40) = 1).</div>
                <div>2. Αναλύουμε τον παρονομαστή 40 σε πρώτους παράγοντες:</div>
                <div className="pl-3 text-slate-500">40 ＝ 2 · 2 · 2 · 5 ＝ 2³ · 5</div>
                <div>3. Επειδή περιέχει ΜΟΝΟ παράγοντες 2 και 5:</div>
                <div className="pl-3 font-bold text-indigo-700">
                  ➔ Είναι ΠΕΠΕΡΑΣΜΕΝΟΣ δεκαδικός (7/40 = 0,175).
                </div>
              </div>
            </div>

            {/* Παράδειγμα 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">
                ΠΑΡΑΔΕΙΓΜΑ 4: ΔΙΑΚΡΙΣΗ ΚΑΘΑΡΟΥ ΚΑΙ ΜΙΚΤΟΥ ΠΕΡΙΟΔΙΚΟΥ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono">
                Να χαρακτηριστούν οι αριθμοί: α = 2,444... και β = 0,12555...
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  • α = 2,<span className="border-t-2 border-indigo-700 pt-0.5">4</span>: Η περίοδος (4) ξεκινά αμέσως μετά την υποδιαστολή ➔ <strong>Καθαρός Περιοδικός</strong>.
                </div>
                <div>
                  • β = 0,12<span className="border-t-2 border-indigo-700 pt-0.5">5</span>: Υπάρχει το μη περιοδικό μέρος (12) πριν την περίοδο (5) ➔ <strong>Μικτός Περιοδικός</strong>.
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </Layout>
  );
}
