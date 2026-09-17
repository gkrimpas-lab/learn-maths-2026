import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function PollaplasiasmosAkeraionTheoria() {
  // State για το διαδραστικό εργαστήριο γινομένου 2 ακεραίων
  const [factorA, setFactorA] = useState(-3);
  const [factorB, setFactorB] = useState(4);

  // State για το διαδραστικό εργαλείο γινομένου πολλών παραγόντων
  const [multiFactors, setMultiFactors] = useState([-2, 3, -1, -4]);

  // Stepper handler για 2 αριθμούς
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί για το γινόμενο 2 αριθμών
  const product2 = useMemo(() => factorA * factorB, [factorA, factorB]);
  const absA = useMemo(() => Math.abs(factorA), [factorA]);
  const absB = useMemo(() => Math.abs(factorB), [factorB]);

  const ruleType = useMemo(() => {
    if (factorA === 0 || factorB === 0) return 'zero';
    if ((factorA > 0 && factorB > 0) || (factorA < 0 && factorB < 0)) return 'same';
    return 'diff';
  }, [factorA, factorB]);

  // Υπολογισμοί για το γινόμενο πολλών παραγόντων
  const multiProduct = useMemo(() => {
    return multiFactors.reduce((acc, curr) => acc * curr, 1);
  }, [multiFactors]);

  const negativeCount = useMemo(() => {
    return multiFactors.filter((x) => x < 0).length;
  }, [multiFactors]);

  const hasZero = useMemo(() => {
    return multiFactors.some((x) => x === 0);
  }, [multiFactors]);

  // Εναλλαγή προσήμου ενός παράγοντα στο πολλαπλό εργαστήριο
  const toggleFactorSign = (idx) => {
    setMultiFactors((prev) => {
      const next = [...prev];
      next[idx] = -next[idx];
      return next;
    });
  };

  // Αυξομείωση απόλυτης τιμής ενός παράγοντα
  const stepFactorValue = (idx, delta, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMultiFactors((prev) => {
      const next = [...prev];
      const sign = next[idx] < 0 ? -1 : 1;
      const currentAbs = Math.abs(next[idx]);
      const newAbs = Math.max(1, Math.min(9, currentAbs + delta));
      next[idx] = sign * newAbs;
      return next;
    });
  };

  // Προσθήκη παράγοντα
  const addFactor = () => {
    if (multiFactors.length < 6) {
      setMultiFactors((prev) => [...prev, -2]);
    }
  };

  // Αφαίρεση παράγοντα
  const removeFactor = () => {
    if (multiFactors.length > 2) {
      setMultiFactors((prev) => prev.slice(0, -1));
    }
  };

  return (
    <Layout
      title="Πολλαπλασιασμός Ακεραίων Αριθμών | Α' Γυμνασίου"
      description="Θεωρία, κανόνας προσήμων, ιδιότητες και διαδραστικό εργαστήριο γινομένου πολλών παραγόντων για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/08-pollaplasiasmos-akeraion-ask"
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
              Πολλαπλασιασμός Ακέραιων Αριθμών
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε τον κανόνα των προσήμων για ομόσημους και ετερόσημους αριθμούς, τις βασικές ιδιότητες και πώς υπολογίζουμε το πρόσημο σε γινόμενα πολλών παραγόντων.
            </p>
          </div>
        </section>

        {/* 1. Ο ΚΑΝΟΝΑΣ ΤΩΝ ΠΡΟΣΗΜΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Ο Κανόνας των Προσήμων (Γινόμενο Δύο Ακεραίων)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                Για να πολλαπλασιάσουμε δύο ακέραιους αριθμούς, <strong>πολλαπλασιάζουμε τις απόλυτες τιμές τους</strong> και καθορίζουμε το πρόσημο σύμφωνα με τον παρακάτω κανόνα:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                  <div className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                    ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ (＋)
                  </div>
                  <div className="font-mono text-sm font-bold text-emerald-950 space-y-1">
                    <div>(＋) · (＋) ＝ ＋</div>
                    <div>(－) · (－) ＝ ＋</div>
                  </div>
                  <p className="text-xs text-slate-600">
                    Το γινόμενο δύο ομόσημων αριθμών είναι <strong>πάντοτε θετικός αριθμός</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
                  <div className="text-xs font-bold uppercase text-rose-800 tracking-wider">
                    ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ (－)
                  </div>
                  <div className="font-mono text-sm font-bold text-rose-950 space-y-1">
                    <div>(＋) · (－) ＝ －</div>
                    <div>(－) · (＋) ＝ －</div>
                  </div>
                  <p className="text-xs text-slate-600">
                    Το γινόμενο δύο ετερόσημων αριθμών είναι <strong>πάντοτε αρνητικός αριθμός</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Πρακτικά Παραδείγματα */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500">
                ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ ΠΑΡΑΔΕΙΓΜΑΤΑ
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  (＋4) · (＋6) ＝ ＋24
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  (－4) · (－6) ＝ ＋24
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  (＋4) · (－6) ＝ －24
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  (－4) · (＋6) ＝ －24
                </div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-sans">
                <strong>Συνοπτικός Κανόνας:</strong> Ίδια πρόσημα δίνουν <strong>συν (＋)</strong>, διαφορετικά πρόσημα δίνουν <strong>πλην (－)</strong>.
              </div>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο 2 Αριθμών */}
          <div className="pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              🛠️ Διαδραστικό Εργαστήριο: Γινόμενο Δύο Ακεραίων
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    1ΟΣ ΠΑΡΑΓΟΝΤΑΣ (α)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setFactorA, -1, -9, 9, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-900 font-black text-lg font-mono whitespace-nowrap px-2">
                      α ＝ {factorA > 0 ? `＋${factorA}` : factorA}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setFactorA, 1, -9, 9, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    2ΟΣ ΠΑΡΑΓΟΝΤΑΣ (β)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setFactorB, -1, -9, 9, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-sky-900 font-black text-lg font-mono whitespace-nowrap px-2">
                      β ＝ {factorB > 0 ? `＋${factorB}` : factorB}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setFactorB, 1, -9, 9, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος 2 Αριθμών */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">
                    ΑΝΑΛΥΣΗ ΠΡΟΣΗΜΟΥ
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    ruleType === 'same'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : ruleType === 'diff'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      : 'bg-slate-500/20 text-slate-300 border-slate-400/30'
                  }`}>
                    {ruleType === 'same' ? 'ΟΜΟΣΗΜΟΙ (ΠΡΟΣΗΜΟ ＋)' : ruleType === 'diff' ? 'ΕΤΕΡΟΣΗΜΟΙ (ΠΡΟΣΗΜΟ －)' : 'ΜΗΔΕΝΙΚΟΣ ΠΑΡΑΓΟΝΤΑΣ'}
                  </span>
                </div>

                <div className="text-2xl sm:text-4xl font-black font-mono">
                  {factorA > 0 ? `(＋${factorA})` : `(${factorA})`} · {factorB > 0 ? `(＋${factorB})` : `(${factorB})`} ＝{' '}
                  <span className={product2 > 0 ? 'text-emerald-400' : product2 < 0 ? 'text-rose-400' : 'text-slate-300'}>
                    {product2 > 0 ? `＋${product2}` : product2}
                  </span>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm text-indigo-100 font-sans">
                  {ruleType === 'same' && (
                    <span>Οι αριθμοί έχουν το ίδιο πρόσημο. Το γινόμενο είναι θετικό: ＋({absA} · {absB}) ＝ ＋{absA * absB}.</span>
                  )}
                  {ruleType === 'diff' && (
                    <span>Οι αριθμοί έχουν διαφορετικά πρόσημα. Το γινόμενο είναι αρνητικό: －({absA} · {absB}) ＝ －{absA * absB}.</span>
                  )}
                  {ruleType === 'zero' && (
                    <span>Ένας τουλάχιστον παράγοντας είναι 0, επομένως το γινόμενο ισούται με 0.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΙΔΙΟΤΗΤΕΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Ιδιότητες του Πολλαπλασιασμού
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs uppercase font-bold text-indigo-600">ΙΔΙΟΤΗΤΑ 1</div>
              <h3 className="font-bold text-slate-900 text-base">Αντιμεταθετική</h3>
              <p className="text-xs text-slate-600">Η σειρά των παραγόντων δεν αλλάζει το γινόμενο:</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                α · β ＝ β · α
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs uppercase font-bold text-indigo-600">ΙΔΙΟΤΗΤΑ 2</div>
              <h3 className="font-bold text-slate-900 text-base">Προσεταιριστική</h3>
              <p className="text-xs text-slate-600">Μπορούμε να ομαδοποιήσουμε ελεύθερα τους παράγοντες:</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-sm">
                (α · β) · γ ＝ α · (β · γ)
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs uppercase font-bold text-indigo-600">ΙΔΙΟΤΗΤΑ 3</div>
              <h3 className="font-bold text-slate-900 text-base">Ουδέτερο & Μηδενικό Στοιχείο</h3>
              <p className="text-xs text-slate-600">Το 1 διατηρεί τον αριθμό, ενώ το 0 μηδενίζει το γινόμενο:</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs space-y-1">
                <div>α · 1 ＝ α</div>
                <div>α · 0 ＝ 0</div>
              </div>
            </div>

            <div className="md:col-span-2 xl:col-span-3 p-5 sm:p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
              <div className="text-xs uppercase font-bold text-indigo-800">ΘΕΜΕΛΙΩΔΗΣ ΙΔΙΟΤΗΤΑ</div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Επιμεριστική Ιδιότητα ως προς την Πρόσθεση και την Αφαίρεση
              </h3>
              <p className="text-xs sm:text-sm text-slate-700">
                Ο πολλαπλασιασμός ενός αριθμού με άθροισμα ή διαφορά επιμερίζεται σε κάθε όρο:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono font-bold text-slate-900 text-center text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-xl border border-indigo-100">
                  α · (β ＋ γ) ＝ α · β ＋ α · γ
                </div>
                <div className="p-3 bg-white rounded-xl border border-indigo-100">
                  α · (β － γ) ＝ α · β － α · γ
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΓΙΝΟΜΕΝΟ ΠΟΛΛΩΝ ΠΑΡΑΓΟΝΤΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Γινόμενο Πολλών Παραγόντων (Γενικό Συμπέρασμα)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                Σε ένα γινόμενο πολλών μη μηδενικών παραγόντων, το τελικό πρόσημο καθορίζεται <strong>αποκλειστικά από το πλήθος των αρνητικών παραγόντων</strong>:
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-900 text-sm sm:text-base">
                    Άρτιο Πλήθος Αρνητικών → Πρόσημο Θετικό (＋)
                  </div>
                  <p className="text-xs text-slate-600">
                    Αν οι αρνητικοί παράγοντες είναι <strong>0, 2, 4, 6...</strong> (άρτιο πλήθος), τα μείον ανά δύο γίνονται συν και το αποτέλεσμα είναι <strong>θετικό</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1">
                  <div className="font-bold text-rose-900 text-sm sm:text-base">
                    Περιττό Πλήθος Αρνητικών → Πρόσημο Αρνητικό (－)
                  </div>
                  <p className="text-xs text-slate-600">
                    Αν οι αρνητικοί παράγοντες είναι <strong>1, 3, 5, 7...</strong> (περιττό πλήθος), περισσεύει ένα μείον και το αποτέλεσμα είναι <strong>αρνητικό</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500">
                ΠΑΡΑΔΕΙΓΜΑΤΑ ΕΛΕΓΧΟΥ ΠΛΗΘΟΥΣ
              </div>
              <div className="space-y-2 text-xs sm:text-sm font-mono">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-900 font-bold">
                    (－2) · (＋3) · (－4) ＝ ＋24
                  </div>
                  <div className="text-xs font-sans text-emerald-700">
                    Έχει <strong>2</strong> αρνητικούς (άρτιο πλήθος) → Θετικό (＋).
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-900 font-bold">
                    (－2) · (－3) · (－4) ＝ －24
                  </div>
                  <div className="text-xs font-sans text-rose-700">
                    Έχει <strong>3</strong> αρνητικούς (περιττό πλήθος) → Αρνητικό (－).
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-900 font-bold">
                    (－5) · (＋8) · 0 · (－9) ＝ 0
                  </div>
                  <div className="text-xs font-sans text-slate-600">
                    Περιέχει το 0 → Το γινόμενο μηδενίζεται άμεσα.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Διαδραστικό Εργαλείο Πολλών Παραγόντων */}
          <div className="pt-6 border-t border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                🛠️ Διαδραστικό Εργαστήριο: Γινόμενο Πολλών Παραγόντων
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={removeFactor}
                  disabled={multiFactors.length <= 2}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 disabled:opacity-40 transition"
                >
                  ΑΦΑΙΡΕΣΗ ΟΡΟΥ
                </button>
                <button
                  type="button"
                  onClick={addFactor}
                  disabled={multiFactors.length >= 6}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-40 transition"
                >
                  ＋ ΠΡΟΣΘΗΚΗ ΟΡΟΥ
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600">
              Πάτησε στο κουμπί <strong>«ΑΛΛΑΓΗ ΠΡΟΣΗΜΟΥ»</strong> κάτω από κάθε αριθμό για να δεις πώς αλλάζει το συνολικό πρόσημο:
            </p>

            {/* Κάρτες Παραγόντων Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {multiFactors.map((val, idx) => {
                const isNeg = val < 0;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-between space-y-2.5 transition-all ${
                      isNeg
                        ? 'bg-rose-50/70 border-rose-200'
                        : 'bg-sky-50/70 border-sky-200'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                      {idx + 1}ΟΣ ΟΡΟΣ
                    </div>

                    {/* Stepper τιμής */}
                    <div className="grid grid-cols-[28px_1fr_28px] items-center h-8 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => stepFactorValue(idx, -1, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-black text-sm font-mono">
                        {val > 0 ? `＋${val}` : val}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => stepFactorValue(idx, 1, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-100 active:scale-95 touch-manipulation"
                      >
                        ＋
                      </button>
                    </div>

                    {/* Toggle προσήμου */}
                    <button
                      type="button"
                      onClick={() => toggleFactorSign(idx)}
                      className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition active:scale-95 ${
                        isNeg
                          ? 'bg-rose-600 text-white hover:bg-rose-700'
                          : 'bg-sky-600 text-white hover:bg-sky-700'
                      }`}
                    >
                      {isNeg ? 'ΠΛΗΝ (－)' : 'ΣΥΝ (＋)'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Πίνακας Συνολικής Κατάστασης */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="text-xs uppercase text-slate-400 font-bold">
                    ΚΑΤΑΜΕΤΡΗΣΗ ΑΡΝΗΤΙΚΩΝ ΠΑΡΑΓΟΝΤΩΝ
                  </div>
                  <div className="text-sm sm:text-base font-bold text-amber-300">
                    Πλήθος Αρνητικών: {negativeCount} ({negativeCount % 2 === 0 ? 'Άρτιο πλήθος → Θετικό' : 'Περιττό πλήθος → Αρνητικό'})
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                  hasZero
                    ? 'bg-slate-500/20 text-slate-300 border-slate-400/30'
                    : multiProduct > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                }`}>
                  {hasZero ? 'ΜΗΔΕΝ (0)' : multiProduct > 0 ? 'ΘΕΤΙΚΟ (＋)' : 'ΑΡΝΗΤΙΚΟ (－)'}
                </div>
              </div>

              {/* Έκφραση και Αποτέλεσμα */}
              <div className="text-center space-y-1">
                <div className="font-mono text-xs sm:text-sm text-slate-300 break-words">
                  {multiFactors.map((x) => (x > 0 ? `(＋${x})` : `(${x})`)).join(' · ')}
                </div>
                <div className="text-3xl sm:text-5xl font-black font-mono">
                  ＝{' '}
                  <span className={multiProduct > 0 ? 'text-emerald-400' : multiProduct < 0 ? 'text-rose-400' : 'text-slate-300'}>
                    {multiProduct > 0 ? `＋${multiProduct.toLocaleString('el-GR')}` : multiProduct.toLocaleString('el-GR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
