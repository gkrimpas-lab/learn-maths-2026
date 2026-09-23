import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Component Frac με ασφαλή ανίχνευση προσήμου
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

// Ενιαίο ενιαίο SVG σύμβολο ρίζας: μονοκόμματο σχήμα με οριζόντια γραμμή (vinculum)
const Sqrt = ({ children, className = "" }) => {
  return (
    <span className={`inline-flex items-center align-middle mx-1 relative font-mono font-semibold ${className}`}>
      {/* SVG που σχεδιάζει μονοκόμματα το 'τικ' και την επάνω οριζόντια γραμμή που σκεπάζει όλο το πλάτος */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none text-current overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 58 L 4 52 L 10 92 L 16 6 L 100 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Το υπόρριζο περιεχόμενο με σωστά περιθώρια ώστε να κάθεται τέλεια κάτω από τη γραμμή */}
      <span className="pl-4 sm:pl-4.5 pr-1 pt-1 pb-0.5 leading-none inline-flex items-center">
        {children}
      </span>
    </span>
  );
};

// Πρώτα 15 τέλεια τετράγωνα για γρήγορη αναφορά
const PERFECT_SQUARES = Array.from({ length: 15 }, (_, i) => ({
  n: i + 1,
  sq: (i + 1) * (i + 1)
}));

