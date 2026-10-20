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

export default function ParastaseisTheoria() {
  // State για Εργαστήριο 1: Πρόβλημα Κινηματογράφου (Εισιτήριο + Popcorn)
  const [ticketPrice, setTicketPrice] = useState(7);
  const [popcornPrice, setPopcornPrice] = useState(3.5);
  const [isVariableMode, setIsVariableMode] = useState(false); // false: Αριθμητική (σταθερό πλήθος), true: Αλγεβρική (με x)
  const [personCount, setPersonCount] = useState(4); // όταν είναι σε αριθμητική λειτουργία

  // State για Εργαστήριο 2: Γεωμετρικό Πρόβλημα (Οικόπεδο με μεταβλητή x)
  // Οικόπεδο: Ορθογώνιο (πλάτος 6 m, μήκος x + 4 m) και προσαρτημένο τετράγωνο (πλευράς x m)
  const [geoX, setGeoX] = useState(5);

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
  const costPerPerson = useMemo(() => ticketPrice + popcornPrice, [ticketPrice, popcornPrice]);
  const totalNumericCost = useMemo(() => personCount * costPerPerson, [personCount, costPerPerson]);

  // Υπολογισμοί Εργαστηρίου 2 (Οικόπεδο)
  // Ορθογώνιο: Μήκος = x + 4, Πλάτος = 6 -> Εμβαδόν 1 = 6*(x + 4) = 6x + 24
  // Τετράγωνο: Πλευρά = x -> Εμβαδόν 2 = x * x = x^2
  const rectLength = useMemo(() => geoX + 4, [geoX]);
  const rectArea = useMemo(() => 6 * rectLength, [rectLength]);
  const squareArea = useMemo(() => geoX * geoX, [geoX]);
  const totalArea = useMemo(() => rectArea + squareArea, [rectArea, squareArea]);

  return (
    <Layout
      title="Αριθμητικές & Αλγεβρικές Παραστάσεις σε Προβλήματα | Α' Γυμνασίου"
      description="Η έννοια της αριθμητικής και της αλγεβρικής παράστασης, μαθηματική μοντελοποίηση προβλημάτων και διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/28-parastaseis-ask"
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
              Αριθμητικές & Αλγεβρικές Παραστάσεις σε Προβλήματα
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε πώς να διακρίνουμε τις αριθμητικές από τις αλγεβρικές παραστάσεις και πώς να μεταφράζουμε προβλήματα της καθημερινής ζωής στη γλώσσα των Μαθηματικών.
            </p>
          </div>
        </section>

        {/* 1. Η ΔΙΑΦΟΡΑ ΑΡΙΘΜΗΤΙΚΗΣ ΚΑΙ ΑΛΓΕΒΡΙΚΗΣ ΠΑΡΑΣΤΑΣΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Αριθμητική vs Αλγεβρική Παράσταση
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Αριθμητική Παράσταση */}
            <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-indigo-700 tracking-wider">
                  ΜΟΡΦΗ 1: ΜΟΝΟ ΑΡΙΘΜΟΙ
                </span>
                <h3 className="font-bold text-slate-900 text-lg">Αριθμητική Παράσταση</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Είναι μια μαθηματική έκφραση που περιέχει <strong>αποκλειστικά αριθμούς και πράξεις</strong> μεταξύ τους. Έχει μία <strong>συγκεκριμένη και σταθερή αριθμητική τιμή</strong>.
                </p>
                <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950 space-y-1">
                  <div>• 3 · 4 ＋ 5 ＝ 12 ＋ 5 ＝ <strong>17</strong></div>
                  <div>• (18 － 6) ： 2 ＝ 12 ： 2 ＝ <strong>6</strong></div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 italic pt-2">
                Χρησιμοποιείται όταν όλα τα δεδομένα του προβλήματος είναι ήδη γνωστά.
              </div>
            </div>

            {/* Αλγεβρική Παράσταση */}
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-amber-800 tracking-wider">
                  ΜΟΡΦΗ 2: ΜΕ ΜΕΤΑΒΛΗΤΗ
                </span>
                <h3 className="font-bold text-slate-900 text-lg">Αλγεβρική Παράσταση</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Είναι μια μαθηματική έκφραση που περιέχει <strong>αριθμούς, πράξεις και τουλάχιστον μία μεταβλητή (γράμμα)</strong>. Η τιμή της μεταβάλλεται ανάλογα με την τιμή που δίνουμε στη μεταβλητή.
                </p>
                <div className="p-3 bg-white rounded-xl border border-amber-100 font-mono text-xs sm:text-sm text-amber-950 space-y-1">
                  <div>• 3 · x ＋ 5 (εξαρτάται από το x)</div>
                  <div>• 2 · α ＋ 4 · β (εξαρτάται από τα α και β)</div>
                </div>
              </div>
              <div className="text-[11px] text-amber-900 font-semibold pt-2">
                Χρησιμοποιείται όταν ένα μέγεθος είναι άγνωστο ή μεταβάλλεται.
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΕΡΓΑΣΤΗΡΙΟ 1: ΑΠΟ ΤΟ ΠΡΟΒΛΗΜΑ ΣΤΗΝ ΠΑΡΑΣΤΑΣΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Μοντελοποίηση Προβλήματος: Έξοδος στον Κινηματογράφο
            </h2>
          </div>

          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            <p>
              <strong>Πρόβλημα:</strong> Σε έναν κινηματογράφο, κάθε εισιτήριο κοστίζει <strong>{ticketPrice} €</strong> και κάθε ποπ κορν κοστίζει <strong>{popcornPrice.toString().replace('.', ',')} €</strong>. Αν κάθε άτομο πάρει 1 εισιτήριο και 1 ποπ κορν:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600">
              <li>Αν γνωρίζουμε το πλήθος των ατόμων (π.χ. 4 άτομα), γράφουμε <strong>αριθμητική παράσταση</strong>.</li>
              <li>Αν το πλήθος είναι άγνωστο (<strong>x άτομα</strong>), γράφουμε <strong>αλγεβρική παράσταση</strong>.</li>
            </ul>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1 */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 1: Διαδραστικός Μετατροπέας Παράστασης
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Χειριστήρια (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* Επιλογή Τύπου Παράστασης */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase block">
                    ΤΥΠΟΣ ΠΑΡΑΣΤΑΣΗΣ
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVariableMode(false)}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                        !isVariableMode
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      ΑΡΙΘΜΗΤΙΚΗ (ΣΤΑΘΕΡΟ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsVariableMode(true)}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                        isVariableMode
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      ΑΛΓΕΒΡΙΚΗ (ΜΕ x)
                    </button>
                  </div>
                </div>

                {/* Πλήθος ατόμων (μόνο αν είναι αριθμητική) */}
                {!isVariableMode && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <label className="text-xs font-bold text-indigo-900 uppercase block">
                      ΠΛΗΘΟΣ ΑΤΟΜΩΝ
                    </label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setPersonCount, -1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 font-bold text-base font-mono text-indigo-950">
                        {personCount} άτομα
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setPersonCount, 1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                )}

                {/* Τιμές Εισιτηρίου & Popcorn */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">ΕΙΣΙΤΗΡΙΟ (€)</label>
                    <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setTicketPrice, -1, 4, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono">
                        {ticketPrice} €
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setTicketPrice, 1, 4, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">ΠΟΠ ΚΟΡΝ (€)</label>
                    <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setPopcornPrice, -0.5, 1, 8, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono">
                        {popcornPrice.toString().replace('.', ',')} €
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setPopcornPrice, 0.5, 1, 8, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος Μοντελοποίησης (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΜΑΘΗΜΑΤΙΚΗ ΜΟΝΤΕΛΟΠΟΙΗΣΗ
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    isVariableMode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                      : 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30'
                  }`}>
                    {isVariableMode ? 'ΑΛΓΕΒΡΙΚΗ ΠΑΡΑΣΤΑΣΗ' : 'ΑΡΙΘΜΗΤΙΚΗ ΠΑΡΑΣΤΑΣΗ'}
                  </span>
                </div>

                {!isVariableMode ? (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-400 font-sans">
                      Υπολογισμός συνολικού κόστους για {personCount} άτομα:
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-amber-300 break-words">
                      {personCount} · ({ticketPrice} ＋ {popcornPrice.toString().replace('.', ',')})
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-emerald-400">
                      ＝ {personCount} · {costPerPerson.toString().replace('.', ',')} ＝ {totalNumericCost.toString().replace('.', ',')} €
                    </div>
                    <p className="text-xs font-sans text-slate-300 pt-1 border-t border-slate-800">
                      Επειδή γνωρίζουμε τον αριθμό των ατόμων ({personCount}), σχηματίσαμε μια <strong>αριθμητική παράσταση</strong> που δίνει συγκεκριμένο αποτέλεσμα ({totalNumericCost.toString().replace('.', ',')} €).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-400 font-sans">
                      Γενικός τύπος κόστους για άγνωστο πλήθος <strong>x</strong> ατόμων:
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-amber-300 break-words">
                      x · ({ticketPrice} ＋ {popcornPrice.toString().replace('.', ',')})
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-emerald-400">
                      ＝ {costPerPerson.toString().replace('.', ',')} · x
                    </div>
                    <p className="text-xs font-sans text-slate-300 pt-1 border-t border-slate-800">
                      Επειδή το πλήθος των ατόμων είναι μεταβλητό (<strong>x</strong>), σχηματίσαμε μια <strong>αλγεβρική παράσταση</strong> με συντελεστή <strong>{costPerPerson.toString().replace('.', ',')}</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΓΕΩΜΕΤΡΙΚΑ ΠΡΟΒΛΗΜΑΤΑ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Γεωμετρικά Προβλήματα με Μεταβλητές (Εμβαδόν & Περίμετρος)
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            Σε πολλά προβλήματα γεωμετρίας οι διαστάσεις ενός οικοπέδου ή ενός σχήματος δεν είναι όλες σταθερές αλλά εξαρτώνται από μια μεταβλητή <strong>x</strong>.
          </p>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΓΕΩΜΕΤΡΙΚΟ ΟΙΚΟΠΕΔΟ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Εμβαδόν Σύνθετου Οικοπέδου
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Stepper x (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-indigo-900 uppercase mb-1">
                    ΜΕΤΑΒΛΗΤΗ x (ΜΕΤΡΑ)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoX, -1, 2, 12, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 font-bold text-base font-mono text-indigo-950">
                      x ＝ {geoX} m
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoX, 1, 2, 12, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-600 space-y-1.5 font-mono">
                  <div className="font-bold text-slate-900 font-sans">Διαστάσεις Τμημάτων:</div>
                  <div>• Ορθογώνιο: Μήκος ＝ x ＋ 4 ＝ {rectLength} m, Πλάτος ＝ 6 m</div>
                  <div>• Τετράγωνο: Πλευρά ＝ x ＝ {geoX} m</div>
                </div>
              </div>

              {/* Οπτική Προβολή & Υπολογισμός (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΣΥΝΟΛΙΚΟ ΕΜΒΑΔΟΝ ΟΙΚΟΠΕΔΟΥ
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold font-sans">
                    Ε ＝ Ε₁ ＋ Ε₂
                  </span>
                </div>

                {/* Responsive SVG Σχήμα Οικοπέδου (Χωρίς οριζόντιο scroll) */}
                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-4 flex justify-center">
                  <svg viewBox="0 0 340 180" className="w-full max-w-[320px] h-auto">
                    {/* Ορθογώνιο Ε1 */}
                    <rect x="20" y="30" width="180" height="110" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
                    <text x="110" y="85" fill="#a5b4fc" fontSize="13" fontWeight="bold" textAnchor="middle">Ε₁ (Ορθογώνιο)</text>
                    <text x="110" y="103" fill="#818cf8" fontSize="11" textAnchor="middle">6 · (x ＋ 4)</text>
                    <text x="110" y="20" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">x ＋ 4 ({rectLength} m)</text>
                    <text x="10" y="90" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="end">6 m</text>

                    {/* Τετράγωνο Ε2 */}
                    <rect x="200" y="60" width="80" height="80" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    <text x="240" y="105" fill="#fde68a" fontSize="12" fontWeight="bold" textAnchor="middle">Ε₂</text>
                    <text x="240" y="120" fill="#fcd34d" fontSize="10" textAnchor="middle">x²</text>
                    <text x="240" y="52" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">x ({geoX} m)</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1.5 text-slate-200">
                  <div>
                    <strong>1. Αλγεβρική Παράσταση Εμβαδού:</strong>
                  </div>
                  <div className="font-mono text-indigo-200 text-xs sm:text-sm">
                    Ε ＝ 6 · (x ＋ 4) ＋ x² ＝ x² ＋ 6x ＋ 24
                  </div>
                  <div className="pt-1.5 border-t border-white/10">
                    <strong>2. Αριθμητική Τιμή για x ＝ {geoX} m:</strong>
                  </div>
                  <div className="font-mono text-emerald-400 font-bold text-sm sm:text-base">
                    Ε ＝ {geoX}² ＋ 6 · {geoX} ＋ 24 ＝ {squareArea} ＋ {rectArea} ＝ {totalArea} τ.μ.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
