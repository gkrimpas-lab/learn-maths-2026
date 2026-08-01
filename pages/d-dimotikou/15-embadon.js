import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function EmbadonTheoryPage() {
  const [valInput, setValInput] = useState('1');
  const [zoomLevel, setZoomLevel] = useState('m'); // 'm' (1 τ.μ.), 'dm' (100 τ.δ.), 'cm' (10.000 τ.εκ.)

  const numericVal = parseFloat(valInput.replace(',', '.')) || 0;

  // Υπολογισμός τιμών με βάση τον κανόνα του 100
  let valInM2 = 0;
  if (zoomLevel === 'm') valInM2 = numericVal;
  if (zoomLevel === 'dm') valInM2 = numericVal / 100;
  if (zoomLevel === 'cm') valInM2 = numericVal / 10000;

  const valInDm2 = valInM2 * 100;
  const valInCm2 = valInM2 * 10000;

  const formatNum = (n) => {
    if (Number.isInteger(n)) return n.toLocaleString('el-GR');
    return Number(n.toFixed(4)).toString().replace('.', ',');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🟩 Εμβαδόν & Μονάδες Μέτρησης - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/15-embadon-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 15
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  🟩 Η Έννοια του Εμβαδού & Μετατροπές
                </h1>
                <p className="text-emerald-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε τι είναι εμβαδόν και πώς **1 τετραγωνικό μέτρο (τ.μ.)** χωρίζεται σε **100 τ.δ.** και σε **10.000 τ.εκ.**!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-emerald-100">Δοκίμασε τις ασκήσεις στο εμβαδόν για να σιγουρευτείς ότι το έμαθες!</p>
                <Link 
                  href="/d-dimotikou/15-embadon-ask"
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
                <span>📖</span> Αναλυτική Θεωρία: Τι είναι το Εμβαδόν;
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Ορισμός */}
              <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-100 space-y-3">
                <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                  <span>📐</span> Τι είναι το Εμβαδόν;
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  <strong>Εμβαδόν</strong> ενός σχήματος είναι το μέγεθος της επιφάνειάς του (το «μέσα» μέρος του σχήματος).
                </p>
              </div>

              {/* 2. Βασική Μονάδα */}
              <div className="bg-teal-50/70 p-6 rounded-2xl border border-teal-100 space-y-3">
                <h3 className="text-lg font-bold text-teal-900 flex items-center gap-2">
                  <span>🟩</span> Το Τετραγωνικό Μέτρο
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Βασική μονάδα μέτρησης εμβαδού είναι το <strong>τετραγωνικό μέτρο (1 τ.μ.)</strong>. Είναι ένα τετράγωνο με πλευρά 1 m.
                </p>
              </div>

              {/* 3. Ο Κανόνας του 100 */}
              <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-100 space-y-3">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <span>🔢</span> Ο Κανόνας του 100
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Στο εμβαδόν <strong>κάθε μονάδα είναι 100 φορές μεγαλύτερη</strong> από την αμέσως μικρότερη, γιατί 10 × 10 = 100!
                </p>
              </div>

            </div>

            {/* ΣΧΕΣΕΙΣ ΜΕΤΑΤΡΟΠΗΣ */}
            <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-4">
              <h3 className="text-lg font-extrabold text-amber-400 text-center md:text-left">
                ⚡ Σχέσεις Μετατροπής Μονάδων Εμβαδού
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono font-bold text-sm md:text-base">
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
                  <span className="text-emerald-400 block text-xs uppercase font-black">1 τ.μ. σε τ.δ.</span>
                  <div className="text-xl font-black text-white">1 τ.μ. = 100 τ.δ.</div>
                  <span className="text-[11px] text-slate-400 block">10 dm × 10 dm = 100 τ.δ.</span>
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
                  <span className="text-teal-400 block text-xs uppercase font-black">1 τ.δ. σε τ.εκ.</span>
                  <div className="text-xl font-black text-white">1 τ.δ. = 100 τ.εκ.</div>
                  <span className="text-[11px] text-slate-400 block">10 cm × 10 cm = 100 τ.εκ.</span>
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
                  <span className="text-indigo-400 block text-xs uppercase font-black">1 τ.μ. σε τ.εκ.</span>
                  <div className="text-xl font-black text-amber-300">1 τ.μ. = 10.000 τ.εκ.</div>
                  <span className="text-[11px] text-slate-400 block">100 × 100 = 10.000 τ.εκ.</span>
                </div>
              </div>
            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικό Εργαστήριο Zoom & Μετατροπών
                </h2>
                <p className="text-gray-500 text-sm">
                  Δες πώς το 1 τ.μ. «σπάει» οπτικά σε 100 τ.δ. και σε 10.000 τ.εκ.!
                </p>
              </div>

              {/* ΚΟΥΜΠΙΑ ZOOM LEVEL */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setZoomLevel('m'); setValInput('1'); }}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition ${
                    zoomLevel === 'm' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  1 τ.μ. (Mέτρο)
                </button>
                <button
                  onClick={() => { setZoomLevel('dm'); setValInput('100'); }}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition ${
                    zoomLevel === 'dm' ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  100 τ.δ. (Δεκατόμετρα)
                </button>
                <button
                  onClick={() => { setZoomLevel('cm'); setValInput('10000'); }}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition ${
                    zoomLevel === 'cm' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  10.000 τ.εκ. (Εκατοστά)
                </button>
              </div>
            </div>

            {/* ΟΠΤΙΚΟΠΟΙΗΣΗ ΠΛΕΓΜΑΤΟΣ (GRID VISUALIZER) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* VISUAL SQUARE / GRID */}
              <div className="bg-slate-900 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4">
                <div className="w-full max-w-[320px] h-[320px] bg-emerald-950/60 rounded-2xl border-4 border-emerald-500 p-2 relative flex items-center justify-center overflow-hidden shadow-inner">
                  
                  {/* LEVEL 1: 1 τ.μ. */}
                  {zoomLevel === 'm' && (
                    <div className="w-full h-full bg-emerald-500/20 border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center text-center p-4 rounded-xl">
                      <span className="text-3xl md:text-4xl font-black text-emerald-300 font-mono">1 τ.μ.</span>
                      <span className="text-xs text-emerald-200 mt-2 font-bold">1 μέτρο × 1 μέτρο</span>
                    </div>
                  )}

                  {/* LEVEL 2: 100 τ.δ. (10x10 πλέγμα) */}
                  {zoomLevel === 'dm' && (
                    <div className="w-full h-full grid grid-cols-10 grid-rows-10 gap-0.5">
                      {Array.from({ length: 100 }).map((_, idx) => (
                        <div 
                          key={idx} 
                          className="bg-teal-500/30 border border-teal-400/50 hover:bg-teal-400/80 transition cursor-pointer"
                          title={`Τετραγωνικό Δεκατόμετρο ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* LEVEL 3: 10.000 τ.εκ. */}
                  {zoomLevel === 'cm' && (
                    <div className="w-full h-full bg-indigo-900/80 flex flex-col items-center justify-center text-center p-4 rounded-xl relative">
                      <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 gap-0.5 opacity-40">
                        {Array.from({ length: 400 }).map((_, idx) => (
                          <div key={idx} className="bg-indigo-400 border border-indigo-300/30" />
                        ))}
                      </div>
                      <div className="relative z-10 bg-slate-950/90 p-4 rounded-2xl border border-indigo-500/50 shadow-2xl space-y-1">
                        <span className="text-2xl md:text-3xl font-black text-indigo-300 font-mono block">10.000 τ.εκ.</span>
                        <span className="text-[11px] text-indigo-200 block font-bold">100 cm × 100 cm</span>
                      </div>
                    </div>
                  )}

                </div>

                <div className="text-center space-y-1">
                  <span className="text-xs font-black uppercase text-slate-400 block">
                    {zoomLevel === 'm' ? 'Βασική Μονάδα (1 τ.μ.)' : zoomLevel === 'dm' ? 'Πλέγμα 10 × 10 = 100 τ.δ.' : 'Πλέγμα 100 × 100 = 10.000 τ.εκ.'}
                  </span>
                </div>
              </div>

              {/* ΖΩΝΤΑΝΟΣ ΜΕΤΑΤΡΟΠΕΑΣ ΕΜΒΑΔΟΥ */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 space-y-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Ζωντανός Μετατροπέας Εμβαδού
                </h3>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Γράψε μια τιμή σε {zoomLevel === 'm' ? 'τετραγωνικά μέτρα (τ.μ.)' : zoomLevel === 'dm' ? 'τετραγωνικά δεκατόμετρα (τ.δ.)' : 'τετραγωνικά εκατοστά (τ.εκ.)'}:
                  </label>
                  <input 
                    type="text" 
                    value={valInput} 
                    onChange={(e) => setValInput(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-gray-300 font-mono text-xl font-black text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white shadow-sm"
                    placeholder="π.χ. 1"
                  />
                </div>

                {/* ΠΙΝΑΚΑΣ ΑΥΤΟΜΑΤΗΣ ΜΕΤΑΤΡΟΠΗΣ */}
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 flex justify-between items-center shadow-sm">
                    <span className="text-xs font-bold text-gray-500">Τετραγωνικά Μέτρα (τ.μ.)</span>
                    <span className="text-lg md:text-xl font-mono font-black text-emerald-600">{formatNum(valInM2)} τ.μ.</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-gray-200 flex justify-between items-center shadow-sm">
                    <span className="text-xs font-bold text-gray-500">Τετραγωνικά Δεκατόμετρα (τ.δ.)</span>
                    <span className="text-lg md:text-xl font-mono font-black text-teal-600">{formatNum(valInDm2)} τ.δ.</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-gray-200 flex justify-between items-center shadow-sm">
                    <span className="text-xs font-bold text-gray-500">Τετραγωνικά Εκατοστά (τ.εκ.)</span>
                    <span className="text-lg md:text-xl font-mono font-black text-indigo-600">{formatNum(valInCm2)} τ.εκ.</span>
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
                Έμαθες το εμβαδόν και τις μετατροπές του; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/15-embadon-ask"
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
