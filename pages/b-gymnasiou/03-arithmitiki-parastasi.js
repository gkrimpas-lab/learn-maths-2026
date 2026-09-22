import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

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

// Preset παραδείγματα για το εργαστήριο
const PRESET_EXPRESSIONS = [
  { label: 'Με αρνητικό εκθέτη', expr: '2^3 - 4 * 2^-1 + 6' },
  { label: 'Παρενθέσεις & δύναμη', expr: '(5 - 3)^2 + 12 / 3 - 2^-2 * 8' },
  { label: 'Σύνθετη αριθμητική', expr: '10 + 2 * (3^2 - 4) - 5 * 10^-1' },
  { label: 'Πρόσημο και εκθέτης', expr: '(-2)^2 - 2^2 + 3 * 3^-1' },
];

// Ασφαλής εκτέλεση και ανάλυση βημάτων παράστασης
function solveExpressionSteps(inputExpr) {
  const steps = [];
  let current = inputExpr.replace(/\s+/g, '').replace(/·/g, '*').replace(/:/g, '/');

  if (!current) {
    return { error: 'Παρακαλώ πληκτρολόγησε μία αριθμητική παράσταση.', steps: [] };
  }

  // Έλεγχος μη έγκυρων χαρακτήρων
  if (/[^0-9+\-*/^().,]/.test(current)) {
    return { error: 'Η παράσταση περιέχει μη επιτρεπτούς χαρακτήρες.', steps: [] };
  }

  current = current.replace(/,/g, '.');

  try {
    let iteration = 0;
    const maxIterations = 15;

    // Βήμα 1: Επίλυση εσωτερικών παρενθέσεων
    const parenRegex = /\(([^()]+)\)/;
    while (parenRegex.test(current) && iteration < maxIterations) {
      iteration++;
      const match = current.match(parenRegex);
      const innerExpr = match[1];
      const innerResult = evaluateSimple(innerExpr);
      
      const before = current;
      current = current.replace(match[0], innerResult >= 0 ? innerResult : `(${innerResult})`);
      steps.push({
        action: `Υπολογισμός εντός παρένθεσης: (${innerExpr}) ＝ ${innerResult}`,
        before,
        after: current
      });
    }

    // Καθαρισμός τυχόν διπλών παρενθέσεων γύρω από απλούς αριθμούς
    current = current.replace(/\((-?\d+(\.\d+)?)\)/g, '$1');

    // Βήμα 2: Επίλυση δυνάμεων (π.χ. 2^3 ή 2^-1 ή (-2)^2)
    const powerRegex = /(-?\d+(?:\.\d+)?)\^(-?\d+(?:\.\d+)?)/;
    while (powerRegex.test(current) && iteration < maxIterations) {
      iteration++;
      const match = current.match(powerRegex);
      const base = parseFloat(match[1]);
      const exp = parseFloat(match[2]);
      const res = Math.pow(base, exp);
      const formattedRes = Number(res.toFixed(4));

      const before = current;
      current = current.replace(match[0], formattedRes >= 0 ? formattedRes : `(${formattedRes})`);
      steps.push({
        action: `Υπολογισμός δύναμης: ${match[1]}^${match[2]} ＝ ${formattedRes}${exp < 0 ? ` (αντίστροφος: 1/${base}^${Math.abs(exp)})` : ''}`,
        before,
        after: current
      });
    }

    // Καθαρισμός παρενθέσεων
    current = current.replace(/\((-?\d+(\.\d+)?)\)/g, '$1');

    // Βήμα 3: Πολλαπλασιασμοί & Διαιρέσεις (αριστερά προς δεξιά)
    const multDivRegex = /(-?\d+(?:\.\d+)?)\s*([*/])\s*(-?\d+(?:\.\d+)?)/;
    while (multDivRegex.test(current) && iteration < maxIterations) {
      iteration++;
      const match = current.match(multDivRegex);
      const a = parseFloat(match[1]);
      const op = match[2];
      const b = parseFloat(match[3]);

      if (op === '/' && b === 0) {
        return { error: 'Διαίρεση με το μηδέν δεν ορίζεται.', steps };
      }

      const res = op === '*' ? a * b : a / b;
      const formattedRes = Number(res.toFixed(4));

      const before = current;
      current = current.replace(match[0], formattedRes >= 0 ? formattedRes : `(${formattedRes})`);
      steps.push({
        action: `${op === '*' ? 'Πολλαπλασιασμός' : 'Διαίρεση'}: ${match[1]} ${op === '*' ? '·' : ':'} ${match[3]} ＝ ${formattedRes}`,
        before,
        after: current
      });
    }

    current = current.replace(/\((-?\d+(\.\d+)?)\)/g, '$1');

    // Βήμα 4: Προσθέσεις & Αφαιρέσεις (αριστερά προς δεξιά)
    const addSubRegex = /(-?\d+(?:\.\d+)?)\s*([+])\s*(-?\d+(?:\.\d+)?)|(-?\d+(?:\.\d+)?)\s*(-)\s*(\d+(?:\.\d+)?)/;
    while (addSubRegex.test(current) && iteration < maxIterations) {
      iteration++;
      const match = current.match(addSubRegex);
      let a, op, b;
      if (match[2] === '+') {
        a = parseFloat(match[1]);
        op = '+';
        b = parseFloat(match[3]);
      } else {
        a = parseFloat(match[4]);
        op = '-';
        b = parseFloat(match[6]);
      }

      const res = op === '+' ? a + b : a - b;
      const formattedRes = Number(res.toFixed(4));

      const before = current;
      current = current.replace(match[0], String(formattedRes));
      steps.push({
        action: `${op === '+' ? 'Πρόσθεση' : 'Αφαίρεση'}: ${a} ${op} ${b} ＝ ${formattedRes}`,
        before,
        after: current
      });
    }

    return { result: current.replace('.', ','), steps, error: null };
  } catch {
    return { error: 'Δεν ήταν δυνατή η ανάλυση της παράστασης. Βεβαιώσου για τη σωστή χρήση συμβόλων και παρενθέσεων.', steps: [] };
  }
}

