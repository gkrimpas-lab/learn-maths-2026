import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Μέγιστος επιτρεπόμενος αριθμός για έλεγχο (έως 10 ψηφία)
const MAX_ALLOWED_NUMBER = 9999999999; 

const PRESETS = [5, 7, 12, 15, 23];

export default function ProtoiPage() {
  const [numberStr, setNumberStr] = useState("7");

  const handleInputChange = (val) => {
    // Επιτρέπουμε μόνο ψηφία
    const clean = val.replace(/[^0-9]/g, '');
    
    if (clean === '') {
      setNumberStr('');
    } else {
      // Κρατάμε αυστηρά έως 10 ψηφία για να μην κολλάει το πληκτρολόγιο
      const sliced = clean.slice(0, 10);
      
      if (BigInt(sliced) > BigInt(MAX_ALLOWED_NUMBER)) {
        setNumberStr(MAX_ALLOWED_NUMBER.toString());
      } else {
        setNumberStr(sliced);
      }
    }
  };

  const num = parseInt(numberStr, 10) || 0;

  // Έλεγχος αν ο αριθμός είναι πρώτος (λειτουργεί γρήγορα ακόμα και για μεγάλα BigInt)
  const checkIsPrime = (nStr) => {
    if (!nStr) return false;
    const n = BigInt(nStr);
    if (n <= 1n) return false;
    if (n === 2n || n === 3n) return true;
    if (n % 2n === 0n || n % 3n === 0n) return false;
    
    // Έλεγχος μέχρι τη ρίζα του αριθμού (βελτιστοποιημένος αλγόριθμος)
    for (let i = 5n; i * i <= n; i += 6n) {
      if (n % i === 0n || n % (i + 2n) === 0n) return false;
    }
    return true;
  };

  // Εύρεση διαιρετών ΜΟΝΟ αν ο αριθμός είναι μικρός (για αποφυγή crash του browser)
  const getDivisors = (n) => {
    if (n < 1 || n > 10000) return [];
    const divs = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) divs.push(i);
    }
    return divs;
  };

  const isPrime = checkIsPrime(numberStr);
  const isOneOrZero = numberStr === "0" || numberStr === "1" || numberStr === "";
  
  // Οι διαιρέτες υπολογίζονται και εμφανίζονται μόνο για αριθμούς έως 10.000
  const showDivisorsList = num > 0 && num <= 10000;
  const divisors = showDivisorsList ? getDivisors(num) : [];

  // Εύρεση όλων των ζευγαριών για τη γραφική αναπαράσταση (ΜΟΝΟ έως το 100)
  const getRectangles = (n) => {
    if (n < 1 || n > 100) return [];
    const rects = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) {
        rects.push({ rows: i, cols: n / i });
      }
    }
    return rects;
  };

  const rectangles = getRectangles(num);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Πρώτοι & Σύνθετοι Αριθμοί - LearnMaths.gr</title>
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
                    <span>📖</span> Πρώτοι και Σύνθετοι Αριθμοί
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    • <strong>Πρώτοι αριθμοί</strong> ονομάζονται οι φυσικοί αριθμοί που είναι μεγαλύτεροι από το 1 και έχουν <strong>μόνο δύο διαιρέτες</strong>: το 1 και τον εαυτό τους (π.χ. 2, 3, 5, 7, 11...).
                  </p>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    • <strong>Σύνθετοι αριθμοί</strong> ονομάζονται οι αριθμοί που έχουν <strong>περισσότερους από δύο διαιρέτες</strong> (π.χ. 4, 6, 8, 9, 10...).
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-md space-y-2 flex flex-col justify-center">
                <span className="text-amber-300 font-black text-base block border-b border-white/20 pb-1">⚠️ Προσοχή στα SOS:</span>
                <ul className="space-y-1.5 text-xs md:text-sm text-indigo-50 list-disc pl-4 font-medium">
                  <li>Το <strong>0</strong> και το <strong>1</strong> δεν είναι ούτε πρώτοι ούτε σύνθετοι αριθμοί!</li>
                  <li>Ο αριθμός <strong>2</strong> είναι ο μοναδικός <strong>ζυγός (άρτιος)</strong> αριθμός που είναι πρώτος! Όλοι οι άλλοι πρώτοι είναι μονοί (περιττοί).</li>
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
                  <p className="text-gray-500 text-xs">Γράψε έναν αριθμό (έως 10 ψηφία) για να δεις την κατηγορία του.</p>
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={numberStr}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-2xl font-mono font-black text-center p-3 bg-slate-50 border-2 border-blue-200 rounded-xl shadow-inner text-blue-600 outline-none focus:border-blue-500 tracking-widest max-w-full break-all"
                    placeholder="π.χ. 7"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Γρήγορα Παραδείγματα:</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setNumberStr(preset.toString())}
                        className={`px-4 py-2 rounded-xl border font-mono font-bold text-sm transition-all ${numberStr === preset.toString() ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΑΝΑΛΥΣΗ ΚΑΙ ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[600px]">
              
              {/* ΤΑΥΤΟΤΗΤΑ ΑΡΙΘΜΟΥ */}
              <div className="w-full text-center mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Αναλυση για τον Αριθμο:</span>
                <div className="text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-8 py-2 rounded-xl border border-indigo-100 inline-block mt-2 tracking-widest max-w-full break-all">
                  {numberStr || "—"}
                </div>

                {numberStr && (
                  <div className="mt-4">
                    {isOneOrZero ? (
                      <span className="text-sm font-black px-4 py-2 rounded-xl bg-gray-100 text-gray-700 border border-gray-200 inline-block">
                        ⚠️ Ειδική Περίπτωση: Δεν είναι ούτε Πρώτος ούτε Σύνθετος!
                      </span>
                    ) : isPrime ? (
                      <span className="text-sm font-black px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                        ⭐ ΠΡΩΤΟΣ ΑΡΙΘΜΟΣ!
                      </span>
                    ) : (
                      <span className="text-sm font-black px-4 py-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 inline-block">
                        🧱 ΣΥΝΘΕΤΟΣ ΑΡΙΘΜΟΣ!
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* ΔΙAΙΡΕΤΕΣ (Μόνο για αριθμούς έως 10.000) */}
              {numberStr && !isOneOrZero && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 mb-6">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    🔍 Πληροφορίες Διαιρετών:
                  </div>
                  {showDivisorsList ? (
                    <>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {divisors.map(d => (
                          <span key={d} className="font-mono font-black px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg shadow-sm">
                            {d}
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 pt-1">
                        {isPrime 
                          ? `Ο αριθμός ${num} έχει ακριβώς 2 διαιρέτες, γι' αυτό είναι Πρώτος!` 
                          : `Ο αριθμός ${num} έχει ${divisors.length} διαιρέτες, γι' αυτό είναι Σύνθετος!`}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-600 font-medium py-1">
                      {isPrime 
                        ? "Αυτός ο πολύ μεγάλος αριθμός διαιρείται μόνο με το 1 και τον εαυτό του! (Πρώτος)" 
                        : "Αυτός ο πολύ μεγάλος αριθμός έχει και άλλους διαιρέτες εκτός από το 1 και τον εαυτό του! (Σύνθετος)"}
                    </p>
                  )}
                </div>
              )}

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ (Έως το 100) */}
              <div className="w-full flex-1 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block text-center">
                    💻 Γραφικη Αναπαρασταση: Ορθογωνιοι Σχηματισμοι
                  </span>
                </div>

                <div className="space-y-8 my-auto overflow-y-auto max-h-[320px] pr-2 py-4 flex flex-col justify-center">
                  {isOneOrZero ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      Οι αριθμοί 0 και 1 δεν μπορούν να σχηματίσουν ορθογώνια πλέγματα.
                    </div>
                  ) : num > 100 ? (
                    /* Το κατάλληλο μήνυμα για αριθμούς πάνω από 100 */
                    <div className="text-center py-8 px-4 max-w-md mx-auto space-y-2">
                      <div className="text-3xl">📐</div>
                      <h4 className="text-sm font-black text-amber-400 uppercase tracking-wide">Ο αριθμος ειναι πολυ μεγσλος για κουτακια!</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Η γραφική αναπαράσταση με κουτάκια λειτουργεί για αριθμούς <strong>έως το 100</strong>. 
                        Για μεγαλύτερους αριθμούς, τα κουτάκια θα γίνονταν τόσο μικρά που δεν θα μπορούσες να τα μετρήσεις εύκολα!
                      </p>
                    </div>
                  ) : num > 0 && rectangles.length > 0 ? (
                    rectangles.map((rect, idx) => (
                      <div key={idx} className="space-y-2 border-b border-slate-800 pb-6 last:border-0 last:pb-0 flex flex-col items-center">
                        <div className="text-xs font-mono text-slate-400">
                          Διάταξη: <span className="text-yellow-400 font-bold">{rect.rows} γραμμές</span> × <span className="text-blue-400 font-bold">{rect.cols} στήλες</span> = {num}
                        </div>
                        
                        <div 
                          className="grid gap-1 bg-slate-800 p-2 rounded-lg border border-slate-700"
                          style={{ 
                            gridTemplateColumns: `repeat(${rect.cols}, minmax(0, 1fr))`,
                            width: `${Math.min(rect.cols * 24, 280)}px` 
                          }}
                        >
                          {Array.from({ length: num }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-4 rounded-sm transition-all ${isPrime ? 'bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.3)]'}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500">
                      Γράψε έναν αριθμό για να ξεκινήσει η οπτικοποίηση.
                    </div>
                  )}
                </div>

                {num > 1 && num <= 100 && (
                  <div className="text-center text-[11px] font-medium text-slate-400 border-t border-slate-800 pt-3">
                    {isPrime ? (
                      <span>💡 Παρατήρησε ότι στους <strong>Πρώτους</strong> αριθμούς μπορείς να φτιάξεις μόνο <strong>2 σχήματα</strong> (μια μεγάλη γραμμή ή μια μεγάλη στήλη)!</span>
                    ) : (
                      <span>💡 Παρατήρησε ότι στους <strong>Σύνθετους</strong> αριθμούς μπορείς να φτιάξεις <strong>περισσότερα από 2 σχήματα</strong>!</span>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Πρώτοι & Σύνθετοι Αριθμοί - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
