// pages/e-dimotikou/1-klasma.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  INTRO_NUM_MIN: 0,
  INTRO_NUM_MAX: 20,
  LIMITS_INTRO_DEN_MIN: 1,
  INTRO_DEN_MAX: 12
};

export default function KlasmaPage() {
  const [num1, setNum1] = useState(3);
  const [den1, setDen1] = useState(4);

  const renderPieSlices = (pieIndex, totalSlicesToColor, currentDen) => {
    const slices = []; const radius = 45; const cx = 55; const cy = 55;
    for (let i = 0; i < currentDen; i++) {
      const startAngle = (i * 360) / currentDen - 90; const endAngle = ((i + 1) * 360) / currentDen - 90;
      const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180); const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = cx + radius * Math.cos((endAngle * Math.PI) / 180); const y2 = cy + radius * Math.sin((endAngle * Math.PI) / 180);
      const currentSliceNumber = pieIndex * currentDen + i; const isColored = currentSliceNumber < totalSlicesToColor;
      if (currentDen === 1) {
        slices.push(<circle key={i} cx={cx} cy={cy} r={radius} className={`${isColored ? 'fill-orange-500' : 'fill-gray-200'} stroke-white stroke-2`} />);
        continue;
      }
      const largeArcFlag = 360 / currentDen > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      slices.push(<path key={i} d={pathData} className={`${isColored ? 'fill-orange-500' : 'fill-gray-100'} stroke-cyan-600 stroke-[1.5]`} />);
    }
    return slices;
  };

  const totalPies1 = Math.max(1, Math.ceil(num1 / den1));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>🍕 Τι είναι Κλάσμα; - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">LearnMaths<span className="text-indigo-600">.gr</span></Link>
          <Link href="/e-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">🔙 Επιστροφή</Link>
        </div>
      </nav>

      <main className={`${LAYOUT.LESSON_CONTAINER} py-12`}>
        <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900">Τι είναι το Κλάσμα;</h2>
              <p className="text-gray-600 leading-relaxed text-sm">Κλάσμα είναι ένας αριθμός που μας δείχνει <strong>σε πόσα ίσα μέρη</strong> έχουμε χωρίσει μια μονάδα και <strong>πόσα από αυτά τα μέρη</strong> έχουμε πάρει.</p>
              <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100 text-xs text-cyan-900">
                <p>☝️ <strong>Αριθμητής (πάνω):</strong> Πόσα κομμάτια πήραμε.</p>
                <p className="mt-1">👇 <strong>Παρονομαστής (κάτω):</strong> Σε πόσα συνολικά κομμάτια κόψαμε τη μονάδα.</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-2xl shadow-md text-center">
              <div className="inline-flex flex-col items-center font-black text-4xl">
                <div className="text-amber-300 pb-1">Αριθμητής</div>
                <div className="w-36 h-1 bg-white rounded-full my-1"></div>
                <div className="text-white pt-1">Παρονομαστής</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
            <h3 className="text-lg font-bold text-center text-gray-800">🍕 Διαδραστική Πίτα Κλασμάτων</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-500 w-24 text-right">Αριθμητής:</span>
                  <button onClick={() => setNum1(Math.max(LIMITS.INTRO_NUM_MIN, num1 - 1))} className="bg-red-500 text-white w-8 h-8 rounded-full font-bold hover:bg-red-600 transition">-</button>
                  <span className="w-8 text-center text-xl font-black text-red-600">{num1}</span>
                  <button onClick={() => setNum1(Math.min(LIMITS.INTRO_NUM_MAX, num1 + 1))} className="bg-green-500 text-white w-8 h-8 rounded-full font-bold hover:bg-green-600 transition">+</button>
                </div>
                <div className="w-40 h-[2px] bg-gray-200"></div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-500 w-24 text-right">Παρονομαστής:</span>
                  <button onClick={() => setDen1(Math.max(LIMITS.LIMITS_INTRO_DEN_MIN, den1 - 1))} className="bg-red-500 text-white w-8 h-8 rounded-full font-bold hover:bg-red-600 transition">-</button>
                  <span className="w-8 text-center text-xl font-black text-blue-600">{den1}</span>
                  <button onClick={() => setDen1(Math.min(LIMITS.INTRO_DEN_MAX, den1 + 1))} className="bg-green-500 text-white w-8 h-8 rounded-full font-bold hover:bg-green-600 transition">+</button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-center gap-4 min-h-[160px] items-center">
                {Array.from({ length: totalPies1 }).map((_, i) => (
                  <svg key={i} width="110" height="110" className="drop-shadow-sm">{renderPieSlices(i, num1, den1)}</svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
