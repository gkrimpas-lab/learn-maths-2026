// pages/st-dimotikou/11-problimata.js
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
        action: 'Υπολογισμός λεωφορείων (Διαίρεση)',
        calc: '120 : 40 ＝ 3 λεωφορεία',
        explain: 'Μοιράζουμε το σύνολο των μαθητών στη χωρητικότητα κάθε λεωφορείου.'
      },
      {
        action: 'Υπολογισμός συνολικού κόστους (Πολλαπλασιασμός)',
        calc: '120 · 8 ＝ 960 €',
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
      'Μήλα: 3 κιλά · 2 €/κιλό',
      'Τυρί: 2 πακέτα · 6 €/πακέτο'
    ],
    target: [
      'Ζητούμενο: Τα ρέστα που πήρε (€)'
    ],
    steps: [
      {
        action: 'Κόστος μήλων',
        calc: '3 · 2 ＝ 6 €',
        explain: 'Βρίσκουμε πόσο πλήρωσε για τα μήλα.'
      },
      {
        action: 'Κόστος τυριού',
        calc: '2 · 6 ＝ 12 €',
        explain: 'Βρίσκουμε πόσο πλήρωσε για το τυρί.'
      },
      {
        action: 'Συνολική δαπάνη',
        calc: '6 ＋ 12 ＝ 18 €',
        explain: 'Προσθέτουμε τα επιμέρους έξοδα.'
      },
      {
        action: 'Υπολογισμός ρέστων (Αφαίρεση)',
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
      'Αρχικά: 4 ράφια · 25 βιβλία',
      'Νέα βιβλία: 35',
      'Νέα ράφια: 5'
    ],
    target: [
      'Ζητούμενο: Αριθμός βιβλίων σε κάθε νέο ράφι'
    ],
    steps: [
      {
        action: 'Αρχικά βιβλία',
        calc: '4 · 25 ＝ 100 βιβλία',
        explain: 'Βρίσκουμε πόσα βιβλία υπήρχαν συνολικά.'
      },
      {
        action: 'Συνολικά βιβλία μετά την αγορά',
        calc: '100 ＋ 35 ＝ 135 βιβλία',
        explain: 'Προσθέτουμε τα καινούρια βιβλία.'
      },
      {
        action: 'Μοίρασμα στα 5 νέα ράφια',
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
      title: '4. Σχέδιο, Πράξεις & Έλεγχος',
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
      title="Στρατηγική και Βήματα Επίλυσης Προβλημάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε τη μέθοδο των 4 βημάτων (Ανάγνωση, Δεδομένα, Ζητούμενα, Σχέδιο και Λύση) για να λύνεις με επιτυχία κάθε μαθηματικό πρόβλημα της ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/11-problimata-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 11 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Στρατηγική &amp; Βήματα Επίλυσης Προβλημάτων
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε τη μέθοδο των <strong>4 χρυσών βημάτων</strong> για να λύνεις με σιγουριά κάθε μαθηματικό πρόβλημα: <strong>Ανάγνωση</strong> ➔ <strong>Δεδομένα</strong> ➔ <strong>Ζητούμενα</strong> ➔ <strong>Σχέδιο και Λύση</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Μέθοδος 4 Βημάτων &amp; Διαδραστική Ανάλυση Σεναρίων</span>
            </div>
            <Link
              href="/st-dimotikou/11-problimata-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (4 ΒΗΜΑΤΑ) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Τα 4 Χρυσά Βήματα για τη Λύση Κάθε Προβλήματος
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Μια συστηματική στρατηγική που οργανώνει τη σκέψη και αποτρέπει τα λάθη απροσεξίας.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            {guideSteps.map((step) => (
              <article
                key={step.num}
                className={`${step.lightColor} border ${step.borderColor} p-5 sm:p-7 2xl:p-9 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm transition hover:shadow-md`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`w-8 h-8 sm:w-9 sm:h-9 ${step.color} text-white rounded-xl flex items-center justify-center font-black text-sm 2xl:text-base shadow-xs`}>
                      {step.num}
                    </span>
                    <span className="text-2xl sm:text-3xl">{step.icon}</span>
                  </div>
                  <h3 className={`text-base sm:text-lg 2xl:text-xl font-black ${step.textColor}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm 2xl:text-base text-slate-600 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΚΑΘΟΔΗΓΟΥΜΕΝΗΣ ΕΠΙΛΥΣΗΣ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Καθοδηγούμενης Επίλυσης
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
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
                  className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black border transition-all touch-manipulation active:scale-95 ${
                    selectedProblemIndex === idx
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
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
            <div className="bg-slate-50 border-2 border-slate-200 p-5 sm:p-6 2xl:p-8 rounded-3xl shadow-inner space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs 2xl:text-sm font-black uppercase text-blue-700 tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  ΕΚΦΩΝΗΣΗ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <span className="text-xs 2xl:text-sm font-bold text-slate-400">
                  Παράδειγμα {selectedProblemIndex + 1} από {PROBLEM_PRESETS.length}
                </span>
              </div>
              <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-800 leading-relaxed">
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
                  className={`py-2.5 sm:py-3 px-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2 touch-manipulation active:scale-95 ${
                    activeStepTab === idx
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="truncate">Βήμα {step.num}</span>
                </button>
              ))}
            </div>

            {/* STEP CONTENT DISPLAY */}
            <div className="bg-white border border-slate-200 p-4 sm:p-6 2xl:p-8 rounded-3xl shadow-sm min-h-[260px] flex flex-col justify-between">
              
              {/* STEP 1: READING */}
              {activeStepTab === 0 && (
                <div className="space-y-4 my-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl">📖</span>
                    <h4 className="text-base sm:text-lg 2xl:text-xl font-black text-blue-700 uppercase">
                      1ο ΒΗΜΑ: ΔΙΑΒΑΖΩ ΚΑΙ ΚΑΤΑΝΟΩ
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm 2xl:text-base text-slate-600 leading-relaxed">
                    Διαβάζουμε το πρόβλημα αργά και προσεκτικά. Αναρωτιόμαστε: <em>«Ποια είναι η βασική ιστορία; Τι γνωρίζουμε και τι ψάχνουμε;»</em>
                  </p>
                  <div className="p-3.5 sm:p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 text-xs sm:text-sm 2xl:text-base font-medium">
                    💡 <strong>Συμβουλή:</strong> Προσπάθησε να διηγηθείς την ιστορία του προβλήματος με δικά σου λόγια πριν πιάσεις το μολύβι!
                  </div>
                </div>
              )}

              {/* STEP 2: GIVEN DATA */}
              {activeStepTab === 1 && (
                <div className="space-y-4 my-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl">📋</span>
                    <h4 className="text-base sm:text-lg 2xl:text-xl font-black text-emerald-700 uppercase">
                      2ο ΒΗΜΑ: ΚΑΤΑΓΡΑΦΩ ΤΑ ΔΕΔΟΜΕΝΑ
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm 2xl:text-base text-slate-600">
                    Ξεχωρίζουμε τις γνωστές πληροφορίες και τους αριθμούς που περιέχει το πρόβλημα:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentProblem.given.map((g, idx) => (
                      <div key={idx} className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl font-mono text-xs sm:text-sm 2xl:text-base font-bold text-emerald-900 shadow-sm flex items-center gap-2">
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
                    <span className="text-2xl sm:text-3xl">🎯</span>
                    <h4 className="text-base sm:text-lg 2xl:text-xl font-black text-amber-700 uppercase">
                      3ο ΒΗΜΑ: ΕΝΤΟΠΙΖΩ ΤΑ ΖΗΤΟΥΜΕΝΑ
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm 2xl:text-base text-slate-600">
                    Εστιάζουμε στην ερώτηση του προβλήματος για να ξέρουμε ακριβώς τι πρέπει να υπολογίσουμε:
                  </p>
                  <div className="space-y-2">
                    {currentProblem.target.map((t, idx) => (
                      <div key={idx} className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl font-mono text-xs sm:text-sm 2xl:text-base font-bold text-amber-900 shadow-sm flex items-center gap-2">
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
                    <span className="text-2xl sm:text-3xl">⚙️</span>
                    <h4 className="text-base sm:text-lg 2xl:text-xl font-black text-purple-700 uppercase">
                      4ο ΒΗΜΑ: ΣΧΕΔΙΟ, ΠΡΑΞΕΙΣ ΚΑΙ ΤΕΛΙΚΗ ΑΠΑΝΤΗΣΗ
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {currentProblem.steps.map((s, idx) => (
                      <div key={idx} className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5">
                          <span className="text-xs 2xl:text-sm font-black uppercase text-purple-700">
                            ΒΗΜΑ {idx + 1}: {s.action}
                          </span>
                          <span className="font-mono text-xs sm:text-sm md:text-base font-black text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-300 self-start sm:self-auto">
                            {s.calc}
                          </span>
                        </div>
                        <p className="text-xs 2xl:text-sm text-slate-500">{s.explain}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <span className="text-xs md:text-sm 2xl:text-base uppercase tracking-wider font-bold">🏁 ΤΕΛΙΚΗ ΑΠΑΝΤΗΣΗ:</span>
                    <span className="text-xs sm:text-sm md:text-base 2xl:text-lg font-black">{currentProblem.finalAnswer}</span>
                  </div>
                </div>
              )}

              {/* STEP NAVIGATION BUTTONS */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4 gap-2">
                <button
                  type="button"
                  disabled={activeStepTab === 0}
                  onClick={() => setActiveStepTab(prev => Math.max(0, prev - 1))}
                  className="px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs md:text-sm 2xl:text-base font-bold transition disabled:opacity-40 touch-manipulation active:scale-95"
                >
                  ⬅️ Πίσω
                </button>

                <span className="text-xs 2xl:text-sm font-bold text-slate-400">
                  Βήμα {activeStepTab + 1} από 4
                </span>

                <button
                  type="button"
                  disabled={activeStepTab === 3}
                  onClick={() => setActiveStepTab(prev => Math.min(3, prev + 1))}
                  className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs md:text-sm 2xl:text-base font-bold transition disabled:opacity-40 touch-manipulation active:scale-95"
                >
                  Επόμενο ➔
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στην Επίλυση Προβλημάτων!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες πώς να οργανώνεις τα δεδομένα και τα ζητούμενα; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να τελειοποιήσεις τη μέθοδό σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/11-problimata-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
