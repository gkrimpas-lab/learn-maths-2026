import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const TRANSLATIONS = {
  el: {
    pageTitle: "Στρατηγική και Βήματα Επίλυσης Προβλημάτων - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθε τη μέθοδο των 4 βημάτων (Ανάγνωση, Δεδομένα, Ζητούμενα, Σχέδιο και Λύση) για να λύνεις με επιτυχία κάθε μαθηματικό πρόβλημα της ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    exercisesBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 11 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Στρατηγική & Βήματα Επίλυσης Προβλημάτων",
    heroDesc: "Μάθε τη μέθοδο των 4 χρυσών βημάτων για να λύνεις με σιγουριά κάθε μαθηματικό πρόβλημα: Ανάγνωση ➔ Δεδομένα ➔ Ζητούμενα ➔ Σχέδιο και Λύση!",
    heroPills: "Μέθοδος 4 Βημάτων & Διαδραστική Ανάλυση Σεναρίων",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Τα 4 Χρυσά Βήματα για τη Λύση Κάθε Προβλήματος",
    theorySubtitle: "Μια συστηματική στρατηγική που οργανώνει τη σκέψη και αποτρέπει τα λάθη απροσεξίας.",
    guideSteps: [
      {
        num: 1,
        title: "1. Προσεκτική Ανάγνωση",
        icon: "📖",
        color: "bg-blue-600",
        lightColor: "bg-blue-50/80",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        desc: "Διαβάζουμε το πρόβλημα 2-3 φορές μέχρι να καταλάβουμε την ιστορία και τι ακριβώς συμβαίνει."
      },
      {
        num: 2,
        title: "2. Εντοπισμός Δεδομένων",
        icon: "📋",
        color: "bg-emerald-600",
        lightColor: "bg-emerald-50/80",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        desc: "Υπογραμμίζουμε και καταγράφουμε όλες τις γνωστές πληροφορίες και τους αριθμούς που μας δίνονται."
      },
      {
        num: 3,
        title: "3. Εντοπισμός Ζητουμένων",
        icon: "🎯",
        color: "bg-amber-500",
        lightColor: "bg-amber-50/80",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        desc: "Ξεκαθαρίζουμε τι ακριβώς μας ζητάει να βρούμε η ερώτηση του προβλήματος."
      },
      {
        num: 4,
        title: "4. Σχέδιο, Πράξεις & Έλεγχος",
        icon: "⚙️",
        color: "bg-purple-600",
        lightColor: "bg-purple-50/80",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
        desc: "Οργανώνουμε τα βήματα με τη σωστή σειρά πράξεων, γράφουμε την απάντηση και ελέγχουμε αν είναι λογική."
      }
    ],
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Καθοδηγούμενης Επίλυσης",
    labDesc: "Επίλεξε ένα πρόβλημα και ακολούθησε τα βήματα για να δεις πώς αναλύεται και οργανώνεται η λύση του!",
    statementBadge: "ΕΚΦΩΝΗΣΗ ΠΡΟΒΛΗΜΑΤΟΣ",
    exampleProgress: (curr, total) => `Παράδειγμα ${curr} από ${total}`,
    stepBtnLabel: (num) => `Βήμα ${num}`,
    step1Title: "1ο ΒΗΜΑ: ΔΙΑΒΑΖΩ ΚΑΙ ΚΑΤΑΝΟΩ",
    step1Desc: "Διαβάζουμε το πρόβλημα αργά και προσεκτικά. Αναρωτιόμαστε: «Ποια είναι η βασική ιστορία; Τι γνωρίζουμε και τι ψάχνουμε;»",
    step1Tip: "💡 Συμβουλή: Προσπάθησε να διηγηθείς την ιστορία του προβλήματος με δικά σου λόγια πριν πιάσεις το μολύβι!",
    step2Title: "2ο ΒΗΜΑ: ΚΑΤΑΓΡΑΦΩ ΤΑ ΔΕΔΟΜΕΝΑ",
    step2Desc: "Ξεχωρίζουμε τις γνωστές πληροφορίες και τους αριθμούς που περιέχει το πρόβλημα:",
    step3Title: "3ο ΒΗΜΑ: ΕΝΤΟΠΙΖΩ ΤΑ ΖΗΤΟΥΜΕΝΑ",
    step3Desc: "Εστιάζουμε στην ερώτηση του προβλήματος για να ξέρουμε ακριβώς τι πρέπει να υπολογίσουμε:",
    step4Title: "4ο ΒΗΜΑ: ΣΧΕΔΙΟ, ΠΡΑΞΕΙΣ ΚΑΙ ΤΕΛΙΚΗ ΑΠΑΝΤΗΣΗ",
    stepActionPrefix: (idx) => `ΒΗΜΑ ${idx}:`,
    finalAnswerBadge: "🏁 ΤΕΛΙΚΗ ΑΠΑΝΤΗΣΗ:",
    btnPrev: "⬅️ Πίσω",
    btnNext: "Επόμενο ➔",
    stepProgress: (curr, total) => `Βήμα ${curr} από ${total}`,
    ctaTitle: "Ώρα για Εξάσκηση στην Επίλυση Προβλημάτων!",
    ctaDesc: "Έμαθες πώς να οργανώνεις τα δεδομένα και τα ζητούμενα; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να τελειοποιήσεις τη μέθοδό σου!",
    ctaBtn: "🎯 Έναρξη Ασκήσεων",
    problems: [
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
    ]
  },
  en: {
    pageTitle: "Problem-Solving Strategies & Steps - Grade 6 | LearnMaths.gr",
    pageDescription: "Learn the systematic 4-step method (Reading, Given Data, Unknown Targets, Plan & Solution) to solve every Grade 6 math word problem with confidence.",
    backText: "Grade 6",
    exercisesBtn: "🎯 Exercises",
    badgeChapter: "CHAPTER 11 • GRADE 6",
    heroTitle: "Problem-Solving Strategies & Steps",
    heroDesc: "Master the proven 4-step strategy to approach any word problem systematically: Read & Understand ➔ Identify Given Data ➔ Pinpoint Targets ➔ Plan, Solve & Check!",
    heroPills: "4-Step Framework & Interactive Scenario Walkthroughs",
    heroCta: "Try the Exercises",
    theoryTitle: "The 4 Golden Steps to Solve Any Word Problem",
    theorySubtitle: "A systematic approach that organizes mathematical thinking and prevents careless errors.",
    guideSteps: [
      {
        num: 1,
        title: "1. Careful Reading",
        icon: "📖",
        color: "bg-blue-600",
        lightColor: "bg-blue-50/80",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        desc: "Read the problem 2-3 times until you clearly understand the narrative and the sequence of events."
      },
      {
        num: 2,
        title: "2. Identify Given Data",
        icon: "📋",
        color: "bg-emerald-600",
        lightColor: "bg-emerald-50/80",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        desc: "Highlight and write down all provided facts, numbers, and units given in the text."
      },
      {
        num: 3,
        title: "3. Identify Targets",
        icon: "🎯",
        color: "bg-amber-500",
        lightColor: "bg-amber-50/80",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        desc: "Clarify precisely what question or numerical quantity the problem asks you to calculate."
      },
      {
        num: 4,
        title: "4. Plan, Solve & Check",
        icon: "⚙️",
        color: "bg-purple-600",
        lightColor: "bg-purple-50/80",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
        desc: "Organize calculations in proper order, state the final answer clearly, and verify if the result is reasonable."
      }
    ],
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Guided Problem Solver",
    labDesc: "Select a sample problem and step through each phase to examine how data is organized into a complete solution!",
    statementBadge: "PROBLEM STATEMENT",
    exampleProgress: (curr, total) => `Example ${curr} of ${total}`,
    stepBtnLabel: (num) => `Step ${num}`,
    step1Title: "STEP 1: READ AND UNDERSTAND",
    step1Desc: "Read slowly and carefully. Ask yourself: 'What is the narrative? What do we know, and what are we searching for?'",
    step1Tip: "💡 Tip: Try explaining the problem in your own words before picking up a pencil!",
    step2Title: "STEP 2: RECORD GIVEN DATA",
    step2Desc: "Separate the known information and quantities provided in the narrative:",
    step3Title: "STEP 3: IDENTIFY TARGET GOALS",
    step3Desc: "Focus on the specific question asked to clarify what calculation is needed:",
    step4Title: "STEP 4: PLAN, OPERATIONS AND FINAL ANSWER",
    stepActionPrefix: (idx) => `STEP ${idx}:`,
    finalAnswerBadge: "🏁 FINAL ANSWER:",
    btnPrev: "⬅️ Back",
    btnNext: "Next ➔",
    stepProgress: (curr, total) => `Step ${curr} of ${total}`,
    ctaTitle: "Time to Practice Problem Solving!",
    ctaDesc: "Understood how to identify given data and unknown targets? Challenge yourself with 10 interactive questions!",
    ctaBtn: "🎯 Start Exercises",
    problems: [
      {
        id: 'school-trip',
        title: '🚌 School Field Trip',
        text: 'A school with 120 students organizes a field trip. Each bus seats 40 students and each ticket costs 8 € per student. How many buses are needed and what is the total ticket cost?',
        given: [
          'Total students: 120',
          'Bus capacity: 40 students',
          'Ticket price per student: 8 €'
        ],
        target: [
          'Target 1: Number of buses required',
          'Target 2: Total cost of tickets (€)'
        ],
        steps: [
          {
            action: 'Calculate number of buses (Division)',
            calc: '120 : 40 ＝ 3 buses',
            explain: 'Divide the total student count by each bus capacity.'
          },
          {
            action: 'Calculate total cost (Multiplication)',
            calc: '120 · 8 ＝ 960 €',
            explain: 'Multiply total students by the price of one ticket.'
          }
        ],
        finalAnswer: '3 buses are needed and the total ticket cost is 960 €.'
      },
      {
        id: 'market-shopping',
        title: '🛒 Supermarket Shopping',
        text: 'Helen had 50 €. She bought 3 kg of apples at 2 € per kg and 2 packs of cheese at 6 € per pack. How much change did she receive?',
        given: [
          'Initial money: 50 €',
          'Apples: 3 kg · 2 €/kg',
          'Cheese: 2 packs · 6 €/pack'
        ],
        target: [
          'Target: Change received (€)'
        ],
        steps: [
          {
            action: 'Cost of apples',
            calc: '3 · 2 ＝ 6 €',
            explain: 'Determine total expenditure on apples.'
          },
          {
            action: 'Cost of cheese',
            calc: '2 · 6 ＝ 12 €',
            explain: 'Determine total expenditure on cheese.'
          },
          {
            action: 'Total expenses',
            calc: '6 ＋ 12 ＝ 18 €',
            explain: 'Add individual expense items together.'
          },
          {
            action: 'Calculate change (Subtraction)',
            calc: '50 － 18 ＝ 32 €',
            explain: 'Subtract total expenses from the initial banknote.'
          }
        ],
        finalAnswer: 'Helen received 32 € in change.'
      },
      {
        id: 'bookstore',
        title: '📚 Library & Books',
        text: 'A library has 4 shelves with 25 books on each shelf. It purchased 35 new books. If it divides all books equally across 5 new larger shelves, how many books will each new shelf hold?',
        given: [
          'Initial: 4 shelves · 25 books',
          'New books: 35',
          'New shelves: 5'
        ],
        target: [
          'Target: Number of books per new shelf'
        ],
        steps: [
          {
            action: 'Initial books count',
            calc: '4 · 25 ＝ 100 books',
            explain: 'Determine total initial collection of books.'
          },
          {
            action: 'Total books after new purchase',
            calc: '100 ＋ 35 ＝ 135 books',
            explain: 'Add newly purchased books to current total.'
          },
          {
            action: 'Equal distribution across 5 shelves',
            calc: '135 : 5 ＝ 27 books',
            explain: 'Divide total books equally across 5 new shelves.'
          }
        ],
        finalAnswer: 'Each new shelf will hold 27 books.'
      }
    ]
  }
};

