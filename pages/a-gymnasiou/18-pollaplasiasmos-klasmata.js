import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

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

export default function PollaplasiasmosKlasmataTheoria() {
  // State για Εργαστήριο 1: Πολλαπλασιασμός Κλασμάτων
  const [f1Num, setF1Num] = useState(-3);
  const [f1Den, setF1Den] = useState(4);
  const [f2Num, setF2Num] = useState(2);
  const [f2Den, setF2Den] = useState(5);

  // State για Εργαστήριο 2: Πολλαπλασιασμός Δεκαδικών
  const [dec1, setDec1] = useState(-1.5);
  const [dec2, setDec2] = useState(2.4);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Κλάσματα)
  const rawNum = useMemo(() => f1Num * f2Num, [f1Num, f2Num]);
  const rawDen = useMemo(() => f1Den * f2Den, [f1Den, f2Den]);
  const commonGcd = useMemo(() => gcd(rawNum, rawDen), [rawNum, rawDen]);
  const reducedNum = useMemo(() => rawNum / commonGcd, [rawNum, commonGcd]);
  const reducedDen = useMemo(() => rawDen / commonGcd, [rawDen, commonGcd]);

  const areOmmosite = useMemo(() => (f1Num > 0 && f2Num > 0) || (f1Num < 0 && f2Num < 0), [f1Num, f2Num]);
  const areReciprocal = useMemo(() => reducedNum === 1 && reducedDen === 1, [reducedNum, reducedDen]);

  // Υπολογισμοί Εργαστηρίου 2 (Δεκαδικοί)
  const decProd = useMemo(() => Number((dec1 * dec2).toFixed(2)), [dec1, dec2]);
  const decOmmosite = useMemo(() => (dec1 > 0 && dec2 > 0) || (dec1 < 0 && dec2 < 0), [dec1, dec2]);

  return (
    <Layout
      title="Πολλαπλασιασμός Ρητών Αριθμών | Α' Γυμνασίου"
      description="Έννοια πολλαπλασιασμού ρητών αριθμών (κλάσματα και δεκαδικοί), κανόνας προσήμων, επιμεριστική ιδιότητα, αντίστροφοι ρητοί και διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/18-pollaplasiasmos-klasmata-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 16 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Πολλαπλασιασμός Ρητών Αριθμών
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε τον κανόνα των προσήμων, πώς πολλαπλασιάζουμε κλάσματα και δεκαδικούς, τι είναι οι αντίστροφοι ρητοί αριθμοί και πώς εφαρμόζουμε την επιμεριστική ιδιότητα.
            </p>
          </div>
        </section>

        {/* 1. Ο ΚΑΝΟΝΑΣ ΤΩΝ ΠΡΟΣΗΜΩΝ ΣΤΟΝ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Ο Κανόνας των Προσήμων στον Πολλαπλασιασμό
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Ομόσημοι */}
            <div className="p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-indigo-700 tracking-wider">ΟΜΟΣΗΜΟΙ ΡΗΤΟΙ</span>
                  <span className="text-xl">➕</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Γινόμενο Ομόσημων (Θετικό ＋)</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Το γινόμενο δύο ρητών αριθμών με το <strong>ίδιο πρόσημο</strong> είναι πάντοτε <strong>θετικός αριθμός</strong>:
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-1">
                  <li>(＋) · (＋) ＝ <strong>＋</strong></li>
                  <li>(－) · (－) ＝ <strong>＋</strong></li>
                </ul>
              </div>

              {/* Ομόσημοι (Αριστερή κάρτα) */}
              <div className="space-y-2 pt-2 border-t border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950">
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-indigo-100">
                  <span>(＋3) · (＋4)</span>
                  <span className="font-bold text-emerald-700">＝ ＋12</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-indigo-100">
                  <span className="flex items-center gap-1">
                    (<Frac num={2} den={3} isNeg={true} />) · (<Frac num={4} den={5} isNeg={true} />)
                  </span>
                  <span className="font-bold text-emerald-700 flex items-center">
                    ＝ ＋<Frac num={8} den={15} />
                  </span>
                </div>
              </div>
            </div>

            {/* Ετερόσημοι */}
            <div className="p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-sky-700 tracking-wider">ΕΤΕΡΟΣΗΜΟΙ ΡΗΤΟΙ</span>
                  <span className="text-xl">➖</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Γινόμενο Ετερόσημων (Αρνητικό －)</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Το γινόμενο δύο ρητών αριθμών με <strong>διαφορετικό πρόσημο</strong> είναι πάντοτε <strong>αρνητικός αριθμός</strong>:
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-1">
                  <li>(＋) · (－) ＝ <strong>－</strong></li>
                  <li>(－) · (＋) ＝ <strong>－</strong></li>
                </ul>
              </div>

              {/* Ετερόσημοι (Δεξιά κάρτα) */}
              <div className="space-y-2 pt-2 border-t border-sky-100 font-mono text-xs sm:text-sm text-sky-950">
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-sky-100">
                  <span>(＋2,5) · (－3)</span>
                  <span className="font-bold text-rose-700">＝ －7,5</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-sky-100">
                  <span className="flex items-center gap-1">
                    (＋<Frac num={3} den={7} />) · (<Frac num={5} den={4} isNeg={true} />)
                  </span>
                  <span className="font-bold text-rose-700 flex items-center">
                    ＝ <Frac num={15} den={28} isNeg={true} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΚΛΑΣΜΑΤΩΝ & ΑΝΤΙΣΤΡΟΦΟΙ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Πολλαπλασιασμός Κλασμάτων & Αντίστροφοι Ρητοί
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Κανόνας Κλασμάτων */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-indigo-700 tracking-wider">
                ΚΑΝΟΝΑΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ ΚΛΑΣΜΑΤΩΝ
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Πολλαπλασιάζουμε <strong>αριθμητή με αριθμητή</strong> και <strong>παρονομαστή με παρονομαστή</strong>:
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-center font-mono font-bold text-indigo-950 flex items-center justify-center gap-2">
                <Frac num="α" den="β" />
                <span>·</span>
                <Frac num="γ" den="δ" />
                <span>＝</span>
                <Frac num="α · γ" den="β · δ" />
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950">
                <strong>Συμβουλή:</strong> Πριν εκτελέσουμε τους πολλαπλασιασμούς, απλοποιούμε με <strong>διαίρεση</strong> κοινών παραγόντων μεταξύ αριθμητών και παρονομαστών για να προκύπτει άμεσα ανάγωγο κλάσμα.
              </div>
            </div>

            {/* Αντίστροφοι Ρητοί */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-sky-700 tracking-wider">
                ΑΝΤΙΣΤΡΟΦΟΙ ΡΗΤΟΙ ΑΡΙΘΜΟΙ
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Δύο μη μηδενικοί ρητοί αριθμοί ονομάζονται <strong>αντίστροφοι</strong> όταν το γινόμενό τους είναι ίσο με το <strong>1</strong>:
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-center font-mono font-bold text-sky-950 flex items-center justify-center gap-2">
                <Frac num="α" den="β" />
                <span>·</span>
                <Frac num="β" den="α" />
                <span>＝ 1</span>
              </div>
              <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-1">
                <li>Ο αντίστροφος του <Frac num="3" den="5" /> είναι ο <Frac num="5" den="3" />.</li>
                <li>Ο αντίστροφος του <Frac num="-2" den="7" /> είναι ο <Frac num="-7" den="2" /> (διατηρεί το ίδιο πρόσημο).</li>
                <li>Ο αντίστροφος του <strong>4</strong> είναι ο <Frac num="1" den="4" />.</li>
                <li>Το <strong>0 δεν έχει αντίστροφο</strong> αριθμό.</li>
              </ul>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΟΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΚΛΑΣΜΑΤΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 1: Διαδραστικός Πολλαπλασιασμός Κλασμάτων & Έλεγχος Αντιστρόφων
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers Ελέγχου (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* 1ο Κλάσμα */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase">1ΟΣ ΠΑΡΑΓΟΝΤΑΣ</div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΑΡΙΘΜΗΤΗΣ (α)</label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, -1, -15, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {f1Num > 0 ? `＋${f1Num}` : f1Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, 1, -15, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΠΑΡΟΝΟΜΑΣΤΗΣ (β)</label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {f1Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2ο Κλάσμα */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-sky-900 uppercase">2ΟΣ ΠΑΡΑΓΟΝΤΑΣ</div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΑΡΙΘΜΗΤΗΣ (γ)</label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, -1, -15, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {f2Num > 0 ? `＋${f2Num}` : f2Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, 1, -15, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΠΑΡΟΝΟΜΑΣΤΗΣ (δ)</label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {f2Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ανάλυση Βήμα-Βήμα (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΝΑΛΥΣΗ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    areReciprocal
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : areOmmosite
                      ? 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {areReciprocal ? 'ΑΝΤΙΣΤΡΟΦΟΙ ΡΗΤΟΙ (＝ 1)' : areOmmosite ? 'ΟΜΟΣΗΜΟΙ (＋)' : 'ΕΤΕΡΟΣΗΜΟΙ (－)'}
                  </span>
                </div>

                {/* Αρχική Πράξη */}
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-2 text-base sm:text-xl">
                  <span className="text-xs text-slate-300 font-sans">Αρχικό Γινόμενο:</span>
                  <div className="flex items-center gap-1.5">
                    <span>(</span><Frac num={f1Num} den={f1Den} className="text-white" /><span>)</span>
                    <span className="text-amber-400 font-bold">·</span>
                    <span>(</span><Frac num={f2Num} den={f2Den} className="text-white" /><span>)</span>
                  </div>
                </div>

                {/* Βήμα 1: Ενιαίο Κλάσμα */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                  <div className="text-slate-300 font-bold">
                    Βήμα 1: Πολλαπλασιασμός αριθμητών και παρονομαστών:
                  </div>
                  <div className="font-mono text-sm sm:text-base flex items-center gap-2 pt-1 flex-wrap">
                    <span>＝</span>
                    <span className="inline-flex items-center gap-1 align-middle mx-1 font-mono">
                      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
                        <span className="pb-0.5 px-1 border-b-2 w-full text-center border-white">
                          ({f1Num > 0 ? `＋${f1Num}` : f1Num}) · ({f2Num > 0 ? `＋${f2Num}` : f2Num})
                        </span>
                        <span className="pt-0.5 px-1 w-full text-center text-slate-300">
                          {f1Den} · {f2Den}
                        </span>
                      </span>
                    </span>
                    <span>＝</span>
                    <Frac num={rawNum} den={rawDen} className="text-indigo-200" />
                  </div>
                </div>

                {/* Τελικό Αποτέλεσμα / Απλοποίηση */}
                <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs sm:text-sm text-emerald-200 font-sans font-bold">
                    ΤΕΛΙΚΟ ΑΝΑΓΩΓΟ ΑΠΟΤΕΛΕΣΜΑ:
                  </span>
                  <div className="text-xl sm:text-3xl font-black text-emerald-400 flex items-center gap-2">
                    {rawNum === 0 ? (
                      <span>0</span>
                    ) : reducedDen === 1 ? (
                      <span>{reducedNum}</span>
                    ) : (
                      <>
                        <Frac num={reducedNum} den={reducedDen} className="text-emerald-400 text-xl sm:text-3xl" />
                        {commonGcd > 1 && (
                          <span className="text-xs text-emerald-300 font-sans font-normal">
                            (μετά από διαίρεση με το {commonGcd})
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΙΔΙΟΤΗΤΕΣ & ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Ιδιότητες Πολλαπλασιασμού & Επιμεριστική Ιδιότητα
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Αντιμεταθετική & Προσεταιριστική */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">ΒΑΣΙΚΕΣ ΙΔΙΟΤΗΤΕΣ</span>
              <h3 className="font-bold text-slate-900 text-base">Αντιμεταθετική & Προσεταιριστική</h3>
              <p className="text-slate-600">
                Μπορούμε να αλλάζουμε τη σειρά των παραγόντων ή να τους ομαδοποιούμε:
              </p>
              <div className="p-2 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs space-y-1">
                <div>α · β ＝ β · α</div>
                <div>(α · β) · γ ＝ α · (β · γ)</div>
              </div>
            </div>

            {/* Ουδέτερο & Μηδενικό Στοιχείο */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">ΕΙΔΙΚΑ ΣΤΟΙΧΕΙΑ</span>
              <h3 className="font-bold text-slate-900 text-base">Ουδέτερο (1) & Μηδενικό (0)</h3>
              <p className="text-slate-600">
                Το 1 δεν αλλάζει το αποτέλεσμα, ενώ το 0 μηδενίζει το γινόμενο:
              </p>
              <div className="p-2 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-950 text-center text-xs space-y-1">
                <div>α · 1 ＝ α</div>
                <div>α · 0 ＝ 0</div>
              </div>
            </div>

            {/* Επιμεριστική Ιδιότητα */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2.5 md:col-span-2 lg:col-span-1">
              <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block">ΘΕΜΕΛΙΩΔΗΣ ΙΔΙΟΤΗΤΑ</span>
              <h3 className="font-bold text-slate-900 text-base">Επιμεριστική Ιδιότητα</h3>
              <p className="text-slate-600">
                Ο πολλαπλασιασμός επιμερίζεται ως προς την πρόσθεση και την αφαίρεση:
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-indigo-200 font-mono font-bold text-indigo-950 text-center text-xs space-y-1">
                <div>α · (β ＋ γ) ＝ α · β ＋ α · γ</div>
                <div>α · (β － γ) ＝ α · β － α · γ</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΔΕΚΑΔΙΚΩΝ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              Πολλαπλασιασμός Δεκαδικών Αριθμών
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-3">
              <p>
                Για να πολλαπλασιάσουμε ρητούς αριθμούς σε <strong>δεκαδική μορφή</strong>:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div>
                  <strong>1. Πρόσημο:</strong> Εφαρμόζουμε τον κανόνα των προσήμων (ομόσημοι ＝ θετικό, ετερόσημοι ＝ αρνητικό).
                </div>
                <div>
                  <strong>2. Πολλαπλασιασμός:</strong> Πολλαπλασιάζουμε τους αριθμούς <strong>αγνοώντας την υποδιαστολή</strong>.
                </div>
                <div>
                  <strong>3. Θέση Υποδιαστολής:</strong> Στο αποτέλεσμα τοποθετούμε υποδιαστολή χωρίζοντας <strong>τόσα δεκαδικά ψηφία όσα έχουν συνολικά και οι δύο παράγοντες</strong>.
                </div>
              </div>
            </div>

            {/* Παράδειγμα Δεκαδικών */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2 font-mono text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-indigo-800 font-sans">
                ΠΑΡΑΔΕΙΓΜΑΤΑ ΥΠΟΛΟΓΙΣΜΟΥ
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1.5">
                <div>(＋1,2) · (＋0,4) ＝ ＋(12 · 4 / 100) ＝ <strong>＋0,48</strong></div>
                <div>(－2,5) · (＋0,3) ＝ －(25 · 3 / 100) ＝ <strong>－0,75</strong></div>
                <div>(－1,5) · (－0,6) ＝ ＋(15 · 6 / 100) ＝ <strong>＋0,90 ＝ ＋0,9</strong></div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΟΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΔΕΚΑΔΙΚΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Διαδραστικός Υπολογιστής Πολλαπλασιασμού Δεκαδικών
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Χειριστήρια Steppers: Ακέραιο (±1) και Δεκαδικό (±0.1) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* 1ος Δεκαδικός */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 uppercase">1ΟΣ ΠΑΡΑΓΟΝΤΑΣ</label>
                    <span className="text-base font-black font-mono text-indigo-950 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {dec1 > 0 ? `＋${dec1.toFixed(1).replace('.', ',')}` : dec1.toFixed(1).replace('.', ',')}
                    </span>
                  </div>

                  {/* Ακέραιο Μέρος (±1) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ΑΚΕΡΑΙΟ (±1)</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.max(-10, Number((prev - 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.min(10, Number((prev + 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  {/* Δεκαδικό Μέρος (±0.1) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ΔΕΚΑΔΙΚΟ (±0,1)</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.max(-10, Number((prev - 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.min(10, Number((prev + 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        ＋0,1
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2ος Δεκαδικός */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 uppercase">2ΟΣ ΠΑΡΑΓΟΝΤΑΣ</label>
                    <span className="text-base font-black font-mono text-sky-950 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {dec2 > 0 ? `＋${dec2.toFixed(1).replace('.', ',')}` : dec2.toFixed(1).replace('.', ',')}
                    </span>
                  </div>

                  {/* Ακέραιο Μέρος (±1) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ΑΚΕΡΑΙΟ (±1)</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.max(-10, Number((prev - 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.min(10, Number((prev + 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  {/* Δεκαδικό Μέρος (±0.1) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ΔΕΚΑΔΙΚΟ (±0,1)</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.max(-10, Number((prev - 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.min(10, Number((prev + 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        ＋0,1
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος Δεκαδικών (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΠΟΤΕΛΕΣΜΑ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ ΔΕΚΑΔΙΚΩΝ
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    decOmmosite
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {decOmmosite ? 'ΟΜΟΣΗΜΟΙ (＋)' : 'ΕΤΕΡΟΣΗΜΟΙ (－)'}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 text-2xl sm:text-4xl font-black py-2 flex-wrap">
                  <span>({dec1 > 0 ? `＋${dec1.toFixed(1).replace('.', ',')}` : dec1.toFixed(1).replace('.', ',')})</span>
                  <span className="text-amber-400 font-sans">·</span>
                  <span>({dec2 > 0 ? `＋${dec2.toFixed(1).replace('.', ',')}` : dec2.toFixed(1).replace('.', ',')})</span>
                  <span className="text-indigo-400 font-sans">＝</span>
                  <span className="text-emerald-400">
                    {decProd > 0 ? `＋${decProd.toFixed(2).replace('.', ',')}` : decProd.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                  Οι παράγοντες είναι <strong>{decOmmosite ? 'ομόσημοι' : 'ετερόσημοι'}</strong>, επομένως το πρόσημο είναι <strong>{decOmmosite ? 'θετικό (＋)' : 'αρνητικό (－)'}</strong>. Πολλαπλασιάσαμε {Math.round(Math.abs(dec1) * 10)} · {Math.round(Math.abs(dec2) * 10)} ＝ {Math.round(Math.abs(dec1) * 10 * Math.round(Math.abs(dec2) * 10))} και χωρίσαμε 2 δεκαδικά ψηφία (1 ＋ 1 ＝ 2 δεκαδικά).
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
