import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Προκαθορισμένα υποδειγματικά παραδείγματα Α' Γυμνασίου
const PRESETS = {
  EX1: { title: "5 ＋ 3 · (－2)²", expr: "5+3*(-2)^2" },
  EX2: { title: "2 · [ 15 － (4 ＋ 3 · 2) ]", expr: "2*[15-(4+3*2)]" },
  EX3: { title: "24 ： 6 · 2 － (－3)³", expr: "24/6*2-(-3)^3" },
  EX4: { title: "(－4)² － 2 · [ 3 ＋ (－5) ]", expr: "(-4)^2-2*[3+(-5)]" },
};

export default function ProteraiotitaPrakseonTheoria() {
  const [customExpr, setCustomExpr] = useState("5+3*(-2)^2-4*3");

  const handleInputChange = (val) => {
    // Επιτρεπόμενα: αριθμοί, +, -, *, /, ^, (, ), [, ], κόμμα/τελεία
    const clean = val.replace(/\s+/g, '').replace(/[^0-9+\-*/^()[\].,]/g, '');
    setCustomExpr(clean);
  };

  const handleInsertSymbol = (sym) => {
    setCustomExpr((prev) => prev + sym);
  };

  const handleDelete = () => {
    setCustomExpr((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setCustomExpr('');
  };

  // Μετατροπή tokens σε όμορφη μαθηματική γραφή
  const tokensToString = (tokens) => {
    return tokens
      .map((t, idx) => {
        if (t.type === 'OPERATOR') {
          if (t.value === '*') return ' · ';
          if (t.value === '/') return ' ： ';
          if (t.value === '^') return '^';
          if (t.value === '+') return ' ＋ ';
          if (t.value === '-') return ' － ';
          return ` ${t.value} `;
        }
        if (t.type === 'PAREN') {
          return t.value;
        }
        if (t.type === 'NUMBER' && t.value < 0) {
          const hasOpen =
            idx > 0 &&
            tokens[idx - 1].type === 'PAREN' &&
            (tokens[idx - 1].value === '(' || tokens[idx - 1].value === '[');
          const hasClose =
            idx < tokens.length - 1 &&
            tokens[idx + 1].type === 'PAREN' &&
            (tokens[idx + 1].value === ')' || tokens[idx + 1].value === ']');
          if (hasOpen && hasClose) {
            return t.value.toString().replace('.', ',');
          }
          return `(${t.value.toString().replace('.', ',')})`;
        }
        return t.value.toString().replace('.', ',');
      })
      .join('');
  };

  // Μηχανή παραγωγής βημάτων με πλήρη προτεραιότητα (Παρενθέσεις -> Δυνάμεις -> Πολλαπλασιασμοί/Διαιρέσεις -> Προσθέσεις/Αφαιρέσεις)
  const generateSteps = (exprStr) => {
    const steps = [];
    let currentStr = exprStr
      .replace(/\s+/g, '')
      .replace(/,/g, '.')
      .replace(/\[/g, '(')
      .replace(/\]/g, ')')
      .trim();

    if (!currentStr) return { steps: [], final: "0", isValid: false };

    // Tokenizer
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

        if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^') {
          if (ch === '-') {
            const prev = res[res.length - 1];
            // Μοναδιαίο μείον (π.χ. στην αρχή ή μετά από τελεστή/παρένθεση)
            if (!prev || prev.type === 'OPERATOR' || (prev.type === 'PAREN' && prev.value === '(')) {
              let numStr = '-';
              i++;
              while (i < str.length && /[0-9.]/.test(str[i])) {
                numStr += str[i];
                i++;
              }
              if (numStr === '-') return null;
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
    if (!tokens || tokens.length === 0) return { steps: [], final: "0", isValid: false };

    // Έλεγχος ισοζυγίου παρενθέσεων
    let openCount = 0;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'PAREN') {
        if (tokens[i].value === '(') openCount++;
        if (tokens[i].value === ')') openCount--;
        if (openCount < 0) return { steps: [], final: "0", isValid: false };
      }
      if (i > 0 && tokens[i].type === 'NUMBER' && tokens[i - 1].type === 'NUMBER') {
        return { steps: [], final: "0", isValid: false };
      }
    }
    if (openCount !== 0) return { steps: [], final: "0", isValid: false };

    const firstToken = tokens[0];
    const lastToken = tokens[tokens.length - 1];
    if (firstToken.type === 'OPERATOR') return { steps: [], final: "0", isValid: false };
    if (lastToken.type === 'OPERATOR') return { steps: [], final: "0", isValid: false };

    let safetyCounter = 0;

    // Loop επίλυσης βήμα-βήμα
    while (safetyCounter < 30 && tokens.length > 1) {
      safetyCounter++;
      let targetIdx = -1;
      let reasonType = '';
      let reasonText = '';

      // Εντοπισμός της πιο εσωτερικής παρένθεσης
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
        // Περίπτωση (αριθμός) -> αφαίρεση περιττών παρενθέσεων
        if (closeParenIdx === openParenIdx + 2 && tokens[openParenIdx + 1].type === 'NUMBER') {
          // Αν δεν είναι αρνητικός που ακολουθείται από δύναμη
          tokens.splice(closeParenIdx, 1);
          tokens.splice(openParenIdx, 1);
          continue;
        }

        let subTokens = tokens.slice(openParenIdx + 1, closeParenIdx);
        let subTarget = -1;

        // 1. Δυνάμεις μέσα στην παρένθεση
        for (let j = 0; j < subTokens.length; j++) {
          if (subTokens[j].type === 'OPERATOR' && subTokens[j].value === '^') {
            subTarget = j;
            reasonType = 'ΠΑΡΕΝΘΕΣΗ & ΔΥΝΑΜΗ';
            reasonText = 'Μέσα στην παρένθεση υπολογίζουμε πρώτα τη δύναμη.';
            break;
          }
        }

        // 2. Πολλαπλασιασμοί / Διαιρέσεις μέσα στην παρένθεση
        if (subTarget === -1) {
          for (let j = 0; j < subTokens.length; j++) {
            if (subTokens[j].type === 'OPERATOR' && (subTokens[j].value === '*' || subTokens[j].value === '/')) {
              subTarget = j;
              reasonType = 'ΠΑΡΕΝΘΕΣΗ & ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ / ΔΙΑΙΡΕΣΗ';
              reasonText = subTokens[j].value === '*' ? 'Μέσα στην παρένθεση προηγείται ο πολλαπλασιασμός.' : 'Μέσα στην παρένθεση προηγείται η διαίρεση.';
              break;
            }
          }
        }

        // 3. Προσθέσεις / Αφαιρέσεις μέσα στην παρένθεση
        if (subTarget === -1) {
          for (let j = 0; j < subTokens.length; j++) {
            if (subTokens[j].type === 'OPERATOR' && (subTokens[j].value === '+' || subTokens[j].value === '-')) {
              subTarget = j;
              reasonType = 'ΠΑΡΕΝΘΕΣΗ & ΠΡΟΣΘΕΣΗ / ΑΦΑΙΡΕΣΗ';
              reasonText = 'Μέσα στην παρένθεση εκτελούμε προσθέσεις και αφαιρέσεις από αριστερά προς τα δεξιά.';
              break;
            }
          }
        }

        if (subTarget !== -1) {
          targetIdx = openParenIdx + 1 + subTarget;
        }
      }

      // Αν δεν υπάρχει εκκρεμότητα σε παρένθεση:
      // 1. Δυνάμεις έξω από παρενθέσεις
      if (targetIdx === -1) {
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].type === 'OPERATOR' && tokens[i].value === '^') {
            targetIdx = i;
            reasonType = 'ΔΥΝΑΜΗ (α^ν)';
            reasonText = 'Υπολογίζουμε κατά προτεραιότητα τη δύναμη.';
            break;
          }
        }
      }

      // 2. Πολλαπλασιασμοί & Διαιρέσεις έξω από παρενθέσεις
      if (targetIdx === -1) {
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].type === 'OPERATOR' && (tokens[i].value === '*' || tokens[i].value === '/')) {
            targetIdx = i;
            reasonType = tokens[i].value === '*' ? 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ( · )' : 'ΔΙΑΙΡΕΣΗ ( ： )';
            reasonText = tokens[i].value === '*' ? 'Ο πολλαπλασιασμός προηγείται της πρόσθεσης και της αφαίρεσης.' : 'Η διαίρεση προηγείται της πρόσθεσης και της αφαίρεσης.';
            break;
          }
        }
      }

      // 3. Προσθέσεις & Αφαιρέσεις έξω από παρενθέσεις
      if (targetIdx === -1) {
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].type === 'OPERATOR' && (tokens[i].value === '+' || tokens[i].value === '-')) {
            targetIdx = i;
            reasonType = tokens[i].value === '+' ? 'ΠΡΟΣΘΕΣΗ ( ＋ )' : 'ΑΦΑΙΡΕΣΗ ( － )';
            reasonText = 'Εκτελούμε προσθέσεις και αφαιρέσεις από αριστερά προς τα δεξιά.';
            break;
          }
        }
      }

      // Εκτέλεση της εντοπισμένης πράξης
      if (targetIdx !== -1 && targetIdx > 0 && targetIdx < tokens.length - 1) {
        const num1Token = tokens[targetIdx - 1];
        const opToken = tokens[targetIdx];
        const num2Token = tokens[targetIdx + 1];

        if (num1Token.type !== 'NUMBER' || num2Token.type !== 'NUMBER') {
          return { steps: [], final: "0", isValid: false };
        }

        const num1 = num1Token.value;
        const op = opToken.value;
        const num2 = num2Token.value;

        let res = 0;
        if (op === '+') res = num1 + num2;
        else if (op === '-') res = num1 - num2;
        else if (op === '*') res = num1 * num2;
        else if (op === '/') res = num2 !== 0 ? num1 / num2 : 0;
        else if (op === '^') res = Math.pow(num1, num2);

        const formattedRes = parseFloat(res.toFixed(4));
        const opChar = op === '*' ? '·' : op === '/' ? '：' : op === '^' ? '^' : op === '+' ? '＋' : '－';

        const formatCalcNum = (val) => {
          const str = val.toString().replace('.', ',');
          return val < 0 ? `(${str})` : str;
        };

        steps.push({
          level: `ΒΗΜΑ ${steps.length + 1}: ${reasonType}`,
          text: reasonText,
          calculation: `${formatCalcNum(num1)} ${opChar} ${formatCalcNum(num2)} ＝ ${formatCalcNum(formattedRes)}`,
          currentForm: '',
        });

        // Αντικατάσταση των 3 tokens με το αποτέλεσμα
        tokens.splice(targetIdx - 1, 3, { type: 'NUMBER', value: formattedRes });

        // Έλεγχος αν απομένει μια παρένθεση γύρω από έναν μόνο αριθμό: (num)
        if (
          targetIdx - 2 >= 0 &&
          targetIdx < tokens.length &&
          tokens[targetIdx - 2].type === 'PAREN' &&
          tokens[targetIdx - 2].value === '(' &&
          tokens[targetIdx].type === 'PAREN' &&
          tokens[targetIdx].value === ')'
        ) {
          tokens.splice(targetIdx, 1);
          tokens.splice(targetIdx - 2, 1);
        }

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
      final: isValidResult ? tokens[0].value.toString().replace('.', ',') : "0",
      isValid: isValidResult,
    };
  };

  const analysis = generateSteps(customExpr);

  return (
    <Layout
      title="Προτεραιότητα των Πράξεων | Α' Γυμνασίου"
      description="Θεωρία, ιεραρχία πράξεων και διαδραστικό εργαστήριο βήμα-βήμα ανάλυσης αριθμητικών παραστάσεων με δυνάμεις και παρενθέσεις."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/10-proteraiotita-prakseon-ask"
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
              Προτεραιότητα των Πράξεων
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε τη σωστή ιεραρχία των πράξεων: παρενθέσεις και αγκύλες, δυνάμεις, πολλαπλασιασμοί και διαιρέσεις, και τέλος προσθέσεις και αφαιρέσεις από αριστερά προς τα δεξιά.
            </p>
          </div>
        </section>

        {/* 1. Η ΙΕΡΑΡΧΙΑ ΤΩΝ ΠΡΑΞΕΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Οι Κανόνες Προτεραιότητας
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-indigo-700 tracking-wider">ΒΗΜΑ 1</span>
                  <span className="text-lg">🧩</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Παρενθέσεις & Αγκύλες</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Εκτελούμε πρώτα τις πράξεις μέσα στις <strong>παρενθέσεις ( )</strong>, μετά στις <strong>αγκύλες [ ]</strong> και τέλος στα <strong>άγκιστρα {'{ }'}</strong> (από μέσα προς τα έξω).
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-indigo-100 font-mono text-[11px] text-center font-bold text-indigo-950">
                2 · [ 5 ＋ (4 － 1) ] ＝ 2 · [ 5 ＋ 3 ]
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-sky-700 tracking-wider">ΒΗΜΑ 2</span>
                  <span className="text-lg">⚡</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Δυνάμεις</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Υπολογίζουμε όλες τις <strong>δυνάμεις (α<sup>ν</sup>)</strong> πριν από οποιονδήποτε πολλαπλασιασμό ή διαίρεση.
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-sky-100 font-mono text-[11px] text-center font-bold text-sky-950">
                3 · (－2)<sup>2</sup> ＝ 3 · 4 ＝ 12
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-purple-700 tracking-wider">ΒΗΜΑ 3</span>
                  <span className="text-lg">✖️</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Πολλαπλασιασμοί & Διαιρέσεις</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Εκτελούνται με τη σειρά που εμφανίζονται, <strong>από αριστερά προς τα δεξιά</strong>.
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-purple-100 font-mono text-[11px] text-center font-bold text-purple-950">
                18 ： 3 · 2 ＝ 6 · 2 ＝ 12
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-emerald-700 tracking-wider">ΒΗΜΑ 4</span>
                  <span className="text-lg">➕</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Προσθέσεις & Αφαιρέσεις</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Εκτελούνται τελευταίες, επίσης με τη σειρά που εμφανίζονται <strong>από αριστερά προς τα δεξιά</strong>.
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-emerald-100 font-mono text-[11px] text-center font-bold text-emerald-950">
                10 － 4 ＋ 3 ＝ 6 ＋ 3 ＝ 9
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΛΗΚΤΡΟΛΟΓΗΣΗΣ & ΑΝΑΛΥΣΗΣ ΒΗΜΑ-ΒΗΜΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Διαδραστικό Εργαστήριο: Πληκτρολόγηση & Βήμα-Βήμα Επίλυση
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Γράψε οποιαδήποτε παράσταση με δυνάμεις, παρενθέσεις και ακέραιους αριθμούς ή επίλεξε ένα έτοιμο παράδειγμα για να δεις όλη την ανάλυση βήμα προς βήμα!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* ΑΡΙΣΤΕΡΑ: ΠΛΑΙΣΙΟ ΕΙΣΑΓΩΓΗΣ, ΠΛΗΚΤΡΟΛΟΓΙΟ & PRESETS (5 COLS) */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 p-4 sm:p-6 rounded-3xl space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Πληκτρολογηση παραστασης:
                </label>
                <input
                  type="text"
                  value={customExpr}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="π.χ. 5+3*(-2)^2"
                  className="w-full text-base sm:text-lg font-mono font-black text-center p-3 bg-white border-2 border-indigo-200 rounded-2xl shadow-sm text-indigo-900 outline-none focus:border-indigo-600 tracking-wide transition"
                />
              </div>

              {/* Πληκτρολόγιο Μαθηματικών Συμβόλων */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  Εγκυρα συμβολα:
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                  {['^', '(', ')', '[', ']', '*', '/', '+', '-'].map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleInsertSymbol(sym)}
                      className="h-10 rounded-xl bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 active:scale-95 text-slate-800 font-mono font-black text-sm transition shadow-sm"
                    >
                      {sym === '*' ? '·' : sym === '/' ? '：' : sym === '+' ? '＋' : sym === '-' ? '－' : sym}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="h-10 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 active:scale-95 text-amber-900 font-bold text-xs transition shadow-sm"
                  >
                    DEL
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="h-10 col-span-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 active:scale-95 text-rose-900 font-bold text-xs transition shadow-sm"
                  >
                    ΚΑΘΑΡΙΣΜΟΣ
                  </button>
                </div>
              </div>

              {/* Έτοιμα Παραδείγματα */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  Η επιλεξε ετοιμο παραδειγμα:
                </span>
                <div className="flex flex-col gap-1.5">
                  {Object.keys(PRESETS).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCustomExpr(PRESETS[key].expr)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl border font-mono font-bold text-xs transition-all ${
                        customExpr === PRESETS[key].expr
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {PRESETS[key].title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ: ΖΩΝΤΑΝΗ ΑΝΑΛΥΣΗ ΒΗΜΑ-ΒΗΜΑ (7 COLS) */}
            <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] space-y-6">
              <div className="w-full text-center space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                  ΑΡΧΙΚΗ ΠΑΡΑΣΤΑΣΗ:
                </span>
                <div className="text-base sm:text-xl font-mono font-black text-indigo-900 bg-indigo-50 inline-block px-4 sm:px-6 py-2 rounded-2xl border border-indigo-100 shadow-xs max-w-full overflow-x-auto">
                  {customExpr
                    .replace(/\*/g, ' · ')
                    .replace(/\//g, ' ： ')
                    .replace(/\+/g, ' ＋ ')
                    .replace(/-/g, ' － ') || '—'}
                </div>
              </div>

              {/* Λίστα Βημάτων */}
              <div className="w-full space-y-4 my-auto">
                {analysis.isValid && analysis.steps.length > 0 ? (
                  analysis.steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center w-full space-y-2">
                      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 w-full shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center font-mono gap-3">
                        <div className="space-y-0.5 text-left flex-1">
                          <div className="text-[10px] font-sans font-black uppercase text-amber-400 tracking-wider">
                            {step.level}
                          </div>
                          <div className="text-xs text-slate-300 font-sans leading-snug">
                            {step.text}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 self-end sm:self-center">
                          <div className="text-emerald-400 font-black text-xs sm:text-sm bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800 font-mono">
                            {step.calculation}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center text-slate-400 space-y-1">
                        <span className="text-xs font-black">↓</span>
                        <span className="text-xs font-mono font-bold tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 text-center max-w-full overflow-x-auto">
                          Επόμενη μορφή: {step.currentForm || '🏁'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-xs sm:text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 p-6">
                    {customExpr
                      ? '⚠️ Μη έγκυρη παράσταση. Βεβαιώσου ότι οι πράξεις, οι δυνάμεις και οι παρενθέσεις έχουν συμπληρωθεί σωστά.'
                      : 'Γράψε μια παράσταση στα αριστερά για να εμφανιστούν τα βήματα.'}
                  </div>
                )}

                {/* Τελικό Αποτέλεσμα */}
                {analysis.isValid && (
                  <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl text-center shadow-lg font-mono font-black flex flex-wrap items-center justify-center gap-3 mt-4">
                    <span className="text-xl">🏁</span>
                    <span className="text-xs sm:text-sm font-sans uppercase tracking-wider">
                      ΤΕΛΙΚΗ ΤΙΜΗ ΠΑΡΑΣΤΑΣΗΣ:
                    </span>
                    <span className="text-xl sm:text-2xl bg-white/20 px-4 py-1 rounded-xl shadow-inner">
                      {analysis.final}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full text-center text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                🔍 Αν δύο πράξεις ανήκουν στην ίδια κατηγορία προτεραιότητας, εκτελούνται αυστηρά από αριστερά προς τα δεξιά!
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
