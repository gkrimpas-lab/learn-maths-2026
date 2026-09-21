import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση μετατροπής αριθμού σε τυποποιημένη μορφή
function convertToScientific(inputStr) {
  if (!inputStr || !inputStr.trim()) return null;
  const clean = inputStr.trim().replace(/\s+/g, '').replace(',', '.');
  const num = parseFloat(clean);
  if (isNaN(num) || num === 0) return null;

  const isNeg = num < 0;
  const absNum = Math.abs(num);

  // Επιστημονική αναπαράσταση μέσω toExponential
  const expStr = absNum.toExponential();
  const [mantissaStr, expPart] = expStr.split('e');
  const exp = parseInt(expPart, 10);
  let mantissa = parseFloat(mantissaStr);

  // Στρογγυλοποίηση για καθαρή εμφάνιση έως 4 δεκαδικά
  mantissa = Math.round(mantissa * 10000) / 10000;

  const direction = exp > 0 ? 'αριστερά' : exp < 0 ? 'δεξιά' : 'καμία';
  const steps = Math.abs(exp);

  return {
    isNegative: isNeg,
    mantissa,
    exponent: exp,
    direction,
    steps,
    formattedMantissa: (isNeg ? '－' : '') + mantissa.toString().replace('.', ','),
    resultStr: `${isNeg ? '－' : ''}${mantissa.toString().replace('.', ',')} · 10${
      exp !== 0 ? (exp > 0 ? `^${exp}` : `^(${exp})`) : ''
    }`,
  };
}

