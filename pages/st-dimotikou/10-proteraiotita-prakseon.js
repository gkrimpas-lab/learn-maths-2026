// pages/st-dimotikou/10-proteraiotita-prakseon.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Προκαθορισμένα εκπαιδευτικά παραδείγματα με την ανάλυσή τους σε βήματα
const EXAMPLES = {
  EX1: {
    title: "1. Απλή Έκφραση (Χωρίς Παρένθεση)",
    expression: "10 - 2 × 4",
    steps: [
      { level: "Επίπεδο 1: Πολλαπλασιασμοί / Διαιρέσεις", text: "Ο πολλαπλασιασμός κερδίζει την αφαίρεση!", calculation: "2 × 4 = 8", currentForm: "10 - 8" },
      { level: "Επίπεδο 2: Προσθέσεις / Αφαιρέσεις", text: "Τώρα κάνουμε την αφαίρεση κανονικά.", calculation: "10 - 8 = 2", currentForm: "2" }
    ],
    final: "2",
    wrongText: "Αν κάναμε πρώτα την αφαίρεση (10 - 2 = 8) και μετά τον πολλαπλασιασμό (8 × 4), θα βγάζαμε λάθος αποτέλεσμα: 32!"
  },
  EX2: {
    title: "2. Με Παρένθεση (Αλλαγή Προτεραιότητας)",
    expression: "5 + 3 × (4 + 2)",
    steps: [
      { level: "Επίπεδο 1: Παρενθέσεις ( )", text: "Η παρένθεση έχει πάντα την απόλυτη προτεραιότητα!", calculation: "4 + 2 = 6", currentForm: "5 + 3 × 6" },
      { level: "Επίπεδο 2: Πολλαπλασιασμοί / Διαιρέσεις", text: "Ο πολλαπλασιασμός προηγείται της πρόσθεσης.", calculation: "3 × 6 = 18", currentForm: "5 + 18" },
      { level: "Επίπεδο 3: Προσθέσεις / Αφαιρέσεις", text: "Τέλος, κάνουμε την πρόσθεση.", calculation: "5 + 18 = 23", currentForm: "23" }
    ],
    final: "23",
    wrongText: "Χωρίς την παρένθεση, θα κάναμε πρώτα το 3 × 4 = 12, αλλά η παρένθεση «κλειδώνει» και μας αναγκάζει να προσθέσουμε πρώτα το 4 + 2."
  },
  EX3: {
    title: "3. Σύνθετη Έκφραση (Από αριστερά προς τα δεξιά)",
    expression: "12 ÷ 3 × 2 + 4",
    steps: [
      { level: "Επίπεδο 1: Πολλαπλασιασμοί / Διαιρέσεις", text: "Διαίρεση και πολλαπλασιασμός είναι ισοδύναμα! Ξεκινάμε με όποιο βρίσκουμε πρώτο από αριστερά.", calculation: "12 ÷ 3 = 4", currentForm: "4 × 2 + 4" },
      { level: "Επίπεδο 2: Επόμενος Πολλαπλασιασμός", text: "Συνεχίζουμε με τον πολλαπλασιασμό πριν πάμε στην πρόσθεση.", calculation: "4 × 2 = 8", currentForm: "8 + 4" },
      { level: "Επίπεδο 3: Προσθέσεις / Αφαιρέσεις", text: "Η πρόσθεση μένει για το τέλος.", calculation: "8 + 4 = 12", currentForm: "12" }
    ],
    final: "12",
    wrongText: "Προσοχή! Μην κάνετε πρώτα τον πολλαπλασιασμό 3 × 2 = 6, γιατί η διαίρεση (12 ÷) βρίσκεται πιο αριστερά και προηγείται στη σειρά!"
  }
};

