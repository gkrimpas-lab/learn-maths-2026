import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Component Frac με ασφαλή ανίχνευση προσήμου και τοποθέτηση του μείον μπροστά
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

// Stepper Button με grid διάταξη 36px_1fr_36px και touch-manipulation
const Stepper = ({ label, value, onChange, min = -10, max = 10, step = 1, displayValue = null }) => {
  const dec = () => {
    if (value - step >= min) onChange(Number((value - step).toFixed(2)));
  };
  const inc = () => {
    if (value + step <= max) onChange(Number((value + step).toFixed(2)));
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider">{label}</span>}
      <div className="grid grid-cols-[36px_1fr_36px] items-center bg-indigo-950/70 border border-indigo-700/60 rounded-xl overflow-hidden shadow-inner">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          aria-label="Μείωση"
          className="h-10 w-9 flex items-center justify-center bg-indigo-800/80 hover:bg-indigo-700 active:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-lg touch-manipulation transition-colors"
        >
          -
        </button>
        <div className="text-center font-mono font-bold text-white text-sm sm:text-base px-1 truncate">
          {displayValue !== null ? displayValue : value}
        </div>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          aria-label="Αύξηση"
          className="h-10 w-9 flex items-center justify-center bg-indigo-800/80 hover:bg-indigo-700 active:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-lg touch-manipulation transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default function DinamiRitonEkthAkeraio() {
  // State Εργαστηρίου 1: Υπολογιστής Δύναμης
  const [baseNum, setBaseNum] = useState(-2);
  const [baseDen, setBaseDen] = useState(3);
  const [exponent, setExponent] = useState(-2);

  // State Εργαστηρίου 2: Η Σκάλα των Δυνάμεων
  const [scaleBase, setScaleBase] = useState(2);
  const [scaleExp, setScaleExp] = useState(2);

  // State Εργαστηρίου 3: Εξερευνητής Ιδιοτήτων
  const [propA, setPropA] = useState(2);
  const [propM, setPropM] = useState(3);
  const [propN, setPropN] = useState(-2);
  const [activeTab, setActiveTab] = useState('mul');

  // Υπολογισμοί Εργαστηρίου 1
  const isFraction = baseDen !== 1;
  const absExp = Math.abs(exponent);
  const isExpNeg = exponent < 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-800 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Head>
        <title>Δυνάμεις Ρητών με Ακέραιο Εκθέτη | Β' ΓΥΜΝΑΣΙΟΥ</title>
        <meta name="description" content="Θεωρία, ιδιότητες και διαδραστικά εργαστήρια για τις δυνάμεις ρητών αριθμών με εκθέτη ακέραιο για τη Β' Γυμνασίου." />
      </Head>

      {/* Header */}
      <header className="border-b border-indigo-700/50 bg-indigo-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-black tracking-wider">
              Β' ΓΥΜΝΑΣΙΟΥ
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-300">
              ΕΝΟΤΗΤΑ 1
            </span>
          </div>
          <Link
            href="/01-dinami-riton-ekth-akeraio-ask"
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-indigo-950 font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-amber-500/20"
          >
            ΑΣΚΗΣΕΙΣ
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-10 space-y-10">
        
        {/* Title Section */}
        <section className="text-center space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            ΔΥΝΑΜΕΙΣ ΡΗΤΩΝ ΑΡΙΘΜΩΝ ΜΕ ΕΚΘΕΤΗ ΑΚΕΡΑΙΟ
          </h1>
          <p className="text-sm sm:text-base text-indigo-200 max-w-2xl mx-auto">
            Ανακάλυψε πώς επεκτείνουμε την έννοια της δύναμης από τους φυσικούς στους αρνητικούς ακέραιους εκθέτες και πώς λειτουργούν οι ιδιότητες.
          </p>
        </section>

        {/* 1. Επανάληψη από Α' Γυμνασίου */}
        <section className="bg-indigo-900/40 border border-indigo-700/40 rounded-2xl p-5 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-indigo-400 rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              ΕΠΑΝΑΛΗΨΗ ΑΠΟ ΤΗΝ Α' ΓΥΜΝΑΣΙΟΥ
            </h2>
          </div>

          <div className="space-y-3 text-sm sm:text-base text-slate-200 leading-relaxed">
            <p>
              <strong>Ρητός αριθμός</strong> ονομάζεται κάθε αριθμός που μπορεί να γραφτεί στη μορφή κλάσματος <Frac num="α" den="β" />, όπου ο <span className="font-mono text-indigo-300">α</span> είναι ακέραιος και ο <span className="font-mono text-indigo-300">β</span> είναι φυσικός αριθμός διάφορος του μηδενός (<span className="font-mono">β ≠ 0</span>).
            </p>
            <p>
              Όταν ο εκθέτης <span className="font-mono text-indigo-300">ν</span> είναι φυσικός αριθμός μεγαλύτερος του 1 (<span className="font-mono">ν &gt; 1</span>), η δύναμη <span className="font-mono font-bold text-white">α<sup>ν</sup></span> εκφράζει το γινόμενο <span className="font-mono">ν</span> ίσων παραγόντων:
            </p>
            
            <div className="p-3 bg-indigo-950/70 border border-indigo-800/80 rounded-xl text-center font-mono text-sm sm:text-base font-semibold text-indigo-100">
              α<sup>ν</sup> = α · α · α · ... · α <span className="text-xs text-indigo-300 block sm:inline mt-1 sm:mt-0 font-sans">(ν παράγοντες)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50">
                <span className="text-xs font-bold text-indigo-300 block uppercase">ΠΡΟΣΗΜΟ ΔΥΝΑΜΗΣ</span>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  • Θετική βάση: Πάντα θετικό αποτέλεσμα.<br />
                  • Αρνητική βάση με <strong>άρτιο</strong> εκθέτη: Θετικό αποτέλεσμα.<br />
                  • Αρνητική βάση με <strong>περιττό</strong> εκθέτη: Αρνητικό αποτέλεσμα.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-xs font-bold text-amber-300 block uppercase">ΜΕΓΑΛΗ ΠΡΟΣΟΧΗ ΣΤΙΣ ΠΑΡΕΝΘΕΣΕΙΣ</span>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-mono">
                  (-2)<sup>4</sup> = +16 <span className="text-xs text-slate-400 font-sans">(ο εκθέτης επηρεάζει και το πρόσημο)</span><br />
                  -2<sup>4</sup> = -16 <span className="text-xs text-slate-400 font-sans">(το μείον μένει απ' έξω)</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Νέα Θεωρία: Αρνητικός Εκθέτης */}
        <section className="bg-indigo-900/40 border border-indigo-700/40 rounded-2xl p-5 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-amber-400 rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              ΔΥΝΑΜΗ ΜΕ ΑΡΝΗΤΙΚΟ ΚΑΙ ΜΗΔΕΝΙΚΟ ΕΚΘΕΤΗ
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-200">
            <p>
              Για να διατηρήσουμε τις ιδιότητες των δυνάμεων αναλλοίωτες, ορίζουμε για κάθε ρητό αριθμό <span className="font-mono text-indigo-300">α ≠ 0</span> και θετικό ακέραιο <span className="font-mono text-indigo-300">ν</span>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-4 bg-indigo-950/80 border border-indigo-700 rounded-xl space-y-1">
                <span className="text-xs font-bold text-indigo-300 uppercase">ΜΗΔΕΝΙΚΟΣ ΕΚΘΕΤΗΣ</span>
                <div className="text-lg sm:text-xl font-mono font-bold text-amber-300">α<sup>0</sup> = 1</div>
                <div className="text-xs text-slate-400">π.χ. 5<sup>0</sup> = 1, (-7)<sup>0</sup> = 1</div>
              </div>

              <div className="p-4 bg-indigo-950/80 border border-indigo-700 rounded-xl space-y-1">
                <span className="text-xs font-bold text-indigo-300 uppercase">ΑΡΝΗΤΙΚΟΣ ΑΚΕΡΑΙΟΣ</span>
                <div className="text-base sm:text-lg font-mono font-bold text-amber-300 flex items-center justify-center">
                  α<sup>-ν</sup> = <Frac num="1" den="αⁿ" />
                </div>
                <div className="text-xs text-slate-400">π.χ. 2<sup>-3</sup> = <Frac num="1" den="2³" /> = <Frac num="1" den="8" /></div>
              </div>

              <div className="p-4 bg-indigo-950/80 border border-indigo-700 rounded-xl space-y-1">
                <span className="text-xs font-bold text-indigo-300 uppercase">ΚΛΑΣΜΑ ΜΕ ΑΡΝΗΤΙΚΟ ΕΚΘΕΤΗ</span>
                <div className="text-base sm:text-lg font-mono font-bold text-amber-300 flex items-center justify-center">
                  (<Frac num="α" den="β" />)<sup>-ν</sup> = (<Frac num="β" den="α" />)<sup>ν</sup>
                </div>
                <div className="text-xs text-slate-400">Αντιστρέφουμε τους όρους</div>
              </div>
            </div>

            <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-800/40 text-xs sm:text-sm text-indigo-200">
              <strong>Σημαντικό συμπέρασμα:</strong> Ο αρνητικός εκθέτης <em>δεν</em> σημαίνει αρνητικό αποτέλεσμα. Σημαίνει <strong>αντιστροφή</strong> της βάσης!
            </div>
          </div>
        </section>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: Υπολογιστής Δύναμης */}
        <section className="bg-indigo-950/90 border-2 border-indigo-600/70 rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/70 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black">
                ΕΡΓΑΣΤΗΡΙΟ 1
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                ΔΙΑΔΡΑΣΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΔΥΝΑΜΗΣ
              </h3>
            </div>
            <span className="text-xs text-indigo-300 font-medium">Άλλαξε τη βάση και τον εκθέτη</span>
          </div>

          {/* Χειριστήρια Steppers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Stepper
              label="ΑΡΙΘΜΗΤΗΣ ΒΑΣΗΣ"
              value={baseNum}
              onChange={setBaseNum}
              min={-5}
              max={5}
            />
            <Stepper
              label="ΠΑΡΟΝΟΜΑΣΤΗΣ ΒΑΣΗΣ"
              value={baseDen}
              onChange={(v) => { if (v !== 0) setBaseDen(v); }}
              min={1}
              max={5}
            />
            <Stepper
              label="ΕΚΘΕΤΗΣ (ΑΚΕΡΑΙΟΣ)"
              value={exponent}
              onChange={setExponent}
              min={-4}
              max={4}
            />
          </div>

          {/* Οπτική Ανάλυση Βήμα-Βήμα */}
          <div className="bg-indigo-900/50 border border-indigo-700/60 rounded-xl p-4 sm:p-5 space-y-4">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
              ΑΝΑΛΥΣΗ ΒΗΜΑ-ΒΗΜΑ
            </span>

            {/* Αρχική Έκφραση */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-lg sm:text-2xl font-mono font-bold text-white bg-indigo-950/80 p-4 rounded-xl border border-indigo-800">
              <span>Έκφραση:</span>
              <span className="text-amber-300 inline-flex items-center">
                ({isFraction ? <Frac num={baseNum} den={baseDen} /> : baseNum})<sup>{exponent}</sup>
              </span>
            </div>

            {/* Επεξήγηση βημάτων */}
            <div className="space-y-3 text-xs sm:text-sm font-mono text-slate-200 bg-indigo-950/40 p-4 rounded-xl border border-indigo-800/40">
              {exponent === 0 ? (
                <div className="text-emerald-300 font-semibold text-center sm:text-left">
                  Οποιοσδήποτε μη μηδενικός αριθμός υψωμένος στο μηδέν ισούται με 1: <strong className="text-white">Αποτέλεσμα = 1</strong>
                </div>
              ) : isExpNeg ? (
                <>
                  <div className="text-indigo-200">
                    <strong>Βήμα 1:</strong> Ο εκθέτης είναι αρνητικός ({exponent}), οπότε αντιστρέφουμε τη βάση και κάνουμε τον εκθέτη θετικό (+{absExp}):
                  </div>
                  <div className="pl-3 border-l-2 border-amber-500 py-1 flex items-center gap-2 text-sm sm:text-base">
                    = ({<Frac num={baseDen} den={baseNum} />})<sup>{absExp}</sup>
                  </div>
                  <div className="text-indigo-200">
                    <strong>Βήμα 2:</strong> Υψώνουμε αριθμητή και παρονομαστή στη δύναμη {absExp}:
                  </div>
                  <div className="pl-3 border-l-2 border-emerald-500 py-1 flex items-center gap-2 text-sm sm:text-base">
                    = <Frac num={`(${baseDen})` + (absExp > 1 ? `^${absExp}` : '')} den={`(${baseNum})` + (absExp > 1 ? `^${absExp}` : '')} /> 
                    = <Frac num={Math.pow(baseDen, absExp)} den={Math.pow(baseNum, absExp)} />
                  </div>
                </>
              ) : (
                <>
                  <div className="text-indigo-200">
                    <strong>Βήμα 1:</strong> Ο εκθέτης είναι θετικός ({exponent}), υπολογίζουμε απευθείας:
                  </div>
                  <div className="pl-3 border-l-2 border-emerald-500 py-1 flex items-center gap-2 text-sm sm:text-base">
                    = <Frac num={`(${baseNum})` + (absExp > 1 ? `^${absExp}` : '')} den={isFraction ? `(${baseDen})` + (absExp > 1 ? `^${absExp}` : '') : '1'} />
                    = {isFraction ? <Frac num={Math.pow(baseNum, absExp)} den={Math.pow(baseDen, absExp)} /> : Math.pow(baseNum, absExp)}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* 3. Ιδιότητες Δυνάμεων */}
        <section className="bg-indigo-900/40 border border-indigo-700/40 rounded-2xl p-5 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-emerald-400 rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              ΟΙ ΙΔΙΟΤΗΤΕΣ ΤΩΝ ΔΥΝΑΜΕΩΝ (ΓΙΑ ΚΑΘΕ ΑΚΕΡΑΙΟ ΕΚΘΕΤΗ)
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-200">
            Όλες οι ιδιότητες που γνωρίζουμε από την Α' Γυμνασίου ισχύουν ακριβώς με τον ίδιο τρόπο και όταν οι εκθέτες είναι αρνητικοί ακέραιοι ή μηδέν (<span className="font-mono text-indigo-300">α, β ≠ 0</span>):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-indigo-950/70 border border-indigo-800/80 rounded-xl space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">1. ΓΙΝΟΜΕΝΟ ΙΔΙΑΣ ΒΑΣΗΣ</span>
              <div className="text-base sm:text-lg font-mono font-bold text-white">α<sup>μ</sup> · α<sup>ν</sup> = α<sup>μ + ν</sup></div>
              <p className="text-xs text-slate-400">Διατηρούμε την ίδια βάση και <strong>προσθέτουμε</strong> τους εκθέτες.</p>
            </div>

            <div className="p-4 bg-indigo-950/70 border border-indigo-800/80 rounded-xl space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">2. ΠΗΛΙΚΟ ΙΔΙΑΣ ΒΑΣΗΣ</span>
              <div className="text-base sm:text-lg font-mono font-bold text-white">α<sup>μ</sup> : α<sup>ν</sup> = α<sup>μ - ν</sup></div>
              <p className="text-xs text-slate-400">Διατηρούμε την ίδια βάση και <strong>αφαιρούμε</strong> τους εκθέτες.</p>
            </div>

            <div className="p-4 bg-indigo-950/70 border border-indigo-800/80 rounded-xl space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">3. ΔΥΝΑΜΗ ΣΕ ΔΥΝΑΜΗ</span>
              <div className="text-base sm:text-lg font-mono font-bold text-white">(α<sup>μ</sup>)<sup>ν</sup> = α<sup>μ · ν</sup></div>
              <p className="text-xs text-slate-400">Διατηρούμε τη βάση και κάνουμε <strong>πολλαπλασιασμό</strong> των εκθετών.</p>
            </div>

            <div className="p-4 bg-indigo-950/70 border border-indigo-800/80 rounded-xl space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">4. ΔΥΝΑΜΗ ΓΙΝΟΜΕΝΟΥ</span>
              <div className="text-base sm:text-lg font-mono font-bold text-white">(α · β)<sup>ν</sup> = α<sup>ν</sup> · β<sup>ν</sup></div>
              <p className="text-xs text-slate-400">Ο εκθέτης εφαρμόζεται σε κάθε παράγοντα του γινομένου.</p>
            </div>

            <div className="p-4 bg-indigo-950/70 border border-indigo-800/80 rounded-xl space-y-2 sm:col-span-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">5. ΔΥΝΑΜΗ ΠΗΛΙΚΟΥ / ΚΛΑΣΜΑΤΟΣ</span>
              <div className="text-base sm:text-lg font-mono font-bold text-white flex items-center gap-2">
                (<Frac num="α" den="β" />)<sup>ν</sup> = <Frac num="αⁿ" den="βⁿ" />
              </div>
              <p className="text-xs text-slate-400">Ο εκθέτης εφαρμόζεται ξεχωριστά στον αριθμητή και στον παρονομαστή.</p>
            </div>
          </div>
        </section>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: Η Σκάλα των Δυνάμεων */}
        <section className="bg-indigo-950/90 border-2 border-indigo-600/70 rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/70 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                ΕΡΓΑΣΤΗΡΙΟ 2
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                Η ΣΚΑΛΑ ΤΩΝ ΔΥΝΑΜΕΩΝ (ΓΙΑΤΙ α⁻ⁿ = 1/αⁿ;)
              </h3>
            </div>
            <span className="text-xs text-indigo-300 font-medium">Παρατήρησε το μοτίβο διαιρέσεων</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Stepper
              label="ΕΠΙΛΟΓΗ ΒΑΣΗΣ"
              value={scaleBase}
              onChange={setScaleBase}
              min={2}
              max={5}
            />
            <div className="flex items-center text-xs text-indigo-300 bg-indigo-900/40 p-3 rounded-xl border border-indigo-800/50">
              Καθώς ο εκθέτης μειώνεται κατά 1, διαιρούμε διαρκώς με το {scaleBase}!
            </div>
          </div>

          {/* Οριζόντια/Κατακόρυφη ροή σκάλας */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono">
            {[-2, -1, 0, 1, 2].map((exp) => {
              const isSelected = exp === scaleExp;
              const val = Math.pow(scaleBase, Math.abs(exp));
              return (
                <div
                  key={exp}
                  onClick={() => setScaleExp(exp)}
                  className={`cursor-pointer p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40'
                      : 'bg-indigo-900/30 border-indigo-800/60 hover:bg-indigo-900/60'
                  }`}
                >
                  <span className="text-xs text-indigo-300 font-sans uppercase">ΕΚΘΕΤΗΣ {exp}</span>
                  <span className="text-base font-bold text-white">
                    {scaleBase}<sup>{exp}</sup>
                  </span>
                  <span className="text-xs text-amber-300 font-semibold">
                    {exp > 0 && `${val}`}
                    {exp === 0 && '1'}
                    {exp < 0 && <Frac num="1" den={val} />}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-indigo-900/40 border border-indigo-800/60 rounded-xl text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
            💡 <strong>Παρατήρηση:</strong><br />
            {scaleBase}<sup>2</sup> = {scaleBase * scaleBase}<br />
            {scaleBase}<sup>1</sup> = {scaleBase} <span className="text-slate-400 font-sans">(διαίρεση με {scaleBase})</span><br />
            {scaleBase}<sup>0</sup> = 1 <span className="text-slate-400 font-sans">(διαίρεση με {scaleBase})</span><br />
            {scaleBase}<sup>-1</sup> = <Frac num="1" den={scaleBase} /> <span className="text-slate-400 font-sans">(διαίρεση με {scaleBase})</span><br />
            {scaleBase}<sup>-2</sup> = <Frac num="1" den={scaleBase * scaleBase} /> <span className="text-slate-400 font-sans">(διαίρεση με {scaleBase})</span>
          </div>
        </section>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 3: Επαλήθευση Ιδιοτήτων */}
        <section className="bg-indigo-950/90 border-2 border-indigo-600/70 rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/70 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black">
                ΕΡΓΑΣΤΗΡΙΟ 3
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                ΕΠΑΛΗΘΕΥΣΗ ΙΔΙΟΤΗΤΩΝ ΣΕ ΠΡΑΓΜΑΤΙΚΟ ΧΡΟΝΟ
              </h3>
            </div>
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
                className={`py-2 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all touch-manipulation text-center truncate ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Χειριστήρια */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Stepper label="ΒΑΣΗ α" value={propA} onChange={setPropA} min={2} max={6} />
            <Stepper label="ΕΚΘΕΤΗΣ μ" value={propM} onChange={setPropM} min={-4} max={4} />
            <Stepper label="ΕΚΘΕΤΗΣ ν" value={propN} onChange={setPropN} min={-4} max={4} />
          </div>

          {/* Υπολογισμός και Επαλήθευση */}
          <div className="p-4 sm:p-5 bg-indigo-900/50 border border-indigo-700/60 rounded-xl space-y-3 font-mono">
            {activeTab === 'mul' && (
              <>
                <div className="text-sm sm:text-base text-indigo-200">
                  Ιδιότητα: <strong className="text-white">α<sup>μ</sup> · α<sup>ν</sup> = α<sup>μ + ν</sup></strong>
                </div>
                <div className="text-base sm:text-xl font-bold text-amber-300 flex flex-wrap items-center gap-2">
                  <span>{propA}<sup>{propM}</sup> · {propA}<sup>{propN}</sup></span>
                  <span>= {propA}<sup>{propM} + ({propN})</sup></span>
                  <span>= {propA}<sup>{propM + propN}</sup></span>
                </div>
              </>
            )}

            {activeTab === 'div' && (
              <>
                <div className="text-sm sm:text-base text-indigo-200">
                  Ιδιότητα: <strong className="text-white">α<sup>μ</sup> : α<sup>ν</sup> = α<sup>μ - ν</sup></strong>
                </div>
                <div className="text-base sm:text-xl font-bold text-amber-300 flex flex-wrap items-center gap-2">
                  <span>{propA}<sup>{propM}</sup> : {propA}<sup>{propN}</sup></span>
                  <span>= {propA}<sup>{propM} - ({propN})</sup></span>
                  <span>= {propA}<sup>{propM - propN}</sup></span>
                </div>
              </>
            )}

            {activeTab === 'pow' && (
              <>
                <div className="text-sm sm:text-base text-indigo-200">
                  Ιδιότητα: <strong className="text-white">(α<sup>μ</sup>)<sup>ν</sup> = α<sup>μ · ν</sup></strong>
                </div>
                <div className="text-base sm:text-xl font-bold text-amber-300 flex flex-wrap items-center gap-2">
                  <span>({propA}<sup>{propM}</sup>)<sup>{propN}</sup></span>
                  <span>= {propA}<sup>{propM} · ({propN})</sup></span>
                  <span>= {propA}<sup>{propM * propN}</sup></span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA προς τις Ασκήσεις */}
        <section className="bg-gradient-to-r from-amber-500/20 via-indigo-900/40 to-emerald-500/20 border border-indigo-700/60 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            ΕΤΟΙΜΟΣ ΓΙΑ ΕΞΑΣΚΗΣΗ;
          </h3>
          <p className="text-sm sm:text-base text-indigo-200 max-w-xl mx-auto">
            Δοκίμασε τις γνώσεις σου σε 12 δυναμικές ασκήσεις υπολογισμών, ιδιοτήτων και ρεαλιστικών προβλημάτων καθημερινότητας.
          </p>
          <div className="pt-2">
            <Link
              href="/01-dinami-riton-ekth-akeraio-ask"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-indigo-950 font-black text-sm sm:text-base transition-all shadow-lg hover:shadow-amber-500/30 touch-manipulation"
            >
              ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-800/40 py-6 text-center text-xs text-indigo-300/80">
        Μαθηματικά Β' Γυμνασίου • Δυνάμεις Ρητών Αριθμών με Εκθέτη Ακέραιο
      </footer>
    </div>
  );
}
