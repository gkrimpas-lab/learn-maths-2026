import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// ==========================================
// ΡΥΘΜΙΣΕΙΣ & ΟΡΙΑ ΕΡΓΑΣΤΗΡΙΩΝ
// ==========================================
export const LAB_CONFIG = {
  lab1: {
    samples: [
      { label: '4.500.000 (Μεγάλος)', val: '4500000' },
      { label: '0,00045 (Μικρός)', val: '0,00045' },
      { label: '380.000.000', val: '380000000' },
      { label: '0,0000072', val: '0,0000072' },
      { label: '-78.000 (Αρνητικός)', val: '-78000' },
      { label: '105', val: '105' },
      { label: '6', val: '6' }
    ]
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

// Component Power: σκούρο χρώμα, παρένθεση ΜΟΝΟ σε αρνητικό εκθέτη, τοποθετημένο ψηλά
const Power = ({ base, exp, className = "" }) => {
  const expNum = typeof exp === 'number' ? exp : parseInt(String(exp).replace(/[()]/g, ''), 10);
  const isNeg = !isNaN(expNum) ? expNum < 0 : String(exp).startsWith('-');
  const formattedExp = isNeg ? `(${exp})` : `${exp}`;

  return (
    <span className={`inline-flex items-baseline font-mono ${className}`}>
      <span>{base}</span>
      <sup className="relative -top-[0.6em] text-slate-900 font-bold ml-0.5 text-xs sm:text-sm">
        {formattedExp}
      </sup>
    </span>
  );
};

// Component Power για σκούρο φόντο: τοποθετημένο καθαρά πιο ψηλά
const DarkPower = ({ base, exp, className = "" }) => {
  const expNum = typeof exp === 'number' ? exp : parseInt(String(exp).replace(/[()]/g, ''), 10);
  const isNeg = !isNaN(expNum) ? expNum < 0 : String(exp).startsWith('-');
  const formattedExp = isNeg ? `(${exp})` : `${exp}`;

  return (
    <span className={`inline-flex items-baseline font-mono ${className}`}>
      <span>{base}</span>
      <sup className="relative -top-[0.65em] text-amber-400 font-bold ml-0.5 text-[0.65em] leading-none">
        {formattedExp}
      </sup>
    </span>
  );
};

export default function TipopoiimeniMorfiTheoria() {
  const [inputVal, setInputVal] = useState('4500000');
  const [selectedPreset, setSelectedPreset] = useState(0);

  // Αυστηρό φιλτράρισμα: μόνο αριθμοί, μία υποδιαστολή, και ένα μείον μόνο στην αρχή
  const handleNumericInput = (rawVal) => {
    let clean = rawVal.replace(/[^0-9,\.\-]/g, '');

    // Μόνο ένα '-' και μόνο στην αρχή
    if (clean.includes('-')) {
      const hasMinusAtStart = clean.startsWith('-');
      clean = clean.replace(/-/g, '');
      if (hasMinusAtStart) clean = '-' + clean;
    }

    // Μόνο μία υποδιαστολή (είτε ',' είτε '.')
    let sepCount = 0;
    let formatted = '';
    for (let i = 0; i < clean.length; i++) {
      const ch = clean[i];
      if (ch === ',' || ch === '.') {
        if (sepCount === 0) {
          formatted += ',';
          sepCount++;
        }
      } else {
        formatted += ch;
      }
    }

    setInputVal(formatted);
  };

  // Ανάλυση Μετατροπής σε Τυποποιημένη Μορφή (α · 10^κ)
  const analysis = useMemo(() => {
    const rawClean = inputVal.trim().replace(/\./g, '').replace(',', '.');
    if (!rawClean || rawClean === '-') return { error: 'Πληκτρολόγησε έναν έγκυρο αριθμό.' };

    const num = parseFloat(rawClean);
    if (isNaN(num)) return { error: 'Μη έγκυρος αριθμός.' };
    if (num === 0) return { isZero: true };

    const isNeg = num < 0;
    const absNum = Math.abs(num);

    let k = Math.floor(Math.log10(absNum));
    let a = absNum / Math.pow(10, k);

    a = Number(a.toFixed(6));
    if (a >= 10) {
      a = 1;
      k += 1;
    }

    const signedA = (isNeg ? -a : a).toString().replace('.', ',');

    let shiftType = 'none';
    let shiftCount = Math.abs(k);
    if (k > 0) shiftType = 'left';
    else if (k < 0) shiftType = 'right';

    return {
      originalFormatted: inputVal,
      num,
      a: signedA,
      rawA: isNeg ? -a : a,
      k,
      shiftType,
      shiftCount,
      isNeg
    };
  }, [inputVal]);

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
        
        {/* Banner Header */}
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
                α · <Power base={10} exp="κ" className="text-indigo-950" />
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
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="text-xs uppercase font-bold tracking-wider text-amber-700">ΠΕΡΙΠΤΩΣΗ Α</div>
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl">Μεγάλοι Αριθμοί (Αριστερή Μετακίνηση)</h3>
              <p className="text-sm text-slate-600">
                Μετακινούμε την υποδιαστολή προς τα <strong>αριστερά</strong> μέχρι να μείνει μόνο ένα ψηφίο πριν από αυτήν. Το πλήθος των θέσεων που μετακινηθήκαμε είναι ο <strong>θετικός εκθέτης</strong>.
              </p>
              <div className="p-4 bg-white rounded-xl border border-slate-200 font-mono text-center space-y-1">
                <div className="text-slate-500 text-xs font-sans">Παράδειγμα: 5.400.000</div>
                <div className="text-base sm:text-lg font-bold text-slate-900">5.400.000 ＝ 5,4 · <Power base={10} exp={6} /></div>
                <div className="text-xs text-indigo-600 font-sans">Μετακίνηση 6 θέσεις αριστερά → κ = +6</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="text-xs uppercase font-bold tracking-wider text-indigo-700">ΠΕΡΙΠΤΩΣΗ Β</div>
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl">Μικροί Δεκαδικοί (Δεξιά Μετακίνηση)</h3>
              <p className="text-sm text-slate-600">
                Μετακινούμε την υποδιαστολή προς τα <strong>δεξιά</strong> μέχρι να συναντήσουμε το πρώτο μη μηδενικό ψηφίο. Το πλήθος των θέσεων που μετακινηθήκαμε είναι ο <strong>αρνητικός εκθέτης</strong>.
              </p>
              <div className="p-4 bg-white rounded-xl border border-slate-200 font-mono text-center space-y-1">
                <div className="text-slate-500 text-xs font-sans">Παράδειγμα: 0,00038</div>
                <div className="text-base sm:text-lg font-bold text-slate-900">0,00038 ＝ 3,8 · <Power base={10} exp={-4} /></div>
                <div className="text-xs text-indigo-600 font-sans">Μετακίνηση 4 θέσεις δεξιά → κ = -4</div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1 */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                🛠️ Εργαστήριο 1: Μετατροπέας Συνηθισμένου Αριθμού σε Τυποποιημένη Μορφή
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Πληκτρολόγησε οποιονδήποτε αριθμό ή διάλεξε ένα έτοιμο παράδειγμα
              </span>
            </div>

            {/* Έτοιμα Παραδείγματα */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase self-center mr-1">ΔΟΚΙΜΑΣΕ:</span>
              {LAB_CONFIG.lab1.samples.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputVal(item.val)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all touch-manipulation font-mono"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Πεδίο Εισαγωγής Αριθμού (ΜΟΝΟ ΝΟΥΜΕΡΑ) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                ΑΡΧΙΚΟΣ ΑΡΙΘΜΟΣ (ΚΑΝΟΝΙΚΗ ΓΡΑΦΗ):
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={inputVal}
                  onChange={(e) => handleNumericInput(e.target.value)}
                  placeholder="π.χ. 4500000 ή 0,00045 ή -78000"
                  className="w-full h-14 px-4 sm:px-5 rounded-2xl border-2 border-indigo-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 font-mono text-base sm:text-xl font-bold text-slate-900 transition-all outline-none"
                />
                {inputVal && (
                  <button
                    type="button"
                    onClick={() => setInputVal('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold transition-all"
                  >
                    ΚΑΘΑΡΙΣΜΟΣ
                  </button>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                * Επιτρέπονται μόνο αριθμοί, υποδιαστολή (κόμμα) και πρόσημο μείον (-) στην αρχή.
              </div>
            </div>

            {/* Οθόνη Ανάλυσης & Αποτελέσματος */}
            <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white space-y-6 shadow-inner font-mono">
              {analysis.error ? (
                <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm font-sans font-semibold">
                  ⚠️ {analysis.error}
                </div>
              ) : analysis.isZero ? (
                <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-sans font-semibold">
                  ℹ️ Το 0 δεν έχει τυποποιημένη μορφή (απαιτείται συντελεστής |α| ≥ 1).
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold font-sans block mb-1">
                        ΑΡΧΙΚΟΣ ΑΡΙΘΜΟΣ
                      </span>
                      <div className="text-xl sm:text-2xl font-bold text-white break-all">
                        {analysis.originalFormatted}
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold font-sans block mb-1">
                        ΤΥΠΟΠΟΙΗΜΕΝΗ ΜΟΡΦΗ
                      </span>
                      <div className="text-2xl sm:text-4xl font-black text-amber-300 flex items-center sm:justify-end gap-1.5 flex-wrap">
                        <span>＝</span>
                        <span>{analysis.a} · </span>
                        <DarkPower base={10} exp={analysis.k} />
                      </div>
                    </div>
                  </div>

                  {/* Επεξήγηση Μετακίνησης Υποδιαστολής */}
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 space-y-2 text-xs sm:text-sm text-slate-200 font-sans">
                    <div className="text-xs text-indigo-200 uppercase font-bold">ΒΗΜΑΤΑ ΜΕΤΑΤΡΟΠΗΣ:</div>
                    {analysis.shiftType === 'none' ? (
                      <div className="text-emerald-300 font-semibold">
                        ✓ Ο αριθμός είναι ήδη μεταξύ 1 και 10, οπότε ο εκθέτης είναι 0: {analysis.a} · <DarkPower base={10} exp={0} />.
                      </div>
                    ) : analysis.shiftType === 'left' ? (
                      <div className="space-y-1">
                        <div>
                          1. Ο αριθμός είναι μεγάλος (≥ 10).
                        </div>
                        <div>
                          2. Μετακινούμε την υποδιαστολή <strong>{analysis.shiftCount} θέσεις προς τα αριστερά</strong> για να σχηματιστεί ο συντελεστής <span className="font-mono font-bold text-amber-300">{analysis.a}</span> (1 ≤ |α| &lt; 10).
                        </div>
                        <div>
                          3. Επειδή πήγαμε αριστερά, ο εκθέτης του 10 είναι <strong>θετικός (+{analysis.shiftCount})</strong>.
                        </div>
                        <div className="pt-1 text-emerald-300 font-mono font-bold flex items-center flex-wrap gap-1">
                          <span>➔ {analysis.originalFormatted} ＝ {analysis.a} · </span>
                          <DarkPower base={10} exp={analysis.k} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div>
                          1. Ο αριθμός είναι μικρός δεκαδικός (&lt; 1).
                        </div>
                        <div>
                          2. Μετακινούμε την υποδιαστολή <strong>{analysis.shiftCount} θέσεις προς τα δεξιά</strong> μέχρι το πρώτο μη μηδενικό ψηφίο για να πάρουμε <span className="font-mono font-bold text-amber-300">{analysis.a}</span>.
                        </div>
                        <div>
                          3. Επειδή πήγαμε δεξιά, ο εκθέτης του 10 είναι <strong>αρνητικός (-{analysis.shiftCount})</strong>.
                        </div>
                        <div className="pt-1 text-emerald-300 font-mono font-bold flex items-center flex-wrap gap-1">
                          <span>➔ {analysis.originalFormatted} ＝ {analysis.a} · </span>
                          <DarkPower base={10} exp={analysis.k} />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
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
                    <Power base={10} exp={item.exp} className={isSelected ? 'text-amber-300' : 'text-indigo-600'} />
                  </span>
                </button>
              );
            })}
          </div>

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
                <div className="font-mono text-xl sm:text-2xl font-black text-amber-400 flex items-center flex-wrap gap-1">
                  <span>{String(preset.a).replace('.', ',')} · </span>
                  <DarkPower base={10} exp={preset.exp} />
                  <span className="ml-1 text-white text-base sm:text-lg">{preset.unit}</span>
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
                <div className="flex items-center flex-wrap gap-1">
                  <span>(2 · <Power base={10} exp={4} />) · (3 · <Power base={10} exp={5} />) ＝ (2 · 3) · </span>
                  <Power base={10} exp="4+5" />
                </div>
                <div className="text-emerald-600 flex items-center gap-1">
                  <span>＝ 6 · </span>
                  <Power base={10} exp={9} />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600">ΔΙΑΙΡΕΣΗ</div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Πηλίκο Τυποποιημένων Αριθμών</h3>
              <p className="text-sm text-slate-600">
                Διαιρούμε τους συντελεστές και αφαιρούμε τους εκθέτες του 10:
              </p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-sm sm:text-base font-bold text-emerald-900 space-y-1">
                <div className="flex items-center flex-wrap gap-1">
                  <span>(8 · <Power base={10} exp={7} />) : (4 · <Power base={10} exp={3} />) ＝ (8 : 4) · </span>
                  <Power base={10} exp="7-3" />
                </div>
                <div className="text-emerald-600 flex items-center gap-1">
                  <span>＝ 2 · </span>
                  <Power base={10} exp={4} />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
