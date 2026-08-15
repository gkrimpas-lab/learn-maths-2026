import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function PosotitaIgrouTheoryPage() {
  const [milliliters, setMilliliters] = useState(500); // 0 - 2000 mL

  const mL = typeof milliliters === 'number' && milliliters >= 0 ? milliliters : 0;
  const liters = mL / 1000;

  // Ύψος στάθμης υγρού στο SVG δοχείο (Max 2000 mL -> ύψος 120px)
  const maxCapacity = 2000;
  const fillHeight = Math.min(120, (mL / maxCapacity) * 120);
  const liquidY = 150 - fillHeight;

  const setPreset = (amount) => {
    setMilliliters(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🥛 Μέτρηση Ποσότητας Υγρού (Λίτρα & Χιλιοστόλιτρα) - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/29-posotita-igrou-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 29
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  🥛 Μέτρηση Ποσότητας Υγρού (Χωρητικότητα)
                </h1>
                <p className="text-cyan-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε πώς μετράμε τα υγρά σε **λίτρα (L)** και **χιλιοστόλιτρα (mL)**, πώς κάνουμε εύκολα μετατροπές και πώς υπολογίζουμε το μισό ή το ένα τέταρτο του λίτρου!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-cyan-100">Δοκίμασε τις διαδραστικές ασκήσεις στη μέτρηση υγρών και τις μετατροπές L και mL!</p>
                <Link 
                  href="/d-dimotikou/29-posotita-igrou-ask"
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
                <span>📖</span> Μονάδες Μέτρησης & Βασικές Ισότητες
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Το Λίτρο και το Χιλιοστόλιτρο */}
              <div className="bg-cyan-50/80 p-6 rounded-2xl border border-cyan-100 space-y-3">
                <div className="bg-cyan-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                  ΒΑΣΙΚΕΣ ΜΟΝΑΔΕΣ
                </div>
                <h3 className="text-lg font-bold text-cyan-950">
                  Λίτρο (L) & Χιλιοστόλιτρο (mL)
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Η βασική μονάδα μέτρησης είναι το <strong>λίτρο (L)</strong>. Για μικρότερες ποσότητες (π.χ. φάρμακα, αναψυκτικά) χρησιμοποιούμε το <strong>χιλιοστόλιτρο (mL)</strong>.
                </p>
                <div className="bg-white p-3 rounded-xl border border-cyan-200 text-center font-mono font-black text-cyan-900 text-sm shadow-sm">
                  1 L = 1.000 mL
                </div>
              </div>

              {/* 2. Κλασματικά Μέρη του Λίτρου */}
              <div className="bg-teal-50/80 p-6 rounded-2xl border border-teal-100 space-y-3">
                <div className="bg-teal-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                  ΚΛΑΣΜΑΤΑ ΛΙΤΡΟΥ
                </div>
                <h3 className="text-lg font-bold text-teal-950">
                  Μισό & Τέταρτο του Λίτρου
                </h3>
                <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 font-medium">
                  <li>• <strong>Μισό λίτρο (1/2 L)</strong> = 500 mL</li>
                  <li>• <strong>Ένα τέταρτο (1/4 L)</strong> = 250 mL</li>
                  <li>• <strong>Τρία τέταρτα (3/4 L)</strong> = 750 mL</li>
                  <li>• <strong>1,5 λίτρο</strong> = 1.500 mL</li>
                </ul>
              </div>

              {/* 3. Κανόνες Μετατροπής */}
              <div className="bg-blue-50/80 p-6 rounded-2xl border border-blue-100 space-y-3">
                <div className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                  ΠΩΣ ΚΑΝΟΥΜΕ ΜΕΤΑΤΡΟΠΕΣ
                </div>
                <h3 className="text-lg font-bold text-blue-950">
                  Μετατροπές L και mL
                </h3>
                <div className="space-y-2 text-xs md:text-sm text-gray-700">
                  <p className="bg-white p-2.5 rounded-xl border border-blue-200">
                    🔹 <strong>Από L σε mL:</strong> Πολλαπλασιάζουμε με <strong>1.000</strong> (π.χ. 3 L = 3.000 mL).
                  </p>
                  <p className="bg-white p-2.5 rounded-xl border border-blue-200">
                    🔸 <strong>Από mL σε L:</strong> Διαιρούμε με <strong>1.000</strong> (π.χ. 4.000 mL = 4 L).
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - ΟΓΚΟΜΕΤΡΙΚΟ ΔΟΧΕΙΟ */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικό Ογκομετρικό Δοχείο & Μετατροπέας
                </h2>
                <p className="text-gray-500 text-sm">
                  Άλλαξε την ποσότητα υγρού για να δεις τη στάθμη στο δοχείο και την αυτόματη μετατροπή σε L και mL!
                </p>
              </div>

              {/* ΠΡΟΕΠΙΛΟΓΕΣ ΠΟΣΟΤΗΤΩΝ */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPreset(330)}
                  className="px-3 py-2 rounded-xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  🥤 330 mL (Αναψυκτικό)
                </button>
                <button
                  onClick={() => setPreset(500)}
                  className="px-3 py-2 rounded-xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  💧 500 mL (Μισό Λίτρο)
                </button>
                <button
                  onClick={() => setPreset(1000)}
                  className="px-3 py-2 rounded-xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  🧃 1.000 mL (1 Λίτρο)
                </button>
                <button
                  onClick={() => setPreset(1500)}
                  className="px-3 py-2 rounded-xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  🍶 1.500 mL (1,5 L)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* ΑΡΙΣΤΕΡΑ: SVG ΟΓΚΟΜΕΤΡΙΚΟ ΔΟΧΕΙΟ */}
              <div className="bg-slate-900 p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                  Ογκομετρικο Δοχειο (0 - 2.000 mL)
                </span>

                <div className="w-52 h-52 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 160 180">
                    {/* Σώμα Δοχείου */}
                    <path d="M 40,25 L 40,150 A 10,10 0 0,0 50,160 L 110,160 A 10,10 0 0,0 120,150 L 120,25" fill="#1e293b" fillOpacity="0.5" stroke="#38bdf8" strokeWidth="4" />
                    {/* Χείλος δοχείου */}
                    <path d="M 35,25 L 125,25" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                    {/* Στόμιο εκροής */}
                    <path d="M 35,25 L 25,20 L 40,35" fill="none" stroke="#38bdf8" strokeWidth="3" />

                    {/* Υγρό μέσα στο δοχείο */}
                    {mL > 0 && (
                      <rect 
                        x="42" 
                        y={liquidY} 
                        width="76" 
                        height={fillHeight} 
                        fill="#06b6d4" 
                        fillOpacity="0.75" 
                        rx="4"
                      />
                    )}

                    {/* Γραμμές διαβάθμισης (Ενδείξεις mL) */}
                    {/* 2000 mL (Top) */}
                    <line x1="105" y1="30" x2="118" y2="30" stroke="#f8fafc" strokeWidth="2" />
                    <text x="98" y="33" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">2.000</text>

                    {/* 1500 mL */}
                    <line x1="105" y1="60" x2="118" y2="60" stroke="#f8fafc" strokeWidth="2" />
                    <text x="98" y="63" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">1.500</text>

                    {/* 1000 mL (1 L) */}
                    <line x1="100" y1="90" x2="118" y2="90" stroke="#fbbf24" strokeWidth="2.5" />
                    <text x="95" y="93" textAnchor="end" fill="#fbbf24" fontSize="9" fontWeight="900">1 L</text>

                    {/* 500 mL (1/2 L) */}
                    <line x1="105" y1="120" x2="118" y2="120" stroke="#f8fafc" strokeWidth="2" />
                    <text x="98" y="123" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">500</text>
                  </svg>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-cyan-300 font-mono font-black text-2xl">
                    {formatNumber(mL)} mL
                  </p>
                  <p className="text-slate-400 text-xs font-mono">
                    (= {liters} L)
                  </p>
                </div>
              </div>

              {/* ΔΕΞΙΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΑΥΤΟΜΑΤΟΣ ΜΕΤΑΤΡΟΠΕΑΣ */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 space-y-6">
                
                {/* DISPLAY ΜΕΤΑΤΡΟΠΗΣ */}
                <div className="bg-slate-900 p-5 rounded-2xl text-center border-2 border-cyan-500/30 space-y-1">
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                    Αυτοματη Μετατροπη
                  </span>
                  <div className="text-3xl md:text-4xl font-mono font-black text-emerald-400 tracking-wider">
                    {formatNumber(mL)} mL = {liters} L
                  </div>
                </div>

                {/* SLIDER & INPUT ΡΥΘΜΙΣΗΣ */}
                <div className="space-y-4">
                  <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-gray-700">
                      <span>Ποσότητα σε Χιλιοστόλιτρα (mL):</span>
                      <span className="text-cyan-700 font-mono text-base font-black">{formatNumber(mL)} mL</span>
                    </div>
                    <input 
                      type="number"
                      min="0"
                      max="5000"
                      autoComplete="off"
                      value={milliliters}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') setMilliliters('');
                        else setMilliliters(Math.min(5000, Number(val)));
                      }}
                      onBlur={() => {
                        if (milliliters === '' || milliliters < 0) setMilliliters(0);
                      }}
                      className="w-full p-2.5 rounded-xl border border-gray-300 font-mono font-bold text-base focus:ring-2 focus:ring-cyan-500 focus:outline-none mb-2"
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="2000" 
                      step="50"
                      value={mL <= 2000 ? mL : 2000} 
                      onChange={(e) => setMilliliters(Number(e.target.value))}
                      className="w-full accent-cyan-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* ΑΥΤΟΜΑΤΕΣ ΑΝΑΛΥΣΕΙΣ */}
                <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-200 space-y-2">
                  <h4 className="text-xs font-black uppercase text-cyan-950 flex items-center gap-1.5">
                    <span>💡</span> Πώς το διαβάζουμε:
                  </h4>
                  <ul className="text-xs space-y-1 font-medium text-gray-800">
                    <li>• <strong>Σε Χιλιοστόλιτρα:</strong> {formatNumber(mL)} mL</li>
                    <li>• <strong>Σε Λίτρα:</strong> {liters} L (αφού {formatNumber(mL)} : 1.000 = {liters})</li>
                    {mL === 500 && <li>• <strong>Ειδική ονομασία:</strong> Μισό λίτρο (1/2 L)</li>}
                    {mL === 250 && <li>• <strong>Ειδική ονομασία:</strong> Ένα τέταρτο του λίτρου (1/4 L)</li>}
                    {mL === 750 && <li>• <strong>Ειδική ονομασία:</strong> Τρία τέταρτα του λίτρου (3/4 L)</li>}
                    {mL === 1000 && <li>• <strong>Ειδική ονομασία:</strong> 1 ακέραιο λίτρο (1 L)</li>}
                  </ul>
                </div>

              </div>

            </div>
          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες να μετράς τα υγρά και να μετατρέπεις τα λίτρα σε χιλιοστόλιτρα; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/29-posotita-igrou-ask"
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
