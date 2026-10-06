import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Επαναχρησιμοποιήσιμο component για κλασματική γραφή με ασφαλή ανίχνευση προσήμου
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-1 align-middle mx-1 font-mono ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-1 border-b-2 w-full text-center" style={{ borderColor: 'currentColor' }}>
          {displayNum}
        </span>
        <span className="pt-0.5 px-1 w-full text-center">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

export default function AkolouthiaTheoria() {
  // State για Εργαστήριο 1: Οπτικό Μοτίβο Τετραγώνων
  const [patternStep, setPatternStep] = useState(3);

  // State για Εργαστήριο 2: Μηχανή Κανονικοτήτων
  const [selectedRule, setSelectedRule] = useState('3v+2');
  const [nthTermIndex, setNthTermIndex] = useState(5);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Ορισμοί Κανόνων για το Εργαστήριο 2
  const rules = [
    { id: '2v', name: 'Άρτιοι Αριθμοί', formula: '2 · ν', calc: (v) => 2 * v },
    { id: '2v-1', name: 'Περιττοί Αριθμοί', formula: '2 · ν － 1', calc: (v) => 2 * v - 1 },
    { id: '3v+2', name: 'Καθίσματα σε Τραπέζια', formula: '3 · ν ＋ 2', calc: (v) => 3 * v + 2 },
    { id: 'v2', name: 'Τετράγωνοι Αριθμοί', formula: 'ν²', calc: (v) => v * v },
    { id: '5v-2', name: 'Αύξηση κατά 5', formula: '5 · ν － 2', calc: (v) => 5 * v - 2 },
  ];

  const activeRule = useMemo(() => rules.find((r) => r.id === selectedRule), [selectedRule]);

  // Παραγωγή Ακολουθίας για το Εργαστήριο 2
  const sequenceData = useMemo(() => {
    const seq = [];
    for (let i = 1; i <= nthTermIndex; i++) {
      seq.push(activeRule.calc(i));
    }
    return seq;
  }, [activeRule, nthTermIndex]);

  return (
    <Layout
      title="Κανονικότητες & Ακολουθίες | Α' Γυμνασίου"
      description="Η έννοια της κανονικότητας (ακολουθίας), ο ν-οστός όρος, οπτικά μοτίβα και διαδραστικά εργαστήρια προβλημάτων."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/25-akolouthia-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>ΑΣΚΗΣΕΙΣ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 23 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Κανονικότητες & Ακολουθίες (Ο ν-οστός όρος)
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Εξερευνούμε τα μοτίβα που κρύβονται γύρω μας! Μαθαίνουμε πώς να αναγνωρίζουμε τον κανόνα μιας ακολουθίας και πώς να υπολογίζουμε τον ν-οστό όρο, λύνοντας πρακτικά προβλήματα.
            </p>
          </div>
        </section>

        {/* 1. ΤΙ ΕΙΝΑΙ Η ΚΑΝΟΝΙΚΟΤΗΤΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Τι Ονομάζουμε Κανονικότητα (Ακολουθία);
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                Μια <strong>κανονικότητα</strong> (ή αλλιώς <strong>ακολουθία</strong>) είναι μια σειρά από αριθμούς ή σχήματα που ακολουθούν έναν συγκεκριμένο, επαναλαμβανόμενο μαθηματικό <strong>κανόνα</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-indigo-900 text-base">Παράδειγμα: Οι Άρτιοι Αριθμοί</div>
                <div className="font-mono text-lg font-bold text-indigo-700">
                  2, 4, 6, 8, 10, ...
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Ο κανόνας είναι προφανής: Κάθε αριθμός προκύπτει προσθέτοντας το 2 στον προηγούμενο. Αν σε ρωτήσουν "ποιος είναι ο επόμενος;", ξέρεις κατευθείαν ότι είναι το 12.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 h-full">
                <div className="text-xs font-bold uppercase text-indigo-800 tracking-wider">
                  Ο ΜΑΓΙΚΟΣ ΑΡΙΘΜΟΣ «ν» (ν-οστος ορος)
                </div>
                <p className="text-slate-700">
                  Αντί να προσθέτουμε συνεχώς για να βρούμε (για παράδειγμα) τον 100ό αριθμό της σειράς, χρησιμοποιούμε έναν γενικό τύπο, τον <strong>ν-οστό όρο</strong>.
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 pt-2">
                  <li>Το <strong>ν</strong> συμβολίζει τη <strong>θέση</strong> (1ος, 2ος, 3ος, ...).</li>
                  <li>Είναι πάντοτε ένας <strong>φυσικός αριθμός μεγαλύτερος του μηδενός</strong> (ν ≥ 1).</li>
                  <li>Για τους άρτιους αριθμούς, ο τύπος είναι <strong>2 · ν</strong>. Αν ν ＝ 100, ο 100ός όρος είναι 2 · 100 ＝ 200.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΟΠΤΙΚΑ ΜΟΤΙΒΑ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Από το Σχήμα στον Μαθηματικό Τύπο
            </h2>
          </div>

          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            <p>
              Πολλές κανονικότητες εμφανίζονται σε γεωμετρικά σχήματα. Σκέψου ότι φτιάχνουμε τετράγωνα στη σειρά χρησιμοποιώντας σπίρτα (ή γραμμές). Το πρώτο τετράγωνο χρειάζεται 4 σπίρτα. Κάθε επόμενο τετράγωνο κολλάει στο προηγούμενο, οπότε <strong>χρειάζεται μόνο 3 νέα σπίρτα</strong>.
            </p>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
          <div className="pt-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
              🛠 Εργαστήριο 1: Χτίζοντας Τετράγωνα (Το Μοτίβο 3ν ＋ 1)
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers & Πληροφορίες */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <label className="block text-xs font-bold text-slate-600 uppercase">
                    ΒΗΜΑ ΝΟ. (ν) - ΠΛΗΘΟΣ ΤΕΤΡΑΓΩΝΩΝ
                  </label>
                  <div className="grid grid-cols-[40px_1fr_40px] items-center h-12 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPatternStep, -1, 1, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-950 font-black text-xl font-mono">
                      ν ＝ {patternStep}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPatternStep, 1, 1, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      ＋
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Υπολογισμός Γραμμών</div>
                    <div className="text-lg font-mono font-bold text-slate-900">
                      3 · {patternStep} ＋ 1 ＝ <span className="text-amber-600 text-2xl">{3 * patternStep + 1}</span>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      Το 1ο σπίρτο μπαίνει στην αρχή (αριστερά). Μετά, για κάθε τετράγωνο προσθέτουμε ένα σχήμα "C" με 3 σπίρτα.
                    </div>
                  </div>
                </div>
              </div>

              {/* Οπτικοποίηση SVG Responsive */}
              <div className="lg:col-span-8 bg-slate-900 p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 align-self-start w-full text-left">
                  ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ({3 * patternStep + 1} ΓΡΑΜΜΕΣ)
                </div>
                <div className="w-full max-w-full overflow-hidden">
                  <svg
                    viewBox={`0 0 ${patternStep * 40 + 20} 60`}
                    className="w-full h-auto max-h-[120px]"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Αρχική Κατακόρυφη Γραμμή (Το σταθερό "1") */}
                    <line x1="10" y1="10" x2="10" y2="50" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                    <text x="5" y="35" fill="#f59e0b" fontSize="8" fontWeight="bold" transform="rotate(-90 5,35)">+1</text>

                    {/* Τα "C" (3 γραμμές) για κάθε βήμα */}
                    {Array.from({ length: patternStep }).map((_, i) => {
                      const startX = 10 + i * 40;
                      const nextX = startX + 40;
                      return (
                        <g key={`sq-${i}`}>
                          {/* Πάνω γραμμή */}
                          <line x1={startX} y1="10" x2={nextX} y2="10" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                          {/* Κάτω γραμμή */}
                          <line x1={startX} y1="50" x2={nextX} y2="50" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                          {/* Δεξιά γραμμή */}
                          <line x1={nextX} y1="10" x2={nextX} y2="50" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />

                          {/* Ετικέτα +3 */}
                          <text x={startX + 14} y="34" fill="#38bdf8" fontSize="12" fontWeight="bold">+3</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Η Κανονικότητα στην Πραγματική Ζωή
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
              <h3 className="font-bold text-amber-950 text-lg">Πρόβλημα: Τραπέζια σε Εστιατόριο</h3>
              <p className="text-slate-700">
                Σε ένα εστιατόριο, ένα ορθογώνιο τραπέζι χωράει <strong>6 άτομα</strong> (από 2 στις μεγάλες πλευρές και από 1 στις μικρές). Αν ενώσουμε 2 τραπέζια στη σειρά, χάνουμε τις ενδιάμεσες θέσεις.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li>1 τραπέζι (ν ＝ 1): 6 θέσεις</li>
                <li>2 τραπέζια (ν ＝ 2): 10 θέσεις</li>
                <li>3 τραπέζια (ν ＝ 3): 14 θέσεις</li>
              </ul>
              <div className="mt-3 p-3 bg-white rounded-xl border border-amber-200 font-mono text-center font-bold text-amber-800">
                Τύπος (ν-οστός όρος): 4 · ν ＋ 2
              </div>
              <p className="text-xs text-slate-600 pt-2">
                <strong>Εξήγηση:</strong> Κάθε νέο τραπέζι προσθέτει 4 θέσεις (τις πάνω και τις κάτω). Οι 2 θέσεις στις άκρες (αριστερά και δεξιά) μένουν πάντα σταθερές.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
              <h3 className="font-bold text-emerald-950 text-lg">Πρόβλημα: Οικονομίες στον Κουμπαρά</h3>
              <p className="text-slate-700">
                Ο Γιάννης έχει ήδη <strong>15 €</strong> στον κουμπαρά του. Αποφασίζει κάθε εβδομάδα να αποταμιεύει <strong>5 €</strong>.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li>Μετά από 1 εβδομάδα (ν ＝ 1): 20 €</li>
                <li>Μετά από 2 εβδομάδες (ν ＝ 2): 25 €</li>
                <li>Μετά από 3 εβδομάδες (ν ＝ 3): 30 €</li>
              </ul>
              <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-200 font-mono text-center font-bold text-emerald-800">
                Τύπος (ν-οστός όρος): 5 · ν ＋ 15
              </div>
              <p className="text-xs text-slate-600 pt-2">
                <strong>Εξήγηση:</strong> Το 15 είναι το αρχικό ποσό (σταθερό). Για κάθε εβδομάδα ν, προσθέτουμε 5 ευρώ (ο ρυθμός αύξησης).
              </p>
            </div>
          </div>
        </section>

        {/* 4. ΕΡΓΑΣΤΗΡΙΟ 2: Η ΜΗΧΑΝΗ ΤΩΝ ΚΑΝΟΝΙΚΟΤΗΤΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              Εργαστήριο 2: Η «Μηχανή» των Κανονικοτήτων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Επιλογές - Steppers (5 cols) */}
            <div className="lg:col-span-5 space-y-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {/* Επιλογή Κανόνα */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  ΕΠΙΛΟΓΗ ΚΑΝΟΝΑ (ΤΥΠΟΣ)
                </label>
                <div className="flex flex-col gap-2">
                  {rules.map((rule) => (
                    <button
                      key={rule.id}
                      type="button"
                      onClick={() => setSelectedRule(rule.id)}
                      className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border flex items-center justify-between ${
                        selectedRule === rule.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span>{rule.name}</span>
                      <span className={`font-mono text-xs ${selectedRule === rule.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {rule.formula}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Επιλογή Βήματος ν */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  ΒΗΜΑ (ν) - ΠΛΗΘΟΣ ΟΡΩΝ
                </label>
                <div className="grid grid-cols-[40px_1fr_40px] items-center h-12 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNthTermIndex, -1, 1, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-950 font-black text-xl font-mono">
                    ν ＝ {nthTermIndex}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNthTermIndex, 1, 1, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Μπορείτε να δείτε μέχρι τους πρώτους 20 όρους της ακολουθίας.
                </p>
              </div>
            </div>

            {/* Αποτέλεσμα & Προβολή Σειράς (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl shadow-md text-white space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="text-xs uppercase tracking-widest text-indigo-300 font-bold font-sans">
                  ΑΠΟΤΕΛΕΣΜΑ ΜΗΧΑΝΗΣ
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
                  ΤΥΠΟΣ: {activeRule.formula}
                </span>
              </div>

              {/* Υπολογισμός του ν-οστού όρου */}
              <div className="space-y-2">
                <div className="text-xs text-slate-400 uppercase font-bold">
                  ΥΠΟΛΟΓΙΣΜΟΣ ΓΙΑ ν ＝ {nthTermIndex}
                </div>
                <div className="text-3xl sm:text-5xl font-black font-mono text-emerald-400">
                  <span className="text-slate-300 text-xl sm:text-3xl mr-2">Τιμή ＝</span>
                  {activeRule.calc(nthTermIndex)}
                </div>
              </div>

              {/* Λίστα Όλων των Όρων */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-bold">
                  Η ΑΚΟΛΟΥΘΙΑ (ΟΙ ΠΡΩΤΟΙ {nthTermIndex} ΟΡΟΙ)
                </div>
                <div className="flex flex-wrap gap-2">
                  {sequenceData.map((val, idx) => (
                    <div
                      key={idx}
                      className={`min-w-[40px] px-3 py-2 rounded-lg font-mono text-sm sm:text-base font-bold text-center border transition-all ${
                        idx + 1 === nthTermIndex
                          ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 scale-105'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                      title={`ν = ${idx + 1}`}
                    >
                      {val}
                    </div>
                  ))}
                  {nthTermIndex < 20 && (
                    <div className="min-w-[40px] px-3 py-2 rounded-lg font-mono text-base font-bold text-center border bg-slate-900 border-slate-800 text-slate-600 flex items-center justify-center">
                      ...
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-500">
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
                  Ο φωτισμένος αριθμός είναι ο όρος στη θέση ν={nthTermIndex}. Πέρασε το ποντίκι (ή πάτα) πάνω στα κουτάκια για να δεις τη θέση τους.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