export default function ProteraiotitaPrakseonPage() {
  const [selectedKey, setSelectedKey] = useState('EX1');
  const currentEx = EXAMPLES[selectedKey];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🏆 Προτεραιότητα των Πράξεων - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/st-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ (Η ΣΚΑΛΑ ΤΩΝ ΠΡΑΞΕΩΝ) */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>📖</span> Θεωρία: Ποιος έχει Προτεραιότητα;
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  Όταν σε μια μαθηματική έκφραση συνυπάρχουν πολλές πράξεις μαζί, ακολουθούμε πάντα τον κανόνα της <strong>Προτεραιότητας των Πράξεων</strong> (από πάνω προς τα κάτω), σαρώνοντας την έκφραση από <strong>αριστερά προς τα δεξιά</strong>.
                </p>
                
                {/* Η Σκάλα των Πράξεων */}
                <div className="space-y-2 font-medium text-sm">
                  <div className="flex items-center gap-3 bg-red-50 text-red-900 p-3 rounded-xl border border-red-100">
                    <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">1</span>
                    <div><strong>🥇 Παρενθέσεις ( ):</strong> Λύνονται πάντα πρώτες απ' όλα!</div>
                  </div>
                  <div className="flex items-center gap-3 bg-amber-50 text-amber-900 p-3 rounded-xl border border-amber-100">
                    <span className="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">2</span>
                    <div><strong>🥈 Πολλαπλασιασμοί (×) & Διαιρέσεις (÷):</strong> Έπονται, με τη σειρά που τις συναντάμε.</div>
                  </div>
                  <div className="flex items-center gap-3 bg-blue-50 text-blue-900 p-3 rounded-xl border border-blue-100">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">3</span>
                    <div><strong>🥉 Προσθέσεις (+) & Αφαιρέσεις (-):</strong> Γίνονται πάντα τελευταίες!</div>
                  </div>
                </div>
              </div>
              
              {/* Μνημονικός Κανόνας */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md text-center py-8 space-y-4">
                <span className="text-amber-300 font-black text-xs md:text-sm uppercase tracking-wider block">🧠 Μνημονικός Κανόνας</span>
                <div className="text-3xl md:text-4xl font-black tracking-widest bg-white/10 py-3 rounded-xl">
                  ΠΑ.ΠΟ.ΔΙ.ΠΡ.Α.
                </div>
                <p className="text-xs text-indigo-100 font-medium px-2 leading-relaxed">
                  <strong>Πα</strong>ρένθεση • <strong>Πο</strong>λλαπλασιασμός • <strong>Δι</strong>αίρεση • <strong>Πρ</strong>όσθεση • <strong>Α</strong>φαίρεση!
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔIΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΟ - ΑΝΑΛΥΣΗ ΕΚΦΡΑΣΗΣ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΕΠΙΛΟΓΗ ΠΑΡΑΔΕΙΓΜΑΤΟΣ (4 στήλες) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-gray-900">Διαδραστικά Παραδείγματα</h3>
                <p className="text-gray-500 text-xs">Επίλεξε μια μαθηματική έκφραση για να δεις το δέντρο ανάλυσής της.</p>
              </div>

              <div className="flex flex-col gap-3 my-auto">
                {Object.keys(EXAMPLES).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedKey(key)}
                    className={`w-full text-left p-4 rounded-xl border-2 font-bold transition-all flex flex-col gap-1 ${selectedKey === key ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'}`}
                  >
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-black">{EXAMPLES[key].title}</span>
                    <span className="text-lg font-mono font-black tracking-normal">{EXAMPLES[key].expression}</span>
                  </button>
                ))}
              </div>

              {/* Προειδοποίηση για το συχνό λάθος */}
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-900 rounded-xl text-xs font-medium leading-relaxed mt-auto">
                ⚠️ <strong>Προσοχή στο Λάθος:</strong> {currentEx.wrongText}
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ / ΔΕΝΤΡΟ ΠΡΑΞΕΩΝ (8 στήλες) */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[460px]">
              
              <div className="w-full text-center mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Βήμα-Βήμα Ανάλυση (Διάγραμμα Ροής):</span>
                <div className="text-2xl font-mono font-black text-blue-600 mt-2 bg-blue-50 inline-block px-6 py-2 rounded-2xl border border-blue-100">
                  {currentEx.expression}
                </div>
              </div>

              {/* Το «Δέντρο» των βημάτων */}
              <div className="w-full max-w-md mx-auto flex flex-col gap-4 my-auto relative">
                {currentEx.steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center w-full">
                    
                    {/* Κάρτα Βήματος */}
                    <div className="bg-slate-900 text-white p-4 rounded-xl border-2 border-slate-700 w-full shadow-md flex justify-between items-center font-mono gap-4">
                      <div className="space-y-0.5 text-left flex-1">
                        <div className="text-[10px] font-sans font-black uppercase text-amber-400 tracking-wider">{step.level}</div>
                        <div className="text-xs text-slate-400 font-sans leading-snug">{step.text}</div>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <div className="text-emerald-400 font-black text-sm bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-900/50">{step.calculation}</div>
                      </div>
                    </div>

                    {/* Βέλος σύνδεσης / Επόμενη μορφή έκφρασης */}
                    <div className="flex flex-col items-center my-1 text-slate-400">
                      <span className="text-sm font-black animate-pulse">↓</span>
                      <span className="text-xs font-mono font-bold tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                        Νέα Μορφή: {step.currentForm}
                      </span>
                    </div>

                  </div>
                ))}

                {/* Τελικό Αποτέλεσμα */}
                <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-xl text-center shadow-lg font-mono font-black flex items-center justify-center gap-3">
                  <span className="text-xl">🏁</span>
                  <span className="text-sm font-sans uppercase tracking-wider">Τελικό Αποτέλεσμα:</span>
                  <span className="text-2xl bg-white/20 px-4 py-1 rounded-lg shadow-inner">{currentEx.final}</span>
                </div>
              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-6 text-center">
                <span>🔍 Αν δύο πράξεις έχουν την ίδια προτεραιότητα (π.χ. πολλαπλασιασμός και διαίρεση), γίνονται πάντα από αριστερά προς τα δεξιά!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Προτεραιότητα των Πράξεων - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
