import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός τόνων στα κεφαλαία με εξαίρεση το "Α'"
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Α')/g);
  return parts
    .map((part) => {
      if (part === "Α'") return "Α'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

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

const translations = {
  el: {
    metaTitle: "Μέγιστος Κοινός Διαιρέτης (ΜΚΔ) | Α' Γυμνασίου",
    metaDescription: "Θεωρία, κανόνες ανάλυσης σε πρώτους παράγοντες και διαδραστικό εργαστήριο υπολογισμού ΜΚΔ για 2, 3 ή 4 αριθμούς.",
    backText: "Α' Γυμνασίου",
    actionButton: "ΑΣΚΗΣΕΙΣ",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)",
    mainSubtitle: "Μαθαίνουμε πώς να βρίσκουμε τον μεγαλύτερο κοινό διαιρέτη δύο, τριών ή τεσσάρων αριθμών με τη μέθοδο των συνόλων διαιρετών και με την ανάλυση σε γινόμενο πρώτων παραγόντων.",

    // Ενότητα 1
    sec1Title: "Ορισμός του Μέγιστου Κοινού Διαιρέτη",
    sec1Intro: "Μέγιστος Κοινός Διαιρέτης (ΜΚΔ) δύο ή περισσότερων φυσικών αριθμών (διαφόρων του 0) ονομάζεται ο μεγαλύτερος από τους κοινούς διαιρέτες τους.",
    sec1Notation: "ΜΚΔ(α, β) ή ΜΚΔ(α, β, γ) ή ΜΚΔ(α, β, γ, δ)",
    exampleTitle: "Κλασικό Παράδειγμα για τους αριθμούς 12 και 18:",
    divisorsOf12: "Διαιρέτες του 12:",
    divisorsOf18: "Διαιρέτες του 18:",
    commonDivisors: "Κοινοί Διαιρέτες:",
    soGCD: "Άρα: ΜΚΔ(12, 18) ＝ 6",
    coprimeBadge: "ΕΙΔΙΚΗ ΚΑΙ ΣΗΜΑΝΤΙΚΗ ΕΝΝΟΙΑ",
    coprimeTitle: "Πρώτοι Μεταξύ τους Αριθμοί",
    coprimeDesc: "Δύο ή περισσότεροι αριθμοί ονομάζονται πρώτοι μεταξύ τους όταν ο μοναδικός κοινός τους διαιρέτης είναι το 1.",
    coprimeFormula: "ΜΚΔ(α, β) ＝ 1",
    coprimeWarningTitle: "Προσοχή:",
    coprimeWarningDesc: "Οι αριθμοί δεν χρειάζεται να είναι πρώτοι οι ίδιοι! Για παράδειγμα, το 8 και το 9 είναι και τα δύο σύνθετοι αριθμοί, αλλά είναι πρώτοι μεταξύ τους επειδή ΜΚΔ(8, 9) ＝ 1.",

    // Ενότητα 2
    sec2Title: "Εύρεση ΜΚΔ με Ανάλυση σε Πρώτους Παράγοντες",
    sec2Intro: "Για μεγάλους αριθμούς, η καταγραφή όλων των διαιρετών είναι χρονοβόρα. Εφαρμόζουμε τον κανόνα της ανάλυσης σε πρώτους παράγοντες:",
    ruleBadge: "ΚΑΝΟΝΑΣ ΥΠΟΛΟΓΙΣΜΟΥ ΜΚΔ",
    ruleDesc: "Ο Μέγιστος Κοινός Διαιρέτης ισούται με το γινόμενο των κοινών πρώτων παραγόντων, καθενός υψωμένου στον μικρότερο εκθέτη του.",
    step1: "Αναλύουμε κάθε αριθμό σε γινόμενο πρώτων παραγόντων.",
    step2: "Εντοπίζουμε μόνο τους πρώτους παράγοντες που είναι κοινοί σε όλους.",
    step3: "Για κάθε κοινό παράγοντα επιλέγουμε τον μικρότερο εκθέτη.",
    step4: "Πολλαπλασιάζουμε τις δυνάμεις αυτές μεταξύ τους.",
    exampleHeading: "ΑΝΑΛΥΤΙΚΟ ΠΑΡΑΔΕΙΓΜΑ: 24, 36 ΚΑΙ 60",
    ruleAppTitle: "Εφαρμογή Κανόνα:",
    factor2Note: "Κοινός παράγοντας 2: μικρότερος εκθέτης το 2 → 2<sup>2</sup>",
    factor3Note: "Κοινός παράγοντας 3: μικρότερος εκθέτης το 1 → 3",
    factor5Note: "Ο παράγοντας 5 αγνοείται, γιατί δεν υπάρχει στο 24 και στο 36.",
    finalResultExample: "ΜΚΔ(24, 36, 60) ＝ 2<sup>2</sup> · 3 ＝ 4 · 3 ＝ 12",

    // Ενότητα 3 / Εργαστήριο
    labTitle: "Διαδραστικό Εργαστήριο: Υπολογισμός ΜΚΔ για 2, 3 ή 4 Αριθμούς",
    selectCountTitle: "ΕΠΙΛΟΓΗ ΠΛΗΘΟΥΣ ΑΡΙΘΜΩΝ",
    selectCountDesc: "Επίλεξε αν θέλεις να υπολογίσεις τον ΜΚΔ για 2, 3 ή 4 αριθμούς:",
    numbersCountBtn: "ΑΡΙΘΜΟΙ",
    numberLabel: "Αριθμός",
    primeFactorizationTitle: "ΑΝΑΛΥΣΗ ΚΑΘΕ ΑΡΙΘΜΟΥ ΣΕ ΠΡΩΤΟΥΣ ΠΑΡΑΓΟΝΤΕΣ",
    checkCommonPrimesTitle: "ΕΛΕΓΧΟΣ ΚΟΙΝΩΝ ΠΡΩΤΩΝ ΠΑΡΑΓΟΝΤΩΝ",
    primeWord: "Πρώτος",
    commonCheckYes: "✓ Κοινός",
    minExpLabel: "Ελάχ. εκθέτης:",
    gcdResultBadge: "ΑΠΟΤΕΛΕΣΜΑ ΜΚΔ",
    expansionTitle: "ΑΝΑΠΤΥΓΜΑ ΚΟΙΝΩΝ ΠΑΡΑΓΟΝΤΩΝ:",
    gcdFormulaPrefix: "ΜΚΔ",
    coprimeResultNotice: "Οι αριθμοί είναι πρώτοι μεταξύ τους!",
  },
  en: {
    metaTitle: "Greatest Common Divisor (GCD) | 7th Grade",
    metaDescription: "Theory, prime factorization rules, and interactive GCD calculation lab for 2, 3, or 4 numbers.",
    backText: "7th Grade",
    actionButton: "EXERCISES",
    badge: "7TH GRADE • THEORY & LAB",
    mainTitle: "Greatest Common Divisor (GCD)",
    mainSubtitle: "Learn how to find the greatest common divisor of two, three, or four numbers using divisor sets and prime factorization.",

    // Section 1
    sec1Title: "Definition of Greatest Common Divisor",
    sec1Intro: "The Greatest Common Divisor (GCD) of two or more non-zero natural numbers is the largest of their common divisors.",
    sec1Notation: "GCD(a, b) or GCD(a, b, c) or GCD(a, b, c, d)",
    exampleTitle: "Classic Example for numbers 12 and 18:",
    divisorsOf12: "Divisors of 12:",
    divisorsOf18: "Divisors of 18:",
    commonDivisors: "Common Divisors:",
    soGCD: "Therefore: GCD(12, 18) ＝ 6",
    coprimeBadge: "SPECIAL AND IMPORTANT CONCEPT",
    coprimeTitle: "Relatively Prime Numbers (Coprime)",
    coprimeDesc: "Two or more numbers are called relatively prime (or coprime) when their only common divisor is 1.",
    coprimeFormula: "GCD(a, b) ＝ 1",
    coprimeWarningTitle: "Caution:",
    coprimeWarningDesc: "The numbers do not need to be prime themselves! For instance, 8 and 9 are both composite numbers, but they are coprime because GCD(8, 9) ＝ 1.",

    // Section 2
    sec2Title: "Finding GCD via Prime Factorization",
    sec2Intro: "For large numbers, listing all divisors is time-consuming. We apply the prime factorization rule:",
    ruleBadge: "GCD CALCULATION RULE",
    ruleDesc: "The Greatest Common Divisor equals the product of common prime factors, each raised to its lowest exponent.",
    step1: "Factor each number into a product of prime factors.",
    step2: "Identify only the prime factors that are common to all numbers.",
    step3: "For each common factor, pick the lowest exponent.",
    step4: "Multiply these powers together.",
    exampleHeading: "STEP-BY-STEP EXAMPLE: 24, 36 AND 60",
    ruleAppTitle: "Rule Application:",
    factor2Note: "Common factor 2: lowest exponent is 2 → 2<sup>2</sup>",
    factor3Note: "Common factor 3: lowest exponent is 1 → 3",
    factor5Note: "Factor 5 is omitted because it is not present in 24 and 36.",
    finalResultExample: "GCD(24, 36, 60) ＝ 2<sup>2</sup> · 3 ＝ 4 · 3 ＝ 12",

    // Section 3 / Lab
    labTitle: "Interactive Lab: GCD Calculation for 2, 3, or 4 Numbers",
    selectCountTitle: "SELECT NUMBER COUNT",
    selectCountDesc: "Choose whether to calculate GCD for 2, 3, or 4 numbers:",
    numbersCountBtn: "NUMBERS",
    numberLabel: "Number",
    primeFactorizationTitle: "PRIME FACTORIZATION OF EACH NUMBER",
    checkCommonPrimesTitle: "COMMON PRIME FACTORS CHECK",
    primeWord: "Prime",
    commonCheckYes: "✓ Common",
    minExpLabel: "Min exp:",
    gcdResultBadge: "GCD RESULT",
    expansionTitle: "COMMON FACTORS EXPANSION:",
    gcdFormulaPrefix: "GCD",
    coprimeResultNotice: "The numbers are relatively prime (coprime)!",
  },
};

export default function MKDTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

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

  // Μορφοποίηση αναλυτικής έκφρασης ΜΚΔ (π.χ. 2<sup>2</sup> · 3)
  const mkdExpression = useMemo(() => {
    const parts = commonPrimeDetails
      .filter((item) => item.isCommon)
      .map((item) => (item.minExp > 1 ? `${item.prime}<sup>${item.minExp}</sup>` : `${item.prime}`));
    return parts.length > 0 ? parts.join(' · ') : '1';
  }, [commonPrimeDetails]);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/03-MKD-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.actionButton)}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 sm:space-y-16">
        
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {t.mainTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              {t.mainSubtitle}
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
              {t.sec1Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>{t.mainTitle}</strong>{' '}
                {locale === 'el'
                  ? 'δύο ή περισσότερων φυσικών αριθμών (διαφόρων του 0) ονομάζεται ο'
                  : 'of two or more non-zero natural numbers is the'}{' '}
                <strong>{locale === 'el' ? 'μεγαλύτερος' : 'largest'}</strong>{' '}
                {locale === 'el' ? 'από τους κοινούς διαιρέτες τους.' : 'of their common divisors.'}
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-950 font-bold text-center text-lg sm:text-xl font-mono">
                {t.sec1Notation}
              </div>
              <p className="text-sm sm:text-base text-slate-600">
                <em>{t.exampleTitle}</em>
              </p>
              <ul className="text-xs sm:text-sm space-y-1 font-mono text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <li>{t.divisorsOf12} {'{'} 1, 2, 3, 4, <strong>6</strong>, 12 {'}'}</li>
                <li>{t.divisorsOf18} {'{'} 1, 2, 3, <strong>6</strong>, 9, 18 {'}'}</li>
                <li>{t.commonDivisors} {'{'} 1, 2, 3, <strong>6</strong> {'}'}</li>
                <li className="text-indigo-900 font-bold pt-1">{t.soGCD}</li>
              </ul>
            </div>

            {/* Πρώτοι Μεταξύ τους Αριθμοί */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-indigo-600 uppercase">
                {toCleanUppercase(t.coprimeBadge)}
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-xl">
                {t.coprimeTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {locale === 'el' ? (
                  <>
                    Δύο ή περισσότεροι αριθμοί ονομάζονται <strong>πρώτοι μεταξύ τους</strong> όταν ο μοναδικός κοινός τους διαιρέτης είναι το <strong>1</strong>.
                  </>
                ) : (
                  <>
                    Two or more numbers are called <strong>coprime (relatively prime)</strong> when their only common divisor is <strong>1</strong>.
                  </>
                )}
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 text-indigo-950 font-bold text-center text-base sm:text-lg font-mono">
                {t.coprimeFormula}
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs sm:text-sm text-slate-700">
                <strong>{t.coprimeWarningTitle}</strong> {t.coprimeWarningDesc}
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
              {t.sec2Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>{t.sec2Intro}</p>
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                  {toCleanUppercase(t.ruleBadge)}
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {t.ruleDesc}
                </p>
              </div>
              <ul className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-600">
                <li>{t.step1}</li>
                <li>{t.step2}</li>
                <li>{t.step3}</li>
                <li>{t.step4}</li>
              </ul>
            </div>

            {/* Πρακτικό Παράδειγμα 3 Αριθμών */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm">
              <div className="text-xs font-bold text-slate-500 uppercase">
                {toCleanUppercase(t.exampleHeading)}
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
                <div className="font-bold text-emerald-900">{t.ruleAppTitle}</div>
                <div dangerouslySetInnerHTML={{ __html: t.factor2Note }} />
                <div dangerouslySetInnerHTML={{ __html: t.factor3Note }} />
                <div>{t.factor5Note}</div>
                <div
                  className="font-bold pt-1 font-mono text-emerald-900"
                  dangerouslySetInnerHTML={{ __html: t.finalResultExample }}
                />
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
              {t.labTitle}
            </h2>
          </div>

          {/* Επιλογή Πλήθους Αριθμών - Responsive Segmented Control */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.selectCountTitle)}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                {t.selectCountDesc}
              </p>
            </div>

            <div className="grid grid-cols-3 w-full sm:w-auto p-1 bg-slate-200/80 rounded-xl gap-1">
              {[2, 3, 4].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setCount(cnt)}
                  className={`px-1.5 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-sm font-black transition-all text-center whitespace-nowrap overflow-hidden text-ellipsis ${
                    count === cnt
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {cnt} {toCleanUppercase(t.numbersCountBtn)}
                </button>
              ))}
            </div>
          </div>

          {/* Steppers & Inputs για τους επιλεγμένους αριθμούς */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeNumbers.map((num, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase">
                  {t.numberLabel} {idx + 1}
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
                {toCleanUppercase(t.primeFactorizationTitle)}
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
                      <span className="font-bold text-indigo-900">
                        {t.numberLabel} {item.num}:
                      </span>
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
                  {toCleanUppercase(t.checkCommonPrimesTitle)}
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
                        <span>{t.primeWord} {detail.prime}</span>
                        <span>{detail.isCommon ? t.commonCheckYes : '✗'}</span>
                      </div>
                      {detail.isCommon && (
                        <div className="text-[11px] text-emerald-800 mt-1 font-mono">
                          {t.minExpLabel} {detail.minExp}
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
                  {toCleanUppercase(t.gcdResultBadge)}
                </div>
                <div className="text-3xl sm:text-5xl font-black font-mono text-amber-400">
                  {mkdResult}
                </div>
                <div className="text-xs text-indigo-200 font-mono break-words">
                  {t.gcdFormulaPrefix}({activeNumbers.join(', ')}) ＝ {mkdResult}
                </div>
              </div>

              <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2 text-xs sm:text-sm">
                <div className="text-indigo-200 font-bold uppercase text-[11px]">
                  {toCleanUppercase(t.expansionTitle)}
                </div>
                <div
                  className="font-mono text-base font-bold text-amber-300"
                  dangerouslySetInnerHTML={{
                    __html: `${t.gcdFormulaPrefix} ＝ ${mkdExpression} ＝ ${mkdResult}`,
                  }}
                />
              </div>

              {mkdResult === 1 && (
                <div className="p-3 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-200 text-xs text-center font-bold">
                  {t.coprimeResultNotice}
                </div>
              )}
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}