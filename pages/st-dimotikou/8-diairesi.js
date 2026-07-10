// pages/st-dimotikou/8-diairesi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ΜΕΤΑΒΛΗΤΕΣ ΟΡΙΩΝ ΓΙΑ ΑΣΦΑΛΕΣ UI
const LIMITS = {
  MIN_DIVISOR: 1,
  MAX_DIVIDEND: 999999, // Έως 6 ψηφία
  MAX_DIVISOR_INPUT: 999,
  MAX_VISUAL_BOXES: 120 // Όριο για την οπτικοποίηση του μοιράσματος
};

export default function DiairesiPage() {
  const [activeTab, setActiveTab] = useState('katheti'); // 'katheti' ή 'moirasma'
  
  // Κατάσταση για την πράξη
  const [dividendInput, setDividendInput] = useState("145");
  const [divisorInput, setDivisorInput] = useState("12");

  const D = parseFloat(dividendInput) || 0;
  const d = parseFloat(divisorInput) || LIMITS.MIN_DIVISOR;

  // Υπολογισμοί Πηλίκου και Υπολοίπου (για φυσικούς/δεκαδικούς)
  const isDecimalOperation = dividendInput.includes('.') || divisorInput.includes('.');
  
  let q = 0; // Πηλίκο
  let r = 0; // Υπόλοιπο

  if (isDecimalOperation) {
    q = D / d;
    r = 0; 
  } else {
    q = Math.floor(D / d);
    r = D % d;
  }

  const isPerfect = isDecimalOperation ? (D % d === 0) : (r === 0);

  // Ασφαλής έλεγχος inputs
  const handleInputChange = (val, setter, isDivisor = false) => {
    const cleanVal = val.replace(/[^0-9.]/g, '');
    if ((cleanVal.match(/\./g) || []).length <= 1) {
      const parts = cleanVal.split('.');
      if (!parts[0] || parts[0].length <= (isDivisor ? 3 : 6)) {
        if (isDivisor && parseFloat(cleanVal) === 0) return; 
        setter(cleanVal);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>➗ Η Έννοια της Διαίρεσης - LearnMaths.gr</title>
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
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>📖</span> Θεωρία: Τέλεια και Ατελής Διαίρεση
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  **Διαίρεση** είναι η πράξη με την οποία μοιράζουμε έναν αριθμό σε ίσα μέρη. Είναι η αντίστροφη πράξη του πολλαπλασιασμού.
                </p>
                <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 text-sm md:text-base font-medium">
                  <p>🎯 <strong>Τέλεια Διαίρεση:</strong> Είναι η διαίρεση στην οποία το υπόλοιπο είναι ακριβώς **0** (π.χ. 12 : 3 = 4).</p>
                  <p>🔍 <strong>Ατελής Διαίρεση:</strong> Είναι η διαίρεση στην οποία περισσεύει υπόλοιπο **διαφορετικό του μηδενός** (π.χ. 14 : 3 = 4 και υπόλοιπο 2).</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md space-y-3 text-center py-8">
                <span className="text-amber-300 font-black text-lg">🧪 Η Μαθηματική Επαλήθευση</span>
                <div className="bg-white/10 p-4 rounded-xl font-mono text-sm md:text-base tracking-wide inline-block text-left">
                  <div className="font-bold text-center text-amber-200 text-lg mb-2">Δ ＝ δ × π ＋ υ</div>
                  <div>• <strong>Δ</strong> (Διαιρετέος): O αριθμός που μοιράζουμε</div>
                  <div>• <strong>δ</strong> (διαιρέτης): Σε πόσα μέρη μοιράζουμε</div>
                  <div>• <strong>π</strong> (πηλίκο): Το αποτέλεσμα της διαίρεσης</div>
                  <div>• <strong>υ</strong> (υπόλοιπο): Αυτό που περισσεύει (πάντα μικρότερο από το δ)</div>
                </div>
              </div>
            </div>
          </div>

          {/* TABS ΕΝΑΛΛΑΓΗΣ */}
          <div className="flex justify-center bg-gray-200/60 p-1.5 rounded-2xl max-w-md mx-auto shadow-inner">
            <button  
              onClick={() => setActiveTab('katheti')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'katheti' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              📊 Κάθετη Πράξη (Τ)
            </button>
            <button  
              onClick={() => setActiveTab('moirasma')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'moirasma' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              🍕 Οπτικό Μείρασμα
            </button>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[480px] w-full gap-6">
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900">
                  {activeTab === 'katheti' ? "Διαδραστική Κάθετη Διαίρεση" : "Μοντέλο Οπτικής Κατανομής"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {activeTab === 'moirasma' && D > LIMITS.MAX_VISUAL_BOXES 
                    ? `Βάλε Διαιρετέο έως ${LIMITS.MAX_VISUAL_BOXES} για να δεις το οπτικό μοίρασμα.` 
                    : "Γράψε τον Διαιρετέο και τον Διαιρέτη για να εκτελεστεί η πράξη."}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col gap-4 shadow-inner my-auto">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                  
                  {/* Input Διαιρετέος */}
                  <div className="flex flex-col items-center gap-1 w-full sm:max-w-[160px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Διαιρετέος (Δ)</span>
                    <input  
                      type="text"  
                      value={dividendInput}
                      onChange={(e) => handleInputChange(e.target.value, setDividendInput)}
                      className="text-lg font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-sm w-full text-blue-600 outline-none focus:border-blue-500 tracking-normal font-mono"
                      placeholder="π.χ. 145"
                    />
                  </div>

                  <span className="text-xl font-black text-slate-400 mt-4 flex-shrink-0">÷</span>

                  {/* Input Διαιρέτης */}
                  <div className="flex flex-col items-center gap-1 w-full sm:max-w-[140px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Διαιρέτης (δ)</span>
                    <input  
                      type="text"  
                      value={divisorInput}
                      onChange={(e) => handleInputChange(e.target.value, setDivisorInput, true)}
                      className="text-lg font-black text-center p-2.5 bg-white border-2 border-emerald-200 rounded-xl shadow-sm w-full text-emerald-600 outline-none focus:border-emerald-500 tracking-normal font-mono"
                      placeholder="π.χ. 12"
                    />
                  </div>
                </div>

                {/* Οριζόντια Ισότητα & Τύπος Διαίρεσης */}
                <div className="bg-white p-3 rounded-xl border shadow-sm text-center flex flex-col gap-1.5 font-sans">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Κατάσταση Πράξης:</div>
                  <div className={`text-base font-black px-4 py-1 rounded-full inline-block mx-auto ${isPerfect ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                    {isPerfect ? "🎯 ΤΕΛΕΙΑ ΔΙΑΙΡΕΣΗ" : "🔍 ΑΤΕΛΗΣ ΔΙΑΙΡΕΣΗ"}
                  </div>
                </div>
              </div>

              {/* Πλαίσιο Μαθηματικής Επαλήθευσης */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xs md:text-sm font-mono font-bold text-slate-600 shadow-inner">
                ✨ Επαλήθευση: {q.toLocaleString('el-GR', { maximumFractionDigits: 3 })} × {d} + {isDecimalOperation ? "0" : r} = <strong>{D.toLocaleString('el-GR')}</strong>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[480px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              {activeTab === 'katheti' ? (
                /* ΚΑΘΕΤΟ ΣΧΗΜΑ ΔΙΑΙΡΕΣΗΣ (Τ) */
                <div className="my-auto flex flex-col items-center gap-4 w-full max-w-[280px]">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Σχολική Κάθετη Διάταξη:</span>
                  
                  <div className="w-full font-mono text-2xl font-black text-slate-800 relative py-4 select-none px-6">
                    <div className="grid grid-cols-2 gap-x-6 relative">
                      
                      {/* Πάνω Αριστερά: Διαιρετέος */}
                      <div className="text-right text-blue-600 pb-3 pr-2 truncate">
                        {dividendInput || "0"}
                      </div>
                      
                      {/* Πάνω Δεξιά: Διαιρέτης */}
                      <div className="text-left text-emerald-600 pb-3 pl-4 border-l-4 border-b-4 border-slate-700 truncate">
                        {divisorInput || "1"}
                      </div>

                      {/* Κάτω Αριστερά: Υπόλοιπο */}
                      <div className="text-right text-rose-500 pt-3 pr-2 truncate">
                        {isDecimalOperation ? "0" : r}
                      </div>

                      {/* Κάτω Δεξιά: Πηλίκο */}
                      <div className="text-left text-purple-600 pt-3 pl-4 border-l-4 border-slate-700 truncate">
                        {q.toLocaleString('el-GR', { maximumFractionDigits: 3 })}
                      </div>

                    </div>
                  </div>
                  
                  <div className="flex justify-between w-full text-[10px] font-bold text-slate-400 border-t pt-3 uppercase px-2 tracking-tight">
                    <span>🔵 Δ = Διαιρετέος</span>
                    <span>🟢 δ = Διαιρέτης</span>
                  </div>
                </div>
              ) : (
                /* ΟΠΤΙΚΟ ΜΟΙΡΑΣΜΑ ΣΕ ΟΜΑΔΕΣ */
                <div className="my-auto flex flex-col items-center gap-4 w-full px-2 text-center">
                  {D <= LIMITS.MAX_VISUAL_BOXES && D > 0 && d > 0 ? (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Μοίρασμα σε {Math.floor(d)} ίσες ομάδες:</span>
                      
                      <div className="flex flex-wrap gap-2 justify-center max-h-[260px] overflow-y-auto p-2 border rounded-xl bg-slate-50 w-full shadow-inner">
                        {[...Array(Math.min(Math.floor(d), 30))].map((_, groupIdx) => (
                          <div key={groupIdx} className="bg-white border-2 border-emerald-300 p-2 rounded-xl flex flex-wrap gap-1 items-center justify-center min-w-[50px] min-h-[50px]">
                            {[...Array(q)].map((_, boxIdx) => (
                              <div key={boxIdx} className="w-3 h-3 bg-blue-500 rounded-sm" />
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Εμφάνιση Υπολοίπου */}
                      {!isDecimalOperation && r > 0 && (
                        <div className="flex flex-col items-center gap-1.5 mt-1 animate-pulse">
                          <span className="text-xs font-bold text-rose-500 uppercase tracking-wide">📦 Περίσσεψαν (Υπόλοιπο):</span>
                          <div className="flex gap-1 bg-rose-50 border border-rose-200 p-2 rounded-lg">
                            {[...Array(r)].map((_, i) => (
                              <div key={i} className="w-3 h-3 bg-rose-500 rounded-sm" />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl max-w-xs mx-auto text-slate-500 text-sm font-medium space-y-2 shadow-inner">
                      <p>📊 <strong>Αριθμητική Απεικόνιση</strong></p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isDecimalOperation 
                          ? "Η οπτική κατανομή σε κουτάκια υποστηρίζει μόνο ακέραιες διαιρέσεις, αλλά η κάθετη διάταξη λειτουργεί κανονικά με δεκαδικά ψηφία!"
                          : `Βάλε Διαιρετέο μικρότερο από ${LIMITS.MAX_VISUAL_BOXES} για να δεις τα κουτάκια να μοιράζονται αυτόματα στις ομάδες.`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>🔍 Το υπόλοιπο (υ) μιας ακέραιης διαίρεσης είναι πάντα μικρότερο από τον διαιρέτη (δ).</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Διαίρεση ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
