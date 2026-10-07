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

// Βοηθητική συνάρτηση για μορφοποίηση δεκαδικών με κόμμα
const formatDec = (val) => Number(val.toFixed(2)).toString().replace('.', ',');

export default function AkolouthiaViewTheoria() {
  // State για Εργαστήριο 1: Οπτικό Μοτίβο Τριγώνων (3 * ν)
  const [visualStep, setVisualStep] = useState(3);

  // State για Εργαστήριο 2: Δυναμικό Σύστημα Αξόνων (α * ν)
  const [alphaCoeff, setAlphaCoeff] = useState(4); // Ο συντελεστής α

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => {
      let next = prev + val;
      // Για δεκαδικά βήματα αποφεύγουμε τα σφάλματα floating point
      next = Math.round(next * 10) / 10;
      return Math.max(min, Math.min(max, next));
    });
  };

  // Δεδομένα για το γράφημα του Εργαστηρίου 2
  const graphData = useMemo(() => {
    const data = [];
    for (let v = 1; v <= 5; v++) {
      data.push({ v, val: alphaCoeff * v });
    }
    return data;
  }, [alphaCoeff]);

  // Χαρτογράφηση συντεταγμένων SVG για το Σύστημα Αξόνων (Εργαστήριο 2)
  // X axis: 0 to 6 (πλάτος 540)
  const mapX = (v) => 40 + v * 90;
  // Y axis: -30 to 30 (ύψος 340, κέντρο στο 190)
  const mapY = (val) => 190 - val * (170 / 30);

  return (
    <Layout
      title="Αναπαράσταση Κανονικοτήτων | Α' Γυμνασίου"
      description="Πολλαπλές αναπαραστάσεις ακολουθιών: πίνακες τιμών, συστήματα αξόνων, οπτικά μοτίβα και ο γενικός όρος α·ν."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/26-akolouthia-view-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 24 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Πολλαπλές Αναπαραστάσεις Κανονικοτήτων
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μια μαθηματική ακολουθία μπορεί να πάρει πολλές μορφές! Ανακαλύπτουμε πώς να μεταφράζουμε ένα γεωμετρικό σχήμα σε Πίνακα Τιμών, έπειτα σε Γράφημα (Σύστημα Αξόνων) και τελικά σε Αλγεβρικό Τύπο.
            </p>
          </div>
        </section>

        {/* 1. ΟΙ 4 ΤΡΟΠΟΙ ΑΝΑΠΑΡΑΣΤΑΣΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Τα Τέσσερα «Πρόσωπα» μιας Ακολουθίας
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            Κάθε κανονικότητα (μοτίβο) κρύβει έναν μαθηματικό κανόνα. Για να την κατανοήσουμε και να την επικοινωνήσουμε, χρησιμοποιούμε 4 διαφορετικές «γλώσσες» (αναπαραστάσεις). Ας δούμε το παράδειγμα όπου <strong>κάθε μέρα που περνάει αποταμιεύουμε 5 €</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* 1. Λεκτική */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col">
              <div className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block w-max">
                1. ΛΕΚΤΙΚΗ ΠΕΡΙΓΡΑΦΗ
              </div>
              <h3 className="font-bold text-slate-900 text-base">Με τα Λόγια Μας</h3>
              <p className="text-slate-600 flex-grow">
                Περιγράφουμε τον κανόνα σε φυσική γλώσσα: <br/><br/>
                <em>«Το συνολικό ποσό που έχουμε αποταμιεύσει ισούται με 5 ευρώ πολλαπλασιασμένα με τον αριθμό των ημερών.»</em>
              </p>
            </div>

            {/* 2. Πίνακας Τιμών */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col">
              <div className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded inline-block w-max">
                2. ΠΙΝΑΚΑΣ ΤΙΜΩΝ
              </div>
              <h3 className="font-bold text-slate-900 text-base">Οργάνωση Δεδομένων</h3>
              <p className="text-slate-600">
                Φτιάχνουμε έναν πίνακα με 2 γραμμές ή 2 στήλες.
              </p>
              <div className="w-full border border-slate-300 rounded-lg overflow-hidden mt-auto">
                <div className="flex bg-slate-200 font-bold">
                  <div className="flex-1 p-2 border-r border-slate-300 text-center">Ημέρα (ν)</div>
                  <div className="flex-1 p-2 text-center">Ποσό (€)</div>
                </div>
                <div className="flex border-t border-slate-300 bg-white">
                  <div className="flex-1 p-2 border-r border-slate-300 text-center font-mono">1</div>
                  <div className="flex-1 p-2 text-center font-mono">5</div>
                </div>
                <div className="flex border-t border-slate-300 bg-white">
                  <div className="flex-1 p-2 border-r border-slate-300 text-center font-mono">2</div>
                  <div className="flex-1 p-2 text-center font-mono">10</div>
                </div>
              </div>
            </div>

            {/* 3. Γραφική */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded inline-block w-max">
                3. ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ
              </div>
              <h3 className="font-bold text-slate-900 text-base">Οπτικοποίηση Δεδομένων</h3>
              <p className="text-slate-600 flex-grow">
                Παίρνουμε τις τιμές από τον πίνακα ως ζεύγη συντεταγμένων <strong>(x, y)</strong>, π.χ. (1, 5) και (2, 10), και τα τοποθετούμε ως κουκκίδες στο επίπεδο. Έτσι βλέπουμε την πορεία της κανονικότητας.
              </p>
            </div>

            {/* 4. Γενικός Όρος */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 flex flex-col">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/50 px-2 py-0.5 rounded inline-block w-max">
                4. ΑΛΓΕΒΡΙΚΟΣ ΤΥΠΟΣ
              </div>
              <h3 className="font-bold text-amber-950 text-base">Ο ν-οστός Όρος</h3>
              <p className="text-slate-700 flex-grow">
                Είναι η μαθηματική σχέση (ο τύπος) που ενώνει τη θέση (ν) με την τιμή.
              </p>
              <div className="p-3 bg-white rounded-xl border border-amber-200 text-center font-mono font-bold text-amber-900 text-xl mt-auto shadow-sm">
                5 · ν
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
              Από την Εικόνα στον Πίνακα Τιμών
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            Όταν βλέπουμε σχήματα να επαναλαμβάνονται, μπορούμε να μετρήσουμε τα στοιχεία τους (π.χ. πλευρές, σπίρτα, τελείες) για κάθε βήμα <strong>ν</strong>. Αυτές τις μετρήσεις τις καταχωρούμε σε έναν <strong>Πίνακα Τιμών</strong>.
          </p>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1 */}
          <div className="pt-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
              🛠 Εργαστήριο 1: Κατασκευή Ανεξάρτητων Τριγώνων
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers & Πίνακας (5 cols) */}
              <div className="lg:col-span-5 space-y-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase">
                    ΒΗΜΑ (ν) - ΠΛΗΘΟΣ ΤΡΙΓΩΝΩΝ
                  </label>
                  <div className="grid grid-cols-[40px_1fr_40px] items-center h-12 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setVisualStep, -1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-950 font-black text-xl font-mono">
                      ν ＝ {visualStep}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setVisualStep, 1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Δυναμικός Πίνακας Τιμών */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">ΔΥΝΑΜΙΚΟΣ ΠΙΝΑΚΑΣ ΤΙΜΩΝ</div>
                  <div className="w-full border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="flex bg-indigo-100 font-bold text-indigo-900 text-xs sm:text-sm">
                      <div className="w-1/2 p-2.5 border-r border-indigo-200 text-center">Βήμα (ν)</div>
                      <div className="w-1/2 p-2.5 text-center">Αριθμός Γραμμών</div>
                    </div>
                    {Array.from({ length: Math.min(visualStep, 5) }).map((_, i) => (
                      <div key={i} className={`flex border-t border-slate-200 ${i + 1 === visualStep ? 'bg-amber-50' : 'bg-white'}`}>
                        <div className={`w-1/2 p-2 border-r border-slate-200 text-center font-mono ${i + 1 === visualStep ? 'font-bold text-amber-700' : 'text-slate-600'}`}>
                          {i + 1}
                        </div>
                        <div className={`w-1/2 p-2 text-center font-mono ${i + 1 === visualStep ? 'font-bold text-amber-700' : 'text-slate-600'}`}>
                          {3 * (i + 1)}
                        </div>
                      </div>
                    ))}
                    {visualStep > 5 && (
                      <div className="flex border-t border-slate-200 bg-amber-50">
                        <div className="w-1/2 p-2 border-r border-slate-200 text-center font-mono font-bold text-amber-700">
                          {visualStep}
                        </div>
                        <div className="w-1/2 p-2 text-center font-mono font-bold text-amber-700">
                          {3 * visualStep}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center text-sm font-bold text-slate-800 pt-2 font-mono">
                    Γενικός Όρος: 3 · ν
                  </div>
                </div>
              </div>

              {/* Οπτικοποίηση SVG Responsive */}
              <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 align-self-start w-full text-left">
                  ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ({3 * visualStep} ΓΡΑΜΜΕΣ)
                </div>
                <div className="w-full max-w-full overflow-hidden flex justify-center">
                  <svg
                    viewBox={`0 0 ${visualStep * 40 + 20} 60`}
                    className="w-full h-auto max-h-[120px]"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Ανεξάρτητα Τρίγωνα */}
                    {Array.from({ length: visualStep }).map((_, i) => {
                      const startX = 10 + i * 40;
                      return (
                        <g key={`tri-${i}`}>
                          <polygon
                            points={`${startX + 15},10 ${startX + 30},45 ${startX},45`}
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="3"
                            strokeLinejoin="round"
                          />
                          <text x={startX + 9} y="35" fill="#f59e0b" fontSize="10" fontWeight="bold">3</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <p className="text-xs text-slate-400 text-center mt-2">
                  Για κάθε τρίγωνο χρειαζόμαστε 3 γραμμές. Εφόσον είναι ξεχωριστά, ο τύπος είναι απλός πολλαπλασιασμός: 3 · ν.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Η ΜΟΡΦΗ α * ν ΚΑΙ ΤΟ ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Ο Γενικός Όρος α · ν & Το Σύστημα Αξόνων
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                Πολλές κανονικότητες στην καθημερινή ζωή εκφράζονται με τον απλό τύπο <strong>α · ν</strong> (με α ρητό αριθμό). Για παράδειγμα:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li>Αγοράζεις ψωμί προς 1,20 € το καθένα. Κόστος: <strong>1,2 · ν</strong>.</li>
                <li>Ένα χρέος αυξάνεται κατά 5 € τη μέρα. Υπόλοιπο: <strong>－5 · ν</strong>.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
              <h3 className="font-bold text-indigo-950 text-base">Αναπαράσταση σε Γράφημα</h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                Για να ζωγραφίσουμε την κανονικότητα:
                <br/>1. Οριζόντιος Άξονας (x): βάζουμε τη θέση (ν = 1, 2, 3...).
                <br/>2. Κατακόρυφος Άξονας (y): βάζουμε την τιμή (το αποτέλεσμα του α · ν).
              </p>
              <div className="p-2 bg-white rounded-lg border border-indigo-100 font-mono text-center text-xs font-bold text-indigo-700">
                Ζεύγη: (1, 1·α), (2, 2·α), (3, 3·α) ...
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΥΝΑΜΙΚΟ ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠 Εργαστήριο 2: Δυναμικό Σύστημα Αξόνων για τον τύπο α · ν
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Χειριστήρια & Πίνακας (5 cols) */}
              <div className="lg:col-span-5 space-y-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase">
                    ΣΥΝΤΕΛΕΣΤΗΣ (α)
                  </label>
                  <div className="grid grid-cols-[40px_1fr_40px] items-center h-12 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setAlphaCoeff, -0.5, -5, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex flex-col items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200">
                      <span className="text-indigo-950 font-black text-lg sm:text-xl font-mono">
                        α ＝ {formatDec(alphaCoeff)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setAlphaCoeff, 0.5, -5, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xl hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 text-center">
                    Δοκίμασε θετικές και αρνητικές τιμές (-5 έως +5).
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">ΠΙΝΑΚΑΣ ΖΕΥΓΩΝ (ν, y)</div>
                  <div className="w-full border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="flex bg-slate-200 font-bold text-slate-700 text-xs sm:text-sm">
                      <div className="w-1/3 p-2 border-r border-slate-300 text-center">ν</div>
                      <div className="w-1/3 p-2 border-r border-slate-300 text-center">Τιμή (y)</div>
                      <div className="w-1/3 p-2 text-center">Ζεύγος</div>
                    </div>
                    {graphData.map((d, i) => (
                      <div key={i} className="flex border-t border-slate-200 bg-white">
                        <div className="w-1/3 p-1.5 border-r border-slate-200 text-center font-mono text-slate-600 text-xs sm:text-sm">
                          {d.v}
                        </div>
                        <div className="w-1/3 p-1.5 border-r border-slate-200 text-center font-mono text-slate-800 font-bold text-xs sm:text-sm">
                          {formatDec(d.val)}
                        </div>
                        <div className="w-1/3 p-1.5 text-center font-mono text-indigo-700 font-bold text-xs sm:text-sm">
                          ({d.v}, {formatDec(d.val)})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Σύστημα Αξόνων SVG Responsive (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-inner flex flex-col space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ
                  </span>
                  <span className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono text-xs font-bold">
                    ΤΥΠΟΣ: y ＝ {formatDec(alphaCoeff)} · ν
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2">
                  <svg
                    viewBox="0 0 600 400"
                    className="w-full h-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Οριζόντιες γραμμές πλέγματος (Y axis) */}
                    {[-30, -20, -10, 10, 20, 30].map((yVal) => (
                      <g key={`grid-y-${yVal}`}>
                        <line x1="40" y1={mapY(yVal)} x2="580" y2={mapY(yVal)} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                        <text x="35" y={mapY(yVal) + 4} fill="#64748b" fontSize="12" textAnchor="end">{yVal}</text>
                      </g>
                    ))}

                    {/* Κάθετες γραμμές πλέγματος (X axis) */}
                    {[1, 2, 3, 4, 5, 6].map((xVal) => (
                      <g key={`grid-x-${xVal}`}>
                        <line x1={mapX(xVal)} y1="20" x2={mapX(xVal)} y2="360" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                        <text x={mapX(xVal)} y={mapY(0) + 20} fill="#64748b" fontSize="12" textAnchor="middle">{xVal}</text>
                      </g>
                    ))}

                    {/* Κεντρικοί Άξονες */}
                    {/* X-axis (y=0) */}
                    <line x1="30" y1={mapY(0)} x2="590" y2={mapY(0)} stroke="#94a3b8" strokeWidth="2" />
                    <text x="590" y={mapY(0) - 10} fill="#94a3b8" fontSize="14" fontWeight="bold">ν</text>
                    {/* Y-axis (x=0) */}
                    <line x1={mapX(0)} y1="10" x2={mapX(0)} y2="370" stroke="#94a3b8" strokeWidth="2" />
                    <text x={mapX(0) + 10} y="20" fill="#94a3b8" fontSize="14" fontWeight="bold">y</text>
                    <text x={mapX(0) - 10} y={mapY(0) + 15} fill="#94a3b8" fontSize="12" textAnchor="end">0</text>

                    {/* Σχεδιασμός Γραμμής που ενώνει τα σημεία */}
                    <polyline
                      points={`
                        ${mapX(0)},${mapY(0)} 
                        ${mapX(1)},${mapY(alphaCoeff * 1)} 
                        ${mapX(2)},${mapY(alphaCoeff * 2)} 
                        ${mapX(3)},${mapY(alphaCoeff * 3)} 
                        ${mapX(4)},${mapY(alphaCoeff * 4)} 
                        ${mapX(5)},${mapY(alphaCoeff * 5)} 
                        ${mapX(6)},${mapY(alphaCoeff * 6)}
                      `}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                      opacity="0.6"
                    />

                    {/* Σχεδιασμός Σημείων (Κουκκίδες) */}
                    {graphData.map((d, i) => (
                      <g key={`pt-${i}`}>
                        <circle cx={mapX(d.v)} cy={mapY(d.val)} r="6" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
                        {/* Εμφάνιση ετικέτας τιμής δίπλα στο σημείο (αν δεν βγαίνει εκτός) */}
                        <text 
                          x={mapX(d.v) + 10} 
                          y={mapY(d.val) - 10} 
                          fill="#bae6fd" 
                          fontSize="12" 
                          fontWeight="bold"
                        >
                          {formatDec(d.val)}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
                <div className="text-[11px] text-slate-400 text-center">
                  Όταν η κανονικότητα έχει τη μορφή <strong className="text-white">α · ν</strong>, τα σημεία στο σύστημα αξόνων βρίσκονται πάντοτε πάνω σε μια ευθεία γραμμή που ξεκινάει από την αρχή (0,0).
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
