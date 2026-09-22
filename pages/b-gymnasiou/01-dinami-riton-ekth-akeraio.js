import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// ==========================================
// ΡΥΘΜΙΣΕΙΣ & ΟΡΙΑ ΕΡΓΑΣΤΗΡΙΩΝ (10πλάσια εύρη)
// Μπορείς να τα προσαρμόζεις άμεσα από εδώ:
// ==========================================
export const LAB_LIMITS = {
  // Εργαστήριο 1: Υπολογιστής Δύναμης
  lab1: {
    baseNum: { min: -50, max: 50, step: 1, default: -2 },
    baseDen: { min: 1, max: 50, step: 1, default: 3 },
    exponent: { min: -40, max: 40, step: 1, default: -2 },
  },
  // Εργαστήριο 2: Σκάλα των Δυνάμεων
  lab2: {
    scaleBase: { min: 2, max: 50, step: 1, default: 2 },
    scaleExpRange: [-4, -3, -2, -1, 0, 1, 2, 3, 4], // Διευρυμένη σκάλα
    defaultExp: 2,
  },
  // Εργαστήριο 3: Επαληθευτής Ιδιοτήτων
  lab3: {
    baseA: { min: 2, max: 60, step: 1, default: 2 },
    expM: { min: -40, max: 40, step: 1, default: 3 },
    expN: { min: -40, max: 40, step: 1, default: -2 },
  }
};

// Component Frac με απόλυτα ασφαλή ανίχνευση προσήμου και τοποθέτηση του μείον μπροστά
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

// Βοηθητική συνάρτηση ασφαλούς μορφοποίησης μεγάλων αριθμών
const formatSafeNumber = (num) => {
  if (Math.abs(num) > 1e12) {
    return num.toExponential(4);
  }
  return num.toLocaleString('el-GR');
};

