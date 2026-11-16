import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

const EXAM_YEARS = [
  { year: 2026, slug: 'themata-2026', highlight: true },
  { year: 2025, slug: 'themata-2025', highlight: false },
  { year: 2024, slug: 'themata-2024', highlight: false },
  { year: 2023, slug: 'themata-2023', highlight: false },
  { year: 2022, slug: 'themata-2022', highlight: false },
  { year: 2021, slug: 'themata-2021', highlight: false },
  { year: 2020, slug: 'themata-2020', highlight: false },
];

const I18N = {
  el: {
    pageTitle: "Ενδεικτικά Θέματα Προτύπων 2026 & Τεστ Προσομοίωσης - LearnMaths.gr",
    pageDesc: "Ενδεικτικά θέματα προτύπων 2026 στα Μαθηματικά, επίσημα θέματα εξετάσεων (2020–2026) με αναλυτικές λύσεις, διαδραστικά τεστ προσομοίωσης με χρονόμετρο και δωρεάν PDF.",
    backText: "Αρχική",
    heroBadge: "🎯 ΕΝΔΕΙΚΤΙΚΑ & ΕΠΙΣΗΜΑ ΘΕΜΑΤΑ ΠΡΟΤΥΠΩΝ 2026",
    heroTitle: "Ενδεικτικά Θέματα Προτύπων 2026 & Τεστ Προσομοίωσης",
    heroDesc: "Ολοκληρωμένη προετοιμασία για τις εισαγωγικές εξετάσεις στα Πρότυπα Γυμνάσια 2026. Εξασκήσου σε ενδεικτικά θέματα προτύπων 2026, λύσε online τα θέματα εξετάσεων (2020–2026) με χρονόμετρο και αυτόματη βαθμολόγηση, ή κατέβασε δωρεάν τα θέματα και τις αναλυτικές λύσεις σε PDF.",
    heroDirect2026Btn: "🔥 Λύσε Online τα Θέματα 2026 (Με Λύσεις)",

    // Section 1: Online Practice
    sec1Title: "Ενδεικτικά Θέματα Προτύπων 2026 & Online Προσομοίωση",
    sec1Subtitle: "Εξασκήσου σε ενδεικτικά θέματα προτύπων 2026 με αυτόματη βαθμολόγηση, χρονόμετρο και άμεσο έλεγχο απαντήσεων στα μαθηματικά.",

    // Card 1: Simulation
    card1Badge: "ΕΝΔΕΙΚΤΙΚΑ ΘΕΜΑΤΑ 2026 • ΧΡΟΝΟΜΕΤΡΟ",
    card1Title: "Τεστ Προσομοίωσης Προτύπων 2026",
    card1Desc: "Ολοκληρωμένα τεστ προσομοίωσης με ενδεικτικά θέματα προτύπων 2026 (20 ερωτήσεις πολλαπλής επιλογής), διαβαθμισμένη δυσκολία, χρονόμετρο 60 λεπτών και άμεση αξιολόγηση.",
    card1Btn: "🚀 Έναρξη Τεστ Προσομοίωσης 2026",

    // Card 2: Past Exams
    card2Badge: "ΕΠΙΣΗΜΑ ΘΕΜΑΤΑ 2020 – 2026 ΜΕ ΛΥΣΕΙΣ",
    card2Title: "Θέματα Εξετάσεων Προτύπων (Ανά Έτος)",
    card2Desc: "Λύσε διαδραστικά τα θέματα εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια ανά σχολικό έτος (2020 έως 2026), δες αναλυτικά σχήματα επίλυσης και υπολόγισε το σκορ σου.",
    card2Btn: "🔍 Όλα τα Έτη (2020–2026)",
    quickYearsLabel: "Άμεση πρόσβαση ανά έτος:",

    // Section 2: PDF Downloads
    sec2Title: "Επίσημα Θέματα Προτύπων σε PDF (Δωρεάν Λήψη)",
    sec2Subtitle: "Κατέβασε, εκτύπωσε και μελέτησε τα επίσημα θέματα προτύπων και τις αναλυτικές λύσεις σε μορφή PDF.",
    pdfDownloadBtn: "Λήψη PDF",
    pdf1Title: "Θέματα Προτύπων 2020 - 2026",
    pdf1Desc: "Συγκεντρωτικά όλα τα επίσημα θέματα εξετάσεων και οι απαντήσεις των τελευταίων ετών (συμπεριλαμβανομένου του 2026).",
    pdf2Title: "Μαθηματικά Προτύπων 2016 - 2019",
    pdf2Desc: "Παλαιότερα επίσημα θέματα εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια μαζί με τις λύσεις τους.",
    pdf3Title: "Αναλυτικές Λύσεις & Απαντήσεις",
    pdf3Desc: "Πλήρως επεξηγημένες μαθηματικές λύσεις για όλα τα θέματα εξετάσεων όλων των ετών.",

    // Section 3: Semantic Guide & FAQ
    guideTitle: "Οδηγός Προετοιμασίας & Ύλη για τα Πρότυπα Γυμνάσια 2026",
    guideDesc: "Η εισαγωγή στα Πρότυπα Γυμνάσια 2026 απαιτεί ουσιαστική κατανόηση των μαθηματικών εννοιών και ικανότητα επίλυσης σύνθετων προβλημάτων κριτικής σκέψης.",
    guideP1: "Η εξεταστέα ύλη στα Μαθηματικά βασίζεται στις θεμελιώδεις ενότητες του Δημοτικού, με ιδιαίτερη έμφαση στα",
    linkKlasmata: "κλάσματα και δεκαδικούς",
    guideP2: ", στα",
    linkPososta: "ποσοστά και ανάλογα ποσά",
    guideP3: ", καθώς και στις",
    linkEksisoseis: "εξισώσεις με έναν άγνωστο",
    guideP4: " και στη",
    linkGeometria: "γεωμετρία (εμβαδά και περιμέτρους)",
    guideP5: ". Συνιστάται η συστηματική επανάληψη στην ύλη της",
    linkStDimotikou: "ΣΤ' Δημοτικού",
    guideP6: " και της",
    linkEDimotikou: "Ε' Δημοτικού",
    guideP7: " πριν από την έναρξη των τεστ προσομοίωσης και των ενδεικτικών θεμάτων.",

    faqTitle: "Συχνές Ερωτήσεις για τις Εξετάσεις των Προτύπων 2026 (FAQ)",
    faqs: [
      {
        q: "Ποια είναι η μορφή και η βαθμολόγηση των θεμάτων στα Μαθηματικά των Προτύπων 2026;",
        a: "Στις εξετάσεις του 2025 και του 2026 τα θέματα περιλαμβάνουν 20 ερωτήσεις πολλαπλής επιλογής με μέγιστη βαθμολογία τα 50 μόρια: τα πρώτα 10 θέματα (Ομάδα Α) βαθμολογούνται με 2 μόρια το καθένα, ενώ τα επόμενα 10 θέματα (Ομάδα Β) βαθμολογούνται με 3 μόρια το καθένα, χωρίς αρνητική βαθμολόγηση."
      },
      {
        q: "Πώς βοηθούν τα ενδεικτικά θέματα προτύπων 2026 του LearnMaths.gr;",
        a: "Η πλατφόρμα προσφέρει διαδραστικά τεστ προσομοίωσης και όλα τα θέματα 2020–2026 με ακριβές χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση στην κλίμακα 0–50, οπτικά σχήματα SVG και αναλυτικές μαθηματικές επεξηγήσεις βήμα-βήμα."
      },
      {
        q: "Ποια κεφάλαια των Μαθηματικών εξετάζονται στα Πρότυπα Γυμνάσια;",
        a: "Εξετάζεται η ύλη της Ε' και ΣΤ' Δημοτικού: πράξεις με κλάσματα και δεκαδικούς, ποσοστά, ευθέως και αντιστρόφως ανάλογα ποσά, εξισώσεις, συνδυαστική λογική, εμβαδά και περίμετροι γεωμετρικών σχημάτων, καθώς και ερμηνεία διαγραμμάτων."
      },
      {
        q: "Πότε πρέπει να ξεκινήσει η προετοιμασία του μαθητή;",
        a: "Η εξοικείωση με προβλήματα συνδυαστικής σκέψης και τεστ πολλαπλής επιλογής αποδίδει καλύτερα όταν ξεκινά από το πρώτο τρίμηνο της ΣΤ' Δημοτικού, αφού εμπεδωθούν οι βασικές μαθηματικές πράξεις."
      }
    ]
  },
  en: {
    pageTitle: "Model Schools 2026 Sample Papers & Mock Tests - LearnMaths.gr",
    pageDesc: "Comprehensive preparation for Model School 2026 entrance exams. Official past papers (2020–2026) with solutions, timed online mock simulation tests, and free PDF downloads.",
    backText: "Home",
    heroBadge: "🎯 2026 SAMPLE & OFFICIAL EXAM PAPERS",
    heroTitle: "Model School 2026 Exam Papers & Simulation Tests",
    heroDesc: "Comprehensive preparation for standardized entrance examinations for selective Model Schools in 2026. Practice official 2020–2026 exam papers, complete timed mock simulation tests with instant scoring, or download all exam materials in PDF format.",
    heroDirect2026Btn: "🔥 Practice 2026 Exam Papers Online",

    // Section 1: Online Practice
    sec1Title: "2026 Sample Papers & Interactive Online Simulation",
    sec1Subtitle: "Select your testing mode featuring automated scoring, exam timer, and immediate answer keys.",

    // Card 1: Simulation
    card1Badge: "2026 MOCK TESTS • TIMER & SCORING",
    card1Title: "Model School 2026 Simulation Tests",
    card1Desc: "Full-length mock tests modeled after the 2026 entrance exam format (20 multiple-choice questions), offering graded difficulty levels and instant analytics.",
    card1Btn: "🚀 Start 2026 Simulation Test",

    // Card 2: Past Exams
    card2Badge: "OFFICIAL EXAM PAPERS (2020–2026)",
    card2Title: "Official Exam Papers by Year",
    card2Desc: "Solve authentic past papers from official testing cycles (2020–2026), review step-by-step mathematical answers, and assess your progress.",
    card2Btn: "🔍 All Exam Years (2020–2026)",
    quickYearsLabel: "Direct access by year:",

    // Section 2: PDF Downloads
    sec2Title: "Download Official Exam Papers in PDF (Free)",
    sec2Subtitle: "Download, print, and study complete official past papers and step-by-step solutions in PDF.",
    pdfDownloadBtn: "Download PDF",
    pdf1Title: "Model Schools 2020 - 2026",
    pdf1Desc: "Comprehensive collection containing all official examination questions and answer keys from recent years.",
    pdf2Title: "Mathematics 2016 - 2019",
    pdf2Desc: "Earlier examination sets and verified step-by-step worked mathematical solutions.",
    pdf3Title: "Complete Solutions & Explanations",
    pdf3Desc: "Detailed, pedagogically broken-down mathematical answers for all examination years.",

    // Section 3: Semantic Guide & FAQ
    guideTitle: "Preparation Guide for Model Schools 2026 Examinations",
    guideDesc: "Gaining admission to selective Model Gymnasiums requires deep understanding of foundational concepts and high aptitude in complex problem solving.",
    guideP1: "The examination syllabus is focused on key elementary curriculum topics, with heavy emphasis on",
    linkKlasmata: "fractions and decimals",
    guideP2: ", on",
    linkPososta: "percentages and proportions",
    guideP3: ", as well as",
    linkEksisoseis: "linear algebraic equations",
    guideP4: " and",
    linkGeometria: "geometry (areas and perimeters)",
    guideP5: ". Thorough review of the curriculum for",
    linkStDimotikou: "Grade 6 (ST' Dimotikou)",
    guideP6: " and",
    linkEDimotikou: "Grade 5 (E' Dimotikou)",
    guideP7: " is strongly recommended prior to timed simulations.",

    faqTitle: "Frequently Asked Questions (FAQ)",
    faqs: [
      {
        q: "What is the format and scoring of the 2026 Model School entrance exam?",
        a: "In the 2025 and 2026 examination cycles, the test comprises 20 multiple-choice questions for a maximum of 50 points: the first 10 questions carry 2 points each, and the remaining 10 questions carry 3 points each, with no negative marking."
      },
      {
        q: "How does LearnMaths.gr support students?",
        a: "By providing timed interactive simulation environments, step-by-step solution verification with SVG diagrams, automated analytics, and complete printable PDF archives."
      },
      {
        q: "Which math topics are covered in the exam?",
        a: "The syllabus covers Grade 5 and Grade 6 mathematics: fractions, decimals, percentages, direct and inverse proportions, linear equations, combinatorics, area and perimeter geometry, and chart interpretation."
      },
      {
        q: "When is the optimal time to start preparation?",
        a: "Familiarity with multiple-choice problem solving is most effective when initiated during the first term of Grade 6, following consolidation of core numeracy."
      }
    ]
  }
};

