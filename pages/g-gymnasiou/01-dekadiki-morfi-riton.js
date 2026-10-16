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

// Κομψή απόδοση της γραμμής περιόδου πάνω από τα ψηφία (Vinculum)
function Overline({ children }) {
  return (
    <span className="relative inline-block border-t-2 border-current px-0.5 leading-none">
      {children}
    </span>
  );
}

// Προσομοίωση διαίρεσης κλάσματος a/b για εύρεση δεκαδικής μορφής και περιόδου
function getDecimalExpansion(num, den) {
  if (!den || den === 0) return { integerPart: 0, nonPeriodic: '', period: '', isTerminating: true };
  
  const integerPart = Math.floor(num / den);
  let rem = num % den;
  if (rem === 0) {
    return { integerPart, nonPeriodic: '0', period: '', isTerminating: true };
  }

  const seenRemainders = new Map();
  let digits = '';
  let index = 0;

  while (rem !== 0 && !seenRemainders.has(rem) && index < 20) {
    seenRemainders.set(rem, index);
    rem *= 10;
    const digit = Math.floor(rem / den);
    digits += digit.toString();
    rem = rem % den;
    index++;
  }

  if (rem === 0) {
    return { integerPart, nonPeriodic: digits, period: '', isTerminating: true };
  }

  const periodStartIndex = seenRemainders.get(rem);
  const nonPeriodic = digits.slice(0, periodStartIndex);
  const period = digits.slice(periodStartIndex);

  return { integerPart, nonPeriodic, period, isTerminating: false };
}