export default function TipopoimeniMorfiTheoria() {
  // State για Εργαστήριο 1: Διαδραστικός Μετατροπέας
  const [userInput, setUserInput] = useState('150000000');

  // State για Εργαστήριο 2: Σύγκριση Μεγεθών
  const [selectedScaleIndex, setSelectedScaleIndex] = useState(3);

  const realWorldExamples = [
    {
      category: 'ΜΙΚΡΟΚΟΣΜΟΣ',
      name: 'Ακτίνα Πρωτονίου',
      value: '0,00000000000000084 m',
      scientific: '8,4 · 10⁻¹⁶ m',
      description: 'Η διάσταση ενός από τα βασικά υποατομικά σωματίδια στον πυρήνα των ατόμων.',
    },
    {
      category: 'ΜΙΚΡΟΚΟΣΜΟΣ',
      name: 'Μέγεθος Βακτηρίου',
      value: '0,000002 m',
      scientific: '2 · 10⁻⁶ m',
      description: 'Το μέσο μήκος ενός κοινού μονοκύτταρου μικροοργανισμού.',
    },
    {
      category: 'ΚΑΘΗΜΕΡΙΝΟΤΗΤΑ',
      name: 'Πάχος Φύλλου Χαρτιού',
      value: '0,0001 m',
      scientific: '1 · 10⁻⁴ m',
      description: 'Το τυπικό πάχος μιας κόλλας Α4 εκτύπωσης (0,1 mm).',
    },
    {
      category: 'ΓΗ & ΚΟΣΜΟΣ',
      name: 'Ταχύτητα Φωτός στο Κενό',
      value: '300.000.000 m/s',
      scientific: '3 · 10⁸ m/s',
      description: 'Η απόλυτη μέγιστη ταχύτητα διάδοσης πληροφορίας στο Σύμπαν.',
    },
    {
      category: 'ΑΣΤΡΟΝΟΜΙΑ',
      name: 'Απόσταση Γης - Ήλιου',
      value: '149.600.000 km',
      scientific: '1,496 · 10⁸ km',
      description: 'Γνωστή και ως μία Αστρονομική Μονάδα (1 AU).',
    },
    {
      category: 'ΑΣΤΡΟΝΟΜΙΑ',
      name: 'Μάζα της Γης',
      value: '5.972.000.000.000.000.000.000.000 kg',
      scientific: '5,972 · 10²⁴ kg',
      description: 'Η συνολική εκτιμώμενη μάζα του πλανήτη μας.',
    },
  ];

  const presets = [
    { label: '384.000 km (Απόσταση Γης - Σελήνης)', val: '384000' },
    { label: '8.000.000.000 (Πληθυσμός Γης)', val: '8000000000' },
    { label: '0,00005 m (Πάχος Τρίχας)', val: '0,00005' },
    { label: '0,000000001 m (Νανόμετρο)', val: '0,000000001' },
    { label: '－45.000.000 (Αρνητικός Αριθμός)', val: '-45000000' },
  ];

  const parsedResult = useMemo(() => convertToScientific(userInput), [userInput]);

  return (
    <Layout
      title="Τυποποιημένη Μορφή Αριθμών | Α' Γυμνασίου"
      description="Έννοια της τυποποιημένης μορφής (επιστημονική σημειογραφία) για πολύ μεγάλους και πολύ μικρούς αριθμούς, δυνάμεις του 10 και διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/22-tipopoimeni-morfi-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 20 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Τυποποιημένη Μορφή Μικρών & Μεγάλων Αριθμών
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε πώς να γράφουμε και να διαβάζουμε εύκολα εξαιρετικά μεγάλους ή απειροελάχιστους αριθμούς της επιστήμης, χρησιμοποιώντας τις δυνάμεις του 10 και την επιστημονική σημειογραφία.
            </p>
          </div>
        </section>

        {/* 1. ΟΡΙΣΜΟΣ ΤΥΠΟΠΟΙΗΜΕΝΗΣ ΜΟΡΦΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Τι Είναι η Τυποποιημένη Μορφή;
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                Στις φυσικές επιστήμες, στην αστρονομία και στη μικροβιολογία συναντάμε συχνά αριθμούς με πάρα πολλά μηδενικά, όπως το <strong>300.000.000</strong> ή το <strong>0,0000005</strong>.
              </p>
              <p>
                Για να αποφεύγουμε τη γραφή πολλών ψηφίων, γράφουμε κάθε ρητό αριθμό σε <strong>τυποποιημένη μορφή</strong> (ή επιστημονική σημειογραφία):
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-lg sm:text-2xl font-mono shadow-sm">
                α · 10<sup>k</sup> &nbsp; όπου &nbsp; 1 ≤ |α| ＜ 10 &nbsp; και &nbsp; k ∈ ℤ
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600">
                <li><strong>α (συντελεστής):</strong> δεκαδικός αριθμός με <strong>ένα μόνο μη μηδενικό ψηφίο</strong> αριστερά από την υποδιαστολή (1 έως 9).</li>
                <li><strong>10<sup>k</sup>:</strong> δύναμη του 10 με εκθέτη ακέραιο (θετικό, μηδέν ή αρνητικό).</li>
              </ul>
            </div>

            {/* Πίνακας Δυνάμεων του 10 */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                ΟΙ ΔΥΝΑΜΕΙΣ ΤΟΥ 10 ΩΣ ΕΡΓΑΛΕΙΟ
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                {/* Θετικές Δυνάμεις */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-emerald-700 font-bold font-sans">Μεγάλοι Αριθμοί (k ＞ 0)</div>
                  <div>10<sup>1</sup> ＝ 10</div>
                  <div>10<sup>2</sup> ＝ 100</div>
                  <div>10<sup>3</sup> ＝ 1.000 (χίλια)</div>
                  <div>10<sup>6</sup> ＝ 1.000.000 (εκατομμύριο)</div>
                </div>

                {/* Αρνητικές Δυνάμεις */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-sky-700 font-bold font-sans">Μικροί Αριθμοί (k ＜ 0)</div>
                  <div>10<sup>-1</sup> ＝ 0,1 (δέκατο)</div>
                  <div>10<sup>-2</sup> ＝ 0,01 (εκατοστό)</div>
                  <div>10<sup>-3</sup> ＝ 0,001 (χιλιοστό)</div>
                  <div>10<sup>-6</sup> ＝ 0,000001 (εκατομμυριοστό)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΚΑΝΟΝΕΣ ΜΕΤΑΤΡΟΠΗΣ (ΜΕΓΑΛΟΙ & ΜΙΚΡΟΙ ΑΡΙΘΜΟΙ) */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Πώς Μετατρέπουμε Μεγάλους & Μικρούς Αριθμούς
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* 1. Μεγάλοι Αριθμοί */}
            <div className="p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="text-xs uppercase font-black text-indigo-700 tracking-wider">
                  ΠΕΡΙΠΤΩΣΗ Α: ΜΕΓΑΛΟΙ ΑΡΙΘΜΟΙ (≥ 10)
                </span>
                <h3 className="font-bold text-slate-900 text-lg">Μετακίνηση Υποδιαστολής ΑΡΙΣΤΕΡΑ</h3>
                <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                  <li>Μετακινούμε την υποδιαστολή προς τα <strong>αριστερά</strong> μέχρι να μείνει μόνο 1 μη μηδενικό ψηφίο αριστερά της.</li>
                  <li>Μετράμε πόσες θέσεις <strong>k</strong> μετακινηθήκαμε.</li>
                  <li>Πολλαπλασιάζουμε με το <strong>10<sup>k</sup></strong> (θετικός εκθέτης).</li>
                </ol>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 space-y-2 font-mono text-xs sm:text-sm">
                <div className="flex justify-between items-center text-indigo-950">
                  <span>540.000 ＝ 5,4 · 10<sup>5</sup></span>
                  <span className="text-slate-400 font-sans text-xs">(5 θέσεις αριστερά)</span>
                </div>
                <div className="flex justify-between items-center text-indigo-950">
                  <span>3.200.000.000 ＝ 3,2 · 10<sup>9</sup></span>
                  <span className="text-slate-400 font-sans text-xs">(9 θέσεις αριστερά)</span>
                </div>
              </div>
            </div>

            {/* 2. Μικροί Αριθμοί */}
            <div className="p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="text-xs uppercase font-black text-sky-700 tracking-wider">
                  ΠΕΡΙΠΤΩΣΗ Β: ΜΙΚΡΟΙ ΑΡΙΘΜΟΙ (0 ＜ x ＜ 1)
                </span>
                <h3 className="font-bold text-slate-900 text-lg">Μετακίνηση Υποδιαστολής ΔΕΞΙΑ</h3>
                <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                  <li>Μετακινούμε την υποδιαστολή προς τα <strong>δεξιά</strong> μέχρι να περάσει το πρώτο μη μηδενικό ψηφίο.</li>
                  <li>Μετράμε πόσες θέσεις <strong>k</strong> μετακινηθήκαμε.</li>
                  <li>Πολλαπλασιάζουμε με το <strong>10<sup>-k</sup></strong> (αρνητικός εκθέτης).</li>
                </ol>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-sky-100 space-y-2 font-mono text-xs sm:text-sm">
                <div className="flex justify-between items-center text-sky-950">
                  <span>0,007 ＝ 7 · 10<sup>-3</sup></span>
                  <span className="text-slate-400 font-sans text-xs">(3 θέσεις δεξιά)</span>
                </div>
                <div className="flex justify-between items-center text-sky-950">
                  <span>0,000042 ＝ 4,2 · 10<sup>-5</sup></span>
                  <span className="text-slate-400 font-sans text-xs">(5 θέσεις δεξιά)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΜΕΤΑΤΡΟΠΕΑΣ ΣΕ ΤΥΠΟΠΟΙΗΜΕΝΗ ΜΟΡΦΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Διαδραστικό Εργαστήριο 1: Αυτόματος Μετατροπέας Αριθμών σε Τυποποιημένη Μορφή
            </h2>
          </div>

          <div className="space-y-6">
            {/* Input & Presets */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΕΝΑΝ ΑΡΙΘΜΟ (ΜΕΓΑΛΟ Η ΜΙΚΡΟ ΔΕΚΑΔΙΚΟ):
                </label>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="π.χ. 150000000 ή 0,000045"
                  className="w-full h-13 px-4 sm:px-5 rounded-2xl bg-white border-2 border-indigo-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-slate-900 font-mono text-base sm:text-xl font-bold outline-none transition-all shadow-inner"
                />
              </div>

              {/* Έτοιμα Παραδείγματα */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ΕΠΙΛΕΞΤΕ ΕΝΑ ΕΤΟΙΜΟ ΠΑΡΑΔΕΙΓΜΑ:
                </span>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setUserInput(p.val)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-300 text-slate-800 transition active:scale-95 shadow-sm"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Κάρτα Αποτελέσματος Μετατροπής */}
            {parsedResult ? (
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-5 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΠΟΤΕΛΕΣΜΑ ΜΕΤΑΤΡΟΠΗΣ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    1 ≤ |{parsedResult.mantissa.toString().replace('.', ',')}| ＜ 10
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-4 text-2xl sm:text-4xl font-black py-2 flex-wrap text-center">
                  <span className="text-slate-300">{userInput}</span>
                  <span className="text-amber-400 font-sans">＝</span>
                  <span className="text-emerald-400">
                    {parsedResult.formattedMantissa} · 10<sup>{parsedResult.exponent}</sup>
                  </span>
                </div>

                {/* Ανάλυση Βημάτων */}
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                  <div className="font-bold text-indigo-200">
                    🔍 Πώς προέκυψε η μετατροπή:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>
                      <strong>Συντελεστής α:</strong> Μετακινήσαμε την υποδιαστολή ώστε να μείνει ένας αριθμός ανάμεσα στο 1 και το 10, δηλαδή το <strong>{parsedResult.formattedMantissa}</strong>.
                    </li>
                    <li>
                      <strong>Εκθέτης k:</strong> Μετακινήσαμε την υποδιαστολή κατά <strong>{parsedResult.steps}</strong> θέσεις προς τα <strong>{parsedResult.direction}</strong>, άρα ο εκθέτης της δύναμης του 10 είναι το <strong>{parsedResult.exponent}</strong>.
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold text-center">
                Πληκτρολόγησε έναν έγκυρο μη μηδενικό αριθμό παραπάνω για να εμφανιστεί η ανάλυση.
              </div>
            )}
          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΠΟ ΤΟ ΣΥΜΠΑΝ ΣΤΟΝ ΜΙΚΡΟΚΟΣΜΟ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              Διαδραστικό Εργαστήριο 2: Πραγματικά Μεγέθη στο Σύμπαν
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-xs sm:text-sm text-slate-600">
              Επέλεξε ένα επιστημονικό μέγεθος για να συγκρίνεις την αναλυτική δεκαδική γραφή με την αντίστοιχη τυποποιημένη μορφή:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {realWorldExamples.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedScaleIndex(idx)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between gap-2 touch-manipulation active:scale-95 ${
                    selectedScaleIndex === idx
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                    {ex.category}
                  </span>
                  <span className="font-bold text-xs sm:text-sm leading-tight block">
                    {ex.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Κάρτα Επιλεγμένου Μεγέθους */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-4 shadow-md">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <span className="text-xs uppercase font-bold text-indigo-300 tracking-wider">
                  {realWorldExamples[selectedScaleIndex].category} • {realWorldExamples[selectedScaleIndex].name}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
                  ΤΥΠΟΠΟΙΗΜΕΝΗ: {realWorldExamples[selectedScaleIndex].scientific}
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-xs text-slate-400 font-sans">
                  Αναλυτική τιμή με όλα τα ψηφία:
                </div>
                <div className="text-lg sm:text-2xl font-mono font-black text-amber-300 break-all">
                  {realWorldExamples[selectedScaleIndex].value}
                </div>

                <div className="text-xs sm:text-sm text-slate-200 pt-2 border-t border-slate-800">
                  {realWorldExamples[selectedScaleIndex].description}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
