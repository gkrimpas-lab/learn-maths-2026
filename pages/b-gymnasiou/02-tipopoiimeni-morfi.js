import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// ==========================================
// ΡΥΘΜΙΣΕΙΣ & ΟΡΙΑ ΕΡΓΑΣΤΗΡΙΩΝ
// ==========================================
export const LAB_CONFIG = {
  lab1: {
    mantissaInt: { min: -99, max: 99, default: 4 },
    mantissaDec: { min: 0, max: 9, default: 5 },
    exp: { min: -12, max: 12, default: 6 },
  },
  lab2: {
    presets: [
      { name: 'Διάμετρος ατόμου υδρογόνου', valueStr: '0,0000000001 m', a: 1, exp: -10, unit: 'm', type: 'micro' },
      { name: 'Μέγεθος ιού γρίπης', valueStr: '0,00000012 m', a: 1.2, exp: -7, unit: 'm', type: 'micro' },
      { name: 'Ερυθρό αιμοσφαίριο', valueStr: '0,0000075 m', a: 7.5, exp: -6, unit: 'm', type: 'micro' },
      { name: 'Πληθυσμός Ελλάδας', valueStr: '10.400.000 κάτοικοι', a: 1.04, exp: 7, unit: 'κάτοικοι', type: 'macro' },
      { name: 'Ταχύτητα του φωτός', valueStr: '300.000.000 m/s', a: 3, exp: 8, unit: 'm/s', type: 'macro' },
      { name: 'Απόσταση Γης - Ήλιου', valueStr: '150.000.000.000 m', a: 1.5, exp: 11, unit: 'm', type: 'macro' },
    ]
  }
};

// Component Frac με απόλυτα ασφαλή ανίχνευση προσήμου και τοποθέτηση του μείον μπροστά
const Frac = ({ num, den, className = "" }) => {
  const numStr = String(num).trim();
  const denStr = String(den).trim();

  const isNumNeg = numStr.startsWith('-');
  const isDenNeg = denStr.startsWith('-');
  const isNegative = (isNumNeg && !isDenNeg) || (!isNumNeg && isDenNeg);

  const cleanNum = numStr.replace('-', '');
  const cleanDen = denStr.replace('-', '');

  return (
    <span className={`inline-flex items-center align-middle mx-1 font-mono font-semibold ${className}`}>
      {isNegative && <span className="mr-0.5 text-base sm:text-lg font-bold">-</span>}
      <span className="inline-flex flex-col items-center text-center leading-none text-xs sm:text-sm">
        <span className="border-b border-current px-1 pb-0.5">{cleanNum}</span>
        <span className="pt-0.5 px-1">{cleanDen}</span>
      </span>
    </span>
  );
};

