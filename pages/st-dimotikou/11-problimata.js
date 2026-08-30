import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PROBLEM_PRESETS = [
  {
    id: 'school-trip',
    title: '🚌 Σχολική Εκδρομή',
    text: 'Ένα σχολείο με 120 μαθητές οργανώνει εκδρομή. Κάθε λεωφορείο χωράει 40 μαθητές και το εισιτήριο κοστίζει 8 € ανά μαθητή. Πόσα λεωφορεία χρειάζονται και ποιο είναι το συνολικό κόστος εισιτηρίων;',
    given: [
      'Συνολικοί μαθητές: 120',
      'Χωρητικότητα λεωφορείου: 40 μαθητές',
      'Τιμή εισιτηρίου ανά μαθητή: 8 €'
    ],
    target: [
      '1ο Ζητούμενο: Αριθμός λεωφορείων',
      '2ο Ζητούμενο: Συνολικό κόστος εισιτηρίων (€)'
    ],
    steps: [
      {
        action: 'Υπολογισμος λεωφορειων (Διαιρεση)',
        calc: '120 : 40 ＝ 3 λεωφορεία',
        explain: 'Μοιράζουμε το σύνολο των μαθητών στη χωρητικότητα κάθε λεωφορείου.'
      },
      {
        action: 'Υπολογισμος συνολικου κοστους (Πολλαπλασιασμος)',
        calc: '120 × 8 ＝ 960 €',
        explain: 'Πολλαπλασιάζουμε το πλήθος των μαθητών με την τιμή του ενός εισιτηρίου.'
      }
    ],
    finalAnswer: 'Χρειάζονται 3 λεωφορεία και το συνολικό κόστος είναι 960 €.'
  },
  {
    id: 'market-shopping',
    title: '🛒 Ψώνια στο Σούπερ Μάρκετ',
    text: 'Η κυρία Ελένη είχε 50 €. Αγόρασε 3 κιλά μήλα προς 2 € το κιλό και 2 πακέτα τυρί προς 6 € το πακέτο. Πόσα ρέστα πήρε;',
    given: [
      'Αρχικό ποσό: 50 €',
      'Μήλα: 3 κιλά × 2 €/κιλό',
      'Τυρί: 2 πακέτα × 6 €/πακέτο'
    ],
    target: [
      'Ζητούμενο: Τα ρέστα που πήρε'
    ],
    steps: [
      {
        action: 'Κοστος μηλων',
        calc: '3 × 2 ＝ 6 €',
        explain: 'Βρίσκουμε πόσο πλήρωσε για τα μήλα.'
      },
      {
        action: 'Κοστος τυριου',
        calc: '2 × 6 ＝ 12 €',
        explain: 'Βρίσκουμε πόσο πλήρωσε για το τυρί.'
      },
      {
        action: 'Συνολικη δαπανη',
        calc: '6 ＋ 12 ＝ 18 €',
        explain: 'Προσθέτουμε τα επιμέρους έξοδα.'
      },
      {
        action: 'Υπολογισμος ρεστων (Αφαιρεση)',
        calc: '50 － 18 ＝ 32 €',
        explain: 'Αφαιρούμε τα συνολικά έξοδα από το αρχικό χαρτονόμισμα.'
      }
    ],
    finalAnswer: 'Η κυρία Ελένη πήρε 32 € ρέστα.'
  },
  {
    id: 'bookstore',
    title: '📚 Βιβλιοθήκη & Βιβλία',
    text: 'Μια βιβλιοθήκη έχει 4 ράφια με 25 βιβλία το καθένα. Αγόρασε άλλα 35 καινούρια βιβλία. Αν θέλει να τα μοιράσει όλα ισότιμα σε 5 νέα μεγάλα ράφια, πόσα βιβλία θα έχει κάθε νέο ράφι;',
    given: [
      'Αρχικά: 4 ράφια × 25 βιβλία',
      'Νέα βιβλία: 35',
      'Νέα ράφια: 5'
    ],
    target: [
      'Ζητούμενο: Αριθμός βιβλίων σε κάθε νέο ράφι'
    ],
    steps: [
      {
        action: 'Αρχικα βιβλια',
        calc: '4 × 25 ＝ 100 βιβλία',
        explain: 'Βρίσκουμε πόσα βιβλία υπήρχαν συνολικά.'
      },
      {
        action: 'Συνολικα βιβλια μετα την αγορα',
        calc: '100 ＋ 35 ＝ 135 βιβλία',
        explain: 'Προσθέτουμε τα καινούρια βιβλία.'
      },
      {
        action: 'Μοιρασμα στα 5 νεα ραφια',
        calc: '135 : 5 ＝ 27 βιβλία',
        explain: 'Διαιρούμε το σύνολο των βιβλίων με τα 5 ράφια.'
      }
    ],
    finalAnswer: 'Κάθε νέο ράφι θα έχει 27 βιβλία.'
  }
];

