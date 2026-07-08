// pages/st-dimotikou/3-arithmoi-dekadika-klasmata.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function MetatropiPage() {
  const [activeTab, setActiveTab] = useState('toKlasma'); // 'toKlasma' ή 'toDekadiko'
  
  // Κατάσταση για τη μετατροπή Δεκαδικού -> Κλάσματος
  const [dekadikos, setDekadikos] = useState("0.45");
  
  // Κατάσταση για τη μετατροπή Κλάσματος -> Δεκαδικού
  const [arithmitis, setArithmitis] = useState(7);
  const [paronomastis, setParonomastis] = useState(10); // 10, 100, 1000

  // Υπολογισμοί για Δεκαδικό -> Κλάσμα
  const cleanDekadikos = parseFloat(dekadikos) || 0;
  const parts = dekadikos.split('.');
  const decPart = parts[1] || "";
  const numDigits = Math.min(decPart.length, 3); // μέχρι 3 ψηφία (χιλιοστά)
  const dynamicDen = Math.pow(10, numDigits);
  const dynamicNum = Math.round(cleanDekadikos * dynamicDen);

  // Καθορισμός του τρέχοντος παρονομαστή βάσει του Tab για τη σχεδίαση του πλέγματος
  const currentDenominator = activeTab === 'toKlasma' ? dynamicDen : paronomastis;
  const currentNumerator = activeTab === 'toKlasma' ? dynamicNum : arithmitis;

  // Σχεδίαση των δυναμικών κουτιών μέσω SVG (Σταθερή διάσταση 300x300)
  const renderGridSquares = () => {
    const squares = [];
    const size = 300;

    if (currentDenominator === 10) {
      // 10 Οριζόντιες Λωρίδες (Δέκατα)
      const height = size / 10;
      for (let i = 0; i < 10; i++) {
        const isFilled = i < currentNumerator;
        squares.push(
          <rect
            key={i}
            x="0"
            y={i * height}
            width={size}
            height={height}
            className={`transition-all duration-300 stroke-slate-300 stroke-[1.5] ${isFilled ? 'fill-gradient-to-br fill-orange-500' : 'fill-white'}`}
          />
        );
      }
    } else if (currentDenominator === 100) {
      // Пλέγμα 10x10 (Εκατοστά)
      const boxSize = size / 10;
      let count = 0;
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          const isFilled = count < currentNumerator;
          squares.push(
            <rect
              key={count}
              x={c * boxSize}
              y={r * boxSize}
              width={boxSize}
              height={boxSize}
              className={`transition-all duration-200 stroke-slate-200 stroke-[1] ${isFilled ? 'fill-orange-500' : 'fill-white'}`}
            />
          );
          count++;
        }
      }
    } else if (currentDenominator === 1000) {
      // Πλέγμα 31x32 ~ 1000 (Χιλιοστά) για τέλεια τετραγωνισμένη γεωμετρία
      const rows = 25;
      const cols = 40;
      const boxW = size / cols;
      const boxH = size / rows;
      let count = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isFilled = count < currentNumerator;
          squares.push(
            <rect
              key={count}
              x={c * boxW}
              y={r * boxH}
              width={boxW}
              height={boxH}
              className={`transition-colors duration-100 stroke-slate-100/50 stroke-[0.3] ${isFilled ? 'fill-orange-500' : 'fill-white'}`}
            />
          );
          count++;
        }
      }
    }
    return squares;
  };

  // Λεκτικό για το υποσέλιδο του γραφήματος
  const getGridLabel = () => {
    if (currentDenominator === 10) return "δέκατα";
    if (currentDenominator === 100) return "εκατοστά";
    return "χιλιοστά";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔄 Δεκαδικοί & Κλάσματα - LearnMaths.gr</title>
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
                  📖 Θεωρία: Δεκαδικοί και Δεκαδικά Κλάσματα
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  Κάθε δεκαδικός αριθμός μπορεί να γραφτεί ως **δεκαδικό κλάσμα** και το αντίστροφο, αφού και τα δύο εκφράζουν ένα μέρος της ακέραιης μονάδας.
                </p>
                <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-3 text-sm md:text-base font-medium">
                  <p>➡️ <strong>Από Δεκαδικό σε Κλάσμα:</strong> Γράφουμε στον αριθμητή όλο τον αριθμό χωρίς την υποδιαστολή. Στον παρονομαστή βάζουμε το 1 με τόσα μηδενικά όσα ήταν τα δεκαδικά ψηφία.</p>
                  <p>⬅️ <strong>Από Κλάσμα σε Δεκαδικό:</strong> Γράφουμε τον αριθμητή και χωρίζουμε με υποδιαστολή από δεξιά προς τα αριστερά τόσα ψηφία όσα είναι τα μηδενικά του παρονομαστή.</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-md space-y-4 text-center">
                <p className="font-bold text-amber-300 text-sm md:text-base">💡 Παράδειγμα Αντιστοιχίας:</p>
                <div className="flex items-center justify-center gap-6 font-mono text-xl md:text-2xl font-black">
                  <span className="bg-white/10 px-4 py-2 rounded-xl">0,45</span>
                  <span className="text-amber-300">＝</span>
                  <div className="inline-flex flex-col items-center">
                    <span>45</span>
                    <div className="w-12 h-[2px] bg-white"></div>
                    <span>100</span>
                  </div>
                </div>
                <p className="text-xs text-indigo-100">2 δεκαδικά ψηφία ➔ 2 μηδενικά στον παρονομαστή!</p>
              </div>
            </div>
          </div>

          {/* TABS EΠΙΛΟΓΗΣ ΛΕΙΤΟΥΡΓΙΑΣ */}
          <div className="flex justify-center bg-gray-200/60 p-1.5 rounded-2xl max-w-md mx-auto shadow-inner">
            <button 
              onClick={() => setActiveTab('toKlasma')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'toKlasma' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              🔢 Δεκαδικός ➔ Κλάσμα
            </button>
            <button 
              onClick={() => setActiveTab('toDekadiko')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'toDekadiko' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              🍕 Κλάσμα ➔ Δεκαδικός
            </button>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & INPUTS */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[480px] w-full gap-6">
              
              {activeTab === 'toKlasma' ? (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Μετατροπή σε Κλάσμα</h3>
                    <p className="text-gray-500 text-sm">Γράψε έναν δεκαδικό αριθμό (έως 3 δεκαδικά ψηφία με τελεία, π.χ. 0.4, 0.45 ή 0.456).</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center shadow-inner my-auto">
                    <input 
                      type="text" 
                      value={dekadikos}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9.]/g, '');
                        // Περιορισμός: Μόνο αριθμοί μικρότεροι του 1 (0.xxx) για σωστή απεικόνιση στη 1 μονάδα
                        if (val.startsWith('.')) val = '0' + val;
                        const dotParts = val.split('.');
                        if ((val.match(/\./g) || []).length <= 1 && (!dotParts[1] || dotParts[1].length <= 3)) {
                          if (!dotParts[0] || parseFloat(val) <= 1) {
                            setDekadikos(val);
                          }
                        }
                      }}
                      className="text-3xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all w-full max-w-sm tracking-wider text-blue-600"
                    />
                  </div>

                  {/* Αποτέλεσμα Μετατροπής */}
                  <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex-1 font-sans text-center flex flex-col justify-center items-center gap-2 shadow-inner">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Το Δεκαδικό Κλάσμα είναι:</span>
                    <div className="flex items-center gap-4 text-2xl font-black text-slate-700 font-mono">
                      <span>{dekadikos || "0"}</span>
                      <span className="text-blue-500">➔</span>
                      <div className="inline-flex flex-col items-center leading-tight">
                        <span className="text-emerald-600">{dynamicNum}</span>
                        <div className="w-16 h-0.5 bg-slate-700 my-1"></div>
                        <span className="text-blue-600">{dynamicDen}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Μετατροπή σε Δεκαδικό</h3>
                    <p className="text-gray-500 text-sm">Όρισε τον αριθμητή και επίλεξε έναν δεκαδικό παρονομαστή (10, 100, 1000).</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col gap-4 shadow-inner my-auto">
                    {/* Έλεγχος Αριθμητή */}
                    <div className="flex items-center justify-between w-full max-w-xs mx-auto">
                      <span className="font-bold text-sm text-gray-600">Αριθμητής:</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setArithmitis(Math.max(0, arithmitis - 1))} className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-gray-300">-</button>
                        <span className="w-14 text-center font-black text-xl text-emerald-600 tabular-nums">{arithmitis}</span>
                        <button onClick={() => setArithmitis(Math.min(paronomastis, arithmitis + 1))} className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-gray-300">+</button>
                      </div>
                    </div>

                    {/* Επιλογή Παρονομαστή */}
                    <div className="flex items-center justify-between w-full max-w-xs mx-auto">
                      <span className="font-bold text-sm text-gray-600">Παρονομαστής:</span>
                      <div className="flex gap-2">
                        {[10, 100, 1000].map((den) => (
                          <button 
                            key={den}
                            onClick={() => {
                              setParonomastis(den);
                              if(arithmitis > den) setArithmitis(den);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${paronomastis === den ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border text-gray-500 hover:bg-gray-100'}`}
                          >
                            {den}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Αποτέλεσμα Μετατροπής */}
                  <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex-1 font-sans text-center flex flex-col justify-center items-center gap-2 shadow-inner">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Ο Δεκαδικός Αριθμός είναι:</span>
                    <div className="flex items-center gap-4 text-2xl font-black text-slate-700 font-mono">
                      <div className="inline-flex flex-col items-center leading-tight">
                        <span className="text-emerald-600">{arithmitis}</span>
                        <div className="w-14 h-0.5 bg-slate-700 my-1"></div>
                        <span className="text-blue-600">{paronomastis}</span>
                      </div>
                      <span className="text-blue-500">➔</span>
                      <span className="text-purple-600 bg-purple-50 px-4 py-1.5 rounded-2xl border border-purple-100">
                        {(arithmitis / paronomastis).toFixed(paronomastis === 10 ? 1 : paronomastis === 100 ? 2 : 3)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΔΥΝΑΜΙΚΟ SVG ΠΛΕΓΜΑ (10, 100, 1000 ΚΟΥΤΑΚΙΑ) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[480px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <div className="my-auto flex flex-col items-center gap-4 w-full">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Οπτική Αναπαράσταση στη Μονάδα:</span>
                
                {/* SVG CONTAINER ΣΤΑΘΕΡΟΥ ΜΕΓΕΘΟΥΣ */}
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-inner">
                  <svg 
                    width="280" 
                    height="280" 
                    viewBox="0 0 300 300" 
                    className="bg-white drop-shadow-sm rounded"
                  >
                    {renderGridSquares()}
                  </svg>
                </div>

                <span className="text-sm font-black text-slate-700 tabular-nums">
                  Καλύφθηκαν: <span className="text-orange-500">{currentNumerator}</span> / {currentDenominator} {getGridLabel()}
                </span>
              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>🔍 Παρατήρησε πώς αλλάζει το μέγεθος των κουτιών ανάλογα με τον παρονομαστή.</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Μετατροπές Δεκαδικών Μορφών ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
