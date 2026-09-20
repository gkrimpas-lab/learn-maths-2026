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

// Ειδικό component για οπτική αναπαράσταση Σύνθετου Κλάσματος
function CompoundFrac({ num1, den1, num2, den2, isNeg = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 align-middle mx-1 font-mono ${className}`}>
      {isNeg && <span className="font-bold text-xl sm:text-2xl">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        {/* Αριθμητής (Κλάσμα 1) */}
        <span className="pb-1 px-2 border-b-4 border-amber-400 w-full flex justify-center">
          <Frac num={num1} den={den1} />
        </span>
        {/* Παρονομαστής (Κλάσμα 2) */}
        <span className="pt-1 px-2 w-full flex justify-center">
          <Frac num={num2} den={den2} />
        </span>
      </span>
    </span>
  );
}

export default function DiairesiRitonTheoria() {
  // State για Εργαστήριο 1: Διαίρεση Κλασμάτων
  const [f1Num, setF1Num] = useState(-3);
  const [f1Den, setF1Den] = useState(4);
  const [f2Num, setF2Num] = useState(2);
  const [f2Den, setF2Den] = useState(5);

  // State για Εργαστήριο 2: Σύνθετο Κλάσμα
  const [cNum1, setCNum1] = useState(3);
  const [cDen1, setCDen1] = useState(4);
  const [cNum2, setCNum2] = useState(5);
  const [cDen2, setCDen2] = useState(6);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => {
      let next = prev + val;
      // Αποφυγή μηδενισμού στον διαιρέτη/παρονομαστή
      if (min === 1 && next < 1) next = 1;
      return Math.max(min, Math.min(max, next));
    });
  };

  // Υπολογισμοί Εργαστηρίου 1 (Διαίρεση)
  // (f1Num / f1Den) : (f2Num / f2Den) = (f1Num / f1Den) * (f2Den / f2Num)
  const isDivisorZero = f2Num === 0;
  const recipNum = f2Den;
  const recipDen = f2Num;

  const rawProdNum = useMemo(() => f1Num * recipNum, [f1Num, recipNum]);
  const rawProdDen = useMemo(() => f1Den * recipDen, [f1Den, recipDen]);

  const areOmmosite = useMemo(() => (f1Num > 0 && f2Num > 0) || (f1Num < 0 && f2Num < 0), [f1Num, f2Num]);
  const isFinalNegative = rawProdNum * rawProdDen < 0;

  const commonGcd = useMemo(() => gcd(rawProdNum, rawProdDen), [rawProdNum, rawProdDen]);
  const reducedNum = useMemo(() => Math.abs(rawProdNum) / commonGcd, [rawProdNum, commonGcd]);
  const reducedDen = useMemo(() => Math.abs(rawProdDen) / commonGcd, [rawProdDen, commonGcd]);

  // Υπολογισμοί Εργαστηρίου 2 (Σύνθετο Κλάσμα)
  // (cNum1 / cDen1) / (cNum2 / cDen2) = (cNum1 * cDen2) / (cDen1 * cNum2)
  const akroiProd = useMemo(() => cNum1 * cDen2, [cNum1, cDen2]);
  const mesoiProd = useMemo(() => cDen1 * cNum2, [cDen1, cNum2]);
  const compoundGcd = useMemo(() => gcd(akroiProd, mesoiProd), [akroiProd, mesoiProd]);
  const redCompoundNum = useMemo(() => akroiProd / compoundGcd, [akroiProd, compoundGcd]);
  const redCompoundDen = useMemo(() => mesoiProd / compoundGcd, [mesoiProd, compoundGcd]);

  return (
    <Layout
      title="Διαίρεση Ρητών & Σύνθετα Κλάσματα | Α' Γυμνασίου"
      description="Έννοια της διαίρεσης ρητών αριθμών, σύνδεση με τον αντίστροφο αριθμό, κανόνας προσήμων και μετατροπή σύνθετου κλάσματος σε απλό."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/20-diairesi-riton-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 18 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Διαίρεση Ρητών Αριθμών & Σύνθετα Κλάσματα
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε πώς η διαίρεση ρητών μετατρέπεται σε πολλαπλασιασμό με τον αντίστροφο αριθμό, πώς εφαρμόζονται οι κανόνες προσήμων και πώς μετατρέπουμε οποιοδήποτε σύνθετο κλάσμα σε απλό.
            </p>
          </div>
        </section>

        {/* 1. ΟΡΙΣΜΟΣ ΔΙΑΙΡΕΣΗΣ & ΚΑΝΟΝΑΣ ΠΡΟΣΗΜΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Ορισμός της Διαίρεσης & Κανόνας Προσήμων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                Η διαίρεση ενός ρητού αριθμού <strong>α</strong> με έναν μη μηδενικό ρητό <strong>β</strong> (β ≠ 0) ορίζεται ως ο <strong>πολλαπλασιασμός του διαιρετέου α με τον αντίστροφο του διαιρέτη β</strong>:
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-lg sm:text-2xl font-mono shadow-sm flex items-center justify-center gap-2 flex-wrap">
                <span>α ： β ＝ α ·</span>
                <Frac num="1" den="β" />
                <span className="text-xs text-slate-500 font-sans font-normal">(β ≠ 0)</span>
              </div>
              <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs sm:text-sm text-rose-950">
                <strong>Απαγόρευση Μηδενός:</strong> Η διαίρεση με το μηδέν (0) <strong>είναι αδύνατη</strong> και δεν ορίζεται ποτέ στα μαθηματικά!
              </div>
            </div>

            {/* Κανόνας Προσήμων */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Ο ΚΑΝΟΝΑΣ ΤΩΝ ΠΡΟΣΗΜΩΝ ΣΤΗ ΔΙΑΙΡΕΣΗ
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Ισχύει ακριβώς ο ίδιος κανόνας προσήμων όπως και στον πολλαπλασιασμό:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs sm:text-sm pt-1">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-emerald-700 font-bold font-sans">Ομόσημοι ➔ Θετικό (＋)</div>
                  <div>(＋) ： (＋) ＝ <strong>＋</strong></div>
                  <div>(－) ： (－) ＝ <strong>＋</strong></div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-rose-700 font-bold font-sans">Ετερόσημοι ➔ Αρνητικό (－)</div>
                  <div>(＋) ： (－) ＝ <strong>－</strong></div>
                  <div>(－) ： (＋) ＝ <strong>－</strong></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΙΡΕΣΗ ΚΛΑΣΜΑΤΩΝ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Πώς Διαιρούμε Κλάσματα
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-black text-indigo-600 uppercase">ΒΗΜΑ 1</div>
              <h4 className="font-bold text-slate-900 text-base">Αντιστροφή Διαιρέτη</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Διατηρούμε το 1ο κλάσμα (διαιρετέο) ακριβώς όπως είναι και <strong>αντιστρέφουμε τους όρους του 2ου κλάσματος</strong> (διαιρέτη).
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-black text-indigo-600 uppercase">ΒΗΜΑ 2</div>
              <h4 className="font-bold text-slate-900 text-base">Μετατροπή σε Πολλαπλασιασμό</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Αντικαθιστούμε το σύμβολο της διαίρεσης (：) με το σύμβολο του <strong>πολλαπλασιασμού (·)</strong>.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-black text-indigo-600 uppercase">ΒΗΜΑ 3</div>
              <h4 className="font-bold text-slate-900 text-base">Υπολογισμός & Απλοποίηση</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Πολλαπλασιάζουμε αριθμητή με αριθμητή και παρονομαστή με παρονομαστή και, αν χρειάζεται, απλοποιούμε με <strong>διαίρεση</strong> σε ανάγωγο κλάσμα.
              </p>
            </div>
          </div>

          {/* Μαθηματικός Κανόνας */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-center font-mono font-bold text-indigo-950 text-base sm:text-xl flex items-center justify-center gap-3 flex-wrap shadow-sm">
            <Frac num="α" den="β" />
            <span className="text-rose-600 font-bold">：</span>
            <Frac num="γ" den="δ" />
            <span className="text-indigo-400">＝</span>
            <Frac num="α" den="β" />
            <span className="text-emerald-600 font-bold">·</span>
            <Frac num="δ" den="γ" />
            <span className="text-indigo-400">＝</span>
            <Frac num="α · δ" den="β · γ" />
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΔΙΑΙΡΕΣΗ ΚΛΑΣΜΑΤΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 1: Διαδραστική Διαίρεση Κλασμάτων Βήμα-Βήμα
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers Ελέγχου (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* 1ο Κλάσμα (Διαιρετέος) */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase">1ΟΣ ΟΡΟΣ (ΔΙΑΙΡΕΤΕΟΣ)</div>
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

                {/* 2ο Κλάσμα (Διαιρέτης) */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-sky-900 uppercase">2ΟΣ ΟΡΟΣ (ΔΙΑΙΡΕΤΗΣ)</div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΑΡΙΘΜΗΤΗΣ (γ ≠ 0)</label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          let next = f2Num - 1;
                          if (next === 0) next = -1;
                          handleStep(setF2Num, next - f2Num, -15, 15, e);
                        }}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {f2Num > 0 ? `＋${f2Num}` : f2Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          let next = f2Num + 1;
                          if (next === 0) next = 1;
                          handleStep(setF2Num, next - f2Num, -15, 15, e);
                        }}
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
                    ΑΝΑΛΥΣΗ ΔΙΑΙΡΕΣΗΣ
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    areOmmosite
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {areOmmosite ? 'ΟΜΟΣΗΜΟΙ ➔ ΠΗΛΙΚΟ (＋)' : 'ΕΤΕΡΟΣΗΜΟΙ ➔ ΠΗΛΙΚΟ (－)'}
                  </span>
                </div>

                {/* Αρχική Πράξη */}
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-2 text-base sm:text-xl">
                  <span className="text-xs text-slate-300 font-sans">Αρχική Διαίρεση:</span>
                  <div className="flex items-center gap-1.5">
                    <span>(</span><Frac num={f1Num} den={f1Den} className="text-white" /><span>)</span>
                    <span className="text-rose-400 font-bold">：</span>
                    <span>(</span><Frac num={f2Num} den={f2Den} className="text-white" /><span>)</span>
                  </div>
                </div>

                {/* Βήμα 1: Αντιστροφή σε πολλαπλασιασμό */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                  <div className="text-slate-300 font-bold">
                    Βήμα 1: Πολλαπλασιασμός με τον αντίστροφο του διαιρέτη:
                  </div>
                  <div className="font-mono text-sm sm:text-base flex items-center gap-2 pt-1 flex-wrap">
                    <span>＝</span>
                    <span>(</span><Frac num={f1Num} den={f1Den} className="text-indigo-200" /><span>)</span>
                    <span className="text-emerald-400 font-bold">·</span>
                    <span>(</span><Frac num={recipNum} den={recipDen} className="text-sky-200" /><span>)</span>
                  </div>
                </div>

                {/* Βήμα 2: Γινόμενο όρων */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                  <div className="text-slate-300 font-bold">
                    Βήμα 2: Γινόμενο αριθμητών και παρονομαστών:
                  </div>
                  <div className="font-mono text-sm sm:text-base flex items-center gap-2 pt-1 flex-wrap">
                    <span>＝</span>
                    <Frac num={rawProdNum} den={rawProdDen} className="text-amber-300" />
                  </div>
                </div>

                {/* Τελικό Αποτέλεσμα / Απλοποίηση */}
                <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs sm:text-sm text-emerald-200 font-sans font-bold">
                    ΤΕΛΙΚΟ ΑΝΑΓΩΓΟ ΠΗΛΙΚΟ:
                  </span>
                  <div className="text-xl sm:text-3xl font-black text-emerald-400 flex items-center gap-2">
                    {f1Num === 0 ? (
                      <span>0</span>
                    ) : reducedDen === 1 ? (
                      <span>{isFinalNegative ? `－${reducedNum}` : `＋${reducedNum}`}</span>
                    ) : (
                      <>
                        <Frac num={reducedNum} den={reducedDen} isNeg={isFinalNegative} className="text-emerald-400 text-xl sm:text-3xl" />
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

        {/* 3. ΣΥΝΘΕΤΑ ΚΛΑΣΜΑΤΑ ΚΑΙ ΜΕΤΑΤΡΟΠΗ ΣΕ ΑΠΛΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Σύνθετα Κλάσματα: Ορισμός & Μετατροπή σε Απλό
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Σύνθετο</strong> ονομάζεται το κλάσμα που έχει ως <strong>αριθμητή ή παρονομαστή (ή και τα δύο) ένα άλλο κλάσμα</strong>.
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                Η κύρια (μεγάλη) γραμμή κλάσματος δεν είναι τίποτε άλλο παρά το σύμβολο της <strong>διαίρεσης</strong>:
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center font-mono font-bold text-indigo-950 text-lg flex items-center justify-center gap-3">
                <CompoundFrac num1="α" den1="β" num2="γ" den2="δ" />
                <span>＝</span>
                <span className="flex items-center">
                  (<Frac num="α" den="β" />) ： (<Frac num="γ" den="δ" />)
                </span>
              </div>
            </div>

            {/* Ο Κανόνας Άκρων - Μέσων */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Ο ΚΑΝΟΝΑΣ ΤΩΝ ΑΚΡΩΝ ΚΑΙ ΜΕΣΩΝ ΟΡΩΝ
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Για να μετατρέψουμε ένα σύνθετο κλάσμα απευθείας σε απλό, σχηματίζουμε ένα νέο κλάσμα όπου:
              </p>
              <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm">
                <li>
                  <strong>Αριθμητής:</strong> είναι το γινόμενο των <span className="text-amber-700 font-bold">άκρων όρων</span> (α · δ).
                </li>
                <li>
                  <strong>Παρονομαστής:</strong> είναι το γινόμενο των <span className="text-sky-700 font-bold">μέσων όρων</span> (β · γ).
                </li>
              </ul>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-center font-bold text-indigo-950 text-base sm:text-lg">
                <CompoundFrac num1="α" den1="β" num2="γ" den2="δ" />
                <span>＝</span>
                <Frac num="α · δ" den="β · γ" />
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΟΣ ΜΕΤΑΤΡΟΠΕΑΣ ΣΥΝΘΕΤΟΥ ΣΕ ΑΠΛΟ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Διαδραστικός Μετατροπέας Σύνθετου Κλάσματος σε Απλό
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Steppers των 4 όρων (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* Πάνω Κλάσμα (Αριθμητής) */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-amber-800 uppercase">ΠΑΝΩ ΚΛΑΣΜΑ (ΑΡΙΘΜΗΤΗΣ)</div>
                  <div>
                    <label className="text-[10px] font-bold text-amber-700 block mb-0.5">ΑΚΡΟΣ ΟΡΟΣ (α)</label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCNum1, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                        {cNum1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCNum1, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-sky-700 block mb-0.5">ΜΕΣΟΣ ΟΡΟΣ (β)</label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCDen1, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-sm font-mono text-sky-950">
                        {cDen1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCDen1, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* Κάτω Κλάσμα (Παρονομαστής) */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-sky-800 uppercase">ΚΑΤΩ ΚΛΑΣΜΑ (ΠΑΡΟΝΟΜΑΣΤΗΣ)</div>
                  <div>
                    <label className="text-[10px] font-bold text-sky-700 block mb-0.5">ΜΕΣΟΣ ΟΡΟΣ (γ)</label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCNum2, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-sm font-mono text-sky-950">
                        {cNum2}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCNum2, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-amber-700 block mb-0.5">ΑΚΡΟΣ ΟΡΟΣ (δ)</label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCDen2, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                        {cDen2}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCDen2, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Κάρτα Οπτικοποίησης & Μετατροπής (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΜΕΤΑΤΡΟΠΗ ΣΕ ΑΠΛΟ ΚΛΑΣΜΑ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans">
                    ΑΚΡΟΙ · ΜΕΣΟΙ
                  </span>
                </div>

                {/* Μεγάλη Εμφάνιση Σύνθετου & Απλού */}
                <div className="flex items-center justify-center gap-4 text-xl sm:text-3xl font-black py-2 flex-wrap">
                  <CompoundFrac num1={cNum1} den1={cDen1} num2={cNum2} den2={cDen2} />
                  <span className="text-slate-400">＝</span>
                  <div className="flex items-center">
                    <span className="inline-flex flex-col items-center justify-center leading-none text-center">
                      <span className="pb-0.5 px-1 border-b-2 border-white text-amber-300">
                        {cNum1} · {cDen2}
                      </span>
                      <span className="pt-0.5 px-1 text-sky-300">
                        {cDen1} · {cNum2}
                      </span>
                    </span>
                  </div>
                  <span className="text-slate-400">＝</span>
                  <Frac num={akroiProd} den={mesoiProd} className="text-white" />
                  <span className="text-slate-400">＝</span>
                  <Frac num={redCompoundNum} den={redCompoundDen} className="text-emerald-400 text-2xl sm:text-4xl" />
                </div>

                {/* Ανάλυση Όρων */}
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                  <div className="flex justify-between items-center text-amber-300">
                    <span>Γινόμενο Άκρων ({cNum1} · {cDen2}):</span>
                    <strong>{akroiProd}</strong>
                  </div>
                  <div className="flex justify-between items-center text-sky-300">
                    <span>Γινόμενο Μέσων ({cDen1} · {cNum2}):</span>
                    <strong>{mesoiProd}</strong>
                  </div>
                  {compoundGcd > 1 && (
                    <div className="pt-1 border-t border-white/10 text-xs text-emerald-300">
                      Απλοποιήσαμε αριθμητή και παρονομαστή διαιρώντας με τον ΜΚΔ({akroiProd}, {mesoiProd}) ＝ {compoundGcd}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
