import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function OraTheoryPage() {
  const [hours, setHours] = useState(15);   // 0 - 23
  const [minutes, setMinutes] = useState(30); // 0 - 59

  // Υπολογισμοί γωνιών για τους δείκτες του ρολογιού
  // 360 μοίρες / 12 ώρες = 30 μοίρες ανά ώρα (+ 0.5 μοίρα ανά λεπτό)
  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5);
  // 360 μοίρες / 60 λεπτά = 6 μοίρες ανά λεπτό
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

  const setPreset = (h, m) => {
    setHours(h);
    setMinutes(m);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⏰ Μέτρηση του Χρόνου & Ρολόι - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/25-ora-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 25
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  ⏰ Η Μέτρηση του Χρόνου
                </h1>
                <p className="text-blue-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε να διαβάζουμε το **αναλογικό** και το **ψηφιακό ρολόι**, να μετατρέπουμε **ώρες, λεπτά και δευτερόλεπτα** και να υπολογίζουμε χρονικές διάρκειες!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-blue-100">Δοκίμασε τις διαδραστικές ασκήσεις για να σιγουρευτείς ότι έμαθες το ρολόι!</p>
                <Link 
                  href="/d-dimotikou/25-ora"
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
                <span>📖</span> Βασικές Μονάδες Μέτρησης Χρόνου & Κανόνες
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Σχέσεις Μονάδων */}
              <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-100 space-y-3">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <span>⏱️</span> Οι Μονάδες Χρόνου
                </h3>
                <ul className="space-y-2 text-xs md:text-sm text-gray-700 font-medium">
                  <li>• <strong>1 ημέρα</strong> = 24 ώρες</li>
                  <li>• <strong>1 ώρα (h)</strong> = 60 λεπτά (min)</li>
                  <li>• <strong>1 λεπτό (min)</strong> = 60 δευτερόλεπτα (s)</li>
                  <li>• <strong>1 ώρα</strong> = 3.600 δευτερόλεπτα</li>
                </ul>
              </div>

              {/* 2. Αναλογικό Ρολόι */}
              <div className="bg-cyan-50/70 p-6 rounded-2xl border border-cyan-100 space-y-3">
                <h3 className="text-lg font-bold text-cyan-900 flex items-center gap-2">
                  <span>🕰️</span> Αναλογικό Ρολόι
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Έχει 2 βασικούς δείκτες:
                </p>
                <ul className="space-y-1 text-xs md:text-sm text-gray-700">
                  <li>• <strong>Μικρός δείκτης:</strong> δείχνει τις <strong>Ώρες</strong>.</li>
                  <li>• <strong>Μεγάλος δείκτης:</strong> δείχνει τα <strong>Λεπτά</strong>.</li>
                </ul>
              </div>

              {/* 3. Ψηφιακό Ρολόι (24ωρο) */}
              <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-100 space-y-3">
                <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                  <span>📟</span> Ψηφιακό Ρολόι
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Δείχνει την ώρα με αριθμούς (π.χ. <strong>14:30</strong>).
                </p>
                <p className="text-xs md:text-sm text-gray-700">
                  Μετά το μεσημέρι (12:00), προσθέτουμε 12 στις ώρες (π.χ. <strong>3 μ.μ. = 15:00</strong>, <strong>8 μ.μ. = 20:00</strong>).
                </p>
              </div>

            </div>

            {/* ΠΙΝΑΚΑΣ ΜΕΤΑΤΡΟΠΩΝ */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2">
                <span>🔄</span> Πώς μετατρέπουμε τις μονάδες χρόνου:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="font-bold text-emerald-700">Από μεγαλύτερη σε μικρότερη μονάδα ( × 60 ):</p>
                  <p className="text-gray-600 mt-1">• Ώρες σε Λεπτά: <strong>Πολλαπλασιάζουμε με 60</strong> (π.χ. 2 h = 2 × 60 = 120 min).</p>
                  <p className="text-gray-600">• Λεπτά σε Δευτερόλεπτα: <strong>Πολλαπλασιάζουμε με 60</strong> (π.χ. 3 min = 3 × 60 = 180 s).</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="font-bold text-blue-700">Από μικρότερη σε μεγαλύτερη μονάδα ( : 60 ):</p>
                  <p className="text-gray-600 mt-1">• Λεπτά σε Ώρες: <strong>Διαιρούμε με 60</strong> (π.χ. 180 min : 60 = 3 h).</p>
                  <p className="text-gray-600">• Δευτερόλεπτα σε Λεπτά: <strong>Διαιρούμε με 60</strong> (π.χ. 240 s : 60 = 4 min).</p>
                </div>
              </div>
            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικό Εργαστήριο Ρολογιού & Μετατροπών
                </h2>
                <p className="text-gray-500 text-sm">
                  Άλλαξε την ώρα και δες ταυτόχρονα το αναλογικό ρολόι, το ψηφιακό και τις μετατροπές!
                </p>
              </div>

              {/* ΠΡΟΕΠΙΛΟΓΕΣ ΩΡΑΣ */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPreset(8, 0)}
                  className="px-3 py-2 rounded-xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  🌅 08:00 (Ακριβώς)
                </button>
                <button
                  onClick={() => setPreset(12, 15)}
                  className="px-3 py-2 rounded-xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  ☀️ 12:15 (Και τέταρτο)
                </button>
                <button
                  onClick={() => setPreset(15, 30)}
                  className="px-3 py-2 rounded-xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  ☕ 15:30 (Και μισή)
                </button>
                <button
                  onClick={() => setPreset(19, 45)}
                  className="px-3 py-2 rounded-xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  🌙 19:45 (Παρά τέταρτο)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* ΑΝΑΛΟΓΙΚΟ ΡΟΛΟΙ (SVG) */}
              <div className="bg-slate-900 p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Αναλογικο Ρολοι
                </span>

                <div className="relative w-64 h-64 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Καντράν */}
                    <circle cx="100" cy="100" r="90" fill="#0f172a" stroke="#38bdf8" strokeWidth="6" />
                    
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
                      strokeWidth="6"
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
                      strokeWidth="4"
                      strokeLinecap="round"
                      transform={`rotate(${minuteAngle}, 100, 100)`}
                    />

                    {/* Κεντρικό καρφάκι */}
                    <circle cx="100" cy="100" r="5" fill="#fbbf24" />
                  </svg>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-amber-300 font-extrabold text-base">
                    🗣️ «{getSpokenTime()}»
                  </p>
                  <p className="text-slate-400 text-xs font-mono">
                    ({displayHours12}:{minutes.toString().padStart(2, '0')} {ampm})
                  </p>
                </div>
              </div>

              {/* ΧΕΙΡΙΣΤΗΡΙΑ & ΨΗΦΙΑΚΟ ΡΟΛΟΙ / ΜΕΤΑΤΡΟΠΕΣ */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 space-y-6">
                
                {/* ΨΗΦΙΑΚΟ DISPLAY */}
                <div className="bg-slate-900 p-5 rounded-2xl text-center border-2 border-indigo-500/30 space-y-1">
                  <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                    Ψηφιακο Ρολοι (24ωρο)
                  </span>
                  <div className="text-4xl md:text-5xl font-mono font-black text-emerald-400 tracking-widest">
                    {formattedDigital}
                  </div>
                </div>

                {/* SLIDERS ΡΥΘΜΙΣΗΣ ΩΡΑΣ & ΛΕΠΤΩΝ */}
                <div className="space-y-4">
                  <div className="space-y-1 bg-white p-4 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-gray-700">
                      <span>Ώρα (0 - 23):</span>
                      <span className="text-indigo-600 font-mono text-base font-black">{hours} h</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="23" 
                      value={hours} 
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1 bg-white p-4 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-gray-700">
                      <span>Λεπτά (0 - 59):</span>
                      <span className="text-rose-600 font-mono text-base font-black">{minutes} min</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="59" 
                      value={minutes} 
                      onChange={(e) => setMinutes(Number(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* ΑΥΤΟΜΑΤΕΣ ΜΕΤΑΤΡΟΠΕΣ */}
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 space-y-2">
                  <h4 className="text-xs font-black uppercase text-indigo-900 flex items-center gap-1.5">
                    <span>🧮</span> Αυτόματη Μετατροπή της Ώρας:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-sm">
                      <span className="text-[10px] text-gray-500 block">Συνολικά Λεπτά</span>
                      <span className="text-indigo-700 font-black text-base">{formatNumber(totalMinutes)} min</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-sm">
                      <span className="text-[10px] text-gray-500 block">Συνολικά Δευτερόλεπτα</span>
                      <span className="text-indigo-700 font-black text-base">{formatNumber(totalSeconds)} s</span>
                    </div>
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
                Έμαθες να διαβάζεις το ρολόι και να μετατρέπεις τις μονάδες χρόνου; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/25-ora-ask"
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
