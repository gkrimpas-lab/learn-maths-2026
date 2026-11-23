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
    metaTitle: '📝 Πραγματικά Θέματα Εξετάσεων Προτύπων (2020–2026) - LearnMaths.gr',
    metaDesc: 'Εξασκήσου online στα επίσημα θέματα Μαθηματικών των εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια για τις χρονιές 2020 έως 2026 με αυτόματη βαθμολόγηση και λύσεις.',
    backText: 'Πρότυπα',
    heroBadge: '📝 ΕΞΕΤΑΣΕΙΣ ΠΡΟΤΥΠΩΝ • 2020 - 2026',
    heroTitle: 'Πραγματικά Θέματα ανά Έτος',
    heroSubtitle: 'Επίλεξε τη χρονιά που επιθυμείς και λύσε τα πραγματικά θέματα των εξετάσεων. Στο τέλος θα λάβεις αναλυτική βαθμολογία και επεξηγήσεις για κάθε ερώτηση.',
    questionsLabel: (count) => `📊 ${count} Ερωτήσεις Πολλαπλής Επιλογής`,
    startExamBtn: (year) => `✍️ Έναρξη Εξέτασης ${year}`,
    schemaHome: 'Αρχική',
    schemaHub: 'Θέματα Προτύπων 2026',
    schemaCurrent: 'Πραγματικά Θέματα Εξετάσεων (2020–2026)',
    schemaCollectionName: 'Πραγματικά Θέματα Εξετάσεων Προτύπων Γυμνασίων (2020–2026)',
    schemaCollectionDesc: 'Συλλογή με τα επίσημα θέματα Μαθηματικών των εισαγωγικών εξετάσεων στα Πρότυπα Γυμνάσια από το 2020 έως το 2026 με online επίλυση και αναλυτικές λύσεις.',
    examItemName: (year) => `Θέματα Προτύπων Γυμνασίων ${year}`,
    years: [
      {
        year: '2026',
        slug: '2026',
        badge: 'Πρόσφατο',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        desc: 'Επίσημα θέματα εξετάσεων 2026 με online επίλυση και άμεση αξιολόγηση.',
        questionsCount: 20,
        available: true
      },
      {
        year: '2025',
        slug: '2025',
        badge: 'Επίσημο',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        desc: 'Επίσημα θέματα εξετάσεων 2025 με online επίλυση και άμεση αξιολόγηση.',
        questionsCount: 20,
        available: true
      },
      {
        year: '2024',
        slug: '2024',
        badge: 'Επίσημο',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        desc: 'Επίσημα θέματα εξετάσεων 2024 με online επίλυση και άμεση αξιολόγηση.',
        questionsCount: 25,
        available: true
      },
      {
        year: '2023',
        slug: '2023',
        badge: 'Επίσημο',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        desc: 'Επίσημα θέματα εξετάσεων 2023 με online επίλυση και άμεση αξιολόγηση.',
        questionsCount: 25,
        available: true
      },
      {
        year: '2022',
        slug: '2022',
        badge: 'Επίσημο',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        desc: 'Επίσημα θέματα εξετάσεων 2022 με online επίλυση και άμεση αξιολόγηση.',
        questionsCount: 25,
        available: true
      },
      {
        year: '2021',
        slug: '2021',
        badge: 'Επίσημο',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        desc: 'Επίσημα θέματα εξετάσεων 2021 με online επίλυση και άμεση αξιολόγηση.',
        questionsCount: 25,
        available: true
      },
      {
        year: '2020',
        slug: '2020',
        badge: 'Επίσημο',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        desc: 'Επίσημα θέματα εξετάσεων 2020 με online επίλυση και άμεση αξιολόγηση.',
        questionsCount: 25,
        available: true
      }
    ]
  },
  en: {
    metaTitle: '📝 Model School Past Exam Papers (2020–2026) - LearnMaths.gr',
    metaDesc: 'Practice online with the official Mathematics entrance exam past papers for Model Middle Schools from 2020 to 2026, featuring auto-grading and full solutions.',
    backText: 'Model Schools',
    heroBadge: '📝 MODEL SCHOOL EXAMS • 2020 - 2026',
    heroTitle: 'Official Past Papers by Year',
    heroSubtitle: 'Select the year you want and solve the official entrance exam questions. At the end, you will receive a detailed score and step-by-step explanations for every question.',
    questionsLabel: (count) => `📊 ${count} Multiple-Choice Questions`,
    startExamBtn: (year) => `✍️ Start ${year} Exam`,
    schemaHome: 'Home',
    schemaHub: 'Model School 2026 Prep',
    schemaCurrent: 'Official Past Papers (2020–2026)',
    schemaCollectionName: 'Official Model Middle School Mathematics Past Papers (2020–2026)',
    schemaCollectionDesc: 'Collection of official Mathematics entrance examination past papers for Model Middle Schools from 2020 to 2026 with interactive tests and step-by-step solutions.',
    examItemName: (year) => `Model Middle Schools ${year} Math Exam`,
    years: [
      {
        year: '2026',
        slug: '2026',
        badge: 'Latest',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        desc: 'Official 2026 entrance exam questions with interactive solving and instant grading.',
        questionsCount: 20,
        available: true
      },
      {
        year: '2025',
        slug: '2025',
        badge: 'Official',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        desc: 'Official 2025 entrance exam questions with interactive solving and instant grading.',
        questionsCount: 20,
        available: true
      },
      {
        year: '2024',
        slug: '2024',
        badge: 'Official',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        desc: 'Official 2024 entrance exam questions with interactive solving and instant grading.',
        questionsCount: 25,
        available: true
      },
      {
        year: '2023',
        slug: '2023',
        badge: 'Official',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        desc: 'Official 2023 entrance exam questions with interactive solving and instant grading.',
        questionsCount: 25,
        available: true
      },
      {
        year: '2022',
        slug: '2022',
        badge: 'Official',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        desc: 'Official 2022 entrance exam questions with interactive solving and instant grading.',
        questionsCount: 25,
        available: true
      },
      {
        year: '2021',
        slug: '2021',
        badge: 'Official',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        desc: 'Official 2021 entrance exam questions with interactive solving and instant grading.',
        questionsCount: 25,
        available: true
      },
      {
        year: '2020',
        slug: '2020',
        badge: 'Official',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        desc: 'Official 2020 entrance exam questions with interactive solving and instant grading.',
        questionsCount: 25,
        available: true
      }
    ]
  }
};

export default function PragmatikaThemataIndexPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = I18N[locale];
  const baseUrl = isEn ? 'https://learnmaths.gr/en' : 'https://learnmaths.gr';

  const schemaData = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.schemaHome, "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": t.schemaHub, "item": `${baseUrl}/protipa/protipa` },
        { "@type": "ListItem", "position": 3, "name": t.schemaCurrent, "item": `${baseUrl}/protipa/pragmatika-themata` }
      ]
    },
    {
      "@type": "CollectionPage",
      "name": t.schemaCollectionName,
      "description": t.schemaCollectionDesc,
      "inLanguage": locale,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": t.years.map((item, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": t.examItemName(item.year),
          "url": `${baseUrl}/protipa/themata-${item.slug}`
        }))
      }
    }
  ];

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      schemaData={schemaData}
      backUrl="/protipa/protipa"
      backText={t.backText}
      showAds={true}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-6 sm:py-8 md:py-10 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border space-y-8 md:space-y-10">

        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-black tracking-wider text-blue-100 border border-white/20">
              <span>{toCleanUppercase(t.heroBadge)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-blue-100 leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>
        </div>

        {/* GRID ΜΕ ΤΙΣ ΧΡΟΝΙΕΣ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {t.years.map((item) => (
            <div
              key={item.year}
              className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 min-w-0"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-blue-700">
                    {item.year}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {toCleanUppercase(item.badge)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                  {item.desc}
                </p>
                <div className="text-[11px] font-bold text-slate-400 font-mono">
                  {t.questionsLabel(item.questionsCount)}
                </div>
              </div>

              <Link
                href={`/protipa/themata-${item.slug}`}
                locale={locale}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition text-center shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>{t.startExamBtn(item.year)}</span>
                <span>➔</span>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}