// pages/d-dimotikou/1-megaloi-arithmoi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const CONFIG = {
  maxDisksPerColumn: 9,
  initialValues: {
    EX: 1, DX: 3, X: 5, E: 4, D: 2, M: 7
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

  const updateDigits = (column, increment) => {
    setDisks((prev) => {
      let newValue = prev[column] + increment;
      if (newValue < 0) newValue = 0;
      if (newValue > CONFIG.maxDisksPerColumn) newValue = CONFIG.maxDisksPerColumn;
      return { ...prev, [column]: newValue };
    });
  };

  const totalNumber = disks.EX * 100000 + disks.DX * 10000 + disks.X * 1000 + disks.E * 100 + disks.D * 10 + disks.M * 1;
  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const columnsList = [
    { key: 'EX', label: 'Εκατοντάδες Χιλιάδες', short: 'ΕΧ' },
    { key: 'DX', label: 'Δεκάδες Χιλιάδες', short: 'ΔΧ' },
    { key: 'X', label: 'Μονάδες Χιλιάδες', short: 'Χ' },
    { key: 'E', label: 'Εκατοντάδες', short: 'Ε' },
    { key: 'D', label: 'Δεκάδες', short: 'Δ' },
    { key: 'M', label: 'Μονάδες', short: 'Μ' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>💎 Μεγάλοι Αριθμοί - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
      {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/d-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12`}>
          <div className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            
            {/* ΘΕΩΡΙΑ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">💎 Μεγάλοι Αριθμοί</h2>
                <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                  Στο δεκαδικό σύστημα αρίθμησης, η <strong>αξία κάθε ψηφίου</strong> εξαρτάται από τη <strong>θέση</strong> που κατέχει στον αριθμό.
                </p>
                <div className="bg-teal-50 p-5 rounded-2xl border border-teal-100 text-sm xl:text-base text-teal-900 space-y-2 shadow-inner">
                  <p>🏛️ <strong>Κλάση Χιλιάδων:</strong> Εκατοντάδες Χιλιάδες (ΕΧ), Δεκάδες Χιλιάδες (ΔΧ), Χιλιάδες (Χ).</p>
                  <p>🏠 <strong>Κλάση Μονάδων:</strong> Εκατοντάδες (Ε), Δεκάδες (Δ), Μονάδες (Μ).</p>
                </div>
              </div>

              {/* ΠΡΟΒΟΛΗ ΑΡΙΘΜΟΥ & ΟΝΟΜΑΣΙΑΣ */}
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-8 rounded-2xl shadow-md text-center py-10 space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-teal-200">Ο Αριθμός σου</span>
                <div className="text-4xl xl:text-5xl font-mono font-black tracking-tight text-white">
                  {formatNumber(totalNumber)}
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-sm xl:text-base font-bold text-teal-50 leading-relaxed">
                  🗣️ <span className="text-amber-300 font-extrabold capitalize">{numberToGreekWords(totalNumber)}</span>
                </div>
              </div>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟΣ ΑΒΑΚΑΣ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-6">
              <h3 className="text-xl font-black text-center text-gray-800 xl:text-2xl">🧮 Διαδραστικός Άβακας Αξίας Θέσης</h3>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
                <div className="min-w-[620px]">
                  
                  {/* ΚΛΑΣΕΙΣ */}
                  <div className="grid grid-cols-6 gap-2 text-center font-bold text-xs mb-3">
                    <div className="col-span-3 bg-emerald-100 text-emerald-800 py-1.5 rounded-t-xl border-b-2 border-emerald-400 font-black">
                      ΚΛΑΣΗ ΧΙΛΙΑΔΩΝ
                    </div>
                    <div className="col-span-3 bg-teal-100 text-teal-800 py-1.5 rounded-t-xl border-b-2 border-teal-400 font-black">
                      ΚΛΑΣΗ ΜΟΝΑΔΩΝ
                    </div>
                  </div>

                  {/* ΣΥΝΤΟΜΟΓΡΑΦΙΕΣ */}
                  <div className="grid grid-cols-6 gap-2 text-center text-xs font-black text-gray-500 font-mono mb-4">
                    {columnsList.map((col) => (
                      <div key={col.key} className="bg-slate-100 py-1.5 rounded-lg border border-slate-200">
                        {col.short}
                      </div>
                    ))}
                  </div>

                  {/* ΧΩΡΟΣ ΣΧΕΔΙΑΣΗΣ ΔΙΣΚΩΝ */}
                  <div className="grid grid-cols-6 gap-4 h-56 bg-slate-50 rounded-2xl border border-slate-200 p-4 items-end mb-6">
                    {columnsList.map((col) => (
                      <div key={col.key} className="flex flex-col-reverse items-center h-full justify-start gap-1 relative border-r border-dashed border-slate-300 last:border-0">
                        {Array.from({ length: disks[col.key] }).map((_, i) => (
                          <div key={i} className="w-10 h-3.5 bg-teal-500 rounded-full border border-teal-600 shadow-sm transition-all"></div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* ΧΕΙΡΙΣΤΗΡΙΑ (+ / -) */}
                  <div className="grid grid-cols-6 gap-3 text-center">
                    {columnsList.map((col) => (
                      <div key={col.key} className="flex flex-col items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-lg font-black font-mono text-slate-800">{disks[col.key]}</span>
                        <div className="flex gap-1.5 w-full justify-center">
                          <button 
                            onClick={() => updateDigits(col.key, -1)} 
                            className="bg-red-500 hover:bg-red-600 text-white font-black text-sm w-8 h-8 rounded-lg shadow-sm transition flex items-center justify-center"
                          >
                            -
                          </button>
                          <button 
                            onClick={() => updateDigits(col.key, 1)} 
                            className="bg-green-500 hover:bg-green-600 text-white font-black text-sm w-8 h-8 rounded-lg shadow-sm transition flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>

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
