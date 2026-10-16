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

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Mobile Optimized
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

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Mobile Optimized
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

export default function DekadikiMorfiArritonTheory() {
  const [radicand, setRadicand] = useState(2);
  const [precision, setPrecision] = useState(2); // 0 = μονάδα, 1 = δέκατο, 2 = εκατοστό, 3 = χιλιοστό

  const exactRoot = Math.sqrt(radicand);
  const factor = Math.pow(10, precision);
  const lowerApprox = Math.floor(exactRoot * factor) / factor;
  const upperApprox = Math.ceil(exactRoot * factor) / factor;

  const lowerSq = (lowerApprox * lowerApprox).toFixed(precision * 2 || 1);
  const upperSq = (upperApprox * upperApprox).toFixed(precision * 2 || 1);

  return (
    <Layout
      title="Δεκαδική Μορφή Άρρητων Αριθμών | Θεωρία Γ' Γυμνασίου"
      description="Αναλυτική θεωρία για τους άρρητους αριθμούς, τη δεκαδική τους μορφή χωρίς περίοδο, τις ρητές προσεγγίσεις και το διαδραστικό εργαστήριο εγκλωβισμού."
      backUrl="/g-gymnasiou"
      backText="Γ' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/02-dekadiki-morfi-arriton-ask"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 {toCleanUppercase("ΑΣΚΗΣΕΙΣ")}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-4 sm:py-6 pb-28 sm:pb-32 overflow-x-hidden text-slate-800">
        
        {/* HERO BANNER - MOBILE SAFE */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-5 sm:p-8 lg:p-12 mb-6 sm:mb-10 shadow-xl">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 border border-white/20">
              {toCleanUppercase("ΚΕΦΑΛΑΙΟ 2 •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-white leading-tight">
              Δεκαδική Μορφή Άρρητων Αριθμών
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100 font-medium leading-relaxed mb-5 max-w-3xl">
              Πέρα από τα κλάσματα και τους περιοδικούς δεκαδικούς, υπάρχει ένας απέραντος κόσμος αριθμών που δεν φυλακίζονται σε καμία περίοδο. Ανακαλύψτε τους άρρητους αριθμούς, τη γεωμετρική τους γέννηση και τον τρόπο που τους προσεγγίζουμε με ρητούς.
            </p>
            <div>
              <Link
                href="/g-gymnasiou/02-dekadiki-morfi-arriton-ask"
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎯 {toCleanUppercase("ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 4 MODULAR CARDS ΘΕΩΡΙΑΣ - RESPONSIVE 1/2 COLS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          
          {/* ΒΗΜΑ 1 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  1
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Τι είναι Άρρητος Αριθμός;
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                <strong>Άρρητος</strong> ονομάζεται κάθε αριθμός που <strong>δεν μπορεί</strong> να γραφεί ως κλάσμα της μορφής <Frac num="μ" den="ν" /> (όπου μ ακέραιος και ν φυσικός διάφορος του μηδενός).
              </p>
              
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 mb-3">
                <h3 className="font-bold text-indigo-900 mb-1.5 text-xs sm:text-sm uppercase tracking-wider">
                  {toCleanUppercase("ΤΟ ΧΑΡΑΚΤΗΡΙΣΤΙΚΟ ΓΝΩΡΙΣΜΑ")}
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  Η δεκαδική μορφή ενός άρρητου αριθμού έχει <strong>άπειρα δεκαδικά ψηφία</strong> τα οποία <strong>ποτέ δεν επαναλαμβάνονται περιοδικά</strong>.
                </p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-1">
                  <span><strong>Η ρίζα του 2:</strong></span>
                  <span className="font-mono font-bold text-indigo-900 break-all"><Radical>2</Radical> ＝ 1,41421356...</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-1">
                  <span><strong>Ο αριθμός π:</strong></span>
                  <span className="font-mono font-bold text-indigo-900 break-all">π ＝ 3,14159265...</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-1">
                  <span><strong>Η ρίζα του 3:</strong></span>
                  <span className="font-mono font-bold text-indigo-900 break-all"><Radical>3</Radical> ＝ 1,73205080...</span>
                </div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 2 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  2
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Γεωμετρική Γέννηση & Τοποθέτηση στον Άξονα
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Οι άρρητοι αριθμοί προκύπτουν άμεσα από βασικές γεωμετρικές κατασκευές μέσω του Πυθαγορείου Θεωρήματος.
              </p>
              
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 mb-3 text-xs sm:text-sm text-slate-700 space-y-2">
                <div className="font-bold text-indigo-900">Το Τετράγωνο με πλευρά 1:</div>
                <p>
                  Σε ορθογώνιο τρίγωνο με κάθετες πλευρές 1 μονάδα, η υποτείνουσα d ικανοποιεί:
                </p>
                <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono font-bold text-center text-indigo-700 text-xs sm:text-sm">
                  d² ＝ 1² ＋ 1² ＝ 2 &nbsp;⇒&nbsp; d ＝ <Radical>2</Radical>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 leading-relaxed">
                <strong>Μεταφορά στον Άξονα με Διαβήτη:</strong> Με κέντρο το 0 και άνοιγμα ίσο με την υποτείνουσα d, γράφουμε τόξο που τέμνει τον άξονα σε ένα μοναδικό σημείο. Αυτό αποδεικνύει ότι ο άρρητος <Radical>2</Radical> είναι ένα απολύτως πραγματικό σημείο της ευθείας.
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 3 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  3
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Ρητή Προσέγγιση & Εγκλωβισμός
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Στους πρακτικούς υπολογισμούς αντικαθιστούμε τους άρρητους με <strong>ρητές προσεγγίσεις</strong> (δεκαδικούς πεπερασμένων ψηφίων ή κλάσματα).
              </p>

              <div className="space-y-2.5 mb-3 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-900 block mb-1">Προσέγγιση με έλλειψη και υπέρβαση:</span>
                  Κάθε άρρητος εγκλωβίζεται ανάμεσα σε δύο ρητούς που απέχουν όσο επιθυμούμε:
                  <div className="font-mono text-[11px] sm:text-xs mt-2 space-y-1.5 text-slate-700">
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      • Μονάδα: 1 ＜ <Radical>2</Radical> ＜ 2 (1² ＝ 1 ＜ 2 ＜ 4 ＝ 2²)
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      • Δέκατο: 1,4 ＜ <Radical>2</Radical> ＜ 1,5 (1,4² ＝ 1,96 ＜ 2 ＜ 2,25 ＝ 1,5²)
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      • Εκατοστό: 1,41 ＜ <Radical>2</Radical> ＜ 1,42 (1,41² ＝ 1,9881 ＜ 2 ＜ 2,0164)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 4 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  4
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Πραγματικοί Αριθμοί (ℝ)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Το σύνολο των <strong>Πραγματικών Αριθμών (ℝ)</strong> αποτελείται από την ένωση των <strong>Ρητών</strong> και των <strong>Άρρητων</strong> αριθμών.
              </p>

              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 text-xs sm:text-sm text-slate-700 space-y-1.5">
                <div className="font-bold text-indigo-900">Πλήρης Κάλυψη του Άξονα:</div>
                <p>
                  Κάθε σημείο της ευθείας αντιστοιχεί σε έναν μοναδικό πραγματικό αριθμό και αντίστροφα, χωρίς να μένει κανένα «κενό».
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700">
                <strong>Συνοπτική Ταξινόμηση:</strong>
                <ul className="mt-1.5 space-y-1 font-mono text-[11px] sm:text-xs">
                  <li>• Φυσικοί (ℕ) ⊆ Ακέραιοι (ℤ) ⊆ Ρητοί (ℚ)</li>
                  <li>• Άρρητοι: ℝ ∖ ℚ (όλοι οι μη ρητοί)</li>
                  <li>• Πραγματικοί: ℝ ＝ ℚ ∪ (Άρρητοι)</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB - ULTRA RESPONSIVE MOBILE */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
                🔬 {toCleanUppercase("ΕΡΓΑΣΤΗΡΙΟ ΕΓΚΛΩΒΙΣΜΟΥ")}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                Ρητή Προσέγγιση & Εγκλωβισμός Τετραγωνικής Ρίζας
              </h2>
            </div>
            <div className="text-xs text-slate-500 max-w-xs">
              Δείτε πώς στενεύει το εύρος εγκλωβισμού όσο αυξάνεται η ακρίβεια των δεκαδικών ψηφίων.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Controls */}
            <div className="lg:col-span-5 space-y-5 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2">
                  Επιλέξτε Υπόριζη Ποσότητα (N):
                </label>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {[2, 3, 5, 7, 8, 10, 11, 13].map((val) => (
                    <button
                      key={val}
                      onClick={() => setRadicand(val)}
                      className={`py-2 px-1 rounded-xl font-mono font-bold text-xs sm:text-sm border transition-all ${
                        radicand === val
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Radical>{val}</Radical>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2">
                  Βαθμίδα Ακρίβειας Προσέγγισης:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {[
                    { label: 'Μονάδα (1)', p: 0 },
                    { label: 'Δέκατο (0,1)', p: 1 },
                    { label: 'Εκατοστό (0,01)', p: 2 },
                    { label: 'Χιλιοστό (0,001)', p: 3 }
                  ].map((item) => (
                    <button
                      key={item.p}
                      onClick={() => setPrecision(item.p)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        precision === item.p
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900 break-words">
                <strong>Υπολογιστική Τιμή:</strong> <br />
                <span className="font-mono text-xs sm:text-sm font-bold break-all">
                  <Radical>{radicand}</Radical> ＝ {exactRoot.toFixed(6)}...
                </span>
              </div>
            </div>

            {/* Dynamic Output - Responsive Card */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full">
              
              {/* Ανισότητα Εγκλωβισμού - Auto-wrapping for Mobile */}
              <div className="p-4 sm:p-6 bg-indigo-950 text-white rounded-2xl shadow-inner text-center w-full overflow-hidden">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-2">
                  {toCleanUppercase("ΑΝΙΣΟΤΗΤΑ ΕΓΚΛΩΒΙΣΜΟΥ")}
                </span>
                <div className="text-base sm:text-2xl lg:text-3xl font-mono font-black flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 py-1">
                  <span className="text-amber-300">{lowerApprox}</span>
                  <span className="text-indigo-400">＜</span>
                  <span className="text-white inline-flex items-center"><Radical>{radicand}</Radical></span>
                  <span className="text-indigo-400">＜</span>
                  <span className="text-emerald-300">{upperApprox}</span>
                </div>
                <div className="text-[11px] sm:text-xs text-indigo-200 mt-2 font-mono flex flex-wrap justify-center gap-2">
                  <span>Έλλειψη: {lowerApprox}</span>
                  <span>|</span>
                  <span>Υπέρβαση: {upperApprox}</span>
                </div>
              </div>

              {/* Έλεγχος Τετραγώνων (Stacked on mobile, 3-col on desktop) */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 w-full">
                <span className="text-xs font-bold text-slate-700 block mb-2.5 uppercase">
                  {toCleanUppercase("ΕΠΑΛΗΘΕΥΣΗ ΜΕΣΩ ΤΕΤΡΑΓΩΝΩΝ")}:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] sm:text-xs mb-0.5">Τετράγωνο Ελλιπούς</span>
                    <span className="font-bold text-amber-700 text-xs sm:text-sm break-all">{lowerApprox}² ＝ {lowerSq}</span>
                  </div>

                  <div className="p-2.5 bg-indigo-100/60 rounded-xl border border-indigo-200">
                    <span className="text-indigo-800 font-bold block text-[10px] sm:text-xs mb-0.5">Στόχος (N)</span>
                    <span className="font-black text-indigo-950 text-sm sm:text-base">{radicand}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] sm:text-xs mb-0.5">Τετράγωνο Υπερβολικού</span>
                    <span className="font-bold text-emerald-700 text-xs sm:text-sm break-all">{upperApprox}² ＝ {upperSq}</span>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <strong>Συμπέρασμα:</strong> Επειδή <strong>{lowerSq} ＜ {radicand} ＜ {upperSq}</strong>, ο άρρητος <Radical>{radicand}</Radical> βρίσκεται πράγματι στο διάστημα <strong>[{lowerApprox}, {upperApprox}]</strong> με σφάλμα μικρότερο από {1 / factor}.
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ - OVERFLOW SAFE TABLES */}
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
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 1: ΔΙΑΔΟΧΙΚΟΣ ΕΓΚΛΩΒΙΣΜΟΣ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Εγκλωβισμός του <Radical>5</Radical> με ακρίβεια δεκάτου
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Να εγκλωβιστεί ο άρρητος αριθμός <strong><Radical>5</Radical></strong> ανάμεσα σε δύο διαδοχικούς ακεραίους και στη συνέχεια ανάμεσα σε δύο διαδοχικά δέκατα.
                </p>

                {/* Πίνακας με ασφαλές scroll σε mobile */}
                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Ακρίβεια</th>
                        <th className="p-2 sm:p-2.5 border-b">Υπολογισμός</th>
                        <th className="p-2 sm:p-2.5 border-b">Εγκλωβισμός</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono text-[11px] sm:text-xs">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">Μονάδα</td>
                        <td className="p-2 sm:p-2.5">2² ＝ 4 ＜ 5 ＜ 9 ＝ 3²</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">2 ＜ <Radical>5</Radical> ＜ 3</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">Δέκατο</td>
                        <td className="p-2 sm:p-2.5">2,2² ＝ 4,84 ＜ 5 ＜ 5,29 ＝ 2,3²</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">2,2 ＜ <Radical>5</Radical> ＜ 2,3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>Προσέγγιση με έλλειψη (0,1):</strong> 2,2.</div>
                  <div><strong>Προσέγγιση με υπέρβαση (0,1):</strong> 2,3.</div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 2: ΠΡΑΚΤΙΚΗ ΧΡΗΣΗ ΤΟΥ π")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Περίμετρος κυκλικού στίβου με ρητή προσέγγιση
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Ένας κυκλικός στίβος έχει ακτίνα <strong>R ＝ 14 m</strong>. <br />
                  α) Ακριβές μήκος L ως προς π. <br />
                  β) Ρητή προσέγγιση με <strong>π ≈ <Frac num="22" den="7" /></strong> και <strong>π ≈ 3,14</strong>.
                </p>

                {/* Πίνακας με ασφαλές scroll σε mobile */}
                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[300px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Προσέγγιση</th>
                        <th className="p-2 sm:p-2.5 border-b">Υπολογισμός</th>
                        <th className="p-2 sm:p-2.5 border-b">Αποτέλεσμα</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-semibold">Ακριβής (άρρητη)</td>
                        <td className="p-2 sm:p-2.5 font-mono">2 · π · 14</td>
                        <td className="p-2 sm:p-2.5 font-mono font-bold text-indigo-700">28 · π m</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-semibold">Κλασματική (<Frac num="22" den="7" />)</td>
                        <td className="p-2 sm:p-2.5 font-mono">2 · <Frac num="22" den="7" /> · 14</td>
                        <td className="p-2 sm:p-2.5 font-mono font-bold text-indigo-700">88 m</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-semibold">Δεκαδική (3,14)</td>
                        <td className="p-2 sm:p-2.5 font-mono">2 · 3,14 · 14</td>
                        <td className="p-2 sm:p-2.5 font-mono font-bold text-indigo-700">87,92 m</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>Συμπέρασμα:</strong> Στην καθημερινή μηχανική χρησιμοποιούμε ρητές προσεγγίσεις όπως το 3,14 ή το <Frac num="22" den="7" />.</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* YELLOW ALERT BOX - MOBILE PADDING ADJUSTED */}
        <section className="bg-amber-50 border-2 border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-7 mb-8 sm:mb-12 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl shrink-0">⚠️</span>
            <div className="space-y-2.5">
              <h3 className="text-base sm:text-xl font-black text-amber-950 leading-tight">
                {toCleanUppercase("ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΟΥΣ ΑΡΡΗΤΟΥΣ ΑΡΙΘΜΟΥΣ")}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Ο αριθμός π ΔΕΝ ισούται με 3,14 ούτε με <Frac num="22" den="7" />:</strong> Ο αριθμός π είναι αυστηρά <strong>άρρητος</strong>. Το 3,14 και το <Frac num="22" den="7" /> είναι <strong>ρητές προσεγγίσεις</strong> του και όχι η ακριβής τιμή του!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Δεν είναι όλες οι ρίζες άρρητοι:</strong> Οι ρίζες των τέλειων τετραγώνων είναι <strong>ρητοί</strong> (ακέραιοι) αριθμοί (π.χ. <Radical>4</Radical> ＝ 2, <Radical>9</Radical> ＝ 3, <Radical>0,25</Radical> ＝ 0,5). Άρρητες είναι μόνο οι ρίζες μη τέλειων τετραγώνων.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Άπειρα ψηφία δεν σημαίνει πάντα άρρητος:</strong> Ο αριθμός 0,333... έχει άπειρα ψηφία αλλά είναι <strong>ρητός</strong> διότι έχει περίοδο (ισούται με <Frac num="1" den="3" />). Άρρητος είναι μόνο αυτός που έχει άπειρα ψηφία <em>χωρίς περίοδο</em>.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 leading-snug">
            Εμπεδώστε τους Άρρητους Αριθμούς στην Πράξη!
          </h2>
          <p className="text-emerald-100 max-w-2xl text-xs sm:text-base mb-5 sm:mb-6">
            Δοκιμάστε τις δυνάμεις σας σε 12 διαδραστικές ερωτήσεις και αυτούσια προβλήματα εγκλωβισμού με άμεση ανατροφοδότηση.
          </p>
          <Link
            href="/g-gymnasiou/02-dekadiki-morfi-arriton-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase("ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