export default function ProblimataPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [activeStepTab, setActiveStepTab] = useState(0); // 0: Read, 1: Given, 2: Target, 3: Plan & Solution

  const currentProblem = t.problems[selectedProblemIndex] || t.problems[0];

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/11-problimata-ask"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.exercisesBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badgeChapter}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.heroPills}</span>
            </div>
            <Link
              href="/st-dimotikou/11-problimata-ask"
              locale={locale}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (4 ΒΗΜΑΤΑ) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.theoryTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.theorySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            {t.guideSteps.map((step) => (
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
                <span>{t.labBadge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.labTitle}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.labDesc}
              </p>
            </div>

            {/* PROBLEM SELECTOR PRESETS */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {t.problems.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedProblemIndex(idx);
                    setActiveStepTab(0);
                  }}
                  className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black border transition-all touch-manipulation active:scale-95 cursor-pointer ${
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
                  {t.statementBadge}
                </span>
                <span className="text-xs 2xl:text-sm font-bold text-slate-400">
                  {t.exampleProgress(selectedProblemIndex + 1, t.problems.length)}
                </span>
              </div>
              <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-800 leading-relaxed">
                «{currentProblem.text}»
              </p>
            </div>

            {/* INTERACTIVE WORKFLOW STEP NAVIGATION */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              {t.guideSteps.map((step, idx) => (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStepTab(idx)}
                  className={`py-2.5 sm:py-3 px-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2 touch-manipulation active:scale-95 cursor-pointer ${
                    activeStepTab === idx
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="truncate">{t.stepBtnLabel(step.num)}</span>
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
                      {t.step1Title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm 2xl:text-base text-slate-600 leading-relaxed">
                    {t.step1Desc}
                  </p>
                  <div className="p-3.5 sm:p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 text-xs sm:text-sm 2xl:text-base font-medium">
                    {t.step1Tip}
                  </div>
                </div>
              )}

              {/* STEP 2: GIVEN DATA */}
              {activeStepTab === 1 && (
                <div className="space-y-4 my-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl">📋</span>
                    <h4 className="text-base sm:text-lg 2xl:text-xl font-black text-emerald-700 uppercase">
                      {t.step2Title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm 2xl:text-base text-slate-600">
                    {t.step2Desc}
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
                      {t.step3Title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm 2xl:text-base text-slate-600">
                    {t.step3Desc}
                  </p>
                  <div className="space-y-2">
                    {currentProblem.target.map((tgt, idx) => (
                      <div key={idx} className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl font-mono text-xs sm:text-sm 2xl:text-base font-bold text-amber-900 shadow-sm flex items-center gap-2">
                        <span className="text-amber-600">❓</span>
                        <span>{tgt}</span>
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
                      {t.step4Title}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {currentProblem.steps.map((s, idx) => (
                      <div key={idx} className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5">
                          <span className="text-xs 2xl:text-sm font-black uppercase text-purple-700">
                            {t.stepActionPrefix(idx + 1)} {s.action}
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
                    <span className="text-xs md:text-sm 2xl:text-base uppercase tracking-wider font-bold">{t.finalAnswerBadge}</span>
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
                  className="px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs md:text-sm 2xl:text-base font-bold transition disabled:opacity-40 touch-manipulation active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                >
                  {t.btnPrev}
                </button>

                <span className="text-xs 2xl:text-sm font-bold text-slate-400">
                  {t.stepProgress(activeStepTab + 1, 4)}
                </span>

                <button
                  type="button"
                  disabled={activeStepTab === 3}
                  onClick={() => setActiveStepTab(prev => Math.min(3, prev + 1))}
                  className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs md:text-sm 2xl:text-base font-bold transition disabled:opacity-40 touch-manipulation active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                >
                  {t.btnNext}
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/11-problimata-ask"
            locale={locale}
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>{t.ctaBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}