export default function ProblimataPage() {
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [activeStepTab, setActiveStepTab] = useState(0); // 0: Ανάγνωση, 1: Δεδομένα, 2: Ζητούμενα, 3: Οργάνωση & Λύση

  const currentProblem = PROBLEM_PRESETS[selectedProblemIndex];

  const guideSteps = [
    {
      num: 1,
      title: '1. Προσεκτική Ανάγνωση',
      icon: '📖',
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50/80',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      desc: 'Διαβάζουμε το πρόβλημα 2-3 φορές μέχρι να καταλάβουμε την ιστορία και τι ακριβώς συμβαίνει.'
    },
    {
      num: 2,
      title: '2. Εντοπισμός Δεδομένων',
      icon: '📋',
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50/80',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      desc: 'Υπογραμμίζουμε και καταγράφουμε όλες τις γνωστές πληροφορίες και τους αριθμούς που μας δίνονται.'
    },
    {
      num: 3,
      title: '3. Εντοπισμός Ζητουμένων',
      icon: '🎯',
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50/80',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      desc: 'Ξεκαθαρίζουμε τι ακριβώς μας ζητάει να βρούμε η ερώτηση του προβλήματος.'
    },
    {
      num: 4,
      title: '4. Σχέδιο, Πράξεις και Έλεγχος',
      icon: '⚙️',
      color: 'bg-purple-600',
      lightColor: 'bg-purple-50/80',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      desc: 'Οργανώνουμε τα βήματα με τη σωστή σειρά πράξεων, γράφουμε την απάντηση και ελέγχουμε αν είναι λογική.'
    }
  ];

  return (
    <Layout
      title="🧠 11. Στρατηγική και Βήματα Επίλυσης Προβλημάτων - LearnMaths.gr"
      description="Μάθε τη μέθοδο των 4 βημάτων (Ανάγνωση, Δεδομένα, Ζητούμενα, Σχέδιο και Λύση) για να λύνεις με επιτυχία κάθε μαθηματικό πρόβλημα της ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/11-problimata-ask"
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <span>🎯</span>
          <span>Ασκήσεις</span>
        </Link>
      }
    >
      <div className="space-y-8 md:space-y-10 py-6 md:py-10">

        {/* HERO BANNER WITH PROMO CALLOUT CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  🎓 ΣΤ' Δημοτικου
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενοτητα 11
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                11. Στρατηγική και Βήματα Επίλυσης Προβλημάτων
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε τη μέθοδο των <strong>4 χρυσών βημάτων</strong> για να λύνεις με σιγουριά κάθε μαθηματικό πρόβλημα: <strong>Ανάγνωση</strong> ➔ <strong>Δεδομένα</strong> ➔ <strong>Ζητούμενα</strong> ➔ <strong>Σχέδιο και Λύση</strong>!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
              <p className="text-xs text-blue-50">Λύσε 8 δυναμικά προβλήματα με άμεσο έλεγχο και βαθμολόγηση!</p>
              <Link
                href="/st-dimotikou/11-problimata-ask"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* THEORY CARDS (4 STEPS GRID) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guideSteps.map((step) => (
            <div
              key={step.num}
              className={`${step.lightColor} border ${step.borderColor} p-5 sm:p-6 rounded-3xl space-y-3 flex flex-col justify-between shadow-xs transition hover:shadow-md`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`w-8 h-8 ${step.color} text-white rounded-xl flex items-center justify-center font-black text-sm shadow-xs`}>
                    {step.num}
                  </span>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <h3 className={`text-base font-black ${step.textColor}`}>
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE PLAYGROUND: STEP-BY-STEP PROBLEM SOLVER */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Καθοδηγούμενης Επίλυσης
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Επίλεξε ένα πρόβλημα και ακολούθησε τα βήματα για να δεις πώς αναλύεται και οργανώνεται η λύση του!
              </p>
            </div>

            {/* PROBLEM SELECTOR PRESETS */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {PROBLEM_PRESETS.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedProblemIndex(idx);
                    setActiveStepTab(0);
                  }}
                  className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black border transition-all ${
                    selectedProblemIndex === idx
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-blue-50'
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* PROBLEM CARD & INTERACTIVE WORKFLOW */}
          <div className="space-y-6">

            {/* THE PROBLEM STATEMENT */}
            <div className="bg-slate-50 border-2 border-slate-200 p-5 sm:p-6 rounded-3xl shadow-inner space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase text-blue-600 tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  Εκφωνηση Προβληματος
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Παράδειγμα {selectedProblemIndex + 1} από {PROBLEM_PRESETS.length}
                </span>
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
                «{currentProblem.text}»
              </p>
            </div>

            {/* INTERACTIVE WORKFLOW STEP NAVIGATION */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              {guideSteps.map((step, idx) => (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStepTab(idx)}
                  className={`py-2.5 sm:py-3 px-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                    activeStepTab === idx
                      ? 'bg-white text-blue-600 shadow-md scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="truncate">Βήμα {step.num}</span>
                </button>
              ))}
            </div>

            {/* STEP CONTENT DISPLAY */}
            <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-3xl shadow-sm min-h-[260px] flex flex-col justify-between">
              
              {/* STEP 1: READING */}
              {activeStepTab === 0 && (
                <div className="space-y-4 my-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📖</span>
                    <h4 className="text-base sm:text-lg font-black text-blue-700">1ο Βήμα: Διαβάζω και Κατανοώ</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Διαβάζουμε το πρόβλημα αργά και προσεκτικά. Αναρωτιόμαστε: <em>«Ποια είναι η βασική ιστορία; Τι γνωρίζουμε και τι ψάχνουμε;»</em>
                  </p>
                  <div className="p-3.5 sm:p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 text-xs sm:text-sm font-medium">
                    💡 <strong>Συμβουλή:</strong> Προσπάθησε να διηγηθείς την ιστορία του προβλήματος με δικά σου λόγια πριν πιάσεις το μολύβι!
                  </div>
                </div>
              )}

              {/* STEP 2: GIVEN DATA */}
              {activeStepTab === 1 && (
                <div className="space-y-4 my-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    <h4 className="text-base sm:text-lg font-black text-emerald-700">2ο Βήμα: Καταγράφω τα Δεδομένα</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Ξεχωρίζουμε τις γνωστές πληροφορίες και τους αριθμούς που περιέχει το πρόβλημα:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentProblem.given.map((g, idx) => (
                      <div key={idx} className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl font-mono text-xs sm:text-sm font-bold text-emerald-900 shadow-xs flex items-center gap-2">
                        <span className="text-emerald-600">✔</span>
                        <span>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: TARGET QUESTIONS */}
              {activeStepTab === 2 && (
                <div className="space-y-4 my-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    <h4 className="text-base sm:text-lg font-black text-amber-700">3ο Βήμα: Εντοπίζω τα Ζητούμενα</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Εστιάζουμε στην ερώτηση του προβλήματος για να ξέρουμε ακριβώς τι πρέπει να υπολογίσουμε:
                  </p>
                  <div className="space-y-2">
                    {currentProblem.target.map((t, idx) => (
                      <div key={idx} className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl font-mono text-xs sm:text-sm font-bold text-amber-900 shadow-xs flex items-center gap-2">
                        <span className="text-amber-600">❓</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: PLAN & SOLUTION */}
              {activeStepTab === 3 && (
                <div className="space-y-5 my-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚙️</span>
                    <h4 className="text-base sm:text-lg font-black text-purple-700">4ο Βήμα: Σχέδιο, Πράξεις και Τελική Απάντηση</h4>
                  </div>

                  <div className="space-y-3">
                    {currentProblem.steps.map((s, idx) => (
                      <div key={idx} className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5">
                          <span className="text-xs font-black uppercase text-purple-700">
                            Βημα {idx + 1}: {s.action}
                          </span>
                          <span className="font-mono text-xs sm:text-sm md:text-base font-black text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-300 self-start sm:self-auto">
                            {s.calc}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{s.explain}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <span className="text-xs md:text-sm uppercase tracking-wider font-bold">🏁 Τελική Απάντηση:</span>
                    <span className="text-xs sm:text-sm md:text-base font-black">{currentProblem.finalAnswer}</span>
                  </div>
                </div>
              )}

              {/* STEP NAVIGATION BUTTONS */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4 gap-2">
                <button
                  type="button"
                  disabled={activeStepTab === 0}
                  onClick={() => setActiveStepTab(prev => Math.max(0, prev - 1))}
                  className="px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs md:text-sm font-bold transition disabled:opacity-40"
                >
                  ⬅️ Πίσω
                </button>

                <span className="text-xs font-bold text-slate-400">
                  Βήμα {activeStepTab + 1} από 4
                </span>

                <button
                  type="button"
                  disabled={activeStepTab === 3}
                  onClick={() => setActiveStepTab(prev => Math.min(3, prev + 1))}
                  className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs md:text-sm font-bold transition disabled:opacity-40"
                >
                  Επόμενο ➔
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Έμαθες πώς να οργανώνεις τα δεδομένα και τα ζητούμενα; Δοκίμασε τις διαδραστικές ασκήσεις προβλημάτων για να τελειοποιήσεις τη μέθοδό σου!
            </p>
          </div>
          <Link
            href="/st-dimotikou/11-problimata-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}
