import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const CONFIG = {
  initialValues: {
    DX: 1,
    X: 4,
    E: 3,
    D: 2,
    M: 5,
  },
};

/**
 * Μετατροπές αριθμών από 0 έως 20.000 σε ελληνικές λέξεις
 */
function numberToGreekWords(num) {
  if (num === 0) return 'Μηδέν';
  if (num === 20000) return 'είκοσι χιλιάδες';

  const units = ['', 'ένα', 'δύο', 'τρία', 'τέσσερα', 'πέντε', 'έξι', 'επτά', 'οκτώ', 'εννέα'];
  const tens = ['', 'δέκα', 'είκοσι', 'τριάντα', 'σαράντα', 'πενήντα', 'εξήντα', 'εβδομήντα', 'ογδόντα', 'εννενήντα'];
  const hundreds = ['', 'εκατό', 'διακόσια', 'τρακόσια', 'τετρακόσια', 'πεντακόσια', 'εξακόσια', 'επτακόσια', 'οκτακόσια', 'εννιακόσια'];

  const thousandWords = [
    '', 'χίλια', 'δύο χιλιάδες', 'τρεις χιλιάδες', 'τέσσερις χιλιάδες',
    'πέντε χιλιάδες', 'έξι χιλιάδες', 'επτά χιλιάδες', 'οκτώ χιλιάδες', 'εννέα χιλιάδες',
    'δέκα χιλιάδες', 'έντεκα χιλιάδες', 'δώδεκα χιλιάδες', 'δεκατρείς χιλιάδες',
    'δεκατέσσερις χιλιάδες', 'δεκαπέντε χιλιάδες', 'δεκαέξι χιλιάδες', 'δεκαεπτά χιλιάδες',
    'δεκαοκτώ χιλιάδες', 'δεκαεννέα χιλιάδες', 'είκοσι χιλιάδες',
  ];

  const th = Math.floor(num / 1000);
  const rem = num % 1000;

  let res = '';
  if (th > 0) {
    res += thousandWords[th] + ' ';
  }

  if (rem > 0) {
    const e = Math.floor(rem / 100);
    const d = Math.floor((rem % 100) / 10);
    const m = rem % 10;

    if (e > 0) {
      if (e === 1 && (d > 0 || m > 0)) res += 'εκατόν ';
      else res += hundreds[e] + ' ';
    }

    if (d === 1) {
      if (m === 0) res += 'δέκα';
      else if (m === 1) res += 'έντεκα';
      else if (m === 2) res += 'δώδεκα';
      else if (m === 3) res += 'δεκατρία';
      else if (m === 4) res += 'δεκατέσσερα';
      else res += 'δέκα ' + units[m];
    } else {
      if (d > 1) res += tens[d] + ' ';
      if (m > 0) res += units[m];
    }
  }

  return res.trim().replace(/\s+/g, ' ');
}