// Βοηθητική απλή επίλυση εντός παρένθεσης
function evaluateSimple(expr) {
  let e = expr;
  // Δυνάμεις
  const powReg = /(-?\d+(?:\.\d+)?)\^(-?\d+(?:\.\d+)?)/;
  while (powReg.test(e)) {
    const m = e.match(powReg);
    const val = Math.pow(parseFloat(m[1]), parseFloat(m[2]));
    e = e.replace(m[0], val);
  }
  // Πολλαπλασιασμός / Διαίρεση
  const mdReg = /(-?\d+(?:\.\d+)?)\s*([*/])\s*(-?\d+(?:\.\d+)?)/;
  while (mdReg.test(e)) {
    const m = e.match(mdReg);
    const val = m[2] === '*' ? parseFloat(m[1]) * parseFloat(m[3]) : parseFloat(m[1]) / parseFloat(m[3]);
    e = e.replace(m[0], val);
  }
  // Πρόσθεση / Αφαίρεση
  const asReg = /(-?\d+(?:\.\d+)?)\s*([+])\s*(-?\d+(?:\.\d+)?)|(-?\d+(?:\.\d+)?)\s*(-)\s*(\d+(?:\.\d+)?)/;
  while (asReg.test(e)) {
    const m = e.match(asReg);
    let val;
    if (m[2] === '+') {
      val = parseFloat(m[1]) + parseFloat(m[3]);
    } else {
      val = parseFloat(m[4]) - parseFloat(m[6]);
    }
    e = e.replace(m[0], val);
  }
  return Number(parseFloat(e).toFixed(4));
}

