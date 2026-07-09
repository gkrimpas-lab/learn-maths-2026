// pages/st-dimotikou/5-prosthesi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function ProsthesiAfairesiPage() {
  const [activeTab, setActiveTab] = useState('katheti'); // 'katheti', 'idiotites', 'antitheti'
  
  // Κατάσταση για Κάθετη Πράξη (Tab 1)
  const [numA, setNumA] = useState("142.5");
  const [numB, setNumB] = useState("15.123");
  const [isAddition, setIsAddition] = useState(true);

  // Κατάσταση για Ιδιότητες (Tab 2)
  const [propA, setPropA] = useState("142.5");
  const [propB, setPropB] = useState("38.74");
  const [isSwapped, setIsSwapped] = useState(false);

  // Κατάσταση για Αντίθετη Πράξη (Tab 3)
  const [revA, setRevA] = useState("15");
  const [revB, setRevB] = useState("10");

  // Καθορισμός των τελικών τιμών προς εμφάνιση με βάση το ποιο Tab είναι ενεργό
  const getActiveNumbers = () => {
    if (activeTab === 'katheti') {
      return { currentA: parseFloat(numA) || 0, currentB: parseFloat(numB) || 0, showAddition: isAddition };
    } else if (activeTab === 'idiotites') {
      const valPropA = parseFloat(propA) || 0;
      const valPropB = parseFloat(propB) || 0;
      return {
        currentA: isSwapped ? valPropB : valPropA,
        currentB: isSwapped ? valPropA : valPropB,
        showAddition: true
      };
    } else {
      return { currentA: parseFloat(revA) || 0, currentB: parseFloat(revB) || 0, showAddition: true };
    }
  };

  const { currentA, currentB, showAddition } = getActiveNumbers();
  
  // Υπολογισμοί για Tab 1 & Tab 2
  const result = showAddition ? currentA + currentB : currentA - currentB;

  // Ειδικοί υπολογισμοί αποκλειστικά για την Αντίθετη Πράξη (Tab 3)
  const valRevA = parseFloat(revA) || 0;
  const valRevB = parseFloat(revB) || 0;
  const revSum = valRevA + valRevB;
  const revFinal = revSum - valRevB;

  // Βρίσκουμε δυναμικά πόσα δεκαδικά ψηφία χρειάζεται να εμφανίσουμε (Max 3)
  const getDecimalPlaces = () => {
    const activeStrA = activeTab === 'katheti' ? numA : activeTab === 'idiotites' ? propA : revA;
    const activeStrB = activeTab === 'katheti' ? numB : activeTab === 'idiotites' ? propB : revB;
    const digitsA = (activeStrA.split('.')[1] || "").length;
    const digitsB = (activeStrB.split('.')[1] || "").length;
    return Math.min(Math.max(digitsA, digitsB, 1), 3);
  };

  const decimalPlaces = getDecimalPlaces();

  // Διαχωρισμός των αριθμών σε Ακέραιο και Δεκαδικό για τη στοίχιση
  const formatForGrid = (value) => {
    const str = value.toFixed(decimalPlaces);
    const [intPart, decPart] = str.split('.');
    return { intPart, decPart };
  };

  const partA = formatForGrid(currentA);
  const partB = formatForGrid(currentB);
  const partResult = formatForGrid(result);

  // Μορφοποίηση για τους δύο πίνακες του Tab 3
  const tab3_A = formatForGrid(valRevA);
  const tab3_B = formatForGrid(valRevB);
  const tab3_Sum = formatForGrid(revSum);
  const tab3_Final = formatForGrid(revFinal);

  // Βοηθητική συνάρτηση ελέγχου ορίων (Max 6 ακέραια, Max 3 δεκαδικά)
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

  // Βοηθητική συνάρτηση εμφάνισης αριθμών με ελληνικό κόμμα στην οριζόντια θεωρία
  const formatGreek = (val) => {
    return val.toFixed(decimalPlaces).replace('.', ',');
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
                  Η "πρόσθεση" ενώνει ποσότητες, ενώ η "αφαίρεση" βγάζει μια ποσότητα από μια άλλη. Η αφαίρεση είναι η "αντίθετη πράξη" της πρόσθεσης επειδή «αναιρεί» αυτό που έκανε η πρόσθεση.
                </p>
                <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 text-sm md:text-base font-medium">
                  <p>🔄 <strong>Αντιμεταθετική Ιδιότητα:</strong> Στην πρόσθεση μπορούμε να αλλάξουμε τη σειρά των αριθμών χωρίς να αλλάξει το αποτέλεσμα (α + β = β + α).</p>
                  <p>🧠 <strong>Προσεταιριστική Ιδιότητα:</strong> Όταν προσθέτουμε τρεις αριθμούς, μπορούμε να τους ομαδοποιήσουμε με όποια σειρά θέλουμε χωρίς να αλλάξει το άθροισμα.</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-6 rounded-2xl shadow-md space-y-3">
                <p className="font-bold text-amber-300 text-sm md:text-base text-center">⚠️ Ο χρυσός κανόνας των Δεκαδικών!</p>
                <p className="text-xs md:text-sm leading-relaxed text-indigo-50 font-medium">
                  Όταν γράφουμε κάθετα δεκαδικούς αριθμούς, το πιο σημαντικό βήμα είναι να τοποθετούμε τις "υποδιαστολές ακριβώς τη μία κάτω από την άλλη". Αν κάποιος αριθμός έχει λιγότερα ψηφία, συμπληρώνουμε μηδενικά στο τέλος!
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
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                      <input  
                        type="text"  
                        value={numA}
                        onChange={(e) => handleInputChange(e.target.value, setNumA)}
                        className="text-lg font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-sm w-full sm:max-w-[210px] text-blue-600 outline-none focus:border-blue-500 tracking-normal"
                        placeholder="Αριθμός Α"
                      />
                      
                      <button  
                        onClick={() => setIsAddition(!isAddition)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xl w-10 h-10 rounded-full flex items-center justify-center shadow transition-colors flex-shrink-0"
                      >
                        {isAddition ? "+" : "-"}
                      </button>

                      <input  
                        type="text"  
                        value={numB}
                        onChange={(e) => handleInputChange(e.target.value, setNumB)}
                        className="text-lg font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-sm w-full sm:max-w-[210px] text-blue-600 outline-none focus:border-blue-500 tracking-normal"
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
                    <p className="text-gray-500 text-sm">Γράψε δύο αριθμούς και πάτα το κουμπί της Αντιμετάθεσης για να αλλάξουν σειρά οριζόντια και κάθετα!</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col gap-4 shadow-inner my-auto">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                      <div className="flex flex-col items-center gap-1 w-full sm:max-w-[176px]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμός Α</span>
                        <input  
                          type="text"  
                          value={propA}
                          onChange={(e) => {
                            setIsSwapped(false);
                            handleInputChange(e.target.value, setPropA);
                          }}
                          className="text-base font-black text-center p-2.5 bg-white border-2 border-emerald-200 rounded-xl shadow-sm w-full text-emerald-600 outline-none focus:border-emerald-500 tracking-normal"
                        />
                      </div>
                      <span className="text-xl font-black text-slate-400 mt-4 flex-shrink-0">+</span>
                      <div className="flex flex-col items-center gap-1 w-full sm:max-w-[176px]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμός Β</span>
                        <input  
                          type="text"  
                          value={propB}
                          onChange={(e) => {
                            setIsSwapped(false);
                            handleInputChange(e.target.value, setPropB);
                          }}
                          className="text-base font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-sm w-full text-blue-600 outline-none focus:border-blue-500 tracking-normal"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 text-sm md:text-base font-black font-mono bg-white p-3 rounded-xl border shadow-sm mt-2 max-w-full overflow-hidden break-all">
                      <span className={isSwapped ? 'text-blue-600' : 'text-emerald-600'}>
                        {isSwapped ? propB || "0" : propA || "0"}
                      </span>
                      <span className="text-slate-400">+</span>
                      <span className={isSwapped ? 'text-emerald-600' : 'text-blue-600'}>
                        {isSwapped ? propA || "0" : propB || "0"}
                      </span>
                      <span className="text-slate-400">=</span>
                      <span className="text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-lg">
                        {formatGreek(result)}
                      </span>
                    </div>

                    <div className="flex justify-center mt-1">
                      <button  
                        onClick={() => setIsSwapped(!isSwapped)}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs tracking-wider px-5 py-2.5 rounded-xl shadow transition-all flex items-center gap-2"
                      >
                        🔄 Αντιμετάθεση Προσθετέων
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs md:text-sm font-medium text-indigo-900 shadow-inner">
                    🧠 <strong>Προσεταιριστικά:</strong> (10 + 5) + 2 = 15 + 2 = 17. Το ίδιο κάνει και αν σκεφτούμε: 10 + (5 + 2) = 10 + 7 = 17.
                  </div>
                </>
              )}

              {activeTab === 'antitheti' && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Αντίθετη Πράξη</h3>
                    <p className="text-gray-500 text-sm">Γράψε δύο αριθμούς για να παράξεις αυτόματα τις δύο αντίστροφες οριζόντιες ισότητες.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl w-full flex flex-col gap-4 shadow-inner my-auto">
                    {/* Inputs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                      <div className="flex flex-col items-center gap-1 w-full sm:max-w-[160px]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αρχικός Αριθμός</span>
                        <input  
                          type="text"  
                          value={revA}
                          onChange={(e) => handleInputChange(e.target.value, setRevA)}
                          className="text-base font-black text-center p-2 bg-white border-2 border-blue-200 rounded-xl shadow-sm w-full text-blue-600 outline-none focus:border-blue-500 tracking-normal"
                        />
                      </div>
                      <span className="text-xl font-black text-slate-400 mt-4 flex-shrink-0">+</span>
                      <div className="flex flex-col items-center gap-1 w-full sm:max-w-[160px]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Ποσότητα Πρόσθεσης</span>
                        <input  
                          type="text"  
                          value={revB}
                          onChange={(e) => handleInputChange(e.target.value, setRevB)}
                          className="text-base font-black text-center p-2 bg-white border-2 border-emerald-200 rounded-xl shadow-sm w-full text-emerald-600 outline-none focus:border-emerald-500 tracking-normal"
                        />
                      </div>
                    </div>

                    {/* ΝΕΕΣ ΟΡΙΖΟΝΤΙΕΣ ΕΜΦΑΝΙΣΕΙΣ ΠΡΑΞΕΩΝ (ΣΤΑΘΕΡΕΣ ΧΩΡΙΣ EDIT) */}
                    <div className="bg-white p-3 border border-gray-100 rounded-xl shadow-sm space-y-2 font-mono font-black text-base md:text-lg text-center">
                      {/* Πράξη 1: Πρόσθεση */}
                      <div className="flex justify-center items-center gap-2 text-slate-700">
                        <span className="text-blue-600">{revA || "0"}</span>
                        <span className="text-slate-400">+</span>
                        <span className="text-emerald-600">{revB || "0"}</span>
                        <span className="text-slate-400">=</span>
                        <span className="text-red-500">{formatGreek(revSum)}</span>
                      </div>
                      {/* Πράξη 2: Αφαίρεση */}
                      <div className="flex justify-center items-center gap-2 text-slate-700 border-t border-slate-100 pt-2">
                        <span className="text-red-500">{formatGreek(revSum)}</span>
                        <span className="text-slate-400">-</span>
                        <span className="text-emerald-600">{revB || "0"}</span>
                        <span className="text-slate-400">=</span>
                        <span className="text-blue-600">{formatGreek(revFinal)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs md:text-sm font-bold text-emerald-900 text-center shadow-inner">
                    🎯 Η αφαίρεση δεξιά παίρνει το Άθροισμα, βγάζει την ίδια ποσότητα και μας επιστρέφει στον αρχικό αριθμό!
                  </div>
                </>
              )}
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΣ ΠΙΝΑΚΑΣ ΜΕ ΑΠΟΛΥΤΗ ΣΤΑΘΕΡΗ ΣΤΟΙΧΙΣΗ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[480px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <div className="my-auto flex flex-col items-center gap-4 w-full max-w-full px-2">
                <span className="text-xs font-bold text-slate-500 tracking-wider">Οπτικός Πίνακας Στοίχισης</span>
                
                {activeTab !== 'antitheti' ? (
                  /* ΜΟΝΟΣ ΠΙΝΑΚΑΣ ΓΙΑ ΤΑ TABS 1 & 2 */
                  <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border-4 border-slate-700 w-full max-w-[340px] font-mono text-xl md:text-2xl text-white relative select-none overflow-hidden py-8">
                    <div className="absolute left-4 top-[62px] text-amber-400 font-black z-20">{showAddition ? "+" : "-"}</div>
                    <div className="absolute top-0 bottom-0 left-1/2 w-0 border-r-2 border-dashed border-rose-500/60 z-0"></div>
                    <div className="flex flex-col gap-3 relative z-10 w-full">
                      <div className="flex justify-center items-center">
                        <div className="w-[110px] text-right text-blue-400 truncate">{partA.intPart}</div>
                        <div className="w-6 text-center text-rose-500 font-bold">,</div>
                        <div className="w-[110px] text-left text-blue-400 truncate">{partA.decPart}</div>
                      </div>
                      <div className="flex justify-center items-center">
                        <div className="w-[110px] text-right text-emerald-400 truncate">{partB.intPart}</div>
                        <div className="w-6 text-center text-rose-500 font-bold">,</div>
                        <div className="w-[110px] text-left text-emerald-400 truncate">{partB.decPart}</div>
                      </div>
                      <div className="flex justify-center my-1 px-2"><div className="w-full h-[2px] bg-slate-700"></div></div>
                      <div className="flex justify-center items-center">
                        <div className="w-[110px] text-right text-purple-400 text-2xl truncate">{partResult.intPart}</div>
                        <div className="w-6 text-center text-rose-500 font-bold text-2xl">,</div>
                        <div className="w-[110px] text-left text-purple-400 text-2xl truncate">{partResult.decPart}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ΔΥΟ ΠΙΝΑΚΕΣ ΔΙΠΛΑ-ΔΙΠΛΑ ΓΙΑ ΤΟ TAB 3 (ΠΡΟΣΘΕΣΗ & ΑΦΑΙΡΕΣΗ) */
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-xl">
                    
                    {/* ΠΙΝΑΚΑΣ Α: ΠΡΟΣΘΕΣΗ */}
                    <div className="bg-slate-900 p-4 rounded-2xl shadow-xl border-2 border-slate-700 w-full max-w-[240px] font-mono text-base md:text-lg text-white relative select-none overflow-hidden py-6">
                      <div className="absolute left-2.5 top-[44px] text-amber-400 font-black z-20">+</div>
                      <div className="absolute top-0 bottom-0 left-1/2 w-0 border-r border-dashed border-rose-500/40 z-0"></div>
                      <div className="flex flex-col gap-2 relative z-10 w-full">
                        <div className="flex justify-center items-center">
                          <div className="w-[75px] text-right text-blue-400 truncate">{tab3_A.intPart}</div>
                          <div className="w-4 text-center text-rose-500 font-bold">,</div>
                          <div className="w-[75px] text-left text-blue-400 truncate">{tab3_A.decPart}</div>
                        </div>
                        <div className="flex justify-center items-center">
                          <div className="w-[75px] text-right text-emerald-400 truncate">{tab3_B.intPart}</div>
                          <div className="w-4 text-center text-rose-500 font-bold">,</div>
                          <div className="w-[75px] text-left text-emerald-400 truncate">{tab3_B.decPart}</div>
                        </div>
                        <div className="flex justify-center my-0.5 px-1"><div className="w-full h-[1px] bg-slate-700"></div></div>
                        <div className="flex justify-center items-center">
                          <div className="w-[75px] text-right text-purple-400 font-bold truncate">{tab3_Sum.intPart}</div>
                          <div className="w-4 text-center text-rose-500 font-bold">,</div>
                          <div className="w-[75px] text-left text-purple-400 font-bold truncate">{tab3_Sum.decPart}</div>
                        </div>
                      </div>
                    </div>

                    {/* ΒΕΛΟΣ ΑΝΤΙΣΤΡΟΦΗΣ */}
                    <span className="text-2xl text-blue-500 font-black transform rotate-90 sm:rotate-0 flex-shrink-0">➔</span>

                    {/* ΠΙΝΑΚΑΣ Β: ΑΦΑΙΡΕΣΗ */}
                    <div className="bg-slate-900 p-4 rounded-2xl shadow-xl border-2 border-slate-700 w-full max-w-[240px] font-mono text-base md:text-lg text-white relative select-none overflow-hidden py-6">
                      <div className="absolute left-2.5 top-[44px] text-amber-400 font-black z-20">-</div>
                      <div className="absolute top-0 bottom-0 left-1/2 w-0 border-r border-dashed border-rose-500/40 z-0"></div>
                      <div className="flex flex-col gap-2 relative z-10 w-full">
                        <div className="flex justify-center items-center">
                          <div className="w-[75px] text-right text-purple-400 font-bold truncate">{tab3_Sum.intPart}</div>
                          <div className="w-4 text-center text-rose-500 font-bold">,</div>
                          <div className="w-[75px] text-left text-purple-400 font-bold truncate">{tab3_Sum.decPart}</div>
                        </div>
                        <div className="flex justify-center items-center">
                          <div className="w-[75px] text-right text-emerald-400 truncate">{tab3_B.intPart}</div>
                          <div className="w-4 text-center text-rose-500 font-bold">,</div>
                          <div className="w-[75px] text-left text-emerald-400 truncate">{tab3_B.decPart}</div>
                        </div>
                        <div className="flex justify-center my-0.5 px-1"><div className="w-full h-[1px] bg-slate-700"></div></div>
                        <div className="flex justify-center items-center">
                          <div className="w-[75px] text-right text-blue-400 truncate">{tab3_Final.intPart}</div>
                          <div className="w-4 text-center text-rose-500 font-bold">,</div>
                          <div className="w-[75px] text-left text-blue-400 truncate">{tab3_Final.decPart}</div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

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
