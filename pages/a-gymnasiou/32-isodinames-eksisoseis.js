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

export default function IsodinamesEksisoseisTheoria() {
  // State για Εργαστήριο 1: Διατήρηση Ισότητας στη Ζυγαριά
  // Αρχική εξίσωση: 2x + 4 = 12 (ρίζα x = 4)
  const [balanceRootX] = useState(4); // Σταθερή λύση x = 4
  const [scaleAddC, setScaleAddC] = useState(3); // Πρόσθεση/αφαίρεση του ίδιου αριθμού c και στα δύο μέλη
  const [applyBoth, setApplyBoth] = useState(true); // Εφαρμογή και στα δύο μέλη ή μόνο στο ένα

  // State για Εργαστήριο 2: Μετασχηματισμός α·x + β·x = γ
  const [transA, setTransA] = useState(3);
  const [transB, setTransB] = useState(2);
  const [transC, setTransC] = useState(15);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Ζυγαριά)
  // 1ο μέλος: 2*x + 4 + (scaleAddC)
  // 2ο μέλος: 12 + (applyBoth ? scaleAddC : 0)
  const baseLeft = 2 * balanceRootX + 4; // 12
  const baseRight = 12; // 12
  const leftWeight = baseLeft + scaleAddC;
  const rightWeight = baseRight + (applyBoth ? scaleAddC : 0);
  const isScaleBalanced = leftWeight === rightWeight;
  const tiltAngle = useMemo(() => {
    if (leftWeight === rightWeight) return 0;
    const diff = leftWeight - rightWeight;
    return Math.max(-12, Math.min(12, diff * 2));
  }, [leftWeight, rightWeight]);

  // Υπολογισμοί Εργαστηρίου 2 (α·x + β·x = γ)
  const sumCoeff = useMemo(() => transA + transB, [transA, transB]);
  const rootSolution = useMemo(() => {
    if (sumCoeff === 0) return transC === 0 ? 'Άπειρες λύσεις (ταυτότητα)' : 'Αδύνατη';
    const val = transC / sumCoeff;
    return Number.isInteger(val) ? val : Number(val.toFixed(2)).toString().replace('.', ',');
  }, [sumCoeff, transC]);

  return (
    <Layout
      title="Ισοδύναμες Εξισώσεις & Διατήρηση Ισότητας | Α' Γυμνασίου"
      description="Η έννοια των ισοδύναμων εξισώσεων, ιδιότητες διατήρησης της ισότητας, μετασχηματισμός στη μορφή αx + βx = γ και διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/32-isodinames-eksisoseis-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 28 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Ισοδύναμες Εξισώσεις & Μετασχηματισμοί
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Ανακαλύπτουμε πότε δύο εξισώσεις είναι ισοδύναμες, εφαρμόζουμε τις βασικές ιδιότητες διατήρησης της ισότητας και απλοποιούμε εξισώσεις με ρητούς συντελεστές στη βασική μορφή α · x ＋ β · x ＝ γ.
            </p>
          </div>
        </section>

        {/* 1. ΤΙ ΕΙΝΑΙ ΟΙ ΙΣΟΔΥΝΑΜΕΣ ΕΞΙΣΩΣΕΙΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Η Έννοια των Ισοδύναμων Εξισώσεων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                Δύο ή περισσότερες εξισώσεις ονομάζονται <strong>ισοδύναμες</strong> όταν έχουν <strong>τις ίδιες ακριβώς λύσεις (ρίζες)</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-medium text-xs sm:text-sm space-y-2">
                <div className="font-bold text-sm sm:text-base">Συμβολισμός Ισοδυναμίας (⇔):</div>
                <div className="font-mono text-base font-bold text-indigo-800">
                  2 · x ＋ 4 ＝ 10 &nbsp; ⇔ &nbsp; 2 · x ＝ 6 &nbsp; ⇔ &nbsp; x ＝ 3
                </div>
                <p className="text-slate-600 pt-1">
                  Και οι τρεις παραπάνω εξισώσεις έχουν τη μοναδική λύση <strong>x ＝ 3</strong>, άρα είναι ισοδύναμες μεταξύ τους.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                ΓΙΑΤΙ ΕΙΝΑΙ ΣΗΜΑΝΤΙΚΗ Η ΙΣΟΔΥΝΑΜΙΑ;
              </div>
              <p className="text-slate-600">
                Όταν λύνουμε μια περίπλοκη εξίσωση, δεν μαντεύουμε τη λύση. Τη μετασχηματίζουμε διαδοχικά σε <strong>απλούστερες ισοδύναμες εξισώσεις</strong> μέχρι να καταλήξουμε στη μορφή <strong>x ＝ αριθμός</strong>.
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-center text-xs text-slate-700">
                Αρχική Εξίσωση ⇔ ... ⇔ Απλοποιημένη ⇔ x ＝ Ρίζα
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΟΙ ΙΔΙΟΤΗΤΕΣ ΔΙΑΤΗΡΗΣΗΣ ΤΗΣ ΙΣΟΤΗΤΑΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Κανόνες Μετασχηματισμού (Διατήρηση της Ισότητας)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Ιδιότητα Πρόσθεσης / Αφαίρεσης */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded inline-block">
                  ΚΑΝΟΝΑΣ 1
                </span>
                <h3 className="font-bold text-slate-900 text-base">Πρόσθεση ή Αφαίρεση του Ίδιου Αριθμού</h3>
                <p className="text-slate-600">
                  Αν και στα δύο μέλη μιας εξίσωσης <strong>προσθέσουμε ή αφαιρέσουμε τον ίδιο αριθμό</strong>, προκύπτει μια ισοδύναμη εξίσωση:
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sky-100 font-mono text-center text-xs sm:text-sm font-bold text-sky-950 space-y-1">
                <div>α ＝ β &nbsp; ⇔ &nbsp; α ＋ γ ＝ β ＋ γ</div>
                <div>α ＝ β &nbsp; ⇔ &nbsp; α － γ ＝ β － γ</div>
              </div>
            </div>

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

export default function IsodinamesEksisoseisTheoria() {
  // State για Εργαστήριο 1: Διατήρηση Ισότητας στη Ζυγαριά
  // Αρχική εξίσωση: 2x + 4 = 12 (ρίζα x = 4)
  const [balanceRootX] = useState(4); // Σταθερή λύση x = 4
  const [scaleAddC, setScaleAddC] = useState(3); // Πρόσθεση/αφαίρεση του ίδιου αριθμού c και στα δύο μέλη
  const [applyBoth, setApplyBoth] = useState(true); // Εφαρμογή και στα δύο μέλη ή μόνο στο ένα

  // State για Εργαστήριο 2: Μετασχηματισμός α·x + β·x = γ
  const [transA, setTransA] = useState(3);
  const [transB, setTransB] = useState(2);
  const [transC, setTransC] = useState(15);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Ζυγαριά)
  // 1ο μέλος: 2*x + 4 + (scaleAddC)
  // 2ο μέλος: 12 + (applyBoth ? scaleAddC : 0)
  const baseLeft = 2 * balanceRootX + 4; // 12
  const baseRight = 12; // 12
  const leftWeight = baseLeft + scaleAddC;
  const rightWeight = baseRight + (applyBoth ? scaleAddC : 0);
  const isScaleBalanced = leftWeight === rightWeight;
  const tiltAngle = useMemo(() => {
    if (leftWeight === rightWeight) return 0;
    const diff = leftWeight - rightWeight;
    return Math.max(-12, Math.min(12, diff * 2));
  }, [leftWeight, rightWeight]);

  // Υπολογισμοί Εργαστηρίου 2 (α·x + β·x = γ)
  const sumCoeff = useMemo(() => transA + transB, [transA, transB]);
  const rootSolution = useMemo(() => {
    if (sumCoeff === 0) return transC === 0 ? 'Άπειρες λύσεις (ταυτότητα)' : 'Αδύνατη';
    const val = transC / sumCoeff;
    return Number.isInteger(val) ? val : Number(val.toFixed(2)).toString().replace('.', ',');
  }, [sumCoeff, transC]);

  return (
    <Layout
      title="Ισοδύναμες Εξισώσεις & Διατήρηση Ισότητας | Α' Γυμνασίου"
      description="Η έννοια των ισοδύναμων εξισώσεων, ιδιότητες διατήρησης της ισότητας, μετασχηματισμός στη μορφή αx + βx = γ και διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/32-isodinames-eksisoseis-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 28 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Ισοδύναμες Εξισώσεις & Μετασχηματισμοί
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Ανακαλύπτουμε πότε δύο εξισώσεις είναι ισοδύναμες, εφαρμόζουμε τις βασικές ιδιότητες διατήρησης της ισότητας και απλοποιούμε εξισώσεις με ρητούς συντελεστές στη βασική μορφή α · x ＋ β · x ＝ γ.
            </p>
          </div>
        </section>

        {/* 1. ΤΙ ΕΙΝΑΙ ΟΙ ΙΣΟΔΥΝΑΜΕΣ ΕΞΙΣΩΣΕΙΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Η Έννοια των Ισοδύναμων Εξισώσεων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                Δύο ή περισσότερες εξισώσεις ονομάζονται <strong>ισοδύναμες</strong> όταν έχουν <strong>τις ίδιες ακριβώς λύσεις (ρίζες)</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-medium text-xs sm:text-sm space-y-2">
                <div className="font-bold text-sm sm:text-base">Συμβολισμός Ισοδυναμίας (⇔):</div>
                <div className="font-mono text-base font-bold text-indigo-800">
                  2 · x ＋ 4 ＝ 10 &nbsp; ⇔ &nbsp; 2 · x ＝ 6 &nbsp; ⇔ &nbsp; x ＝ 3
                </div>
                <p className="text-slate-600 pt-1">
                  Και οι τρεις παραπάνω εξισώσεις έχουν τη μοναδική λύση <strong>x ＝ 3</strong>, άρα είναι ισοδύναμες μεταξύ τους.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                ΓΙΑΤΙ ΕΙΝΑΙ ΣΗΜΑΝΤΙΚΗ Η ΙΣΟΔΥΝΑΜΙΑ;
              </div>
              <p className="text-slate-600">
                Όταν λύνουμε μια περίπλοκη εξίσωση, δεν μαντεύουμε τη λύση. Τη μετασχηματίζουμε διαδοχικά σε <strong>απλούστερες ισοδύναμες εξισώσεις</strong> μέχρι να καταλήξουμε στη μορφή <strong>x ＝ αριθμός</strong>.
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-center text-xs text-slate-700">
                Αρχική Εξίσωση ⇔ ... ⇔ Απλοποιημένη ⇔ x ＝ Ρίζα
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΟΙ ΙΔΙΟΤΗΤΕΣ ΔΙΑΤΗΡΗΣΗΣ ΤΗΣ ΙΣΟΤΗΤΑΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Κανόνες Μετασχηματισμού (Διατήρηση της Ισότητας)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Ιδιότητα Πρόσθεσης / Αφαίρεσης */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded inline-block">
                  ΚΑΝΟΝΑΣ 1
                </span>
                <h3 className="font-bold text-slate-900 text-base">Πρόσθεση ή Αφαίρεση του Ίδιου Αριθμού</h3>
                <p className="text-slate-600">
                  Αν και στα δύο μέλη μιας εξίσωσης <strong>προσθέσουμε ή αφαιρέσουμε τον ίδιο αριθμό</strong>, προκύπτει μια ισοδύναμη εξίσωση:
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sky-100 font-mono text-center text-xs sm:text-sm font-bold text-sky-950 space-y-1">
                <div>α ＝ β &nbsp; ⇔ &nbsp; α ＋ γ ＝ β ＋ γ</div>
                <div>α ＝ β &nbsp; ⇔ &nbsp; α － γ ＝ β － γ</div>
              </div>
            </div>

            {/* Ιδιότητα Πολλαπλασιασμού / Διαίρεσης */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded inline-block">
                  ΚΑΝΟΝΑΣ 2
                </span>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  Πολλαπλασιασμός & Διαίρεση με τον ίδιο Μη Μηδενικό Αριθμό
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Αν πολλαπλασιάσουμε ή διαιρέσουμε και τα δύο μέλη μιας εξίσωσης με τον ίδιο αριθμό (διάφορο του μηδενός), προκύπτει μια ισοδύναμη εξίσωση:
                </p>
                <div className="p-3 bg-white rounded-xl border border-amber-200 font-mono text-center font-bold text-amber-900 text-xs sm:text-sm space-y-1">
                  <div>Αν α ＝ β και γ ≠ 0, τότε:</div>
                  <div>α · γ ＝ β · γ &nbsp;και&nbsp; α ： γ ＝ β ： γ</div>
                </div>
              </div>
            </div>
