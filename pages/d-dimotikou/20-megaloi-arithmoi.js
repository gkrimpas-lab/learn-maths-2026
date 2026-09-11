// pages/d-dimotikou/20-megaloi-arithmoi.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const CONFIG = {
  maxDisksPerColumn: 9,
  initialValues: {
    EX: 1,
    DX: 3,
    X: 5,
    E: 4,
    D: 2,
    M: 7
  }
};

function numberToGreekWords(num) {
  if (num === 0) return 'Μηδέν';
  const units = ['', 'ένα', 'δύο', 'τρία', 'τέσσερα', 'πέντε', 'έξι', 'επτά', 'οκτώ', 'εννέα'];
  const tens = ['', 'δέκα', 'είκοσι', 'τριάντα', 'σαράντα', 'πενήντα', 'εξήντα', 'εβδομήντα', 'ογδόντα', 'εννενήντα'];
  const hundreds = ['', 'εκατό', 'διακόσια', 'τρακόσια', 'τετρακόσια', 'πεντακόσια', 'εξακόσια', 'επτακόσια', 'οκτακόσια', 'εννιακόσια'];
  const unitsFem = ['', 'μία', 'δύο', 'τρεις', 'τέσσερις', 'πέντε', 'έξι', 'επτά', 'οκτώ', 'εννέα'];
  const hundredsFem = ['', 'εκατό', 'διακόσιες', 'τριακόσιες', 'τετρακόσιες', 'πεντακόσιες', 'εξακόσιες', 'επτακόσιες', 'οκτακόσιες', 'εννιακόσιες'];

  const getUnderTwenty = (t, u, isFem) => {
    if (t === 1 && u === 1) return 'έντεκα';
    if (t === 1 && u === 2) return 'δώδεκα';
    return tens[t] + (u > 0 ? ' ' + (isFem ? unitsFem[u] : units[u]) : '');
  };

  const convertTrio = (h, t, u, isThousands) => {
    let res = '';
    if (h > 0) {
      if (h === 1 && (t > 0 || u > 0)) res += 'εκατόν ';
      else res += (isThousands ? hundredsFem[h] : hundreds[h]) + ' ';
    }
    if (t > 0) res += getUnderTwenty(t, u, isThousands);
    else if (u > 0) res += isThousands ? unitsFem[u] : units[u];
    return res.trim();
  };

  const ex = Math.floor(num / 100000) % 10;
  const dx = Math.floor(num / 10000) % 10;
  const x = Math.floor(num / 1000) % 10;
  const e = Math.floor(num / 100) % 10;
  const d = Math.floor(num / 10) % 10;
  const m = num % 10;

  const thousandsPart = ex * 100 + dx * 10 + x;
  const unitsPart = e * 100 + d * 10 + m;

  let finalWords = '';
  if (thousandsPart > 0) {
    if (thousandsPart === 1) finalWords += 'χίλια ';
    else finalWords += convertTrio(ex, dx, x, true) + ' χιλιάδες ';
  }
  if (unitsPart > 0) finalWords += convertTrio(e, d, m, false);
  return finalWords.trim();
}

