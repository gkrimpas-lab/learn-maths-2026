import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Βοηθητική συνάρτηση για εύρεση Μέγιστου Κοινού Διαιρέτη (ΜΚΔ)
const findGCD = (a, b) => {
  const absA = Math.abs(a);
  const absB = Math.abs(b);
  return absB === 0 ? absA : findGCD(absB, absA % absB);
};

export default function DiairesiKlasmatonPage() {
  // Mode: 'fraction-fraction' (κλάσμα με κλάσμα) ή 'fraction-number' (κλάσμα με ακέραιο)
  const [mode, setMode] = useState('fraction-fraction');

  // Κατάσταση για Κλάσμα Α (Διαιρετέος)
  const [numA, setNumA] = useState(3);
  const [denA, setDenA] = useState(4);

  // Κατάσταση για Κλάσμα Β (Διαιρέτης) - Ή Ακέραιο Β
  const [numB, setNumB] = useState(1);
  const [denB, setDenB] = useState(4);

  // Έλεγχος εισαγωγής κειμένου - Επιτρέπει έως 7 ψηφία χωρίς άνω όριο τιμής
  const handleInputChange = (setter, val, isDenominator = false) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setter('');
      return;
    }
    if (clean.length > 7) return; // Περιορισμός στα 7 ψηφία
    const n = Number(clean);
    if (isDenominator && n === 0) return;
    setter(n);
  };

  // Αυξομείωση με κουμπιά
  const adjustValue = (setter, currentVal, amount, isDenominator = false) => {
    const next = (Number(currentVal) || 0) + amount;
    const min = isDenominator ? 1 : 0;
    if (next >= min && next.toString().length <= 7) {
      setter(next);
    }
  };

  // Ενεργές τιμές για τους υπολογισμούς
  const activeNumA = numA === '' ? 0 : Number(numA);
  const activeDenA = denA === '' || denA === 0 ? 1 : Number(denA);
  const activeNumB = numB === '' ? 0 : Number(numB);
  const activeDenB = mode === 'fraction-fraction' ? (denB === '' || denB === 0 ? 1 : Number(denB)) : 1;

  // Υπολογισμός Αντίστροφου Κλάσματος Διαιρέτη
  const inverseNum = activeDenB;
  const inverseDen = activeNumB;

  // Υπολογισμός Διαίρεσης
  const resultNum = activeNumA * inverseNum;
  const resultDen = activeDenA * inverseDen;

  const gcd = findGCD(resultNum, resultDen);
  const simplifiedNum = resultNum / gcd;
  const simplifiedDen = resultDen / gcd;
  const isSimplified = gcd > 1 && resultNum !== 0;

  const decimalResult = resultNum / resultDen;

  // ΕΞΥΠΝΟΣ ΤΡΟΠΟΣ ΑΝΑΠΑΡΑΣΤΑΣΗΣ: Αυτοπροσαρμοζόμενη δυναμική κλίμακα (Dynamic Scaling)
  const renderBarVisual = () => {
    const valA = activeNumA / activeDenA;
    const valB = activeNumB / activeDenB;

    // Βρίσκουμε τη μέγιστη τιμή για να αποτελέσει το 100% του οπτικού πλάτους
    const maxVal = Math.max(valA, valB);
    
    // Υπολογισμός αναλογικού πλάτους % (αν το maxVal είναι 0, βάζουμε 0)
    const widthA = maxVal > 0 ? (valA / maxVal) * 100 : 0;
    const widthB = maxVal > 0 ? (valB / maxVal) * 100 : 0;

    return (
      <div className="w-full bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 space-y-6">
        <div className="text-center text-xs text-slate-500 max-w-md mx-auto">
          💡 <strong>Τι σημαίνει η διαίρεση;</strong> Σημαίνει να βρούμε πόσες φορές χωράει η κάτω μπάρα (Κλάσμα Β) μέσα στην πάνω μπάρα (Κλάσμα Α)!
        </div>

        <div className="space-y-5 max-w-xl mx-auto">
          {/* Μπάρα Α */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-blue-600 uppercase">
              <span>📏 Κλάσμα Α (Διαιρετέος)</span>
              <span className="font-mono">{activeNumA}/{activeDenA} ≈ {Number(valA.toFixed(3))}</span>
            </div>
            <div className="w-full bg-slate-200/70 h-9 rounded-xl p-0.5 border border-slate-300/50 shadow-inner flex">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-lg transition-all duration-500 flex items-center pl-3 text-white font-mono font-black text-xs shadow-md truncate"
                style={{ width: `${widthA}%` }}
              >
                {widthA > 15 && `${activeNumA}/${activeDenA}`}
              </div>
            </div>
          </div>

          {/* Μπάρα Β */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-orange-600 uppercase">
              <span>📐 Κλάσμα Β (Διαιρέτης)</span>
              <span className="font-mono">
                {mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB} ≈ {Number(valB.toFixed(3))}
              </span>
            </div>
            <div className="w-full bg-slate-200/70 h-9 rounded-xl p-0.5 border border-slate-300/50 shadow-inner flex">
              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-lg transition-all duration-500 flex items-center pl-3 text-white font-mono font-black text-xs shadow-md truncate"
                style={{ width: `${widthB}%` }}
              >
                {widthB > 15 && (mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB)}
              </div>
            </div>
          </div>
        </div>

        {/* Αποτέλεσμα Σύγκρισης */}
        <div className="text-center text-xs font-bold font-mono text-slate-700 bg-white border p-3 rounded-xl max-w-xs mx-auto shadow-sm space-y-1">
          <div className="text-slate-400 font-sans text-[10px] uppercase tracking-wider">Πόσες φορές χωράει:</div>
          <div className="text-emerald-600 text-base font-black">
            {Number.isInteger(decimalResult) ? decimalResult : Number(decimalResult.toFixed(4))} φορές!
          </div>
        </div>
      </div>
    );
  };

  // Επεξηγηματικό παιδαγωγικό μήνυμα βήμα-βήμα (Αριστερό Κάτω Πλαίσιο)
  const getStepByStepExplanation = () => {
    let typeHeader = activeDenA === activeDenB 
      ? `🔵 Τα κλάσματα είναι ομώνυμα (ίδιος παρονομαστής: ${activeDenA})`
      : `🟣 Τα κλάσματα είναι ετερώνυμα (διαφορετικοί παρονομαστές: ${activeDenA} ≠ ${activeDenB})`;

    return (
      <div className="space-y-3">
        <p className={`font-bold ${activeDenA === activeDenB ? 'text-blue-800' : 'text-indigo-800'}`}>{typeHeader}</p>
        <div className="text-slate-600 space-y-1.5 text-xs md:text-sm">
          <p>1. Κρατάμε το 1ο κλάσμα αμετάβλητο: <span className="font-mono font-bold text-blue-600">{activeNumA}/{activeDenA}</span></p>
          <p>2. Αντιστρέφουμε τους όρους του 2ου κλάσματος:</p>
          <p className="font-mono text-orange-600 pl-2">➡️ Το <strong>{activeNumB}/{activeDenB}</strong> γίνεται <strong>{inverseNum}/{inverseDen}</strong></p>
          <p>3. Μετατρέπουμε την πράξη σε πολλαπλασιασμό:</p>
        </div>
        
        <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-xs md:text-sm">
          {activeNumA}/{activeDenA} : {activeNumB}/{activeDenB} = {activeNumA}/{activeDenA} × {inverseNum}/{inverseDen} = <strong>{resultNum}/{resultDen}</strong>
        </div>

        {isSimplified && (
          <p className="text-emerald-700 text-xs font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-100">
            ✨ Απλοποιώντας με το {gcdResult}, το τελικό ανάγωγο κλάσμα είναι: <strong>{simplifiedNum}/{simplifiedDen}</strong>
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>➗ Διαίρεση Κλασμάτων - LearnMaths.gr</title>
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
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-8`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span>📖</span> Πώς διαιρούμε Κλάσματα;
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch text-xs md:text-sm">
              <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-100 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="font-black text-blue-800 block text-sm">1. Ο Χρυσός Κανόνας</span>
                  <p className="text-slate-600 leading-relaxed">
                    Στη διαίρεση κλασμάτων δεν κάνουμε ποτέ πραγματική διαίρεση! <strong>Αντιστρέφουμε τους όρους του δεύτερου κλάσματος</strong> (φέρνουμε τα πάνω κάτω) και μετά κάνουμε <strong>πολλαπλασιάσμο</strong>.
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-blue-700 bg-white px-3 py-1.5 rounded border inline-block mt-2 self-start">
                  (α/β) : (γ/δ) = (α/β) × (δ/γ)
                </span>
              </div>

              <div className="bg-indigo-50/60 p-5 rounded-xl border border-indigo-100 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="font-black text-indigo-800 block text-sm">2. Διαίρεση με Ακέραιο Αριθμό</span>
                  <p className="text-slate-600 leading-relaxed">
                    Αν ο διαιρέτης είναι ακέραιος (φυσικός αριθμός), τον μετατρέπουμε πρώτα σε κλάσμα βάζοντας <strong>παρονομαστή το 1</strong>. Μετά, ακολουθούμε κανονικά τον ίδιο κανόνα της αντιστροφής!
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded border inline-block mt-2 self-start">
                  (α/β) : γ = (α/β) : (γ/1) = (α/β) × (1/γ)
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: SWITCH MODE */}
          <div className="flex justify-center">
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex gap-1">
              <button
                onClick={() => { setMode('fraction-fraction'); setNumB(1); setDenB(4); }}
                className={`px-6 py-3 rounded-xl text-xs md:text-sm font-bold transition ${
                  mode === 'fraction-fraction' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                ➗ Κλάσμα με Κλάσμα
              </button>
              <button
                onClick={() => { setMode('fraction-number'); setNumB(2); }}
                className={`px-6 py-3 rounded-xl text-xs md:text-sm font-bold transition ${
                  mode === 'fraction-number' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                🔢 Κλάσμα με Ακέραιο
              </button>
            </div>
          </div>

          {/* SECTION 3: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Όρισε τους όρους</h3>
                  <p className="text-gray-500 text-xs">Ελεύθερη πληκτρολόγηση έως 7 ψηφία.</p>
                </div>

                {/* ΚΛΑΣΜΑ Α (ΔΙAΙΡΕΤΕΟΣ) */}
                <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-100 space-y-3">
                  <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">🔵 Κλάσμα Α (Διαιρετέος)</span>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => adjustValue(setNumA, numA, -1)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={numA}
                          onChange={(e) => handleInputChange(setNumA, e.target.value, false)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-blue-600"
                        />
                        <button onClick={() => adjustValue(setNumA, numA, 1)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => adjustValue(setDenA, denA, -1, true)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={denA}
                          onChange={(e) => handleInputChange(setDenA, e.target.value, true)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-blue-600"
                        />
                        <button onClick={() => adjustValue(setDenA, denA, 1, true)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ΚΛΑΣΜΑ Β Η ΑΚΕΡΑΙΟΣ (ΔΙAΙΡΕΤΗΣ) */}
                {mode === 'fraction-fraction' ? (
                  <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-100 space-y-3">
                    <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">🟠 Κλάσμα Β (Διαιρέτης)</span>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                          <button onClick={() => adjustValue(setNumB, numB, -1)} className="px-1.5 font-bold text-orange-600 hover:bg-slate-50 rounded">-</button>
                          <input
                            type="text"
                            value={numB}
                            onChange={(e) => handleInputChange(setNumB, e.target.value, false)}
                            className="w-full text-center font-mono font-black text-sm outline-none text-orange-600"
                        />
                          <button onClick={() => adjustValue(setNumB, numB, 1)} className="px-1.5 font-bold text-orange-600 hover:bg-slate-50 rounded">+</button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                          <button onClick={() => adjustValue(setDenB, denB, -1, true)} className="px-1.5 font-bold text-orange-600 hover:bg-slate-50 rounded">-</button>
                          <input
                            type="text"
                            value={denB}
                            onChange={(e) => handleInputChange(setDenB, e.target.value, true)}
                            className="w-full text-center font-mono font-black text-sm outline-none text-orange-600"
                        />
                          <button onClick={() => adjustValue(setDenB, denB, 1, true)} className="px-1.5 font-bold text-orange-600 hover:bg-slate-50 rounded">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100 space-y-3">
                    <span className="text-xs font-black text-indigo-800 uppercase block tracking-wider">🔢 Ακέραιος Αριθμός (Διαιρέτης)</span>
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Τιμή</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 max-w-[140px] mx-auto">
                        <button onClick={() => adjustValue(setNumB, numB, -1)} className="px-2 py-1 font-bold text-indigo-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={numB}
                          onChange={(e) => handleInputChange(setNumB, e.target.value, false)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-indigo-600"
                        />
                        <button onClick={() => adjustValue(setNumB, numB, 1)} className="px-2 py-1 font-bold text-indigo-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Παιδαγωγική Ανάλυση */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed font-medium">
                {getStepByStepExplanation()}
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ & ΜΑΘΗΜΑΤΙΚΗ ΡΟΗ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[550px] space-y-8">
              
              {/* ΜΕΓΑΛΗ ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ */}
              <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                {activeNumB === 0 ? (
                  <div className="text-red-500 font-bold font-mono">Αδύνατη Πράξη (Διαίρεση με 0)</div>
                ) : (
                  <div className="flex items-center gap-3 sm:gap-4 font-mono font-black text-xl md:text-2xl select-none flex-wrap justify-center">
                    
                    {/* Κλάσμα Α */}
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600">{activeNumA}</span>
                      <div className="w-8 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-blue-600">{activeDenA}</span>
                    </div>

                    {/* Σύμβολο : */}
                    <div className="text-slate-400 font-light text-2xl">:</div>

                    {/* Κλάσμα Β */}
                    <div className="flex flex-col items-center">
                      <span className="text-orange-600">{activeNumB}</span>
                      <div className="w-8 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-orange-600">{activeDenB}</span>
                    </div>

                    {/* Βέλος μετατροπής */}
                    <div className="text-indigo-500 font-bold px-1">➡️</div>

                    {/* Κλάσμα Α σταθερό */}
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600">{activeNumA}</span>
                      <div className="w-8 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-blue-600">{activeDenA}</span>
                    </div>

                    {/* Σύμβολο x */}
                    <div className="text-indigo-500 font-bold">×</div>

                    {/* Αντίστροφο Κλάσμα Β */}
                    <div className="flex flex-col items-center bg-orange-50 p-1 rounded-lg border border-dashed border-orange-300">
                      <span className="text-orange-700 font-bold">{inverseNum}</span>
                      <div className="w-8 h-0.5 bg-slate-700 my-1 rounded-full" />
                      <span className="text-orange-700 font-bold">{inverseDen}</span>
                    </div>

                    <div className="text-slate-500 font-bold">=</div>

                    {/* Αποτέλεσμα */}
                    <div className="flex flex-col items-center bg-emerald-50 border-emerald-100 px-2.5 py-1.5 rounded-xl border">
                      <span className="text-emerald-600">{resultNum}</span>
                      <div className="w-8 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-emerald-600">{resultDen}</span>
                    </div>

                    {/* Απλοποιημένο */}
                    {isSimplified && (
                      <>
                        <div className="text-emerald-600 font-bold">=</div>
                        <div className="flex flex-col items-center bg-emerald-100 border-emerald-200 px-2.5 py-1.5 rounded-xl border">
                          <span className="text-emerald-800">{simplifiedNum}</span>
                          <div className="w-8 h-1 bg-slate-800 my-1 rounded-full" />
                          <span className="text-emerald-800">{simplifiedDen}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* ΑΝΑΒΑΘΜΙΣΜΕΝΗ ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΕ ΔΥΝΑΜΙΚΗ ΚΛΙΜΑΚΑ */}
              <div className="space-y-2 flex-1 flex flex-col justify-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center">📏 Γραφική Αναπαράσταση Μεγεθών (Αυτοπροσαρμοζόμενο Μοντέλο Μπάρας)</span>
                {activeNumB > 0 ? renderBarVisual() : <div className="text-center text-xs text-slate-400 italic">Διαλέξτε έναν διαιρέτη μεγαλύτερο του 0.</div>}
              </div>

              {/* ΠΑΙΔΑΓΩΓΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700 text-white p-4 rounded-xl text-center font-mono font-black text-xs md:text-sm shadow-md">
                💡 Θυμήσου: Όταν διαιρούμε με ένα κλάσμα μικρότερο της μονάδας, το αποτέλεσμα μεγαλώνει, γιατί το μικρό κομμάτι χωράει πολλές φορές μέσα στο μεγάλο!
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαίρεση Κλασμάτων - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