export default function ProtipaHubPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = I18N[locale];

  const baseUrl = locale === 'en' ? 'https://learnmaths.gr/en' : 'https://learnmaths.gr';
  const canonicalUrl = `${baseUrl}/protipa/protipa`;

  const pageSchema = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.backText, "item": baseUrl || 'https://learnmaths.gr/' },
        { "@type": "ListItem", "position": 2, "name": t.heroTitle, "item": canonicalUrl }
      ]
    },
    {
      "@type": "CollectionPage",
      "@id": `${canonicalUrl}#collection`,
      "url": canonicalUrl,
      "name": t.pageTitle,
      "description": t.pageDesc,
      "inLanguage": locale,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": locale === 'en' ? "Model Schools 2026 Exam Papers & Solutions" : "Θέματα Προτύπων 2026 με Λύσεις",
            "url": `${baseUrl}/protipa/themata-2026`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": locale === 'en' ? "Timed Mock Simulation Tests 2026" : "Τεστ Προσομοίωσης Προτύπων 2026",
            "url": `${baseUrl}/protipa/test-prosomoiosis`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": locale === 'en' ? "Official Exam Papers Archive (2020–2026)" : "Αρχείο Επίσημων Θεμάτων Εξετάσεων (2020–2026)",
            "url": `${baseUrl}/protipa/pragmatika-themata`
          }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      "mainEntity": t.faqs.map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    },
    {
      "@type": "LearningResource",
      "name": t.heroTitle,
      "description": t.pageDesc,
      "learningResourceType": "Practice Test",
      "educationalLevel": "ΣΤ' Δημοτικού",
      "inLanguage": locale,
      "isAccessibleForFree": true,
      "provider": {
        "@id": "https://learnmaths.gr/#organization"
      }
    }
  ];

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      schemaData={pageSchema}
      backUrl="/"
      backText={t.backText}
      showAds={false}
    >
      <div className={`${LAYOUT.CONTAINER} w-full max-w-[1920px] 2xl:max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 md:py-10 space-y-8 md:space-y-12`}>

        {/* HERO BANNER */}
        <header className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 md:p-10 text-slate-950 shadow-lg relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-slate-900 border border-white/40">
              <span>{t.heroBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium text-slate-900/90 leading-relaxed max-w-2xl">
              {t.heroDesc}
            </p>
            <div className="pt-1">
              <Link
                href="/protipa/themata-2026"
                locale={locale}
                className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-black px-5 py-3 rounded-2xl text-xs sm:text-sm transition shadow-md active:scale-95"
              >
                <span>{t.heroDirect2026Btn}</span>
                <span aria-hidden="true">➔</span>
              </Link>
            </div>
          </div>
        </header>

        {/* SECTION 1: ΔΙΑΔΡΑΣΤΙΚΗ ΕΞΑΣΚΗΣΗ & ΠΡΟΣΟΜΟΙΩΣΗ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span aria-hidden="true">💻</span> {t.sec1Title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t.sec1Subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

            {/* ΚΑΡΤΑ 1: ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ */}
            <article className="bg-white border-2 border-indigo-200 hover:border-indigo-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-black shadow-xs">
                  <span aria-hidden="true">⏱️</span>
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 block mb-1">
                    {t.card1Badge}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {t.card1Title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.card1Desc}
                </p>
              </div>

              <Link
                href="/protipa/test-prosomoiosis"
                locale={locale}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-4 rounded-2xl text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 active:scale-95 touch-manipulation cursor-pointer"
              >
                <span>{t.card1Btn}</span>
                <span aria-hidden="true">➔</span>
              </Link>
            </article>

            {/* ΚΑΡΤΑ 2: ΕΠΙΣΗΜΑ ΘΕΜΑΤΑ ΕΞΕΤΑΣΕΩΝ (2020-2026) */}
            <article className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-black shadow-xs">
                  <span aria-hidden="true">📝</span>
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 block mb-1">
                    {t.card2Badge}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {t.card2Title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.card2Desc}
                </p>

                {/* Άμεσα Links ανά Έτος για UX + Internal Linking */}
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">
                    {t.quickYearsLabel}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {EXAM_YEARS.map((item) => (
                      <Link
                        key={item.year}
                        href={`/protipa/${item.slug}`}
                        locale={locale}
                        className={`px-2.5 py-1 rounded-xl text-xs font-black transition ${
                          item.highlight
                            ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800'
                        }`}
                      >
                        {item.highlight ? `🔥 ${item.year}` : item.year}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/protipa/pragmatika-themata"
                locale={locale}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-4 rounded-2xl text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 active:scale-95 touch-manipulation cursor-pointer"
              >
                <span>{t.card2Btn}</span>
                <span aria-hidden="true">➔</span>
              </Link>
            </article>

          </div>
        </section>

        {/* SECTION 2: ΛΗΨΗ ΕΠΙΣΗΜΩΝ ΘΕΜΑΤΩΝ ΣΕ PDF */}
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span aria-hidden="true">📥</span> {t.sec2Title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t.sec2Subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">

            {/* PDF 1: 2020 - 2026 */}
            <article className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-3xl block" aria-hidden="true">📚</span>
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  {t.pdf1Title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.pdf1Desc}
                </p>
              </div>
              <a
                href="/protypa_2020_2026.pdf"
                download
                className="w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation"
              >
                <span aria-hidden="true">📥</span>
                <span>{t.pdfDownloadBtn}</span>
              </a>
            </article>

            {/* PDF 2: 2016 - 2019 */}
            <article className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-3xl block" aria-hidden="true">📐</span>
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  {t.pdf2Title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.pdf2Desc}
                </p>
              </div>
              <a
                href="/maths_2016_2019.pdf"
                download
                className="w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation"
              >
                <span aria-hidden="true">📥</span>
                <span>{t.pdfDownloadBtn}</span>
              </a>
            </article>

            {/* PDF 3: ΑΠΑΝΤΗΣΕΙΣ */}
            <article className="bg-emerald-50/50 rounded-3xl p-5 sm:p-6 shadow-sm border-2 border-emerald-300 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-3xl block" aria-hidden="true">✅</span>
                <h3 className="font-black text-emerald-950 text-base sm:text-lg">
                  {t.pdf3Title}
                </h3>
                <p className="text-xs text-emerald-800/80 leading-relaxed">
                  {t.pdf3Desc}
                </p>
              </div>
              <a
                href="/apantiseis_2016_2026.pdf"
                download
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation"
              >
                <span aria-hidden="true">📥</span>
                <span>{t.pdfDownloadBtn}</span>
              </a>
            </article>

          </div>
        </section>

        {/* SECTION 3: SEMANTIC GUIDE & INTERNAL LINKING (SEO BOOST) */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">
            {t.guideTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {t.guideDesc}{' '}
            {t.guideP1}{' '}
            <Link href="/st-dimotikou/23-klasma" locale={locale} className="font-bold text-blue-600 hover:underline">
              {t.linkKlasmata}
            </Link>
            {t.guideP2}{' '}
            <Link href="/st-dimotikou/50-pososta" locale={locale} className="font-bold text-blue-600 hover:underline">
              {t.linkPososta}
            </Link>
            {t.guideP3}{' '}
            <Link href="/st-dimotikou/33-agnostos-kai-prosthesi" locale={locale} className="font-bold text-blue-600 hover:underline">
              {t.linkEksisoseis}
            </Link>
            {t.guideP4}{' '}
            <Link href="/st-dimotikou/72-embadon" locale={locale} className="font-bold text-blue-600 hover:underline">
              {t.linkGeometria}
            </Link>
            {t.guideP5}{' '}
            <Link href="/st-dimotikou" locale={locale} className="font-bold text-indigo-600 hover:underline">
              {t.linkStDimotikou}
            </Link>
            {t.guideP6}{' '}
            <Link href="/e-dimotikou" locale={locale} className="font-bold text-indigo-600 hover:underline">
              {t.linkEDimotikou}
            </Link>
            {t.guideP7}
          </p>
        </section>

        {/* SECTION 4: FAQS ACCORDION (FAQPage Schema Visual Mirror) */}
        <section className="space-y-4 pt-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span aria-hidden="true">❓</span> {t.faqTitle}
          </h2>
          <div className="space-y-3">
            {t.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 transition shadow-xs open:border-blue-300"
              >
                <summary className="font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none flex justify-between items-center gap-2">
                  <span>{faq.q}</span>
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
}