export default function MegaloiArithmoiPage() {
  const [disks, setDisks] = useState(CONFIG.initialValues);

  const updateDigits = (e, column, increment) => {
    e.preventDefault();
    e.stopPropagation();
    setDisks((prev) => {
      let newValue = prev[column] + increment;
      if (newValue < 0) newValue = 0;
      if (newValue > CONFIG.maxDisksPerColumn) newValue = CONFIG.maxDisksPerColumn;
      return { ...prev, [column]: newValue };
    });
  };

  const totalNumber =
    disks.EX * 100000 +
    disks.DX * 10000 +
    disks.X * 1000 +
    disks.E * 100 +
    disks.D * 10 +
    disks.M * 1;

  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const columnsList = [
    { key: 'EX', label: 'Εκατοντάδες Χιλιάδες', short: 'ΕΧ', weight: 100000, color: '#059669' },
    { key: 'DX', label: 'Δεκάδες Χιλιάδες', short: 'ΔΧ', weight: 10000, color: '#10b981' },
    { key: 'X', label: 'Μονάδες Χιλιάδες', short: 'Χ', weight: 1000, color: '#34d399' },
    { key: 'E', label: 'Εκατοντάδες', short: 'Ε', weight: 100, color: '#0284c7' },
    { key: 'D', label: 'Δεκάδες', short: 'Δ', weight: 10, color: '#38bdf8' },
    { key: 'M', label: 'Μονάδες', short: 'Μ', weight: 1, color: '#7dd3fc' }
  ];

  return (
    <Layout
      title="Οι Μεγάλοι Αριθμοί μέχρι το 1.000.000 - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε πώς διαβάζουμε, γράφουμε και αναλύουμε μεγάλους αριθμούς έως το 1.000.000 με βάση τις κλάσεις και τον διαδραστικό άβακα θέσης."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/20-megaloi-arithmoi-ask"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                💎 Οι Μεγάλοι Αριθμοί (μέχρι το 1.000.000)
              </h1>
              <p className="text-teal-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε πώς να διαβάζουμε, να γράφουμε και να αναλύουμε τους μεγάλους αριθμούς χρησιμοποιώντας τις «Κλάσεις» και την «Αξία Θέσης Ψηφίου»!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-teal-100">
                Δοκίμασε τις ασκήσεις στους μεγάλους αριθμούς για να σιγουρευτείς ότι κατανόησες όλες τις κλάσεις!
              </p>
              <Link
                href="/d-dimotikou/20-megaloi-arithmoi-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ & ΠΡΟΒΟΛΗ ΑΡΙΘΜΟΥ */}
        <div className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-b pb-8 border-slate-100">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>📖</span> Αναλυτική Θεωρία και Κανόνες
              </h2>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm md:text-base">
                Στο δεκαδικό σύστημα αρίθμησης, η <strong>αξία κάθε ψηφίου</strong> καθορίζεται από τη <strong>θέση</strong> που κατέχει μέσα στον αριθμό. Για να διαβάζουμε εύκολα τους μεγάλους αριθμούς, τους χωρίζουμε σε <strong>κλάσεις ανά 3 ψηφία</strong> από τα δεξιά προς τα αριστερά!
              </p>
              <div className="bg-teal-50 p-4 sm:p-5 rounded-2xl border border-teal-100 text-xs sm:text-sm text-teal-950 space-y-2 shadow-inner">
                <p>
                  🏛️ <strong>Κλάση Χιλιάδων:</strong> Εκατοντάδες Χιλιάδες (ΕΧ), Δεκάδες Χιλιάδες (ΔΧ), Μονάδες Χιλιάδες (Χ).
                </p>
                <p>
                  🏠 <strong>Κλάση Μονάδων:</strong> Εκατοντάδες (Ε), Δεκάδες (Δ), Μονάδες (Μ).
                </p>
              </div>
            </div>

            {/* ΠΡΟΒΟΛΗ ΑΡΙΘΜΟΥ & ΟΝΟΜΑΣΙΑΣ */}
            <div className="bg-gradient-to-br from-teal-600 to-emerald-700 text-white p-6 sm:p-8 rounded-3xl shadow-md text-center py-8 sm:py-10 space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-teal-200 block">
                Ο ΑΡΙΘΜΟΣ ΣΟΥ
              </span>
              <div className="text-3xl sm:text-5xl font-mono font-black tracking-tight text-white break-words">
                {formatNumber(totalNumber)}
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/20 text-xs sm:text-sm font-bold text-teal-50 leading-relaxed">
                🗣️ <span className="text-amber-300 font-extrabold capitalize">{numberToGreekWords(totalNumber)}</span>
              </div>
            </div>
          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟΣ ΑΒΑΚΑΣ - SECTION 2 */}
          <div className="bg-slate-50 p-5 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
                <span>🧮</span> Διαδραστικός Άβακας Αξίας Θέσης
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                Άλλαξε τα δισκία σε κάθε θέση και δες πώς διαμορφώνεται ο αριθμός στις δύο κλάσεις!
              </p>
            </div>

            {/* RESPONSIVE SVG ΑΒΑΚΑΣ (ΧΩΡΙΣ SCROLLBAR ΣΕ ΚΙΝΗΤΑ) */}
            <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center">
              <div className="w-full max-w-2xl aspect-[5/2] relative flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full block select-none" viewBox="0 0 600 240">
                  {/* Κλάση Χιλιάδων (Αριστερά) */}
                  <rect x="15" y="10" width="280" height="26" rx="6" fill="#065f46" fillOpacity="0.4" stroke="#059669" strokeWidth="1" />
                  <text x="155" y="27" fill="#6ee7b7" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                    ΚΛΑΣΗ ΧΙΛΙΑΔΩΝ
                  </text>

                  {/* Κλάση Μονάδων (Δεξιά) */}
                  <rect x="305" y="10" width="280" height="26" rx="6" fill="#075985" fillOpacity="0.4" stroke="#0284c7" strokeWidth="1" />
                  <text x="445" y="27" fill="#7dd3fc" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                    ΚΛΑΣΗ ΜΟΝΑΔΩΝ
                  </text>

                  {/* Βάση Άβακα */}
                  <rect x="15" y="205" width="570" height="14" rx="4" fill="#334155" stroke="#475569" strokeWidth="1" />

                  {/* 6 Στήλες / Ράβδοι & Δισκία */}
                  {columnsList.map((col, cIdx) => {
                    const colX = 55 + cIdx * 96;
                    const count = disks[col.key];

                    return (
                      <g key={col.key}>
                        {/* Κουτί Συντομογραφίας */}
                        <rect x={colX - 22} y="44" width="44" height="22" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                        <text x={colX} y="59" fill="#f8fafc" fontSize="11" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                          {col.short}
                        </text>

                        {/* Ράβδος */}
                        <line x1={colX} y1="72" x2={colX} y2="205" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

                        {/* Δισκία (από κάτω προς τα πάνω) */}
                        {Array.from({ length: count }).map((_, dIdx) => {
                          const diskY = 195 - dIdx * 13;
                          return (
                            <ellipse
                              key={dIdx}
                              cx={colX}
                              cy={diskY}
                              rx="22"
                              ry="5.5"
                              fill={cIdx < 3 ? '#10b981' : '#0284c7'}
                              stroke="#f8fafc"
                              strokeWidth="0.8"
                              fillOpacity="0.9"
                            />
                          );
                        })}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* ΧΕΙΡΙΣΤΗΡΙΑ (+ / -) ΜΕ TOUCH-FRIENDLY STEPRERS (ΚΑΝΟΝΑΣ 2) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {columnsList.map((col) => (
                <div key={col.key} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-center">
                  <div className="h-8 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black uppercase text-slate-500 block truncate">
                      {col.short}
                    </span>
                    <span className="min-w-[40px] text-center whitespace-nowrap font-mono font-black text-slate-800 text-sm">
                      {disks[col.key]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 h-11 items-center">
                    <button
                      onClick={(e) => updateDigits(e, col.key, -1)}
                      className="h-9 flex items-center justify-center bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title={`Μείωση ${col.short}`}
                      aria-label={`Μείωση ${col.short}`}
                    >
                      －
                    </button>
                    <button
                      onClick={(e) => updateDigits(e, col.key, 1)}
                      className="h-9 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title={`Αύξηση ${col.short}`}
                      aria-label={`Αύξηση ${col.short}`}
                    >
                      ＋
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ΑΝΑΛΥΣΗ ΤΟΥ ΑΡΙΘΜΟΥ ΣΕ ΑΘΡΟΙΣΜΑ */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 text-center space-y-2 shadow-sm">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                ΑΝΑΛΥΣΗ ΤΟΥ ΑΡΙΘΜΟΥ ΣΕ ΑΘΡΟΙΣΜΑ:
              </span>
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                <span>{formatNumber(totalNumber)}</span>
                <span>＝</span>
                <span>({disks.EX} · 100.000)</span>
                <span>＋</span>
                <span>({disks.DX} · 10.000)</span>
                <span>＋</span>
                <span>({disks.X} · 1.000)</span>
                <span>＋</span>
                <span>({disks.E} · 100)</span>
                <span>＋</span>
                <span>({disks.D} · 10)</span>
                <span>＋</span>
                <span>({disks.M} · 1)</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες να διαβάζεις και να αναλύεις τους μεγάλους αριθμούς; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/20-megaloi-arithmoi-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
