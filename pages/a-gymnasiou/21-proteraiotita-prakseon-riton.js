import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση μορφοποίησης αριθμού στην ελληνική γραφή
const formatNum = (num) => {
  if (Number.isInteger(num)) return num.toString();
  return Number(num.toFixed(4)).toString().replace('.', ',');
};

// Μηχανή επίλυσης βήμα-βήμα για παραστάσεις Α' Γυμνασίου
function solveStepByStep(rawExpr) {
  if (!rawExpr || !rawExpr.trim()) return { steps: [], error: null, result: null };

  // Καθαρισμός συμβόλων
  let expr = rawExpr
    .replace(/\s+/g, '')
    .replace(/,/g, '.')
    .replace(/·/g, '*')
    .replace(/:/g, '/');

  // Βασικός έλεγχος έγκυρων χαρακτήρων
  if (!/^[0-9.+\-*/^()]+$/.test(expr)) {
    return { steps: [], error: 'Η παράσταση περιέχει μη έγκυρους χαρακτήρες.', result: null };
  }

  // Έλεγχος ισορροπίας παρενθέσεων
  let balance = 0;
  for (const char of expr) {
    if (char === '(') balance++;
    if (char === ')') balance--;
    if (balance < 0) return { steps: [], error: 'Μη ισορροπημένες παρενθέσεις.', result: null };
  }
  if (balance !== 0) {
    return { steps: [], error: 'Μη ισορροπημένες παρενθέσεις (λείπει κλείσιμο).', result: null };
  }

  const steps = [];
  const maxIterations = 25;
  let iterations = 0;

  // Βοηθητική για εκτέλεση μίας πράξης χωρίς παρενθέσεις
  const resolveSimple = (sub) => {
    // 1. Δυνάμεις: ^
    const powRegex = /(-?\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/;
    let match = sub.match(powRegex);
    if (match) {
      const base = parseFloat(match[1]);
      const exp = parseFloat(match[2]);
      const val = Math.pow(base, exp);
      return {
        replaced: sub.replace(match[0], val.toString()),
        desc: `Υπολογισμός δύναμης: ${formatNum(base)}^${formatNum(exp)} ＝ ${formatNum(val)}`,
      };
    }

    // 2. Πολλαπλασιασμός και Διαίρεση: * ή /
    const mulDivRegex = /(-?\d+(?:\.\d+)?)\s*([*/])\s*(-?\d+(?:\.\d+)?)/;
    match = sub.match(mulDivRegex);
    if (match) {
      const a = parseFloat(match[1]);
      const op = match[2];
      const b = parseFloat(match[3]);
      if (op === '/' && b === 0) throw new Error('Διαίρεση με το μηδέν (αδύνατη πράξη)!');
      const val = op === '*' ? a * b : a / b;
      return {
        replaced: sub.replace(match[0], val >= 0 ? `+${val}` : `${val}`).replace(/^\++/, ''),
        desc:
          op === '*'
            ? `Πολλαπλασιασμός: (${formatNum(a)}) · (${formatNum(b)}) ＝ ${formatNum(val)}`
            : `Διαίρεση: (${formatNum(a)}) ： (${formatNum(b)}) ＝ ${formatNum(val)}`,
      };
    }

    // 3. Πρόσθεση και Αφαίρεση: + ή -
    const addSubRegex = /(-?\d+(?:\.\d+)?)\s*([+\-])\s*(\d+(?:\.\d+)?)/;
    match = sub.match(addSubRegex);
    if (match) {
      const a = parseFloat(match[1]);
      const op = match[2];
      const b = parseFloat(match[3]);
      const val = op === '+' ? a + b : a - b;
      return {
        replaced: sub.replace(match[0], val.toString()),
        desc:
          op === '+'
            ? `Πρόσθεση: (${formatNum(a)}) ＋ (${formatNum(b)}) ＝ ${formatNum(val)}`
            : `Αφαίρεση: (${formatNum(a)}) － (${formatNum(b)}) ＝ ${formatNum(val)}`,
      };
    }

    return null;
  };

  try {
    let current = expr;

    while (iterations < maxIterations) {
      iterations++;
      // Καθαρισμός διπλών προσήμων (π.χ. +- -> -, -- -> +)
      let cleaned = current
        .replace(/\+\+/g, '+')
        .replace(/--/g, '+')
        .replace(/\+-/g, '-')
        .replace(/-\+/g, '-')
        .replace(/\(\+/g, '(');

      if (cleaned !== current) {
        current = cleaned;
      }

      // Αν είναι ήδη ένας απλός αριθμός, ολοκληρώσαμε
      if (/^-?\d+(?:\.\d+)?$/.test(current)) {
        break;
      }

      // Έλεγχος για την πιο εσωτερική παρένθεση
      const innerParenRegex = /\(([^()]+)\)/;
      const parenMatch = current.match(innerParenRegex);

      if (parenMatch) {
        const innerContent = parenMatch[1];
        // Αν μέσα στην παρένθεση υπάρχει απλός αριθμός, αφαιρούμε την παρένθεση
        if (/^-?\d+(?:\.\d+)?$/.test(innerContent)) {
          const simplified = current.replace(parenMatch[0], innerContent);
          current = simplified;
          continue;
        }

        const stepRes = resolveSimple(innerContent);
        if (stepRes) {
          const nextExpr = current.replace(parenMatch[0], `(${stepRes.replaced})`);
          steps.push({
            expression: nextExpr
              .replace(/\*/g, ' · ')
              .replace(/\//g, ' ： ')
              .replace(/\./g, ','),
            description: `Μέσα στην παρένθεση: ${stepRes.desc}`,
          });
          current = nextExpr;
          continue;
        }
      } else {
        // Χωρίς παρενθέσεις
        const stepRes = resolveSimple(current);
        if (stepRes) {
          const nextExpr = stepRes.replaced;
          steps.push({
            expression: nextExpr
              .replace(/\*/g, ' · ')
              .replace(/\//g, ' ： ')
              .replace(/\./g, ','),
            description: stepRes.desc,
          });
          current = nextExpr;
          continue;
        }
      }

      break;
    }

    const finalVal = parseFloat(current);
    if (isNaN(finalVal)) {
      return { steps: [], error: 'Δεν ήταν δυνατή η πλήρης ανάλυση της παράστασης.', result: null };
    }

    return {
      steps,
      error: null,
      result: formatNum(finalVal),
    };
  } catch (err) {
    return { steps: [], error: err.message || 'Σφάλμα κατά τον υπολογισμό.', result: null };
  }
}

export default function ProteraiotitaPrakseonTheoria() {
  // State για το Διαδραστικό Εργαστήριο
  const [expressionInput, setExpressionInput] = useState('3 + 2 * (5 - 2^3)');

  const presets = [
    { label: 'ΠΑΡΑΔΕΙΓΜΑ 1 (ΔΥΝΑΜΗ & ΠΑΡΕΝΘΕΣΗ)', expr: '4 * (3 + 2^2) - 10' },
    { label: 'ΠΑΡΑΔΕΙΓΜΑ 2 (ΑΡΝΗΤΙΚΟΙ & ΔΙΑΙΡΕΣΗ)', expr: '18 : (2 - 5) + 3 * 4' },
    { label: 'ΠΑΡΑΔΕΙΓΜΑ 3 (ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΙ & ΑΦΑΙΡΕΣΗ)', expr: '20 - 3 * 4 + 8 : 2' },
    { label: 'ΠΑΡΑΔΕΙΓΜΑ 4 (ΔΕΚΑΔΙΚΟΙ)', expr: '2,5 * 4 - (1,2 + 0,8)^2' },
  ];

  const analysis = useMemo(() => solveStepByStep(expressionInput), [expressionInput]);

  return (
    <Layout
      title="Προτεραιότητα Πράξεων στους Ρητούς | Α' Γυμνασίου"
      description="Η ιεραρχία και η προτεραιότητα πράξεων με ρητούς αριθμούς (παρενθέσεις, δυνάμεις, πολλαπλασιασμοί, διαιρέσεις, προσθέσεις, αφαιρέσεις) και διαδραστικός αναλυτής βήμα-βήμα."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/21-proteraiotita-prakseon-riton-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 19 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Προτεραιότητα Πράξεων στους Ρητούς Αριθμούς
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Όταν σε μια αριθμητική παράσταση συναντάμε διαφορετικές πράξεις, ακολουθούμε απαρέγκλιτα μια αυστηρή ιεραρχία. Ανακάλυψε τους κανόνες και πειραματίσου με τον έξυπνο διαδραστικό αναλυτή παραστάσεων!
            </p>
          </div>
        </section>

        {/* 1. Η ΙΕΡΑΡΧΙΑ ΤΩΝ ΠΡΑΞΕΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Οι 4 Χρυσοί Κανόνες Προτεραιότητας
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* 1ο Επίπεδο: Παρενθέσεις */}
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-indigo-200 space-y-3 flex flex-col justify-between shadow-sm">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                  1Ο ΒΗΜΑ (ΚΟΡΥΦΗ)
                </span>
                <h3 className="font-bold text-slate-900 text-base">Παρενθέσεις ( ), [ ], {'{ }'}</h3>
                <p className="text-slate-600">
                  Εκτελούνται <strong>πρώτα</strong> οι πράξεις μέσα στις παρενθέσεις, ξεκινώντας από τις πιο <strong>εσωτερικές προς τις εξωτερικές</strong>:
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs">
                  ( ... ) ➔ [ ... ] ➔ {'{ ... }'}
                </div>
              </div>
              <div className="text-[11px] text-slate-500 italic">
                Οι παρενθέσεις υπερισχύουν όλων των υπόλοιπων πράξεων.
              </div>
            </div>

            {/* 2ο Επίπεδο: Δυνάμεις */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded inline-block">
                  2Ο ΒΗΜΑ
                </span>
                <h3 className="font-bold text-slate-900 text-base">Δυνάμεις (αᵛ)</h3>
                <p className="text-slate-600">
                  Υπολογίζονται αμέσως μετά όλες οι <strong>δυνάμεις</strong>:
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs">
                  α<sup>v</sup> ＝ α · α · ... · α
                </div>
              </div>
              <div className="text-[11px] text-rose-700 font-semibold">
                Προσοχή στα πρόσημα: (－3)<sup>2</sup> ＝ 9, αλλά －3<sup>2</sup> ＝ －9.
              </div>
            </div>

            {/* 3ο Επίπεδο: Πολλαπλασιασμοί & Διαιρέσεις */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded inline-block">
                  3Ο ΒΗΜΑ
                </span>
                <h3 className="font-bold text-slate-900 text-base">Πολλαπλασιασμοί (·) & Διαιρέσεις (：)</h3>
                <p className="text-slate-600">
                  Εκτελούνται οι πολλαπλασιασμοί και οι διαιρέσεις <strong>με τη σειρά που εμφανίζονται από αριστερά προς τα δεξιά</strong>.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs">
                  α · β &nbsp; και &nbsp; α ： β
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                Καμία από τις δύο δεν έχει προτεραιότητα έναντι της άλλης.
              </div>
            </div>

            {/* 4ο Επίπεδο: Προσθέσεις & Αφαιρέσεις */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded inline-block">
                  4Ο ΒΗΜΑ (ΤΕΛΟΣ)
                </span>
                <h3 className="font-bold text-slate-900 text-base">Προσθέσεις (＋) & Αφαιρέσεις (－)</h3>
                <p className="text-slate-600">
                  Τελευταίες εκτελούνται οι προσθέσεις και οι αφαιρέσεις, επίσης <strong>από αριστερά προς τα δεξιά</strong>.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs">
                  α ＋ β &nbsp; και &nbsp; α － β
                </div>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                Ολοκληρώνουν την τελική τιμή της παράστασης.
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΣΥΝΗΘΗ ΛΑΘΗ & ΠΑΡΑΔΕΙΓΜΑΤΑ ΑΝΑΛΥΣΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Συνηθισμένα Λάθη & Παραδείγματα Εφαρμογής
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Παράδειγμα 1 */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
              <div className="font-bold text-slate-900 text-base">
                Παράδειγμα: 5 ＋ 3 · 4
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-2 font-mono">
                <div className="text-rose-600">
                  ❌ <strong>ΛΑΘΟΣ:</strong> (5 ＋ 3) · 4 ＝ 8 · 4 ＝ 32 (προσθέσαμε πρώτα!)
                </div>
                <div className="text-emerald-700 font-bold">
                  ✅ <strong>ΣΩΣΤΟ:</strong> 5 ＋ (3 · 4) ＝ 5 ＋ 12 ＝ 17 (προηγείται ο πολλαπλασιασμός)
                </div>
              </div>
            </div>

            {/* Παράδειγμα 2 */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
              <div className="font-bold text-slate-900 text-base">
                Παράδειγμα: 12 ： 3 · 2
              </div>
              <div className="p-3 bg-white rounded-xl border border-sky-100 space-y-2 font-mono">
                <div className="text-rose-600">
                  ❌ <strong>ΛΑΘΟΣ:</strong> 12 ： (3 · 2) ＝ 12 ： 6 ＝ 2 (δώσαμε προτεραιότητα στον πολλαπλασιασμό!)
                </div>
                <div className="text-emerald-700 font-bold">
                  ✅ <strong>ΣΩΣΤΟ:</strong> (12 ： 3) · 2 ＝ 4 · 2 ＝ 8 (ίδια προτεραιότητα ➔ από αριστερά προς τα δεξιά)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: ΑΝΑΛΥΤΗΣ ΠΑΡΑΣΤΑΣΕΩΝ ΒΗΜΑ-ΒΗΜΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Διαδραστικό Εργαστήριο: Ανάλυση Οποιασδήποτε Παράστασης Βήμα-Βήμα
            </h2>
          </div>

          <div className="space-y-6">
            {/* Input Περιοχή & Presets */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΜΙΑ ΑΡΙΘΜΗΤΙΚΗ ΠΑΡΑΣΤΑΣΗ:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={expressionInput}
                    onChange={(e) => setExpressionInput(e.target.value)}
                    placeholder="π.χ. 3 + 2 * (5 - 2^3) ή 18 : (2 - 5) + 3 * 4"
                    className="w-full h-13 px-4 sm:px-5 rounded-2xl bg-white border-2 border-indigo-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-slate-900 font-mono text-base sm:text-xl font-bold outline-none transition-all shadow-inner"
                  />
                  {expressionInput && (
                    <button
                      type="button"
                      onClick={() => setExpressionInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition"
                    >
                      ΚΑΘΑΡΙΣΜΟΣ
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Σύμβολα που υποστηρίζονται: αριθμοί, κόμμα <strong>,</strong> ή <strong>.</strong>, παρενθέσεις <strong>( )</strong>, δύναμη <strong>^</strong>, πολλαπλασιασμός <strong>*</strong> ή <strong>·</strong>, διαίρεση <strong>:</strong> ή <strong>/</strong>, πρόσθεση <strong>+</strong>, αφαίρεση <strong>-</strong>.
                </p>
              </div>

              {/* Έτοιμα Παραδείγματα (Presets) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ΕΠΙΛΕΞΤΕ ΕΤΟΙΜΟ ΠΑΡΑΔΕΙΓΜΑ:
                </span>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setExpressionInput(p.expr)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-300 text-slate-800 transition active:scale-95 shadow-sm"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Πίνακας Ανάλυσης Βήμα-Βήμα */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-6 shadow-md">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  ΡΟΗ ΕΚΤΕΛΕΣΗΣ & ΙΣΟΤΗΤΕΣ
                </span>
                {analysis.result !== null && (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ: {analysis.result}
                  </span>
                )}
              </div>

              {analysis.error ? (
                <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-300 text-sm font-sans flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{analysis.error}</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Αρχική Παράσταση */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-slate-400 font-sans">Αρχική Παράσταση:</span>
                    <span className="text-lg sm:text-2xl font-black font-mono text-amber-300">
                      {expressionInput}
                    </span>
                  </div>

                  {/* Ακολουθία Βημάτων */}
                  {analysis.steps.length > 0 ? (
                    <div className="space-y-3">
                      {analysis.steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1.5 transition hover:bg-white/15"
                        >
                          <div className="flex items-center justify-between text-xs text-indigo-300 font-sans font-bold">
                            <span>ΒΗΜΑ {sIdx + 1}</span>
                            <span className="text-slate-300 font-normal">{step.description}</span>
                          </div>
                          <div className="text-base sm:text-xl font-bold font-mono text-white flex items-center gap-2">
                            <span className="text-amber-400">＝</span>
                            <span>{step.expression}</span>
                          </div>
                        </div>
                      ))}

                      {/* Τελικό Κουτί Αποτελέσματος */}
                      <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-2 text-emerald-300">
                        <span className="text-xs sm:text-sm font-bold font-sans">
                          ΟΛΟΚΛΗΡΩΣΗ ΥΠΟΛΟΓΙΣΜΟΥ:
                        </span>
                        <span className="text-2xl sm:text-4xl font-black font-mono text-emerald-400">
                          ＝ {analysis.result}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl text-center text-xs text-slate-400 font-sans">
                      Πληκτρολόγησε μια παράσταση με πράξεις παραπάνω για να δεις την ανάλυση βήμα-βήμα.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