export default function RizaTheoria() {
  // State Εργαστηρίου 1: Γεωμετρικό Τετράγωνο
  const [geoSide, setGeoSide] = useState(5);

  // State Εργαστηρίου 2: Αναλυτής Τετραγωνικής Ρίζας
  const [customInput, setCustomInput] = useState('49');

  // Ανάλυση εισαγωγής για το Εργαστήριο 2
  const rootAnalysis = useMemo(() => {
    const clean = customInput.trim().replace(',', '.');
    if (!clean) return { error: 'Πληκτρολόγησε έναν μη αρνητικό αριθμό.' };

    const val = parseFloat(clean);
    if (isNaN(val)) return { error: 'Μη έγκυρος αριθμός.' };
    if (val < 0) return { error: 'Η τετραγωνική ρίζα αρνητικού αριθμού ΔΕΝ ορίζεται στους πραγματικούς αριθμούς!' };

    const sqrtVal = Math.sqrt(val);
    const isPerfect = Number.isInteger(sqrtVal);

    // Εγκλωβισμός σε διαδοχικά τέλεια τετράγωνα
    const lowerInt = Math.floor(sqrtVal);
    const upperInt = lowerInt + 1;
    const lowerSq = lowerInt * lowerInt;
    const upperSq = upperInt * upperInt;

    return {
      val,
      sqrtVal: Number(sqrtVal.toFixed(4)),
      isPerfect,
      intRoot: isPerfect ? sqrtVal : null,
      bounding: !isPerfect ? { lowerInt, upperInt, lowerSq, upperSq } : null
    };
  }, [customInput]);

  return (
    <Layout
      title="Τετραγωνικοί Αριθμοί & Τετραγωνική Ρίζα | Β' Γυμνασίου"
      description="Θεωρία, τέλεια τετράγωνα, ορισμός και ιδιότητες της τετραγωνικής ρίζας με διαδραστικά εργαστήρια γεωμετρικής κατανόησης."
      backUrl="/b-gymnasiou"
      backText="Β' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/b-gymnasiou/04-riza-ask"
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
              Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 4
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase">
              ΤΕΤΡΑΓΩΝΙΚΟΙ ΑΡΙΘΜΟΙ & ΤΕΤΡΑΓΩΝΙΚΗ ΡΙΖΑ
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Ανακαλύπτουμε τα τέλεια τετράγωνα μέσα από τη γεωμετρία και ορίζουμε την τετραγωνική ρίζα θετικού αριθμού ως την αντίστροφη διαδικασία του τετραγώνου.
            </p>
          </div>
        </section>

        {/* 1. ΤΕΛΕΙΑ ΤΕΤΡΑΓΩΝΑ (ΤΕΤΡΑΓΩΝΙΚΟΙ ΑΡΙΘΜΟΙ) */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Τετράγωνο Αριθμού & Τέλεια Τετράγωνα
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Τετράγωνο</strong> ενός αριθμού <span className="font-mono font-bold text-indigo-700">α</span> ονομάζεται το γινόμενο του αριθμού με τον εαυτό του, δηλαδή:
              </p>
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl font-mono text-center text-lg sm:text-xl font-bold text-indigo-950">
                α² ＝ α · α
              </div>
              <p>
                <strong>Τέλειο τετράγωνο</strong> ή <strong>τετραγωνικός αριθμός</strong> ονομάζεται κάθε φυσικός αριθμός που είναι τετράγωνο κάποιου άλλου φυσικού αριθμού.
              </p>
              <ul className="space-y-2 list-disc pl-5 text-sm sm:text-base text-slate-600">
                <li>0² ＝ 0</li>
                <li>1² ＝ 1</li>
                <li>2² ＝ 4</li>
                <li>3² ＝ 9</li>
                <li>4² ＝ 16</li>
                <li>5² ＝ 25 κ.ο.κ.</li>
              </ul>
            </div>

            {/* Πίνακας Τέλειων Τετραγώνων */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ΤΑ ΠΡΩΤΑ 15 ΤΕΛΕΙΑ ΤΕΤΡΑΓΩΝΑ (ΑΠΟΜΝΗΜΟΝΕΥΣΗ)
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 font-mono text-center">
                {PERFECT_SQUARES.map((item) => (
                  <div key={item.n} className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <div className="text-[11px] text-slate-400 font-sans">{item.n}²</div>
                    <div className="text-base sm:text-lg font-black text-indigo-700">{item.sq}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 italic">
                💡 Η εξοικείωση με τα τετράγωνα των αριθμών από το 1 έως το 15 βοηθά στην άμεση εύρεση των τετραγωνικών ριζών χωρίς πράξεις.
              </p>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΓΕΩΜΕΤΡΙΚΗ ΟΠΤΙΚΟΠΟΙΗΣΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              🛠️ Εργαστήριο 1: Η Γεωμετρική Ερμηνεία του Τετραγώνου
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Ένα τέλειο τετράγωνο αναπαριστά το <strong>πλήθος των κουκκίδων</strong> ή το <strong>εμβαδόν ενός τετραγώνου</strong> με πλευρά <span className="font-mono font-bold">α</span>. Σύρε τον επιλογέα για να αλλάξεις το μήκος της πλευράς:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-inner">
            
            {/* Χειριστήρια & Μετρήσεις */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-400 uppercase tracking-wider">ΠΛΕΥΡΑ ΤΕΤΡΑΓΩΝΟΥ (α):</span>
                  <span className="font-mono text-2xl text-amber-300 font-black">{geoSide}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={geoSide}
                  onChange={(e) => setGeoSide(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              {/* Κάρτες Αποτελέσματος */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                    ΥΠΟΛΟΓΙΣΜΟΣ ΕΜΒΑΔΟΥ (ΤΕΤΡΑΓΩΝΟΥ)
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-white">
                    Ε ＝ {geoSide}² ＝ {geoSide * geoSide}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                    ΑΝΤΙΣΤΡΟΦΗ ΔΙΑΔΙΚΑΣΙΑ (ΤΕΤΡΑΓΩΝΙΚΗ ΡΙΖΑ)
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-amber-300 flex items-center">
                    <Sqrt>{geoSide * geoSide}</Sqrt> ＝ {geoSide}
                  </div>
                  <p className="text-xs text-slate-400 font-sans pt-1">
                    «Ποιος θετικός αριθμός αν υψωθεί στο τετράγωνο μας δίνει {geoSide * geoSide}; Ο {geoSide}!»
                  </p>
                </div>
              </div>
            </div>

            {/* Οπτική Αναπαράσταση Grid */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-4">
              <div
                className="grid gap-1 sm:gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10"
                style={{
                  gridTemplateColumns: `repeat(${geoSide}, minmax(0, 1fr))`,
                  width: `${Math.min(geoSide * 32, 280)}px`,
                  height: `${Math.min(geoSide * 32, 280)}px`,
                }}
              >
                {Array.from({ length: geoSide * geoSide }).map((_, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-md sm:rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-xs border border-indigo-400/30"
                  />
                ))}
              </div>
              <div className="mt-3 text-xs font-mono text-slate-400 text-center">
                Πλέγμα {geoSide} × {geoSide} ＝ {geoSide * geoSide} τετραγωνίδια
              </div>
            </div>

          </div>
        </section>

        {/* 3. Η ΕΝΝΟΙΑ ΤΗΣ ΤΕΤΡΑΓΩΝΙΚΗΣ ΡΙΖΑΣ & ΙΔΙΟΤΗΤΕΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Τετραγωνική Ρίζα Θετικού Αριθμού
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2">
                <strong className="text-purple-950 block text-base sm:text-lg">Ορισμός Τετραγωνικής Ρίζας:</strong>
                <p className="text-slate-700 text-sm sm:text-base">
                  <strong>Τετραγωνική ρίζα</strong> ενός θετικού αριθμού <strong>α</strong> (συμβολίζεται με <Sqrt>α</Sqrt>) ονομάζεται ο <strong>θετικός αριθμός</strong> ο οποίος, όταν υψωθεί στο τετράγωνο, δίνει τον αριθμό α.
                </p>
                <div className="font-mono text-center font-bold text-purple-950 text-base sm:text-lg pt-1 flex items-center justify-center flex-wrap">
                  <span>Αν x ≥ 0 και x² ＝ α, τότε </span>
                  <Sqrt>α</Sqrt>
                  <span> ＝ x</span>
                </div>
              </div>

              <div className="space-y-2 text-sm sm:text-base">
                <strong className="text-slate-900 block">Βασικές Ιδιότητες:</strong>
                <ul className="space-y-2 list-disc pl-5 text-slate-600">
                  <li className="flex items-center flex-wrap">
                    <Sqrt>0</Sqrt> ＝ 0 &nbsp;και&nbsp; <Sqrt>1</Sqrt> ＝ 1
                  </li>
                  <li className="flex items-center flex-wrap">
                    <span>(</span><Sqrt>α</Sqrt><span>)² ＝ α για κάθε α ≥ 0 (π.χ. (</span><Sqrt>7</Sqrt><span>)² ＝ 7)</span>
                  </li>
                  <li className="flex items-center flex-wrap">
                    <Sqrt>α²</Sqrt> ＝ α για κάθε α ≥ 0 (π.χ. <Sqrt>5²</Sqrt> ＝ 5)
                  </li>
                  <li className="flex items-center flex-wrap">
                    <span>Ρίζα κλάσματος: </span>
                    <Sqrt><Frac num="α" den="β" /></Sqrt>
                    <span> ＝ </span>
                    <Frac num={<Sqrt>α</Sqrt>} den={<Sqrt>β</Sqrt>} />
                    <span> (π.χ. </span>
                    <Sqrt><Frac num="4" den="9" /></Sqrt>
                    <span> ＝ </span>
                    <Frac num="2" den="3" />
                    <span>)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Παγίδες & Προσοχή */}
            <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700">
                ΜΕΓΑΛΗ ΠΡΟΣΟΧΗ ΣΤΙΣ ΠΑΓΙΔΕΣ ΤΩΝ ΡΙΖΩΝ!
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-white rounded-xl border border-rose-200 space-y-1">
                  <strong className="text-rose-700 block uppercase">1. ΡΙΖΑ ΑΡΝΗΤΙΚΟΥ ΑΡΙΘΜΟΥ</strong>
                  <p className="text-slate-600 flex items-center flex-wrap">
                    <span>Η έκφραση </span>
                    <Sqrt>-9</Sqrt>
                    <span> ή </span>
                    <Sqrt>-16</Sqrt>
                    <span> <strong>ΔΕΝ ΕΧΕΙ ΝΟΗΜΑ</strong> στους πραγματικούς αριθμούς, διότι κανενός αριθμού το τετράγωνο δεν είναι αρνητικό!</span>
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-rose-200 space-y-1">
                  <strong className="text-rose-700 block uppercase">2. ΤΟ ΑΠΟΤΕΛΕΣΜΑ ΕΙΝΑΙ ΠΑΝΤΑ ΜΗ ΑΡΝΗΤΙΚΟ</strong>
                  <p className="text-slate-600">
                    Αν και τόσο το 4² όσο και το (-4)² ισούνται με 16, εξ ορισμού ισχύει:
                  </p>
                  <div className="font-mono font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center">
                    <Sqrt>16</Sqrt> ＝ +4 <span className="text-rose-600 font-sans font-bold ml-2">(ΠΟΤΕ -4)</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-rose-200 space-y-1">
                  <strong className="text-rose-700 block uppercase">3. ΠΡΟΣΟΧΗ ΣΤΗΝ ΠΡΟΣΘΕΣΗ & ΑΦΑΙΡΕΣΗ ΚΑΤΩ ΑΠΟ ΤΗ ΡΙΖΑ</strong>
                  <p className="text-slate-600">
                    Η ρίζα <strong>δεν σπάει</strong> στην πρόσθεση και την αφαίρεση:
                  </p>
                  <div className="font-mono font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center flex-wrap">
                    <Sqrt>9 + 16</Sqrt> ＝ <Sqrt>25</Sqrt> ＝ 5 
                    <span className="text-rose-600 font-sans font-bold ml-2">(ΟΧΙ √9 + √16 = 3 + 4 = 7)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΑΛΥΤΗΣ & ΕΛΕΓΚΤΗΣ ΡΙΖΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              🛠️ Εργαστήριο 2: Έλεγχος Τέλειου Τετραγώνου & Εγκλωβισμός Ρίζας
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Πληκτρολόγησε έναν οποιονδήποτε αριθμό για να ελέγξεις αν είναι <strong>τέλειο τετράγωνο</strong> ή, αν δεν είναι, να δεις ανάμεσα σε ποια δύο διαδοχικά τέλεια τετράγωνα εγκλωβίζεται η ρίζα του:
          </p>

          {/* Προκαθορισμένα κουμπιά */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase self-center mr-1">ΔΟΚΙΜΑΣΕ:</span>
            {['49', '81', '20', '100', '144', '50', '-16'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setCustomInput(sample)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all touch-manipulation font-mono"
              >
                {sample}
              </button>
            ))}
          </div>

          {/* Πεδίο Εισαγωγής */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              ΑΡΙΘΜΟΣ ΠΡΟΣ ΕΛΕΓΧΟ:
            </label>
            <div className="relative">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="π.χ. 49 ή 20"
                className="w-full h-14 px-4 sm:px-5 rounded-2xl border-2 border-indigo-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 font-mono text-base sm:text-xl font-bold text-slate-900 transition-all outline-none"
              />
              {customInput && (
                <button
                  type="button"
                  onClick={() => setCustomInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold transition-all"
                >
                  ΚΑΘΑΡΙΣΜΟΣ
                </button>
              )}
            </div>
          </div>

          {/* Οθόνη Αποτελέσματος */}
          <div className="bg-slate-900 rounded-3xl p-5 sm:p-8 text-white space-y-6 shadow-inner">
            {rootAnalysis.error ? (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{rootAnalysis.error}</span>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                  <div>
                    <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider block mb-1">
                      ΥΠΟΛΟΓΙΣΜΟΣ ΡΙΖΑΣ
                    </span>
                    <div className="text-2xl sm:text-4xl font-black font-mono text-amber-300 flex items-center">
                      <Sqrt>{rootAnalysis.val}</Sqrt> ＝ {rootAnalysis.sqrtVal}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        rootAnalysis.isPerfect
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {rootAnalysis.isPerfect ? 'ΤΕΛΕΙΟ ΤΕΤΡΑΓΩΝΟ' : 'ΜΗ ΤΕΛΕΙΟ ΤΕΤΡΑΓΩΝΟ (ΑΡΡΗΤΟΣ)'}
                    </span>
                  </div>
                </div>

                {rootAnalysis.isPerfect ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-sm sm:text-base font-mono">
                    <div className="text-emerald-300 font-sans font-bold">
                      ✓ Ο αριθμός {rootAnalysis.val} είναι τέλειο τετράγωνο!
                    </div>
                    <div className="text-slate-300 flex items-center flex-wrap">
                      <span>Ισχύει: </span>
                      <span className="text-white font-bold mx-1">{rootAnalysis.intRoot}² ＝ {rootAnalysis.val}</span>
                      <span>, άρα </span>
                      <span className="text-amber-300 font-bold mx-1 flex items-center"><Sqrt>{rootAnalysis.val}</Sqrt> ＝ {rootAnalysis.intRoot}</span>.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-sm sm:text-base">
                      <div className="text-amber-300 font-sans font-bold flex items-center flex-wrap">
                        <span>🔍 Εγκλωβισμός της ρίζας </span>
                        <Sqrt>{rootAnalysis.val}</Sqrt>:
                      </div>
                      <p className="text-slate-300 text-xs sm:text-sm font-sans">
                        Ο αριθμός {rootAnalysis.val} δεν είναι τέλειο τετράγωνο. Βρίσκεται όμως ανάμεσα στα διαδοχικά τέλεια τετράγωνα:
                      </p>
                      <div className="font-mono text-base sm:text-lg font-bold text-white bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-center">
                        {rootAnalysis.bounding.lowerSq} &lt; {rootAnalysis.val} &lt; {rootAnalysis.bounding.upperSq}
                      </div>
                      <div className="font-mono text-base sm:text-lg font-bold text-indigo-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-center flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center">
                          <Sqrt>{rootAnalysis.bounding.lowerSq}</Sqrt> &lt; <Sqrt>{rootAnalysis.val}</Sqrt> &lt; <Sqrt>{rootAnalysis.bounding.upperSq}</Sqrt>
                        </div>
                        <div className="text-amber-400 font-black mt-2 flex items-center justify-center">
                          {rootAnalysis.bounding.lowerInt} &lt; <Sqrt>{rootAnalysis.val}</Sqrt> &lt; {rootAnalysis.bounding.upperInt}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 5. ΑΝΑΛΥΤΙΚΑ ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg">
                5
              </span>
              Αναλυτικά Λυμένα Παραδείγματα
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Παράδειγμα 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">ΠΑΡΑΔΕΙΓΜΑ 1: ΥΠΟΛΟΓΙΣΜΟΣ ΠΑΡΑΣΤΑΣΗΣ ΜΕ ΡΙΖΕΣ</span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono flex items-center flex-wrap">
                <span>Α ＝ 3 · </span>
                <Sqrt>64</Sqrt>
                <span> - 2 · </span>
                <Sqrt>25</Sqrt>
                <span> + </span>
                <Sqrt>100</Sqrt>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center flex-wrap">
                  <span>1. Υπολογίζουμε τις ρίζες: </span>
                  <Sqrt>64</Sqrt><span> = 8, </span>
                  <Sqrt>25</Sqrt><span> = 5, </span>
                  <Sqrt>100</Sqrt><span> = 10</span>
                </div>
                <div className="pl-3 text-slate-500">➔ 3 · 8 - 2 · 5 + 10</div>
                <div>2. Πολλαπλασιασμοί: 3 · 8 = 24, 2 · 5 = 10</div>
                <div className="pl-3 text-slate-500">➔ 24 - 10 + 10</div>
                <div>3. Προσθέσεις / Αφαιρέσεις:</div>
                <div className="pl-3 font-bold text-indigo-700">➔ 14 + 10 ＝ 24</div>
              </div>
            </div>

            {/* Παράδειγμα 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">ΠΑΡΑΔΕΙΓΜΑ 2: ΡΙΖΑ ΜΕ ΠΡΑΞΕΙΣ ΚΑΤΩ ΑΠΟ ΤΟ ΡΙΖΙΚΟ</span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono flex items-center flex-wrap">
                <span>Β ＝ </span>
                <Sqrt>3 · 12</Sqrt>
                <span> + </span>
                <Sqrt>10² - 8²</Sqrt>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div>1. Εκτελούμε πρώτα τις πράξεις μέσα στα ριζικά:</div>
                <div className="pl-3 text-slate-500">3 · 12 = 36  και  10² - 8² = 100 - 64 = 36</div>
                <div className="pl-3 text-slate-500 flex items-center flex-wrap">
                  <span>➔ </span>
                  <Sqrt>36</Sqrt>
                  <span> + </span>
                  <Sqrt>36</Sqrt>
                </div>
                <div className="flex items-center flex-wrap">
                  <span>2. Υπολογίζουμε τις ρίζες: </span>
                  <Sqrt>36</Sqrt>
                  <span> ＝ 6</span>
                </div>
                <div className="pl-3 text-slate-500">➔ 6 + 6</div>
                <div className="pl-3 font-bold text-indigo-700">➔ 12</div>
              </div>
            </div>

            {/* Παράδειγμα 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">ΠΑΡΑΔΕΙΓΜΑ 3: ΡΙΖΑ ΚΛΑΣΜΑΤΟΣ</span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono flex items-center flex-wrap">
                <span>Γ ＝ </span>
                <Sqrt><Frac num="49" den="81" /></Sqrt>
                <span> + </span>
                <Frac num="2" den="9" />
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center flex-wrap">
                  <span>1. Σπάμε τη ρίζα: </span>
                  <Sqrt><Frac num="49" den="81" /></Sqrt>
                  <span> ＝ </span>
                  <Frac num={<Sqrt>49</Sqrt>} den={<Sqrt>81</Sqrt>} />
                  <span> ＝ </span>
                  <Frac num="7" den="9" />
                </div>
                <div className="flex items-center flex-wrap pl-3 text-slate-500">
                  <span>➔ </span>
                  <Frac num="7" den="9" />
                  <span> + </span>
                  <Frac num="2" den="9" />
                </div>
                <div className="flex items-center flex-wrap">
                  <span>2. Πρόσθεση ομωνύμων κλασμάτων: (7 + 2) / 9 = </span>
                  <Frac num="9" den="9" />
                  <span className="font-bold text-indigo-700 ml-1">＝ 1</span>
                </div>
              </div>
            </div>

            {/* Παράδειγμα 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">ΠΑΡΑΔΕΙΓΜΑ 4: ΕΓΚΛΩΒΙΣΜΟΣ ΑΡΡΗΤΗΣ ΡΙΖΑΣ</span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono flex items-center flex-wrap">
                <span>Ανάμεσα σε ποιους διαδοχικούς ακέραιους βρίσκεται το </span>
                <Sqrt>50</Sqrt>;
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div>1. Βρίσκουμε τα τέλεια τετράγωνα εκατέρωθεν του 50:</div>
                <div className="pl-3 text-slate-500">49 (αφού 7² = 49) και 64 (αφού 8² = 64)</div>
                <div>2. Άρα: 49 &lt; 50 &lt; 64</div>
                <div className="pl-3 text-slate-500 flex items-center flex-wrap">
                  <span>➔ </span>
                  <Sqrt>49</Sqrt>
                  <span> &lt; </span>
                  <Sqrt>50</Sqrt>
                  <span> &lt; </span>
                  <Sqrt>64</Sqrt>
                </div>
                <div className="pl-3 font-bold text-indigo-700 flex items-center flex-wrap">
                  <span>➔ 7 &lt; </span>
                  <Sqrt>50</Sqrt>
                  <span> &lt; 8</span>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </Layout>
  );
}
