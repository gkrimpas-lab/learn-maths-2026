import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function FysikoiTheoria() {
  // State για το διαδραστικό εργαστήριο Πολλαπλασιασμού
  const [multA, setMultA] = useState(4);
  const [multB, setMultB] = useState(6);

  // State για το διαδραστικό εργαστήριο Δυνάμεων
  const [base, setBase] = useState(3);
  const [exponent, setExponent] = useState(4);

  // Υπολογισμοί
  const product = useMemo(() => multA * multB, [multA, multB]);
  const powerResult = useMemo(() => Math.pow(base, exponent), [base, exponent]);

  // Παραγωγή ανάλυσης γινομένου για τη δύναμη (π.χ. 3 · 3 · 3 · 3)
  const powerExpansion = useMemo(() => {
    if (exponent === 0) return '1 (εξ ορισμού για βάση διάφορη του 0)';
    if (exponent === 1) return `${base}`;
    return Array(exponent).fill(base).join(' · ');
  }, [base, exponent]);

  // Stepper handlers με αποτροπή propagation
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  return (
    <Layout
      title="Φυσικοί Αριθμοί, Πολλαπλασιασμός & Δυνάμεις | Α' Γυμνασίου"
      description="Θεωρία και διαδραστικά εργαστήρια για τους φυσικούς αριθμούς, τις ιδιότητες του πολλαπλασιασμού και τις δυνάμεις για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/01-fysikoi-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        {/* Banner Header - Εναρμονισμένο Indigo με άτονα κεφαλαία */}
<section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
  <div className="max-w-4xl space-y-4">
    <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
      Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
    </span>
    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
      Φυσικοί Αριθμοί, Πολλαπλασιασμός & Δυνάμεις
    </h1>
    <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
      Εξερευνούμε τη δομή του συνόλου των φυσικών αριθμών, τις θεμελιώδεις ιδιότητες του πολλαπλασιασμού και τη σύντομη γραφή των διαδοχικών γινομένων μέσω των δυνάμεων.
    </p>
  </div>
</section>

        {/* 1. ΕΝΝΟΙΑ ΤΩΝ ΦΥΣΙΚΩΝ ΑΡΙΘΜΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Η Έννοια των Φυσικών Αριθμών
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Φυσικοί αριθμοί</strong> ονομάζονται οι αριθμοί που χρησιμοποιούμε για να απαριθμήσουμε ή να διατάξουμε αντικείμενα:
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 font-semibold text-center text-base sm:text-xl">
                ℕ ＝ {'{'} 0, 1, 2, 3, 4, 5, 6, 7, ... {'}'}
              </div>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>Ο μικρότερος φυσικός αριθμός είναι το <strong>0</strong>.</li>
                <li>Δεν υπάρχει μεγαλύτερος φυσικός αριθμός, το σύνολο ℕ είναι <strong>άπειρο</strong>.</li>
                <li>Κάθε φυσικός αριθμός έχει έναν ακριβώς επόμενο (διαδοχικό) φυσικό αριθμό.</li>
              </ul>
            </div>

            <div className="flex flex-col justify-center bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Απεικόνιση στον Άξονα των Αριθμών
              </h3>
              {/* Responsive SVG Axis - no horizontal scroll */}
              <div className="w-full">
                <svg
                  viewBox="0 0 600 90"
                  className="w-full h-auto"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Κύριος Άξονας */}
                  <line x1="20" y1="45" x2="570" y2="45" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                  <polygon points="585,45 565,37 565,53" fill="#334155" />

                  {/* Υποδιαιρέσεις & Ετικέτες */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                    const x = 40 + num * 62;
                    return (
                      <g key={num}>
                        <line x1={x} y1="35" x2={x} y2="55" stroke="#475569" strokeWidth="2.5" />
                        <circle cx={x} cy="45" r="4" fill="#4f46e5" />
                        <text
                          x={x}
                          y="78"
                          textAnchor="middle"
                          fontSize="16"
                          fontWeight="700"
                          fill="#1e293b"
                        >
                          {num}
                        </text>
                      </g>
                    );
                  })}
                  <text x="560" y="32" fontSize="14" fontWeight="600" fill="#64748b">
                    +∞
                  </text>
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 text-center">
                Κάθε φυσικός αριθμός αντιστοιχίζεται σε ένα συγκεκριμένο σημείο της ημιευθείας με αρχή το 0.
              </p>
            </div>
          </div>
        </section>

        {/* 2. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ & ΙΔΙΟΤΗΤΕΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Πολλαπλασιασμός & Ιδιότητες
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Ο πολλαπλασιασμός είναι η συντομογραφία μιας πρόσθεσης ίσων προσθετέων: 
            <span className="font-bold text-slate-900"> α · β ＝ β ＋ β ＋ ... ＋ β</span> (α φορές).
          </p>

          {/* Πίνακας Ιδιοτήτων */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-blue-600">Ιδιότητα 1</div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Αντιμεταθετική</h3>
              <p className="text-sm sm:text-base text-slate-600">
                Η σειρά των παραγόντων δεν αλλάζει το γινόμενο:
              </p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-blue-900 text-center">
                α · β ＝ β · α
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-blue-600">Ιδιότητα 2</div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Προσεταιριστική</h3>
              <p className="text-sm sm:text-base text-slate-600">
                Μπορούμε να ομαδοποιήσουμε τους παράγοντες ελεύθερα:
              </p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-blue-900 text-center">
                (α · β) · γ ＝ α · (β · γ)
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-blue-600">Ιδιότητα 3</div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Ουδέτερο & Μηδενικό Στοιχείο</h3>
              <p className="text-sm sm:text-base text-slate-600">
                Το 1 δεν αλλάζει τον αριθμό, ενώ το 0 μηδενίζει το γινόμενο:
              </p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold text-blue-900 text-center space-y-1">
                <div>α · 1 ＝ α</div>
                <div>α · 0 ＝ 0</div>
              </div>
            </div>

            <div className="md:col-span-2 xl:col-span-3 p-5 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="text-xs uppercase font-bold tracking-wider text-amber-700">Θεμελιώδης Ιδιότητα</div>
              <h3 className="font-bold text-slate-900 text-base sm:text-xl">Επιμεριστική Ιδιότητα ως προς την Πρόσθεση και την Αφαίρεση</h3>
              <p className="text-sm sm:text-base text-slate-700">
                Ο πολλαπλασιασμός ενός αριθμού με ένα άθροισμα (ή διαφορά) επιμερίζεται σε κάθε προσθετέο χωριστά:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono font-bold text-slate-900 text-center">
                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  α · (β ＋ γ) ＝ α · β ＋ α · γ
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  α · (β － γ) ＝ α · β － α · γ  <span className="text-xs text-slate-500 font-normal">(για β ≥ γ)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο Πολλαπλασιασμού (Ορθογώνιο Πλέγμα) */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              🛠️ Διαδραστικό Εργαστήριο: Γεωμετρική Αναπαράσταση Γινομένου
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Χειριστήρια Steppers */}
              <div className="space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Πρώτος Παράγοντας (Γραμμές α)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setMultA, -1, 1, 8, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2">
                      α ＝ {multA}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setMultA, 1, 1, 8, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Δεύτερος Παράγοντας (Στήλες β)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setMultB, -1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2">
                      β ＝ {multB}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setMultB, 1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center space-y-1">
                  <div className="text-xs text-blue-700 font-medium">Υπολογισμός Εμβαδού / Πλήθους:</div>
                  <div className="text-xl sm:text-2xl font-black text-blue-950 font-mono">
                    {multA} · {multB} ＝ {product}
                  </div>
                </div>
              </div>

              {/* Οπτική Απεικόνιση Πλέγματος (SVG Responsive) */}
              <div className="lg:col-span-2 bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center overflow-hidden">
                <div className="w-full max-w-[500px]">
                  <svg
                    viewBox={`0 0 ${multB * 36 + 20} ${multA * 36 + 20}`}
                    className="w-full h-auto max-h-[300px]"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {Array.from({ length: multA }).map((_, row) =>
                      Array.from({ length: multB }).map((_, col) => (
                        <rect
                          key={`${row}-${col}`}
                          x={10 + col * 36}
                          y={10 + row * 36}
                          width="30"
                          height="30"
                          rx="6"
                          className="fill-sky-400 stroke-sky-200/30 transition-all duration-300"
                          strokeWidth="2"
                        />
                      ))
                    )}
                  </svg>
                </div>
                <div className="text-slate-300 text-xs sm:text-sm mt-3 text-center">
                  Σύνολο: <strong className="text-white">{product}</strong> τετραγωνικά στοιχεία ({multA} σειρές από {multB} τετράγωνα).
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΔΥΝΑΜΕΙΣ ΦΥΣΙΚΩΝ ΑΡΙΘΜΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Δυνάμεις Φυσικών Αριθμών
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Δύναμη</strong> με βάση έναν φυσικό αριθμό <strong>α</strong> και εκθέτη έναν φυσικό αριθμό <strong>ν</strong> (με ν &gt; 1) είναι το γινόμενο <strong>ν παραγόντων</strong> ίσων με το α:
              </p>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-purple-950 font-bold text-center text-lg sm:text-2xl font-mono">
                α<sup>ν</sup> ＝ α · α · α · ... · α  <span className="text-xs sm:text-sm block font-normal text-purple-700 mt-1">(ν παράγοντες)</span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li><strong>α (Βάση):</strong> Ο επαναλαμβανόμενος παράγοντας.</li>
                <li><strong>ν (Εκθέτης):</strong> Δείχνει πόσες φορές πολλαπλασιάζεται η βάση με τον εαυτό της.</li>
              </ul>
            </div>

            {/* Ειδικές Περιπτώσεις & Δυνάμεις του 10 */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Ειδικές Συμβάσεις & Δυνάμεις του 10</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base font-mono">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-purple-600 font-bold">α<sup>1</sup> ＝ α</span>
                  <div className="text-xs text-slate-500 font-sans mt-0.5">Εκθέτης 1</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-purple-600 font-bold">α<sup>0</sup> ＝ 1</span>
                  <div className="text-xs text-slate-500 font-sans mt-0.5">Για κάθε α ≠ 0</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-purple-600 font-bold">0<sup>ν</sup> ＝ 0</span>
                  <div className="text-xs text-slate-500 font-sans mt-0.5">Για ν ≠ 0</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-purple-600 font-bold">1<sup>ν</sup> ＝ 1</span>
                  <div className="text-xs text-slate-500 font-sans mt-0.5">Για κάθε ν</div>
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700">
                <strong>Δυνάμεις του 10:</strong> Το 10<sup>ν</sup> γράφεται ως το 1 ακολουθούμενο από <strong>ν</strong> μηδενικά.<br />
                <em>Παράδειγμα:</em> 10<sup>4</sup> ＝ 10.000 (τέσσερα μηδενικά).
              </div>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο Δυνάμεων */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              🛠️ Διαδραστικό Εργαστήριο: Υπολογισμός & Ανάλυση Δύναμης
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Χειριστήρια Βάσης και Εκθέτη */}
              <div className="space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Βάση (α)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBase, -1, 0, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2">
                      α ＝ {base}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setBase, 1, 0, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Εκθέτης (ν)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExponent, -1, 0, 6, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2">
                      ν ＝ {exponent}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setExponent, 1, 0, 6, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition-all shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Παρουσίαση Αποτελέσματος */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl text-white space-y-4 shadow-md">
                <div className="text-center space-y-2">
                  <div className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">
                    Γραφή & Αποτέλεσμα
                  </div>
                  <div className="text-3xl sm:text-5xl font-black font-mono">
                    {base}<sup className="text-amber-400">{exponent}</sup> ＝ {powerResult.toLocaleString('el-GR')}
                  </div>
                </div>

                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 space-y-1">
                  <div className="text-xs text-indigo-200">Ανάπτυγμα Γινομένου:</div>
                  <div className="font-mono text-sm sm:text-base text-amber-300 break-words">
                    {powerExpansion}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