export default function DekadikiMorfiRitonTheory() {
  // State για το Interactive Lab
  const [num, setNum] = useState(1);
  const [den, setDen] = useState(3);

  const expansion = getDecimalExpansion(num, den);

  return (
    <Layout
      title="Δεκαδική Μορφή Ρητών Αριθμών | Θεωρία Γ' Γυμνασίου"
      description="Αναλυτική θεωρία για τους ρητούς αριθμούς, πεπερασμένους και περιοδικούς δεκαδικούς, περίοδο και μετατροπές με διαδραστικό εργαστήριο."
      backUrl="/g-gymnasiou"
      backText="Γ' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/01-dekadiki-morfi-riton-ask"
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
              {toCleanUppercase("ΚΕΦΑΛΑΙΟ 1 •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-white">
              Δεκαδική Μορφή Ρητών Αριθμών
            </h1>
            <p className="text-base sm:text-lg text-indigo-100 font-medium leading-relaxed mb-6">
              Πώς κάθε κλάσμα μεταμορφώνεται σε δεκαδικό αριθμό; Ανακαλύψτε το μυστικό των πεπερασμένων και των περιοδικών δεκαδικών, μάθετε να εντοπίζετε την περίοδο και κατακτήστε τις τεχνικές μετατροπής σε γεννήτρια μορφή.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/g-gymnasiou/01-dekadiki-morfi-riton-ask"
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
                  Τι είναι Ρητός Αριθμός;
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                <strong>Ρητός</strong> ονομάζεται κάθε αριθμός που μπορεί να γραφεί ως κλάσμα της μορφής:
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 text-center">
                <div className="font-mono text-2xl font-black text-indigo-700 inline-block">
                  <span className="border-b-2 border-indigo-700 pb-0.5 px-2 block">μ</span>
                  <span className="pt-0.5 px-2 block">ν</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  όπου <strong>μ</strong> ακέραιος αριθμός και <strong>ν</strong> φυσικός αριθμός με <strong>ν ≠ 0</strong>.
                </p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <strong>Ακέραιοι ως Ρητοί:</strong> Κάθε ακέραιος είναι ρητός με παρονομαστή το 1 (π.χ. 5 ＝ 5 : 1, －4 ＝ －4 : 1).
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <strong>Δεκαδικοί ως Ρητοί:</strong> Κάθε δεκαδικός αριθμός με πεπερασμένα ψηφία είναι ρητός (π.χ. 0,75 ＝ 75 : 100 ＝ 3 : 4).
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
                  Περιοδικοί Δεκαδικοί & Περίοδος
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Όταν διαιρέσουμε τον αριθμητή με τον παρονομαστή ενός ανάγωγου κλάσματος, προκύπτει είτε <strong>τερματιζόμενος</strong> δεκαδικός είτε <strong>περιοδικός</strong> δεκαδικός.
              </p>
              
              <div className="space-y-3 mb-4 text-xs sm:text-sm text-slate-700">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="font-bold text-indigo-900 block mb-1">Απλός Περιοδικός:</span>
                  Η περίοδος ξεκινά αμέσως μετά την υποδιαστολή.
                  <div className="font-mono font-bold text-slate-800 mt-1 flex items-center gap-2">
                    <span>1 : 3 ＝ 0,333... ＝ 0,<Overline>3</Overline></span>
                    <span className="text-xs font-normal text-slate-500">(Περίοδος το 3)</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="font-bold text-indigo-900 block mb-1">Μικτός Περιοδικός:</span>
                  Ανάμεσα στην υποδιαστολή και την περίοδο μεσολαβούν ένα ή περισσότερα ψηφία (μη περιοδικό μέρος).
                  <div className="font-mono font-bold text-slate-800 mt-1 flex items-center gap-2">
                    <span>5 : 6 ＝ 0,8333... ＝ 0,8<Overline>3</Overline></span>
                    <span className="text-xs font-normal text-slate-500">(Μη περιοδικό το 8, περίοδος το 3)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                <strong>Συμβολισμός:</strong> Τοποθετούμε οριζόντια γραμμή πάνω ακριβώς από τα ψηφία που επαναλαμβάνονται (π.χ. 2,1<Overline>45</Overline> σημαίνει 2,1454545...).
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
                  Το Μυστικό του Παρονομαστή
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Μπορούμε να γνωρίζουμε εκ των προτέρων αν ένα ανάγωγο κλάσμα δίνει πεπερασμένο ή περιοδικό δεκαδικό αναλύοντας τον <strong>παρονομαστή</strong> του σε πρώτους παράγοντες:
              </p>

              <div className="space-y-3 mb-4 text-xs sm:text-sm">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950">
                  <div className="font-bold mb-1">✓ Πεπερασμένος (Τερματιζόμενος) Δεκαδικός:</div>
                  Αν η ανάλυση του παρονομαστή περιέχει <strong>μόνο τους παράγοντες 2 ή/και 5</strong>.
                  <div className="font-mono text-xs mt-1 text-slate-700">
                    Π.χ. 7 : 20 ＝ 7 : (2² · 5) ＝ <strong>0,35</strong> (τελειώνει).
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950">
                  <div className="font-bold mb-1">⚡ Περιοδικός Δεκαδικός:</div>
                  Αν ο παρονομαστής περιέχει <strong>οποιονδήποτε άλλον πρώτο παράγοντα</strong> (όπως 3, 7, 11, 13...).
                  <div className="font-mono text-xs mt-1 text-slate-700">
                    Π.χ. 4 : 15 ＝ 4 : (3 · 5) ＝ <strong>0,2<Overline>6</Overline></strong> (υπάρχει το 3).
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
                  Μετατροπή Περιοδικού σε Κλάσμα
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Κάθε περιοδικός δεκαδικός αριθμός προέρχεται από ένα μοναδικό κλάσμα που ονομάζεται <strong>γεννήτρια μορφή</strong>:
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>Για Απλό Περιοδικό (π.χ. 0,<Overline>7</Overline>):</strong>
                  <div className="mt-1">
                    Γράφουμε στον αριθμητή την περίοδο και στον παρονομαστή τόσα <strong>9άρια</strong> όσα τα ψηφία της περιόδου:
                    <div className="font-mono font-bold text-indigo-700 mt-1">0,<Overline>7</Overline> ＝ 7 : 9 &nbsp;|&nbsp; 0,<Overline>23</Overline> ＝ 23 : 99</div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>Αλγεβρική Μέθοδος (για κάθε περίπτωση):</strong>
                  <div className="mt-1">
                    Ονομάζουμε τον αριθμό x, πολλαπλασιάζουμε με κατάλληλη δύναμη του 10 (10, 100, 1000) για να ευθυγραμμίσουμε την περίοδο, και αφαιρούμε τις δύο εξισώσεις.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                🔬 {toCleanUppercase("ΕΡΓΑΣΤΗΡΙΟ ΑΡΙΘΜΩΝ")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Διαδραστική Μετατροπή Κλάσματος σε Δεκαδικό
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-500 max-w-xs">
              Ρυθμίστε τον αριθμητή και τον παρονομαστή για να εξερευνήσετε αν ο αριθμός είναι πεπερασμένος ή περιοδικός.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders & Controls */}
            <div className="lg:col-span-5 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-bold text-slate-700">Αριθμητής (μ):</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200">{num}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={num}
                  onChange={(e) => setNum(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-bold text-slate-700">Παρονομαστής (ν):</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200">{den}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={den}
                  onChange={(e) => setDen(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Προεπιλογές για γρήγορη δοκιμή */}
              <div className="pt-3 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">Δοκιμαστε κλασικα κλασματα:</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button onClick={() => { setNum(1); setDen(3); }} className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:border-indigo-500 font-mono">1/3</button>
                  <button onClick={() => { setNum(5); setDen(6); }} className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:border-indigo-500 font-mono">5/6</button>
                  <button onClick={() => { setNum(3); setDen(8); }} className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:border-indigo-500 font-mono">3/8</button>
                  <button onClick={() => { setNum(4); setDen(7); }} className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:border-indigo-500 font-mono">4/7</button>
                  <button onClick={() => { setNum(7); setDen(11); }} className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:border-indigo-500 font-mono">7/11</button>
                </div>
              </div>
            </div>

            {/* Dynamic Output & Breakdown */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              
              {/* Κεντρική κάρτα δεκαδικής αναπαράστασης */}
              <div className="p-6 bg-indigo-950 text-white rounded-2xl shadow-inner text-center">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-2">
                  {toCleanUppercase("ΚΛΑΣΜΑ & ΔΕΚΑΔΙΚΗ ΜΟΡΦΗ")}
                </span>
                <div className="text-2xl sm:text-4xl font-mono font-black flex items-center justify-center gap-3">
                  <span>{num} : {den} ＝</span>
                  <span className="text-emerald-400">
                    {expansion.integerPart},
                    {expansion.isTerminating ? (
                      expansion.nonPeriodic
                    ) : (
                      <>
                        <span>{expansion.nonPeriodic}</span>
                        <Overline>{expansion.period}</Overline>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 font-semibold block mb-0.5">Είδος Δεκαδικού</span>
                  <span className="text-xs sm:text-sm font-bold text-indigo-900">
                    {expansion.isTerminating ? 'Πεπερασμένος' : expansion.nonPeriodic ? 'Μικτός Περιοδικός' : 'Απλός Περιοδικός'}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 font-semibold block mb-0.5">Περίοδος</span>
                  <span className="text-xs sm:text-sm font-mono font-black text-indigo-900">
                    {expansion.isTerminating ? 'Δεν υπάρχει' : expansion.period}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-500 font-semibold block mb-0.5">Μήκος Περιόδου</span>
                  <span className="text-xs sm:text-sm font-bold text-indigo-900">
                    {expansion.isTerminating ? '0 ψηφία' : `${expansion.period.length} ${expansion.period.length === 1 ? 'ψηφίο' : 'ψηφία'}`}
                  </span>
                </div>
              </div>

              {/* Ανάλυση διεργασίας */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Ερμηνεία Διαίρεσης:</strong> Εκτελώντας τη διαίρεση {num} : {den}, 
                {expansion.isTerminating ? (
                  <> το υπόλοιπο μηδενίζεται, άρα ο αριθμός έχει πεπερασμένο πλήθος δεκαδικών ψηφίων ({num / den}).</>
                ) : (
                  <> τα υπόλοιπα αρχίζουν να επαναλαμβάνονται κυκλικά, δημιουργώντας την άπειρη περίοδο <strong>{expansion.period}</strong>.</>
                )}
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
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 1: ΑΛΓΕΒΡΙΚΗ ΕΥΡΕΣΗ ΓΕΝΝΗΤΡΙΑΣ")}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Μετατροπή του 0,4<Overline>6</Overline> σε κλάσμα
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Να μετατραπεί ο μικτός περιοδικός δεκαδικός αριθμός <strong>x ＝ 0,4666... ＝ 0,4<Overline>6</Overline></strong> στο ισοδύναμο ανάγωγο κλάσμα του.
                </p>

                {/* Πίνακας Οργάνωσης Δεδομένων */}
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 border-b">Βήμα Μεθόδου</th>
                        <th className="p-2 border-b">Αλγεβρική Εξίσωση</th>
                        <th className="p-2 border-b">Σκοπός</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      <tr>
                        <td className="p-2 font-sans font-semibold">1. Ορισμός x</td>
                        <td className="p-2">x ＝ 0,4666...</td>
                        <td className="p-2 font-sans text-slate-600">Αρχική εξίσωση (1)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-sans font-semibold">2. Πολλαπλασιασμός επί 10</td>
                        <td className="p-2">10 · x ＝ 4,666...</td>
                        <td className="p-2 font-sans text-slate-600">Μετατόπιση μη περιοδικού μέρους</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-sans font-semibold">3. Πολλαπλασιασμός επί 100</td>
                        <td className="p-2">100 · x ＝ 46,666...</td>
                        <td className="p-2 font-sans text-slate-600">Μετατόπιση μιας πλήρους περιόδου</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-sans font-semibold">4. Αφαίρεση εξισώσεων</td>
                        <td className="p-2 text-indigo-700 font-bold">90 · x ＝ 42</td>
                        <td className="p-2 font-sans text-slate-600">Εξαφάνιση της άπειρης περιόδου</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <div><strong>Επίλυση:</strong> x ＝ 42 : 90.</div>
                  <div><strong>Αναγωγή:</strong> Διαιρούμε αριθμητή και παρονομαστή με το 6: 42 : 6 ＝ 7 και 90 : 6 ＝ 15.</div>
                  <div><strong>Τελικό Ανάγωγο Κλάσμα:</strong> <span className="font-mono font-bold text-emerald-900">7 : 15</span>.</div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 2: ΚΑΘΗΜΕΡΙΝΗ ΕΦΑΡΜΟΓΗ & ΜΟΙΡΑΣΙΑ")}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Διανομή ποσού και στρογγυλοποίηση
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Τρία αδέλφια μοιράζονται εξίσου ένα ποσό <strong>100 €</strong>. <br />
                  α) Ποιο είναι το ακριβές κλάσμα και ποιος ο περιοδικός δεκαδικός αριθμός που αντιστοιχεί στο μερίδιο του καθενός; <br />
                  β) Πόσα χρήματα (σε λεπτά του ευρώ) θα λάβει ο καθένας στην πράξη;
                </p>

                {/* Πίνακας Οργάνωσης Μεγεθών */}
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 border-b">Μέγεθος</th>
                        <th className="p-2 border-b">Μαθηματική Έκφραση</th>
                        <th className="p-2 border-b">Αποτέλεσμα</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2 font-semibold">Κλασματικό μερίδιο</td>
                        <td className="p-2 font-mono">100 : 3</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">100 / 3 €</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Δεκαδική ακριβής μορφή</td>
                        <td className="p-2 font-mono">100 : 3</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">33,<Overline>3</Overline> € (περίοδος 3)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Πραγματική πληρωμή (2 δεκαδικά)</td>
                        <td className="p-2 font-mono">Στρογγυλοποίηση στα εκατοστά</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">33,33 €</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <div><strong>Συμπέρασμα:</strong> Κάθε αδελφός λαμβάνει 33,33 €.</div>
                  <div><strong>Υπόλοιπο:</strong> 3 · 33,33 ＝ 99,99 €, απομένει 0,01 € (1 λεπτό) που δεν μπορεί να μοιραστεί ισότιμα χωρίς υποδιαίρεση του λεπτού!</div>
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
                {toCleanUppercase("ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΟΥΣ ΡΗΤΟΥΣ ΑΡΙΘΜΟΥΣ")}
              </h3>
              <ul className="space-y-2 text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Άπειρα δεκαδικά ψηφία ΧΩΡΙΣ περίοδο:</strong> Αριθμοί όπως ο <em>π ＝ 3,14159...</em> ή η ρίζα <em>√2 ＝ 1,41421...</em> έχουν άπειρα ψηφία αλλά <strong>ΔΕΝ έχουν περίοδο</strong>. Αυτοί οι αριθμοί λέγονται <strong>άρρητοι</strong> και <strong>ΔΕΝ</strong> είναι ρητοί!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Απλοποίηση πριν τον έλεγχο του παρονομαστή:</strong> Για να ελέγξουμε αν ένα κλάσμα είναι πεπερασμένο ή περιοδικό, πρέπει πρώτα να είναι <strong>ανάγωγο</strong>! Π.χ. στο 9 : 30, ο παρονομαστής 30 περιέχει το 3 (30 ＝ 2 · 3 · 5), αλλά απλοποιείται σε 3 : 10 ＝ 0,3 (πεπερασμένος δεκαδικός).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Λάθος θέση της γραμμής περιόδου:</strong> Στο 1,2353535... η περίοδος είναι το 35 και γράφεται <strong>1,2<Overline>35</Overline></strong> και <strong>ΟΧΙ</strong> <Overline>1,235</Overline> ούτε 1,<Overline>235</Overline>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Διαφορά 0,999... και 1:</strong> Ο περιοδικός δεκαδικός αριθμός 0,<Overline>9</Overline> ισούται <em>ακριβώς με το 1</em> (αφού 9 : 9 ＝ 1).</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Εμπεδώστε τη Δεκαδική Μορφή στην Πράξη!
          </h2>
          <p className="text-emerald-100 max-w-2xl text-sm sm:text-base mb-6">
            Δοκιμάστε τις ικανότητές σας σε 12 διαδραστικές ερωτήσεις και αυτούσια προβλήματα με άμεση ανατροφοδότηση και πλήρεις λύσεις.
          </p>
          <Link
            href="/g-gymnasiou/01-dekadiki-morfi-riton-ask"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-800 font-black rounded-2xl shadow-lg hover:bg-emerald-50 transition-all hover:scale-105 active:scale-100 text-base"
          >
            <span>🎯 {toCleanUppercase("ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
