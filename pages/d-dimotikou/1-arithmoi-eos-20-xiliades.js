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

  const updateDigits = (e, column, increment) => {
    e.preventDefault();
    e.stopPropagation();

    setDisks((prev) => {
      let newValue = prev[column] + increment;
      if (newValue < 0) newValue = 0;
      if (column === 'DX' && newValue > 2) newValue = 2;
      if (column !== 'DX' && newValue > 9) newValue = 9;

      const nextDisks = { ...prev, [column]: newValue };
      const nextTotal =
        nextDisks.DX * 10000 +
        nextDisks.X * 1000 +
        nextDisks.E * 100 +
        nextDisks.D * 10 +
        nextDisks.M;

      if (nextTotal > 20000) return prev;
      return nextDisks;
    });
  };

  const totalNumber =
    disks.DX * 10000 + disks.X * 1000 + disks.E * 100 + disks.D * 10 + disks.M;

  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

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

          {/* ΠΙΝΑΚΑΣ ΑΞΙΑΣ ΘΕΣΗΣ */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 text-center md:text-left">
              📊 Πίνακας Αξίας Θέσης Ψηφίου
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="text-white font-bold">
                    <th colSpan={2} className="bg-indigo-600 p-2.5 rounded-tl-xl border-r border-indigo-500">
                      ΚΛΑΣΗ ΧΙΛΙΑΔΩΝ
                    </th>
                    <th colSpan={3} className="bg-teal-600 p-2.5 rounded-tr-xl">
                      ΚΛΑΣΗ ΜΟΝΑΔΩΝ
                    </th>
                  </tr>
                  <tr className="bg-slate-200 text-slate-700 font-black">
                    <th className="p-2 border border-slate-300">Δεκάδες Χιλιάδες (ΔΧ)</th>
                    <th className="p-2 border border-slate-300">Μονάδες Χιλιάδες (Χ)</th>
                    <th className="p-2 border border-slate-300">Εκατοντάδες (Ε)</th>
                    <th className="p-2 border border-slate-300">Δεκάδες (Δ)</th>
                    <th className="p-2 border border-slate-300">Μονάδες (Μ)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white font-mono font-black text-base text-slate-800">
                    <td className="p-3 border border-slate-200 text-purple-600">1</td>
                    <td className="p-3 border border-slate-200 text-indigo-600">4</td>
                    <td className="p-3 border border-slate-200 text-teal-600">3</td>
                    <td className="p-3 border border-slate-200 text-amber-600">2</td>
                    <td className="p-3 border border-slate-200 text-emerald-600">5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ΑΝΑΛΥΣΗ ΠΑΡΑΔΕΙΓΜΑΤΟΣ */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm space-y-2">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-wide">
                Παραδειγμα Αναλυσης
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
        Αυξομείωσε τις χάντρες σε κάθε στήλη για να συνθέσεις τον αριθμό!
      </p>
    </div>

    <div className="bg-slate-100 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 self-start sm:self-auto">
      Μέγιστο: <span className="text-indigo-600 font-black">20.000</span>
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

  {/* RESPONSIVE SVG CONTAINER - ΑΥΤΟΜΑΤΟ SCALING ΧΩΡΙΣ SCROLL */}
  <div className="p-2 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-inner">
    <svg
      viewBox="0 0 500 235"
      className="w-full h-auto max-w-2xl mx-auto block select-none font-sans"
    >
      {/* 1. Header: Κλάσεις Αριθμών */}
      {/* Κλάση Χιλιάδων: x=20 έως x=200 (πλάτος 180) */}
      <rect x="20" y="10" width="182" height="24" rx="6" fill="#e0e7ff" />
      <text x="111" y="26" fill="#3730a3" fontSize="10.5" fontWeight="800" textAnchor="middle">
        ΚΛΑΣΗ ΧΙΛΙΑΔΩΝ
      </text>

      {/* Κλάση Μονάδων: x=212 έως x=480 (πλάτος 268) */}
      <rect x="212" y="10" width="268" height="24" rx="6" fill="#ccfbf1" />
      <text x="346" y="26" fill="#115e59" fontSize="10.5" fontWeight="800" textAnchor="middle">
        ΚΛΑΣΗ ΜΟΝΑΔΩΝ
      </text>

      {/* 2. Badges Στηλών (ΔΧ, Χ, Ε, Δ, Μ) */}
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

      {/* 3. Βάση Άβακα & Κάθετες Ράβδοι */}
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

      {/* 4. Χάντρες (Disks) ανά στήλη */}
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
              // Κάθε χάντρα έχει ύψος 10px, κενό 3px και στοιβάζονται από κάτω (y=187) προς τα πάνω
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

      {/* 5. Ένδειξη τρέχουσας τιμής κάτω από τη βάση */}
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

  {/* COMPACT & BALANCED TOUCH CONTROLS */}
  <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
    {columnsList.map((col) => (
      <div
        key={col.key}
        className="flex flex-col items-center justify-between bg-slate-50 p-1.5 sm:p-2.5 rounded-2xl border border-slate-200"
      >
        {/* Ετικέτα */}
        <div className="h-7 sm:h-8 flex items-center justify-center text-center text-[10px] sm:text-xs font-bold text-slate-600 leading-tight">
          <span className="truncate">{col.label.split(' ')[0]}</span>
        </div>

        {/* Compact Stepper (30px-1fr-30px σε mobile) */}
        <div className="flex items-center justify-between w-full bg-white rounded-xl p-1 border border-slate-200/90 shadow-sm">
          <button
            onClick={(e) => updateDigits(e, col.key, -1)}
            className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-600 active:bg-rose-200 font-black text-sm sm:text-base rounded-lg transition active:scale-90"
            title="Αφαίρεση"
            aria-label={`Αφαίρεση από ${col.label}`}
          >
            －
          </button>

          <span className="font-mono font-black text-slate-800 text-xs sm:text-sm select-none px-0.5">
            {disks[col.key]}
          </span>

          <button
            onClick={(e) => updateDigits(e, col.key, 1)}
            className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-600 active:bg-emerald-200 font-black text-sm sm:text-base rounded-lg transition active:scale-90"
            title="Προσθήκη"
            aria-label={`Προσθήκη σε ${col.label}`}
          >
            ＋
          </button>
        </div>
      </div>
    ))}
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
