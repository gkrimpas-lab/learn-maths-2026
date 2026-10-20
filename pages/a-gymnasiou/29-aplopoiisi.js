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

export default function AplopoiisiTheoria() {
  // State για Εργαστήριο 1: Γεωμετρική Ερμηνεία Επιμεριστικής α · (β + γ)
  const [geoA, setGeoA] = useState(4); // Ύψος
  const [geoB, setGeoB] = useState(5); // 1ο μήκος
  const [geoC, setGeoC] = useState(3); // 2ο μήκος

  // State για Εργαστήριο 2: Απλοποίηση α·(x + β) + γ·x + δ & Πίνακας Τιμών
  const [distA, setDistA] = useState(3);
  const [distB, setDistB] = useState(2);
  const [distC, setDistC] = useState(-4);
  const [distD, setDistD] = useState(5);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Γεωμετρική Ερμηνεία)
  const area1 = useMemo(() => geoA * geoB, [geoA, geoB]);
  const area2 = useMemo(() => geoA * geoC, [geoA, geoC]);
  const totalGeoArea = useMemo(() => area1 + area2, [area1, area2]);
  const totalBase = useMemo(() => geoB + geoC, [geoB, geoC]);

  // Υπολογισμοί Εργαστηρίου 2 (Απλοποίηση Παράστασης)
  // Παράσταση: distA * (x + distB) + distC * x + distD
  // Ανάπτυξη: (distA * x) + (distA * distB) + (distC * x) + distD
  // Ανηγμένη μορφή: (distA + distC) * x + (distA * distB + distD)
  const expandedConstFromParen = useMemo(() => distA * distB, [distA, distB]);
  const finalXCoeff = useMemo(() => distA + distC, [distA, distC]);
  const finalConstant = useMemo(() => expandedConstFromParen + distD, [expandedConstFromParen, distD]);

  // Παραγωγή Πίνακα Τιμών για x = -2 έως 3
  const tableValues = useMemo(() => {
    const list = [];
    for (let x = -2; x <= 3; x++) {
      list.push({
        x,
        val: finalXCoeff * x + finalConstant,
      });
    }
    return list;
  }, [finalXCoeff, finalConstant]);

  return (
    <Layout
      title="Απλοποίηση Παραστάσεων & Πίνακες Τιμών | Α' Γυμνασίου"
      description="Υπολογισμός αριθμητικής τιμής, πίνακες τιμών, απλοποίηση με επιμεριστική ιδιότητα, γεωμετρική ερμηνεία και διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/29-aplopoiisi-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 26 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Απλοποίηση Αλγεβρικών Παραστάσεων & Πίνακες Τιμών
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε πώς να απλοποιούμε σύνθετες αλγεβρικές παραστάσεις εφαρμόζοντας την επιμεριστική ιδιότητα, κατανοούμε τη γεωμετρική της σημασία μέσω εμβαδών και κατασκευάζουμε αναλυτικούς πίνακες τιμών.
            </p>
          </div>
        </section>

        {/* 1. ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ & ΠΙΝΑΚΑΣ ΤΙΜΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Υπολογισμός Αριθμητικής Τιμής & Πίνακας Τιμών
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                Για να βρούμε την <strong>αριθμητική τιμή</strong> μιας αλγεβρικής παράστασης:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li>Αντικαθιστούμε κάθε μεταβλητή με τον δοσμένο αριθμό (προσοχή στα αρνητικά πρόσημα, τα βάζουμε πάντα σε παρένθεση).</li>
                <li>Εκτελούμε τις αριθμητικές πράξεις ακολουθώντας την αυστηρή <strong>προτεραιότητα πράξεων</strong> (πρώτα παρενθέσεις, μετά δυνάμεις, μετά πολλαπλασιασμοί/διαιρέσεις και τέλος προσθέσεις/αφαιρέσεις).</li>
              </ol>
              <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950">
                Παράδειγμα για 2x² － 3x ＋ 1 και x ＝ －2:
                <div className="pt-1 text-slate-700">
                  2 · (－2)² － 3 · (－2) ＋ 1 ＝ 2 · 4 ＋ 6 ＋ 1 ＝ 8 ＋ 6 ＋ 1 ＝ <strong>15</strong>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                ΤΙ ΕΙΝΑΙ Ο ΠΙΝΑΚΑΣ ΤΙΜΩΝ;
              </div>
              <p className="text-slate-600">
                Είναι ένας πίνακας στον οποίο τοποθετούμε διαδοχικές τιμές για τη μεταβλητή (συνήθως ακέραιες τιμές γύρω από το μηδέν) και υπολογίζουμε το αντίστοιχο αποτέλεσμα της παράστασης.
              </p>
              <p className="text-slate-600">
                Μας επιτρέπει να παρατηρήσουμε πώς μεταβάλλεται η τιμή της παράστασης και να σχεδιάσουμε εύκολα το γράφημά της.
              </p>
            </div>
          </div>
        </section>

        {/* 2. ΓΕΩΜΕΤΡΙΚΗ ΕΡΜΗΝΕΙΑ ΕΠΙΜΕΡΙΣΤΙΚΗΣ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Γεωμετρική Ερμηνεία της Επιμεριστικής Ιδιότητας
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                Η επιμεριστική ιδιότητα <strong>α · (β ＋ γ) ＝ α · β ＋ α · γ</strong> έχει μια πανέμορφη και ξεκάθαρη <strong>γεωμετρική ερμηνεία</strong>:
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                Φαντάσου ένα μεγάλο ορθογώνιο με ύψος <strong>α</strong> και βάση <strong>β ＋ γ</strong>. Μπορούμε να υπολογίσουμε το συνολικό του εμβαδόν με δύο ισοδύναμους τρόπους:
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 font-mono text-center font-bold text-indigo-950 text-sm sm:text-base space-y-1">
                <div>Συνολικό Εμβαδόν ＝ α · (β ＋ γ)</div>
                <div className="text-indigo-600">＝ α · β (Μπλε) ＋ α · γ (Κεχριμπαρί)</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
              <div className="font-bold text-slate-900 text-base">Αφαίρεση Παρένθεσης με Επιμεριστική</div>
              <p className="text-slate-600">
                Όταν πολλαπλασιάζουμε έναν αριθμό με μια παρένθεση, πολλαπλασιάζουμε τον εξωτερικό συντελεστή με <strong>κάθε όρο μέσα στην παρένθεση ξεχωριστά</strong>:
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 space-y-1">
                <div>• 3 · (x ＋ 4) ＝ 3 · x ＋ 3 · 4 ＝ <strong>3x ＋ 12</strong></div>
                <div>• －2 · (x － 5) ＝ (－2) · x － (－2) · 5 ＝ <strong>－2x ＋ 10</strong></div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΓΕΩΜΕΤΡΙΚΗ ΟΠΤΙΚΟΠΟΙΗΣΗ (ΧΩΡΙΣ ΟΡΙΖΟΝΤΙΟ SCROLL) */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 1: Διαδραστική Γεωμετρική Απόδειξη Επιμεριστικής Ιδιότητας
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Steppers (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">ΥΨΟΣ (α)</label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoA, -1, 1, 8, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                      {geoA}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoA, 1, 1, 8, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-sky-700 uppercase block">ΒΑΣΗ 1 (β)</label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoB, -1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-sm font-mono text-sky-950">
                      {geoB}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoB, 1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-amber-700 uppercase block">ΒΑΣΗ 2 (γ)</label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoC, -1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                      {geoC}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setGeoC, 1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Οπτική Προβολή SVG & Ισότητα (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΓΕΩΜΕΤΡΙΚΗ ΑΠΟΔΕΙΞΗ ΕΜΒΑΔΟΥ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                    Ε ＝ {totalGeoArea} τ.μ.
                  </span>
                </div>

                {/* Responsive SVG Σχήμα Εμβαδών */}
                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-4 flex justify-center">
                  <svg viewBox="0 0 320 140" className="w-full max-w-[300px] h-auto">
                    {/* 1ο Ορθογώνιο (α * β) */}
                    <rect x="30" y="25" width="140" height="90" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2" />
                    <text x="100" y="65" fill="#bae6fd" fontSize="12" fontWeight="bold" textAnchor="middle">α · β</text>
                    <text x="100" y="82" fill="#7dd3fc" fontSize="11" textAnchor="middle">{geoA} · {geoB} ＝ {area1}</text>
                    <text x="100" y="16" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">β ＝ {geoB}</text>

                    {/* 2ο Ορθογώνιο (α * γ) */}
                    <rect x="170" y="25" width="100" height="90" fill="#291e0a" stroke="#f59e0b" strokeWidth="2" />
                    <text x="220" y="65" fill="#fde68a" fontSize="12" fontWeight="bold" textAnchor="middle">α · γ</text>
                    <text x="220" y="82" fill="#fcd34d" fontSize="11" textAnchor="middle">{geoA} · {geoC} ＝ {area2}</text>
                    <text x="220" y="16" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">γ ＝ {geoC}</text>

                    {/* Ετικέτα Ύψους α */}
                    <text x="20" y="75" fill="#a5b4fc" fontSize="12" fontWeight="bold" textAnchor="end">α ＝ {geoA}</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1 text-slate-200">
                  <div className="font-bold text-amber-300">
                    Υπολογισμός με δύο ισοδύναμους τρόπους:
                  </div>
                  <div>1. Ως ενιαίο ορθογώνιο: {geoA} · ({geoB} ＋ {geoC}) ＝ {geoA} · {totalBase} ＝ <strong>{totalGeoArea}</strong></div>
                  <div>2. Ως άθροισμα επιμέρους εμβαδών: ({geoA} · {geoB}) ＋ ({geoA} · {geoC}) ＝ {area1} ＋ {area2} ＝ <strong>{totalGeoArea}</strong></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΕΡΓΑΣΤΗΡΙΟ 2: ΑΠΛΟΠΟΙΗΣΗ & ΠΙΝΑΚΑΣ ΤΙΜΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Απλοποίηση Παράστασης & Αυτόματος Πίνακας Τιμών
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            Στην παρακάτω σύνθετη αλγεβρική παράσταση, εφαρμόζουμε πρώτα την <strong>επιμεριστική ιδιότητα</strong> για να απαλείψουμε την παρένθεση και στη συνέχεια κάνουμε <strong>αναγωγή ομοίων όρων</strong>:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Steppers Παραμέτρων (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block">ΕΞΩΤΕΡΙΚΟΣ (α)</label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistA, -1, -6, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-indigo-950">
                    {distA > 0 ? `＋${distA}` : distA}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistA, 1, -6, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block">ΣΤΑΘΕΡΟΣ ΠΑΡΕΝΘ. (β)</label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistB, -1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-indigo-950">
                    {distB > 0 ? `＋${distB}` : distB}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistB, 1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sky-800 uppercase block">ΕΞΩΤΕΡΙΚΟΣ ΟΡΟΣ x (γ)</label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistC, -1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-sky-950">
                    {distC > 0 ? `＋${distC}` : distC}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistC, 1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-800 uppercase block">ΕΞΩΤΕΡΙΚΟΣ ΣΤΑΘΕΡΟΣ (δ)</label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistD, -1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-amber-950">
                    {distD > 0 ? `＋${distD}` : distD}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setDistD, 1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Πίνακας Τιμών (Στη θέση του κάτω μέρους) */}
              <div className="col-span-2 pt-3 border-t border-slate-200 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  ΑΥΤΟΜΑΤΟΣ ΠΙΝΑΚΑΣ ΤΙΜΩΝ
                </div>
                <div className="w-full border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
                  <div className="flex bg-slate-200 font-bold text-slate-700 text-xs">
                    <div className="w-1/2 p-1.5 border-r border-slate-300 text-center font-mono">x</div>
                    <div className="w-1/2 p-1.5 text-center font-mono">Τιμή</div>
                  </div>
                  {tableValues.map((row) => (
                    <div key={row.x} className="flex border-t border-slate-200 text-xs font-mono">
                      <div className="w-1/2 p-1 border-r border-slate-200 text-center text-slate-600">
                        {row.x}
                      </div>
                      <div className="w-1/2 p-1 text-center font-bold text-indigo-700">
                        {row.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Αναλυτικά Βήματα Απλοποίησης (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  ΡΟΗ ΑΠΛΟΠΟΙΗΣΗΣ
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans">
                  ΕΠΙΜΕΡΙΣΤΙΚΗ & ΑΝΑΓΩΓΗ
                </span>
              </div>

              {/* 1. Αρχική Παράσταση */}
              <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 space-y-1">
                <div className="text-[10px] text-slate-400 font-sans uppercase">Αρχική Παράσταση:</div>
                <div className="text-amber-300 font-bold text-sm sm:text-base">
                  {distA} · (x {distB >= 0 ? `＋ ${distB}` : `－ ${Math.abs(distB)}`}) {distC >= 0 ? `＋ ${distC}x` : `－ ${Math.abs(distC)}x`} {distD >= 0 ? `＋ ${distD}` : `－ ${Math.abs(distD)}`}
                </div>
              </div>

              {/* 2. Ανάπτυξη Επιμεριστικής */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1">
                <div className="text-slate-300 font-bold">Βήμα 1: Απαλοιφή παρένθεσης με επιμεριστική:</div>
                <div className="font-mono text-indigo-200 text-xs sm:text-sm">
                  ＝ ({distA}·x) ＋ ({distA}·{distB < 0 ? `(${distB})` : distB}) {distC >= 0 ? `＋ ${distC}x` : `－ ${Math.abs(distC)}x`} {distD >= 0 ? `＋ ${distD}` : `－ ${Math.abs(distD)}`}
                </div>
                <div className="font-mono text-slate-300 text-xs sm:text-sm">
                  ＝ {distA}x {expandedConstFromParen >= 0 ? `＋ ${expandedConstFromParen}` : `－ ${Math.abs(expandedConstFromParen)}`} {distC >= 0 ? `＋ ${distC}x` : `－ ${Math.abs(distC)}x`} {distD >= 0 ? `＋ ${distD}` : `－ ${Math.abs(distD)}`}
                </div>
              </div>

              {/* 3. Ομαδοποίηση */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1">
                <div className="text-slate-300 font-bold">Βήμα 2: Ομαδοποίηση ομοίων όρων και σταθερών:</div>
                <div className="font-mono text-indigo-200 text-xs sm:text-sm">
                  ＝ ({distA} ＋ {distC < 0 ? `(${distC})` : distC})·x ＋ ({expandedConstFromParen} ＋ {distD < 0 ? `(${distD})` : distD})
                </div>
              </div>

              {/* 4. Τελική Ανηγμένη Μορφή */}
              <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-2 text-emerald-300 font-sans">
                <span className="text-xs sm:text-sm font-bold">
                  ΤΕΛΙΚΗ ΑΠΛΟΠΟΙΗΜΕΝΗ ΜΟΡΦΗ:
                </span>
                <span className="text-xl sm:text-3xl font-black font-mono text-emerald-400">
                  ＝ {finalXCoeff}x {finalConstant >= 0 ? `＋ ${finalConstant}` : `－ ${Math.abs(finalConstant)}`}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
