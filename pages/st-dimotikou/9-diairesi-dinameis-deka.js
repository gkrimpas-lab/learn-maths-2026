// pages/st-dimotikou/9-diairesi-dinameis-deka.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function DiairesiDinameisDekaPage() {
  const [activeTab, setActiveTab] = useState('megaloi'); // 'megaloi' (10,100,1000) ή 'mikroi' (0.1, 0.01, 0.001)
  const [inputNum, setInputNum] = useState("543.2");
  const [divisor, setDivisor] = useState(10); // 10, 100, 1000 ή 0.1, 0.01, 0.001

  const valNum = parseFloat(inputNum) || 0;
  const result = valNum / divisor;

  // Υπολογισμός των θέσεων και της κατεύθυνσης για την υποδιαστολή
  const getShiftInfo = () => {
    if (activeTab === 'megaloi') {
      if (divisor === 10) return { steps: 1, direction: 'αριστερά', effect: 'μικραίνει' };
      if (divisor === 100) return { steps: 2, direction: 'αριστερά', effect: 'μικραίνει' };
      return { steps: 3, direction: 'αριστερά', effect: 'μικραίνει' };
    } else {
      if (divisor === 0.1) return { steps: 1, direction: 'δεξιά', effect: 'μεγαλώνει' };
      if (divisor === 0.01) return { steps: 2, direction: 'δεξιά', effect: 'μεγαλώνει' };
      return { steps: 3, direction: 'δεξιά', effect: 'μεγαλώνει' };
    }
  };

  const shift = getShiftInfo();

  // Ασφαλής έλεγχος εισαγωγής αριθμού (Μαξ 6 ακέραια, Μαξ 3 δεκαδικά)
  const handleNumberChange = (val) => {
    const cleanVal = val.replace(/[^0-9.]/g, '');
    const parts = cleanVal.split('.');
    const intPart = parts[0] || "";
    const decPart = parts[1] || "";

    if ((cleanVal.match(/\./g) || []).length <= 1) {
      if (intPart.length <= 6 && decPart.length <= 3) {
        setInputNum(cleanVal);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚡ Διαίρεση με 10, 100, 1000 κτλ. - LearnMaths.gr</title>
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
                  <span>📖</span> Θεωρία: Διαίρεση με Δυνάμεις του 10 & Δεκαδικές Μονάδες
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  Στη διαίρεση με 10, 100, 1000 ή με 0,1, 0,01, 0,001, αποφεύγουμε τις κάθετες πράξεις. Το μόνο που αλλάζει είναι η θέση της υποδιαστολής!
                </p>
                <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 text-sm md:text-base font-medium">
                  <p>📉 <strong>Με 10, 100, 1000:</strong> Ο αριθμός μικραίνει. Μετακινούμε την υποδιαστολή προς τα **αριστερά** τόσες θέσεις όσα είναι τα μηδενικά.</p>
                  <p>🚀 <strong>Με 0,1, 0,01, 0,001:</strong> Ο αριθμός μεγαλώνει! Μετακινούμε την υποδιαστολή προς τα **δεξιά** τόσες θέσεις όσα είναι τα δεκαδικά ψηφία.</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-6 rounded-2xl shadow-md space-y-3 font-mono text-xs md:text-sm">
                <p className="font-bold text-center text-white font-sans text-sm">💡 Γρήγορος Κανόνας:</p>
                <div className="bg-white/10 p-3 rounded-xl space-y-1.5">
                  <div>• 432,5 ÷ 10 = 43,25 <span className="text-indigo-200 font-sans text-xs">(1 θέση αριστερά)</span></div>
                  <div>• 432,5 ÷ 100 = 4,325 <span className="text-indigo-200 font-sans text-xs">(2 θέσεις αριστερά)</span></div>
                  <div className="border-t border-white/20 my-1 pt-1"></div>
                  <div>• 4,325 ÷ 0,1 = 43,25 <span className="text-indigo-200 font-sans text-xs">(1 θέση δεξιά)</span></div>
                  <div>• 4,325 ÷ 0,01 = 432,5 <span className="text-indigo-200 font-sans text-xs">(2 θέσεις δεξιά)</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* TABS ΕΝΑΛΛΑΓΗΣ */}
          <div className="flex justify-center bg-gray-200/60 p-1.5 rounded-2xl max-w-md mx-auto shadow-inner">
            <button  
              onClick={() => {
                setActiveTab('megaloi');
                setDivisor(10);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'megaloi' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              📉 ÷ 10, 100, 1000
            </button>
            <button  
              onClick={() => {
                setActiveTab('mikroi');
                setDivisor(0.1);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'mikroi' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              🚀 ÷ 0.1, 0.01, 0.001
            </button>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[480px] w-full gap-6">
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900">
                  {activeTab === 'megaloi' ? "Διαίρεση που Μικραίνει τον Αριθμό" : "Διαίρεση που Μεγαλώνει τον Αριθμό"}
                </h3>
                <p className="text-gray-500 text-sm">Γράψε έως 6 ακέραια και 3 δεκαδικά ψηφία για να παρατηρήσεις την κίνηση.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col gap-5 shadow-inner my-auto">
                {/* Input Αριθμού */}
                <div className="flex flex-col items-center gap-1.5 w-full">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Αριθμός (Διαιρετέος)</span>
                  <input 
                    type="text" 
                    value={inputNum}
                    onChange={(e) => handleNumberChange(e.target.value)}
                    className="text-2xl font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-sm w-full max-w-sm text-blue-600 outline-none focus:border-blue-500 tracking-wider font-mono"
                    placeholder="π.χ. 543.2"
                  />
                </div>

                {/* Επιλογέας Διαιρέτη */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Επίλεξε Διαιρέτη</span>
                  <div className="flex gap-2">
                    {activeTab === 'megaloi' ? (
                      [10, 100, 1000].map((m) => (
                        <button 
                          key={m} 
                          onClick={() => setDivisor(m)}
                          className={`w-16 py-2 rounded-xl font-black text-sm border shadow-sm transition-all ${divisor === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                          {m}
                        </button>
                      ))
                    ) : (
                      [0.1, 0.01, 0.001].map((m) => (
                        <button 
                          key={m} 
                          onClick={() => setDivisor(m)}
                          className={`w-16 py-2 rounded-xl font-black text-sm border shadow-sm transition-all font-mono ${divisor === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                          {m.toString().replace('.', ',')}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Οριζόντιο Αποτέλεσμα (Μέγιστη ακρίβεια 6 δεκαδικών) */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono text-base md:text-lg text-center font-black text-slate-700 shadow-inner">
                {inputNum || "0"} ÷ {divisor.toString().replace('.', ',')} = <span className="text-purple-600 bg-purple-50 px-3 py-1 rounded-xl border border-purple-100">{result.toLocaleString('el-GR', { maximumFractionDigits: 6 })}</span>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΣ ΟΔΗΓΟΣ ΜΕΤΑΤΟΠΙΣΗΣ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[480px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <div className="my-auto flex flex-col items-center gap-6 w-full max-w-sm text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Οδηγός Υποδιαστολής:</span>
                
                {/* Ψηφιακός Πίνακας */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border-4 border-slate-700 w-full font-mono text-2xl md:text-3xl font-black tracking-widest relative py-12 flex flex-col items-center justify-center min-h-[140px]">
                  
                  {/* Αρχική Κατάσταση */}
                  <div className="text-slate-400 text-sm font-sans font-bold tracking-normal mb-2 opacity-60">Αρχική Τιμή: {valNum.toString().replace('.', ',')}</div>
                  
                  {/* Τελική Τιμή */}
                  <div className="text-blue-400 flex items-center justify-center gap-1">
                    {result.toLocaleString('el-GR', { maximumFractionDigits: 6 })}
                  </div>

                  {/* Πληροφορίες Μετακίνησης */}
                  <div className="absolute bottom-2 font-sans text-[11px] font-black uppercase text-amber-400 tracking-wider">
                    {shift.steps} {shift.steps === 1 ? "θέση" : "θέσεις"} προς τα {shift.direction}
                  </div>
                </div>

                {/* Εκπαιδευτική Επεξήγηση */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs md:text-sm text-blue-900 font-medium leading-relaxed">
                  💡 <strong>Τι παρατηρούμε:</strong> Διαιρώντας με <span className="font-bold">{divisor.toString().replace('.', ',')}</span>, ο αριθμός <strong>{shift.effect}</strong> κατά {multiplierLabel(divisor, activeTab)} φορές. 
                  Η υποδιαστολή μετακινήθηκε αυτόματα **{shift.steps} {shift.steps === 1 ? "θέση" : "θέσεις"}** προς τα **{shift.direction}**.
                </div>
              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>🔍 Αν κατά τη μετακίνηση αριστερά ή δεξιά τελειώσουν τα ψηφία, συμπληρώνουμε με μηδενικά!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Διαίρεση με Δυνάμεις του 10.</p>
      </footer>
    </div>
  );
}

// Βοηθητική συνάρτηση για την επεξήγηση των φορών
function multiplierLabel(divisor, tab) {
  if (tab === 'megaloi') {
    return divisor.toLocaleString('el-GR');
  } else {
    if (divisor === 0.1) return "10";
    if (divisor === 0.01) return "100";
    return "1.000";
  }
}
