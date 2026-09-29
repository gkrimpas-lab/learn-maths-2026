// pages/st-dimotikou/10-proteraiotita-prakseon.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PRESETS = {
  EX1: { title: '10 － 2 · 4', expr: '10-2*4' },
  EX2: { title: '5 ＋ 3 · (4 ＋ 2)', expr: '5+3*(4+2)' },
  EX3: { title: '12 : 3 · 2 ＋ 4', expr: '12/3*2+4' },
  EX4: { title: '50 － (3 · 12) ＋ 8', expr: '50-(3*12)+8' }
};

export default function ProteraiotitaPrakseonPage() {
  const [customExpr, setCustomExpr] = useState('15+3-(6-2)*3');

  const handleInputChange = (val) => {
    // Αφαίρεση κενών και επιτρεπόμενα μόνο νούμερα, πράξεις, παρενθέσεις και κόμμα/τελεία
    const clean = val.replace(/\s+/g, '').replace(/[^0-9+\-*/().,]/g, '');
    setCustomExpr(clean);
  };

  // Μετατροπή των tokens σε καθαρό κείμενο με σωστή διαχείριση παρενθέσεων και ελληνικών συμβόλων
  const tokensToString = (tokens) => {
    return tokens.map((t, idx) => {
      if (t.type === 'OPERATOR') {
        if (t.value === '*') return '·';
        if (t.value === '/') return ':';
        if (t.value === '+') return '＋';
        if (t.value === '-') return '－';
        return t.value;
      }
      if (t.type === 'NUMBER' && t.value < 0) {
        const hasOpen = idx > 0 && tokens[idx - 1].type === 'PAREN' && tokens[idx - 1].value === '(';
        const hasClose = idx < tokens.length - 1 && tokens[idx + 1].type === 'PAREN' && tokens[idx + 1].value === ')';
        if (hasOpen && hasClose) {
          return t.value.toString().replace('.', ',');
        }
        return `(${t.value.toString().replace('.', ',')})`;
      }
      return t.value.toString().replace('.', ',');
    }).join(' ');
  };

  const generateSteps = (exprStr) => {
    const steps = [];
    let currentStr = exprStr.replace(/\s+/g, '').replace(/,/g, '.').trim();
    if (!currentStr) return { steps: [], final: '0', isValid: false };

    const tokenize = (str) => {
      const res = [];
      let i = 0;
      while (i < str.length) {
        const ch = str[i];
        
        if (ch === '(' || ch === ')') {
          res.push({ type: 'PAREN', value: ch });
          i++;
          continue;
        }
        
        if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
          if (ch === '-') {
            const prev = res[res.length - 1];
            if (!prev || (prev.type === 'OPERATOR') || (prev.type === 'PAREN' && prev.value === '(')) {
              let numStr = '-';
              i++;
              while (i < str.length && /[0-9.]/.test(str[i])) {
                numStr += str[i];
                i++;
              }
              if (numStr === '-') return null; // μη έγκυρο
              res.push({ type: 'NUMBER', value: parseFloat(numStr) });
              continue;
            }
          }
          res.push({ type: 'OPERATOR', value: ch });
          i++;
          continue;
        }
        
        if (/[0-9.]/.test(ch)) {
          let numStr = '';
          while (i < str.length && /[0-9.]/.test(str[i])) {
            numStr += str[i];
            i++;
          }
          res.push({ type: 'NUMBER', value: parseFloat(numStr) });
          continue;
        }
        i++;
      }
      return res;
    };

    let tokens = tokenize(currentStr);
    if (!tokens || tokens.length === 0) return { steps: [], final: '0', isValid: false };

    // Έλεγχος συντακτικής εγκυρότητας (Parentheses matching & token structure)
    let openCount = 0;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'PAREN') {
        if (tokens[i].value === '(') openCount++;
        if (tokens[i].value === ')') openCount--;
        if (openCount < 0) return { steps: [], final: '0', isValid: false };
      }
      // Έλεγχος για διαδοχικούς αριθμούς χωρίς τελεστή
      if (i > 0 && tokens[i].type === 'NUMBER' && tokens[i - 1].type === 'NUMBER') {
        return { steps: [], final: '0', isValid: false };
      }
    }
    if (openCount !== 0) return { steps: [], final: '0', isValid: false };

    // Έλεγχος αν τελειώνει ή ξεκινά με απαγορευμένο τελεστή
    const firstToken = tokens[0];
    const lastToken = tokens[tokens.length - 1];
    if (firstToken.type === 'OPERATOR' && firstToken.value !== '-') return { steps: [], final: '0', isValid: false };
    if (lastToken.type === 'OPERATOR') return { steps: [], final: '0', isValid: false };

    let safetyCounter = 0;

    while (safetyCounter < 20 && tokens.length > 1) {
      safetyCounter++;
      let targetIdx = -1;
      let reasonType = '';
      let reasonText = '';

      let openParenIdx = -1;
      let closeParenIdx = -1;
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === 'PAREN' && tokens[i].value === '(') openParenIdx = i;
        if (tokens[i].type === 'PAREN' && tokens[i].value === ')') {
          closeParenIdx = i;
          break;
        }
      }

      if (openParenIdx !== -1 && closeParenIdx !== -1) {
        if (closeParenIdx === openParenIdx + 2) {
          tokens.splice(closeParenIdx, 1);
          tokens.splice(openParenIdx, 1);
          continue;
        }

        let subTokens = tokens.slice(openParenIdx + 1, closeParenIdx);
        let subTarget = -1;

        for (let j = 0; j < subTokens.length; j++) {
          if (subTokens[j].type === 'OPERATOR' && (subTokens[j].value === '*' || subTokens[j].value === '/')) {
            subTarget = j;
            break;
          }
        }
        if (subTarget === -1) {
          for (let j = 0; j < subTokens.length; j++) {
            if (subTokens[j].type === 'OPERATOR' && (subTokens[j].value === '+' || subTokens[j].value === '-')) {
              subTarget = j;
              break;
            }
          }
        }

        if (subTarget !== -1) {
          targetIdx = openParenIdx + 1 + subTarget;
          reasonType = 'ΠΑΡΕΝΘΕΣΕΙΣ ( )';
          reasonText = 'Λύνουμε κατά προτεραιότητα την πράξη μέσα στην παρένθεση.';
        }
      }

      if (targetIdx === -1) {
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].type === 'OPERATOR' && (tokens[i].value === '*' || tokens[i].value === '/')) {
            targetIdx = i;
            reasonType = 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΙ / ΔΙΑΙΡΕΣΕΙΣ';
            reasonText = tokens[i].value === '*' ? 'Ο πολλαπλασιασμός προηγείται.' : 'Η διαίρεση προηγείται.';
            break;
          }
        }
      }

      if (targetIdx === -1) {
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].type === 'OPERATOR' && (tokens[i].value === '+' || tokens[i].value === '-')) {
            targetIdx = i;
            reasonType = 'ΠΡΟΣΘΕΣΕΙΣ / ΑΦΑΙΡΕΣΕΙΣ';
            reasonText = 'Κάνουμε τις προσθέσεις και τις αφαιρέσεις από αριστερά προς τα δεξιά.';
            break;
          }
        }
      }

      if (targetIdx !== -1 && targetIdx > 0 && targetIdx < tokens.length - 1) {
        const num1Token = tokens[targetIdx - 1];
        const opToken = tokens[targetIdx];
        const num2Token = tokens[targetIdx + 1];

        if (num1Token.type !== 'NUMBER' || num2Token.type !== 'NUMBER') {
          return { steps: [], final: '0', isValid: false };
        }

        const num1 = num1Token.value;
        const op = opToken.value;
        const num2 = num2Token.value;
        
        let res = 0;
        if (op === '+') res = num1 + num2;
        else if (op === '-') res = num1 - num2;
        else if (op === '*') res = num1 * num2;
        else if (op === '/') res = num2 !== 0 ? num1 / num2 : 0;

        const formattedRes = parseFloat(res.toFixed(2));
        const opChar = op === '*' ? '·' : (op === '/' ? ':' : (op === '+' ? '＋' : '－'));

        const formatCalcNum = (val) => {
          const str = val.toString().replace('.', ',');
          return val < 0 ? `(${str})` : str;
        };

        steps.push({
          level: `ΒΗΜΑ ${steps.length + 1}: ${reasonType}`,
          text: reasonText,
          calculation: `${formatCalcNum(num1)} ${opChar} ${formatCalcNum(num2)} ＝ ${formatCalcNum(formattedRes)}`,
          currentForm: ''
        });

        tokens.splice(targetIdx - 1, 3, { type: 'NUMBER', value: formattedRes });
        steps[steps.length - 1].currentForm = tokensToString(tokens);
      } else {
        break;
      }
    }

    if (tokens.length === 3 && tokens[0].value === '(' && tokens[2].value === ')') {
      tokens = [tokens[1]];
    }

    const isValidResult = tokens.length === 1 && tokens[0].type === 'NUMBER';

    return {
      steps: steps,
      final: isValidResult ? tokens[0].value.toString().replace('.', ',') : '0',
      isValid: isValidResult
    };
  };

  const analysis = generateSteps(customExpr);

  return (
    <Layout
      title="Προτεραιότητα Πράξεων και Αριθμητικές Παραστάσεις - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε τη σειρά των πράξεων (παρενθέσεις, πολλαπλασιασμοί/διαιρέσεις, προσθέσεις/αφαιρέσεις) και δες live βήμα-βήμα την επίλυση κάθε παράστασης!"
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/10-proteraiotita-prakseon-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 10 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Προτεραιότητα Πράξεων &amp; Αριθμητικές Παραστάσεις
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε τη χρυσή σειρά των μαθηματικών: <strong>Παρενθέσεις</strong>, μετά <strong>Πολλαπλασιασμοί και Διαιρέσεις</strong>, και τέλος <strong>Προσθέσεις &amp; Αφαιρέσεις</strong> από αριστερά προς τα δεξιά!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Κανόνες Προτεραιότητας, Βήμα-Βήμα Επίλυση &amp; Ζωντανός Επιλυτής</span>
            </div>
            <Link
              href="/st-dimotikou/10-proteraiotita-prakseon-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Η Σειρά των Πράξεων σε 3 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Ο απόλυτος κανόνας για να μην κάνεις ποτέ λάθος σε αριθμητική παράσταση.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Προηγούνται Πάντα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  1ο Βήμα: Παρενθέσεις ( )
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Εκτελούμε <strong>πρώτα</strong> όλες τις πράξεις μέσα στις παρενθέσεις. Αν υπάρχουν εσωτερικές παρενθέσεις, ξεκινάμε από τις πιο εσωτερικές.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>5 ＋ 3 · <strong className="text-blue-700">(4 ＋ 2)</strong> ＝ 5 ＋ 3 · <strong className="text-blue-700">6</strong></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Οι παρενθέσεις αλλάζουν τη φυσική ροή και παίρνουν πάντα την απόλυτη προτεραιότητα.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ισχυρές Πράξεις</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  2ο Βήμα: · και :
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στη συνέχεια κάνουμε τους <strong>πολλαπλασιασμούς</strong> και τις <strong>διαιρέσεις</strong> με τη σειρά που εμφανίζονται από αριστερά προς τα δεξιά.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>10 － <strong className="text-indigo-700">2 · 4</strong> ＝ 10 － <strong className="text-indigo-700">8</strong> ＝ 2</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Αν συναντήσουμε πολλαπλασιασμό και διαίρεση μαζί, κάνουμε πρώτα όποια πράξη βρίσκεται πιο αριστερά.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Τελικές Πράξεις</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  3ο Βήμα: ＋ και －
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Τέλος, κάνουμε τις <strong>προσθέσεις</strong> και τις <strong>αφαιρέσεις</strong> διαδοχικά, εκτελώντας τις από αριστερά προς τα δεξιά.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>12 － 3 ＋ 2 ＝ 9 ＋ 2 ＝ 11</p>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                🎯 Ποτέ δεν κάνουμε πρόσθεση πριν από πολλαπλασιασμό, εκτός αν η πρόσθεση βρίσκεται σε παρένθεση!
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΒΗΜΑ-ΒΗΜΑ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικός Επιλυτής Αριθμητικών Παραστάσεων
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Γράψε μια παράσταση ή διάλεξε παράδειγμα για να δεις όλα τα βήματα επίλυσης με μαθηματική αιτιολογία!
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID - 100% FLUID ΧΩΡΙΣ SCROLL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUT & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    Γράψε τη δική σου παράσταση:
                  </span>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Χωρίς κενά, μόνο αριθμοί και σύμβολα: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-blue-600 border border-slate-200">+ - * / ( )</code>
                  </p>
                </div>

                <input
                  type="text"
                  value={customExpr}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full text-base sm:text-lg font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-wide"
                  placeholder="π.χ. 2+3*4"
                />
                
                <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-1.5 leading-snug">
                  <span>💻</span>
                  <span><strong>Πληκτρολόγιο:</strong> Χρησιμοποίησε <strong>*</strong> για πολλαπλασιασμό (·) και <strong>/</strong> για διαίρεση (:).</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    Ή επίλεξε έτοιμο παράδειγμα:
                  </span>
                  <div className="flex flex-col gap-2">
                    {Object.keys(PRESETS).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCustomExpr(PRESETS[key].expr)}
                        className={`w-full text-left px-3.5 sm:px-4 py-2.5 rounded-xl border font-mono font-bold text-xs md:text-sm transition-all touch-manipulation active:scale-95 ${
                          customExpr === PRESETS[key].expr
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {PRESETS[key].title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: LIVE STEP-BY-STEP ANALYSIS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[420px] sm:min-h-[460px]">
              
              <div className="w-full text-center mb-6">
                <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                  Ζωντανή Ανάλυση Βημάτων:
                </span>
                <div className="text-lg sm:text-xl md:text-2xl font-mono font-black text-blue-600 mt-2 bg-blue-50 inline-block px-4 sm:px-6 py-2 rounded-2xl border border-blue-100 shadow-xs max-w-full break-words">
                  {customExpr.replace(/\*/g, ' · ').replace(/\//g, ' : ').replace(/\+/g, ' ＋ ').replace(/-/g, ' － ') || '—'}
                </div>
              </div>

              <div className="w-full max-w-lg mx-auto flex flex-col gap-4 my-auto relative">
                {analysis.isValid && analysis.steps.length > 0 ? (
                  analysis.steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center w-full space-y-2">
                      
                      <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl border-2 border-slate-700 w-full shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center font-mono gap-3 sm:gap-4">
                        <div className="space-y-0.5 text-left flex-1">
                          <div className="text-[10px] sm:text-xs font-sans font-black uppercase text-amber-400 tracking-wider">
                            {step.level}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-300 font-sans leading-snug">
                            {step.text}
                          </div>
                        </div>
                        
                        <div className="text-right flex-shrink-0 self-end sm:self-center">
                          <div className="text-emerald-400 font-black text-xs sm:text-sm md:text-base bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800 font-mono">
                            {step.calculation}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center text-slate-400">
                        <span className="text-xs font-black">↓</span>
                        <span className="text-xs font-mono font-bold tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200 text-center max-w-full break-words">
                          Επόμενη μορφή: {step.currentForm || '🏁'}
                        </span>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs sm:text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 p-4">
                    {customExpr
                      ? '⚠️ Μη έγκυρη παράσταση. Βεβαιώσου ότι δεν υπάρχουν κενά και ότι οι πράξεις και οι παρενθέσεις είναι σωστές.'
                      : 'Γράψε μια έγκυρη παράσταση στα αριστερά για να εμφανιστούν τα βήματα.'}
                  </div>
                )}

                {/* FINAL RESULT BADGE */}
                {analysis.isValid && (
                  <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3.5 sm:p-4 rounded-2xl text-center shadow-lg font-mono font-black flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-2">
                    <span className="text-xl">🏁</span>
                    <span className="text-xs md:text-sm font-sans uppercase tracking-wider">Τελική Τιμή Παράστασης:</span>
                    <span className="text-xl sm:text-2xl bg-white/20 px-3 sm:px-4 py-1 rounded-xl shadow-inner">
                      {analysis.final}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full flex justify-center text-[11px] sm:text-xs font-bold text-slate-400 pt-4 border-t border-slate-100 mt-6 text-center">
                <span>🔍 Αν δύο πράξεις έχουν την ίδια προτεραιότητα, γίνονται πάντα από αριστερά προς τα δεξιά!</span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στην Προτεραιότητα Πράξεων!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατανόησες τη σειρά προτεραιότητας των πράξεων; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/10-proteraiotita-prakseon-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
