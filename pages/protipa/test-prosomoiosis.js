import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Α')
function toCleanUppercase(str) {
  if (!str) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

const I18N = {
  el: {
    metaTitle: 'Ενδεικτικά Θέματα Προτύπων 2026 – Τεστ Προσομοίωσης | LearnMaths.gr',
    metaDesc: 'Δωρεάν ενδεικτικά θέματα προτύπων 2026 και διαδραστικά τεστ προσομοίωσης Μαθηματικών για τα Πρότυπα Γυμνάσια με χρονόμετρο 60 λεπτών και λύσεις.',
    backText: 'Πρότυπα 2026',
    heroBadge: '⏱️ ΕΝΔΕΙΚΤΙΚΑ ΘΕΜΑΤΑ ΠΡΟΤΥΠΩΝ 2026 • ΠΡΟΣΟΜΟΙΩΣΗ',
    heroTitle: 'Ενδεικτικά Θέματα Προτύπων 2026 – Τεστ Προσομοίωσης',
    heroSubtitle: 'Δοκίμασε τις δυνάμεις σου σε ενδεικτικά θέματα προτύπων 2026 σε συνθήκες πραγματικών εξετάσεων! Κάθε τεστ περιλαμβάνει 25 θέματα πολλαπλής επιλογής στα Μαθηματικά και βαθμολογείται αυτόματα στην κλίμακα 0–50.',
    rulesHeading: '📋 Οδηγίες Εξέτασης & Δομή Ενδεικτικών Θεμάτων',
    rule1Title: 'Διάρκεια: 60 Λεπτά',
    rule1Desc: "Στις επίσημες εξετάσεις ο χρόνος είναι 150' για Γλώσσα και Μαθηματικά μαζί. Εδώ εξετάζονται αποκλειστικά τα Μαθηματικά σε 60' online χρόνο.",
    rule2Title: '25 Θέματα (2 Μόρια/θέμα)',
    rule2Desc: 'Κάθε σωστή απάντηση βαθμολογείται με 2 μόρια. Η τελική βαθμολογία υπολογίζεται αυτόματα από το 0 έως το 50 χωρίς αρνητική βαθμολόγηση.',
    rule3Title: 'Αναλυτικές Λύσεις',
    rule3Desc: 'Μετά την ολοκλήρωση του τεστ εμφανίζονται αναλυτικά όλες οι σωστές και λανθασμένες επιλογές με πλήρη μαθηματική επεξήγηση.',
    timerSwitchTitle: "⏱️ Αντίστροφη Μέτρηση Χρόνου (60')",
    timerSwitchDesc: 'Αν είναι ενεργό, με τη λήξη των 60 λεπτών το τεστ κλειδώνει και υποβάλλεται αυτόματα. Αν απενεργοποιηθεί, ο μαθητής λύνει το τεστ χωρίς άγχος χρόνου.',
    timerActiveLabel: "Ενεργό (60')",
    timerInactiveLabel: 'Ανενεργό',
    questionsMeta: (count) => `📊 ${count} Ερωτήσεις`,
    maxScoreMeta: (max) => `🏆 Άριστα: ${max} μόρια`,
    durationMeta: '⏳ 60 λεπτά',
    startTestBtn: (title) => `✍️ Έναρξη ${title}`,
    comingSoonBtn: '🔒 Σύντομα Διαθέσιμο',
    schemaHome: 'Αρχική',
    schemaHub: 'Ενδεικτικά Θέματα Προτύπων 2026',
    schemaCurrent: 'Τεστ Προσομοίωσης Προτύπων 2026',
    schemaCollectionName: 'Ενδεικτικά Θέματα Προτύπων 2026 – Τεστ Προσομοίωσης Μαθηματικών',
    schemaCollectionDesc: 'Δωρεάν ενδεικτικά θέματα προτύπων 2026 και διαδραστικά τεστ προσομοίωσης Μαθηματικών για Πρότυπα Γυμνάσια με χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση (0–50) και αναλυτικές λύσεις.',
    tests: [
      {
        id: 1,
        title: '1ο ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ (ΕΝΔΕΙΚΤΙΚΑ ΘΕΜΑΤΑ 2026)',
        slug: '01-proto-test',
        badge: 'Διαθέσιμο',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        desc: 'Πλήρες σετ ενδεικτικών θεμάτων προτύπων 2026 με 25 θέματα διαβαθμισμένης δυσκολίας (αριθμητική, γεωμετρία, κλάσματα, ποσοστά, εξισώσεις και προβλήματα λογικής).',
        questionsCount: 25,
        maxScore: 50,
        available: true
      },
      {
        id: 2,
        title: '2ο ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ (ΕΝΔΕΙΚΤΙΚΤΙΚΑ ΘΕΜΑΤΑ 2026)',
        slug: '02-deytero-test',
        badge: 'Διαθέσιμο',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        desc: 'Δεύτερο τεστ προσομοίωσης με ενδεικτικά θέματα προτύπων, έμφαση στα ποσοστά, τα ανάλογα ποσά, τα συστήματα προβλημάτων και τη συνδυαστική σκέψη.',
        questionsCount: 25,
        maxScore: 50,
        available: true
      },
      {
        id: 3,
        title: '3ο ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ',
        slug: '03-trito-test',
        badge: 'Σύντομα',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        desc: 'Προχωρημένο τεστ εξάσκησης με απαιτητικά θέματα άλγεβρας και γεωμετρικών υπολογισμών.',
        questionsCount: 25,
        maxScore: 50,
        available: false
      },
      {
        id: 4,
        title: '4ο ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ',
        slug: '04-tetarto-test',
        badge: 'Σύντομα',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        desc: 'Τελική προσομοίωση συνθηκών εξέτασης για πλήρη έλεγχο ετοιμότητας.',
        questionsCount: 25,
        maxScore: 50,
        available: false
      }
    ]
  },
  en: {
    metaTitle: 'Model School 2026 Mock Tests – Practice Exams | LearnMaths.gr',
    metaDesc: 'Free 2026 Model School practice problems and interactive Mathematics mock tests for Model Middle Schools with a 60-minute timer and detailed solutions.',
    backText: 'Model Schools 2026',
    heroBadge: '⏱️ MODEL SCHOOLS 2026 PRACTICE • MOCK TESTS',
    heroTitle: 'Model Schools 2026 Practice – Mock Tests',
    heroSubtitle: 'Test your skills with 2026 Model School practice problems under realistic exam conditions! Each test includes 25 multiple-choice Mathematics questions and is graded automatically on a 0–50 scale.',
    rulesHeading: '📋 Exam Instructions & Practice Test Structure',
    rule1Title: 'Duration: 60 Minutes',
    rule1Desc: "On the official exam day, total time is 150' for Greek and Mathematics combined. Here, Mathematics is practiced on its own in 60' of online time.",
    rule2Title: '25 Questions (2 Points Each)',
    rule2Desc: 'Each correct answer earns 2 points. The final score is calculated automatically from 0 to 50 with no negative marking.',
    rule3Title: 'Detailed Solutions',
    rule3Desc: 'After completing the test, all correct and incorrect choices are displayed with a full mathematical explanation.',
    timerSwitchTitle: "⏱️ Countdown Timer (60')",
    timerSwitchDesc: 'When enabled, the test locks and submits automatically when the 60 minutes run out. When disabled, students can solve at their own pace without time pressure.',
    timerActiveLabel: "Active (60')",
    timerInactiveLabel: 'Disabled',
    questionsMeta: (count) => `📊 ${count} Questions`,
    maxScoreMeta: (max) => `🏆 Max: ${max} points`,
    durationMeta: '⏳ 60 minutes',
    startTestBtn: (title) => `✍️ Start ${title}`,
    comingSoonBtn: '🔒 Coming Soon',
    schemaHome: 'Home',
    schemaHub: 'Model School Entrance 2026 Prep',
    schemaCurrent: 'Model Schools 2026 Mock Tests',
    schemaCollectionName: 'Model Schools 2026 Practice – Mathematics Mock Tests',
    schemaCollectionDesc: 'Free 2026 Model School practice problems and interactive Mathematics mock tests for Model Middle Schools with a 60-minute timer, automatic grading (0–50), and detailed solutions.',
    tests: [
      {
        id: 1,
        title: 'MOCK TEST 1 (2026 PRACTICE SET)',
        slug: '01-proto-test',
        badge: 'Available',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        desc: 'Complete set of 2026 Model School practice questions featuring 25 problems of graded difficulty (arithmetic, geometry, fractions, percentages, equations, and logic).',
        questionsCount: 25,
        maxScore: 50,
        available: true
      },
      {
        id: 2,
        title: 'MOCK TEST 2 (2026 PRACTICE SET)',
        slug: '02-deytero-test',
        badge: 'Available',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        desc: 'Second mock test with Model School practice problems, emphasizing percentages, proportional quantities, word systems, and combinatorics.',
        questionsCount: 25,
        maxScore: 50,
        available: true
      },
      {
        id: 3,
        title: 'MOCK TEST 3',
        slug: '03-trito-test',
        badge: 'Coming Soon',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        desc: 'Advanced practice test featuring challenging algebra and geometric calculations.',
        questionsCount: 25,
        maxScore: 50,
        available: false
      },
      {
        id: 4,
        title: 'MOCK TEST 4',
        slug: '04-tetarto-test',
        badge: 'Coming Soon',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        desc: 'Final exam-condition simulation for a complete readiness check.',
        questionsCount: 25,
        maxScore: 50,
        available: false
      }
    ]
  }
};

export default function TestProsomoiosisIndexPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = I18N[locale];
  const baseUrl = isEn ? 'https://learnmaths.gr/en' : 'https://learnmaths.gr';

  // Επιλογή μαθητή για λειτουργία χρονομέτρου (προεπιλογή: ενεργό)
  const [useTimer, setUseTimer] = useState(true);

  const pageSchema = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.schemaHome, "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": t.schemaHub, "item": `${baseUrl}/protipa/protipa` },
        { "@type": "ListItem", "position": 3, "name": t.schemaCurrent, "item": `${baseUrl}/protipa/test-prosomoiosis` }
      ]
    },
    {
      "@type": "CollectionPage",
      "@id": `${baseUrl}/protipa/test-prosomoiosis#collection`,
      "url": `${baseUrl}/protipa/test-prosomoiosis`,
      "name": t.schemaCollectionName,
      "description": t.schemaCollectionDesc,
      "inLanguage": locale,
      "provider": {
        "@id": "https://learnmaths.gr/#organization"
      },
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": t.tests.filter((item) => item.available).map((test, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": test.title,
          "url": `${baseUrl}/protipa/${test.slug}`
        }))
      }
    }
  ];

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      schemaData={pageSchema}
      backUrl="/protipa/protipa"
      backText={t.backText}
      showAds={true}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-6 sm:py-8 md:py-10 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border space-y-8 md:space-y-10">

        {/* HERO BANNER */}
        <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-black tracking-wider text-purple-100 border border-white/20">
              <span>{toCleanUppercase(t.heroBadge)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-purple-100 leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>
        </header>

        {/* ΟΔΗΓΙΕΣ & ΡΥΘΜΙΣΗ ΧΡΟΝΟΜΕΤΡΟΥ */}
        <section className="bg-white border-2 border-indigo-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{t.rulesHeading}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-700">
            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl space-y-1 min-w-0">
              <span className="text-2xl block" aria-hidden="true">⏳</span>
              <span className="text-xs font-black text-indigo-950 block">{t.rule1Title}</span>
              <p className="text-[11px] text-slate-600 leading-relaxed break-words">
                {t.rule1Desc}
              </p>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl space-y-1 min-w-0">
              <span className="text-2xl block" aria-hidden="true">🎯</span>
              <span className="text-xs font-black text-indigo-950 block">{t.rule2Title}</span>
              <p className="text-[11px] text-slate-600 leading-relaxed break-words">
                {t.rule2Desc}
              </p>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl space-y-1 min-w-0">
              <span className="text-2xl block" aria-hidden="true">💡</span>
              <span className="text-xs font-black text-indigo-950 block">{t.rule3Title}</span>
              <p className="text-[11px] text-slate-600 leading-relaxed break-words">
                {t.rule3Desc}
              </p>
            </div>
          </div>

          {/* TOGGLE ΧΡΟΝΟΜΕΤΡΟΥ */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <div className="space-y-1 min-w-0">
              <span className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                <span>{t.timerSwitchTitle}</span>
              </span>
              <p className="text-[11px] text-slate-500 max-w-xl leading-relaxed break-words">
                {t.timerSwitchDesc}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              <span className={`text-xs font-black font-mono ${useTimer ? 'text-emerald-600' : 'text-slate-400'}`}>
                {useTimer ? t.timerActiveLabel : t.timerInactiveLabel}
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={useTimer}
                onClick={() => setUseTimer(prev => !prev)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-pointer ${
                  useTimer ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                    useTimer ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* GRID ΜΕ ΤΑ ΤΕΣΤ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {t.tests.map((test) => {
            // Καθαρό URL χωρίς ?timer=1 από προεπιλογή για καθαρό SEO crawling
            const testHref = useTimer
              ? `/protipa/${test.slug}`
              : `/protipa/${test.slug}?timer=0`;

            return (
              <article
                key={test.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border-2 shadow-sm flex flex-col justify-between space-y-5 transition-all min-w-0 ${
                  test.available
                    ? 'border-slate-200 hover:border-indigo-400 hover:shadow-md'
                    : 'border-slate-100 opacity-65'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 font-mono break-words min-w-0">
                      {test.title}
                    </h2>
                    <span className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border shrink-0 ${test.badgeColor}`}>
                      {toCleanUppercase(test.badge)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                    {test.desc}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-500 font-mono pt-1">
                    <span>{t.questionsMeta(test.questionsCount)}</span>
                    <span>{t.maxScoreMeta(test.maxScore)}</span>
                    <span>{t.durationMeta}</span>
                  </div>
                </div>

                {test.available ? (
                  <Link
                    href={testHref}
                    locale={locale}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95 text-center"
                  >
                    <span>{t.startTestBtn(test.title)}</span>
                    <span aria-hidden="true">➔</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full bg-slate-100 text-slate-400 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm cursor-not-allowed text-center"
                  >
                    {t.comingSoonBtn}
                  </button>
                )}
              </article>
            );
          })}
        </section>

      </div>
    </Layout>
  );
}