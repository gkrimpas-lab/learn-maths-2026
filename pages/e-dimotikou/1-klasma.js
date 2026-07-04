// pages/e-dimotikou/1-klasma.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  INTRO_NUM_MIN: 0,
  INTRO_NUM_MAX: 50,
  LIMITS_INTRO_DEN_MIN: 1,
  INTRO_DEN_MAX: 50
};

export default function KlasmaPage() {
  const [num1, setNum1] = useState(3);
  const [den1, setDen1] = useState(4);

  // Μεγαλώσαμε τις εσωτερικές διαστάσεις σχεδίασης (ακτίνα 90, κέντρο 100)
  const renderPieSlices = (pieIndex, totalSlicesToColor, currentDen) => {
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
      
      const currentSliceNumber = pieIndex * currentDen + i; 
      const isColored = currentSliceNumber < totalSlicesToColor;
      
      if (currentDen === 1) {
        slices.push(
          <circle 
            key={i} 
            cx={cx} 
            cy={cy} 
            r={radius} 
            className={`${isColored ? 'fill-orange-500' : 'fill-gray-200'} stroke-white stroke-2`} 
          />
        );
        continue;
      }
      
      const largeArcFlag = 360 / currentDen > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      slices.push(
        <path 
          key={i} 
          d={pathData} 
          className={`${isColored ? 'fill-orange-500' : 'fill-gray-100'} stroke-cyan-600 stroke-2`} 
        />
      );
    }
    return slices;
  };

  const totalPies1 = Math.max(1, Math.ceil(num1 / den1));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🍕 Τι είναι Κλάσμα; - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR - Fluid ευθυγράμμιση */}
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
            
            {/* ΘΕΩΡΙΑ - Μεγαλύτερα κείμενα στις μεγάλες οθόνες */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">Τι είναι το Κλάσμα;</h2>
                <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                  Κλάσμα είναι ένας αριθμός που μας δείχνει <strong>σε πόσα ίσα μέρη</strong> έχουμε χωρίσει μια μονάδα και <strong>πόσα από αυτά τα μέρη</strong> έχουμε πάρει.
                </p>
                <div className="bg-cyan-50 p-5 rounded-2xl border border-cyan-100 text-sm xl:text-base text-cyan-900 space-y-2 shadow-inner">
                  <p>☝️ <strong>Αριθμητής (πάνω):</strong> Πόσα κομμάτια πήραμε.</p>
                  <p>👇 <strong>Παρονομαστής (κάτω):</strong> Σε πόσα συνολικά κομμάτια κόψαμε τη μονάδα.</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-8 rounded-2xl shadow-md text-center py-12">
                <div className="inline-flex flex-col items-center font-black text-4xl xl:text-5xl tracking-wide">
                  <div className="text-amber-300 pb-2">Αριθμητής</div>
                  <div className="w-48 xl:w-56 h-1.5 bg-white rounded-full my-2"></div>
                  <div className="text-white pt-2">Παρονομαστής</div>
                </div>
              </div>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-6">
              <h3 className="text-xl font-black text-center text-gray-800 xl:text-2xl">🍕 Διαδραστική Πίτα Κλασμάτων</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                
                {/* Χειριστήρια με μεγαλύτερα κουμπιά και inputs */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center space-y-6">
                  <div className="flex items-center justify-between w-full max-w-sm gap-4">
                    <span className="text-sm xl:text-base font-bold text-gray-500 w-28 text-right">Αριθμητής:</span>
                    <button onClick={() => setNum1(Math.max(LIMITS.INTRO_NUM_MIN, num1 - 1))} className="bg-red-500 text-white w-10 h-10 rounded-full font-black text-lg hover:bg-red-600 transition shadow-sm">-</button>
                    <span className="w-12 text-center text-2xl font-black text-red-600">{num1}</span>
                    <button onClick={() => setNum1(Math.min(LIMITS.INTRO_NUM_MAX, num1 + 1))} className="bg-green-500 text-white w-10 h-10 rounded-full font-black text-lg hover:bg-green-600 transition shadow-sm">+</button>
                  </div>
                  
                  <div className="w-full max-w-sm h-[2px] bg-gray-100"></div>
                  
                  <div className="flex items-center justify-between w-full max-w-sm gap-4">
                    <span className="text-sm xl:text-base font-bold text-gray-500 w-28 text-right">Παρονομαστής:</span>
                    <button onClick={() => setDen1(Math.max(LIMITS.LIMITS_INTRO_DEN_MIN, den1 - 1))} className="bg-red-500 text-white w-10 h-10 rounded-full font-black text-lg hover:bg-red-600 transition shadow-sm">-</button>
                    <span className="w-12 text-center text-2xl font-black text-blue-600">{den1}</span>
                    <button onClick={() => setDen1(Math.min(LIMITS.INTRO_DEN_MAX, den1 + 1))} className="bg-green-500 text-white w-10 h-10 rounded-full font-black text-lg hover:bg-green-600 transition shadow-sm">+</button>
                  </div>
                </div>

                {/* Χώρος εμφάνισης των SVG - Τώρα μεγαλώνουν δυναμικά */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap justify-center gap-6 min-h-[220px] items-center">
                  {Array.from({ length: totalPies1 }).map((_, i) => (
                    <svg 
                      key={i} 
                      viewBox="0 0 200 200" 
                      className="w-full max-w-[160px] xl:max-w-[180px] h-auto drop-shadow-md transition-all duration-200"
                    >
                      {renderPieSlices(i, num1, den1)}
                    </svg>
                  ))}
                </div>

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
