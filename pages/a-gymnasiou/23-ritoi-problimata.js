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

export default function RitoiProblimataTheoria() {
  // State για Εργαστήριο 1: Κλασματικό Μέρος & Υπόλοιπο
  const [totalBudget, setTotalBudget] = useState(120);
  const [f1Num, setF1Num] = useState(2);
  const [f1Den, setF1Den] = useState(5);

  // State για Εργαστήριο 2: Ισοζύγιο με Θετικά και Αρνητικά Μεγέθη
  const [initialAmount, setInitialAmount] = useState(50);
  const [income, setIncome] = useState(80);
  const [expense1, setExpense1] = useState(45);
  const [expense2, setExpense2] = useState(110);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1
  const spentAmount = useMemo(() => {
    return Number(((totalBudget * f1Num) / f1Den).toFixed(2));
  }, [totalBudget, f1Num, f1Den]);

  const remainingAmount = useMemo(() => {
    return Number((totalBudget - spentAmount).toFixed(2));
  }, [totalBudget, spentAmount]);

  const remainingFractionNum = f1Den - f1Num;
  const spentPercent = Math.round((f1Num / f1Den) * 100);
  const remPercent = 100 - spentPercent;

  // Υπολογισμοί Εργαστηρίου 2 (Οικονομικό Ισοζύγιο)
  const balance = useMemo(() => {
    return initialAmount + income - expense1 - expense2;
  }, [initialAmount, income, expense1, expense2]);

  return (
    <Layout
      title="Επίλυση Προβλημάτων με Ρητούς | Α' Γυμνασίου"
      description="Μεθοδολογία και στρατηγικές επίλυσης προβλημάτων με ρητούς αριθμούς, κλασματικά μέρη, οικονομικά ισοζύγια και διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/23-ritoi-problimata-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 21 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Επίλυση Προβλημάτων με Ρητούς Αριθμούς
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε τα τέσσερα στάδια ορθής επίλυσης μαθηματικών προβλημάτων, πώς μετατρέπουμε τα λεκτικά δεδομένα σε αριθμητικές εκφράσεις και πώς διαχειριζόμαστε κλασματικά μερίδια και πρόσημα στην καθημερινή ζωή.
            </p>
          </div>
        </section>

        {/* 1. ΤΑ 4 ΣΤΑΔΙΑ ΕΠΙΛΥΣΗΣ ΠΡΟΒΛΗΜΑΤΟΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Τα 4 Βήματα Στρατηγικής Επίλυσης
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Βήμα 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                  ΒΗΜΑ 1
                </span>
                <h3 className="font-bold text-slate-900 text-base">Κατανόηση</h3>
                <p className="text-slate-600">
                  Διαβάζουμε προσεκτικά την εκφώνηση. Ξεχωρίζουμε ποια είναι τα <strong>γνωστά δεδομένα</strong> και ποια τα <strong>άγνωστα ζητούμενα</strong>.
                </p>
              </div>
              <div className="text-[11px] text-slate-500 italic">
                «Τι ακριβώς μου ζητάει να βρω;»
              </div>
            </div>

            {/* Βήμα 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded inline-block">
                  ΒΗΜΑ 2
                </span>
                <h3 className="font-bold text-slate-900 text-base">Σχεδιασμός</h3>
                <p className="text-slate-600">
                  Μεταφράζουμε τις λέξεις σε μαθηματική παράσταση. Επιλέγουμε τις κατάλληλες πράξεις (πρόσθεση, αφαίρεση, πολλαπλασιασμό μεριδίου ή διαίρεση).
                </p>
              </div>
              <div className="text-[11px] text-indigo-700 font-semibold">
                «Ποια μαθηματική σχέση συνδέει τα δεδομένα;»
              </div>
            </div>

            {/* Βήμα 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded inline-block">
                  ΒΗΜΑ 3
                </span>
                <h3 className="font-bold text-slate-900 text-base">Εκτέλεση Πράξεων</h3>
                <p className="text-slate-600">
                  Εκτελούμε προσεκτικά τους υπολογισμούς τηρώντας την προτεραιότητα πράξεων, τους κανόνες προσήμων και την απλοποίηση των κλασμάτων με διαίρεση.
                </p>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                Προσοχή στα πρόσημα και τα ομώνυμα κλάσματα.
              </div>
            </div>

            {/* Βήμα 4 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded inline-block">
                  ΒΗΜΑ 4
                </span>
                <h3 className="font-bold text-slate-900 text-base">Έλεγχος & Απάντηση</h3>
                <p className="text-slate-600">
                  Ελέγχουμε αν η απάντηση είναι λογική για τα δεδομένα του πραγματικού κόσμου και διατυπώνουμε ολοκληρωμένη πρόταση με μονάδες μέτρησης (€, kg, m κ.λπ.).
                </p>
              </div>
              <div className="text-[11px] text-amber-700 font-semibold">
                Επαλήθευση του αποτελέσματος.
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΚΛΑΣΜΑΤΙΚΟ ΜΕΡΟΣ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Προβλήματα με Κλασματικά Μερίδια & Υπόλοιπα
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Υπολογισμός του Κλάσματος ενός Ποσού
              </h3>
              <p>
                Όταν θέλουμε να βρούμε τα <Frac num="α" den="β" /> ενός ποσού <strong>Χ</strong>, <strong>πολλαπλασιάζουμε το ποσό με το κλάσμα</strong>:
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-lg sm:text-xl font-mono shadow-sm">
                Μέρος ＝ Χ · <Frac num="α" den="β" /> ＝ <Frac num="Χ · α" den="β" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Το <strong>υπόλοιπο</strong> που απομένει είναι: 1 － <Frac num="α" den="β" /> ＝ <Frac num="β － α" den="β" /> του αρχικού ποσού.
              </p>
            </div>

            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="font-bold text-slate-900 text-base">
                Αντίστροφο Πρόβλημα: Εύρεση της Αρχικής Ποσότητας
              </div>
              <p className="text-slate-600">
                Όταν γνωρίζουμε ότι τα <Frac num="α" den="β" /> μιας ποσότητας ισούνται με <strong>Υ</strong> και ψάχνουμε το αρχικό σύνολο, <strong>διαιρούμε την ποσότητα με το κλάσμα</strong>:
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-center font-bold text-indigo-950">
                Αρχική Ποσότητα ＝ Υ ： <Frac num="α" den="β" /> ＝ Υ · <Frac num="β" den="α" />
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΟ ΚΛΑΣΜΑΤΙΚΟ ΜΕΡΙΔΙΟ (ΧΩΡΙΣ ΟΡΙΖΟΝΤΙΟ SCROLL) */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️️ Εργαστήριο 1: Διαδραστικός Προσομοιωτής Μεριδίου & Υπολοίπου
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Χειριστήρια (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* Αρχικό Ποσό */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase block">
                    ΑΡΧΙΚΟ ΠΟΣΟ (Χ)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setTotalBudget, -10, 10, 500, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-base font-mono text-indigo-950">
                      {totalBudget} €
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setTotalBudget, 10, 10, 500, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Αριθμητής Μεριδίου */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">
                    ΑΡΙΘΜΗΤΗΣ (α)
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setF1Num, -1, 1, f1Den - 1, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                      {f1Num}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setF1Num, 1, 1, f1Den - 1, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Παρονομαστής Μεριδίου */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">
                    ΠΑΡΟΝΟΜΑΣΤΗΣ (β)
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setF1Den, -1, f1Num + 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                      {f1Den}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setF1Den, 1, f1Num + 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Οπτική Ανάλυση & Μπάρα Κατανομής (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-5 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">
                    ΚΑΤΑΝΟΜΗ ΠΟΣΟΥ ({totalBudget} €)
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-mono">
                    ΚΛΑΣΜΑ: <Frac num={f1Num} den={f1Den} className="text-indigo-200" />
                  </span>
                </div>

                {/* Οπτική Μπάρα (Πλήρως Responsive, 100% πλάτος χωρίς scroll) */}
                <div className="space-y-2">
                  <div className="w-full h-8 bg-slate-800 rounded-xl overflow-hidden flex border border-slate-700 p-0.5">
                    <div
                      style={{ width: `${spentPercent}%` }}
                      className="h-full bg-amber-500 rounded-lg flex items-center justify-center text-[11px] font-bold text-slate-950 transition-all"
                    >
                      {spentPercent >= 15 ? `${spentPercent}%` : ''}
                    </div>
                    <div
                      style={{ width: `${remPercent}%` }}
                      className="h-full bg-emerald-500 rounded-lg flex items-center justify-center text-[11px] font-bold text-slate-950 transition-all ml-0.5"
                    >
                      {remPercent >= 15 ? `${remPercent}%` : ''}
                    </div>
                  </div>

                  <div className="flex justify-between text-xs font-mono pt-1">
                    <span className="text-amber-400 font-bold">
                      Μέρος που ξοδεύτηκε: {spentAmount} € ({f1Num}/{f1Den})
                    </span>
                    <span className="text-emerald-400 font-bold">
                      Υπόλοιπο: {remainingAmount} € ({remainingFractionNum}/{f1Den})
                    </span>
                  </div>
                </div>

                {/* Ανάλυση Πράξεων */}
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                  <div>
                    <strong>1. Υπολογισμός Εξόδου:</strong> {totalBudget} · (<Frac num={f1Num} den={f1Den} />) ＝ ({totalBudget} · {f1Num}) / {f1Den} ＝ <strong>{spentAmount} €</strong>
                  </div>
                  <div>
                    <strong>2. Υπολογισμός Υπολοίπου:</strong> {totalBudget} － {spentAmount} ＝ <strong>{remainingAmount} €</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΠΡΟΒΛΗΜΑΤΑ ΜΕ ΠΡΟΣΗΜΑ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Προβλήματα με Θετικά & Αρνητικά Μεγέθη
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                ΟΙΚΟΝΟΜΙΚΑ
              </span>
              <h4 className="font-bold text-slate-900 text-base">Έσοδα vs Έξοδα</h4>
              <p className="text-slate-600">
                Τα έσοδα, οι καταθέσεις και τα κέρδη είναι <strong>θετικοί ρητοί (＋)</strong>. Τα έξοδα, οι χρεώσεις και οι ζημιές είναι <strong>αρνητικοί ρητοί (－)</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider block">
                ΦΥΣΙΚΗ & ΚΑΙΡΟΣ
              </span>
              <h4 className="font-bold text-slate-900 text-base">Μεταβολές Θερμοκρασίας</h4>
              <p className="text-slate-600">
                Η άνοδος της θερμοκρασίας δηλώνεται με <strong>＋</strong>, ενώ η πτώση (ψύχος) με <strong>－</strong>. Η τελική θερμοκρασία είναι το αλγεβρικό άθροισμα των μεταβολών.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider block">
                ΓΕΩΓΡΑΦΙΑ
              </span>
              <h4 className="font-bold text-slate-900 text-base">Υψόμετρα & Βάθη</h4>
              <p className="text-slate-600">
                Σημείο αναφοράς (0) είναι η επιφάνεια της θάλασσας. Τα βουνά έχουν <strong>θετικό υψόμετρο</strong> και τα υποθαλάσσια βάθη <strong>αρνητικό</strong>.
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΟ ΟΙΚΟΝΟΜΙΚΟ ΙΣΟΖΥΓΙΟ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Διαδραστικός Υπολογιστής Οικονομικού Ισοζυγίου
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Steppers Ελέγχου (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    ΑΡΧΙΚΟ ΥΠΟΛΟΙΠΟ
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setInitialAmount, -10, 0, 200, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-slate-900">
                      ＋{initialAmount} €
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setInitialAmount, 10, 0, 200, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">
                    ΝΕΟ ΕΣΟΔΟ (＋)
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setIncome, -10, 0, 200, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-emerald-50 rounded-lg border border-emerald-200 font-bold text-sm font-mono text-emerald-950">
                      ＋{income} €
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setIncome, 10, 0, 200, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-rose-700 uppercase block mb-1">
                    ΕΞΟΔΟ 1 (－)
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpense1, -5, 0, 150, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-rose-50 rounded-lg border border-rose-200 font-bold text-sm font-mono text-rose-950">
                      －{expense1} €
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpense1, 5, 0, 150, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-rose-700 uppercase block mb-1">
                    ΕΞΟΔΟ 2 (－)
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpense2, -10, 0, 200, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-rose-50 rounded-lg border border-rose-200 font-bold text-sm font-mono text-rose-950">
                      －{expense2} €
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExpense2, 10, 0, 200, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΛΓΕΒΡΙΚΟ ΑΘΡΟΙΣΜΑ ΠΟΣΩΝ
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    balance >= 0
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {balance >= 0 ? 'ΠΛΕΟΝΑΣΜΑ (ΘΕΤΙΚΟ)' : 'ΕΛΛΕΙΜΜΑ / ΧΡΕΟΣ (ΑΡΝΗΤΙΚΟ)'}
                  </span>
                </div>

                <div className="text-lg sm:text-2xl font-bold py-1 flex items-center justify-center gap-2 flex-wrap text-center">
                  <span>(＋{initialAmount})</span>
                  <span className="text-emerald-400">＋</span>
                  <span>(＋{income})</span>
                  <span className="text-rose-400">＋</span>
                  <span>(－{expense1})</span>
                  <span className="text-rose-400">＋</span>
                  <span>(－{expense2})</span>
                </div>

                <div className="p-4 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs sm:text-sm text-slate-300 font-sans font-bold">
                    ΤΕΛΙΚΟ ΥΠΟΛΟΙΠΟ:
                  </span>
                  <span className={`text-2xl sm:text-4xl font-black ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {balance >= 0 ? `＋${balance} €` : `${balance} €`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