export default function ArithmitikiParastasiTheoria() {
  const [customExpr, setCustomExpr] = useState('2^3 - 4 * 2^-1 + (5 - 3)^2');

  const analysis = useMemo(() => {
    return solveExpressionSteps(customExpr);
  }, [customExpr]);

  return (
    <Layout
      title="Αριθμητικές Παραστάσεις & Προτεραιότητα Πράξεων | Β' Γυμνασίου"
      description="Θεωρία, κανόνες προτεραιότητας πράξεων με δυνάμεις αρνητικού εκθέτη και διαδραστικός επιλυτής βήμα-βήμα για τη Β' Γυμνασίου."
      backUrl="/b-gymnasiou"
      backText="Β' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/b-gymnasiou/03-arithmitiki-parastasi-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>ΑΣΚΗΣΕΙΣ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        
        {/* Banner Header - Ενιαίο Indigo Theme */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 3
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase">
              ΑΡΙΘΜΗΤΙΚΕΣ ΠΑΡΑΣΤΑΣΕΙΣ & ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Εμβαθύνουμε στην ιεραρχία των πράξεων ενσωματώνοντας δυνάμεις με αρνητικό εκθέτη και κλάσματα. Πληκτρολόγησε τη δική σου παράσταση και δες την επίλυση βήμα-βήμα σε πραγματικό χρόνο!
            </p>
          </div>
        </section>

        {/* 1. Η ΙΕΡΑΡΧΙΑ ΤΗΣ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Η Σειρά Εκτέλεσης των Πράξεων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Αριθμητική παράσταση</strong> ονομάζεται μια σειρά από αριθμούς που συνδέονται μεταξύ τους με τα σύμβολα των πράξεων και ενδεχομένως με παρενθέσεις.
              </p>
              <p>
                Για να έχει κάθε παράσταση <strong>μοναδικό και αδιαμφισβήτητο αποτέλεσμα</strong>, ακολουθούμε απαρέγκλιτα την εξής σειρά:
              </p>
              
              <div className="space-y-3 font-sans">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-sm flex items-center justify-center">1</span>
                  <div>
                    <strong className="text-indigo-950 block">Παρενθέσεις:</strong>
                    <span className="text-xs sm:text-sm text-slate-600">Εκτελούμε πρώτα τις πράξεις μέσα στις παρενθέσεις, ξεκινώντας από τις πιο εσωτερικές προς τις εξωτερικές.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-100">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-600 text-white font-black text-sm flex items-center justify-center">2</span>
                  <div>
                    <strong className="text-amber-950 block">Δυνάμεις (Θετικοί & Αρνητικοί Εκθέτες):</strong>
                    <span className="text-xs sm:text-sm text-slate-600">Υπολογίζουμε όλες τις δυνάμεις (π.χ. <span className="font-mono font-bold">2³ = 8</span>, <span className="font-mono font-bold">5⁻¹ = 1/5</span>, <span className="font-mono font-bold">α⁰ = 1</span>).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-700 text-white font-black text-sm flex items-center justify-center">3</span>
                  <div>
                    <strong className="text-slate-900 block">Πολλαπλασιασμοί & Διαιρέσεις:</strong>
                    <span className="text-xs sm:text-sm text-slate-600">Εκτελούνται με τη σειρά που εμφανίζονται από <strong>αριστερά προς τα δεξιά</strong>.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-700 text-white font-black text-sm flex items-center justify-center">4</span>
                  <div>
                    <strong className="text-slate-900 block">Προσθέσεις & Αφαιρέσεις:</strong>
                    <span className="text-xs sm:text-sm text-slate-600">Εκτελούνται τελευταίες, επίσης με τη σειρά από <strong>αριστερά προς τα δεξιά</strong>.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Παγίδες & Νέα Στοιχεία Β' Γυμνασίου */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ΜΕΓΑΛΗ ΠΡΟΣΟΧΗ ΣΤΙΣ ΠΑΓΙΔΕΣ ΤΗΣ Β' ΓΥΜΝΑΣΙΟΥ
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-rose-600 block uppercase">1. ΑΡΝΗΤΙΚΟΣ ΕΚΘΕΤΗΣ ΜΕΣΑ ΣΕ ΠΡΑΞΕΙΣ</strong>
                  <p className="text-slate-600">
                    Ο αρνητικός εκθέτης μετατρέπεται πρώτα σε κλάσμα:
                  </p>
                  <div className="font-mono text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    4 · 2<sup>-1</sup> ＝ 4 · <Frac num="1" den="2" /> ＝ 2
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-rose-600 block uppercase">2. ΠΑΡΕΝΘΕΣΕΙΣ ΚΑΙ ΠΡΟΣΗΜΑ</strong>
                  <p className="text-slate-600">
                    Η θέση της παρένθεσης αλλάζει ριζικά το αποτέλεσμα:
                  </p>
                  <div className="font-mono text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1">
                    <div>(-3)<sup>2</sup> ＝ +9 <span className="text-[11px] text-slate-500 font-sans">(το πρόσημο είναι μέσα στη δύναμη)</span></div>
                    <div>-3<sup>2</sup> ＝ -9 <span className="text-[11px] text-slate-500 font-sans">(πρώτα η δύναμη 3²=9 και μετά το μείον)</span></div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-rose-600 block uppercase">3. ΔΙΑΔΟΧΙΚΕΣ ΔΙΑΙΡΕΣΕΙΣ & ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΙ</strong>
                  <p className="text-slate-600">
                    Δεν αλλάζουμε τη σειρά! Πάντα από αριστερά προς τα δεξιά:
                  </p>
                  <div className="font-mono text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    12 : 3 · 2 ＝ 4 · 2 ＝ 8 <span className="text-rose-600 font-sans font-bold">(ΟΧΙ 12 : 6 = 2)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: STEP-BY-STEP EVALUATOR */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              🛠️ Διαδραστικό Εργαστήριο: Επίλυση Βήμα-Βήμα με Προτεραιότητα
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Γράψε τη δική σου αριθμητική παράσταση στο παρακάτω πλαίσιο (χρησιμοποιώντας αριθμούς, <span className="font-mono font-bold">+</span>, <span className="font-mono font-bold">-</span>, <span className="font-mono font-bold">*</span>, <span className="font-mono font-bold">/</span>, <span className="font-mono font-bold">^</span> για δύναμη και παρενθέσεις) ή διάλεξε ένα έτοιμο παράδειγμα για να δεις την ανάλυση:
          </p>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase self-center mr-1">ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:</span>
            {PRESET_EXPRESSIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCustomExpr(item.expr)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all touch-manipulation"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΤΗΝ ΠΑΡΑΣΤΑΣΗ:
            </label>
            <div className="relative">
              <input
                type="text"
                value={customExpr}
                onChange={(e) => setCustomExpr(e.target.value)}
                placeholder="π.χ. 2^3 - 4 * 2^-1 + (5 - 3)^2"
                className="w-full h-14 px-4 sm:px-5 rounded-2xl border-2 border-indigo-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 font-mono text-base sm:text-xl font-bold text-slate-900 transition-all outline-none"
              />
              {customExpr && (
                <button
                  type="button"
                  onClick={() => setCustomExpr('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold transition-all"
                >
                  ΚΑΘΑΡΙΣΜΟΣ
                </button>
              )}
            </div>
            <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-4 gap-y-1 font-mono">
              <span>Σύμβολα: + (πρόσθεση), - (αφαίρεση), * (πολλαπλασιασμός), / (διαίρεση), ^ (δύναμη)</span>
            </div>
          </div>

          {/* Οθόνη Αποτελέσματος & Βημάτων */}
          <div className="bg-slate-900 rounded-3xl p-5 sm:p-8 text-white space-y-6 shadow-inner">
            {analysis.error ? (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{analysis.error}</span>
              </div>
            ) : (
              <>
                {/* Τελικό Αποτέλεσμα Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                  <div>
                    <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider">
                      ΑΡΧΙΚΗ ΠΑΡΑΣΤΑΣΗ
                    </span>
                    <div className="text-lg sm:text-2xl font-black font-mono text-amber-300">
                      {customExpr}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-emerald-400 uppercase font-bold tracking-wider">
                      ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ
                    </span>
                    <div className="text-2xl sm:text-4xl font-black font-mono text-white">
                      ＝ {analysis.result}
                    </div>
                  </div>
                </div>

                {/* Ανάλυση Βημάτων */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ ΒΑΣΕΙ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ:
                  </span>

                  {analysis.steps.length === 0 ? (
                    <div className="text-sm text-slate-400 italic">
                      Ο αριθμός είναι ήδη απλοποιημένος.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {analysis.steps.map((st, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 font-mono text-xs sm:text-sm"
                        >
                          <div className="flex items-center gap-2 text-indigo-300 font-sans font-bold">
                            <span className="w-5 h-5 rounded-md bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-xs">
                              {sIdx + 1}
                            </span>
                            <span>{st.action}</span>
                          </div>
                          <div className="pl-7 text-slate-300 flex items-center gap-2 flex-wrap">
                            <span className="line-through opacity-50">{st.before}</span>
                            <span className="text-amber-400 font-bold">➔</span>
                            <span className="text-white font-bold">{st.after}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {/* 3. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Αναλυτικά Λυμένα Παραδείγματα
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">ΠΑΡΑΔΕΙΓΜΑ 1</span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono">
                Α ＝ 3 · 2<sup>3</sup> - 18 : 3<sup>2</sup> + 5 · 10<sup>-1</sup>
              </h3>
              <div className="space-y-1.5 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div>1. Δυνάμεις: 2³=8, 3²=9, 10⁻¹=0,1</div>
                <div className="pl-3 text-slate-500">➔ 3 · 8 - 18 : 9 + 5 · 0,1</div>
                <div>2. Πολλαπλασιασμοί & Διαιρέσεις: 3·8=24, 18:9=2, 5·0,1=0,5</div>
                <div className="pl-3 text-slate-500">➔ 24 - 2 + 0,5</div>
                <div>3. Αφαιρέσεις & Προσθέσεις (αριστερά προς δεξιά):</div>
                <div className="pl-3 font-bold text-indigo-700">➔ 22 + 0,5 ＝ 22,5</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">ΠΑΡΑΔΕΙΓΜΑ 2</span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono">
                Β ＝ (4 - 6)<sup>3</sup> - (-3)<sup>2</sup> + 8 · 2<sup>-2</sup>
              </h3>
              <div className="space-y-1.5 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div>1. Πράξη στην παρένθεση: 4 - 6 = -2</div>
                <div className="pl-3 text-slate-500">➔ (-2)³ - (-3)² + 8 · 2⁻²</div>
                <div>2. Δυνάμεις: (-2)³ = -8, (-3)² = +9, 2⁻² = 1/4</div>
                <div className="pl-3 text-slate-500">➔ -8 - (+9) + 8 · (1/4)</div>
                <div>3. Πολλαπλασιασμός: 8 · (1/4) = 2</div>
                <div className="pl-3 text-slate-500">➔ -8 - 9 + 2</div>
                <div>4. Προσθέσεις / Αφαιρέσεις:</div>
                <div className="pl-3 font-bold text-indigo-700">➔ -17 + 2 ＝ -15</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
