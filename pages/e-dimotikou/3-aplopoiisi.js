// pages/e-dimotikou/3-aplopoiisi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function AplopoiisiPage() {
  // Αρχικό μεγάλο κλάσμα (π.χ. 4/8)
  const [num, setNum] = useState(4);
  const [den, setDen] = useState(8);
  
  // Διαιρέτης
  const [divisor, setDivisor] = useState(2);

  // Έλεγχος αν ο επιλεγμένος διαιρέτης διαιρεί ακριβώς ΚΑΙ τον αριθμητή ΚΑΙ τον παρονομαστή
  const isValidDivisor = num % divisor === 0 && den % divisor === 0;

  // Υπολογισμός του νέου απλοποιημένου κλάσματος
  const simpleNum = isValidDivisor ? num / divisor : num;
  const simpleDen = isValidDivisor ? den / divisor : den;

  // Σχεδίαση πίτας (Μεγάλη Ακτίνα 90, Κέντρο 100 - Απόλυτη ομοιομορφία με 1 και 2)
  const renderPieSlices = (currentNum, currentDen) => {
    const slices = [];
    const radius = 90;
    const cx = 100;
    const cy = 100;

    for (let i = 0; i < currentDen; i++) {
      const startAngle = (i * 360) / currentDen - 90;
      const endAngle = ((i + 1) * 360) / currentDen - 90;

      const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = cx + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = cy + radius * Math.sin((endAngle * Math.PI) / 180);

      const isColored = i < currentNum;

      if (currentDen === 1) {
        slices.push(
          <circle key={i} cx={cx} cy={cy} r={radius} className={`${isColored ? 'fill-orange-500' : 'fill-gray-200'} stroke-white stroke-2`} />
        );
        continue;
      }

      const largeArcFlag = 360 / currentDen > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      slices.push(
        <path key={i} d={pathData} className={`${isColored ? 'fill-orange-500' : 'fill-gray-100'} stroke-cyan-600 stroke-2`} />
      );
    }
    return slices;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>✂️ Απλοποίηση Κλάσματος - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR - Fluid */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/e-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12`}>
          <div className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            
            {/* ΘΕΩΡΙΑ */}
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">✂️ Απλοποίηση Κλάσματος</h2>
              <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                Απλοποίηση είναι η διαδικασία στην οποία <strong>διαιρούμε</strong> τον αριθμητή και τον παρονομαστή με τον <strong>ίδιο αριθμό</strong>. Έτσι, φτιάχνουμε ένα ισοδύναμο κλάσμα με μικρότερους όρους, που είναι πιο εύκολο στους υπολογισμούς!
              </p>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-6">
              
              {/* 1. ΡΥΘΜΙΣΗ ΑΡΧΙΚΟΥ ΜΕΓΑΛΟΥ ΚΛΑΣΜΑΤΟΣ */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-center items-center gap-6 max-w-2xl mx-auto text-sm font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <span>Αρχικός Αριθμητής:</span>
                  <button onClick={() => setNum(Math.max(1, num - 1))} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-slate-300 transition">-</button>
                  <span className="w-6 text-center font-black text-base text-slate-800">{num}</span>
                  <button onClick={() => setNum(Math.min(den, num + 1))} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-slate-300 transition">+</button>
                </div>
                <div className="w-[1px] h-6 bg-gray-200 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <span>Αρχικός Παρονομαστής:</span>
                  <button onClick={() => { const newDen = Math.max(2, den - 1); setDen(newDen); if(num > newDen) setNum(newDen); }} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-slate-300 transition">-</button>
                  <span className="w-6 text-center font-black text-base text-slate-800">{den}</span>
                  <button onClick={() => setDen(Math.min(12, den + 1))} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-slate-300 transition">+</button>
                </div>
              </div>

              {/* 2. ΕΠΙΛΟΓΗ ΔΙΑΙΡΕΤΗ */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between max-w-xl mx-auto gap-4">
                <span className="font-bold text-amber-900 text-sm xl:text-base">Διάλεξε κοινό διαιρέτη (÷):</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setDivisor(Math.max(2, divisor - 1))} className="bg-amber-500 text-white w-9 h-9 rounded-full font-black text-lg hover:bg-amber-600 transition shadow-sm">-</button>
                  <span className="w-8 text-center font-black text-xl text-amber-700">{divisor}</span>
                  <button onClick={() => setDivisor(Math.min(12, divisor + 1))} className="bg-amber-500 text-white w-9 h-9 rounded-full font-black text-lg hover:bg-amber-600 transition shadow-sm">+</button>
                </div>
              </div>

              {/* 3. ΔΥΟ ΠΛΕΥΡΕΣ (ΑΡΧΙΚΟ vs ΑΠΛΟΠΟΙΗΜΕΝΟ) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                
                {/* ΑΡΧΙΚΟ ΚΛΑΣΜΑ */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center space-y-6">
                  <span className="text-xs uppercase font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-wider">Αρχικό Κλάσμα</span>
                  
                  <div className="flex flex-col items-center font-black text-4xl text-blue-600">
                    <div>{num}</div>
                    <div className="w-12 h-1.5 bg-blue-500 my-1 rounded-full"></div>
                    <div>{den}</div>
                  </div>

                  <div className="bg-gray-50/50 p-4 rounded-xl border w-full flex justify-center">
                    <svg viewBox="0 0 200 200" className="w-full max-w-[160px] xl:max-w-[180px] h-auto drop-shadow-md">
                      {renderPieSlices(num, den)}
                    </svg>
                  </div>
                </div>

                {/* ΑΠΛΟΠΟΙΗΜΕΝΟ ΚΛΑΣΜΑ */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center space-y-6">
                  <span className="text-xs uppercase font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full tracking-wider">Νέο Απλοποιημένο Κλάσμα</span>
                  
                  {isValidDivisor ? (
                    <div className="flex items-center gap-4 bg-emerald-50/60 border border-emerald-200 p-3 px-6 rounded-xl font-black text-2xl text-slate-700 animate-fade-in">
                      <div className="flex flex-col items-center text-amber-600 text-base">
                        <div>{num} ÷ {divisor}</div>
                        <div className="w-16 h-[2px] bg-amber-400 my-1"></div>
                        <div>{den} ÷ {divisor}</div>
                      </div>
                      <span className="text-slate-400 text-xl">=</span>
                      <div className="flex flex-col items-center text-emerald-600 text-4xl">
                        <div>{simpleNum}</div>
                        <div className="w-14 h-1.5 bg-emerald-500 my-1 rounded-full"></div>
                        <div>{simpleDen}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center bg-rose-50 border border-rose-200 p-4 rounded-xl text-center text-rose-700 min-h-[86px] w-full max-w-xs">
                      <span className="font-bold text-sm">❌ Αδύνατη Διαίρεση!</span>
                      <span className="text-[11px] mt-0.5 opacity-90">Το {divisor} δεν διαιρεί ακριβώς το {num} ή το {den}.</span>
                    </div>
                  )}

                  <div className="bg-gray-50/50 p-4 rounded-xl border w-full flex justify-center">
                    <svg viewBox="0 0 200 200" className="w-full max-w-[160px] xl:max-w-[180px] h-auto drop-shadow-md">
                      {renderPieSlices(simpleNum, simpleDen)}
                    </svg>
                  </div>
                </div>

              </div>

              {/* ΕΚΠΑΙΔΕΥΤΙΚΟ ΜΗΝΥΜΑ */}
              {isValidDivisor && simpleNum === 1 && simpleDen === den / num && (
                <div className="p-3 bg-indigo-600 text-white rounded-xl text-center font-black text-xs xl:text-sm shadow-md max-w-lg mx-auto">
                  👑 Μπράβο! Φτάσαμε στο πιο απλό κλάσμα. Αυτό ονομάζεται Ανάγωγο Κλάσμα!
                </div>
              )}

            </div>

          </div>
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Widescreen & Responsive Σχεδιασμός.</p>
      </footer>
    </div>
  );
}
