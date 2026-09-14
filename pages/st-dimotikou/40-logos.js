import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση Μέγιστου Κοινού Διαιρέτη (ΜΚΔ)
function getGCD(a, b) {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export default function LogosTheoria() {
  // Κατάσταση Διαδραστικού Εργαστηρίου 1: Οπτικός Λόγος (Μπάλες/Σχήματα)
  const [blueItems, setBlueItems] = useState(4);
  const [orangeItems, setOrangeItems] = useState(6);

  // Κατάσταση Διαδραστικού Εργαστηρίου 2: Αναλογία Συνταγής (Χυμός: Πορτοκάλι vs Νερό)
  const [orangeCups, setOrangeCups] = useState(2);
  const [waterCups, setWaterCups] = useState(3);

  // Υπολογισμοί για Εργαστήριο 1
  const gcd1 = useMemo(() => getGCD(blueItems, orangeItems), [blueItems, orangeItems]);
  const simpBlue = blueItems / gcd1;
  const simpOrange = orangeItems / gcd1;
  const decimalVal1 = (blueItems / orangeItems).toFixed(2).replace('.', ',');

  // Υπολογισμοί για Εργαστήριο 2
  const gcd2 = useMemo(() => getGCD(orangeCups, waterCups), [orangeCups, waterCups]);
  const simpCupsOrange = orangeCups / gcd2;
  const simpCupsWater = waterCups / gcd2;
  const decimalVal2 = (orangeCups / waterCups).toFixed(2).replace('.', ',');

  // Χειριστές steppers με προστασία ορίων και αποτροπή διάδοσης
  const updateCount = (setter, current, delta, min = 1, max = 20) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextVal = current + delta;
    if (nextVal >= min && nextVal <= max) {
      setter(nextVal);
    }
  };

  return (
    <Layout
      title="Η Έννοια του Λόγου | ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικό μάθημα θεωρίας για την έννοια του λόγου, τη σύγκριση μεγεθών, την απλοποίηση και τη δεκαδική μορφή του λόγου στα Μαθηματικά ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/40-logos-ask"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-md active:scale-95 touch-manipulation"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-800/40 relative overflow-hidden">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
              ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΚΕΦΑΛΑΙΟ 40
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Η Έννοια του Λόγου
            </h1>
            <p className="text-blue-100/90 text-sm sm:text-base lg:text-lg font-normal leading-relaxed">
              Μαθαίνουμε πώς να συγκρίνουμε δύο ομοειδή ή ετεροειδή μεγέθη χρησιμοποιώντας τη διαίρεση, πώς εκφράζουμε έναν λόγο ως κλάσμα και πώς βρίσκουμε την τιμή του.
            </p>
          </div>
        </section>

        {/* 1. Θεωρητικό Πλαίσιο */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Κάρτα 1: Τι ονομάζουμε Λόγο */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-bold text-lg">
                1
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Τι ονομάζουμε Λόγο δύο μεγεθών;
              </h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              <strong>Λόγος</strong> δύο αριθμών ή δύο μεγεθών ονομάζεται το <strong>πηλίκο της διαίρεσης</strong> του πρώτου αριθμού με τον δεύτερο αριθμό (με την προϋπόθεση ότι ο δεύτερος δεν είναι μηδέν).
            </p>
            <div className="bg-blue-50/70 border-l-4 border-blue-600 p-4 rounded-r-xl space-y-2 text-sm text-slate-700">
              <p>
                Αν έχουμε δύο αριθμούς <span className="font-semibold text-blue-900">α</span> και <span className="font-semibold text-blue-900">β</span> (με <span className="font-semibold">β ≠ 0</span>), ο λόγος τους γράφεται:
              </p>
              <div className="flex items-center justify-center gap-4 py-2 font-bold text-base sm:text-lg text-blue-950">
                <span>α ： β</span>
                <span>ή</span>
                <span className="inline-flex flex-col items-center justify-center">
                  <span className="border-b-2 border-blue-950 px-2 pb-0.5">α</span>
                  <span className="px-2 pt-0.5">β</span>
                </span>
              </div>
              <p className="text-xs text-slate-600">
                • Ο αριθμός <strong>α</strong> λέγεται <em>προηγούμενος όρος</em> (αριθμητής).<br />
                • Ο αριθμός <strong>β</strong> λέγεται <em>επόμενος όρος</em> (παρονομαστής).
              </p>
            </div>
          </div>

          {/* Κάρτα 2: Ιδιότητες & Μορφές του Λόγου */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold text-lg">
                2
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Μορφές &amp; Τιμή του Λόγου
              </h2>
            </div>
            <ul className="space-y-3.5 text-sm sm:text-base text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="text-amber-600 font-bold">✓</span>
                <span>
                  <strong>Κλασματική μορφή &amp; Απλοποίηση:</strong> Ο λόγος εκφράζεται ως κλάσμα και απλοποιείται ακριβώς όπως ένα κλάσμα, διαιρώντας και τους δύο όρους με τον ΜΚΔ τους.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-600 font-bold">✓</span>
                <span>
                  <strong>Τιμή του Λόγου:</strong> Κάνοντας τη διαίρεση <span className="font-semibold text-slate-800">α ： β</span>, βρίσκουμε έναν αριθμό (ακέραιο ή δεκαδικό), ο οποίος είναι η πραγματική τιμή του λόγου.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-600 font-bold">✓</span>
                <span>
                  <strong>Σύγκριση ομοειδών μεγεθών:</strong> Όταν συγκρίνουμε μεγέθη ίδιου είδους (π.χ. μήκη σε <span className="font-semibold">cm</span>), ο λόγος είναι ένας <em>καθαρός αριθμός</em> χωρίς μονάδες μέτρησης.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* 2. Διαδραστικό Εργαστήριο 1: Οπτικός Λόγος & Απλοποίηση */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Οπτικοποίηση Λόγου Στοιχείων &amp; Απλοποίηση
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Ρυθμίστε το πλήθος των μπλε και πορτοκαλί κύκλων και παρακολουθήστε πώς μεταβάλλεται ο λόγος, η απλοποιημένη μορφή του και η τιμή του.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            
            {/* Χειριστήρια (Steppers) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Stepper Μπλε */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block"></span>
                    Μπλε Κύκλοι
                  </span>
                  <span className="text-sm font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                    {blueItems}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={updateCount(setBlueItems, blueItems, -1, 1, 18)}
                    disabled={blueItems <= 1}
                    className="flex items-center justify-center w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-base whitespace-nowrap">
                    {blueItems} {blueItems === 1 ? 'κύκλος' : 'κύκλοι'}
                  </div>
                  <button
                    type="button"
                    onClick={updateCount(setBlueItems, blueItems, 1, 1, 18)}
                    disabled={blueItems >= 18}
                    className="flex items-center justify-center w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Stepper Πορτοκαλί */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block"></span>
                    Πορτοκαλί Κύκλοι
                  </span>
                  <span className="text-sm font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                    {orangeItems}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={updateCount(setOrangeItems, orangeItems, -1, 1, 18)}
                    disabled={orangeItems <= 1}
                    className="flex items-center justify-center w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-base whitespace-nowrap">
                    {orangeItems} {orangeItems === 1 ? 'κύκλος' : 'κύκλοι'}
                  </div>
                  <button
                    type="button"
                    onClick={updateCount(setOrangeItems, orangeItems, 1, 1, 18)}
                    disabled={orangeItems >= 18}
                    className="flex items-center justify-center w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Επεξήγηση σχέσης */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                💡 <strong>Ερμηνεία:</strong> Για κάθε <strong>{simpBlue}</strong> μπλε κύκλο{simpBlue > 1 ? 'υς' : ''}, αντιστοιχούν <strong>{simpOrange}</strong> πορτοκαλί κύκλο{simpOrange > 1 ? 'ι' : 'ς'}.
              </div>

            </div>

            {/* Οπτική Αναπαράσταση & Αποτέλεσμα */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
              
              {/* Grid οπτικών στοιχείων */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 min-h-[160px] flex flex-col justify-center">
                <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                  Οπτική Αναπαράσταση (Σύνολο: {blueItems + orangeItems} κύκλοι)
                </div>
                <div className="flex flex-wrap gap-2.5 items-center">
                  {Array.from({ length: blueItems }).map((_, i) => (
                    <div
                      key={`blue-${i}`}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-blue-200 transform transition-transform hover:scale-110"
                    >
                      Μ
                    </div>
                  ))}
                  {Array.from({ length: orangeItems }).map((_, i) => (
                    <div
                      key={`orange-${i}`}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-amber-200 transform transition-transform hover:scale-110"
                    >
                      Π
                    </div>
                  ))}
                </div>
              </div>

              {/* Μαθηματικές Μορφές Έκφρασης */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* 1. Αρχικός Λόγος */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Αρχικός Λόγος
                  </span>
                  <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-extrabold text-slate-800">
                    <span className="text-blue-600">{blueItems}</span>
                    <span>：</span>
                    <span className="text-amber-600">{orangeItems}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Μπλε προς Πορτοκαλί
                  </div>
                </div>

                {/* 2. Ανάγωγη Μορφή */}
                <div className="bg-white border border-blue-200 rounded-2xl p-4 text-center shadow-sm relative overflow-hidden">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
                    Απλοποιημένος
                  </span>
                  <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-extrabold text-blue-900">
                    <span>{simpBlue}</span>
                    <span>：</span>
                    <span>{simpOrange}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {gcd1 > 1 ? `Διαίρεση με ΜΚΔ (${gcd1})` : 'Ήδη ανάγωγος'}
                  </div>
                </div>

                {/* 3. Τιμή του Λόγου (Δεκαδικός) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Τιμή Λόγου (Πηλίκο)
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
                    ≈ {decimalVal1}
                  </div>
                  <div className="mt-2 text-xs text-slate-500 whitespace-nowrap">
                    {blueItems} ： {orangeItems} ＝ {decimalVal1}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* 3. Διαδραστικό Εργαστήριο 2: Πρακτική Εφαρμογή (Αναλογία Χυμού) */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Πραγματική Εφαρμογή: Συνταγή για Φυσικό Χυμό
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Σε μια συνταγή, ο λόγος καθορίζει τη γεύση και τη σύσταση. Αν αλλάξουμε τις ποσότητες διατηρώντας τον ίδιο λόγο, η γεύση παραμένει ίδια.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            
            {/* Χειριστήρια Συνταγής */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Stepper Πορτοκάλι */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-700">
                    🍊 Φυσικός Χυμός (Ποτήρια)
                  </span>
                  <span className="text-sm font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    {orangeCups}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={updateCount(setOrangeCups, orangeCups, -1, 1, 12)}
                    disabled={orangeCups <= 1}
                    className="flex items-center justify-center w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-base whitespace-nowrap">
                    {orangeCups} {orangeCups === 1 ? 'ποτήρι' : 'ποτήρια'}
                  </div>
                  <button
                    type="button"
                    onClick={updateCount(setOrangeCups, orangeCups, 1, 1, 12)}
                    disabled={orangeCups >= 12}
                    className="flex items-center justify-center w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Stepper Νερό */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-700">
                    💧 Νερό (Ποτήρια)
                  </span>
                  <span className="text-sm font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                    {waterCups}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={updateCount(setWaterCups, waterCups, -1, 1, 12)}
                    disabled={waterCups <= 1}
                    className="flex items-center justify-center w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-base whitespace-nowrap">
                    {waterCups} {waterCups === 1 ? 'ποτήρι' : 'ποτήρια'}
                  </div>
                  <button
                    type="button"
                    onClick={updateCount(setWaterCups, waterCups, 1, 1, 12)}
                    disabled={waterCups >= 12}
                    className="flex items-center justify-center w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Πίνακας Ανάλυσης Αναλογίας */}
            <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-3">
                  Ανάλυση του Μείγματος
                </h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <p className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span>Λόγος χυμού προς νερό:</span>
                    <span className="font-bold text-slate-900 text-base">
                      {orangeCups} ： {waterCups}
                    </span>
                  </p>
                  <p className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span>Απλοποιημένος λόγος:</span>
                    <span className="font-bold text-indigo-900 text-base">
                      {simpCupsOrange} ： {simpCupsWater}
                    </span>
                  </p>
                  <p className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span>Τιμή λόγου (Πυκνότητα):</span>
                    <span className="font-bold text-slate-900 text-base">
                      {decimalVal2}
                    </span>
                  </p>
                  <p className="flex items-center justify-between pt-1">
                    <span>Συνολικά ποτήρια μείγματος:</span>
                    <span className="font-bold text-slate-900 text-base">
                      {orangeCups + waterCups}
                    </span>
                  </p>
                </div>
              </div>

              {/* Visual Bar ποσοστού */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-600">
                  <span>Χυμός: {Math.round((orangeCups / (orangeCups + waterCups)) * 100)} %</span>
                  <span>Νερό: {Math.round((waterCups / (orangeCups + waterCups)) * 100)} %</span>
                </div>
                <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${(orangeCups / (orangeCups + waterCups)) * 100}%` }}
                    className="bg-amber-500 transition-all duration-300"
                  />
                  <div
                    style={{ width: `${(waterCups / (orangeCups + waterCups)) * 100}%` }}
                    className="bg-sky-400 transition-all duration-300"
                  />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. Σύνοψη Κανόνων (Takeaway) */}
        <section className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-amber-950 mb-3 flex items-center gap-2">
            <span>📌</span> Τι πρέπει να θυμάμαι πάντα για τον Λόγο:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-amber-900/90">
            <div className="bg-white/80 p-4 rounded-xl border border-amber-200/60">
              <strong className="block text-amber-950 mb-1">1. Η σειρά μετράει!</strong>
              Ο λόγος του <span className="font-semibold">3</span> προς το <span className="font-semibold">4</span> είναι <span className="font-semibold">3 ： 4 ＝ 0,75</span>, ενώ ο λόγος του <span className="font-semibold">4</span> προς το <span className="font-semibold">3</span> είναι <span className="font-semibold">4 ： 3 ≈ 1,33</span>.
            </div>
            <div className="bg-white/80 p-4 rounded-xl border border-amber-200/60">
              <strong className="block text-amber-950 mb-1">2. Ίδιες μονάδες μέτρησης</strong>
              Όταν συγκρίνουμε ομοειδή μεγέθη, τα μετατρέπουμε πρώτα στην <strong>ίδια μονάδα</strong> (π.χ. <span className="font-semibold">50 cm</span> προς <span className="font-semibold">1 m ＝ 100 cm</span>, άρα λόγος <span className="font-semibold">50 ： 100 ＝ 1 ： 2</span>).
            </div>
            <div className="bg-white/80 p-4 rounded-xl border border-amber-200/60">
              <strong className="block text-amber-950 mb-1">3. Αντίστροφοι Λόγοι</strong>
              Δύο λόγοι λέγονται <em>αντίστροφοι</em> όταν το γινόμενό τους είναι ίσο με τη μονάδα: <span className="font-semibold">α ： β · β ： α ＝ 1</span>.
            </div>
          </div>
        </section>

        {/* Bottom Navigation Link */}
        <div className="flex justify-end pt-4">
          <Link
            href="/st-dimotikou/40-logos-ask"
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-bold text-base hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg active:scale-95 touch-manipulation"
          >
            <span>Προς τις Ασκήσεις Κεφαλαίου 40</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </Layout>
  );
}
