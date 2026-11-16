import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

const SIMULATION_TESTS = [
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
    title: '2ο ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ (ΕΝΔΕΙΚΤΙΚΑ ΘΕΜΑΤΑ 2026)',
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
];

export default function TestProsomoiosisIndexPage() {
  // Επιλογή μαθητή για λειτουργία χρονομέτρου (προεπιλογή: ενεργό)
  const [useTimer, setUseTimer] = useState(true);

  const pageSchema = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Αρχική", "item": "https://learnmaths.gr/" },
        { "@type": "ListItem", "position": 2, "name": "Ενδεικτικά Θέματα Προτύπων 2026", "item": "https://learnmaths.gr/protipa/protipa" },
        { "@type": "ListItem", "position": 3, "name": "Τεστ Προσομοίωσης Προτύπων 2026", "item": "https://learnmaths.gr/protipa/test-prosomoiosis" }
      ]
    },
    {
      "@type": "CollectionPage",
      "@id": "https://learnmaths.gr/protipa/test-prosomoiosis#collection",
      "url": "https://learnmaths.gr/protipa/test-prosomoiosis",
      "name": "Ενδεικτικά Θέματα Προτύπων 2026 – Τεστ Προσομοίωσης Μαθηματικών",
      "description": "Δωρεάν ενδεικτικά θέματα προτύπων 2026 και διαδραστικά τεστ προσομοίωσης Μαθηματικών για Πρότυπα Γυμνάσια με χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση (0-50) και αναλυτικές λύσεις.",
      "inLanguage": "el",
      "provider": {
        "@id": "https://learnmaths.gr/#organization"
      },
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": SIMULATION_TESTS.filter((t) => t.available).map((test, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": test.title,
          "url": `https://learnmaths.gr/protipa/${test.slug}`
        }))
      }
    }
  ];

  return (
    <Layout
      title="Ενδεικτικά Θέματα Προτύπων 2026 – Τεστ Προσομοίωσης | LearnMaths.gr"
      description="Δωρεάν ενδεικτικά θέματα προτύπων 2026 και διαδραστικά τεστ προσομοίωσης Μαθηματικών για τα Πρότυπα Γυμνάσια με χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση (0-50) και αναλυτικές λύσεις."
      schemaData={pageSchema}
      backUrl="/protipa/protipa"
      backText="Πρότυπα 2026"
      showAds={true}
    >
      <div className="py-6 sm:py-8 md:py-10 space-y-8 md:space-y-10">

        {/* HERO BANNER */}
        <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider text-purple-100 border border-white/20">
              <span>⏱️ Ενδεικτικά Θέματα Προτύπων 2026 • Προσομοίωση</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Ενδεικτικά Θέματα Προτύπων 2026 – Τεστ Προσομοίωσης
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-purple-100 leading-relaxed">
              Δοκίμασε τις δυνάμεις σου σε ενδεικτικά θέματα προτύπων 2026 σε συνθήκες πραγματικών εξετάσεων! Κάθε τεστ περιλαμβάνει 25 θέματα πολλαπλής επιλογής στα Μαθηματικά και βαθμολογείται αυτόματα στην κλίμακα 0-50.
            </p>
          </div>
        </header>

        {/* ΟΔΗΓΙΕΣ & ΡΥΘΜΙΣΗ ΧΡΟΝΟΜΕΤΡΟΥ */}
        <section className="bg-white border-2 border-indigo-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span aria-hidden="true">📋</span> Οδηγίες Εξέτασης & Δομή Ενδεικτικών Θεμάτων
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-700">
            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl space-y-1">
              <span className="text-2xl block" aria-hidden="true">⏳</span>
              <span className="text-xs font-black text-indigo-950 block">Διάρκεια: 60 Λεπτά</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Στις επίσημες εξετάσεις ο χρόνος είναι 150&apos; για Γλώσσα και Μαθηματικά μαζί. Εδώ εξετάζονται αποκλειστικά τα Μαθηματικά σε 60&apos; online χρόνο.
              </p>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl space-y-1">
              <span className="text-2xl block" aria-hidden="true">🎯</span>
              <span className="text-xs font-black text-indigo-950 block">25 Θέματα (2 Μόρια/θέμα)</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Κάθε σωστή απάντηση βαθμολογείται με 2 μόρια. Η τελική βαθμολογία υπολογίζεται αυτόματα από το 0 έως το 50 χωρίς αρνητική βαθμολόγηση.
              </p>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl space-y-1">
              <span className="text-2xl block" aria-hidden="true">💡</span>
              <span className="text-xs font-black text-indigo-950 block">Αναλυτικές Λύσεις</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Μετά την ολοκλήρωση του τεστ εμφανίζονται αναλυτικά όλες οι σωστές και λανθασμένες επιλογές με πλήρη μαθηματική επεξήγηση.
              </p>
            </div>
          </div>

          {/* TOGGLE ΧΡΟΝΟΜΕΤΡΟΥ */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                <span aria-hidden="true">⏱️</span> Αντίστροφη Μέτρηση Χρόνου (60&apos;)
              </span>
              <p className="text-[11px] text-slate-500 max-w-xl leading-relaxed">
                Αν είναι ενεργό, με τη λήξη των 60 λεπτών το τεστ κλειδώνει και υποβάλλεται αυτόματα. Αν απενεργοποιηθεί, ο μαθητής λύνει το τεστ χωρίς άγχος χρόνου.
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              <span className={`text-xs font-black font-mono ${useTimer ? 'text-emerald-600' : 'text-slate-400'}`}>
                {useTimer ? "Ενεργό (60')" : 'Ανενεργό'}
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={useTimer}
                onClick={() => setUseTimer(prev => !prev)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
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
          {SIMULATION_TESTS.map((test) => {
            // Καθαρό URL χωρίς ?timer=1 από προεπιλογή για καθαρό SEO crawling
            const testHref = useTimer
              ? `/protipa/${test.slug}`
              : `/protipa/${test.slug}?timer=0`;

            return (
              <article
                key={test.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border-2 shadow-sm flex flex-col justify-between space-y-5 transition-all ${
                  test.available
                    ? 'border-slate-200 hover:border-indigo-400 hover:shadow-md'
                    : 'border-slate-100 opacity-65'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 font-mono">
                      {test.title}
                    </h2>
                    <span className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border shrink-0 ${test.badgeColor}`}>
                      {test.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {test.desc}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 font-mono pt-1">
                    <span>📊 {test.questionsCount} Ερωτήσεις</span>
                    <span>🏆 Άριστα: {test.maxScore} μόρια</span>
                    <span>⏳ 60 λεπτά</span>
                  </div>
                </div>

                {test.available ? (
                  <Link
                    href={testHref}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95 text-center"
                  >
                    <span>✍️ Έναρξη {test.title}</span>
                    <span aria-hidden="true">➔</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full bg-slate-100 text-slate-400 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm cursor-not-allowed text-center"
                  >
                    🔒 Σύντομα Διαθέσιμο
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