export default function DinamiRitonEkthAkeraio() {
  // --- State Εργαστηρίου 1: Υπολογισμός Δύναμης Ρητού με Ακέραιο Εκθέτη ---
  const [baseNum, setBaseNum] = useState(LAB_LIMITS.lab1.baseNum.default);
  const [baseDen, setBaseDen] = useState(LAB_LIMITS.lab1.baseDen.default);
  const [exponent, setExponent] = useState(LAB_LIMITS.lab1.exponent.default);

  // --- State Εργαστηρίου 2: Η Σκάλα των Δυνάμεων ---
  const [scaleBase, setScaleBase] = useState(LAB_LIMITS.lab2.scaleBase.default);
  const [scaleExp, setScaleExp] = useState(LAB_LIMITS.lab2.defaultExp);

  // --- State Εργαστηρίου 3: Επαληθευτής Ιδιοτήτων Δυνάμεων ---
  const [propA, setPropA] = useState(LAB_LIMITS.lab3.baseA.default);
  const [propM, setPropM] = useState(LAB_LIMITS.lab3.expM.default);
  const [propN, setPropN] = useState(LAB_LIMITS.lab3.expN.default);
  const [activeTab, setActiveTab] = useState('mul');

  // Generic Stepper handler με touch-manipulation και αποτροπή event propagation
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1
  const isFraction = baseDen !== 1;
  const absExp = Math.abs(exponent);
  const isExpNeg = exponent < 0;

  const invertedNum = isExpNeg ? baseDen : baseNum;
  const invertedDen = isExpNeg ? baseNum : baseDen;

  const resultNum = useMemo(() => Math.pow(invertedNum, absExp), [invertedNum, absExp]);
  const resultDen = useMemo(() => Math.pow(invertedDen, absExp), [invertedDen, absExp]);

  return (
    <Layout
      title="Δυνάμεις Ρητών Αριθμών με Εκθέτη Ακέραιο | Β' Γυμνασίου"
      description="Θεωρία, ιδιότητες και διαδραστικά εργαστήρια για τις δυνάμεις ρητών αριθμών με εκθέτη ακέραιο για τη Β' Γυμνασίου."
      backUrl="/b-gymnasiou"
      backText="Β' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/01-dinami-riton-ekth-akeraio-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>ΑΣΚΗΣΕΙΣ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        
        {/* Banner Header - Εναρμονισμένο Indigo Theme */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 1
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase">
              ΔΥΝΑΜΕΙΣ ΡΗΤΩΝ ΑΡΙΘΜΩΝ ΜΕ ΕΚΘΕΤΗ ΑΚΕΡΑΙΟ
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Επεκτείνουμε την έννοια της δύναμης από τους φυσικούς αριθμούς στους αρνητικούς ακέραιους εκθέτες, ερμηνεύουμε τη σημασία της αντίστροφης βάσης και εφαρμόζουμε τις θεμελιώδεις ιδιότητες των δυνάμεων.
            </p>
          </div>
        </section>

        {/* 1. ΕΠΑΝΑΛΗΨΗ ΑΠΟ ΤΗΝ Α' ΓΥΜΝΑΣΙΟΥ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Επανάληψη: Ρητοί Αριθμοί και Δυνάμεις με Φυσικό Εκθέτη
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Ρητός αριθμός</strong> ονομάζεται κάθε αριθμός που μπορεί να παρασταθεί ως κλάσμα <Frac num="α" den="β" />, όπου ο <span className="font-mono text-indigo-600 font-bold">α</span> είναι ακέραιος και ο <span className="font-mono text-indigo-600 font-bold">β</span> φυσικός διάφορος του μηδενός (<span className="font-mono">β ≠ 0</span>).
              </p>
              <p>
                Όταν ο εκθέτης <span className="font-mono text-indigo-600 font-bold">ν</span> είναι φυσικός αριθμός (<span className="font-mono">ν &gt; 1</span>), η δύναμη <span className="font-mono font-bold text-slate-900">α<sup>ν</sup></span> εκφράζει το γινόμενο <span className="font-mono">ν</span> ίσων παραγόντων:
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 font-bold text-center text-base sm:text-xl font-mono">
                α<sup>ν</sup> ＝ α · α · α · ... · α <span className="text-xs sm:text-sm font-normal text-indigo-700 block sm:inline mt-1 sm:mt-0 font-sans">(ν παράγοντες)</span>
              </div>
            </div>

            {/* Πρόσημα & Παρενθέσεις */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ΚΑΝΟΝΕΣ ΠΡΟΣΗΜΩΝ & ΠΑΡΕΝΘΕΣΕΙΣ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-indigo-700 block uppercase">ΑΡΤΙΟΣ ΕΚΘΕΤΗΣ</span>
                  <div className="font-mono text-slate-800">(-2)<sup>4</sup> ＝ +16</div>
                  <div className="text-slate-500">Αποτέλεσμα πάντα θετικό</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-indigo-700 block uppercase">ΠΕΡΙΤΤΟΣ ΕΚΘΕΤΗΣ</span>
                  <div className="font-mono text-slate-800">(-2)<sup>3</sup> ＝ -8</div>
                  <div className="text-slate-500">Διατηρεί το αρνητικό πρόσημο</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900">
                <strong>Προσοχή στη γραφή:</strong> Στο <span className="font-mono font-bold">(-3)<sup>2</sup> ＝ 9</span> ο εκθέτης επηρεάζει και το πρόσημο, ενώ στο <span className="font-mono font-bold">-3<sup>2</sup> ＝ -9</span> η δύναμη αφορά μόνο το 3.
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΥΝΑΜΗ ΜΕ ΑΡΝΗΤΙΚΟ ΚΑΙ ΜΗΔΕΝΙΚΟ ΕΚΘΕΤΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Δύναμη με Αρνητικό Ακέραιο και Μηδενικό Εκθέτη
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Για να επεκτείνουμε τον ορισμό της δύναμης σε όλους τους ακεραίους χωρίς να χαθούν οι ιδιότητες των πράξεων, ορίζουμε για κάθε ρητό αριθμό <span className="font-mono font-bold text-slate-900">α ≠ 0</span> και θετικό ακέραιο <span className="font-mono font-bold text-slate-900">ν</span>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-center">
              <div className="text-xs uppercase font-bold tracking-wider text-indigo-600">ΜΗΔΕΝΙΚΟΣ ΕΚΘΕΤΗΣ</div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-xl text-slate-900">
                α<sup>0</sup> ＝ 1
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Κάθε μη μηδενικός αριθμός στη μηδενική ισούται με 1.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-center">
              <div className="text-xs uppercase font-bold tracking-wider text-indigo-600">ΑΡΝΗΤΙΚΟΣ ΕΚΘΕΤΗΣ</div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-xl text-slate-900 flex items-center justify-center">
                α<sup>-ν</sup> ＝ <Frac num="1" den="αⁿ" />
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Ο αρνητικός εκθέτης σημαίνει αντίστροφος του α<sup>ν</sup>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-center">
              <div className="text-xs uppercase font-bold tracking-wider text-indigo-600">ΚΛΑΣΜΑ ΜΕ ΑΡΝΗΤΙΚΟ ΕΚΘΕΤΗ</div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-xl text-slate-900 flex items-center justify-center">
                (<Frac num="α" den="β" />)<sup>-ν</sup> ＝ (<Frac num="β" den="α" />)<sup>ν</sup>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Αντιστρέφουμε τους όρους του κλάσματος και αλλάζουμε το πρόσημο του εκθέτη.
              </p>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο 1: Υπολογιστής & Ανάλυση Δύναμης */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                🛠️ Διαδραστικό Εργαστήριο 1: Υπολογισμός Δύναμης & Ανάλυση Βήμα-Βήμα
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Εύρος: α ∈ [{LAB_LIMITS.lab1.baseNum.min}, {LAB_LIMITS.lab1.baseNum.max}], ν ∈ [{LAB_LIMITS.lab1.exponent.min}, {LAB_LIMITS.lab1.exponent.max}]
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Χειριστήρια Steppers */}
              <div className="space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ΑΡΙΘΜΗΤΗΣ ΒΑΣΗΣ (α)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseNum, -1, LAB_LIMITS.lab1.baseNum.min, LAB_LIMITS.lab1.baseNum.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {baseNum}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseNum, 1, LAB_LIMITS.lab1.baseNum.min, LAB_LIMITS.lab1.baseNum.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ΠΑΡΟΝΟΜΑΣΤΗΣ ΒΑΣΗΣ (β)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseDen, -1, LAB_LIMITS.lab1.baseDen.min, LAB_LIMITS.lab1.baseDen.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {baseDen}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseDen, 1, LAB_LIMITS.lab1.baseDen.min, LAB_LIMITS.lab1.baseDen.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ΕΚΘΕΤΗΣ (ΑΚΕΡΑΙΟΣ ν)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExponent, -1, LAB_LIMITS.lab1.exponent.min, LAB_LIMITS.lab1.exponent.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {exponent}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExponent, 1, LAB_LIMITS.lab1.exponent.min, LAB_LIMITS.lab1.exponent.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Παρουσίαση Αποτελέσματος & Ανάλυσης */}
              <div className="lg:col-span-2 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-6 rounded-2xl text-white space-y-4 shadow-md">
                <div className="text-center space-y-2">
                  <div className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">
                    ΜΑΘΗΜΑΤΙΚΗ ΕΚΦΡΑΣΗ
                  </div>
                  <div className="text-2xl sm:text-4xl font-black font-mono flex items-center justify-center flex-wrap gap-2">
                    <span>
                      ({isFraction ? <Frac num={baseNum} den={baseDen} /> : baseNum})<sup className="text-amber-400">{exponent}</sup>
                    </span>
                    <span>＝</span>
                    <span className="text-emerald-400">
                      {exponent === 0 ? '1' : (
                        resultDen === 1 ? formatSafeNumber(resultNum) : <Frac num={formatSafeNumber(resultNum)} den={formatSafeNumber(resultDen)} />
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 space-y-2 text-xs sm:text-sm font-mono text-slate-200">
                  <div className="text-xs text-indigo-200 uppercase font-sans font-bold">ΑΝΑΛΥΣΗ ΒΗΜΑΤΩΝ:</div>
                  {exponent === 0 ? (
                    <div>Οποιοσδήποτε μη μηδενικός αριθμός στη μηδενική δύναμη ισούται με 1.</div>
                  ) : isExpNeg ? (
                    <div className="space-y-1">
                      <div>1. Αρνητικός εκθέτης ({exponent}): Αντιστρέφουμε τη βάση σε ({<Frac num={baseDen} den={baseNum} />}) και κάνουμε τον εκθέτη θετικό (+{absExp}).</div>
                      <div>2. Υψώνουμε αριθμητή και παρονομαστή: <Frac num={`(${baseDen})` + (absExp > 1 ? `^${absExp}` : '')} den={`(${baseNum})` + (absExp > 1 ? `^${absExp}` : '')} /></div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div>1. Θετικός εκθέτης ({exponent}): Υπολογίζουμε απευθείας τη δύναμη.</div>
                      <div>2. Έκφραση: <Frac num={`(${baseNum})` + (absExp > 1 ? `^${absExp}` : '')} den={isFraction ? `(${baseDen})` + (absExp > 1 ? `^${absExp}` : '') : '1'} /></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Η ΣΚΑΛΑ ΤΩΝ ΔΥΝΑΜΕΩΝ (ΓΕΩΜΕΤΡΙΚΗ & ΑΡΙΘΜΗΤΙΚΗ ΕΡΜΗΝΕΙΑ) */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              🛠️ Διαδραστικό Εργαστήριο 2: Η Σκάλα των Δυνάμεων & η Συνέχεια των Πράξεων
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Παρατήρησε πώς κάθε φορά που μειώνουμε τον εκθέτη κατά 1, διαιρούμε το προηγούμενο αποτέλεσμα με τη βάση. Έτσι γίνεται απολύτως φυσική η εμφάνιση των κλασμάτων στους αρνητικούς εκθέτες!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-600">
                  ΕΠΙΛΟΓΗ ΒΑΣΗΣ (α)
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  Έως {LAB_LIMITS.lab2.scaleBase.max}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => handleStep(setScaleBase, -1, LAB_LIMITS.lab2.scaleBase.min, LAB_LIMITS.lab2.scaleBase.max, e)}
                  className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                >
                  －
                </button>
                <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                  α ＝ {scaleBase}
                </div>
                <button
                  type="button"
                  onClick={(e) => handleStep(setScaleBase, 1, LAB_LIMITS.lab2.scaleBase.min, LAB_LIMITS.lab2.scaleBase.max, e)}
                  className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                >
                  ＋
                </button>
              </div>
              <div className="text-xs text-slate-500">
                Κάθε βήμα προς τα αριστερά είναι μία διαίρεση με το <strong>{scaleBase}</strong>.
              </div>
            </div>

            {/* Διαδραστικά Cards Σκάλας (με οριζόντια/κατακόρυφη προσαρμογή) */}
            <div className="lg:col-span-2 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 sm:gap-2 font-mono">
              {LAB_LIMITS.lab2.scaleExpRange.map((exp) => {
                const isSelected = exp === scaleExp;
                const val = Math.pow(scaleBase, Math.abs(exp));
                return (
                  <div
                    key={exp}
                    onClick={() => setScaleExp(exp)}
                    className={`cursor-pointer p-2 sm:p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 touch-manipulation ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[9px] sm:text-[10px] font-sans uppercase font-bold tracking-wider opacity-80">
                      ΕΚΘ. {exp}
                    </span>
                    <span className="text-xs sm:text-sm font-bold">
                      {scaleBase}<sup>{exp}</sup>
                    </span>
                    <span className={`text-[10px] sm:text-xs font-bold truncate max-w-full ${isSelected ? 'text-amber-300' : 'text-indigo-600'}`}>
                      {exp > 0 && `${formatSafeNumber(val)}`}
                      {exp === 0 && '1'}
                      {exp < 0 && <Frac num="1" den={formatSafeNumber(val)} />}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. ΟΛΕΣ ΟΙ ΙΔΙΟΤΗΤΕΣ ΤΩΝ ΔΥΝΑΜΕΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              Ιδιότητες των Δυνάμεων με Ακέραιο Εκθέτη
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Όλες οι γνωστές ιδιότητες των δυνάμεων εφαρμόζονται αναλλοίωτες για οποιουσδήποτε ακέραιους εκθέτες <span className="font-mono font-bold text-slate-900">μ, ν</span> (με <span className="font-mono font-bold text-slate-900">α, β ≠ 0</span>):
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600">ΙΔΙΟΤΗΤΑ 1</div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Γινόμενο Ίδιας Βάσης</h3>
              <p className="text-sm text-slate-600">Διατηρούμε τη βάση και προσθέτουμε τους εκθέτες:</p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-emerald-800 text-center">
                α<sup>μ</sup> · α<sup>ν</sup> ＝ α<sup>μ + ν</sup>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600">ΙΔΙΟΤΗΤΑ 2</div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Πηλίκο Ίδιας Βάσης</h3>
              <p className="text-sm text-slate-600">Διατηρούμε τη βάση και αφαιρούμε τους εκθέτες:</p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-emerald-800 text-center">
                α<sup>μ</sup> : α<sup>ν</sup> ＝ α<sup>μ - ν</sup>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600">ΙΔΙΟΤΗΤΑ 3</div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Δύναμη σε Δύναμη</h3>
              <p className="text-sm text-slate-600">Διατηρούμε τη βάση και πολλαπλασιάζουμε τους εκθέτες:</p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-emerald-800 text-center">
                (α<sup>μ</sup>)<sup>ν</sup> ＝ α<sup>μ · ν</sup>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600">ΙΔΙΟΤΗΤΑ 4</div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Δύναμη Γινομένου</h3>
              <p className="text-sm text-slate-600">Υψώνουμε κάθε παράγοντα στον εκθέτη:</p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-emerald-800 text-center">
                (α · β)<sup>ν</sup> ＝ α<sup>ν</sup> · β<sup>ν</sup>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 md:col-span-2 xl:col-span-2">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600">ΙΔΙΟΤΗΤΑ 5</div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Δύναμη Πηλίκου / Κλάσματος</h3>
              <p className="text-sm text-slate-600">Ο εκθέτης εφαρμόζεται ξεχωριστά σε αριθμητή και παρονομαστή:</p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-emerald-800 text-center flex items-center justify-center">
                (<Frac num="α" den="β" />)<sup>ν</sup> ＝ <Frac num="αⁿ" den="βⁿ" />
              </div>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο 3: Επαλήθευση Ιδιοτήτων σε Πραγματικό Χρόνο */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                🛠️ Διαδραστικό Εργαστήριο 3: Επαλήθευση Ιδιοτήτων σε Πραγματικό Χρόνο
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Εύρος: α ∈ [{LAB_LIMITS.lab3.baseA.min}, {LAB_LIMITS.lab3.baseA.max}], μ,ν ∈ [{LAB_LIMITS.lab3.expM.min}, {LAB_LIMITS.lab3.expM.max}]
              </span>
            </div>

            {/* Tab Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'mul', label: 'ΓΙΝΟΜΕΝΟ (αᵐ · αⁿ)' },
                { id: 'div', label: 'ΠΗΛΙΚΟ (αᵐ : αⁿ)' },
                { id: 'pow', label: 'ΔΥΝΑΜΗ ((αᵐ)ⁿ)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2.5 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all touch-manipulation text-center truncate ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">ΒΑΣΗ (α)</label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropA, -1, LAB_LIMITS.lab3.baseA.min, LAB_LIMITS.lab3.baseA.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {propA}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropA, 1, LAB_LIMITS.lab3.baseA.min, LAB_LIMITS.lab3.baseA.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">ΕΚΘΕΤΗΣ (μ)</label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropM, -1, LAB_LIMITS.lab3.expM.min, LAB_LIMITS.lab3.expM.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {propM}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropM, 1, LAB_LIMITS.lab3.expM.min, LAB_LIMITS.lab3.expM.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">ΕΚΘΕΤΗΣ (ν)</label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropN, -1, LAB_LIMITS.lab3.expN.min, LAB_LIMITS.lab3.expN.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {propN}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropN, 1, LAB_LIMITS.lab3.expN.min, LAB_LIMITS.lab3.expN.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Παρουσίαση Επαλήθευσης */}
              <div className="lg:col-span-2 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-6 rounded-2xl text-white space-y-4 shadow-md font-mono">
                <div className="text-xs uppercase tracking-widest text-indigo-300 font-semibold font-sans">
                  ΕΦΑΡΜΟΓΗ ΚΑΝΟΝΑ & ΑΠΟΤΕΛΕΣΜΑ
                </div>

                {activeTab === 'mul' && (
                  <div className="space-y-3">
                    <div className="text-sm text-indigo-200 font-sans">
                      Πολλαπλασιασμός δυνάμεων με την ίδια βάση:
                    </div>
                    <div className="text-xl sm:text-3xl font-bold text-amber-300 flex flex-wrap items-center gap-2">
                      <span>{propA}<sup>{propM}</sup> · {propA}<sup>{propN}</sup></span>
                      <span>＝</span>
                      <span>{propA}<sup>{propM} + ({propN})</sup></span>
                      <span>＝</span>
                      <span className="text-emerald-400">{propA}<sup>{propM + propN}</sup></span>
                    </div>
                  </div>
                )}

                {activeTab === 'div' && (
                  <div className="space-y-3">
                    <div className="text-sm text-indigo-200 font-sans">
                      Διαίρεση δυνάμεων με την ίδια βάση:
                    </div>
                    <div className="text-xl sm:text-3xl font-bold text-amber-300 flex flex-wrap items-center gap-2">
                      <span>{propA}<sup>{propM}</sup> : {propA}<sup>{propN}</sup></span>
                      <span>＝</span>
                      <span>{propA}<sup>{propM} - ({propN})</sup></span>
                      <span>＝</span>
                      <span className="text-emerald-400">{propA}<sup>{propM - propN}</sup></span>
                    </div>
                  </div>
                )}

                {activeTab === 'pow' && (
                  <div className="space-y-3">
                    <div className="text-sm text-indigo-200 font-sans">
                      Ύψωση δύναμης σε άλλη δύναμη (πολλαπλασιασμός εκθετών):
                    </div>
                    <div className="text-xl sm:text-3xl font-bold text-amber-300 flex flex-wrap items-center gap-2">
                      <span>({propA}<sup>{propM}</sup>)<sup>{propN}</sup></span>
                      <span>＝</span>
                      <span>{propA}<sup>{propM} · ({propN})</sup></span>
                      <span>＝</span>
                      <span className="text-emerald-400">{propA}<sup>{propM * propN}</sup></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
