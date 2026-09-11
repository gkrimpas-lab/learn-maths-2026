// pages/d-dimotikou/22-diairesi-2-psifia.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Diairesi2PsifiaPage() {
  const [dividend, setDividend] = useState(1568); // Διαιρετέος (Δ)
  const [divisor, setDivisor] = useState(24);     // Διαιρέτης (δ) (10 - 99)

  const D = typeof dividend === 'number' ? dividend : 0;
  const d = typeof divisor === 'number' && divisor >= 10 ? divisor : 10;

  // Υπολογισμοί διαίρεσης
  const q = Math.floor(D / d);
  const r = D % d;
  const isExact = r === 0;

  // Τυχαίος Τριψήφιος / Διψήφιο
  const handleRandomize3Digit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDividend(getRandomInt(120, 999));
    setDivisor(getRandomInt(11, 45));
  };

  // Τυχαίος Τετραψήφιος / Διψήφιο
  const handleRandomize4Digit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDividend(getRandomInt(1050, 9990));
    setDivisor(getRandomInt(12, 85));
  };

  // Τυχαία Τέλεια Διαίρεση (υ = 0)
  const handleRandomizeExact = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const randomDivisor = getRandomInt(12, 65);
    const randomQuotient = getRandomInt(15, 120);
    setDivisor(randomDivisor);
    setDividend(randomDivisor * randomQuotient);
  };

  const updateDividend = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setDividend((prev) => Math.max(100, Math.min(9999, (Number(prev) || 100) + delta)));
  };

  const updateDivisor = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setDivisor((prev) => Math.max(10, Math.min(99, (Number(prev) || 10) + delta)));
  };

  // Παραγωγή των αναλυτικών σχολικών βημάτων για το γραφικό της κάθετης διαίρεσης
  const generateSchoolSteps = () => {
    if (D === 0 || d === 0) return [];

    const steps = [];
    const divStr = D.toString();
    let currentVal = 0;

    for (let i = 0; i < divStr.length; i++) {
      const nextDigit = parseInt(divStr[i], 10);
      currentVal = currentVal * 10 + nextDigit;

      if (currentVal >= d || i === divStr.length - 1) {
        const times = Math.floor(currentVal / d);
        const product = times * d;
        const remainder = currentVal - product;

        if (times > 0 || steps.length > 0 || i === divStr.length - 1) {
          steps.push({
            workNum: currentVal,
            product: product,
            remainder: remainder,
            digitIndex: i
          });
        }

        currentVal = remainder;
      }
    }
    return steps;
  };

  const schoolSteps = generateSchoolSteps();
  const divDigits = D.toString().split('');
  const maxDigits = divDigits.length;

  const getPaddedDigits = (num, endIndex) => {
    const numStr = num.toString();
    const digits = new Array(maxDigits).fill('');

    let numIdx = numStr.length - 1;
    for (let i = endIndex; i >= 0 && numIdx >= 0; i--) {
      digits[i] = numStr[numIdx];
      numIdx--;
    }
    return digits;
  };

  return (
    <Layout
      title="Η Διαίρεση με Διψήφιο Διαιρέτη - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε τον αλγόριθμο της κάθετης διαίρεσης με διψήφιο διαιρέτη, τα βήματα υπολογισμού του πηλίκου και την επαλήθευση με πολλαπλασιασμό."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/22-diairesi-2-psifia-ask"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                ➗ Η Διαίρεση με Διψήφιο Διαιρέτη (10 - 99)
              </h1>
              <p className="text-purple-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε τον αναλυτικό αλγόριθμο της κάθετης διαίρεσης όταν ο <strong>διαιρέτης είναι διψήφιος</strong>, πώς βρίσκουμε το πηλίκο βήμα-βήμα και πώς κάνουμε <strong>επαλήθευση</strong>!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-purple-100">
                Δοκίμασε τις ασκήσεις στη διαίρεση με διψήφιο διαιρέτη για να τελειοποιήσεις τις πράξεις σου!
              </p>
              <Link
                href="/d-dimotikou/22-diairesi-2-psifia-ask"
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
              <span>📖</span> Αναλυτική Θεωρία & Τα Βήματα της Κάθετης Διαίρεσης
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Χωρίζουμε ψηφία */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3 shadow-sm">
              <div className="bg-indigo-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                ΒΗΜΑ 1ο
              </div>
              <h3 className="text-base sm:text-lg font-bold text-indigo-900">
                Χωρίζουμε Ψηφία
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Επειδή ο διαιρέτης είναι <strong>διψήφιος</strong>, χωρίζουμε <strong>2 ψηφία</strong> από τα αριστερά του διαιρετέου. Αν ο αριθμός που σχηματίζεται είναι μικρότερος από τον διαιρέτη, χωρίζουμε <strong>3 ψηφία</strong>.
              </p>
            </div>

            {/* 2. Εκτίμηση & Πολλαπλασιασμός */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3 shadow-sm">
              <div className="bg-purple-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                ΒΗΜΑ 2ο
              </div>
              <h3 className="text-base sm:text-lg font-bold text-purple-900">
                Βρίσκουμε το Ψηφίο του Πηλίκου
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Εκτιμούμε πόσες φορές χωράει ο διαιρέτης, πολλαπλασιάζουμε, σημειώνουμε το γινόμενο κάτω από τα επιλεγμένα ψηφία και εκτελούμε <strong>αφαίρεση</strong>.
              </p>
            </div>

            {/* 3. Κατέβασμα & Επανάληψη */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3 shadow-sm">
              <div className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                ΒΗΜΑ 3ο
              </div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-900">
                Κατεβάζουμε το Επόμενο Ψηφίο
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Κατεβάζουμε το επόμενο ψηφίο δίπλα στο υπόλοιπο και επαναλαμβάνουμε την ίδια διαδικασία μέχρι να χρησιμοποιηθούν όλα τα ψηφία του διαιρετέου.
              </p>
            </div>
          </div>

          {/* ΟΡΟΛΟΓΙΑ & ΕΠΑΛΗΘΕΥΣΗ */}
          <div className="bg-slate-50 p-5 sm:p-7 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              🏷️ Οι Όροι της Διαίρεσης και η Μαθηματική Επαλήθευση
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <h4 className="font-bold text-purple-900 border-b border-slate-100 pb-1.5">
                  1. Τα 4 θεμελιώδη στοιχεία:
                </h4>
                <ul className="space-y-1.5 font-mono text-slate-700">
                  <li><strong className="text-indigo-600">Διαιρετέος (Δ):</strong> Ο αριθμός που μοιράζεται σε ίσα μέρη.</li>
                  <li><strong className="text-blue-600">Διαιρέτης (δ):</strong> Ο αριθμός των ίσων μερών (διψήφιος 10 - 99).</li>
                  <li><strong className="text-emerald-600">Πηλίκο (π):</strong> Το αποτέλεσμα της διαίρεσης.</li>
                  <li><strong className="text-amber-600">Υπόλοιπο (υ):</strong> Το μέρος που περισσεύει (ισχύει πάντοτε υ ＜ δ).</li>
                </ul>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <h4 className="font-bold text-emerald-900 border-b border-slate-100 pb-1.5">
                  2. Τύπος Επαλήθευσης Ευκλείδειας Διαίρεσης:
                </h4>
                <p className="text-slate-600 text-xs">
                  Για να ελέγξουμε αν η διαίρεση εκτελέστηκε σωστά, εφαρμόζουμε τον τύπο:
                </p>
                <div className="font-mono font-black text-slate-800 bg-emerald-50 p-3 rounded-xl text-center text-sm sm:text-base border border-emerald-200/80">
                  Διαιρετέος ＝ (Διαιρέτης · Πηλίκο) ＋ Υπόλοιπο
                  <span className="block text-xs font-bold text-emerald-800 mt-1">Δ ＝ (δ · π) ＋ υ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικό Εργαστήριο Διαίρεσης με Διψήφιο
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Άλλαξε τους αριθμούς για να παρατηρήσεις ζωντανά την κάθετη πράξη και την επαλήθευσή της!
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              <button
                onClick={handleRandomize3Digit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-3.5 py-2 rounded-xl text-xs transition active:scale-95 shadow-sm touch-manipulation"
              >
                🎲 3ψήφιος ÷ 2ψήφιο
              </button>
              <button
                onClick={handleRandomize4Digit}
                className="bg-purple-600 hover:bg-purple-700 text-white font-black px-3.5 py-2 rounded-xl text-xs transition active:scale-95 shadow-sm touch-manipulation"
              >
                🎲 4ψήφιος ÷ 2ψήφιο
              </button>
              <button
                onClick={handleRandomizeExact}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3.5 py-2 rounded-xl text-xs transition active:scale-95 shadow-sm touch-manipulation"
              >
                ✨ Τέλεια Διαίρεση
              </button>
            </div>
          </div>

          {/* ΠΕΔΙΑ ΕΙΣΑΓΩΓΗΣ & TOUCH CONTROLS (ΚΑΝΟΝΑΣ 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
            {/* Διαιρετέος (Δ) */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-[11px] font-black uppercase text-slate-500">ΔΙΑΙΡΕΤΕΟΣ (Δ: 100 - 9.999)</span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                  {formatNumber(D)}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => updateDividend(e, -10)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                  title="Μείωση Δ"
                  aria-label="Μείωση Διαιρετέου"
                >
                  －
                </button>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  autoComplete="off"
                  id="calc-dividend"
                  name="calc-dividend"
                  value={dividend}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setDividend(digits === '' ? '' : Number(digits));
                  }}
                  onBlur={() => {
                    if (!dividend || dividend < 10) setDividend(100);
                  }}
                  className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="π.χ. 1568"
                />

                <button
                  onClick={(e) => updateDividend(e, 10)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                  title="Αύξηση Δ"
                  aria-label="Αύξηση Διαιρετέου"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Διαιρέτης (δ) */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-[11px] font-black uppercase text-slate-500">ΔΙΑΙΡΕΤΗΣ (δ: 10 - 99)</span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-blue-600 text-base">
                  {d}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => updateDivisor(e, -1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                  title="Μείωση δ"
                  aria-label="Μείωση Διαιρέτη"
                >
                  －
                </button>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  autoComplete="off"
                  id="calc-divisor"
                  name="calc-divisor"
                  value={divisor}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
                    setDivisor(digits === '' ? '' : Number(digits));
                  }}
                  onBlur={() => {
                    if (!divisor || divisor < 10) setDivisor(10);
                  }}
                  className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="π.χ. 24"
                />

                <button
                  onClick={(e) => updateDivisor(e, 1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                  title="Αύξηση δ"
                  aria-label="Αύξηση Διαιρέτη"
                >
                  ＋
                </button>
              </div>
            </div>
          </div>

          {/* ΑΠΟΤΕΛΕΣΜΑΤΑ (ΓΡΑΦΙΚΟ ΚΑΘΕΤΗΣ ΔΙΑΙΡΕΣΗΣ & ΕΠΑΛΗΘΕΥΣΗ) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* ΑΡΙΣΤΕΡΑ: ΓΡΑΦΙΚΟ ΚΑΘΕΤΗΣ ΔΙΑΙΡΕΣΗΣ */}
            <div className="flex flex-col items-center gap-2 w-full max-w-[420px] mx-auto">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
                ΠΛΗΡΗΣ ΑΝΑΛΥΣΗ ΚΑΘΕΤΗΣ ΠΡΑΞΗΣ:
              </span>

              <div className="w-full bg-slate-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl border-4 border-slate-800 font-mono text-lg sm:text-xl font-black relative min-h-[320px] flex py-6 select-none justify-center">
                <div className="flex w-full items-start justify-center">
                  {/* ΑΡΙΣΤΕΡΟ ΜΕΡΟΣ: ΔΙΑΙΡΕΤΕΟΣ & ΑΦΑΙΡΕΣΕΙΣ */}
                  <div className="flex flex-col items-end pr-3.5 text-right">
                    {/* Αρχικός Διαιρετέος */}
                    <div className="flex justify-end text-blue-400 font-bold mb-2.5 h-7 items-center">
                      <div className="w-5"></div>
                      <div className="flex justify-end">
                        {divDigits.map((char, i) => (
                          <span key={i} className="w-5 text-center">{char}</span>
                        ))}
                      </div>
                    </div>

                    {/* Σώμα Βημάτων */}
                    <div className="flex flex-col items-end space-y-1.5 w-full">
                      {schoolSteps.map((step, idx) => {
                        const productDigits = getPaddedDigits(step.product, step.digitIndex);
                        const remainderDigits = getPaddedDigits(step.remainder, step.digitIndex);

                        return (
                          <div key={idx} className="flex flex-col items-end w-full">
                            {/* Σειρά Αφαίρεσης */}
                            <div className="flex items-center justify-end w-full h-6">
                              <span className="w-5 text-left text-rose-500 font-bold text-sm select-none">－</span>
                              <div className="flex justify-end text-rose-400 font-semibold">
                                {productDigits.map((char, i) => (
                                  <span key={i} className="w-5 text-center">{char}</span>
                                ))}
                              </div>
                            </div>

                            {/* Οριζόντια Γραμμή Αφαίρεσης */}
                            <div className="w-full flex justify-end h-[2px] my-0.5">
                              <div className="w-5"></div>
                              <div className="flex justify-end">
                                {productDigits.map((char, i) => (
                                  <div key={i} className={`w-5 h-full ${char !== '' ? 'bg-slate-700' : ''}`}></div>
                                ))}
                              </div>
                            </div>

                            {/* Σειρά Αποτελέσματος / Επόμενου Αριθμού */}
                            <div className="flex justify-end w-full h-6 items-center">
                              <div className="w-5"></div>
                              <div className="flex justify-end text-slate-300 font-black">
                                {idx === schoolSteps.length - 1 ? (
                                  remainderDigits.map((char, i) => (
                                    <span key={i} className="w-5 text-center">{char}</span>
                                  ))
                                ) : (
                                  getPaddedDigits(schoolSteps[idx + 1].workNum, schoolSteps[idx + 1].digitIndex).map((char, i) => (
                                    <span key={i} className="w-5 text-center">{char}</span>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ΜΕΣΑΙΟ ΜΕΡΟΣ: ΚΑΘΕΤΗ ΓΡΑΜΜΗ ΤΟΥ «Τ» */}
                  <div className="w-[3px] bg-slate-700 self-stretch min-h-[220px]"></div>

                  {/* ΔΕΞΙ ΜΕΡΟΣ: ΔΙΑΙΡΕΤΗΣ & ΠΗΛΙΚΟ */}
                  <div className="text-left pl-3.5 flex flex-col h-full justify-start">
                    {/* Διψήφιος Διαιρέτης */}
                    <div className="text-emerald-400 font-bold border-b-2 border-slate-700 pb-1.5 tracking-wider flex w-full">
                      {d.toString().split('').map((char, i) => (
                        <span key={i} className="w-5 text-center">{char}</span>
                      ))}
                    </div>

                    {/* Τελικό Πηλίκο */}
                    <div className="text-purple-400 pt-2 font-black tracking-wider flex w-full">
                      {q.toString().split('').map((char, i) => (
                        <span key={i} className="w-5 text-center">{char}</span>
                      ))}
                    </div>

                    {/* Ένδειξη Τελικού Υπολοίπου */}
                    <div className={`mt-auto pt-8 text-[11px] font-sans font-black uppercase tracking-wider ${isExact ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isExact ? '✨ Τέλεια (υ ＝ 0)' : `🏁 Υπόλοιπο: ${r}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between w-full text-[10px] font-bold text-slate-400 border-t border-slate-200 pt-2 uppercase px-1 tracking-tight">
                <span>🔵 Δ: Διαιρετέος</span>
                <span>🟢 δ: Διαιρέτης</span>
                <span>🟣 π: Πηλίκο</span>
              </div>
            </div>

            {/* ΔΕΞΙΑ: ΑΝΑΛΥΤΙΚΗ ΕΠΑΛΗΘΕΥΣΗ ΜΕ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟ */}
            <div className="bg-emerald-50/70 p-5 sm:p-7 rounded-3xl border border-emerald-200/80 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-emerald-200/80 pb-3">
                <span className="text-2xl">✅</span>
                <h3 className="font-extrabold text-emerald-950 text-base sm:text-lg">
                  Επαλήθευση με Πολλαπλασιασμό
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Εφαρμόζουμε τον τύπο της ευκλείδειας διαίρεσης για να αποδείξουμε ότι ο πολλαπλασιασμός είναι η αντίστροφη πράξη:
              </p>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 font-mono text-base sm:text-lg space-y-2 text-center shadow-sm">
                <div className="text-slate-800 font-bold">
                  (<span className="text-blue-600">{d}</span> · <span className="text-purple-600">{formatNumber(q)}</span>) ＋ <span className="text-amber-600">{r}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-sans">
                  ＝ {formatNumber(d * q)} ＋ {r}
                </div>
                <div className="text-xl sm:text-2xl font-black text-indigo-700 border-t pt-2 border-slate-100">
                  ＝ {formatNumber(D)} <span className="text-xs text-slate-500 font-bold font-sans">(Διαιρετέος)</span>
                </div>
              </div>

              <p className="text-xs text-emerald-900 font-semibold leading-relaxed">
                💡 Πολλαπλασιάσαμε τον διψήφιο διαιρέτη με το πηλίκο, προσθέσαμε το υπόλοιπο και προέκυψε ακριβώς ο αρχικός διαιρετέος!
              </p>

              <div className="text-xs text-slate-600 font-bold border-t pt-3 border-emerald-200/80">
                🔍 Βασικός κανόνας: Το υπόλοιπο ({r}) είναι πάντοτε αυστηρά μικρότερο από τον διαιρέτη ({d}).
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες τη διαίρεση με διψήφιο διαιρέτη και την επαλήθευση; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/22-diairesi-2-psifia-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
