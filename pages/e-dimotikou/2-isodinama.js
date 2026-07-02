// pages/e-dimotikou/2-isodinama.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  NUM_MIN: 1,
  NUM_MAX: 10,
  DEN_MIN: 1,
  DEN_MAX: 12,
  MULT_MIN: 2,
  MULT_MAX: 5
};

export default function IsodinamaPage() {
  // Αρχικό Κλάσμα
  const [num, setNum] = useState(2);
  const [den, setDen] = useState(3);
  
  // Πολλαπλασιαστής
  const [multiplier, setMultiplier] = useState(2);

  // Ισοδύναμο Κλάσμα (Υπολογιζόμενο)
  const isoNum = num * multiplier;
  const isoDen = den * multiplier;

  // Σχεδίαση πίτας (Μεγάλη Ακτίνα 90, Κέντρο 100 - όπως στο 1-klasma)
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

        {/* MAIN CONTENT - Όπως στο 1-klasma */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12`}>
          <div className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            
            {/* ΘΕΩΡΙΑ */}
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">🔄 Ισοδύναμα Κλάσματα</h2>
              <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                Αν πολλαπλασιάσουμε τον αριθμητή και τον παρονομαστή ενός κλάσματος με τον <strong>ίδιο αριθμό</strong>, σχηματίζουμε ένα νέο κλάσμα που είναι <strong>ισοδύναμο</strong> με το αρχικό. Δηλαδή, εκφράζει ακριβώς την ίδια ποσότητα!
              </p>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-6">
              
              {/* 1. ΕΠΙΛΟΓΗ ΠΟΛΛΑΠΛΑΣΙΑΣΤΗ */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 flex items-center justify-between max-w-xl mx-auto gap-4">
                <span className="font-bold text-amber-900 text-sm xl:text-base">Διάλεξε Πολλαπλασιαστή:</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setMultiplier(Math.max(LIMITS.MULT_MIN, multiplier - 1))} className="bg-amber-500 text-white w-9 h-9 rounded-full font-black text-lg hover:bg-amber-600 transition shadow-sm">-</button>
                  <span className="w-8 text-center font-black text-xl text-amber-700">{multiplier}</span>
                  <button onClick={() => setMultiplier(Math.min(LIMITS.MULT_MAX, multiplier + 1))} className="bg-amber-500 text-white w-9 h-9 rounded-full font-black text-lg hover:bg-amber-600 transition shadow-sm">+</button>
                </div>
              </div>

              {/* 2. ΡΥΘΜΙΣΗ ΑΡΧΙΚΟΥ ΚΛΑΣΜΑΤΟΣ */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-center items-center gap-6 max-w-2xl mx-auto text-sm font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <span>Αριθμητής:</span>
                  <button onClick={() => setNum(Math.max(LIMITS.NUM_MIN, num - 1))} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-slate-300 transition">-</button>
                  <span className="w-6 text-center font-black text-base text-slate-800">{num}</span>
                  <button onClick={() => setNum(Math.min(den, num + 1))} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-slate-300 transition">+</button>
                </div>
                <div className="w-[1px] h-6 bg-gray-200 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <span>Παρονομαστής:</span>
                  <button onClick={() => { const newDen = Math.max(LIMITS.DEN_MIN, den - 1); setDen(newDen); if(num > newDen) setNum(newDen); }} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-slate-300 transition">-</button>
                  <span className="w-6 text-center font-black text-base text-slate-800">{den}</span>
                  <button onClick={() => setDen(Math.min(LIMITS.DEN_MAX, den + 1))} className="bg-slate-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-slate-300 transition">+</button>
                </div>
              </div>

              {/* 3. ΔΥΟ ΠΛΕΥΡΕΣ (ΑΡΧΙΚΟ vs ΙΣΟΔΥΝΑΜΟ) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                
                {/* ΠΛΕΥΡΑ Α: ΑΡΧΙΚΟ */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center space-y-6">
                  <span className="text-xs uppercase font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-wider">Αρχικό Κλάσμα</span>
                  
                  {/* Κλασματική Μορφή */}
                  <div className="flex flex-col items-center font-black text-4xl text-blue-600">
                    <div>{num}</div>
                    <div className="w-12 h-1.5 bg-blue-500 my-1 rounded-full"></div>
                    <div>{den}</div>
                  </div>

                  {/* SVG Πίτα Α */}
                  <div className="bg-gray-50/50 p-4 rounded-xl border w-full flex justify-center">
                    <svg viewBox="0 0 200 200" className="w-full max-w-[160px] xl:max-w-[180px] h-auto drop-shadow-md">
                      {renderPieSlices(num, den)}
                    </svg>
                  </div>
                </div>

                {/* ΠΛΕΥΡΑ Β: ΙΣΟΔΥΝΑΜΟ */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center space-y-6">
                  <span className="text-xs uppercase font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full tracking-wider">Ισοδύναμο Κλάσμα</span>
                  
                  {/* Μαθηματική Ανάλυση Πράξης & Αποτέλεσμα (Όπως στην εικόνα_4) */}
                  <div className="flex items-center gap-4 bg-slate-50 border p-3 px-6 rounded-xl font-black text-2xl text-slate-700">
                    <div className="flex flex-col items-center text-orange-500 text-base">
                      <div>{num} × {multiplier}</div>
                      <div className="w-16 h-[2px] bg-orange-400 my-1"></div>
                      <div>{den} × {multiplier}</div>
                    </div>
                    <span className="text-slate-400 text-xl">=</span>
                    <div className="flex flex-col items-center text-emerald-600 text-4xl">
                      <div>{isoNum}</div>
                      <div className="w-14 h-1.5 bg-emerald-500 my-1 rounded-full"></div>
                      <div>{isoDen}</div>
                    </div>
                  </div>

                  {/* SVG Πίτα Β */}
                  <div className="bg-gray-50/50 p-4 rounded-xl border w-full flex justify-center">
                    <svg viewBox="0 0 200 200" className="w-full max-w-[160px] xl:max-w-[180px] h-auto drop-shadow-md">
                      {renderPieSlices(isoNum, isoDen)}
                    </svg>
                  </div>
                </div>

              </div>

              {/* ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="p-4 bg-emerald-600 text-white rounded-xl text-center font-bold text-sm xl:text-base shadow-md max-w-xl mx-auto">
                📢 Κοίταξε τις δύο πίτες: Παρόλο που η δεύτερη έχει περισσότερα κομμάτια, η συνολική πορτοκαλί επιφάνεια είναι ακριβώς η ίδια!
              </div>

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
