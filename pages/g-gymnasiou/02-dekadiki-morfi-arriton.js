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

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum)
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.55em] h-[1.15em] shrink-0 text-current overflow-visible"
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

// Επαναχρησιμοποιήσιμο Component Κλάσματος με οριζόντια γραμμή (Fraction)
function Frac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center align-middle font-mono px-0.5 leading-tight ${className}`}>
      <span className="border-b-[1.5px] border-current px-1 text-center text-[0.9em] w-full block">
        {num}
      </span>
      <span className="px-1 text-center text-[0.9em] w-full block">
        {den}
      </span>
    </span>
  );
}

export default function DekadikiMorfiArritonTheory() {
  // State για το Interactive Lab (Προσέγγιση ρίζας μη τέλειου τετραγώνου)
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
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 {toCleanUppercase("ΑΣΚΗΣΕΙΣ")}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-32 overflow-x-hidden text-slate-800">
        
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-10 lg:p-12 mb-10 shadow-2xl">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-white/20">
              {toCleanUppercase("ΚΕΦΑΛΑΙΟ 2 •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-white">
              Δεκαδική Μορφή Άρρητων Αριθμών
            </h1>
            <p className="text-base sm:text-lg text-indigo-100 font-medium leading-relaxed mb-6">
              Πέρα από τα κλάσματα και τους περιοδικούς δεκαδικούς, υπάρχει ένας απέραντος κόσμος αριθμών που δεν φυλακίζονται σε καμία περίοδο. Ανακαλύψτε τους άρρητους αριθμούς, τη γεωμετρική τους γέννηση και τον τρόπο που τους προσεγγίζουμε με ρητούς.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/g-gymnasiou/02-dekadiki-morfi-arriton-ask"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎯 {toCleanUppercase("ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* MODULAR CARDS ΘΕΩΡΙΑΣ (4 ΒΗΜΑΤΑ) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          
          {/* ΒΗΜΑ 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-lg">
                  1
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Τι είναι Άρρητος Αριθμός;
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                <strong>Άρρητος</strong> ονομάζεται κάθε αριθμός που <strong>δεν μπορεί</strong> να γραφεί ως κλάσμα της μορφής <Frac num="μ" den="ν" /> (όπου μ ακέραιος και ν φυσικός διάφορος του μηδενός).
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4">
                <h3 className="font-bold text-indigo-900 mb-2 text-sm uppercase tracking-wider">
                  {toCleanUppercase("ΤΟ ΧΑΡΑΚΤΗΡΙΣΤΙΚΟ ΓΝΩΡΙΣΜΑ")}
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  Η δεκαδική μορφή ενός άρρητου αριθμού έχει <strong>άπειρα δεκαδικά ψηφία</strong> τα οποία <strong>ποτέ δεν επαναλαμβάνονται περιοδικά</strong>.
                </p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <span><strong>Η ρίζα του 2:</strong></span>
                  <span className="font-mono font-bold text-indigo-900"><Radical>2</Radical> ＝ 1,41421356...</span>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <span><strong>Ο αριθμός π:</strong></span>
                  <span className="font-mono font-bold text-indigo-900">π ＝ 3,14159265...</span>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <span><strong>Η ρίζα του 3:</strong></span>
                  <span className="font-mono font-bold text-indigo-900"><Radical>3</Radical> ＝ 1,73205080...</span>
                </div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-lg">
                  2
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Γεωμετρική Γέννηση & Τοποθέτηση στον Άξονα
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Οι άρρητοι αριθμοί δεν είναι αφηρημένες επινοήσεις, αλλά προκύπτουν άμεσα από βασικές γεωμετρικές κατασκευές μέσω του Πυθαγορείου Θεωρήματος.
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 text-xs sm:text-sm text-slate-700 space-y-2">
                <div className="font-bold text-indigo-900">Το Τετράγωνο με πλευρά 1:</div>
                <p>
                  Αν κατασκευάσουμε ένα ορθογώνιο τρίγωνο με κάθετες πλευρές ίσες με 1 μονάδα, τότε από το Πυθαγόρειο θεώρημα η υποτείνουσα d ικανοποιεί τη σχέση:
                </p>
                <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono font-bold text-center text-indigo-700">
                  d² ＝ 1² ＋ 1² ＝ 2 &nbsp;⇒&nbsp; d ＝ <Radical>2</Radical>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 leading-relaxed">
                <strong>Μεταφορά στον Άξονα με Διαβήτη:</strong> Με κέντρο το 0 και άνοιγμα ίσο με την υποτείνουσα d, γράφουμε τόξο που τέμνει τον άξονα των αριθμών σε ένα μοναδικό σημείο. Αυτό αποδεικνύει ότι ο άρρητος <Radical>2</Radical> αντιστοιχεί σε συγκεκριμένο γεωμετρικό σημείο του άξονα!
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-lg">
                  3
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Ρητή Προσέγγιση & Εγκλωβισμός
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Επειδή ένας άρρητος αριθμός έχει άπειρα μη περιοδικά δεκαδικά ψηφία, στους πρακτικούς υπολογισμούς χρησιμοποιούμε <strong>ρητές προσεγγίσεις</strong> (δεκαδικούς αριθμούς με πεπερασμένα ψηφία ή κλάσματα).
              </p>

              <div className="space-y-3 mb-4 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-900 block mb-1">Προσέγγιση με έλλειψη και υπέρβαση:</span>
                  Κάθε άρρητος εγκλωβίζεται ανάμεσα σε δύο ρητούς αριθμούς που απέχουν όσο επιθυμούμε:
                  <div className="font-mono text-xs mt-2 space-y-1 text-slate-700">
                    <div>• Προσέγγιση μονάδας: 1 ＜ <Radical>2</Radical> ＜ 2 (αφού 1² ＝ 1 ＜ 2 ＜ 4 ＝ 2²)</div>
                    <div>• Προσέγγιση δεκάτου: 1,4 ＜ <Radical>2</Radical> ＜ 1,5 (αφού 1,4² ＝ 1,96 ＜ 2 ＜ 2,25 ＝ 1,5²)</div>
                    <div>• Προσέγγιση εκατοστού: 1,41 ＜ <Radical>2</Radical> ＜ 1,42 (αφού 1,41² ＝ 1,9881 ＜ 2 ＜ 2,0164)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 4 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-lg">
                  4
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Πραγματικοί Αριθμοί (ℝ)
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Το σύνολο των <strong>Πραγματικών Αριθμών (ℝ)</strong> αποτελείται από την ένωση των <strong>Ρητών</strong> και των <strong>Άρρητων</strong> αριθμών.
              </p>

              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 mb-4 text-xs sm:text-sm text-slate-700 space-y-2">
                <div className="font-bold text-indigo-900">Πλήρης Κάλυψη του Άξονα:</div>
                <p>
                  Κάθε σημείο της ευθείας παριστάνει έναν μοναδικό πραγματικό αριθμό (είτε ρητό είτε άρρητο), και αντίστροφα, κάθε πραγματικός αριθμός παριστάνεται από ένα μοναδικό σημείο της ευθείας.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700">
                <strong>Συνοπτική Ταξινόμηση:</strong>
                <ul className="mt-2 space-y-1 font-mono text-xs">
                  <li>• Φυσικοί (ℕ) ⊆ Ακέραιοι (ℤ) ⊆ Ρητοί (ℚ)</li>
                  <li>• Άρρητοι: ℝ ∖ ℚ (όλοι οι μη ρητοί)</li>
                  <li>• Πραγματικοί: ℝ ＝ ℚ ∪ (Άρρητοι)</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                🔬 {toCleanUppercase("ΕΡΓΑΣΤΗΡΙΟ ΕΓΚΛΩΒΙΣΜΟΥ")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Ρητή Προσέγγιση & Εγκλωβισμός Τετραγωνικής Ρίζας
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-500 max-w-xs">
              Επιλέξτε έναν αριθμό και παρακολουθήστε πώς στενεύει το διάστημα εγκλωβισμού όσο αυξάνεται η ακρίβεια των δεκαδικών ψηφίων.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Controls */}
            <div className="lg:col-span-5 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Επιλέξτε Υπόριζη Ποσότητα (N):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 5, 7, 8, 10, 11, 13].map((val) => (
                    <button
                      key={val}
                      onClick={() => setRadicand(val)}
                      className={`py-2 rounded-xl font-mono font-bold text-sm border transition-all ${
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
                <label className="text-sm font-bold text-slate-700 block mb-2">
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
                      className={`p-2.5 rounded-xl border text-center transition-all ${
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

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                <strong>Υπολογιστική Τιμή:</strong> <br />
                <span className="font-mono text-sm font-bold">
                  <Radical>{radicand}</Radical> ＝ {exactRoot.toFixed(8)}...
                </span>
              </div>
            </div>

            {/* Dynamic Visualization & Enclosure Box */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              
              {/* Ανισότητα Εγκλωβισμού */}
              <div className="p-6 bg-indigo-950 text-white rounded-2xl shadow-inner text-center">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-3">
                  {toCleanUppercase("ΑΝΙΣΟΤΗΤΑ ΕΓΚΛΩΒΙΣΜΟΥ")}
                </span>
                <div className="text-xl sm:text-3xl font-mono font-black flex items-center justify-center gap-3">
                  <span className="text-amber-300">{lowerApprox}</span>
                  <span className="text-indigo-400">＜</span>
                  <span className="text-white"><Radical>{radicand}</Radical></span>
                  <span className="text-indigo-400">＜</span>
                  <span className="text-emerald-300">{upperApprox}</span>
                </div>
                <div className="text-xs text-indigo-200 mt-3 font-mono">
                  (Με έλλειψη: {lowerApprox} &nbsp;|&nbsp; Με υπέρβαση: {upperApprox})
                </div>
              </div>

              {/* Έλεγχος Τετραγώνων */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-3 uppercase">
                  {toCleanUppercase("ΕΠΑΛΗΘΕΥΣΗ ΜΕΣΩ ΤΕΤΡΑΓΩΝΩΝ")}:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-center">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block mb-1">Τετράγωνο Ελλιπούς</span>
                    <span className="font-bold text-amber-700 text-sm">{lowerApprox}² ＝ {lowerSq}</span>
                  </div>

                  <div className="p-3 bg-indigo-100/60 rounded-xl border border-indigo-200">
                    <span className="text-indigo-800 font-bold block mb-1">Στόχος (N)</span>
                    <span className="font-black text-indigo-950 text-base">{radicand}</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block mb-1">Τετράγωνο Υπερβολικού</span>
                    <span className="font-bold text-emerald-700 text-sm">{upperApprox}² ＝ {upperSq}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <strong>Συμπέρασμα:</strong> Επειδή <strong>{lowerSq} ＜ {radicand} ＜ {upperSq}</strong>, έπεται ότι ο άρρητος αριθμός <Radical>{radicand}</Radical> βρίσκεται πράγματι στο διάστημα <strong>[{lowerApprox}, {upperApprox}]</strong> με εύρος σφάλματος μικρότερο από {1 / factor}.
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-8 bg-indigo-600 rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Λυμένα Προβλήματα Εφαρμογής
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 1: ΔΙΑΔΟΧΙΚΟΣ ΕΓΚΛΩΒΙΣΜΟΣ")}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Εγκλωβισμός του <Radical>5</Radical> με ακρίβεια δεκάτου
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Να εγκλωβιστεί ο άρρητος αριθμός <strong><Radical>5</Radical></strong> ανάμεσα σε δύο διαδοχικούς ακεραίους και στη συνέχεια ανάμεσα σε δύο διαδοχικά δέκατα.
                </p>

                {/* Πίνακας Οργάνωσης Δεδομένων */}
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 border-b">Βαθμίδα Ακρίβειας</th>
                        <th className="p-2 border-b">Υπολογισμός Τετραγώνων</th>
                        <th className="p-2 border-b">Ανισότητα Εγκλωβισμού</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      <tr>
                        <td className="p-2 font-sans font-semibold">1. Ακέραια Μονάδα</td>
                        <td className="p-2">2² ＝ 4 ＜ 5 ＜ 9 ＝ 3²</td>
                        <td className="p-2 font-bold text-indigo-700">2 ＜ <Radical>5</Radical> ＜ 3</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-sans font-semibold">2. Δοκιμές Δεκάτων</td>
                        <td className="p-2">2,2² ＝ 4,84 ＜ 5 ＜ 5,29 ＝ 2,3²</td>
                        <td className="p-2 font-bold text-indigo-700">2,2 ＜ <Radical>5</Radical> ＜ 2,3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <div><strong>Προσέγγιση με έλλειψη (με ακρίβεια 0,1):</strong> 2,2.</div>
                  <div><strong>Προσέγγιση με υπέρβαση (με ακρίβεια 0,1):</strong> 2,3.</div>
                  <div><strong>Παρατήρηση:</strong> 2,2² ＝ 4,84 και 2,3² ＝ 5,29. Επειδή το 5 είναι πιο κοντά στο 4,84 παρά στο 5,29, η τιμή 2,2 είναι η καλύτερη στρογγυλοποίηση.</div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 2: ΠΡΑΚΤΙΚΗ ΧΡΗΣΗ ΤΟΥ π")}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Περίμετρος κυκλικού στίβου με ρητή προσέγγιση
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Ένας κυκλικός στίβος έχει ακτίνα <strong>R ＝ 14 m</strong>. <br />
                  α) Να υπολογιστεί το ακριβές μήκος του στίβου ως συνάρτηση του άρρητου αριθμού π. <br />
                  β) Να βρεθεί η ρητή προσέγγιση του μήκους αν χρησιμοποιήσουμε την κλασική ρητή προσέγγιση του Αρχιμήδη <strong>π ≈ <Frac num="22" den="7" /></strong> καθώς και τη δεκαδική προσέγγιση <strong>π ≈ 3,14</strong>.
                </p>

                {/* Πίνακας Οργάνωσης Μεγεθών */}
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 border-b">Τύπος Προσέγγισης</th>
                        <th className="p-2 border-b">Υπολογισμός Μήκους L ＝ 2 · π · R</th>
                        <th className="p-2 border-b">Αποτέλεσμα</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2 font-semibold">1. Ακριβής (άρρητη)</td>
                        <td className="p-2 font-mono">2 · π · 14</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">28 · π m</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">2. Κλασματική (π ≈ <Frac num="22" den="7" />)</td>
                        <td className="p-2 font-mono">2 · <Frac num="22" den="7" /> · 14 ＝ 2 · 22 · 2</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">88 m</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">3. Δεκαδική (π ≈ 3,14)</td>
                        <td className="p-2 font-mono">2 · 3,14 · 14 ＝ 28 · 3,14</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">87,92 m</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <div><strong>Συμπέρασμα:</strong> Στην καθημερινή πράξη και στη μηχανική χρησιμοποιούμε ρητές προσεγγίσεις όπως το 3,14 ή το <Frac num="22" den="7" />.</div>
                  <div><strong>Σφάλμα:</strong> Η διαφορά ανάμεσα στις δύο προσεγγίσεις είναι μόλις 88 － 87,92 ＝ 0,08 m (8 εκατοστά του μέτρου).</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* YELLOW ALERT BOX - ΣΥΝΗΘΗ ΛΑΘΗ */}
        <section className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 mb-12 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-black text-amber-950">
                {toCleanUppercase("ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΟΥΣ ΑΡΡΗΤΟΥΣ ΑΡΙΘΜΟΥΣ")}
              </h3>
              <ul className="space-y-2 text-sm text-amber-900 leading-relaxed">
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
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Πράξεις με άρρητους:</strong> Το άθροισμα ενός ρητού και ενός άρρητου (π.χ. 3 ＋ <Radical>2</Radical>) είναι πάντοτε <strong>άρρητος</strong> αριθμός.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Εμπεδώστε τους Άρρητους Αριθμούς στην Πράξη!
          </h2>
          <p className="text-emerald-100 max-w-2xl text-sm sm:text-base mb-6">
            Δοκιμάστε τις δυνάμεις σας σε 12 διαδραστικές ερωτήσεις και αυτούσια προβλήματα εγκλωβισμού με άμεση ανατροφοδότηση.
          </p>
          <Link
            href="/g-gymnasiou/02-dekadiki-morfi-arriton-ask"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-800 font-black rounded-2xl shadow-lg hover:bg-emerald-50 transition-all hover:scale-105 active:scale-100 text-base"
          >
            <span>🎯 {toCleanUppercase("ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