export default function TipopoiimeniMorfiTheoria() {
  // State Εργαστηρίου 1: Δυναμικός Μετατροπέας
  const [mInt, setMInt] = useState(LAB_CONFIG.lab1.mantissaInt.default);
  const [mDec, setMDec] = useState(LAB_CONFIG.lab1.mantissaDec.default);
  const [exp, setExp] = useState(LAB_CONFIG.lab1.exp.default);

  // State Εργαστηρίου 2: Κλίμακα του Κόσμου
  const [selectedPreset, setSelectedPreset] = useState(0);

  // Stepper handler με touch-manipulation και αποτροπή event propagation
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1
  const mantissaValue = useMemo(() => {
    const sign = mInt < 0 ? -1 : 1;
    const absInt = Math.abs(mInt);
    const val = sign * (absInt + mDec / 10);
    return Number(val.toFixed(2));
  }, [mInt, mDec]);

  // Μετατροπή σε κανονική τυποποιημένη μορφή (όπου 1 <= |a| < 10)
  const standardized = useMemo(() => {
    if (mantissaValue === 0) {
      return { a: 0, k: 0, steps: 0, direction: 'none', rawValue: 0 };
    }
    const absVal = Math.abs(mantissaValue);
    let shift = 0;
    let tempA = absVal;

    if (tempA >= 10) {
      while (tempA >= 10) {
        tempA /= 10;
        shift += 1;
      }
    } else if (tempA < 1) {
      while (tempA < 1) {
        tempA *= 10;
        shift -= 1;
      }
    }

    const finalA = (mantissaValue < 0 ? -1 : 1) * Number(tempA.toFixed(4));
    const finalK = exp + shift;
    const rawVal = mantissaValue * Math.pow(10, exp);

    return {
      a: finalA,
      k: finalK,
      shift,
      rawVal
    };
  }, [mantissaValue, exp]);

  const preset = LAB_CONFIG.lab2.presets[selectedPreset];

  return (
    <Layout
      title="Τυποποιημένη Μορφή Αριθμών | Β' Γυμνασίου"
      description="Θεωρία, κανόνες και διαδραστικά εργαστήρια για την τυποποιημένη (επιστημονική) μορφή ρητών αριθμών για τη Β' Γυμνασίου."
      backUrl="/b-gymnasiou"
      backText="Β' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/b-gymnasiou/02-tipopoiimeni-morfi-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>ΑΣΚΗΣΕΙΣ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        
        {/* Banner Header - Ενιαίο Indigo Theme */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 2
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase">
              ΤΥΠΟΠΟΙΗΜΕΝΗ ΜΟΡΦΗ ΡΗΤΩΝ ΑΡΙΘΜΩΝ
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μάθε πώς γράφουμε εξαιρετικά μεγάλους ή εξαιρετικά μικρούς αριθμούς με σύντομο, κομψό και τυποποιημένο τρόπο, αξιοποιώντας τις δυνάμεις του 10 με ακέραιο εκθέτη.
            </p>
          </div>
        </section>

        {/* 1. ΕΝΝΟΙΑ & ΟΡΙΣΜΟΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Τι Είναι η Τυποποιημένη Μορφή;
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                Στην καθημερινή ζωή και τις επιστήμες συναντάμε συχνά αριθμούς με πάρα πολλά ψηφία:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm sm:text-base">
                <li>Απόσταση Γης - Ήλιου: <strong className="text-slate-900 font-mono">150.000.000.000 m</strong></li>
                <li>Μάζα μορίου νερού: <strong className="text-slate-900 font-mono">0,00000000000000000000003 g</strong></li>
              </ul>
              <p>
                Για να διαβάζονται εύκολα και να αποφεύγονται λάθη στα μηδενικά, γράφουμε τους αριθμούς στην <strong>τυποποιημένη (ή επιστημονική) μορφή</strong>:
              </p>
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 font-bold text-center text-lg sm:text-2xl font-mono shadow-inner">
                α · 10<sup>κ</sup>
              </div>
            </div>

            {/* Κανόνες για το α και το κ */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ΟΙ ΔΥΟ ΑΠΑΡΑΒΙΑΣΤΟΙ ΚΑΝΟΝΕΣ
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs uppercase font-bold tracking-wider text-indigo-600">ΚΑΝΟΝΑΣ 1: Ο ΣΥΝΤΕΛΕΣΤΗΣ α</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-slate-900">1 ≤ |α| &lt; 10</div>
                  <p className="text-xs text-slate-500 font-sans">
                    Το α έχει ακριβώς <strong>ένα μη μηδενικό ψηφίο</strong> αριστερά από την υποδιαστολή (δηλαδή από 1 έως 9,999...).
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs uppercase font-bold tracking-wider text-indigo-600">ΚΑΝΟΝΑΣ 2: Ο ΕΚΘΕΤΗΣ κ</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-slate-900">κ ∈ ℤ (Ακέραιος Αριθμός)</div>
                  <p className="text-xs text-slate-500 font-sans">
                    • Αν ο αρχικός αριθμός είναι <span className="font-semibold text-slate-800">μεγάλος (≥ 10)</span>, ο εκθέτης είναι <strong>θετικός</strong> (κ &gt; 0).<br />
                    • Αν ο αρχικός αριθμός είναι <span className="font-semibold text-slate-800">μικρός (&lt; 1)</span>, ο εκθέτης είναι <strong>αρνητικός</strong> (κ &lt; 0).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΠΩΣ ΜΕΤΑΤΡΕΠΟΥΜΕ ΕΝΑΝ ΑΡΙΘΜΟ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Μέθοδος Μετατροπής: Μετακίνηση της Υποδιαστολής
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Μεγάλοι αριθμοί */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="text-xs uppercase font-bold tracking-wider text-amber-700">ΠΕΡΙΠΤΩΣΗ Α</div>
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl">Μεγάλοι Αριθμοί (Αριστερή Μετακίνηση)</h3>
              <p className="text-sm text-slate-600">
                Μετακινούμε την υποδιαστολή προς τα <strong>αριστερά</strong> μέχρι να μείνει μόνο ένα ψηφίο πριν από αυτήν. Το πλήθος των θέσεων που μετακινηθήκαμε είναι ο <strong>θετικός εκθέτης</strong>.
              </p>
              <div className="p-4 bg-white rounded-xl border border-slate-200 font-mono text-center space-y-1">
                <div className="text-slate-500 text-xs font-sans">Παράδειγμα: 5.400.000</div>
                <div className="text-base sm:text-lg font-bold text-slate-900">5.400.000 ＝ 5,4 · 10<sup>6</sup></div>
                <div className="text-xs text-indigo-600 font-sans">Μετακίνηση 6 θέσεις αριστερά → κ = +6</div>
              </div>
            </div>

            {/* Μικροί αριθμοί */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="text-xs uppercase font-bold tracking-wider text-indigo-700">ΠΕΡΙΠΤΩΣΗ Β</div>
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl">Μικροί Δεκαδικοί (Δεξιά Μετακίνηση)</h3>
              <p className="text-sm text-slate-600">
                Μετακινούμε την υποδιαστολή προς τα <strong>δεξιά</strong> μέχρι να συναντήσουμε το πρώτο μη μηδενικό ψηφίο. Το πλήθος των θέσεων που μετακινηθήκαμε είναι ο <strong>αρνητικός εκθέτης</strong>.
              </p>
              <div className="p-4 bg-white rounded-xl border border-slate-200 font-mono text-center space-y-1">
                <div className="text-slate-500 text-xs font-sans">Παράδειγμα: 0,00038</div>
                <div className="text-base sm:text-lg font-bold text-slate-900">0,00038 ＝ 3,8 · 10<sup>-4</sup></div>
                <div className="text-xs text-indigo-600 font-sans">Μετακίνηση 4 θέσεις δεξιά → κ = -4</div>
              </div>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο 1: Δυναμικός Μετατροπέας */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                🛠️ Διαδραστικό Εργαστήριο 1: Πειραματικός Μετατροπέας Αριθμών
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Ρύθμισε τον συντελεστή και τον εκθέτη του 10
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Χειριστήρια Steppers */}
              <div className="space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ΑΚΕΡΑΙΟ ΜΕΡΟΣ ΣΥΝΤΕΛΕΣΤΗ (±1)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setMInt, -1, LAB_CONFIG.lab1.mantissaInt.min, LAB_CONFIG.lab1.mantissaInt.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {mInt}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setMInt, 1, LAB_CONFIG.lab1.mantissaInt.min, LAB_CONFIG.lab1.mantissaInt.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ΔΕΚΑΔΙΚΟ ΜΕΡΟΣ ΣΥΝΤΕΛΕΣΤΗ (±0,1)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setMDec, -1, LAB_CONFIG.lab1.mantissaDec.min, LAB_CONFIG.lab1.mantissaDec.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      ,{mDec}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setMDec, 1, LAB_CONFIG.lab1.mantissaDec.min, LAB_CONFIG.lab1.mantissaDec.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ΕΚΘΕΤΗΣ ΤΟΥ 10 (κ)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExp, -1, LAB_CONFIG.lab1.exp.min, LAB_CONFIG.lab1.exp.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2 font-mono">
                      {exp}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExp, 1, LAB_CONFIG.lab1.exp.min, LAB_CONFIG.lab1.exp.max, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Παρουσίαση Αποτελέσματος & Ανάλυσης */}
              <div className="lg:col-span-2 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-6 rounded-2xl text-white space-y-4 shadow-md font-mono">
                <div className="text-center space-y-2">
                  <div className="text-xs uppercase tracking-widest text-indigo-300 font-semibold font-sans">
                    ΑΡΧΙΚΗ ΜΟΡΦΗ ΕΝΑΝΤΙ ΤΥΠΟΠΟΙΗΜΕΝΗΣ
                  </div>
                  <div className="text-xl sm:text-3xl font-black text-amber-300 flex flex-wrap items-center justify-center gap-2">
                    <span>{String(mantissaValue).replace('.', ',')} · 10<sup>{exp}</sup></span>
                    <span>＝</span>
                    <span className="text-emerald-400">
                      {String(standardized.a).replace('.', ',')} · 10<sup>{standardized.k}</sup>
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 space-y-2 text-xs sm:text-sm text-slate-200 font-sans">
                  <div className="text-xs text-indigo-200 uppercase font-bold">ΑΝΑΛΥΣΗ ΜΕΤΑΤΡΟΠΗΣ:</div>
                  {standardized.shift === 0 ? (
                    <div className="text-emerald-300">
                      ✓ Ο αριθμός είναι ήδη σε ορθή τυποποιημένη μορφή, καθώς ισχύει 1 ≤ |{Math.abs(mantissaValue)}| &lt; 10.
                    </div>
                  ) : standardized.shift > 0 ? (
                    <div className="space-y-1">
                      <div>
                        1. Ο συντελεστής |{Math.abs(mantissaValue)}| είναι ≥ 10.
                      </div>
                      <div>
                        2. Μετακινούμε την υποδιαστολή <strong>{standardized.shift} θέση αριστερά</strong> για να γίνει {String(standardized.a).replace('.', ',')}.
                      </div>
                      <div>
                        3. Αυξάνουμε τον εκθέτη κατά {standardized.shift}: κ = {exp} + ({standardized.shift}) = <strong>{standardized.k}</strong>.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div>
                        1. Ο συντελεστής |{Math.abs(mantissaValue)}| είναι &lt; 1.
                      </div>
                      <div>
                        2. Μετακινούμε την υποδιαστολή <strong>{Math.abs(standardized.shift)} θέση δεξιά</strong> για να γίνει {String(standardized.a).replace('.', ',')}.
                      </div>
                      <div>
                        3. Μειώνουμε τον εκθέτη κατά {Math.abs(standardized.shift)}: κ = {exp} - ({Math.abs(standardized.shift)}) = <strong>{standardized.k}</strong>.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: Η ΚΛΙΜΑΚΑ ΤΟΥ ΣΥΜΠΑΝΤΟΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              🛠️ Διαδραστικό Εργαστήριο 2: Από το Άτομο στο Σύμπαν
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Επίλεξε ένα από τα παρακάτω φυσικά μεγέθη για να δεις πώς η τυποποιημένη μορφή απλοποιεί τη γραφή και επιτρέπει την άμεση σύγκριση τεράστιων και μικροσκοπικών διαστάσεων.
          </p>

          {/* Επιλογή Preset Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {LAB_CONFIG.lab2.presets.map((item, idx) => {
              const isSelected = idx === selectedPreset;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPreset(idx)}
                  className={`p-3 rounded-2xl border text-center transition-all touch-manipulation flex flex-col items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                    {item.type === 'micro' ? 'ΜΙΚΡΟΚΟΣΜΟΣ' : 'ΜΑΚΡΟΚΟΣΜΟΣ'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold line-clamp-2">
                    {item.name}
                  </span>
                  <span className={`text-[10px] font-mono font-semibold ${isSelected ? 'text-amber-300' : 'text-indigo-600'}`}>
                    10<sup>{item.exp}</sup>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Προβολή Επιλεγμένου Μεγέθους */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider">
                  ΦΥΣΙΚΟ ΜΕΓΕΘΟΣ
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {preset.name}
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
                preset.type === 'micro' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {preset.type === 'micro' ? 'ΜΙΚΡΟΣΚΟΠΙΚΟ ΜΕΓΕΘΟΣ' : 'ΑΣΤΡΟΝΟΜΙΚΟ ΜΕΓΕΘΟΣ'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-slate-400">Κλασική Γραφή (με όλα τα μηδενικά):</span>
                <div className="font-mono text-base sm:text-xl font-bold text-slate-100 break-all">
                  {preset.valueStr}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-indigo-600/20 border border-indigo-500/40 space-y-1">
                <span className="text-xs text-indigo-300">Τυποποιημένη (Επιστημονική) Μορφή:</span>
                <div className="font-mono text-xl sm:text-2xl font-black text-amber-400">
                  {String(preset.a).replace('.', ',')} · 10<sup>{preset.exp}</sup> {preset.unit}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΠΡΑΞΕΙΣ & ΣΥΓΚΡΙΣΕΙΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              Πράξεις με Αριθμούς σε Τυποποιημένη Μορφή
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Για να εκτελέσουμε πολλαπλασιασμό ή διαίρεση αριθμών σε τυποποιημένη μορφή, ομαδοποιούμε τους συντελεστές και τις δυνάμεις του 10 χωριστά, εφαρμόζοντας τις γνωστές ιδιότητες:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600">ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ</div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Γινόμενο Τυποποιημένων Αριθμών</h3>
              <p className="text-sm text-slate-600">
                Πολλαπλασιάζουμε τους συντελεστές και προσθέτουμε τους εκθέτες του 10:
              </p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-sm sm:text-base font-bold text-emerald-900 space-y-1">
                <div>(2 · 10<sup>4</sup>) · (3 · 10<sup>5</sup>) ＝ (2 · 3) · 10<sup>4+5</sup></div>
                <div className="text-emerald-600">＝ 6 · 10<sup>9</sup></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600">ΔΙΑΙΡΕΣΗ</div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Πηλίκο Τυποποιημένων Αριθμών</h3>
              <p className="text-sm text-slate-600">
                Διαιρούμε τους συντελεστές και αφαιρούμε τους εκθέτες του 10:
              </p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-sm sm:text-base font-bold text-emerald-900 space-y-1">
                <div>(8 · 10<sup>7</sup>) : (4 · 10<sup>3</sup>) ＝ (8 : 4) · 10<sup>7-3</sup></div>
                <div className="text-emerald-600">＝ 2 · 10<sup>4</sup></div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
