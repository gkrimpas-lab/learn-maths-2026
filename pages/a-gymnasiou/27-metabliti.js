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

export default function MetablitiTheoria() {
  // State για Εργαστήριο 1: Ανατομία Παράστασης α·x + β
  const [coeffA, setCoeffA] = useState(3);       // Συντελεστής (α)
  const [constB, setConstB] = useState(4);       // Σταθερός όρος (β)
  const [varX, setVarX] = useState(5);           // Τιμή της μεταβλητής (x)

  // State για Εργαστήριο 2: Ρεαλιστικό Πρόβλημα (Κόστος Ταξί: y = α·x + β)
  const [baseFee, setBaseFee] = useState(2);     // Πάγια χρέωση (σημαία)
  const [ratePerKm, setRatePerKm] = useState(1.5); // Τιμή ανά χιλιόμετρο
  const [distanceKm, setDistanceKm] = useState(8); // Χιλιόμετρα (μεταβλητή x)

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => {
      let next = prev + val;
      next = Math.round(next * 10) / 10;
      return Math.max(min, Math.min(max, next));
    });
  };

  // Υπολογισμοί Εργαστηρίου 1
  const variablePartVal = useMemo(() => coeffA * varX, [coeffA, varX]);
  const totalExprVal = useMemo(() => variablePartVal + constB, [variablePartVal, constB]);

  // Υπολογισμοί Εργαστηρίου 2 (Ταξί)
  const totalTaxiCost = useMemo(() => {
    return Number((baseFee + ratePerKm * distanceKm).toFixed(2));
  }, [baseFee, ratePerKm, distanceKm]);

  return (
    <Layout
      title="Η Έννοια της Μεταβλητής | Α' Γυμνασίου"
      description="Η έννοια της μεταβλητής, αλγεβρικές παραστάσεις, συντελεστής και σταθερός όρος, υπολογισμός αριθμητικής τιμής και διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/27-metabliti-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 25 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Η Έννοια της Μεταβλητής & Αλγεβρικές Παραστάσεις
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Κάνουμε τη μετάβαση από την Αριθμητική στην Άλγεβρα! Μαθαίνουμε τι είναι η μεταβλητή, πώς ξεχωρίζουμε τον συντελεστή από τον σταθερό όρο και πώς υπολογίζουμε την αριθμητική τιμή μιας παράστασης.
            </p>
          </div>
        </section>

        {/* 1. ΤΙ ΕΙΝΑΙ Η ΜΕΤΑΒΛΗΤΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Τι Είναι η Μεταβλητή;
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Μεταβλητή</strong> ονομάζεται ένα γράμμα (όπως <strong>x, y, ν, α</strong>) το οποίο χρησιμοποιούμε για να παραστήσουμε:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 text-xs sm:text-sm">
                <li>Έναν <strong>άγνωστο αριθμό</strong> που θέλουμε να προσδιορίσουμε.</li>
                <li>Έναν αριθμό που μπορεί να πάρει <strong>πολλές διαφορετικές τιμές</strong> (μεταβάλλεται).</li>
              </ul>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-medium text-xs sm:text-sm">
                💡 <strong>Γιατί χρησιμοποιούμε γράμματα;</strong><br />
                Γιατί με ένα μόνο γράμμα μπορούμε να διατυπώσουμε γενικούς κανόνες που ισχύουν για <em>κάθε</em> αριθμό, αντί να γράφουμε άπειρα παραδείγματα.
              </div>
            </div>

            {/* Παραδείγματα Μετάφρασης σε Μεταβλητή */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                ΑΠΟ ΤΑ ΛΟΓΙΑ ΣΤΑ ΜΑΘΗΜΑΤΙΚΑ ΣΥΜΒΟΛΑ
              </div>
              <div className="space-y-2 text-xs sm:text-sm font-mono">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-sans text-slate-700">«Το διπλάσιο ενός αριθμού x»</span>
                  <span className="font-bold text-indigo-700">2 · x</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-sans text-slate-700">«Ένας αριθμός x αυξημένος κατά 5»</span>
                  <span className="font-bold text-indigo-700">x ＋ 5</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-sans text-slate-700">«Το τριπλάσιο ενός αριθμού x ελαττωμένο κατά 2»</span>
                  <span className="font-bold text-indigo-700">3 · x － 2</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΣΥΝΤΕΛΕΣΤΗΣ ΚΑΙ ΣΤΑΘΕΡΟΣ ΟΡΟΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Συντελεστής & Σταθερός Όρος
            </h2>
          </div>

          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            <p>
              Σε μια γραμμική αλγεβρική παράσταση της μορφής <strong>α · x ＋ β</strong>, ξεχωρίζουμε δύο πολύ σημαντικά συστατικά:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Συντελεστής */}
            <div className="p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-sky-700 tracking-wider">
                  ΣΥΝΤΕΛΕΣΤΗΣ (α)
                </span>
                <h3 className="font-bold text-slate-900 text-lg">Ο Αριθμός μπροστά από τη Μεταβλητή</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Είναι ο αριθμητικός παράγοντας που <strong>πολλαπλασιάζεται με τη μεταβλητή</strong>. Δείχνει πόσες φορές παίρνουμε το x.
                </p>
                <div className="p-3 bg-white rounded-xl border border-sky-100 font-mono text-xs sm:text-sm space-y-1">
                  <div>• Στο <strong>5x</strong>, συντελεστής είναι το <strong>5</strong>.</div>
                  <div>• Στο <strong>－3x</strong>, συντελεστής είναι το <strong>－3</strong>.</div>
                  <div>• Στο <strong>x</strong>, συντελεστής είναι το <strong>1</strong> (αφού 1 · x ＝ x).</div>
                  <div>• Στο <strong>－x</strong>, συντελεστής είναι το <strong>－1</strong>.</div>
                </div>
              </div>
            </div>

            {/* Σταθερός Όρος */}
            <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-amber-700 tracking-wider">
                  ΣΤΑΘΕΡΟΣ ΟΡΟΣ (β)
                </span>
                <h3 className="font-bold text-slate-900 text-lg">Ο Αριθμός χωρίς Μεταβλητή</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Είναι ο όρος που αποτελείται <strong>μόνο από αριθμό</strong>, χωρίς να περιέχει κάποιο γράμμα. Η τιμή του παραμένει σταθερή και δεν εξαρτάται από το x.
                </p>
                <div className="p-3 bg-white rounded-xl border border-amber-100 font-mono text-xs sm:text-sm space-y-1">
                  <div>• Στο <strong>4x ＋ 7</strong>, σταθερός όρος είναι το <strong>＋7</strong>.</div>
                  <div>• Στο <strong>2x － 9</strong>, σταθερός όρος είναι το <strong>－9</strong>.</div>
                  <div>• Στο <strong>6x</strong>, σταθερός όρος είναι το <strong>0</strong> (δεν υπάρχει).</div>
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΑΝΑΤΟΜΙΑ ΠΑΡΑΣΤΑΣΗΣ & ΥΠΟΛΟΓΙΣΜΟΣ ΤΙΜΗΣ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 1: Διαδραστική Ανατομία Παράστασης & Υπολογισμός Τιμής
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers Ελέγχου (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* Συντελεστής α */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-sky-700 uppercase block">
                    ΣΥΝΤΕΛΕΣΤΗΣ (α)
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setCoeffA, -1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-sm font-mono text-sky-950">
                      {coeffA > 0 ? `＋${coeffA}` : coeffA}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setCoeffA, 1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Μεταβλητή x */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-indigo-700 uppercase block">
                    ΜΕΤΑΒΛΗΤΗ (x)
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setVarX, -1, -15, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                      {varX > 0 ? `＋${varX}` : varX}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setVarX, 1, -15, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Σταθερός Όρος β */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-amber-700 uppercase block">
                    ΣΤΑΘΕΡΟΣ (β)
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setConstB, -1, -20, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                      {constB > 0 ? `＋${constB}` : constB}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setConstB, 1, -20, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Αναλυτική Προβολή (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΝΑΛΥΣΗ ΟΡΩΝ ΠΑΡΑΣΤΑΣΗΣ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    ΜΟΡΦΗ α · x ＋ β
                  </span>
                </div>

                {/* Οπτική Επισήμανση με Χρώματα */}
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 text-center space-y-2">
                  <div className="text-2xl sm:text-4xl font-black flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-sky-300">
                      {coeffA === 1 ? '' : coeffA === -1 ? '－' : coeffA}
                    </span>
                    <span className="text-indigo-300 font-sans">x</span>
                    <span className="text-amber-300">
                      {constB >= 0 ? `＋ ${constB}` : `－ ${Math.abs(constB)}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs font-sans pt-1 flex-wrap">
                    <span className="text-sky-300 font-bold">● Συντελεστής: {coeffA}</span>
                    <span className="text-indigo-300 font-bold">● Μεταβλητή: x</span>
                    <span className="text-amber-300 font-bold">● Σταθερός: {constB}</span>
                  </div>
                </div>

                {/* Αντικατάσταση & Υπολογισμός */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans text-slate-200">
                  <div className="text-indigo-200 font-bold">
                    Υπολογισμός για x ＝ {varX}:
                  </div>
                  <div className="font-mono text-sm sm:text-base pt-1">
                    ＝ ({coeffA}) · ({varX}) {constB >= 0 ? `＋ (${constB})` : `＋ (${constB})`}
                  </div>
                  <div className="font-mono text-sm sm:text-base text-slate-300">
                    ＝ ({variablePartVal}) {constB >= 0 ? `＋ ${constB}` : `－ ${Math.abs(constB)}`}
                  </div>
                </div>

                {/* Τελική Αριθμητική Τιμή */}
                <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-2 text-emerald-300 font-sans">
                  <span className="text-xs sm:text-sm font-bold">
                    ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ ΠΑΡΑΣΤΑΣΗΣ:
                  </span>
                  <span className="text-2xl sm:text-4xl font-black font-mono text-emerald-400">
                    ＝ {totalExprVal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Προβλήματα Καθημερινής Ζωής με Μεταβλητές
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <h3 className="font-bold text-amber-950 text-lg">Πρόβλημα 1: Χρέωση Ταξί</h3>
              <p className="text-slate-700 text-xs sm:text-sm">
                Ένα ταξί έχει πάγια χρέωση (σημαία) <strong>2 €</strong>, ανεξάρτητα από τη διαδρομή. Για κάθε χιλιόμετρο που διανύει χρεώνει <strong>1,5 €</strong>.
              </p>
              <div className="p-3 bg-white rounded-xl border border-amber-200 font-mono text-xs sm:text-sm space-y-1">
                <div>• Μεταβλητή x: τα χιλιόμετρα που διανύσαμε.</div>
                <div>• Συντελεστής: <strong>1,5</strong> (χρέωση ανά km).</div>
                <div>• Σταθερός όρος: <strong>2</strong> (πάγια σημαία).</div>
                <div className="font-bold text-amber-900 pt-1">Τύπος Κόστους: y ＝ 1,5 · x ＋ 2</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <h3 className="font-bold text-emerald-950 text-lg">Πρόβλημα 2: Συνδρομή Γυμναστηρίου</h3>
              <p className="text-slate-700 text-xs sm:text-sm">
                Μια ετήσια εγγραφή σε γυμναστήριο κοστίζει <strong>20 €</strong> (πληρώνεται μία φορά). Η μηνιαία συνδρομή είναι <strong>25 €</strong> τον μήνα.
              </p>
              <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-xs sm:text-sm space-y-1">
                <div>• Μεταβλητή x: το πλήθος των μηνών προπόνησης.</div>
                <div>• Συντελεστής: <strong>25</strong> (κόστος ανά μήνα).</div>
                <div>• Σταθερός όρος: <strong>20</strong> (πάγια εγγραφή).</div>
                <div className="font-bold text-emerald-900 pt-1">Τύπος Κόστους: y ＝ 25 · x ＋ 20</div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΠΡΟΣΟΜΟΙΩΤΗΣ ΠΡΟΒΛΗΜΑΤΟΣ (ΤΑΞΙ) */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Διαδραστικός Προσομοιωτής Κόστους Διαδρομής Ταξί
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Χειριστήρια (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* Χιλιόμετρα (Μεταβλητή x) */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-indigo-900 uppercase block">
                    ΧΙΛΙΟΜΕΤΡΑ ΔΙΑΔΡΟΜΗΣ (ΜΕΤΑΒΛΗΤΗ x)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDistanceKm, -1, 1, 50, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 font-bold text-base font-mono text-indigo-950">
                      x ＝ {distanceKm} km
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDistanceKm, 1, 1, 50, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Πάγια Χρέωση (Σταθερός όρος β) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">
                    ΣΗΜΑΙΑ (ΣΤΑΘΕΡΟΣ β)
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseFee, -0.5, 1, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-slate-900">
                      {baseFee} €
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBaseFee, 0.5, 1, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Τιμή ανά km (Συντελεστής α) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">
                    ΤΙΜΗ/KM (ΣΥΝΤΕΛΕΣΤΗΣ α)
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setRatePerKm, -0.1, 0.5, 3, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-slate-900">
                      {ratePerKm} €
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setRatePerKm, 0.1, 0.5, 3, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Κάρτα Ανάλυσης Κόστους (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΥΠΟΛΟΓΙΣΜΟΣ ΤΕΛΙΚΟΥ ΚΟΣΤΟΥΣ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans">
                    ΚΟΣΤΟΣ ＝ {ratePerKm} · x ＋ {baseFee}
                  </span>
                </div>

                <div className="space-y-2 py-1">
                  <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-black flex-wrap">
                    <span className="text-sky-300 font-sans">({ratePerKm} €/km · {distanceKm} km)</span>
                    <span className="text-slate-400">＋</span>
                    <span className="text-amber-300 font-sans">{baseFee} €</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-2xl sm:text-4xl font-black text-emerald-400 flex-wrap">
                    <span className="text-slate-400">＝</span>
                    <span>{Number((ratePerKm * distanceKm).toFixed(2))} €</span>
                    <span className="text-slate-400 font-sans">＋</span>
                    <span>{baseFee} €</span>
                    <span className="text-slate-400">＝</span>
                    <span>{totalTaxiCost} €</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                  Η μεταβλητή <strong>x ＝ {distanceKm}</strong> άλλαξε το μεταβλητό μέρος του κόστους σε <strong>{Number((ratePerKm * distanceKm).toFixed(2))} €</strong>, ενώ η πάγια σημαία <strong>{baseFee} €</strong> παρέμεινε σταθερή!
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
