// pages/st-dimotikou/5-prosthesi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function ProsthesiAfairesiPage() {
  const [activeTab, setActiveTab] = useState('katheti'); // 'katheti', 'idiotites', 'antitheti'
  
  // Κατάσταση για Κάθετη Πράξη
  const [numA, setNumA] = useState("142.5");
  const [numB, setNumB] = useState("15.123");
  const [isAddition, setIsAddition] = useState(true);

  // Κατάσταση για Αντιμεταθετική (Ιδιότητες)
  const [isSwapped, setIsSwapped] = useState(false);

  // Υπολογισμοί για Κάθετη Πράξη
  const valA = parseFloat(numA) || 0;
  const valB = parseFloat(numB) || 0;
  const result = isAddition ? valA + valB : valA - valB;

  // Βρίσκουμε δυναμικά πόσα δεκαδικά ψηφία χρειάζεται να εμφανίσουμε (Max 3)
  const getDecimalPlaces = () => {
    const digitsA = (numA.split('.')[1] || "").length;
    const digitsB = (numB.split('.')[1] || "").length;
    return Math.min(Math.max(digitsA, digitsB, 1), 3); // Τουλάχιστον 1, το πολύ 3
  };

  const decimalPlaces = getDecimalPlaces();

  // Διαχωρισμός των αριθμών σε Ακέραιο και Δεκαδικό για την απόλυτη στοίχιση στον πίνακα
  const formatForGrid = (value) => {
    const str = value.toFixed(decimalPlaces);
    const [intPart, decPart] = str.split('.');
    return { intPart, decPart };
  };

  const partA = formatForGrid(valA);
  const partB = formatForGrid(valB);
  const partResult = formatForGrid(result);

  // Βοηθητική συνάρτηση για τον έλεγχο των ορίων κατά την πληκτρολόγηση (Max 6 ακέραια, Max 3 δεκαδικά)
  const handleInputChange = (val, setter) => {
    const cleanVal = val.replace(/[^0-9.]/g, '');
    const parts = cleanVal.split('.');
    const intPart = parts[0] || "";
    const decPart = parts[1] || "";

    if ((cleanVal.match(/\./g) || []).length <= 1) {
      if (intPart.length <= 6 && decPart.length <= 3) {
        setter(cleanVal);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>➕ Πρόσθεση & Αφαίρεση - LearnMaths.gr</title>
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
                  <span>📖</span> Θεωρία: Πρόσθεση & Αφαίρεση
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  Η **πρόσθεση** ενώνει ποσότητες, ενώ η **αφαίρεση** βγάζει μια ποσότητα από μια άλλη. Η αφαίρεση είναι η **αντίθετη πράξη** της πρόσθεσης επειδή «αναιρεί» αυτό που έκανε η πρόσθεση.
                </p>
                <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 text-sm md:text-base font-medium">
                  <p>🔄 <strong>Αντιμεταθετική Ιδιότητα:</strong> Στην πρόσθεση μπορούμε να αλλάξουμε τη σειρά των αριθμών χωρίς να αλλάξει το αποτέλεσμα ($α + β = β + α$).</p>
                  <p>🧠 <strong>Προσεταιριστική Ιδιότητα:</strong> Όταν προσθέτουμε τρεις αριθμούς, μπορούμε να προσθέσουμε πρώτα τους δύο πρώτους ή τους δύο τελευταίους ($ (α+β)+γ = α+(β+γ) $).</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-6 rounded-2xl shadow-md space-y-3">
                <p className="font-bold text-amber-300 text-sm md:text-base text-center">⚠️ Ο χρυσός κανόνας των Δεκαδικών!</p>
                <p className="text-xs md:text-sm leading-relaxed text-indigo-50 font-medium">
                  Όταν γράφουμε κάθετα δεκαδικούς αριθμούς, το πιο σημαντικό βήμα είναι να τοποθετούμε τις **υποδιαστολές ακριβώς τη μία κάτω από την άλλη**. Αν κάποιος αριθμός έχει λιγότερα ψηφία, συμπληρώνουμε μηδενικά στο τέλος!
                </p>
                <div className="flex justify-center">
                  <div className="bg-white/10 p-3 rounded-xl font-mono text-sm tracking-widest text-amber-200 w-32 text-right relative">
                    <span className="absolute left-2 top-7 text-white">+</span>
                    <div>142,50</div>
                    <div className="border-b border-white/30 my-1 pb-1">38,74</div>
                    <div className="font-bold text-white">181,24</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABS ΕΝΑΛΛΑΓΗΣ */}
          <div className="flex flex-wrap justify-center bg-gray-200/60 p-1.5 rounded-2xl max-w-xl mx-auto shadow-inner gap-1">
            <button  
              onClick={() => setActiveTab('katheti')}
              className={`flex-1 min-w-[140px] py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'katheti' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              📊 Κάθετη Στοίχιση
            </button>
            <button  
              onClick={() => setActiveTab('idiotites')}
              className={`flex-1 min-w-[140px] py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'idiotites' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              🔄 Ιδιότητες Πράξεων
            </button>
            <button  
              onClick={() => setActiveTab('antitheti')}
              className={`flex-1 min-w-[140px] py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'antitheti' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              ↩️ Αντίθετη Πράξη
            </button>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[480px] w-full gap-6">
              
              {activeTab === 'katheti' && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Διαδραστική Κάθετη Πράξη</h3>
                    <p className="text-gray-500 text-sm">Γράψε αριθμούς (έως 6 ακέραια και 3 δεκαδικά ψηφία) για να δεις τη στοίχιση.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col gap-4 shadow-inner my-auto">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <input  
                        type="text"  
                        value={numA}
                        onChange={(e) => handleInputChange(e.target.value, setNumA)}
                        className="text-xl font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-sm w-full max-w-[160px] text-blue-600 outline-none focus:border-blue-500"
                        placeholder="Αριθμός Α"
                      />
                      
                      <button  
                        onClick={() => setIsAddition(!isAddition)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xl w-10 h-10 rounded-full flex items-center justify-center shadow transition-colors"
                      >
                        {isAddition ? "+" : "-"}
                      </button>

                      <input  
                        type="text"  
                        value={numB}
                        onChange={(e) => handleInputChange(e.target.value, setNumB)}
                        className="text-xl font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-sm w-full max-w-[160px] text-blue-600 outline-none focus:border-blue-500"
                        placeholder="Αριθμός Β"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-sm font-bold text-slate-500 shadow-inner">
                    ✨ Δοκίμασε να βάλεις αριθμούς με διαφορετικό πλήθος ψηφίων (π.χ. 5.123 και 12.4) για να δεις τη στοίχιση.
                  </div>
                </>
              )}

              {activeTab === 'idiotites' && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Αντιμεταθετική Ιδιότητα</h3>
                    <p className="text-gray-500 text-sm">Πάτα το κουμπί για να αλλάξεις τη σειρά των προσθετέων. Το άθροισμα παραμένει ολόιδιο!</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full flex flex-col items-center justify-center gap-6 shadow-inner my-auto">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xl font-black font-mono bg-white p-4 rounded-xl border shadow-sm">
                      <span className={`transition-all duration-300 ${isSwapped ? 'text-blue-600' : 'text-emerald-600'}`}>
                        {isSwapped ? "15.123" : "142.5"}
                      </span>
                      <span className="text-slate-400">+</span>
                      <span className={`transition-all duration-300 ${isSwapped ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {isSwapped ? "142.5" : "15.123"}
                      </span>
                      <span className="text-slate-400">=</span>
                      <span className="text-purple-600 bg-purple-50 px-3 py-1 rounded-lg">157.623</span>
                    </div>

                    <button  
                      onClick={() => setIsSwapped(!isSwapped)}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow transition-all flex items-center gap-2"
                    >
                      🔄 Αλλαγή Σειράς (Αντιμετάθεση)
                    </button>
                  </div>

                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs md:text-sm font-medium text-indigo-900 shadow-inner">
                    🧠 <strong>Προσεταιριστικά:</strong> $(10 + 5) + 2 = 15 + 2 = 17$. Το ίδιο κάνει και αν σκεφτούμε: $10 + (5 + 2) = 10 + 7 = 17$.
                  </div>
                </>
              )}

              {activeTab === 'antitheti' && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Αφαίρεση: Η Αντίθετη Πράξη</h3>
                    <p className="text-gray-500 text-sm">Δες πώς η αφαίρεση ξεκάθαρα «ξεκάνει» και ακυρώνει την πρόσθεση, γυρνώντας μας στην αρχή.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col gap-4 shadow-inner my-auto font-mono text-sm md:text-base">
                    <div className="bg-white p-3 rounded-xl border shadow-sm flex items-center justify-between">
                      <span className="font-bold text-slate-500 font-sans">1. Πρόσθεση:</span>
                      <span>100 + 45 = <strong className="text-emerald-600">145</strong></span>
                    </div>
                    <div className="text-center text-blue-500 font-black text-xl">👇 Αντίστροφα 👇</div>
                    <div className="bg-white p-3 rounded-xl border shadow-sm flex items-center justify-between">
                      <span className="font-bold text-slate-500 font-sans">2. Αφαίρεση:</span>
                      <span><strong className="text-emerald-600">145</strong> - 45 = <strong>100</strong></span>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs md:text-sm font-bold text-emerald-900 text-center shadow-inner">
                    🎯 Ξεκινήσαμε από το 100, προσθέσαμε 45, αφαιρέσαμε 45 και γυρίσαμε ακριβώς στο 100!
                  </div>
                </>
              )}
            </div>

            {{/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΣ ΠΙΝΑΚΑΣ ΜΕ ΕΞΥΠΝΗ ΣΤΟΙΧΙΣΗ GRID & ΥΠΟΒΑΘΡΟ ΓΡΑΜΜΗΣ */}}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[480px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <div className="my-auto flex flex-col items-center gap-4 w-full max-w-[340px]">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Οπτικός Πίνακας Στοίχισης:</span>
                
                <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border-4 border-slate-700 w-full font-mono text-xl md:text-2xl text-white relative select-none overflow-hidden py-6 flex justify-center">
                  
                  {/* Σήμα Πράξης */}
                  <div className="absolute left-4 top-[50px] text-amber-400 font-black z-20">
                    {isAddition ? "+" : "-"}
                  </div>

                  {/* 3-Column Grid με relative στη μεσαία στήλη για τη γραμμή */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center font-black tracking-wider gap-y-2 relative z-10 w-full px-4">
                    
                    {/* Γραμμή 1: Αριθμός Α */}
                    <div className="text-blue-400 text-right truncate">{partA.intPart}</div>
                    <div className="text-rose-500 px-1 text-center relative">
                      ,
                      {/* Η κόκκινη γραμμή σχεδιάζεται ΑΚΡΙΒΩΣ πίσω από το πρώτο κόμμα και εκτείνεται κατακόρυφα */}
                      <div className="absolute top-[-30px] bottom-[-130px] left-1/2 -translate-x-1/2 w-0 border-r-2 border-dashed border-rose-500/50 pointer-events-none z-0"></div>
                    </div>
                    <div className="text-blue-400 text-left">{partA.decPart}</div>

                    {/* Γραμμή 2: Αριθμός Β */}
                    <div className="text-emerald-400 text-right truncate">{partB.intPart}</div>
                    <div className="text-rose-500 px-1 text-center">,</div>
                    <div className="text-emerald-400 text-left">{partB.decPart}</div>

                    {/* Οριζόντια Γραμμή */}
                    <div className="col-span-3 h-[2px] bg-slate-700 my-1 z-10"></div>

                    {/* Γραμμή 3: Αποτέλεσμα */}
                    <div className="text-purple-400 text-right text-2xl truncate">{partResult.intPart}</div>
                    <div className="text-rose-500 px-1 text-center text-2xl">,</div>
                    <div className="text-purple-400 text-left text-2xl">{partResult.decPart}</div>

                  </div>

                </div>

                <span className="text-xs font-bold text-rose-500 flex items-center gap-1 text-center">
                  📍 Η κόκκινη διακεκομμένη γραμμή περνάει ακριβώς από την υποδιαστολή!
                </span>
              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>🔍 Οι αριθμοί μετατρέπονται αυτόματα ώστε να έχουν ίσο πλήθος δεκαδικών ψηφίων (έως 3).</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστικές Πράξεις Φυσικών & Δεκαδικών ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
