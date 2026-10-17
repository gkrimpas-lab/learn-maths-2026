import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Γ')
function toCleanUppercase(str) {
  if (!str) return '';
  const map = {
    'Ά': 'Α', 'Έ': 'Ε', 'Ή': 'Η', 'Ί': 'Ι', 'Ό': 'Ο', 'Ύ': 'Υ', 'Ώ': 'Ω',
    'Ϊ': 'Ι', 'Ϋ': 'Υ',
    'ά': 'Α', 'έ': 'Ε', 'ή': 'Η', 'ί': 'Ι', 'ό': 'Ο', 'ύ': 'Υ', 'ώ': 'Ω',
    'ϊ': 'Ι', 'ϋ': 'Υ', 'ΐ': 'Ι', 'ΰ': 'Υ'
  };
  return str.split('').map(char => map[char] || char.toUpperCase()).join('');
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.52em] h-[1.12em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.8px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive
function Frac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center align-middle font-mono px-0.5 shrink-0 leading-none ${className}`}>
      <span className="border-b-[1.5px] border-current px-0.5 pb-0.5 text-center text-[0.88em] w-full block">
        {num}
      </span>
      <span className="px-0.5 pt-0.5 text-center text-[0.88em] w-full block">
        {den}
      </span>
    </span>
  );
}

export default function MononimaPolionimaTheory() {
  const [coefA, setCoefA] = useState(2);
  const [coefB, setCoefB] = useState(-3);
  const [coefC, setCoefC] = useState(5);
  const [valX, setValX] = useState(2);

  const nonZeroTerms = [coefA !== 0, coefB !== 0, coefC !== 0].filter(Boolean).length;
  
  let polyType = 'ΜΗΔΕΝΙΚΟ ΠΟΛΥΩΝΥΜΟ';
  if (nonZeroTerms === 1) polyType = 'ΜΟΝΩΝΥΜΟ';
  else if (nonZeroTerms === 2) polyType = 'ΔΙΩΝΥΜΟ';
  else if (nonZeroTerms === 3) polyType = 'ΤΡΙΩΝΥΜΟ';

  let polyDegree = 'ΧΩΡΙΣ ΒΑΘΜΟ (0)';
  if (coefA !== 0) polyDegree = '2ος ΒΑΘΜΟΣ';
  else if (coefB !== 0) polyDegree = '1ος ΒΑΘΜΟΣ';
  else if (coefC !== 0) polyDegree = '0ος ΒΑΘΜΟΣ (ΣΤΑΘΕΡΟ)';

  const termAVal = coefA * Math.pow(valX, 2);
  const termBVal = coefB * valX;
  const termCVal = coefC;
  const totalVal = termAVal + termBVal + termCVal;

  return (
    <Layout
      title="Μονώνυμα & Πολυώνυμα | Θεωρία Γ' Γυμνασίου"
      description="Αναλυτική θεωρία για αριθμητικές και αλγεβρικές παραστάσεις, μονώνυμα, πολυώνυμα, βαθμό, διώνυμα και τριώνυμα με διαδραστικό εργαστήριο."
      backUrl="/g-gymnasiou"
      backText="Γ' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/10-mononima-polionima-ask"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 {toCleanUppercase("ΑΣΚΗΣΕΙΣ")}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-32 overflow-x-hidden text-slate-800">
        
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-5 sm:p-8 lg:p-12 mb-6 sm:mb-10 shadow-xl">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 border border-white/20">
              {toCleanUppercase("ΚΕΦΑΛΑΙΟ 7 •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-white leading-tight">
              Μονώνυμα & Πολυώνυμα
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100 font-medium leading-relaxed mb-5 max-w-3xl">
              Από τις αριθμητικές παραστάσεις στο αλγεβρικό λεξιλόγιο: ανακαλύψτε πώς οι αριθμοί ενώνονται με μεταβλητές για να σχηματίσουν μονώνυμα, διώνυμα και πολυώνυμα, πώς υπολογίζεται ο βαθμός τους και πώς βρίσκουμε την αριθμητική τους τιμή.
            </p>
            <div>
              <Link
                href="/g-gymnasiou/10-mononima-polionima-ask"
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎯 {toCleanUppercase("ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 4 MODULAR CARDS ΘΕΩΡΙΑΣ */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          
          {/* ΒΗΜΑ 1: ΑΡΙΘΜΗΤΙΚΕΣ / ΑΛΓΕΒΡΙΚΕΣ ΠΑΡΑΣΤΑΣΕΙΣ & ΜΟΝΩΝΥΜΑ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  1
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Παραστάσεις & Η Έννοια του Μονωνύμου
                </h2>
              </div>

              {/* Εισαγωγικές Έννοιες */}
              <div className="space-y-2 mb-4 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>Αριθμητική παράσταση:</strong> Μία έκφραση που περιέχει πράξεις αποκλειστικά μεταξύ αριθμών (π.χ. 3 · 4² － 5).
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>Αλγεβρική παράσταση:</strong> Μία έκφραση που περιέχει πράξεις μεταξύ αριθμών και μεταβλητών (γραμμάτων) (π.χ. 2 · x² ＋ 3 · x － 7).
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>Αριθμητική τιμή:</strong> Ο αριθμός που προκύπτει αν αντικαταστήσουμε τις μεταβλητές με συγκεκριμένους αριθμούς και εκτελέσουμε τις πράξεις.
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                <strong>Μονώνυμο</strong> ονομάζεται η <strong>ακέραια</strong> αλγεβρική παράσταση στην οποία μεταξύ των μεταβλητών σημειώνεται <em>μόνο η πράξη του πολλαπλασιασμού</em> και οι εκθέτες τους είναι <strong>φυσικοί αριθμοί</strong> (0, 1, 2, ...).
              </p>
              
              <div className="bg-indigo-50/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-indigo-100 mb-3">
                <h3 className="font-bold text-indigo-900 mb-1.5 text-xs sm:text-sm uppercase tracking-wider">
                  {toCleanUppercase("ΑΝΑΤΟΜΙΑ ΜΟΝΩΝΥΜΟΥ")}: －5 · x² · y³
                </h3>
                <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span><strong>Συντελεστής:</strong> Ο αριθμητικός παράγοντας (εδώ: <strong>－5</strong>).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span><strong>Κύριο μέρος:</strong> Το γινόμενο των μεταβλητών με τις δυνάμεις τους (εδώ: <strong>x² · y³</strong>).</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="font-bold text-emerald-800 block mb-1">✓ {toCleanUppercase("ΕΙΝΑΙ ΜΟΝΩΝΥΜΑ")}:</span>
                  <span className="text-slate-700 font-mono inline-flex flex-wrap items-center gap-1.5">
                    <span>7,</span>
                    <span>－3 · x,</span>
                    <span><Frac num="1" den="2" /> · x² · y,</span>
                    <span>x³</span>
                  </span>
                </div>
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="font-bold text-rose-800 block mb-1">✗ {toCleanUppercase("ΔΕΝ ΕΙΝΑΙ ΜΟΝΩΝΥΜΑ")}:</span>
                  <span className="text-slate-700 font-mono inline-flex flex-wrap items-center gap-1.5">
                    <span><Frac num="3" den="x" />,</span>
                    <span>x ＋ y,</span>
                    <span>4 · x⁻²,</span>
                    <span className="inline-flex items-center gap-0.5">
                      <span>4 ·</span>
                      <Radical>x</Radical>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 2: ΒΑΘΜΟΣ ΚΑΙ ΣΧΕΣΕΙΣ ΜΟΝΩΝΥΜΩΝ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  2
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Βαθμός Μονωνύμου & Σχέσεις
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Ο βαθμός καθορίζεται αποκλειστικά από τους εκθέτες των μεταβλητών του κύριου μέρους:
              </p>
              
              <div className="space-y-2 mb-3 text-xs sm:text-sm">
                <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900">Βαθμός ως προς μία μεταβλητή:</span> Ο εκθέτης της συγκεκριμένης μεταβλητής.
                  <div className="text-slate-600 mt-1 font-mono">Στο 4 · x³ · y² είναι 3ου βαθμού ως προς x και 2ου ως προς y.</div>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900">Βαθμός ως προς όλες τις μεταβλητές:</span> Το <strong>άθροισμα</strong> όλων των εκθετών.
                  <div className="text-slate-600 mt-1 font-mono">Στο 4 · x³ · y² είναι 3 ＋ 2 ＝ <strong>5ου βαθμού</strong>.</div>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-slate-700 space-y-1.5">
                <div><strong>Όμοια Μονώνυμα:</strong> Έχουν ακριβώς το ίδιο κύριο μέρος (π.χ. 3 · x² · y και －7 · x² · y).</div>
                <div><strong>Αντίθετα Μονώνυμα:</strong> Είναι όμοια με αντίθετους συντελεστές (π.χ. 5 · x³ και －5 · x³).</div>
                <div><strong>Σταθερό Μονώνυμο:</strong> Κάθε μη μηδενικός αριθμός είναι μονώνυμο μηδενικού (0ού) βαθμού (π.χ. 8 ＝ 8 · x⁰).</div>
                <div><strong>Μηδενικό Μονώνυμο:</strong> Ο αριθμός 0 δεν έχει βαθμό (δεν ορίζεται βαθμός).</div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 3: ΠΟΛΥΩΝΥΜΑ, ΔΙΩΝΥΜΑ & ΤΡΙΩΝΥΜΑ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  3
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Πολυώνυμα, Διώνυμα & Τριώνυμα
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                <strong>Πολυώνυμο</strong> ονομάζεται κάθε αλγεβρική παράσταση που είναι άθροισμα μονωνύμων που δεν είναι όμοια μεταξύ τους. Κάθε μονώνυμο λέγεται <strong>όρος</strong> του πολυωνύμου.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                  <div className="font-bold text-indigo-900 mb-1">Διώνυμο</div>
                  <p className="text-xs text-slate-600">Πολυώνυμο με ακριβώς 2 μη όμοιους όρους.</p>
                  <div className="font-mono font-bold text-indigo-700 mt-1 text-xs">2 · x ＋ 5</div>
                </div>
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                  <div className="font-bold text-indigo-900 mb-1">Τριώνυμο</div>
                  <p className="text-xs text-slate-600">Πολυώνυμο με ακριβώς 3 μη όμοιους όρους.</p>
                  <div className="font-mono font-bold text-indigo-700 mt-1 text-xs">3 · x² － 4 · x ＋ 7</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Αναγωγή ομοίων όρων:</strong> Προσθέτουμε ή αφαιρούμε τους συντελεστές των όμοιων μονωνύμων διατηρώντας το κύριο μέρος, φτάνοντας στην <strong>ανηγμένη μορφή</strong> του πολυωνύμου.
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 4: ΒΑΘΜΟΣ ΠΟΛΥΩΝΥΜΟΥ & ΔΙΑΤΑΞΗ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  4
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Βαθμός Πολυωνύμου & Κανονική Μορφή
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Για να προσδιορίσουμε τον βαθμό ενός πολυωνύμου, πρώτα εκτελούμε όλες τις αναγωγές ομοίων όρων.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 text-xs sm:text-sm text-amber-950">
                <strong>Κανόνας Βαθμού:</strong> Ο βαθμός του ανηγμένου πολυωνύμου ισούται με τον <strong>μεγαλύτερο</strong> από τους βαθμούς των όρων του.
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>Κανονική (Φθίνουσα) Μορφή:</strong> Γράφουμε τους όρους από τον μεγαλύτερο εκθέτη προς τον μικρότερο:
                  <div className="font-mono font-bold text-indigo-700 mt-1">P(x) ＝ 5 · x³ － 2 · x² ＋ 7 · x － 9</div>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>Σταθερός Όρος:</strong> Ο όρος μηδενικού βαθμού που δεν περιέχει μεταβλητή (στο παραπάνω: το <strong>－9</strong>).
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
                🔬 {toCleanUppercase("ΕΡΓΑΣΤΗΡΙΟ ΑΛΓΕΒΡΑΣ")}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                Εξερεύνηση Πολυωνύμου P(x) ＝ a · x² ＋ b · x ＋ c
              </h2>
            </div>
            <div className="text-xs text-slate-500 max-w-xs">
              Ρυθμίστε τους συντελεστές και δείτε αυτόματα την ταξινόμηση, τον βαθμό και την αριθμητική τιμή.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Sliders & Controls */}
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Συντελεστής δευτεροβάθμιου (a):</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">{coefA}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={coefA}
                  onChange={(e) => setCoefA(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Συντελεστής πρωτοβάθμιου (b):</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">{coefB}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={coefB}
                  onChange={(e) => setCoefB(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Σταθερός όρος (c):</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">{coefC}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={coefC}
                  onChange={(e) => setCoefC(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-emerald-700">Τιμή μεταβλητής (x):</label>
                  <span className="font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">{valX}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="1"
                  value={valX}
                  onChange={(e) => setValX(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Dynamic Visualization */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full">
              
              {/* Formula Card */}
              <div className="p-4 sm:p-6 bg-indigo-950 text-white rounded-2xl shadow-inner text-center w-full">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-2">
                  {toCleanUppercase("ΜΟΡΦΗ ΠΟΛΥΩΝΥΜΟΥ")}
                </span>
                <div className="text-lg sm:text-2xl lg:text-3xl font-mono font-black tracking-wide break-words py-1">
                  P(x) ＝ {coefA !== 0 ? `${coefA} · x²` : ''} 
                  {coefB > 0 ? (coefA !== 0 ? ` ＋ ${coefB} · x` : `${coefB} · x`) : coefB < 0 ? ` － ${Math.abs(coefB)} · x` : ''} 
                  {coefC > 0 ? (coefA !== 0 || coefB !== 0 ? ` ＋ ${coefC}` : `${coefC}`) : coefC < 0 ? ` － ${Math.abs(coefC)}` : (coefA === 0 && coefB === 0 ? '0' : '')}
                </div>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-semibold block mb-0.5">Τύπος</span>
                  <span className="text-xs sm:text-sm font-bold text-indigo-900">{polyType}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-semibold block mb-0.5">Βαθμός</span>
                  <span className="text-xs sm:text-sm font-bold text-indigo-900">{polyDegree}</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] sm:text-xs text-emerald-700 font-semibold block mb-0.5">Τιμή P({valX})</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-800">{totalVal}</span>
                </div>
              </div>

              {/* Term Breakdown SVG - No Scroll Responsive */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 w-full">
                <span className="text-xs font-bold text-slate-600 block mb-2 uppercase">
                  {toCleanUppercase(`ΑΝΑΛΥΣΗ ΟΡΩΝ ΓΙΑ x ＝ ${valX}`)}:
                </span>
                <svg viewBox="0 0 500 70" className="w-full h-auto text-xs font-mono select-none">
                  {/* Term 1 */}
                  <rect x="10" y="10" width="145" height="50" rx="8" fill="#e0e7ff" stroke="#818cf8" strokeWidth="1.5" />
                  <text x="82" y="32" textAnchor="middle" fill="#312e81" fontWeight="bold">a · x²</text>
                  <text x="82" y="50" textAnchor="middle" fill="#4338ca">{coefA} · ({valX})² ＝ {termAVal}</text>

                  <text x="170" y="40" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="bold">＋</text>

                  {/* Term 2 */}
                  <rect x="185" y="10" width="145" height="50" rx="8" fill="#e0e7ff" stroke="#818cf8" strokeWidth="1.5" />
                  <text x="257" y="32" textAnchor="middle" fill="#312e81" fontWeight="bold">b · x</text>
                  <text x="257" y="50" textAnchor="middle" fill="#4338ca">{coefB} · ({valX}) ＝ {termBVal}</text>

                  <text x="345" y="40" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="bold">＋</text>

                  {/* Term 3 */}
                  <rect x="360" y="10" width="130" height="50" rx="8" fill="#e0e7ff" stroke="#818cf8" strokeWidth="1.5" />
                  <text x="425" y="32" textAnchor="middle" fill="#312e81" fontWeight="bold">c (σταθερός)</text>
                  <text x="425" y="50" textAnchor="middle" fill="#4338ca">{termCVal}</text>
                </svg>
              </div>

            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 sm:w-3 h-6 sm:h-8 bg-indigo-600 rounded-full" />
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              Λυμένα Προβλήματα Εφαρμογής
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 1: ΑΝΑΓΩΓΗ & ΒΑΘΜΟΣ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Απλοποίηση και εύρεση βαθμού πολυωνύμου
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Δίνεται το πολυώνυμο: <br />
                  <span className="font-mono font-bold text-slate-800 break-words">
                    A(x) ＝ 4 · x³ － 2 · x² ＋ 5 · x － x³ ＋ 6 · x² － 8
                  </span>. <br />
                  Να γραφεί στην ανηγμένη του μορφή, να διαταχθεί κατά τις φθίνουσες δυνάμεις του x και να βρεθεί ο βαθμός και ο σταθερός του όρος.
                </p>

                {/* Πίνακας με ασφαλές scroll */}
                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Δύναμη</th>
                        <th className="p-2 sm:p-2.5 border-b">Όμοιοι Όροι</th>
                        <th className="p-2 sm:p-2.5 border-b">Αποτέλεσμα</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x³</td>
                        <td className="p-2 sm:p-2.5">4 · x³ － 1 · x³</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">3 · x³</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x²</td>
                        <td className="p-2 sm:p-2.5">－2 · x² ＋ 6 · x²</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">4 · x²</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x¹</td>
                        <td className="p-2 sm:p-2.5">5 · x</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">5 · x</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x⁰</td>
                        <td className="p-2 sm:p-2.5">－8</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">－8</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>Ανηγμένη Μορφή:</strong> <span className="font-mono font-bold text-emerald-900">A(x) ＝ 3 · x³ ＋ 4 · x² ＋ 5 · x － 8</span></div>
                  <div><strong>Βαθμός:</strong> 3ος βαθμός.</div>
                  <div><strong>Σταθερός Όρος:</strong> －8.</div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 2: ΓΕΩΜΕΤΡΙΚΗ ΕΦΑΡΜΟΓΗ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Εμβαδόν και Περίμετρος Ορθογωνίου ως Πολυώνυμα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Ένα ορθογώνιο οικόπεδο έχει μήκος <strong>L ＝ 2 · x ＋ 5</strong> και πλάτος <strong>W ＝ x</strong> (όπου x σε μέτρα, x ＞ 0). <br />
                  α) Να εκφραστεί η περίμετρος Π(x) ως πολυώνυμο. <br />
                  β) Να εκφραστεί το εμβαδόν E(x) ως πολυώνυμο και να βρεθεί ο βαθμός του.
                </p>

                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Μέγεθος</th>
                        <th className="p-2 sm:p-2.5 border-b">Τύπος</th>
                        <th className="p-2 sm:p-2.5 border-b">Υπολογισμός Πολυωνύμου</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">Περίμετρος Π(x)</td>
                        <td className="p-2 sm:p-2.5">2 · (L ＋ W)</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">6 · x ＋ 10</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">Εμβαδόν E(x)</td>
                        <td className="p-2 sm:p-2.5">L · W</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">2 · x² ＋ 5 · x</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>Περίμετρος Π(x):</strong> 6 · x ＋ 10 (Διώνυμο 1ου βαθμού).</div>
                  <div><strong>Εμβαδόν E(x):</strong> 2 · x² ＋ 5 · x (Διώνυμο 2ου βαθμού).</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* YELLOW ALERT BOX */}
        <section className="bg-amber-50 border-2 border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-7 mb-8 sm:mb-12 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl shrink-0">⚠️</span>
            <div className="space-y-2.5">
              <h3 className="text-base sm:text-xl font-black text-amber-950 leading-tight">
                {toCleanUppercase("ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΙΣ ΕΞΕΤΑΣΕΙΣ")}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="inline-flex flex-wrap items-center gap-1">
                    <strong>Αρνητικοί εκθέτες & ρίζες:</strong> Παραστάσεις όπως 3 · x⁻¹ ή 2 · <Radical>x</Radical> <strong>ΔΕΝ</strong> είναι μονώνυμα. Στα μονώνυμα οι εκθέτες των μεταβλητών είναι αποκλειστικά φυσικοί αριθμοί.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="inline-flex flex-wrap items-center gap-1">
                    <strong>Μεταβλητή στον παρονομαστή:</strong> Η παράσταση <Frac num="4" den="x" /> δεν είναι μονώνυμο διότι περιέχει διαίρεση με μεταβλητή. Αντίθετα, η παράσταση <Frac num="x" den="4" /> (δηλαδή <Frac num="1" den="4" /> · x) <strong>είναι</strong> κανονικό μονώνυμο με συντελεστή <Frac num="1" den="4" />.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Μηδενικό Μονώνυμο:</strong> Ο αριθμός 0 είναι το μηδενικό μονώνυμο και <strong>δεν έχει βαθμό</strong> (δεν ορίζεται βαθμός).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Βαθμός χωρίς αναγωγή:</strong> Μην υπολογίζετε τον βαθμό πριν κάνετε αναγωγή ομοίων όρων! Στο P(x) ＝ 2 · x³ － 2 · x³ ＋ x ＋ 1, ο όρος x³ εξαφανίζεται (2 － 2 ＝ 0), άρα το πολυώνυμο είναι <strong>1ου βαθμού</strong> και όχι 3ου.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 leading-snug">
            Εμπεδώστε τη Θεωρία στην Πράξη!
          </h2>
          <p className="text-emerald-100 max-w-2xl text-xs sm:text-base mb-5 sm:mb-6">
            Δοκιμάστε τις γνώσεις σας σε 12 δυναμικές διαδραστικές ερωτήσεις και αυτούσια προβλήματα με άμεση ανατροφοδότηση.
          </p>
          <Link
            href="/g-gymnasiou/10-mononima-polionima-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase("ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
