// pages/d-dimotikou/29-posotita-igrou.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function PosotitaIgrouTheoryPage() {
  const [milliliters, setMilliliters] = useState(500); // 0 - 2000 mL

  const mL = typeof milliliters === 'number' && milliliters >= 0 ? milliliters : 0;
  const liters = mL / 1000;

  // Ύψος στάθμης υγρού στο SVG δοχείο (Max 2000 mL -> διαδρομή 128px μέχρι το y = 158)
  const maxCapacity = 2000;
  const fillHeight = Math.min(128, (mL / maxCapacity) * 128);
  const liquidY = 158 - fillHeight;

  const setPreset = (e, amount) => {
    e.preventDefault();
    e.stopPropagation();
    setMilliliters(amount);
  };

  const updateMilliliters = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setMilliliters((prev) => Math.max(0, Math.min(2000, (Number(prev) || 0) + delta)));
  };

  return (
    <Layout
      title="Μέτρηση Ποσότητας Υγρού (Χωρητικότητα) - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε πώς μετράμε τα υγρά σε λίτρα (L) και χιλιοστόλιτρα (mL), πώς κάνουμε μετατροπές και πώς υπολογίζουμε το μισό και το τέταρτο του λίτρου με διαδραστικό ογκομετρικό δοχείο."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/29-posotita-igrou-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                🥛 Μέτρηση Ποσότητας Υγρού (Χωρητικότητα)
              </h1>
              <p className="text-cyan-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε πώς μετράμε τα υγρά σε <strong>λίτρα (L)</strong> και <strong>χιλιοστόλιτρα (mL)</strong>, πώς κάνουμε εύκολα μετατροπές και πώς υπολογίζουμε το μισό ή το ένα τέταρτο του λίτρου!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-cyan-100">
                Δοκίμασε τις διαδραστικές ασκήσεις στη μέτρηση υγρών και τις μετατροπές L και mL!
              </p>
              <Link
                href="/d-dimotikou/29-posotita-igrou-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> Μονάδες Μέτρησης και Βασικές Ισότητες
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Το Λίτρο και το Χιλιοστόλιτρο */}
            <div className="bg-cyan-50/70 p-5 sm:p-6 rounded-2xl border border-cyan-100 space-y-3 shadow-sm">
              <div className="bg-cyan-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                ΒΑΣΙΚΕΣ ΜΟΝΑΔΕΣ
              </div>
              <h3 className="text-base sm:text-lg font-bold text-cyan-950">
                Λίτρο (L) και Χιλιοστόλιτρο (mL)
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Η βασική μονάδα μέτρησης της χωρητικότητας είναι το <strong>λίτρο (L)</strong>. Για μικρότερες ποσότητες (π.χ. αναψυκτικά, φάρμακα) χρησιμοποιούμε το <strong>χιλιοστόλιτρο (mL)</strong>.
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-cyan-200 text-center font-mono font-black text-cyan-900 text-sm shadow-sm">
                1 L ＝ 1.000 mL
              </div>
            </div>

            {/* 2. Κλασματικά Μέρη του Λίτρου */}
            <div className="bg-teal-50/70 p-5 sm:p-6 rounded-2xl border border-teal-100 space-y-3 shadow-sm">
              <div className="bg-teal-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                ΚΛΑΣΜΑΤΑ ΛΙΤΡΟΥ
              </div>
              <h3 className="text-base sm:text-lg font-bold text-teal-950">
                Μισό και Τέταρτο του Λίτρου
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium">
                <li>• <strong>Μισό λίτρο (1/2 L)</strong> ＝ 500 mL</li>
                <li>• <strong>Ένα τέταρτο (1/4 L)</strong> ＝ 250 mL</li>
                <li>• <strong>Τρία τέταρτα (3/4 L)</strong> ＝ 750 mL</li>
                <li>• <strong>Ενάμισι λίτρο (1,5 L)</strong> ＝ 1.500 mL</li>
              </ul>
            </div>

            {/* 3. Κανόνες Μετατροπής */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3 shadow-sm">
              <div className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                ΠΩΣ ΚΑΝΟΥΜΕ ΜΕΤΑΤΡΟΠΕΣ
              </div>
              <h3 className="text-base sm:text-lg font-bold text-blue-950">
                Μετατροπές L και mL
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <p className="bg-white p-2.5 rounded-xl border border-blue-200 shadow-sm">
                  🔹 <strong>Από L σε mL:</strong> Πολλαπλασιάζουμε με <strong>1.000</strong> (π.χ. 3 L · 1.000 ＝ 3.000 mL).
                </p>
                <p className="bg-white p-2.5 rounded-xl border border-blue-200 shadow-sm">
                  🔸 <strong>Από mL σε L:</strong> Διαιρούμε με <strong>1.000</strong> (π.χ. 4.000 mL ： 1.000 ＝ 4 L).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - ΟΓΚΟΜΕΤΡΙΚΟ ΔΟΧΕΙΟ */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικό Ογκομετρικό Δοχείο & Μετατροπέας
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Άλλαξε την ποσότητα υγρού για να παρατηρήσεις τη στάθμη στο δοχείο και την αυτόματη μετατροπή σε L και mL!
              </p>
            </div>

            {/* ΠΡΟΕΠΙΛΟΓΕΣ ΠΟΣΟΤΗΤΩΝ */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              <button
                onClick={(e) => setPreset(e, 330)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                🥤 330 mL (Κουτάκι)
              </button>
              <button
                onClick={(e) => setPreset(e, 500)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                💧 500 mL (1/2 L)
              </button>
              <button
                onClick={(e) => setPreset(e, 1000)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                🧃 1.000 mL (1 L)
              </button>
              <button
                onClick={(e) => setPreset(e, 1500)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 transition active:scale-95 touch-manipulation"
              >
                🍶 1.500 mL (1,5 L)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* ΑΡΙΣΤΕΡΑ: SVG ΟΓΚΟΜΕΤΡΙΚΟ ΔΟΧΕΙΟ (ΧΩΡΙΣ SCROLL) */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400">
                ΟΓΚΟΜΕΤΡΙΚΟ ΔΟΧΕΙΟ (0 - 2.000 mL)
              </span>

              <div className="w-52 h-52 flex items-center justify-center">
                <svg className="w-full h-full block select-none" viewBox="0 0 160 180">
                  {/* Υγρό μέσα στο δοχείο */}
                  {mL > 0 && (
                    <rect
                      x="42"
                      y={liquidY}
                      width="76"
                      height={fillHeight}
                      fill="#06b6d4"
                      fillOpacity="0.8"
                      rx="4"
                    />
                  )}

                  {/* Σώμα Δοχείου (Περίγραμμα) */}
                  <path
                    d="M 40,25 L 40,150 A 10,10 0 0,0 50,160 L 110,160 A 10,10 0 0,0 120,150 L 120,25"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4"
                  />
                  {/* Χείλος δοχείου */}
                  <path d="M 35,25 L 125,25" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                  {/* Στόμιο εκροής */}
                  <path d="M 35,25 L 25,20 L 40,35" fill="none" stroke="#38bdf8" strokeWidth="3" />

                  {/* Γραμμές διαβάθμισης (Ενδείξεις mL) */}
                  {/* 2000 mL (Top) */}
                  <line x1="105" y1="30" x2="118" y2="30" stroke="#f8fafc" strokeWidth="2" />
                  <text x="98" y="33" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
                    2.000
                  </text>

                  {/* 1500 mL */}
                  <line x1="105" y1="62" x2="118" y2="62" stroke="#f8fafc" strokeWidth="2" />
                  <text x="98" y="65" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
                    1.500
                  </text>

                  {/* 1000 mL (1 L) */}
                  <line x1="100" y1="94" x2="118" y2="94" stroke="#fbbf24" strokeWidth="2.5" />
                  <text x="95" y="97" textAnchor="end" fill="#fbbf24" fontSize="9" fontWeight="900">
                    1 L
                  </text>

                  {/* 500 mL (1/2 L) */}
                  <line x1="105" y1="126" x2="118" y2="126" stroke="#f8fafc" strokeWidth="2" />
                  <text x="98" y="129" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
                    500
                  </text>
                </svg>
              </div>

              <div className="text-center space-y-1">
                <p className="text-cyan-300 font-mono font-black text-2xl">
                  {formatNumber(mL)} mL
                </p>
                <p className="text-slate-400 text-xs font-mono font-bold">
                  (＝ {liters} L)
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΑΥΤΟΜΑΤΟΣ ΜΕΤΑΤΡΟΠΕΑΣ (ΚΑΝΟΝΑΣ 2) */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              {/* DISPLAY ΜΕΤΑΤΡΟΠΗΣ */}
              <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl text-center border-2 border-cyan-500/30 space-y-1 shadow-inner">
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
                  ΑΥΤΟΜΑΤΗ ΜΕΤΑΤΡΟΠΗ
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400 tracking-wider">
                  {formatNumber(mL)} mL ＝ {liters} L
                </div>
              </div>

              {/* SLIDER & INPUT ΡΥΘΜΙΣΗΣ ΜΕ STEPPERS */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="h-8 flex items-center justify-between text-center px-1">
                  <span className="text-[11px] font-black uppercase text-slate-500">ΠΟΣΟΤΗΤΑ (0 - 2.000 mL)</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-cyan-700 text-base">
                    {formatNumber(mL)} mL
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    onClick={(e) => updateMilliliters(e, -50)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-cyan-50 hover:bg-cyan-100 active:bg-cyan-200 text-cyan-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                    title="Μείωση κατά 50 mL"
                    aria-label="Μείωση ποσότητας"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={mL <= 2000 ? mL : 2000}
                    onChange={(e) => setMilliliters(Number(e.target.value))}
                    className="w-full min-w-0 max-w-full accent-cyan-600 cursor-pointer"
                  />

                  <button
                    onClick={(e) => updateMilliliters(e, 50)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-cyan-50 hover:bg-cyan-100 active:bg-cyan-200 text-cyan-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                    title="Αύξηση κατά 50 mL"
                    aria-label="Αύξηση ποσότητας"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά ποσοτήτων */}
                <div className="flex justify-center gap-1.5 pt-1">
                  <button
                    onClick={(e) => updateMilliliters(e, -250)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    -250 mL
                  </button>
                  <button
                    onClick={(e) => updateMilliliters(e, -100)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    -100 mL
                  </button>
                  <button
                    onClick={(e) => updateMilliliters(e, 100)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    +100 mL
                  </button>
                  <button
                    onClick={(e) => updateMilliliters(e, 250)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    +250 mL
                  </button>
                </div>
              </div>

              {/* ΑΥΤΟΜΑΤΕΣ ΑΝΑΛΥΣΕΙΣ ΜΕ ΣΤΑΘΕΡΟ ΥΨΟΣ */}
              <div className="bg-cyan-50/80 p-4 rounded-2xl border border-cyan-200 min-h-[110px] flex flex-col justify-between shadow-sm">
                <h4 className="text-xs font-black uppercase text-cyan-950 flex items-center gap-1.5 mb-1">
                  <span>💡</span> Πως το διαβαζουμε:
                </h4>
                <ul className="text-xs space-y-1 font-medium text-slate-800">
                  <li>• <strong>Σε Χιλιοστόλιτρα:</strong> {formatNumber(mL)} mL</li>
                  <li>• <strong>Σε Λίτρα:</strong> {liters} L (αφού {formatNumber(mL)} ： 1.000 ＝ {liters})</li>
                  {mL === 500 ? (
                    <li>• <strong>Ειδική ονομασία:</strong> Μισό λίτρο (1/2 L)</li>
                  ) : mL === 250 ? (
                    <li>• <strong>Ειδική ονομασία:</strong> Ένα τέταρτο του λίτρου (1/4 L)</li>
                  ) : mL === 750 ? (
                    <li>• <strong>Ειδική ονομασία:</strong> Τρία τέταρτα του λίτρου (3/4 L)</li>
                  ) : mL === 1000 ? (
                    <li>• <strong>Ειδική ονομασία:</strong> 1 ακέραιο λίτρο (1 L)</li>
                  ) : mL === 1500 ? (
                    <li>• <strong>Ειδική ονομασία:</strong> Ενάμισι λίτρο (1,5 L)</li>
                  ) : (
                    <li className="invisible select-none">• <strong>Ειδική ονομασία:</strong> -</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες να μετράς τα υγρά και να μετατρέπεις τα λίτρα σε χιλιοστόλιτρα; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/29-posotita-igrou-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
