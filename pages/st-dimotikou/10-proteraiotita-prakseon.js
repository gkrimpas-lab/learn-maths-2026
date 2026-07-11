// pages/st-dimotikou/10-proteraiotita-prakseon.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Έτοιμα παραδείγματα
const PRESETS = {
  EX1: { title: "10 - 2 × 4", expr: "10 - 2 * 4" },
  EX2: { title: "5 + 3 × (4 + 2)", expr: "5 + 3 * (4 + 2)" },
  EX3: { title: "12 ÷ 3 × 2 + 4", expr: "12 / 3 * 2 + 4" }
};

export default function ProteraiotitaPrakseonPage() {
  const [customExpr, setCustomExpr] = useState("5 + 3 * (4 + 2)");

  // Καθαρισμός εισαγωγής του χρήστη για ασφάλεια
  const handleInputChange = (val) => {
    const clean = val.replace(/[^0-9+\-*/(). ]/g, '');
    setCustomExpr(clean);
  };

  // Custom ασφαλής μηχανισμός ανάλυσης της παράστασης σε εκπαιδευτικά βήματα
  const generateSteps = (exprStr) => {
    const steps = [];
    let current = exprStr.replace(/\s+/g, ''); // αφαίρεση κενών
    if (!current) return { steps: [], final: "0" };

    let safetyCounter = 0;

    while (safetyCounter < 10) {
      safetyCounter++;
      
      // 1. Έλεγχος για παρενθέσεις
      const parenRegex = /\(([^()]+)\)/;
      const parenMatch = current.match(parenRegex);
      
      if (parenMatch) {
        const subExpr = parenMatch[1];
        const res = solveSimpleExpr(subExpr);
        if (res === null) break;
        
        steps.push({
          level: `Βήμα ${steps.length + 1}: Παρενθέσεις ( )`,
          text: `Λύνουμε την πράξη μέσα στην παρένθεση: (${subExpr})`,
          calculation: `${subExpr.replace(/\*/g, '×').replace(/\//g, '÷')} = ${res}`,
          currentForm: current.replace(parenMatch[0], res).replace(/\*/g, '×').replace(/\//g, '÷')
        });
        current = current.replace(parenMatch[0], res);
        continue;
      }

      // 2. Έλεγχος για Πολλαπλασιασμό / Διαίρεση (από αριστερά προς τα δεξιά)
      const mdRegex = /(\d+(?:\.\d+)?)([*/])(\d+(?:\.\d+)?)/;
      const mdMatch = current.match(mdRegex);
      
      if (mdMatch) {
        const num1 = parseFloat(mdMatch[1]);
        const op = mdMatch[2];
        const num2 = parseFloat(mdMatch[3]);
        const res = op === '*' ? num1 * num2 : (num2 !== 0 ? num1 / num2 : 0);
        
        steps.push({
          level: `Βήμα ${steps.length + 1}: Πολλαπλασιασμοί / Διαιρέσεις`,
          text: op === '*' ? "Ο πολλαπλασιασμός έχει προτεραιότητα." : "Η διαίρεση έχει προτεραιότητα.",
          calculation: `${mdMatch[1]} ${op === '*' ? '×' : '÷'} ${mdMatch[3]} = ${parseFloat(res.toFixed(2))}`,
          currentForm: current.replace(mdMatch[0], parseFloat(res.toFixed(2))).replace(/\*/g, '×').replace(/\//g, '÷')
        });
        current = current.replace(mdMatch[0], parseFloat(res.toFixed(2)));
        continue;
      }

      // 3. Έλεγχος για Πρόσθεση / Αφαίρεση (από αριστερά προς τα δεξιά)
      const asRegex = /(\d+(?:\.\d+)?)([+\-])(\d+(?:\.\d+)?)/;
      const asMatch = current.match(asRegex);
      
      if (asMatch) {
        const num1 = parseFloat(asMatch[1]);
        const op = asMatch[2];
        const num2 = parseFloat(asMatch[3]);
        const res = op === '+' ? num1 + num2 : num1 - num2;
        
        steps.push({
          level: `Βήμα ${steps.length + 1}: Προσθέσεις / Αφαιρέσεις`,
          text: "Κάνουμε τις προσθέσεις και τις αφαιρέσεις τελευταίες.",
          calculation: `${asMatch[1]} ${op} ${asMatch[3]} = ${parseFloat(res.toFixed(2))}`,
          currentForm: current.replace(asMatch[0], parseFloat(res.toFixed(2))).replace(/\*/g, '×').replace(/\//g, '÷')
        });
        current = current.replace(asMatch[0], parseFloat(res.toFixed(2)));
        continue;
      }

      // Αν δεν υπάρχει άλλη πράξη, σταματάμε
      break;
    }

    return {
      steps: steps,
      final: current.replace(/\*/g, '×').replace(/\//g, '÷')
    };
  };

  // Βοηθητική συνάρτηση για την επίλυση απλής έκφρασης εντός παρένθεσης
  const solveSimpleExpr = (sub) => {
    let temp = sub;
    // Πρώτα πολλαπλασιασμοί/διαιρέσεις στην παρένθεση
    let mdMatch;
    while ((mdMatch = temp.match(/(\d+(?:\.\d+)?)([*/])(\d+(?:\.\d+)?)/))) {
      const n1 = parseFloat(mdMatch[1]);
      const op = mdMatch[2];
      const n2 = parseFloat(mdMatch[3]);
      const r = op === '*' ? n1 * n2 : (n2 !== 0 ? n1 / n2 : 0);
      temp = temp.replace(mdMatch[0], r);
    }
    // Μετά προσθέσεις/αφαιρέσεις στην παρένθεση
    let asMatch;
    while ((asMatch = temp.match(/(\d+(?:\.\d+)?)([+\-])(\d+(?:\.\d+)?)/))) {
      const n1 = parseFloat(asMatch[1]);
      const op = asMatch[2];
      const n2 = parseFloat(asMatch[3]);
      const r = op === '+' ? n1 + n2 : n1 - n2;
      temp = temp.replace(asMatch[0], r);
    }
    return parseFloat(temp) || 0;
  };

  const analysis = generateSteps(customExpr);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🏆 Προτεραιότητα των Πράξεων - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/st-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>📖</span> Θεωρία: Ποιος έχει Προτεραιότητα;
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  Όταν σε μια μαθηματική έκφραση συνυπάρχουν πολλές πράξεις μαζί, ακολουθούμε πάντα τον κανόνα της <strong>Προτεραιότητας των Πράξεων</strong>, σαρώνοντας την έκφραση από <strong>αριστερά προς τα δεξιά</strong>.
                </p>
                
                {/* Η Σκάλα των Πράξεων */}
                <div className="space-y-2 font-medium text-sm">
                  <div className="flex items-center gap-3 bg-red-50 text-red-900 p-3 rounded-xl border border-red-100">
                    <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">1</span>
                    <div><strong>🥇 Παρενθέσεις ( ):</strong> Λύνονται πάντα πρώτες απ' όλα!</div>
                  </div>
                  <div className="flex items-center gap-3 bg-amber-50 text-amber-900 p-3 rounded-xl border border-amber-100">
                    <span className="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">2</span>
                    <div><strong>🥈 Πολλαπλασιασμοί (×) & Διαιρέσεις (÷):</strong> Έπονται, με τη σειρά που τις συναντάμε.</div>
                  </div>
                  <div className="flex items-center gap-3 bg-blue-50 text-blue-900 p-3 rounded-xl border border-blue-100">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">3</span>
                    <div><strong>🥉 Προσθέσεις (+) & Αφαιρέσεις (-):</strong> Γίνονται πάντα τελευταίες!</div>
                  </div>
                </div>
              </div>
              
              {/* Μνημονικός Κανόνας */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md text-center py-8 space-y-4">
                <span className="text-amber-300 font-black text-xs md:text-sm uppercase tracking-wider block">🧠 Μνημονικός Κανόνας</span>
                <div className="text-3xl md:text-4xl font-black tracking-widest bg-white/10 py-3 rounded-xl">
                  ΠΑ.ΠΟ.ΔΙ.ΠΡ.Α.
                </div>
                <p className="text-xs text-indigo-100 font-medium px-2 leading-relaxed">
                  <strong>Πα</strong>ρένθεση • <strong>Πο</strong>λλαπλασιασμός • <strong>Δι</strong>αίρεση • <strong>Πρ</strong>όσθεση • <strong>Α</strong>φαίρεση!
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & INPUT (4 στήλες) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5 justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Γράψε τη δική σου Παράσταση!</h3>
                  <p className="text-gray-500 text-xs">Χρησιμοποίησε αριθμούς και τα σύμβολα: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-blue-600">+ - * / ( )</code></p>
                </div>

                {/* Live Input */}
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={customExpr}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-lg font-mono font-black text-center p-3 bg-slate-50 border-2 border-blue-200 rounded-xl shadow-inner text-blue-600 outline-none focus:border-blue-500 tracking-wide"
                    placeholder="π.χ. 2 + 3 * 4"
                  />
                </div>

                {/* Γρήγορα Έτοιμα Παραδείγματα */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Ή επίλεξε ένα έτοιμο:</span>
                  <div className="flex flex-col gap-2">
                    {Object.keys(PRESETS).map((key) => (
                      <button
                        key={key}
                        onClick={() => setCustomExpr(PRESETS[key].expr)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl border font-mono font-bold text-sm transition-all ${customExpr === PRESETS[key].expr ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                      >
                        {PRESETS[key].title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Εκπαιδευτική Υπενθύμιση */}
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-medium leading-relaxed">
                💡 <strong>Πειραματίσου:</strong> Δοκίμασε να γράψεις την ίδια πράξη με και χωρίς παρένθεση (π.χ. <code className="font-bold">2+3*4</code> και <code className="font-bold">(2+3)*4</code>) για να δεις πόσο αλλάζει το αποτέλεσμα!
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΔΥΝΑΜΙΚΟ ΔΕΝΤΡΟ / ΔΙΑΓΡΑΜΜΑ ΑΝΑΛΥΣΗΣ (8 στήλες) */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[460px]">
              
              <div className="w-full text-center mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ζωντανή Ανάλυση Βημάτων:</span>
                <div className="text-xl md:text-2xl font-mono font-black text-blue-600 mt-2 bg-blue-50 inline-block px-6 py-2 rounded-2xl border border-blue-100">
                  {customExpr.replace(/\*/g, '×').replace(/\//g, '÷') || "—"}
                </div>
              </div>

              {/* Δυναμικό Δέντρο Βημάτων */}
              <div className="w-full max-w-md mx-auto flex flex-col gap-4 my-auto relative">
                {analysis.steps.length > 0 ? (
                  analysis.steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center w-full">
                      
                      {/* Κάρτα Επιμέρους Πράξης */}
                      <div className="bg-slate-900 text-white p-4 rounded-xl border-2 border-slate-700 w-full shadow-md flex justify-between items-center font-mono gap-4">
                        <div className="space-y-0.5 text-left flex-1">
                          <div className="text-[10px] font-sans font-black uppercase text-amber-400 tracking-wider">{step.level}</div>
                          <div className="text-xs text-slate-400 font-sans leading-snug">{step.text}</div>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <div className="text-emerald-400 font-black text-sm bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-900/50">{step.calculation}</div>
                        </div>
                      </div>

                      {/* Βέλος και Επόμενη Μορφή */}
                      <div className="flex flex-col items-center my-1 text-slate-400">
                        <span className="text-sm font-black">↓</span>
                        <span className="text-xs font-mono font-bold tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          Επόμενη μορφή: {step.currentForm}
                        </span>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-sm text-slate-400 font-medium">
                    Γράψε μια έγκυρη παράσταση στα αριστερά για να ξεκινήσει η ανάλυση.
                  </div>
                )}

                {/* Τελικό Αποτέλεσμα */}
                <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-xl text-center shadow-lg font-mono font-black flex items-center justify-center gap-3">
                  <span className="text-xl">🏁</span>
                  <span className="text-sm font-sans uppercase tracking-wider">Αποτέλεσμα:</span>
                  <span className="text-2xl bg-white/20 px-4 py-1 rounded-lg shadow-inner">{analysis.final}</span>
                </div>
              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-6 text-center">
                <span>🔍 Αν δύο πράξεις έχουν την ίδια προτεραιότητα, γίνονται πάντα από αριστερά προς τα δεξιά!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Προτεραιότητα των Πράξεων - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
