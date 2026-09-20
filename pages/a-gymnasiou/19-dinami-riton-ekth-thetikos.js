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

export default function DinamiRitonTheoria() {
  // State για Εργαστήριο 1: Υπολογιστής Δύναμης Κλάσματος
  const [baseNum, setBaseNum] = useState(-2);
  const [baseDen, setBaseDen] = useState(3);
  const [exponent, setExponent] = useState(3);

  // State για Εργαστήριο 2: Δοκιμαστήριο Ιδιοτήτων
  const [activeProperty, setActiveProperty] = useState('prod-same-base');
  const [propBase, setPropBase] = useState(2);
  const [expM, setExpM] = useState(3);
  const [expN, setExpN] = useState(2);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1
  const isBaseNegative = baseNum < 0;
  const isEvenExp = exponent % 2 === 0;
  const isResultNegative = isBaseNegative && !isEvenExp;

  const powNum = useMemo(() => Math.pow(Math.abs(baseNum), exponent), [baseNum, exponent]);
  const powDen = useMemo(() => Math.pow(baseDen, exponent), [baseDen, exponent]);

  return (
    <Layout
      title="Δυνάμεις Ρητών με Θετικό Εκθέτη | Α' Γυμνασίου"
      description="Έννοια της δύναμης ρητών αριθμών με φυσικό εκθέτη, κανόνας προσήμων (άρτιος/περιττός εκθέτης), ιδιότητες δυνάμεων και διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/19-dinami-riton-ekth-thetikos-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 17 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Δυνάμεις Ρητών Αριθμών με Θετικό Φυσικό Εκθέτη
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε την έννοια της δύναμης με βάση ρητό αριθμό και εκθέτη φυσικό μεγαλύτερο από το μηδέν, τη θεμελιώδη σημασία των παρενθέσεων και των προσήμων, καθώς και όλες τις ιδιότητες των δυνάμεων.
            </p>
          </div>
        </section>

        {/* 1. ΟΡΙΣΜΟΣ ΤΗΣ ΔΥΝΑΜΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              <span>Ορισμός της Δύναμης (α<sup>v</sup>)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                Αν <strong>α</strong> είναι ένας ρητός αριθμός και <strong>v</strong> ένας φυσικός αριθμός μεγαλύτερος από το μηδέν (v ≥ 1), τότε ονομάζουμε <strong>δύναμη με βάση α και εκθέτη v</strong> το γινόμενο <strong>v παραγόντων</strong> ίσων με το α:
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-lg sm:text-2xl font-mono shadow-sm">
                α<sup>v</sup> ＝ α · α · α · ... · α &nbsp; (v παράγοντες)
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li><strong>α:</strong> η <em>βάση</em> της δύναμης (οποιοσδήποτε ρητός αριθμός).</li>
                <li><strong>v:</strong> ο <em>εκθέτης</em> (δείχνει πόσες φορές πολλαπλασιάζεται η βάση με τον εαυτό της).</li>
                <li><strong>Ειδική σύμβαση:</strong> Για κάθε ρητό α ισχύει <strong>α<sup>1</sup> ＝ α</strong>.</li>
              </ul>
            </div>

            {/* Δύναμη Κλάσματος και Δεκαδικού */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                ΔΥΝΑΜΗ ΚΛΑΣΜΑΤΟΣ ΚΑΙ ΔΕΚΑΔΙΚΟΥ
              </div>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-indigo-950">Δύναμη Κλάσματος:</div>
                  <p className="text-slate-600">
                    Υψώνουμε ξεχωριστά τον αριθμητή και τον παρονομαστή στον εκθέτη:
                  </p>
                  <div className="font-mono text-indigo-900 font-bold flex items-center pt-1">
                    (<Frac num="α" den="β" />)<sup>v</sup> ＝ <Frac num="αᵛ" den="βᵛ" />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-sky-950">Δύναμη Δεκαδικού Αριθμού:</div>
                  <p className="text-slate-600">
                    Πολλαπλασιάζουμε κανονικά. Το αποτέλεσμα έχει τόσα δεκαδικά ψηφία όσα προκύπτουν από το γινόμενο: (δεκαδικά ψηφία βάσης) · εκθέτης.
                  </p>
                  <div className="font-mono text-sky-900 font-bold pt-1">
                    0,3<sup>2</sup> ＝ 0,3 · 0,3 ＝ 0,09 &nbsp; (1 · 2 ＝ 2 δεκαδικά ψηφία)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Ο ΚΑΝΟΝΑΣ ΤΩΝ ΠΡΟΣΗΜΩΝ ΣΤΙΣ ΔΥΝΑΜΕΙΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Το Πρόσημο της Δύναμης & Η Μεγάλη Παγίδα των Παρενθέσεων
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Θετική Βάση */}
            <div className="p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-indigo-700 tracking-wider">ΠΕΡΙΠΤΩΣΗ 1</span>
                <h3 className="font-bold text-slate-900 text-lg">Βάση Θετικός Αριθμός (α ＞ 0)</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Η δύναμη θετικού αριθμού είναι <strong>πάντοτε θετικός αριθμός</strong>, ανεξάρτητα από το αν ο εκθέτης είναι άρτιος ή περιττός:
                </p>
                <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-center font-bold text-emerald-700 text-base">
                  (＋α)<sup>v</sup> ＝ ＋(α<sup>v</sup>)
                </div>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950">
                <div>• (＋2)<sup>3</sup> ＝ ＋8</div>
                <div>• (＋5)<sup>2</sup> ＝ ＋25</div>
              </div>
            </div>

            {/* Αρνητική Βάση */}
            <div className="p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-sky-700 tracking-wider">ΠΕΡΙΠΤΩΣΗ 2</span>
                <h3 className="font-bold text-slate-900 text-lg">Βάση Αρνητικός Αριθμός (α ＜ 0)</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Το πρόσημο καθορίζεται αποκλειστικά από το αν ο εκθέτης είναι <strong>άρτιος</strong> ή <strong>περιττός</strong>:
                </p>
                <div className="space-y-2 text-xs sm:text-sm font-mono">
                  <div className="p-2.5 bg-white rounded-xl border border-sky-100 flex items-center justify-between">
                    <span>(－α)<sup>άρτιος</sup> ＝ <strong>＋</strong></span>
                    <span className="text-emerald-700 font-bold">(－2)<sup>4</sup> ＝ ＋16</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-sky-100 flex items-center justify-between">
                    <span>(－α)<sup>περιττός</sup> ＝ <strong>－</strong></span>
                    <span className="text-rose-700 font-bold">(－2)<sup>3</sup> ＝ －8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Προσοχή στην παρένθεση */}
          <div className="p-5 sm:p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-800 text-sm sm:text-base">
              <span>⚠️</span>
              <span>ΜΕΓΑΛΗ ΠΡΟΣΟΧΗ: Η ΣΗΜΑΣΙΑ ΤΩΝ ΠΑΡΕΝΘΕΣΕΩΝ!</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
              Όταν το μείον βρίσκεται <strong>μέσα</strong> στην παρένθεση, ο εκθέτης εφαρμόζεται και στο πρόσημο. Όταν <strong>δεν υπάρχει παρένθεση</strong>, ο εκθέτης επηρεάζει μόνο τον αριθμό και το μείον παραμένει μπροστά:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs sm:text-sm">
              <div className="p-3 bg-white rounded-xl border border-rose-200 font-bold text-emerald-800">
                (－3)<sup>2</sup> ＝ (－3) · (－3) ＝ ＋9
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200 font-bold text-rose-700">
                －3<sup>2</sup> ＝ －(3 · 3) ＝ －9
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΟΣ ΥΠΟΛΟΓΙΣΤΗΣ ΔΥΝΑΜΗΣ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 1: Διαδραστικός Υπολογιστής Δύναμης Κλάσματος & Προσήμων
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers Ελέγχου (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* Αριθμητής Βάσης */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">ΑΡΙΘΜΗΤΗΣ (α)</label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseNum, -1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                      {baseNum > 0 ? `＋${baseNum}` : baseNum}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseNum, 1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Παρονομαστής Βάσης */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">ΠΑΡΟΝΟΜΑΣΤΗΣ (β)</label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseDen, -1, 1, 8, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                      {baseDen}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseDen, 1, 1, 8, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Εκθέτης v */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-indigo-700 uppercase block">ΕΚΘΕΤΗΣ (v)</label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExponent, -1, 1, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                      {exponent}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExponent, 1, 1, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Ανάλυση & Αποτέλεσμα (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΠΟΤΕΛΕΣΜΑ ΔΥΝΑΜΗΣ
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    isResultNegative
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  }`}>
                    {isBaseNegative
                      ? isEvenExp
                        ? 'ΑΡΝΗΤΙΚΗ ΒΑΣΗ ΜΕ ΑΡΤΙΟ ΕΚΘΕΤΗ ➔ (＋)'
                        : 'ΑΡΝΗΤΙΚΗ ΒΑΣΗ ΜΕ ΠΕΡΙΤΤΟ ΕΚΘΕΤΗ ➔ (－)'
                      : 'ΘΕΤΙΚΗ ΒΑΣΗ ➔ (＋)'}
                  </span>
                </div>

                {/* Μαθηματική Παράσταση */}
                <div className="flex items-center gap-3 sm:gap-4 text-2xl sm:text-4xl font-black py-2 flex-wrap">
                  <div className="flex items-center">
                    <span>(</span>
                    <Frac num={baseNum} den={baseDen} className="text-white text-2xl sm:text-4xl" />
                    <span>)<sup>{exponent}</sup></span>
                  </div>
                  <span className="text-indigo-300">＝</span>
                  <div className="flex items-center text-emerald-400">
                    {baseDen === 1 ? (
                      <span>{isResultNegative ? `－${powNum}` : `＋${powNum}`}</span>
                    ) : (
                      <Frac num={powNum} den={powDen} isNeg={isResultNegative} className="text-emerald-400 text-2xl sm:text-4xl" />
                    )}
                  </div>
                </div>

                {/* Ανάλυση Παραγόντων */}
                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed space-y-1">
                  <div>
                    <strong>Ανάλυση σε γινόμενο:</strong> ({exponent} παράγοντες)
                  </div>
                  <div className="font-mono text-indigo-200 flex items-center flex-wrap gap-1 text-xs pt-1">
                    {Array.from({ length: exponent }).map((_, i) => (
                      <span key={i} className="flex items-center">
                        (<Frac num={baseNum} den={baseDen} />)
                        {i < exponent - 1 && <span className="mx-1 text-amber-300">·</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΟΙ ΙΔΙΟΤΗΤΕΣ ΤΩΝ ΔΥΝΑΜΕΩΝ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Οι Ιδιότητες των Δυνάμεων
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* 1. Γινόμενο ίδιας βάσης */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">ΙΔΙΟΤΗΤΑ 1</span>
                <h3 className="font-bold text-slate-900 text-base">Γινόμενο Ίδιας Βάσης</h3>
                <p className="text-slate-600">
                  Διατηρούμε την ίδια βάση και <strong>προσθέτουμε</strong> τους εκθέτες:
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                  α<sup>μ</sup> · α<sup>v</sup> ＝ α<sup>μ ＋ v</sup>
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-xs text-center border border-indigo-100">
                2<sup>3</sup> · 2<sup>4</sup> ＝ 2<sup>7</sup> ＝ 128
              </div>
            </div>

            {/* 2. Πηλίκο ίδιας βάσης */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">ΙΔΙΟΤΗΤΑ 2</span>
                <h3 className="font-bold text-slate-900 text-base">Πηλίκο Ίδιας Βάσης (μ ＞ v)</h3>
                <p className="text-slate-600">
                  Διατηρούμε την ίδια βάση και <strong>αφαιρούμε</strong> τους εκθέτες:
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                  α<sup>μ</sup> ： α<sup>v</sup> ＝ α<sup>μ － v</sup>
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-xs text-center border border-indigo-100">
                3<sup>5</sup> ： 3<sup>2</sup> ＝ 3<sup>3</sup> ＝ 27
              </div>
            </div>

            {/* 3. Δύναμη σε δύναμη */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">ΙΔΙΟΤΗΤΑ 3</span>
                <h3 className="font-bold text-slate-900 text-base">Δύναμη σε Δύναμη</h3>
                <p className="text-slate-600">
                  Διατηρούμε τη βάση και <strong>πολλαπλασιάζουμε</strong> τους εκθέτες:
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                  (α<sup>μ</sup>)<sup>v</sup> ＝ α<sup>μ · v</sup>
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-xs text-center border border-indigo-100">
                (2<sup>2</sup>)<sup>3</sup> ＝ 2<sup>6</sup> ＝ 64
              </div>
            </div>

            {/* 4. Δύναμη γινομένου */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">ΙΔΙΟΤΗΤΑ 4</span>
                <h3 className="font-bold text-slate-900 text-base">Δύναμη Γινομένου</h3>
                <p className="text-slate-600">
                  Υψώνουμε κάθε παράγοντα ξεχωριστά στον ίδιο εκθέτη:
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                  (α · β)<sup>v</sup> ＝ α<sup>v</sup> · β<sup>v</sup>
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-xs text-center border border-indigo-100">
                (2 · 5)<sup>2</sup> ＝ 2<sup>2</sup> · 5<sup>2</sup> ＝ 4 · 25 ＝ 100
              </div>
            </div>

            {/* 5. Δύναμη πηλίκου / κλάσματος */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between md:col-span-2 lg:col-span-2">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">ΙΔΙΟΤΗΤΑ 5</span>
                <h3 className="font-bold text-slate-900 text-base">Δύναμη Πηλίκου ή Κλάσματος (β ≠ 0)</h3>
                <p className="text-slate-600">
                  Υψώνουμε αριθμητή και παρονομαστή στον κοινό εκθέτη:
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm flex items-center justify-center gap-2">
                  <span>(α ： β)<sup>v</sup> ＝ α<sup>v</sup> ： β<sup>v</sup> &nbsp; ⟺ &nbsp;</span>
                  <span>(<Frac num="α" den="β" />)<sup>v</sup> ＝ <Frac num="αᵛ" den="βᵛ" /></span>
                </div>
              </div>
              <div className="p-2 bg-indigo-50/70 rounded-lg text-indigo-900 font-mono text-xs text-center border border-indigo-100">
                (<Frac num="2" den="3" />)<sup>3</sup> ＝ <Frac num="2³" den="3³" /> ＝ <Frac num="8" den="27" />
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΟΚΙΜΑΣΤΗΡΙΟ ΙΔΙΟΤΗΤΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Δοκιμαστήριο Εφαρμογής Ιδιοτήτων Δυνάμεων
            </h3>

            {/* Tabs Επιλογής Ιδιότητας */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'prod-same-base', label: 'ΓΙΝΟΜΕΝΟ ΙΔΙΑΣ ΒΑΣΗΣ (αᵐ · αⁿ)' },
                { id: 'quot-same-base', label: 'ΠΗΛΙΚΟ ΙΔΙΑΣ ΒΑΣΗΣ (αᵐ ： αⁿ)' },
                { id: 'pow-to-pow', label: 'ΔΥΝΑΜΗ ΣΕ ΔΥΝΑΜΗ ((αᵐ)ⁿ)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveProperty(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    activeProperty === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Χειριστήρια & Προβολή */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Steppers (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ΒΑΣΗ (α)</label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropBase, -1, 2, 6, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                      {propBase}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPropBase, 1, 2, 6, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-indigo-700 uppercase block mb-1">ΕΚΘΕΤΗΣ (μ)</label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpM, -1, activeProperty === 'quot-same-base' ? expN + 1 : 1, 6, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                      {expM}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpM, 1, activeProperty === 'quot-same-base' ? expN + 1 : 1, 6, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-sky-700 uppercase block mb-1">ΕΚΘΕΤΗΣ (v)</label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpN, -1, 1, activeProperty === 'quot-same-base' ? expM - 1 : 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-sm font-mono text-sky-950">
                      {expN}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpN, 1, 1, activeProperty === 'quot-same-base' ? expM - 1 : 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  ΕΦΑΡΜΟΓΗ ΚΑΝΟΝΑ ΙΔΙΟΤΗΤΑΣ
                </div>

                {activeProperty === 'prod-same-base' && (
                  <div className="space-y-2">
                    <div className="text-2xl sm:text-3xl font-black text-amber-300 flex items-center gap-2 flex-wrap">
                      <span>{propBase}<sup>{expM}</sup> · {propBase}<sup>{expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span>{propBase}<sup>{expM} ＋ {expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span className="text-emerald-400">{propBase}<sup>{expM + expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span className="text-emerald-400">{Math.pow(propBase, expM + expN)}</span>
                    </div>
                    <p className="text-xs font-sans text-slate-300 pt-1">
                      Κοινή βάση το {propBase}: Προσθέσαμε τους εκθέτες ({expM} ＋ {expN} ＝ {expM + expN}).
                    </p>
                  </div>
                )}

                {activeProperty === 'quot-same-base' && (
                  <div className="space-y-2">
                    <div className="text-2xl sm:text-3xl font-black text-amber-300 flex items-center gap-2 flex-wrap">
                      <span>{propBase}<sup>{expM}</sup> ： {propBase}<sup>{expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span>{propBase}<sup>{expM} － {expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span className="text-emerald-400">{propBase}<sup>{expM - expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span className="text-emerald-400">{Math.pow(propBase, expM - expN)}</span>
                    </div>
                    <p className="text-xs font-sans text-slate-300 pt-1">
                      Κοινή βάση το {propBase}: Αφαιρέσαμε τους εκθέτες ({expM} － {expN} ＝ {expM - expN}).
                    </p>
                  </div>
                )}

                {activeProperty === 'pow-to-pow' && (
                  <div className="space-y-2">
                    <div className="text-2xl sm:text-3xl font-black text-amber-300 flex items-center gap-2 flex-wrap">
                      <span>({propBase}<sup>{expM}</sup>)<sup>{expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span>{propBase}<sup>{expM} · {expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span className="text-emerald-400">{propBase}<sup>{expM * expN}</sup></span>
                      <span className="text-slate-400">＝</span>
                      <span className="text-emerald-400">{Math.pow(propBase, expM * expN)}</span>
                    </div>
                    <p className="text-xs font-sans text-slate-300 pt-1">
                      Δύναμη σε δύναμη: Πολλαπλασιάσαμε τους εκθέτες ({expM} · {expN} ＝ {expM * expN}).
                    </p>
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
