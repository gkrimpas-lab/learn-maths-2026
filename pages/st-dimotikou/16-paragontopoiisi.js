import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Μέγιστος επιτρεπόμενος αριθμός (έως 10 ψηφία)
const MAX_ALLOWED_NUMBER = 9999999999; 

const PRESETS = [12, 24, 36, 45, 60];

export default function ParagontopoiisiPage() {
  const [numberStr, setNumberStr] = useState("24");

  const handleInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    
    if (clean === '') {
      setNumberStr('');
    } else {
      const sliced = clean.slice(0, 10);
      if (BigInt(sliced) > BigInt(MAX_ALLOWED_NUMBER)) {
        setNumberStr(MAX_ALLOWED_NUMBER.toString());
      } else {
        setNumberStr(sliced);
      }
    }
  };

  const currentBigInt = numberStr ? BigInt(numberStr) : 0n;
  const numForTree = (currentBigInt <= 100n && currentBigInt > 0n) ? Number(currentBigInt) : 0;

  // Εύρεση Πρώτων Παραγόντων (Ανάλυση) για οποιονδήποτε μεγάλο αριθμό BigInt
  const getPrimeFactors = (nStr) => {
    if (!nStr) return [];
    let n = BigInt(nStr);
    if (n <= 1n) return [];
    
    const factors = [];
    let d = 2n;
    
    while (d * d <= n) {
      while (n % d === 0n) {
        factors.push(Number(d));
        n /= d;
      }
      d++;
    }
    if (n > 1n) {
      factors.push(Number(n));
    }
    return factors.sort((a, b) => a - b);
  };

  const factors = getPrimeFactors(numberStr);

  // Δημιουργία μορφής γινομένου με δυνάμεις (π.χ. 2^3 * 3)
  const getFactorsExpression = (factArr) => {
    if (factArr.length === 0) return "";
    const counts = {};
    factArr.forEach(f => counts[f] = (counts[f] || 0) + 1);
    
    return Object.keys(counts).map(f => {
      return counts[f] > 1 ? `${f}³` : `${f}`; // Απλή σημείωση δύναμης για δημοτικό, ή απλά f^counts[f]
    }).join(' × ');
  };

  // Εναλλακτική απλή εμφάνιση γινομένου για παιδιά (π.χ. 2 × 2 × 2 × 3)
  const cleanExpression = factors.join(' × ');

  // Παραγωγή των βημάτων του "Δέντρου Παραγοντοποίησης" (Μόνο για n <= 100)
  const generateTreeSteps = (n) => {
    if (n <= 1 || n > 100) return [];
    const steps = [];
    let current = n;
    
    // Βρίσκουμε διαδοχικά τον μικρότερο πρώτο διαιρέτη για να σπάμε το δέντρο
    while (current > 1) {
      let divisor = 2;
      while (current % divisor !== 0) {
        divisor++;
      }
      const next = current / divisor;
      steps.push({ current, divisor, next });
      current = next;
      if (divisor === current + next) break; // Ασφάλεια
    }
    return steps;
  };

  const treeSteps = generateTreeSteps(numForTree);
  const isOneOrZero = numberStr === "0" || numberStr === "1" || numberStr === "";

  // Έλεγχος αν ο ίδιος ο αριθμός είναι πρώτος
  const isPrime = factors.length === 1 && numberStr !== "1" && numberStr !== "0";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🌿 Παραγοντοποίηση Φυσικών Αριθμών - LearnMaths.gr</title>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <span>📖</span> Παραγοντοποίηση Αριθμών
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    • <strong>Παραγοντοποίηση</strong> είναι η διαδικασία κατά την οποία γράφουμε έναν σύνθετο αριθμό ως <strong>γινόμενο άλλων αριθμών</strong> (παραγόντων).
                  </p>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    • <strong>Ανάλυση σε γινόμενο πρώτων παραγόντων</strong> ονομάζεται η γραφή ενός αριθμού <strong>μόνο με πρώτους αριθμούς</strong> (π.χ. $24 = 2 \times 2 \times 2 \times 3$). Κάθε σύνθετος αριθμός μπορεί να αναλυθεί με έναν μοναδικό τρόπο!
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-md space-y-2 flex flex-col justify-center">
                <span className="text-amber-300 font-black text-base block border-b border-white/20 pb-1">💡 Πώς το κάνουμε στην τάξη:</span>
                <ul className="space-y-1.5 text-xs md:text-sm text-emerald-50 list-disc pl-4 font-medium">
                  <li><strong>Μέθοδος με Δεντροδιάγραμμα:</strong> Σπάμε διαδοχικά τον αριθμό σε δύο «κλαδιά» (γινόμενα) μέχρι όλα τα τελειώματα να είναι πρώτοι αριθμοί.</li>
                  <li><strong>Μέθοδος με Κατακόρυφη Γραμμή:</strong> Κάνουμε συνεχείς διαιρέσεις μόνο με πρώτους αριθμούς (2, 3, 5, 7...) μέχρι να φτάσουμε στο 1.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: INPUT & PRESETS */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 justify-between lg:h-fit">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Διάλεξε έναν Αριθμό!</h3>
                  <p className="text-gray-500 text-xs">Γράψε έναν αριθμό (έως 10 ψηφία) για να τον αναλύσεις.</p>
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={numberStr}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-2xl font-mono font-black text-center p-3 bg-slate-50 border-2 border-emerald-200 rounded-xl shadow-inner text-emerald-600 outline-none focus:border-emerald-500 tracking-widest max-w-full break-all"
                    placeholder="π.χ. 24"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Γρήγορα Παραδείγματα:</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setNumberStr(preset.toString())}
                        className={`px-4 py-2 rounded-xl border font-mono font-bold text-sm transition-all ${numberStr === preset.toString() ? 'bg-emerald-50 border-emerald-400 text-emerald-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΑΝΑΛΥΣΗ ΚΑΙ ΓΡΑΦΙΚΟ ΔΕΝΤΡΟ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[600px]">
              
              {/* ΑΠΟΤΕΛΕΣΜΑ ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗΣ */}
              <div className="w-full text-center mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Γινόμενο Πρώτων Παραγόντων:</span>
                
                {isOneOrZero ? (
                  <div className="text-xl font-mono font-black text-gray-400 bg-gray-50 px-8 py-4 rounded-xl border border-gray-100 inline-block mt-2">
                    Οι αριθμοί 0 και 1 δεν αναλύονται σε πρώτους παράγοντες.
                  </div>
                ) : (
                  <div className="space-y-3 mt-2">
                    <div className="text-2xl md:text-3xl font-mono font-black text-emerald-600 bg-emerald-50 px-8 py-3 rounded-2xl border border-emerald-100 inline-block tracking-wide max-w-full break-all">
                      {numberStr} = {cleanExpression}
                    </div>
                    {isPrime && (
                      <div className="text-xs text-amber-600 font-bold">
                        ℹ️ Ο αριθμός είναι ήδη Πρώτος, οπότε ο μόνος πρώτος παράγοντας είναι ο εαυτός του!
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ΠΙΝΑΚΑΣ Ή ΛΙΣΤΑ ΠΑΡΑΓΟΝΤΩΝ */}
              {!isOneOrZero && numberStr && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 mb-6">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    📊 Συγκεντρωτικοί Πρώτοι Παράγοντες:
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {factors.map((f, idx) => (
                      <span key={idx} className="font-mono font-black px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-sm rounded-lg shadow-sm">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ: ΔΕΝΤΡΟ ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗΣ */}
              <div className="w-full flex-1 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block text-center">
                    🌿 Γραφική Αναπαράσταση: Δέντρο Παραγοντοποίησης
                  </span>
                </div>

                <div className="space-y-6 my-auto overflow-y-auto max-h-[380px] pr-2 py-4 w-full flex flex-col items-center justify-center">
                  {isOneOrZero ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      Δεν υπάρχει δεντροδιάγραμμα για τους αριθμούς 0 και 1.
                    </div>
                  ) : currentBigInt > 100n ? (
                    /* Μήνυμα για μεγάλους αριθμούς */
                    <div className="text-center py-8 px-4 max-w-md mx-auto space-y-2">
                      <div className="text-3xl">🌳</div>
                      <h4 className="text-sm font-black text-amber-400 uppercase tracking-wide">Το δέντρο θα μεγάλωνε υπερβολικά!</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Η οπτική αναπαράσταση σε μορφή δέντρου εμφανίζεται για αριθμούς <strong>έως το 100</strong>. 
                        Για μεγαλύτερους αριθμούς, τα κλαδιά θα μπερδεύονταν στην οθόνη, αλλά μπορείς να δεις την πλήρη ανάλυση στο πράσινο πλαίσιο πιο πάνω!
                      </p>
                    </div>
                  ) : isPrime ? (
                    <div className="text-center py-6 text-xs text-slate-400 bg-slate-800/40 p-4 rounded-xl border border-slate-800 max-w-xs">
                      ⭐ Επειδή ο αριθμός <strong>{numberStr}</strong> είναι πρώτος, δεν μπορεί να «σπάσει» σε κλαδιά άλλων αριθμών!
                    </div>
                  ) : treeSteps.length > 0 ? (
                    /* Σχεδίαση των επιπέδων του Δέντρου */
                    <div className="flex flex-col items-center space-y-4 w-full">
                      {treeSteps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center w-full max-w-xs">
                          {/* Ο τρέχων αριθμός (Κορυφή) */}
                          {idx === 0 && (
                            <div className="bg-slate-800 border-2 border-amber-400 px-4 py-1.5 rounded-xl font-mono font-black text-base shadow-md mb-2">
                              {step.current}
                            </div>
                          )}
                          
                          {/* Τα δύο βέλη/κλαδιά */}
                          <div className="flex justify-between w-32 text-slate-500 font-light text-xs tracking-widest leading-none h-4">
                            <span>/</span>
                            <span>\</span>
                          </div>

                          {/* Οι δύο νέοι κόμβοι */}
                          <div className="flex justify-between w-48 pt-1">
                            {/* Αριστερά: Ο Πρώτος Παράγοντας (Κυκλάκι) */}
                            <div className="bg-emerald-600 text-white font-mono font-black text-sm w-9 h-9 rounded-full flex items-center justify-center shadow-md border border-emerald-400">
                              {step.divisor}
                            </div>
                            
                            {/* Δεξιά: Το υπόλοιπο που συνεχίζει (ή σταματάει αν είναι πρώτος) */}
                            <div className={`font-mono font-black text-sm px-3 py-1 rounded-xl shadow-md border ${idx === treeSteps.length - 1 ? 'bg-emerald-600 border-emerald-400 rounded-full w-9 h-9 flex items-center justify-center' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                              {step.next}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500">
                      Γράψε έναν αριθμό για να ξεκινήσει η οπτικοποίηση.
                    </div>
                  )}
                </div>

                {!isOneOrZero && currentBigInt <= 100n && !isPrime && (
                  <div className="text-center text-[11px] font-medium text-slate-400 border-t border-slate-800 pt-3">
                    <span>💡 Παρατήρησε ότι όλα τα **πράσινα κυκλάκια** (τα τελειώματα των κλαδιών) είναι οι πρώτοι αριθμοί που αν τους πολλαπλασιάσεις, σου δίνουν το {numberStr}!</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Παραγοντοποίηση Φυσικών Αριθμών - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