export default function ArithmoiEos20XiliadesPage() {
  const [disks, setDisks] = useState(CONFIG.initialValues);

  const totalNumber =
    disks.DX * 10000 + disks.X * 1000 + disks.E * 100 + disks.D * 10 + disks.M;

  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const applyNumber = (n) => {
    const str = n.toString().padStart(5, '0');
    setDisks({
      DX: parseInt(str[0], 10),
      X: parseInt(str[1], 10),
      E: parseInt(str[2], 10),
      D: parseInt(str[3], 10),
      M: parseInt(str[4], 10),
    });
  };

  const handleDirectInputChange = (e) => {
    // Επιτρέπονται μόνο αριθμητικά ψηφία
    const cleanDigits = e.target.value.replace(/\D/g, '');

    if (cleanDigits === '') {
      applyNumber(0);
      return;
    }

    const nextVal = parseInt(cleanDigits, 10);

    // Αν ξεπερνά το 20.000, απορρίπτουμε την αλλαγή εντελώς (παραμένει η τρέχουσα τιμή)
    if (nextVal > 20000) {
      return;
    }

    applyNumber(nextVal);
  };

  const columnsList = [
    { key: 'DX', label: 'Δεκάδες Χιλιάδες', short: 'ΔΧ', color: 'bg-purple-500', textColor: 'text-purple-800', lightBg: 'bg-purple-100' },
    { key: 'X', label: 'Μονάδες Χιλιάδες', short: 'Χ', color: 'bg-indigo-500', textColor: 'text-indigo-800', lightBg: 'bg-indigo-100' },
    { key: 'E', label: 'Εκατοντάδες', short: 'Ε', color: 'bg-teal-500', textColor: 'text-teal-800', lightBg: 'bg-teal-100' },
    { key: 'D', label: 'Δεκάδες', short: 'Δ', color: 'bg-amber-500', textColor: 'text-amber-800', lightBg: 'bg-amber-100' },
    { key: 'M', label: 'Μονάδες', short: 'Μ', color: 'bg-emerald-500', textColor: 'text-emerald-800', lightBg: 'bg-emerald-100' },
  ];

  return (
    <Layout
      title="Αριθμοί έως το 20.000 - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε να διαβάζουμε, να γράφουμε και να αναλύουμε αριθμούς από το 0 έως το 20.000 με διαδραστικό άβακα αξίας θέσης."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/1-arithmoi-eos-20-xiliades-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                🔢 Αριθμοί έως το 20.000
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε να διαβάζουμε, να γράφουμε και να αναλύουμε αριθμούς από το{' '}
                <strong className="text-white">0 έως το 20.000</strong>!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-blue-100">
                Δοκίμασε τις ασκήσεις της ενότητας για να σιγουρευτείς ότι τα έμαθες όλα!
              </p>
              <Link
                href="/d-dimotikou/1-arithmoi-eos-20-xiliades-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
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
              <span>📖</span> Αναλυτική Θεωρία και Κανόνες
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Κάρτα 1: Πώς σχηματίζονται */}
            <div className="bg-blue-50/60 p-6 rounded-2xl border border-blue-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
                <span>🏛️</span> Πώς σχηματίζουμε τους αριθμούς;
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>10 Μονάδες (Μ)</strong> ＝ 1 Δεκάδα (Δ)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>10 Δεκάδες (Δ)</strong> ＝ 1 Εκατοντάδα (Ε)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>10 Εκατοντάδες (Ε)</strong> ＝ 1 Μονάδα Χιλιάδα (Χ) ＝ 1.000</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span><strong>10 Χιλιάδες (Χ)</strong> ＝ 1 Δεκάδα Χιλιάδα (ΔΧ) ＝ 10.000</span>
                </li>
              </ul>
            </div>

            {/* Κάρτα 2: Πώς τους γράφουμε & διαβάζουμε */}
            <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-amber-900 flex items-center gap-2">
                <span>✍️</span> Γραφή και Ανάγνωση
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Χωρίζουμε τις χιλιάδες από τις εκατοντάδες βάζοντας τελεία (π.χ. <strong>14.325</strong>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Όταν διαβάζουμε, ξεκινάμε από τις <strong>Χιλιάδες</strong> και μετά τις <strong>Μονάδες</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Προσοχή: Λέμε «εκατόν πέντε» (105) όταν ακολουθούν άλλοι αριθμοί, αλλά «εκατό» (100) όταν είναι μόνο του.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ΠΙΝΑΚΑΣ ΑΞΙΑΣ ΘΕΣΗΣ - RESPONSIVE SVG (ΧΩΡΙΣ SCROLLBAR) */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200/90 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 text-center sm:text-left">
              📊 Πίνακας Αξίας Θέσης Ψηφίου
            </h3>

            <div className="bg-white p-2 sm:p-4 rounded-2xl border border-slate-200 shadow-inner">
              <svg
                viewBox="0 0 500 130"
                className="w-full h-auto max-w-2xl mx-auto block select-none font-sans"
              >
                {/* Header: Κλάσεις */}
                <rect x="10" y="8" width="190" height="26" rx="6" fill="#4f46e5" />
                <text x="105" y="25" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                  ΚΛΑΣΗ ΧΙΛΙΑΔΩΝ
                </text>

                <rect x="206" y="8" width="284" height="26" rx="6" fill="#0d9488" />
                <text x="348" y="25" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                  ΚΛΑΣΗ ΜΟΝΑΔΩΝ
                </text>

                {/* Subheader: Στήλες (ΔΧ, Χ, Ε, Δ, Μ) */}
                {[
                  { x: 10, w: 92, label: 'Δεκάδες Χιλιάδες', short: 'ΔΧ', bg: '#f1f5f9' },
                  { x: 108, w: 92, label: 'Μονάδες Χιλιάδες', short: 'Χ', bg: '#f1f5f9' },
                  { x: 206, w: 90, label: 'Εκατοντάδες', short: 'Ε', bg: '#f1f5f9' },
                  { x: 302, w: 90, label: 'Δεκάδες', short: 'Δ', bg: '#f1f5f9' },
                  { x: 398, w: 92, label: 'Μονάδες', short: 'Μ', bg: '#f1f5f9' },
                ].map((col) => (
                  <g key={col.short}>
                    <rect x={col.x} y="40" width={col.w} height="32" rx="6" fill={col.bg} stroke="#cbd5e1" strokeWidth="1" />
                    <text x={col.x + col.w / 2} y="54" fill="#334155" fontSize="8.5" fontWeight="700" textAnchor="middle">
                      {col.label}
                    </text>
                    <text x={col.x + col.w / 2} y="66" fill="#0f172a" fontSize="10.5" fontWeight="900" textAnchor="middle">
                      ({col.short})
                    </text>
                  </g>
                ))}

                {/* Ψηφία του Παραδείγματος: 1 4 . 3 2 5 */}
                {[
                  { x: 10, w: 92, val: '1', color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff' },
                  { x: 108, w: 92, val: '4', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
                  { x: 206, w: 90, val: '3', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
                  { x: 302, w: 90, val: '2', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
                  { x: 398, w: 92, val: '5', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
                ].map((col) => (
                  <g key={col.x}>
                    <rect x={col.x} y="78" width={col.w} height="44" rx="8" fill={col.bg} stroke={col.border} strokeWidth="1.5" />
                    <text
                      x={col.x + col.w / 2}
                      y="108"
                      fill={col.color}
                      fontSize="22"
                      fontWeight="900"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {col.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* ΑΝΑΛΥΣΗ ΠΑΡΑΔΕΙΓΜΑΤΟΣ */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm space-y-2">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-wide">
                Παραδειγμα Αναλυσης (14.325)
              </span>
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-slate-900 w-full text-xs sm:text-sm">
                <span>14.325</span>
                <span>＝</span>
                <span>(1 · 10.000)</span>
                <span>＋</span>
                <span>(4 · 1.000)</span>
                <span>＋</span>
                <span>(3 · 100)</span>
                <span>＋</span>
                <span>(2 · 10)</span>
                <span>＋</span>
                <span>(5 · 1)</span>
              </div>
              <p className="text-xs text-slate-600 text-center sm:text-left">
                δηλαδή: <strong>10.000 ＋ 4.000 ＋ 300 ＋ 20 ＋ 5</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟΣ ΑΒΑΚΑΣ - SECTION 2 */}
        <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικός Άβακας Αξίας Θέσης
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Πληκτρολόγησε έναν αριθμό ή επίλεξε τις τιμές των στηλών για να δεις τον σχηματισμό του!
              </p>
            </div>

            <div className="bg-slate-100 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 self-start sm:self-auto">
              Όριο: <span className="text-indigo-600 font-black">20.000</span>
            </div>
          </div>

          {/* ΠΡΟΒΟΛΗ ΑΡΙΘΜΟΥ & ΟΝΟΜΑΣΙΑΣ */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white p-5 sm:p-7 rounded-2xl shadow-md text-center space-y-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-300">
              Ο ΑΡΙΘΜΟΣ ΣΟΥ
            </span>
            <div className="text-4xl sm:text-6xl font-mono font-black tracking-tight text-amber-400">
              {formatNumber(totalNumber)}
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3 py-2.5 rounded-xl border border-white/15 text-xs sm:text-sm font-semibold text-slate-100 max-w-xl mx-auto">
              🗣️ <span className="text-amber-300 font-extrabold capitalize">{numberToGreekWords(totalNumber)}</span>
            </div>
          </div>

          {/* RESPONSIVE SVG ΑΒΑΚΑΣ (0 0 500 235) - ΧΩΡΙΣ SCROLLBAR */}
          <div className="p-2 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-inner">
            <svg
              viewBox="0 0 500 235"
              className="w-full h-auto max-w-2xl mx-auto block select-none font-sans"
            >
              {/* Header: Κλάσεις Αριθμών */}
              <rect x="20" y="10" width="182" height="24" rx="6" fill="#e0e7ff" />
              <text x="111" y="26" fill="#3730a3" fontSize="10.5" fontWeight="800" textAnchor="middle">
                ΚΛΑΣΗ ΧΙΛΙΑΔΩΝ
              </text>

              <rect x="212" y="10" width="268" height="24" rx="6" fill="#ccfbf1" />
              <text x="346" y="26" fill="#115e59" fontSize="10.5" fontWeight="800" textAnchor="middle">
                ΚΛΑΣΗ ΜΟΝΑΔΩΝ
              </text>

              {/* Badges Στηλών */}
              {[
                { x: 65, label: 'ΔΧ', bg: '#f3e8ff', text: '#6b21a8' },
                { x: 157, label: 'Χ', bg: '#e0e7ff', text: '#3730a3' },
                { x: 257, label: 'Ε', bg: '#ccfbf1', text: '#115e59' },
                { x: 347, label: 'Δ', bg: '#fef3c7', text: '#92400e' },
                { x: 437, label: 'Μ', bg: '#dcfce7', text: '#166534' },
              ].map((col) => (
                <g key={col.label}>
                  <rect x={col.x - 26} y="40" width="52" height="20" rx="5" fill={col.bg} />
                  <text x={col.x} y="54" fill={col.text} fontSize="11" fontWeight="800" textAnchor="middle">
                    {col.label}
                  </text>
                </g>
              ))}

              {/* Βάση Άβακα & Ράβδοι */}
              <rect x="20" y="200" width="460" height="8" rx="4" fill="#cbd5e1" />
              {[65, 157, 257, 347, 437].map((xPos) => (
                <line
                  key={xPos}
                  x1={xPos}
                  y1="68"
                  x2={xPos}
                  y2="200"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                  strokeDasharray="4 3"
                />
              ))}

              {/* Χάντρες */}
              {[
                { colKey: 'DX', cx: 65, fill: '#a855f7' },
                { colKey: 'X', cx: 157, fill: '#6366f1' },
                { colKey: 'E', cx: 257, fill: '#14b8a6' },
                { colKey: 'D', cx: 347, fill: '#f59e0b' },
                { colKey: 'M', cx: 437, fill: '#22c55e' },
              ].map(({ colKey, cx, fill }) => {
                const count = disks[colKey];
                return (
                  <g key={colKey}>
                    {Array.from({ length: count }).map((_, idx) => {
                      const cy = 187 - idx * 13;
                      return (
                        <rect
                          key={idx}
                          x={cx - 24}
                          y={cy}
                          width="48"
                          height="11"
                          rx="5.5"
                          fill={fill}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Αριθμητική Τιμή */}
              {[
                { cx: 65, val: disks.DX, color: '#7e22ce' },
                { cx: 157, val: disks.X, color: '#4338ca' },
                { cx: 257, val: disks.E, color: '#0f766e' },
                { cx: 347, val: disks.D, color: '#b45309' },
                { cx: 437, val: disks.M, color: '#15803d' },
              ].map(({ cx, val, color }, i) => (
                <text
                  key={i}
                  x={cx}
                  y="224"
                  fill={color}
                  fontSize="14"
                  fontWeight="900"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {val}
                </text>
              ))}
            </svg>
          </div>

          {/* DROPDOWN PICKERS ΑΝΑ ΣΤΗΛΗ */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
            {columnsList.map((col) => {
              const maxDigit = col.key === 'DX' ? 2 : 9;
              return (
                <div
                  key={col.key}
                  className="flex flex-col items-center bg-slate-50 p-1.5 sm:p-2.5 rounded-2xl border border-slate-200"
                >
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1 text-center truncate w-full">
                    {col.short}
                  </span>

                  <div className="relative w-full">
                    <select
                      value={disks[col.key]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        const updated = { ...disks, [col.key]: val };
                        const nextTotal =
                          updated.DX * 10000 +
                          updated.X * 1000 +
                          updated.E * 100 +
                          updated.D * 10 +
                          updated.M;
                        
                        // Αν υπερβαίνει το 20.000 δεν αλλάζει τίποτα
                        if (nextTotal > 20000) return;
                        setDisks(updated);
                      }}
                      className="w-full bg-white border border-slate-300 font-mono font-black text-slate-800 text-xs sm:text-sm py-1.5 px-1 rounded-xl text-center appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
                    >
                      {Array.from({ length: maxDigit + 1 }).map((_, n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {/* NUMERIC INPUT & PRESETS */}
          <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 shrink-0">✍️ Αριθμός:</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  id="direct-number-input"
                  name="direct-number-input"
                  placeholder="π.χ. 14325"
                  value={totalNumber === 0 ? '' : totalNumber}
                  onChange={handleDirectInputChange}
                  className="w-32 bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>

              {/* Γρήγορα Παραδείγματα (Quick Presets) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[2500, 10450, 14325, 20000].map((preset) => (
                  <button
                    key={preset}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      applyNumber(preset);
                    }}
                    className="text-[11px] font-bold bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 px-2.5 py-1 rounded-lg transition shrink-0 active:scale-95 shadow-sm"
                  >
                    {formatNumber(preset)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ΑΝΑΛΥΤΙΚΗ ΜΟΡΦΗ ΤΟΥ ΑΡΙΘΜΟΥ */}
          <div className="bg-slate-100 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              ΑΝΑΛΥΤΙΚΗ ΜΟΡΦΗ ΤΟΥ ΑΡΙΘΜΟΥ:
            </span>
            <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-1.5 leading-relaxed break-words px-3 py-2 font-mono text-xs sm:text-sm md:text-base font-bold text-slate-800 w-full">
              <span className="bg-purple-100 text-purple-900 px-2.5 py-1 rounded-lg border border-purple-200">
                {disks.DX * 10000}
              </span>
              <span>＋</span>
              <span className="bg-indigo-100 text-indigo-900 px-2.5 py-1 rounded-lg border border-indigo-200">
                {disks.X * 1000}
              </span>
              <span>＋</span>
              <span className="bg-teal-100 text-teal-900 px-2.5 py-1 rounded-lg border border-teal-200">
                {disks.E * 100}
              </span>
              <span>＋</span>
              <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                {disks.D * 10}
              </span>
              <span>＋</span>
              <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200">
                {disks.M}
              </span>
              <span>＝</span>
              <span className="bg-slate-900 text-amber-400 px-3 py-1 rounded-lg font-black">
                {formatNumber(totalNumber)}
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Ολοκλήρωσες τη θεωρία; Κάνε τις διαδραστικές ασκήσεις για να δοκιμάσεις τις γνώσεις σου!
            </p>
          </div>
          <Link
            href="/d-dimotikou/1-arithmoi-eos-20-xiliades-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
