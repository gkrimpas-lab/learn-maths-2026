import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Δεδομένα Τετραπλεύρων & Ιδιοτήτων
const SHAPES_DATA = {
  rectangle: {
    name: 'Ορθογώνιο Παραλληλόγραμμο',
    icon: '▭',
    equalSides: 'Απέναντι πλευρές ίσες',
    parallelSides: 'Απέναντι πλευρές παράλληλες',
    angles: '4 Ορθές γωνίες (90°)',
    has4EqualSides: false,
    hasRightAngles: true,
    desc: 'Έχει τις απέναντι πλευρές παράλληλες και ίσες ανά δύο, και όλες τις γωνίες του ορθές!'
  },
  square: {
    name: 'Τετράγωνο',
    icon: '❏',
    equalSides: 'Όλες οι 4 πλευρές ίσες',
    parallelSides: 'Απέναντι πλευρές παράλληλες',
    angles: '4 Ορθές γωνίες (90°)',
    has4EqualSides: true,
    hasRightAngles: true,
    desc: 'Το πιο «τέλειο» τετράπλευρο! Συνδυάζει τις ιδιότητες του ορθογωνίου και του ρόμβου (4 ίσες πλευρές & 4 ορθές γωνίες).'
  },
  rhombus: {
    name: 'Ρόμβος',
    icon: '◇',
    equalSides: 'Όλες οι 4 πλευρές ίσες',
    parallelSides: 'Απέναντι πλευρές παράλληλες',
    angles: 'Απέναντι γωνίες ίσες (όχι ορθές)',
    has4EqualSides: true,
    hasRightAngles: false,
    desc: 'Έχει όλες τις πλευρές του ίσες σαν το τετράγωνο, αλλά οι γωνίες του δεν είναι ορθές.'
  },
  parallelogram: {
    name: 'Πλάγιο Παραλληλόγραμμο',
    icon: '▱',
    equalSides: 'Απέναντι πλευρές ίσες',
    parallelSides: 'Απέναντι πλευρές παράλληλες',
    angles: 'Απέναντι γωνίες ίσες (όχι ορθές)',
    has4EqualSides: false,
    hasRightAngles: false,
    desc: 'Έχει τις απέναντι πλευρές παράλληλες και ίσες ανά δύο, αλλά οι γωνίες του είναι «πλάγιες» (όχι ορθές).'
  }
};

