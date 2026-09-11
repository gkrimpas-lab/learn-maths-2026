// pages/d-dimotikou/25-ora.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function OraTheoryPage() {
  const [hours, setHours] = useState(15);   // 0 - 23
  const [minutes, setMinutes] = useState(30); // 0 - 59

  // Υπολογισμοί γωνιών για τους δείκτες του ρολογιού
  // 360° / 12 h = 30° ανά ώρα (+ 0.5° ανά λεπτό)
  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5);
  // 360° / 60 min = 6° ανά λεπτό
  const minuteAngle = minutes * 6;

  // Υπολογισμοί μετατροπών
  const totalMinutes = (hours * 60) + minutes;
  const totalSeconds = totalMinutes * 60;

  // 12ωρη μορφή & λεκτική περιγραφή
  const displayHours12 = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours >= 12 ? 'μ.μ.' : 'π.μ.';
  const formattedDigital = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  const getSpokenTime = () => {
    const h = displayHours12;
    const nextH = (displayHours12 % 12) + 1;

    if (minutes === 0) return `${h} ακριβώς`;
    if (minutes === 15) return `${h} και τέταρτο`;
    if (minutes === 30) return `${h} και μισή`;
    if (minutes === 45) return `${nextH} παρά τέταρτο`;
    if (minutes < 30) return `${h} και ${minutes} λεπτά`;
    return `${nextH} παρά ${60 - minutes} λεπτά`;
  };

  const setPreset = (e, h, m) => {
    e.preventDefault();
    e.stopPropagation();
    setHours(h);
    setMinutes(m);
  };

  const updateHours = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setHours((prev) => Math.max(0, Math.min(23, prev + delta)));
  };

  const updateMinutes = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setMinutes((prev) => Math.max(0, Math.min(59, prev + delta)));
  };

  return (
    <Layout
      title="Η Μέτρηση του Χρόνου και το Ρολόι - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε πώς διαβάζουμε το αναλογικό και ψηφιακό ρολόι, πώς μετατρέπουμε ώρες, λεπτά και δευτερόλεπτα με διαδραστικό εργαστήριο χρόνου."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/25-ora-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                ⏰ Η Μέτρηση του Χρόνου
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε να διαβάζουμε το <strong>αναλογικό</strong> και το <strong>ψηφιακό ρολόι</strong>, να μετατρέπουμε ώρες, λεπτά και δευτερόλεπτα και να υπολογίζουμε χρονικές διάρκειες!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-blue-100">
                Δοκίμασε τις διαδραστικές ασκήσεις για να σιγουρευτείς ότι έμαθες να διαβάζεις και να μετατρέπεις την ώρα!
              </p>
              <Link
                href="/d-dimotikou/25-ora-ask"
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
              <span>📖</span> Βασικές Μονάδες Μέτρησης Χρόνου & Κανόνες
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Σχέσεις Μονάδων */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>⏱️</span> Οι Μονάδες Χρόνου
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                <li>• <strong>1 ημέρα</strong> ＝ 24 ώρες</li>
                <li>• <strong>1 ώρα (h)</strong> ＝ 60 λεπτά (min)</li>
                <li>• <strong>1 λεπτό (min)</strong> ＝ 60 δευτερόλεπτα (s)</li>
                <li>• <strong>1 ώρα</strong> ＝ 3.600 δευτερόλεπτα</li>
              </ul>
            </div>

            {/* 2. Αναλογικό Ρολόι */}
            <div className="bg-cyan-50/70 p-5 sm:p-6 rounded-2xl border border-cyan-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-cyan-900 flex items-center gap-2">
                <span>🕰️</span> Αναλογικό Ρολόι
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Διαθέτει 2 βασικούς δείκτες:
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                <li>• <strong>Μικρός δείκτης:</strong> δείχνει τις <strong>Ώρες</strong>.</li>
                <li>• <strong>Μεγάλος δείκτης:</strong> δείχνει τα <strong>Λεπτά</strong>.</li>
              </ul>
            </div>

            {/* 3. Ψηφιακό Ρολόι (24ωρο) */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
                <span>📟</span> Ψηφιακό Ρολόι
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Προβάλλει την ώρα με αριθμούς (π.χ. <strong>14:30</strong>).
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Μετά το μεσημέρι (12:00), προσθέτουμε 12 στις ώρες (π.χ. <strong>3 μ.μ. ＝ 15:00</strong>, <strong>8 μ.μ. ＝ 20:00</strong>).
              </p>
            </div>
          </div>

          {/* ΠΙΝΑΚΑΣ ΜΕΤΑΤΡΟΠΩΝ */}
          <div className="bg-slate-50 p-5 sm:p-7 rounded-3xl border border-slate-200 space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <span>🔄</span> Πώς μετατρέπουμε τις μονάδες χρόνου:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
                <p className="font-bold text-emerald-800">Από μεγαλύτερη σε μικρότερη μονάδα ( · 60 ):</p>
                <p className="text-slate-600">• Ώρες σε Λεπτά: <strong>Πολλαπλασιάζουμε με 60</strong> (π.χ. 2 h ＝ 2 · 60 ＝ 120 min).</p>
                <p className="text-slate-600">• Λεπτά σε Δευτερόλεπτα: <strong>Πολλαπλασιάζουμε με 60</strong> (π.χ. 3 min ＝ 3 · 60 ＝ 180 s).</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
                <p className="font-bold text-blue-800">Από μικρότερη σε μεγαλύτερη μονάδα ( ： 60 ):</p>
                <p className="text-slate-600">• Λεπτά σε Ώρες: <strong>Διαιρούμε με 60</strong> (π.χ. 180 min ： 60 ＝ 3 h).</p>
                <p className="text-slate-600">• Δευτερόλεπτα σε Λεπτά: <strong>Διαιρούμε με 60</strong> (π.χ. 240 s ： 60 ＝ 4 min).</p>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικό Εργαστήριο Ρολογιού & Μετατροπών
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Άλλαξε την ώρα και παρατήρησε ταυτόχρονα το αναλογικό ρολόι, το ψηφιακό και τους υπολογισμούς!
              </p>
            </div>

            {/* ΠΡΟΕΠΙΛΟΓΕΣ ΩΡΑΣ */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              <button
                onClick={(e) => setPreset(e, 8, 0)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                🌅 08:00 (Ακριβώς)
              </button>
              <button
                onClick={(e) => setPreset(e, 12, 15)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                ☀️ 12:15 (Και τέταρτο)
              </button>
              <button
                onClick={(e) => setPreset(e, 15, 30)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                ☕ 15:30 (Και μισή)
              </button>
              <button
                onClick={(e) => setPreset(e, 19, 45)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                🌙 19:45 (Παρά τέταρτο)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* ΑΝΑΛΟΓΙΚΟ ΡΟΛΟΙ (SVG ΧΩΡΙΣ SCROLL) */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                ΑΝΑΛΟΓΙΚΟ ΡΟΛΟΙ
              </span>

              <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                <svg className="w-full h-full block select-none" viewBox="0 0 200 200">
                  {/* Καντράν */}
                  <circle cx="100" cy="100" r="90" fill="#0f172a" stroke="#38bdf8" strokeWidth="5.5" />

                  {/* Σημάδια Ωρών (1 - 12) */}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                    const angle = (num * 30) * (Math.PI / 180);
                    const x = 100 + 70 * Math.sin(angle);
                    const y = 100 - 70 * Math.cos(angle);
                    return (
                      <text
                        key={num}
                        x={x}
                        y={y + 5}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="14"
                        fontWeight="900"
                        fontFamily="monospace"
                      >
                        {num}
                      </text>
                    );
                  })}

                  {/* Μικρός Δείκτης (Ώρα - Μπλε) */}
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="55"
                    stroke="#38bdf8"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    transform={`rotate(${hourAngle}, 100, 100)`}
                  />

                  {/* Μεγάλος Δείκτης (Λεπτά - Ροζ/Κόκκινο) */}
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="32"
                    stroke="#f43f5e"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    transform={`rotate(${minuteAngle}, 100, 100)`}
                  />

                  {/* Κεντρικό καρφάκι */}
                  <circle cx="100" cy="100" r="5" fill="#fbbf24" />
                </svg>
              </div>

              <div className="text-center space-y-1">
                <p className="text-amber-300 font-extrabold text-base sm:text-lg">
                  🗣️ «{getSpokenTime()}»
                </p>
                <p className="text-slate-400 text-xs font-mono">
                  ({displayHours12}:{minutes.toString().padStart(2, '0')} {ampm})
                </p>
              </div>
            </div>

            {/* ΧΕΙΡΙΣΤΗΡΙΑ & ΨΗΦΙΑΚΟ DISPLAY (ΚΑΝΟΝΑΣ 2) */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              {/* ΨΗΦΙΑΚΟ DISPLAY */}
              <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl text-center border-2 border-indigo-500/30 space-y-1 shadow-inner">
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block">
                  ΨΗΦΙΑΚΟ ΡΟΛΟΙ (24ΩΡΟ)
                </span>
                <div className="text-4xl sm:text-5xl font-mono font-black text-emerald-400 tracking-widest">
                  {formattedDigital}
                </div>
              </div>

              {/* SLIDERS ΡΥΘΜΙΣΗΣ ΩΡΑΣ & ΛΕΠΤΩΝ ΜΕ STEPPERS */}
              <div className="space-y-3">
                {/* Ώρα */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black uppercase text-slate-500">ΩΡΑ (0 - 23)</span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                      {hours} h
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateHours(e, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title="Μείωση ώρας κατά 1"
                      aria-label="Μείωση ώρας"
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="23"
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                    />

                    <button
                      onClick={(e) => updateHours(e, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title="Αύξηση ώρας κατά 1"
                      aria-label="Αύξηση ώρας"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Λεπτά */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black uppercase text-slate-500">ΛΕΠΤΑ (0 - 59)</span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-rose-600 text-base">
                      {minutes} min
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateMinutes(e, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title="Μείωση λεπτών κατά 1"
                      aria-label="Μείωση λεπτών"
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-rose-600 cursor-pointer"
                    />

                    <button
                      onClick={(e) => updateMinutes(e, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title="Αύξηση λεπτών κατά 1"
                      aria-label="Αύξηση λεπτών"
                    >
                      ＋
                    </button>
                  </div>

                  {/* Βοηθητικά κουμπιά 5λέπτων */}
                  <div className="flex justify-center gap-2 pt-0.5">
                    <button
                      onClick={(e) => updateMinutes(e, -5)}
                      className="px-2.5 py-0.5 text-[11px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 touch-manipulation"
                    >
                      -5 min
                    </button>
                    <button
                      onClick={(e) => updateMinutes(e, 5)}
                      className="px-2.5 py-0.5 text-[11px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 touch-manipulation"
                    >
                      +5 min
                    </button>
                  </div>
                </div>
              </div>

              {/* ΑΥΤΟΜΑΤΕΣ ΜΕΤΑΤΡΟΠΕΣ */}
              <div className="bg-indigo-50 p-3.5 rounded-2xl border border-indigo-200 space-y-2">
                <span className="text-[11px] font-black uppercase text-indigo-900 block">
                  🧮 ΑΥΤΟΜΑΤΗ ΜΕΤΑΤΡΟΠΗ ΤΗΣ ΩΡΑΣ:
                </span>
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-sm">
                    <span className="text-[10px] text-slate-500 block">Συνολικά Λεπτά</span>
                    <span className="text-indigo-800 font-black text-sm sm:text-base">
                      {formatNumber(totalMinutes)} min
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-sm">
                    <span className="text-[10px] text-slate-500 block">Συνολικά Δευτερόλεπτα</span>
                    <span className="text-indigo-800 font-black text-sm sm:text-base">
                      {formatNumber(totalSeconds)} s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες να διαβάζεις το ρολόι και να μετατρέπεις τις μονάδες χρόνου; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/25-ora-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
