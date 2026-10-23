import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// ============================================================================
// ΕΠΑΝΑΧΡΗΣΙΜΟΠΟΙΗΣΙΜΟ COMPONENT ΚΛΑΣΜΑΤΟΣ (Πρόσημο πάντα μπροστά από τη γραμμή)
// ============================================================================
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 align-middle mx-1 font-mono ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-1.5 border-b-2 w-full text-center" style={{ borderColor: 'currentColor' }}>
          {displayNum}
        </span>
        <span className="pt-0.5 px-1.5 w-full text-center">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

const gcd = (a, b) => {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    let t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

export default function ProblimataEksisoseonTheoria() {
  // State για Εργαστήριο 1: Πρόβλημα Μεταφορών (Ταξί)
  // Εξίσωση: a * x + b = c (όπου a = κόστος ανά km, b = πάγια σημαία, c = συνολικό κόστος)
  const [taxiPerKm, setTaxiPerKm] = useState(2); // a (€/km)
  const [taxiBase, setTaxiBase] = useState(4); // b (€ πάγιο)
  const [taxiTotal, setTaxiTotal] = useState(28); // c (€ σύνολο)

  // State για Εργαστήριο 2: Γεωμετρικό Πρόβλημα Περιμέτρου Ορθογωνίου
  // Μήκος = x + diff, Πλάτος = x. Περίμετρος = 2x + 2(x + diff) = 4x + 2*diff = P
  const [rectDiff, setRectDiff] = useState(6); // πόσο μεγαλύτερο είναι το μήκος
  const [rectPerimeter, setRectPerimeter] = useState(52); // συνολική περίμετρος

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Ταξί)
  // ax + b = c  <=>  ax = c - b  <=>  x = (c - b) / a
  const taxiDistNumerator = useMemo(() => taxiTotal - taxiBase, [taxiTotal, taxiBase]);
  const taxiGcd = useMemo(() => gcd(taxiDistNumerator, taxiPerKm), [taxiDistNumerator, taxiPerKm]);
  const taxiSimpNum = useMemo(() => Math.abs(taxiDistNumerator) / taxiGcd, [taxiDistNumerator, taxiGcd]);
  const taxiSimpDen = useMemo(() => Math.abs(taxiPerKm) / taxiGcd, [taxiPerKm, taxiGcd]);
  const isTaxiInteger = taxiSimpDen === 1;
  const taxiFinalKm = useMemo(() => {
    if (taxiPerKm === 0) return 0;
    return Number((taxiDistNumerator / taxiPerKm).toFixed(2));
  }, [taxiDistNumerator, taxiPerKm]);

  // Υπολογισμοί Εργαστηρίου 2 (Ορθογώνιο)
  // 4x + 2*rectDiff = rectPerimeter <=> 4x = rectPerimeter - 2*rectDiff
  const rectConstB = useMemo(() => 2 * rectDiff, [rectDiff]);
  const rectNumerator = useMemo(() => rectPerimeter - rectConstB, [rectPerimeter, rectConstB]);
  const rectWidthX = useMemo(() => {
    return Number((rectNumerator / 4).toFixed(2));
  }, [rectNumerator]);
  const rectLengthVal = useMemo(() => {
    return Number((rectWidthX + rectDiff).toFixed(2));
  }, [rectWidthX, rectDiff]);
  const isRectValid = rectWidthX > 0;

  return (
    <Layout
      title="Προβλήματα με Εξισώσεις αx + β = γ | Α' Γυμνασίου"
      description="Επίλυση προβλημάτων καθημερινής ζωής με εξισώσεις, μεθοδολογία τεσσάρων σταδίων, κλασματική επίλυση και διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/34-problimata-eksisoseon-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 32 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Επίλυση Προβλημάτων με Εξισώσεις
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε πώς να μετατρέπουμε καταστάσεις της καθημερινής ζωής (αγορές, χρεώσεις υπηρεσιών, ηλικίες, γεωμετρικά σχήματα) σε εξισώσεις της μορφής α·x ＋ β ＝ γ και να βρίσκουμε τις απαντήσεις με μεθοδικότητα.
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
              Τα 4 Στάδια για την Επίλυση κάθε Προβλήματος
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Στάδιο 1 */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                  ΣΤΑΔΙΟ 1
                </span>
                <h3 className="font-bold text-slate-900 text-base">Επιλογή Αγνώστου</h3>
                <p className="text-slate-600">
                  Διαβάζουμε προσεκτικά την εκφώνηση, ξεχωρίζουμε τα δεδομένα και ορίζουμε με ένα γράμμα (συνήθως <strong>x</strong>) την ποσότητα που αναζητούμε, προσδιορίζοντας τη μονάδα μέτρησης (π.χ. €, km, έτη).
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-indigo-100 text-indigo-950 font-bold text-center font-mono text-xs">
                «Έστω x τα χιλιόμετρα»
              </div>
            </div>

            {/* Στάδιο 2 */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded inline-block">
                  ΣΤΑΔΙΟ 2
                </span>
                <h3 className="font-bold text-slate-900 text-base">Κατασκευή Εξίσωσης</h3>
                <p className="text-slate-600">
                  Μεταφράζουμε τις λεκτικές σχέσεις του προβλήματος σε μαθηματική γλώσσα, συνδέοντας τα δεδομένα με τον άγνωστο x σε μια ισότητα δύο μελών.
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-sky-100 text-sky-950 font-bold text-center font-mono text-xs">
                α · x ＋ β ＝ γ
              </div>
            </div>

            {/* Στάδιο 3 */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                  ΣΤΑΔΙΟ 3
                </span>
                <h3 className="font-bold text-slate-900 text-base">Επίλυση Εξίσωσης</h3>
                <p className="text-slate-600">
                  Χωρίζουμε γνωστούς από αγνώστους, κάνουμε αναγωγή ομοίων όρων και διαιρούμε με τον συντελεστή του x, εκφράζοντας το αποτέλεσμα σε <strong>μορφή κλάσματος</strong>.
                </p>
              </div>
              <div className="p-1.5 bg-white rounded-lg border border-amber-100 text-amber-950 font-bold text-center font-mono text-xs flex items-center justify-center">
                <span>x ＝ </span>
                <Frac num="γ － β" den="α" />
              </div>
            </div>

            {/* Στάδιο 4 */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                  ΣΤΑΔΙΟ 4
                </span>
                <h3 className="font-bold text-slate-900 text-base">Έλεγχος & Απάντηση</h3>
                <p className="text-slate-600">
                  Ελέγχουμε αν η λύση που βρήκαμε είναι λογική για τις συνθήκες του προβλήματος (π.χ. ένα μήκος δεν μπορεί να είναι αρνητικό, ο αριθμός ανθρώπων πρέπει να είναι φυσικός) και διατυπώνουμε την τελική απάντηση.
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-emerald-100 text-emerald-950 font-bold text-center font-mono text-xs">
                «Διανύθηκαν 12 km»
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΕΡΓΑΣΤΗΡΙΟ 1: ΠΡΟΒΛΗΜΑ ΚΟΣΤΟΥΣ ΜΕΤΑΦΟΡΑΣ (ΤΑΞΙ) */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              🛠️ Εργαστήριο 1: Διαδραστικό Πρόβλημα Μεταφοράς (Κόστος Διαδρομής)
            </h2>
          </div>

          <div className="space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
            <p>
              <strong>Εκφώνηση:</strong> Ένα ταξί έχει πάγια χρέωση εκκίνησης (σημαία) <strong>{taxiBase} €</strong> και χρεώνει επιπλέον <strong>{taxiPerKm} €</strong> για κάθε χιλιόμετρο διαδρομής. Αν ο επιβάτης πλήρωσε συνολικά <strong>{taxiTotal} €</strong>, πόσα χιλιόμετρα διένυσε;
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Steppers (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block">ΧΡΕΩΣΗ/KM (α)</label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTaxiPerKm, -1, 1, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                    {taxiPerKm} €
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTaxiPerKm, 1, 1, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">ΣΗΜΑΙΑ (β)</label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTaxiBase, -1, 1, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-slate-800">
                    {taxiBase} €
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTaxiBase, 1, 1, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-700 uppercase block">ΣΥΝΟΛΟ (γ)</label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTaxiTotal, -2, 10, 60, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                    {taxiTotal} €
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTaxiTotal, 2, 10, 60, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>
            </div>

            {/* Αναλυτική Επίλυση Βήμα-Βήμα (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  ΡΟΗ ΕΠΙΛΥΣΗΣ ΜΕ ΕΞΙΣΩΣΗ
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                  ΑΠΟΤΕΛΕΣΜΑ: {taxiFinalKm} KM
                </span>
              </div>

              <div className="space-y-3 font-sans text-xs sm:text-sm">
                <div className="p-3 bg-white/10 rounded-xl border border-white/10 space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Στάδιο 1 & 2: Ορισμός Αγνώστου & Εξίσωση</div>
                  <div className="text-slate-200">Έστω <strong>x</strong> τα χιλιόμετρα της διαδρομής.</div>
                  <div className="text-amber-300 font-mono font-bold text-sm sm:text-base pt-0.5">
                    {taxiPerKm} · x ＋ {taxiBase} ＝ {taxiTotal}
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Στάδιο 3: Επίλυση της Εξίσωσης</div>
                  <div className="text-slate-200 font-mono">
                    {taxiPerKm} · x ＝ {taxiTotal} － {taxiBase} ➔ {taxiPerKm} · x ＝ {taxiDistNumerator}
                  </div>
                  <div className="font-mono text-emerald-400 text-sm sm:text-base font-bold flex items-center flex-wrap pt-1">
                    <span>x ＝ </span>
                    <Frac num={taxiDistNumerator} den={taxiPerKm} />
                    {!isTaxiInteger && (
                      <>
                        <span>＝ </span>
                        <Frac num={taxiSimpNum} den={taxiSimpDen} />
                      </>
                    )}
                    <span>＝ {taxiFinalKm} km</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-emerald-300 space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Στάδιο 4: Επαλήθευση & Τελική Απάντηση</div>
                  <div>
                    Έλεγχος: {taxiPerKm} · {taxiFinalKm} ＋ {taxiBase} ＝ {taxiPerKm * taxiFinalKm} ＋ {taxiBase} ＝ {taxiTotal} €.
                  </div>
                  <div className="font-bold text-white">
                    Απάντηση: Ο επιβάτης διένυσε ακριβώς <strong>{taxiFinalKm} χιλιόμετρα</strong>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΕΡΓΑΣΤΗΡΙΟ 2: ΓΕΩΜΕΤΡΙΚΟ ΠΡΟΒΛΗΜΑ ΠΕΡΙΜΕΤΡΟΥ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              🛠️ Εργαστήριο 2: Γεωμετρικό Πρόβλημα (Διαστάσεις Οικοπέδου)
            </h2>
          </div>

          <div className="space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
            <p>
              <strong>Εκφώνηση:</strong> Ένα ορθογώνιο οικόπεδο έχει μήκος κατά <strong>{rectDiff} μέτρα μεγαλύτερο</strong> από το πλάτος του. Αν η περίμετρος του οικοπέδου είναι <strong>{rectPerimeter} μέτρα</strong>, ποιες είναι οι διαστάσεις του;
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Steppers (5 cols) */}
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block">
                  ΔΙΑΦΟΡΑ ΜΗΚΟΥΣ ΑΠΟ ΠΛΑΤΟΣ (m)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setRectDiff, -1, 1, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                    ＋{rectDiff} m
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setRectDiff, 1, 1, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-700 uppercase block">
                  ΣΥΝΟΛΙΚΗ ΠΕΡΙΜΕΤΡΟΣ (m)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setRectPerimeter, -4, 24, 120, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-amber-50 rounded-xl border border-amber-200 font-bold text-sm font-mono text-amber-950">
                    Π ＝ {rectPerimeter} m
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setRectPerimeter, 4, 24, 120, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div>• Πλάτος: <strong>x</strong></div>
                <div>• Μήκος: <strong>x ＋ {rectDiff}</strong></div>
                <div>• Περίμετρος: 2 · x ＋ 2 · (x ＋ {rectDiff}) ＝ 4x ＋ {rectConstB}</div>
              </div>
            </div>

            {/* Οπτική Προβολή SVG & Λύση (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  ΓΕΩΜΕΤΡΙΚΗ ΜΟΝΤΕΛΟΠΟΙΗΣΗ
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                  Π ＝ {rectPerimeter} M
                </span>
              </div>

              {/* Responsive SVG Σχήμα (Χωρίς Scroll) */}
              <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-4 flex justify-center">
                <svg viewBox="0 0 340 160" className="w-full max-w-[320px] h-auto">
                  <rect x="35" y="30" width="270" height="95" rx="6" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2.5" />
                  {/* Ετικέτες Διαστάσεων */}
                  <text x="170" y="22" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Μήκος: x ＋ {rectDiff} {isRectValid ? `(${rectLengthVal} m)` : ''}
                  </text>
                  <text x="170" y="145" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Μήκος: x ＋ {rectDiff}
                  </text>
                  <text x="25" y="82" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="end">
                    x {isRectValid ? `(${rectWidthX} m)` : ''}
                  </text>
                  <text x="315" y="82" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="start">
                    x
                  </text>
                </svg>
              </div>

              {/* Βήματα Επίλυσης */}
              <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1.5 text-slate-200">
                <div className="font-mono text-amber-300 font-bold text-sm sm:text-base">
                  Εξίσωση: 4 · x ＋ {rectConstB} ＝ {rectPerimeter}
                </div>
                <div className="font-mono text-indigo-200">
                  4 · x ＝ {rectPerimeter} － {rectConstB} ➔ 4 · x ＝ {rectNumerator}
                </div>
                {isRectValid ? (
                  <div className="pt-1 text-emerald-300 space-y-1">
                    <div className="flex items-center font-mono font-bold text-sm sm:text-base">
                      <span>x ＝ </span>
                      <Frac num={rectNumerator} den={4} />
                      <span> ＝ {rectWidthX} m (Πλάτος)</span>
                    </div>
                    <div>
                      Μήκος: {rectWidthX} ＋ {rectDiff} ＝ <strong>{rectLengthVal} m</strong>.
                    </div>
                  </div>
                ) : (
                  <div className="text-rose-400 font-bold pt-1">
                    ⚠️ Η περίμετρος είναι πολύ μικρή για τη συγκεκριμένη διαφορά μήκους.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΣΥΝΗΘΗ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              Χαρακτηριστικές Κατηγορίες Προβλημάτων
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Κατηγορία 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">ΚΑΤΗΓΟΡΙΑ 1</div>
              <h3 className="font-bold text-slate-900 text-base">Διαδοχικοί Αριθμοί</h3>
              <p className="text-slate-600">
                Όταν δύο ή τρεις αριθμοί είναι διαδοχικοί ακέραιοι, τους συμβολίζουμε ως <strong>x</strong>, <strong>x ＋ 1</strong>, <strong>x ＋ 2</strong>.
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
                x ＋ (x ＋ 1) ＝ 45 ➔ 2x ＋ 1 ＝ 45 ➔ 2x ＝ 44 ➔ x ＝ 22
              </div>
            </div>

            {/* Κατηγορία 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">ΚΑΤΗΓΟΡΙΑ 2</div>
              <h3 className="font-bold text-slate-900 text-base">Ηλικίες</h3>
              <p className="text-slate-600">
                Η διαφορά ηλικίας δύο ανθρώπων παραμένει <strong>πάντα σταθερή</strong> με το πέρασμα των χρόνων.
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
                x ＋ (x ＋ 26) ＝ 40 ➔ 2x ＝ 14 ➔ x ＝ 7 ετών
              </div>
            </div>

            {/* Κατηγορία 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">ΚΑΤΗΓΟΡΙΑ 3</div>
              <h3 className="font-bold text-slate-900 text-base">Καταμερισμός Ποσού</h3>
              <p className="text-slate-600">
                Ένα ποσό μοιράζεται σε μέρη όπου το ένα εξαρτάται από το άλλο (π.χ. το διπλάσιο συν ένα σταθερό ποσό).
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
                x ＋ 2x ＋ 10 ＝ 100 ➔ 3x ＝ 90 ➔ x ＝ 30 €
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
