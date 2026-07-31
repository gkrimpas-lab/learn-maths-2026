import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function ParallilesTheoryPage() {
  const [lineType, setLineType] = useState('parallel'); // 'parallel', 'intersecting', 'perpendicular'
  const [angle, setAngle] = useState(45); // Γωνία κλίσης / διασταύρωσης
  const [distance, setDistance] = useState(60); // Απόσταση για παράλληλες

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📐 Παράλληλες & Τεμνόμενες Ευθείες - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/13-paralliles-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 13
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  📐 Παράλληλες & Τεμνόμενες Ευθείες
                </h1>
                <p className="text-blue-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε πότε δύο ευθείες είναι **παράλληλες** (δεν συναντιούνται ποτέ), πότε είναι **τεμνόμενες** (συναντιούνται σε ένα σημείο) και πότε είναι **κάθετες**!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-blue-100">Δοκίμασε τις ασκήσεις στις παράλληλες & τεμνόμενες ευθείες για να σιγουρευτείς ότι τις έμαθες!</p>
                <Link 
                  href="/d-dimotikou/13-paralliles-ask"
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
                <span>📖</span> Αναλυτική Θεωρία & Είδη Ευθειών
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Παράλληλες Ευθείες */}
              <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-100 space-y-3">
                <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                  <span>||</span> Παράλληλες Ευθείες
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Δύο ευθείες λέγονται <strong>παράλληλες ($\varepsilon_1 \parallel \varepsilon_2$)</strong> όταν διατηρούν πάντα την ίδια απόσταση και <strong>δεν συναντιούνται (δεν τέμνονται) ποτέ</strong>, όσο κι αν τις προεκτείνουμε!
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-xs font-mono font-bold text-blue-800 text-center">
                  Παράδειγμα: Οι γραμμές του τρένου 🚂
                </div>
              </div>

              {/* 2. Τεμνόμενες Ευθείες */}
              <div className="bg-purple-50/70 p-6 rounded-2xl border border-purple-100 space-y-3">
                <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                  <span>✂️</span> Τεμνόμενες Ευθείες
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Δύο ευθείες λέγονται <strong>τεμνόμενες</strong> όταν διασταυρώνονται και συναντιούνται σε <strong>ένα ακριβώς κοινό σημείο</strong> (σημείο τομής $Σ$).
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-purple-100 text-xs font-mono font-bold text-purple-800 text-center">
                  Παράδειγμα: Ένα σταυροδρόμι ✖️
                </div>
              </div>

              {/* 3. Κάθετες Ευθείες */}
              <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-100 space-y-3">
                <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                  <span>📐</span> Κάθετες Ευθείες
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Όταν δύο τεμνόμενες ευθείες σχηματίζουν στο σημείο τομής τους <strong>ορθή γωνία ($90^\circ$)</strong>, λέγονται <strong>κάθετες ($\varepsilon_1 \perp \varepsilon_2$)</strong>.
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 text-xs font-mono font-bold text-emerald-800 text-center">
                  Έλεγχος με τον γνώμονα 📐
                </div>
              </div>

            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικό Εργαστήριο Ευθειών
                </h2>
                <p className="text-gray-500 text-sm">
                  Επίλεξε είδος ευθειών, άλλαξε τη γωνία ή την απόστασή τους και δες πώς συμπεριφέρονται!
                </p>
              </div>

              {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ ΕΙΔΟΥΣ */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setLineType('parallel')}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition ${
                    lineType === 'parallel' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  || Παράλληλες
                </button>
                <button
                  onClick={() => setLineType('intersecting')}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition ${
                    lineType === 'intersecting' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ✂️ Τεμνόμενες
                </button>
                <button
                  onClick={() => setLineType('perpendicular')}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition ${
                    lineType === 'perpendicular' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📐 Κάθετες
                </button>
              </div>
            </div>

            {/* CONTROLS SLIDERS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              {lineType === 'parallel' ? (
                <>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                      Απόσταση Ευθειών: <span className="text-blue-600 font-mono text-base font-black">{distance} px</span>
                    </label>
                    <input 
                      type="range" 
                      min="30" 
                      max="120" 
                      value={distance} 
                      onChange={(e) => setDistance(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                      Γωνία Κλίσης: <span className="text-blue-600 font-mono text-base font-black">{angle}°</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="180" 
                      value={angle} 
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                </>
              ) : lineType === 'intersecting' ? (
                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                    Γωνία Διασταύρωσης: <span className="text-purple-600 font-mono text-base font-black">{angle}°</span>
                  </label>
                  <input 
                    type="range" 
                    min="20" 
                    max="160" 
                    value={angle} 
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="md:col-span-2 text-center text-sm font-bold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  Οι κάθετες ευθείες σχηματίζουν σταθερή ορθή γωνία 90° στο σημείο τομής τους!
                </div>
              )}
            </div>

            {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ (SVG - ΑΥΞΗΜΕΝΟ ΥΨΟΣ) */}
            <div className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4">
              
              <div className="w-full max-w-2xl h-[450px] bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 500 450">
                  
                  {lineType === 'parallel' && (() => {
                    const rad = (angle * Math.PI) / 180;
                    const len = 240; // Μεγαλύτερο μήκος ευθειών
                    const dx = Math.cos(rad) * len;
                    const dy = Math.sin(rad) * len;
                    const nx = -Math.sin(rad) * (distance / 2);
                    const ny = Math.cos(rad) * (distance / 2);

                    return (
                      <g>
                        {/* Ευθεία ε1 */}
                        <line 
                          x1={250 + nx - dx} y1={225 + ny - dy} 
                          x2={250 + nx + dx} y2={225 + ny + dy} 
                          stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" 
                        />
                        <text x={250 + nx + dx - 15} y={225 + ny + dy - 15} fill="#60a5fa" fontWeight="black" fontSize="18">ε₁</text>

                        {/* Ευθεία ε2 */}
                        <line 
                          x1={250 - nx - dx} y1={225 - ny - dy} 
                          x2={250 - nx + dx} y2={225 - ny + dy} 
                          stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" 
                        />
                        <text x={250 - nx + dx - 15} y={225 - ny + dy - 15} fill="#93c5fd" fontWeight="black" fontSize="18">ε₂</text>
                      </g>
                    );
                  })()}

                  {lineType === 'intersecting' && (() => {
                    const rad = (angle * Math.PI) / 180;
                    const len = 220;
                    const dx1 = Math.cos(0) * len;
                    const dy1 = Math.sin(0) * len;

                    const dx2 = Math.cos(rad) * len;
                    const dy2 = Math.sin(rad) * len;

                    return (
                      <g>
                        {/* Ευθεία ε1 */}
                        <line x1={250 - dx1} y1={225 - dy1} x2={250 + dx1} y2={225 + dy1} stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />
                        <text x={250 + dx1 - 25} y={225 + dy1 - 15} fill="#c084fc" fontWeight="black" fontSize="18">ε₁</text>

                        {/* Ευθεία ε2 */}
                        <line x1={250 - dx2} y1={225 - dy2} x2={250 + dx2} y2={225 + dy2} stroke="#e879f9" strokeWidth="5" strokeLinecap="round" />
                        <text x={250 + dx2 - 25} y={225 + dy2 - 15} fill="#f0abfc" fontWeight="black" fontSize="18">ε₂</text>

                        {/* Σημείο Τομής Σ */}
                        <circle cx="250" cy="225" r="7" fill="#f43f5e" />
                        <text x="262" y="215" fill="#f43f5e" fontWeight="black" fontSize="20">Σ</text>
                      </g>
                    );
                  })()}

                  {lineType === 'perpendicular' && (
                    <g>
                      {/* Ευθεία ε1 (Οριζόντια) */}
                      <line x1="50" y1="225" x2="450" y2="225" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
                      <text x="430" y="210" fill="#34d399" fontWeight="black" fontSize="18">ε₁</text>

                      {/* Ευθεία ε2 (Κάθετη) */}
                      <line x1="250" y1="30" x2="250" y2="420" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
                      <text x="265" y="55" fill="#6ee7b7" fontWeight="black" fontSize="18">ε₂</text>

                      {/* Σημείο Τομής Σ */}
                      <circle cx="250" cy="225" r="7" fill="#f43f5e" />
                      <text x="265" y="215" fill="#f43f5e" fontWeight="black" fontSize="20">Σ</text>

                      {/* Σύμβολο Ορθής Γωνίας (90°) */}
                      <rect x="250" y="195" width="30" height="30" fill="none" stroke="#f59e0b" strokeWidth="3" />
                      <circle cx="265" cy="210" r="3" fill="#f59e0b" />
                    </g>
                  )}

                </svg>
              </div>

              {/* ΕΠΕΞΗΓΗΣΗ ΣΤΗΝ ΟΘΟΝΗ */}
              <div className="text-center space-y-1">
                <span className="text-xs font-black uppercase text-slate-400 block">
                  {lineType === 'parallel' ? 'Παράλληλες Ευθείες (ε₁ ∥ ε₂)' : lineType === 'intersecting' ? 'Τεμνόμενες Ευθείες' : 'Κάθετες Ευθείες (ε₁ ⊥ ε₂)'}
                </span>
                <p className="text-sm font-bold text-white">
                  {lineType === 'parallel' 
                    ? 'Δεν τέμνονται ποτέ! Η απόστασή τους παραμένει σταθερή.' 
                    : lineType === 'intersecting' 
                    ? 'Τέμνονται στο κοινό σημείο Σ!' 
                    : 'Τέμνονται σχηματίζοντας ορθή γωνία 90° (σύμβολο 🟧)!'}
                </p>
              </div>

            </div>

          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες τις παράλληλες και τις τεμνόμενες ευθείες; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/13-paralliles-ask"
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
