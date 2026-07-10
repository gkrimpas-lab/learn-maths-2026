// pages/st-dimotikou/8-diairesi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  MIN_DIVISOR: 1,
  MAX_DIVIDEND: 9999, // Έως 4 ψηφία για απόλυτη σχολική στοίχιση
  MAX_DIVISOR_INPUT: 99,
  MAX_VISUAL_BOXES: 120
};

export default function DiairesiPage() {
  const [activeTab, setActiveTab] = useState('katheti'); // 'katheti' ή 'moirasma'
  
  // Κατάσταση για την πράξη
  const [dividendInput, setDividendInput] = useState("1569");
  const [divisorInput, setDivisorInput] = useState("8");

  const D = Math.floor(parseFloat(dividendInput)) || 0;
  const d = Math.floor(parseFloat(divisorInput)) || LIMITS.MIN_DIVISOR;

  // Βασικοί υπολογισμοί
  const q = Math.floor(D / d);
  const r = D % d;
  const isPerfect = r === 0;

  // Παραγωγή των αναλυτικών σχολικών βημάτων με ακριβείς θέσεις ψηφίων
  const generateSchoolSteps = () => {
    if (D === 0 || d === 0) return [];
    
    const steps = [];
    const divStr = D.toString();
    let currentVal = 0;
    
    for (let i = 0; i < divStr.length; i++) {
      const nextDigit = parseInt(divStr[i]);
      currentVal = currentVal * 10 + nextDigit;
      
      if (currentVal >= d || i === divStr.length - 1) {
        const times = Math.floor(currentVal / d);
        const product = times * d;
        const remainder = currentVal - product;
        
        if (times > 0 || steps.length > 0 || i === divStr.length - 1) {
          steps.push({
            workNum: currentVal,
            product: product,
            remainder: remainder,
            digitIndex: i // Το index του ψηφίου που μόλις κατέβηκε
          });
        }
        
        currentVal = remainder;
      }
    }
    return steps;
  };

  const schoolSteps = generateSchoolSteps();
  const divDigits = D.toString().split('');
  const maxDigits = divDigits.length;

  // Ασφαλής έλεγχος των inputs
  const handleInputChange = (val, setter, isDivisor = false) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    if (cleanVal.length <= (isDivisor ? 2 : 4)) {
      if (isDivisor && parseInt(cleanVal) === 0) return;
      setter(cleanVal);
    }
  };

  // Βοηθητική συνάρτηση για τη μετατροπή αριθμού σε πίνακα ψηφίων με padding στα αριστερά
  const getPaddedDigits = (num, endIndex) => {
    const numStr = num.toString();
    const digits = new Array(maxDigits).fill('');
    
    let numIdx = numStr.length - 1;
    for (let i = endIndex; i >= 0 && numIdx >= 0; i--) {
      digits[i] = numStr[numIdx];
      numIdx--;
    }
    return digits;
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
                  "Διαίρεση" είναι η πράξη με την οποία μοιράζουμε έναν αριθμό σε ίσα μέρη. Είναι η αντίστροφη πράξη του πολλαπλασιασμού.
                </p>
                <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 text-sm md:text-base font-medium">
                  <p>🎯 <strong>Τέλεια Διαίρεση:</strong> Είναι η διαίρεση στην οποία το υπόλοιπο είναι ακριβώς "0" (π.χ. 12 : 3 = 4).</p>
                  <p>🔍 <strong>Ατελής Διαίρεση:</strong> Είναι η διαίρεση στην οποία περισσεύει υπόλοιπο "διάφορο του μηδενός" (π.χ. 14 : 3 = 4 και υπόλοιπο 2).</p>
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
              📊 Κάθετη Πράξη με Βήματα
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
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full gap-6">
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900">
                  {activeTab === 'katheti' ? "Διαδραστική Διαίρεση με Σχολικά Βήματα" : "Μοντέλο Οπτικής Κατανομής"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {activeTab === 'moirasma' && D > LIMITS.MAX_VISUAL_BOXES 
                    ? `Βάλε Διαιρετέο έως ${LIMITS.MAX_VISUAL_BOXES} για να δεις το οπτικό μοίρασμα.` 
                    : "Γράψε φυσικούς αριθμούς για να παραχθούν αυτόματα όλα τα ενδιάμεσα βήματα της πράξης."}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col gap-4 shadow-inner my-auto">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                  
                  {/* Input Διαιρετέος */}
                  <div className="flex flex-col items-center gap-1 w-full sm:max-w-[160px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Διαιρετεος (Δ)</span>
                    <input  
                      type="text"  
                      value={dividendInput}
                      onChange={(e) => handleInputChange(e.target.value, setDividendInput)}
                      className="text-lg font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-sm w-full text-blue-600 outline-none focus:border-blue-500 tracking-normal font-mono"
                      placeholder="π.χ. 1569"
                    />
                  </div>

                  <span className="text-xl font-black text-slate-400 mt-4 flex-shrink-0">÷</span>

                  {/* Input Διαιρέτης */}
                  <div className="flex flex-col items-center gap-1 w-full sm:max-w-[140px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Διαιρετης (δ)</span>
                    <input  
                      type="text"  
                      value={divisorInput}
                      onChange={(e) => handleInputChange(e.target.value, setDivisorInput, true)}
                      className="text-lg font-black text-center p-2.5 bg-white border-2 border-emerald-200 rounded-xl shadow-sm w-full text-emerald-600 outline-none focus:border-emerald-500 tracking-normal font-mono"
                      placeholder="π.χ. 8"
                    />
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border shadow-sm text-center flex flex-col gap-1.5 font-sans">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Κατασταση Πραξης:</div>
                  <div className={`text-base font-black px-4 py-1 rounded-full inline-block mx-auto ${isPerfect ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                    {isPerfect ? "🎯 ΤΕΛΕΙΑ ΔΙΑΙΡΕΣΗ" : "🔍 ΑΤΕΛΗΣ ΔΙΑΙΡΕΣΗ"}
                  </div>
                </div>
              </div>

              {/* Πλαίσιο Μαθηματικής Επαλήθευσης */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xs md:text-sm font-mono font-bold text-slate-600 shadow-inner">
                ✨ Επαλήθευση: {q.toLocaleString('el-GR')} × {d} + {r} = <strong>{D.toLocaleString('el-GR')}</strong>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΠΙΝΑΚΑΣ ΜΕ ΑΠΟΛΥΤΗ ΠΡΟΣΤΑΣΙΑ ΑΠΟΣΤΑΣΗΣ ΓΙΑ ΤΟ ΜΕΙΟΝ (-) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <div className="my-auto flex flex-col items-center gap-2 w-full max-w-[360px] px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Πληρης Αναλυση Πραξης:</span>
                
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border-4 border-slate-700 font-mono text-xl md:text-2xl font-black relative min-h-[340px] flex py-8 select-none w-full justify-center">
                  
                  {/* Σχολικό Σχήμα Διαίρεσης (3 Στήλες Flex-Layout) */}
                  <div className="flex w-full items-start justify-center">
                    
                    {/* ΑΡΙΣΤΕΡΟ ΜΕΡΟΣ: ΔΙAIPETEOΣ & ΚΑΘΕΤΕΣ ΑΦΑΙΡΕΣΕΙΣ */}
                    <div className="flex flex-col items-end pr-4 text-right">
                      
                      {/* 1. Αρχικός Διαιρετέος (με dummy στήλη αριστερά για συμμετρία) */}
                      <div className="flex justify-end text-blue-400 font-bold mb-3 h-8 items-center">
                        <div className="w-6"></div> {/* Χώρος για ευθυγράμμιση με τις κάτω σειρές */}
                        <div className="flex justify-end">
                          {divDigits.map((char, i) => (
                            <span key={i} className="w-5 text-center">{char}</span>
                          ))}
                        </div>
                      </div>
                      
                      {/* 2. Δυναμικά Στοιχισμένα Βήματα */}
                      <div className="flex flex-col items-end space-y-2 w-full">
                        {schoolSteps.map((step, idx) => {
                          const productDigits = getPaddedDigits(step.product, step.digitIndex);
                          const remainderDigits = getPaddedDigits(step.remainder, step.digitIndex);

                          return (
                            <div key={idx} className="flex flex-col items-end w-full">
                              
                              {/* Σειρά Αφαίρεσης: Καθαρή 2-column διάταξη (Μείον + Ψηφία) */}
                              <div className="flex items-center justify-end w-full h-7">
                                <span className="w-6 text-left text-red-500 font-semibold text-base md:text-lg select-none">-</span>
                                <div className="flex justify-end text-red-400 font-medium">
                                  {productDigits.map((char, i) => (
                                    <span key={i} className="w-5 text-center">{char}</span>
                                  ))}
                                </div>
                              </div>

                              {/* Οριζόντια Γραμμή Αφαίρεσης */}
                              <div className="w-full flex justify-end h-[2px] my-1">
                                <div className="w-6"></div> {/* bypass τη στήλη του μείον */}
                                <div className="flex justify-end">
                                  {productDigits.map((char, i) => (
                                    <div key={i} className={`w-5 h-full ${char !== '' ? 'bg-slate-700' : ''}`}></div>
                                  ))}
                                </div>
                              </div>

                              {/* Σειρά Αποτελέσματος / Επόμενου Αριθμού Εργασίας */}
                              <div className="flex justify-end w-full h-7 items-center">
                                <div className="w-6"></div> {/* bypass τη στήλη του μείον */}
                                <div className="flex justify-end text-slate-300 font-extrabold">
                                  {idx === schoolSteps.length - 1 ? (
                                    remainderDigits.map((char, i) => (
                                      <span key={i} className="w-5 text-center">{char}</span>
                                    ))
                                  ) : (
                                    getPaddedDigits(schoolSteps[idx + 1].workNum, schoolSteps[idx + 1].digitIndex).map((char, i) => (
                                      <span key={i} className="w-5 text-center">{char}</span>
                                    ))
                                  )}
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ΜΕΣΑΙΟ ΜΕΡΟΣ: Η ΚΑΘΕΤΗ ΓΡΑΜΜΗ ΤΟΥ Τ */}
                    <div className="w-[3px] bg-slate-600 self-stretch min-h-[240px]"></div>

                    {/* ΔΕΞΙ ΜΕΡΟΣ: ΔΙΑΙΡΕΤΗΣ & ΠΗΛΙΚΟ */}
                    <div className="text-left pl-5 flex flex-col h-full justify-start">
                      {/* Διαιρέτης */}
                      <div className="text-emerald-400 font-bold border-b-4 border-slate-600 pb-2 tracking-wider flex w-full">
                        {divisorInput.split('').map((char, i) => (
                          <span key={i} className="w-5 text-center">{char}</span>
                        ))}
                      </div>
                      
                      {/* Τελικό Πηλίκο */}
                      <div className="text-purple-400 pt-3 font-black tracking-wider flex w-full">
                        {q.toString().split('').map((char, i) => (
                          <span key={i} className="w-5 text-center">{char}</span>
                        ))}
                      </div>
                      
                      {/* Ένδειξη Τελικού Υπολοίπου */}
                      <div className="mt-auto pt-12 text-[10px] font-sans font-black uppercase text-rose-400 tracking-wider">
                        🏁 Υπόλοιπο: {r}
                      </div>
                    </div>

                  </div>
                </div>

                <div className="flex justify-between w-full text-[10px] font-bold text-slate-400 border-t pt-2 uppercase px-1 tracking-tight mt-1">
                  <span>🔵 Δ = Διαιρετεος</span>
                  <span>🟢 δ = Διαιρετης</span>
                  <span>🟣 π = Πηλικο</span>
                </div>
              </div>

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
