// pages/d-dimotikou/12-diairesi-deka-ekato-xilia.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function Diairesi101001000TheoryPage() {
  const [numInput, setNumInput] = useState('450');
  const [operation, setModeOperation] = useState('div'); // 'div' (:) ή 'mul' (·)
  const [factor, setFactor] = useState(10); // 10, 100, 1000

  // Χειρισμός εισαγωγής με περιορισμό έως 10 ψηφία
  const handleInputChange = (e) => {
    const val = e.target.value.replace('.', ',').replace(/[^0-9,]/g, '');
    const digitsOnly = val.replace(/[^0-9]/g, '');

    if (digitsOnly.length <= 10) {
      setNumInput(val);
    }
  };

  const numericVal = parseFloat(numInput.replace(',', '.')) || 0;

  // Υπολογισμός αποτελέσματος
  let result = 0;
  if (operation === 'div') {
    result = numericVal / factor;
  } else {
    result = numericVal * factor;
  }

  // Αριθμός θέσεων μετακίνησης υποδιαστολής
  const shiftPositions = factor === 10 ? 1 : factor === 100 ? 2 : 3;
  const direction = operation === 'div' ? 'αριστερά' : 'δεξιά';
  const arrowEmoji = operation === 'div' ? '⬅️' : '➡️';

  const handleRandomize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isDecimal = Math.random() > 0.5;
    let randVal;
    if (isDecimal) {
      randVal = (Math.random() * 450 + 1).toFixed(getRandomInt(1, 2));
    } else {
      randVal = getRandomInt(1, 95) * (Math.random() > 0.5 ? 100 : 10);
    }
    const factors = [10, 100, 1000];
    setNumInput(randVal.toString().replace('.', ','));
    setFactor(factors[getRandomInt(0, 2)]);
    setModeOperation(Math.random() > 0.5 ? 'div' : 'mul');
  };

  const handleDelta = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    const current = parseFloat(numInput.replace(',', '.')) || 0;
    const nextVal = Math.max(0.1, current + delta);
    setNumInput(Number(nextVal.toFixed(2)).toString().replace('.', ','));
  };

  // Μορφοποίηση εμφάνισης αποτελέσματος
  const formattedResult = Number(result.toFixed(4)).toString().replace('.', ',');

  return (
    <Layout
      title="Διαίρεση και Πολλαπλασιασμός με 10, 100, 1.000 - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε τον κανόνα μετακίνησης της υποδιαστολής στον πολλαπλασιασμό (δεξιά) και στη διαίρεση (αριστερά) με 10, 100, 1.000 με διαδραστικό εργαστήριο."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/12-diairesi-deka-ekato-xilia-ask"
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
                ⚡ Διαίρεση & Πολλαπλασιασμός με 10, 100, 1.000
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε τον χρυσό κανόνα της μετακίνησης της υποδιαστολής: αριστερά στη διαίρεση και δεξιά στον πολλαπλασιασμό!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-blue-100">
                Δοκίμασε τις ασκήσεις στους νοερούς υπολογισμούς με 10, 100 και 1.000 για να σιγουρευτείς ότι τα έμαθες!
              </p>
              <Link
                href="/d-dimotikou/12-diairesi-deka-ekato-xilia-ask"
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
              <span>📖</span> Ο Χρυσός Κανόνας της Υποδιαστολής
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. ΔΙΑΙΡΕΣΗ (: 10, : 100, : 1000) */}
            <div className="bg-rose-50/70 p-5 sm:p-6 rounded-2xl border border-rose-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-rose-900 flex items-center gap-2">
                <span>⬅️</span> Διαίρεση ( ：10,  ：100,  ：1.000 )
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Στη διαίρεση ο αριθμός <strong>μικραίνει</strong>, επομένως μετακινούμε την υποδιαστολή προς τα <strong>ΑΡΙΣΤΕΡΑ</strong> τόσες θέσεις όσα είναι τα μηδενικά:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm font-mono font-bold text-slate-800">
                <li className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-sm">
                  • ：10 ➔ 1 θέση αριστερά (π.χ. 45 ： 10 ＝ 4,5)
                </li>
                <li className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-sm">
                  • ：100 ➔ 2 θέσεις αριστερά (π.χ. 45 ： 100 ＝ 0,45)
                </li>
                <li className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-sm">
                  • ：1.000 ➔ 3 θέσεις αριστερά (π.χ. 45 ： 1.000 ＝ 0,045)
                </li>
              </ul>
            </div>

            {/* 2. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ (· 10, · 100, · 1000) */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>➡️</span> Πολλαπλασιασμός ( · 10,  · 100,  · 1.000 )
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Στον πολλαπλασιασμό ο αριθμός <strong>μεγαλώνει</strong>, επομένως μετακινούμε την υποδιαστολή προς τα <strong>ΔΕΞΙΑ</strong> τόσες θέσεις όσα είναι τα μηδενικά:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm font-mono font-bold text-slate-800">
                <li className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-sm">
                  • · 10 ➔ 1 θέση δεξιά (π.χ. 3,5 · 10 ＝ 35)
                </li>
                <li className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-sm">
                  • · 100 ➔ 2 θέσεις δεξιά (π.χ. 3,5 · 100 ＝ 350)
                </li>
                <li className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-sm">
                  • · 1.000 ➔ 3 θέσεις δεξιά (π.χ. 3,5 · 1.000 ＝ 3.500)
                </li>
              </ul>
            </div>
          </div>

          {/* ΣΥΝΤΟΜΟ TIP ΓΙΑ ΑΚΕΡΑΙΟΥΣ */}
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-1">
            <span className="font-black uppercase text-amber-900 block">
              💡 Τι κάνουμε όταν ο αριθμός είναι ακέραιος;
            </span>
            <p className="leading-relaxed">
              Στους ακέραιους αριθμούς (π.χ. 450), θεωρούμε ότι η υποδιαστολή βρίσκεται πάντοτε «κρυμμένη» στο τέλος τους (450,). Όταν διαιρούμε με το 10, το 100 ή το 1.000, η υποδιαστολή εμφανίζεται και μετακινείται προς τα αριστερά, ενώ αν λείπουν ψηφία συμπληρώνουμε με μηδενικά!
            </p>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικό Εργαστήριο Υποδιαστολής
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Πληκτρολόγησε έναν αριθμό (έως 10 ψηφία), επίλεξε πράξη και συντελεστή και δες ζωντανά τη μετακίνηση!
              </p>
            </div>

            <button
              onClick={handleRandomize}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto active:scale-95 touch-manipulation"
            >
              <span>🎲</span> Τυχαία Πράξη
            </button>
          </div>

          {/* INPUTS / ΕΠΙΛΟΓΕΣ (ΚΑΝΟΝΑΣ 2) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
            {/* 1. Αριθμός (με όριο 10 ψηφία & Steppers) */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">ΑΡΙΘΜΟΣ</span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                  {numInput}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => handleDelta(e, -1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="Μείωση κατά 1"
                  aria-label="Μείωση αριθμού"
                >
                  －
                </button>

                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  id="calc-num-input"
                  name="calc-num-input"
                  value={numInput}
                  onChange={handleInputChange}
                  className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="π.χ. 450"
                />

                <button
                  onClick={(e) => handleDelta(e, 1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="Αύξηση κατά 1"
                  aria-label="Αύξηση αριθμού"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* 2. Πράξη */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-center text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">ΠΡΑΞΗ</span>
              </div>

              <div className="grid grid-cols-2 gap-2 h-11 items-center">
                <button
                  onClick={() => setModeOperation('div')}
                  className={`h-11 rounded-xl font-mono font-black text-sm sm:text-base transition flex items-center justify-center select-none touch-manipulation active:scale-95 ${
                    operation === 'div'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ： (Διαίρεση)
                </button>
                <button
                  onClick={() => setModeOperation('mul')}
                  className={`h-11 rounded-xl font-mono font-black text-sm sm:text-base transition flex items-center justify-center select-none touch-manipulation active:scale-95 ${
                    operation === 'mul'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  · (Πολλαπλ.)
                </button>
              </div>
            </div>

            {/* 3. Παράγοντας (10, 100, 1.000) */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-center text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">ΜΕ ΠΟΣΟ;</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 h-11 items-center">
                {[10, 100, 1000].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFactor(f)}
                    className={`h-11 rounded-xl font-mono font-black text-xs sm:text-sm transition flex items-center justify-center select-none touch-manipulation active:scale-95 ${
                      factor === f
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {formatNumber(f)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ΠΡΟΒΟΛΗ ΑΠΟΤΕΛΕΣΜΑΤΟΣ & ΕΠΕΞΗΓΗΣΗ */}
          <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl text-center space-y-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
              Η ΠΡΑΞΗ ΣΟΥ:
            </span>

            <div className="font-mono font-black text-2xl sm:text-4xl lg:text-5xl text-amber-400 py-1 break-words">
              <span>{numInput}</span>
              <span className="text-slate-400 mx-2">{operation === 'div' ? '：' : '·'}</span>
              <span>{formatNumber(factor)}</span>
              <span className="text-slate-400 mx-2">＝</span>
              <span className="text-emerald-400">{formattedResult}</span>
            </div>

            {/* Επεξήγηση Μετακίνησης */}
            <div className="inline-flex items-center gap-2 bg-slate-900 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border border-slate-800 text-xs sm:text-sm font-bold text-slate-200 shadow-inner">
              <span className="text-lg">{arrowEmoji}</span>
              <span>
                Η υποδιαστολή μετακινήθηκε <strong className="text-indigo-400 font-black">{shiftPositions} {shiftPositions === 1 ? 'θέση' : 'θέσεις'}</strong> προς τα <strong className="text-amber-300 font-black">{direction}</strong>!
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες τη μετακίνηση της υποδιαστολής; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/12-diairesi-deka-ekato-xilia-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
