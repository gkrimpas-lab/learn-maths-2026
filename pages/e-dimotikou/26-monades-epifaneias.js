import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function MonadesEpifaneias() {
  const [selectedUnit, setSelectedUnit] = useState('cm2');

  // Δεδομένα θεωρίας και σχέσεων για κάθε μονάδα
  const unitsData = {
    mm2: {
      title: "📐 Τετραγωνικό Χιλιοστό (mm²)",
      emoji: "🔍",
      desc: "Είναι η επιφάνεια ενός πολύ μικρού τετραγώνου με πλευρά 1 χιλιοστό (1 mm). Το χρησιμοποιούμε για να μετράμε πολύ μικρά πράγματα, όπως το μέγεθος ενός μυρμηγκιού ή το πάχος ενός νομίσματος.",
      relation: "1 cm² = 100 mm² (Δηλαδή, ένα τετραγωνικό εκατοστό χωράει ακριβώς 100 τέτοια μικρά χιλιοστά!)",
      color: "rgb(239, 68, 68)", // Κόκκινο
      bgAlpha: "rgba(239, 68, 68, 0.15)",
      gridContent: "mm"
    },
    cm2: {
      title: "🟩 Τετραγωνικό Εκατοστό (cm²)",
      emoji: "📏",
      desc: "Είναι η επιφάνεια ενός τετραγώνου με πλευρά 1 εκατοστό (1 cm). Είναι η βασική μονάδα που χρησιμοποιούμε στο τετράδιό μας! Με αυτό μετράμε την επιφάνεια μιας φωτογραφίας, ενός κινητού ή ενός βιβλίου.",
      relation: "1 dm² = 100 cm²",
      color: "rgb(59, 130, 246)", // Μπλε
      bgAlpha: "rgba(59, 130, 246, 0.15)",
      gridContent: "cm"
    },
    dm2: {
      title: "🟧 Τετραγωνικό Δεκάμετρο (dm²)",
      emoji: "📦",
      desc: "Είναι η επιφάνεια ενός τετραγώνου με πλευρά 1 δεκάμετρο (10 εκατοστά). Φαντάσου το σαν το μέγεθος που έχει το εξώφυλλο ενός μικρού τετραδίου ή ένα πλακάκι.",
      relation: "1 dm² = 100 cm² = 10.000 mm²",
      color: "rgb(249, 115, 22)", // Πορτοκαλί
      bgAlpha: "rgba(249, 115, 22, 0.15)",
      gridContent: "dm"
    },
    m2: {
      title: "🏠 Τετραγωνικό Μέτρο (m²)",
      emoji: "🏡",
      desc: "Είναι η βασική μονάδα μέτρησης για μεγάλες επιφάνειες! Είναι ένα μεγάλο τετράγωνο με πλευρά 1 μέτρο (1 m). Με αυτό μετράμε το μέγεθος ενός δωματίου, ενός σπιτιού ή του σχολικού μας γηπέδου.",
      relation: "1 m² = 100 dm² = 10.000 cm²",
      color: "rgb(16, 185, 129)", // Πράσινο
      bgAlpha: "rgba(16, 185, 129, 0.15)",
      gridContent: "m"
    }
  };

  const current = unitsData[selectedUnit];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📐 Μονάδες Επιφάνειας - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR - 100% ΙΔΙΟ ΜΕ ΤΑ ΥΠΟΛΟΙΠΑ ΜΑΘΗΜΑΤΑ */}
        <nav className="bg-white w-full border-b border-gray-100">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            
            <Link href="/e-dimotikou" className="bg-[#f1f1f4] hover:bg-[#e4e4e8] text-[#4a4a52] px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 tracking-wide">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600 stroke-[3] stroke-current">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Επιστροφή
            </Link>
          </div>
        </nav>

        {/* ΚΥΡΙΟ ΠΕΡΙΕΧΟΜΕΝΟ */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span className="text-xl">📖</span> Θεωρία: Πώς μετράμε τις Επιφάνειες;
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Όπως για το μήκος έχουμε τα εκατοστά και τα μέτρα, έτσι και για το <strong>Εμβαδόν</strong> έχουμε ειδικές μονάδες μέτρησης. Επειδή μετράμε επιφάνειες, όλες οι μονάδες μας είναι <strong>τετράγωνα</strong>!
            </p>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ (2 Στήλες) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΕΠΙΛΟΓΗ ΜΟΝΑΔΑΣ & ΠΛΗΡΟΦΟΡΙΕΣ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[540px] w-full gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    <span>🕹️</span> 1. Επίλεξε Μονάδα Μέτρησης
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedUnit('mm2')}
                      className={`px-4 py-3 rounded-xl font-bold text-sm text-center transition shadow-sm border ${
                        selectedUnit === 'mm2'
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      📐 χιλιοστό (mm²)
                    </button>
                    <button
                      onClick={() => setSelectedUnit('cm2')}
                      className={`px-4 py-3 rounded-xl font-bold text-sm text-center transition shadow-sm border ${
                        selectedUnit === 'cm2'
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🟩 εκατοστό (cm²)
                    </button>
                    <button
                      onClick={() => setSelectedUnit('dm2')}
                      className={`px-4 py-3 rounded-xl font-bold text-sm text-center transition shadow-sm border ${
                        selectedUnit === 'dm2'
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🟧 δεκάμετρο (dm²)
                    </button>
                    <button
                      onClick={() => setSelectedUnit('m2')}
                      className={`px-4 py-3 rounded-xl font-bold text-sm text-center transition shadow-sm border ${
                        selectedUnit === 'm2'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🏠 μέτρο (m²)
                    </button>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Δυναμική Κάρτα Παρουσίασης Μονάδας */}
                <div className="space-y-3">
                  <h4 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <span>{current.emoji}</span> {current.title}
                  </h4>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {current.desc}
                  </p>
                </div>
              </div>

              {/* ΠΡΑΣΙΝΗ ΚΑΡΤΑ: ΣΧΕΣΗ ΜΕΤΑΞΥ ΜΟΝΑΔΩΝ */}
              <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 shadow-sm mt-auto">
                <p className="font-bold text-emerald-900 flex items-center gap-2">
                  <span>🔄</span> Σχέση με άλλες μονάδες:
                </p>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center font-black text-sm md:text-base text-emerald-600 font-mono">
                  {current.relation}
                </div>
                <p className="text-[11px] font-medium text-emerald-700/80 text-center">
                  Θυμήσου: Στις μονάδες εμβαδού προχωράμε ανά 100!
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ (ΣΤΑΘΕΡΟ ΠΛΕΓΜΑ 10x10) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[540px] w-full relative overflow-hidden">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-4 block">
                ΟΠΤΙΚΟΠΟΙΗΣΗ ΜΟΝΑΔΑΣ (Υποδιαίρεση σε 100 μέρη)
              </span>

              {/* Το πλέγμα αναπαριστά πώς 1 μεγαλύτερη μονάδα χωρίζεται σε 100 μικρότερες (10x10) */}
              <div 
                className="grid grid-cols-10 grid-rows-10 border-4 rounded-xl overflow-hidden shadow-md transition-all duration-300"
                style={{ 
                  width: '320px', 
                  height: '320px',
                  borderColor: current.color 
                }}
              >
                {[...Array(100)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200/60 flex items-center justify-center text-[9px] font-bold transition-all duration-300 select-none"
                    style={{ 
                      backgroundColor: current.bgAlpha,
                      color: current.color
                    }}
                  >
                    {/* Εμφάνιση κειμένου μόνο στο πρώτο κουτάκι για να είναι καθαρό οπτικά */}
                    {i === 0 ? `1 ${current.gridContent}²` : ''}
                  </div>
                ))}
              </div>

              {/* Παιδαγωγικό συμπέρασμα κάτω από το γράφημα */}
              <div className="w-full flex flex-col items-center justify-center text-xs font-bold text-slate-500 pt-4 border-t border-gray-50 mt-6 text-center space-y-1">
                <p>💡 Βλέπεις τα 100 κουτάκια;</p>
                <p className="font-medium text-slate-400 max-w-sm">
                  Κάθε φορά που ανεβαίνουμε μια μονάδα εμβαδού, η νέα επιφάνεια είναι ακριβώς 100 φορές μεγαλύτερη από την προηγούμενη!
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Εμβαδού.</p>
      </footer>
    </div>
  );
}
