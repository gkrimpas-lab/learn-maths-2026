// pages/st-dimotikou/7-pollaplasiasmos-dinameis-deka.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function DinameisDekaPage() {
  const [activeTab, setActiveTab] = useState('megλοι'); // 'megaloi' (10,100,1000) ή 'mikroi' (0.1, 0.01)
  const [inputNum, setInputNum] = useState("34.56");
  const [multiplier, setMultiplier] = useState(10); // 10, 100, 1000 ή 0.1, 0.01, 0.001

  const valNum = parseFloat(inputNum) || 0;
  const result = valNum * multiplier;

  // Υπολογισμός των θέσεων που πρέπει να μετακινηθεί η υποδιαστολή
  const getShiftInfo = () => {
    if (activeTab === 'megaloi') {
      if (multiplier === 10) return { steps: 1, direction: 'δεξιά' };
      if (multiplier === 100) return { steps: 2, direction: 'δεξιά' };
      return { steps: 3, direction: 'δεξιά' };
    } else {
      if (multiplier === 0.1) return { steps: 1, direction: 'αριστερά' };
      if (multiplier === 0.01) return { steps: 2, direction: 'αριστερά' };
      return { steps: 3, direction: 'αριστερά' };
    }
  };

  const shift = getShiftInfo();

  // Ασφαλής αλλαγή αριθμού εισαγωγής
  const handleNumberChange = (val) => {
    const cleanVal = val.replace(/[^0-9.]/g, '');
    if ((cleanVal.match(/\./g) || []).length <= 1 && cleanVal.length <= 8) {
      setInputNum(cleanVal);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚡ Δυνάμεις του 10 & Δεκαδικά - LearnMaths.gr</title>
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
                  <span>📖</span> Θεωρία: Πολλαπλασιασμός με 10, 100, 1000... και 0,1, 0,01, 0,001...
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  Όταν πολλαπλασιάζουμε έναν αριθμό με δυνάμεις του 10, δεν κάνουμε κάθετη πράξη. Απλά μετακινούμε την υποδιαστολή!
                </p>
                <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 text-sm md:text-base font-medium">
                  <p>🚀 <strong>Με 10, 100, 1000:</strong> Ο αριθμός μεγαλώνει. Μετακινούμε την υποδιαστολή "δεξιά" τόσες θέσεις όσα είναι τα μηδενικά.</p>
                  <p>📉 <strong>Με 0.1, 0.01, 0.001:</strong> Ο αριθμός μικραίνει (είναι σαν διαίρεση). Μετακινούμε την υποδιαστολή "αριστερά" τόσες θέσεις όσα είναι τα δεκαδικά ψηφία.</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-2xl shadow-md space-y-3 font-mono text-xs md:text-sm">
                <p className="font-bold text-center text-white font-sans text-sm">💡 Γρήγορα Παραδείγματα:</p>
                <div className="bg-white/10 p-3 rounded-xl space-y-1">
                  <div>• 3,45 × 10 = 34,5 <span className="text-amber-200 font-sans text-xs">(1 θέση δεξιά)</span></div>
                  <div>• 3,45 × 100 = 345 <span className="text-amber-200 font-sans text-xs">(2 θέσεις δεξιά)</span></div>
                  <div className="border-t border-white/20 my-1 pt-1"></div>
                  <div>• 34,5 × 0,1 = 3,45 <span className="text-amber-200 font-sans text-xs">(1 θέση αριστερά)</span></div>
                  <div>• 34,5 × 0,01 = 0,345 <span className="text-amber-200 font-sans text-xs">(2 θέσεις αριστερά)</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* TABS ΕΝΑΛΛΑΓΗΣ */}
          <div className="flex justify-center bg-gray-200/60 p-1.5 rounded-2xl max-w-md mx-auto shadow-inner">
            <button  
              onClick={() => {
                setActiveTab('megaloi');
                setMultiplier(10);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'megaloi' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              🚀 × 10, 100, 1000
            </button>
            <button  
              onClick={() => {
                setActiveTab('mikroi');
                setMultiplier(0.1);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'mikroi' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              📉 × 0.1, 0.01, 0.001
            </button>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[480px] w-full gap-6">
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900">
                  {activeTab === 'megaloi' ? "Πολλαπλασιασμός που Μεγαλώνει" : "Πολλαπλασιασμός που Μικραίνει"}
                </h3>
                <p className="text-gray-500 text-sm">Γράψε έναν αριθμό και επίλεξε τον πολλαπλασιαστή για να δεις τη μετατόπιση.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col gap-5 shadow-inner my-auto">
                {/* Input Αριθμού */}
                <div className="flex flex-col items-center gap-1.5 w-full">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Γραψε τον Αριθμο σου</span>
                  <input 
                    type="text" 
                    value={inputNum}
                    onChange={(e) => handleNumberChange(e.target.value)}
                    className="text-2xl font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-sm w-full max-w-sm text-blue-600 outline-none focus:border-blue-500 tracking-wider font-mono"
                    placeholder="π.χ. 34.56"
                  />
                </div>

                {/* Επιλογέας Πολλαπλασιαστή */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Επιλεξε Πολλαπλασιαστη</span>
                  <div className="flex gap-2">
                    {activeTab === 'megaloi' ? (
                      [10, 100, 1000].map((m) => (
                        <button 
                          key={m} 
                          onClick={() => setMultiplier(m)}
                          className={`w-16 py-2 rounded-xl font-black text-sm border shadow-sm transition-all ${multiplier === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                          {m}
                        </button>
                      ))
                    ) : (
                      [0.1, 0.01, 0.001].map((m) => (
                        <button 
                          key={m} 
                          onClick={() => setMultiplier(m)}
                          className={`w-16 py-2 rounded-xl font-black text-sm border shadow-sm transition-all font-mono ${multiplier === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                          {m.toString().replace('.', ',')}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Οριζόντιο Συμπέρασμα */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono text-base md:text-lg text-center font-black text-slate-700 shadow-inner">
                {inputNum || "0"} × {multiplier.toString().replace('.', ',')} = <span className="text-purple-600 bg-purple-50 px-3 py-1 rounded-xl border border-purple-100">{result.toLocaleString('el-GR', { maximumFractionDigits: 6 })}</span>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΕΤΑΤΟΠΙΣΗΣ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[480px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <div className="my-auto flex flex-col items-center gap-6 w-full max-w-sm text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Οδηγος Υποδιαστολης:</span>
                
                {/* Κουτί Οπτικής Αναπαράστασης */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border-4 border-slate-700 w-full font-mono text-2xl md:text-3xl font-black tracking-widest relative py-12 flex flex-col items-center justify-center min-h-[140px]">
                  
                  {/* Αρχικός Αριθμός */}
                  <div className="text-slate-400 text-sm font-sans font-bold tracking-normal mb-2 opacity-60">Αρχική Θέση: {valNum.toString().replace('.', ',')}</div>
                  
                  {/* Κίνηση Υποδιαστολής */}
                  <div className="text-blue-400 flex items-center justify-center gap-1">
                    {result.toLocaleString('el-GR', { maximumFractionDigits: 6 })}
                  </div>

                  {/* Έξυπνο Σύμβολο Κίνησης */}
                  <div className="absolute bottom-2 font-sans text-[11px] font-black uppercase text-amber-400 tracking-wider">
                    {shift.steps} {shift.steps === 1 ? "θεση" : "θεσεις"} προς τα {shift.direction}
                  </div>
                </div>

                {/* Επεξηγηματικό Κείμενο */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs md:text-sm text-blue-900 font-medium leading-relaxed">
                  💡 <strong>Τι συνέβη:</strong> Πολλαπλασιάζοντας με το <span className="font-bold">{multiplier.toString().replace('.', ',')}</span>, η υποδιαστολή μετακινήθηκε "{shift.steps} {shift.steps === 1 ? "θέση" : "θέσεις"}" προς τα "{shift.direction}". 
                  {activeTab === 'megaloi' ? " Αν τελειώσουν τα ψηφία, προσθέτουμε μηδενικά!" : " Αν τελειώσουν τα ψηφία, βάζουμε 0, στην αρχή!"}
                </div>
              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>🔍 Η υποδιαστολή καθορίζει την αξία θέσης κάθε ψηφίου στον αριθμό.</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Πολλαπλασιασμός με Δυνάμεις του 10 ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
