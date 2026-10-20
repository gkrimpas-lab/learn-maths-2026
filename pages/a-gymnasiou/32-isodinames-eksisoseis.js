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
    <span className={`inline-flex items-center gap-0.5 align-middle mx-1 font-mono ${className}`}>
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
  // State για Εργαστήριο 1: Διαδραστική Μεταφορά Όρων & Ισοδύναμες Μορφές
  // Αρχική εξίσωση: a*x + b = c
  const [initA, setInitA] = useState(3);
  const [initB, setInitB] = useState(5);
  const [initC, setInitC] = useState(17);

  // State για Εργαστήριο 2: Επίλυση Βήμα-Βήμα με τις Ιδιότητες Ισότητας
  const [stepA, setStepA] = useState(2);
  const [stepB, setStepB] = useState(6);
  const [stepC, setStepC] = useState(14);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1:
  // a*x + b = c  <=>  a*x = c - b  <=>  x = (c - b) / a
  const diffRight = useMemo(() => initC - initB, [initC, initB]);
  const rootValue = useMemo(() => {
    if (initA === 0) return null;
    return Number((diffRight / initA).toFixed(2));
  }, [diffRight, initA]);

  // Υπολογισμοί Εργαστηρίου 2:
  const stepDiff = useMemo(() => stepC - stepB, [stepC, stepB]);
  const stepRoot = useMemo(() => {
    if (stepA === 0) return null;
    return Number((stepDiff / stepA).toFixed(2));
  }, [stepDiff, stepA]);

  return (
    <Layout
      title="Ισοδύναμες Εξισώσεις & Επίλυση | Α' Γυμνασίου"
      description="Ισοδύναμες εξισώσεις, κανόνες πρόσθεσης, αφαίρεσης, πολλαπλασιασμού και διαίρεσης, μεταφορά όρων και διαδραστικά εργαστήρια."
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 30 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Ισοδύναμες Εξισώσεις & Κανόνες Επίλυσης
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε πότε δύο εξισώσεις είναι ισοδύναμες, πώς εφαρμόζουμε τις ιδιότητες της ισότητας και πώς χρησιμοποιούμε τον κανόνα της μεταφοράς όρων για να βρίσκουμε τη λύση.
            </p>
          </div>
        </section>

        {/* 1. ΤΙ ΕΙΝΑΙ ΙΣΟΔΥΝΑΜΕΣ ΕΞΙΣΩΣΕΙΣ */}
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
                Δύο εξισώσεις με τον ίδιο άγνωστο ονομάζονται <strong>ισοδύναμες</strong> όταν έχουν <strong>ακριβώς τις ίδιες λύσεις (ή ρίζες)</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold text-xs sm:text-sm space-y-2">
                <div>Για παράδειγμα, οι εξισώσεις:</div>
                <div className="font-mono text-base text-indigo-900">• 2 · x ＋ 4 ＝ 10</div>
                <div className="font-mono text-base text-indigo-900">• 2 · x ＝ 6</div>
                <div className="font-mono text-base text-indigo-900">• x ＝ 3</div>
                <div className="text-slate-600 pt-1 font-sans">
                  είναι όλες <strong>ισοδύναμες</strong> μεταξύ τους, γιατί έχουν μοναδική κοινή λύση τον αριθμό <strong>x ＝ 3</strong>.
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Ο ΣΤΟΧΟΣ ΤΗΣ ΕΠΙΛΥΣΗΣ
              </div>
              <p className="text-slate-600">
                Όταν λύνουμε μια εξίσωση, δεν μαντεύουμε! Ξεκινάμε από μια αρχική σύνθετη εξίσωση και, εφαρμόζοντας κανόνες, παράγουμε διαδοχικά απλούστερες <strong>ισοδύναμες εξισώσεις</strong>, μέχρι να φτάσουμε στην τελική απλή μορφή:
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-center font-bold text-indigo-700 text-base">
                x ＝ (αριθμός)
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΟΙ ΒΑΣΙΚΟΙ ΚΑΝΟΝΕΣ & ΙΔΙΟΤΗΤΕΣ ΙΣΟΤΗΤΑΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Οι Ιδιότητες της Ισότητας (Κανόνες Μετασχηματισμού)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Ιδιότητα Πρόσθεσης / Αφαίρεσης */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                  ΚΑΝΟΝΑΣ 1
                </span>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  Πρόσθεση ή Αφαίρεση του ίδιου Αριθμού
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Αν προσθέσουμε ή αφαιρέσουμε τον ίδιο αριθμό και από τα δύο μέλη μιας εξίσωσης, προκύπτει μια <strong>ισοδύναμη εξίσωση</strong>:
                </p>
                <div className="p-3 bg-white rounded-xl border border-indigo-200 font-mono text-center font-bold text-indigo-900 text-xs sm:text-sm space-y-1">
                  <div>Αν α ＝ β, τότε:</div>
                  <div>α ＋ γ ＝ β ＋ γ &nbsp;και&nbsp; α － γ ＝ β － γ</div>
                </div>
              </div>
              <div className="p-2.5 bg-white/80 rounded-xl border border-indigo-100 font-sans text-xs text-indigo-950 font-medium">
                💡 <strong>Πρακτικός Κανόνας Μεταφοράς Όρων:</strong> Μπορούμε να μεταφέρουμε έναν όρο από το ένα μέλος στο άλλο, <strong>αλλάζοντας το πρόσημό του</strong>!
              </div>
            </div>

            {/* Ιδιότητα Πολλαπλασιασμού / Διαίρεσης (Μορφή Κλάσματος) */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded inline-block">
                  ΚΑΝΟΝΑΣ 2
                </span>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  Πολλαπλασιασμός & Διαίρεση με Μη Μηδενικό Αριθμό
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Αν πολλαπλασιάσουμε ή διαιρέσουμε και τα δύο μέλη μιας εξίσωσης με τον ίδιο αριθμό (διάφορο του μηδενός), προκύπτει μια <strong>ισοδύναμη εξίσωση</strong>:
                </p>
                <div className="p-3 bg-white rounded-xl border border-amber-200 font-mono text-center font-bold text-amber-900 text-xs sm:text-sm space-y-2">
                  <div>Αν α ＝ β και γ ≠ 0, τότε:</div>
                  <div className="flex items-center justify-center gap-3">
                    <span>α · γ ＝ β · γ</span>
                    <span>και</span>
                    <span className="flex items-center">
                      <Frac num="α" den="γ" /> ＝ <Frac num="β" den="γ" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-2.5 bg-white/80 rounded-xl border border-amber-100 font-sans text-xs text-amber-950 font-medium">
                💡 <strong>Απομόνωση του x:</strong> Στο τέλος διαιρούμε και τα δύο μέλη με τον συντελεστή του αγνώστου (σε μορφή κλάσματος) για να μείνει μόνο του το x!
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΕΡΓΑΣΤΗΡΙΟ 1: ΜΕΤΑΦΟΡΑ ΟΡΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              🛠️ Εργαστήριο 1: Διαδραστική Μεταφορά Όρων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Steppers (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block">ΣΥΝΤΕΛΕΣΤΗΣ (α)</label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setInitA, -1, 1, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                    {initA}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setInitA, 1, 1, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">ΣΤΑΘΕΡΟΣ (β)</label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setInitB, -1, -15, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-slate-800">
                    {initB > 0 ? `＋${initB}` : initB}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setInitB, 1, -15, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-700 uppercase block">2Ο ΜΕΛΟΣ (γ)</label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setInitC, -1, 0, 30, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                    {initC}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setInitC, 1, 0, 30, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>
            </div>

            {/* Ανάλυση Βημάτων (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  ΑΛΥΣΙΔΑ ΙΣΟΔΥΝΑΜΙΩΝ
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                  ΜΕΤΑΦΟΡΑ & ΔΙΑΙΡΕΣΗ
                </span>
              </div>

              {/* Βήμα 1: Αρχική */}
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1">
                <div className="text-slate-400 font-bold">Αρχική Εξίσωση:</div>
                <div className="font-mono text-base font-bold text-amber-300">
                  {initA}x {initB >= 0 ? `＋ ${initB}` : `－ ${Math.abs(initB)}`} ＝ {initC}
                </div>
              </div>

              {/* Βήμα 2: Μεταφορά */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1">
                <div className="text-slate-300 font-bold">
                  Βήμα 1: Μεταφορά του σταθερού όρου στο 2ο μέλος (αλλάζει πρόσημο):
                </div>
                <div className="font-mono text-sm sm:text-base text-indigo-200">
                  {initA}x ＝ {initC} {initB >= 0 ? `－ ${initB}` : `＋ ${Math.abs(initB)}`}
                </div>
                <div className="font-mono text-sm sm:text-base text-slate-300">
                  {initA}x ＝ {diffRight}
                </div>
              </div>

              {/* Βήμα 3: Διαίρεση σε μορφή κλάσματος */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1">
                <div className="text-slate-300 font-bold">
                  Βήμα 2: Διαίρεση και των δύο μελών με τον συντελεστή του x ({initA}):
                </div>
                <div className="font-mono text-sm sm:text-base text-indigo-200 flex items-center">
                  <span>x ＝ </span>
                  <Frac num={diffRight} den={initA} />
                </div>
              </div>

              {/* Τελική Λύση */}
              <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-2 text-emerald-300 font-sans">
                <span className="text-xs sm:text-sm font-bold">
                  ΤΕΛΙΚΗ ΙΣΟΔΥΝΑΜΗ ΕΞΙΣΩΣΗ (ΡΙΖΑ):
                </span>
                <span className="text-xl sm:text-3xl font-black font-mono text-emerald-400">
                  x ＝ {rootValue}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΕΡΓΑΣΤΗΡΙΟ 2: ΒΗΜΑ-ΒΗΜΑ ΕΠΙΛΥΣΗ ΜΕ ΕΠΑΛΗΘΕΥΣΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              🛠️ Εργαστήριο 2: Πλήρης Επίλυση & Επαλήθευση
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Steppers (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block">ΣΥΝΤΕΛΕΣΤΗΣ (α)</label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setStepA, -1, 1, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                    {stepA}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setStepA, 1, 1, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">ΣΤΑΘΕΡΟΣ (β)</label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setStepB, -1, -20, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono text-slate-800">
                    {stepB > 0 ? `＋${stepB}` : stepB}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setStepB, 1, -20, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-700 uppercase block">2Ο ΜΕΛΟΣ (γ)</label>
                <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setStepC, -1, -30, 30, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                    {stepC}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setStepC, 1, -30, 30, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                  >
                    ＋
                  </button>
                </div>
              </div>
            </div>

            {/* Πίνακας Επαλήθευσης (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  ΕΠΑΛΗΘΕΥΣΗ ΣΤΟ 1Ο ΜΕΛΟΣ
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans">
                  ΡΙΖΑ: x ＝ {stepRoot}
                </span>
              </div>

              <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-1.5 text-slate-200">
                <div className="font-bold text-amber-300">
                  Αντικαθιστούμε το x ＝ {stepRoot} στην αρχική εξίσωση:
                </div>
                <div className="font-mono text-sm sm:text-base text-indigo-200">
                  1ο Μέλος ＝ {stepA} · ({stepRoot}) {stepB >= 0 ? `＋ ${stepB}` : `－ ${Math.abs(stepB)}`}
                </div>
                <div className="font-mono text-sm sm:text-base text-emerald-400 font-bold">
                  ＝ {Number((stepA * stepRoot).toFixed(2))} {stepB >= 0 ? `＋ ${stepB}` : `－ ${Math.abs(stepB)}`} ＝ {stepC}
                </div>
                <div className="text-slate-300 pt-1 border-t border-white/10 text-xs">
                  Το 1ο μέλος ισούται με το 2ο μέλος ({stepC} ＝ {stepC}), άρα η λύση είναι 100% σωστή!
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
