import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const CONFIG = {
  initialValues: {
    DX: 1, X: 4, E: 3, D: 2, M: 5
  }
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
    'δεκαοκτώ χιλιάδες', 'δεκαεννέα χιλιάδες', 'είκοσι χιλιάδες'
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

  const updateDigits = (column, increment) => {
    setDisks((prev) => {
      let newValue = prev[column] + increment;
      if (newValue < 0) newValue = 0;
      if (column === 'DX' && newValue > 2) newValue = 2;
      if (column !== 'DX' && newValue > 9) newValue = 9;

      const nextDisks = { ...prev, [column]: newValue };
      const nextTotal = nextDisks.DX * 10000 + nextDisks.X * 1000 + nextDisks.E * 100 + nextDisks.D * 10 + nextDisks.M;
      
      // Όριο μέχρι το 20.000
      if (nextTotal > 20000) return prev;
      return nextDisks;
    });
  };

  const totalNumber = disks.DX * 10000 + disks.X * 1000 + disks.E * 100 + disks.D * 10 + disks.M;
  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const columnsList = [
    { key: 'DX', label: 'Δεκάδες Χιλιάδες', short: 'ΔΧ', color: 'bg-purple-500', textColor: 'text-purple-800', lightBg: 'bg-purple-100' },
    { key: 'X', label: 'Μονάδες Χιλιάδες', short: 'Χ', color: 'bg-indigo-500', textColor: 'text-indigo-800', lightBg: 'bg-indigo-100' },
    { key: 'E', label: 'Εκατοντάδες', short: 'Ε', color: 'bg-teal-500', textColor: 'text-teal-800', lightBg: 'bg-teal-100' },
    { key: 'D', label: 'Δεκάδες', short: 'Δ', color: 'bg-amber-500', textColor: 'text-amber-800', lightBg: 'bg-amber-100' },
    { key: 'M', label: 'Μονάδες', short: 'Μ', color: 'bg-emerald-500', textColor: 'text-emerald-800', lightBg: 'bg-emerald-100' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🎯 Αριθμοί έως το 20.000 - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/1-arithmoi-eos-20-xiliades-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 1
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  🔢 Αριθμοί έως το 20.000
                </h1>
                <p className="text-blue-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε να διαβάζουμε, να γράφουμε και να αναλύουμε αριθμούς από το <strong>0 έως το 20.000</strong>!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-blue-100">Δοκίμασε τις ασκήσεις της ενότητας για να σιγουρευτείς ότι τα έμαθες όλα!</p>
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
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <div className="border-b pb-4 border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span>📖</span> Αναλυτική Θεωρία & Κανόνες
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Κάρτα 1: Πώς σχηματίζονται */}
              <div className="bg-blue-50/60 p-6 rounded-2xl border border-blue-100 space-y-3">
                <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                  <span>🏛️</span> Πώς σχηματίζουμε τους αριθμούς;
                </h3>
                <ul className="space-y-2 text-sm md:text-base text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong>10 Μονάδες (Μ)</strong> = 1 Δεκάδα (Δ)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong>10 Δεκάδες (Δ)</strong> = 1 Εκατοντάδα (Ε)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong>10 Εκατοντάδες (Ε)</strong> = 1 Μονάδα Χιλιάδα (Χ) = 1.000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span><strong>10 Χιλιάδες (Χ)</strong> = 1 Δεκάδα Χιλιάδα (ΔΧ) = 10.000</span>
                  </li>
                </ul>
              </div>

              {/* Κάρτα 2: Πώς τους γράφουμε & διαβάζουμε */}
              <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-100 space-y-3">
                <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                  <span>✍️</span> Γραφή & Ανάγνωση
                </h3>
                <ul className="space-y-2 text-sm md:text-base text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Χωρίζουμε τις χιλιάδες από τις εκατοντάδες βάζοντας **τελεία** (π.χ. <strong>14.325</strong>).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Όταν διαβάζουμε, ξεκινάμε από τις <strong>Χιλιάδες</strong> και μετά τις <strong>Μονάδες</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Προσοχή: Λέμε *«εκατόν πέντε»* (105) όταν ακολουθούν άλλοι αριθμοί, αλλά *«εκατό»* (100) όταν είναι μόνο του.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* ΠΙΝΑΚΑΣ ΑΞΙΑΣ ΘΕΣΗΣ */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-800 text-center md:text-left">
                📊 Πίνακας Αξίας Θέσης Ψηφίου
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="text-white font-bold">
                      <th colSpan="2" className="bg-indigo-600 p-2.5 rounded-tl-xl border-r border-indigo-500">
                        ΚΛΑΣΗ ΧΙΛΙΑΔΩΝ
                      </th>
                      <th colSpan="3" className="bg-teal-600 p-2.5 rounded-tr-xl">
                        ΚΛΑΣΗ ΜΟΝΑΔΩΝ
                      </th>
                    </tr>
                    <tr className="bg-gray-200 text-gray-700 font-black">
                      <th className="p-2 border border-gray-300">Δεκάδες Χιλιάδες (ΔΧ)</th>
                      <th className="p-2 border border-gray-300">Μονάδες Χιλιάδες (Χ)</th>
                      <th className="p-2 border border-gray-300">Εκατοντάδες (Ε)</th>
                      <th className="p-2 border border-gray-300">Δεκάδες (Δ)</th>
                      <th className="p-2 border border-gray-300">Μονάδες (Μ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white font-mono font-black text-base text-gray-800">
                      <td className="p-3 border border-gray-200 text-purple-600">1</td>
                      <td className="p-3 border border-gray-200 text-indigo-600">4</td>
                      <td className="p-3 border border-gray-200 text-teal-600">3</td>
                      <td className="p-3 border border-gray-200 text-amber-600">2</td>
                      <td className="p-3 border border-gray-200 text-emerald-600">5</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ΑΝΑΛΥΣΗ ΠΑΡΑΔΕΙΓΜΑΤΟΣ */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm md:text-base space-y-1">
                <span className="text-gray-500 font-bold uppercase text-xs">Παράδειγμα Ανάλυσης</span>
                <p className="font-mono text-gray-800 font-bold">
                  14.325 = (1 × 10.000) + (4 × 1.000) + (3 × 100) + (2 × 10) + (5 × 1)
                </p>
                <p className="text-xs text-gray-600">
                  δηλαδή: <strong>10.000 + 4.000 + 300 + 20 + 5</strong>
                </p>
              </div>
            </div>
          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟΣ ΑΒΑΚΑΣ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικός Άβακας Αξίας Θέσης
                </h2>
                <p className="text-gray-500 text-sm">
                  Πάτα τα κουμπιά **+** και **-** για να αλλάξεις τις χάντρες και να φτιάξεις τον αριθμό σου!
                </p>
              </div>

              <div className="bg-gray-100 px-4 py-2 rounded-xl text-xs font-bold text-gray-600">
                Μέγιστο Όριο: <span className="text-indigo-600 font-black">20.000</span>
              </div>
            </div>

            {/* ΠΡΟΒΟΛΗ ΑΡΙΘΜΟΥ & ΟΝΟΜΑΣΙΑΣ */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 text-white p-6 md:p-8 rounded-2xl shadow-md text-center space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-300">
                Ο Αριθμός σου
              </span>
              <div className="text-4xl md:text-6xl font-mono font-black tracking-tight text-amber-400">
                {formatNumber(totalNumber)}
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-sm md:text-base font-bold text-slate-100">
                🗣️ <span className="text-amber-300 font-extrabold capitalize">{numberToGreekWords(totalNumber)}</span>
              </div>
            </div>

            {/* ΣΧΕΔΙΑΣΜΟΣ ΑΒΑΚΑ */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 overflow-x-auto">
              <div className="min-w-[650px] space-y-4">
                
                {/* ΚΛΑΣΕΙΣ OVERHEAD BADGES */}
                <div className="grid grid-cols-5 gap-2 text-center font-bold text-xs">
                  <div className="col-span-2 bg-indigo-100 text-indigo-900 py-1.5 rounded-t-xl font-black border-b-2 border-indigo-400">
                    ΚΛΑΣΗ ΧΙΛΙΑΔΩΝ
                  </div>
                  <div className="col-span-3 bg-teal-100 text-teal-900 py-1.5 rounded-t-xl font-black border-b-2 border-teal-400">
                    ΚΛΑΣΗ ΜΟΝΑΔΩΝ
                  </div>
                </div>

                {/* ΣΤΗΛΕΣ ΣΥΝΤΟΜΟΓΡΑΦΙΩΝ */}
                <div className="grid grid-cols-5 gap-2 text-center text-xs font-black font-mono">
                  {columnsList.map((col) => (
                    <div key={col.key} className={`${col.lightBg} ${col.textColor} py-1.5 rounded-lg border border-gray-200`}>
                      {col.short}
                    </div>
                  ))}
                </div>

                {/* ΠΕΡΙΟΧΗ ΧΑΝΤΡΩΝ (DISKS) */}
                <div className="grid grid-cols-5 gap-4 h-64 bg-white rounded-2xl border border-slate-200 p-4 items-end shadow-inner">
                  {columnsList.map((col) => (
                    <div key={col.key} className="flex flex-col-reverse items-center h-full justify-start gap-1 relative border-r border-dashed border-slate-200 last:border-0 pt-2">
                      {Array.from({ length: disks[col.key] }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-12 h-4 ${col.color} rounded-full border border-black/10 shadow-sm transition-all transform hover:scale-105`}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* ΧΕΙΡΙΣΤΗΡΙΑ ΚΟΥΜΠΙΩΝ */}
                <div className="grid grid-cols-5 gap-3 text-center">
                  {columnsList.map((col) => (
                    <div key={col.key} className="flex flex-col items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-xl font-black font-mono text-slate-800">{disks[col.key]}</span>
                      <div className="flex gap-1.5 w-full justify-center">
                        <button 
                          onClick={() => updateDigits(col.key, -1)} 
                          className="bg-red-500 hover:bg-red-600 text-white font-black text-base w-8 h-8 rounded-lg shadow-sm transition flex items-center justify-center active:scale-95"
                          title="Αφαίρεση"
                        >
                          -
                        </button>
                        <button 
                          onClick={() => updateDigits(col.key, 1)} 
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base w-8 h-8 rounded-lg shadow-sm transition flex items-center justify-center active:scale-95"
                          title="Προσθήκη"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* ΑΝΑΛΥΤΙΚΗ ΜΟΡΦΗ ΤΟΥ ΑΡΙΘΜΟΥ ΣΤΟΝ ΑΒΑΚΑ */}
            <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Αναλυτική Μορφή του Αριθμού:
              </span>
              <div className="flex flex-wrap items-center gap-2 font-mono text-sm md:text-base font-bold text-slate-800">
                <span className="bg-purple-100 text-purple-900 px-3 py-1 rounded-lg border border-purple-200">
                  {disks.DX * 10000}
                </span>
                <span>+</span>
                <span className="bg-indigo-100 text-indigo-900 px-3 py-1 rounded-lg border border-indigo-200">
                  {disks.X * 1000}
                </span>
                <span>+</span>
                <span className="bg-teal-100 text-teal-900 px-3 py-1 rounded-lg border border-teal-200">
                  {disks.E * 100}
                </span>
                <span>+</span>
                <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-lg border border-amber-200">
                  {disks.D * 10}
                </span>
                <span>+</span>
                <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-lg border border-emerald-200">
                  {disks.M}
                </span>
                <span>=</span>
                <span className="bg-slate-900 text-amber-400 px-3 py-1 rounded-lg font-black">
                  {formatNumber(totalNumber)}
                </span>
              </div>
            </div>

          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Ολοκλήρωσες τη θεωρία; Κάνε τις διαδραστικές ασκήσεις για να δοκιμάσεις τις γνώσεις σου!
              </p>
            </div>
            <Link
              href="/d-dimotikou/1-arithmoi-eos-20-xiliades-ask"
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
