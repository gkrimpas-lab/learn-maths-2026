import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση εύρεσης όλων των θετικών διαιρετών
const getDivisors = (n) => {
  if (n <= 0) return [];
  const divs = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) divs.push(i);
  }
  return divs;
};

// Βοηθητική συνάρτηση ανάλυσης σε πρώτους παράγοντες: επιστρέφει Map { prime: exponent }
const getPrimeFactorization = (num) => {
  let n = num;
  const factors = {};
  if (n <= 1) return factors;

  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      factors[d] = (factors[d] || 0) + 1;
      n = Math.floor(n / d);
    }
    d = d === 2 ? 3 : d + 2;
  }
  if (n > 1) {
    factors[n] = (factors[n] || 0) + 1;
  }
  return factors;
};

// Υπολογισμός ΕΚΔ / ΜΚΔ 2 αριθμών (Ευκλείδης)
const gcd2 = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
};

// Υπολογισμός ΜΚΔ για πίνακα αριθμών
const calculateGCDArray = (arr) => {
  if (!arr.length) return 1;
  return arr.reduce((acc, curr) => gcd2(acc, curr), arr[0]);
};

export default function MKDTheoria() {
  // Πλήθος αριθμών για το εργαστήριο (2, 3 ή 4)
  const [count, setCount] = useState(3);
  const [numbers, setNumbers] = useState([24, 36, 60, 48]);

  // Ενημέρωση συγκεκριμένου αριθμού από stepper
  const handleStep = (index, delta, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setNumbers((prev) => {
      const next = [...prev];
      const val = Math.max(2, Math.min(500, next[index] + delta));
      next[index] = val;
      return next;
    });
  };

  // Ενημέρωση από input
  const handleInputChange = (index, valStr) => {
    const clean = valStr.replace(/[^0-9]/g, '');
    if (clean.length > 3) return;
    const val = clean === '' ? 2 : parseInt(clean, 10);
    setNumbers((prev) => {
      const next = [...prev];
      next[index] = Math.max(1, Math.min(500, val));
      return next;
    });
  };

  // Ενεργοί αριθμοί με βάση το επιλεγμένο πλήθος
  const activeNumbers = useMemo(() => numbers.slice(0, count), [numbers, count]);

  // Υπολογισμός ΜΚΔ
  const mkdResult = useMemo(() => calculateGCDArray(activeNumbers), [activeNumbers]);

  // Αναλύσεις σε πρώτους παράγοντες για κάθε ενεργό αριθμό
  const factorizations = useMemo(() => {
    return activeNumbers.map((num) => ({
      num,
      factors: getPrimeFactorization(num),
    }));
  }, [activeNumbers]);

  // Εύρεση όλων των διακριτών πρώτων παραγόντων που εμφανίζονται
  const allPrimes = useMemo(() => {
    const primeSet = new Set();
    factorizations.forEach((f) => {
      Object.keys(f.factors).forEach((p) => primeSet.add(parseInt(p, 10)));
    });
    return Array.from(primeSet).sort((a, b) => a - b);
  }, [factorizations]);

  // Εύρεση κοινών πρώτων παραγόντων με τον ελάχιστο εκθέτη
  const commonPrimeDetails = useMemo(() => {
    const list = [];
    allPrimes.forEach((p) => {
      // Ελέγχουμε αν υπάρχει σε ΟΛΟΥΣ τους ενεργούς αριθμούς
      const exponents = factorizations.map((f) => f.factors[p] || 0);
      const isCommon = exponents.every((exp) => exp > 0);
      const minExp = Math.min(...exponents);
      list.push({
        prime: p,
        isCommon,
        exponents,
        minExp: isCommon ? minExp : 0,
      });
    });
    return list;
  }, [allPrimes, factorizations]);

  // Μορφοποίηση αναλυτικής έκφρασης ΜΚΔ (π.χ. 2² · 3)
  const mkdExpression = useMemo(() => {
    const parts = commonPrimeDetails
      .filter((item) => item.isCommon)
      .map((item) => (item.minExp > 1 ? `${item.prime}<sup>${item.minExp}</sup>` : `${item.prime}`));
    return parts.length > 0 ? parts.join(' · ') : '1';
  }, [commonPrimeDetails]);

  return (
    <Layout
      title="Μέγιστος Κοινός Διαιρέτης (ΜΚΔ) | Α' Γυμνασίου"
      description="Θεωρία, κανόνες ανάλυσης σε πρώτους παράγοντες και διαδραστικό εργαστήριο υπολογισμού ΜΚΔ για 2, 3 ή 4 αριθμούς."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/03-MKD-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε πώς να βρίσκουμε τον μεγαλύτερο κοινό διαιρέτη δύο, τριών ή τεσσάρων αριθμών με τη μέθοδο των συνόλων διαιρετών και με την ανάλυση σε γινόμενο πρώτων παραγόντων.
            </p>
          </div>
        </section>

        {/* 1. ΕΝΝΟΙΑ ΤΟΥ ΜΚΔ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Ορισμός του Μέγιστου Κοινού Διαιρέτη
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)</strong> δύο ή περισσότερων φυσικών αριθμών (διαφόρων του 0) ονομάζεται ο <strong>μεγαλύτερος</strong> από τους κοινούς διαιρέτες τους.
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-950 font-bold text-center text-lg sm:text-xl font-mono">
                ΜΚΔ(α, β) ή ΜΚΔ(α, β, γ) ή ΜΚΔ(α, β, γ, δ)
              </div>
              <p className="text-sm sm:text-base text-slate-600">
                <em>Κλασικό Παράδειγμα για τους αριθμούς 12 και 18:</em>
              </p>
              <ul className="text-xs sm:text-sm space-y-1 font-mono text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <li>Διαιρέτες του 12: {'{'} 1, 2, 3, 4, <strong>6</strong>, 12 {'}'}</li>
                <li>Διαιρέτες του 18: {'{'} 1, 2, 3, <strong>6</strong>, 9, 18 {'}'}</li>
                <li>Κοινοί Διαιρέτες: {'{'} 1, 2, 3, <strong>6</strong> {'}'}</li>
                <li className="text-indigo-900 font-bold pt-1">Άρα: ΜΚΔ(12, 18) ＝ 6</li>
              </ul>
            </div>

            {/* Πρώτοι Μεταξύ τους Αριθμοί */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-indigo-600 uppercase">
                ΕΙΔΙΚΗ ΚΑΙ ΣΗΜΑΝΤΙΚΗ ΕΝΝΟΙΑ
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-xl">
                Πρώτοι Μεταξύ τους Αριθμοί
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Δύο ή περισσότεροι αριθμοί ονομάζονται <strong>πρώτοι μεταξύ τους</strong> όταν ο μοναδικός κοινός τους διαιρέτης είναι το <strong>1</strong>.
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 text-indigo-950 font-bold text-center text-base sm:text-lg font-mono">
                ΜΚΔ(α, β) ＝ 1
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs sm:text-sm text-slate-700">
                <strong>Προσοχή:</strong> Οι αριθμοί δεν χρειάζεται να είναι πρώτοι οι ίδιοι! Για παράδειγμα, το 8 και το 9 είναι και τα δύο σύνθετοι αριθμοί, αλλά είναι <em>πρώτοι μεταξύ τους</em> επειδή ΜΚΔ(8, 9) ＝ 1.
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΕΥΡΕΣΗ ΜΕ ΑΝΑΛΥΣΗ ΣΕ ΠΡΩΤΟΥΣ ΠΑΡΑΓΟΝΤΕΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Εύρεση ΜΚΔ με Ανάλυση σε Πρώτους Παράγοντες
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                Για μεγάλους αριθμούς, η καταγραφή όλων των διαιρετών είναι χρονοβόρα. Εφαρμόζουμε τον <strong>κανόνα της ανάλυσης σε πρώτους παράγοντες</strong>:
              </p>
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                  ΚΑΝΟΝΑΣ ΥΠΟΛΟΓΙΣΜΟΥ ΜΚΔ
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  Ο Μέγιστος Κοινός Διαιρέτης ισούται με το γινόμενο των <u>κοινών</u> πρώτων παραγόντων, καθενός υψωμένου στον <u>μικρότερο εκθέτη</u> του.
                </p>
              </div>
              <ul className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-600">
                <li>Αναλύουμε κάθε αριθμό σε γινόμενο πρώτων παραγόντων.</li>
                <li>Εντοπίζουμε μόνο τους πρώτους παράγοντες που είναι <strong>κοινοί σε όλους</strong>.</li>
                <li>Για κάθε κοινό παράγοντα επιλέγουμε τον <strong>μικρότερο εκθέτη</strong>.</li>
                <li>Πολλαπλασιάζουμε τις δυνάμεις αυτές μεταξύ τους.</li>
              </ul>
            </div>

            {/* Πρακτικό Παράδειγμα 3 Αριθμών */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm">
              <div className="text-xs font-bold text-slate-500 uppercase">
                ΑΝΑΛΥΤΙΚΟ ΠΑΡΑΔΕΙΓΜΑ: 24, 36 ΚΑΙ 60
              </div>
              <div className="space-y-2 font-mono text-slate-900">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  24 ＝ 2<sup>3</sup> · 3
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  36 ＝ 2<sup>2</sup> · 3<sup>2</sup>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  60 ＝ 2<sup>2</sup> · 3 · 5
                </div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 space-y-1.5 font-sans">
                <div className="font-bold text-emerald-900">Εφαρμογή Κανόνα:</div>
                <div>• Κοινός παράγοντας <strong>2</strong>: μικρότερος εκθέτης το 2 → <strong>2<sup>2</sup></strong></div>
                <div>• Κοινός παράγοντας <strong>3</strong>: μικρότερος εκθέτης το 1 → <strong>3</strong></div>
                <div>• Ο παράγοντας <strong>5</strong> αγνοείται, γιατί δεν υπάρχει στο 24 και στο 36.</div>
                <div className="font-bold pt-1 font-mono text-emerald-900">
                  ΜΚΔ(24, 36, 60) ＝ 2<sup>2</sup> · 3 ＝ 4 · 3 ＝ 12
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΜΚΔ ΓΙΑ 2, 3 Ή 4 ΑΡΙΘΜΟΥΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Διαδραστικό Εργαστήριο: Υπολογισμός ΜΚΔ για 2, 3 ή 4 Αριθμούς
            </h2>
          </div>

          {/* Επιλογή Πλήθους Αριθμών */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                ΕΠΙΛΟΓΗ ΠΛΗΘΟΥΣ ΑΡΙΘΜΩΝ
              </div>
              <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                Επίλεξε αν θέλεις να υπολογίσεις τον ΜΚΔ για 2, 3 ή 4 αριθμούς:
              </p>
            </div>

            <div className="inline-flex p-1 bg-slate-200/80 rounded-xl gap-1">
              {[2, 3, 4].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setCount(cnt)}
                  className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all ${
                    count === cnt
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {cnt} ΑΡΙΘΜΟΙ
                </button>
              ))}
            </div>
          </div>

          {/* Steppers & Inputs για τους επιλεγμένους αριθμούς */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeNumbers.map((num, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase">
                  Αριθμός {idx + 1}
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(idx, -1, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    value={num}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    className="h-full w-full bg-white rounded-xl border border-slate-300 text-slate-900 font-black text-center text-lg font-mono focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleStep(idx, 1, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Πίνακας Αναλύσεων και Τελικό Αποτέλεσμα */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Αναλύσεις σε Πρώτους Παράγοντες */}
            <div className="lg:col-span-2 space-y-3 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
                ΑΝΑΛΥΣΗ ΚΑΘΕ ΑΡΙΘΜΟΥ ΣΕ ΠΡΩΤΟΥΣ ΠΑΡΑΓΟΝΤΕΣ
              </h3>
              <div className="space-y-2">
                {factorizations.map((item, i) => {
                  const parts = Object.entries(item.factors).map(([p, exp]) =>
                    exp > 1 ? `${p}<sup>${exp}</sup>` : `${p}`
                  );
                  const expStr = parts.length > 0 ? parts.join(' · ') : `${item.num}`;

                  return (
                    <div
                      key={i}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-sm sm:text-base font-mono"
                    >
                      <span className="font-bold text-indigo-900">Αριθμός {item.num}:</span>
                      <span
                        className="text-slate-800 font-bold"
                        dangerouslySetInnerHTML={{ __html: `${item.num} ＝ ${expStr}` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Πίνακας σύγκρισης εκθετών κοινών πρώτων */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase">
                  ΕΛΕΓΧΟΣ ΚΟΙΝΩΝ ΠΡΩΤΩΝ ΠΑΡΑΓΟΝΤΩΝ
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {commonPrimeDetails.map((detail) => (
                    <div
                      key={detail.prime}
                      className={`p-2.5 rounded-xl border ${
                        detail.isCommon
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>Πρώτος {detail.prime}</span>
                        <span>{detail.isCommon ? '✓ Κοινός' : '✗'}</span>
                      </div>
                      {detail.isCommon && (
                        <div className="text-[11px] text-emerald-800 mt-1 font-mono">
                          Ελάχ. εκθέτης: {detail.minExp}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Μεγάλη Κάρτα Τελικού Αποτελέσματος ΜΚΔ */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md">
              <div className="text-center space-y-2">
                <div className="text-xs uppercase tracking-widest text-indigo-300 font-bold">
                  ΑΠΟΤΕΛΕΣΜΑ ΜΚΔ
                </div>
                <div className="text-3xl sm:text-5xl font-black font-mono text-amber-400">
                  {mkdResult}
                </div>
                <div className="text-xs text-indigo-200 font-mono break-words">
                  ΜΚΔ({activeNumbers.join(', ')}) ＝ {mkdResult}
                </div>
              </div>

              <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2 text-xs sm:text-sm">
                <div className="text-indigo-200 font-bold uppercase text-[11px]">
                  ΑΝΑΠΤΥΓΜΑ ΚΟΙΝΩΝ ΠΑΡΑΓΟΝΤΩΝ:
                </div>
                <div
                  className="font-mono text-base font-bold text-amber-300"
                  dangerouslySetInnerHTML={{
                    __html: `ΜΚΔ ＝ ${mkdExpression} ＝ ${mkdResult}`,
                  }}
                />
              </div>

              {mkdResult === 1 && (
                <div className="p-3 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-200 text-xs text-center font-bold">
                  Οι αριθμοί είναι πρώτοι μεταξύ τους!
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