export default function TetrapleuraTheoryPage() {
  const [selectedShape, setSelectedShape] = useState('square');
  const [skewLevel, setSkewLevel] = useState(30); // Κλίση για πλάγια σχήματα

  const activeData = SHAPES_DATA[selectedShape];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔷 Τα Τετράπλευρα & οι Ιδιότητές τους - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/d-dimotikou/16-tetrapleura-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
                <span>📝</span> Ασκήσεις
              </Link>
              <Link href="/d-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
                🔙 Επιστροφή
              </Link>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10 space-y-8`}>
          
          {/* HEADER & EXERCISES PROMO CARD */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 16
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  🔷 Ομοιότητες & Διαφορές Τετραπλεύρων
                </h1>
                <p className="text-blue-100 text-base lg:text-lg leading-relaxed">
                  Συγκρίνουμε το **ορθογώνιο**, το **τετράγωνο**, τον **ρόμβο** και το **πλάγιο παραλληλόγραμμο** ως προς τις πλευρές και τις γωνίες τους!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-blue-100">Δοκίμασε τις ασκήσεις στα τετράπλευρα για να σιγουρευτείς ότι έμαθες τις ιδιότητές τους!</p>
                <Link 
                  href="/d-dimotikou/16-tetrapleura-ask"
                  className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* ΘΕΩΡΙΑ - SECTION 1 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <div className="border-b pb-4 border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span>📖</span> Αναλυτική Θεωρία & Χαρακτηριστικά
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* 1. Ορθογώνιο */}
              <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-blue-900">Ορθογώνιο</h3>
                  <span className="text-2xl">▭</span>
                </div>
                <ul className="text-xs text-gray-700 space-y-1.5 font-medium">
                  <li>• Απέναντι πλευρές <strong>ίσες & παράλληλες</strong></li>
                  <li>• <strong>4 ορθές γωνίες (90°)</strong></li>
                </ul>
              </div>

              {/* 2. Τετράγωνο */}
              <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-indigo-900">Τετράγωνο</h3>
                  <span className="text-2xl">❏</span>
                </div>
                <ul className="text-xs text-gray-700 space-y-1.5 font-medium">
                  <li>• <strong>Όλες οι 4 πλευρές ίσες</strong></li>
                  <li>• <strong>4 ορθές γωνίες (90°)</strong></li>
                </ul>
              </div>

              {/* 3. Ρόμβος */}
              <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-purple-900">Ρόμβος</h3>
                  <span className="text-2xl">◇</span>
                </div>
                <ul className="text-xs text-gray-700 space-y-1.5 font-medium">
                  <li>• <strong>Όλες οι 4 πλευρές ίσες</strong></li>
                  <li>• Απέναντι γωνίες ίσες (όχι ορθές)</li>
                </ul>
              </div>

              {/* 4. Πλάγιο Παραλληλόγραμμο */}
              <div className="bg-teal-50/70 p-5 rounded-2xl border border-teal-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-teal-900">Πλάγιο Παραλλ.</h3>
                  <span className="text-2xl">▱</span>
                </div>
                <ul className="text-xs text-gray-700 space-y-1.5 font-medium">
                  <li>• Απέναντι πλευρές <strong>ίσες & παράλληλες</strong></li>
                  <li>• Απέναντι γωνίες ίσες (όχι ορθές)</li>
                </ul>
              </div>

            </div>

            {/* ΠΙΝΑΚΑΣ ΣΥΓΚΡΙΣΗΣ ΙΔΙΟΤΗΤΩΝ */}
            <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-4">
              <h3 className="text-lg font-extrabold text-amber-400">
                📊 Συγκριτικός Πίνακας Ιδιοτήτων
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm font-bold border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 uppercase">
                      <th className="py-3 px-2">Σχήμα</th>
                      <th className="py-3 px-2 text-center">Απέναντι πλευρές παράλληλες</th>
                      <th className="py-3 px-2 text-center">Όλες οι πλευρές ίσες (4)</th>
                      <th className="py-3 px-2 text-center">4 Ορθές Γωνίες (90°)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="py-3 px-2 text-blue-400 flex items-center gap-2"><span>▭</span> Ορθογώνιο</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι</td>
                      <td className="py-3 px-2 text-center text-rose-400">❌ Όχι (μόνο απέναντι)</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι (4)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="py-3 px-2 text-indigo-400 flex items-center gap-2"><span>❏</span> Τετράγωνο</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι (4)</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι (4)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="py-3 px-2 text-purple-400 flex items-center gap-2"><span>◇</span> Ρόμβος</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι (4)</td>
                      <td className="py-3 px-2 text-center text-rose-400">❌ Όχι</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="py-3 px-2 text-teal-400 flex items-center gap-2"><span>▱</span> Πλάγιο Παραλληλόγραμμο</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✅ Ναι</td>
                      <td className="py-3 px-2 text-center text-rose-400">❌ Όχι (μόνο απέναντι)</td>
                      <td className="py-3 px-2 text-center text-rose-400">❌ Όχι</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικό Εργαστήριο Τετραπλεύρων
                </h2>
                <p className="text-gray-500 text-sm">
                  Επίλεξε ένα σχήμα για να δεις τη ζωντανή γεωμετρική του αναπαράσταση!
                </p>
              </div>

              {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ ΣΧΗΜΑΤΟΣ */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(SHAPES_DATA).map((sKey) => (
                  <button
                    key={sKey}
                    onClick={() => setSelectedShape(sKey)}
                    className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition ${
                      selectedShape === sKey 
                        ? 'bg-indigo-600 text-white shadow-md scale-105' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {SHAPES_DATA[sKey].icon} {SHAPES_DATA[sKey].name}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTROLS SLIDER (Για πλάγια σχήματα) */}
            {(selectedShape === 'rhombus' || selectedShape === 'parallelogram') && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Γωνία Κλίσης Πλαγίου: <span className="text-indigo-600 font-mono font-black">{skewLevel}°</span>
                </label>
                <input 
                  type="range" 
                  min="15" 
                  max="50" 
                  value={skewLevel} 
                  onChange={(e) => setSkewLevel(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            )}

            {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ (SVG) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              <div className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4">
                <div className="w-full max-w-[320px] h-[320px] bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 300 300">
                    
                    {/* 1. ΟΡΘΟΓΩΝΙΟ */}
                    {selectedShape === 'rectangle' && (
                      <g>
                        <rect x="50" y="90" width="200" height="120" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="4" />
                        {/* Ορθές γωνίες */}
                        <rect x="50" y="90" width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                        <rect x="235" y="90" width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                        <rect x="50" y="195" width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                        <rect x="235" y="195" width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                      </g>
                    )}

                    {/* 2. ΤΕΤΡΑΓΩΝΟ */}
                    {selectedShape === 'square' && (
                      <g>
                        <rect x="75" y="75" width="150" height="150" fill="#6366f1" fillOpacity="0.2" stroke="#6366f1" strokeWidth="4" />
                        {/* Ορθές γωνίες */}
                        <rect x="75" y="75" width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                        <rect x="210" y="75" width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                        <rect x="75" y="210" width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                        <rect x="210" y="210" width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                      </g>
                    )}

                    {/* 3. ΡΟΜΒΟΣ */}
                    {selectedShape === 'rhombus' && (() => {
                      const skew = skewLevel;
                      const p1 = `${150 - skew},75`;
                      const p2 = `${250 - skew},75`;
                      const p3 = `${250 + skew},225`;
                      const p4 = `${150 + skew},225`;
                      return (
                        <polygon points={`${p1} ${p2} ${p3} ${p4}`} fill="#a855f7" fillOpacity="0.2" stroke="#a855f7" strokeWidth="4" />
                      );
                    })()}

                    {/* 4. ΠΛΑΓΙΟ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟ */}
                    {selectedShape === 'parallelogram' && (() => {
                      const skew = skewLevel;
                      const p1 = `${80 - skew},100`;
                      const p2 = `${240 - skew},100`;
                      const p3 = `${240 + skew},200`;
                      const p4 = `${80 + skew},200`;
                      return (
                        <polygon points={`${p1} ${p2} ${p3} ${p4}`} fill="#14b8a6" fillOpacity="0.2" stroke="#14b8a6" strokeWidth="4" />
                      );
                    })()}

                  </svg>
                </div>

                <span className="text-xs font-black uppercase text-slate-400 block">
                  {activeData.name}
                </span>
              </div>

              {/* ΕΠΕΞΗΓΗΣΗ ΙΔΙΟΤΗΤΩΝ ΣΧΗΜΑΤΟΣ */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeData.icon}</span>
                  <h3 className="text-2xl font-black text-gray-900">{activeData.name}</h3>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  {activeData.desc}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3 text-xs md:text-sm font-bold text-gray-800">
                    <span>📏</span>
                    <span>{activeData.equalSides}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3 text-xs md:text-sm font-bold text-gray-800">
                    <span>∥</span>
                    <span>{activeData.parallelSides}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3 text-xs md:text-sm font-bold text-gray-800">
                    <span>📐</span>
                    <span>{activeData.angles}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες τις ομοιότητες και τις διαφορές των τετραπλεύρων; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/16-tetrapleura-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη Δ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
