// pages/e-dimotikou/4-anagogi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const LIMITS = {
  UNIT_DEN_MAX: 12,
  UNIT_VAL_MIN: 10,
  UNIT_VAL_MAX: 500
};

export default function AnagogiPage() {
  const [unitNum, setUnitNum] = useState(3);
  const [unitDen, setUnitDen] = useState(5);
  const [unitValue, setUnitValue] = useState(150);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>🔍 Αναγωγή στη Μονάδα - LearnMaths.gr</title>
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
        <div className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">🔍 Αναγωγή στην Κλασματική Μονάδα</h2>
            <p className="text-gray-600 text-sm">Αν γνωρίζουμε την τιμή ενός μέρους, βρίσκουμε πρώτα το <strong>ένα κομμάτι</strong> (διαίρεση) και μετά το <strong>όλο σύνολο</strong> (πολλαπλασιασμός).</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-xl border shadow-sm text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">1. Το Μέρος (Κλάσμα)</span>
              <div className="flex justify-center items-center gap-2 font-black text-lg">
                <input 
                  type="number" 
                  min="1" 
                  max={unitDen - 1} 
                  value={unitNum} 
                  onChange={(e) => setUnitNum(Math.max(1, Math.min(unitDen - 1, parseInt(e.target.value, 10) || 1)))} 
                  className="w-12 text-center text-blue-600 bg-slate-50 rounded p-1 border focus:outline-none"
                />
                <span>/</span>
                <input 
                  type="number" 
                  min="2" 
                  max={LIMITS.UNIT_DEN_MAX} 
                  value={unitDen} 
                  onChange={(e) => { 
                    const d = Math.max(2, parseInt(e.target.value, 10) || 2); 
                    setUnitDen(d); 
                    if(unitNum >= d) setUnitNum(d-1); 
                  }} 
                  className="w-12 text-center text-blue-800 bg-slate-50 rounded p-1 border focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border shadow-sm text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">2. Η Τιμή του Μέρους</span>
              <div className="flex justify-center items-center gap-2">
                <button onClick={() => setUnitValue(Math.max(LIMITS.UNIT_VAL_MIN, unitValue - 10))} className="bg-gray-100 px-2 py-1 rounded font-bold hover:bg-gray-200 transition">-10</button>
                <span className="font-black text-lg text-orange-600 w-16 text-center">{unitValue}</span>
                <button onClick={() => setUnitValue(Math.min(LIMITS.UNIT_VAL_MAX, unitValue + 10))} className="bg-gray-100 px-2 py-1 rounded font-bold hover:bg-gray-200 transition">+10</button>
              </div>
            </div>

            <div className="bg-blue-600 text-white p-3 rounded-xl flex items-center justify-center font-bold text-xs shadow-md text-center">
              📝 Πρόβλημα: Τα {unitNum}/{unitDen} ενός ποσού είναι {unitValue}. Πόσο είναι το όλο;
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-6">
            <div className="bg-blue-50 text-blue-800 border border-blue-200 rounded-xl p-2 px-4 text-center font-bold text-xs max-w-md mx-auto">
              ℹ️ Ξέρουμε ότι τα <span className="text-blue-600 font-black">{unitNum} μπλε κουτάκια</span> αντιστοιχούν συνολικά στην τιμή <span className="text-blue-600 font-black">{unitValue}</span>.
            </div>

            <div className="flex w-full h-14 bg-gray-100 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
              {Array.from({ length: unitDen }).map((_, i) => (
                <div key={i} className={`flex-1 border-r last:border-0 border-white/40 flex flex-col items-center justify-center font-black text-xs transition-all duration-300 ${i < unitNum ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-inner' : 'bg-slate-200 text-slate-400'}`}>
                  <span>1/{unitDen}</span>
                  <span className="text-[10px] font-normal opacity-80">({(unitValue / unitNum).toFixed(1).replace('.0', '')})</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-black shrink-0 shadow-sm">1</div>
                <div>
                  <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wide">Βήμα 1: Βρίσκω το 1 κομμάτι (1/{unitDen})</p>
                  <p className="font-black text-base text-gray-800 mt-0.5">{unitValue} ÷ {unitNum} = <span className="text-orange-600 text-lg">{(unitValue / unitNum).toFixed(1).replace('.0', '')}</span></p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black shrink-0 shadow-sm">2</div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Βήμα 2: Βρίσκω το όλο σύνολο ({unitDen}/{unitDen})</p>
                  <p className="font-black text-base text-gray-800 mt-0.5">{(unitValue / unitNum).toFixed(1).replace('.0', '')} × {unitDen} = <span className="text-emerald-600 text-lg">{((unitValue / unitNum) * unitDen).toFixed(1).replace('.0', '')}</span></p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-600 text-white p-4 rounded-xl text-center font-black text-sm shadow-md max-w-sm mx-auto">
              🎉 Το συνολικό ποσό είναι: {((unitValue / unitNum) * unitDen).toFixed(1).replace('.0', '')}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
