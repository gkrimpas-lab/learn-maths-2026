import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function DinameisTheoria() {
  // State για το διαδραστικό εργαστήριο δυνάμεων
  const [base, setBase] = useState(-2);
  const [exponent, setExponent] = useState(4);

  // Stepper handlers
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμός τιμής δύναμης με παρένθεση: (base)^exponent
  const powerWithParens = useMemo(() => {
    if (exponent === 0) return 1;
    return Math.pow(base, exponent);
  }, [base, exponent]);

  // Υπολογισμός τιμής δύναμης χωρίς παρένθεση: -abs(base)^exponent
  const powerWithoutParens = useMemo(() => {
    if (base >= 0) return Math.pow(base, exponent);
    return -Math.pow(Math.abs(base), exponent);
  }, [base, exponent]);

  // Ανάπτυγμα γινομένου
  const expansionStr = useMemo(() => {
    if (exponent === 0) return '1 (εξ ορισμού για κάθε βάση διάφορη του 0)';
    if (exponent === 1) return base > 0 ? `(＋${base})` : `(${base})`;
    const single = base > 0 ? `(＋${base})` : `(${base})`;
    return Array(exponent).fill(single).join(' · ');
  }, [base, exponent]);

  // Χαρακτηρισμός εκθέτη
  const isEvenExp = exponent % 2 === 0;

  return (
    <Layout
      title="Δυνάμεις Ακεραίων Αριθμών | Α' Γυμνασίου"
      description="Θεωρία, κανόνες προσήμου με άρτιο και περιττό εκθέτη, ιδιότητες δυνάμεων και διαδραστικό εργαστήριο για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/09-dinameis-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>ΑΣΚΗΣΕΙΣ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        {/* Banner Header - Ενιαίο Indigo Theme χωρίς τόνους στα κεφαλαία */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Δυνάμεις Ακέραιων Αριθμών
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Εξερευνούμε τη δύναμη με θετική και αρνητική βάση, τον ρόλο του άρτιου και περιττού εκθέτη, τη σημασία των παρενθέσεων και τις θεμελιώδεις ιδιότητες των δυνάμεων.
            </p>
          </div>
        </section>

        {/* 1. ΕΝΝΟΙΑ ΤΗΣ ΔΥΝΑΜΗΣ & ΚΑΝΟΝΕΣ ΠΡΟΣΗΜΟΥ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Έννοια Δύναμης & Κανόνες Προσήμου
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Δύναμη</strong> με βάση έναν ακέραιο αριθμό <strong>α</strong> και εκθέτη έναν φυσικό αριθμό <strong>ν &gt; 1</strong> είναι το γινόμενο <strong>ν ίσων παραγόντων</strong>:
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-lg sm:text-xl font-mono shadow-sm">
                α<sup>ν</sup> ＝ α · α · α · ... · α  <span className="text-xs font-normal text-indigo-700 block mt-1">(ν παράγοντες)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Το πρόσημο του αποτελέσματος εξαρτάται άμεσα από τη <strong>βάση</strong> και από το αν ο εκθέτης είναι <strong>άρτιος</strong> ή <strong>περιττός</strong>.
              </p>
            </div>

            {/* Κανόνες Προσήμου */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                <div className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                  ΘΕΤΙΚΗ ΒΑΣΗ (ΠΑΝΤΑ ΘΕΤΙΚΟ)
                </div>
                <p className="text-xs sm:text-sm text-slate-700">
                  Αν η βάση είναι θετική, η δύναμη είναι <strong>πάντοτε θετική</strong>, ανεξάρτητα από τον εκθέτη:
                </p>
                <div className="font-mono text-xs sm:text-sm font-bold text-emerald-950">
                  (＋3)<sup>2</sup> ＝ ＋9  |  (＋2)<sup>3</sup> ＝ ＋8
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1.5">
                <div className="text-xs font-bold uppercase text-indigo-800 tracking-wider">
                  ΑΡΝΗΤΙΚΗ ΒΑΣΗ ΜΕ ΑΡΤΙΟ ΕΚΘΕΤΗ → ΘΕΤΙΚΟ (＋)
                </div>
                <p className="text-xs sm:text-sm text-slate-700">
                  Τα αρνητικά πρόσημα είναι άρτιο πλήθος και ανά ζεύγη δίνουν συν:
                </p>
                <div className="font-mono text-xs sm:text-sm font-bold text-indigo-950">
                  (－2)<sup>4</sup> ＝ (－2) · (－2) · (－2) · (－2) ＝ <strong>＋16</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1.5">
                <div className="text-xs font-bold uppercase text-rose-800 tracking-wider">
                  ΑΡΝΗΤΙΚΗ ΒΑΣΗ ΜΕ ΠΕΡΙΤΤΟ ΕΚΘΕΤΗ → ΑΡΝΗΤΙΚΟ (－)
                </div>
                <p className="text-xs sm:text-sm text-slate-700">
                  Τα αρνητικά πρόσημα είναι περιττό πλήθος και περισσεύει ένα πλην:
                </p>
                <div className="font-mono text-xs sm:text-sm font-bold text-rose-950">
                  (－2)<sup>3</sup> ＝ (－2) · (－2) · (－2) ＝ <strong>－8</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Προσοχή στις Παρενθέσεις */}
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="text-xs font-bold uppercase text-amber-800 tracking-wider">
              ΜΕΓΑΛΗ ΠΡΟΣΟΧΗ ΣΤΙΣ ΠΑΡΕΝΘΕΣΕΙΣ
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Η Διαφορά μεταξύ (－α)<sup>ν</sup> και －α<sup>ν</sup>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-1">
                <div className="font-bold text-indigo-900 font-mono text-sm">(－3)<sup>2</sup> ＝ ＋9</div>
                <p className="text-slate-600">
                  Η παρένθεση δείχνει ότι ο εκθέτης 2 επηρεάζει και το πρόσημο μείον: (－3) · (－3) ＝ ＋9.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-1">
                <div className="font-bold text-rose-900 font-mono text-sm">－3<sup>2</sup> ＝ －9</div>
                <p className="text-slate-600">
                  Χωρίς παρένθεση, ο εκθέτης επηρεάζει <strong>μόνο το 3</strong>, ενώ το μείον παραμένει μπροστά: －(3 · 3) ＝ －9.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΔΥΝΑΜΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Διαδραστικό Εργαστήριο: Υπολογισμός & Ανάλυση Δύναμης
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Steppers Ελέγχου Βάσης και Εκθέτη */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  ΒΑΣΗ (α)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setBase, -1, -5, 5, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-900 font-black text-lg font-mono whitespace-nowrap px-2">
                    α ＝ {base > 0 ? `＋${base}` : base}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setBase, 1, -5, 5, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  ΕΚΘΕΤΗΣ (ν)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setExponent, -1, 0, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-sky-900 font-black text-lg font-mono whitespace-nowrap px-2">
                    ν ＝ {exponent}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setExponent, 1, 0, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="text-slate-500 font-bold uppercase text-[10px]">ΤΥΠΟΣ ΕΚΘΕΤΗ:</div>
                <div className="font-bold text-slate-800">
                  {exponent === 0 ? 'Μηδενικός εκθέτης' : isEvenExp ? 'Άρτιος εκθέτης (ζυγός)' : 'Περιττός εκθέτης (μονός)'}
                </div>
              </div>
            </div>

            {/* Κάρτα Αποτελέσματος Δύναμης */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">
                  ΥΠΟΛΟΓΙΣΜΟΣ ΜΕ ΠΑΡΕΝΘΕΣΗ
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                  powerWithParens > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : powerWithParens < 0
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                    : 'bg-slate-500/20 text-slate-300 border-slate-400/30'
                }`}>
                  {powerWithParens > 0 ? 'ΘΕΤΙΚΟ (＋)' : powerWithParens < 0 ? 'ΑΡΝΗΤΙΚΟ (－)' : 'ΜΗΔΕΝ (0)'}
                </span>
              </div>

              <div className="text-2xl sm:text-4xl font-black font-mono">
                {base < 0 ? `(${base})` : `(＋${base})`}<sup>{exponent}</sup> ＝{' '}
                <span className={powerWithParens > 0 ? 'text-emerald-400' : powerWithParens < 0 ? 'text-rose-400' : 'text-slate-300'}>
                  {powerWithParens > 0 ? `＋${powerWithParens.toLocaleString('el-GR')}` : powerWithParens.toLocaleString('el-GR')}
                </span>
              </div>

              {/* Ανάπτυγμα */}
              <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-indigo-200 font-bold">ΑΝΑΠΤΥΓΜΑ ΓΙΝΟΜΕΝΟΥ:</div>
                <div className="font-mono text-xs sm:text-sm text-amber-300 break-words">
                  {expansionStr}
                </div>
              </div>

              {/* Σύγκριση με τη γραφή χωρίς παρένθεση (για αρνητική βάση) */}
              {base < 0 && exponent > 0 && (
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
                  <span>Αντιπαράδειγμα χωρίς παρένθεση:</span>
                  <span className="font-mono font-bold text-amber-400">
                    －{Math.abs(base)}<sup>{exponent}</sup> ＝ {powerWithoutParens.toLocaleString('el-GR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. ΙΔΙΟΤΗΤΕΣ ΤΩΝ ΔΥΝΑΜΕΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Ιδιότητες των Δυνάμεων
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-slate-700 text-sm">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs uppercase font-bold text-indigo-600">ΙΔΙΟΤΗΤΑ 1</div>
              <h3 className="font-bold text-slate-900 text-base">Γινόμενο Δυνάμεων με την Ίδια Βάση</h3>
              <p className="text-xs text-slate-600">Διατηρούμε την ίδια βάση και προσθέτουμε τους εκθέτες:</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                α<sup>μ</sup> · α<sup>ν</sup> ＝ α<sup>μ ＋ ν</sup>
              </div>
              <div className="text-xs text-slate-500 font-mono text-center">
                (－2)<sup>2</sup> · (－2)<sup>3</sup> ＝ (－2)<sup>5</sup> ＝ －32
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs uppercase font-bold text-indigo-600">ΙΔΙΟΤΗΤΑ 2</div>
              <h3 className="font-bold text-slate-900 text-base">Πηλίκο Δυνάμεων με την Ίδια Βάση</h3>
              <p className="text-xs text-slate-600">Διατηρούμε την ίδια βάση και αφαιρούμε τους εκθέτες (μ ≥ ν, α ≠ 0):</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                α<sup>μ</sup> ： α<sup>ν</sup> ＝ α<sup>μ － ν</sup>
              </div>
              <div className="text-xs text-slate-500 font-mono text-center">
                (＋3)<sup>5</sup> ： (＋3)<sup>2</sup> ＝ (＋3)<sup>3</sup> ＝ ＋27
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs uppercase font-bold text-indigo-600">ΙΔΙΟΤΗΤΑ 3</div>
              <h3 className="font-bold text-slate-900 text-base">Δύναμη σε Δύναμη</h3>
              <p className="text-xs text-slate-600">Διατηρούμε τη βάση και πολλαπλασιάζουμε τους εκθέτες:</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                (α<sup>μ</sup>)<sup>ν</sup> ＝ α<sup>μ · ν</sup>
              </div>
              <div className="text-xs text-slate-500 font-mono text-center">
                [ (－2)<sup>2</sup> ]<sup>3</sup> ＝ (－2)<sup>6</sup> ＝ ＋64
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs uppercase font-bold text-indigo-600">ΙΔΙΟΤΗΤΑ 4</div>
              <h3 className="font-bold text-slate-900 text-base">Δύναμη Γινομένου</h3>
              <p className="text-xs text-slate-600">Υψώνουμε κάθε παράγοντα στον εκθέτη:</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                (α · β)<sup>ν</sup> ＝ α<sup>ν</sup> · β<sup>ν</sup>
              </div>
              <div className="text-xs text-slate-500 font-mono text-center">
                [ (－2) · (＋5) ]<sup>2</sup> ＝ (－2)<sup>2</sup> · (＋5)<sup>2</sup> ＝ 4 · 25 ＝ 100
              </div>
            </div>
          </div>

          {/* Ειδικές Συμβάσεις */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm font-mono text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-indigo-900">α<sup>1</sup> ＝ α</div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">Εκθέτης 1</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-indigo-900">α<sup>0</sup> ＝ 1</div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">Για α ≠ 0</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-indigo-900">(－1)<sup>άρτιος</sup> ＝ ＋1</div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">Άρτιο πλήθος</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-indigo-900">(－1)<sup>περιττός</sup> ＝ －1</div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">Περιττό πλήθος</div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
