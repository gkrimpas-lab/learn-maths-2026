import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const PRESETS = {
  EX1: { title: "10 - 2 × 4", expr: "10-2*4" },
  EX2: { title: "5 + 3 × (4 + 2)", expr: "5+3*(4+2)" },
  EX3: { title: "12 ÷ 3 × 2 + 4", expr: "12/3*2+4" },
  EX4: { title: "50 - (3 × 12) + 8", expr: "50-(3*12)+8" }
};

export default function ProteraiotitaPrakseonPage() {
  const [customExpr, setCustomExpr] = useState("15+3-(6-2)*3");

  const handleInputChange = (val) => {
    // Αφαίρεση κενών και επιτρεπόμενα μόνο νούμερα, πράξεις, παρενθέσεις και κόμμα/τελεία
    const clean = val.replace(/\s+/g, '').replace(/[^0-9+\-*/().,]/g, '');
    setCustomExpr(clean);
  };

  // Μετατροπή των tokens σε καθαρό κείμενο με σωστή διαχείριση παρενθέσεων
  const tokensToString = (tokens) => {
    return tokens.map((t, idx) => {
      if (t.type === 'OPERATOR') {
        if (t.value === '*') return '×';
        if (t.value === '/') return '÷';
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
    if (!currentStr) return { steps: [], final: "0", isValid: false };

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
    if (!tokens || tokens.length === 0) return { steps: [], final: "0", isValid: false };

    // Έλεγχος συντακτικής εγκυρότητας (Parentheses matching & token structure)
    let openCount = 0;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'PAREN') {
        if (tokens[i].value === '(') openCount++;
        if (tokens[i].value === ')') openCount--;
        if (openCount < 0) return { steps: [], final: "0", isValid: false };
      }
      // Έλεγχος για διαδοχικούς αριθμούς χωρίς τελεστή
      if (i > 0 && tokens[i].type === 'NUMBER' && tokens[i - 1].type === 'NUMBER') {
        return { steps: [], final: "0", isValid: false };
      }
    }
    if (openCount !== 0) return { steps: [], final: "0", isValid: false };

    // Έλεγχος αν τελειώνει ή ξεκινά με απαγορευμένο τελεστή
    const firstToken = tokens[0];
    const lastToken = tokens[tokens.length - 1];
    if (firstToken.type === 'OPERATOR' && firstToken.value !== '-') return { steps: [], final: "0", isValid: false };
    if (lastToken.type === 'OPERATOR') return { steps: [], final: "0", isValid: false };

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
          reasonType = 'Παρενθεσεις ( )';
          reasonText = 'Λύνουμε κατά προτεραιότητα την πράξη μέσα στην παρένθεση.';
        }
      }

      if (targetIdx === -1) {
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].type === 'OPERATOR' && (tokens[i].value === '*' || tokens[i].value === '/')) {
            targetIdx = i;
            reasonType = 'Πολλαπλασιασμοι / Διαιρεσεις';
            reasonText = tokens[i].value === '*' ? 'Ο πολλαπλασιασμός προηγείται.' : 'Η διαίρεση προηγείται.';
            break;
          }
        }
      }

      if (targetIdx === -1) {
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].type === 'OPERATOR' && (tokens[i].value === '+' || tokens[i].value === '-')) {
            targetIdx = i;
            reasonType = 'Προσθεσεις / Αφαιρεσεις';
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

        const formattedRes = parseFloat(res.toFixed(2));
        const opChar = op === '*' ? '×' : (op === '/' ? '÷' : op);

        const formatCalcNum = (val) => {
          const str = val.toString().replace('.', ',');
          return val < 0 ? `(${str})` : str;
        };

        steps.push({
          level: `Βημα ${steps.length + 1}: ${reasonType}`,
          text: reasonText,
          calculation: `${formatCalcNum(num1)} ${opChar} ${formatCalcNum(num2)} = ${formatCalcNum(formattedRes)}`,
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
      final: isValidResult ? tokens[0].value.toString().replace('.', ',') : "0",
      isValid: isValidResult
    };
  };

  const analysis = generateSteps(customExpr);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🏆 Προτεραιότητα των Πράξεων - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 w-full">
          <div className={`${LAYOUT.CONTAINER} py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight flex items-center">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/st-dimotikou/10-proteraiotita-prakseon-ask"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs md:text-sm font-black transition shadow-sm flex items-center gap-1.5"
              >
                <span>🎯</span> Ασκήσεις
              </Link>
              <Link
                href="/st-dimotikou"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition"
              >
                🔙 ΣΤ' Δημοτικού
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. MAIN LESSON CONTAINER */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-8 md:py-12 space-y-10`}>

          {/* HERO BANNER WITH PROMO CALLOUT CARD */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    🎓 ΣΤ' Δημοτικού
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενότητα 10
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  10. Προτεραιότητα Πράξεων και Αριθμητικές Παραστάσεις
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε τη χρυσή σειρά των μαθηματικών: <strong>Παρενθέσεις</strong>, μετά <strong>Πολλαπλασιασμοί και Διαιρέσεις</strong>, και τέλος <strong>Προσθέσεις & Αφαιρέσεις</strong> από αριστερά προς τα δεξιά!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις διαδραστικές ασκήσεις με 8 δυναμικά προβλήματα!</p>
                <Link
                  href="/st-dimotikou/10-proteraiotita-prakseon-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-black text-slate-900">1ο Βήμα: Παρενθέσεις ( )</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Εκτελούμε <strong>πρώτα</strong> όλες τις πράξεις μέσα στις παρενθέσεις. Αν υπάρχουν εσωτερικές παρενθέσεις, ξεκινάμε από τις πιο εσωτερικές.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center">
                <p>5 ＋ 3 × <strong className="text-blue-700">(4 ＋ 2)</strong> ＝ 5 ＋ 3 × <strong className="text-blue-700">6</strong></p>
              </div>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900">2ο Βήμα: × και ÷</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Στη συνέχεια κάνουμε τους <strong>πολλαπλασιασμούς</strong> και τις <strong>διαιρέσεις</strong> με τη σειρά που εμφανίζονται από αριστερά προς τα δεξιά.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center">
                <p>10 － <strong className="text-indigo-700">2 × 4</strong> ＝ 10 － <strong className="text-indigo-700">8</strong> ＝ 2</p>
              </div>
            </div>

            <div className="bg-cyan-50/80 border border-cyan-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900">3ο Βήμα: ＋ και －</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Τέλος, κάνουμε τις <strong>προσθέσεις</strong> και τις <strong>αφαιρέσεις</strong> διαδοχικά, εκτελώντας τις από αριστερά προς τα δεξιά.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-cyan-100 text-xs text-slate-700 font-mono text-center font-bold">
                <p>12 － 3 ＋ 2 ＝ 9 ＋ 2 ＝ 11</p>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Βήμα-Βήμα
                </h2>
                <p className="text-gray-500 text-sm">
                  Γράψε μια παράσταση ή διάλεξε παράδειγμα για να δεις όλα τα βήματα επίλυσης με αιτιολογία!
                </p>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* LEFT: INPUT & PRESETS (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                      Γραψε τη δικη σου παρασταση:
                    </span>
                    <p className="text-gray-500 text-xs">
                      Χωρίς κενά, μόνο αριθμοί και σύμβολα: <code className="bg-white px-1 py-0.5 rounded font-mono font-bold text-blue-600 border">+ - * / ( )</code>
                    </p>
                  </div>

                  <input
                    type="text"
                    value={customExpr}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-lg font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-wide"
                    placeholder="π.χ. 2+3*4"
                  />
                  
                  <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-1.5 leading-snug">
                    <span>💻</span>
                    <span><strong>Πληκτρολόγιο:</strong> Χρησιμοποίησε <strong>*</strong> για πολλαπλασιασμό (×) και <strong>/</strong> για διαίρεση (÷).</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Η επιλεξε ετοιμο παραδειγμα:
                    </span>
                    <div className="flex flex-col gap-2">
                      {Object.keys(PRESETS).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setCustomExpr(PRESETS[key].expr)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl border font-mono font-bold text-xs md:text-sm transition-all ${
                            customExpr === PRESETS[key].expr
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]'
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
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[460px]">
                
                <div className="w-full text-center mb-6">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                    Ζωντανη Αναλυση Βηματων:
                  </span>
                  <div className="text-xl md:text-2xl font-mono font-black text-blue-600 mt-2 bg-blue-50 inline-block px-6 py-2 rounded-2xl border border-blue-100 shadow-sm">
                    {customExpr.replace(/\*/g, '×').replace(/\//g, '÷') || "—"}
                  </div>
                </div>

                <div className="w-full max-w-lg mx-auto flex flex-col gap-4 my-auto relative">
                  {analysis.isValid && analysis.steps.length > 0 ? (
                    analysis.steps.map((step, index) => (
                      <div key={index} className="flex flex-col items-center w-full space-y-2">
                        
                        <div className="bg-slate-900 text-white p-4 rounded-2xl border-2 border-slate-700 w-full shadow-md flex justify-between items-center font-mono gap-4">
                          <div className="space-y-0.5 text-left flex-1">
                            <div className="text-[10px] font-sans font-black uppercase text-amber-400 tracking-wider">
                              {step.level}
                            </div>
                            <div className="text-xs text-slate-300 font-sans leading-snug">
                              {step.text}
                            </div>
                          </div>
                          
                          <div className="text-right flex-shrink-0">
                            <div className="text-emerald-400 font-black text-sm md:text-base bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
                              {step.calculation}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center text-slate-400">
                          <span className="text-xs font-black">↓</span>
                          <span className="text-xs font-mono font-bold tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
                            Επόμενη μορφή: {step.currentForm || "🏁"}
                          </span>
                        </div>

                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200">
                      {customExpr
                        ? "⚠️ Μη έγκυρη παράσταση. Βεβαιώσου ότι δεν υπάρχουν κενά και ότι οι πράξεις και οι παρενθέσεις είναι σωστές."
                        : "Γράψε μια έγκυρη παράσταση στα αριστερά για να εμφανιστούν τα βήματα."}
                    </div>
                  )}

                  {/* FINAL RESULT BADGE */}
                  {analysis.isValid && (
                    <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-2xl text-center shadow-lg font-mono font-black flex items-center justify-center gap-3 mt-2">
                      <span className="text-xl">🏁</span>
                      <span className="text-xs md:text-sm font-sans uppercase tracking-wider">Τελικη Τιμη Παραστασης:</span>
                      <span className="text-2xl bg-white/20 px-4 py-1 rounded-xl shadow-inner">
                        {analysis.final}
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-slate-100 mt-6 text-center">
                  <span>🔍 Αν δύο πράξεις έχουν την ίδια προτεραιότητα, γίνονται πάντα από αριστερά προς τα δεξιά!</span>
                </div>
              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Κατανόησες τη σειρά προτεραιότητας των πράξεων; Δοκίμασε τις διαδραστικές ασκήσεις για να εμπεδώσεις τις γνώσεις σου!
              </p>
            </div>
            <Link
              href="/st-dimotikou/10-proteraiotita-prakseon-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* 6. GLOBAL FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
