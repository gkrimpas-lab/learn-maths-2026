// pages/e-dimotikou/2-isodinama.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  SAME_DEN_MIN: 1,
  SAME_DEN_MAX: 12
};

export default function IsodinamaPage() {
  // Κλάσμα 1 (Αριστερό)
  const [num1, setNum1] = useState(1);
  const [den1, setDen1] = useState(2);

  // Κλάσμα 2 (Δεξί)
  const [num2, setNum2] = useState(2);
  const [den2, setDen2] = useState(4);

  // Σχεδίαση πίτας (Ακτίνα 90, Κέντρο 100)
  const renderPie = (currentNum, currentDen) => {
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

  // Έλεγχος ισοδυναμίας (χιαστί γινόμενα)
  const isEquivalent = num1 * den2 === num2 * den1;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔄 Ισοδύναμα Κλάσματα - LearnMaths.gr</title>
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
              <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">🔄 Ισοδύναμα Κλάσματα</h2>
              <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                Ισοδύναμα ονομάζονται τα κλάσματα που αν και έχουν <strong>διαφορετικούς αριθμητές και παρονομαστές</strong>, εκφράζουν το <strong>ίδιο μέρος</strong> μιας επιφάνειας ή ενός ποσού.
              </p>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΗ ΣΥΓΚΡΙΣΗ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* ΑΡΙΣΤΕΡΟ ΚΛΑΣΜΑ */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center space-y-6">
                  <span className="text-xs uppercase font-black text-cyan-600 tracking-wider">Κλάσμα Α</span>
                  
                  {/* SVG Πίτα Α */}
                  <svg viewBox="0 0 200 200" className="w-full max-w-[160px] xl:max-w-[180px] h-auto drop-shadow-md">
                    {renderPie(num1, den1)}
                  </svg>

                  {/* Controls Α */}
                  <div className="w-full max-w-xs space-y-3 pt-2">
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border">
                      <span className="text-xs font-bold text-gray-500">Αριθμητής:</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setNum1(Math.max(0, num1 - 1))} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-black hover:bg-slate-300 transition shadow-sm">-</button>
                        <span className="w-8 text-center font-black text-lg text-slate-800">{num1}</span>
                        <button onClick={() => setNum1(Math.min(den1, num1 + 1))} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-black hover:bg-slate-300 transition shadow-sm">+</button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border">
                      <span className="text-xs font-bold text-gray-500">Παρονομαστής:</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { const newDen = Math.max(LIMITS.SAME_DEN_MIN, den1 - 1); setDen1(newDen); if(num1 > newDen) setNum1(newDen); }} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-black hover:bg-slate-300 transition shadow-sm">-</button>
                        <span className="w-8 text-center font-black text-lg text-slate-800">{den1}</span>
                        <button onClick={() => setDen1(Math.min(LIMITS.SAME_DEN_MAX, den1 + 1))} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-black hover:bg-slate-300 transition shadow-sm">+</button>
                      </div>
                    </div>
                  </div>

                  {/* Κλασματική Μορφή Α */}
                  <div className="flex flex-col items-center font-black text-3xl text-slate-700 bg-slate-50 px-6 py-2 rounded-xl border">
                    <div>{num1}</div>
                    <div className="w-10 h-1 bg-slate-400 my-1 rounded-full"></div>
                    <div>{den1}</div>
                  </div>
                </div>

                {/* ΔΕΞΙ ΚΛΑΣΜΑ */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center space-y-6">
                  <span className="text-xs uppercase font-black text-indigo-600 tracking-wider">Κλάσμα Β</span>
                  
                  {/* SVG Πίτα Β */}
                  <svg viewBox="0 0 200 200" className="w-full max-w-[160px] xl:max-w-[180px] h-auto drop-shadow-md">
                    {renderPie(num2, den2)}
                  </svg>

                  {/* Controls Β */}
                  <div className="w-full max-w-xs space-y-3 pt-2">
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border">
                      <span className="text-xs font-bold text-gray-500">Αριθμητής:</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setNum2(Math.max(0, num2 - 1))} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-black hover:bg-slate-300 transition shadow-sm">-</button>
                        <span className="w-8 text-center font-black text-lg text-slate-800">{num2}</span>
                        <button onClick={() => setNum2(Math.min(den2, num2 + 1))} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-black hover:bg-slate-300 transition shadow-sm">+</button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border">
                      <span className="text-xs font-bold text-gray-500">Παρονομαστής:</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { const newDen = Math.max(LIMITS.SAME_DEN_MIN, den2 - 1); setDen2(newDen); if(num2 > newDen) setNum2(newDen); }} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-black hover:bg-slate-300 transition shadow-sm">-</button>
                        <span className="w-8 text-center font-black text-lg text-slate-800">{den2}</span>
                        <button onClick={() => setDen2(Math.min(LIMITS.SAME_DEN_MAX, den2 + 1))} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-black hover:bg-slate-300 transition shadow-sm">+</button>
                      </div>
                    </div>
                  </div>

                  {/* Κλασματική Μορφή Β */}
                  <div className="flex flex-col items-center font-black text-3xl text-slate-700 bg-slate-50 px-6 py-2 rounded-xl border">
                    <div>{num2}</div>
                    <div className="w-10 h-1 bg-slate-400 my-1 rounded-full"></div>
                    <div>{den2}</div>
                  </div>
                </div>

              </div>

              {/* LIVE ΑΠΟΤΕΛΕΣΜΑ ΣΥΓΚΡΙΣΗΣ */}
              <div className={`p-6 rounded-2xl text-center font-black text-xl border shadow-md max-w-xl mx-auto transition-all duration-300 ${isEquivalent ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-rose-500 text-white border-rose-400'}`}>
                {isEquivalent ? (
                  <div className="space-y-1">
                    <div>✅ Τα κλάσματα είναι ΙΣΟΔΥΝΑΜΑ!</div>
                    <div className="text-sm font-medium opacity-90">Καλύπτουν ακριβώς το ίδιο μέρος της πίτας ({num1}/{den1} = {num2}/{den2}).</div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div>❌ Δεν είναι ισοδύναμα</div>
                    <div className="text-sm font-medium opacity-90">Οι χρωματισμένες επιφάνειες διαφέρουν.</div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Σχεδιασμένο για μεγάλες και μικρές οθόνες.</p>
      </footer>
    </div>
  );
}
