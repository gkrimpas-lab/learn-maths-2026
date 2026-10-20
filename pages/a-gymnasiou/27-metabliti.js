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
  // State για Εργαστήριο 1: Αναγωγή Ομοίων Όρων: a·x + b·x + c + d
  const [termA, setTermA] = useState(4);   // Συντελεστής 1ου όρου με x
  const [termB, setTermB] = useState(-2);  // Συντελεστής 2ου όρου με x
  const [constC, setConstC] = useState(5); // 1ος σταθερός όρος
  const [constD, setConstD] = useState(-1);// 2ος σταθερός όρος
  const [evalX, setEvalX] = useState(3);   // Τιμή του x για υπολογισμό

  // State για Εργαστήριο 2: Περίμετρος Ορθογωνίου (Μήκος: 2x+3, Πλάτος: x+1)
  const [geoX, setGeoX] = useState(4);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => {
      let next = prev + val;
      return Math.max(min, Math.min(max, next));
    });
  };

  // Υπολογισμοί Εργαστηρίου 1 (Αναγωγή Ομοίων Όρων)
  const totalXCoeff = useMemo(() => termA + termB, [termA, termB]);
  const totalConst = useMemo(() => constC + constD, [constC, constD]);
  const finalValue = useMemo(() => totalXCoeff * evalX + totalConst, [totalXCoeff, evalX, totalConst]);

  // Υπολογισμοί Εργαστηρίου 2 (Περίμετρος)
  const rectLength = useMemo(() => 2 * geoX + 3, [geoX]);
  const rectWidth = useMemo(() => geoX + 1, [geoX]);
  const rectPerimeter = useMemo(() => 2 * rectLength + 2 * rectWidth, [rectLength, rectWidth]);

  return (
    <Layout
      title="Μεταβλητή, Αλγεβρικές Παραστάσεις & Όμοιοι Όροι | Α' Γυμνασίου"
      description="Έννοια της μεταβλητής, όροι αλγεβρικής παράστασης, συντελεστής, σταθερός όρος, όμοιοι όροι, αναγωγή και διαδραστικά εργαστήρια."
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 24 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Μεταβλητές, Αλγεβρικές Παραστάσεις & Όμοιοι Όροι
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Εισαγωγή στην Άλγεβρα: Μαθαίνουμε τη σημασία των μεταβλητών, αναγνωρίζουμε τους όρους, τους συντελεστές και τους σταθερούς όρους, και απλοποιούμε παραστάσεις κάνοντας αναγωγή ομοίων όρων.
            </p>
          </div>
        </section>

        {/* 1. ΜΕΤΑΒΛΗΤΗ & ΑΛΓΕΒΡΙΚΗ ΠΑΡΑΣΤΑΣΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Μεταβλητή & Αλγεβρική Παράσταση
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                <h3 className="font-bold text-indigo-950 text-base">Τι είναι Μεταβλητή;</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  <strong>Μεταβλητή</strong> είναι ένα γράμμα (συνήθως <strong>x, y, ν, α</strong>) που παριστάνει έναν άγνωστο αριθμό ή μια ποσότητα που μπορεί να πάρει διαφορετικές τιμές.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-base">Τι είναι Αλγεβρική Παράσταση;</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Μια μαθηματική έκφραση που περιέχει <strong>αριθμούς, μεταβλητές και πράξεις</strong> μεταξύ τους ονομάζεται <strong>αλγεβρική παράσταση</strong>.
                </p>
                <div className="font-mono text-xs sm:text-sm font-bold text-indigo-900 pt-1">
                  Παραδείγματα: 3x ＋ 5, &nbsp; 4α － 2β, &nbsp; x² ＋ 3x － 7
                </div>
              </div>
            </div>

            {/* Πρακτική Μετάφραση */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                ΜΕΤΑΦΡΑΣΗ ΛΕΚΤΙΚΩΝ ΕΚΦΡΑΣΕΩΝ
              </div>
              <div className="space-y-2 text-xs sm:text-sm font-mono">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-sans text-slate-700">«Το τριπλάσιο ενός αριθμού x»</span>
                  <span className="font-bold text-indigo-700">3 · x</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-sans text-slate-700">«Ένας αριθμός x αυξημένος κατά 8»</span>
                  <span className="font-bold text-indigo-700">x ＋ 8</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-sans text-slate-700">«Το διπλάσιο του x ελαττωμένο κατά 5»</span>
                  <span className="font-bold text-indigo-700">2 · x － 5</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΑΝΑΤΟΜΙΑ: ΟΡΟΙ, ΣΥΝΤΕΛΕΣΤΕΣ & ΣΤΑΘΕΡΟΙ ΟΡΟΙ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Όροι, Συντελεστές & Σταθερός Όρος
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Όροι */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block">
                  ΣΥΣΤΑΤΙΚΟ 1
                </span>
                <h3 className="font-bold text-slate-900 text-base">Όροι Παράστασης</h3>
                <p className="text-slate-600">
                  <strong>Όροι</strong> είναι τα επιμέρους τμήματα μιας παράστασης που συνδέονται μεταξύ τους με τα σύμβολα <strong>＋</strong> ή <strong>－</strong>.
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-center text-xs text-indigo-950">
                Στην <strong>5x － 3y ＋ 7</strong> οι όροι είναι: 5x, －3y και ＋7.
              </div>
            </div>

            {/* Συντελεστής */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded inline-block">
                  ΣΥΣΤΑΤΙΚΟ 2
                </span>
                <h3 className="font-bold text-slate-900 text-base">Συντελεστής</h3>
                <p className="text-slate-600">
                  Είναι ο αριθμός που <strong>πολλαπλασιάζει τη μεταβλητή</strong>. Μαζί με το πρόσημό του αποτελεί τον αριθμητικό παράγοντα.
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-sky-100 font-mono text-xs text-sky-950 space-y-0.5">
                <div>• Στο <strong>4x</strong> συντελεστής είναι το <strong>4</strong>.</div>
                <div>• Στο <strong>－x</strong> συντελεστής είναι το <strong>－1</strong>.</div>
                <div>• Στο <strong>x</strong> συντελεστής είναι το <strong>1</strong>.</div>
              </div>
            </div>

            {/* Σταθερός Όρος */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded inline-block">
                  ΣΥΣΤΑΤΙΚΟ 3
                </span>
                <h3 className="font-bold text-slate-900 text-base">Σταθερός Όρος</h3>
                <p className="text-slate-600">
                  Είναι ο όρος που αποτελείται <strong>μόνο από αριθμό</strong> και δεν περιέχει καμία μεταβλητή.
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-100 font-mono text-xs text-amber-950 space-y-0.5">
                <div>• Στο <strong>3x ＋ 9</strong> σταθερός όρος είναι το <strong>＋9</strong>.</div>
                <div>• Στο <strong>6x － 4</strong> σταθερός όρος είναι το <strong>－4</strong>.</div>
                <div>• Στο <strong>8x</strong> σταθερός όρος είναι το <strong>0</strong>.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΟΜΟΙΟΙ ΟΡΟΙ & ΑΝΑΓΩΓΗ ΟΜΟΙΩΝ ΟΡΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Όμοιοι Όροι & Αναγωγή Ομοίων Όρων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Τι είναι οι Όμοιοι Όροι;</h3>
              <p>
                <strong>Όμοιοι</strong> ονομάζονται οι όροι που έχουν το <strong>ίδιο ακριβώς κύριο μέρος</strong> (την ίδια μεταβλητή υψωμένη στην ίδια δύναμη). Μπορεί να διαφέρουν μόνο στον συντελεστή τους.
              </p>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-xs sm:text-sm">
                <div>• Οι όροι <strong>5x</strong>, <strong>－2x</strong> και <strong>x</strong> είναι <strong>όμοιοι</strong>.</div>
                <div>• Οι όροι <strong>3x</strong> και <strong>3y</strong> <strong>δεν είναι όμοιοι</strong> (διαφορετική μεταβλητή).</div>
                <div>• Οι όροι <strong>4x</strong> και <strong>4x²</strong> <strong>δεν είναι όμοιοι</strong> (διαφορετικός εκθέτης).</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Πώς κάνουμε Αναγωγή Ομοίων Όρων;</h3>
              <p>
                <strong>Αναγωγή ομοίων όρων</strong> λέγεται η διαδικασία πρόσθεσης ή αφαίρεσης των συντελεστών τους, διατηρώντας το κοινό κύριο μέρος (βάσει της επιμεριστικής ιδιότητας):
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold text-center font-mono text-sm sm:text-base">
                α · x ＋ β · x ＝ (α ＋ β) · x
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm text-slate-800">
                Παράδειγμα: 7x － 3x ＋ 2x ＝ (7 － 3 ＋ 2) · x ＝ <strong>6x</strong>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΑΝΑΓΩΓΗ ΟΜΟΙΩΝ ΟΡΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 1: Διαδραστική Αναγωγή Ομοίων Όρων & Υπολογισμός Τιμής
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers των όρων (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-sky-800 uppercase block">1ΟΣ ΟΡΟΣ x</label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setTermA, -1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-xs font-mono text-sky-950">
                      {termA > 0 ? `＋${termA}x` : `${termA}x`}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setTermA, 1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-sky-800 uppercase block">2ΟΣ ΟΡΟΣ x</label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setTermB, -1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-xs font-mono text-sky-950">
                      {termB > 0 ? `＋${termB}x` : `${termB}x`}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setTermB, 1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-amber-800 uppercase block">1ΟΣ ΣΤΑΘΕΡΟΣ</label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setConstC, -1, -15, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-xs font-mono text-amber-950">
                      {constC > 0 ? `＋${constC}` : constC}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setConstC, 1, -15, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-amber-800 uppercase block">2ΟΣ ΣΤΑΘΕΡΟΣ</label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setConstD, -1, -15, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-xs font-mono text-amber-950">
                      {constD > 0 ? `＋${constD}` : constD}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setConstD, 1, -15, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Επιλογή τιμής x */}
                <div className="col-span-2 pt-2 border-t border-slate-200 space-y-1">
                  <label className="text-[10px] font-bold text-indigo-900 uppercase block">
                    ΤΙΜΗ ΜΕΤΑΒΛΗΤΗΣ (x)
                  </label>
                  <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setEvalX, -1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-xs font-mono text-indigo-950">
                      x ＝ {evalX}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setEvalX, 1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Ανάλυση Βήμα-Βήμα (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΒΗΜΑΤΑ ΑΠΛΟΠΟΙΗΣΗΣ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    ΑΝΑΓΩΓΗ ΟΜΟΙΩΝ
                  </span>
                </div>

                {/* Αρχική Παράσταση */}
                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-sm sm:text-base">
                  <div className="text-[10px] text-slate-400 font-sans uppercase">Αρχική Παράσταση:</div>
                  <div className="text-amber-300 font-bold pt-0.5">
                    ({termA}x) ＋ ({termB}x) ＋ ({constC}) ＋ ({constD})
                  </div>
                </div>

                {/* Ομαδοποίηση */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1">
                  <div className="text-slate-300 font-bold">1. Ομαδοποίηση ομοίων όρων και σταθερών:</div>
                  <div className="font-mono text-indigo-200 text-sm sm:text-base">
                    ＝ ({termA} ＋ {termB < 0 ? `(${termB})` : termB})·x ＋ ({constC} ＋ {constD < 0 ? `(${constD})` : constD})
                  </div>
                </div>

                {/* Τελική Απλοποιημένη Μορφή */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1">
                  <div className="text-slate-300 font-bold">2. Τελική ανηγμένη μορφή:</div>
                  <div className="font-mono text-emerald-400 font-black text-lg sm:text-xl">
                    ＝ {totalXCoeff}x {totalConst >= 0 ? `＋ ${totalConst}` : `－ ${Math.abs(totalConst)}`}
                  </div>
                </div>

                {/* Υπολογισμός για x */}
                <div className="p-3.5 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-2 text-emerald-300 font-sans">
                  <span className="text-xs font-bold">
                    ΤΙΜΗ ΓΙΑ x ＝ {evalX}:
                  </span>
                  <span className="text-xl sm:text-3xl font-black font-mono text-emerald-400">
                    ＝ {totalXCoeff}·({evalX}) ＋ ({totalConst}) ＝ {finalValue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΓΕΩΜΕΤΡΙΚΑ ΠΡΟΒΛΗΜΑΤΑ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              Γεωμετρικά Προβλήματα με Αλγεβρικές Παραστάσεις
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            Στη γεωμετρία, οι διαστάσεις των σχημάτων εκφράζονται συχνά με τη βοήθεια μιας μεταβλητής <strong>x</strong>. Για να βρούμε την περίμετρο, προσθέτουμε όλα τα μήκη των πλευρών και κάνουμε αναγωγή ομοίων όρων.
          </p>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΠΕΡΙΜΕΤΡΟΣ ΟΡΘΟΓΩΝΙΟΥ */}
          <div className="pt-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
              🛠️ Εργαστήριο 2: Περίμετρος Ορθογωνίου (Αναγωγή Πλευρών)
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Stepper x (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-indigo-900 uppercase">
                  ΜΕΤΑΒΛΗΤΗ x (cm)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setGeoX, -1, 1, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 font-bold text-base font-mono text-indigo-950">
                    x ＝ {geoX} cm
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setGeoX, 1, 1, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                  >
                    ＋
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs sm:text-sm text-slate-600 space-y-1.5 font-mono">
                  <div>• Μήκος: 2x ＋ 3 ＝ 2·{geoX} ＋ 3 ＝ <strong>{rectLength} cm</strong></div>
                  <div>• Πλάτος: x ＋ 1 ＝ {geoX} ＋ 1 ＝ <strong>{rectWidth} cm</strong></div>
                </div>
              </div>

              {/* Οπτική Προβολή & Υπολογισμός (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΝΑΠΤΥΞΗ ΠΕΡΙΜΕΤΡΟΥ
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold font-sans">
                    Π ＝ 2 · (Μήκος) ＋ 2 · (Πλάτος)
                  </span>
                </div>

                {/* Responsive SVG Σχήμα Ορθογωνίου (Χωρίς οριζόντιο scroll) */}
                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-4 flex justify-center">
                  <svg viewBox="0 0 320 160" className="w-full max-w-[280px] h-auto">
                    <rect x="30" y="30" width="260" height="100" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2.5" />
                    {/* Ετικέτες Πλευρών */}
                    <text x="160" y="22" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">2x ＋ 3 ({rectLength} cm)</text>
                    <text x="160" y="148" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">2x ＋ 3 ({rectLength} cm)</text>
                    <text x="18" y="85" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="end">x ＋ 1</text>
                    <text x="302" y="85" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="start">x ＋ 1</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1.5 text-slate-200">
                  <div>
                    <strong>Άθροισμα Όλων των Πλευρών:</strong>
                  </div>
                  <div className="font-mono text-indigo-200 text-xs sm:text-sm">
                    Π ＝ (2x ＋ 3) ＋ (2x ＋ 3) ＋ (x ＋ 1) ＋ (x ＋ 1)
                  </div>
                  <div className="font-mono text-emerald-400 font-bold text-sm sm:text-base">
                    Π ＝ (2 ＋ 2 ＋ 1 ＋ 1)·x ＋ (3 ＋ 3 ＋ 1 ＋ 1) ＝ 6x ＋ 8
                  </div>
                  <div className="pt-1 text-amber-300 font-mono text-sm sm:text-base font-bold">
                    Για x ＝ {geoX}: Π ＝ 6 · {geoX} ＋ 8 ＝ <strong>{rectPerimeter} cm</strong>
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
