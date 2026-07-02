// pages/e-dimotikou/3-aplopoiisi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const LIMITS = {
  SIMPL_NUM_MIN: 0,
  SIMPL_NUM_MAX: 30,
  SIMPL_DEN_MIN: 2,
  SIMPL_DEN_MAX: 30
};

export default function AplopoiisiPage() {
  const [num3, setNum3] = useState(12);
  const [den3, setDen3] = useState(18);

  // Μέγιστος Κοινός Διαιρέτης για την Απλοποίηση
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const autoMkd3 = gcd(num3, den3);
  const isIrreducible3 = autoMkd3 === 1;

  // Συνάρτηση σχεδίασης πίτας SVG για τη συγκεκριμένη σελίδα
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

  const totalPies3Initial = Math.max(1, Math.ceil(num3 / den3));
  const totalPies3Simplified = Math.max(1, Math.ceil((num3 / autoMkd3) / (den3 / autoMkd3)));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>✂️ Απλοποίηση Κλασμάτων - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">LearnMaths<span className="text-indigo-600">.gr</span></Link>
          <Link href="/e-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">🔙 Επιστροφή</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900">✂️ Απλοποίηση Κλασμάτων</h2>
          
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap justify-center items-center gap-6 text-sm max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">Αριθμητής:</span>
                <button onClick={() => setNum3(Math.max(LIMITS.SIMPL_NUM_MIN, num3 - 1))} className="bg-slate-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm">-</button>
                <span className="font-black text-base w-4 text-center">{num3}</span>
                <button onClick={() => { if(num3 < den3) setNum3(num3 + 1) }} className="bg-slate-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm">+</button>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">Παρονομαστής:</span>
                <button onClick={() => { const d = Math.max(LIMITS.SIMPL_DEN_MIN, den3 - 1); setDen3(d); if(num3 > d) setNum3(d); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm">-</button>
                <span className="font-black text-base w-4 text-center">{den3}</span>
                <button onClick={() => setDen3(Math.min(LIMITS.SIMPL_DEN_MAX, den3 + 1))} className="bg-slate-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm">+</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              {isIrreducible3 && (
                <div className="text-center"><span className="inline-block bg-emerald-100 text-emerald-800 font-black px-4 py-2 rounded-xl text-xs border border-emerald-200">🏆 Το κλάσμα είναι ήδη ΑΝΑΓΩΓΟ!</span></div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="flex flex-col items-center justify-start space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">Αρχικό Κλάσma</span>
                  <div className="flex flex-col items-center font-black text-3xl text-slate-700">
                    <div>{num3}</div><div className="w-10 h-[3px] bg-slate-600 my-1"></div><div>{den3}</div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 min-h-[140px] p-2 bg-slate-50 rounded-xl w-full max-w-[240px] items-center">
                    {Array.from({ length: totalPies3Initial }).map((_, i) => (<svg key={i} width="110" height="110">{renderPieSlices(i, num3, den3)}</svg>))}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-start space-y-4">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">Ανάγωγο Κλάσμα</span>
                  <div className="flex items-center gap-3 bg-slate-50 p-2 px-4 rounded-xl border">
                    {!isIrreducible3 ? (
                      <>
                        <div className="flex flex-col items-center font-bold text-sm text-rose-600">
                          <div>{num3} ÷ {autoMkd3}</div><div className="w-14 h-[2px] bg-rose-400 my-0.5"></div><div>{den3} ÷ {autoMkd3}</div>
                        </div>
                        <span className="font-black text-2xl text-emerald-600">=</span>
                        <div className="flex flex-col items-center font-black text-3xl text-emerald-600">
                          <div>{num3 / autoMkd3}</div><div className="w-12 h-[3px] bg-emerald-600 my-1"></div><div>{den3 / autoMkd3}</div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center font-black text-3xl text-emerald-600">
                        <div>{num3}</div><div className="w-12 h-[3px] bg-emerald-600 my-1"></div><div>{den3}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 min-h-[140px] p-2 bg-slate-50 rounded-xl w-full max-w-[240px] items-center">
                    {Array.from({ length: totalPies3Simplified }).map((_, i) => (<svg key={i} width="110" height="110">{renderPieSlices(i, num3 / autoMkd3, den3 / autoMkd3)}</svg>))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
